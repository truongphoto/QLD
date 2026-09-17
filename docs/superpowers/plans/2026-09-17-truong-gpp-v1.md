# TRƯỜNG GPP V1 Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [x]`) syntax for tracking.

**Goal:** Build a deployable static Web + MV3 Extension V1 that validates a local dossier and auto-fills matching CSDL Dược form fields, stopping before file upload/CAPTCHA/final submit.

**Architecture:** Static web UI stores drafts locally and posts a fill request that the extension bridge captures. The extension requests exact target-origin permission, opens the target tab, injects a deterministic field matcher/filler, verifies results, and hands control back to the user.

**Tech Stack:** HTML5, CSS3, vanilla JavaScript, Chrome Extension Manifest V3, Node.js built-in test runner.

**Spec:** `docs/superpowers/specs/2026-09-17-truong-gpp-v1-design.md`

## Global Constraints
- No backend and no user dossier upload.
- No automatic file upload, CAPTCHA handling, digital signing, or final submission.
- GitHub Pages compatible.
- Extension requests only the configured target origin at runtime.
- Chrome and Edge are primary supported browsers.

---

### Task 1: Shared dossier schema and validation
**Files:** `web/js/schema.js`, `web/js/validation.js`, `tests/validation.test.mjs`
**Produces:** field definitions, validation, normalization.
- [x] Write failing validation tests.
- [x] Run tests and confirm RED.
- [x] Implement schema/validation.
- [x] Run tests and confirm GREEN.

### Task 2: Web application
**Files:** `web/index.html`, `web/css/app.css`, `web/js/app.js`
**Consumes:** schema/validation.
**Produces:** guided input, autosave, import/export/reset, start-fill bridge event.
- [x] Write DOM-independent behavior tests for serialization/state helpers.
- [x] Run tests RED.
- [x] Implement minimal app/state helpers and UI.
- [x] Run tests GREEN.

### Task 3: Extension field matcher
**Files:** `extension/field_core.js`, `tests/field_core.test.mjs`
**Produces:** text normalization, candidate scoring, value normalization.
- [x] Write matcher tests.
- [x] Run RED.
- [x] Implement matcher core.
- [x] Run GREEN.

### Task 4: MV3 bridge and target filler
**Files:** `extension/manifest.json`, `extension/app_bridge.js`, `extension/service_worker.js`, `extension/target_filler.js`, `extension/panel.css`
**Consumes:** dossier payload and field metadata.
**Produces:** exact-origin permission request, target tab open, fill/verify, handoff panel.
- [x] Add static contract tests for manifest/security constraints.
- [x] Run RED.
- [x] Implement extension files.
- [x] Run GREEN.

### Task 5: Packaging and verification
**Files:** `README.md`, `INSTALL.md`, release ZIPs.
- [x] Run all tests.
- [x] Run JavaScript syntax checks.
- [x] Verify manifests/paths and no remote-code usage.
- [x] Create `TRUONG_GPP_V1_WEB.zip`, `TRUONG_GPP_V1_EXTENSION.zip`, `TRUONG_GPP_V1_COMPLETE.zip` and SHA-256 file.
