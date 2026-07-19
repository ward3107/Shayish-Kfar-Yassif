# Gallery Admin Setup

The owner uploads / manages gallery media via **`/admin`**. Media is stored in
**Cloudinary** (free tier), served via their CDN. A password-protected panel
handles uploads and deletes; the public Gallery page reads from `/api/media`.

## 1. Create Cloudinary account (free)

1. Sign up at https://cloudinary.com/users/register/free — no credit card.
2. In the dashboard, copy these three values (Dashboard → API keys):
   - **Cloud name**
   - **API Key**
   - **API Secret**
3. Create an **unsigned upload preset**:
   - Settings → Upload → Add upload preset
   - Signing Mode: **Unsigned**
   - Folder: `shayish/gallery`
   - Optionally: enable "Auto-optimize" and image/video quality "Auto"
   - Save; copy the preset name.

## 2. Set Vercel environment variables

Vercel Project Settings → Environment Variables. Add these for **all** environments (Production, Preview, Development):

| Name | Value | Notes |
|---|---|---|
| `CLOUDINARY_CLOUD_NAME` | your cloud name | server-only |
| `CLOUDINARY_API_KEY` | your API key | server-only |
| `CLOUDINARY_API_SECRET` | your API secret | server-only, **never commit** |
| `CLOUDINARY_GALLERY_FOLDER` | `shayish/gallery` | optional; default matches |
| `VITE_CLOUDINARY_CLOUD_NAME` | your cloud name | client-side (upload) |
| `VITE_CLOUDINARY_UPLOAD_PRESET` | preset name from step 1 | client-side (upload) |
| `VITE_CLOUDINARY_GALLERY_FOLDER` | `shayish/gallery` | client-side |
| `ADMIN_PASSWORD` | strong password (12+ chars) | the owner types this on /admin |
| `ADMIN_SESSION_SECRET` | random 32+ char string | HMAC key for session cookie |

Generate `ADMIN_SESSION_SECRET` with:
```bash
node -e "console.log(require('crypto').randomBytes(32).toString('hex'))"
```

## 3. Redeploy

Trigger a new Vercel deployment (any push to `main`, or "Redeploy" in the Vercel dashboard).

## 4. Use it

- Owner visits `https://<your-domain>/admin` → enters password → drops files.
- Public gallery page auto-refreshes (60s edge cache).
- To rotate the password, change `ADMIN_PASSWORD` in Vercel and redeploy.
  Rotating `ADMIN_SESSION_SECRET` invalidates every existing session.

## Free-tier limits

- **10 MB max per image, 100 MB max per video** (Cloudinary free).
- 25 monthly credits (1 credit ≈ 1 GB storage or 1 GB bandwidth or 1,000 transformations).
- Realistic capacity: ~2,500 optimized photos or ~250 videos.

If usage exceeds the free tier, Cloudinary emails you before enforcing limits.
