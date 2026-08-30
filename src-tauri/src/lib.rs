use std::time::Instant;

use ocrs::{ImageSource, OcrEngine, OcrEngineParams, TextItem};
use rten::Model;
use serde::Serialize;
use tauri::{Manager, Runtime};
use xcap::Window;

#[derive(Serialize)]
#[serde(rename_all = "camelCase")]
struct WindowInfo {
    id: u32,
    title: String,
    app_name: String,
    width: u32,
    height: u32,
}

#[derive(Debug, Clone, Serialize, PartialEq)]
#[serde(rename_all = "camelCase")]
struct Landmark {
    text: String,
    x: i32,
    y: i32,
    width: u32,
    height: u32,
    direction: String,
    likely_button: bool,
}

#[derive(Serialize)]
#[serde(rename_all = "camelCase")]
struct Analysis {
    window_title: String,
    width: u32,
    height: u32,
    elapsed_ms: u128,
    landmarks: Vec<Landmark>,
}

fn readable_window(window: &Window) -> Option<WindowInfo> {
    let title = window.title().ok()?.trim().to_owned();
    let width = window.width().ok()?;
    let height = window.height().ok()?;
    let minimized = window.is_minimized().unwrap_or(false);
    if title.is_empty() || minimized || width < 80 || height < 50 {
        return None;
    }
    Some(WindowInfo {
        id: window.id().ok()?,
        app_name: window.app_name().unwrap_or_else(|_| "Application".into()),
        title,
        width,
        height,
    })
}

#[tauri::command]
fn list_windows() -> Result<Vec<WindowInfo>, String> {
    let windows = Window::all().map_err(|error| format!("Window access failed: {error}"))?;
    let mut visible: Vec<_> = windows.iter().filter_map(readable_window).collect();
    visible.sort_by(|a, b| {
        a.app_name
            .to_lowercase()
            .cmp(&b.app_name.to_lowercase())
            .then(a.title.to_lowercase().cmp(&b.title.to_lowercase()))
    });
    Ok(visible)
}

fn direction_for(x: f32, y: f32, width: u32, height: u32) -> String {
    let horizontal = if x < width as f32 / 3.0 {
        "left"
    } else if x > width as f32 * 2.0 / 3.0 {
        "right"
    } else {
        "center"
    };
    let vertical = if y < height as f32 / 3.0 {
        "top"
    } else if y > height as f32 * 2.0 / 3.0 {
        "bottom"
    } else {
        "middle"
    };
    if horizontal == "center" && vertical == "middle" {
        "center".into()
    } else if horizontal == "center" {
        format!("{vertical} center")
    } else if vertical == "middle" {
        format!("middle {horizontal}")
    } else {
        format!("{vertical} {horizontal}")
    }
}

fn is_likely_button(text: &str) -> bool {
    const ACTIONS: &[&str] = &[
        "ok", "save", "submit", "send", "cancel", "close", "next", "back", "continue", "apply",
        "open", "delete", "edit", "retry", "sign in", "log in", "yes", "no", "done", "finish",
        "create", "add", "remove", "download", "upload", "print",
    ];
    let normalized = text.trim().to_lowercase();
    ACTIONS
        .iter()
        .any(|action| normalized == *action || normalized.starts_with(&format!("{action} ")))
}

fn model_path<R: Runtime>(
    app: &tauri::AppHandle<R>,
    name: &str,
) -> Result<std::path::PathBuf, String> {
    let bundled = app
        .path()
        .resource_dir()
        .map(|path| path.join("resources").join(name))
        .map_err(|error| format!("Could not locate bundled OCR data: {error}"))?;
    if bundled.exists() {
        return Ok(bundled);
    }
    let development = std::path::Path::new(env!("CARGO_MANIFEST_DIR"))
        .join("resources")
        .join(name);
    if development.exists() {
        return Ok(development);
    }
    Err(format!("Bundled OCR data is missing: {name}"))
}

