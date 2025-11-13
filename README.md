# PDF Tool

A simple and user-friendly web application for PDF operations built with Flask, JavaScript, and HTML, deployed on Vercel.

## Features

- **PDF Merge**: Combine multiple PDF files into one document
- **PDF Split**: Split a PDF into multiple documents by selecting specific pages
- **Image to PDF**: Convert images to PDF pages

## Local Development

1. Install dependencies:
   ```bash
   pip install -r requirements.txt
   ```

2. Run the application:
   ```bash
   python app.py
   ```

3. Open your browser and navigate to `http://127.0.0.1:5000`

## Deployment

This application is configured for deployment on Vercel. The configuration is in `vercel.json`.

### Deploy to Vercel

1. Install Vercel CLI:
   ```bash
   npm i -g vercel
   ```

2. Deploy:
   ```bash
   vercel
   ```

## Project Structure

```
PDFTool-Web/
├── app.py                 # Main Flask application
├── templates/
│   └── index.html        # Main HTML template
├── static/
│   ├── css/
│   │   └── style.css     # Styling
│   └── js/
│       └── script.js     # JavaScript functionality
├── requirements.txt       # Python dependencies
├── vercel.json           # Vercel configuration
└── README.md             # This file
```

## Technologies Used

- **Backend**: Flask (Python)
- **Frontend**: HTML, CSS, JavaScript
- **PDF Processing**: PyPDF2
- **Image Processing**: Pillow
- **Deployment**: Vercel
