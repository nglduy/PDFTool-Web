let currentTool = null;
let selectedFiles = [];

// Show/hide tools
function showTool(toolType) {
    document.querySelector('.tools-grid').style.display = 'none';
    document.getElementById(`${toolType}-tool`).style.display = 'block';
    currentTool = toolType;
}

function hideTool() {
    document.querySelector('.tools-grid').style.display = 'grid';
    document.querySelectorAll('.tool-section').forEach(section => {
        section.style.display = 'none';
    });
    resetFileInputs();
    currentTool = null;
}

function resetTool() {
    document.getElementById('result').style.display = 'none';
    document.getElementById('loading').style.display = 'none';
    hideTool();
}

function resetFileInputs() {
    selectedFiles = [];
    document.querySelectorAll('input[type="file"]').forEach(input => {
        input.value = '';
    });
    document.querySelectorAll('.file-list').forEach(list => {
        list.innerHTML = '';
    });
    document.querySelectorAll('.btn-success').forEach(btn => {
        btn.style.display = 'none';
    });
    document.getElementById('split-options').style.display = 'none';
    document.getElementById('page-ranges').value = '';
}

// File handling for merge tool
document.getElementById('merge-files').addEventListener('change', function(e) {
    selectedFiles = Array.from(e.target.files);
    updateFileList('merge');
});

// File handling for split tool
document.getElementById('split-file').addEventListener('change', function(e) {
    if (e.target.files.length > 0) {
        selectedFiles = [e.target.files[0]];
        document.getElementById('split-options').style.display = 'block';
    }
});

// File handling for convert tool
document.getElementById('convert-files').addEventListener('change', function(e) {
    selectedFiles = Array.from(e.target.files);
    updateFileList('convert');
});

function updateFileList(toolType) {
    const fileList = document.getElementById(`${toolType}-file-list`);
    const submitBtn = document.getElementById(`${toolType}-submit`);
    
    fileList.innerHTML = '';
    
    selectedFiles.forEach((file, index) => {
        const fileItem = document.createElement('div');
        fileItem.className = 'file-item';
        fileItem.innerHTML = `
            <span>${file.name} (${(file.size / 1024 / 1024).toFixed(2)} MB)</span>
            <button class="remove-file" onclick="removeFile(${index}, '${toolType}')">Remove</button>
        `;
        fileList.appendChild(fileItem);
    });
    
    submitBtn.style.display = selectedFiles.length > 0 ? 'inline-block' : 'none';
}

function removeFile(index, toolType) {
    selectedFiles.splice(index, 1);
    updateFileList(toolType);
    
    // Update file input
    const input = document.getElementById(`${toolType}-files`) || document.getElementById(`${toolType}-file`);
    if (selectedFiles.length === 0) {
        input.value = '';
    }
}

// Submit handlers
document.getElementById('merge-submit').addEventListener('click', function() {
    if (selectedFiles.length < 2) {
        alert('Please select at least 2 PDF files to merge.');
        return;
    }
    submitFiles('/api/merge', selectedFiles);
});

document.getElementById('split-submit').addEventListener('click', function() {
    const pageRanges = document.getElementById('page-ranges').value.trim();
    if (!pageRanges) {
        alert('Please enter page ranges to extract.');
        return;
    }
    if (selectedFiles.length !== 1) {
        alert('Please select exactly one PDF file to split.');
        return;
    }
    submitFiles('/api/split', selectedFiles, { pageRanges: pageRanges });
});

document.getElementById('convert-submit').addEventListener('click', function() {
    if (selectedFiles.length === 0) {
        alert('Please select at least one image file to convert.');
        return;
    }
    submitFiles('/api/convert', selectedFiles);
});

