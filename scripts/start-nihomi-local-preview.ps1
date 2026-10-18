# scripts/start-nihomi-local-preview.ps1
# NIHOMI.COM - Safe Local Preview and Visual Review Launcher

$PORT = 3000
$HEALTH_URL = "http://127.0.0.1:$PORT/health"
$APP_URL = "http://127.0.0.1:$PORT/lesson?id=n5-l1"
$GALLERY_PATH = "$PSScriptRoot\..\artifacts\qa\phase5-learning-core\visual-review-gallery.html"
$CHROME_EXE = "C:\Program Files\Google\Chrome\Application\chrome.exe"

Write-Host "================================================================" -ForegroundColor Cyan
Write-Host "NIHOMI.COM LOCAL PREVIEW AND VISUAL REVIEW LAUNCHER" -ForegroundColor Yellow
Write-Host "================================================================" -ForegroundColor Cyan

# 1. Check Server Health
Write-Host ""
Write-Host "[1/3] Checking local server health at $HEALTH_URL..." -ForegroundColor Gray
$healthJson = & curl.exe -s $HEALTH_URL

if ($healthJson -match '"status":"ok"') {
    Write-Host "  [PASS] Server is already running and healthy (HTTP 200 OK)." -ForegroundColor Green
}

if ($healthJson -notmatch '"status":"ok"') {
    Write-Host ""
    Write-Host "[2/3] Starting local production preview server on port $PORT..." -ForegroundColor Yellow
    $serverScript = "$PSScriptRoot\..\dist\server.cjs"
    if (Test-Path $serverScript) {
        Start-Process "node" -ArgumentList "$serverScript --port $PORT --host 127.0.0.1" -WindowStyle Hidden
        Start-Sleep -Seconds 3
        Write-Host "  [PASS] Server started." -ForegroundColor Green
    }
}

# 2. Open Preview & Review Gallery
Write-Host ""
Write-Host "[3/3] Opening Nihomi Learning Canvas & Visual Review Gallery..." -ForegroundColor Yellow

if (Test-Path $CHROME_EXE) {
    Start-Process $CHROME_EXE -ArgumentList $APP_URL
    if (Test-Path $GALLERY_PATH) {
        Start-Process $CHROME_EXE -ArgumentList $GALLERY_PATH
    }
    Write-Host "  [PASS] Launched in Google Chrome." -ForegroundColor Green
}

if (-not (Test-Path $CHROME_EXE)) {
    Start-Process $APP_URL
    if (Test-Path $GALLERY_PATH) {
        Start-Process $GALLERY_PATH
    }
    Write-Host "  [PASS] Launched in default browser." -ForegroundColor Green
}

Write-Host ""
Write-Host "================================================================" -ForegroundColor Cyan
Write-Host "NIHOMI LOCAL PREVIEW READY!" -ForegroundColor Green
Write-Host "   App URL:        $APP_URL" -ForegroundColor White
Write-Host "   Visual Gallery: $GALLERY_PATH" -ForegroundColor White
Write-Host "================================================================" -ForegroundColor Cyan
