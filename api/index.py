from flask import Flask, render_template, request, send_file, jsonify
from werkzeug.utils import secure_filename
import os
from io import BytesIO
from PyPDF2 import PdfMerger, PdfReader, PdfWriter
from PIL import Image

app = Flask(__name__, template_folder='../templates', static_folder='../static')
app.config['MAX_CONTENT_LENGTH'] = 50 * 1024 * 1024  # 50MB max file size

ALLOWED_EXTENSIONS = {'pdf', 'png', 'jpg', 'jpeg'}

def allowed_file(filename):
    return '.' in filename and filename.rsplit('.', 1)[1].lower() in ALLOWED_EXTENSIONS

@app.route('/')
def index():
    return render_template('index.html')

@app.route('/merge')
def merge_page():
    return render_template('merge.html')

@app.route('/split')
def split_page():
    return render_template('split.html')

@app.route('/convert')
def convert_page():
    return render_template('convert.html')

@app.route('/api/merge', methods=['POST'])
def merge_pdfs():
    try:
        files = request.files.getlist('files')
        
        if len(files) < 2:
            return jsonify({'error': 'At least 2 PDF files are required'}), 400
        
        merger = PdfMerger()
        
        for file in files:
            if file and allowed_file(file.filename):
                pdf_bytes = BytesIO(file.read())
                merger.append(pdf_bytes)
        
        output = BytesIO()
        merger.write(output)
        merger.close()
        output.seek(0)
        
        return send_file(
            output,
            mimetype='application/pdf',
            as_attachment=True,
            download_name='merged.pdf'
        )
    except Exception as e:
        return jsonify({'error': str(e)}), 500

@app.route('/api/split', methods=['POST'])
def split_pdf():
    try:
        file = request.files['file']
        pages_input = request.form['pages']
        
        if not file or not allowed_file(file.filename):
            return jsonify({'error': 'Invalid PDF file'}), 400
        
        pdf_bytes = BytesIO(file.read())
        reader = PdfReader(pdf_bytes)
        writer = PdfWriter()
        
        # Parse page numbers and ranges
        pages_to_extract = parse_page_numbers(pages_input, len(reader.pages))
        
        if not pages_to_extract:
            return jsonify({'error': 'Invalid page numbers'}), 400
        
        for page_num in pages_to_extract:
            if 0 <= page_num < len(reader.pages):
                writer.add_page(reader.pages[page_num])
        
        output = BytesIO()
        writer.write(output)
        output.seek(0)
        
        return send_file(
            output,
            mimetype='application/pdf',
            as_attachment=True,
            download_name='split.pdf'
        )
    except Exception as e:
        return jsonify({'error': str(e)}), 500

@app.route('/api/get_page_count', methods=['POST'])
def get_page_count():
    try:
        file = request.files['file']
        
        if not file or not allowed_file(file.filename):
            return jsonify({'error': 'Invalid PDF file'}), 400
        
        pdf_bytes = BytesIO(file.read())
        reader = PdfReader(pdf_bytes)
        
        return jsonify({'pages': len(reader.pages)})
    except Exception as e:
        return jsonify({'error': str(e)}), 500

@app.route('/api/convert', methods=['POST'])
def convert_images():
    try:
        files = request.files.getlist('images')
        
        if len(files) == 0:
            return jsonify({'error': 'At least one image is required'}), 400
        
        images = []
        for file in files:
            if file and allowed_file(file.filename):
                img = Image.open(file.stream)
                # Convert to RGB if necessary (for PNG with transparency)
                if img.mode in ('RGBA', 'LA', 'P'):
                    background = Image.new('RGB', img.size, (255, 255, 255))
                    if img.mode == 'P':
                        img = img.convert('RGBA')
                    background.paste(img, mask=img.split()[-1] if img.mode in ('RGBA', 'LA') else None)
                    img = background
                elif img.mode != 'RGB':
                    img = img.convert('RGB')
                images.append(img)
        
        if not images:
            return jsonify({'error': 'No valid images found'}), 400
        
        output = BytesIO()
        if len(images) == 1:
            images[0].save(output, 'PDF')
        else:
            images[0].save(output, 'PDF', save_all=True, append_images=images[1:])
        output.seek(0)
        
        return send_file(
            output,
            mimetype='application/pdf',
            as_attachment=True,
            download_name='converted.pdf'
        )
    except Exception as e:
        return jsonify({'error': str(e)}), 500

def parse_page_numbers(pages_str, total_pages):
    """Parse page numbers like '1,3,5-7' into a list of 0-indexed page numbers."""
    pages = []
    parts = pages_str.split(',')
    
    for part in parts:
        part = part.strip()
        if '-' in part:
            # Handle range
            try:
                start, end = part.split('-')
                start = int(start.strip()) - 1  # Convert to 0-indexed
                end = int(end.strip()) - 1
                pages.extend(range(start, end + 1))
            except:
                continue
        else:
            # Handle single page
            try:
                page = int(part) - 1  # Convert to 0-indexed
                pages.append(page)
            except:
                continue
    
    # Remove duplicates and sort
    pages = sorted(list(set(pages)))
    # Filter out invalid pages
    pages = [p for p in pages if 0 <= p < total_pages]
    
    return pages

# This is required for Vercel
if __name__ == '__main__':
    app.run(debug=True)