async function submitFiles(endpoint, files, additionalData = {}) {
    const formData = new FormData();
    
    files.forEach(file => {
        formData.append('files', file);
    });
    
    // Add additional data
    Object.keys(additionalData).forEach(key => {
        formData.append(key, additionalData[key]);
    });
    
    // Show loading
    document.getElementById('loading').style.display = 'flex';
    
    try {
        const response = await fetch(endpoint, {
            method: 'POST',
            body: formData
        });
        
        if (!response.ok) {
            // Try to get error message from JSON response
            try {
                const result = await response.json();
                throw new Error(result.error || `HTTP error! status: ${response.status}`);
            } catch (jsonError) {
                throw new Error(`HTTP error! status: ${response.status}`);
            }
        }
        
        // Check if response is JSON (error) or file (success)
        const contentType = response.headers.get('content-type');
        if (contentType && contentType.includes('application/json')) {
            const result = await response.json();
            if (result.success) {
                showResult(result.message, result.downloadUrl);
            } else {
                throw new Error(result.error || 'Operation failed');
            }
        } else {
            // It's a file download
            const blob = await response.blob();
            const url = window.URL.createObjectURL(blob);
            const filename = getFilenameFromResponse(response) || 'download.pdf';
            
            // Create download link and trigger download
            const a = document.createElement('a');
            a.href = url;
            a.download = filename;
            document.body.appendChild(a);
            a.click();
            document.body.removeChild(a);
            window.URL.revokeObjectURL(url);
            
            showResult('Operation completed successfully! Your file has been downloaded.', null);
        }
    } catch (error) {
        console.error('Error:', error);
        alert(`Error: ${error.message}`);
    } finally {
        document.getElementById('loading').style.display = 'none';
    }
}

function getFilenameFromResponse(response) {
    const disposition = response.headers.get('Content-Disposition');
    if (disposition && disposition.indexOf('attachment') !== -1) {
        const filenameRegex = /filename[^;=\n]*=((['"]).*?\2|[^;\n]*)/;
        const matches = filenameRegex.exec(disposition);
        if (matches != null && matches[1]) {
            return matches[1].replace(/['"]/g, '');
        }
    }
    return null;
}

function showResult(message, downloadUrl = null) {
    document.querySelectorAll('.tool-section').forEach(section => {
        section.style.display = 'none';
    });
    
    const resultSection = document.getElementById('result');
    const resultMessage = document.getElementById('result-message');
    const downloadLink = document.getElementById('download-link');
    
    resultMessage.textContent = message;
    
    if (downloadUrl) {
        downloadLink.href = downloadUrl;
        downloadLink.style.display = 'inline-block';
    } else {
        downloadLink.style.display = 'none';
    }
    
    resultSection.style.display = 'block';
}

// Drag and drop functionality
function setupDragAndDrop() {
    const uploadBoxes = document.querySelectorAll('.upload-box');
    
    uploadBoxes.forEach(box => {
        box.addEventListener('dragover', function(e) {
            e.preventDefault();
            this.style.borderColor = '#667eea';
            this.style.background = '#edf2f7';
        });
        
        box.addEventListener('dragleave', function(e) {
            e.preventDefault();
            this.style.borderColor = '#cbd5e0';
            this.style.background = '#f7fafc';
        });
        
        box.addEventListener('drop', function(e) {
            e.preventDefault();
            this.style.borderColor = '#cbd5e0';
            this.style.background = '#f7fafc';
            
            const files = Array.from(e.dataTransfer.files);
            const toolType = this.closest('.tool-section').id.replace('-tool', '');
            
            if (toolType === 'merge') {
                selectedFiles = files.filter(file => file.type === 'application/pdf');
                document.getElementById('merge-files').files = createFileList(selectedFiles);
                updateFileList('merge');
            } else if (toolType === 'split') {
                const pdfFiles = files.filter(file => file.type === 'application/pdf');
                if (pdfFiles.length > 0) {
                    selectedFiles = [pdfFiles[0]];
                    document.getElementById('split-options').style.display = 'block';
                }
            } else if (toolType === 'convert') {
                selectedFiles = files.filter(file => file.type.startsWith('image/'));
                document.getElementById('convert-files').files = createFileList(selectedFiles);
                updateFileList('convert');
            }
        });
    });
}

function createFileList(files) {
    const dt = new DataTransfer();
    files.forEach(file => dt.items.add(file));
    return dt.files;
}

// Initialize when DOM is loaded
document.addEventListener('DOMContentLoaded', function() {
    setupDragAndDrop();
});