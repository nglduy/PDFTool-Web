from flask import Flask, render_template, request, send_file, send_from_directory, flash, redirect, url_for, jsonify
import os
import tempfile
import shutil
from werkzeug.utils import secure_filename
from PyPDF2 import PdfReader, PdfWriter
from PIL import Image
import io
import re

app = Flask(__name__, static_folder='static', static_url_path='/static')
app.secret_key = 'your-secret-key-change-this-for-production'
app.config['MAX_CONTENT_LENGTH'] = 50 * 1024 * 1024  # 50MB max file size

# Allowed file extensions
ALLOWED_EXTENSIONS = {'pdf', 'png', 'jpg', 'jpeg', 'gif', 'bmp', 'tiff'}

def allowed_file(filename):
    return '.' in filename and \
           filename.rsplit('.', 1)[1].lower() in ALLOWED_EXTENSIONS

def parse_page_ranges(page_ranges_str, total_pages):
    """Parse page ranges like '1-3, 5, 7-10' into a list of page numbers."""
    pages = set()
    
    for part in page_ranges_str.split(','):
        part = part.strip()
        if '-' in part:
            # Range like '1-3'
            try:
                start, end = part.split('-', 1)
                start, end = int(start.strip()), int(end.strip())
                if start > 0 and end > 0 and start <= end:
                    pages.update(range(start, min(end + 1, total_pages + 1)))
            except ValueError:
                continue
        else:
            # Single page like '5'
            try:
                page = int(part)
                if 1 <= page <= total_pages:
                    pages.add(page)
            except ValueError:
                continue
    
    return list(pages)

@app.route('/')
def index():
    return render_template('index.html')

@app.route('/health')
def health():
    return jsonify({'status': 'healthy', 'message': 'PDF Tool is running'})

@app.route('/api/merge', methods=['POST'])
def merge_pdfs():
    try:
        if 'files' not in request.files:
            return jsonify({'success': False, 'error': 'No files provided'})
        
        files = request.files.getlist('files')
        if len(files) < 2:
            return jsonify({'success': False, 'error': 'At least 2 PDF files are required for merging'})
        
        # Create a temporary directory
        temp_dir = tempfile.mkdtemp()
        
        try:
            pdf_writer = PdfWriter()
            
            # Process each PDF file
            for file in files:
                if file and allowed_file(file.filename) and file.filename.lower().endswith('.pdf'):
                    # Save the file temporarily
                    temp_path = os.path.join(temp_dir, secure_filename(file.filename))
                    file.save(temp_path)
                    
                    # Read the PDF
                    pdf_reader = PdfReader(temp_path)
                    
                    # Add all pages to the writer
                    for page in pdf_reader.pages:
                        pdf_writer.add_page(page)
            
            # Create output file
            output_filename = 'merged_document.pdf'
            output_path = os.path.join(temp_dir, output_filename)
            
            with open(output_path, 'wb') as output_file:
                pdf_writer.write(output_file)
            
            # Return the merged PDF
            return send_file(
                output_path,
                as_attachment=True,
                download_name=output_filename,
                mimetype='application/pdf'
            )
            
        except Exception as e:
            return jsonify({'success': False, 'error': f'Error merging PDFs: {str(e)}'})
        finally:
            # Clean up temporary files
            try:
                shutil.rmtree(temp_dir)
            except:
                pass
    
    except Exception as e:
        return jsonify({'success': False, 'error': f'Server error: {str(e)}'})

