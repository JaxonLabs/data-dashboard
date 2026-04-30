import { clients, connectorRegistry, mappings, metricsLibrary, reports, alerts, trendSeries, getConnector } from './data/mockData.js';

const state = {
  selectedClientId: localStorage.getItem('selectedClientId') || clients[0].id,
  savedReports: JSON.parse(localStorage.getItem('savedReports') || '[]'),
  simulatedConnections: JSON.parse(localStorage.getItem('simulatedConnections') || '{}'),
};

const routes = ['clients','overview','sources','mapping','builder','reports','alerts','settings'];

function nav(){
  return `<nav class="sidebar">${routes.map(r=>`<a href="#${r}" class="${location.hash==='#'+r?'active':''}">${r[0].toUpperCase()+r.slice(1)}</a>`).join('')}</nav>`;
}
function layout(content){
  return `<div class="shell">${nav()}<main>${content}</main></div>`;
}
function selectClient(clientId){state.selectedClientId=clientId;localStorage.setItem('selectedClientId',clientId);render();}
function currentClient(){return clients.find(c=>c.id===state.selectedClientId) || clients[0];}

function clientsPage(){
  return layout(`<h1>Client Workspaces</h1><div class="grid">${clients.map(c=>`<article class="card"><h3>${c.name}</h3><p>${c.industry}</p><p>Sources: ${c.dataSources.length} · Alerts: ${c.alerts.length}</p><p>Last updated: ${c.lastUpdated}</p><p>${c.primaryKpi.name}: <b>${c.primaryKpi.value}</b> (${c.primaryKpi.trend})</p><button data-client="${c.id}">Open Workspace</button></article>`).join('')}</div>`);
}
function overviewPage(){ const c=currentClient();
  return layout(`<h1>${c.name} · Overview</h1><div class="toolbar"><select><option>Last 30 days</option><option>Last 90 days</option></select><a href="#builder" class="btn">Build Report</a><a href="#sources" class="btn secondary">Manage Data Sources</a></div>
  <div class="grid kpis"><div class="card">Revenue<br><b>$224,000</b></div><div class="card">Ad Spend<br><b>$81,000</b></div><div class="card">ROAS<br><b>2.76</b></div><div class="card">Active Alerts<br><b>${c.alerts.length}</b></div></div>
  <div class="grid two"><section class="card"><h3>Connected Sources</h3>${c.dataSources.map(s=>`<span class="pill">${getConnector(s).name}</span>`).join(' ')}</section><section class="card"><h3>Recent Alerts</h3>${alerts.filter(a=>a.clientId===c.id).map(a=>`<p>[${a.severity}] ${a.message}</p>`).join('')}</section></div>`);
}
function sourcesPage(){
  const c=currentClient();
  return layout(`<h1>Data Sources · ${c.name}</h1><div class="grid">${connectorRegistry.map(conn=>{
    const connected = c.dataSources.includes(conn.id) || state.simulatedConnections[`${c.id}:${conn.id}`];
    const status = connected ? 'Mock Connected' : conn.status.replace('_',' ');
    return `<article class="card"><h3>${conn.name}</h3><p>${conn.description}</p><p>Status: <b>${status}</b></p><p>Last sync: ${conn.lastSync || '—'}</p><p>Examples: ${conn.supportedExamples.join(', ')}</p>${conn.id==='meta_ads'?`<details><summary>Future Meta requirements</summary><ul>${(conn.futureRequirements||[]).map(r=>`<li>${r}</li>`).join('')}</ul><p>Planned metrics: ${conn.supportedMetrics.join(', ')}</p></details>`:''}<button data-connect="${conn.id}">${connected?'View Mapping':'Connect (Simulate)'}</button></article>`;
  }).join('')}</div>
  <section class="card"><h3>CSV Upload (Mock)</h3><input type="file" id="csvFile"/><button id="mockUpload">Preview CSV Columns</button><div id="csvPreview"></div></section>`);
}
function mappingPage(){
  const c=currentClient();
  return layout(`<h1>Metric Mapping · ${c.name}</h1><section class="card"><label>Source <select id="sourceSel">${c.dataSources.map(s=>`<option value="${s}">${getConnector(s).name}</option>`).join('')}</select></label><table><tr><th>Raw Field</th><th>Standard KPI</th><th>Type</th><th>Sample</th></tr>${mappings.filter(m=>m.clientId===c.id).map(m=>`<tr><td>${m.rawField}</td><td><select>${metricsLibrary.map(k=>`<option ${k===m.standardMetricId?'selected':''}>${k}</option>`).join('')}</select></td><td>${m.dataType}</td><td>${m.sampleValue}</td></tr>`).join('')}</table><button>Save Mapping</button></section>`);
}
function builderPage(){const c=currentClient();
return layout(`<h1>Report Builder</h1><section class="card form"><label>Report Name<input id="reportName" value="${c.name} Monthly Performance"/></label><label>Template<select id="template"><option>Ecommerce Performance</option><option>Lead Generation Performance</option><option>Marketing Performance</option><option>Executive Snapshot</option></select></label><label>KPI Selector<input id="kpis" value="Revenue, Orders, AOV, Ad Spend, ROAS"/></label><label>Chart Selector<input id="charts" value="Revenue over time, Ad spend vs revenue"/></label><label>Alert rules<select><option>ROAS below 2.0</option><option>Leads drop >20%</option></select></label><button id="previewReport">Preview Report</button><button id="saveReport">Save Report</button></section>`);
}
function reportsPage(){const c=currentClient(); const report=(state.savedReports.find(r=>r.clientId===c.id)||reports.find(r=>r.clientId===c.id));
const bars = trendSeries.map(p=>`<div class="bar" style="height:${Math.round(p.revenue/300)}px" title="${p.date}: $${p.revenue}"></div>`).join('');
return layout(`<h1>Report Dashboard</h1><section class="card"><h2>${report?.name || 'No report yet'}</h2><p>${c.name} · ${report?.dateRange || 'Last 30 days'}</p></section><div class="grid kpis"><div class="card">Revenue <b>$80.4k</b> ▲ 9%</div><div class="card">Ad Spend <b>$29.1k</b> ▲ 3%</div><div class="card">ROAS <b>2.76</b> ▲ 4%</div><div class="card">Orders <b>2,140</b> ▲ 7%</div></div><div class="grid two"><section class="card"><h3>Revenue Over Time</h3><div class="bars">${bars}</div></section><section class="card"><h3>Ad Spend vs Revenue</h3>${trendSeries.map(p=>`<p>${p.date}: Spend $${p.spend} / Revenue $${p.revenue}</p>`).join('')}</section></div><div class="grid two"><section class="card"><h3>Alerts</h3>${alerts.filter(a=>a.clientId===c.id).map(a=>`<p><b>${a.severity}</b> · ${a.message}</p>`).join('')}</section><section class="card"><h3>Insight Summary</h3><p>Revenue grew while efficiency dipped mid-month. Prioritize high-intent campaigns and refresh creative in underperforming ad sets.</p><h4>Source Coverage</h4>${(report?.includedSources||c.dataSources).map(s=>`<span class="pill">${getConnector(s).name}</span>`).join(' ')}<h4>Recommendations</h4><ul><li>Shift 12% spend to top ROAS campaigns.</li><li>Run Klaviyo win-back flow for repeat buyers.</li></ul></section></div>`);
}
function alertsPage(){const c=currentClient();
return layout(`<h1>Alerts</h1><section class="card"><h3>Active Alerts</h3>${alerts.filter(a=>a.clientId===c.id).map(a=>`<p><span class="pill ${a.severity.toLowerCase()}">${a.severity}</span> ${a.metricId}: ${a.message} <br/>Current: ${a.currentValue} · Action: ${a.suggestedAction}</p>`).join('')}</section><section class="card form"><h3>Alert Rule Builder</h3><label>Metric<select><option>ROAS</option><option>Ad Spend</option><option>Conversion Rate</option><option>CAC</option></select></label><label>Condition<select><option>drops below</option><option>increases more than</option></select></label><label>Threshold<input value="2.0"/></label><label>Severity<select><option>Warning</option><option>Critical</option><option>Info</option></select></label><button>Save Rule</button></section>`);
}
function settingsPage(){
return layout(`<h1>Settings · Connector Framework</h1><section class="card"><p>All connectors use a shared registry interface so future APIs can be added without changing each screen.</p><table><tr><th>ID</th><th>Auth</th><th>Status</th><th>Permissions</th><th>Metrics</th><th>Last Sync</th></tr>${connectorRegistry.map(c=>`<tr><td>${c.id}</td><td>${c.authType}</td><td>${c.status}</td><td>${c.requiredPermissions.join(', ') || '—'}</td><td>${c.supportedMetrics.slice(0,4).join(', ')}…</td><td>${c.lastSync||'—'}</td></tr>`).join('')}</table></section>`);
}

