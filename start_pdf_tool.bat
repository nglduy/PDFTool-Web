@echo off
echo ================================================
echo           PDF Tool Web Application
echo ================================================
echo.

REM Get the directory where this script is located
set SCRIPT_DIR=%~dp0
cd /d "%SCRIPT_DIR%"

REM Check if requirements are installed
if not exist "setup_complete.flag" (
    echo First time setup - installing requirements...
    echo.
    
    REM Try to install requirements with the found Python
    call :find_python
    if "%PYTHON_EXE%"=="" (
        echo ERROR: Python not found!
        echo Please install Python from https://python.org
        echo Make sure to check 'Add Python to PATH' during installation
        pause
        exit /b 1
    )
    
    echo Installing Python packages...
    "%PYTHON_EXE%" -m pip install --upgrade pip
    "%PYTHON_EXE%" -m pip install flask PyPDF2 Pillow
    
    if %errorlevel% equ 0 (
        echo Setup complete! > setup_complete.flag
        echo.
        echo Setup completed successfully!
        echo.
    ) else (
        echo ERROR: Failed to install requirements!
        pause
        exit /b 1
    )
else (
    echo Setup already complete, starting server...
    echo.
)

REM Find Python and run the application
call :find_python
if "%PYTHON_EXE%"=="" (
    echo ERROR: Python not found!
    pause
    exit /b 1
)

echo Starting PDF Tool Web Application...
echo.
echo The application will be available at:
echo   http://localhost:5000
echo   http://127.0.0.1:5000
echo.
echo To access from other devices on your network:
for /f "tokens=2 delims=:" %%a in ('ipconfig ^| findstr "IPv4"') do (
    for /f "tokens=1" %%b in ("%%a") do echo   http://%%b:5000
)
echo.
echo Press Ctrl+C to stop the server
echo ================================================
echo.

"%PYTHON_EXE%" app.py
echo.
echo Server stopped. Press any key to exit...
pause >nul
exit /b 0

:find_python
set PYTHON_EXE=

REM Try python command first (most common)
python --version >nul 2>&1
if %errorlevel% equ 0 (
    set PYTHON_EXE=python
    goto :eof
)

REM Try py launcher (Windows)
py --version >nul 2>&1
if %errorlevel% equ 0 (
    set PYTHON_EXE=py
    goto :eof
)

REM Try the specific Python path we know works on this system
if exist "C:\Users\ngldu\AppData\Local\Programs\Python\Python314\python.exe" (
    set PYTHON_EXE="C:\Users\ngldu\AppData\Local\Programs\Python\Python314\python.exe"
    goto :eof
)

REM Try common installation paths
for %%p in (
    "C:\Python3\python.exe"
    "C:\Python39\python.exe"
    "C:\Python310\python.exe"
    "C:\Python311\python.exe"
    "C:\Python312\python.exe"
    "C:\Python313\python.exe"
    "C:\Python314\python.exe"
    "%LOCALAPPDATA%\Programs\Python\Python39\python.exe"
    "%LOCALAPPDATA%\Programs\Python\Python310\python.exe"
    "%LOCALAPPDATA%\Programs\Python\Python311\python.exe"
    "%LOCALAPPDATA%\Programs\Python\Python312\python.exe"
    "%LOCALAPPDATA%\Programs\Python\Python313\python.exe"
    "%LOCALAPPDATA%\Programs\Python\Python314\python.exe"
) do (
    if exist %%p (
        set PYTHON_EXE=%%p
        goto :eof
    )
)
goto :eof