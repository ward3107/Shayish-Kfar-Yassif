# Repository maintenance

## Dependency updates

Dependabot checks npm dependencies on Sundays at 06:00 and GitHub Actions at
06:30, Asia/Jerusalem. It groups the React renderer packages, Tailwind packages,
other minor/patch updates, and workflow actions. npm version updates wait seven
days after release. Major upgrades outside the compatibility groups remain
separate so build migrations cannot be hidden in routine updates.

The limits of three npm PRs and one workflow PR are queue limits, not a lifetime
limit on branches. Merging an update can free a slot for another pending update.
Dependabot can also rebase existing PRs when main changes. Security updates remain
enabled and are handled separately by GitHub.

Review changes and require the applicable CI and Vercel checks before merging.
GitHub deletes merged PR branches automatically. Do not enable blanket auto-merge
or disable failing checks to clear the queue.

## Catalog updates

The catalog workflow builds a downloadable `generated-catalog` artifact when its
source images, page artwork, styles, scripts or workflow change. It can also be
run manually. Unrelated application changes do not rebuild the PDF.

The workflow has read-only repository permissions and does not create branches
or PRs. Previously it pushed `automation/catalog-update`, then failed to create
a PR because repository policy disallows PR creation by GitHub Actions. Rebuilt
PDF bytes also changed without any change to the rendered pages, text or links.

To publish a real catalog change, download the artifact from the successful run
for the current source commit, inspect the PDF and page previews, copy the files
into their existing repository paths, and submit a normal reviewed PR. An artifact
alone does not update the public website. Keep both catalog PDF filenames in sync.

Python hash ordering and qpdf document IDs are deterministic in CI to reduce
unnecessary binary changes. Generated manifests and PDFs are not build triggers.

## Tailwind 4 migration

The styling configuration now lives in `index.css`; PostCSS uses
`@tailwindcss/postcss`. Keep the Tailwind packages on matching versions. Custom
theme aliases are inline so light/dark CSS variables resolve on the styled
element. The migrated utility names preserve the existing radius, blur, shadow,
focus and logical-position behavior. Tailwind 4 requires Safari 16.4+, Chrome
111+ or Firefox 128+.

The kitchen visualization remains OFF until the owner configures and enables it.
Dependency maintenance must not activate it or add paid-service credentials.
