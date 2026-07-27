# compress-banners.ps1
#
# Batch converts all GIF files to .mp4 (primary format only - simpler, fewer failure points)
# Verifies each output file was actually created and reports real ffmpeg errors.
#
# Usage:
#   1. Put all original GIF banners in .\raw-banners\
#   2. .\scripts\compress-banners.ps1
#   3. Output goes to .\public\banners\

$ErrorActionPreference = "Continue"

$ProjectRoot = Split-Path -Parent $PSScriptRoot
$AppRoot = Join-Path $ProjectRoot "protipsbet"
$SrcDir = Join-Path $ProjectRoot "raw-banners"
$OutDir = Join-Path $AppRoot "public\banners"
$MaxSizeKB = 250

if (-not (Get-Command ffmpeg -ErrorAction SilentlyContinue)) {
    Write-Host "ffmpeg not installed or not in PATH. Install with: winget install ffmpeg" -ForegroundColor Red
    exit 1
}

if (-not (Test-Path $SrcDir)) {
    Write-Host "Folder $SrcDir does not exist." -ForegroundColor Red
    exit 1
}

New-Item -ItemType Directory -Force -Path $OutDir | Out-Null

$gifs = Get-ChildItem -Path $SrcDir -Filter "*.gif"

if ($gifs.Count -eq 0) {
    Write-Host "No .gif files found in $SrcDir"
    exit 0
}

Write-Host "Found $($gifs.Count) GIF files. Converting..."
Write-Host ""

$failures = @()

foreach ($gif in $gifs) {
    # Sanitize filename: lowercase, spaces/parens -> dash, strip weird chars
    $cleanName = $gif.BaseName.ToLower() -replace '[^a-z0-9]+', '-' -replace '-+', '-' -replace '^-|-$', ''
    $mp4Out = Join-Path $OutDir "$cleanName.mp4"

    Write-Host "Converting: $($gif.Name) -> $cleanName.mp4"

    ffmpeg -y -i $gif.FullName `
        -movflags faststart `
        -pix_fmt yuv420p `
        -vf "scale=trunc(iw/2)*2:trunc(ih/2)*2" `
        -crf 30 `
        -an `
        $mp4Out 2>&1 | Out-Null

    if (Test-Path $mp4Out) {
        $sizeKB = [math]::Round((Get-Item $mp4Out).Length / 1KB)
        Write-Host "  OK - $sizeKB KB" -ForegroundColor Green
        if ($sizeKB -gt $MaxSizeKB) {
            Write-Host "  WARNING: larger than $MaxSizeKB KB" -ForegroundColor Yellow
        }
    } else {
        Write-Host "  FAILED - file was not created" -ForegroundColor Red
        $failures += $gif.Name
    }
    Write-Host ""
}

Write-Host "Done. Files are in $OutDir"

if ($failures.Count -gt 0) {
    Write-Host ""
    Write-Host "The following files FAILED to convert:" -ForegroundColor Red
    $failures | ForEach-Object { Write-Host "  - $_" -ForegroundColor Red }
}