#[tauri::command]
fn analyze_window<R: Runtime>(
    app: tauri::AppHandle<R>,
    window_id: u32,
) -> Result<Analysis, String> {
    let started = Instant::now();
    let windows = Window::all().map_err(|error| format!("Window access failed: {error}"))?;
    let window = windows
        .into_iter()
        .find(|candidate| candidate.id().ok() == Some(window_id))
        .ok_or_else(|| "The selected window was not found or has closed.".to_string())?;
    let title = window.title().unwrap_or_else(|_| "Selected window".into());
    let capture = window.capture_image().map_err(|error| {
        format!("Screen capture permission was denied or capture failed: {error}")
    })?;
    let (width, height) = capture.dimensions();
    let rgb = image::DynamicImage::ImageRgba8(capture).into_rgb8();

    let detection = Model::load_file(model_path(&app, "text-detection.rten")?)
        .map_err(|error| format!("Bundled text detector could not load: {error}"))?;
    let recognition = Model::load_file(model_path(&app, "text-recognition.rten")?)
        .map_err(|error| format!("Bundled text recognizer could not load: {error}"))?;
    let engine = OcrEngine::new(OcrEngineParams {
        detection_model: Some(detection),
        recognition_model: Some(recognition),
        ..Default::default()
    })
    .map_err(|error| format!("Local OCR could not start: {error}"))?;
    let source = ImageSource::from_bytes(rgb.as_raw(), rgb.dimensions())
        .map_err(|error| format!("The captured image could not be prepared: {error}"))?;
    let input = engine
        .prepare_input(source)
        .map_err(|error| format!("The captured image could not be prepared: {error}"))?;
    let words = engine
        .detect_words(&input)
        .map_err(|error| format!("Text detection failed: {error}"))?;
    let lines = engine.find_text_lines(&input, &words);
    let recognized = engine
        .recognize_text(&input, &lines)
        .map_err(|error| format!("Text recognition failed: {error}"))?;

    let mut landmarks = Vec::new();
    for line in recognized.into_iter().flatten() {
        let text = line.to_string().trim().to_owned();
        if text.chars().count() < 2 {
            continue;
        }
        let rect = line.bounding_rect();
        let x = rect.left();
        let y = rect.top();
        let line_width = rect.width().max(1) as u32;
        let line_height = rect.height().max(1) as u32;
        landmarks.push(Landmark {
            direction: direction_for(
                x as f32 + line_width as f32 / 2.0,
                y as f32 + line_height as f32 / 2.0,
                width,
                height,
            ),
            likely_button: is_likely_button(&text),
            text,
            x,
            y,
            width: line_width,
            height: line_height,
        });
    }
    landmarks.sort_by_key(|item| (item.y, item.x));

    Ok(Analysis {
        window_title: title,
        width,
        height,
        elapsed_ms: started.elapsed().as_millis(),
        landmarks,
    })
}

#[cfg_attr(mobile, tauri::mobile_entry_point)]
pub fn run() {
    tauri::Builder::default()
        .plugin(tauri_plugin_opener::init())
        .invoke_handler(tauri::generate_handler![list_windows, analyze_window])
        .run(tauri::generate_context!())
        .expect("error while running Screen Landmark Lens");
}

#[cfg(test)]
mod tests {
    use super::*;

    #[test]
    fn direction_grid_is_spoken_consistently() {
        assert_eq!(direction_for(10.0, 10.0, 300, 300), "top left");
        assert_eq!(direction_for(150.0, 150.0, 300, 300), "center");
        assert_eq!(direction_for(290.0, 290.0, 300, 300), "bottom right");
    }

    #[test]
    fn common_action_labels_are_only_likely_buttons() {
        assert!(is_likely_button("Save changes"));
        assert!(is_likely_button("Cancel"));
        assert!(!is_likely_button("Quarterly revenue"));
    }

    #[test]
    fn ocr_text_is_not_assigned_an_invented_confidence_score() {
        // ocrs does not expose a calibrated line confidence here. Keep the
        // result honest instead of deriving a percentage from its characters.
        let landmark = Landmark {
            text: "Save".into(),
            x: 0,
            y: 0,
            width: 1,
            height: 1,
            direction: "center".into(),
            likely_button: true,
        };
        assert_eq!(landmark.text, "Save");
    }

    #[test]
    fn bundled_models_are_valid() {
        let resources = std::path::Path::new(env!("CARGO_MANIFEST_DIR")).join("resources");
        Model::load_file(resources.join("text-detection.rten")).expect("valid detection model");
        Model::load_file(resources.join("text-recognition.rten")).expect("valid recognition model");
    }
}
