
/* ============================================
   FLUXUI — Application Script
   ============================================ */

/* ---- Navigation ---- */
let currentPage = 'home';

function navigate(page) {
  document.querySelectorAll('.page').forEach(p => p.classList.remove('active'));
  document.querySelectorAll('.nav-link').forEach(l => l.classList.remove('active'));
  const pageEl = document.getElementById('page-' + page);
  if (pageEl) {
    pageEl.classList.add('active');
    pageEl.classList.add('page-enter');
    setTimeout(() => pageEl.classList.remove('page-enter'), 400);
  }
  const navLink = document.querySelector(`[data-page="${page}"]`);
  if (navLink) navLink.classList.add('active');
  currentPage = page;
  window.scrollTo(0, 0);
  if (page === 'components') initComponents();
  if (page === 'tokens') initTokens();
  if (page === 'docs') initDocs();
  if (page === 'playground') initPlayground();
}

/* ---- Theme ---- */
let dark = true;
function toggleTheme() {
  dark = !dark;
  document.body.classList.toggle('light', !dark);
  document.getElementById('themeBtn').textContent = dark ? '🌙' : '☀️';
}

/* ---- Mobile menu ---- */
function toggleMobileMenu() {
  const nl = document.querySelector('.nav-links');
  nl.style.display = nl.style.display === 'flex' ? 'none' : 'flex';
}

/* ---- Reveal on scroll ---- */
const revealObs = new IntersectionObserver(entries => {
  entries.forEach(e => { if (e.isIntersecting) e.target.classList.add('in'); });
}, { threshold: 0.1 });
document.querySelectorAll('.reveal').forEach(el => revealObs.observe(el));

/* ---- Command Palette ---- */
const cmdData = [
  { icon:'⚡',label:'Components',sub:'Browse all components',page:'components' },
  { icon:'🎨',label:'Design Tokens',sub:'Colors, spacing, typography',page:'tokens' },
  { icon:'📖',label:'Documentation',sub:'Guides & API reference',page:'docs' },
  { icon:'🛠',label:'Playground',sub:'Visual component builder',page:'playground' },
  { icon:'⬛',label:'Button Component',sub:'Input category',page:'components' },
  { icon:'▭',label:'Input Component',sub:'Input category',page:'components' },
  { icon:'📋',label:'Installation Guide',sub:'Documentation',page:'docs' },
  { icon:'🌈',label:'Color Tokens',sub:'Design tokens',page:'tokens' },
  { icon:'Aa',label:'Typography Scale',sub:'Design tokens',page:'tokens' },
  { icon:'⬡',label:'Border Radius',sub:'Design tokens',page:'tokens' },
];
let cmdSelected = 0;
let filteredCmdData = [...cmdData];

function openCmd() {
  document.getElementById('cmdOverlay').classList.add('open');
  document.getElementById('cmdInput').value = '';
  filteredCmdData = [...cmdData];
  renderCmdResults();
  setTimeout(() => document.getElementById('cmdInput').focus(), 50);
}
function closeCmd() { document.getElementById('cmdOverlay').classList.remove('open'); }
function cmdOverlayClick(e) { if (e.target.classList.contains('cmd-overlay')) closeCmd(); }
function filterCmd(q) {
  filteredCmdData = q ? cmdData.filter(d => d.label.toLowerCase().includes(q.toLowerCase()) || d.sub.toLowerCase().includes(q.toLowerCase())) : [...cmdData];
  cmdSelected = 0;
  renderCmdResults();
}
function renderCmdResults() {
  const el = document.getElementById('cmdResults');
  if (!filteredCmdData.length) { el.innerHTML = '<p style="padding:20px;text-align:center;color:var(--text3);font-size:13px">No results found</p>'; return; }
  el.innerHTML = `<div class="cmd-group"><div class="cmd-group-label">Navigation</div>` +
    filteredCmdData.map((d,i) => `
      <div class="cmd-item ${i===cmdSelected?'selected':''}" onclick="cmdSelect(${i})">
        <div class="cmd-item-icon">${d.icon}</div>
        <div><div class="cmd-item-text">${d.label}</div><div class="cmd-item-sub">${d.sub}</div></div>
        <span class="cmd-item-arrow">→</span>
      </div>`).join('') + '</div>';
}
function cmdSelect(i) { navigate(filteredCmdData[i].page); closeCmd(); }
function cmdKeydown(e) {
  if (e.key === 'Escape') { closeCmd(); return; }
  if (e.key === 'ArrowDown') { cmdSelected = Math.min(cmdSelected+1, filteredCmdData.length-1); renderCmdResults(); e.preventDefault(); }
  if (e.key === 'ArrowUp') { cmdSelected = Math.max(cmdSelected-1, 0); renderCmdResults(); e.preventDefault(); }
  if (e.key === 'Enter' && filteredCmdData.length) { cmdSelect(cmdSelected); }
}
document.addEventListener('keydown', e => {
  if ((e.metaKey || e.ctrlKey) && e.key === 'k') { e.preventDefault(); openCmd(); }
  if (e.key === 'Escape') closeCmd();
});

/* ============================================
   COMPONENTS PAGE
   ============================================ */
