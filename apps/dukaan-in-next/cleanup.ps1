# DukaanMitra Cleanup Script
# This script moves all files from the nested 'Dukaanmitra.in' folder to the root.

Write-Host "🚀 Starting DukaanMitra consolidation..." -ForegroundColor Green

$nestedFolder = "Dukaanmitra.in"
$root = "."

if (Test-Path $nestedFolder) {
    # 1. Backup legacy landing page if it exists in root
    if (Test-Path "src/app/page.tsx") {
        Write-Host "📦 Backing up legacy root landing page..."
        Copy-Item "src/app/page.tsx" "$nestedFolder/legacy-landing-backup.tsx" -Force
    }

    # 2. Remove legacy root files that are redundant
    Write-Host "🧹 Removing legacy root files..."
    Remove-Item "index.html", "style.css", "script.js", "next.config.js", "next.config.ts" -Force -ErrorAction SilentlyContinue

    # 3. Move everything from nested to root
    Write-Host "🚚 Moving modern project files to root..."
    Get-ChildItem -Path $nestedFolder -Force | ForEach-Object {
        Move-Item -Path $_.FullName -Destination $root -Force -ErrorAction SilentlyContinue
    }

    # 4. Remove empty nested folder
    Write-Host "🗑️ Removing nested folder..."
    Remove-Item $nestedFolder -Force -Recurse

    Write-Host "✅ Consolidation complete! Your project is now clean." -ForegroundColor Green
    Write-Host "👉 Run 'npm install' to ensure all dependencies are ready."
} else {
    Write-Host "❌ Nested folder '$nestedFolder' not found. Is it already cleaned up?" -ForegroundColor Red
}
