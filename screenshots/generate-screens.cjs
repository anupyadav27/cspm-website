// generate-screens.js — enterprise-grade UI mockups with real sidebar
const fs = require('fs');
const path = require('path');
const dir = __dirname;

// ── ICONS ─────────────────────────────────────────────────────────────────────
const IC = {
  LayoutDashboard:'<rect x="3" y="3" width="7" height="7" rx="1"/><rect x="14" y="3" width="7" height="7" rx="1"/><rect x="14" y="14" width="7" height="7" rx="1"/><rect x="3" y="14" width="7" height="7" rx="1"/>',
  Server:'<rect x="2" y="2" width="20" height="8" rx="2"/><rect x="2" y="14" width="20" height="8" rx="2"/><circle cx="6" cy="6" r="1" fill="currentColor"/><circle cx="6" cy="18" r="1" fill="currentColor"/>',
  GitBranch:'<line x1="6" y1="3" x2="6" y2="15"/><circle cx="18" cy="6" r="3"/><circle cx="6" cy="18" r="3"/><circle cx="6" cy="6" r="3"/><path d="M18 9a9 9 0 0 1-9 9"/>',
  Bug:'<path d="M9 2h6"/><path d="M9 7.13v-1a3 3 0 0 1 6 0v1"/><path d="M12 20c-3.3 0-6-2.7-6-6v-3a4 4 0 0 1 4-4h4a4 4 0 0 1 4 4v3c0 3.3-2.7 6-6 6z"/><path d="M12 20v-9"/><path d="M6 13H2"/><path d="M22 13h-4"/>',
  Activity:'<polyline points="22 12 18 12 15 21 9 3 6 12 2 12"/>',
  ClipboardCheck:'<path d="M9 5H7a2 2 0 0 0-2 2v12a2 2 0 0 0 2 2h10a2 2 0 0 0 2-2V7a2 2 0 0 0-2-2h-2"/><rect x="9" y="3" width="6" height="4" rx="1"/><path d="m9 14 2 2 4-4"/>',
  Radar:'<path d="M19.07 4.93A10 10 0 0 0 6.99 3.34"/><path d="M2.29 9.62A10 10 0 1 0 21.31 8.35"/><path d="M16.24 7.76A6 6 0 1 0 8.23 16.67"/><circle cx="12" cy="12" r="2"/><path d="m13.41 10.59 5.66-5.66"/>',
  Shield:'<path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"/>',
  KeyRound:'<path d="M2 18v3c0 .6.4 1 1 1h4v-3h3v-3h2l1.4-1.4a6.5 6.5 0 1 0-4-4Z"/><circle cx="16.5" cy="7.5" r=".5" fill="currentColor"/>',
  Network:'<rect x="9" y="2" width="6" height="6"/><rect x="16" y="16" width="6" height="6"/><rect x="2" y="16" width="6" height="6"/><path d="M5 16v-4h14v4"/><path d="M12 12V8"/>',
  Lock:'<rect x="3" y="11" width="18" height="11" rx="2"/><path d="M7 11V7a5 5 0 0 1 10 0v4"/>',
  Box:'<path d="M21 16V8a2 2 0 0 0-1-1.73l-7-4a2 2 0 0 0-2 0l-7 4A2 2 0 0 0 3 8v8a2 2 0 0 0 1 1.73l7 4a2 2 0 0 0 2 0l7-4A2 2 0 0 0 21 16z"/><polyline points="3.27 6.96 12 12.01 20.73 6.96"/><line x1="12" y1="22.08" x2="12" y2="12"/>',
  Brain:'<path d="M9.5 2A2.5 2.5 0 0 1 12 4.5v15a2.5 2.5 0 0 1-4.96-.46 2.5 2.5 0 0 1-2.96-3.08 3 3 0 0 1-.34-5.58 2.5 2.5 0 0 1 1.32-4.84A2.5 2.5 0 0 1 9.5 2Z"/><path d="M14.5 2A2.5 2.5 0 0 0 12 4.5v15a2.5 2.5 0 0 0 4.96-.46 2.5 2.5 0 0 0 2.96-3.08 3 3 0 0 0 .34-5.58 2.5 2.5 0 0 0-1.32-4.84A2.5 2.5 0 0 0 14.5 2Z"/>',
  Webhook:'<path d="M18 16.98h-5.99c-1.1 0-1.95.94-2.48 1.9A4 4 0 0 1 2 17c.01-.7.2-1.4.57-2"/><path d="m6 17 3.13-5.78c.53-.97.1-2.18-.5-3.1a4 4 0 1 1 6.89-4.06"/><path d="m12 6 3.13 5.73C15.66 12.7 16.9 13 18 13a4 4 0 0 1 0 8"/>',
  Database:'<ellipse cx="12" cy="5" rx="9" ry="3"/><path d="M21 12c0 1.66-4 3-9 3s-9-1.34-9-3"/><path d="M3 5v14c0 1.66 4 3 9 3s9-1.34 9-3V5"/>',
  Plug:'<path d="M12 22v-5"/><path d="M9 8V2"/><path d="M15 8V2"/><path d="M18 8H6a2 2 0 0 0-2 2v3a6 6 0 0 0 12 0v-3a2 2 0 0 0-2-2z"/>',
  UserSearch:'<circle cx="10" cy="7" r="4"/><path d="M10.3 15H7a4 4 0 0 0-4 4v2"/><circle cx="17" cy="17" r="3"/><path d="m21 21-1.9-1.9"/>',
  Eye:'<path d="M2 12s3-7 10-7 10 7 10 7-3 7-10 7-10-7-10-7Z"/><circle cx="12" cy="12" r="3"/>',
  Code:'<polyline points="16 18 22 12 16 6"/><polyline points="8 6 2 12 8 18"/>',
  FileText:'<path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"/><polyline points="14 2 14 8 20 8"/><line x1="16" y1="13" x2="8" y2="13"/><line x1="16" y1="17" x2="8" y2="17"/>',
  UserPlus:'<path d="M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2"/><circle cx="9" cy="7" r="4"/><line x1="19" y1="8" x2="19" y2="14"/><line x1="22" y1="11" x2="16" y2="11"/>',
  BookOpen:'<path d="M2 3h6a4 4 0 0 1 4 4v14a3 3 0 0 0-3-3H2z"/><path d="M22 3h-6a4 4 0 0 0-4 4v14a3 3 0 0 1 3-3h7z"/>',
  Settings2:'<path d="M20 7H9"/><path d="M14 17H3"/><circle cx="17" cy="17" r="3"/><circle cx="7" cy="7" r="3"/>',
  LayoutGrid:'<rect x="3" y="3" width="7" height="7"/><rect x="14" y="3" width="7" height="7"/><rect x="14" y="14" width="7" height="7"/><rect x="3" y="14" width="7" height="7"/>',
  DollarSign:'<line x1="12" y1="1" x2="12" y2="23"/><path d="M17 5H9.5a3.5 3.5 0 0 0 0 7h5a3.5 3.5 0 0 1 0 7H6"/>',
  Building2:'<path d="M6 22V4a2 2 0 0 1 2-2h8a2 2 0 0 1 2 2v18Z"/><path d="M6 12H4a2 2 0 0 0-2 2v6a2 2 0 0 0 2 2h2"/><path d="M18 9h2a2 2 0 0 1 2 2v9a2 2 0 0 1-2 2h-2"/><path d="M10 6h4"/><path d="M10 10h4"/><path d="M10 14h4"/><path d="M10 18h4"/>',
  Users:'<path d="M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2"/><circle cx="9" cy="7" r="4"/><path d="M22 21v-2a4 4 0 0 0-3-3.87"/><path d="M16 3.13a4 4 0 0 1 0 7.75"/>',
};

function svg(name, size=18) {
  return `<svg width="${size}" height="${size}" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" style="flex-shrink:0">${IC[name]||IC.LayoutDashboard}</svg>`;
}

// ── BADGE HELPERS ─────────────────────────────────────────────────────────────
// Severity → tokens
const SEV = {
  CRITICAL: { t:'#be123c', bg:'#fff1f2', bd:'#fecdd3', dot:'#e11d48' },
  HIGH:     { t:'#c2410c', bg:'#fff7ed', bd:'#fed7aa', dot:'#ea580c' },
  MEDIUM:   { t:'#92400e', bg:'#fffbeb', bd:'#fde68a', dot:'#d97706' },
  LOW:      { t:'#1e40af', bg:'#eff6ff', bd:'#bfdbfe', dot:'#3b82f6' },
  INFO:     { t:'#475569', bg:'#f8fafc', bd:'#e2e8f0', dot:'#94a3b8' },
};
function sevBadge(sev) {
  const s = SEV[sev] || SEV.INFO;
  return `<span style="display:inline-flex;align-items:center;gap:5px;height:20px;padding:0 8px;border-radius:5px;font-size:10.5px;font-weight:650;letter-spacing:.01em;color:${s.t};background:${s.bg};border:1px solid ${s.bd};white-space:nowrap"><span style="width:6px;height:6px;border-radius:50%;background:${s.dot};flex-shrink:0"></span>${sev}</span>`;
}
function badge(text, style='gray') {
  const MAP = {
    gray:   ['#475569','#f8fafc','#e2e8f0'],
    green:  ['#15803d','#f0fdf4','#bbf7d0'],
    red:    ['#be123c','#fff1f2','#fecdd3'],
    orange: ['#c2410c','#fff7ed','#fed7aa'],
    amber:  ['#92400e','#fffbeb','#fde68a'],
    blue:   ['#1e40af','#eff6ff','#bfdbfe'],
    purple: ['#6d28d9','#f5f3ff','#c4b5fd'],
    cyan:   ['#0e7490','#ecfeff','#a5f3fc'],
  };
  const [t,bg,bd] = MAP[style]||MAP.gray;
  return `<span style="display:inline-flex;align-items:center;height:20px;padding:0 8px;border-radius:5px;font-size:10.5px;font-weight:600;letter-spacing:.01em;color:${t};background:${bg};border:1px solid ${bd};white-space:nowrap">${text}</span>`;
}
function dot(color) {
  return `<span style="display:inline-block;width:7px;height:7px;border-radius:50%;background:${color};flex-shrink:0"></span>`;
}
// Compliance score color (systematic thresholds)
function scoreColor(pct) {
  const n = parseInt(pct);
  if (n >= 80) return '#15803d';
  if (n >= 65) return '#a16207';
  return '#c2410c';
}

