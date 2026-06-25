(function () {
  const menu = [
    ["Calendar", [["Calendar", "calendar"], ["Flow Board", "flow-board"], ["Messages", "messages"]]],
    ["Patient/Client", [["Patients", "patients"], ["New/Search", "patient-search"], ["Summary", "patient-summary"], ["Visits", "encounter"], ["Documents", "documents"], ["Transactions", "transactions"]]],
    ["Fees", [["Billing", "billing"], ["Checkout", "checkout"], ["Payments", "payments"], ["Claims", "claims"]]],
    ["Modules", [["Rx", "rx"], ["Clinical Rules", "rules"], ["Telehealth", "telehealth"], ["Patient Portal", "portal"]]],
    ["Procedures", [["Pending Review", "procedures"], ["Configuration", "procedure-config"]]],
    ["Administration", [["Users", "users"], ["Facilities", "facilities"], ["Practice", "practice"], ["Globals", "globals"], ["Lists", "lists"], ["Layouts", "layouts"]]],
    ["Reports", [["Clients", "reports-patient"], ["Visits", "reports-visits"], ["Financial", "reports-financial"], ["Clinical", "reports-clinical"]]],
    ["Miscellaneous", [["Batch Communication", "batch"], ["Authorizations", "authorizations"], ["Backup", "backup"], ["About", "about"]]]
  ];
  const labels = Object.fromEntries(menu.flatMap(([, items]) => items.map(([label, view]) => [view, label])));
  Object.assign(labels, {
    calendar: "Calendar",
    "patient-summary": "Medical Record Dashboard",
    encounter: "Encounter",
    about: "About OpenEMR"
  });
  const patients = {
    jane: { name: "Jane Sample", dob: "1984-04-16", age: "42", pid: "1001", phone: "(555) 221-4412", provider: "Dr. Smith", balance: "$42.00" },
    john: { name: "John Appleseed", dob: "1979-11-02", age: "46", pid: "1002", phone: "(555) 991-0101", provider: "Dr. Miller", balance: "$0.00" }
  };
  const tabs = [{ id: "calendar", title: "Calendar", locked: true }, { id: "messages", title: "Messages", locked: false }];
  let activeTab = "calendar";
  let selectedPatient = "jane";

  const nodes = {
    loginView: getNode("login-view"),
    appView: getNode("app-view"),
    loginForm: getNode("login_form"),
    password: getNode("clearPass"),
    passwordToggle: getNode("password-toggle"),
    menu: getNode("main-menu"),
    content: getNode("content"),
    tabs: getNode("tabs"),
    searchForm: getNode("global-search-form"),
    searchInput: getNode("anySearchBox"),
    attendantData: getNode("attendantData")
  };

  nodes.loginForm.addEventListener("submit", (event) => {
    event.preventDefault();
    nodes.loginView.classList.add("is-hidden");
    nodes.appView.classList.remove("is-hidden");
    openTab("calendar");
  });
  nodes.passwordToggle.addEventListener("click", togglePassword);
  getNode("logout-button").addEventListener("click", logout);
  getNode("menu-toggle").addEventListener("click", () => getNode("mainMenu").classList.toggle("show"));
  getNode("patient-caret").addEventListener("click", function () {
    nodes.attendantData.classList.toggle("is-collapsed");
    this.textContent = nodes.attendantData.classList.contains("is-collapsed") ? "▼" : "▲";
  });
  getNode("clear-patient").addEventListener("click", () => {
    selectedPatient = null;
    renderPatientStrip();
    openTab("patients");
  });
  nodes.searchForm.addEventListener("submit", (event) => {
    event.preventDefault();
    openTab("patient-search");
  });
  document.addEventListener("click", handleDocumentClick);

  renderMenu();
  renderPatientStrip();
  renderTabs();
  renderContent();

  function renderMenu() {
    nodes.menu.innerHTML = menu.map(([section, items]) => `
      <div class="menuSection dropdown">
        <button class="menuLabel px-1 dropdown-toggle oe-dropdown-toggle" type="button">${section}</button>
        <ul class="menuEntries dropdown-menu rounded-0 border-0">
          ${items.map(([label, view]) => `<li><button class="dropdown-item" type="button" data-action="open-tab" data-view="${view}">${label}</button></li>`).join("")}
        </ul>
      </div>
    `).join("");
  }

  function renderTabs() {
    nodes.tabs.innerHTML = `
      <div class="tabsNoHover w-1"><span class="menu_arrow">▲</span></div>
      ${tabs.map((tab) => `
        <button class="tabSpan bgcolor2 ${tab.id === activeTab ? "active" : ""}" type="button" data-action="activate-tab" data-view="${tab.id}">
          <span class="tabTitle pr-2">${tab.title}</span><span class="fa">↻</span><span class="fa">${tab.locked ? "🔒" : "🔓"}</span>
          ${tab.locked ? "" : `<span class="fa" data-action="close-tab" data-view="${tab.id}">×</span>`}
        </button>
      `).join("")}
      <div class="tabsNoHover w-100"></div>
    `;
  }

  function renderPatientStrip() {
    const strip = nodes.attendantData.querySelector(".patient-strip");
    const summary = strip.querySelector(".patient-summary");
    if (!selectedPatient) {
      strip.classList.add("no-patient");
      summary.innerHTML = `<strong>No Patient Selected</strong><span>Use the global search or Patient/Client menu to select a chart.</span>`;
      return;
    }
    const patient = patients[selectedPatient];
    strip.classList.remove("no-patient");
    summary.innerHTML = `
      <a href="#" class="ptName" data-action="open-tab" data-view="patient-summary">${patient.name}</a>
      <span>DOB: ${patient.dob}</span><span>Age: ${patient.age}</span><span>PID: ${patient.pid}</span>
    `;
  }

  function openTab(view) {
    const title = labels[view] || view;
    if (!tabs.some((tab) => tab.id === view)) tabs.push({ id: view, title, locked: false });
    activeTab = view;
    renderTabs();
    renderContent();
  }

  function closeTab(view) {
    const index = tabs.findIndex((tab) => tab.id === view);
    if (index === -1 || tabs[index].locked) return;
    tabs.splice(index, 1);
    activeTab = tabs[Math.max(0, index - 1)].id;
    renderTabs();
    renderContent();
  }

  function renderContent() {
    nodes.content.innerHTML = getView(activeTab);
  }

  function getView(view) {
    const patient = selectedPatient ? patients[selectedPatient] : null;
    if (view === "calendar") return calendarView();
    if (view === "flow-board") return flowBoardView();
    if (view === "messages") return messagesView();
    if (view === "patients" || view === "patient-search") return patientSearchView();
    if (view === "patient-summary") return patientSummaryView(patient);
    if (view === "encounter") return encounterView(patient);
    if (view === "documents") return documentsView(patient);
    if (["billing", "checkout", "payments", "claims"].includes(view)) return financialView(view, patient);
    if (["users", "facilities", "practice", "globals", "lists", "layouts"].includes(view)) return adminView(view);
    if (view.startsWith("reports-")) return reportsView(view);
    if (view === "about") return aboutView();
    return genericView(view);
  }

  function calendarView() {
    return `<div class="page-heading"><h2>Calendar</h2><div class="toolbar"><button class="btn btn-primary btn-sm">Today</button><button class="btn btn-secondary btn-sm">Day</button><button class="btn btn-secondary btn-sm">Week</button><button class="btn btn-secondary btn-sm">Month</button><button class="btn btn-primary btn-sm" data-action="open-tab" data-view="encounter">Add Event</button></div></div>
      <div class="calendar-grid">${["Mon", "Tue", "Wed", "Thu", "Fri"].map((day, index) => `<div class="calendar-day"><header>${day}</header><button class="appt" data-action="select-patient" data-patient="${index % 2 ? "john" : "jane"}">${9 + index}:00 ${index % 2 ? "John Appleseed" : "Jane Sample"}<br><small>Office Visit</small></button><button class="appt muted">13:30 Follow-up<br><small>Room ${index + 1}</small></button></div>`).join("")}</div>`;
  }

  function flowBoardView() {
    return `<div class="page-heading"><h2>Flow Board</h2><button class="btn btn-primary btn-sm">Refresh</button></div><table class="table"><thead><tr><th>Time</th><th>Patient</th><th>Status</th><th>Room</th><th>Provider</th></tr></thead><tbody><tr><td>09:00</td><td><button class="link-button" data-action="select-patient" data-patient="jane">Jane Sample</button></td><td><span class="badge badge-info">Arrived</span></td><td>1</td><td>Dr. Smith</td></tr><tr><td>10:15</td><td><button class="link-button" data-action="select-patient" data-patient="john">John Appleseed</button></td><td><span class="badge badge-warning">Waiting</span></td><td>2</td><td>Dr. Miller</td></tr></tbody></table>`;
  }

  function messagesView() {
    return `<div class="page-heading"><h2>Messages</h2><button class="btn btn-primary btn-sm">Add</button></div><div class="card-grid"><article class="card"><h3>Patient Reminder</h3><p>Jane Sample needs lab follow-up review.</p><button class="btn btn-secondary btn-sm">Open</button></article><article class="card"><h3>Portal Message</h3><p>John Appleseed requested appointment confirmation.</p><button class="btn btn-secondary btn-sm">Open</button></article></div>`;
  }

  function patientSearchView() {
    return `<div class="page-heading"><h2>Patient Finder</h2><button class="btn btn-primary btn-sm">New Patient</button></div><div class="search-panel"><input class="form-control" placeholder="Name, DOB, phone, or PID" value="${escapeHtml(nodes.searchInput.value)}"><button class="btn btn-primary">Search</button></div><table class="table"><thead><tr><th>Name</th><th>DOB</th><th>PID</th><th>Provider</th><th></th></tr></thead><tbody>${Object.entries(patients).map(([id, patient]) => `<tr><td>${patient.name}</td><td>${patient.dob}</td><td>${patient.pid}</td><td>${patient.provider}</td><td><button class="btn btn-sm btn-primary" data-action="select-patient" data-patient="${id}">Select</button></td></tr>`).join("")}</tbody></table>`;
  }

  function patientSummaryView(patient) {
    if (!patient) return noPatientView();
    return `<div class="page-heading"><h2>Medical Record Dashboard</h2><button class="btn btn-primary btn-sm" data-action="open-tab" data-view="encounter">Create Visit</button></div><div class="dashboard-layout"><article class="card patient-card"><h3>${patient.name}</h3><p>DOB ${patient.dob} · PID ${patient.pid}</p><p>Phone ${patient.phone}</p><p>Provider ${patient.provider}</p></article><article class="card"><h3>Issues</h3><ul><li>Hypertension</li><li>Seasonal allergies</li></ul></article><article class="card"><h3>Medications</h3><ul><li>Lisinopril 10mg</li><li>Vitamin D</li></ul></article><article class="card"><h3>Billing</h3><p>Patient Balance Due</p><strong>${patient.balance}</strong></article><article class="card wide"><h3>Recent Encounters</h3><table class="table compact"><tbody><tr><td>2026-06-20</td><td>Office Visit</td><td>Signed</td></tr><tr><td>2026-05-12</td><td>Follow-up</td><td>Reviewed</td></tr></tbody></table></article></div>`;
  }

  function encounterView(patient) {
    if (!patient) return noPatientView();
    return `<div class="page-heading"><h2>Encounter</h2><button class="btn btn-success btn-sm">Sign</button></div><nav class="subnav"><button>Issues</button><button>Forms</button><button>Fee Sheet</button><button>Clinical</button><button>Administrative</button></nav><div class="form-card"><h3>SOAP Note</h3><label>Chief Complaint</label><textarea class="form-control">Follow-up visit for ${patient.name}.</textarea><label>Assessment</label><textarea class="form-control">Stable. Continue current plan.</textarea><label>Plan</label><textarea class="form-control">Return in 3 months.</textarea></div>`;
  }

  function documentsView(patient) {
    if (!patient) return noPatientView();
    return `<div class="page-heading"><h2>Documents</h2><button class="btn btn-primary btn-sm">Upload</button></div><div class="two-column"><aside class="tree"><strong>Categories</strong><button>Patient Information</button><button>Lab Report</button><button>Insurance</button><button>Images</button></aside><table class="table"><thead><tr><th>Document</th><th>Date</th><th>Status</th></tr></thead><tbody><tr><td>Insurance Card</td><td>2026-06-01</td><td>Current</td></tr><tr><td>Lab Results</td><td>2026-05-17</td><td>Reviewed</td></tr></tbody></table></div>`;
  }

  function financialView(view, patient) {
    return `<div class="page-heading"><h2>${labels[view]}</h2><button class="btn btn-primary btn-sm">Post</button></div><table class="table"><thead><tr><th>Date</th><th>Patient</th><th>Code</th><th>Description</th><th>Amount</th></tr></thead><tbody><tr><td>2026-06-20</td><td>${patient ? patient.name : "Jane Sample"}</td><td>99213</td><td>Office outpatient visit</td><td>$125.00</td></tr><tr><td>2026-06-20</td><td>${patient ? patient.name : "Jane Sample"}</td><td>81002</td><td>Urinalysis</td><td>$18.00</td></tr></tbody></table>`;
  }

  function adminView(view) {
    return `<div class="page-heading"><h2>${labels[view]}</h2><button class="btn btn-primary btn-sm">Add</button></div><div class="settings-grid"><label>Search <input class="form-control"></label><label>Status <select class="form-control"><option>Active</option><option>Inactive</option></select></label><label>Default Facility <input class="form-control" value="Your Clinic Name Here"></label></div><table class="table"><thead><tr><th>Name</th><th>Type</th><th>Status</th></tr></thead><tbody><tr><td>Default</td><td>${labels[view]}</td><td>Active</td></tr><tr><td>Example Row</td><td>Configuration</td><td>Active</td></tr></tbody></table>`;
  }

  function reportsView(view) {
    return `<div class="page-heading"><h2>${labels[view]}</h2><button class="btn btn-primary btn-sm">Run Report</button></div><div class="settings-grid"><label>From <input class="form-control" type="date" value="2026-06-01"></label><label>To <input class="form-control" type="date" value="2026-06-25"></label><label>Provider <select class="form-control"><option>All</option><option>Dr. Smith</option></select></label></div><table class="table"><thead><tr><th>Metric</th><th>Count</th><th>Total</th></tr></thead><tbody><tr><td>Visits</td><td>24</td><td>-</td></tr><tr><td>Charges</td><td>18</td><td>$2,384.00</td></tr></tbody></table>`;
  }

  function genericView(view) {
    return `<div class="page-heading"><h2>${labels[view] || view}</h2><button class="btn btn-primary btn-sm">Action</button></div><div class="card-grid"><article class="card"><h3>${labels[view] || view}</h3><p>This is a static frontend-only demo surface for this OpenEMR workflow.</p></article><article class="card"><h3>Typical Controls</h3><p>Buttons, tables, filters, and tabs are clickable for exploration.</p><button class="btn btn-secondary btn-sm">Open Dialog</button></article></div>`;
  }

  function aboutView() {
    return `<div class="page-heading"><h2>About OpenEMR</h2></div><article class="card"><h3>OpenEMR</h3><p>Free and Open Source electronic health records and medical practice management application.</p><p>This Vercel build is a frontend-only prototype using static demo data.</p></article>`;
  }

  function noPatientView() {
    return `<div class="empty-state"><h2>No Patient Selected</h2><p>Select a patient from Patient Finder or Calendar to explore chart workflows.</p><button class="btn btn-primary" data-action="open-tab" data-view="patient-search">Find Patient</button></div>`;
  }

  function handleDocumentClick(event) {
    const target = event.target.closest("[data-action]");
    if (!target) return;
    const action = target.dataset.action;
    if (action === "open-tab") openTab(target.dataset.view);
    if (action === "activate-tab") {
      activeTab = target.dataset.view;
      renderTabs();
      renderContent();
    }
    if (action === "close-tab") {
      event.stopPropagation();
      closeTab(target.dataset.view);
    }
    if (action === "select-patient") {
      event.preventDefault();
      selectedPatient = target.dataset.patient;
      renderPatientStrip();
      openTab("patient-summary");
    }
  }

  function togglePassword() {
    const isPassword = nodes.password.type === "password";
    nodes.password.type = isPassword ? "text" : "password";
    nodes.passwordToggle.textContent = isPassword ? "Hide" : "Show";
    nodes.passwordToggle.setAttribute("aria-label", isPassword ? "Hide password" : "Show password");
  }

  function logout() {
    nodes.appView.classList.add("is-hidden");
    nodes.loginView.classList.remove("is-hidden");
  }

  function getNode(id) {
    const node = document.getElementById(id);
    if (!node) throw new Error(`Missing required element: #${id}`);
    return node;
  }

  function escapeHtml(value) {
    return String(value).replace(/[&<>"']/g, (char) => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", "\"": "&quot;", "'": "&#039;" })[char]);
  }
})();
