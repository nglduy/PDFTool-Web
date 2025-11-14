# 📸 How to Add Your Images

## Step 1: Copy Your Images

Copy your image files to this folder:
```
c:\SUNCREST\Practice\PDFTool-Web\static\images\
```

### Required Images:
1. **`avatar.jpg`** (or `.png`) - Your portrait photo for the About page
2. **`hero-background.jpg`** (or `.png`) - Landscape picture for the home page

### Image Requirements:
- **Avatar:** Square format recommended (e.g., 400x400px)
- **Hero Background:** Landscape format (e.g., 1920x1080px or 1600x900px)
- **File formats:** JPG, PNG, or WebP
- **File size:** Keep under 2MB for web performance

## Step 2: Update Filenames (if needed)

If your files have different names, either:

**Option A: Rename your files to match:**
- `avatar.jpg` (or `.png`)
- `hero-background.jpg` (or `.png`)

**Option B: Tell me your actual filenames and I'll update the code**

## Step 3: Test the Website

1. Run your website: `python app.py`
2. Visit the pages to see your images:
   - **Home page:** Hero background should appear
   - **About page:** Your avatar should replace the "DN" placeholder

## 🔧 Troubleshooting

### Image Not Showing?
1. Check the file path is correct
2. Ensure the image file is in `/static/images/`
3. Try refreshing the browser (Ctrl+F5)
4. Check browser console for errors (F12)

### Image Too Large/Small?
- The CSS automatically resizes images to fit
- For better performance, resize images before uploading:
  - **Avatar:** 400x400px
  - **Hero:** 1920x1080px

### Different File Extension?
If you have `.png` files instead of `.jpg`, let me know and I'll update the code!

## 🎨 Example File Structure

```
PDFTool-Web/
├── static/
│   ├── images/
│   │   ├── avatar.jpg          ← Your portrait
│   │   └── hero-background.jpg ← Your landscape
│   ├── css/
│   └── js/
└── templates/
```

---

**Ready?** Just copy your images to the `/static/images/` folder and your website will automatically use them!