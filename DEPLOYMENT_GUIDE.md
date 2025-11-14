# PDF Tool - Cross Platform Setup Guide

This guide explains how to run the PDF Tool on different devices with just a double-click.

## 📁 What's Included

- `start_pdf_tool.bat` - Windows double-click launcher
- `start_pdf_tool.sh` - Linux double-click launcher  
- `start_pdf_tool_mac.sh` - macOS double-click launcher
- `start_pdf_tool.ps1` - Windows PowerShell launcher

## 🚀 Quick Start for Different Platforms

### Windows 💻
1. **Copy the `PDFTool-Web` folder** to any Windows computer
2. **Double-click** `start_pdf_tool.bat`
3. **First run**: Will automatically install Python packages
4. **Done!** Browser opens at http://localhost:5000

### Linux 🐧
1. **Copy the `PDFTool-Web` folder** to any Linux computer
2. **Make executable**: Right-click `start_pdf_tool.sh` → Properties → Permissions → Check "Execute"
   - Or in terminal: `chmod +x start_pdf_tool.sh`
3. **Double-click** `start_pdf_tool.sh`
4. **First run**: Will automatically install Python packages
5. **Done!** Open browser to http://localhost:5000

### macOS 🍎
1. **Copy the `PDFTool-Web` folder** to any Mac computer
2. **Make executable**: Right-click `start_pdf_tool_mac.sh` → Open With → Terminal
   - Or in terminal: `chmod +x start_pdf_tool_mac.sh`
3. **Double-click** `start_pdf_tool_mac.sh`
4. **First run**: Will automatically install Python packages
5. **Done!** Open browser to http://localhost:5000

## 📋 Prerequisites

Each computer needs **Python 3.7 or higher** installed:

### Windows
- Download from https://python.org
- ✅ **Important**: Check "Add Python to PATH" during installation

### Linux (Ubuntu/Debian)
```bash
sudo apt update
sudo apt install python3 python3-pip
```

### Linux (CentOS/RHEL)
```bash
sudo yum install python3 python3-pip
```

### macOS
```bash
# Option 1: Official installer
# Download from https://python.org

# Option 2: Homebrew
brew install python3

# Option 3: Xcode tools
xcode-select --install
```

## 🌐 Network Access

Once running, the PDF tool is accessible from:

- **Same computer**: http://localhost:5000
- **Other devices on WiFi**: http://[IP_ADDRESS]:5000
  - The startup script shows your IP address
  - Example: http://192.168.1.100:5000

## 🔧 Automatic Setup Process

The first time you run on any computer:

1. ✅ **Detects Python** installation automatically
2. ✅ **Installs required packages**: Flask, PyPDF2, Pillow
3. ✅ **Creates setup flag** to skip this on future runs
4. ✅ **Shows network IP** for device access
5. ✅ **Starts the server** ready to use

## 📱 Using from Mobile Devices

1. Start PDF Tool on computer
2. Note the IP address shown (e.g., http://192.168.1.100:5000)
3. Open browser on phone/tablet
4. Visit the IP address
5. Upload and process PDFs from your mobile device!

## 🛠️ Troubleshooting

### "Python not found" Error
- **Windows**: Reinstall Python with "Add to PATH" checked
- **Linux**: Install with `sudo apt install python3 python3-pip`
- **macOS**: Install Python from python.org or use Homebrew

### "Permission denied" Error (Linux/macOS)
```bash
chmod +x start_pdf_tool.sh
# or
chmod +x start_pdf_tool_mac.sh
```

### "Package installation failed"
Try manual installation:
```bash
python3 -m pip install --user flask PyPDF2 Pillow
```

### Can't access from other devices
- Check firewall settings
- Make sure devices are on same WiFi network
- Try the IP address shown in the startup message

## 📦 Distribution Tips

### For Sharing with Others:
1. **Zip the entire folder** `PDFTool-Web`
2. **Include this guide** (DEPLOYMENT_GUIDE.md)
3. **Tell them**: "Unzip and double-click the start file for your OS"

### For USB/Portable Use:
- Works directly from USB drives
- No installation needed on target computers
- Just need Python pre-installed on the computer

### For Corporate/School Distribution:
- IT can pre-install Python on all computers
- Users just copy folder and double-click to run
- Can be shared via network drives

## 🎯 Features Available

✅ **PDF Merge**: Combine multiple PDFs into one
✅ **PDF Split**: Extract specific pages from PDFs  
✅ **Image to PDF**: Convert JPG, PNG, etc. to PDF
✅ **Drag & Drop**: Easy file upload interface
✅ **Mobile Friendly**: Works on phones and tablets
✅ **No Internet Required**: Runs completely offline

---

**That's it!** Your PDF tool is now ready to run on any device with just a double-click! 🚀