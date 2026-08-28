# Screen Landmark Lens — visual thesis

## Direction: the midnight wayfinding garden

The product turns an otherwise flat, inaccessible screen into a field of audible landmarks. Its world is a surreal editorial night garden: windows become stacked paper horizons, labels become phosphorescent specimens, and a single brass sight-line moves through the scene. This is scenery with a job. The layers explain selection, recognition, and direction instead of decorating a generic software page.

The interface itself is quiet and tool-like. It borrows the illustration's cut-paper depth through offset borders, clipped corners, and thin surveying lines, while keeping the current state and primary key commands obvious within two seconds.

## Palette

- `ink / #101827`: midnight blue, the explicit dark canvas; familiar to low-light assistive work without becoming pure black.
- `paper / #FFF8E8`: warm paper for primary text and daylight surfaces.
- `moss / #A9D89E`: recognition/success; a botanical signal from the garden world.
- `signal / #FFD76A`: focus, keyboard cues, and the brass sight-line.
- `coral / #FF8E7A`: warnings and uncertainty, always paired with text or an icon.
- `fog / #AAB6C8`: secondary text on ink.
- `deep paper / #EDE3CE`: secondary light surfaces.
- `danger / #C43D4E`: errors on light surfaces; `#FF9AAA` on dark.

Dark is the authored default for the desktop tool, where screen glare matters. A full light treatment follows `prefers-color-scheme: light` and retains the paper metaphor. All body text and state combinations target WCAG AA (4.5:1); controls and focus outlines target at least 3:1.

## Type

- Display: Georgia, Cambria, `Times New Roman`, serif. The editorial serif gives the surreal field-guide headings their voice without a font download.
- Interface: Inter-like native stack (`ui-sans-serif`, system UI, Segoe UI, sans-serif). It stays familiar at small sizes and avoids third-party font requests.
- Scale: 14 / 16 / 20 / 25 / 39 / clamp(48–76) px. Body never drops below 16px in content areas. Numeric positions use tabular figures.

## Spacing and shape

The system uses a 4px base rhythm: 8, 12, 16, 24, 32, 48, 72. Content measure is capped near 70 characters. Corners use 10px for controls and 24–32px for landscape panels. Primary controls are at least 48px high; all targets are at least 44px. A clipped top-right corner signals active capture/analysis surfaces. One-pixel lines plus a four-pixel offset shadow provide depth without card soup.

## Interaction grammar

- The app reads as three sequential stations: choose a window, listen to landmarks, find a target.
- A luminous sight-line and compass words (top, center, bottom; left, center, right) make spatial output redundant and understandable without color.
- Keyboard chords appear as tactile keycaps next to every action. `Alt+Shift+L` reads labels, `Alt+Shift+F` focuses Find, and `Alt+Shift+B` describes likely buttons.
- Progress is announced in a polite live region. Errors include the next action. Uncertain OCR is labeled "may read" or "likely" rather than presented as fact.
- The landing page drops decorative peripheral specimens on phones and stacks copy above one OS-aware download action.

## Motion

UI transitions last 180–240ms and use only opacity and transform. The selected-window reticle resolves inward once; results rise from the scan surface. Nothing loops. With `prefers-reduced-motion: reduce`, transforms and smooth scrolling are removed and changes are instant or opacity-only.

## Asset plan and provenance

The landing hero is one original wide raster illustration, generated for this product, then manually reviewed and exported as responsive WebP/AVIF with an explicit size. Interface icons and the compass reticle are hand-authored SVG/CSS so they remain sharp and do not imply capabilities beyond the app.

Prompt sheet:

> Use case: stylized-concept. Asset type: desktop utility landing hero. Scene: a surreal nocturnal editorial landscape made from tactile cut paper, showing several floating computer-window planes receding like garden terraces. Subject: a slim warm-brass sight-line locating one small luminous label among abstract button-like landmarks; no readable interface, no people. Style: sophisticated 1960s science-editorial collage meets precise accessibility field guide, materially believable paper grain, restrained and calm rather than whimsical. Composition: wide 3:2 landscape; scene concentrated toward the center-right; generous calm midnight negative space at upper-left; strong depth and a legible focal point. Lighting: moonlit indigo with warm paper edges and a soft moss phosphorescence. Palette: midnight ink, warm parchment, moss green, signal yellow, sparing coral. Avoid: text, letters, numbers, logos, watermarks, brands, eyes, medical imagery, hands, people, glossy 3D SaaS render, generic gradients, cyberpunk neon, clutter, illegible pseudo-UI.

Generation: Azure AI Foundry factory image deployment through `/opt/fleet/lib/gen-image.sh`, 2026-08-28. Generated imagery is original for Screen Landmark Lens and is disclosed in the site footer. Source prompt metadata lives beside the retained source image in `assets/src/`.

## Why this fits

Wayfinding is the central product behavior. The garden makes visible labels feel like landmarks rather than DOM elements, while surveying lines express direction and confidence. The combination is memorable, humane, and specific to a tool that finds what other software fails to expose.
