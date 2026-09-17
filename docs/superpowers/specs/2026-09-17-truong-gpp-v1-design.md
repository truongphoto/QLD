# TRƯỜNG GPP V1 Design

## Goal
A zero-cost static web app plus Chromium Manifest V3 extension that lets a non-technical user enter pharmacy-registration data once, validate it locally, then auto-fill matching text/select/date fields on the target CSDL Dược page. File upload, CAPTCHA, legal confirmation, and final submission remain manual.

## Architecture
- Static Web App: HTML/CSS/vanilla JS, deployable to GitHub Pages.
- Local-only persistence: browser localStorage for drafts/settings.
- Extension bridge: content script on the Web App domain forwards a user-triggered fill payload to the extension service worker.
- Extension runner: service worker asks for host access to the configured target origin, opens the target tab, stores the payload in chrome.storage.session, and injects target_filler.js.
- Target filler: detects fields by exact selectors when provided and otherwise by aliases matched against label/name/id/placeholder/aria-label; fills and verifies values, then renders a completion panel.

## Security boundaries
- No user dossier is sent to GitHub or a backend.
- The extension keeps a run payload in chrome.storage.session and removes it after injection/read.
- Target host access is requested only for the configured target origin via optional_host_permissions.
- The extension never uploads files, solves CAPTCHA, clicks the final submit button, or executes remote code.

## V1 scope
Includes: guided form, validation, autosave, draft reset/export/import, extension presence signal, target URL setting, auto-fill, select/date/text support, verification summary, manual handoff message.

Excludes: OCR, cloud accounts, server database, Desktop app, Playwright, auto-upload, CAPTCHA automation, digital signature automation, final auto-submit.

## Compatibility
Primary targets: Chrome and Microsoft Edge. Cốc Cốc is best-effort and must be verified on a current build.
