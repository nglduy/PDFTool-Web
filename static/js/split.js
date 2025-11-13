let selectedFile = null;
let totalPages = 0;

const fileInput = document.getElementById('fileInput');
const uploadArea = document.getElementById('uploadArea');
const pageSelection = document.getElementById('pageSelection');
const actionButtons = document.getElementById('actionButtons');
const resultArea = document.getElementById('resultArea');
const splitBtn = document.getElementById('splitBtn');
const clearBtn = document.getElementById('clearBtn');
const pageInput = document.getElementById('pageInput');
const pageInfo = document.getElementById('pageInfo');

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
    if (e.dataTransfer.files.length > 0) {
        handleFile(e.dataTransfer.files[0]);
    }
});

uploadArea.addEventListener('click', () => {
    fileInput.click();
});

fileInput.addEventListener('change', (e) => {
    if (e.target.files.length > 0) {
        handleFile(e.target.files[0]);
    }
});

async function handleFile(file) {
    if (file.type !== 'application/pdf') {
        alert('Please select a PDF file.');
        return;
    }

    selectedFile = file;
    
    // Get page count
    const formData = new FormData();
    formData.append('file', file);

    try {
        const response = await fetch('/api/get_page_count', {
            method: 'POST',
            body: formData
        });

        if (response.ok) {
            const data = await response.json();
            totalPages = data.pages;
            
            uploadArea.style.display = 'none';
            pageSelection.style.display = 'block';
            actionButtons.style.display = 'flex';
            pageInfo.textContent = `Total pages: ${totalPages}`;
        } else {
            alert('Error reading PDF file.');
        }
    } catch (error) {
        alert('Error: ' + error.message);
    }
}

splitBtn.addEventListener('click', async () => {
    const pages = pageInput.value.trim();
    
    if (!pages) {
        alert('Please enter page numbers.');
        return;
    }

    splitBtn.disabled = true;
    splitBtn.textContent = 'Splitting...';

    const formData = new FormData();
    formData.append('file', selectedFile);
    formData.append('pages', pages);

    try {
        const response = await fetch('/api/split', {
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
                a.download = 'split.pdf';
                a.click();
            };

            pageSelection.style.display = 'none';
            actionButtons.style.display = 'none';
        } else {
            const data = await response.json();
            alert(data.error || 'Error splitting PDF. Please try again.');
        }
    } catch (error) {
        alert('Error splitting PDF: ' + error.message);
    } finally {
        splitBtn.disabled = false;
        splitBtn.textContent = 'Split PDF';
    }
});

clearBtn.addEventListener('click', () => {
    selectedFile = null;
    totalPages = 0;
    fileInput.value = '';
    pageInput.value = '';
    uploadArea.style.display = 'block';
    pageSelection.style.display = 'none';
    actionButtons.style.display = 'none';
    resultArea.style.display = 'none';
});
