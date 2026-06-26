(function () {
  const config = window.OPENEMR_VERCEL_UI_CONFIG || {};
  const appName = config.appName || "OpenEMR";
  const environment = config.deploymentEnvironment || "local";
  const backendUrl = config.backendUrl || "";
  const patients = {
    jane: { id: "jane", name: "Jane Sample", dob: "1984-04-16", age: 42, pid: "1001", phone: "(555) 221-4412", provider: "Dr. Smith", risk: "Medium", balance: "$42.00" },
    john: { id: "john", name: "John Appleseed", dob: "1979-11-02", age: 46, pid: "1002", phone: "(555) 991-0101", provider: "Dr. Miller", risk: "Low", balance: "$0.00" }
  };
  const navItems = [
    ["dashboard", "Dashboard"],
    ["calendar", "Schedule"],
    ["patients", "Patients"],
    ["patient-summary", "Chart"],
    ["billing", "Billing"],
    ["reports", "Reports"],
    ["admin", "Admin"],
    ["messages", "Inbox"]
  ];
  const icons = {
    dashboard: '<svg viewBox="0 0 24 24" aria-hidden="true"><rect x="3" y="3" width="7" height="8" rx="1.5"/><rect x="14" y="3" width="7" height="5" rx="1.5"/><rect x="14" y="12" width="7" height="9" rx="1.5"/><rect x="3" y="15" width="7" height="6" rx="1.5"/></svg>',
    calendar: '<svg viewBox="0 0 24 24" aria-hidden="true"><rect x="3" y="4" width="18" height="17" rx="2"/><path d="M8 2v4M16 2v4M3 10h18"/></svg>',
    patients: '<svg viewBox="0 0 24 24" aria-hidden="true"><path d="M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2"/><circle cx="9" cy="7" r="4"/><path d="M22 21v-2a4 4 0 0 0-3-3.87M16 3.13a4 4 0 0 1 0 7.75"/></svg>',
    "patient-summary": '<svg viewBox="0 0 24 24" aria-hidden="true"><path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"/><path d="M14 2v6h6M12 18v-6M9 15h6"/></svg>',
    encounter: '<svg viewBox="0 0 24 24" aria-hidden="true"><path d="M20.8 4.6a5.5 5.5 0 0 0-7.8 0L12 5.6l-1-1a5.5 5.5 0 1 0-7.8 7.8L12 21l8.8-8.6a5.5 5.5 0 0 0 0-7.8Z"/><path d="M9 12h6M12 9v6"/></svg>',
    documents: '<svg viewBox="0 0 24 24" aria-hidden="true"><path d="M14 2H7a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h10a2 2 0 0 0 2-2V7z"/><path d="M14 2v5h5M9 13h6M9 17h6"/></svg>',
    billing: '<svg viewBox="0 0 24 24" aria-hidden="true"><path d="M4 2v20l2-1 2 1 2-1 2 1 2-1 2 1 2-1 2 1V2z"/><path d="M8 7h8M8 11h8M8 15h5"/></svg>',
    reports: '<svg viewBox="0 0 24 24" aria-hidden="true"><path d="M3 3v18h18"/><path d="M8 17V9M13 17V5M18 17v-4"/></svg>',
    admin: '<svg viewBox="0 0 24 24" aria-hidden="true"><circle cx="12" cy="12" r="3"/><path d="M19.4 15a1.7 1.7 0 0 0 .3 1.9l.1.1a2 2 0 1 1-2.8 2.8l-.1-.1a1.7 1.7 0 0 0-1.9-.3 1.7 1.7 0 0 0-1 1.6V21a2 2 0 1 1-4 0v-.1a1.7 1.7 0 0 0-1-1.6 1.7 1.7 0 0 0-1.9.3l-.1.1A2 2 0 1 1 4.2 17l.1-.1a1.7 1.7 0 0 0 .3-1.9 1.7 1.7 0 0 0-1.6-1H3a2 2 0 1 1 0-4h.1a1.7 1.7 0 0 0 1.6-1 1.7 1.7 0 0 0-.3-1.9L4.3 7A2 2 0 1 1 7.1 4.2l.1.1a1.7 1.7 0 0 0 1.9.3h.1a1.7 1.7 0 0 0 1-1.6V3a2 2 0 1 1 4 0v.1a1.7 1.7 0 0 0 1 1.6h.1a1.7 1.7 0 0 0 1.9-.3l.1-.1A2 2 0 1 1 20 7.1l-.1.1a1.7 1.7 0 0 0-.3 1.9v.1a1.7 1.7 0 0 0 1.6 1h.1a2 2 0 1 1 0 4h-.1a1.7 1.7 0 0 0-1.8.8Z"/></svg>',
    messages: '<svg viewBox="0 0 24 24" aria-hidden="true"><path d="M21 15a4 4 0 0 1-4 4H8l-5 3V7a4 4 0 0 1 4-4h10a4 4 0 0 1 4 4z"/><path d="M8 9h8M8 13h5"/></svg>',
    search: '<svg viewBox="0 0 24 24" aria-hidden="true"><circle cx="11" cy="11" r="7"/><path d="m21 21-4.3-4.3"/></svg>',
    menu: '<svg viewBox="0 0 24 24" aria-hidden="true"><path d="M4 6h16M4 12h16M4 18h16"/></svg>',
    plus: '<svg viewBox="0 0 24 24" aria-hidden="true"><path d="M12 5v14M5 12h14"/></svg>',
    logout: '<svg viewBox="0 0 24 24" aria-hidden="true"><path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4"/><path d="M16 17l5-5-5-5M21 12H9"/></svg>',
    close: '<svg viewBox="0 0 24 24" aria-hidden="true"><path d="M18 6 6 18M6 6l12 12"/></svg>',
    check: '<svg viewBox="0 0 24 24" aria-hidden="true"><path d="m20 6-11 11-5-5"/></svg>',
    upload: '<svg viewBox="0 0 24 24" aria-hidden="true"><path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"/><path d="M17 8 12 3 7 8M12 3v12"/></svg>'
  };
  const state = { activeView: "dashboard", selectedPatient: "jane" };
  const loginView = getNode("login-view");
  const appView = getNode("app-view");
  const loginForm = getNode("login_form");
  const password = getNode("clearPass");
  const passwordToggle = getNode("password-toggle");

  passwordToggle.addEventListener("click", function () {
    const showing = password.type === "text";
    password.type = showing ? "password" : "text";
    passwordToggle.textContent = showing ? "Show" : "Hide";
    passwordToggle.setAttribute("aria-label", showing ? "Show password" : "Hide password");
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
        <div class="sidebar-brand"><img src="/assets/menu-logo.svg" alt="${escapeHtml(appName)}"><span>${escapeHtml(appName)}</span></div>
        <nav class="side-nav" id="side-nav">${navItems.map(([id, label]) => `<button class="side-link ${isActiveNav(id) ? "active" : ""}" type="button" data-action="go" data-view="${id}"><span class="side-icon">${icons[id]}</span><span>${label}</span></button>`).join("")}</nav>
        <div class="sidebar-footer"><strong>${environmentLabel(environment)}</strong><span>${backendUrl ? "Backend connected" : "Static Vercel demo"}</span></div>
      </aside>
      <section class="workspace">
        <header class="topbar">
          <button class="icon-button menu-button" type="button" data-action="toggle-menu" aria-label="Open navigation" title="Open navigation">${icons.menu}</button>
          <form id="global-search-form" class="search-form">
            <div class="search-wrap"><span class="search-icon">${icons.search}</span><input class="form-control" type="search" placeholder="Search patients, visits, claims"></div>
          </form>
          <button class="ghost-button icon-label message-button" type="button" data-action="go" data-view="messages">${icons.messages}<span class="button-text">Inbox</span></button>
          <div class="user-chip"><span class="avatar">AD</span><span>Administrator</span></div>
          <button class="ghost-button icon-label logout-button" type="button" data-action="logout">${icons.logout}<span class="button-text">Logout</span></button>
        </header>
        ${state.activeView === "dashboard" ? "" : patientRibbon()}
        <main class="content" id="content">${viewMarkup(state.activeView)}</main>
      </section>`;
    appView.querySelector("#global-search-form").addEventListener("submit", function (event) {
      event.preventDefault();
      go("patients");
    });
    appView.addEventListener("click", handleAppClick, { once: true });
  }

  function handleAppClick(event) {
    const target = event.target.closest("[data-action]");
    if (!target) {
      appView.addEventListener("click", handleAppClick, { once: true });
      return;
    }

    const action = target.dataset.action;
    if (action === "go") go(target.dataset.view);
    if (action === "select-patient") {
      state.selectedPatient = target.dataset.patient;
      go("patient-summary");
    }
    if (action === "clear-patient") {
      state.selectedPatient = null;
      go("patients");
    }
    if (action === "logout") {
      appView.classList.add("is-hidden");
      loginView.classList.remove("is-hidden");
    }
    if (action === "toggle-menu") appView.classList.toggle("sidebar-open");
    appView.addEventListener("click", handleAppClick, { once: true });
  }

  function go(view) {
    state.activeView = view;
    renderShell();
  }

  function isActiveNav(id) {
    if (state.activeView === id) return true;
    return id === "patient-summary" && ["encounter", "documents"].includes(state.activeView);
  }

  function patientRibbon() {
    const patient = state.selectedPatient ? patients[state.selectedPatient] : null;
    if (!patient) {
      return `<section class="patient-ribbon empty"><div><span class="eyebrow">No active chart</span><strong>Select a patient to start chart workflows</strong></div><button class="ghost-button icon-label" type="button" data-action="go" data-view="patients">${icons.search}<span>Find patient</span></button></section>`;
    }

    return `<section class="patient-ribbon"><img src="/assets/patient-picture-default.png" alt="" class="patient-photo"><div class="patient-summary"><span class="eyebrow">Active chart</span><button class="patient-name" type="button" data-action="go" data-view="patient-summary">${patient.name}</button><span>DOB ${patient.dob}</span><span>PID ${patient.pid}</span><span>${patient.provider}</span></div><div class="patient-actions"><button class="ghost-button icon-label" data-action="go" data-view="patient-summary" type="button">${icons["patient-summary"]}<span>Chart</span></button><button class="ghost-button icon-label" data-action="go" data-view="encounter" type="button">${icons.encounter}<span>Encounter</span></button><button class="ghost-button icon-label" data-action="go" data-view="documents" type="button">${icons.documents}<span>Documents</span></button><button class="ghost-button icon-label" data-action="clear-patient" type="button">${icons.close}<span>Close</span></button></div></section>`;
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
    return `<section class="report-page"><div class="report-header"><div><h1>Electric Medical Report</h1><div class="breadcrumb"><span>Reports</span><span>Report Detail</span></div></div><div class="action-row"><button class="ghost-button icon-label" type="button">${icons.upload}<span>Download PDF</span></button><button class="btn btn-primary icon-label" type="button">${icons.messages}<span>Share Report</span></button></div></div>${reportPatientCard()}<section class="report-grid"><article class="panel ecg-panel"><div class="panel-header"><h2>ECG Overview</h2><div class="ecg-toolbar"><button class="ghost-button" type="button">Lead II</button><button class="ghost-button" type="button">25 mm/s</button><button class="icon-button" type="button" aria-label="Expand report">${icons.plus}</button></div></div>${ecgChart()}${ecgStats()}</article><article class="panel interpretation-card"><h2>Interpretation</h2><div class="success-banner">Normal Sinus Rhythm</div><p>No significant ST-T changes.</p><p>Normal ECG.</p><div class="review-block"><span>Reviewed by</span><strong>Dr. Michael Lee</strong><small>May 18, 2024 11:15 AM</small></div></article><article class="panel measurements-card"><h2>Measurements</h2>${measurementsTable()}</article><article class="panel summary-card"><h2>Report Summary</h2>${reportSummary()}</article></section><article class="panel previous-card"><div class="panel-header"><h2>Previous Reports</h2><button class="ghost-button" type="button">View All</button></div>${previousReports()}</article></section>`;
  }

  function calendarView() {
    return `<div class="page-title"><div><span class="eyebrow">Schedule</span><h1>Calendar</h1></div><button class="btn btn-primary icon-label" type="button">${icons.plus}<span>New appointment</span></button></div><section class="calendar-modern">${["Mon", "Tue", "Wed", "Thu", "Fri"].map((day, index) => `<article class="day-column"><h2>${day}</h2><button class="appointment-card" type="button" data-action="select-patient" data-patient="${index % 2 ? "john" : "jane"}"><span>${9 + index}:00 AM</span><strong>${index % 2 ? "John Appleseed" : "Jane Sample"}</strong><small>Office visit</small></button><button class="appointment-card muted" type="button"><span>1:30 PM</span><strong>Follow-up</strong><small>Room ${index + 1}</small></button></article>`).join("")}</section>`;
  }

  function patientsView() {
    return `<div class="page-title"><div><span class="eyebrow">Registry</span><h1>Patients</h1></div><button class="btn btn-primary icon-label" type="button">${icons.plus}<span>New patient</span></button></div><section class="panel"><table class="data-table"><thead><tr><th>Name</th><th>DOB</th><th>PID</th><th>Provider</th><th>Risk</th><th></th></tr></thead><tbody>${Object.values(patients).map((patient) => `<tr><td>${patient.name}</td><td>${patient.dob}</td><td>${patient.pid}</td><td>${patient.provider}</td><td><span class="status-pill">${patient.risk}</span></td><td><button class="ghost-button" type="button" data-action="select-patient" data-patient="${patient.id}">Open</button></td></tr>`).join("")}</tbody></table></section>`;
  }

  function patientChartView(patient) {
    return `<section class="chart-page"><div class="page-title"><div><span class="eyebrow">Patient chart</span><h1>${patient.name}</h1></div><button class="btn btn-primary icon-label" data-action="go" data-view="encounter" type="button">${icons.plus}<span>Create encounter</span></button></div><article class="chart-summary-card"><div class="patient-avatar-lg">${patient.name.split(" ").map((part) => part[0]).join("")}</div><div><h2>${patient.name}</h2><span class="soft-pill">${patient.age} y/o · ${patient.risk} risk</span><dl><dt>Patient ID</dt><dd>${patient.pid}</dd><dt>Date of Birth</dt><dd>${patient.dob}</dd></dl></div><div class="chart-contact-grid"><div class="meta-item"><span class="meta-icon">${icons.patients}</span><div><small>Provider</small><strong>${patient.provider}</strong></div></div><div class="meta-item"><span class="meta-icon">${icons.messages}</span><div><small>Phone</small><strong>${patient.phone}</strong></div></div><div class="meta-item"><span class="meta-icon">${icons.billing}</span><div><small>Balance</small><strong>${patient.balance}</strong></div></div></div></article><section class="metric-grid">${metric("Age", String(patient.age), "DOB " + patient.dob, icons.calendar)}${metric("Provider", patient.provider, "Primary", icons.patients)}${metric("Balance", patient.balance, "Patient due", icons.billing)}${metric("Risk", patient.risk, "Care score", icons.reports)}</section><section class="chart-detail-grid"><article class="panel"><h2>Problems</h2><ul class="condition-list"><li><div><strong>Hypertension</strong><span>Active condition</span></div><em>Active</em></li><li><div><strong>Seasonal allergies</strong><span>Ongoing review</span></div><em>Active</em></li></ul></article><article class="panel"><h2>Medications</h2><ul class="condition-list"><li><div><strong>Lisinopril 10mg</strong><span>Once daily</span></div><em>Daily</em></li><li><div><strong>Vitamin D</strong><span>Supplement</span></div><em>Weekly</em></li></ul></article><article class="panel wide"><h2>Recent encounters</h2><table class="data-table"><tbody><tr><td>2026-06-20</td><td>Office visit</td><td><span class="status-pill">Signed</span></td></tr><tr><td>2026-05-12</td><td>Follow-up</td><td><span class="status-pill">Reviewed</span></td></tr></tbody></table></article></section></section>`;
  }

  function encounterView(patient) {
    return `<div class="page-title"><div><span class="eyebrow">Visit</span><h1>Encounter for ${patient.name}</h1></div><button class="btn btn-primary icon-label" type="button">${icons.check}<span>Sign note</span></button></div><section class="panel form-panel"><label>Chief complaint<textarea class="form-control">Follow-up visit for ${patient.name}.</textarea></label><label>Assessment<textarea class="form-control">Stable. Continue current plan.</textarea></label><label>Plan<textarea class="form-control">Return in 3 months.</textarea></label></section>`;
  }

  function documentsView(patient) {
    return `<div class="page-title"><div><span class="eyebrow">Documents</span><h1>${patient.name}</h1></div><button class="btn btn-primary icon-label" type="button">${icons.upload}<span>Upload</span></button></div><section class="panel split-panel"><nav class="folder-list"><button type="button">Patient Information</button><button type="button">Lab Report</button><button type="button">Insurance</button><button type="button">Images</button></nav><table class="data-table"><thead><tr><th>Document</th><th>Date</th><th>Status</th></tr></thead><tbody><tr><td>Insurance Card</td><td>2026-06-01</td><td>Current</td></tr><tr><td>Lab Results</td><td>2026-05-17</td><td>Reviewed</td></tr></tbody></table></section>`;
  }

  function billingView(patient) {
    return `<div class="page-title"><div><span class="eyebrow">Revenue cycle</span><h1>Billing</h1></div><button class="btn btn-primary icon-label" type="button">${icons.plus}<span>Post payment</span></button></div><section class="panel"><table class="data-table"><thead><tr><th>Date</th><th>Patient</th><th>Code</th><th>Description</th><th>Amount</th></tr></thead><tbody><tr><td>2026-06-20</td><td>${patient ? patient.name : "Jane Sample"}</td><td>99213</td><td>Office outpatient visit</td><td>$125.00</td></tr><tr><td>2026-06-20</td><td>${patient ? patient.name : "Jane Sample"}</td><td>81002</td><td>Urinalysis</td><td>$18.00</td></tr></tbody></table></section>`;
  }

  function reportsView() {
    return `<div class="page-title"><div><span class="eyebrow">Analytics</span><h1>Reports</h1></div><button class="btn btn-primary icon-label" type="button">${icons.reports}<span>Run report</span></button></div><section class="metric-grid">${metric("Visits", "248", "This month", icons.calendar)}${metric("Claims", "$48.2k", "Submitted", icons.billing)}${metric("Quality", "92%", "Care gaps closed", icons.reports)}</section><section class="panel"><table class="data-table"><thead><tr><th>Report</th><th>Owner</th><th>Last run</th></tr></thead><tbody><tr><td>Patient List</td><td>Admin</td><td>Today</td></tr><tr><td>Financial Summary</td><td>Billing</td><td>Yesterday</td></tr></tbody></table></section>`;
  }

  function adminView() {
    return `<div class="page-title"><div><span class="eyebrow">Configuration</span><h1>Admin</h1></div><button class="btn btn-primary icon-label" type="button">${icons.plus}<span>Add user</span></button></div><section class="dashboard-grid"><article class="panel"><h2>Users</h2><p>Manage providers, staff, roles, and permissions.</p></article><article class="panel"><h2>Facilities</h2><p>Configure clinic locations and billing details.</p></article><article class="panel"><h2>Globals</h2><p>Set practice defaults and system preferences.</p></article></section>`;
  }

  function messagesView() {
    return `<div class="page-title"><div><span class="eyebrow">Inbox</span><h1>Messages</h1></div><button class="btn btn-primary icon-label" type="button">${icons.plus}<span>Compose</span></button></div><section class="dashboard-grid"><article class="panel"><h2>Patient reminder</h2><p>Jane Sample needs lab follow-up review.</p><button class="ghost-button icon-label" type="button">${icons.messages}<span>Open</span></button></article><article class="panel"><h2>Portal message</h2><p>John Appleseed requested appointment confirmation.</p><button class="ghost-button icon-label" type="button">${icons.messages}<span>Open</span></button></article></section>`;
  }

  function visitTrendChart() {
    return `<div class="line-chart"><svg viewBox="0 0 420 180" role="img" aria-label="Visit volume trend"><path class="chart-grid-line" d="M20 140H400M20 95H400M20 50H400"/><path class="chart-area" d="M20 130 C70 105 95 112 130 82 S205 46 250 66 320 102 400 38 L400 160 L20 160 Z"/><path class="chart-line" d="M20 130 C70 105 95 112 130 82 S205 46 250 66 320 102 400 38"/><g class="chart-points"><circle cx="20" cy="130" r="4"/><circle cx="130" cy="82" r="4"/><circle cx="250" cy="66" r="4"/><circle cx="400" cy="38" r="4"/></g></svg><div class="chart-labels"><span>Mon</span><span>Tue</span><span>Wed</span><span>Thu</span><span>Fri</span></div></div>`;
  }

  function claimsDonutChart() {
    return `<div class="donut-layout"><div class="donut-chart"><svg viewBox="0 0 120 120" role="img" aria-label="Claims status"><circle class="donut-track" cx="60" cy="60" r="44"/><circle class="donut-paid" cx="60" cy="60" r="44"/><circle class="donut-review" cx="60" cy="60" r="44"/></svg><strong>72%</strong><span>clean</span></div><ul class="legend-list"><li><span class="legend-dot paid"></span><strong>Clean claims</strong><small>72%</small></li><li><span class="legend-dot review"></span><strong>Needs review</strong><small>18%</small></li><li><span class="legend-dot denied"></span><strong>Denied</strong><small>10%</small></li></ul></div>`;
  }

  function reportPatientCard() {
    return `<article class="patient-report-card"><div class="report-person"><div class="patient-avatar-lg">JS</div><div><h2>John Smith</h2><span class="soft-pill">Male · 45 y/o</span><dl><dt>Patient ID</dt><dd>P-2024-05821</dd><dt>Date of Birth</dt><dd>Apr 12, 1979</dd></dl></div></div><div class="report-meta-grid"><div class="meta-item"><span class="meta-icon">${icons.reports}</span><div><small>Report Type</small><strong>ECG</strong></div></div><div class="meta-item"><span class="meta-icon">${icons.calendar}</span><div><small>Recorded On</small><strong>May 18, 2024 10:30 AM</strong></div></div><div class="meta-item"><span class="meta-icon">${icons.patients}</span><div><small>Recorded By</small><strong>Nurse Olivia</strong></div></div><div class="meta-item"><span class="meta-icon">${icons["patient-summary"]}</span><div><small>Referring Doctor</small><strong>Dr. Michael Lee</strong></div></div><div class="meta-item"><span class="meta-icon">${icons.documents}</span><div><small>Department</small><strong>Cardiology</strong></div></div><div class="meta-item"><span class="meta-icon">${icons.check}</span><div><small>Status</small><strong><span class="status-pill">Completed</span></strong></div></div></div></article>`;
  }

  function ecgChart() {
    return `<div class="ecg-chart"><svg viewBox="0 0 720 220" role="img" aria-label="ECG waveform"><defs><pattern id="smallGrid" width="10" height="10" patternUnits="userSpaceOnUse"><path d="M10 0H0V10" fill="none" stroke="#eef2f7" stroke-width="1"/></pattern><pattern id="bigGrid" width="50" height="50" patternUnits="userSpaceOnUse"><rect width="50" height="50" fill="url(#smallGrid)"/><path d="M50 0H0V50" fill="none" stroke="#e5ebf3" stroke-width="1.2"/></pattern></defs><rect width="720" height="220" rx="8" fill="url(#bigGrid)"/><path d="M16 126H54l7-11 7 28 8-109 9 92 8 0 9-12 10 12h42l7-9 8 23 7-29 8 15h55l7-7 8 0 6-12 8 28 8-14h49l8-8 8 0 7-10 8 26 8-14h55l7-9 9 24 7-104 9 88 8 4 8-13 9 13h56l8-10 8 0 7-8 9 28 8-15h60l8-9 9 0 7-7 8 26 8-15h48" fill="none" stroke="#2f6df6" stroke-width="2.4" stroke-linecap="round" stroke-linejoin="round"/></svg></div>`;
  }

  function ecgStats() {
    const stats = [["Heart Rate", "72", "bpm"], ["PR Interval", "160", "ms"], ["QRS Duration", "92", "ms"], ["QT / QTc", "360 / 395", "ms"], ["P Axis", "56°", ""], ["QRS Axis", "34°", ""], ["T Axis", "48°", ""]];
    return `<div class="ecg-metrics">${stats.map(([label, value, unit]) => `<div class="ecg-stat"><span>${label}</span><strong>${value}</strong><small>${unit}</small></div>`).join("")}</div>`;
  }

  function measurementsTable() {
    const rows = [["Heart Rate", "72", "bpm", "60 - 100"], ["PR Interval", "160", "ms", "120 - 200"], ["QRS Duration", "92", "ms", "70 - 110"], ["QT Interval", "360", "ms", "300 - 440"], ["QTc (Bazett)", "395", "ms", "&lt; 440"]];
    return `<table class="measure-table"><thead><tr><th>Measurement</th><th>Value</th><th>Unit</th><th>Reference Range</th><th>Status</th></tr></thead><tbody>${rows.map((row) => `<tr>${row.map((item) => `<td>${item}</td>`).join("")}<td><span class="normal-text">Normal</span></td></tr>`).join("")}</tbody></table>`;
  }

  function reportSummary() {
    return `<dl class="summary-list"><dt>Indication</dt><dd>Routine Check-up</dd><dt>Symptoms</dt><dd>None</dd><dt>Medications</dt><dd>Amlodipine 5mg daily</dd><dt>Notes</dt><dd>Patient is stable. No immediate action required.</dd></dl>`;
  }

  function previousReports() {
    return `<table class="previous-table"><thead><tr><th>Date</th><th>Report Type</th><th>Findings</th><th>Status</th><th>Actions</th></tr></thead><tbody><tr><td>Apr 20, 2024</td><td>ECG</td><td>Normal Sinus Rhythm</td><td><span class="status-pill">Completed</span></td><td>${icons.search}</td></tr><tr><td>Jan 15, 2024</td><td>ECG</td><td>Sinus Bradycardia</td><td><span class="status-pill">Completed</span></td><td>${icons.search}</td></tr><tr><td>Oct 10, 2023</td><td>ECG</td><td>Normal Sinus Rhythm</td><td><span class="status-pill">Completed</span></td><td>${icons.search}</td></tr></tbody></table>`;
  }

  function appointmentList() {
    return `<div class="timeline"><button type="button" data-action="select-patient" data-patient="jane"><span>09:00</span><strong>Jane Sample</strong><small>Room 2 · Office Visit</small></button><button type="button" data-action="select-patient" data-patient="john"><span>10:15</span><strong>John Appleseed</strong><small>Room 4 · Follow-up</small></button><button type="button"><span>13:30</span><strong>Care conference</strong><small>Telehealth · Team</small></button></div>`;
  }

  function clinicalSignal(label, value, detail, tone) {
    return `<article class="signal-card ${tone}"><span>${label}</span><strong>${value}</strong><small>${detail}</small></article>`;
  }

  function metric(label, value, detail, icon) {
    return `<article class="metric-card"><div class="metric-top"><span>${label}</span><span class="metric-icon">${icon || ""}</span></div><strong>${value}</strong><small>${detail}</small></article>`;
  }

  function emptyPatientView() {
    return `<section class="empty-state"><h1>No patient selected</h1><p>Select a patient to explore chart workflows.</p><button class="btn btn-primary icon-label" type="button" data-action="go" data-view="patients">${icons.search}<span>Find patient</span></button></section>`;
  }

  function environmentLabel(value) {
    if (value === "production") return "Production preview";
    if (value === "preview") return "Preview deploy";
    if (value === "development") return "Development";
    return "Local build";
  }

  function escapeHtml(value) {
    return String(value).replace(/[&<>"']/g, function (match) {
      return ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#039;" })[match];
    });
  }

  function getNode(id) {
    const node = document.getElementById(id);
    if (!node) throw new Error("Missing required element: #" + id);
    return node;
  }
})();
