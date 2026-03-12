# Before Chrome Web Store Submission

## Required

- [ ] **Production URLs in manifest.json**
  Update `host_permissions` and `content_scripts` → `matches` with the production
  frontend and backend URLs. Currently only `localhost` is listed, so the extension
  won't auto-sync the JWT on the production Faces site.

- [ ] **Store listing copy**
  Chrome Web Store requires: name, short description (132 chars), detailed description,
  category, and at least one screenshot.

- [ ] **Screenshots**
  1280×800 or 640×400 PNG. Minimum 1, recommended 3–5.
  Suggested shots: extension popup (connected state), the connect flow in Faces,
  the ChatGPT approval page.

- [ ] **Privacy policy URL**
  The Web Store requires a hosted privacy policy for extensions that handle auth tokens.
  Point to the Faces privacy policy page.

- [ ] **`tabs` permission justification**
  Chrome may flag the `tabs` permission during review. Be ready to explain:
  it is used to (a) redirect the OAuth callback tab to the exchanging/success/error
  pages, and (b) find open Faces tabs to send the `oauth_connected` notification.

## Nice to Have

- [ ] **Manifest: tighten host_permissions**
  Restrict to only the specific paths needed rather than `/*` wildcards where possible.

- [ ] **Popup: "Disconnect" button**
  Let users call `DELETE /v1/oauth/openai` from the popup without going to Faces settings.

- [ ] **Handle token revoked server-side**
  If the backend returns 401 on an OAuth request (token revoked by user in OpenAI settings),
  surface a re-connect prompt in the extension popup.
