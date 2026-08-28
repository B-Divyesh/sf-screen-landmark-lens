$ErrorActionPreference = "Stop"
$manifestUrl = "https://github.com/B-Divyesh/sf-screen-landmark-lens/releases/latest/download/latest.json"
$tempDir = Join-Path ([System.IO.Path]::GetTempPath()) ("screen-landmark-lens-" + [guid]::NewGuid())
New-Item -ItemType Directory -Path $tempDir | Out-Null
try {
  $manifest = Invoke-RestMethod -Uri $manifestUrl
  $asset = $manifest.platforms.windows
  if (-not $asset.url -or -not $asset.sha256) { throw "Release manifest has no Windows installer." }
  $installer = Join-Path $tempDir "ScreenLandmarkLens.msi"
  Invoke-WebRequest -Uri $asset.url -OutFile $installer
  $actual = (Get-FileHash -Path $installer -Algorithm SHA256).Hash.ToLowerInvariant()
  if ($actual -ne $asset.sha256.ToLowerInvariant()) { throw "Checksum mismatch. Nothing was installed." }
  Start-Process msiexec.exe -ArgumentList "/i `"$installer`"" -Wait
  Write-Output "Verified the SHA256 checksum and opened the Screen Landmark Lens installer."
  Write-Output "This build is unsigned; Windows may display a SmartScreen notice."
} finally {
  Remove-Item -Recurse -Force $tempDir -ErrorAction SilentlyContinue
}
