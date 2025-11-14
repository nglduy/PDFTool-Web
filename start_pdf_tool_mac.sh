#!/bin/bash

echo "================================================"
echo "           PDF Tool Web Application"
echo "================================================"
echo

# Get the directory where this script is located
SCRIPT_DIR="$(cd "$(dirname "$0")" && pwd)"
cd "$SCRIPT_DIR"

# Function to find Python
find_python() {
    # Try common Python commands on macOS
    for cmd in python3 python python3.9 python3.10 python3.11 python3.12 python3.13 python3.14; do
        if command -v "$cmd" >/dev/null 2>&1; then
            echo "$cmd"
            return 0
        fi
    done
    
    # Try common installation paths on macOS
    for path in /usr/bin/python3 /usr/local/bin/python3 /opt/homebrew/bin/python3 /Library/Frameworks/Python.framework/Versions/3.*/bin/python3; do
        if [ -x "$path" ]; then
            echo "$path"
            return 0
        fi
    done
    
    return 1
}

# Check if setup is complete
if [ ! -f "setup_complete.flag" ]; then
    echo "First time setup - installing requirements..."
    echo
    
    PYTHON_EXE=$(find_python)
    if [ -z "$PYTHON_EXE" ]; then
        echo "ERROR: Python not found!"
        echo "Please install Python 3.7+ from:"
        echo "  - https://python.org"
        echo "  - Homebrew: brew install python3"
        echo "  - Xcode Command Line Tools: xcode-select --install"
        exit 1
    fi
    
    echo "Found Python: $PYTHON_EXE"
    echo "Installing Python packages..."
    
    # Install packages
    "$PYTHON_EXE" -m pip install --user --upgrade pip
    "$PYTHON_EXE" -m pip install --user flask PyPDF2 Pillow
    
    if [ $? -eq 0 ]; then
        echo "Setup complete!" > setup_complete.flag
        echo
        echo "Setup completed successfully!"
        echo
    else
        echo "ERROR: Failed to install requirements!"
        echo "You may need to install pip or use: python3 -m ensurepip"
        exit 1
    fi
else
    echo "Setup already complete, starting server..."
    echo
fi

# Find Python and run the application
PYTHON_EXE=$(find_python)
if [ -z "$PYTHON_EXE" ]; then
    echo "ERROR: Python not found!"
    exit 1
fi

echo "Starting PDF Tool Web Application..."
echo
echo "The application will be available at:"
echo "  http://localhost:5000"
echo "  http://127.0.0.1:5000"
echo

# Get local IP address on macOS
LOCAL_IP=$(ifconfig | grep "inet " | grep -v 127.0.0.1 | awk '{print $2}' | head -1)

if [ ! -z "$LOCAL_IP" ]; then
    echo "To access from other devices on your network:"
    echo "  http://$LOCAL_IP:5000"
fi

echo
echo "Press Ctrl+C to stop the server"
echo "================================================"
echo

"$PYTHON_EXE" app.py

echo
echo "Server stopped."