function render(){
  const route = (location.hash || '#clients').slice(1);
  const page = {clients:clientsPage, overview:overviewPage, sources:sourcesPage, mapping:mappingPage, builder:builderPage, reports:reportsPage, alerts:alertsPage, settings:settingsPage}[route] || clientsPage;
  document.getElementById('app').innerHTML = page();
  bindEvents();
}

function bindEvents(){
  document.querySelectorAll('[data-client]').forEach(btn=>btn.onclick=()=>{selectClient(btn.dataset.client);location.hash='#overview';});
  document.querySelectorAll('[data-connect]').forEach(btn=>btn.onclick=()=>{const key=`${currentClient().id}:${btn.dataset.connect}`;state.simulatedConnections[key]=true;localStorage.setItem('simulatedConnections',JSON.stringify(state.simulatedConnections));location.hash='#mapping';});
  const uploadBtn=document.getElementById('mockUpload'); if(uploadBtn){uploadBtn.onclick=()=>{const file=document.getElementById('csvFile').files[0]; const out=document.getElementById('csvPreview'); if(!file){out.textContent='Mock preview: campaign, spend, clicks, conversions'; return;} const r=new FileReader(); r.onload=()=>{const row=(r.result||'').toString().split('\n')[0]; out.textContent='Detected columns: '+row;}; r.readAsText(file);} }
  const saveReport=document.getElementById('saveReport'); if(saveReport){saveReport.onclick=()=>{const r={id:`saved_${Date.now()}`,clientId:currentClient().id,name:document.getElementById('reportName').value,template:document.getElementById('template').value,dateRange:'Last 30 days',selectedMetrics:document.getElementById('kpis').value.split(',').map(v=>v.trim()),selectedCharts:document.getElementById('charts').value.split(',').map(v=>v.trim()),includedSources:currentClient().dataSources,notes:'Saved from builder'}; state.savedReports=[...state.savedReports.filter(x=>x.clientId!==r.clientId),r]; localStorage.setItem('savedReports',JSON.stringify(state.savedReports)); location.hash='#reports';};}
  const preview=document.getElementById('previewReport'); if(preview){preview.onclick=()=>location.hash='#reports';}
}

window.addEventListener('hashchange', render);
render();