const COMPONENTS = [
  { name:'Primary Button', category:'Input', code:'<Button variant="primary">Click me</Button>', preview:'buttons' },
  { name:'Ghost Button', category:'Input', code:'<Button variant="ghost">Ghost</Button>', preview:'buttons-ghost' },
  { name:'Outline Button', category:'Input', code:'<Button variant="outline">Outline</Button>', preview:'buttons-outline' },
  { name:'Danger Button', category:'Input', code:'<Button variant="danger">Delete</Button>', preview:'buttons-danger' },
  { name:'Text Input', category:'Input', code:'<Input placeholder="Enter text…" />', preview:'input' },
  { name:'Select', category:'Input', code:'<Select options={options} />', preview:'select' },
  { name:'Toggle Switch', category:'Input', code:'<Toggle checked={true} />', preview:'toggle' },
  { name:'Checkbox', category:'Input', code:'<Checkbox label="Accept terms" />', preview:'checkbox' },
  { name:'Status Badge', category:'Feedback', code:'<Badge variant="success">Active</Badge>', preview:'badge-success' },
  { name:'Info Badge', category:'Feedback', code:'<Badge variant="info">Info</Badge>', preview:'badge-info' },
  { name:'Warning Badge', category:'Feedback', code:'<Badge variant="warning">Warning</Badge>', preview:'badge-warning' },
  { name:'Error Badge', category:'Feedback', code:'<Badge variant="error">Error</Badge>', preview:'badge-error' },
  { name:'Progress Bar', category:'Feedback', code:'<Progress value={72} />', preview:'progress' },
  { name:'Toast Alert', category:'Feedback', code:'<Toast message="Saved!" type="success" />', preview:'toast' },
  { name:'Navbar', category:'Navigation', code:'<Navbar logo="FluxUI" links={navLinks} />', preview:'navbar' },
  { name:'Breadcrumbs', category:'Navigation', code:'<Breadcrumbs items={crumbs} />', preview:'breadcrumbs' },
  { name:'Tab Bar', category:'Navigation', code:'<Tabs items={tabs} active={0} />', preview:'tabs' },
  { name:'Pagination', category:'Navigation', code:'<Pagination total={100} page={3} />', preview:'pagination' },
  { name:'Sidebar Link', category:'Navigation', code:'<SidebarLink icon="⚡" label="Dashboard" />', preview:'sidebar-link' },
  { name:'Data Card', category:'Layout', code:'<Card title="Revenue" value="$48k" />', preview:'card' },
  { name:'Stat Card', category:'Layout', code:'<StatCard metric="1,842" change="+12%" />', preview:'stat-card' },
  { name:'Table', category:'Layout', code:'<Table columns={cols} data={rows} />', preview:'table' },
  { name:'Divider', category:'Layout', code:'<Divider label="or continue with" />', preview:'divider' },
  { name:'Grid Layout', category:'Layout', code:'<Grid cols={3} gap="md">{children}</Grid>', preview:'grid' },
  { name:'Avatar', category:'Display', code:'<Avatar name="Alex Kim" size="md" />', preview:'avatar' },
  { name:'Avatar Group', category:'Display', code:'<AvatarGroup users={users} max={3} />', preview:'avatar-group' },
  { name:'Tooltip', category:'Display', code:'<Tooltip content="Helpful tip">hover</Tooltip>', preview:'tooltip' },
  { name:'Code Block', category:'Display', code:'<CodeBlock lang="tsx" code={snippet} />', preview:'codeblock' },
];

let currentCategory = 'All';
let currentSearch = '';

function initComponents() {
  renderComponents();
}

function renderComponents() {
  let filtered = COMPONENTS;
  if (currentCategory !== 'All') filtered = filtered.filter(c => c.category === currentCategory);
  if (currentSearch) filtered = filtered.filter(c => c.name.toLowerCase().includes(currentSearch.toLowerCase()));
  
  document.getElementById('compCount').textContent = `${filtered.length} components · ${currentCategory === 'All' ? 'All categories' : currentCategory}`;
  document.getElementById('compGrid').innerHTML = filtered.map(c => `
    <div class="comp-card">
      <div class="comp-preview">${renderPreview(c.preview)}</div>
      <div class="comp-info">
        <div class="comp-name">${c.name}</div>
        <div class="comp-category">${c.category}</div>
      </div>
      <div class="comp-code">
        <span style="overflow:hidden;text-overflow:ellipsis">${escHtml(c.code)}</span>
        <button class="copy-btn" onclick="copyCode(this,'${escAttr(c.code)}')">Copy</button>
      </div>
    </div>
  `).join('');
}

