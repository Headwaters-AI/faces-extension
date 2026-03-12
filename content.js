// Runs on the Faces frontend page.
//
// 1. Signals to the frontend that the extension is installed:
//    a) Sets a sessionStorage flag (synchronous, readable on page load)
//    b) Dispatches a CustomEvent (catches late-mounting listeners)
//
// 2. Syncs the auth token from localStorage to the extension background worker
//    so the OAuth exchange doesn't require manual JWT entry.
//
// 3. Listens for an "oauth_connected" message from the background worker
//    (sent after a successful token exchange) and re-dispatches it as a DOM
//    event so the frontend can react without a page reload.

// --- 1. Signal extension presence ---
sessionStorage.setItem("faces_extension_installed", "1");
window.dispatchEvent(new CustomEvent("faces:extension-ready", {
  detail: { version: chrome.runtime.getManifest().version }
}));

// --- 2. Sync JWT ---
const token = localStorage.getItem("auth_token");
if (token) {
  chrome.runtime.sendMessage({ type: "jwt", token });
}

// --- 3. Forward "oauth connected" from background → page ---
chrome.runtime.onMessage.addListener((msg) => {
  if (msg.type === "oauth_connected") {
    window.dispatchEvent(new CustomEvent("faces:oauth-connected", {
      detail: { provider: msg.provider }
    }));
  }
});
