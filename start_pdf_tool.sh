#!/bin/bash

echo "================================================"
echo "           PDF Tool Web Application"
echo "================================================"
echo

# Get the directory where this script is located
SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
cd "$SCRIPT_DIR"

# Function to find Python
find_python() {
    # Try common Python commands
    for cmd in python3 python python3.9 python3.10 python3.11 python3.12 python3.13 python3.14; do
        if command -v "$cmd" >/dev/null 2>&1; then
            echo "$cmd"
            return 0
        fi
    done
    
    # Try common installation paths
    for path in /usr/bin/python3 /usr/local/bin/python3 /opt/python3/bin/python3; do
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
        echo "Please install Python 3.7+ from your package manager or https://python.org"
        echo
        echo "On Ubuntu/Debian: sudo apt install python3 python3-pip"
        echo "On CentOS/RHEL: sudo yum install python3 python3-pip"
        echo "On macOS: brew install python3"
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
        echo "You may need to install pip: sudo apt install python3-pip (Ubuntu/Debian)"
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

# Try to get local IP address
if command -v ip >/dev/null 2>&1; then
    LOCAL_IP=$(ip route get 1.1.1.1 | grep -oP 'src \K\S+' 2>/dev/null)
elif command -v ifconfig >/dev/null 2>&1; then
    LOCAL_IP=$(ifconfig | grep -Eo 'inet (addr:)?([0-9]*\.){3}[0-9]*' | grep -Eo '([0-9]*\.){3}[0-9]*' | grep -v '127.0.0.1' | head -1)
fi

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