function renderPreview(type) {
  const map = {
    'buttons': `<button class="demo-btn primary">Primary</button><button class="demo-btn outline" style="margin-left:8px">Secondary</button>`,
    'buttons-ghost': `<button class="demo-btn ghost">Ghost Button</button>`,
    'buttons-outline': `<button class="demo-btn outline">Outline</button>`,
    'buttons-danger': `<button class="demo-btn danger">Delete Item</button>`,
    'input': `<input class="demo-input" placeholder="Enter text…" style="width:200px">`,
    'select': `<select class="demo-select"><option>Option 1</option><option>Option 2</option></select>`,
    'toggle': `<div class="demo-toggle"></div>`,
    'checkbox': `<label style="display:flex;align-items:center;gap:8px;font-size:13px;cursor:pointer"><input type="checkbox" checked style="accent-color:#3b82f6;width:14px;height:14px">Accept terms</label>`,
    'badge-success': `<span class="demo-badge success">● Active</span>`,
    'badge-info': `<span class="demo-badge info">ℹ Info</span>`,
    'badge-warning': `<span class="demo-badge warning">⚠ Warning</span>`,
    'badge-error': `<span class="demo-badge error">✕ Error</span>`,
    'progress': `<div style="width:200px"><div style="display:flex;justify-content:space-between;font-size:11px;color:var(--text2);margin-bottom:6px"><span>Progress</span><span>72%</span></div><div class="demo-progress"><div class="demo-progress-fill"></div></div></div>`,
    'toast': `<div style="background:rgba(16,185,129,0.1);border:1px solid rgba(16,185,129,0.25);border-radius:8px;padding:10px 14px;font-size:12px;color:var(--green);display:flex;align-items:center;gap:8px">✓ Changes saved successfully</div>`,
    'navbar': `<div style="display:flex;align-items:center;gap:10px;background:var(--surface);border:1px solid var(--border);border-radius:8px;padding:8px 14px;font-size:12px;width:100%"><span style="font-weight:700">FluxUI</span><span style="color:var(--text2)">Home</span><span style="color:var(--blue)">Components</span><span style="margin-left:auto"><button class="demo-btn primary" style="padding:5px 10px;font-size:11px">CTA</button></span></div>`,
    'breadcrumbs': `<div style="display:flex;align-items:center;gap:6px;font-size:12px;color:var(--text2)"><span>Home</span><span style="color:var(--text3)">›</span><span>Components</span><span style="color:var(--text3)">›</span><span style="color:var(--text)">Button</span></div>`,
    'tabs': `<div style="display:flex;gap:2px;background:var(--surface);border-radius:8px;padding:3px;border:1px solid var(--border)"><div style="padding:6px 14px;border-radius:6px;background:var(--bg2);font-size:12px;font-weight:500">Overview</div><div style="padding:6px 14px;border-radius:6px;font-size:12px;color:var(--text2)">Props</div><div style="padding:6px 14px;border-radius:6px;font-size:12px;color:var(--text2)">Examples</div></div>`,
    'pagination': `<div style="display:flex;gap:4px;align-items:center"><span style="padding:5px 10px;border-radius:6px;border:1px solid var(--border);font-size:12px;color:var(--text2)">‹</span><span style="padding:5px 10px;border-radius:6px;border:1px solid var(--border);font-size:12px;color:var(--text2)">1</span><span style="padding:5px 10px;border-radius:6px;background:var(--grad2);color:white;font-size:12px">2</span><span style="padding:5px 10px;border-radius:6px;border:1px solid var(--border);font-size:12px;color:var(--text2)">3</span><span style="padding:5px 10px;border-radius:6px;border:1px solid var(--border);font-size:12px;color:var(--text2)">›</span></div>`,
    'sidebar-link': `<div style="display:flex;align-items:center;gap:10px;padding:9px 12px;border-radius:8px;background:rgba(59,130,246,0.1);border:1px solid rgba(59,130,246,0.2);font-size:12px;color:#60a5fa;width:180px">⚡ <span>Dashboard</span></div>`,
    'card': `<div class="demo-card-mini"><div style="font-size:10px;color:var(--text3);margin-bottom:4px">REVENUE</div><div style="font-size:22px;font-weight:700;color:#60a5fa">$48k</div><div style="font-size:11px;color:var(--green);margin-top:4px">↑ +12% vs last month</div></div>`,
    'stat-card': `<div style="display:flex;gap:12px"><div class="demo-card-mini"><h4>1,842</h4><p>Active users</p></div><div class="demo-card-mini"><h4>98.7%</h4><p>Uptime</p></div></div>`,
    'table': `<table class="demo-table" style="width:220px"><thead><tr><th>Name</th><th>Status</th></tr></thead><tbody><tr><td>Alpha</td><td><span class="demo-badge success" style="font-size:10px">Live</span></td></tr><tr><td>Beta</td><td><span class="demo-badge warning" style="font-size:10px">Draft</span></td></tr></tbody></table>`,
    'divider': `<div style="width:220px;text-align:center;display:flex;align-items:center;gap:10px;font-size:12px;color:var(--text3)"><div style="flex:1;height:1px;background:var(--border)"></div><span>or</span><div style="flex:1;height:1px;background:var(--border)"></div></div>`,
    'grid': `<div style="display:grid;grid-template-columns:1fr 1fr 1fr;gap:6px;width:200px">${Array(6).fill('<div style="height:24px;background:var(--surface2);border-radius:4px;border:1px solid var(--border)"></div>').join('')}</div>`,
    'avatar': `<div style="display:flex;align-items:center;gap:10px"><div class="demo-avatar" style="margin-left:0;width:36px;height:36px;background:linear-gradient(135deg,#3b82f6,#7c3aed);font-size:13px">AK</div><div style="font-size:12px"><div style="font-weight:600">Alex Kim</div><div style="color:var(--text3)">Designer</div></div></div>`,
    'avatar-group': `<div class="demo-avatar-group"><div class="demo-avatar" style="background:linear-gradient(135deg,#3b82f6,#7c3aed)">MK</div><div class="demo-avatar" style="background:linear-gradient(135deg,#00d4ff,#3b82f6)">AL</div><div class="demo-avatar" style="background:linear-gradient(135deg,#10b981,#00d4ff)">SR</div><div class="demo-avatar" style="background:var(--surface2);color:var(--text2);border:2px solid var(--border)">+4</div></div>`,
    'tooltip': `<div class="demo-tooltip-wrap"><button class="demo-btn outline">Hover me</button><div class="demo-tooltip">This is a helpful tooltip ✨</div></div>`,
    'codeblock': `<div style="background:var(--bg3);border:1px solid var(--border);border-radius:8px;padding:10px 14px;font-family:var(--mono);font-size:11px;color:#93c5fd;width:100%">import { Button } from 'fluxui'</div>`,
  };
  return map[type] || `<div style="color:var(--text3);font-size:12px">Preview</div>`;
}

