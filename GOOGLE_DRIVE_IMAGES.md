# Using Google Drive Images

To use images from Google Drive in this website, you need to convert the share link to a direct image URL.

## Step 1: Get your Google Drive share link
1. Upload your image to Google Drive
2. Right-click the image → "Share"
3. Set permissions to "Anyone with the link" can view
4. Copy the share link. It will look like: 
   `https://drive.google.com/file/d/FILE_ID/view?usp=sharing`

## Step 2: Convert to direct URL
Replace the share link with:
```
https://drive.google.com/uc?export=view&id=YOUR_FILE_ID
```

For example, if your share link is:
`https://drive.google.com/file/d/1AbCdEfGhIjKlMnOpQrStUvWxYz123456/view?usp=sharing`

Your direct URL becomes:
`https://drive.google.com/uc?export=view&id=1AbCdEfGhIjKlMnOpQrStUvWxYz123456`

## Step 3: Use in HTML
Add it like any other image - in the gallery, just use the direct URL in the `src` attribute:

```html
<figure class="gallery-item filter-item" data-category="activities" data-lightbox>
  <img src="https://drive.google.com/uc?export=view&id=YOUR_FILE_ID" 
       data-full="https://drive.google.com/uc?export=view&id=YOUR_FILE_ID"
       data-caption="Your caption here"
       alt="Description of image"
       width="800" height="600" loading="lazy" />
</figure>
```

## Notes
- Make sure the image is set to "Anyone with the link can view"
- Google Drive direct links work with the existing lightbox/gallery functionality
- If images don't load, check permissions or the file ID is correct
- For better performance, consider hosting images on a CDN in production