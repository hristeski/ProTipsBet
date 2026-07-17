# compress-banners.ps1
#
# Батч конвертира сите .gif фајлови во една папка во .mp4 + .webp
#
# Употреба:
#   1. Стави ги сите оригинални GIF банери во .\raw-banners\
#   2. Отвори PowerShell во root на проектот
#   3. .\scripts\compress-banners.ps1
#   4. Резултатите излегуваат во .\public\banners\
#
# Бара: ffmpeg (winget install ffmpeg)

$ErrorActionPreference = "Stop"

$SrcDir = ".\raw-banners"
$OutDir = ".\public\banners"
$MaxSizeKB = 250

if (-not (Get-Command ffmpeg -ErrorAction SilentlyContinue)) {
    Write-Host "ffmpeg не е инсталиран или не е во PATH. Инсталирај со: winget install ffmpeg" -ForegroundColor Red
    exit 1
}

if (-not (Test-Path $SrcDir)) {
    Write-Host "Папката $SrcDir не постои. Направи ја: mkdir raw-banners" -ForegroundColor Red
    exit 1
}

New-Item -ItemType Directory -Force -Path $OutDir | Out-Null

$gifs = Get-ChildItem -Path $SrcDir -Filter "*.gif"

if ($gifs.Count -eq 0) {
    Write-Host "Нема .gif фајлови во $SrcDir"
    exit 0
}

Write-Host "Најдени $($gifs.Count) GIF фајлови. Конвертирам...`n"

foreach ($gif in $gifs) {
    $name = [System.IO.Path]::GetFileNameWithoutExtension($gif.Name)
    $mp4Out = Join-Path $OutDir "$name.mp4"
    $webpOut = Join-Path $OutDir "$name.webp"

    $origSizeKB = [math]::Round($gif.Length / 1KB)

    # MP4 - главен формат
    ffmpeg -y -i $gif.FullName `
        -movflags faststart `
        -pix_fmt yuv420p `
        -vf "scale=trunc(iw/2)*2:trunc(ih/2)*2" `
        -crf 30 `
        -an `
        $mp4Out -loglevel error

    # WebP fallback (animated)
    ffmpeg -y -i $gif.FullName `
        -vcodec libwebp `
        -loop 0 `
        -q:v 60 `
        -preset picture `
        $webpOut -loglevel error

    $mp4SizeKB = [math]::Round((Get-Item $mp4Out).Length / 1KB)
    $webpSizeKB = [math]::Round((Get-Item $webpOut).Length / 1KB)

    Write-Host "OK $($gif.Name)" -ForegroundColor Green
    Write-Host "   original:  $origSizeKB KB"
    Write-Host "   mp4:       $mp4SizeKB KB"
    Write-Host "   webp:      $webpSizeKB KB"

    if ($mp4SizeKB -gt $MaxSizeKB) {
        Write-Host "   ВНИМАНИЕ: MP4 е поголем од $MaxSizeKB KB - разгледај помала резолуција или повисок -crf" -ForegroundColor Yellow
    }
    Write-Host ""
}

Write-Host "Готово. Фајловите се во $OutDir"
Write-Host "Земи ги ширина/висина на секој банер и внеси ги во src/lib/banners.ts"