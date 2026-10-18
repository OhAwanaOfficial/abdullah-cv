# Rebuilds assets/docs/resume.pdf and assets/docs/cv.pdf from resume.html and cv.html.
# Run it after editing assets/js/content.js (needs an internet connection for the fonts):
#   powershell -ExecutionPolicy Bypass -File tools\build-pdfs.ps1

$ErrorActionPreference = "Stop"
$root = Split-Path -Parent $PSScriptRoot

$candidates = @(
  "$env:ProgramFiles\Google\Chrome\Application\chrome.exe",
  "${env:ProgramFiles(x86)}\Google\Chrome\Application\chrome.exe",
  "$env:LOCALAPPDATA\Google\Chrome\Application\chrome.exe",
  "${env:ProgramFiles(x86)}\Microsoft\Edge\Application\msedge.exe",
  "$env:ProgramFiles\Microsoft\Edge\Application\msedge.exe"
)
$browser = $candidates | Where-Object { Test-Path $_ } | Select-Object -First 1
if (-not $browser) { throw "Couldn't find Chrome or Edge. Open resume.html and use Print > Save as PDF instead." }

$outDir = Join-Path $root "assets\docs"
New-Item -ItemType Directory -Force -Path $outDir | Out-Null
$profileDir = Join-Path $env:TEMP "portfolio-pdf-profile"

foreach ($doc in "resume", "cv") {
  $src = ([System.Uri](Join-Path $root "$doc.html")).AbsoluteUri
  $pdf = Join-Path $outDir "$doc.pdf"
  $chromeArgs = @(
    "--headless=new", "--disable-gpu", "--no-pdf-header-footer",
    "--virtual-time-budget=10000", "--user-data-dir=`"$profileDir`"",
    "--print-to-pdf=`"$pdf`"", $src
  )
  Start-Process -FilePath $browser -ArgumentList $chromeArgs -Wait -NoNewWindow
  if ((Test-Path $pdf) -and (Get-Item $pdf).Length -gt 0) { Write-Host "Saved $pdf" }
  else { Write-Warning "Couldn't write $pdf (is the disk full?)" }
}

Remove-Item $profileDir -Recurse -Force -ErrorAction SilentlyContinue
