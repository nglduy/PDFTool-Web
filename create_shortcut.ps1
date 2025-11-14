# Create Desktop Shortcut for PDF Tool
# Run this script to create a desktop shortcut

$WshShell = New-Object -comObject WScript.Shell
$Shortcut = $WshShell.CreateShortcut("$env:USERPROFILE\Desktop\PDF Tool.lnk")
$Shortcut.TargetPath = "$PSScriptRoot\start_pdf_tool.bat"
$Shortcut.WorkingDirectory = $PSScriptRoot
$Shortcut.IconLocation = "shell32.dll,41"  # PDF-like icon
$Shortcut.Description = "PDF Tool - Merge, Split, Convert PDFs"
$Shortcut.Save()

Write-Host "Desktop shortcut created successfully!" -ForegroundColor Green
Write-Host "Look for 'PDF Tool' icon on your desktop." -ForegroundColor Yellow