# PDFTool-Web

A simple and user-friendly web application for PDF manipulation built with Flask, JavaScript, HTML, and deployed on Vercel.

## Features

📄 **Merge PDFs** - Combine multiple PDF files into one (pages follow the order of files added)

✂️ **Split PDF** - Extract specific pages from a PDF file (supports individual pages like "1,3,5" and ranges like "2-4")

🖼️ **Images to PDF** - Convert images (PNG, JPG, JPEG) to PDF pages

## Tech Stack

- **Backend**: Python, Flask
- **Frontend**: HTML, CSS, JavaScript
- **Libraries**: PyPDF2 (PDF manipulation), Pillow (image processing)
- **Deployment**: Vercel (serverless)

## Local Development

1. Clone the repository:
```bash
git clone https://github.com/nglduy/PDFTool-Web.git
cd PDFTool-Web
```

2. Install dependencies:
```bash
pip install -r requirements.txt
```

3. Run the Flask development server:
```bash
python api/index.py
```

4. Open your browser and navigate to `http://localhost:5000`

## Deployment to Vercel

1. Install Vercel CLI:
```bash
npm install -g vercel
```

2. Deploy to Vercel:
```bash
vercel
```

3. Follow the prompts to complete deployment

Alternatively, you can deploy by connecting your GitHub repository to Vercel through the Vercel dashboard.

## Usage

### Merge PDFs
1. Navigate to the Merge PDFs page
2. Upload multiple PDF files (drag and drop or click to browse)
3. Click "Merge PDFs" button
4. Download the merged PDF

### Split PDF
1. Navigate to the Split PDF page
2. Upload a PDF file
3. Enter page numbers to extract (e.g., "1,3,5" or "2-4")
4. Click "Split PDF" button
5. Download the split PDF

### Convert Images to PDF
1. Navigate to the Images to PDF page
2. Upload one or more images
3. Click "Convert to PDF" button
4. Download the generated PDF

## Configuration

- Maximum file size: 50MB
- Supported image formats: PNG, JPG, JPEG
- Supported PDF operations: Merge, Split, Convert

## License

MIT
