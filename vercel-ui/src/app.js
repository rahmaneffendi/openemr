(function () {
  const DEFAULT_APP_NAME = "OpenEMR";
  const DEFAULT_ENVIRONMENT = "local";
  const MESSAGES = {
    configured: "Frontend ini berjalan di Vercel; proses login dan data klinis tetap lewat backend OpenEMR.",
    missingBackend: "Set env OPENEMR_BACKEND_URL di Vercel, misalnya https://openemr.example.com."
  };
  const ROUTES = [
    { id: "open-main", path: "" },
    { id: "open-login", path: "/interface/login/login.php?site=default" },
    { id: "open-portal", path: "/portal/index.php" },
    { id: "open-api", path: "/swagger/" }
  ];

  const config = window.OPENEMR_VERCEL_UI_CONFIG || {};
  const backendUrl = cleanUrl(config.backendUrl);
  const appName = config.appName || DEFAULT_APP_NAME;
  const deploymentEnvironment = config.deploymentEnvironment || DEFAULT_ENVIRONMENT;

  const nodes = {
    appTitle: getNode("app-title"),
    environmentPill: getNode("environment-pill"),
    deploymentStatus: getNode("deployment-status"),
    backendUrl: getNode("backend-url"),
    helperCopy: getNode("helper-copy")
  };

  nodes.appTitle.textContent = `${appName} UI`;
  nodes.environmentPill.textContent = deploymentEnvironment;
  nodes.deploymentStatus.textContent = backendUrl ? "Vercel UI connected" : "Vercel UI";
  nodes.backendUrl.textContent = backendUrl || "Belum dikonfigurasi";
  nodes.helperCopy.textContent = backendUrl ? MESSAGES.configured : MESSAGES.missingBackend;

  if (backendUrl) {
    ROUTES.forEach((route) => enableLink(route.id, backendUrl + route.path));
  }

  function cleanUrl(value) {
    return String(value || "").replace(/\/+$/, "");
  }

  function getNode(id) {
    const node = document.getElementById(id);
    if (!node) {
      throw new Error(`Missing required element: #${id}`);
    }
    return node;
  }

  function enableLink(id, href) {
    const link = getNode(id);
    link.href = href;
    link.classList.remove("disabled");
    link.removeAttribute("aria-disabled");
  }
})();
