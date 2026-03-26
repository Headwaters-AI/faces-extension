// Faces – Connect ChatGPT / background service worker

console.log("[Faces] Service worker started");

// Receives JWT from the content script (which reads it from the frontend's
// localStorage) and stores it locally so the OAuth exchange can use it.
chrome.runtime.onMessage.addListener((msg) => {
  console.log("[Faces] Message received:", msg.type);
  if (msg.type === "jwt" && msg.token) {
    console.log("[Faces] JWT stored (length:", msg.token.length, ")");
    chrome.storage.local.set({ jwt: msg.token });
  }
});

// Intercepts navigations to localhost:1455/auth/callback — the URL OpenAI
// redirects to after the user approves the connection. The tab is redirected
// away immediately (before any TCP connection is made to that port), then the
// OAuth code is exchanged via the Faces backend.
console.log("[Faces] Registering webNavigation listener for localhost:1455");
chrome.webNavigation.onBeforeNavigate.addListener(
  (details) => {
    console.log("[Faces] webNavigation fired:", details.url);
    handleCallback(details).catch((e) =>
      console.error("[Faces]", e)
    );
  },
  { url: [{ urlPrefix: "http://localhost:1455/auth/callback" }] }
);

// Also log ALL navigations to help debug
chrome.webNavigation.onBeforeNavigate.addListener((details) => {
  if (details.url.includes("localhost:1455") || details.url.includes("auth/callback")) {
    console.log("[Faces] DEBUG navigation detected:", details.url);
  }
});

// Fallback: watch for tab URL changes (catches client-side redirects)
chrome.tabs.onUpdated.addListener((tabId, changeInfo) => {
  if (changeInfo.url && changeInfo.url.startsWith("http://localhost:1455/auth/callback")) {
    console.log("[Faces] tabs.onUpdated caught callback URL:", changeInfo.url);
    handleCallback({ tabId, url: changeInfo.url }).catch((e) =>
      console.error("[Faces]", e)
    );
  }
});

async function handleCallback(details) {
  const url = new URL(details.url);
  const code = url.searchParams.get("code");
  const state = url.searchParams.get("state");
  if (!code || !state) return;

  // Redirect the tab immediately — supersedes the localhost:1455 navigation
  // before Chrome makes a TCP connection to that port.
  await chrome.tabs.update(details.tabId, {
    url: chrome.runtime.getURL("exchanging.html"),
  });

  const { jwt, api_base } = await chrome.storage.local.get(["jwt", "api_base"]);
  const base = (api_base || "https://api.faces.sh").replace(/\/$/, "");

  if (!jwt) {
    await chrome.tabs.update(details.tabId, {
      url: chrome.runtime.getURL("error.html") + "?reason=no_jwt",
    });
    return;
  }

  let r, data;
  try {
    r = await fetch(`${base}/v1/oauth/openai/exchange`, {
      method: "POST",
      headers: {
        Authorization: `Bearer ${jwt}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ code, state }),
    });
    data = await r.json();
  } catch (e) {
    console.error("[Faces] Exchange fetch error:", e);
    await chrome.storage.local.set({
      last_result: { ok: false, error: e.message, timestamp: new Date().toISOString() },
    });
    await chrome.tabs.update(details.tabId, {
      url: chrome.runtime.getURL("error.html") + `?reason=${encodeURIComponent(e.message)}`,
    });
    return;
  }

  await chrome.storage.local.set({
    last_result: {
      status: r.status,
      ok: r.ok && !!data.connected,
      error: data.detail || null,
      timestamp: new Date().toISOString(),
    },
  });

  if (r.ok) {
    // Notify any open Faces tabs so they can update without a reload.
    const facesTabPatterns = ["http://localhost:3000/*", "https://faces.sh/*"];
    const frontendTabs = await chrome.tabs.query({});
    for (const tab of frontendTabs) {
      const matchesFaces = facesTabPatterns.some(
        (p) => tab.url && tab.url.startsWith(p.replace("*", ""))
      );
      if (matchesFaces) {
        chrome.tabs.sendMessage(tab.id, { type: "oauth_connected", provider: "openai" })
          .catch(() => {});
      }
    }
    await chrome.tabs.remove(details.tabId);
  } else {
    await chrome.tabs.update(details.tabId, {
      url:
        chrome.runtime.getURL("error.html") +
        `?reason=${encodeURIComponent(data.detail || "exchange_failed")}`,
    });
  }
}
