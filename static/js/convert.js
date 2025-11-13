let images = [];

const fileInput = document.getElementById('fileInput');
const uploadArea = document.getElementById('uploadArea');
const imagePreview = document.getElementById('imagePreview');
const actionButtons = document.getElementById('actionButtons');
const resultArea = document.getElementById('resultArea');
const convertBtn = document.getElementById('convertBtn');
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
        if (file.type.startsWith('image/')) {
            images.push(file);
        }
    }
    updateImagePreview();
}

function updateImagePreview() {
    if (images.length === 0) {
        imagePreview.innerHTML = '';
        actionButtons.style.display = 'none';
        resultArea.style.display = 'none';
        return;
    }

    imagePreview.innerHTML = '';
    images.forEach((image, index) => {
        const imageItem = document.createElement('div');
        imageItem.className = 'image-item';
        
        const img = document.createElement('img');
        img.src = URL.createObjectURL(image);
        img.alt = image.name;
        
        const removeBtn = document.createElement('button');
        removeBtn.className = 'image-remove';
        removeBtn.innerHTML = '×';
        removeBtn.onclick = () => removeImage(index);
        
        imageItem.appendChild(img);
        imageItem.appendChild(removeBtn);
        imagePreview.appendChild(imageItem);
    });

    actionButtons.style.display = 'flex';
}

function removeImage(index) {
    images.splice(index, 1);
    updateImagePreview();
}

convertBtn.addEventListener('click', async () => {
    if (images.length === 0) {
        alert('Please select at least one image.');
        return;
    }

    convertBtn.disabled = true;
    convertBtn.textContent = 'Converting...';

    const formData = new FormData();
    images.forEach(image => {
        formData.append('images', image);
    });

    try {
        const response = await fetch('/api/convert', {
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
                a.download = 'converted.pdf';
                a.click();
            };

            imagePreview.style.display = 'none';
            actionButtons.style.display = 'none';
        } else {
            alert('Error converting images. Please try again.');
        }
    } catch (error) {
        alert('Error converting images: ' + error.message);
    } finally {
        convertBtn.disabled = false;
        convertBtn.textContent = 'Convert to PDF';
    }
});

clearBtn.addEventListener('click', () => {
    images = [];
    fileInput.value = '';
    updateImagePreview();
});
