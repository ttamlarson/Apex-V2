/* Apex Protocol update manager
 * Users keep the same homescreen installation. Updates are staged by the
 * service worker and only activated after the user taps Update.
 */
(() => {
  const APP_VERSION = "2.0.1";
  let registration = null;
  let reloading = false;

  function ensureUI() {
    if (document.getElementById("apex-update-banner")) return;
    const banner = document.createElement("section");
    banner.id = "apex-update-banner";
    banner.setAttribute("role", "status");
    banner.setAttribute("aria-live", "polite");
    banner.style.cssText = [
      "position:fixed","left:12px","right:12px","bottom:calc(12px + env(safe-area-inset-bottom))",
      "z-index:9999","display:none","align-items:center","justify-content:space-between",
      "gap:12px","padding:13px 14px","border:1px solid #4c555f","border-radius:15px",
      "background:#191d22","color:#f3f4f6","box-shadow:0 12px 40px rgba(0,0,0,.45)",
      "font:14px/1.35 system-ui,-apple-system,sans-serif"
    ].join(";");
    banner.innerHTML = `
      <div style="min-width:0">
        <strong style="display:block">Apex update available</strong>
        <span id="apex-update-copy" style="display:block;color:#b8c0c9;font-size:12px;margin-top:3px">A new version is ready to install.</span>
      </div>
      <div style="display:flex;gap:7px;flex-shrink:0">
        <button id="apex-update-later" type="button" style="border:1px solid #4c555f;background:#252a30;color:#f3f4f6;border-radius:9px;padding:9px 11px;font-weight:650">Later</button>
        <button id="apex-update-now" type="button" style="border:0;background:#d8dde3;color:#101114;border-radius:9px;padding:9px 11px;font-weight:800">Update</button>
      </div>`;
    document.body.appendChild(banner);
    document.getElementById("apex-update-later").addEventListener("click", () => {
      banner.style.display = "none";
    });
    document.getElementById("apex-update-now").addEventListener("click", applyUpdate);
  }

  function addVersionLabel() {
    const footer = document.querySelector("footer");
    if (!footer || document.getElementById("apex-version-label")) return;
    const label = document.createElement("div");
    label.id = "apex-version-label";
    label.textContent = "Apex Protocol v" + APP_VERSION;
    label.style.cssText = "margin-top:7px;color:#9299a2;font-size:10px;letter-spacing:.04em";
    footer.appendChild(label);
  }

  function showUpdate() {
    ensureUI();
    document.getElementById("apex-update-copy").textContent =
      "Your saved data stays on this device. Install when you're ready.";
    document.getElementById("apex-update-banner").style.display = "flex";
  }

  function applyUpdate() {
    const activeTraining = document.querySelector("#training.view.active");
    const exerciseList = document.querySelector("#exercises");
    if (activeTraining && exerciseList && exerciseList.children.length > 0) {
      document.getElementById("apex-update-copy").textContent =
        "Save or clear your current workout before updating, so unsaved entries aren't lost.";
      return;
    }
    if (!registration || !registration.waiting) return;
    const button = document.getElementById("apex-update-now");
    button.disabled = true;
    button.textContent = "Updating…";
    registration.waiting.postMessage({ type: "SKIP_WAITING" });
  }

  function watchInstalling(worker) {
    if (!worker) return;
    worker.addEventListener("statechange", () => {
      if (worker.state === "installed" && navigator.serviceWorker.controller) showUpdate();
    });
  }

  function init(reg) {
    registration = reg;
    addVersionLabel();
    if (reg.waiting && navigator.serviceWorker.controller) showUpdate();
    if (reg.installing) watchInstalling(reg.installing);
    reg.addEventListener("updatefound", () => watchInstalling(reg.installing));

    navigator.serviceWorker.addEventListener("controllerchange", () => {
      if (reloading) return;
      reloading = true;
      window.location.reload();
    });

    const checkForUpdate = () => {
      if (document.visibilityState === "visible") reg.update().catch(() => {});
    };
    checkForUpdate();
    window.setInterval(checkForUpdate, 30 * 60 * 1000);
    document.addEventListener("visibilitychange", checkForUpdate);
  }

  window.ApexUpdateManager = { init, version: APP_VERSION };
})();
