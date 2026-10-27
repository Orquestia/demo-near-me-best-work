/* Best Work 360 · demo data layer.
   Everything lives in localStorage so the landing, the admin platform and the
   field PWA share one fictitious database and update each other live. */
(function () {
  const KEY = 'nmbw-demo-v3';

  const SERVICES = [
    { id: 'house', name: 'House Soft Wash', es: 'Lavado de casa (soft wash)', price: 249 },
    { id: 'driveway', name: 'Driveway, Sidewalk & Entry', es: 'Driveway, acera y entrada', price: 99 },
    { id: 'roof', name: 'Roof Soft Wash', es: 'Lavado de techo (soft wash)', price: 349 },
    { id: 'pool', name: 'Pool Deck / Patio', es: 'Pool deck o patio', price: 149 },
    { id: 'paver', name: 'Paver Sealing', es: 'Sellado de pavers', price: 299 },
    { id: 'fence', name: 'Fence Cleaning', es: 'Limpieza de cerca', price: 149 },
    { id: 'screen', name: 'Screen Enclosure / Pool Cage', es: 'Screen enclosure / pool cage', price: 400 },
  ];

  // Plan data from plan-membresia-near-me-best-work-2026-10-27.pdf.
  // Annual prices are only confirmed for band M.
  const PLANS = {
    base: {
      id: 'base', name: 'Base', blurb: 'Keep your entry and home looking sharp all year.',
      monthly: { S: 29, M: 34, L: 44 }, annual: { M: 379 }, separate: 447, discount: 10,
      includes: ['1 House Soft Wash', '2 driveway, sidewalk & entry cleanings (one every 6 months)', 'Free visual roof & gutter inspection every visit', '10% off any extra service', 'Priority scheduling'],
      visits: [['house', 14], ['driveway', 14], ['driveway', 182]],
    },
    gold: {
      id: 'gold', name: 'Gold', blurb: 'The whole house, roof included.', popular: true,
      monthly: { S: 59, M: 69, L: 89 }, annual: { M: 749 }, separate: 945, discount: 15,
      includes: ['Everything in Base', '1 Roof Soft Wash per year', '1 pool deck or patio cleaning per year', '15% off extra services, paver sealing included', 'High priority, even in peak season'],
      visits: [['house', 14], ['driveway', 14], ['roof', 30], ['pool', 30], ['driveway', 182]],
    },
    platinum: {
      id: 'platinum', name: 'Platinum', blurb: 'Total property care. You never think about it.',
      monthly: { S: 99, M: 119, L: 149 }, annual: { M: 1299 }, separate: 1642, discount: 20, separateNote: 'not counting the screen enclosure',
      includes: ['Everything in Gold', '2 House Soft Washes per year (every 6 months)', '1 Fence Cleaning per year', '1 Paver Sealing per year', '1 screen enclosure or pool cage cleaning per year (from $400 on its own)', '20% off extra services & property improvements', 'Max priority: check-up visit every 3 months, same-week scheduling'],
      visits: [['house', 14], ['driveway', 14], ['roof', 30], ['pool', 30], ['screen', 45], ['fence', 60], ['paver', 90], ['house', 182], ['driveway', 182]],
    },
  };

  const BANDS = [
    { id: 'S', label: 'Up to 1,500 sq ft', max: 1500 },
    { id: 'M', label: '1,501 – 2,500 sq ft', max: 2500 },
    { id: 'L', label: '2,501 – 3,500 sq ft', max: 3500 },
    { id: 'XL', label: 'Over 3,500 sq ft', max: Infinity },
  ];

  // Demo PINs for the field app; the real build uses Supabase Auth with one account per technician.
  const TECHS = [
    { id: 't1', name: 'Carlos Ramírez', pin: '2580', color: '#1A3D6E' },
    { id: 't2', name: 'Luis Herrera', pin: '1470', color: '#D4A72C' },
    { id: 't3', name: 'Miguel Torres', pin: '3690', color: '#5DBA47' },
    { id: 't4', name: 'José Pérez', pin: '7410', color: '#6EC1E4' },
  ];

  const USERS = [
    { id: 'owner', name: 'David Monsalve', role: 'Dueño', access: 'Todo' },
    { id: 'crm', name: 'Laura Gómez', role: 'CRM y agenda', access: 'Leads, clientes, trabajos, membresías' },
    { id: 'conta', name: 'Patricia Ruiz', role: 'Contabilidad', access: 'Resumen diario, pagos, membresías' },
    { id: 'tech', name: 'Técnicos de campo', role: 'Técnico', access: 'Solo la app de campo' },
  ];

  const PAY_METHODS = ['Tarjeta (Square)', 'Efectivo', 'Zelle', 'Cheque'];

  // ---------- helpers ----------
  const pad = (n) => String(n).padStart(2, '0');
  const iso = (d) => `${d.getFullYear()}-${pad(d.getMonth() + 1)}-${pad(d.getDate())}`;
  const today = () => iso(new Date());
  const addDays = (s, n) => { const d = new Date(s + 'T12:00:00'); d.setDate(d.getDate() + n); return iso(d); };
  const uid = (p) => p + '_' + Math.random().toString(36).slice(2, 9);
  const usd = (n) => '$' + Number(n || 0).toLocaleString('en-US', { maximumFractionDigits: 0 });
  const svc = (id) => SERVICES.find((s) => s.id === id) || { id, name: id, es: id, price: 0 };
  const tech = (id) => TECHS.find((t) => t.id === id) || { name: '—', color: '#94a3b8' };
  const bandFor = (sqft) => BANDS.find((b) => sqft <= b.max).id;
  const fmtDate = (s, opts) => new Date(s + 'T12:00:00').toLocaleDateString('es-CO', opts || { day: 'numeric', month: 'short' });
  const esc = (s) => String(s ?? '').replace(/[&<>"']/g, (c) => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c]));

  // Current PIN for a technician: the one David set in the platform, or the seeded default.
  const techPin = (s, id) => (s.pins && s.pins[id] && s.pins[id].pin) || (TECHS.find((t) => t.id === id) || {}).pin;
  const pinChangedAt = (s, id) => (s.pins && s.pins[id] && s.pins[id].changedAt) || null;

  function priceFor(planId, band, billing) {
    const p = PLANS[planId];
    if (billing === 'annual') return p.annual[band] ?? null;
    return p.monthly[band] ?? null;
  }

  // Simulated county-record lookup (the real build reuses the site's instant-estimate data).
  const KNOWN = {
    'lake baldwin': 1380, 'winter park': 2140, 'dr phillips': 3120, 'windermere': 4250, 'kissimmee': 1890, 'lake nona': 2680,
  };
  function lookupAddress(addr) {
    const a = addr.toLowerCase();
    for (const k in KNOWN) if (a.includes(k)) return KNOWN[k];
    let h = 0; for (const c of a) h = (h * 31 + c.charCodeAt(0)) >>> 0;
    return 1100 + (h % 3000);
  }

  // Placeholder before/after photos, drawn as SVG so the seed stays small.
  function photoSrc(p) {
    if (!p || !p.startsWith('ph:')) return p;
    const [, kind, seedStr] = p.split(':');
    const seed = Number(seedStr) || 1;
    const after = kind === 'after';
    const hue = (seed * 47) % 360;
    const wall = after ? `hsl(${hue},25%,92%)` : `hsl(${(hue + 40) % 360},12%,62%)`;
    const roof = after ? `hsl(${(hue + 180) % 360},30%,38%)` : '#3f3a33';
    const drive = after ? '#e9e6df' : '#7c766a';
    let grime = '';
    if (!after) for (let i = 0; i < 26; i++) {
      const x = (seed * 13 + i * 37) % 400, y = 120 + ((seed * 7 + i * 53) % 170), r = 6 + ((i * 11) % 22);
      grime += `<circle cx="${x}" cy="${y}" r="${r}" fill="#2f3b22" opacity="${0.12 + (i % 5) * 0.05}"/>`;
    }
    const svg = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 400 300"><rect width="400" height="300" fill="${after ? '#9fd3ef' : '#b9c4cc'}"/><rect y="230" width="400" height="70" fill="${after ? '#7cc36a' : '#7e8f5a'}"/><polygon points="${120 + (seed % 20)},210 330,210 330,330 60,330" fill="${drive}"/><rect x="70" y="120" width="240" height="110" fill="${wall}"/><polygon points="55,125 190,55 325,125" fill="${roof}"/><rect x="170" y="165" width="40" height="65" fill="${after ? '#1A3D6E' : '#3b4252'}"/><rect x="95" y="145" width="45" height="35" fill="#cfe7f5"/><rect x="240" y="145" width="45" height="35" fill="#cfe7f5"/>${grime}<rect x="10" y="10" rx="6" width="${after ? 92 : 98}" height="28" fill="${after ? '#5DBA47' : '#1B2440'}"/><text x="${after ? 56 : 59}" y="29" font-family="Inter,Arial" font-size="15" font-weight="700" fill="#fff" text-anchor="middle">${after ? 'DESPUÉS' : 'ANTES'}</text></svg>`;
    return 'data:image/svg+xml;utf8,' + encodeURIComponent(svg);
  }

  // ---------- seed ----------
  function rng(seed) { return () => ((seed = (seed * 1664525 + 1013904223) >>> 0) / 4294967296); }

  function seed() {
    const r = rng(20261027);
    const pick = (arr) => arr[Math.floor(r() * arr.length)];
    const T = today();
    const first = ['Michael', 'Jennifer', 'Robert', 'Linda', 'James', 'Patricia', 'Carlos', 'María', 'David', 'Susan', 'Daniel', 'Karen', 'Andrés', 'Lisa', 'Mark', 'Sandra', 'Jorge', 'Nancy', 'Kevin', 'Ashley', 'Brian', 'Emily', 'Luis', 'Michelle', 'Jason', 'Ana', 'Steven', 'Laura', 'Ryan', 'Rebecca', 'Eric', 'Sofía', 'Thomas', 'Diana', 'Paul', 'Rachel', 'Tyler', 'Gabriela', 'Scott', 'Nicole', 'Héctor', 'Amanda'];
    const last = ['Johnson', 'Smith', 'Williams', 'Brown', 'Rodríguez', 'García', 'Miller', 'Davis', 'Martínez', 'Wilson', 'Anderson', 'Taylor', 'Thomas', 'Moore', 'Hernández', 'Jackson', 'White', 'López', 'Harris', 'Clark', 'Lewis', 'Robinson', 'Walker', 'Pérez', 'Hall', 'Young', 'Allen', 'Sánchez', 'Wright', 'King', 'Scott', 'Green', 'Baker', 'Adams', 'Nelson', 'Hill', 'Ramírez', 'Campbell', 'Mitchell', 'Roberts', 'Carter', 'Phillips'];
    const streets = ['Lake Baldwin Ln', 'Aloma Ave', 'Conway Rd', 'Narcoossee Rd', 'Curry Ford Rd', 'Dr Phillips Blvd', 'Lake Underhill Rd', 'Hiawassee Rd', 'Goldenrod Rd', 'Vineland Rd', 'Moss Park Rd', 'Lake Nona Blvd', 'Edgewater Dr', 'Orange Blossom Trl', 'Hoffner Ave'];
    const cities = ['Orlando', 'Orlando', 'Orlando', 'Winter Park', 'Kissimmee', 'Windermere', 'Ocoee', 'Apopka', 'Winter Garden'];
    const origins = ['Orgánico', 'Orgánico', 'Thumbtack', 'Thumbtack', 'Thumbtack', 'Google', 'Google', 'Referido'];

    const clients = [];
    for (let i = 0; i < 42; i++) {
      const fn = first[i], ln = last[i];
      const sqft = 1100 + Math.floor(r() * 2700);
      clients.push({
        id: 'c' + (i + 1), name: `${fn} ${ln}`,
        phone: `(407) ${String(200 + Math.floor(r() * 700))}-${String(1000 + Math.floor(r() * 8999))}`,
        email: `${fn}.${ln}`.toLowerCase().normalize('NFD').replace(/[̀-ͯ]/g, '') + '@example.com',
        address: `${100 + Math.floor(r() * 9800)} ${pick(streets)}, ${pick(cities)}, FL`,
        sqft, origin: pick(origins), createdAt: addDays(T, -Math.floor(40 + r() * 300)),
      });
    }

    const combos = [['house'], ['driveway'], ['house', 'driveway'], ['roof'], ['roof', 'house'], ['pool'], ['paver'], ['driveway', 'pool'], ['fence'], ['house', 'driveway', 'pool'], ['screen']];
    const jobs = [], payments = [], expenses = [];
    const jobAmount = (svcs, c) => svcs.reduce((s, id) => s + (id === 'roof' ? Math.max(349, Math.round(c.sqft * 1.15 * 0.25)) : svc(id).price), 0);

    for (let d = -60; d <= -1; d++) {
      const date = addDays(T, d);
      if (new Date(date + 'T12:00:00').getDay() === 0) continue;
      const n = 1 + Math.floor(r() * 3);
      for (let k = 0; k < n; k++) {
        const c = pick(clients), services = pick(combos);
        const amount = jobAmount(services, c), seedN = Math.floor(r() * 900) + 1;
        const method = pick(['Tarjeta (Square)', 'Tarjeta (Square)', 'Zelle', 'Efectivo', 'Cheque']);
        const j = { id: uid('j'), clientId: c.id, date, time: pick(['08:00', '09:30', '11:00', '13:00', '14:30']), services, techId: pick(TECHS).id, status: 'completado', amount, method, before: ['ph:before:' + seedN], after: ['ph:after:' + seedN], notes: '', completedAt: date + 'T17:00' };
        jobs.push(j);
        payments.push({ id: uid('p'), date, type: 'trabajo', amount, method, clientId: c.id, ref: j.id });
      }
      if (new Date(date + 'T12:00:00').getDay() === 5) expenses.push({ id: uid('e'), date, concept: 'Nómina semanal (4 técnicos)', amount: 2800 });
      if (d % 9 === 0) expenses.push({ id: uid('e'), date, concept: 'Químicos (SH 12.5%, surfactante)', amount: 180 + Math.floor(r() * 140) });
      if (d % 4 === 0) expenses.push({ id: uid('e'), date, concept: 'Gasolina camionetas', amount: 90 + Math.floor(r() * 60) });
    }

    // Today's agenda: all still open so the field app can complete them live.
    const todayPlan = [
      ['c3', ['house', 'driveway'], 't1', '08:00', 'Portón lateral sin llave. Perro amistoso en el patio.'],
      ['c11', ['roof'], 't1', '11:30', 'Techo de teja, 2 pisos. Ofrecer sellado de pavers.'],
      ['c7', ['driveway', 'pool'], 't2', '09:00', ''],
      ['c19', ['paver'], 't2', '13:00', 'Cliente quiere ver muestra de color del sellador.'],
      ['c25', ['fence'], 't3', '10:00', 'Visita de membresía Platinum.'],
    ];
    todayPlan.forEach(([cid, services, techId, time, notes]) => {
      const c = clients.find((x) => x.id === cid);
      jobs.push({ id: uid('j'), clientId: cid, date: T, time, services, techId, status: 'programado', amount: jobAmount(services, c), method: '', before: [], after: [], notes, completedAt: null });
    });
    for (let d = 1; d <= 9; d++) {
      const date = addDays(T, d);
      if (new Date(date + 'T12:00:00').getDay() === 0) continue;
      for (let k = 0; k < 1 + (d % 2); k++) {
        const c = pick(clients), services = pick(combos);
        jobs.push({ id: uid('j'), clientId: c.id, date, time: pick(['08:00', '10:00', '13:00']), services, techId: pick(TECHS).id, status: 'programado', amount: jobAmount(services, c), method: '', before: [], after: [], notes: '', completedAt: null });
      }
    }

    // Members (as if the plan had been live for a few months).
    const members = [];
    const memberPlan = ['gold', 'gold', 'base', 'gold', 'platinum', 'base', 'gold', 'gold', 'base', 'platinum', 'gold', 'base', 'gold', 'gold', 'platinum', 'base', 'gold', 'gold'];
    memberPlan.forEach((planId, i) => {
      const c = clients[20 + i] || clients[i];
      let band = bandFor(c.sqft); if (band === 'XL') band = 'L';
      const billing = r() < 0.25 && band === 'M' ? 'annual' : 'monthly';
      const start = addDays(T, -Math.floor(10 + r() * 140));
      const visits = PLANS[planId].visits.map(([s, off]) => {
        const due = addDays(start, off);
        return { id: uid('v'), svc: s, due, status: due < T ? (r() < 0.94 ? 'hecha' : 'pendiente') : (r() < 0.3 ? 'agendada' : 'pendiente') };
      });
      const m = { id: 'm' + (i + 1), clientId: c.id, plan: planId, band, billing, price: priceFor(planId, band, billing), start, status: 'activa', visits };
      members.push(m);
      if (billing === 'annual') payments.push({ id: uid('p'), date: start, type: 'membresía', amount: m.price, method: 'Tarjeta (Square)', clientId: c.id, ref: m.id });
      else for (let dd = start; dd <= T; dd = addDays(dd, 30)) payments.push({ id: uid('p'), date: dd, type: 'membresía', amount: m.price, method: 'Tarjeta (Square)', clientId: c.id, ref: m.id });
    });
    // clients[24] (c25) is the first Platinum member; today's fence job is one of their included visits.
    const plat = members.find((m) => m.clientId === 'c25');
    const fenceJob = jobs.find((j) => j.clientId === 'c25' && j.date === T);
    if (plat && fenceJob) {
      const v = plat.visits.find((x) => x.svc === 'fence');
      v.status = 'agendada'; v.due = T; v.jobId = fenceJob.id;
      fenceJob.memberId = plat.id; fenceJob.amount = 0;
    }

    const leadSeed = [
      ['Brenda Collins', 'WhatsApp', 'Orgánico', 'nuevo', ['roof'], 0, [['in', 'Hi! I saw your video on Instagram of the roof wash in Winter Park. How much for a 2-story house?'], ['in', 'Around 2,300 sq ft']]],
      ['Óscar Villalobos', 'WhatsApp', 'Referido', 'nuevo', ['house', 'driveway'], 0, [['in', 'Hola, me dio su número mi vecino Jorge López. Necesito lavar la casa y el driveway.']]],
      ['Megan Price', 'Web', 'Orgánico', 'nuevo', ['paver'], 0, [['in', 'Estimate request from website: paver sealing, approx. 600 sq ft patio.']]],
      ['Frank DeLuca', 'Thumbtack', 'Thumbtack', 'contactado', ['driveway'], 0, [['in', 'Need driveway cleaned before Saturday'], ['out', 'Hi Frank, we can do Friday morning. Driveway + sidewalk is $99.']]],
      ['Tasha Greene', 'Llamada', 'Google', 'contactado', ['house'], 0, []],
      ['Rafael Ortiz', 'Walk-in', 'Orgánico', 'cotizado', ['roof', 'house'], 0, [['out', 'Rafael, como hablamos en la obra de su vecino: techo + casa por $640. ¿Le agendo?']]],
      ['Heather Brooks', 'WhatsApp', 'Google', 'cotizado', ['screen'], 0, [['in', 'Can you clean a pool cage?'], ['out', 'Yes! Pool cage cleaning starts at $400. Can you send a photo?']]],
      ['Greg Simmons', 'Thumbtack', 'Thumbtack', 'cotizado', ['house', 'driveway', 'pool'], 0, []],
      ['Valeria Mejía', 'Web', 'Orgánico', 'ganado', ['house'], 0, []],
      ['Doug Patterson', 'Thumbtack', 'Thumbtack', 'ganado', ['roof'], 0, []],
      ['Cynthia Ward', 'Llamada', 'Referido', 'ganado', ['paver'], 0, []],
      ['Alan Becker', 'Thumbtack', 'Thumbtack', 'perdido', ['driveway'], 0, []],
      ['Monique Fields', 'WhatsApp', 'Orgánico', 'ganado', ['fence', 'driveway'], 0, []],
      ['Pedro Salinas', 'Walk-in', 'Orgánico', 'contactado', ['house'], 0, []],
    ];
    const leads = leadSeed.map(([name, channel, origin, status, services, , msgs], i) => ({
      id: 'l' + (i + 1), name, channel, origin, status, services,
      phone: `(407) ${300 + i * 17}-${2000 + i * 131}`,
      value: services.reduce((s, id) => s + svc(id).price, 0),
      createdAt: addDays(T, -Math.floor(i / 2)), messages: msgs.map(([dir, text], k) => ({ dir, text, at: addDays(T, -Math.floor(i / 2)) + `T${pad(9 + k)}:1${k}` })),
    }));

    const pins = Object.fromEntries(TECHS.map((t) => [t.id, { pin: t.pin, changedAt: null }]));
    return { version: 2, seededAt: T, clients, jobs, payments, expenses, members, leads, pins, reportsSent: {}, events: [] };
  }

  // ---------- persistence ----------
  // Supabase holds one shared row ('main') with the whole demo state. Every device reads it,
  // writes it with an optimistic revision check, and refetches when realtime says it changed.
  // localStorage keeps a copy so pages paint instantly and keep working without signal.
  const ROW = 'main';
  const cfg = window.NMBW_SUPABASE;
  const sb = cfg && window.supabase ? window.supabase.createClient(cfg.url, cfg.anonKey) : null;
  let cache = null, rev = 0;
  const listeners = [];
  const pending = [];
  let flushing = false;

  function setCache(state, r) {
    cache = state; rev = r;
    try { localStorage.setItem(KEY, JSON.stringify({ rev, state })); } catch (e) { /* quota: Supabase still has it */ }
  }
  function load() {
    if (cache) return cache;
    let local = null;
    try { local = JSON.parse(localStorage.getItem(KEY)); } catch (e) { local = null; }
    if (local && local.state && local.state.version === 2) { cache = local.state; rev = local.rev || 0; }
    else { cache = seed(); rev = 0; }
    return cache;
  }
  const notify = () => listeners.forEach((cb) => cb(cache));

  // Shift every date so the seed's "today" is always the real today (the demo is shown on other days).
  function rollDates(s) {
    const T = today();
    if (!s.seededAt || s.seededAt === T) return;
    const days = Math.round((new Date(T + 'T12:00:00') - new Date(s.seededAt + 'T12:00:00')) / 864e5);
    const d = (x) => (x ? addDays(x.slice(0, 10), days) + x.slice(10) : x);
    s.clients.forEach((c) => (c.createdAt = d(c.createdAt)));
    s.jobs.forEach((j) => { j.date = d(j.date); j.completedAt = d(j.completedAt); });
    s.payments.forEach((p) => (p.date = d(p.date)));
    s.expenses.forEach((e) => (e.date = d(e.date)));
    s.members.forEach((m) => { m.start = d(m.start); m.visits.forEach((v) => (v.due = d(v.due))); });
    s.leads.forEach((l) => { l.createdAt = d(l.createdAt); l.messages.forEach((m) => (m.at = d(m.at))); });
    s.reportsSent = Object.fromEntries(Object.entries(s.reportsSent || {}).map(([k, v]) => [d(k), d(v)]));
    s.events.forEach((e) => (e.at = d(e.at)));
    s.seededAt = T;
  }

  async function fetchRow() {
    const { data, error } = await sb.from('demo_state').select('data, rev').eq('id', ROW).maybeSingle();
    if (error) throw error;
    return data;
  }
  async function write(state, baseRev, isNew) {
    if (isNew) { const { error } = await sb.from('demo_state').insert({ id: ROW, data: state, rev: 1 }); return !error; }
    const { data, error } = await sb.from('demo_state')
      .update({ data: state, rev: baseRev + 1, updated_at: new Date().toISOString() })
      .eq('id', ROW).eq('rev', baseRev).select('rev');
    if (error) throw error;
    return data.length === 1;
  }
  // Re-apply queued changes on the freshest row; if someone else wrote in between, try again.
  async function flush() {
    if (!sb || flushing || !pending.length) return;
    flushing = true;
    let batch = [];
    try {
      for (let attempt = 0; pending.length && attempt < 6; attempt++) {
        batch = pending.splice(0);
        const row = await fetchRow();
        const next = JSON.parse(JSON.stringify(row ? row.data : cache));
        batch.forEach((apply) => apply(next));
        const baseRev = row ? row.rev : 0;
        if (await write(next, baseRev, !row)) { setCache(next, baseRev + 1); batch = []; notify(); }
        else pending.unshift(...batch);
      }
    } catch (e) {
      console.warn('Supabase sync failed; will retry', e);
      pending.unshift(...batch);
    }
    flushing = false;
  }

  function update(fn, event) {
    const ev = event ? { id: uid('ev'), at: new Date().toISOString(), ...event } : null;
    const apply = (s) => {
      fn(s);
      if (ev && !s.events.some((x) => x.id === ev.id)) { s.events.unshift(ev); s.events = s.events.slice(0, 40); }
    };
    apply(load());
    setCache(cache, rev);
    if (sb) { pending.push(apply); flush(); }
    return true;
  }
  function reset() {
    const fresh = seed();
    update((s) => { Object.keys(s).forEach((k) => delete s[k]); Object.assign(s, JSON.parse(JSON.stringify(fresh))); });
  }
  function onChange(cb) { listeners.push(cb); }

  async function refresh() {
    if (pending.length || flushing) return;
    const row = await fetchRow();
    if (row && row.rev > rev) { setCache(row.data, row.rev); notify(); }
  }

  let readyPromise = null;
  function ready() {
    if (readyPromise) return readyPromise;
    readyPromise = (async () => {
      load();
      if (!sb) return cache;
      try {
        const row = await fetchRow();
        if (row) setCache(row.data, row.rev);
        else { setCache(seed(), 0); pending.push(() => {}); await flush(); }
        if (cache.seededAt !== today()) update(rollDates);
        sb.channel('demo_state')
          .on('postgres_changes', { event: '*', schema: 'public', table: 'demo_state' }, (p) => {
            if (!(p.new && p.new.rev <= rev)) refresh().catch(() => {});
          })
          .subscribe();
        window.addEventListener('online', () => { flush(); refresh().catch(() => {}); });
      } catch (e) {
        console.warn('Supabase unavailable; using the local copy', e);
      }
      return cache;
    })();
    return readyPromise;
  }

  // Compress a camera photo and store it in the demo-photos bucket (inline copy if the upload fails).
  async function uploadPhoto(file) {
    const dataUrl = await compressImage(file);
    if (!sb) return dataUrl;
    try {
      const blob = await (await fetch(dataUrl)).blob();
      const path = `${today()}/${uid('ph')}.jpg`;
      const { error } = await sb.storage.from('demo-photos').upload(path, blob, { contentType: 'image/jpeg' });
      if (error) throw error;
      return sb.storage.from('demo-photos').getPublicUrl(path).data.publicUrl;
    } catch (e) {
      console.warn('Photo upload failed; keeping it inline', e);
      return dataUrl;
    }
  }

  // Shrink a camera photo before storing it.
  function compressImage(file, max = 720) {
    return new Promise((resolve, reject) => {
      const img = new Image();
      img.onload = () => {
        const k = Math.min(1, max / Math.max(img.width, img.height));
        const cv = document.createElement('canvas');
        cv.width = Math.round(img.width * k); cv.height = Math.round(img.height * k);
        cv.getContext('2d').drawImage(img, 0, 0, cv.width, cv.height);
        URL.revokeObjectURL(img.src);
        resolve(cv.toDataURL('image/jpeg', 0.68));
      };
      img.onerror = reject;
      img.src = URL.createObjectURL(file);
    });
  }

  window.DB = {
    SERVICES, PLANS, BANDS, TECHS, USERS, PAY_METHODS,
    load, ready, update, reset, onChange, uploadPhoto, online: () => !!sb,
    helpers: { iso, today, addDays, uid, usd, svc, tech, bandFor, priceFor, lookupAddress, photoSrc, fmtDate, esc, compressImage, techPin, pinChangedAt },
  };
})();