// ── BASE CSS ──────────────────────────────────────────────────────────────────
const CSS = `
@import url('https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700;800;900&display=swap');
*{margin:0;padding:0;box-sizing:border-box}
:root{
  --bg:#ffffff;--bg2:#f8fafc;--bg3:#f1f5f9;
  --border:#e2e8f0;--border2:#f1f5f9;
  --text:#0f172a;--text2:#1e293b;--text3:#334155;--muted:#64748b;--faint:#94a3b8;
  --accent:#6366f1;--accent-bg:#eef2ff;--accent-text:#4338ca;
  --r-sm:5px;--r-md:8px;--r-lg:10px;--r-xl:12px;
  --shadow-sm:0 1px 3px rgba(0,0,0,.06),0 1px 2px rgba(0,0,0,.04);
  --shadow-md:0 4px 12px rgba(0,0,0,.08),0 2px 4px rgba(0,0,0,.05);
}
body{font-family:'Inter',system-ui,sans-serif;width:1440px;height:900px;overflow:hidden;background:var(--bg);color:var(--text);-webkit-font-smoothing:antialiased}

/* ── SIDEBAR ── */
.sb{position:fixed;left:0;top:0;width:240px;height:900px;background:#fafbfc;border-right:1px solid var(--border);display:flex;flex-direction:column;z-index:20}
.sb-logo{height:56px;display:flex;align-items:center;padding:0 18px;border-bottom:1px solid var(--border);flex-shrink:0;gap:10px}
.sb-nav{flex:1;overflow-y:auto;padding:6px 0 8px;scrollbar-width:thin;scrollbar-color:#e2e8f0 transparent}
.sb-nav::-webkit-scrollbar{width:3px}
.sb-nav::-webkit-scrollbar-thumb{background:#e2e8f0;border-radius:2px}
.sb-sec{padding:16px 16px 5px;font-size:9px;font-weight:700;text-transform:uppercase;letter-spacing:.1em;color:#94a3b8;line-height:1}
.sb-item{display:flex;align-items:center;gap:9px;padding:8px 16px;font-size:13px;font-weight:500;color:#64748b;border-left:3px solid transparent;cursor:pointer;transition:background .12s,color .12s;min-height:36px}
.sb-item:hover:not(.active){background:#f1f5f9;color:#334155}
.sb-item.active{color:#4338ca;background:#eef2ff;border-left-color:#4338ca;font-weight:600}
.sb-lw{display:flex;flex-direction:column;gap:1.5px;min-width:0;flex:1}
.sb-label{font-size:13px;font-weight:inherit;line-height:1.2;white-space:nowrap;overflow:hidden;text-overflow:ellipsis}
.sb-sub{font-size:10px;color:#94a3b8;font-weight:400;white-space:nowrap;overflow:hidden;text-overflow:ellipsis;line-height:1.2}
.sb-children{border-left:1px solid #e8edf2;margin:1px 0 3px 28px}
.sb-child{padding:7px 14px;font-size:12px;font-weight:500;color:#64748b;cursor:pointer;transition:background .12s,color .12s;line-height:1.3}
.sb-child:hover:not(.active){background:#f1f5f9;color:#334155}
.sb-child.active{color:#4338ca;font-weight:600;background:rgba(99,102,241,.06)}
.sb-user{padding:12px 16px;border-top:1px solid var(--border);display:flex;align-items:center;gap:10px;flex-shrink:0;background:#fafbfc}
.sb-avatar{width:30px;height:30px;border-radius:50%;background:linear-gradient(135deg,#818cf8,#6366f1);display:flex;align-items:center;justify-content:center;color:#fff;font-size:10px;font-weight:700;flex-shrink:0}

/* ── MAIN ── */
.main{margin-left:240px;height:900px;display:flex;flex-direction:column;overflow:hidden;background:var(--bg2)}
.topbar{height:56px;border-bottom:1px solid var(--border);background:#fff;display:flex;align-items:center;justify-content:space-between;padding:0 24px;flex-shrink:0}
.tb-title{font-size:15px;font-weight:700;color:#0f172a;letter-spacing:-.01em}
.tb-right{display:flex;align-items:center;gap:10px}
.content{flex:1;overflow-y:auto;padding:20px 24px 24px;background:var(--bg2)}

/* ── CARDS ── */
.card{background:#fff;border:1px solid var(--border);border-radius:var(--r-lg);box-shadow:var(--shadow-sm)}
.card-header{padding:16px 20px 0;font-size:12px;font-weight:700;color:#0f172a;letter-spacing:-.01em;display:flex;align-items:center;justify-content:space-between}
.card-body{padding:16px 20px 20px}

/* ── KPI ── */
.kpi-row{display:grid;grid-template-columns:repeat(4,1fr);gap:14px;margin-bottom:18px}
.kpi{background:#fff;border:1px solid var(--border);border-radius:var(--r-lg);padding:18px 20px;box-shadow:var(--shadow-sm);border-left:3px solid transparent}
.kpi-v{font-size:28px;font-weight:800;color:#0f172a;letter-spacing:-.02em;line-height:1.1}
.kpi-l{font-size:11.5px;font-weight:500;color:#64748b;margin-top:5px}
.kpi-d{font-size:10.5px;font-weight:500;margin-top:4px}

/* ── TABLE ── */
.tbl-wrap{background:#fff;border:1px solid var(--border);border-radius:var(--r-lg);overflow:hidden;box-shadow:var(--shadow-sm)}
.tbl{width:100%;border-collapse:collapse}
.tbl th{background:#f8fafc;padding:9px 16px;text-align:left;font-size:11px;font-weight:600;color:#64748b;text-transform:uppercase;letter-spacing:.05em;border-bottom:1px solid var(--border);white-space:nowrap}
.tbl td{padding:11px 16px;font-size:12.5px;font-weight:400;color:#1e293b;border-bottom:1px solid #f1f5f9;vertical-align:middle;line-height:1.4}
.tbl tr:last-child td{border-bottom:none}
.tbl tbody tr:hover td{background:#fafbfc}
.mono{font-family:'SF Mono',ui-monospace,'Cascadia Code',Consolas,monospace;font-size:11.5px;letter-spacing:.02em}

/* ── FILTER BAR ── */
.filter-bar{display:flex;align-items:center;gap:6px;margin-bottom:14px;padding-bottom:14px;border-bottom:1px solid var(--border)}
.ftab{padding:6px 14px;border-radius:var(--r-md);font-size:12px;font-weight:600;cursor:pointer;border:1.5px solid transparent;transition:all .15s;white-space:nowrap}
.ftab.on{background:#0f172a;color:#fff;border-color:#0f172a}
.ftab.off{background:#fff;color:#64748b;border:1.5px solid #e2e8f0}
.ftab.off:hover{border-color:#cbd5e1;color:#334155}
.search-inp{display:flex;align-items:center;gap:8px;margin-left:auto;background:#fff;border:1.5px solid var(--border);border-radius:var(--r-md);padding:6px 12px;font-size:12px;color:#94a3b8}

/* ── BUTTONS ── */
.btn-primary{background:#6366f1;color:#fff;border:none;border-radius:var(--r-md);padding:8px 16px;font-size:12.5px;font-weight:700;cursor:pointer;letter-spacing:-.01em;box-shadow:0 1px 3px rgba(99,102,241,.3)}
.btn-secondary{background:#fff;color:#334155;border:1.5px solid var(--border);border-radius:var(--r-md);padding:7px 14px;font-size:12.5px;font-weight:600;cursor:pointer}
.btn-secondary:hover{border-color:#cbd5e1;background:#f8fafc}

/* ── MISC ── */
.score-bar-wrap{height:6px;background:#f1f5f9;border-radius:3px;overflow:hidden;margin-top:6px}
.score-bar{height:100%;border-radius:3px}
.status-dot-green{display:inline-flex;align-items:center;gap:5px;font-size:11px;font-weight:600;color:#16a34a}
.status-dot-green::before{content:'';display:inline-block;width:7px;height:7px;border-radius:50%;background:#22c55e}
.section-label{font-size:12px;font-weight:700;color:#0f172a;letter-spacing:-.01em;margin-bottom:12px}
.row-meta{font-size:11px;color:#94a3b8}
`;

// ── NAV DEFINITION ────────────────────────────────────────────────────────────
const NAV = [
  { id:'dashboard',     label:'Dashboard',     icon:'LayoutDashboard' },
  { id:'assets',        label:'Assets',         icon:'Server',         sub:'Cloud Resources' },
  { id:'attack-paths',  label:'Attack Paths',   icon:'GitBranch',      sub:'Paths · Choke Points · ATT&CK', accent:'#EA580C',
    ch:[{id:'attack-paths-main',label:'Attack Paths'},{id:'choke-points',label:'Choke Points'}] },
  { id:'vulnerabilities',label:'Vulnerabilities',icon:'Bug',           sub:'VM · CVE · SBOM',
    ch:[{id:'vuln-dash',label:'Dashboard'},{id:'vuln-scans',label:'Scans'},{id:'cve-explorer',label:'CVE Explorer'},{id:'vuln-agents',label:'Agents'}] },
  { id:'risk',          label:'Risk',           icon:'Activity',        sub:'FAIR Model' },
  { id:'compliance',    label:'Compliance',     icon:'ClipboardCheck',  sub:'CIS · NIST · PCI · HIPAA' },
  { id:'investigation', label:'Investigation',  icon:'Radar',           sub:'Sonar Query' },
  { section:'CLOUD POSTURE' },
  { id:'cloud-posture', label:'Cloud Posture',  icon:'Shield',          sub:'CSPM',
    ch:[{id:'alerts',label:'Alerts'},{id:'iam',label:'IAM Security'},{id:'network-security',label:'Network Security'},
        {id:'encryption',label:'Encryption'},{id:'container-security',label:'Container Security'},
        {id:'ai-security',label:'AI Security'},{id:'api-security',label:'API Security'},{id:'database-security',label:'Database Security'}] },
  { id:'saas-security', label:'SaaS Security',  icon:'Plug',           sub:'GWS · M365 · GitHub · Okta',
    ch:[{id:'gws',label:'Google Workspace'},{id:'m365',label:'Microsoft 365'},{id:'github-sec',label:'GitHub'},{id:'okta',label:'Okta'},
        {id:'gitlab',label:'GitLab'},{id:'sharepoint',label:'SharePoint'},{id:'snowflake',label:'Snowflake'},{id:'dynamics',label:'Dynamics 365'}] },
  { section:'DETECTION & DATA' },
  { id:'cnapp',         label:'CNAPP',          icon:'Shield',          sub:'Unified Posture Score' },
  { id:'ciem',          label:'CIEM',           icon:'UserSearch',      sub:'Identity & Entitlements' },
  { id:'cdr',           label:'CDR',            icon:'Eye',             sub:'Cloud Detection & Response' },
  { id:'cwpp',          label:'CWPP',           icon:'Box',             sub:'Cloud Workload Protection' },
  { id:'agentless',     label:'Agentless Scan', icon:'Radar',           sub:'Snapshot-based · No agents' },
  { id:'data-security', label:'Data Security',  icon:'Lock',            sub:'DSPM · Database',
    ch:[{id:'datasec',label:'Data Posture'}] },
  { section:'CODE SECURITY' },
  { id:'code-security', label:'Code Security',  icon:'Code',            sub:'SAST · SCA · IaC',
    ch:[{id:'secops',label:'Overview'},{id:'secops-projects',label:'Projects'},{id:'secops-reports',label:'Reports'}] },
  { section:'PLATFORM' },
  { id:'reports',       label:'Reports',        icon:'FileText' },
  { id:'onboarding',    label:'Onboarding',     icon:'UserPlus',        sub:'Providers · Users',
    ch:[{id:'onboarding-provider',label:'Provider Onboarding'},{id:'onboarding-users',label:'User Onboarding'}] },
  { id:'rules',         label:'Rules & Policy', icon:'BookOpen' },
  { id:'settings',      label:'Settings',       icon:'Settings2',
    ch:[{id:'settings-general',label:'General'},{id:'settings-integrations',label:'Integrations'}] },
  { section:'AI' },
  { id:'ai-assistant',  label:'AI Assistant',   icon:'Brain' },
  { section:'ADMINISTRATION' },
  { id:'admin-dashboard',label:'Admin Dashboard',icon:'LayoutGrid' },
  { id:'admin-billing', label:'Admin Billing',  icon:'DollarSign' },
  { id:'admin-orgs',    label:'Customer Orgs',  icon:'Building2' },
  { id:'admin-customers',label:'Customers',     icon:'Users' },
];

