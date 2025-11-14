# PDF Tool Web Application Startup Script
Write-Host "Starting PDF Tool Web Application..." -ForegroundColor Green
Write-Host ""
Write-Host "The application will be available at:" -ForegroundColor Yellow
Write-Host "  http://localhost:5000" -ForegroundColor Cyan
Write-Host "  http://127.0.0.1:5000" -ForegroundColor Cyan
Write-Host ""
Write-Host "To access from other devices on your network:" -ForegroundColor Yellow
Write-Host "  http://[YOUR_IP_ADDRESS]:5000" -ForegroundColor Cyan
Write-Host ""
Write-Host "Press Ctrl+C to stop the server" -ForegroundColor Red
Write-Host ""

Set-Location -Path $PSScriptRoot
& "C:/Users/ngldu/AppData/Local/Programs/Python/Python314/python.exe" app.py