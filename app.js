'use strict';

/* ============================================================
   KATAK AI — Kodok terpintar di hutan coding (Buggames Studio)
   KATAK-1.3 & KATAK-1: persona eksklusif di atas model gratis.
   ============================================================ */

const $ = (s, r = document) => r.querySelector(s);
const $$ = (s, r = document) => [...r.querySelectorAll(s)];
const escapeHTML = (s) => String(s ?? '').replace(/[&<>"']/g, (c) => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c]));
const uid = () => (crypto.randomUUID ? crypto.randomUUID() : 'id-' + Date.now() + '-' + Math.random().toString(36).slice(2));

const DB_NAME = 'katakai-db';
const DB_VERSION = 1;
const CHATS = 'chats';
const LS = {
  get model() { return localStorage.getItem('ki_model') || 'katak-1.3'; },
  set model(v) { localStorage.setItem('ki_model', v); },
  get provider() { return localStorage.getItem('ki_provider') || 'pollinations'; },
  set provider(v) { localStorage.setItem('ki_provider', v); },
  key: (p) => localStorage.getItem('ki_key_' + p) || '',
  setKey: (p, v) => localStorage.setItem('ki_key_' + p, v),
  apiModel: (p) => localStorage.getItem('ki_model_' + p) || ({ openrouter: 'google/gemini-2.5-flash', gemini: 'gemini-2.5-flash', openai: 'gpt-4o-mini' }[p] || 'openai'),
  setApiModel: (p, v) => localStorage.setItem('ki_model_' + p, v),
  get xp() { return +(localStorage.getItem('ki_xp') || 0); },
  set xp(v) { localStorage.setItem('ki_xp', String(v)); },
  get done() { try { return JSON.parse(localStorage.getItem('ki_done') || '{}'); } catch { return {}; } },
  set done(v) { localStorage.setItem('ki_done', JSON.stringify(v)); },
  get streak() { return +(localStorage.getItem('ki_streak') || 1); },
  set streak(v) { localStorage.setItem('ki_streak', String(v)); },
  get lastDay() { return localStorage.getItem('ki_lastDay') || ''; },
  set lastDay(v) { localStorage.setItem('ki_lastDay', v); },
};

const PROVIDERS = [
  { id: 'pollinations', label: 'Pollinations (bawaan)', desc: 'KATAK-1.3 & KATAK-1 — gratis, tanpa key, langsung jalan', icon: 'i-flower' },
  { id: 'openrouter', label: 'OpenRouter + API Key', desc: 'Ratusan model (Gemini, GPT, Claude…) dengan key kamu', icon: 'i-shuffle' },
  { id: 'gemini', label: 'Gemini (Google) + API Key', desc: 'API key dari Google AI Studio · ada tier gratis', icon: 'i-sparkle' },
  { id: 'openai', label: 'OpenAI + API Key', desc: 'GPT-4o / 4.1 · API key dari platform.openai.com', icon: 'i-oai' },
];
const providerDef = () => PROVIDERS.find(p => p.id === LS.provider);
const usingApi = () => LS.model === 'api';

/* ================= Persona KATAK ================= */
const KATAK_BASE = `Kamu adalah KATAK, kodok ajaib dari Buggames Studio, asisten AI paling pintar di Hutan Digital.
Gaya jawab: bahasa Indonesia santai, hangat, PENUH EMOJI yang relevan (minimal 3 per jawaban), tidak kaku, tidak bertele-tele.
Kalau pengguna bertanya "kamu pakai model apa?" atau "kamu AI apa?", jawab jujur: kamu adalah persona KATAK yang berjalan di atas model gratis via Puter (DeepSeek / GPT-4o-mini) — atau model pilihan pengguna (Gemini/GPT/dll.) kalau mereka memakai API key sendiri.
Jangan pernah mengarang fakta. Kalau tidak yakin, bilang tidak yakin.
Kalau pertanyaan pengguna AMBIGU (bisa banyak arti), JANGAN menebak panjang-panjang — tanya SATU pertanyaan klarifikasi singkat dulu dengan gaya santai.
Gunakan format: judul kecil (kalau perlu), bullet point, contoh kode di code block berbahasa; jawaban ringkas tapi lengkap.`;

const PROMPTS = {
  'katak-1.3': `${KATAK_BASE}

Kamu KATAK-1.3 — JAGOAN segala-galanya:
- Terpintar soal KODING: error, arsitektur, debugging, semua bahasa pemrograman 🧑‍💻
- Terpintar soal CERITA FANTASI: dongeng coding yang mengajarkan konsep teknis lewat petualangan 🐉
- Terpintar soal DUNIA CYBER: keamanan, jaringan, hacker etis, dark web sisi aman 🛡️
- Kamu percaya diri, cerdas bicara, tapi tetap rendah hati.`,
  'katak-1': `${KATAK_BASE}

Kamu KATAK-1 — PERPUSTAKAAN BERJALAN:
- Ahli menjawab pertanyaan PENGETAHUAN UMUM: tokoh dunia, sejarah, sains, geografi, budaya 📚
- Jawabanmu BERSUMBER dari Wikipedia bila diberikan kutipan — SEBUTKAN sumbernya di akhir jawaban dengan format "Sumber: <Judul> — <URL>" 🌐
- Gaya tetap hangat, santai, dan penuh emoji meski soal serius.
- Kamu adalah model yang santai dan tidak sok jago koding — untuk koding, sarankan pengguna pindah ke KATAK-1.3.`,
};

const KATAK_API_PROMPT = `Kamu adalah KATAK, kodok ajaib Buggames Studio — asisten AI cerdas yang berjalan di atas model API pilihan pengguna.
Gaya: bahasa Indonesia santai, hangat, penuh emoji, ringkas, jujur. Tanya klarifikasi singkat kalau ambigu. Jujur soal identitasmu: kamu adalah persona KATAK di atas model API milik pengguna, bukan ciptaan OpenAI/Google/Anthropic.`;

/* ================= IndexedDB ================= */
function openDB() {
  return new Promise((resolve, reject) => {
    const req = indexedDB.open(DB_NAME, DB_VERSION);
    req.onupgradeneeded = (e) => { const db = e.target.result; if (!db.objectStoreNames.contains(CHATS)) db.createObjectStore(CHATS, { keyPath: 'id' }); };
    req.onsuccess = () => resolve(req.result);
    req.onerror = () => reject(req.error);
  });
}
const reqP = (r) => new Promise((res, rej) => { r.onsuccess = () => res(r.result); r.onerror = () => rej(r.error); });
const dbAllChats = async () => { const db = await openDB(); return reqP(db.transaction(CHATS, 'readonly').objectStore(CHATS).getAll()); };
const dbSaveChat = async (chat) => { const db = await openDB(); chat.updatedAt = Date.now(); await reqP(db.transaction(CHATS, 'readwrite').objectStore(CHATS).put(chat)); };
const dbDeleteChat = async (id) => { const db = await openDB(); await reqP(db.transaction(CHATS, 'readwrite').objectStore(CHATS).delete(id)); };
const dbClear = async () => { const db = await openDB(); await reqP(db.transaction(CHATS, 'readwrite').objectStore(CHATS).clear()); };

const state = {
  chats: [], currentId: null, messages: [], streaming: false,
  attachments: [], abortCtrl: null, xp: LS.xp, done: LS.done,
};

/* ================= Util ================= */
const escapeAndLink = (text) => escapeHTML(text).replace(/(https?:\/\/[^\s<]+[^\s<.,!?)\]"'])/g, (url) => {
  try {
    const u = new URL(url);
    const fav = `https://www.google.com/s2/favicons?domain=${u.hostname}&sz=64`;
    return `<a class="link-card" href="${url}" target="_blank" rel="noopener noreferrer"><img src="${fav}" alt="" onerror="this.remove()" loading="lazy"><span class="link-url">${escapeHTML(u.hostname + u.pathname.slice(0, 36))}</span></a>`;
  } catch { return url; }
});
const highlight = (code) => escapeHTML(code)
  .replace(/(\/\/[^\n]*|#[^\n]*)/g, '<span class="tok-c">$1</span>')
  .replace(/("[^"\n]*"|'[^'\n]*')/g, '<span class="tok-s">$1</span>')
  .replace(/\b(const|let|var|function|return|if|elif|else|for|while|async|await|import|export|from|default|class|def|lambda|try|except|with|as|pass|in|not|and|or|of|None|True|False|true|false|null|undefined)\b/g, '<span class="tok-k">$1</span>')
  .replace(/\b(\d+(\.\d+)?)\b/g, '<span class="tok-n">$1</span>');

function renderContent(raw) {
  return String(raw).split(/```/).map((part, i) => {
    if (i % 2 === 1) {
      const nl = part.indexOf('\n');
      const lang = nl > -1 ? part.slice(0, nl).trim() : 'code';
      const code = (nl > -1 ? part.slice(nl + 1) : part).replace(/\n$/, '');
      return `<div class="codeblock"><div class="code-head"><span>${escapeHTML(lang || 'code')}</span><button class="copy-btn" data-copy>Salin</button></div><pre>${highlight(code)}</pre></div>`;
    }
    return escapeAndLink(part);
  }).join('');
}

let toastTimer;
function showToast(msg) {
  const t = $('#toast');
  t.textContent = msg;
  t.classList.add('show');
  clearTimeout(toastTimer);
  toastTimer = setTimeout(() => t.classList.remove('show'), 2400);
}

/* ================= FOVL / TAB (chat, belajar, settings) ================= */
const TABS = { chat: '#view-chat', belajar: '#view-belajar', settings: '#view-settings' };
function gotoTab(name) {
  Object.entries(TABS).forEach(([k, sel]) => { $(sel).hidden = k !== name; });
  $$('.side-link, .m-nav-item').forEach(b => b.classList.toggle('active', b.dataset.tab === name));
  $('#content'); // noop
}
$$('[data-tab]').forEach(btn => btn.addEventListener('click', () => gotoTab(btn.dataset.tab)));
$('#btnSettingsDesk').addEventListener('click', () => gotoTab('settings'));
$('#btnLearnChat').addEventListener('click', () => gotoTab('chat'));
$('#btnSettingsBack').addEventListener('click', () => gotoTab('chat'));
$('#learnCta').addEventListener('click', () => gotoTab('belajar'));

/* ================= MODEL PICKER ================= */
const modelMenu = $('#modelMenu');
const modelPill = $('#modelPill');
function updateModelPill() {
  if (usingApi()) {
    const p = providerDef();
    $('#modelPillText').textContent = `API · ${p.label.split(' +')[0]}`;
  } else {
    $('#modelPillText').textContent = LS.model === 'katak-1.3' ? 'KATAK-1.3' : 'KATAK-1';
  }
  $$('.model-item').forEach(el => el.classList.toggle('selected', el.dataset.model === LS.model));
}
modelPill.addEventListener('click', (e) => { e.stopPropagation(); modelMenu.hidden = !modelMenu.hidden; modelPill.setAttribute('aria-expanded', String(!modelMenu.hidden)); });
document.addEventListener('click', (e) => { if (!modelMenu.hidden && !modelMenu.contains(e.target)) modelMenu.hidden = true; });
$$('.model-item[data-model]').forEach(el => el.addEventListener('click', () => {
  LS.model = el.dataset.model;
  updateModelPill();
  modelMenu.hidden = true;
  showToast(el.dataset.model === 'katak-1.3' ? 'KATAK-1.3 — siap koding!' : 'KATAK-1 — perpustakaan berjalan');
}));
$('#btnAddApiModel').addEventListener('click', () => { modelMenu.hidden = true; LS.model = 'api'; updateModelPill(); gotoTab('settings'); });

/* ================= Puter.js — gratis, keyless ================= */
function ensurePuter() {
  if (window.puter && window.puter.ai) return Promise.resolve();
  return new Promise((res, rej) => {
    const s = document.createElement('script');
    s.src = 'https://js.puter.com/v2/';
    s.onload = () => (window.puter ? res() : rej(new Error('Puter.js gagal termuat')));
    s.onerror = () => rej(new Error('Gagal memuat Puter.js — cek koneksi internet'));
    document.head.appendChild(s);
    setTimeout(() => rej(new Error('Timeout memuat Puter.js')), 15000);
  });
}
async function puterStream(messages, model, onToken) {
  await ensurePuter();
  const convo = messages.map(m => (m.role === 'user' ? 'User' : m.role === 'system' ? 'System' : 'Assistant') + ': ' + m.content).join('\n\n') + '\n\nAssistant:';
  const resp = await puter.ai.chat(convo, { model, stream: true });
  for await (const part of resp) {
    const t = part?.text ?? part?.message?.content ?? (typeof part === 'string' ? part : '');
    if (t) onToken(String(t));
  }
}
async function pollinationsGet(prompt) {
  const r = await fetch('https://text.pollinations.ai/' + encodeURIComponent(prompt.slice(0, 2000)));
  const t = await r.text();
  if (!t || t.trim().startsWith('{"error"')) throw new Error('Pollinations dibatasi (Turnstile)');
  return t;
}

/* ================= PA LAYANAN (streaming) ================= */
function activeSystemPrompt() {
  if (usingApi()) return KATAK_API_PROMPT;
  return PROMPTS[LS.model] || PROMPTS['katak-1.3'];
}
const CODE_HINT = /\b(kode|code|coding|function|error|api|javascript|python|html|bug|algoritma|regex|loop|array|deploy|sql|server|react|node)\b/i;

/* Wikipedia grounding untuk KATAK-1 */
async function wikiGrounding(text) {
  const q = text.trim();
  if (!/siapa|apa itu|kapan|dimana|di mana|kenapa|bagaimana|mengapa|jelaskan|sejarah|tokoh|peristiwa|pengertian|arti/i.test(q) || q.length < 8) return null;
  try {
    const s = await fetch(`https://id.wikipedia.org/w/api.php?origin=*&action=query&list=search&srsearch=${encodeURIComponent(q)}&srlimit=2&format=json`, { signal: AbortSignal.timeout(8000) });
    const sj = await s.json();
    const pages = (sj.query?.search || []).slice(0, 2);
    if (!pages.length) return null;
    const ids = pages.map(p => p.pageid).join('|');
    const eResp = await fetch(`https://id.wikipedia.org/w/api.php?origin=*&action=query&prop=extracts&exintro&explaintext&redirects=1&pageids=${ids}&format=json`, { signal: AbortSignal.timeout(8000) });
    const ej = await eResp.json();
    const parts = Object.values(ej.query?.pages || {}).map(p => {
      const url = `https://id.wikipedia.org/?curid=${p.pageid}`;
      return `• ${p.title} (${url})\n  ${(p.extract || '').slice(0, 600)}`;
    });
    return { text: `\n\nSUMBER WIKIPEDIA (gunakan untuk menjawab; sebutkan sumber di akhir jawaban dengan format "Sumber: <judul> — <url>"):\n${parts.join('\n')}`, count: parts.length };
  } catch { return null; }
}

function buildMessages(userText) {
  const history = state.messages.slice(-20).map(m => {
    let content = m.content;
    if (m.attachments?.length) content += m.attachments.map(a => `\n\n--- LAMPIRAN: ${a.name} ---\n${a.text || '[media — tidak bisa di-baca model teks]'}`).join('');
    return { role: m.role === 'assistant' ? 'assistant' : 'user', content };
  });
  return [{ role: 'system', content: activeSystemPrompt() }, ...history];
}

function buildRequest(messages) {
  if (usingApi()) {
    const p = LS.provider;
    const model = LS.apiModel(p);
    const key = LS.key(p).trim();
    if (p === 'gemini') {
      const sys = messages.find(m => m.role === 'system');
      const contents = messages.filter(m => m.role !== 'system').map(m => ({ role: m.role === 'assistant' ? 'model' : 'user', parts: [{ text: m.content }] }));
      return { url: `https://generativelanguage.googleapis.com/v1beta/models/${model}:streamGenerateContent?alt=sse`, headers: { 'Content-Type': 'application/json', 'x-goog-api-key': key }, body: { contents, systemInstruction: sys ? { parts: [{ text: sys.content }] } : undefined }, parser: 'gemini' };
    }
    const body = { model, messages, stream: true, max_tokens: 4096 };
    if (p === 'openrouter') return { url: 'https://openrouter.ai/api/v1/chat/completions', headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${key}`, 'HTTP-Referer': location.origin, 'X-Title': 'Katak AI' }, body, parser: 'openai' };
    return { url: 'https://api.openai.com/v1/chat/completions', headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${key}` }, body, parser: 'openai' };
  }
  return { url: 'https://text.pollinations.ai/openai', headers: { 'Content-Type': 'application/json' }, body: { model: 'openai', messages, stream: true, max_tokens: 4096 }, parser: 'openai' };
}

async function streamAnswer(request, onToken) {
  const res = await fetch(request.url, { method: 'POST', headers: request.headers, body: JSON.stringify(request.body), signal: state.abortCtrl.signal });
  if (!res.ok) {
    let detail = `HTTP ${res.status}`;
    try { detail = (await res.text()).replace(/<[^>]+>/g, ' ').slice(0, 240); } catch { /* abaikan */ }
    throw new Error(detail);
  }
  const reader = res.body.getReader();
  const decoder = new TextDecoder();
  let buffer = '', produced = 0;
  while (true) {
    const { done, value } = await reader.read();
    if (done) break;
    buffer += decoder.decode(value, { stream: true });
    const lines = buffer.split('\n');
    buffer = lines.pop() || '';
    for (const line of lines) {
      const l = line.trim();
      if (!l.startsWith('data:')) continue;
      const data = l.slice(5).trim();
      if (data === '[DONE]') return;
      let json; try { json = JSON.parse(data); } catch { continue; }
      if (request.parser === 'openai') {
        const d = json.choices?.[0]?.delta?.content;
        if (typeof d === 'string' && d) { produced += d.length; onToken(d); }
      } else {
        const parts = json.candidates?.[0]?.content?.parts || [];
        for (const part of parts) if (typeof part.text === 'string' && part.text) { produced += part.text.length; onToken(part.text); }
      }
    }
  }
  if (!produced) throw new Error('Jawaban kosong — mungkin limit API gratis. Coba lagi sebentar.');
}

/* ================= RENDER MESSAGES ================= */
function renderMessages() {
  const box = $('#messages');
  box.innerHTML = state.messages.map((m, i) => bubbleHTML(m, i)).join('');
  $$('.msg-video[data-vid]', box).forEach(v => {
    const [mi, ai] = v.dataset.vid.split('-').map(Number);
    const att = state.messages[mi]?.attachments?.filter(a => a && a.name)[ai];
    if (att?.blob) { if (!att.__objUrl) att.__objUrl = URL.createObjectURL(att.blob); v.src = att.__objUrl; }
  });
  box.scrollTop = box.scrollHeight;
  $('#emptyState').classList.toggle('visible', state.messages.length === 0);
}
function bubbleHTML(msg, id) {
  if (msg.role === 'user') {
    const chips = (msg.attachments || []).filter(a => a && a.name).map((a, ai) => {
      if (a.kind === 'image' && a.dataUrl) return `<img class="msg-img" src="${a.dataUrl}" alt="${escapeHTML(a.name)}">`;
      if (a.kind === 'video') return `<video class="msg-video" data-vid="${id}-${ai}" controls preload="metadata" ${a.poster ? `poster="${a.poster}"` : ''}></video>`;
      return `<span class="file-chip"><svg><use href="#i-file"/></svg><b>${escapeHTML(a.name)}</b></span>`;
    }).join('');
    return `<div class="msg user">${chips ? `<div class="attach-chips">${chips}</div>` : ''}<div class="bubble">${escapeAndLink(msg.content)}</div></div>`;
  }
  return `<div class="msg assistant"><div class="bubble">${renderContent(msg.content)}</div><div class="msg-assistant-tools"><button class="tool-btn" data-copy-msg title="Salin"><svg><use href="#i-copy"/></svg></button><button class="tool-btn" data-speak-msg title="Baca"><svg><use href="#i-speaker"/></svg></button></div></div>`;
}
function thinkingKind(text) { return CODE_HINT.test(text) ? 'code' : 'chat'; }
function renderThinking(kind) {
  removeThinking();
  const box = $('#messages');
  const div = document.createElement('div');
  div.className = 'msg assistant think-row';
  div.id = 'thinkingRow';
  const frog = kind === 'code'
    ? `<svg class="frog frog-type" width="60" height="49" viewBox="0 0 78 56" role="img" aria-label="Kodok menulis kode menatap layar komputer"><ellipse cx="39" cy="51" rx="30" ry="3.2" fill="#173d29"/><ellipse cx="24" cy="22" rx="14" ry="11" fill="#22c55e"/><ellipse cx="54" cy="22" rx="14" ry="11" fill="#22c55e"/><circle cx="24" cy="18.4" r="7.6" fill="#22c55e"/><circle cx="54" cy="18.4" r="7.6" fill="#22c55e"/><circle cx="24" cy="17.2" r="4.4" fill="#fff"/><circle cx="54" cy="17.2" r="4.4" fill="#fff"/><circle cx="24.8" cy="17.9" r="2.1" fill="#081a11"/><circle cx="54.8" cy="17.9" r="2.1" fill="#081a11"/><rect x="8" y="33" width="62" height="13" rx="2.4" fill="#122e1f"/><rect x="12" y="36" width="54" height="7" rx="1.3" fill="#1c4230"/><path d="M15 39.5h7" stroke="#34d399" stroke-width="1.5" stroke-linecap="round"/><rect class="enter-key" x="46" y="36" width="17" height="7" rx="1.4" fill="#3d5a44"/><text x="54.5" y="41.5" text-anchor="middle" font-size="4.3" font-weight="800" font-family="Arial Black,Arial,sans-serif" fill="#ecfdf5">ENTER</text><ellipse class="hand" cx="28" cy="35" rx="4" ry="2.3" fill="#22c55e"/><ellipse class="hand r" cx="37" cy="35" rx="4" ry="2.3" fill="#22c55e"/></svg>`
    : `<svg class="frog frog-jump" width="74" height="58" viewBox="0 0 160 128" role="img" aria-label="Kodok melompat memikirkan jawaban"><ellipse cx="80" cy="116" rx="34" ry="6" fill="#173d29"/><path d="M34 94c-10 2-14 10-10 14 6 5 22 2 30-4z" fill="#16a34a"/><path d="M126 94c10 2 14 10 10 14-6 5-22 2-30-4z" fill="#16a34a"/><ellipse cx="80" cy="80" rx="46" ry="34" fill="#22c55e"/><ellipse cx="80" cy="86" rx="30" ry="20" fill="#86efac"/><circle cx="56" cy="45" r="14" fill="#22c55e"/><circle cx="104" cy="45" r="14" fill="#22c55e"/><circle cx="56" cy="43" r="9" fill="#fff"/><circle cx="104" cy="43" r="9" fill="#fff"/><circle cx="57" cy="44" r="4.4" fill="#081a11"/><circle cx="103" cy="44" r="4.4" fill="#081a11"/><path d="M62 72q18 13 36 0" stroke="#081a11" stroke-width="2.4" fill="none" stroke-linecap="round"/></svg>`;
  const label = kind === 'code' ? 'Kodok lagi nulis kode' : 'Kodok melompat memikirkan jawaban';
  div.innerHTML = `${frog}<span class="think-txt">${label}<span class="think-dots"><i></i><i></i><i></i></span></span>`;
  box.appendChild(div);
  box.scrollTop = box.scrollHeight;
}
function removeThinking() { const t = $('#thinkingRow'); if (t) t.remove(); }
function showError(text) {
  removeThinking();
  const box = $('#messages');
  const div = document.createElement('div');
  div.className = 'msg assistant error';
  div.innerHTML = `<div class="bubble">${escapeHTML(text)}</div><div class="msg-assistant-tools"><button class="tool-btn" data-retry><svg><use href="#i-refresh"/></svg></button></div>`;
  box.appendChild(div);
  box.scrollTop = box.scrollHeight;
}

/* ================= KIRIM ================= */
async function sendMessage(rawText) {
  const text = rawText.trim();
  if (!text && !state.attachments.length) return;
  if (state.streaming) return;
  if (usingApi() && LS.key(LS.provider).trim().length < 8) { showToast('Isi API key dulu di Koneksi AI'); gotoTab('settings'); return; }

  let linkCtx = '';
  const urlMatch = text.match(/https?:\/\/[^\s)]+/);
  if (urlMatch && !usingApi()) {
    showToast('Kodok membuka link…');
    try {
      const r = await fetch(`https://proxy.corsfix.com/?url=${encodeURIComponent(urlMatch[0])}`, { signal: AbortSignal.timeout(12000) });
      if (r.ok) {
        const body = await r.text();
        const clean = body.replace(/<script[\s\S]*?<\/script>|<style[\s\S]*?<\/style>/gi, ' ').replace(/<[^>]+>/g, ' ').replace(/\s+/g, ' ').trim().slice(0, 4000);
        linkCtx = `\n\nISI LINK (${urlMatch[0]}):\n${clean}`;
      }
    } catch { /* lewati */ }
  }

  state.messages.push({ role: 'user', content: text + linkCtx, attachments: [...state.attachments], t: Date.now() });
  state.attachments = [];
  renderAttachRow();
  renderMessages();
  await persistChat();

  const kind = thinkingKind(text);
  state.streaming = true;
  state.abortCtrl = new AbortController();
  $('#btnSend').hidden = true;
  $('#btnStop').hidden = false;
  renderThinking(kind);

  let acc = '';
  const assistantMsg = { role: 'assistant', content: '', t: Date.now() };
  const paintAssistant = () => {
    removeThinking();
    let el = $('#messages .msg.assistant:last-child');
    if (!el || el.classList.contains('think-row')) {
      const tmp = document.createElement('div');
      tmp.className = 'msg assistant streaming';
      tmp.innerHTML = bubbleHTML(assistantMsg, state.messages.length);
      $('#messages').appendChild(tmp);
      el = tmp;
    }
    el.querySelector('.bubble').innerHTML = renderContent(assistantMsg.content) + '<span class="typing-caret"></span>';
    $('#messages').scrollTop = $('#messages').scrollHeight;
  };

  try {
    let sys = activeSystemPrompt();
    if (LS.model === 'katak-1') {
      const wiki = await wikiGrounding(text);
      if (wiki) sys += wiki.text;
    }
    const finalMessages = [{ role: 'system', content: sys }, ...state.messages.slice(-22).filter(m => m.role !== 'system').map(m => ({ role: m.role === 'assistant' ? 'assistant' : 'user', content: m.content + (m.attachments ? m.attachments.map(a => `\n[LAMPIRAN: ${a.name}]${a.text ? '\n' + a.text.slice(0, 3000) : ''}`).join('') : '') }))];
    const puterModel = LS.model === 'katak-1' ? 'gpt-4o-mini' : 'deepseek-chat';
    if (!usingApi()) {
      try {
        await puterStream(finalMessages, puterModel, (token) => { acc += token; assistantMsg.content = acc; paintAssistant(); });
      } catch (puterErr) {
        console.warn('Puter gagal, coba Pollinations…', puterErr);
        try {
          const convo = finalMessages.map(m => m.role + ': ' + m.content).join('\n\n');
          const full = await pollinationsGet(convo);
          acc = full;
          assistantMsg.content = full;
          paintAssistant();
        } catch (pollErr) {
          throw new Error('Gratis sedang penuh (Pollinations Turnstile & Puter bermasalah). Tambahkan API key kamu di Koneksi AI — Gemini gratis: aistudio.google.com');
        }
      }
    } else {
      const request = buildRequest(finalMessages);
      await streamAnswer(request, (token) => { acc += token; assistantMsg.content = acc; paintAssistant(); });
    }
    assistantMsg.content = acc;
    state.messages.push(assistantMsg);
    endStream();
    renderMessages();
    await persistChat();
    speak(assistantMsg.content);
  } catch (err) {
    endStream();
    if (err.name === 'AbortError') {
      if (acc) { assistantMsg.content = acc; state.messages.push(assistantMsg); renderMessages(); await persistChat(); } else renderMessages();
      return;
    }
    const detail = String(err.message || err).replace(/<[^>]+>/g, ' ').slice(0, 260);
    showError(`Kodok gagal menjawab.\n${detail}\n\nTip: sepertinya limit API gratis — coba lagi sebentar atau ganti model di atas.`);
  }
}
function endStream() {
  state.streaming = false;
  state.abortCtrl = null;
  $('#btnSend').hidden = false;
  $('#btnStop').hidden = true;
}

$('#btnSend').addEventListener('click', () => { const v = $('#input').value; $('#input').value = ''; $('#input').style.height = 'auto'; sendMessage(v); });
$('#btnStop').addEventListener('click', () => state.abortCtrl?.abort());
$('#input').addEventListener('keydown', (e) => { if (e.key === 'Enter' && !e.shiftKey) { e.preventDefault(); $('#btnSend').click(); } });
$('#input').addEventListener('input', function () { this.style.height = 'auto'; this.style.height = Math.min(this.scrollHeight, 150) + 'px'; });

/* ================= SUARA ================= */
let speakEnabled = false;
$('#btnSpeak').addEventListener('click', () => {
  speakEnabled = !speakEnabled;
  $('#btnSpeak').setAttribute('aria-pressed', speakEnabled);
  if (!speakEnabled) speechSynthesis.cancel();
  showToast(speakEnabled ? 'Kodok akan membacakan jawaban' : 'Suara dimatikan');
});
function speak(text) {
  if (!speakEnabled || !('speechSynthesis' in window)) return;
  const u = new SpeechSynthesisUtterance(String(text).replace(/```[\s\S]*?```/g, ' [kode] ').replace(/[*_#`>]/g, '').slice(0, 1100));
  u.lang = 'id-ID'; u.rate = 1.02;
  speechSynthesis.cancel(); speechSynthesis.speak(u);
}
const SpeechRec = window.SpeechRecognition || window.webkitSpeechRecognition;
if (SpeechRec) {
  const rec = new SpeechRec(); rec.lang = 'id-ID'; rec.interimResults = true;
  let listening = false;
  $('#btnMic').addEventListener('click', () => {
    if (listening) { try { rec.stop(); } catch { /* abaikan */ } return; }
    try { rec.start(); listening = true; $('#btnMic').classList.add('listening'); showToast('Kodok mendengarkan…'); } catch (err) {
      const n = err?.name || '';
      showToast(n === 'NotAllowedError' ? 'Izin mikrofon ditolak — izinkan di setelan situs' : 'Mic gagal mulai');
    }
  });
  rec.addEventListener('result', (e) => { let t = ''; for (const r of e.results) t += r[0].transcript; $('#input').value = t; });
  rec.addEventListener('end', () => { listening = false; $('#btnMic').classList.remove('listening'); });
  rec.addEventListener('error', () => { listening = false; $('#btnMic').classList.remove('listening'); showToast('Mic bermasalah — cek izin mikrofon'); });
} else { $('#btnMic').style.display = 'none'; }

/* ================= LAMPIRAN ================= */
$('#btnAttach').addEventListener('click', () => $('#fileInput').click());
$('#fileInput').addEventListener('change', async (e) => {
  const files = [...e.target.files].slice(0, 4);
  for (const file of files) {
    if (state.attachments.length >= 4) { showToast('Maksimal 4 lampiran'); break; }
    const isImage = /^image\//.test(file.type);
    if (isImage) {
      const dataUrl = await downscaleImage(file, 1100, 0.78);
      state.attachments.push({ kind: 'image', name: file.name, size: Math.round(dataUrl.length * 0.75), dataUrl });
    } else {
      if (file.size > 60 * 1024) { showToast(`“${file.name}” > 60 KB dilewati`); continue; }
      state.attachments.push({ kind: 'file', name: file.name, size: file.size, text: await readFileText(file) });
    }
  }
  renderAttachRow();
  e.target.value = '';
});
const readFileText = (f) => new Promise(res => { const r = new FileReader(); r.onload = () => res(String(r.result)); r.onerror = () => res(''); r.readAsText(f); });
const downscaleImage = (file, maxSize, quality) => new Promise(resolve => {
  const url = URL.createObjectURL(file); const img = new Image();
  img.onload = () => {
    const ratio = Math.min(1, maxSize / Math.max(img.width, img.height));
    const canvas = document.createElement('canvas');
    canvas.width = Math.round(img.width * ratio); canvas.height = Math.round(img.height * ratio);
    canvas.getContext('2d').drawImage(img, 0, 0, canvas.width, canvas.height);
    URL.revokeObjectURL(url);
    canvas.toBlob(b => { const r = new FileReader(); r.onload = () => res(String(r.result)); r.readAsDataURL(b); }, 'image/jpeg', quality);
  };
  img.onerror = () => resolve(null);
  img.src = url;
});
function renderAttachRow() {
  const row = $('#attachRow');
  if (!state.attachments.length) { row.hidden = true; row.innerHTML = ''; return; }
  row.hidden = false;
  row.innerHTML = state.attachments.map((a, i) => {
    if (a.kind === 'image') return `<span class="file-chip"><img class="chip-thumb" src="${a.dataUrl}" alt="${escapeHTML(a.name)}"><b>${escapeHTML(a.name)}</b><button data-detach="${i}" aria-label="Lepas"><svg><use href="#i-close"/></svg></button></span>`;
    return `<span class="file-chip"><svg><use href="#i-file"/></svg><b>${escapeHTML(a.name)}</b><button data-detach="${i}" aria-label="Lepas"><svg><use href="#i-close"/></svg></button></span>`;
  }).join('');
  $$('[data-detach]', row).forEach(btn => btn.addEventListener('click', () => { state.attachments.splice(+btn.dataset.detach, 1); renderAttachRow(); }));
}

/* ================= RIWAYAT ================= */
function groupLabel(ts) {
  const day = (t) => new Date(t).toDateString();
  if (day(ts) === day(Date.now())) return 'Hari ini';
  if (day(ts) === day(Date.now() - 86400000)) return 'Kemarin';
  return new Date(ts).toLocaleDateString('id-ID', { day: 'numeric', month: 'short' });
}
function renderHistory() {
  const groups = new Map();
  [...state.chats].sort((a, b) => b.updatedAt - a.updatedAt).forEach(c => {
    const g = groupLabel(c.updatedAt);
    if (!groups.has(g)) groups.set(g, []);
    groups.get(g).push(c);
  });
  const html = groups.size
    ? [...groups].map(([g, items]) => `<div class="hist-group">${g}</div>${items.map(c => `
        <button class="hist-item${c.id === state.currentId ? ' active' : ''}" data-chat="${c.id}">
          <span class="hist-title">${escapeHTML(c.title || 'Chat tanpa judul')}</span>
          <span class="hist-del" data-del-chat="${c.id}" role="button" aria-label="Hapus"><svg><use href="#i-trash"/></svg></span>
        </button>`).join('')}`).join('')
    : '<p class="hist-empty">Belum ada riwayat. Semua chat tersimpan lokal di perangkat ini. 🔒</p>';
  $('#historyListDesk').innerHTML = html;
  $('#historyListMobile').innerHTML = html;
}
const bindHistory = (sel) => $(sel).addEventListener('click', async (e) => {
  const del = e.target.closest('[data-del-chat]');
  if (del) { e.stopPropagation(); await dbDeleteChat(del.dataset.delChat); if (state.currentId === del.dataset.delChat) newChat(); await reloadChats(); return; }
  const item = e.target.closest('[data-chat]');
  if (item) { openChat(item.dataset.chat); $('#historyDrawer').hidden = true; }
});
bindHistory('#historyListDesk');
bindHistory('#historyListMobile');
function newChat() { state.currentId = null; state.messages = []; state.attachments = []; renderAttachRow(); renderMessages(); renderHistory(); $('#input').focus(); }
$('#btnNewChat').addEventListener('click', newChat);
$('#btnNewChatMobile').addEventListener('click', () => { newChat(); $('#historyDrawer').hidden = true; });
$('#btnMenu').addEventListener('click', () => { $('#historyDrawer').hidden = !$('#historyDrawer').hidden; });
$('#btnCloseHistory').addEventListener('click', () => { $('#historyDrawer').hidden = true; });
function openChat(id) {
  const chat = state.chats.find(c => c.id === id); if (!chat) return;
  state.currentId = id; state.messages = (chat.messages || []).map(m => ({ ...m })); state.attachments = [];
  renderAttachRow(); renderMessages(); renderHistory();
}
async function reloadChats() { state.chats = (await dbAllChats()).sort((a, b) => b.updatedAt - a.updatedAt); renderHistory(); }
async function persistChat() {
  if (!state.currentId) state.currentId = uid();
  const first = state.messages.find(m => m.role === 'user');
  let chat = state.chats.find(c => c.id === state.currentId);
  if (!chat) { chat = { id: state.currentId, createdAt: Date.now(), model: LS.model }; state.chats.unshift(chat); }
  chat.title = first ? first.content.slice(0, 48) : 'Chat tanpa judul';
  chat.messages = state.messages;
  await dbSaveChat(chat);
  renderHistory();
}

/* ================= KOPY / SUARA actions in messages ================= */
$('#messages').addEventListener('click', (e) => {
  const copyCode = e.target.closest('[data-copy]');
  if (copyCode) {
    const pre = copyCode.closest('.codeblock')?.querySelector('pre');
    if (pre) navigator.clipboard?.writeText(pre.innerText).then(() => { copyCode.textContent = 'Tersalin'; setTimeout(() => (copyCode.textContent = 'Salin'), 1600); });
    return;
  }
  const copyMsg = e.target.closest('[data-copy-msg]');
  if (copyMsg) { navigator.clipboard?.writeText(copyMsg.closest('.msg')?.querySelector('.bubble')?.innerText || '').then(() => showToast('Jawaban disalin')); return; }
  const speakMsg = e.target.closest('[data-speak-msg]');
  if (speakMsg) { const was = speakEnabled; speakEnabled = true; speak(speakMsg.closest('.msg')?.querySelector('.bubble')?.innerText || ''); speakEnabled = was; return; }
  const retry = e.target.closest('[data-retry]');
  if (retry) { const last = [...state.messages].reverse().find(m => m.role === 'user'); if (last) sendMessage(last.content); }
});
$$('#suggestRow .chip').forEach(chip => chip.addEventListener('click', () => { $('#input').value = chip.textContent; $('#input').focus(); }));

/* ================= KURIKULUM KODOK ================= */
const levelFor = (xp) => {
  let lvl = LEVELS[0];
  for (const l of LEVELS) if (xp >= l.xp) lvl = l;
  return lvl;
};
const nextLevelXp = (xp) => {
  for (const l of LEVELS) if (l.xp > xp) return l.xp;
  return LEVELS[LEVELS.length - 1].xp;
};
function updateStreak() {
  const today = new Date().toDateString();
  if (LS.lastDay === today) return;
  const y = new Date(Date.now() - 86400000).toDateString();
  LS.streak = LS.lastDay === y ? LS.streak + 1 : 1;
  LS.lastDay = today;
}
function renderKurikulum() {
  updateStreak();
  const doneCount = BABS.filter(b => state.done[b.id]).length;
  const level = levelFor(state.xp);
  const next = nextLevelXp(state.xp);
  $('#xpLevelText').textContent = level.title;
  $('#xpCount').textContent = `${state.xp} XP · ${doneCount}/${BABS.length} bab`;
  $('#streakCount').textContent = LS.streak;
  const prevLevel = LEVELS.filter(l => l.xp <= state.xp).pop().xp;
  const pct = next === prevLevel ? 100 : Math.min(100, ((state.xp - prevLevel) / (next - prevLevel)) * 100);
  $('#xpFill').style.width = pct + '%';

  $('#babGrid').innerHTML = BABS.map((b, i) => {
    const done = !!state.done[b.id];
    const prevDone = i === 0 || !!state.done[BABS[i - 1].id];
    const locked = !prevDone;
    return `<button class="bab-card${done ? ' done' : ''}${locked ? ' locked' : ''}" data-bab="${b.id}" aria-disabled="${locked}">
      <span class="bab-num">${String(b.id).padStart(2, '0')}</span>
      <span class="bab-ic"><svg><path d="${ICONS[b.icon]}"/></svg></span>
      <b>${escapeHTML(b.title)}</b>
      <small>${escapeHTML(b.konsep)}</small>
      <span class="bab-state">${locked ? '<svg><use href="#i-lock"/></svg>TERKUNCI' : done ? '<svg><use href="#i-check"/></svg>SELESAI' : 'MULAI PETUALANGAN'}</span>
      <span class="bab-xp-tag">+${b.xp} XP</span>
    </button>`;
  }).join('');
  $$('.bab-card', $('#babGrid')).forEach(card => {
    card.addEventListener('click', () => {
      if (card.classList.contains('locked')) { showToast('Selesaikan bab sebelumnya dulu, Ksatria.'); return; }
      openBab(+card.dataset.bab);
    });
  });
}

function openBab(id) {
  const b = BABS.find(x => x.id === id);
  if (!b) return;
  $('#babDetailNo').textContent = `BAB ${b.id}`;
  $('#babDetailTitle').textContent = b.title;
  $('#babDetailXp').textContent = `+${b.xp} XP`;
  $('#babStory').textContent = b.story;
  $('#babCode').textContent = b.code;
  $('#quizList').innerHTML = b.quiz.map((q, qi) => `
    <div class="quiz-q" data-correct="${q.answer}">
      <p>${qi + 1}. ${escapeHTML(q.q)}</p>
      ${q.options.map((o, oi) => `<label class="quiz-opt"><input type="radio" name="q${qi}" value="${oi}"> ${escapeHTML(o)}</label>`).join('')}
    </div>`).join('');
  $('#quizFeedback').textContent = '';
  $('#babDetail').hidden = false;
  $('.bab-detail-body').scrollTop = 0;
}
$('#btnBabBack').addEventListener('click', () => { $('#babDetail').hidden = true; });
$('#btnBabCopy').addEventListener('click', () => { navigator.clipboard?.writeText($('#babCode').innerText).then(() => { $('#btnBabCopy').textContent = 'Tersalin'; setTimeout(() => ($('#btnBabCopy').textContent = 'Salin'), 1600); }); });
$('#btnAskKodok').addEventListener('click', () => {
  const title = $('#babDetailTitle').textContent;
  gotoTab('chat');
  $('#babDetail').hidden = true;
  $('#input').value = `Ajari aku tentang "${title}" — santai, penuh emoji, dan bertahap`;
  $('#input').focus();
});
$('#btnQuizSubmit').addEventListener('click', () => {
  const questions = $$('.quiz-q', $('#quizList'));
  let correct = 0;
  questions.forEach(q => {
    const picked = q.querySelector('input[type=radio]:checked');
    const answer = +q.dataset.correct;
    q.querySelectorAll('.quiz-opt').forEach((opt, oi) => {
      opt.classList.toggle('correct', oi === answer);
      if (picked && +picked.value === oi && oi !== answer) opt.classList.add('wrong');
    });
    if (picked && +picked.value === answer) correct++;
  });
  const total = questions.length;
  if (correct === total) {
    const b = BABS.find(x => String(x.id) === $('#babDetailNo').textContent.replace('BAB ', ''));
    if (b && !state.done[b.id]) {
      state.done[b.id] = true;
      state.xp += b.xp;
      LS.done = state.done;
      LS.xp = state.xp;
      celebrate(b);
    }
    $('#quizFeedback').textContent = correct === total ? `Sempurna! ${correct}/${total} — kau Ksatria sesungguhnya!` : '';
  } else {
    $('#quizFeedback').textContent = `Belum sempurna — ${correct}/${total}. Baca cerita & kode lagi, lalu coba ulang!`;
  }
});

function celebrate(b) {
  $('#babDetail').hidden = true;
  $('#celebrateTitle').textContent = `${b.title} ditaklukkan!`;
  $('#celebrateXp').textContent = `+${b.xp} XP`;
  const frog = `<svg class="frog frog-jump" width="120" height="95" viewBox="0 0 160 128" role="img" aria-label="Kodok merayakan"><ellipse cx="80" cy="116" rx="34" ry="6" fill="#173d29"/><path d="M34 94c-10 2-14 10-10 14 6 5 22 2 30-4z" fill="#16a34a"/><path d="M126 94c10 2 14 10 10 14-6 5-22 2-30-4z" fill="#16a34a"/><ellipse cx="80" cy="80" rx="46" ry="34" fill="#22c55e"/><ellipse cx="80" cy="86" rx="30" ry="20" fill="#86efac"/><circle cx="56" cy="45" r="14" fill="#22c55e"/><circle cx="104" cy="45" r="14" fill="#22c55e"/><circle cx="56" cy="43" r="9" fill="#fff"/><circle cx="104" cy="43" r="9" fill="#fff"/><circle cx="57" cy="44" r="4.4" fill="#081a11"/><circle cx="103" cy="44" r="4.4" fill="#081a11"/><path d="M62 72q18 14 36 0" stroke="#081a11" stroke-width="2.6" fill="none" stroke-linecap="round"/><path d="M46 4l2.4 5.8 6.2.4-4.8 4 1.6 6-5.4-3.3-5.4 3.3 1.6-6-4.8-4 6.2-.4z" fill="#e6c26b"/></svg>`;
  $('#celebrateFrog').innerHTML = frog;
  const box = $('#confettiBox');
  box.innerHTML = Array.from({ length: 26 }, (_, i) => `<i style="left:${(i * 37) % 100}%;background:${['#22c55e', '#e6c26b', '#34d399', '#86efac', '#fbbf24'][i % 5]};animation-delay:${(i * 90) % 1300}ms;animation-duration:${1400 + (i * 137) % 900}ms"></i>`).join('');
  $('#celebrate').hidden = false;
  renderKurikulum();
}
$('#btnCelebrateOk').addEventListener('click', () => { $('#celebrate').hidden = true; });

/* ================= PROVIDER SETTINGS ================= */
function renderProviders() {
  const box = $('#providerList');
  box.innerHTML = PROVIDERS.map(p => `
    <button class="provider${(LS.model === 'api' && LS.provider === p.id) || (LS.model !== 'api' && p.id === 'pollinations') ? ' on' : ''}" data-provider="${p.id}" role="radio">
      <span class="prov-ic"><svg><use href="#${p.icon}"/></svg></span>
      <span class="prov-meta"><b>${p.label}</b><small>${p.desc}</small></span>
      <span class="radio"></span>
    </button>`).join('');
  $$('.provider', box).forEach(btn => btn.addEventListener('click', () => {
    const id = btn.dataset.provider;
    if (id === 'pollinations') { LS.model = 'katak-1.3'; }
    else { LS.model = 'api'; LS.provider = id; }
    updateModelPill();
    renderProviders();
    syncKeyBox();
    showToast(id === 'pollinations' ? 'Kembali ke KATAK-1.3 gratis' : `Otak API: ${providerDef().label}`);
  }));
}
function syncKeyBox() {
  const p = providerDef();
  $('#apiKeyLabel').textContent = p.id === 'pollinations' ? 'TIDAK PERLU KEY' : 'API KEY';
  $('#apiKeyInput').placeholder = p.id === 'pollinations' ? 'Kosongkan — gratis terus' : 'sk-…';
  $('#apiKeyInput').value = LS.key(p.id);
  $('#modelLabel').textContent = 'MODEL (opsional)';
  $('#modelInput').value = LS.apiModel(p.id);
  $('#keyBox').style.opacity = p.id === 'pollinations' ? '.55' : '1';
}
$('#apiKeyInput').addEventListener('input', e => LS.setKey(LS.provider, e.target.value.trim()));
$('#modelInput').addEventListener('input', e => LS.setApiModel(LS.provider, e.target.value.trim()));
$('#btnClearData').addEventListener('click', async () => {
  if (!confirm('Hapus semua riwayat chat & progres belajar?')) return;
  await dbClear();
  localStorage.removeItem('ki_xp'); localStorage.removeItem('ki_done');
  state.chats = []; state.messages = []; state.currentId = null; state.xp = 0; state.done = {};
  renderMessages(); renderHistory(); renderKurikulum();
  showToast('Semua data dihapus');
});

/* ================= SW & INIT ================= */
if ('serviceWorker' in navigator) window.addEventListener('load', () => navigator.serviceWorker.register('sw.js').catch(() => {}));

$('#frogHero').innerHTML = `<svg class="frog frog-jump" width="150" height="118" viewBox="0 0 160 128" role="img" aria-label="Kodok Buggames melompat"><ellipse cx="80" cy="116" rx="34" ry="6" fill="#173d29"/><path d="M34 94c-10 2-14 10-10 14 6 5 22 2 30-4z" fill="#16a34a"/><path d="M126 94c10 2 14 10 10 14-6 5-22 2-30-4z" fill="#16a34a"/><ellipse cx="80" cy="80" rx="46" ry="34" fill="#22c55e"/><ellipse cx="80" cy="86" rx="30" ry="20" fill="#86efac"/><circle cx="56" cy="45" r="14" fill="#22c55e"/><circle cx="104" cy="45" r="14" fill="#22c55e"/><circle cx="56" cy="43" r="9" fill="#fff"/><circle cx="104" cy="43" r="9" fill="#fff"/><circle cx="57" cy="44" r="4.4" fill="#081a11"/><circle cx="103" cy="44" r="4.4" fill="#081a11"/><path d="M62 72q18 14 36 0" stroke="#081a11" stroke-width="2.6" fill="none" stroke-linecap="round"/><path d="M124 4l2.2 5.4 5.8.4-4.5 3.9 1.5 5.7-5-3-5 3 1.5-5.7-4.5-3.9 5.8-.4z" fill="#e6c26b"/></svg>`;
(async function init() {
  updateStreak();
  await reloadChats();
  renderMessages();
  renderKurikulum();
  renderProviders();
  syncKeyBox();
  updateModelPill();
})();
