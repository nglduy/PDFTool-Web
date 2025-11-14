#!/bin/bash

echo "================================================"
echo "           PDF Tool Web Application"
echo "================================================"
echo
echo "Starting PDF Tool - Portable Version..."
echo

# Get script directory and navigate to it
cd "$(dirname "$0")"

# Simple setup check and installation
if [ ! -f "setup_complete.flag" ]; then
    echo "First time setup - installing packages..."
    echo
    
    # Try different Python commands
    PYTHON_CMD=""
    for cmd in python3 python; do
        if command -v "$cmd" >/dev/null 2>&1; then
            PYTHON_CMD="$cmd"
            break
        fi
    done
    
    if [ -z "$PYTHON_CMD" ]; then
        echo "ERROR: Python not found!"
        echo "Please install Python 3.7+ and try again."
        exit 1
    fi
    
    echo "Using Python: $PYTHON_CMD"
    
    # Install packages
    "$PYTHON_CMD" -m pip install --user flask PyPDF2 Pillow
    
    if [ $? -eq 0 ]; then
        echo "Setup complete!" > setup_complete.flag
        echo "Installation successful!"
        echo
    else
        echo
        echo "WARNING: Could not install packages automatically."
        echo "Please try running: $PYTHON_CMD -m pip install --user flask PyPDF2 Pillow"
        echo
        echo "Continuing anyway - packages might already be installed..."
        echo
    fi
fi

echo "The application will be available at:"
echo "  http://localhost:5000"
echo "  http://127.0.0.1:5000"
echo

# Try to get local IP
if command -v ip >/dev/null 2>&1; then
    LOCAL_IP=$(ip route get 1.1.1.1 2>/dev/null | grep -oP 'src \K\S+' 2>/dev/null)
elif command -v ifconfig >/dev/null 2>&1; then
    LOCAL_IP=$(ifconfig | grep -Eo 'inet (addr:)?([0-9]*\.){3}[0-9]*' | grep -Eo '([0-9]*\.){3}[0-9]*' | grep -v '127.0.0.1' | head -1)
fi

if [ ! -z "$LOCAL_IP" ]; then
    echo "To access from other devices: http://$LOCAL_IP:5000"
fi

echo
echo "Press Ctrl+C to stop the server"
echo "================================================"
echo

# Find Python and run
for cmd in python3 python; do
    if command -v "$cmd" >/dev/null 2>&1; then
        "$cmd" app.py
        exit 0
    fi
done

echo "ERROR: Python not found!"
echo "Please install Python and try again."
exit 1