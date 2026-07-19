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
   - Enable "Auto-optimize" and image/video quality "Auto"
   - **Hardening (required — the preset name ships in browser JS):**
     - Allowed formats: `jpg,jpeg,png,webp,heic,mp4,mov`
     - Max file size: `50000000` (50 MB — bump for video if you shoot 4K)
     - Max image width/height: `4096`
     - Access mode: `authenticated` off (public read is intentional)
     - **Do NOT** enable "return delete_token" — it lets anyone with the
       token delete the asset within 10 minutes.
   - Save; copy the preset name.

   > **Why hardening matters:** an unsigned preset lets anyone who reads your
   > bundled JS `POST` to Cloudinary. Without limits, they can upload junk
   > until your free tier fills up. For a stricter setup use signed uploads
   > — see `api/admin/sign.ts` and the "Signed uploads" section below.

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

## Signed uploads (recommended for stricter setups)

An unsigned preset is convenient but its name is visible in the browser bundle.
Anyone can then POST arbitrary files against it (subject to the preset's own
limits) without ever visiting `/admin`. To close that surface entirely, the
project ships a signed-upload endpoint at `api/admin/sign.ts` that only an
authenticated owner session can call:

1. Delete (or disable) the unsigned preset in Cloudinary Settings → Upload.
2. In `pages/Admin.tsx`, replace the direct `POST /v1_1/{cloud}/*/upload` call
   with a two-step flow:
   - `POST /api/admin/sign` (session-gated) → returns `{ timestamp, signature, apiKey, cloudName, folder }`
   - `POST https://api.cloudinary.com/v1_1/{cloudName}/{image|video}/upload`
     with fields: `file`, `api_key`, `timestamp`, `signature`, `folder`.
3. You can then drop `VITE_CLOUDINARY_UPLOAD_PRESET` from Vercel — signed
   uploads don't use a preset.

Trade-off: uploads now require the browser to be authenticated first, which is
already the case for `/admin`, so there's no UX cost.
