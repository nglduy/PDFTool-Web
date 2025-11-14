# Running PDF Tool Offline

This guide shows you how to run your PDF Tool web application offline on your computer or local network.

## Quick Start Methods

### Method 1: Using Startup Scripts (Easiest)

**Windows Batch File:**
```bash
# Double-click this file to start
start_pdf_tool.bat
```

**PowerShell Script:**
```powershell
# Right-click and "Run with PowerShell"
start_pdf_tool.ps1
```

### Method 2: Command Line

**Option A: Using System Python**
```bash
cd "C:\SUNCREST\Practice\PDFTool-Web"
python app.py
```

**Option B: Using Full Path**
```bash
cd "C:\SUNCREST\Practice\PDFTool-Web"
"C:/Users/ngldu/AppData/Local/Programs/Python/Python314/python.exe" app.py
```

**Option C: Using Virtual Environment (if created)**
```bash
cd "C:\SUNCREST\Practice\PDFTool-Web"
.venv\Scripts\activate
python app.py
```

## Access URLs

Once running, access the application at:

- **Local Computer**: http://localhost:5000 or http://127.0.0.1:5000
- **Other Devices on Network**: http://[YOUR_IP_ADDRESS]:5000

### Finding Your IP Address

**Windows Command:**
```cmd
ipconfig | findstr IPv4
```

**PowerShell Command:**
```powershell
(Get-NetIPAddress -AddressFamily IPv4 -InterfaceAlias "Wi-Fi" | Where-Object {$_.IPAddress -ne "127.0.0.1"}).IPAddress
```

## Features Available Offline

✅ **PDF Merge** - Combine multiple PDFs
✅ **PDF Split** - Extract specific pages 
✅ **Image to PDF** - Convert images to PDF
✅ **File Upload/Download** - Full functionality
✅ **Drag & Drop** - Interactive file handling

## System Requirements

- **Python 3.14** (already installed)
- **Required Packages** (already installed):
  - Flask 3.1.2
  - PyPDF2 3.0.1  
  - Pillow 12.0.0
  - Werkzeug 3.1.3

## Network Access

The app is configured with `host='0.0.0.0'` which means:
- ✅ Accessible from your computer (localhost)
- ✅ Accessible from other devices on your local network
- ❌ NOT accessible from the internet (secure)

## Troubleshooting

**Port Already in Use:**
If port 5000 is busy, the app will show an error. To use a different port:

1. Edit `app.py` and change: `app.run(debug=True, host='0.0.0.0', port=5001)`
2. Access at: http://localhost:5001

**Python Not Found:**
If you get "python not found" error:
- Use the full path: `"C:/Users/ngldu/AppData/Local/Programs/Python/Python314/python.exe"`
- Or add Python to your system PATH

**Package Errors:**
If you get import errors:
```bash
pip install -r requirements.txt
```

## Performance Tips

- **File Size**: Keep PDF files under 50MB for best performance
- **Multiple Users**: The app supports multiple users simultaneously
- **Memory**: Close the app when not in use to free memory

## Security Notes

- ✅ **Local Network Only** - Not accessible from internet
- ✅ **Temporary Files** - Automatically cleaned up
- ✅ **No Data Storage** - Files are processed and discarded
- ✅ **Safe Uploads** - File validation and size limits

## Stopping the Application

- **Command Line**: Press `Ctrl + C`
- **Batch File**: Close the command window
- **PowerShell**: Press `Ctrl + C` or close PowerShell window

Enjoy using your offline PDF Tool! 🎉