@app.route('/api/split', methods=['POST'])
def split_pdf():
    try:
        if 'files' not in request.files:
            return jsonify({'success': False, 'error': 'No file provided'})
        
        files = request.files.getlist('files')
        if len(files) != 1:
            return jsonify({'success': False, 'error': 'Exactly one PDF file is required for splitting'})
        
        file = files[0]
        if not file or not allowed_file(file.filename) or not file.filename.lower().endswith('.pdf'):
            return jsonify({'success': False, 'error': 'Invalid PDF file'})
        
        page_ranges = request.form.get('pageRanges', '').strip()
        if not page_ranges:
            return jsonify({'success': False, 'error': 'Page ranges are required'})
        
        # Create a temporary directory
        temp_dir = tempfile.mkdtemp()
        
        try:
            # Save the uploaded file
            temp_path = os.path.join(temp_dir, secure_filename(file.filename))
            file.save(temp_path)
            
            # Read the PDF
            pdf_reader = PdfReader(temp_path)
            total_pages = len(pdf_reader.pages)
            
            # Parse page ranges
            pages_to_extract = parse_page_ranges(page_ranges, total_pages)
            
            if not pages_to_extract:
                return jsonify({'success': False, 'error': 'Invalid page ranges'})
            
            # Create new PDF with selected pages
            pdf_writer = PdfWriter()
            
            for page_num in sorted(pages_to_extract):
                if 1 <= page_num <= total_pages:
                    pdf_writer.add_page(pdf_reader.pages[page_num - 1])  # Convert to 0-based index
            
            # Create output file
            output_filename = f'split_pages_{page_ranges.replace(" ", "").replace(",", "-")}.pdf'
            output_path = os.path.join(temp_dir, output_filename)
            
            with open(output_path, 'wb') as output_file:
                pdf_writer.write(output_file)
            
            # Return the split PDF
            return send_file(
                output_path,
                as_attachment=True,
                download_name=output_filename,
                mimetype='application/pdf'
            )
            
        except Exception as e:
            return jsonify({'success': False, 'error': f'Error splitting PDF: {str(e)}'})
        finally:
            # Clean up temporary files
            try:
                shutil.rmtree(temp_dir)
            except:
                pass
    
    except Exception as e:
        return jsonify({'success': False, 'error': f'Server error: {str(e)}'})

@app.route('/api/convert', methods=['POST'])
def convert_images_to_pdf():
    try:
        if 'files' not in request.files:
            return jsonify({'success': False, 'error': 'No files provided'})
        
        files = request.files.getlist('files')
        if len(files) == 0:
            return jsonify({'success': False, 'error': 'At least one image file is required'})
        
        # Create a temporary directory
        temp_dir = tempfile.mkdtemp()
        
        try:
            images = []
            
            # Process each image file
            for file in files:
                if file and allowed_file(file.filename) and not file.filename.lower().endswith('.pdf'):
                    # Save the file temporarily
                    temp_path = os.path.join(temp_dir, secure_filename(file.filename))
                    file.save(temp_path)
                    
                    # Open and convert image
                    try:
                        image = Image.open(temp_path)
                        # Convert to RGB if necessary
                        if image.mode != 'RGB':
                            image = image.convert('RGB')
                        images.append(image)
                    except Exception as e:
                        continue  # Skip invalid images
            
            if not images:
                return jsonify({'success': False, 'error': 'No valid image files found'})
            
            # Create PDF
            output_filename = 'converted_images.pdf'
            output_path = os.path.join(temp_dir, output_filename)
            
            # Save all images as a single PDF
            if len(images) == 1:
                images[0].save(output_path, 'PDF')
            else:
                images[0].save(output_path, 'PDF', save_all=True, append_images=images[1:])
            
            # Return the PDF
            return send_file(
                output_path,
                as_attachment=True,
                download_name=output_filename,
                mimetype='application/pdf'
            )
            
        except Exception as e:
            return jsonify({'success': False, 'error': f'Error converting images: {str(e)}'})
        finally:
            # Clean up temporary files
            try:
                shutil.rmtree(temp_dir)
            except:
                pass
    
    except Exception as e:
        return jsonify({'success': False, 'error': f'Server error: {str(e)}'})

if __name__ == '__main__':
    app.run(debug=True, host='0.0.0.0', port=5000)