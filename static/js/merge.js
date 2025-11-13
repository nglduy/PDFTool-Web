let files = [];

const fileInput = document.getElementById('fileInput');
const uploadArea = document.getElementById('uploadArea');
const fileList = document.getElementById('fileList');
const actionButtons = document.getElementById('actionButtons');
const resultArea = document.getElementById('resultArea');
const mergeBtn = document.getElementById('mergeBtn');
const clearBtn = document.getElementById('clearBtn');

// Drag and drop handlers
uploadArea.addEventListener('dragover', (e) => {
    e.preventDefault();
    uploadArea.classList.add('drag-over');
});

uploadArea.addEventListener('dragleave', () => {
    uploadArea.classList.remove('drag-over');
});

uploadArea.addEventListener('drop', (e) => {
    e.preventDefault();
    uploadArea.classList.remove('drag-over');
    handleFiles(e.dataTransfer.files);
});

uploadArea.addEventListener('click', () => {
    fileInput.click();
});

fileInput.addEventListener('change', (e) => {
    handleFiles(e.target.files);
});

function handleFiles(newFiles) {
    for (let file of newFiles) {
        if (file.type === 'application/pdf') {
            files.push(file);
        }
    }
    updateFileList();
}

function updateFileList() {
    if (files.length === 0) {
        fileList.innerHTML = '';
        actionButtons.style.display = 'none';
        resultArea.style.display = 'none';
        return;
    }

    fileList.innerHTML = '<h3>Selected Files:</h3>';
    files.forEach((file, index) => {
        const fileItem = document.createElement('div');
        fileItem.className = 'file-item';
        fileItem.innerHTML = `
            <div class="file-info">
                <span class="file-icon">📄</span>
                <div>
                    <div class="file-name">${file.name}</div>
                    <div class="file-size">${formatFileSize(file.size)}</div>
                </div>
            </div>
            <button class="file-remove" onclick="removeFile(${index})">Remove</button>
        `;
        fileList.appendChild(fileItem);
    });

    actionButtons.style.display = 'flex';
}

function removeFile(index) {
    files.splice(index, 1);
    updateFileList();
}

function formatFileSize(bytes) {
    if (bytes < 1024) return bytes + ' B';
    if (bytes < 1024 * 1024) return (bytes / 1024).toFixed(2) + ' KB';
    return (bytes / (1024 * 1024)).toFixed(2) + ' MB';
}

mergeBtn.addEventListener('click', async () => {
    if (files.length < 2) {
        alert('Please select at least 2 PDF files to merge.');
        return;
    }

    mergeBtn.disabled = true;
    mergeBtn.textContent = 'Merging...';

    const formData = new FormData();
    files.forEach(file => {
        formData.append('files', file);
    });

    try {
        const response = await fetch('/api/merge', {
            method: 'POST',
            body: formData
        });

        if (response.ok) {
            const blob = await response.blob();
            const url = window.URL.createObjectURL(blob);
            
            resultArea.style.display = 'block';
            document.getElementById('downloadBtn').onclick = () => {
                const a = document.createElement('a');
                a.href = url;
                a.download = 'merged.pdf';
                a.click();
            };

            fileList.style.display = 'none';
            actionButtons.style.display = 'none';
        } else {
            alert('Error merging PDFs. Please try again.');
        }
    } catch (error) {
        alert('Error merging PDFs: ' + error.message);
    } finally {
        mergeBtn.disabled = false;
        mergeBtn.textContent = 'Merge PDFs';
    }
});

clearBtn.addEventListener('click', () => {
    files = [];
    fileInput.value = '';
    updateFileList();
});
