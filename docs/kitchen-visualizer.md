# Kitchen visualizer

## Release state

Ship OFF. The owner has not approved activating this feature for customers.
No provider credentials are included and no paid service is provisioned by this change.

## Contract (before implementation)

`GET /api/visualizer` returns `{ enabled: boolean, preview: boolean, siteKey?: string }`.
The public Turnstile site key is returned only when enabled; never its secret.
`preview` is true only for an authenticated owner requesting `?preview=1`.
Unavailable configuration and settings errors fail closed. Responses are never cached.

`GET /api/admin/visualizer` requires the existing owner cookie and returns
`{ enabled, configured, missing: string[], dailyLimit, monthlyLimit, perNetworkLimit }`. `POST` to the same path takes only
`{ enabled: boolean }`, requires the owner cookie and same-origin JSON request,
and saves the setting. Enabling without complete configuration returns 409.
Disabling is always possible. An absent setting is OFF.

`POST /api/visualizer` takes JSON:
`{ requestId: UUID, slabId: string, photo: JPEG/PNG/WebP data URL, regions: [{points: [{x,y}], exclude: boolean}], consent: true, verificationToken: string }`.
Coordinates are normalized to [0,1]. Up to 12 regions, 3–40 points per region.
Only the 13 homepage slab IDs are accepted. No external URLs or prompts are accepted.
The server checks the current switch before processing and again before generation.
Responses: 200 JPEG; 400 invalid input; 403 off/origin/consent; 409 duplicate;
413 oversized; 429 quota; 502 provider failure; 503 configuration/storage unavailable.
No automatic paid retries. Request IDs and hashes prevent double spending for retries.

## Rendering and privacy

Client downscales to <=1536px and re-encodes the photo, discarding EXIF. Server
decodes with a pixel limit, normalizes orientation, and strips metadata again.
Server constructs a mask from numeric polygons, accepts no arbitrary SVG, and
supplies the kitchen first and the selected homepage slab second to image editing.
The output is composited through that same mask over the original photo; areas
outside it cannot be replaced by the model. The result is a visualization, not a
guarantee of the slab's physical scale or color. Generated quality needs a real
paid-provider trial and visual approval before activation.

Photos travel to the image provider only after explicit customer consent and
Generate. They are not uploaded to Cloudinary, saved in Redis, logged, or placed
in the public gallery. Results remain in the browser until the customer downloads them. Provider retention is governed by its account settings/policy;
do not claim zero retention. Redis stores only HMAC identifiers, hashes and counters
with expiry (up to 62 days for monthly counters). Cloudinary stores a separate, non-secret ON/OFF setting.

## Activation (owner-approved later)

Configure server-side `OPENAI_API_KEY`, `VISUALIZER_REDIS_REST_URL`,
`VISUALIZER_REDIS_REST_TOKEN`, `VISUALIZER_DAILY_LIMIT` (optional; default 10, positive integer <=500),
optional `VISUALIZER_MONTHLY_LIMIT` (default 100, maximum 5000), required
`TURNSTILE_SITE_KEY` and `TURNSTILE_SECRET_KEY`, and existing
`ADMIN_SESSION_SECRET` / Cloudinary credentials. Never use VITE_ for secrets.
Optional `VISUALIZER_MODEL` supports `gpt-image-2.5-sunburst` (default),
`gpt-image-2.5-flare`, or `gpt-image-2`. Test access and quality before enabling.
The distributed Redis reservation atomically limits total attempts/day and
2 attempts/IP/day plus the monthly site-wide limit (calendar days/months in UTC); failures still consume a reservation because provider billing
may have happened. A dedicated provider project/spend cap is also recommended.

Cloudflare Turnstile is validated server-side with expected hostname and action
before any paid request. The widget loads only when enabled and consented.

The existing admin screen has the switch and a private preview link. OFF hides
navigation/slab calls to action and rejects direct generation requests, even from
an old tab. Turning OFF cannot cancel a request already accepted by the provider.
The Redis service must support EVAL; use a primary REST endpoint, not read replicas.

## Sources checked 2026-10-18

Orbit search/integrate found image edits but its brief omitted multi-image input.
The current official contract supplies it:
- https://developers.openai.com/api/reference/resources/images/methods/edit
- https://developers.openai.com/api/docs/guides/image-generation
- https://upstash.com/docs/redis/features/restapi
- https://developers.cloudflare.com/turnstile/get-started/server-side-validation/
- https://cloudinary.com/documentation/admin_api#get_resource

## Verification

`npm run test:visualizer`, typecheck, all existing tests, build, and browser checks.
Provider HTTP is mocked in automated tests. No real AI generation or image quality
approval has occurred until explicitly recorded here.

Verified locally on 2026-10-18: 12 visualizer tests, 20 existing tests, TypeScript
and production build passed. Browser checks covered owner-only preview, local
photo upload, keyboard polygon closure, disabled generation despite consent,
390px mobile layout, light/dark themes, and the admin OFF/setup state.
The browser harness stubs settings and never calls paid generation.
