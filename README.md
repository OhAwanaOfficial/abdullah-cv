# Portfolio, Resume & CV

A portfolio website styled after GTA IV's loading screens: tinted dusk artwork in paper-bordered panels, a pause-menu nav, mission cards and an old-school phone for contact. It comes with a matching one-page resume and a full CV.

Every illustration is original SVG generated in code (`assets/js/scenes.js`). No game assets are used.

## Files

| File | What it is |
| --- | --- |
| `index.html` | The portfolio website |
| `resume.html` | One-page resume (print-ready A4) |
| `cv.html` | Full CV (print-ready A4) |
| `assets/js/content.js` | **All of your content.** The site, resume and CV all read from it |
| `assets/docs/resume.pdf`, `cv.pdf` | PDF versions, linked from the site's download buttons |
| `tools/build-pdfs.ps1` | Regenerates the PDFs after you edit your content |

## Making it yours

1. **Edit `assets/js/content.js`.** Everything set in "Liberty City" is placeholder text. Replace it with your real name, contact details, experience, projects and education.
2. **Add a photo (optional).** Save it as `assets/img/photo.jpg` (a PNG with the background removed looks best), then set `photo: "assets/img/photo.jpg"`. The site turns it into the same tinted, inked artwork style automatically. Without a photo, an illustrated silhouette is used.
3. **Rebuild the PDFs** (needs internet for the fonts):

   ```bash
   powershell -ExecutionPolicy Bypass -File tools\build-pdfs.ps1
   ```

   Or open `resume.html` / `cv.html` and click **Print / Save PDF**. In the print dialog, untick "Headers and footers".

## Previewing

Double-click `index.html`, or serve the folder:

```bash
python -m http.server 5173
```

Then open http://localhost:5173.

## Customising

- **Colours of the resume/CV:** change `--accent` at the top of `assets/css/docs.css`.
- **Artwork per project:** each project in `content.js` has `scene` (`portrait`, `skyline`, `bridge`, `statue`, `tower`, `train`) and `tint` (`dusk`, `harbor`, `park`, `night`, `rust`, `mono`).
- **Project screenshots:** set `image: "assets/img/my-project.png"` on a project and it's shown in the artwork style instead.
- **Pricedown font:** the headings use Anton by default. If you install the free *Pricedown* font (by Typodermic), it's picked up automatically.

## Publishing

It's a static site with no build step, so any static host works:

- **GitHub Pages:** push this folder to a repository, then Settings → Pages → deploy from the main branch.
- **Netlify / Vercel / Cloudflare Pages:** drag and drop the folder.

---

The art direction is inspired by classic open-world game loading screens. This project is not affiliated with or endorsed by Rockstar Games or Take-Two Interactive.
