#!/bin/sh
set -eu

MANIFEST_URL="https://github.com/B-Divyesh/sf-screen-landmark-lens/releases/latest/download/latest.json"
TMP_DIR="$(mktemp -d)"
trap 'rm -rf "$TMP_DIR"' EXIT INT TERM

case "$(uname -s)-$(uname -m)" in
  Darwin-arm64) KEY="macos-arm64" ;;
  Darwin-x86_64) KEY="macos-x64" ;;
  Linux-*) KEY="linux" ;;
  *) echo "Unsupported system. Use the release page instead: https://github.com/B-Divyesh/sf-screen-landmark-lens/releases/latest" >&2; exit 1 ;;
esac

curl -fsSL "$MANIFEST_URL" -o "$TMP_DIR/latest.json"
read_manifest() { sed -n "s/.*\"$KEY\"[^{]*{[^}]*\"$1\"[ ]*:[ ]*\"\([^\"]*\)\".*/\1/p" "$TMP_DIR/latest.json"; }
URL="$(read_manifest url)"
EXPECTED="$(read_manifest sha256)"
[ -n "$URL" ] && [ -n "$EXPECTED" ] || { echo "Release manifest has no $KEY download." >&2; exit 1; }
ASSET="$TMP_DIR/$(basename "$URL")"
curl -fL "$URL" -o "$ASSET"
if command -v sha256sum >/dev/null 2>&1; then ACTUAL="$(sha256sum "$ASSET" | cut -d' ' -f1)"; else ACTUAL="$(shasum -a 256 "$ASSET" | cut -d' ' -f1)"; fi
[ "$ACTUAL" = "$EXPECTED" ] || { echo "Checksum mismatch. Nothing was installed." >&2; exit 1; }

if [ "$(uname -s)" = "Darwin" ]; then
  VOLUME="$(hdiutil attach "$ASSET" -nobrowse | tail -1 | sed 's|.*\(/Volumes/.*\)|\1|')"
  APP="$(find "$VOLUME" -maxdepth 1 -name '*.app' -print -quit)"
  [ -n "$APP" ] || { echo "The disk image did not contain an app." >&2; exit 1; }
  ditto "$APP" "/Applications/Screen Landmark Lens.app"
  hdiutil detach "$VOLUME" >/dev/null
  echo "Installed Screen Landmark Lens in /Applications. Because this build is unsigned, right-click it and choose Open the first time."
else
  INSTALL_DIR="${XDG_BIN_HOME:-$HOME/.local/bin}"
  mkdir -p "$INSTALL_DIR"
  cp "$ASSET" "$INSTALL_DIR/screen-landmark-lens.AppImage"
  chmod +x "$INSTALL_DIR/screen-landmark-lens.AppImage"
  echo "Installed verified AppImage at $INSTALL_DIR/screen-landmark-lens.AppImage"
fi
