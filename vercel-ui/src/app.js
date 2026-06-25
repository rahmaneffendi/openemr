(function () {
  const patients = {
    jane: { id: "jane", name: "Jane Sample", dob: "1984-04-16", age: 42, pid: "1001", phone: "(555) 221-4412", provider: "Dr. Smith", risk: "Medium", balance: "$42.00" },
    john: { id: "john", name: "John Appleseed", dob: "1979-11-02", age: 46, pid: "1002", phone: "(555) 991-0101", provider: "Dr. Miller", risk: "Low", balance: "$0.00" }
  };
  const navItems = [["dashboard", "Dashboard"], ["calendar", "Calendar"], ["patients", "Patients"], ["patient-summary", "Patient Chart"], ["encounter", "Encounter"], ["documents", "Documents"], ["billing", "Billing"], ["reports", "Reports"], ["admin", "Admin"], ["messages", "Messages"]];
  const icons = {
    dashboard: '<svg viewBox="0 0 24 24" aria-hidden="true"><path d="M4 13h6V4H4v9Zm10 7h6V4h-6v16ZM4 20h6v-4H4v4Z"/></svg>',
    calendar: '<svg viewBox="0 0 24 24" aria-hidden="true"><path d="M7 3v3m10-3v3M4 9h16M5 5h14v15H5V5Zm3 8h3v3H8v-3Z"/></svg>',
    patients: '<svg viewBox="0 0 24 24" aria-hidden="true"><path d="M8 11a4 4 0 1 0 0-8 4 4 0 0 0 0 8Zm8 2a3 3 0 1 0 0-6 3 3 0 0 0 0 6ZM3 21c.6-4 3-6 5-6s4.4 2 5 6H3Zm10-2c.7-2 2-3 3.5-3 1.7 0 3.1 1.3 3.5 3h-7Z"/></svg>',
    "patient-summary": '<svg viewBox="0 0 24 24" aria-hidden="true"><path d="M6 3h9l3 3v15H6V3Zm8 1v4h4M8 12h8M8 16h5M11 9v6m-3-3h6"/></svg>',
    encounter: '<svg viewBox="0 0 24 24" aria-hidden="true"><path d="M12 21s7-4.5 7-11a7 7 0 0 0-14 0c0 6.5 7 11 7 11Zm0-14v6m-3-3h6"/></svg>',
    documents: '<svg viewBox="0 0 24 24" aria-hidden="true"><path d="M6 3h8l4 4v14H6V3Zm8 0v5h4M8 12h8M8 16h8M8 8h3"/></svg>',
    billing: '<svg viewBox="0 0 24 24" aria-hidden="true"><path d="M5 4h14v16H5V4Zm4 4h6M9 12h6M9 16h3M17 8v10"/></svg>',
    reports: '<svg viewBox="0 0 24 24" aria-hidden="true"><path d="M5 20V4h14v16H5Zm4-4v-5m3 5V8m3 8v-3M8 18h8"/></svg>',
    admin: '<svg viewBox="0 0 24 24" aria-hidden="true"><path d="M12 15a3 3 0 1 0 0-6 3 3 0 0 0 0 6Zm0 6 2-3 3.5.5-.5-3.5 3-2-3-2 .5-3.5-3.5.5-2-3-2 3-3.5-.5.5 3.5-3 2 3 2-.5 3.5 3.5-.5 2 3Z"/></svg>',
    messages: '<svg viewBox="0 0 24 24" aria-hidden="true"><path d="M4 5h16v11H8l-4 4V5Zm4 5h8M8 13h5"/></svg>'
  };
  const labels = Object.fromEntries(navItems);
  const state = { activeView: "dashboard", selectedPatient: "jane", tabs: ["dashboard", "calendar"] };
  const loginView = getNode("login-view");
  const appView = getNode("app-view");
  const loginForm = getNode("login_form");
  const password = getNode("clearPass");
  const passwordToggle = getNode("password-toggle");

  passwordToggle.addEventListener("click", function () {
    const showing = password.type === "text";
    password.type = showing ? "password" : "text";
    passwordToggle.textContent = showing ? "Show" : "Hide";
  });

  loginForm.addEventListener("submit", function (event) {
    event.preventDefault();
    loginView.classList.add("is-hidden");
    appView.classList.remove("is-hidden");
    renderShell();
  });

  function renderShell() {
    appView.className = "modern-shell";
    appView.innerHTML = `
      <aside class="sidebar">
        <div class="sidebar-brand"><img src="/assets/menu-logo.svg" alt="OpenEMR"><span>OpenEMR</span></div>
        <nav class="side-nav" id="side-nav">${navItems.map(([id, label]) => `<button class="side-link ${state.activeView === id ? "active" : ""}" type="button" data-action="go" data-view="${id}"><span class="side-icon">${icons[id]}</span><span>${label}</span></button>`).join("")}</nav>
        <div class="sidebar-footer"><strong>Demo Clinic</strong><span>Frontend prototype</span></div>
      </aside>
      <section class="workspace">
        <header class="topbar">
          <button class="icon-button menu-button" type="button" data-action="toggle-menu">Menu</button>
          <form id="global-search-form" class="search-form"><input class="form-control" type="search" placeholder="Search patients, visits, claims"></form>
          <button class="ghost-button icon-label" type="button" data-action="go" data-view="messages">${icons.messages}<span>Messages</span></button>
          <div class="user-chip"><span class="avatar">AD</span><span>Administrator</span></div>
          <button class="ghost-button" type="button" data-action="logout">Logout</button>
        </header>
        ${patientRibbon()}
        <div class="tabs">${state.tabs.map((view) => `<button class="tab ${state.activeView === view ? "active" : ""}" type="button" data-action="go" data-view="${view}">${labels[view] || view}</button>`).join("")}</div>
        <main class="content" id="content">${viewMarkup(state.activeView)}</main>
      </section>`;
    appView.querySelector("#global-search-form").addEventListener("submit", function (event) { event.preventDefault(); go("patients"); });
    appView.addEventListener("click", handleAppClick, { once: true });
  }

  function handleAppClick(event) {
    const target = event.target.closest("[data-action]");
    if (!target) { appView.addEventListener("click", handleAppClick, { once: true }); return; }
    const action = target.dataset.action;
    if (action === "go") go(target.dataset.view);
    if (action === "select-patient") { state.selectedPatient = target.dataset.patient; go("patient-summary"); }
    if (action === "clear-patient") { state.selectedPatient = null; go("patients"); }
    if (action === "logout") { appView.classList.add("is-hidden"); loginView.classList.remove("is-hidden"); }
    if (action === "toggle-menu") appView.classList.toggle("sidebar-open");
    appView.addEventListener("click", handleAppClick, { once: true });
  }

  function go(view) { state.activeView = view; if (!state.tabs.includes(view)) state.tabs.push(view); renderShell(); }

  function patientRibbon() {
    const patient = state.selectedPatient ? patients[state.selectedPatient] : null;
    if (!patient) return `<section class="patient-ribbon empty"><div><span class="eyebrow">No active chart</span><strong>Select a patient to start chart workflows</strong></div><button class="ghost-button" type="button" data-action="go" data-view="patients">Find Patient</button></section>`;
    return `<section class="patient-ribbon"><img src="/assets/patient-picture-default.png" alt="" class="patient-photo"><div class="patient-summary"><span class="eyebrow">Active chart</span><button class="patient-name" type="button" data-action="go" data-view="patient-summary">${patient.name}</button><span>DOB ${patient.dob}</span><span>PID ${patient.pid}</span><span>${patient.provider}</span></div><div class="patient-actions"><button class="ghost-button" data-action="go" data-view="patient-summary" type="button">Chart</button><button class="ghost-button" data-action="go" data-view="encounter" type="button">Encounter</button><button class="ghost-button" data-action="go" data-view="documents" type="button">Documents</button><button class="ghost-button" data-action="clear-patient" type="button">Close</button></div></section>`;
  }

  function viewMarkup(view) {
    const patient = state.selectedPatient ? patients[state.selectedPatient] : null;
    if (view === "dashboard") return dashboardView();
    if (view === "calendar") return calendarView();
    if (view === "patients") return patientsView();
    if (view === "patient-summary") return patient ? patientChartView(patient) : emptyPatientView();
    if (view === "encounter") return patient ? encounterView(patient) : emptyPatientView();
    if (view === "documents") return patient ? documentsView(patient) : emptyPatientView();
    if (view === "billing") return billingView(patient);
    if (view === "reports") return reportsView();
    if (view === "admin") return adminView();
    if (view === "messages") return messagesView();
    return dashboardView();
  }

  function dashboardView() {
    return `<section class="hero-panel"><div><span class="eyebrow">Today</span><h1>Clinical operations dashboard</h1><p>Appointments, patient flow, billing status, and clinical reminders in one clean workspace.</p></div><button class="btn btn-primary icon-label" data-action="go" data-view="calendar" type="button">${icons.calendar}<span>Open schedule</span></button></section><section class="metric-grid">${metric("Appointments", "24", "+6 today", icons.calendar)}${metric("Checked in", "8", "3 waiting", icons.patients)}${metric("Open claims", "17", "$8.4k", icons.billing)}${metric("Messages", "12", "4 urgent", icons.messages)}</section><section class="dashboard-grid"><article class="panel wide"><div class="panel-header"><h2>Today schedule</h2><button class="ghost-button" data-action="go" data-view="calendar">View all</button></div>${appointmentList()}</article><article class="panel"><div class="panel-header"><h2>Care reminders</h2></div><ul class="clean-list"><li><strong>Jane Sample</strong><span>Lab follow-up due</span></li><li><strong>John Appleseed</strong><span>Annual wellness reminder</span></li><li><strong>Maria Garcia</strong><span>Portal message waiting</span></li></ul></article></section>`;
  }

  function calendarView() { return `<div class="page-title"><div><span class="eyebrow">Schedule</span><h1>Calendar</h1></div><button class="btn btn-primary">New appointment</button></div><section class="calendar-modern">${["Mon", "Tue", "Wed", "Thu", "Fri"].map((day, index) => `<article class="day-column"><h2>${day}</h2><button class="appointment-card" data-action="select-patient" data-patient="${index % 2 ? "john" : "jane"}"><span>${9 + index}:00 AM</span><strong>${index % 2 ? "John Appleseed" : "Jane Sample"}</strong><small>Office visit</small></button><button class="appointment-card muted"><span>1:30 PM</span><strong>Follow-up</strong><small>Room ${index + 1}</small></button></article>`).join("")}</section>`; }
  function patientsView() { return `<div class="page-title"><div><span class="eyebrow">Registry</span><h1>Patients</h1></div><button class="btn btn-primary">New patient</button></div><section class="panel"><table class="data-table"><thead><tr><th>Name</th><th>DOB</th><th>PID</th><th>Provider</th><th>Risk</th><th></th></tr></thead><tbody>${Object.values(patients).map((patient) => `<tr><td>${patient.name}</td><td>${patient.dob}</td><td>${patient.pid}</td><td>${patient.provider}</td><td><span class="status-pill">${patient.risk}</span></td><td><button class="ghost-button" data-action="select-patient" data-patient="${patient.id}">Open</button></td></tr>`).join("")}</tbody></table></section>`; }
  function patientChartView(patient) { return `<div class="page-title"><div><span class="eyebrow">Chart</span><h1>${patient.name}</h1></div><button class="btn btn-primary" data-action="go" data-view="encounter">Create encounter</button></div><section class="metric-grid">${metric("Age", String(patient.age), "DOB " + patient.dob)}${metric("Provider", patient.provider, "Primary")}${metric("Balance", patient.balance, "Patient due")}${metric("Risk", patient.risk, "Care score")}</section><section class="dashboard-grid"><article class="panel"><h2>Problems</h2><ul class="clean-list"><li><strong>Hypertension</strong><span>Active</span></li><li><strong>Seasonal allergies</strong><span>Active</span></li></ul></article><article class="panel"><h2>Medications</h2><ul class="clean-list"><li><strong>Lisinopril 10mg</strong><span>Daily</span></li><li><strong>Vitamin D</strong><span>Weekly</span></li></ul></article><article class="panel wide"><h2>Recent encounters</h2><table class="data-table"><tbody><tr><td>2026-06-20</td><td>Office visit</td><td>Signed</td></tr><tr><td>2026-05-12</td><td>Follow-up</td><td>Reviewed</td></tr></tbody></table></article></section>`; }
  function encounterView(patient) { return `<div class="page-title"><div><span class="eyebrow">Visit</span><h1>Encounter for ${patient.name}</h1></div><button class="btn btn-primary">Sign note</button></div><section class="panel form-panel"><label>Chief complaint<textarea class="form-control">Follow-up visit for ${patient.name}.</textarea></label><label>Assessment<textarea class="form-control">Stable. Continue current plan.</textarea></label><label>Plan<textarea class="form-control">Return in 3 months.</textarea></label></section>`; }
  function documentsView(patient) { return `<div class="page-title"><div><span class="eyebrow">Documents</span><h1>${patient.name}</h1></div><button class="btn btn-primary">Upload</button></div><section class="panel split-panel"><nav class="folder-list"><button>Patient Information</button><button>Lab Report</button><button>Insurance</button><button>Images</button></nav><table class="data-table"><thead><tr><th>Document</th><th>Date</th><th>Status</th></tr></thead><tbody><tr><td>Insurance Card</td><td>2026-06-01</td><td>Current</td></tr><tr><td>Lab Results</td><td>2026-05-17</td><td>Reviewed</td></tr></tbody></table></section>`; }
  function billingView(patient) { return `<div class="page-title"><div><span class="eyebrow">Revenue cycle</span><h1>Billing</h1></div><button class="btn btn-primary">Post payment</button></div><section class="panel"><table class="data-table"><thead><tr><th>Date</th><th>Patient</th><th>Code</th><th>Description</th><th>Amount</th></tr></thead><tbody><tr><td>2026-06-20</td><td>${patient ? patient.name : "Jane Sample"}</td><td>99213</td><td>Office outpatient visit</td><td>$125.00</td></tr><tr><td>2026-06-20</td><td>${patient ? patient.name : "Jane Sample"}</td><td>81002</td><td>Urinalysis</td><td>$18.00</td></tr></tbody></table></section>`; }
  function reportsView() { return `<div class="page-title"><div><span class="eyebrow">Analytics</span><h1>Reports</h1></div><button class="btn btn-primary">Run report</button></div><section class="metric-grid">${metric("Visits", "248", "This month")}${metric("Claims", "$48.2k", "Submitted")}${metric("Quality", "92%", "Care gaps closed")}</section><section class="panel"><table class="data-table"><thead><tr><th>Report</th><th>Owner</th><th>Last run</th></tr></thead><tbody><tr><td>Patient List</td><td>Admin</td><td>Today</td></tr><tr><td>Financial Summary</td><td>Billing</td><td>Yesterday</td></tr></tbody></table></section>`; }
  function adminView() { return `<div class="page-title"><div><span class="eyebrow">Configuration</span><h1>Admin</h1></div><button class="btn btn-primary">Add user</button></div><section class="dashboard-grid"><article class="panel"><h2>Users</h2><p>Manage providers, staff, roles, and permissions.</p></article><article class="panel"><h2>Facilities</h2><p>Configure clinic locations and billing details.</p></article><article class="panel"><h2>Globals</h2><p>Set practice defaults and system preferences.</p></article></section>`; }
  function messagesView() { return `<div class="page-title"><div><span class="eyebrow">Inbox</span><h1>Messages</h1></div><button class="btn btn-primary">Compose</button></div><section class="dashboard-grid"><article class="panel"><h2>Patient reminder</h2><p>Jane Sample needs lab follow-up review.</p><button class="ghost-button">Open</button></article><article class="panel"><h2>Portal message</h2><p>John Appleseed requested appointment confirmation.</p><button class="ghost-button">Open</button></article></section>`; }
  function appointmentList() { return `<div class="timeline"><button data-action="select-patient" data-patient="jane"><span>09:00</span><strong>Jane Sample</strong><small>Office Visit</small></button><button data-action="select-patient" data-patient="john"><span>10:15</span><strong>John Appleseed</strong><small>Follow-up</small></button><button><span>13:30</span><strong>Care conference</strong><small>Telehealth</small></button></div>`; }
  function metric(label, value, detail, icon) { return `<article class="metric-card"><div class="metric-top"><span>${label}</span><span class="metric-icon">${icon || ""}</span></div><strong>${value}</strong><small>${detail}</small></article>`; }
  function emptyPatientView() { return `<section class="empty-state"><h1>No patient selected</h1><p>Select a patient to explore chart workflows.</p><button class="btn btn-primary" data-action="go" data-view="patients">Find patient</button></section>`; }
  function getNode(id) { const node = document.getElementById(id); if (!node) throw new Error("Missing required element: #" + id); return node; }
})();
