# WhatsApp selections

Customers can save gallery media, homepage slabs and project views, and material images using the heart control. Selections persist on the current device. Homepage/gallery references to the same slab deduplicate.

`/favorites` displays personal selections. A `#v1=` fragment displays the shared collection without replacing the recipient's saved items. Links and local storage contain validated asset references only, never the optional customer name. Unknown versions, malformed references and oversized links show an error. A collection supports up to 150 selections, including newly uploaded gallery images.

The primary action opens the existing business WhatsApp number with a prepared message, optional name, up to 12 readable item summaries, the total count and a link to **every** selected image. The customer must press Send in WhatsApp. The site cannot read the customer's WhatsApp identity or phone number; the business replies in the resulting conversation.

JPEG contact sheets include all selected photos, six per sheet, fitted without cropping and labelled with names and reference codes. Sheets are prepared before the share gesture. Supported devices use `navigator.share` with files; the visitor chooses WhatsApp and the business recipient. A direct `wa.me` link cannot attach files, and Web Share cannot force a recipient. Download links are provided as a fallback. Canceling native sharing never displays a sent confirmation. A failed image cancels the export rather than silently omitting it; the collection link remains available.

No Facebook integration, new server endpoint, third-party account, messaging API, or automatic outbound message is involved.

Validation: `npm run test:selections`, `npm run typecheck`, `npm run build`. Browser QA covers save/remove/persistence, homepage deduplication, shared views, message destination/content, rendered sheet previews, RTL/mobile layouts, and light/dark themes. Native WhatsApp delivery must be tested manually on a real phone; automated QA must not send test messages to the business.