function filterByCategory(cat, btn) {
  currentCategory = cat;
  document.querySelectorAll('.filter-btn').forEach(b => b.classList.remove('active'));
  btn.classList.add('active');
  renderComponents();
}
function filterComponents(q) { currentSearch = q; renderComponents(); }
function copyCode(btn, code) {
  navigator.clipboard.writeText(code).catch(() => {});
  btn.textContent = '✓ Copied';
  btn.classList.add('copied');
  setTimeout(() => { btn.textContent = 'Copy'; btn.classList.remove('copied'); }, 2000);
}
function escHtml(s) { return s.replace(/</g,'&lt;').replace(/>/g,'&gt;'); }
function escAttr(s) { return s.replace(/'/g,"&#39;").replace(/"/g,'&quot;'); }

/* ============================================
   TOKENS PAGE
   ============================================ */
function initTokens() {
  renderColorTokens();
  renderTypeScale();
  renderSpacing();
  renderRadius();
}

function renderColorTokens() {
  const colors = [
    { name:'--color-blue-400', value:'#60a5fa', hex:'#60a5fa' },
    { name:'--color-blue-500', value:'#3b82f6', hex:'#3b82f6' },
    { name:'--color-blue-600', value:'#2563eb', hex:'#2563eb' },
    { name:'--color-purple-400', value:'#a78bfa', hex:'#a78bfa' },
    { name:'--color-purple-600', value:'#7c3aed', hex:'#7c3aed' },
    { name:'--color-cyan-400', value:'#22d3ee', hex:'#22d3ee' },
    { name:'--color-cyan-500', value:'#00d4ff', hex:'#00d4ff' },
    { name:'--color-slate-800', value:'#1e293b', hex:'#1e293b' },
    { name:'--color-slate-900', value:'#0f172a', hex:'#0f172a' },
  ];
  const semantic = [
    { name:'--color-success', value:'#10b981', hex:'#10b981' },
    { name:'--color-warning', value:'#f59e0b', hex:'#f59e0b' },
    { name:'--color-error', value:'#ef4444', hex:'#ef4444' },
    { name:'--color-info', value:'#3b82f6', hex:'#3b82f6' },
  ];

  document.getElementById('tokenColorGrid').innerHTML = colors.map(c => `
    <div class="token-card" onclick="copyTokenValue('${c.value}')">
      <div class="token-swatch" style="background:${c.hex}"></div>
      <div class="token-meta">
        <div class="token-name">${c.name.replace('--color-','')}</div>
        <div class="token-value">${c.hex}</div>
      </div>
    </div>
  `).join('');
  document.getElementById('tokenSemanticGrid').innerHTML = semantic.map(c => `
    <div class="token-card" onclick="copyTokenValue('${c.value}')">
      <div class="token-swatch" style="background:${c.hex}"></div>
      <div class="token-meta">
        <div class="token-name">${c.name.replace('--color-','')}</div>
        <div class="token-value">${c.hex}</div>
      </div>
    </div>
  `).join('');
}

function renderTypeScale() {
  const scale = [
    { label:'Display', size:'60px', weight:'800', lh:'1.05' },
    { label:'H1', size:'48px', weight:'800', lh:'1.1' },
    { label:'H2', size:'36px', weight:'700', lh:'1.15' },
    { label:'H3', size:'28px', weight:'600', lh:'1.2' },
    { label:'H4', size:'22px', weight:'600', lh:'1.25' },
    { label:'Body LG', size:'18px', weight:'400', lh:'1.7' },
    { label:'Body', size:'15px', weight:'400', lh:'1.6' },
    { label:'Body SM', size:'13px', weight:'400', lh:'1.5' },
    { label:'Caption', size:'11px', weight:'500', lh:'1.4' },
  ];
  document.getElementById('typeScale').innerHTML = scale.map(t => `
    <div class="type-row">
      <div class="type-meta">
        <div class="type-label">${t.label}</div>
        <div class="type-spec">${t.size} · w${t.weight}</div>
      </div>
      <div class="type-demo" style="font-size:${t.size};font-weight:${t.weight};line-height:${t.lh};overflow:hidden;white-space:nowrap;text-overflow:ellipsis">
        The quick brown fox
      </div>
    </div>
  `).join('');
}

function renderSpacing() {
  const spaces = [
    { name:'space-1', px:4 },{ name:'space-2', px:8 },{ name:'space-3', px:12 },
    { name:'space-4', px:16 },{ name:'space-5', px:20 },{ name:'space-6', px:24 },
    { name:'space-8', px:32 },{ name:'space-10', px:40 },{ name:'space-12', px:48 },
    { name:'space-16', px:64 },{ name:'space-20', px:80 },{ name:'space-24', px:96 },
  ];
  document.getElementById('spacingVisual').innerHTML = spaces.map(s => `
    <div class="space-row">
      <div class="space-label">${s.name}</div>
      <div class="space-bar" style="width:${s.px * 2}px"></div>
      <div class="space-px">${s.px}px</div>
    </div>
  `).join('');
}

function renderRadius() {
  const radii = [
    { name:'none', value:'0px' },{ name:'sm', value:'4px' },{ name:'md', value:'8px' },
    { name:'lg', value:'12px' },{ name:'xl', value:'16px' },{ name:'2xl', value:'24px' },
    { name:'full', value:'9999px' },
  ];
  document.getElementById('radiusDemos').innerHTML = radii.map(r => `
    <div style="display:flex;flex-direction:column;align-items:center;gap:8px">
      <div class="radius-demo" style="border-radius:${r.value};width:${r.name==='full'?'80px':'64px'};height:${r.name==='full'?'40px':'64px'}"></div>
      <div style="font-size:10px;color:var(--text3);text-align:center">${r.name}<br><span style="font-family:var(--mono)">${r.value}</span></div>
    </div>
  `).join('');
}

function scrollToTokenSection(id) { document.getElementById('token-'+id)?.scrollIntoView({ behavior:'smooth', block:'start' }); }
function copyTokenValue(v) {
  navigator.clipboard.writeText(v).catch(()=>{});
  // visual flash handled by hover
}
function updateRadius(v) {
  document.getElementById('radiusVal').textContent = v + 'px';
  document.getElementById('liveCard').style.borderRadius = v + 'px';
}
function updatePadding(v) {
  document.getElementById('paddingVal').textContent = v + 'px';
  document.getElementById('liveCard').style.padding = v + 'px';
}

/* ============================================
   DOCS PAGE
   ============================================ */
const DOCS = {
  installation: {
    title: 'Installation',
    toc: ['Package Manager','CDN','Peer Dependencies','Verify Installation'],
    content: `
      <div class="docs-h1">Installation</div>
      <p class="docs-p">Get FluxUI up and running in your project in under 5 minutes. FluxUI supports React 18+, Vue 3+, and Svelte 4+.</p>
      
      <div class="docs-h2" id="toc-0">Package Manager</div>
      <p class="docs-p">Install FluxUI using your preferred package manager:</p>
      <div class="docs-code">
        <div class="docs-code-header"><span class="docs-code-lang">bash</span><button class="docs-code-copy" onclick="copyDocCode(this)">Copy</button></div>
        <pre><span class="cm"># npm</span>
npm install @fluxui/core @fluxui/react

<span class="cm"># yarn</span>
yarn add @fluxui/core @fluxui/react

<span class="cm"># pnpm</span>
pnpm add @fluxui/core @fluxui/react</pre>
      </div>

      <div class="docs-h2" id="toc-1">CDN</div>
      <p class="docs-p">For quick prototyping, include FluxUI directly via CDN:</p>
      <div class="docs-code">
        <div class="docs-code-header"><span class="docs-code-lang">html</span><button class="docs-code-copy" onclick="copyDocCode(this)">Copy</button></div>
        <pre><span class="kw">&lt;link</span> rel=<span class="str">"stylesheet"</span> href=<span class="str">"https://cdn.fluxui.design/v2.4.0/fluxui.min.css"</span> <span class="kw">/&gt;</span>
<span class="kw">&lt;script</span> src=<span class="str">"https://cdn.fluxui.design/v2.4.0/fluxui.umd.min.js"</span><span class="kw">&gt;&lt;/script&gt;</span></pre>
      </div>

      <div class="docs-h2" id="toc-2">Peer Dependencies</div>
      <table class="docs-table">
        <thead><tr><th>Package</th><th>Version</th><th>Required</th></tr></thead>
        <tbody>
          <tr><td><code>react</code></td><td><code>^18.0.0</code></td><td>Yes (React only)</td></tr>
          <tr><td><code>react-dom</code></td><td><code>^18.0.0</code></td><td>Yes (React only)</td></tr>
          <tr><td><code>typescript</code></td><td><code>^5.0.0</code></td><td>Optional</td></tr>
        </tbody>
      </table>

      <div class="docs-h2" id="toc-3">Verify Installation</div>
      <p class="docs-p">Import and render your first FluxUI component:</p>
      <div class="docs-code">
        <div class="docs-code-header"><span class="docs-code-lang">tsx</span><button class="docs-code-copy" onclick="copyDocCode(this)">Copy</button></div>
        <pre><span class="kw">import</span> { Button } <span class="kw">from</span> <span class="str">'@fluxui/react'</span>
<span class="kw">import</span> <span class="str">'@fluxui/core/tokens.css'</span>

<span class="kw">export default function</span> <span class="fn">App</span>() {
  <span class="kw">return</span> &lt;Button variant=<span class="str">"primary"</span>&gt;Hello, FluxUI!&lt;/Button&gt;
}</pre>
      </div>
      <div class="docs-callout info"><span class="callout-icon">ℹ</span><span>Make sure to import the CSS tokens file at your app root for design tokens to work correctly.</span></div>`
  },
  theming: {
    title: 'Theming',
    toc: ['Overview','CSS Variables','Dark Mode','Custom Themes'],
    content: `
      <div class="docs-h1">Theming</div>
      <p class="docs-p">FluxUI's theming system is built on CSS custom properties (variables), making it trivially easy to create branded themes.</p>
      <div class="docs-h2" id="toc-0">Overview</div>
      <p class="docs-p">All visual properties in FluxUI — colors, spacing, typography, radius — are expressed as CSS variables prefixed with <code style="font-family:var(--mono);color:#60a5fa">--flux-</code>. Override any variable to instantly theme the entire system.</p>
      <div class="docs-h2" id="toc-1">CSS Variables</div>
      <div class="docs-code">
        <div class="docs-code-header"><span class="docs-code-lang">css</span><button class="docs-code-copy" onclick="copyDocCode(this)">Copy</button></div>
        <pre>:root {
  <span class="cm">/* Brand */</span>
  --flux-color-primary:    <span class="str">#3b82f6</span>;
  --flux-color-primary-fg: <span class="str">#ffffff</span>;
  --flux-color-accent:     <span class="str">#7c3aed</span>;
  
  <span class="cm">/* Radius */</span>
  --flux-radius-sm:  <span class="str">4px</span>;
  --flux-radius-md:  <span class="str">8px</span>;
  --flux-radius-lg:  <span class="str">12px</span>;
  
  <span class="cm">/* Typography */</span>
  --flux-font-sans: <span class="str">'Outfit', sans-serif</span>;
  --flux-font-mono: <span class="str">'JetBrains Mono', monospace</span>;
}</pre>
      </div>
      <div class="docs-h2" id="toc-2">Dark Mode</div>
      <p class="docs-p">Dark mode is handled via a <code style="font-family:var(--mono);color:#60a5fa">.dark</code> class on the root element. All components automatically adapt.</p>
      <div class="docs-callout warn"><span class="callout-icon">⚠</span><span>If you're using a custom theme, ensure sufficient contrast ratios (WCAG AA minimum 4.5:1) for accessible dark mode variants.</span></div>
      <div class="docs-h2" id="toc-3">Custom Themes</div>
      <div class="docs-code">
        <div class="docs-code-header"><span class="docs-code-lang">ts</span><button class="docs-code-copy" onclick="copyDocCode(this)">Copy</button></div>
        <pre><span class="kw">import</span> { createTheme } <span class="kw">from</span> <span class="str">'@fluxui/core'</span>

<span class="kw">const</span> brandTheme = <span class="fn">createTheme</span>({
  colors: {
    primary: <span class="str">'#e11d48'</span>,
    accent:  <span class="str">'#db2777'</span>,
  },
  radius: { default: <span class="str">'6px'</span> },
})

<span class="kw">export default</span> brandTheme</pre>
      </div>`
  },
  'api-tokens': {
    title: 'Token API',
    toc: ['Endpoints','Authentication','List Tokens','Update Token','Webhooks'],
    content: `
      <div class="docs-h1">Token API</div>
      <p class="docs-p">Programmatically manage your design tokens via the FluxUI REST API. All endpoints require authentication.</p>
      <div class="docs-h2" id="toc-0">Base URL</div>
      <div class="docs-code">
        <div class="docs-code-header"><span class="docs-code-lang">text</span><button class="docs-code-copy" onclick="copyDocCode(this)">Copy</button></div>
        <pre>https://api.fluxui.design/v2</pre>
      </div>
      <div class="docs-h2" id="toc-1">Authentication</div>
      <div class="docs-code">
        <div class="docs-code-header"><span class="docs-code-lang">bash</span><button class="docs-code-copy" onclick="copyDocCode(this)">Copy</button></div>
        <pre>curl -H <span class="str">"Authorization: Bearer YOUR_API_KEY"</span> \\
     https://api.fluxui.design/v2/tokens</pre>
      </div>
      <div class="docs-h2" id="toc-2">List Tokens</div>
      <table class="docs-table">
        <thead><tr><th>Method</th><th>Endpoint</th><th>Description</th></tr></thead>
        <tbody>
          <tr><td><code>GET</code></td><td><code>/tokens</code></td><td>List all tokens</td></tr>
          <tr><td><code>GET</code></td><td><code>/tokens/:id</code></td><td>Get single token</td></tr>
          <tr><td><code>POST</code></td><td><code>/tokens</code></td><td>Create token</td></tr>
          <tr><td><code>PATCH</code></td><td><code>/tokens/:id</code></td><td>Update token</td></tr>
          <tr><td><code>DELETE</code></td><td><code>/tokens/:id</code></td><td>Delete token</td></tr>
        </tbody>
      </table>
      <div class="docs-h2" id="toc-3">Response Format</div>
      <div class="docs-code">
        <div class="docs-code-header"><span class="docs-code-lang">json</span><button class="docs-code-copy" onclick="copyDocCode(this)">Copy</button></div>
        <pre>{
  <span class="str">"id"</span>: <span class="str">"tok_01hxyz"</span>,
  <span class="str">"name"</span>: <span class="str">"color.primary.500"</span>,
  <span class="str">"value"</span>: <span class="str">"#3b82f6"</span>,
  <span class="str">"type"</span>: <span class="str">"color"</span>,
  <span class="str">"group"</span>: <span class="str">"brand"</span>,
  <span class="str">"updatedAt"</span>: <span class="str">"2024-01-15T09:24:00Z"</span>
}</pre>
      </div>`
  },
};

function initDocs() { showDoc('installation'); }

function showDoc(id) {
  const doc = DOCS[id] || DOCS['installation'];
  document.querySelectorAll('.docs-link').forEach(l => l.classList.remove('active'));
  document.querySelectorAll(`.docs-link`).forEach(l => {
    if (l.getAttribute('onclick')?.includes(id)) l.classList.add('active');
  });
  document.getElementById('docsMain').innerHTML = doc.content;
  
  const toc = document.getElementById('docsToc');
  if (toc && doc.toc) {
    toc.innerHTML = `<div class="toc-title">On this page</div>` +
      doc.toc.map((t,i) => `<div class="toc-link" onclick="document.getElementById('toc-${i}')?.scrollIntoView({behavior:'smooth'})">${t}</div>`).join('');
  }
}

function copyDocCode(btn) {
  const pre = btn.closest('.docs-code').querySelector('pre');
  navigator.clipboard.writeText(pre.textContent).catch(()=>{});
  btn.textContent = '✓ Copied';
  setTimeout(() => btn.textContent = 'Copy', 2000);
}

/* ============================================
   PLAYGROUND PAGE
   ============================================ */
let canvasComponents = [];
let selectedId = null;
let dragType = null;
let exportLang = 'react';

function initPlayground() { renderCanvas(); }

function dragStart(e, type) { dragType = type; e.dataTransfer.effectAllowed = 'copy'; }

function dropComponent(e) {
  e.preventDefault();
  if (!dragType) return;
  const id = Date.now();
  canvasComponents.push({ id, type: dragType, props: getDefaultProps(dragType) });
  dragType = null;
  renderCanvas();
  selectComponent(id);
}

function getDefaultProps(type) {
  const defaults = {
    button: { label:'Button', variant:'primary', size:'md' },
    input: { placeholder:'Enter text…', label:'', disabled:false },
    badge: { label:'Badge', variant:'info' },
    card: { title:'Card Title', body:'Card description text.', showBtn:true },
    toggle: { checked:true, label:'Toggle' },
    avatar: { initials:'AK', color:'#3b82f6' },
    progress: { value:70, label:'Progress' },
    alert: { message:'This is an alert', type:'info' },
    divider: { label:'or' },
    spacer: { height:24 },
  };
  return defaults[type] || {};
}

function renderCanvas() {
  const area = document.getElementById('canvasArea');
  const ph = document.getElementById('canvasPlaceholder');
  ph.style.display = canvasComponents.length ? 'none' : 'flex';
  document.getElementById('canvasInfo').textContent = canvasComponents.length ? `${canvasComponents.length} component${canvasComponents.length>1?'s':''} on canvas` : 'Drop components here';

  // Remove old rendered components, keep placeholder
  area.querySelectorAll('.canvas-component').forEach(el => el.remove());

  const row = document.createElement('div');
  row.style.cssText = 'display:flex;flex-wrap:wrap;gap:12px;align-items:flex-start;';
  canvasComponents.forEach(comp => {
    const wrap = document.createElement('div');
    wrap.className = `canvas-component${selectedId===comp.id?' selected':''}`;
    wrap.innerHTML = renderCanvasComp(comp);
    wrap.onclick = (e) => { e.stopPropagation(); selectComponent(comp.id); };
    row.appendChild(wrap);
  });
  area.appendChild(row);
}

function renderCanvasComp(comp) {
  const p = comp.props;
  switch(comp.type) {
    case 'button': return `<button class="demo-btn ${p.variant}">${p.label}</button>`;
    case 'input': return `<input class="demo-input" placeholder="${p.placeholder}" style="width:200px">`;
    case 'badge': return `<span class="demo-badge ${p.variant}">${p.label}</span>`;
    case 'card': return `<div class="demo-card-mini" style="width:200px"><h4>${p.title}</h4><p>${p.body}</p>${p.showBtn?'<div style="margin-top:10px"><button class="demo-btn primary" style="padding:5px 10px;font-size:11px">Action</button></div>':''}</div>`;
    case 'toggle': return `<div style="display:flex;align-items:center;gap:10px;font-size:13px"><div class="demo-toggle ${p.checked?'':'off'}"></div>${p.label}</div>`;
    case 'avatar': return `<div class="demo-avatar" style="margin-left:0;width:40px;height:40px;background:${p.color};font-size:14px">${p.initials}</div>`;
    case 'progress': return `<div style="width:200px"><div style="display:flex;justify-content:space-between;font-size:11px;color:var(--text2);margin-bottom:6px"><span>${p.label}</span><span>${p.value}%</span></div><div class="demo-progress"><div class="demo-progress-fill" style="width:${p.value}%"></div></div></div>`;
    case 'alert': return `<div style="background:rgba(59,130,246,0.07);border:1px solid rgba(59,130,246,0.2);border-radius:8px;padding:12px 16px;font-size:13px;color:var(--text2);display:flex;gap:8px;align-items:flex-start;max-width:300px">ℹ ${p.message}</div>`;
    case 'divider': return `<div style="width:220px;display:flex;align-items:center;gap:10px;font-size:12px;color:var(--text3)"><div style="flex:1;height:1px;background:var(--border)"></div>${p.label}<div style="flex:1;height:1px;background:var(--border)"></div></div>`;
    case 'spacer': return `<div style="width:200px;height:${p.height}px;background:repeating-linear-gradient(90deg,rgba(99,102,241,0.1) 0px,rgba(99,102,241,0.1) 4px,transparent 4px,transparent 20px);border:1px dashed rgba(99,102,241,0.2);border-radius:4px;display:flex;align-items:center;justify-content:center;font-size:10px;color:rgba(99,102,241,0.5)">${p.height}px spacer</div>`;
    default: return `<div style="padding:16px;border:1px dashed var(--border);border-radius:8px;font-size:12px;color:var(--text3)">${comp.type}</div>`;
  }
}

function selectComponent(id) {
  selectedId = id;
  renderCanvas();
  const comp = canvasComponents.find(c => c.id === id);
  if (comp) renderProps(comp);
}

document.addEventListener('click', e => {
  if (e.target.id === 'canvasArea' || e.target.id === 'playgroundCanvas') {
    selectedId = null;
    renderCanvas();
    document.getElementById('propsContent').innerHTML = '<p style="font-size:13px;color:var(--text3)">Select a component on the canvas to edit its properties.</p>';
  }
});

function renderProps(comp) {
  const p = comp.props;
  let html = `<div class="prop-group"><div class="prop-group-title">${comp.type.toUpperCase()}</div>`;
  Object.entries(p).forEach(([key, val]) => {
    if (typeof val === 'boolean') {
      html += `<div class="prop-row"><label class="prop-label">${key}</label><div class="demo-toggle ${val?'':'off'}" onclick="toggleProp(${comp.id},'${key}')"></div></div>`;
    } else if (key === 'variant') {
      const variants = comp.type==='button'?['primary','outline','ghost','danger']:['info','success','warning','error'];
      html += `<div class="prop-row"><label class="prop-label">${key}</label><select class="prop-select" onchange="updateProp(${comp.id},'${key}',this.value)">${variants.map(v=>`<option ${v===val?'selected':''}>${v}</option>`).join('')}</select></div>`;
    } else {
      html += `<div class="prop-row"><label class="prop-label">${key}</label><input class="prop-input" value="${val}" oninput="updateProp(${comp.id},'${key}',this.value)"></div>`;
    }
  });
  html += `</div>`;
  html += `<div class="prop-group"><div class="prop-group-title">Actions</div><button class="demo-btn danger" style="width:100%;margin-top:4px;font-size:12px;padding:8px" onclick="deleteComponent(${comp.id})">✕ Remove</button></div>`;
  document.getElementById('propsContent').innerHTML = html;
}

function updateProp(id, key, val) {
  const comp = canvasComponents.find(c => c.id === id);
  if (comp) { comp.props[key] = val; renderCanvas(); }
}
function toggleProp(id, key) {
  const comp = canvasComponents.find(c => c.id === id);
  if (comp) { comp.props[key] = !comp.props[key]; renderCanvas(); renderProps(comp); }
}
function deleteComponent(id) {
  canvasComponents = canvasComponents.filter(c => c.id !== id);
  selectedId = null;
  renderCanvas();
  document.getElementById('propsContent').innerHTML = '<p style="font-size:13px;color:var(--text3)">Select a component on the canvas to edit its properties.</p>';
}
function clearCanvas() { canvasComponents = []; selectedId = null; renderCanvas(); }
function setCanvasTool(tool, btn) {
  document.querySelectorAll('.canvas-tool').forEach(b => b.classList.remove('active'));
  btn.classList.add('active');
}

/* EXPORT */
const REACT_EXPORTS = {
  button: p => `<Button variant="${p.variant}" size="${p.size}">${p.label}</Button>`,
  input: p => `<Input placeholder="${p.placeholder}" />`,
  badge: p => `<Badge variant="${p.variant}">${p.label}</Badge>`,
  card: p => `<Card title="${p.title}" body="${p.body}" />`,
  toggle: p => `<Toggle checked={${p.checked}} label="${p.label}" />`,
  avatar: p => `<Avatar initials="${p.initials}" color="${p.color}" />`,
  progress: p => `<Progress value={${p.value}} label="${p.label}" />`,
  alert: p => `<Alert message="${p.message}" />`,
  divider: p => `<Divider label="${p.label}" />`,
  spacer: p => `<Spacer height={${p.height}} />`,
};
const HTML_EXPORTS = {
  button: p => `<button class="flux-btn flux-btn--${p.variant}">${p.label}</button>`,
  input: p => `<input class="flux-input" placeholder="${p.placeholder}">`,
  badge: p => `<span class="flux-badge flux-badge--${p.variant}">${p.label}</span>`,
  card: p => `<div class="flux-card"><h3>${p.title}</h3><p>${p.body}</p></div>`,
  toggle: p => `<label class="flux-toggle"><input type="checkbox" ${p.checked?'checked':''}><span>${p.label}</span></label>`,
  avatar: p => `<div class="flux-avatar" style="background:${p.color}">${p.initials}</div>`,
  progress: p => `<div class="flux-progress" style="--value:${p.value}%">${p.label}</div>`,
  alert: p => `<div class="flux-alert">${p.message}</div>`,
  divider: p => `<hr class="flux-divider" data-label="${p.label}">`,
  spacer: p => `<div class="flux-spacer" style="height:${p.height}px"></div>`,
};

function openExportModal() {
  if (!canvasComponents.length) { alert('Add some components to the canvas first!'); return; }
  updateExportCode();
  document.getElementById('exportModal').classList.add('open');
}
function closeExportModal(e) { if (e.target.id==='exportModal') document.getElementById('exportModal').classList.remove('open'); }
function switchExportTab(lang, btn) {
  exportLang = lang;
  document.querySelectorAll('.export-tab').forEach(b => b.classList.remove('active'));
  btn.classList.add('active');
  updateExportCode();
}
function updateExportCode() {
  const map = exportLang === 'react' ? REACT_EXPORTS : HTML_EXPORTS;
  let code = '';
  if (exportLang === 'react') {
    const imports = [...new Set(canvasComponents.map(c => c.type.charAt(0).toUpperCase()+c.type.slice(1)))].join(', ');
    code += `import { ${imports} } from '@fluxui/react'\n\nexport default function MyComponent() {\n  return (\n    <div className="flex flex-wrap gap-3">\n`;
    canvasComponents.forEach(c => { code += `      ${(map[c.type]||(()=>`{/* ${c.type} */}`))(c.props)}\n`; });
    code += `    </div>\n  )\n}`;
  } else {
    code += `<!-- FluxUI HTML Components -->\n<div class="flux-container">\n`;
    canvasComponents.forEach(c => { code += `  ${(map[c.type]||(()=>`<!-- ${c.type} -->`))(c.props)}\n`; });
    code += `</div>`;
  }
  document.getElementById('exportCode').textContent = code;
}
function copyExportCode() {
  navigator.clipboard.writeText(document.getElementById('exportCode').textContent).catch(()=>{});
  const btn = document.querySelector('.export-modal .btn-primary');
  btn.textContent = '✓ Copied!';
  setTimeout(() => btn.textContent = 'Copy Code', 2000);
}

/* ---- Init ---- */
(function() {
  // Trigger reveal on home load
  setTimeout(() => {
    document.querySelectorAll('#page-home .reveal').forEach(el => el.classList.add('in'));
  }, 100);
})();
