document.addEventListener("DOMContentLoaded", async () => {
  const { jwt, api_base, last_result } = await chrome.storage.local.get([
    "jwt",
    "api_base",
    "last_result",
  ]);

  document.getElementById("jwt").value = jwt || "";
  document.getElementById("api_base").value = api_base || "https://api.faces.sh";

  renderStatus(last_result);

  document.getElementById("save").addEventListener("click", async () => {
    const jwt = document.getElementById("jwt").value.trim();
    const api_base = document.getElementById("api_base").value.trim();
    await chrome.storage.local.set({ jwt, api_base });
    const msg = document.getElementById("saved-msg");
    msg.style.display = "inline";
    setTimeout(() => (msg.style.display = "none"), 1500);
  });
});

function renderStatus(r) {
  const box = document.getElementById("status-box");
  if (!r) return;

  if (r.ok) {
    box.className = "status connected";
    const when = r.timestamp ? r.timestamp.slice(0, 19).replace("T", " ") : "";
    box.innerHTML = `
      <div class="status-row">✅ Connected to ChatGPT</div>
      ${r.scope ? `<div class="status-row" style="color:#555">scope: ${r.scope}</div>` : ""}
      ${when ? `<div class="status-row" style="color:#555">${when}</div>` : ""}
    `;
  } else {
    box.className = "status error";
    box.innerHTML = `
      <div class="status-row">❌ Not connected</div>
      ${r.error ? `<div class="status-row" style="color:#888">${r.error}</div>` : ""}
    `;
  }
}