// ── SIDEBAR BUILDER ───────────────────────────────────────────────────────────
function sidebar(activeId, expandedIds=[]) {
  let h = `<div class="sb">
  <div class="sb-logo">
    <img src="https://d1fp5dwui44wle.cloudfront.net/logo.svg" alt="Onam Security" style="height:34px;width:auto;max-width:164px"
      onerror="this.style.display='none';document.getElementById('lf').style.display='flex'"/>
    <div id="lf" style="display:none;align-items:center;gap:8px">
      <svg width="24" height="24" viewBox="0 0 32 32"><defs><linearGradient id="lg" x1="0" y1="0" x2="1" y2="1"><stop offset="0%" stop-color="#818CF8"/><stop offset="100%" stop-color="#6366F1"/></linearGradient></defs><path d="M16 2L28 7L28 17C28 23 22 28 16 30C10 28 4 23 4 17L4 7Z" fill="url(#lg)"/><circle cx="16" cy="16" r="6" fill="none" stroke="white" stroke-width="2"/></svg>
      <span style="font-size:13.5px;font-weight:700;color:#0f172a">Onam Security</span>
    </div>
  </div>
  <nav class="sb-nav" id="sbNav">`;

  for (const item of NAV) {
    if (item.section) {
      h += `<div class="sb-sec">${item.section}</div>`;
      continue;
    }
    const hasChildren = !!(item.ch && item.ch.length);
    const childActive = hasChildren && item.ch.some(c => c.id === activeId);
    const isActive = item.id === activeId && !childActive;
    const isExpanded = expandedIds.includes(item.id) || childActive || isActive;
    const accent = item.accent || '#4338ca';

    h += `<div class="sb-item${isActive?' active':''}" style="${isActive?`border-left-color:${accent}`:''}" data-id="${item.id}">
      ${svg(item.icon, 16)}
      <div class="sb-lw">
        <span class="sb-label">${item.label}</span>
        ${item.sub?`<span class="sb-sub">${item.sub}</span>`:''}
      </div>
      ${hasChildren?`<svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" style="margin-left:auto;flex-shrink:0;color:#94a3b8;transition:transform .2s;${isExpanded?'transform:rotate(180deg)':''}"><polyline points="6 9 12 15 18 9"/></svg>`:''}
    </div>`;

    if (hasChildren && isExpanded) {
      h += `<div class="sb-children">`;
      for (const c of item.ch) {
        const ca = c.id === activeId;
        h += `<div class="sb-child${ca?' active':''}" data-id="${c.id}">${c.label}</div>`;
      }
      h += `</div>`;
    }
  }

  h += `</nav>
  <div class="sb-user">
    <div class="sb-avatar">AY</div>
    <div><div style="font-size:12px;font-weight:600;color:#0f172a">Anup Yadav</div><div style="font-size:10.5px;color:#94a3b8">Security Admin</div></div>
    <div style="margin-left:auto;color:#94a3b8">${svg('Settings2',14)}</div>
  </div>
</div>
<script>window.addEventListener('DOMContentLoaded',()=>{const el=document.querySelector('.sb-item.active,.sb-child.active');if(el)el.scrollIntoView({block:'center',behavior:'instant'});});</script>`;
  return h;
}

// ── PAGE BUILDER ──────────────────────────────────────────────────────────────
function page(activeId, expanded, title, body, extraCss='', script='') {
  return `<!DOCTYPE html><html lang="en"><head><meta charset="utf-8"><title>${title} — Onam Security</title>
<style>${CSS}${extraCss}</style></head><body>
${sidebar(activeId, expanded)}
<div class="main">${body}</div>
${script}
</body></html>`;
}

// ── TOPBAR HELPER ─────────────────────────────────────────────────────────────
function topbar(title, right, pills=[]) {
  const pillsHtml = pills.map(([t,s])=>badge(t,s)).join('');
  return `<div class="topbar">
  <div style="display:flex;align-items:center;gap:10px">
    <span class="tb-title">${title}</span>
    ${pillsHtml}
  </div>
  <div class="tb-right">${right}</div>
</div>`;
}

// ── SCREEN: DASHBOARD ─────────────────────────────────────────────────────────
const dashboard = page('dashboard', [], 'Dashboard', `
${topbar('Dashboard','<button class="btn-secondary">aws-prod-main ▾</button><button class="btn-primary">↺ Run Scan</button>',[['Last scan: 2 min ago','gray']])}
<div class="content">
  <div class="kpi-row">
    <div class="kpi" style="border-left-color:#f97316">
      <div class="kpi-v" style="color:#ea580c">68</div>
      <div class="kpi-l">Risk Score</div>
      <div class="kpi-d" style="color:#ea580c">▲ +4 from last scan</div>
    </div>
    <div class="kpi" style="border-left-color:#e11d48">
      <div class="kpi-v" style="color:#be123c">12</div>
      <div class="kpi-l">Critical Findings</div>
      <div class="kpi-d" style="color:#be123c">▲ 3 new since yesterday</div>
    </div>
    <div class="kpi" style="border-left-color:#6366f1">
      <div class="kpi-v">12,481</div>
      <div class="kpi-l">Cloud Assets</div>
      <div class="kpi-d" style="color:#16a34a">▲ 231 discovered today</div>
    </div>
    <div class="kpi" style="border-left-color:#22c55e">
      <div class="kpi-v" style="color:#16a34a">74%</div>
      <div class="kpi-l">Compliance Score</div>
      <div class="kpi-d" style="color:#64748b">CIS · NIST · SOC 2</div>
    </div>
  </div>

  <div style="display:grid;grid-template-columns:1fr 1fr 320px;gap:14px">
    <!-- Severity breakdown -->
    <div class="card">
      <div class="card-header">Finding Severity Breakdown</div>
      <div class="card-body">
        ${[['Critical',12,'#be123c'],['High',89,'#c2410c'],['Medium',234,'#a16207'],['Low',512,'#1e40af'],['Info',204,'#475569']].map(([s,n,c])=>`
        <div style="display:flex;align-items:center;gap:10px;padding:7px 0;border-bottom:1px solid #f8fafc">
          <span style="width:62px;font-size:11.5px;font-weight:600;color:${c}">${s}</span>
          <div style="flex:1;height:6px;background:#f1f5f9;border-radius:3px;overflow:hidden">
            <div style="height:100%;width:${Math.round(n/512*100)}%;background:${c};border-radius:3px"></div>
          </div>
          <span style="width:32px;text-align:right;font-size:12.5px;font-weight:700;color:#0f172a">${n}</span>
        </div>`).join('')}
      </div>
    </div>

    <!-- Engine status -->
    <div class="card">
      <div class="card-header">Engine Status
        <span style="font-size:10.5px;font-weight:500;color:#94a3b8">Last run: 2 min ago</span>
      </div>
      <div class="card-body">
        <table class="tbl" style="border:none;box-shadow:none">
          <thead><tr><th style="padding:6px 0">Engine</th><th style="padding:6px 0">Status</th><th style="padding:6px 0">Findings</th><th style="padding:6px 0">Last Scan</th></tr></thead>
          <tbody>
          ${[['IAM Security',47,'2m'],['Network Security',31,'2m'],['Compliance',178,'3m'],['CDR','Live','—'],['Risk',5,'5m'],['Data Security',24,'4m'],['Container',9,'3m'],['Encryption',11,'2m'],['Vulnerability',63,'3m']].map(([e,f,t])=>`
          <tr>
            <td style="padding:7px 0;font-size:12px;font-weight:500;border-bottom:1px solid #f8fafc">${e}</td>
            <td style="padding:7px 0;border-bottom:1px solid #f8fafc"><span class="status-dot-green">Active</span></td>
            <td style="padding:7px 0;font-size:12px;font-weight:600;color:#334155;border-bottom:1px solid #f8fafc">${typeof f==='number'?f:badge(f,'cyan')}</td>
            <td style="padding:7px 0;font-size:11px;color:#94a3b8;border-bottom:1px solid #f8fafc">${t} ago</td>
          </tr>`).join('')}
          </tbody>
        </table>
      </div>
    </div>

    <!-- Top critical findings -->
    <div class="card" style="display:flex;flex-direction:column">
      <div class="card-header">Top Critical Findings</div>
      <div class="card-body" style="flex:1">
        ${[
          ['S3 bucket public read ACL enabled','Data Security'],
          ['Root account has no MFA device','IAM Security'],
          ['SG allows 0.0.0.0/0 on port 22','Network Security'],
          ['IAM role with wildcard admin policy','IAM Security'],
          ['EKS pod running as root UID 0','Container Security'],
          ['CloudTrail not enabled — us-east-2','Compliance'],
        ].map(([t,e])=>`
        <div style="display:flex;gap:10px;padding:9px 0;border-bottom:1px solid #f8fafc;align-items:flex-start">
          <div style="width:8px;height:8px;border-radius:50%;background:#e11d48;flex-shrink:0;margin-top:4px"></div>
          <div>
            <div style="font-size:12px;font-weight:500;color:#0f172a;line-height:1.35">${t}</div>
            <div style="font-size:10.5px;color:#94a3b8;margin-top:1px">${e}</div>
          </div>
        </div>`).join('')}
      </div>
    </div>
  </div>

  <!-- Cloud accounts -->
  <div style="display:grid;grid-template-columns:repeat(3,1fr);gap:14px;margin-top:14px">
    ${[['Amazon Web Services','12,481 assets','#FF9900','Connected','aws-prod-main'],['Google Cloud Platform','2,340 assets','#4285F4','Connected','gcp-acme-prod'],['Microsoft Azure','Not connected','#0078D4','Connect Now','—']].map(([p,a,c,s,acct])=>`
    <div class="card" style="padding:16px 20px;display:flex;align-items:center;gap:14px">
      <div style="width:40px;height:40px;border-radius:10px;background:${c}18;display:flex;align-items:center;justify-content:center;flex-shrink:0">
        <span style="font-size:15px;font-weight:900;color:${c}">${p[0]}</span>
      </div>
      <div style="flex:1;min-width:0">
        <div style="font-size:12.5px;font-weight:700;color:#0f172a">${p}</div>
        <div style="font-size:11px;color:#64748b;margin-top:1px">${acct !== '—' ? acct+' · '+a : a}</div>
      </div>
      ${s==='Connected'?badge('● Connected','green'):badge('Connect Now','gray')}
    </div>`).join('')}
  </div>
</div>`);

// ── SCREEN: FINDINGS/ALERTS ───────────────────────────────────────────────────
const findings = page('alerts', ['cloud-posture'], 'Alerts', `
${topbar('Alerts','<button class="btn-secondary">Columns ▾</button><button class="btn-primary">↓ Export</button>',[['12 CRITICAL','red'],['89 HIGH','orange']])}
<div class="content">
  <div class="filter-bar">
    <div class="ftab on">All <span style="opacity:.5;font-weight:500;margin-left:3px">1,051</span></div>
    <div class="ftab off" style="color:#be123c">Critical <b>12</b></div>
    <div class="ftab off" style="color:#c2410c">High <b>89</b></div>
    <div class="ftab off" style="color:#92400e">Medium <b>234</b></div>
    <div class="ftab off" style="color:#1e40af">Low <b>512</b></div>
    <div class="ftab off">Open</div>
    <div class="ftab off">Suppressed</div>
    <div class="search-inp">${svg('Radar',13)} <span>Search findings…</span></div>
  </div>

  <div class="tbl-wrap">
    <table class="tbl">
      <thead><tr><th>Severity</th><th>Finding</th><th>Resource</th><th>Engine</th><th>Account</th><th>Age</th><th>Status</th></tr></thead>
      <tbody>
      ${[
        ['CRITICAL','S3 bucket public read ACL enabled','acme-prod-data','Data Security','aws-prod-main','2h'],
        ['CRITICAL','Root account has no MFA device','root (AWS account)','IAM Security','aws-prod-main','14d'],
        ['CRITICAL','Security group allows 0.0.0.0/0:22','sg-0ab1cd234ef56','Network Security','aws-prod-main','3d'],
        ['HIGH','IAM role with wildcard admin (*:*)','OpsAdminRole','IAM Security','aws-prod-main','7d'],
        ['HIGH','EKS pod running as root — UID 0','pod/api-server-7d4f','Container Security','aws-prod-main','1d'],
        ['HIGH','KMS key rotation not enabled','key/prod-rds-2024','Encryption','aws-prod-main','21d'],
        ['HIGH','CloudTrail logging disabled — us-east-2','us-east-2 region','Compliance','aws-prod-main','5d'],
        ['MEDIUM','S3 bucket MFA delete not enabled','acme-logs-archive','Data Security','aws-prod-main','10d'],
        ['MEDIUM','EC2 instance metadata IMDSv1 active','i-0abc1234def5678','Network Security','aws-prod-main','5d'],
        ['LOW','Lambda function without X-Ray tracing','fn-acme-processor','Compliance','aws-prod-main','3d'],
      ].map(([sev,finding,res,eng,acct,age],i)=>`
      <tr>
        <td>${sevBadge(sev)}</td>
        <td style="max-width:260px">
          <div style="font-size:12.5px;font-weight:500;color:#0f172a;line-height:1.35">${finding}</div>
        </td>
        <td><span class="mono" style="color:#334155">${res}</span></td>
        <td>${badge(eng,'purple')}</td>
        <td class="row-meta">${acct}</td>
        <td class="row-meta">${age}</td>
        <td>${i<8?badge('Open','red'):badge('Suppressed','gray')}</td>
      </tr>`).join('')}
      </tbody>
    </table>
  </div>

  <div style="display:flex;justify-content:space-between;align-items:center;margin-top:12px">
    <span style="font-size:11.5px;color:#94a3b8">Showing 1–10 of <b style="color:#334155">1,051</b> findings</span>
    <div style="display:flex;gap:4px">
      ${[1,2,3,'…',105].map((n,i)=>`<button style="min-width:30px;height:30px;padding:0 8px;border-radius:6px;border:1.5px solid ${i===0?'#6366f1':'#e2e8f0'};background:${i===0?'#6366f1':'#fff'};color:${i===0?'#fff':'#64748b'};font-size:11.5px;font-weight:${i===0?'700':'500'};cursor:pointer">${n}</button>`).join('')}
    </div>
  </div>
</div>`);

// ── SCREEN: ATTACK PATH ───────────────────────────────────────────────────────
const attackPath = page('attack-paths-main', ['attack-paths'], 'Attack Paths', `
${topbar('Attack Path Analysis','<button class="btn-secondary">Filter ▾</button><button class="btn-primary">↓ Export Report</button>',[['3 Paths to Crown Jewels','red']])}
<div style="flex:1;display:grid;grid-template-columns:300px 1fr;overflow:hidden">
  <div style="border-right:1px solid var(--border);overflow-y:auto;background:#fafbfc">
    <div style="padding:11px 16px;font-size:10.5px;font-weight:700;color:#64748b;letter-spacing:.06em;text-transform:uppercase;border-bottom:1px solid var(--border)">3 Attack Paths</div>
    ${[
      ['Path to Crown Jewel S3','EC2 → IMDSv1 → IAM PassRole → S3','CRITICAL','4 hops','#be123c',true],
      ['Admin Escalation via Lambda','Lambda → Env Vars → RoleChain → DDB','HIGH','3 hops','#c2410c',false],
      ['SG Breach to RDS via Bastion','Public SG → Bastion EC2 → RDS Master','HIGH','3 hops','#c2410c',false],
    ].map(([title,desc,sev,hops,c,active])=>`
    <div style="padding:14px 16px;border-bottom:1px solid var(--border);cursor:pointer;border-left:3px solid ${active?'#6366f1':'transparent'};background:${active?'rgba(99,102,241,.04)':'white'}">
      <div style="display:flex;align-items:flex-start;justify-content:space-between;gap:8px;margin-bottom:5px">
        <div style="font-size:12.5px;font-weight:600;color:#0f172a;line-height:1.3">${title}</div>
        ${sevBadge(sev)}
      </div>
      <div style="font-size:11px;color:#64748b;margin-bottom:7px;line-height:1.4">${desc}</div>
      <div style="display:flex;gap:5px">${badge(hops,'gray')}${badge('T1552.005','purple')}</div>
    </div>`).join('')}
  </div>

  <div style="position:relative;background:#fff;overflow:hidden">
    <svg style="position:absolute;inset:0;width:100%;height:100%" viewBox="0 0 1000 750">
      <defs>
        <marker id="arh" viewBox="0 0 10 10" refX="9" refY="5" markerWidth="6" markerHeight="6" orient="auto">
          <path d="M 0 0 L 10 5 L 0 10 z" fill="#94a3b8"/>
        </marker>
        <filter id="nsh"><feDropShadow dx="0" dy="2" stdDeviation="4" flood-opacity=".08"/></filter>
      </defs>
      <!-- Edges -->
      <line x1="185" y1="280" x2="320" y2="280" stroke="#f97316" stroke-width="1.5" stroke-dasharray="5,3" marker-end="url(#arh)"/>
      <line x1="490" y1="280" x2="620" y2="280" stroke="#8b5cf6" stroke-width="1.5" stroke-dasharray="5,3" marker-end="url(#arh)"/>
      <line x1="800" y1="280" x2="900" y2="280" stroke="#dc2626" stroke-width="1.5" stroke-dasharray="5,3" marker-end="url(#arh)"/>
      <!-- Edge labels -->
      <text x="240" y="268" fill="#c2410c" font-size="9" font-weight="700" font-family="Inter,sans-serif" text-anchor="middle">IMDSv1</text>
      <text x="554" y="268" fill="#7c3aed" font-size="9" font-weight="700" font-family="Inter,sans-serif" text-anchor="middle">iam:PassRole</text>
      <text x="848" y="268" fill="#dc2626" font-size="9" font-weight="700" font-family="Inter,sans-serif" text-anchor="middle">s3:GetObject</text>
      <!-- Node: EC2 -->
      <g filter="url(#nsh)"><rect x="60" y="240" width="125" height="74" rx="10" fill="#fff" stroke="#fdba74" stroke-width="1.5"/>
      <text x="122" y="257" fill="#c2410c" font-size="8.5" font-weight="700" font-family="Inter,sans-serif" text-anchor="middle">EC2 INSTANCE</text>
      <text x="122" y="273" fill="#0f172a" font-size="11" font-weight="700" font-family="Inter,sans-serif" text-anchor="middle">i-0abc1234def</text>
      <text x="122" y="288" fill="#94a3b8" font-size="9" font-family="Inter,sans-serif" text-anchor="middle">IMDSv1 enabled</text>
      <rect x="70" y="302" width="105" height="5" rx="2.5" fill="#fef3c7"/>
      <rect x="70" y="302" width="85" height="5" rx="2.5" fill="#f97316"/></g>
      <!-- Node: IAM -->
      <g filter="url(#nsh)"><rect x="320" y="240" width="170" height="74" rx="10" fill="#fff" stroke="#c4b5fd" stroke-width="1.5"/>
      <text x="405" y="257" fill="#7c3aed" font-size="8.5" font-weight="700" font-family="Inter,sans-serif" text-anchor="middle">IAM ROLE</text>
      <text x="405" y="273" fill="#0f172a" font-size="11" font-weight="700" font-family="Inter,sans-serif" text-anchor="middle">OpsAdminRole</text>
      <text x="405" y="288" fill="#94a3b8" font-size="9" font-family="Inter,sans-serif" text-anchor="middle">iam:PassRole:* — wildcard</text>
      <rect x="330" y="302" width="150" height="5" rx="2.5" fill="#f5f3ff"/>
      <rect x="330" y="302" width="150" height="5" rx="2.5" fill="#8b5cf6"/></g>
      <!-- Node: S3 Crown Jewel -->
      <g filter="url(#nsh)"><rect x="620" y="220" width="170" height="90" rx="10" fill="#fff1f2" stroke="#fca5a5" stroke-width="2"/>
      <text x="705" y="240" fill="#be123c" font-size="8.5" font-weight="800" font-family="Inter,sans-serif" text-anchor="middle">S3 CROWN JEWEL</text>
      <text x="705" y="258" fill="#0f172a" font-size="11" font-weight="700" font-family="Inter,sans-serif" text-anchor="middle">acme-prod-data</text>
      <text x="705" y="274" fill="#94a3b8" font-size="9" font-family="Inter,sans-serif" text-anchor="middle">847K PII records</text>
      <rect x="630" y="284" width="150" height="18" rx="4" fill="#fecdd3"/>
      <text x="705" y="296" fill="#be123c" font-size="9" font-weight="700" font-family="Inter,sans-serif" text-anchor="middle">⚠ PUBLIC READ ACL</text></g>
      <!-- MITRE badges -->
      <rect x="56" y="335" width="140" height="18" rx="4" fill="#fff7ed" stroke="#fed7aa"/>
      <text x="126" y="348" fill="#c2410c" font-size="9" font-weight="700" font-family="Inter,sans-serif" text-anchor="middle">T1552.005 — Credential API</text>
      <rect x="316" y="335" width="175" height="18" rx="4" fill="#f5f3ff" stroke="#c4b5fd"/>
      <text x="403" y="348" fill="#7c3aed" font-size="9" font-weight="700" font-family="Inter,sans-serif" text-anchor="middle">T1078.004 — Valid Cloud Accounts</text>
      <rect x="616" y="335" width="180" height="18" rx="4" fill="#fff1f2" stroke="#fca5a5"/>
      <text x="706" y="348" fill="#be123c" font-size="9" font-weight="700" font-family="Inter,sans-serif" text-anchor="middle">T1530 — Data from Cloud Storage</text>
    </svg>
    <!-- Detail panel -->
    <div style="position:absolute;bottom:22px;right:22px;width:290px;background:#fff;border:1px solid var(--border);border-radius:var(--r-xl);padding:18px;box-shadow:var(--shadow-md)">
      <div style="font-size:12.5px;font-weight:700;color:#0f172a;margin-bottom:12px">Path Detail: EC2 → S3</div>
      ${[['MITRE ATT&CK','T1552.005 · Credential API'],['Hops to breach','4 (EC2 → IMDSv1 → IAM → S3)'],['Data at risk','847,234 PII records'],['Fix priority','P0 — Disable IMDSv1'],['Estimated ALE','$2.1M – $6.4M']].map(([k,v])=>`
      <div style="display:grid;grid-template-columns:105px 1fr;gap:8px;padding:6px 0;border-bottom:1px solid #f8fafc;align-items:start">
        <span style="font-size:11px;color:#94a3b8;font-weight:500">${k}</span>
        <span style="font-size:11.5px;font-weight:600;color:#334155;line-height:1.3">${v}</span>
      </div>`).join('')}
    </div>
  </div>
</div>`);

// ── SCREEN: IAM ───────────────────────────────────────────────────────────────
const iam = page('iam', ['cloud-posture'], 'IAM Security', `
${topbar('IAM Security','<button class="btn-secondary">Export ▾</button><button class="btn-primary">Run IAM Scan</button>',[['189 Identities','gray'],['47 Overprivileged','orange']])}
<div class="content">
  <div class="kpi-row">
    ${[['189','Total Identities','#6366f1',''],['47','Overprivileged','#c2410c','▲ +6 this week'],['3','No MFA (Admins)','#be123c','Needs immediate fix'],['8','Wildcard Policies','#be123c','Critical risk']].map(([v,l,c,d])=>`
    <div class="kpi" style="border-left-color:${c}">
      <div class="kpi-v" style="color:${c}">${v}</div>
      <div class="kpi-l">${l}</div>
      ${d?`<div class="kpi-d" style="color:${c==='#6366f1'?'#64748b':c}">${d}</div>`:''}
    </div>`).join('')}
  </div>
  <div class="tbl-wrap">
    <table class="tbl">
      <thead><tr><th>Identity</th><th>Type</th><th>Risk Score</th><th>Issues</th><th>Last Activity</th><th>MFA</th><th>Status</th></tr></thead>
      <tbody>
      ${[
        ['root','Root Account',95,'No MFA · No hardware key · Console access','Never used','None','CRITICAL'],
        ['OpsAdminRole','IAM Role',88,'Wildcard admin iam:* · 12 services','2h ago','N/A','HIGH'],
        ['john.doe@acme.com','IAM User',74,'No MFA · Inactive 90d · Old access key','90d ago','None','HIGH'],
        ['DeployPipelineRole','IAM Role',62,'iam:PassRole:* — broad scope','1d ago','N/A','MEDIUM'],
        ['BackupLambdaRole','IAM Role',50,'s3:* on * — over-permissioned','3h ago','N/A','MEDIUM'],
        ['jane.smith@acme.com','IAM User',28,'Console + API access','1h ago','Enabled','LOW'],
        ['ReadOnlyAdmin','IAM Role',22,'Policy not used in 180d','6m ago','N/A','LOW'],
        ['ci-deploy-key','Access Key',81,'Key age: 420 days · Rotation overdue','30m ago','N/A','HIGH'],
      ].map(([id,type,score,issues,last,mfa,status])=>{
        const sc = score>=80?'#be123c':score>=60?'#c2410c':score>=40?'#a16207':'#16a34a';
        const sbadge = {CRITICAL:sevBadge('CRITICAL'),HIGH:sevBadge('HIGH'),MEDIUM:sevBadge('MEDIUM'),LOW:sevBadge('LOW')}[status]||badge(status,'gray');
        return `<tr>
          <td><span class="mono" style="font-weight:600;color:#0f172a">${id}</span></td>
          <td>${badge(type,'gray')}</td>
          <td>
            <div style="display:flex;align-items:center;gap:8px">
              <div style="width:52px;height:5px;background:#f1f5f9;border-radius:3px;overflow:hidden">
                <div style="width:${score}%;height:100%;background:${sc};border-radius:3px"></div>
              </div>
              <span style="font-size:12px;font-weight:700;color:${sc}">${score}</span>
            </div>
          </td>
          <td style="max-width:220px;font-size:11.5px;color:#334155;line-height:1.4">${issues}</td>
          <td class="row-meta">${last}</td>
          <td>${mfa==='Enabled'?badge('Enabled','green'):mfa==='None'?badge('None','red'):badge('N/A','gray')}</td>
          <td>${sbadge}</td>
        </tr>`;
      }).join('')}
      </tbody>
    </table>
  </div>
</div>`);

// ── SCREEN: NETWORK ───────────────────────────────────────────────────────────
const network = page('network-security', ['cloud-posture'], 'Network Security', `
${topbar('Network Security','<button class="btn-secondary">Topology View</button><button class="btn-primary">↓ Export</button>',[['5 VPCs','gray'],['7 Internet-Exposed','red']])}
<div class="content">
  <div class="kpi-row">
    ${[['5','VPCs','#6366f1',''],['47','Security Groups','#334155',''],['7','Internet-Exposed','#be123c','▲ 2 new today'],['23','Open Risky Ports','#c2410c','']].map(([v,l,c,d])=>`
    <div class="kpi" style="border-left-color:${c}">
      <div class="kpi-v" style="color:${c}">${v}</div>
      <div class="kpi-l">${l}</div>
      ${d?`<div class="kpi-d" style="color:${c}">${d}</div>`:''}
    </div>`).join('')}
  </div>
  <div class="tbl-wrap">
    <table class="tbl">
      <thead><tr><th>Resource</th><th>VPC</th><th>Security Group</th><th>Exposed Ports</th><th>Source CIDR</th><th>Risk</th><th>Recommendation</th></tr></thead>
      <tbody>
      ${[
        ['i-0abc1234 (Bastion)','vpc-prod-01','sg-0ab1cd234','22 (SSH)','0.0.0.0/0 :/0','CRITICAL','Restrict to VPN CIDR only'],
        ['rds-main-postgres','vpc-prod-01','sg-0cd3ef901','5432 (PG)','0.0.0.0/0','CRITICAL','Move to private subnet'],
        ['i-0def5678 (Jump Host)','vpc-dev-02','sg-0ab2de345','22, 3389 (RDP)','0.0.0.0/0','HIGH','Disable RDP — 3389 unused'],
        ['elb-api-prod','vpc-prod-01','sg-0ef5ab678','443 (HTTPS)','0.0.0.0/0','LOW','Expected — HTTPS only'],
        ['elasticache-redis','vpc-prod-01','sg-0ef6cd789','6379','10.0.0.0/8','LOW','Internal network only'],
        ['ecs-fargate-api','vpc-prod-01','sg-0gh7ij890','8080','VPC internal','INFO','No external exposure'],
        ['nat-gateway-prod','vpc-prod-01','—','Egress only','—','INFO','Expected behavior'],
        ['s3-vpc-endpoint','vpc-prod-01','—','443','VPC endpoint','LOW','Gateway endpoint — secure'],
      ].map(([res,vpc,sg,ports,src,risk,rec])=>`
      <tr>
        <td style="font-size:12.5px;font-weight:500;color:#0f172a">${res}</td>
        <td><span class="mono">${vpc}</span></td>
        <td><span class="mono" style="color:#64748b">${sg}</span></td>
        <td><span class="mono" style="padding:2px 8px;background:${risk==='CRITICAL'||risk==='HIGH'?'#fff1f2':'#f8fafc'};border:1px solid ${risk==='CRITICAL'||risk==='HIGH'?'#fecdd3':'#e2e8f0'};border-radius:5px;color:${risk==='CRITICAL'||risk==='HIGH'?'#be123c':'#334155'}">${ports}</span></td>
        <td><span class="mono" style="color:${src.includes('0.0.0.0')?'#be123c':'#64748b'}">${src}</span></td>
        <td>${sevBadge(risk==='INFO'?'INFO':risk)}</td>
        <td style="font-size:11.5px;color:#64748b">${rec}</td>
      </tr>`).join('')}
      </tbody>
    </table>
  </div>
</div>`);

// ── SCREEN: CDR ───────────────────────────────────────────────────────────────
const cdr = page('cdr', [], 'CDR', `
${topbar('Cloud Detection & Response','<button class="btn-secondary">Configure Rules</button><button class="btn-primary">↓ Export</button>',[['● Live','green'],['4 Active Alerts','red'],['2.3M events/hr','gray']])}
<div class="content">
  <div class="kpi-row">
    ${[['2.3M','Events / Hour','#6366f1',''],['4','Active Alerts','#be123c','3 Critical · 1 High'],['847','CloudTrail Events','#334155','Last 15 minutes'],['12','Blocked IPs','#c2410c','Auto-remediated']].map(([v,l,c,d])=>`
    <div class="kpi" style="border-left-color:${c}">
      <div class="kpi-v" style="color:${c}">${v}</div>
      <div class="kpi-l">${l}</div>
      ${d?`<div class="kpi-d" style="color:#64748b">${d}</div>`:''}
    </div>`).join('')}
  </div>
  <div class="tbl-wrap">
    <table class="tbl">
      <thead><tr><th>Time</th><th>Alert</th><th>MITRE Technique</th><th>Source IP</th><th>Resource</th><th>Severity</th><th>Status</th></tr></thead>
      <tbody>
      ${[
        ['2m ago','Unusual API call pattern — GetSecretValue burst (47 calls/min)','T1552.005','185.220.101.47','secretsmanager:prod/*','CRITICAL','Investigating'],
        ['7m ago','Root account console login from unrecognized location','T1078.004','203.0.113.42','AWS Console / root','CRITICAL','Alerting'],
        ['14m ago','IAM role assumed from unusual region — ap-east-1','T1078.004','10.0.2.145','OpsAdminRole','HIGH','Alerting'],
        ['23m ago','S3 large data exfiltration — 4.7 GB GetObject in 3 min','T1530','198.51.100.23','acme-prod-data','CRITICAL','Contained'],
        ['45m ago','CloudTrail logging stopped — us-west-2','T1562.008','10.0.1.88','CloudTrail/main','HIGH','Resolved'],
        ['1h ago','EC2 metadata service abuse — multiple token requests','T1552.005','10.0.0.201','i-0abc1234def','MEDIUM','Resolved'],
        ['2h ago','Lambda execution anomaly — high CPU (crypto-mining sig)','T1496','Internal','fn-acme-processor','HIGH','Resolved'],
        ['3h ago','VPC Flow anomaly — lateral movement pattern detected','T1021','10.0.1.54','vpc-prod-01','MEDIUM','Resolved'],
      ].map(([time,alert,mitre,ip,res,sev,status])=>{
        const stmap = {Investigating:'red',Alerting:'orange',Contained:'amber',Resolved:'green'};
        return `<tr>
          <td class="row-meta" style="white-space:nowrap">${time}</td>
          <td style="max-width:280px;font-size:12px;font-weight:500;color:#0f172a;line-height:1.4">${alert}</td>
          <td>${badge(mitre,'purple')}</td>
          <td><span class="mono">${ip}</span></td>
          <td><span class="mono" style="color:#64748b">${res}</span></td>
          <td>${sevBadge(sev)}</td>
          <td>${badge(status,stmap[status]||'gray')}</td>
        </tr>`;
      }).join('')}
      </tbody>
    </table>
  </div>
</div>`);

// ── SCREEN: CONTAINER ─────────────────────────────────────────────────────────
const container = page('container-security', ['cloud-posture'], 'Container Security', `
${topbar('Container Security','<button class="btn-secondary">Scan Clusters</button><button class="btn-primary">↓ Export SBOM</button>',[['3 CVEs — Active Exploits','red'],['KEV Listed','orange']])}
<div class="content">
  <div class="kpi-row">
    ${[['3','EKS Clusters','#6366f1',''],['24','Nodes','#334155',''],['3','Critical CVEs','#be123c','Active exploits in the wild'],['12','RBAC Violations','#c2410c','']].map(([v,l,c,d])=>`
    <div class="kpi" style="border-left-color:${c}">
      <div class="kpi-v" style="color:${c}">${v}</div>
      <div class="kpi-l">${l}</div>
      ${d?`<div class="kpi-d" style="color:${c}">${d}</div>`:''}
    </div>`).join('')}
  </div>
  <div class="tbl-wrap">
    <table class="tbl">
      <thead><tr><th>CVE ID</th><th>CVSS</th><th>EPSS Score</th><th>Package</th><th>Image</th><th>Cluster</th><th>Status</th></tr></thead>
      <tbody>
      ${[
        ['CVE-2024-21626',9.8,0.972,'runc 1.1.5','nginx:1.24','prod-eks-01','EXPLOIT KNOWN'],
        ['CVE-2023-44487',7.5,0.841,'golang.org/x/net','api-server:v2.1','prod-eks-01','KEV Listed'],
        ['CVE-2024-3094',10.0,0.998,'liblzma 5.6.0','sidecar:latest','dev-eks-02','EXPLOIT KNOWN'],
        ['CVE-2023-47108',7.5,0.342,'go.opentelemetry.io','telemetry:v1.2','prod-eks-01','Patch Available'],
        ['CVE-2023-45857',6.5,0.127,'axios 1.4.0','frontend:v3.8','dev-eks-02','Patch Available'],
        ['CVE-2024-29018',7.4,0.089,'docker/compose','tooling:v1.1','staging-eks-03','Patch Available'],
        ['CVE-2023-2253',7.5,0.211,'distribution 2.8.1','registry:2.8','prod-eks-01','Patch Available'],
        ['CVE-2024-24786',5.9,0.062,'google.golang.org/protobuf','grpc-proxy:v1.0','staging-eks-03','Under Review'],
      ].map(([cve,cvss,epss,pkg,img,cluster,status])=>{
        const cvssStyle = cvss>=9?['#be123c','#fff1f2','#fecdd3']:cvss>=7?['#c2410c','#fff7ed','#fed7aa']:cvss>=5?['#92400e','#fffbeb','#fde68a']:['#1e40af','#eff6ff','#bfdbfe'];
        const stmap = {'EXPLOIT KNOWN':'red','KEV Listed':'orange','Patch Available':'amber','Under Review':'gray'};
        return `<tr>
          <td><span class="mono" style="font-weight:700;color:#6366f1">${cve}</span></td>
          <td><span style="display:inline-flex;height:20px;padding:0 8px;border-radius:5px;font-size:10.5px;font-weight:700;align-items:center;color:${cvssStyle[0]};background:${cvssStyle[1]};border:1px solid ${cvssStyle[2]}">${cvss}</span></td>
          <td><span style="font-size:12.5px;font-weight:${epss>0.5?'700':'400'};color:${epss>0.5?'#be123c':'#64748b'}">${epss.toFixed(3)}</span></td>
          <td><span class="mono" style="color:#334155">${pkg}</span></td>
          <td><span class="mono" style="color:#64748b">${img}</span></td>
          <td class="row-meta">${cluster}</td>
          <td>${badge(status,stmap[status]||'gray')}</td>
        </tr>`;
      }).join('')}
      </tbody>
    </table>
  </div>
</div>`);

// ── SCREEN: COMPLIANCE ────────────────────────────────────────────────────────
const compliance = page('compliance', [], 'Compliance', `
${topbar('Compliance','<button class="btn-secondary">Schedule Report</button><button class="btn-primary">↓ Export PDF</button>',[['6 Frameworks','purple'],['565 Failing Controls','orange']])}
<div class="content">
  <div style="display:grid;grid-template-columns:repeat(3,1fr);gap:14px;margin-bottom:18px">
    ${[['CIS AWS Foundations v1.5',78,312,89],['NIST CSF 2.0',82,428,92],['SOC 2 Type II',71,186,74],['PCI-DSS v4.0',65,143,78],['HIPAA Security Rule',68,197,92],['ISO 27001:2022',74,211,74]].map(([fw,pct,pass,fail])=>{
      const c = scoreColor(pct);
      return `<div class="card" style="padding:18px 20px">
        <div style="display:flex;justify-content:space-between;align-items:flex-start;margin-bottom:10px">
          <div style="font-size:13px;font-weight:700;color:#0f172a;line-height:1.3">${fw}</div>
          <div style="font-size:24px;font-weight:800;color:${c};margin-left:10px;flex-shrink:0">${pct}%</div>
        </div>
        <div class="score-bar-wrap"><div class="score-bar" style="width:${pct}%;background:${c}"></div></div>
        <div style="display:flex;gap:12px;margin-top:8px">
          <span style="font-size:11px;font-weight:600;color:#16a34a">✓ ${pass} passing</span>
          <span style="font-size:11px;font-weight:600;color:#be123c">✗ ${fail} failing</span>
        </div>
      </div>`;
    }).join('')}
  </div>
  <div class="tbl-wrap">
    <table class="tbl">
      <thead><tr><th>Control ID</th><th>Description</th><th>Framework</th><th>Resource</th><th>Status</th></tr></thead>
      <tbody>
      ${[
        ['CIS 2.1.1','Ensure S3 bucket block public access is enabled','CIS AWS','acme-prod-data','FAIL'],
        ['NIST AC-2','Account management — MFA required for all privileged users','NIST CSF','IAM / root','FAIL'],
        ['SOC2 CC6.1','Encryption at rest — all data stores must be encrypted','SOC 2','rds-main','PASS'],
        ['PCI 8.3.6','Multi-factor authentication for all console access','PCI-DSS','IAM Users','FAIL'],
        ['HIPAA 164.312','Audit controls — CloudTrail enabled in all regions','HIPAA','CloudTrail','FAIL'],
        ['ISO A.12.4','Monitoring — VPC Flow Logs enabled and retained','ISO 27001','vpc-prod-01','PASS'],
        ['CIS 3.1','Ensure CloudTrail is enabled in all AWS regions','CIS AWS','us-east-2','FAIL'],
        ['NIST SC-28','Encryption in transit — TLS 1.2+ enforced on all endpoints','NIST CSF','ELB / ALB','PASS'],
      ].map(([ctrl,desc,fw,res,status])=>`
      <tr>
        <td><span class="mono" style="font-weight:700;color:#6366f1">${ctrl}</span></td>
        <td style="max-width:300px;font-size:12.5px;color:#1e293b;line-height:1.4">${desc}</td>
        <td>${badge(fw,'purple')}</td>
        <td><span class="mono" style="color:#64748b">${res}</span></td>
        <td>${badge(status,status==='PASS'?'green':'red')}</td>
      </tr>`).join('')}
      </tbody>
    </table>
  </div>
</div>`);

// ── SCREEN: DATA SECURITY ─────────────────────────────────────────────────────
const datasec = page('datasec', ['data-security'], 'Data Security', `
${topbar('Data Security — DSPM','<button class="btn-secondary">Run Classification</button><button class="btn-primary">↓ Export Report</button>',[['3 Public Buckets with PII','red'],['847K Records Exposed','red']])}
<div class="content">
  <div class="kpi-row">
    ${[['847K','PII Records Found','#be123c','SSN · CC · PHI'],['3','Public Buckets','#be123c','Immediate action required'],['12','Unencrypted Stores','#c2410c',''],['5','Cross-Region Data','#a16207','Residency risk']].map(([v,l,c,d])=>`
    <div class="kpi" style="border-left-color:${c}">
      <div class="kpi-v" style="color:${c}">${v}</div>
      <div class="kpi-l">${l}</div>
      ${d?`<div class="kpi-d" style="color:${c}">${d}</div>`:''}
    </div>`).join('')}
  </div>
  <div class="tbl-wrap">
    <table class="tbl">
      <thead><tr><th>Resource</th><th>Type</th><th>Data Classification</th><th style="text-align:right">Records</th><th>Encryption</th><th>Access Level</th><th>Risk</th></tr></thead>
      <tbody>
      ${[
        ['acme-prod-data','S3 Bucket','SSN · Credit Card · DOB','847,234','AES-256','PUBLIC READ','CRITICAL'],
        ['acme-user-exports','S3 Bucket','PII · Email · Phone','124,891','None','Authenticated','CRITICAL'],
        ['rds-main-postgres','RDS (PostgreSQL)','PII · Financial · PHI','2,341,009','AES-256','Private VPC','HIGH'],
        ['acme-logs-archive','S3 Bucket','Log Data · IP Addresses','44,200,000','AES-256','Private','LOW'],
        ['dynamodb-sessions','DynamoDB','Session Tokens · Auth Data','8,821','AWS Managed','Private','MEDIUM'],
        ['acme-analytics-raw','S3 Bucket','Behavioral · Clickstream','1,200,000,000','AES-256','Private','LOW'],
        ['elasticache-cache','ElastiCache','Cached PII (TTL 24h)','~50,000','In-transit only','Internal','MEDIUM'],
        ['acme-backup-vault','S3 Bucket','Encrypted PII · Backup','892,341','AES-256 KMS','Private','LOW'],
      ].map(([res,type,cls,records,enc,access,risk])=>`
      <tr>
        <td><span class="mono" style="font-weight:600;color:#0f172a">${res}</span></td>
        <td>${badge(type,'gray')}</td>
        <td style="font-size:12px;color:#334155">${cls}</td>
        <td style="text-align:right;font-size:12.5px;font-weight:600;color:#0f172a;font-variant-numeric:tabular-nums">${records}</td>
        <td>${enc==='None'?badge('None','red'):badge(enc,'green')}</td>
        <td><span style="font-size:12px;font-weight:500;color:${access.includes('PUBLIC')?'#be123c':'#64748b'}">${access}</span></td>
        <td>${sevBadge(risk)}</td>
      </tr>`).join('')}
      </tbody>
    </table>
  </div>
</div>`);

// ── SCREEN: RISK ──────────────────────────────────────────────────────────────
const risk = page('risk', [], 'Risk', `
${topbar('Risk — FAIR Model','<button class="btn-secondary">Monte Carlo Settings</button><button class="btn-primary">↓ Export Risk Report</button>',[['ALE: $2.4M – $8.7M','blue']])}
<div class="content">
  <div class="kpi-row">
    <div class="kpi" style="border-left-color:#be123c"><div class="kpi-v" style="color:#be123c;font-size:22px">$5.1M</div><div class="kpi-l">Annual Loss Expectancy</div><div class="kpi-d" style="color:#64748b">95th percentile estimate</div></div>
    <div class="kpi" style="border-left-color:#c2410c"><div class="kpi-v" style="color:#c2410c">68</div><div class="kpi-l">Risk Score</div><div class="kpi-d" style="color:#c2410c">▲ +4 this week</div></div>
    <div class="kpi" style="border-left-color:#6366f1"><div class="kpi-v">3</div><div class="kpi-l">Crown Jewels</div><div class="kpi-d" style="color:#64748b">At risk of breach</div></div>
    <div class="kpi" style="border-left-color:#0ea5e9"><div class="kpi-v" style="font-size:18px;color:#0e7490">$2.4M–$8.7M</div><div class="kpi-l">ALE Range (90% CI)</div><div class="kpi-d" style="color:#64748b">Monte Carlo · 10K sims</div></div>
  </div>

  <div style="display:grid;grid-template-columns:1fr 360px;gap:14px">
    <div class="card">
      <div class="card-header">Top Risk Scenarios <span style="font-size:10.5px;font-weight:500;color:#94a3b8">FAIR methodology · annualized</span></div>
      <div class="card-body">
        ${[
          ['Data Breach — S3 Crown Jewel','$2.1M','$6.4M',82,'#be123c'],
          ['IAM Compromise — Admin Escalation','$800K','$3.2M',74,'#c2410c'],
          ['Ransomware via Exposed RDP (3389)','$1.2M','$4.8M',68,'#c2410c'],
          ['Insider Threat — Bulk Data Exfil','$400K','$1.9M',55,'#a16207'],
          ['CloudTrail Disabled — Audit Gap','$200K','$800K',42,'#a16207'],
          ['Kubernetes Container Escape — RCE','$600K','$2.3M',61,'#c2410c'],
        ].map(([scenario,low,high,prob,c])=>`
        <div style="padding:11px 0;border-bottom:1px solid #f8fafc">
          <div style="display:flex;justify-content:space-between;align-items:flex-start;margin-bottom:6px">
            <div style="font-size:12.5px;font-weight:500;color:#0f172a;line-height:1.3">${scenario}</div>
            <div style="text-align:right;flex-shrink:0;margin-left:14px">
              <span style="font-size:12.5px;font-weight:700;color:${c}">${low}</span>
              <span style="font-size:10.5px;color:#94a3b8;margin:0 2px">—</span>
              <span style="font-size:12.5px;font-weight:700;color:${c}">${high}</span>
            </div>
          </div>
          <div style="display:flex;align-items:center;gap:10px">
            <div style="flex:1;height:5px;background:#f1f5f9;border-radius:3px;overflow:hidden">
              <div style="width:${prob}%;height:100%;background:${c};border-radius:3px"></div>
            </div>
            <span style="font-size:10.5px;font-weight:700;color:${c};width:36px;text-align:right">${prob}%</span>
          </div>
        </div>`).join('')}
      </div>
    </div>

    <div style="display:flex;flex-direction:column;gap:14px">
      <div class="card">
        <div class="card-header">Crown Jewels</div>
        <div class="card-body">
          ${[['acme-prod-data (S3)','847K PII · Public ACL','$4.2M exposure','#be123c'],['rds-main-postgres','Financial · PHI · PII','$3.1M exposure','#be123c'],['OpsAdminRole (IAM)','Full AWS admin access','$2.8M exposure','#c2410c']].map(([name,desc,exp,c])=>`
          <div style="padding:12px;background:#f8fafc;border:1px solid #f1f5f9;border-left:3px solid ${c};border-radius:8px;margin-bottom:10px">
            <div style="font-size:12.5px;font-weight:700;color:#0f172a">${name}</div>
            <div style="font-size:11px;color:#64748b;margin-top:2px">${desc}</div>
            <div style="font-size:15px;font-weight:800;color:${c};margin-top:7px">${exp}</div>
          </div>`).join('')}
        </div>
      </div>
      <div style="background:#fff1f2;border:1px solid #fecdd3;border-radius:var(--r-lg);padding:16px 18px">
        <div style="font-size:12px;font-weight:700;color:#be123c;margin-bottom:6px">Recommended Action</div>
        <div style="font-size:11.5px;color:#7f1d1d;line-height:1.5">Fix the 12 critical findings to reduce ALE by <b>$3.2M (63%)</b>. Prioritise: S3 block public access → Root MFA → SG 0.0.0.0/0 removal.</div>
      </div>
    </div>
  </div>
</div>`);

// ── SCREEN: ONBOARDING ────────────────────────────────────────────────────────
const onboarding = page('onboarding-provider', ['onboarding'], 'Onboarding', `
${topbar('Cloud Account Onboarding','<button class="btn-primary">+ Add Account</button>')}
<div class="content">
  <div style="margin-bottom:20px">
    <div style="font-size:16px;font-weight:800;color:#0f172a;letter-spacing:-.02em;margin-bottom:4px">Connect Your Cloud Providers</div>
    <div style="font-size:13px;color:#64748b">Read-only access · No agents installed · Agentless scanning · Setup in under 3 minutes</div>
  </div>

  <div style="display:grid;grid-template-columns:repeat(4,1fr);gap:14px;margin-bottom:22px">
    ${[
      ['Amazon Web Services','#FF9900','Connected · 12,481 assets','aws-prod-main','green'],
      ['Google Cloud Platform','#4285F4','Connected · 2,340 assets','gcp-acme-prod','green'],
      ['Microsoft Azure','#0078D4','Not connected','—','gray'],
      ['Oracle Cloud (OCI)','#C74634','Not connected','—','gray'],
    ].map(([p,c,sub,acct,status])=>`
    <div class="card" style="padding:22px 20px;text-align:center;cursor:pointer">
      <div style="width:52px;height:52px;border-radius:14px;background:${c}18;margin:0 auto 14px;display:flex;align-items:center;justify-content:center">
        <span style="font-size:18px;font-weight:900;color:${c}">${p[0]}</span>
      </div>
      <div style="font-size:13.5px;font-weight:700;color:#0f172a;margin-bottom:3px">${p}</div>
      <div style="font-size:11px;color:#94a3b8;margin-bottom:14px;line-height:1.4">${sub}</div>
      ${status==='green'
        ? `<div>${badge('● Connected','green')}</div>`
        : `<button class="btn-primary" style="width:100%;font-size:12px;padding:8px 0">Connect ${p.split(' ')[0]} →</button>`}
    </div>`).join('')}
  </div>

  <div class="tbl-wrap">
    <div style="padding:14px 20px 0;font-size:12px;font-weight:700;color:#0f172a;border-bottom:1px solid var(--border)">Connected Accounts
      <span style="font-size:11px;font-weight:500;color:#94a3b8;margin-left:8px">2 of 4 providers connected</span>
    </div>
    <table class="tbl">
      <thead><tr><th>Account Name</th><th>Account ID</th><th>Provider</th><th style="text-align:right">Assets</th><th>Last Scan</th><th>Findings</th><th>Status</th></tr></thead>
      <tbody>
        <tr>
          <td style="font-size:12.5px;font-weight:600;color:#0f172a">aws-prod-main</td>
          <td><span class="mono">588989875114</span></td>
          <td>${badge('AWS','orange')}</td>
          <td style="text-align:right;font-size:12.5px;font-weight:600">12,481</td>
          <td class="row-meta">2 min ago</td>
          <td>${badge('847 findings','orange')}</td>
          <td><span class="status-dot-green">Active</span></td>
        </tr>
        <tr>
          <td style="font-size:12.5px;font-weight:600;color:#0f172a">gcp-acme-prod</td>
          <td><span class="mono">acme-prod-338812</span></td>
          <td>${badge('GCP','blue')}</td>
          <td style="text-align:right;font-size:12.5px;font-weight:600">2,340</td>
          <td class="row-meta">5 min ago</td>
          <td>${badge('234 findings','amber')}</td>
          <td><span class="status-dot-green">Active</span></td>
        </tr>
      </tbody>
    </table>
  </div>
</div>`);

// ── ANIMATED: FINDINGS SCAN ───────────────────────────────────────────────────
const demoAnim = page('alerts', ['cloud-posture'], 'Security Scan', `
${topbar('Alerts','<button class="btn-primary">↺ Run Scan</button>',[[' Scanning…','gray']])}
<div class="content">
  <div class="kpi-row">
    ${[['—','Total Assets','#6366f1',0],['—','Critical','#be123c',1],['—','High','#c2410c',2],['—','Risk Score','#c2410c',3]].map(([v,l,c,i])=>`
    <div class="kpi" style="border-left-color:${c}"><div class="kpi-v" style="color:${c}" id="kv${i}">${v}</div><div class="kpi-l">${l}</div></div>`).join('')}
  </div>
  <div class="tbl-wrap">
    <table class="tbl">
      <thead><tr><th>Severity</th><th>Finding</th><th>Resource</th><th>Engine</th><th>Status</th></tr></thead>
      <tbody id="fbody"></tbody>
    </table>
  </div>
</div>`,
`@keyframes fadeSlide{from{opacity:0;transform:translateY(-6px)}to{opacity:1;transform:none}}`,
`<script>
const ROWS=[
  ['CRITICAL','S3 bucket public read ACL enabled','acme-prod-data','Data Security'],
  ['CRITICAL','Root account has no MFA device','root (AWS)','IAM Security'],
  ['CRITICAL','Security group 0.0.0.0/0:22 open','sg-0ab1cd234','Network Security'],
  ['HIGH','IAM role wildcard admin iam:*','OpsAdminRole','IAM Security'],
  ['HIGH','EKS pod running as root UID 0','pod/api-server','Container Security'],
  ['HIGH','KMS key rotation disabled','key/prod-rds','Encryption'],
  ['MEDIUM','S3 bucket MFA delete not enabled','acme-logs-archive','Data Security'],
  ['MEDIUM','EC2 IMDSv1 metadata enabled','i-0abc1234def','Network Security'],
  ['LOW','Lambda without X-Ray tracing','fn-acme-processor','Compliance'],
  ['LOW','CloudWatch alarm missing','us-east-2','Compliance'],
];
const SEV_C={CRITICAL:['#be123c','#fff1f2','#fecdd3','#e11d48'],HIGH:['#c2410c','#fff7ed','#fed7aa','#ea580c'],MEDIUM:['#92400e','#fffbeb','#fde68a','#d97706'],LOW:['#1e40af','#eff6ff','#bfdbfe','#3b82f6']};
function mkBadge(sev){const[t,bg,bd,dot]=SEV_C[sev]||['#475569','#f8fafc','#e2e8f0','#94a3b8'];return \`<span style="display:inline-flex;align-items:center;gap:5px;height:20px;padding:0 8px;border-radius:5px;font-size:10.5px;font-weight:650;color:\${t};background:\${bg};border:1px solid \${bd}"><span style="width:6px;height:6px;border-radius:50%;background:\${dot}"></span>\${sev}</span>\`;}
let shown=0;
function addRow(){
  if(shown>=ROWS.length)return;
  const[sev,finding,res,eng]=ROWS[shown++];
  const tr=document.createElement('tr');
  tr.style.animation='fadeSlide .35s ease';
  tr.innerHTML=\`<td>\${mkBadge(sev)}</td><td style="font-size:12.5px;font-weight:500;color:#0f172a">\${finding}</td><td style="font-family:monospace;font-size:11.5px;color:#64748b">\${res}</td><td><span style="display:inline-flex;height:20px;padding:0 8px;border-radius:5px;font-size:10.5px;font-weight:600;color:#6d28d9;background:#f5f3ff;border:1px solid #c4b5fd;align-items:center">\${eng}</span></td><td><span style="display:inline-flex;height:20px;padding:0 8px;border-radius:5px;font-size:10.5px;font-weight:600;color:#be123c;background:#fff1f2;border:1px solid #fecdd3;align-items:center">Open</span></td>\`;
  document.getElementById('fbody').prepend(tr);
}
const kv=(i,t,s,fmt)=>{let c=0;const el=document.getElementById('kv'+i);const iv=setInterval(()=>{c=Math.min(c+s,t);el.textContent=fmt?fmt(c):c.toLocaleString();if(c>=t)clearInterval(iv);},30);};
setTimeout(()=>kv(0,12481,250),600);
setTimeout(()=>kv(1,12,1),1300);
setTimeout(()=>kv(2,89,3),1900);
setTimeout(()=>kv(3,68,2,v=>v),2500);
let ri=0;const iv=setInterval(()=>{addRow();ri++;if(ri>=ROWS.length){clearInterval(iv);}},720);
</script>`);

// ── ANIMATED: ONBOARDING ──────────────────────────────────────────────────────
const onboardingAnim = page('onboarding-provider', ['onboarding'], 'Onboarding', `
${topbar('Cloud Accounts','<button class="btn-primary">+ Add Account</button>')}
<div class="content" style="display:flex;justify-content:center">
  <div style="width:680px">
    <div style="margin-bottom:22px">
      <div style="font-size:17px;font-weight:800;color:#0f172a;letter-spacing:-.02em;margin-bottom:4px">Connect AWS Account</div>
      <div style="font-size:13px;color:#64748b">Read-only access · No agents · Setup in under 3 minutes</div>
    </div>
    <!-- Step bar -->
    <div style="display:flex;align-items:center;margin-bottom:24px">
      ${[['✓','Choose Provider','#15803d','#f0fdf4','#bbf7d0'],['✓','Create IAM Role','#15803d','#f0fdf4','#bbf7d0'],['3','Connect Account','#4338ca','#eef2ff','#c7d2fe'],['4','First Scan','#94a3b8','#f8fafc','#e2e8f0']].map(([n,l,tc,bg,bc],i)=>`
      ${i>0?`<div style="flex:1;height:2px;background:${i<2?'#22c55e':'#e2e8f0'};margin:0 6px"></div>`:''}
      <div style="display:flex;align-items:center;gap:7px;flex-shrink:0">
        <div style="width:28px;height:28px;border-radius:50%;background:${bg};border:1.5px solid ${bc};display:flex;align-items:center;justify-content:center;font-size:11px;font-weight:700;color:${tc};${i===2?'box-shadow:0 0 0 4px rgba(99,102,241,.15)':''}">${n}</div>
        <span style="font-size:11.5px;font-weight:600;color:${tc}">${l}</span>
      </div>`).join('')}
    </div>
    <div class="card" id="s3card" style="padding:24px">
      <div style="font-size:13.5px;font-weight:700;color:#0f172a;margin-bottom:3px">Step 3: Connect your AWS account</div>
      <div style="font-size:12px;color:#64748b;margin-bottom:20px">Paste the IAM Role ARN from the CloudFormation stack output.</div>
      <div style="display:grid;grid-template-columns:1fr 1fr;gap:14px;margin-bottom:16px">
        <div>
          <label style="font-size:11px;font-weight:600;color:#334155;display:block;margin-bottom:5px">Account Name</label>
          <div style="background:#f8fafc;border:1px solid #e2e8f0;border-radius:8px;padding:9px 13px;font-size:12.5px;color:#0f172a">aws-prod-main</div>
        </div>
        <div>
          <label style="font-size:11px;font-weight:600;color:#334155;display:block;margin-bottom:5px">Account ID</label>
          <div style="background:#f8fafc;border:1px solid #e2e8f0;border-radius:8px;padding:9px 13px;font-family:monospace;font-size:12px;color:#0f172a">588989875114</div>
        </div>
      </div>
      <div style="margin-bottom:16px">
        <label style="font-size:11px;font-weight:600;color:#334155;display:block;margin-bottom:5px">IAM Role ARN <span style="color:#be123c">*</span></label>
        <div style="background:#fff;border:1.5px solid #6366f1;border-radius:8px;padding:10px 13px;font-family:monospace;font-size:12px;color:#0f172a;box-shadow:0 0 0 3px rgba(99,102,241,.12);min-height:42px;line-height:1.5">
          <span id="arnText"></span><span id="arnCursor" style="display:inline-block;width:1.5px;height:13px;background:#0f172a;margin-left:1px;vertical-align:middle;animation:blink .7s infinite"></span>
        </div>
      </div>
      <div id="valMsg" style="display:none;background:#f0fdf4;border:1px solid #bbf7d0;border-radius:8px;padding:13px 16px;margin-bottom:16px">
        <div style="display:flex;gap:10px;align-items:flex-start">
          <span style="font-size:16px;line-height:1">✓</span>
          <div><div style="font-size:12.5px;font-weight:700;color:#15803d;margin-bottom:2px">IAM role validated successfully</div>
          <div style="font-size:11.5px;color:#16a34a">Onam can assume this role · SecurityAudit policy attached · External ID verified</div></div>
        </div>
      </div>
      <div style="display:flex;justify-content:flex-end;gap:10px">
        <button class="btn-secondary">← Back</button>
        <button id="connectBtn" class="btn-primary" style="opacity:.35;cursor:not-allowed" disabled>Connect &amp; Start Scan →</button>
      </div>
    </div>
    <div id="s4card" style="display:none">
      <div class="card" style="border-color:#bbf7d0;padding:28px;text-align:center;margin-bottom:14px">
        <div style="font-size:44px;margin-bottom:12px">🎉</div>
        <div style="font-size:17px;font-weight:800;color:#0f172a;margin-bottom:4px">aws-prod-main connected!</div>
        <div style="font-size:13px;color:#64748b;margin-bottom:16px">Your first scan has started — initial results in 3–5 minutes.</div>
        <div style="display:flex;justify-content:center;gap:8px">${['ReadOnlyAccess ✓','SecurityAudit ✓','ViewOnlyAccess ✓'].map(t=>badge(t,'green')).join('')}</div>
      </div>
      <div class="card" style="padding:18px 20px">
        <div style="font-size:12.5px;font-weight:700;color:#0f172a;margin-bottom:10px">Scan in progress…</div>
        <div style="height:6px;background:#f1f5f9;border-radius:3px;overflow:hidden;margin-bottom:10px">
          <div id="scanFill" style="height:100%;background:linear-gradient(90deg,#6366f1,#22d3ee);border-radius:3px;width:0%;transition:width .4s ease"></div>
        </div>
        <div style="font-size:11.5px;color:#94a3b8">Discovering 12,481 resources across 9 security engines…</div>
      </div>
    </div>
  </div>
</div>`,
`@keyframes blink{0%,100%{opacity:1}50%{opacity:0}}`,
`<script>
const ARN='arn:aws:iam::588989875114:role/OnamSecurityReadOnlyRole';
const el=document.getElementById('arnText'),cur=document.getElementById('arnCursor');
let i=0;
(function type(){if(i<ARN.length){el.textContent=ARN.slice(0,++i);setTimeout(type,i<10?80:30);}
else{cur.style.display='none';
setTimeout(()=>{
  document.getElementById('valMsg').style.display='block';
  const btn=document.getElementById('connectBtn');btn.style.opacity='1';btn.style.cursor='pointer';btn.disabled=false;
  setTimeout(()=>{
    document.getElementById('s3card').style.display='none';
    document.getElementById('s4card').style.display='block';
    let p=0;const iv=setInterval(()=>{p=Math.min(p+1.5,80);document.getElementById('scanFill').style.width=p+'%';if(p>=80)clearInterval(iv);},50);
  },1200);
},700);}
})();setTimeout(()=>{},1000);
</script>`);

// ── ANIMATED: ATTACK PATH ─────────────────────────────────────────────────────
const attackPathAnim = page('attack-paths-main', ['attack-paths'], 'Attack Path', `
${topbar('Attack Path Analysis','<button class="btn-primary">↓ Export Report</button>',[['Building graph…','gray']])}
<div style="flex:1;display:grid;grid-template-columns:290px 1fr;overflow:hidden">
  <div style="border-right:1px solid var(--border);overflow-y:auto;background:#fafbfc">
    <div style="padding:11px 16px;font-size:10.5px;font-weight:700;color:#64748b;letter-spacing:.06em;text-transform:uppercase;border-bottom:1px solid var(--border)">Attack Paths</div>
    <div id="pathList"></div>
  </div>
  <div style="position:relative;background:#fff;overflow:hidden">
    <svg id="gsvg" style="position:absolute;inset:0;width:100%;height:100%" viewBox="0 0 980 730">
      <defs>
        <marker id="ah" viewBox="0 0 10 10" refX="9" refY="5" markerWidth="6" markerHeight="6" orient="auto">
          <path d="M 0 0 L 10 5 L 0 10 z" fill="#94a3b8"/>
        </marker>
        <filter id="ns"><feDropShadow dx="0" dy="2" stdDeviation="3" flood-opacity=".07"/></filter>
      </defs>
    </svg>
    <div id="detPanel" style="display:none;position:absolute;bottom:22px;right:22px;width:290px;background:#fff;border:1px solid var(--border);border-radius:var(--r-xl);padding:18px;box-shadow:var(--shadow-md)"></div>
  </div>
</div>`,
`.anode{transition:all .5s ease;opacity:0}.anode.show{opacity:1}
.aedge{opacity:0;transition:opacity .6s ease}.aedge.show{opacity:1}
.path-item{padding:13px 16px;border-bottom:1px solid var(--border);cursor:pointer;border-left:3px solid transparent}
.path-item.active{background:rgba(99,102,241,.04);border-left-color:#6366f1}`,
`<script>
const paths=[
  {t:'Path to Crown Jewel S3',d:'EC2 → IMDSv1 → IAM PassRole → S3',sev:'CRITICAL',c:'#be123c'},
  {t:'Admin Escalation via Lambda',d:'Lambda → Env Vars → RoleChain → DDB',sev:'HIGH',c:'#c2410c'},
  {t:'SG Breach to RDS via Bastion',d:'Public SG → Bastion EC2 → RDS',sev:'HIGH',c:'#c2410c'},
];
const PL=document.getElementById('pathList');
paths.forEach((p,i)=>{
  const d=document.createElement('div');d.className='path-item'+(i===0?' active':'');
  d.innerHTML=\`<div style="display:flex;justify-content:space-between;align-items:flex-start;gap:8px;margin-bottom:5px"><div style="font-size:12.5px;font-weight:600;color:#0f172a;line-height:1.3">\${p.t}</div><span style="display:inline-flex;height:20px;padding:0 8px;border-radius:5px;font-size:10.5px;font-weight:650;color:\${p.c};background:\${p.c}18;border:1px solid \${p.c}50;align-items:center">\${p.sev}</span></div><div style="font-size:11px;color:#64748b;line-height:1.4">\${p.d}</div>\`;
  PL.appendChild(d);
});
const svg=document.getElementById('gsvg');
const ns='http://www.w3.org/2000/svg';
const el=(tag,a,par)=>{const e=document.createElementNS(ns,tag);Object.entries(a).forEach(([k,v])=>e.setAttribute(k,v));(par||svg).appendChild(e);return e;};
const node=(x,y,stroke,type,name,sub,id)=>{
  const g=el('g',{transform:\`translate(\${x},\${y})\`,class:'anode',id:'n'+id,filter:'url(#ns)'});
  el('rect',{width:140,height:76,rx:10,fill:'#fff',stroke,\`stroke-width\`:1.5},g);
  const t=el('text',{x:70,y:19,fill:stroke,'font-size':8.5,'font-weight':800,'font-family':'Inter,sans-serif','text-anchor':'middle'},g);t.textContent=type;
  const n=el('text',{x:70,y:37,fill:'#0f172a','font-size':11,'font-weight':700,'font-family':'Inter,sans-serif','text-anchor':'middle'},g);n.textContent=name;
  const s=el('text',{x:70,y:52,fill:'#94a3b8','font-size':9,'font-family':'Inter,sans-serif','text-anchor':'middle'},g);s.textContent=sub;
  el('rect',{x:8,y:62,width:124,height:5,rx:2.5,fill:stroke,opacity:.15},g);
  el('rect',{x:8,y:62,width:Math.round(id==='s3'?124:id==='ec2'?85:110),height:5,rx:2.5,fill:stroke,opacity:.7},g);
  return g;
};
const edge=(x1,y1,x2,y2,label,c,id)=>{
  const l=el('line',{x1,y1,x2,y2,stroke:c,'stroke-width':1.5,'stroke-dasharray':'5,3','marker-end':'url(#ah)',class:'aedge',id:'e'+id});
  if(label){const t=el('text',{x:(+x1+ +x2)/2,y:(+y1+ +y2)/2-5,fill:c,'font-size':9,'font-weight':700,'font-family':'Inter,sans-serif','text-anchor':'middle',class:'aedge',id:'el'+id});t.textContent=label;}
};
node(55,235,'#fdba74','EC2 INSTANCE','i-0abc1234def','IMDSv1 enabled','ec2');
node(280,235,'#c4b5fd','IAM ROLE','OpsAdminRole','iam:PassRole:*','iam');
node(620,210,'#fca5a5','S3 CROWN JEWEL','acme-prod-data','847K PII records','s3');
edge(195,273,280,273,'IMDSv1','#f97316',1);
edge(420,273,620,273,'iam:PassRole','#8b5cf6',2);
// MITRE
['T1552.005 — Credential API','T1078.004 — Cloud Accounts','T1530 — Data from Cloud'].forEach((txt,i)=>{
  const x=[47,272,606][i],c=['#c2410c','#7c3aed','#be123c'][i],bg=['#fff7ed','#f5f3ff','#fff1f2'][i],bd=['#fed7aa','#c4b5fd','#fecdd3'][i];
  const g=el('g',{class:'aedge',id:'m'+i});
  el('rect',{x,y:335,width:170,height:18,rx:4,fill:bg,stroke:bd},g);
  const t=el('text',{x:x+85,y:348,fill:c,'font-size':9,'font-weight':700,'font-family':'Inter,sans-serif','text-anchor':'middle'},g);t.textContent=txt;
});
const show=(id,delay)=>setTimeout(()=>{const e=document.getElementById(id);if(e)e.classList.add('show');},delay);
show('nec2',400);show('e1',1000);show('el1',1000);show('niam',1300);show('e2',2000);show('el2',2000);show('ns3',2400);
setTimeout(()=>svg.querySelectorAll('.aedge').forEach(e=>e.classList.add('show')),3100);
setTimeout(()=>{
  const dp=document.getElementById('detPanel');dp.style.display='block';
  dp.innerHTML='<div style="font-size:12.5px;font-weight:700;color:#0f172a;margin-bottom:12px">Path: EC2 → S3 Crown Jewel</div>'+
  [['MITRE ATT&CK','T1552.005 · Credential API'],['Hops to breach','4 (EC2 → IMDSv1 → IAM → S3)'],['Data at risk','847,234 PII records'],['Fix priority','P0 — Disable IMDSv1'],['ALE impact','$2.1M – $6.4M']].map(([k,v])=>
  \`<div style="display:grid;grid-template-columns:100px 1fr;gap:8px;padding:6px 0;border-bottom:1px solid #f8fafc"><span style="font-size:11px;color:#94a3b8">\${k}</span><span style="font-size:11.5px;font-weight:600;color:#334155;line-height:1.3">\${v}</span></div>\`).join('');
},3600);
</script>`);

// ── SCREEN: SAAS SECURITY (SSPM) ──────────────────────────────────────────────
const saasSecurity = page('m365', ['saas-security'], 'SaaS Security', `
${topbar('SaaS Security — SSPM','<button class="btn-secondary">Add Platform</button><button class="btn-primary">↓ Export CIS Report</button>',[['4 Admins without MFA','red'],['433 CIS SaaS Rules','purple']])}
<div class="content">
  <div class="kpi-row">
    ${[['8','SaaS Platforms Connected','#6366f1',''],['4','Admins without MFA','#be123c','Privileged — fix now'],['118','External Shares','#c2410c','Anyone-with-link'],['26','Stale Guest Accounts','#a16207','No sign-in > 90 days']].map(([v,l,c,d])=>`
    <div class="kpi" style="border-left-color:${c}">
      <div class="kpi-v" style="color:${c}">${v}</div>
      <div class="kpi-l">${l}</div>
      ${d?`<div class="kpi-d" style="color:${c}">${d}</div>`:''}
    </div>`).join('')}
  </div>
  <div style="display:grid;grid-template-columns:repeat(4,1fr);gap:14px;margin-bottom:18px">
    ${[['Microsoft 365',74,'130 CIS rules'],['Google Workspace',81,'89 CIS rules'],['GitLab',69,'122 CIS rules'],['Snowflake',77,'39 CIS rules'],['SharePoint',72,'37 CIS rules'],['GitHub',85,'Org posture checks'],['Dynamics 365',88,'16 CIS rules'],['Okta',79,'Identity posture checks']].map(([p,pct,rules])=>{
      const c = scoreColor(pct);
      return `<div class="card" style="padding:16px 18px">
        <div style="display:flex;justify-content:space-between;align-items:flex-start;margin-bottom:9px">
          <div style="font-size:12.5px;font-weight:700;color:#0f172a;line-height:1.3">${p}</div>
          <div style="font-size:21px;font-weight:800;color:${c};margin-left:8px;flex-shrink:0">${pct}%</div>
        </div>
        <div class="score-bar-wrap"><div class="score-bar" style="width:${pct}%;background:${c}"></div></div>
        <div style="margin-top:8px;font-size:11px;font-weight:600;color:#64748b">${rules}</div>
      </div>`;
    }).join('')}
  </div>
  <div class="tbl-wrap">
    <table class="tbl">
      <thead><tr><th>Finding</th><th>Severity</th><th>Platform</th><th>Principal / Object</th><th>CIS Control</th><th>Status</th></tr></thead>
      <tbody>
      ${[
        ['Global Administrator without MFA enforced','CRITICAL','Microsoft 365','admin@acme.com','CIS M365 1.1.1','OPEN'],
        ['SharePoint site shared with "Anyone with the link"','CRITICAL','SharePoint','/sites/finance-fy26','CIS SP 2.3.4','OPEN'],
        ['Unified Audit Log disabled at tenant level','HIGH','Microsoft 365','acme.onmicrosoft.com','CIS M365 3.1.1','OPEN'],
        ['ACCOUNTADMIN granted to service account','HIGH','Snowflake','svc_etl_prod','CIS SNOW 1.4','OPEN'],
        ['Guest account inactive for 214 days','MEDIUM','Google Workspace','contractor@ext.com','CIS GWS 2.1.7','OPEN'],
        ['Branch protection disabled on default branch','HIGH','GitLab','acme/payments-api','CIS GL 4.2.1','IN PROGRESS'],
        ['Drive files shared externally without expiry','MEDIUM','Google Workspace','142 files','CIS GWS 5.2.3','OPEN'],
        ['Admin Reports retention set below 180 days','MEDIUM','Google Workspace','acme.com','CIS GWS 3.4.1','ACCEPTED'],
      ].map(([f,sev,plat,obj,ctrl,status])=>`
      <tr>
        <td style="max-width:320px;font-size:12.5px;color:#1e293b;line-height:1.4;font-weight:500">${f}</td>
        <td>${sevBadge(sev)}</td>
        <td>${badge(plat,'purple')}</td>
        <td><span class="mono" style="color:#64748b">${obj}</span></td>
        <td><span class="mono" style="font-weight:700;color:#6366f1">${ctrl}</span></td>
        <td>${badge(status,status==='OPEN'?'red':status==='IN PROGRESS'?'amber':'gray')}</td>
      </tr>`).join('')}
      </tbody>
    </table>
  </div>
</div>`);

// ── SCREEN: CWPP ──────────────────────────────────────────────────────────────
const cwpp = page('cwpp', [], 'CWPP', `
${topbar('CWPP — Cloud Workload Protection','<button class="btn-secondary">Schedule Scan</button><button class="btn-primary">↓ Export Inventory</button>',[['Agentless — 100% Coverage','green'],['9 Critical Workloads','red']])}
<div class="content">
  <div class="kpi-row">
    ${[['1,284','Workloads Protected','#6366f1','100% agentless'],['9','Critical Findings','#be123c','Internet-reachable'],['37','Privileged Containers','#c2410c','Running as root'],['68','Workload Score','#a16207','CWPP pillar']].map(([v,l,c,d])=>`
    <div class="kpi" style="border-left-color:${c}">
      <div class="kpi-v" style="color:${c}">${v}</div>
      <div class="kpi-l">${l}</div>
      ${d?`<div class="kpi-d" style="color:${c}">${d}</div>`:''}
    </div>`).join('')}
  </div>
  <div style="display:grid;grid-template-columns:repeat(4,1fr);gap:14px;margin-bottom:18px">
    ${[['Virtual Machines',612,71],['Containers',498,64],['Serverless',147,83],['Managed Hosts',27,76]].map(([t,count,pct])=>{
      const c = scoreColor(pct);
      return `<div class="card" style="padding:16px 18px">
        <div style="display:flex;justify-content:space-between;align-items:flex-start;margin-bottom:9px">
          <div style="font-size:12.5px;font-weight:700;color:#0f172a">${t}</div>
          <div style="font-size:21px;font-weight:800;color:${c};margin-left:8px;flex-shrink:0">${pct}</div>
        </div>
        <div class="score-bar-wrap"><div class="score-bar" style="width:${pct}%;background:${c}"></div></div>
        <div style="margin-top:8px;font-size:11px;font-weight:600;color:#64748b">${count} workloads</div>
      </div>`;
    }).join('')}
  </div>
  <div class="tbl-wrap">
    <table class="tbl">
      <thead><tr><th>Workload</th><th>Type</th><th>Severity</th><th>Finding</th><th>OS / Runtime</th><th>Exposure</th><th>Cloud</th></tr></thead>
      <tbody>
      ${[
        ['i-0a3f8b2c9d1e4f7a1','VM','CRITICAL','Unpatched OpenSSL 3.0.8 — CVE-2024-3094 exploitable','Ubuntu 22.04','Internet-facing','AWS'],
        ['payments-api-7c4d9','Container','CRITICAL','Container running as privileged with hostPath mount','Alpine 3.18','Internet-facing','AWS EKS'],
        ['vm-prod-db-westus-02','VM','HIGH','Root SSH key baked into base image','RHEL 9.2','Internal','Azure'],
        ['invoice-processor','Serverless','HIGH','Runtime python3.8 past end-of-support','python3.8','Internet-facing','AWS Lambda'],
        ['gke-node-pool-3-x8k2','VM','HIGH','CIS Ubuntu 3.4.2 — IP forwarding enabled','Ubuntu 20.04','Internal','GCP'],
        ['legacy-etl-runner','VM','MEDIUM','No host-based audit logging configured','CentOS 7.9','Internal','OCI'],
        ['frontend-cdn-9f2a1','Container','MEDIUM','Image last rebuilt 214 days ago','Debian 12','Internet-facing','AWS ECS'],
        ['reporting-fn-eu-01','Serverless','LOW','Environment variable holds plaintext connection string','node20','Internal','Azure'],
      ].map(([w,type,sev,finding,os,exp,cloud])=>`
      <tr>
        <td><span class="mono" style="font-weight:700;color:#6366f1">${w}</span></td>
        <td>${badge(type,'gray')}</td>
        <td>${sevBadge(sev)}</td>
        <td style="max-width:300px;font-size:12.5px;color:#1e293b;line-height:1.4">${finding}</td>
        <td><span class="mono" style="color:#64748b">${os}</span></td>
        <td>${badge(exp,exp==='Internet-facing'?'red':'gray')}</td>
        <td class="row-meta">${cloud}</td>
      </tr>`).join('')}
      </tbody>
    </table>
  </div>
</div>`);

// ── SCREEN: CNAPP ─────────────────────────────────────────────────────────────
const cnapp = page('cnapp', [], 'CNAPP', `
${topbar('CNAPP — Unified Posture','<button class="btn-secondary">Compare Accounts</button><button class="btn-primary">↓ Export Board Report</button>',[['Score 71 — Medium Risk','amber'],['↑ 6 pts this month','green']])}
<div class="content">
  <div class="kpi-row">
    ${[['71','Overall Posture Score','#a16207','Medium risk band'],['+6','Change This Month','#16a34a','Improving'],['649','Critical Findings','#be123c','Across all pillars'],['7','Pillars Scored','#6366f1','']].map(([v,l,c,d])=>`
    <div class="kpi" style="border-left-color:${c}">
      <div class="kpi-v" style="color:${c}">${v}</div>
      <div class="kpi-l">${l}</div>
      ${d?`<div class="kpi-d" style="color:${c}">${d}</div>`:''}
    </div>`).join('')}
  </div>
  <div style="display:grid;grid-template-columns:repeat(4,1fr);gap:14px;margin-bottom:18px">
    ${[['CSPM','Cloud config compliance',68,'2,689 rules'],['CIEM','Identity & entitlements',62,'1,459 rules'],['CWPP','Workload protection',71,'1,284 workloads'],['DSPM','Data security posture',66,'1,321 rules'],['Network','7-layer network posture',77,'1,166 rules'],['Threat','Attack paths & MITRE',59,'34 live paths'],['AppSec','SAST · DAST · SCA',82,'2,340 rules'],['SSPM','SaaS security posture',75,'433 rules']].map(([p,desc,pct,meta])=>{
      const c = scoreColor(pct);
      return `<div class="card" style="padding:16px 18px">
        <div style="display:flex;justify-content:space-between;align-items:flex-start;margin-bottom:4px">
          <div style="font-size:13px;font-weight:800;color:#0f172a">${p}</div>
          <div style="font-size:22px;font-weight:800;color:${c};margin-left:8px;flex-shrink:0">${pct}</div>
        </div>
        <div style="font-size:10.5px;color:#94a3b8;margin-bottom:9px">${desc}</div>
        <div class="score-bar-wrap"><div class="score-bar" style="width:${pct}%;background:${c}"></div></div>
        <div style="margin-top:8px;font-size:11px;font-weight:600;color:#64748b">${meta}</div>
      </div>`;
    }).join('')}
  </div>
  <div class="tbl-wrap">
    <table class="tbl">
      <thead><tr><th>Pillar</th><th>Top Contributing Finding</th><th>Severity</th><th>Resources</th><th>Score Impact</th><th>Trend</th></tr></thead>
      <tbody>
      ${[
        ['Threat','Attack path: public EC2 → IMDSv1 → admin role → S3 crown jewel','CRITICAL','4','−8.2','↓ worsening'],
        ['CIEM','412 identities hold unused administrative permissions','CRITICAL','412','−6.7','↑ improving'],
        ['CSPM','S3 buckets without block-public-access across 3 accounts','CRITICAL','17','−5.4','↑ improving'],
        ['DSPM','847K PII records in publicly reachable storage','CRITICAL','3','−5.1','→ flat'],
        ['CWPP','Privileged containers with hostPath mounts in production','HIGH','37','−3.8','↑ improving'],
        ['Network','Security groups allowing 0.0.0.0/0 on management ports','HIGH','24','−3.2','↑ improving'],
        ['SSPM','Microsoft 365 global admins without MFA enforcement','CRITICAL','4','−2.9','→ flat'],
        ['AppSec','Hardcoded credentials detected in application source','HIGH','11','−1.6','↑ improving'],
      ].map(([pillar,finding,sev,res,impact,trend])=>`
      <tr>
        <td>${badge(pillar,'purple')}</td>
        <td style="max-width:340px;font-size:12.5px;color:#1e293b;line-height:1.4;font-weight:500">${finding}</td>
        <td>${sevBadge(sev)}</td>
        <td><span class="mono" style="color:#64748b">${res}</span></td>
        <td><span style="font-size:12.5px;font-weight:700;color:#be123c">${impact}</span></td>
        <td><span style="font-size:11.5px;font-weight:600;color:${trend.startsWith('↑')?'#16a34a':trend.startsWith('↓')?'#be123c':'#94a3b8'}">${trend}</span></td>
      </tr>`).join('')}
      </tbody>
    </table>
  </div>
</div>`);

// ── WRITE ALL ─────────────────────────────────────────────────────────────────
const screens = [
  {f:'screen-saas-security.html',      h:saasSecurity},
  {f:'screen-cwpp.html',               h:cwpp},
  {f:'screen-cnapp.html',              h:cnapp},
  {f:'screen-dashboard.html',          h:dashboard},
  {f:'screen-findings.html',           h:findings},
  {f:'screen-attack-path.html',        h:attackPath},
  {f:'screen-iam.html',                h:iam},
  {f:'screen-network.html',            h:network},
  {f:'screen-cdr.html',                h:cdr},
  {f:'screen-container.html',          h:container},
  {f:'screen-compliance.html',         h:compliance},
  {f:'screen-datasec.html',            h:datasec},
  {f:'screen-risk.html',               h:risk},
  {f:'screen-onboarding.html',         h:onboarding},
  {f:'screen-demo-animated.html',      h:demoAnim},
  {f:'screen-onboarding-animated.html',h:onboardingAnim},
  {f:'screen-attack-path-animated.html',h:attackPathAnim},
];

screens.forEach(({f,h})=>{
  fs.writeFileSync(path.join(dir,f),h,'utf8');
  console.log('wrote',f);
});
console.log(`\n✓ ${screens.length} files written`);
