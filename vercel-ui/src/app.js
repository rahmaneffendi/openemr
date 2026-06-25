(function () {
  const MESSAGES = {
    configured: "Connected to OpenEMR backend.",
    missingBackend: "Set OPENEMR_BACKEND_URL in Vercel to connect this login page."
  };

  const config = window.OPENEMR_VERCEL_UI_CONFIG || {};
  const backendUrl = cleanUrl(config.backendUrl);
  const nodes = {
    form: getNode("login_form"),
    message: getNode("backend-message"),
    password: getNode("clearPass"),
    passwordToggle: getNode("password-toggle"),
    loginButton: getNode("login-button")
  };

  if (backendUrl) {
    nodes.form.action = `${backendUrl}/interface/main/main_screen.php?auth=login&site=default`;
    nodes.message.textContent = MESSAGES.configured;
  } else {
    nodes.loginButton.disabled = true;
    nodes.message.textContent = MESSAGES.missingBackend;
  }

  nodes.passwordToggle.addEventListener("click", togglePassword);

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

  function togglePassword() {
    const isPassword = nodes.password.type === "password";
    nodes.password.type = isPassword ? "text" : "password";
    nodes.passwordToggle.textContent = isPassword ? "Hide" : "Show";
    nodes.passwordToggle.setAttribute("aria-label", isPassword ? "Hide password" : "Show password");
  }
})();
