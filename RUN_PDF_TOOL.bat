@echo off
echo ================================================
echo           PDF Tool Web Application
echo ================================================
echo.
echo Starting PDF Tool - Portable Version...
echo.

REM Get the directory where this script is located
cd /d "%~dp0"

REM Simple setup check and installation
if not exist "setup_complete.flag" (
    echo First time setup - installing packages...
    echo.
    python -m pip install --user flask PyPDF2 Pillow
    if %errorlevel% equ 0 (
        echo Setup complete! > setup_complete.flag
        echo Installation successful!
        echo.
    ) else (
        echo.
        echo WARNING: Could not install packages automatically.
        echo Please ensure Python is installed and try running:
        echo   python -m pip install flask PyPDF2 Pillow
        echo.
        echo Continuing anyway - packages might already be installed...
        echo.
    )
)

echo The application will be available at:
echo   http://localhost:5000
echo   http://127.0.0.1:5000
echo.

REM Try to get and display local IP
for /f "tokens=2 delims=:" %%a in ('ipconfig ^| findstr "IPv4"') do (
    for /f "tokens=1" %%b in ("%%a") do (
        echo To access from other devices: http://%%b:5000
    )
)

echo.
echo Press Ctrl+C to stop the server
echo ================================================
echo.

REM Try to run with simple python command first
python app.py 2>nul
if %errorlevel% neq 0 (
    REM Try py launcher
    py app.py 2>nul
    if %errorlevel% neq 0 (
        echo ERROR: Cannot start the application.
        echo Please make sure Python is installed and in your PATH.
        echo.
        echo You can download Python from: https://python.org
        echo Make sure to check "Add Python to PATH" during installation.
        echo.
        pause
    )
)

echo.
echo Server stopped. Press any key to exit...
pause >nul