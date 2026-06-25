(function () {
  const config = window.OPENEMR_VERCEL_UI_CONFIG || {};
  const backendUrl = cleanUrl(config.backendUrl);
  const appName = config.appName || "OpenEMR";
  const deploymentEnvironment = config.deploymentEnvironment || "local";

  const appTitle = document.getElementById("app-title");
  const environmentPill = document.getElementById("environment-pill");
  const deploymentStatus = document.getElementById("deployment-status");
  const backendUrlNode = document.getElementById("backend-url");
  const helperCopy = document.getElementById("helper-copy");

  appTitle.textContent = `${appName} UI`;
  environmentPill.textContent = deploymentEnvironment;
  deploymentStatus.textContent = backendUrl ? "Vercel UI connected" : "Vercel UI";
  backendUrlNode.textContent = backendUrl || "Belum dikonfigurasi";

  const links = [
    ["open-main", ""],
    ["open-login", "/interface/login/login.php?site=default"],
    ["open-portal", "/portal/index.php"],
    ["open-api", "/swagger/"]
  ];

  if (backendUrl) {
    links.forEach(([id, path]) => enableLink(id, backendUrl + path));
    helperCopy.textContent = "Frontend ini berjalan di Vercel; proses login dan data klinis tetap lewat backend OpenEMR.";
  }

  function cleanUrl(value) {
    return String(value || "").replace(/\/+$/, "");
  }

  function enableLink(id, href) {
    const link = document.getElementById(id);
    link.href = href;
    link.classList.remove("disabled");
    link.removeAttribute("aria-disabled");
  }
})();
