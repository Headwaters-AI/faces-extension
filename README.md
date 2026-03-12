# Faces – Connect ChatGPT

A Chrome extension that lets you connect your own ChatGPT Plus or Pro account to [Faces](https://faces.ai), so that AI requests on your Connect plan route through your own subscription.

---

## How it works

When you click "Connect ChatGPT" in Faces, OpenAI's standard OAuth 2.0 login flow opens. You log in and approve access directly on OpenAI's own page. The extension then completes the authorization on your behalf and links your account to Faces.

The extension uses the same OAuth mechanism as [OpenAI's Codex CLI](https://github.com/openai/codex), an open-source tool published by OpenAI. No passwords are involved. Access can be revoked at any time from your [OpenAI account settings](https://platform.openai.com/settings).

---

## Terms and responsibility

This extension is a technical integration tool. **By installing and using it, you accept full responsibility for ensuring your use complies with [OpenAI's Terms of Use](https://openai.com/policies/terms-of-use) and all applicable policies.**

Faces provides this extension as-is, without warranty. What you route through your connected account, and for what purposes, is entirely your own decision. Headwaters AI is not affiliated with, endorsed by, or in any way certified by OpenAI.

---

## Privacy

- Your OpenAI access token is transmitted to the Faces backend over HTTPS and stored encrypted. It is used solely to forward requests you make through Faces.
- Your Faces login token is read from your browser's local storage and stored locally in the extension. It is never sent to any third party.
- No data is sold or shared beyond what is necessary to operate the service.

---

## Install

> **Note:** This extension is currently awaiting Chrome Web Store review. Until it's listed there, you'll need to install it manually. **Developer mode must stay enabled** — if you disable it, Chrome will disable all manually-installed extensions.

**1. Download the latest release**

Go to the [Releases page](https://github.com/headwaters-ai/faces-extension/releases/latest) and download `faces-extension-v0.1.0.zip`.

**2. Unzip**

Extract the zip file to any permanent folder on your computer (e.g. `~/Downloads/faces-extension`). Don't delete the folder after loading — Chrome reads from it.

**3. Load in Chrome**

1. Open `chrome://extensions`
2. Enable **Developer mode** (toggle in the top-right corner)
3. Click **Load unpacked**
4. Select the folder you unzipped

**4. Pin the extension**

Click the puzzle icon in your toolbar and pin "Faces – Connect ChatGPT" for easy access.

---

## Usage

No manual setup is required. Once installed, the extension reads your Faces login automatically when you're on the Faces app.

**To connect your ChatGPT account:**

1. Log in to Faces
2. Go to **Settings → Connect ChatGPT** (or follow the connect prompt on your dashboard)
3. Click **Connect** — an OpenAI authorization page opens
4. Approve the access request on OpenAI's page
5. You're done — the tab closes and Faces updates automatically

**To disconnect:**

Go to Settings → Connected accounts in Faces and click Disconnect. You can also revoke access from your [OpenAI account settings](https://platform.openai.com/settings) at any time.

---

## This release: local development only

Version 0.1.0 supports local Faces instances (`localhost:3000` + `localhost:8000`). Production URL support will be included in the Chrome Web Store release.

If you're running Faces locally and want to test, the extension works out of the box.

---

## Troubleshooting

| Symptom | What to do |
|---|---|
| Extension icon missing after install | Make sure Developer mode is on in `chrome://extensions` |
| Extension was disabled | Re-enable Developer mode — Chrome disables manually-installed extensions when it's off |
| "Not connected" shown in popup after approving | Log in to Faces first, then try connecting again |
| "Invalid or expired state" error | The authorization took longer than 5 minutes — click Connect in Faces and try again |
| Connection tab stuck on "Connecting..." | Open `chrome://extensions` → find Faces → click "Service Worker" to inspect for errors |

---

## Developer settings

Click the extension icon and expand **Developer settings** to override:

- **Backend URL** — change if your Faces backend runs on a different port (default: `http://localhost:8000`)
- **JWT override** — normally the extension reads your login token automatically; use this if auto-sync isn't working

---

## Chrome Web Store

This extension is pending review. Once approved, you'll be able to install it directly from the Web Store without Developer mode.

---

## License

MIT — see [LICENSE](LICENSE).
