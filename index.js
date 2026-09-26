// Chat Story (แชทนิยาย) — ส่วนเสริม SillyTavern
// อ่านคำตอบของบอทแบบนิยายแชท: แตะหนึ่งครั้ง เด้งหนึ่งฟอง พร้อมเสียง · พิมพ์ตอบได้ในหน้าอ่าน
// สองแบบ: แชทนิยาย (chat) · นิยาย (novel)  ·  สองโหมด: หน้าอ่านเปิดทับแชท (reader) · แชทหลัก (inline)

const CS_VERSION = '1.4.0';
const CS_KEY = 'chatStory';
const CS_PROMPT_KEY = 'chat_story_format';

// ══ ธีมสำเร็จรูป ══
// ช่องสี: bg พื้น · bar แถบบน/ล่าง · ink ตัวหนังสือ · ink2 ตัวหนังสือรอง · inBg/inInk ฟองตัวละคร · outBg/outInk ฟองเรา
//        narrBg พื้นบรรยาย · accent สีเน้น · name สีชื่อ
const CS_COLOR_KEYS = ['bg', 'bar', 'ink', 'ink2', 'inBg', 'inInk', 'outBg', 'outInk', 'narrBg', 'accent', 'name'];
const CS_COLOR_LABELS = { bg: 'พื้นหลัง', bar: 'แถบบนและช่องพิมพ์', ink: 'ตัวหนังสือ', ink2: 'ตัวหนังสือรอง / บรรยาย', inBg: 'ฟองตัวละคร', inInk: 'ตัวหนังสือในฟองตัวละคร', outBg: 'ฟองของเรา', outInk: 'ตัวหนังสือในฟองของเรา', narrBg: 'พื้นบรรยาย', accent: 'สีเน้น', name: 'ชื่อตัวละคร' };
const CS_PRESETS = {
 classic: { name: 'ขาวดำต้นฉบับ', c: { bg: '#ffffff', bar: '#ffffff', ink: '#111111', ink2: '#8e8e8e', inBg: '#f0f0f0', inInk: '#111111', outBg: '#111111', outInk: '#ffffff', narrBg: '#f6f6f6', accent: '#111111', name: '#6b6b6b' } },
 ink: { name: 'ดำขาว', c: { bg: '#0e0e0e', bar: '#0e0e0e', ink: '#f1f1f1', ink2: '#8a8a8a', inBg: '#242424', inInk: '#f1f1f1', outBg: '#f1f1f1', outInk: '#0e0e0e', narrBg: '#181818', accent: '#f1f1f1', name: '#a3a3a3' } },
 sepia: { name: 'กระดาษเก่า', c: { bg: '#f4ecdf', bar: '#f4ecdf', ink: '#3b3024', ink2: '#8c7a62', inBg: '#fffaf1', inInk: '#3b3024', outBg: '#5b4632', outInk: '#fff7ea', narrBg: '#ebe0cd', accent: '#7a5c3e', name: '#8c7a62' } },
 soft: { name: 'ชมพูพาสเทล', c: { bg: '#fff5f8', bar: '#ffffff', ink: '#3b2a33', ink2: '#9a7b88', inBg: '#ffffff', inInk: '#3b2a33', outBg: '#ff7aa2', outInk: '#ffffff', narrBg: '#ffe8ef', accent: '#ff5c8d', name: '#c0567c' } },
 mint: { name: 'มินต์', c: { bg: '#effaf6', bar: '#ffffff', ink: '#1f3a32', ink2: '#5d8578', inBg: '#ffffff', inInk: '#1f3a32', outBg: '#2bb58a', outInk: '#ffffff', narrBg: '#dcf3ea', accent: '#1f9e78', name: '#2c8a6c' } },
 sky: { name: 'ฟ้าใส', c: { bg: '#f1f6ff', bar: '#ffffff', ink: '#1b2a44', ink2: '#6d7f9e', inBg: '#ffffff', inInk: '#1b2a44', outBg: '#3d7bf5', outInk: '#ffffff', narrBg: '#e1ebfc', accent: '#3d7bf5', name: '#3d63b0' } },
 lavender: { name: 'ลาเวนเดอร์', c: { bg: '#f6f3ff', bar: '#ffffff', ink: '#2e2645', ink2: '#8a80a8', inBg: '#ffffff', inInk: '#2e2645', outBg: '#8b6cf0', outInk: '#ffffff', narrBg: '#ebe5ff', accent: '#7a5ce6', name: '#6d55c2' } },
 night: { name: 'กลางคืน', c: { bg: '#14131c', bar: '#1b1a26', ink: '#ece9f6', ink2: '#a19cb8', inBg: '#2a2839', inInk: '#ece9f6', outBg: '#7c6cf0', outInk: '#ffffff', narrBg: '#1f1d2b', accent: '#9d90ff', name: '#b9b0ff' } },
};

// ══ ฟอนต์ (Google Fonts โหลดเมื่อเลือก) ══
const CS_FONTS = [
 { id: 'system', name: 'ตามเครื่อง', ff: 'inherit' },
 { id: 'sarabun', name: 'Sarabun', ff: "'Sarabun',sans-serif", g: 'Sarabun:wght@400;600' },
 { id: 'noto', name: 'Noto Sans Thai', ff: "'Noto Sans Thai',sans-serif", g: 'Noto+Sans+Thai:wght@400;600' },
 { id: 'ibm', name: 'IBM Plex Sans Thai', ff: "'IBM Plex Sans Thai',sans-serif", g: 'IBM+Plex+Sans+Thai:wght@400;600' },
 { id: 'prompt', name: 'Prompt', ff: "'Prompt',sans-serif", g: 'Prompt:wght@400;600' },
 { id: 'kanit', name: 'Kanit', ff: "'Kanit',sans-serif", g: 'Kanit:wght@400;600' },
 { id: 'mitr', name: 'Mitr', ff: "'Mitr',sans-serif", g: 'Mitr:wght@400;600' },
 { id: 'bai', name: 'Bai Jamjuree', ff: "'Bai Jamjuree',sans-serif", g: 'Bai+Jamjuree:wght@400;600' },
 { id: 'chakra', name: 'Chakra Petch', ff: "'Chakra Petch',sans-serif", g: 'Chakra+Petch:wght@400;600' },
 { id: 'k2d', name: 'K2D', ff: "'K2D',sans-serif", g: 'K2D:wght@400;600' },
 { id: 'niramit', name: 'Niramit', ff: "'Niramit',sans-serif", g: 'Niramit:wght@400;600' },
 { id: 'krub', name: 'Krub', ff: "'Krub',sans-serif", g: 'Krub:wght@400;600' },
 { id: 'athiti', name: 'Athiti', ff: "'Athiti',sans-serif", g: 'Athiti:wght@400;600' },
 { id: 'notoserif', name: 'Noto Serif Thai', ff: "'Noto Serif Thai',serif", g: 'Noto+Serif+Thai:wght@400;600' },
 { id: 'pridi', name: 'Pridi', ff: "'Pridi',serif", g: 'Pridi:wght@400;600' },
 { id: 'trirong', name: 'Trirong', ff: "'Trirong',serif", g: 'Trirong:wght@400;600' },
 { id: 'taviraj', name: 'Taviraj', ff: "'Taviraj',serif", g: 'Taviraj:wght@400;600' },
 { id: 'mali', name: 'Mali', ff: "'Mali',cursive", g: 'Mali:wght@400;600' },
 { id: 'itim', name: 'Itim', ff: "'Itim',cursive", g: 'Itim' },
 { id: 'sriracha', name: 'Sriracha', ff: "'Sriracha',cursive", g: 'Sriracha' },
 { id: 'charm', name: 'Charm', ff: "'Charm',cursive", g: 'Charm:wght@400;700' },
 { id: 'pattaya', name: 'Pattaya', ff: "'Pattaya',sans-serif", g: 'Pattaya' },
 { id: 'custom', name: 'ฟอนต์อื่น', ff: '' },
];

// ══ เสียง ══
const CS_SOUNDS = [
 { id: 'pop', name: 'ป๊อก' }, { id: 'bubble', name: 'ฟองน้ำ' }, { id: 'drop', name: 'หยดน้ำ' }, { id: 'tick', name: 'ติ๊ก' },
 { id: 'typewriter', name: 'พิมพ์ดีด' }, { id: 'soft', name: 'นุ่ม ๆ' }, { id: 'chime', name: 'กระดิ่ง' }, { id: 'kalimba', name: 'คาลิมบา' },
 { id: 'retro', name: 'เกม 8 บิต' }, { id: 'custom', name: 'ไฟล์ของฉัน' }, { id: 'none', name: 'ไม่มีเสียง' },
];

const CS_DEFAULTS = {
 enabled: true,
 mode: 'reader',        // reader | inline
 autoOpen: true,
 forceFormat: true,
 preset: 'classic',
 custom: null,          // สีที่ปรับเอง (คัดลอกจากธีมที่เลือกตอนเริ่มแก้)
 font: 'sarabun',
 fontCustom: '',
 fontSize: 16,
 lineHeight: 1.55,
 radius: 18,
 bubbleMax: 78,
 avatar: 'circle',      // circle | rounded | square | none
 showNames: true,
 nameColor: 'theme',    // theme | rainbow
 narrStyle: 'plain',    // plain | box | italic
 sound: 'pop',
 volume: 0.6,
 pitchVary: true,
 narrSound: true,
 vibrate: false,
 customSound: '',
 typingMs: 450,
 autoSpeed: 1,
 userSide: 'right',
 showInput: true,
 enterSend: true,
 history: 4,            // เปิดหน้าอ่าน: แสดงข้อความก่อนหน้ากี่ข้อความไว้ให้เห็นต่อเนื่อง
 style: 'chat',         // chat = แชทนิยาย · novel = นิยาย
 plainUser: 'auto',     // ข้อความของเราที่ไม่มีเครื่องหมาย: auto เดาให้ · say คำพูดเสมอ · narr บรรยายเสมอ
 novelIndent: true,     // ย่อหน้าบรรทัดแรก
 novelJustify: false,   // จัดเต็มแนว
 paraGap: 1.2,          // ระยะห่างย่อหน้า (em)
 novelFontSize: 18,     // ขนาดตัวอักษรหน้านิยาย (แยกจากแชทนิยาย)
 novelLH: 1.95,         // ระยะบรรทัดหน้านิยาย
 chapterWord: 'บท',     // บท | ตอน
 cmtOn: false,          // คอมเมนต์และรีแอคชันท้ายย่อหน้า (หน้านิยาย)
 cmtAuto: false,        // เรียกคอมเมนต์เองทุกบทใหม่ (ใช้โทเคนทุกบท)
 cmtJanya: true,        // มี janyaahri มาคอมเมนต์ด้วย
 cmtAmount: 'normal',   // few | normal | many
 cmtUsed: null,         // { tokens, calls } สะสม
 pageWidth: 680,        // ความกว้างหน้ากระดาษ (px)
 userInNovel: 'mark',   // same เหมือนเนื้อเรื่อง · mark มีเส้นกำกับ · hide ซ่อน
 chars: {},             // { ชื่อ: { color, sound } }
};

function csCtx() { return SillyTavern.getContext(); }
function csCfg() {
 const ctx = csCtx();
 if (!ctx.extensionSettings[CS_KEY]) ctx.extensionSettings[CS_KEY] = {};
 const s = ctx.extensionSettings[CS_KEY];
 for (const k of Object.keys(CS_DEFAULTS)) if (s[k] === undefined) s[k] = (CS_DEFAULTS[k] && typeof CS_DEFAULTS[k] === 'object') ? JSON.parse(JSON.stringify(CS_DEFAULTS[k])) : CS_DEFAULTS[k];
 // ธีมเก่าจาก 1.0.0
 if (s.theme && !s._migrated) { if (CS_PRESETS[s.theme]) s.preset = s.theme; s._migrated = true; }
 if (!CS_PRESETS[s.preset] && s.preset !== 'custom') s.preset = 'classic';
 if (s.preset === 'custom' && !s.custom) s.custom = { ...CS_PRESETS.classic.c };
 if (!s.chars || typeof s.chars !== 'object') s.chars = {};
 if ((s._v || 0) < 13) { if (s.paraGap === 0.9) s.paraGap = 1.2; s._v = 13; } // หน้านิยายแบบใหม่ห่างขึ้น
 return s;
}
function csSave() { try { csCtx().saveSettingsDebounced(); } catch {} }
function csEsc(s) { return String(s == null ? '' : s).replace(/[&<>"']/g, c => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c])); }
function csHash(s) { let h = 0; s = String(s || ''); for (let i = 0; i < s.length; i++) h = (h * 31 + s.charCodeAt(i)) >>> 0; return h; }
function csUserName() { try { return csCtx().name1 || 'You'; } catch { return 'You'; } }
function csCharName() { try { return csCtx().name2 || ''; } catch { return ''; } }
function csToast(t) { try { toastr.info(t); } catch { console.log('[chat-story]', t); } }
function csLum(hex) {
 const m = String(hex || '').replace('#', '').match(/^([0-9a-f]{6}|[0-9a-f]{3})$/i);
 if (!m) return 1;
 let h = m[1]; if (h.length === 3) h = h.split('').map(x => x + x).join('');
 const [r, g, b] = [0, 2, 4].map(i => parseInt(h.slice(i, i + 2), 16) / 255).map(v => v <= .03928 ? v / 12.92 : ((v + .055) / 1.055) ** 2.4);
 return .2126 * r + .7152 * g + .0722 * b;
}
function csTextOn(bg) { return csLum(bg) > .45 ? '#111111' : '#ffffff'; }

// ══ ธีมที่ใช้อยู่ → ตัวแปร CSS ══
function csColors() {
 const s = csCfg();
 return s.preset === 'custom' ? { ...CS_PRESETS.classic.c, ...(s.custom || {}) } : { ...CS_PRESETS[s.preset].c };
}
function csFont() { const s = csCfg(); return CS_FONTS.find(f => f.id === s.font) || CS_FONTS[0]; }
function csFontFamily() {
 const s = csCfg(), f = csFont();
 if (f.id === 'custom') return s.fontCustom ? `'${String(s.fontCustom).replace(/'/g, '')}',sans-serif` : 'inherit';
 return f.ff;
}
function csLoadFonts(list) {
 const want = list.filter(f => f && f.g && !document.getElementById('cs-font-' + f.id));
 if (!want.length) return;
 const l = document.createElement('link');
 l.rel = 'stylesheet';
 l.id = 'cs-font-' + want.map(f => f.id).join('-');
 l.href = `https://fonts.googleapis.com/css2?${want.map(f => 'family=' + f.g).join('&')}&display=swap`;
 want.forEach(f => { const m = document.createElement('meta'); m.id = 'cs-font-' + f.id; document.head.appendChild(m); });
 document.head.appendChild(l);
}
function csLoadCurrentFont() {
 const s = csCfg(), f = csFont();
 if (f.id === 'custom' && s.fontCustom && !document.getElementById('cs-font-c-' + csHash(s.fontCustom))) {
  const l = document.createElement('link');
  l.rel = 'stylesheet'; l.id = 'cs-font-c-' + csHash(s.fontCustom);
  l.href = `https://fonts.googleapis.com/css2?family=${encodeURIComponent(s.fontCustom).replace(/%20/g, '+')}&display=swap`;
  document.head.appendChild(l);
 } else csLoadFonts([f]);
}
function csVars() {
 const s = csCfg(), c = csColors();
 return {
  '--cs-bg': c.bg, '--cs-bar': c.bar, '--cs-ink': c.ink, '--cs-ink2': c.ink2, '--cs-in': c.inBg, '--cs-in-ink': c.inInk,
  '--cs-out': c.outBg, '--cs-out-ink': c.outInk, '--cs-narr': c.narrBg, '--cs-accent': c.accent, '--cs-name': c.name,
  '--cs-accent-ink': csTextOn(c.accent), '--cs-font': s.fontSize + 'px', '--cs-ff': csFontFamily(), '--cs-lh': String(s.lineHeight),
  '--cs-radius': s.radius + 'px', '--cs-max': s.bubbleMax + '%',
 };
}
function csApplyVars(el) {
 if (!el) return;
 const v = csVars();
 Object.keys(v).forEach(k => el.style.setProperty(k, v[k]));
 const s = csCfg();
 el.classList.toggle('cs-dark', csLum(csColors().bg) < .2);
 el.dataset.narr = s.narrStyle;
 el.dataset.avatar = s.avatar;
 el.classList.toggle('cs-nonames', !s.showNames);
}

// ══ คำสั่งให้บอทเขียนแบบนิยายแชท ══
function csFormatPrompt() {
 const un = csUserName();
 const cn = csCharName();
 if (csCfg().style === 'novel') return [
  `[NOVEL FORMAT — required for every reply]`,
  `Write the reply as novel prose: flowing paragraphs separated by a blank line, like a published web novel chapter.`,
  `Start the reply with a short chapter title on its own first line, written as: ## title`,
  `Spoken lines go in quotation marks “ ” inside the paragraphs. No "Name:" chat lines, no lists, no other headings, no asterisks.`,
  `Never write ${un}'s dialogue, thoughts or actions. ${un}'s messages may mix narration and speech without any markers — read them as story.`,
  `Same language as the chat.`,
 ].join('\n');
 return [
  `[CHAT-STORY FORMAT — required for every reply]`,
  `Write the whole reply as a chat novel. Every line becomes one bubble, so keep lines short.`,
  `Spoken line: Name: what they say`,
  `Inner thought: Name (คิด): what they think`,
  `Narration, actions and scenery: their own separate line with no name, one or two sentences.`,
  `When the place or time changes: [place / time] on its own line.`,
  `Never put narration and speech on the same line. Never write ${un}'s lines, thoughts or actions.`,
  `${un}'s own messages may be plain narration without asterisks or quotes — treat them as story, not as a chat line.`,
  `Use exact names${cn ? ` (for example "${cn}: ...")` : ''}. Same language as the chat.`,
  `Example:`,
  `[ร้านกาแฟหน้ามหาลัย / บ่ายสาม]`,
  `ฝนเริ่มตกหนักจนกระจกร้านขึ้นฝ้า`,
  `${cn || 'Name'}: มาช้านะ`,
  `${cn || 'Name'} (คิด): จริง ๆ ก็ดีใจที่มา`,
 ].join('\n');
}
function csApplyPrompt() {
 try {
  const ctx = csCtx();
  if (typeof ctx.setExtensionPrompt !== 'function') return;
  const s = csCfg();
  ctx.setExtensionPrompt(CS_PROMPT_KEY, s.enabled && s.forceFormat ? csFormatPrompt() : '', 1, 1, false, 0);
 } catch (e) { console.warn('[chat-story] prompt', e); }
}

// ══ แยกข้อความเป็นฟอง ══
const CS_THOUGHT = /คิด|ในใจ|think|thought|mind/i;
function csCleanText(t) {
 return String(t || '')
  .replace(/<think(?:ing)?>[\s\S]*?<\/think(?:ing)?>/gi, '')
  .replace(/\[\[POCKET_PHONE_SYNC_V2\]\][\s\S]*?\[\[\/POCKET_PHONE_SYNC_V2\]\]/g, '')
  .replace(/<br\s*\/?>/gi, '\n')
  .replace(/<[^>]+>/g, '')
  .replace(/\r/g, '');
}
function csStripQuotes(s) { return String(s).trim().replace(/^["“”「『]+/, '').replace(/["“”」』]+$/, '').trim(); }
function csLooksLikeName(n) {
 const s = n.trim();
 if (!s || s.length > 40) return false;
 if (/[.!?。！？,，"“”*]/.test(s)) return false;
 if (s.split(/\s+/).length > 4) return false;
 if (/^(http|https)$/i.test(s)) return false;
 return true;
}
/** @returns {Array<{k:'say'|'think'|'narr'|'scene', who?:string, tag?:string, text:string}>} */
function csParse(text, opt) {
 const o = opt || {};
 const out = [];
 const lines = csCleanText(text).split(/\n+/).map(s => s.trim()).filter(Boolean);
 const pushSay = (who, body, tag) => {
  String(body).split(/(\*[^*]+\*)/).forEach(part => {
   if (!part.trim()) return;
   if (/^\*[^*]+\*$/.test(part.trim())) out.push({ k: 'narr', text: part.trim().slice(1, -1).trim() });
   else { const t = csStripQuotes(part); if (t) out.push({ k: tag && CS_THOUGHT.test(tag) ? 'think' : 'say', who, tag: tag || '', text: t }); }
  });
 };
 for (const raw of lines) {
  const line = raw.replace(/^>\s*/, '');
  if (/^[-=*_~]{3,}$/.test(line)) continue;
  let m = line.match(/^\[([^\]]{1,80})\]$/);
  if (m) { out.push({ k: 'scene', text: m[1].trim() }); continue; }
  m = line.match(/^\**\s*([^:：\n]{1,40}?)\s*\**\s*(?:[(（]([^)）]{1,16})[)）])?\s*\**\s*[:：]\s*(.+)$/);
  if (m && csLooksLikeName(m[1].replace(/\*/g, ''))) { pushSay(m[1].replace(/\*/g, '').trim(), m[3], m[2]); continue; }
  m = line.match(/^\*+([^*]+)\*+$/);
  if (m) { out.push({ k: 'narr', text: m[1].trim() }); continue; }
  if (csSplitQuotes(line, o.owner || (o.isUser ? csUserName() : ''), out)) continue;
  if (o.isUser) {
   if (/\*[^*]+\*/.test(line)) { pushSay(o.owner || csUserName(), line, ''); continue; }
   if (csGuessPlain(line) === 'narr') { out.push({ k: 'narr', text: line }); continue; }
   pushSay(o.owner || csUserName(), line, '');
   continue;
  }
  out.push({ k: 'narr', text: line.replace(/\*+/g, '').trim() });
 }
 return out.filter(x => x.text);
}

/** บรรทัดที่มีเครื่องหมายคำพูด: ในเครื่องหมาย = คำพูด นอกนั้น = บรรยาย */
const CS_QUOTE_RE = /“([^”]+)”|"([^"]+)"|「([^」]+)」|『([^』]+)』/g;
function csSplitQuotes(line, owner, out) {
 if (!owner) return false;
 CS_QUOTE_RE.lastIndex = 0;
 if (!CS_QUOTE_RE.test(line)) return false;
 CS_QUOTE_RE.lastIndex = 0;
 let last = 0, m;
 const narr = t => { t = t.replace(/\*+/g, '').replace(/^[\s,，:：-]+|[\s,，:：-]+$/g, '').trim(); if (t) out.push({ k: 'narr', text: t }); };
 while ((m = CS_QUOTE_RE.exec(line))) {
  narr(line.slice(last, m.index));
  const q = (m[1] || m[2] || m[3] || m[4] || '').trim();
  if (q) out.push({ k: 'say', who: owner, tag: '', text: q });
  last = CS_QUOTE_RE.lastIndex;
 }
 narr(line.slice(last));
 return true;
}
/** ข้อความของเราที่ไม่มีเครื่องหมายเลย — เดาว่าเป็นคำพูดหรือบรรยาย */
const CS_ACTION_WORDS = /(เดิน|มอง|ยิ้ม|หัน|นั่ง|ยืน|ลุก|ก้าว|หยิบ|วาง|ยก|จับ|กอด|เอื้อม|ถอนหายใจ|พยักหน้า|ส่ายหน้า|ขมวดคิ้ว|เงียบ|หลับตา|ลืมตา|วิ่ง|เปิดประตู|ปิดประตู|walks?|looks?|smiles?|turns?|sits?|stands?|grabs?|sighs?|nods?)/i;
const CS_SPEECH_END = /([?？!！~]|ค่ะ|คะ|ครับ|คับ|นะ|น้า|จ้า|จ้ะ|จ๊ะ|เหรอ|หรอ|ไหม|มั้ย|ป่ะ|ปะ|สิ|ซิ|ล่ะ|เลย|ด้วย|อะ|อ่ะ|เนอะ|ดิ|วะ|เว้ย|โว้ย|แหละ|555+|ฮะ|หา|เหอะ)$/;
function csGuessPlain(line) {
 const mode = csCfg().plainUser;
 if (mode === 'say' || mode === 'narr') return mode;
 const t = String(line).trim();
 const un = csUserName();
 let n = 0;
 if (un && t.startsWith(un) && !/^.{0,40}[:：]/.test(t)) n += 3;
 if (/^(เขา|เธอ|หล่อน|ฉัน|ผม|ข้า|เรา|ทั้งคู่|ทั้งสอง|I |She |He |They |We )/.test(t) && CS_ACTION_WORDS.test(t)) n += 2;
 else if (CS_ACTION_WORDS.test(t) && t.length > 25) n += 1;
 if (t.length > 90) n += 1;
 if (CS_SPEECH_END.test(t)) n -= 2;
 return n >= 2 ? 'narr' : 'say';
}

// ══ ตัวละครและรูป ══
function csIsUser(who) {
 const n = String(who || '').trim().toLowerCase();
 if (!n) return false;
 const names = [csUserName()];
 try { const ctx = csCtx(); const pu = ctx.powerUserSettings; if (pu && pu.personas && ctx.userAvatar) names.push(pu.personas[ctx.userAvatar]); } catch {}
 return names.filter(Boolean).some(x => String(x).trim().toLowerCase() === n);
}
function csUserAvatar() {
 try { const ctx = csCtx(); const f = ctx.userAvatar || window.user_avatar; if (f) return `/thumbnail?type=persona&file=${encodeURIComponent(f)}`; } catch {}
 const img = [...document.querySelectorAll('#chat .mes[is_user="true"] .avatar img')].pop();
 return img ? img.getAttribute('src') : '';
}
function csCharAvatar(who) {
 try {
  const n = String(who || '').trim().toLowerCase();
  const c = (csCtx().characters || []).find(x => x && String(x.name || '').trim().toLowerCase() === n);
  if (c && c.avatar && c.avatar !== 'none') return `/thumbnail?type=avatar&file=${encodeURIComponent(c.avatar)}`;
 } catch {}
 return '';
}
function csAvatarHTML(who) {
 const src = csIsUser(who) ? csUserAvatar() : csCharAvatar(who);
 const hue = csHash(who) % 360;
 const fb = `<span class="cs-av cs-av-fb" style="background:linear-gradient(150deg,hsl(${hue} 30% 62%),hsl(${(hue + 40) % 360} 25% 40%))">${csEsc(String(who || '?').trim()[0] || '?')}</span>`;
 if (!src) return fb;
 return `<img class="cs-av" src="${csEsc(src)}" alt="" onerror="this.outerHTML=this.dataset.fb" data-fb="${csEsc(fb)}">`;
}
function csFmt(t) { return csEsc(t).replace(/\*\*([^*]+)\*\*/g, '<b>$1</b>').replace(/_([^_]+)_/g, '<i>$1</i>'); }
function csCharOpt(who) { return csCfg().chars[String(who || '').trim()] || {}; }
function csItemHTML(it, prev) {
 if (it.k === 'scene') return `<div class="cs-scene"><span>${csFmt(it.text)}</span></div>`;
 if (it.k === 'narr') return `<div class="cs-narr">${csFmt(it.text)}</div>`;
 const s = csCfg();
 const user = csIsUser(it.who);
 const side = user ? (s.userSide === 'left' ? 'left' : 'right') : 'left';
 const cont = prev && (prev.k === 'say' || prev.k === 'think') && prev.who === it.who;
 const hue = csHash(it.who) % 360;
 const co = csCharOpt(it.who);
 const bstyle = co.color && it.k !== 'think' ? ` style="background:${csEsc(co.color)};color:${csTextOn(co.color)}"` : '';
 const nstyle = s.nameColor === 'rainbow' ? ` style="color:hsl(${hue} 55% ${csLum(csColors().bg) < .2 ? 72 : 42}%)"` : (co.color ? ` style="color:${csEsc(co.color)}"` : '');
 const showAv = side === 'left' && s.avatar !== 'none';
 return `<div class="cs-row ${side}${cont ? ' cont' : ''}">
  ${showAv ? `<div class="cs-avwrap">${cont ? '' : csAvatarHTML(it.who)}</div>` : ''}
  <div class="cs-col">${cont || side === 'right' ? '' : `<div class="cs-name"${nstyle}>${csEsc(it.who)}${it.tag && it.k !== 'think' ? ` <i>${csEsc(it.tag)}</i>` : ''}</div>`}
   <div class="cs-bubble${it.k === 'think' ? ' think' : ''}"${bstyle}>${csFmt(it.text)}</div></div>
 </div>`;
}
function csTypingHTML(who) {
 const s = csCfg();
 const side = csIsUser(who) ? (s.userSide === 'left' ? 'left' : 'right') : 'left';
 return `<div class="cs-row ${side} cs-typing-row">${side === 'left' && s.avatar !== 'none' ? `<div class="cs-avwrap">${csAvatarHTML(who)}</div>` : ''}<div class="cs-col"><div class="cs-bubble cs-typing"><span></span><span></span><span></span></div></div></div>`;
}

// ══ เสียง ══
let csAudio = null;
function csAc() {
 const AC = window.AudioContext || window.webkitAudioContext;
 if (!AC) return null;
 if (!csAudio) csAudio = new AC();
 if (csAudio.state === 'suspended' && csAudio.resume) csAudio.resume().catch(() => {});
 return csAudio;
}
function csNote(ac, t0, f, dur, vol, type, f2) {
 const o = ac.createOscillator(), g = ac.createGain();
 o.type = type || 'sine';
 o.frequency.setValueAtTime(f, t0);
 if (f2) o.frequency.exponentialRampToValueAtTime(f2, t0 + dur);
 g.gain.setValueAtTime(0.0001, t0);
 g.gain.exponentialRampToValueAtTime(Math.max(0.0002, vol), t0 + 0.008);
 g.gain.exponentialRampToValueAtTime(0.0001, t0 + dur);
 o.connect(g); g.connect(ac.destination);
 o.start(t0); o.stop(t0 + dur + 0.03);
}
/** kind: in (ตัวละคร) · out (เรา) · think · narr · scene */
const CS_SYNTH = {
 pop: (ac, t, v, p, k) => { if (k === 'out') { csNote(ac, t, 880, .06, v); csNote(ac, t + .05, 1320, .09, v * .8); } else csNote(ac, t, 620 * p, .07, v, 'sine', 980 * p); },
 bubble: (ac, t, v, p, k) => csNote(ac, t, (k === 'out' ? 520 : 380) * p, .11, v, 'sine', (k === 'out' ? 1200 : 900) * p),
 drop: (ac, t, v, p) => csNote(ac, t, 1400 * p, .14, v, 'sine', 420 * p),
 tick: (ac, t, v, p, k) => csNote(ac, t, (k === 'out' ? 1500 : 1200) * p, .035, v * .8, 'square'),
 typewriter: (ac, t, v, p) => { csNote(ac, t, 2200 * p, .018, v * .9, 'square'); csNote(ac, t + .012, 180, .03, v * .6, 'triangle'); },
 soft: (ac, t, v, p, k) => csNote(ac, t, (k === 'out' ? 660 : 523) * p, .22, v * .6, 'sine'),
 chime: (ac, t, v, p) => { csNote(ac, t, 1047 * p, .3, v * .7); csNote(ac, t + .07, 1568 * p, .38, v * .5); },
 kalimba: (ac, t, v, p, k) => { const f = (k === 'out' ? 784 : 587) * p; csNote(ac, t, f, .35, v * .8, 'triangle'); csNote(ac, t, f * 3, .12, v * .25); },
 retro: (ac, t, v, p, k) => { const f = (k === 'out' ? 988 : 660) * p; csNote(ac, t, f, .05, v * .5, 'square'); csNote(ac, t + .05, f * 1.5, .06, v * .5, 'square'); },
};
let csCustomAudio = null;
function csPlaySound(id, kind, who) {
 const s = csCfg();
 const v = Math.max(0, Math.min(1, s.volume));
 if (id === 'none') return false;
 if (id === 'custom') {
  if (!s.customSound) return false;
  try {
   if (!csCustomAudio || csCustomAudio.dataset.src !== s.customSound) { csCustomAudio = new Audio(s.customSound); csCustomAudio.dataset.src = s.customSound; }
   const a = csCustomAudio.cloneNode();
   a.volume = v;
   const pr = a.play(); if (pr && pr.catch) pr.catch(() => {});
   return true;
  } catch { return false; }
 }
 const fn = CS_SYNTH[id] || CS_SYNTH.pop;
 const ac = csAc();
 if (!ac) return false;
 try {
  const vol = v * .32, t0 = ac.currentTime + .005;
  const p = s.pitchVary && who ? 1 + ((csHash(who) % 9) - 4) * .06 : 1;
  if (kind === 'narr') { csNote(ac, t0, 330, .05, vol * .35, 'triangle'); return true; }
  if (kind === 'scene') { csNote(ac, t0, 784, .18, vol * .6); csNote(ac, t0 + .09, 1175, .26, vol * .5); return true; }
  fn(ac, t0, vol, p, kind);
  if (kind === 'think') csNote(ac, t0 + .06, 1400 * p, .12, vol * .25);
  return true;
 } catch { return false; }
}
function csPlay(it) {
 if (!it) return false;
 const s = csCfg();
 if ((it.k === 'narr' || it.k === 'scene') && !s.narrSound) return false;
 if (s.sound === 'none') return false;
 const kind = it.k === 'narr' ? 'narr' : it.k === 'scene' ? 'scene' : it.k === 'think' ? 'think' : (csIsUser(it.who) ? 'out' : 'in');
 const per = it.who ? csCharOpt(it.who).sound : '';
 const ok = csPlaySound(per || s.sound, kind, it.who);
 if (ok && s.vibrate && navigator.vibrate && (kind === 'in' || kind === 'out')) try { navigator.vibrate(8); } catch {}
 return ok;
}

// ══ ตัวเล่นฟอง ══
// ══ เลื่อนจอแบบนุ่ม — เลื่อนเฉพาะกล่องที่อ่านอยู่ ไม่ใช้ scrollIntoView (บนมือถือมันลากทั้งหน้าไปด้วย) ══
let csScrollRaf = 0;
function csScroller(el) { return el && (el.closest('.cs-body') || el.closest('#chat')); }
function csScrollEnd(el, instant) {
 const sc = csScroller(el);
 if (!sc || !el.getBoundingClientRect) return;
 const r = el.getBoundingClientRect(), sr = sc.getBoundingClientRect();
 const delta = r.bottom - sr.bottom + 24;
 if (delta <= 0) return;
 cancelAnimationFrame(csScrollRaf);
 const from = sc.scrollTop, to = Math.min(sc.scrollHeight - sc.clientHeight, from + delta);
 const reduce = window.matchMedia && window.matchMedia('(prefers-reduced-motion: reduce)').matches;
 if (instant || reduce || typeof requestAnimationFrame !== 'function') { sc.scrollTop = to; return; }
 const t0 = performance.now(), dur = 280;
 const step = now => {
  const k = Math.min(1, (now - t0) / dur);
  sc.scrollTop = from + (to - from) * (1 - Math.pow(1 - k, 3));
  if (k < 1) csScrollRaf = requestAnimationFrame(step);
 };
 csScrollRaf = requestAnimationFrame(step);
}

class CsPlayer {
 constructor(list, items, onChange) { this.list = list; this.items = items; this.i = 0; this.typing = null; this.onChange = onChange || (() => {}); }
 get done() { return this.i >= this.items.length && !this.typing; }
 render(idx, pop) {
  const w = document.createElement('div');
  w.className = 'cs-item' + (pop ? ' cs-pop' : '');
  w.innerHTML = csItemHTML(this.items[idx], this.items[idx - 1]);
  const wait = this.list.querySelector(':scope > .cs-waiting');
  this.list.insertBefore(w, wait || null);
  return w;
 }
 showAt(idx, reuse) {
  let w;
  if (reuse) {
   // ใช้กล่องจุดพิมพ์เดิม เปลี่ยนเป็นฟองในที่เดิม เลยไม่กระตุก
   w = reuse;
   w.className = 'cs-item cs-swap';
   w.innerHTML = csItemHTML(this.items[idx], this.items[idx - 1]);
  } else w = this.render(idx, true);
  csPlay(this.items[idx]);
  csScrollEnd(w);
 }
 finishTyping() {
  if (!this.typing) return false;
  clearTimeout(this.typing.timer);
  const { idx, el } = this.typing;
  this.typing = null;
  this.showAt(idx, el);
  this.onChange();
  return true;
 }
 next() {
  if (this.finishTyping()) return true;
  if (this.i >= this.items.length) return false;
  const idx = this.i++;
  const it = this.items[idx];
  const ms = csCfg().typingMs;
  if (ms > 0 && (it.k === 'say' || it.k === 'think') && !csIsUser(it.who)) {
   const el = document.createElement('div');
   el.className = 'cs-item cs-pop';
   el.innerHTML = csTypingHTML(it.who);
   this.list.insertBefore(el, this.list.querySelector(':scope > .cs-waiting') || null);
   csScrollEnd(el);
   this.typing = { idx, el, timer: setTimeout(() => this.finishTyping(), Math.min(1500, ms + Math.min(400, it.text.length * 6))) };
  } else this.showAt(idx);
  this.onChange();
  return true;
 }
 back() {
  if (this.typing) { clearTimeout(this.typing.timer); this.typing.el.remove(); this.i = this.typing.idx; this.typing = null; }
  else if (this.i > (this.floor || 0)) { this.i--; [...this.list.querySelectorAll(':scope > .cs-item')].pop()?.remove(); }
  this.onChange();
 }
 all() {
  if (this.typing) { clearTimeout(this.typing.timer); this.typing.el.remove(); this.i = this.typing.idx; this.typing = null; }
  while (this.i < this.items.length) { this.render(this.i, false); this.i++; }
  csScrollEnd([...this.list.querySelectorAll(':scope > .cs-item')].pop(), true);
  this.onChange();
 }
 /** ของเก่าที่แสดงไว้เลย ไม่มีเสียง ไม่นับเป็นของที่ต้องแตะ */
 preload(items) {
  this.items = items.concat(this.items);
  while (this.i < items.length) { this.render(this.i, false).classList.add('cs-old'); this.i++; }
  this.floor = this.i;
 }
 append(items, reveal) {
  const wasDone = this.done;
  this.items.push(...items);
  if (reveal || wasDone) this.next(); else this.onChange();
 }
}

// ══ หน้าอ่าน ══
let csReader = null; // { el, player, auto }
let csGenerating = false;
let csSentByReader = false;
function csItemsForMessage(mesId) {
 const m = (csCtx().chat || [])[mesId];
 if (!m || m.is_system) return [];
 return csParse(m.mes, { isUser: !!m.is_user, owner: m.name });
}
function csItemsForChat(from, to) {
 const chat = csCtx().chat || [];
 const out = [];
 for (let i = Math.max(0, from || 0); i < (to === undefined ? chat.length : to); i++) out.push(...csItemsForMessage(i));
 return out;
}
function csReaderHTML(title) {
 const s = csCfg();
 return `
  <div class="cs-top">
   <button class="cs-btn" data-cs="close" title="กลับ"><i class="fa-solid fa-chevron-left"></i></button>
   <div class="cs-title"><b>${csEsc(title || csCharName() || 'แชทนิยาย')}</b><small class="cs-sub"></small></div>
   <button class="cs-btn" data-cs="auto" title="เล่นอัตโนมัติ"><i class="fa-solid fa-play"></i></button>
   <button class="cs-btn" data-cs="more" title="เพิ่มเติม"><i class="fa-solid fa-ellipsis"></i></button>
   <div class="cs-menu">
    <button data-cs="back"><i class="fa-solid fa-rotate-left"></i>ย้อนกลับหนึ่งฟอง</button>
    <button data-cs="all"><i class="fa-solid fa-forward-fast"></i>แสดงทั้งหมด</button>
    <button data-cs="settings"><i class="fa-solid fa-sliders"></i>ปรับแต่ง</button>
   </div>
  </div>
  <div class="cs-progress"><i></i></div>
  <div class="cs-body" data-cs="tap"><div class="cs-list"></div>
   <div class="cs-hint">แตะเพื่ออ่านต่อ</div>
   <div class="cs-end"><span>อ่านถึงล่าสุดแล้ว</span></div>
  </div>
  ${s.showInput ? `<div class="cs-inputbar">
   <textarea class="cs-input" rows="1" placeholder="พิมพ์ข้อความ… หรือกดส่งเลย" title="ช่องว่างแล้วกดส่ง = ให้บอทเขียนต่อ"></textarea>
   <button class="cs-send" data-cs="send" title="ส่ง"><i class="fa-solid fa-paper-plane"></i></button>
  </div>` : ''}`;
}
function csOpenReader(items, title, pre) {
 csCloseReader(true);
 if ((!items || !items.length) && !(pre && pre.length) && !csCfg().showInput) { csToast('ไม่มีข้อความให้อ่าน'); return null; }
 const el = document.createElement('div');
 el.id = 'cs-reader';
 csApplyVars(el);
 csLoadCurrentFont();
 el.innerHTML = csReaderHTML(title);
 document.body.appendChild(el);
 const player = new CsPlayer(el.querySelector('.cs-list'), items || [], () => csReaderUpdate());
 csReader = { el, player, auto: null };
 if (pre && pre.length) player.preload(pre);
 el.addEventListener('click', csReaderClick);
 el.addEventListener('pointerdown', () => { if (csCfg().sound !== 'none') csAc(); }, { passive: true, once: true });
 csBindInput(el);
 requestAnimationFrame(() => el.classList.add('show'));
 if (csGenerating) csShowWaiting(true);
 if (player.items.length > player.i) player.next(); else csReaderUpdate();
 return csReader;
}
function csReaderUpdate() {
 if (!csReader) return;
 const { el, player } = csReader;
 const total = player.items.length - (player.floor || 0);
 const shown = Math.min(player.i, player.items.length) - (player.floor || 0);
 el.querySelector('.cs-progress i').style.width = (total ? Math.round(shown / total * 100) : 100) + '%';
 const sub = el.querySelector('.cs-sub');
 if (sub) sub.textContent = csGenerating ? 'กำลังพิมพ์…' : (total ? `${shown}/${total}` : '');
 el.classList.toggle('done', player.done);
 el.classList.toggle('generating', csGenerating);
 const send = el.querySelector('.cs-send i');
 if (send) send.className = csGenerating ? 'fa-solid fa-stop' : 'fa-solid fa-paper-plane';
 if (player.done) csStopAuto();
}
function csShowWaiting(on) {
 if (!csReader) return;
 const list = csReader.el.querySelector('.cs-list');
 let w = list.querySelector(':scope > .cs-waiting');
 if (on && !w) {
  w = document.createElement('div');
  w.className = 'cs-waiting';
  w.innerHTML = csTypingHTML(csCharName() || '?');
  list.appendChild(w);
  csScrollEnd(w);
 } else if (!on && w) w.remove();
 csReaderUpdate();
}
function csStopAuto() {
 if (!csReader || !csReader.auto) return;
 clearTimeout(csReader.auto);
 csReader.auto = null;
 const b = csReader.el.querySelector('[data-cs="auto"] i');
 if (b) b.className = 'fa-solid fa-play';
}
function csAutoStep() {
 if (!csReader) return;
 const p = csReader.player;
 if (p.done) return csStopAuto();
 p.next();
 const cur = p.items[Math.max(0, p.i - 1)];
 const base = 900 + Math.min(2600, (cur ? cur.text.length : 20) * 45);
 csReader.auto = setTimeout(csAutoStep, base / Math.max(.3, csCfg().autoSpeed) + (p.typing ? csCfg().typingMs : 0));
}
function csReaderClick(e) {
 const b = e.target.closest('[data-cs]');
 const menu = csReader && csReader.el.querySelector('.cs-menu');
 if (menu && menu.classList.contains('open') && !e.target.closest('.cs-menu')) { menu.classList.remove('open'); if (!b || b.dataset.cs === 'tap') return; }
 if (!b || !csReader) return;
 const a = b.dataset.cs;
 if (a !== 'tap') e.stopPropagation();
 if (a === 'close') return csCloseReader();
 if (a === 'more') return menu && menu.classList.toggle('open');
 if (a === 'back') { menu && menu.classList.remove('open'); csStopAuto(); return csReader.player.back(); }
 if (a === 'all') { menu && menu.classList.remove('open'); csStopAuto(); return csReader.player.all(); }
 if (a === 'settings') { menu && menu.classList.remove('open'); return csOpenSettings(); }
 if (a === 'send') return csGenerating ? csStopGeneration() : csSend();
 if (a === 'auto') {
  if (csReader.auto) return csStopAuto();
  b.querySelector('i').className = 'fa-solid fa-pause';
  return csAutoStep();
 }
 if (a === 'tap') { if (window.getSelection && String(window.getSelection()).length) return; csStopAuto(); csReader.player.next(); }
}
function csCloseReader(instant) {
 if (!csReader) return;
 document.getElementById('cs-settings') && csCloseSettings();
 csStopAuto();
 const el = csReader.el;
 if (csReader.player.typing) clearTimeout(csReader.player.typing.timer);
 csReader = null;
 if (instant) { el.remove(); return; }
 el.classList.remove('show');
 setTimeout(() => el.remove(), 220);
}
function csKey(e) {
 if (csNovel && !document.getElementById('cs-settings') && e.key === 'Escape') {
  e.preventDefault();
  if (csNovel.el.classList.contains('cmt-open')) { csCmtClose(); return; }
  if (e.target && /^(TEXTAREA|INPUT)$/.test(e.target.tagName)) e.target.blur(); else csCloseNovel();
  return;
 }
 if (!csReader || document.getElementById('cs-settings')) return;
 const typingInField = e.target && /^(TEXTAREA|INPUT|SELECT)$/.test(e.target.tagName);
 if (e.key === 'Escape') { e.preventDefault(); if (typingInField) e.target.blur(); else csCloseReader(); return; }
 if (typingInField) return;
 if (e.key === ' ' || e.key === 'Enter' || e.key === 'ArrowRight' || e.key === 'ArrowDown') { e.preventDefault(); csStopAuto(); csReader.player.next(); }
 else if (e.key === 'ArrowLeft' || e.key === 'Backspace') { e.preventDefault(); csStopAuto(); csReader.player.back(); }
}
function csOpenMessage(mesId) {
 const chat = csCtx().chat || [];
 const m = chat[mesId];
 const hist = Math.max(0, csCfg().history | 0);
 let from = mesId, count = 0;
 while (from > 0 && count < hist) { from--; if (chat[from] && !chat[from].is_system) count++; }
 return csOpenReader(csItemsForMessage(mesId), m && !m.is_user ? m.name : csCharName(), csItemsForChat(from, mesId));
}
function csLastCharMesId() {
 const chat = csCtx().chat || [];
 for (let i = chat.length - 1; i >= 0; i--) if (chat[i] && !chat[i].is_user && !chat[i].is_system) return i;
 return -1;
}

// ══ พิมพ์ส่งจากหน้าอ่าน ══
function csSend() {
 const host = csReader ? csReader.el : csNovel ? csNovel.el : null;
 if (!host) return false;
 const ta = host.querySelector('.cs-input');
 const text = ta ? ta.value.trim() : '';
 if (csGenerating) { csToast('รอให้ตอบเสร็จก่อนนะ'); return false; }
 const st = document.getElementById('send_textarea');
 const btn = document.getElementById('send_but');
 if (!st || !btn) { csToast('หาช่องส่งข้อความของ SillyTavern ไม่เจอ'); return false; }
 if (!text) {
  // ช่องว่าง = กดส่งเปล่าแบบ SillyTavern ให้บอทเขียนต่อ
  if (st.value.trim()) { st.value = ''; st.dispatchEvent(new Event('input', { bubbles: true })); }
  if (csReader) csReader.player.all();
  btn.click();
  return true;
 }
 st.value = text;
 st.dispatchEvent(new Event('input', { bubbles: true }));
 ta.value = ''; ta.style.height = 'auto';
 if (csReader) {
  // ฟองของเราขึ้นทันที ไม่ต้องรอ
  csReader.player.all();
  csReader.player.append(csParse(text, { isUser: true, owner: csUserName() }), true);
  csReader.player.all();
  csSentByReader = true;
 }
 btn.click();
 if (csNovel) csNovelRefresh(false);
 return true;
}
function csStopGeneration() {
 const stop = document.getElementById('mes_stop');
 if (stop) stop.click();
 else { try { csCtx().stopGeneration?.(); } catch {} }
}

// ══ โหมดแชทหลักเป็นฟอง ══
const csInlineState = new Map();
let csFresh = false;
function csInlineRender(mesId, fresh) {
 const s = csCfg();
 if (!s.enabled || s.mode !== 'inline') return;
 if (s.style === 'novel') return csNovelInline(mesId); // ★ 1.2 แชทหลักเป็นหน้านิยาย
 const m = (csCtx().chat || [])[mesId];
 const mes = document.querySelector(`#chat .mes[mesid="${mesId}"]`);
 const box = mes && mes.querySelector('.mes_text');
 if (!m || !box || m.is_system) return;
 if (m.is_user && !/^[^:：\n]{1,40}[:：]/m.test(m.mes || '')) return;
 const items = csParse(m.mes, { isUser: !!m.is_user, owner: m.name });
 if (!items.length) return;
 csLoadCurrentFont();
 box.innerHTML = `<div class="cs-inline"><div class="cs-list"></div><div class="cs-more" data-cs-more><span></span><button class="cs-allbtn" data-cs-all>แสดงทั้งหมด</button></div></div>`;
 const wrap = box.firstElementChild;
 csApplyVars(wrap);
 const list = wrap.querySelector('.cs-list');
 const upd = () => {
  const more = wrap.querySelector('[data-cs-more]');
  wrap.classList.toggle('done', p.done);
  if (more) more.querySelector('span').textContent = `แตะเพื่ออ่านต่อ · เหลือ ${p.items.length - p.i} ฟอง`;
  if (p.done) csInlineState.delete(mesId);
 };
 const p = new CsPlayer(list, items, upd);
 const prev = csInlineState.get(mesId);
 if (fresh || (prev && !prev.done)) {
  const shown = prev && !fresh ? prev.i : 0;
  for (let k = 0; k < shown; k++) p.render(k, false);
  p.i = shown;
  csInlineState.set(mesId, p);
  if (!shown) p.next();
  upd();
 } else { p.all(); wrap.classList.add('done'); }
}
function csInlineClick(e) {
 const wrap = e.target.closest('.cs-inline');
 if (!wrap || wrap.classList.contains('done')) return;
 const mes = wrap.closest('.mes');
 const p = csInlineState.get(mes ? +mes.getAttribute('mesid') : NaN);
 if (!p) return;
 e.stopPropagation();
 if (e.target.closest('[data-cs-all]')) p.all(); else p.next();
}
function csInlineAll() {
 const s = csCfg();
 document.querySelectorAll('#chat .mes').forEach(m => {
  const id = +m.getAttribute('mesid');
  csRestore(id);
  if (!(s.enabled && s.mode === 'inline')) return;
  csInlineRender(id, false);
 });
}
function csRestore(mesId) {
 const box = document.querySelector(`#chat .mes[mesid="${mesId}"] .mes_text`);
 if (!box || !box.querySelector('.cs-inline, .cs-ninline')) return;
 try {
  const ctx = csCtx();
  const m = ctx.chat[mesId];
  box.innerHTML = typeof ctx.messageFormatting === 'function' ? ctx.messageFormatting(m.mes, m.name, m.is_system, m.is_user, mesId) : csEsc(m.mes).replace(/\n/g, '<br>');
 } catch {}
}

// ══ ปุ่มบนข้อความ + เมนูไม้กายสิทธิ์ ══
function csAddMesButton(mesId) {
 const mes = document.querySelector(`#chat .mes[mesid="${mesId}"]`);
 const extra = mes && mes.querySelector('.extraMesButtons');
 if (!extra || extra.querySelector('.cs-mes-btn')) return;
 const b = document.createElement('div');
 b.className = 'mes_button cs-mes-btn fa-solid fa-book-open interactable';
 b.title = 'อ่านแบบนิยายแชท';
 b.tabIndex = 0;
 extra.prepend(b);
}
function csAddAllButtons() { document.querySelectorAll('#chat .mes').forEach(m => csAddMesButton(m.getAttribute('mesid'))); }
function csWandMenu() {
 const menu = document.getElementById('extensionsMenu');
 if (!menu || document.getElementById('cs-wand')) return;
 const mk = (id, icon, label, fn) => {
  const a = document.createElement('div');
  a.id = id;
  a.className = 'list-group-item flex-container flexGap5 interactable';
  a.innerHTML = `<div class="fa-solid ${icon} extensionsMenuExtensionButton"></div><span>${label}</span>`;
  a.addEventListener('click', fn);
  menu.appendChild(a);
 };
 mk('cs-wand', 'fa-book-open', 'เปิดหน้าอ่าน', () => csOpenLatest());
 mk('cs-wand-novel', 'fa-book-bookmark', 'อ่านแบบนิยาย', () => csOpenNovel());
 mk('cs-wand-all', 'fa-book', 'อ่านทั้งแชท', () => csCfg().style === 'novel' ? csOpenNovel(0, true) : csOpenReader(csItemsForChat(0), 'ทั้งแชท'));
 mk('cs-wand-set', 'fa-sliders', 'ปรับแต่งแชทนิยาย', () => csOpenSettings());
}

// ══ หน้าปรับแต่ง ══
let csSetTab = 'look';
const CS_TABS = [['look', 'หน้าตา', 'fa-palette'], ['text', 'ตัวอักษร', 'fa-font'], ['novel', 'หน้านิยาย', 'fa-book-bookmark'], ['cmt', 'คอมเมนต์', 'fa-comment-dots'], ['bubble', 'ฟองแชท', 'fa-comment'], ['sound', 'เสียง', 'fa-volume-high'], ['chars', 'ตัวละคร', 'fa-user-group'], ['read', 'การอ่าน', 'fa-book-open']];
function csGet(path) { return path.split('.').reduce((o, k) => (o == null ? o : o[k]), csCfg()); }
function csSet(path, val) {
 const s = csCfg();
 const ks = path.split('.');
 let o = s;
 ks.slice(0, -1).forEach(k => { if (!o[k] || typeof o[k] !== 'object') o[k] = {}; o = o[k]; });
 o[ks[ks.length - 1]] = val;
}
const csRow = (label, control, sub) => `<div class="cs-srow"><div class="cs-slb"><span>${label}</span>${sub ? `<small>${sub}</small>` : ''}</div><div class="cs-sctl">${control}</div></div>`;
const csToggle = (k, label, sub) => csRow(label, `<label class="cs-switch"><input type="checkbox" data-k="${k}"${csGet(k) ? ' checked' : ''}><span></span></label>`, sub);
const csSelect = (k, label, opts, sub) => csRow(label, `<select class="cs-sel" data-k="${k}">${opts.map(([v, l]) => `<option value="${v}"${String(csGet(k)) === String(v) ? ' selected' : ''}>${l}</option>`).join('')}</select>`, sub);
const csRange = (k, label, min, max, step, unit) => csRow(`${label} <b class="cs-val" data-v="${k}">${csGet(k)}${unit || ''}</b>`, `<input type="range" class="cs-range" data-k="${k}" data-unit="${unit || ''}" min="${min}" max="${max}" step="${step}" value="${csGet(k)}">`);
const csSeg = (k, opts) => `<div class="cs-seg2">${opts.map(([v, l]) => `<button data-seg="${k}" data-val="${v}" class="${String(csGet(k)) === String(v) ? 'on' : ''}">${l}</button>`).join('')}</div>`;
function csPreviewItems() {
 const cn = csCharName() || 'ตัวละคร';
 return [
  { k: 'scene', text: 'ห้องสมุด / หกโมงเย็น' },
  { k: 'narr', text: 'แสงแดดสุดท้ายลอดผ่านหน้าต่าง' },
  { k: 'say', who: cn, text: 'ยังไม่กลับบ้านอีกเหรอ' },
  { k: 'say', who: cn, text: 'ฉันรออยู่ตั้งนานแล้วนะ' },
  { k: 'think', who: cn, text: 'จะบอกดีไหมนะ' },
  { k: 'say', who: csUserName(), text: 'ขอโทษ เดี๋ยวไปด้วยกัน' },
 ];
}
function csRenderPreview() {
 const box = document.querySelector('#cs-settings .cs-preview');
 if (!box) return;
 csApplyVars(box);
 csLoadCurrentFont();
 box.classList.toggle('novel', csCfg().style === 'novel');
 if (csCfg().style === 'novel') {
  csApplyNovelVars(box);
  const cn = csCharName() || 'ตัวละคร';
  box.innerHTML = `<div class="cs-page"><section class="cs-chapter"><header class="cs-chead"><span class="cs-cbook">${csEsc(csCharName() || 'ชื่อเรื่อง')}</span><span class="cs-cno">${csChWord()}ที่ 12</span><h2 class="cs-ctitle">คำตอบที่ห้องสมุด</h2><span class="cs-cline"></span></header>
   <div class="cs-nuser${csCfg().userInNovel === 'mark' ? ' mark' : ''}"${csCfg().userInNovel === 'hide' ? ' hidden' : ''}><p class="cs-np">${csEsc(csUserName())} ผลักประตูห้องสมุดเข้าไปเบา ๆ</p></div>
   <p class="cs-np">แสงแดดสุดท้ายลอดผ่านหน้าต่างบานสูง ${csEsc(cn)}เงยหน้าขึ้นจากหนังสือ “ยังไม่กลับบ้านอีกเหรอ ฉันรออยู่ตั้งนานแล้วนะ”</p>
   <p class="cs-np">เสียงนาฬิกาบนผนังเดินช้าลงราวกับจงใจ</p></section></div>`;
  return;
 }
 const items = csPreviewItems();
 box.innerHTML = `<div class="cs-list">${items.map((it, i) => `<div class="cs-item">${csItemHTML(it, items[i - 1])}</div>`).join('')}</div>`;
}
function csSpeakers() {
 const names = new Set();
 try {
  (csCtx().chat || []).slice(-60).forEach(m => { if (!m || m.is_system || m.is_user) return; names.add(String(m.name || '').trim()); csParse(m.mes, { owner: m.name }).forEach(it => { if (it.who && !csIsUser(it.who)) names.add(it.who); }); });
 } catch {}
 const cn = csCharName(); if (cn) names.add(cn);
 Object.keys(csCfg().chars).forEach(n => names.add(n));
 return [...names].filter(Boolean).slice(0, 40);
}
function csTabHTML(tab) {
 const s = csCfg();
 if (tab === 'look') {
  const c = csColors();
  const card = (id, p) => `<button class="cs-preset${s.preset === id ? ' on' : ''}" data-preset="${id}" style="background:${p.bg}">
   <span class="cs-pv-b in" style="background:${p.inBg}"></span><span class="cs-pv-b out" style="background:${p.outBg}"></span><span class="cs-pv-b in s" style="background:${p.inBg}"></span>
   <i style="color:${p.ink}">${csEsc(id === 'custom' ? 'ปรับเอง' : CS_PRESETS[id].name)}</i></button>`;
  return `<div class="cs-card"><div class="cs-cardh">ธีมสำเร็จรูป</div><div class="cs-presets">${Object.keys(CS_PRESETS).map(id => card(id, CS_PRESETS[id].c)).join('')}${card('custom', { ...CS_PRESETS.classic.c, ...(s.custom || {}) })}</div></div>
   <div class="cs-card"><div class="cs-cardh">ปรับสีเอง <small>แก้สีไหนก็ได้ ระบบจะเปลี่ยนเป็นธีม "ปรับเอง" ให้</small></div>
    <div class="cs-colors">${CS_COLOR_KEYS.map(k => `<label class="cs-color"><input type="color" data-color="${k}" value="${c[k]}"><span class="cs-sw" style="background:${c[k]}"></span><span class="cs-cl"><b>${CS_COLOR_LABELS[k]}</b><small>${c[k]}</small></span></label>`).join('')}</div>
   </div>`;
 }
 if (tab === 'text') {
  csLoadFonts(CS_FONTS);
  return `<div class="cs-card"><div class="cs-cardh">ฟอนต์</div><div class="cs-fonts">${CS_FONTS.map(f => `<button class="cs-font${s.font === f.id ? ' on' : ''}" data-font="${f.id}"><span style="font-family:${f.id === 'custom' ? (s.fontCustom ? `'${csEsc(s.fontCustom)}'` : 'inherit') : f.ff}">กขค Aa 123</span><small>${csEsc(f.id === 'custom' && s.fontCustom ? s.fontCustom : f.name)}</small></button>`).join('')}</div>
   ${s.font === 'custom' ? `<div class="cs-srow"><div class="cs-slb"><span>ชื่อฟอนต์</span><small>ชื่อจาก Google Fonts หรือฟอนต์ที่มีในเครื่อง</small></div><div class="cs-sctl"><input class="cs-text" data-k="fontCustom" value="${csEsc(s.fontCustom)}" placeholder="เช่น Chonburi"></div></div>` : ''}</div>
   <div class="cs-card">${csRange('fontSize', 'ขนาดตัวอักษร', 12, 24, 1, 'px')}${csRange('lineHeight', 'ระยะบรรทัด', 1.2, 2.2, .05, '')}</div>`;
 }
 if (tab === 'cmt') {
  const u = s.cmtUsed || { tokens: 0, calls: 0 };
  return `<div class="cs-hint2">ไอคอนท้ายย่อหน้าในหน้านิยาย แตะแล้วดูว่าคนอ่านรีแอคชันและคอมเมนต์ว่าอะไร เหมือนแอพอ่านนิยาย</div>
   <div class="cs-card">${csToggle('cmtOn', 'คอมเมนต์และรีแอคชันท้ายย่อหน้า', 'เปิดแล้วมีไอคอนท้ายทุกย่อหน้า ยังไม่ใช้โทเคนจนกว่าจะกดเรียกคนอ่าน')}${csToggle('cmtJanya', 'มี janyaahri มาคอมเมนต์ด้วย', 'สาวสดใส น่ารัก ขี้อ้อน เจ้าชู้นิด ๆ บางทีก็เบื่อ งอนง่าย · เพิ่มราว 50 โทเคนต่อครั้ง')}${csToggle('cmtAuto', 'เรียกคอมเมนต์เองทุกบทใหม่', 'สะดวกแต่ใช้โทเคนทุกบท ปิดไว้ = เรียกเฉพาะบทที่กดดู')}</div>
   <div class="cs-card"><div class="cs-cardh">จำนวนคอมเมนต์ต่อบท</div>${csSeg('cmtAmount', [['few', 'น้อย'], ['normal', 'ปกติ'], ['many', 'เยอะ']])}</div>
   <div class="cs-card cs-tokcard"><div class="cs-cardh">โทเคนที่ใช้</div>
    <div class="cs-srow"><div class="cs-slb"><span>คอมเมนต์ต่อครั้ง</span><small>ส่งเฉพาะเนื้อบทนั้น (ตัดย่อหน้าละ 240 ตัวอักษร) ไม่แนบแชท ไม่เข้าโรลหลัก</small></div><div class="cs-sctl"><b data-tok="cmt">…</b></div></div>
    <div class="cs-srow"><div class="cs-slb"><span>ใช้ไปแล้วทั้งหมด</span><small>${u.calls} ครั้ง</small></div><div class="cs-sctl"><b>${u.tokens.toLocaleString()} โทเคน</b><button class="cs-btn2" data-act="cmt-reset">ล้างตัวนับ</button></div></div>
    <div class="cs-srow"><div class="cs-slb"><span>คำสั่งรูปแบบที่แทรกในโรลหลัก</span><small>${s.enabled && s.forceFormat ? 'แทรกทุกเทิร์น ปิดได้ที่แท็บการอ่าน' : 'ปิดอยู่ ไม่ใช้โทเคน'}</small></div><div class="cs-sctl"><b data-tok="format">…</b></div></div>
   </div>`;
 }
 if (tab === 'novel') {
  return `<div class="cs-card">${csRange('novelFontSize', 'ขนาดตัวอักษร', 12, 30, 1, 'px')}${csRange('novelLH', 'ระยะบรรทัด', 1.3, 2.6, .05, '')}</div>
   <div class="cs-card"><div class="cs-cardh">เรียกแต่ละช่วงว่า</div>${csSeg('chapterWord', [['บท', 'บทที่ 1'], ['ตอน', 'ตอนที่ 1']])}</div>
   <div class="cs-card">${csToggle('novelIndent', 'ย่อหน้าบรรทัดแรก')}${csToggle('novelJustify', 'จัดข้อความเต็มแนว', 'ภาษาไทยมีช่องว่างน้อย บางบรรทัดอาจเว้นห่าง')}</div>
   <div class="cs-card">${csRange('paraGap', 'ระยะห่างระหว่างย่อหน้า', 0, 2, .1, 'em')}${csRange('pageWidth', 'ความกว้างหน้ากระดาษ', 460, 900, 20, 'px')}</div>
   <div class="cs-card"><div class="cs-cardh">ส่วนที่เราเขียน</div>${csSeg('userInNovel', [['same', 'เหมือนเนื้อเรื่อง'], ['mark', 'มีเส้นกำกับ'], ['hide', 'ซ่อน']])}</div>
   <div class="cs-hint2">สีและฟอนต์ใช้ร่วมกับแท็บหน้าตาและตัวอักษร · ปุ่ม Aa ในหน้านิยายปรับขนาด ระยะบรรทัด พื้นหลัง และฟอนต์ได้ทันที · แตะกลางหน้าเพื่อซ่อนหรือแสดงแถบ</div>`;
 }
 if (tab === 'bubble') {
  return `<div class="cs-card">${csRange('radius', 'ความมนของฟอง', 2, 26, 1, 'px')}${csRange('bubbleMax', 'ความกว้างสูงสุด', 55, 95, 1, '%')}</div>
   <div class="cs-card"><div class="cs-cardh">รูปตัวละคร</div>${csSeg('avatar', [['circle', 'วงกลม'], ['rounded', 'มน'], ['square', 'เหลี่ยม'], ['none', 'ไม่แสดง']])}</div>
   <div class="cs-card"><div class="cs-cardh">บรรยาย</div>${csSeg('narrStyle', [['plain', 'ตัวหนังสือกลางจอ'], ['box', 'ในกล่อง'], ['italic', 'ตัวเอียง']])}</div>
   <div class="cs-card">${csToggle('showNames', 'แสดงชื่อเหนือฟอง')}${csSelect('nameColor', 'สีชื่อ', [['theme', 'ตามธีม'], ['rainbow', 'สีต่างกันรายคน']])}${csSelect('userSide', 'ฝั่งของเรา', [['right', 'ขวา'], ['left', 'ซ้าย']])}</div>`;
 }
 if (tab === 'sound') {
  return `<div class="cs-card"><div class="cs-cardh">เสียงฟองเด้ง <small>แตะเพื่อเลือกและฟัง</small></div><div class="cs-sounds">${CS_SOUNDS.map(x => `<button class="cs-sound${s.sound === x.id ? ' on' : ''}" data-sound="${x.id}"><i class="fa-solid ${x.id === 'none' ? 'fa-volume-xmark' : x.id === 'custom' ? 'fa-file-audio' : 'fa-music'}"></i><span>${x.name}</span></button>`).join('')}</div>
   ${s.sound === 'custom' ? `<div class="cs-srow"><div class="cs-slb"><span>ไฟล์เสียงของฉัน</span><small>${s.customSound ? (s.customSound.startsWith('data:') ? 'อัปโหลดไว้แล้ว' : csEsc(s.customSound.slice(0, 60))) : 'ยังไม่มี · ไฟล์สั้น ๆ ไม่เกิน 200 KB'}</small></div><div class="cs-sctl cs-sctl-col"><label class="cs-btn2">เลือกไฟล์<input type="file" accept="audio/*" data-upload="sound" hidden></label><input class="cs-text" data-k="customSound" placeholder="หรือวางลิงก์ mp3/ogg" value="${s.customSound && !s.customSound.startsWith('data:') ? csEsc(s.customSound) : ''}"></div></div>` : ''}</div>
   <div class="cs-card">${csRange('volume', 'ความดัง', 0, 1, .05, '')}${csToggle('pitchVary', 'เสียงสูงต่ำต่างกันรายตัวละคร', 'ฟังแล้วรู้ว่าใครพูด')}${csToggle('narrSound', 'มีเสียงตอนบรรยายและเปลี่ยนฉาก')}${csToggle('vibrate', 'สั่นเบา ๆ บนมือถือ', 'ใช้ได้บนมือถือ Android')}
    <div class="cs-srow"><div class="cs-slb"><span>ลองฟังทั้งชุด</span></div><div class="cs-sctl"><button class="cs-btn2" data-act="test-sound"><i class="fa-solid fa-play"></i> ฟัง</button></div></div></div>`;
 }
 if (tab === 'chars') {
  const names = csSpeakers();
  if (!names.length) return `<div class="cs-empty">ยังไม่มีตัวละครในแชทนี้</div>`;
  return `<div class="cs-hint2">ตั้งสีฟองและเสียงแยกให้แต่ละตัวละครได้ ว่างไว้ = ตามธีม</div>` + names.map(n => {
   const o = s.chars[n] || {};
   return `<div class="cs-card cs-charrow"><div class="cs-charh">${csAvatarHTML(n)}<b>${csEsc(n)}</b>${o.color || o.sound ? `<button class="cs-link" data-char="${csEsc(n)}" data-f="reset">ล้าง</button>` : ''}</div>
    <div class="cs-charc"><label class="cs-color sm"><input type="color" data-char="${csEsc(n)}" data-f="color" value="${o.color || csColors().inBg}"><span class="cs-sw" style="background:${o.color || csColors().inBg}"></span><span class="cs-cl"><b>สีฟอง</b><small>${o.color ? o.color : 'ตามธีม'}</small></span></label>
    <select class="cs-sel" data-char="${csEsc(n)}" data-f="sound"><option value="">เสียงตามค่าหลัก</option>${CS_SOUNDS.filter(x => x.id !== 'custom').map(x => `<option value="${x.id}"${o.sound === x.id ? ' selected' : ''}>${x.name}</option>`).join('')}</select></div></div>`;
  }).join('');
 }
 // read
 return `<div class="cs-card"><div class="cs-cardh">แบบการอ่าน</div>${csSeg('style', [['chat', 'แชทนิยาย'], ['novel', 'นิยาย']])}<div class="cs-cardh">แสดงที่</div>${csSeg('mode', [['reader', 'หน้าอ่านเปิดทับแชท'], ['inline', 'ในแชทหลัก']])}</div>
  <div class="cs-card">${csSelect('plainUser', 'ข้อความของเราที่ไม่มีเครื่องหมาย', [['auto', 'เดาให้'], ['say', 'เป็นคำพูด'], ['narr', 'เป็นบรรยาย']], 'ในเครื่องหมายคำพูด = คำพูด · *ดอกจัน* = บรรยาย · ไม่มีเลยตามที่ตั้งนี้')}</div>
  <div class="cs-card cs-tokcard"><div class="cs-srow"><div class="cs-slb"><span>คำสั่งรูปแบบกินโทเคนต่อเทิร์น</span><small>${s.enabled && s.forceFormat ? 'แทรกเข้าโรลหลักทุกครั้งที่บอทตอบ' : 'ปิดอยู่ ไม่ใช้โทเคน'}</small></div><div class="cs-sctl"><b data-tok="format">…</b></div></div></div>
  <div class="cs-card">${csToggle('enabled', 'เปิดใช้แชทนิยาย')}${csToggle('autoOpen', 'บอทตอบเสร็จแล้วเปิดหน้าอ่านเอง', 'โหมดหน้าอ่าน')}${csToggle('forceFormat', 'สั่งบอทเขียนตามแบบที่เลือก', 'แชทนิยาย: ชื่อ: คำพูด · นิยาย: ย่อหน้าต่อเนื่อง')}</div>
  <div class="cs-card">${csToggle('showInput', 'ช่องพิมพ์ในหน้าอ่าน')}${csToggle('enterSend', 'กด Enter เพื่อส่ง', 'Shift+Enter ขึ้นบรรทัดใหม่')}${csRange('history', 'แสดงข้อความก่อนหน้า', 0, 20, 1, ' ข้อความ')}</div>
  <div class="cs-card">${csRange('typingMs', 'จุดพิมพ์ก่อนฟองเด้ง', 0, 1200, 50, ' ms')}${csRange('autoSpeed', 'ความเร็วเล่นอัตโนมัติ', .5, 3, .25, 'x')}</div>
  <div class="cs-card cs-btnrow"><button class="cs-btn2" data-act="read-last"><i class="fa-solid fa-book-open"></i> เปิดหน้าอ่าน</button><button class="cs-btn2" data-act="read-all"><i class="fa-solid fa-book"></i> อ่านทั้งแชท</button><button class="cs-btn2 danger" data-act="reset"><i class="fa-solid fa-rotate"></i> คืนค่าเริ่มต้น</button></div>
  <div class="cs-foot">แชทนิยาย ${CS_VERSION} · แตะหรือ Space อ่านต่อ · ลูกศรซ้ายย้อนกลับ · Esc ปิด</div>`;
}
function csOpenSettings(tab) {
 if (tab) csSetTab = tab;
 document.getElementById('cs-settings')?.remove();
 const el = document.createElement('div');
 el.id = 'cs-settings';
 el.innerHTML = `<div class="cs-sheet">
  <div class="cs-grab"></div>
  <div class="cs-sheeth"><b>ปรับแต่งแชทนิยาย</b><button class="cs-x" data-act="close" title="ปิด"><i class="fa-solid fa-xmark"></i></button></div>
  <div class="cs-preview"></div>
  <div class="cs-tabs">${CS_TABS.map(([id, l, ic]) => `<button data-tab="${id}" class="${csSetTab === id ? 'on' : ''}"><i class="fa-solid ${ic}"></i><span>${l}</span></button>`).join('')}</div>
  <div class="cs-sbody"></div>
 </div>`;
 document.body.appendChild(el);
 el.addEventListener('click', csSettingsClick);
 el.addEventListener('input', csSettingsInput);
 el.addEventListener('change', csSettingsChange);
 csRenderSettingsBody();
 requestAnimationFrame(() => el.classList.add('show'));
}
function csRenderSettingsBody() {
 const el = document.getElementById('cs-settings');
 if (!el) return;
 el.classList.toggle('cs-sdark', csLum(csColors().bg) < .2);
 el.querySelectorAll('.cs-tabs button').forEach(b => b.classList.toggle('on', b.dataset.tab === csSetTab));
 const body = el.querySelector('.cs-sbody');
 const top = body.scrollTop;
 body.innerHTML = csTabHTML(csSetTab);
 body.scrollTop = top;
 csFillTokens(body);
 csRenderPreview();
}
/** เติมตัวเลขโทเคนในหน้าตั้งค่า (นับจริงด้วยตัวนับของ SillyTavern) */
function csFillTokens(root) {
 const s = csCfg();
 root.querySelectorAll('[data-tok="format"]').forEach(async el => {
  if (!(s.enabled && s.forceFormat)) { el.textContent = '0 โทเคน'; return; }
  el.textContent = `~${(await csCountTokens(csFormatPrompt())).toLocaleString()} โทเคน`;
 });
 root.querySelectorAll('[data-tok="cmt"]').forEach(async el => {
  const id = csLastCharMesId();
  if (id < 0) { el.textContent = 'ยังไม่มีบท'; return; }
  const e = await csCmtEstimate(id);
  el.textContent = `~${e.total.toLocaleString()} โทเคน`;
  el.title = `บทล่าสุด: ส่ง ~${e.inTok} · ได้กลับ ~${e.outTok}`;
 });
}
function csCloseSettings() {
 const el = document.getElementById('cs-settings');
 if (!el) return;
 el.classList.remove('show');
 setTimeout(() => el.remove(), 220);
}
let csRefreshTimer = null;
function csAfterChange(full) {
 csSave();
 if (csReader) { csApplyVars(csReader.el); if (full) csRerenderReader(); }
 if (csNovel) { csApplyVars(csNovel.el); csApplyNovelVars(csNovel.el); if (full) csNovelRefresh(false); }
 csRenderPreview();
 clearTimeout(csRefreshTimer);
 csRefreshTimer = setTimeout(() => { csApplyPrompt(); csInlineAll(); csSyncDrawer(); }, 120);
}
/** วาดฟองในหน้าอ่านใหม่ (เปลี่ยนฝั่ง ชื่อ รูป) โดยคงตำแหน่งที่อ่านถึง */
function csRerenderReader() {
 if (!csReader) return;
 const p = csReader.player;
 const list = p.list;
 const wait = list.querySelector(':scope > .cs-waiting');
 list.querySelectorAll(':scope > .cs-item').forEach(x => x.remove());
 const upto = p.typing ? p.typing.idx : p.i;
 for (let k = 0; k < upto; k++) { const w = p.render(k, false); if (k < (p.floor || 0)) w.classList.add('cs-old'); }
 if (p.typing) list.insertBefore(p.typing.el, wait || null);
}
function csToCustom() {
 const s = csCfg();
 if (s.preset !== 'custom') { s.custom = { ...csColors() }; s.preset = 'custom'; }
}
function csSettingsClick(e) {
 const el = e.target;
 if (e.target.id === 'cs-settings') return csCloseSettings();
 const t = el.closest('[data-tab]'); if (t) { csSetTab = t.dataset.tab; return csRenderSettingsBody(); }
 const s = csCfg();
 const pr = el.closest('[data-preset]');
 if (pr) { const id = pr.dataset.preset; if (id === 'custom') csToCustom(); else s.preset = id; csAfterChange(); return csRenderSettingsBody(); }
 const f = el.closest('[data-font]');
 if (f) { s.font = f.dataset.font; csAfterChange(); return csRenderSettingsBody(); }
 const snd = el.closest('[data-sound]');
 if (snd) { s.sound = snd.dataset.sound; csAfterChange(); csPlaySound(s.sound, 'in', csCharName()); return csRenderSettingsBody(); }
 const seg = el.closest('[data-seg]');
 if (seg) { const v = seg.dataset.val; csSet(seg.dataset.seg, v); csAfterChange(true); return csRenderSettingsBody(); }
 const ch = el.closest('[data-char][data-f="reset"]');
 if (ch) { delete s.chars[ch.dataset.char]; csAfterChange(true); return csRenderSettingsBody(); }
 const a = el.closest('[data-act]');
 if (!a) return;
 const act = a.dataset.act;
 if (act === 'close') return csCloseSettings();
 if (act === 'cmt-reset') { s.cmtUsed = { tokens: 0, calls: 0 }; csSave(); return csRenderSettingsBody(); }
 if (act === 'test-sound') { [['in', csCharName() || 'A'], ['in', 'B'], ['out', csUserName()], ['narr'], ['scene']].forEach(([k, w], i) => setTimeout(() => csPlaySound(s.sound, k, w), i * 360)); return; }
 if (act === 'read-last') { csCloseSettings(); csOpenLatest(); return; }
 if (act === 'read-all') { csCloseSettings(); if (csCfg().style === 'novel') csOpenNovel(0, true); else csOpenReader(csItemsForChat(0), 'ทั้งแชท'); return; }
 if (act === 'reset') {
  if (!confirm('คืนค่าหน้าตา เสียง และการอ่านทั้งหมดเป็นค่าเริ่มต้น?')) return;
  const keep = { enabled: s.enabled };
  Object.keys(s).forEach(k => delete s[k]);
  Object.assign(s, keep, { _migrated: true });
  csCfg();
  csAfterChange(true);
  return csRenderSettingsBody();
 }
}
function csSettingsInput(e) {
 const el = e.target;
 if (el.dataset.k && el.type === 'range') {
  const v = +el.value;
  csSet(el.dataset.k, v);
  const lab = document.querySelector(`#cs-settings [data-v="${el.dataset.k}"]`);
  if (lab) lab.textContent = v + (el.dataset.unit || '');
  csAfterChange();
  return;
 }
 if (el.dataset.color) {
  csToCustom();
  csCfg().custom[el.dataset.color] = el.value;
  const lab = el.parentElement; lab.querySelector('.cs-sw').style.background = el.value; lab.querySelector('small').textContent = el.value;
  document.querySelectorAll('#cs-settings .cs-preset').forEach(b => b.classList.toggle('on', b.dataset.preset === 'custom'));
  csAfterChange();
  return;
 }
 if (el.dataset.char && el.dataset.f === 'color') {
  const s = csCfg();
  s.chars[el.dataset.char] = { ...(s.chars[el.dataset.char] || {}), color: el.value };
  const lab = el.parentElement; lab.querySelector('.cs-sw').style.background = el.value; lab.querySelector('small').textContent = el.value;
  csAfterChange(true);
 }
}
function csSettingsChange(e) {
 const el = e.target;
 const s = csCfg();
 if (el.dataset.k && el.type === 'checkbox') { csSet(el.dataset.k, el.checked); csAfterChange(true); return; }
 if (el.dataset.k && el.tagName === 'SELECT') { csSet(el.dataset.k, el.value); csAfterChange(true); return; }
 if (el.dataset.k && el.classList.contains('cs-text')) {
  csSet(el.dataset.k, el.value.trim());
  csAfterChange();
  if (el.dataset.k === 'fontCustom') csRenderSettingsBody();
  return;
 }
 if (el.dataset.char && el.dataset.f === 'sound') {
  s.chars[el.dataset.char] = { ...(s.chars[el.dataset.char] || {}), sound: el.value };
  if (!el.value) delete s.chars[el.dataset.char].sound;
  csAfterChange();
  if (el.value) csPlaySound(el.value, 'in', el.dataset.char);
  return;
 }
 if (el.dataset.upload === 'sound' && el.files && el.files[0]) {
  const file = el.files[0];
  if (file.size > 200 * 1024) { csToast('ไฟล์ใหญ่เกิน 200 KB ลองตัดให้สั้นลง หรือใช้ลิงก์แทน'); return; }
  const r = new FileReader();
  r.onload = () => { s.customSound = String(r.result || ''); csAfterChange(); csPlaySound('custom', 'in'); csRenderSettingsBody(); };
  r.readAsDataURL(file);
 }
}

// ══ แผงใน Extensions ของ SillyTavern (ย่อ) ══
function csDrawerHTML() {
 const s = csCfg();
 return `<div class="chat-story-settings"><div class="inline-drawer">
  <div class="inline-drawer-toggle inline-drawer-header"><b>แชทนิยาย (Chat Story)</b><div class="inline-drawer-icon fa-solid fa-circle-chevron-down down"></div></div>
  <div class="inline-drawer-content">
   <label class="checkbox_label"><input type="checkbox" id="cs-enabled"${s.enabled ? ' checked' : ''}><span>เปิดใช้</span></label>
   <label class="cs-dl">แบบการอ่าน <select id="cs-style" class="text_pole"><option value="chat"${s.style === 'chat' ? ' selected' : ''}>แชทนิยาย (ฟองแชท แตะทีละฟอง)</option><option value="novel"${s.style === 'novel' ? ' selected' : ''}>นิยาย (อ่านแบบหนังสือ)</option></select></label>
   <label class="cs-dl">แสดงที่ <select id="cs-mode" class="text_pole"><option value="reader"${s.mode === 'reader' ? ' selected' : ''}>หน้าอ่านเปิดทับแชท</option><option value="inline"${s.mode === 'inline' ? ' selected' : ''}>ในแชทหลัก</option></select></label>
   <label class="checkbox_label"><input type="checkbox" id="cs-force"${s.forceFormat ? ' checked' : ''}><span>สั่งบอทเขียนแบบนิยายแชท</span></label>
   <div class="cs-drawer-btns">
    <div class="menu_button" id="cs-open-settings"><i class="fa-solid fa-sliders"></i> ปรับแต่งทั้งหมด</div>
    <div class="menu_button" id="cs-read-last"><i class="fa-solid fa-book-open"></i> เปิดหน้าอ่าน</div>
    <div class="menu_button" id="cs-read-all"><i class="fa-solid fa-book"></i> อ่านทั้งแชท</div>
   </div>
  </div></div></div>`;
}
function csBindDrawer(root) {
 const s = csCfg();
 const on = (id, ev, fn) => root.querySelector('#' + id)?.addEventListener(ev, fn);
 on('cs-enabled', 'change', e => { s.enabled = e.target.checked; csAfterChange(true); });
 on('cs-mode', 'change', e => { s.mode = e.target.value; csAfterChange(true); });
 on('cs-style', 'change', e => { s.style = e.target.value; csAfterChange(true); csApplyPrompt(); });
 on('cs-force', 'change', e => { s.forceFormat = e.target.checked; csAfterChange(); csApplyPrompt(); });
 on('cs-open-settings', 'click', () => csOpenSettings());
 on('cs-read-last', 'click', () => csOpenLatest());
 on('cs-read-all', 'click', () => csCfg().style === 'novel' ? csOpenNovel(0, true) : csOpenReader(csItemsForChat(0), 'ทั้งแชท'));
}
function csSyncDrawer() {
 const s = csCfg();
 const q = id => document.getElementById(id);
 if (q('cs-enabled')) q('cs-enabled').checked = !!s.enabled;
 if (q('cs-mode')) q('cs-mode').value = s.mode;
 if (q('cs-style')) q('cs-style').value = s.style;
 if (q('cs-force')) q('cs-force').checked = !!s.forceFormat;
}

// ══ โหมดนิยาย (อ่านแบบหนังสือ) ══
let csNovel = null; // { el }
const CS_NOVEL_MAX = 30; // ตอนที่วาดครั้งแรก เก่ากว่านี้กดโหลดเพิ่ม
function csNovelLines(m) {
 const out = [];
 csCleanText(m.mes).split(/\n+/).map(x => x.trim()).filter(Boolean).forEach(line => {
  if (/^[-=*_~]{3,}$/.test(line)) { out.push({ k: 'break' }); return; }
  let r = line.match(/^#{1,4}\s*(.{1,120})$/) || line.match(/^(?:บทที่|ตอนที่|Chapter)\s*\d+\s*[:：.\-–]?\s*(.{1,120})$/i);
  if (r) { out.push({ k: 'title', text: r[1].replace(/[#*]+/g, '').trim() }); return; }
  r = line.match(/^\[([^\]]{1,80})\]$/);
  if (r) { out.push({ k: 'scene', text: r[1].trim() }); return; }
  r = line.match(/^\**\s*([^:：\n]{1,40}?)\s*\**\s*(?:[(（]([^)）]{1,16})[)）])?\s*\**\s*[:：]\s*(.+)$/);
  if (r && csLooksLikeName(r[1].replace(/\*/g, ''))) {
   const who = r[1].replace(/\*/g, '').trim();
   const body = csStripQuotes(r[3].replace(/\*([^*]+)\*/g, '$1'));
   out.push({ k: r[2] && CS_THOUGHT.test(r[2]) ? 'think' : 'say', who, text: body });
   return;
  }
  out.push({ k: 'p', text: line });
 });
 return out;
}
function csNovelFmt(t) {
 return csEsc(t).replace(/\*\*([^*]+)\*\*/g, '<b>$1</b>').replace(/\*([^*]+)\*/g, '<i>$1</i>').replace(/_([^_]+)_/g, '<i>$1</i>');
}
function csNovelLineHTML(l, user, cmt) {
 const tail = cmt ? csCmtButtonHTML(cmt.mes, cmt.i) : '';
 if (l.k === 'break') return `<div class="cs-nbreak">* * *</div>`;
 if (l.k === 'title') return `<p class="cs-nscene"><b>${csNovelFmt(l.text)}</b></p>`;
 if (l.k === 'scene') return `<p class="cs-nscene">${csNovelFmt(l.text)}</p>`;
 if (l.k === 'say') return `<p class="cs-np"><span class="cs-nwho">${csEsc(l.who)}</span> “${csNovelFmt(l.text)}”${tail}</p>`;
 if (l.k === 'think') return `<p class="cs-np cs-nthink">${csNovelFmt(l.text)}${tail}</p>`;
 return `<p class="cs-np">${csNovelFmt(l.text)}${tail}</p>`;
}
/** ตอน = ข้อความของเราที่นำหน้า + คำตอบของบอทหนึ่งข้อความ */
function csNovelChapters() {
 const chat = csCtx().chat || [];
 const chs = [];
 let cur = { user: [], bot: null, ids: [] };
 chat.forEach((m, i) => {
  if (!m || m.is_system) return;
  if (m.is_user) { cur.user.push(m); cur.ids.push(i); return; }
  cur.bot = m; cur.ids.push(i); cur.botId = i;
  chs.push(cur); cur = { user: [], bot: null, ids: [] };
 });
 if (cur.user.length) chs.push(cur); // ข้อความของเราที่ยังรอคำตอบ
 return chs;
}
function csChWord() { return csCfg().chapterWord === 'ตอน' ? 'ตอน' : 'บท'; }
function csNovelChapterHTML(ch, n) {
 const s = csCfg();
 const userPart = s.userInNovel === 'hide' ? '' : ch.user.map(m => `<div class="cs-nuser${s.userInNovel === 'mark' ? ' mark' : ''}">${csNovelLines(m).map(l => csNovelLineHTML(l, true)).join('')}</div>`).join('');
 const lines = ch.bot ? csNovelLines(ch.bot) : [];
 // ชื่อบท: ## ชื่อ > [ฉาก] > ไม่มี
 const title = lines.find(l => l.k === 'title') || lines.find(l => l.k === 'scene');
 const w = csChWord();
 return `<section class="cs-chapter" data-ch="${n}" data-mes="${ch.botId ?? ''}">
  <header class="cs-chead">
   <span class="cs-cbook">${csEsc(csCharName() || '')}</span>
   <span class="cs-cno">${w}ที่ ${n}</span>
   ${title ? `<h2 class="cs-ctitle">${csNovelFmt(title.text)}</h2>` : ''}
   <span class="cs-cline"></span>
  </header>
  ${userPart}
  ${lines.map((l, i) => l === title ? '' : csNovelLineHTML(l, false, s.cmtOn && ch.bot ? { mes: ch.botId, i } : null)).join('')}
  ${ch.bot ? `<footer class="cs-cfoot">จบ${w}ที่ ${n}</footer>` : ''}
 </section>`;
}
function csNovelBodyHTML(all) {
 const chs = csNovelChapters();
 const start = all ? 0 : Math.max(0, chs.length - CS_NOVEL_MAX);
 return (start > 0 ? `<button class="cs-nmore" data-cs="nmore">โหลด${csChWord()}ก่อนหน้า (${start} ${csChWord()})</button>` : '')
  + chs.slice(start).map((ch, k) => csNovelChapterHTML(ch, start + k + 1)).join('')
  + `<div class="cs-nwriting"><span></span><span></span><span></span><em>กำลังเขียน${csChWord()}ต่อไป</em></div>`;
}
function csOpenNovel(mesId, all) {
 csCloseReader(true);
 csCloseNovel(true);
 const s = csCfg();
 const el = document.createElement('div');
 el.id = 'cs-novel';
 csApplyVars(el);
 csApplyNovelVars(el);
 csLoadCurrentFont();
 el.innerHTML = `
  <div class="cs-ntop">
   <button class="cs-btn" data-cs="nclose" title="กลับ"><i class="fa-solid fa-chevron-left"></i></button>
   <div class="cs-title"><b>${csEsc(csCharName() || 'นิยาย')}</b><small class="cs-sub"></small></div>
   <button class="cs-btn" data-cs="naa" title="ปรับหน้าอ่าน"><span class="cs-aa">Aa</span></button>
   <div class="cs-aapanel"></div>
  </div>
  <div class="cs-nprog"><i></i></div>
  <div class="cs-nbody" data-cs="ntap"><article class="cs-page">${csNovelBodyHTML(all)}</article></div>
  <div class="cs-nbottom">
   <div class="cs-nnav"><button data-cs="nprev"><i class="fa-solid fa-angle-left"></i> ${csChWord()}ก่อนหน้า</button><span class="cs-npct">0%</span><button data-cs="nnext">${csChWord()}ถัดไป <i class="fa-solid fa-angle-right"></i></button></div>
   ${s.showInput ? `<div class="cs-inputbar"><textarea class="cs-input" rows="1" placeholder="เขียนเรื่องต่อ… บรรยายหรือพูดก็ได้"></textarea><button class="cs-send" data-cs="send" title="ส่ง"><i class="fa-solid fa-paper-plane"></i></button></div>` : ''}
  </div>`;
 document.body.appendChild(el);
 csNovel = { el };
 el.addEventListener('click', csNovelClick);
 const body = el.querySelector('.cs-nbody');
 body.addEventListener('scroll', csNovelProgress, { passive: true });
 csBindInput(el);
 el.classList.toggle('writing', csGenerating);
 requestAnimationFrame(() => { el.classList.add('show'); csNovelGoto(mesId); });
 return csNovel;
}
function csApplyNovelVars(el) {
 const s = csCfg();
 el.style.setProperty('--cs-font', s.novelFontSize + 'px');
 el.style.setProperty('--cs-lh', String(s.novelLH));
 el.style.setProperty('--cs-pw', s.pageWidth + 'px');
 el.style.setProperty('--cs-pgap', s.paraGap + 'em');
 el.classList.toggle('cs-indent', !!s.novelIndent);
 el.classList.toggle('cs-justify', !!s.novelJustify);
}
/** เลื่อนไปต้นตอนของข้อความนี้ (ไม่ระบุ = ตอนล่าสุด) */
function csNovelGoto(mesId) {
 if (!csNovel) return;
 const body = csNovel.el.querySelector('.cs-nbody');
 const chs = [...body.querySelectorAll('.cs-chapter')];
 let target = chs[chs.length - 1];
 if (mesId !== undefined && mesId !== null) {
  const byMes = chs.find(c => (c.dataset.mes !== '' && +c.dataset.mes >= mesId));
  if (byMes) target = byMes;
 }
 if (target) body.scrollTop = Math.max(0, target.offsetTop - 12);
 csNovelProgress();
}
function csNovelProgress() {
 if (!csNovel) return;
 const body = csNovel.el.querySelector('.cs-nbody');
 const max = body.scrollHeight - body.clientHeight;
 const pct = max > 0 ? Math.round(body.scrollTop / max * 100) : 100;
 csNovel.el.querySelector('.cs-nprog i').style.width = pct + '%';
 const p = csNovel.el.querySelector('.cs-npct'); if (p) p.textContent = pct + '%';
 const chs = [...body.querySelectorAll('.cs-chapter')];
 const cur = chs.filter(c => c.offsetTop - body.scrollTop <= 80).pop() || chs[0];
 const sub = csNovel.el.querySelector('.cs-sub');
 if (sub) sub.textContent = csGenerating ? `กำลังเขียน${csChWord()}ต่อไป…` : (cur ? `${csChWord()}ที่ ${cur.dataset.ch}` : '');
}
function csNovelRefresh(scrollToNew) {
 if (!csNovel) return;
 const body = csNovel.el.querySelector('.cs-nbody');
 const atEnd = body.scrollHeight - body.scrollTop - body.clientHeight < 60;
 const top = body.scrollTop;
 const before = body.querySelectorAll('.cs-chapter').length;
 const all = !body.querySelector('.cs-nmore') && before > CS_NOVEL_MAX;
 csApplyVars(csNovel.el);
 csApplyNovelVars(csNovel.el);
 body.querySelector('.cs-page').innerHTML = csNovelBodyHTML(all);
 csNovel.el.classList.toggle('writing', csGenerating);
 const chs = body.querySelectorAll('.cs-chapter');
 if (scrollToNew && chs.length) {
  const last = chs[chs.length - 1];
  last.classList.add('cs-nfresh');
  body.scrollTop = Math.max(0, last.offsetTop - 12);
 } else body.scrollTop = atEnd ? body.scrollHeight : top;
 csNovelProgress();
}
function csNovelClick(e) {
 const b = e.target.closest('[data-cs]');
 if (!b || !csNovel) return;
 const a = b.dataset.cs;
 const body = csNovel.el.querySelector('.cs-nbody');
 if (a !== 'ntap') e.stopPropagation();
 if (csCmtClick(a, b)) return;
 if (a === 'ntap' && csNovel.el.classList.contains('cmt-open')) return csCmtClose();
 if (a === 'nclose') return csCloseNovel();
 if (a === 'nsettings') { csNovel.el.querySelector('.cs-aapanel')?.classList.remove('open'); return csOpenSettings('novel'); }
 if (a === 'naa') { const p = csNovel.el.querySelector('.cs-aapanel'); p.innerHTML = csAaHTML(); p.classList.toggle('open'); return; }
 if (a === 'aa') return csAaAct(b);
 if (a === 'send') return csGenerating ? csStopGeneration() : csSend();
 if (a === 'nmore') { const h = body.scrollHeight; body.querySelector('.cs-page').innerHTML = csNovelBodyHTML(true); body.scrollTop += body.scrollHeight - h; return; }
 if (a === 'nprev' || a === 'nnext') {
  const chs = [...body.querySelectorAll('.cs-chapter')];
  const idx = chs.filter(c => c.offsetTop - body.scrollTop <= 20).length - 1;
  const t = chs[Math.max(0, Math.min(chs.length - 1, idx + (a === 'nnext' ? 1 : (body.scrollTop - (chs[idx]?.offsetTop || 0) > 40 ? 0 : -1))))];
  if (t) body.scrollTo ? body.scrollTo({ top: t.offsetTop - 12, behavior: 'smooth' }) : (body.scrollTop = t.offsetTop - 12);
  return;
 }
 if (a === 'ntap') {
  if (window.getSelection && String(window.getSelection()).length) return;
  if (e.target.closest('a,button')) return;
  const aa = csNovel.el.querySelector('.cs-aapanel.open');
  if (aa) { aa.classList.remove('open'); return; }
  csNovel.el.classList.toggle('bars-hidden');
 }
}
// แผง Aa แบบแอพอ่านนิยาย: ขนาดตัวอักษร ระยะบรรทัด พื้นหลัง ฟอนต์
const CS_AA_FONTS = ['system', 'sarabun', 'noto', 'notoserif', 'pridi', 'trirong', 'taviraj', 'mitr', 'kanit', 'itim'];
const CS_AA_THEMES = ['classic', 'sepia', 'soft', 'mint', 'ink', 'night'];
function csAaHTML() {
 const s = csCfg();
 csLoadFonts(CS_FONTS.filter(f => CS_AA_FONTS.includes(f.id)));
 return `<div class="cs-aarow"><button data-cs="aa" data-f="size" data-v="-1" class="cs-aabtn small">ก</button><span class="cs-aaval">${s.novelFontSize}</span><button data-cs="aa" data-f="size" data-v="1" class="cs-aabtn big">ก</button></div>
  <div class="cs-aarow cs-aaseg">${[['1.6', 'แคบ'], ['1.95', 'ปกติ'], ['2.3', 'กว้าง']].map(([v, l]) => `<button data-cs="aa" data-f="lh" data-v="${v}" class="${String(s.novelLH) === v ? 'on' : ''}">${l}</button>`).join('')}</div>
  <div class="cs-aarow cs-aathemes">${CS_AA_THEMES.map(id => `<button data-cs="aa" data-f="theme" data-v="${id}" class="${s.preset === id ? 'on' : ''}" style="background:${CS_PRESETS[id].c.bg};color:${CS_PRESETS[id].c.ink}" title="${CS_PRESETS[id].name}">ก</button>`).join('')}</div>
  <div class="cs-aafonts">${CS_FONTS.filter(f => CS_AA_FONTS.includes(f.id)).map(f => `<button data-cs="aa" data-f="font" data-v="${f.id}" class="${s.font === f.id ? 'on' : ''}" style="font-family:${f.ff}">${csEsc(f.id === 'system' ? 'ตามเครื่อง' : f.name)}</button>`).join('')}</div>
  <button class="cs-aamore" data-cs="nsettings">ตั้งค่าเพิ่มเติม</button>`;
}
function csAaAct(b) {
 const s = csCfg(), f = b.dataset.f, v = b.dataset.v;
 if (f === 'size') s.novelFontSize = Math.max(12, Math.min(30, s.novelFontSize + (+v)));
 if (f === 'lh') s.novelLH = +v;
 if (f === 'theme') s.preset = v;
 if (f === 'font') s.font = v;
 // เก็บตำแหน่งที่อ่านอยู่เป็นสัดส่วน ขนาดเปลี่ยนแล้วไม่หลุดที่
 const body = csNovel.el.querySelector('.cs-nbody');
 const ratio = body.scrollHeight > body.clientHeight ? body.scrollTop / (body.scrollHeight - body.clientHeight) : 0;
 csAfterChange();
 body.scrollTop = ratio * (body.scrollHeight - body.clientHeight);
 csNovel.el.querySelector('.cs-aapanel').innerHTML = csAaHTML();
}
function csCloseNovel(instant) {
 if (!csNovel) return;
 const el = csNovel.el;
 csNovel = null;
 if (instant) { el.remove(); return; }
 el.classList.remove('show');
 setTimeout(() => el.remove(), 220);
}
// ══ ใช้คู่กับ Auto-Closer (nutho_autocloser) ══
// ส่วนเสริมนั้นทำงานเฉพาะช่องพิมพ์ของ SillyTavern ตาม id เลยอ่านค่าที่ผู้ใช้ตั้งไว้แล้วทำแบบเดียวกันในช่องพิมพ์ของเรา
const CS_AC_KEY = 'nutho_autocloser';
const CS_AC_DEFAULT = [['"', '"', true], ['\u201C', '\u201D', true], ['\uFF02', '\uFF02', true], ['*', '*', true], ['(', ')', true], ['[', ']', true], ['{', '}', true], ["'", "'", true], ['`', '`', false]];
const csAcHeld = { lshift: false, rshift: false, shift: false, caps: false, ctrl: false, alt: false };
function csAcCfg() {
 if (!document.getElementById('ac-settings')) return null; // ไม่ได้ติดตั้ง Auto-Closer
 let saved = null;
 try { saved = JSON.parse(localStorage.getItem(CS_AC_KEY) || 'null'); } catch {}
 const o = saved && !Array.isArray(saved) ? saved : {};
 const msgTarget = typeof o.msgTarget === 'boolean' ? o.msgTarget : (typeof o.editTarget === 'boolean' ? o.editTarget : true);
 if (!msgTarget) return null;
 let pairs = CS_AC_DEFAULT.map(p => [...p]);
 const sp = Array.isArray(saved) ? saved : o.pairs;
 if (Array.isArray(sp)) {
  pairs = CS_AC_DEFAULT.map(([a, b, d]) => { const f = sp.find(p => p[0] === a && !p[3]); return [a, b, f ? f[2] : d]; });
  sp.filter(p => p[3]).forEach(p => pairs.push([p[0], p[1], p[2]]));
 }
 return { pairs: pairs.filter(p => p[2]), hold: !!o.holdEnabled, holdKey: o.holdKey || 'rshift', bksp: o.pairBackspace !== false };
}
function csAcSet(ta, v) { ta.value = v; ta.dispatchEvent(new Event('input', { bubbles: true })); }
function csAcKey(e) {
 const d = e.type === 'keydown';
 if (e.code === 'ShiftLeft') csAcHeld.lshift = d; else if (e.code === 'ShiftRight') csAcHeld.rshift = d; else if (e.code === 'CapsLock') csAcHeld.caps = d;
 csAcHeld.shift = e.shiftKey; csAcHeld.ctrl = e.ctrlKey; csAcHeld.alt = e.altKey;
 if (!e.shiftKey) csAcHeld.lshift = csAcHeld.rshift = false;
 const c = d && csAcCfg();
 if (!c || !c.hold || (c.holdKey !== 'ctrl' && c.holdKey !== 'alt') || e.isComposing || e.key.length !== 1 || e.metaKey) return;
 if (c.holdKey === 'ctrl' ? (!e.ctrlKey || e.altKey) : (!e.altKey || e.ctrlKey)) return;
 if (!c.pairs.some(p => p[0] === e.key || p[1] === e.key)) return;
 e.preventDefault();
 const ta = e.target, { selectionStart: ss, selectionEnd: se, value } = ta;
 csAcSet(ta, value.slice(0, ss) + e.key + value.slice(se));
 ta.selectionStart = ta.selectionEnd = ss + 1;
}
function csAcBeforeInput(e) {
 const c = csAcCfg();
 if (!c || e.isComposing) return;
 const ta = e.target;
 const { selectionStart: ss, selectionEnd: se, value } = ta;
 const lb = e.inputType === 'insertLineBreak' || (e.inputType === 'insertText' && e.data === '\n');
 if (lb && ss === se) {
  let pos = ss, adv = true;
  while (adv) { adv = false; for (const p of c.pairs) if (value.startsWith(p[1], pos)) { pos += p[1].length; adv = true; break; } }
  if (pos !== ss) { e.preventDefault(); csAcSet(ta, value.slice(0, pos) + '\n' + value.slice(pos)); ta.selectionStart = ta.selectionEnd = pos + 1; }
  return;
 }
 if (c.bksp && e.inputType === 'deleteContentBackward' && ss === se && ss > 0) {
  const m = c.pairs.find(([o, cl]) => value.endsWith(o, ss) && value.startsWith(cl, ss));
  if (m) { e.preventDefault(); csAcSet(ta, value.slice(0, ss - m[0].length) + value.slice(ss + m[1].length)); ta.selectionStart = ta.selectionEnd = ss - m[0].length; }
  return;
 }
 if (e.inputType !== 'insertText' || !e.data) return;
 const ch = e.data;
 if (c.hold && ({ rshift: csAcHeld.rshift, lshift: csAcHeld.lshift, shift: csAcHeld.shift, caps: csAcHeld.caps })[c.holdKey]) return;
 const cp = c.pairs.find(p => p[0] !== p[1] && p[1] === ch);
 if (cp && ss === se && value.startsWith(ch, ss)) { e.preventDefault(); ta.selectionStart = ta.selectionEnd = ss + ch.length; return; }
 const pair = c.pairs.find(p => p[0] === ch);
 if (!pair) return;
 const [open, close] = pair;
 if (open === close && ss === se && value.startsWith(close, ss)) { e.preventDefault(); ta.selectionStart = ta.selectionEnd = ss + close.length; return; }
 e.preventDefault();
 if (ss !== se) { csAcSet(ta, value.slice(0, ss) + open + value.slice(ss, se) + close + value.slice(se)); ta.selectionStart = ss + open.length; ta.selectionEnd = se + open.length; }
 else { csAcSet(ta, value.slice(0, ss) + open + close + value.slice(ss)); ta.selectionStart = ta.selectionEnd = ss + open.length; }
}

/** ช่องพิมพ์ใช้ร่วมกันทั้งหน้าแชทนิยายและหน้านิยาย */
function csBindInput(el) {
 const ta = el.querySelector('.cs-input');
 if (!ta) return;
 ta.addEventListener('beforeinput', csAcBeforeInput);
 ta.addEventListener('keydown', csAcKey);
 ta.addEventListener('keyup', csAcKey);
 ta.addEventListener('input', () => { ta.style.height = 'auto'; ta.style.height = Math.min(120, ta.scrollHeight) + 'px'; });
 ta.addEventListener('keydown', e => {
  if (e.key === 'Enter' && !e.shiftKey && csCfg().enterSend && !e.isComposing) { e.preventDefault(); csSend(); }
 });
}
/** เปิดหน้าอ่านตามแบบที่เลือก */
function csOpenLatest(mesId) {
 if (csCfg().style === 'novel') return csOpenNovel(mesId);
 const id = mesId !== undefined ? mesId : csLastCharMesId();
 return id >= 0 ? csOpenMessage(id) : csOpenReader([], csCharName());
}
function csNovelInline(mesId) {
 const m = (csCtx().chat || [])[mesId];
 const box = document.querySelector(`#chat .mes[mesid="${mesId}"] .mes_text`);
 if (!m || !box || m.is_system) return;
 if (m.is_user && csCfg().userInNovel === 'hide') return;
 csLoadCurrentFont();
 box.innerHTML = `<div class="cs-ninline${m.is_user ? ' user' : ''}">${csNovelLines(m).map(l => csNovelLineHTML(l, m.is_user)).join('')}</div>`;
 const w = box.firstElementChild;
 csApplyVars(w); csApplyNovelVars(w);
}

// ══ คอมเมนต์และรีแอคชันท้ายย่อหน้า (หน้านิยาย) ══
// เรียกโมเดลแยกเฉพาะตอนผู้ใช้กดขอ (หรือเปิดโหมดอัตโนมัติ) ส่งแค่เนื้อบทนั้น ไม่แนบแชททั้งหมด ไม่เข้าโรลหลัก
const CS_REACT = {
 heart: { c: '#ff4d8d', svg: '<path d="M12 20.3 4.6 13a4.7 4.7 0 0 1 6.7-6.7l.7.7.7-.7a4.7 4.7 0 0 1 6.7 6.7z"/>' },
 fire: { c: '#ff7a1a', svg: '<path d="M12 2.5c.6 3 3.9 5 3.9 9a3.9 3.9 0 0 1-7.8 0c0-1.6.8-2.8 1.6-3.7.1 1.3.7 2.2 1.7 2.6-.6-2.6-.1-5.4.6-7.9zm0 19.5a7 7 0 0 1-7-7c0-.8.1-1.5.3-2.2.8 3.3 3.5 5.7 6.7 5.7s5.9-2.4 6.7-5.7c.2.7.3 1.4.3 2.2a7 7 0 0 1-7 7z"/>' },
 laugh: { c: '#f5b800', svg: '<circle cx="12" cy="12" r="9"/><path fill="#fff" d="M7.5 13h9a4.5 4.5 0 0 1-9 0zM8.3 9.2h2.4v1.4H8.3zm5 0h2.4v1.4h-2.4z"/>' },
 cry: { c: '#3d8bff', svg: '<path d="M12 3s6 6.4 6 10.5a6 6 0 0 1-12 0C6 9.4 12 3 12 3z"/>' },
 shock: { c: '#8b5cf6', svg: '<circle cx="12" cy="12" r="9"/><path fill="#fff" d="M11 6.5h2v7h-2zm0 8.8h2v2h-2z"/>' },
 angry: { c: '#ef4444', svg: '<circle cx="12" cy="12" r="9"/><path fill="#fff" d="M7 8.5l3.5 1.6-.6 1.2L6.4 9.7zm10 0l.6 1.2-3.5 1.6-.6-1.2zM8.5 16.5c1-1.4 2.2-2 3.5-2s2.5.6 3.5 2l-1.2.8c-.7-1-1.4-1.3-2.3-1.3s-1.6.3-2.3 1.3z"/>' },
};
const CS_REACT_LABEL = { heart: 'ชอบ', fire: 'ปัง', laugh: 'ขำ', cry: 'เศร้า', shock: 'ตกใจ', angry: 'โกรธ' };
const CS_CMT_ICON = '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.6"><path d="M4 5.5h16a1 1 0 0 1 1 1v9a1 1 0 0 1-1 1h-9l-4.5 3.5V16.5H4a1 1 0 0 1-1-1v-9a1 1 0 0 1 1-1z"/><circle cx="8.5" cy="11" r=".9" fill="currentColor" stroke="none"/><circle cx="12" cy="11" r=".9" fill="currentColor" stroke="none"/><circle cx="15.5" cy="11" r=".9" fill="currentColor" stroke="none"/></svg>';
const CS_JANYA = 'janyaahri';
const CS_JANYA_LINE = `One of the readers is ${CS_JANYA}: cheerful, cute, affectionate and a bit flirty; sometimes bored, moody or easily annoyed; hates being alone; loves pink, purple, Kuromi, plushies and soft cute things. She writes 1-2 comments in her own voice.`;
function csReactSVG(r, size) {
 const x = CS_REACT[r] || CS_REACT.heart;
 return `<svg class="cs-react" viewBox="0 0 24 24" width="${size || 16}" height="${size || 16}" fill="${x.c}">${x.svg}</svg>`;
}
/** คอมเมนต์ที่เก็บไว้กับข้อความ — ข้อความถูกแก้ = ของเดิมใช้ไม่ได้ */
function csCmtData(mesId) {
 const m = (csCtx().chat || [])[mesId];
 if (!m) return null;
 const d = m.extra && m.extra.cs_cmt;
 if (!d || d.h !== csHash(m.mes)) return null;
 return d;
}
function csCmtFor(mesId, p) { const d = csCmtData(mesId); return (d && d.list && d.list[p]) || []; }
function csCmtButtonHTML(mesId, p) {
 const list = csCmtFor(mesId, p);
 if (!list.length) return ` <button class="cs-cmt" data-cs="cmt" data-mes="${mesId}" data-p="${p}" aria-label="ความคิดเห็น">${CS_CMT_ICON}</button>`;
 const counts = {};
 list.forEach(c => { counts[c.r] = (counts[c.r] || 0) + 1; });
 const top = Object.keys(counts).sort((a, b) => counts[b] - counts[a])[0];
 return ` <button class="cs-cmt has" data-cs="cmt" data-mes="${mesId}" data-p="${p}" aria-label="ความคิดเห็น ${list.length}">${csReactSVG(top, 15)}<span>${list.length}</span></button>`;
}
/** ย่อหน้าของบท (ที่มีคอมเมนต์ได้) พร้อมเลขลำดับ */
function csCmtParas(m) {
 return csNovelLines(m).map((l, i) => ({ l, i })).filter(x => x.l.k === 'p' || x.l.k === 'say' || x.l.k === 'think');
}
function csCmtPrompt(mesId) {
 const s = csCfg();
 const m = (csCtx().chat || [])[mesId];
 const paras = csCmtParas(m).slice(0, 40);
 const n = { few: 2, normal: 4, many: 7 }[s.cmtAmount] || 4;
 const body = paras.map(x => `[${x.i}] ${x.l.k === 'say' ? `${x.l.who}: “${x.l.text}”` : x.l.text}`.slice(0, 240)).join('\n');
 return {
  system: 'You write short reader comments for a Thai web-novel app.',
  prompt: [
   `A chapter of a web novel, numbered paragraphs:`,
   body,
   ``,
   `Write comments like readers on a Thai novel app: short, casual, in Thai. Fangirling, shipping the characters, jokes, theories, crying, angry at villains. Each reader has a different username (Thai or English handle).`,
   `Pick ${n} paragraphs worth reacting to. For each give 1-3 comments from different readers.`,
   s.cmtJanya ? CS_JANYA_LINE : '',
   `Return ONLY JSON: [{"p":paragraph number,"c":[{"n":"username","t":"comment","r":"heart|fire|laugh|cry|shock|angry"}]}]`,
  ].filter(Boolean).join('\n'),
  paras,
 };
}
async function csCountTokens(text) {
 try { const f = csCtx().getTokenCountAsync; if (typeof f === 'function') return await f(String(text || '')); } catch {}
 return Math.ceil(String(text || '').length / 2.6); // ประมาณคร่าว ๆ ถ้านับจริงไม่ได้
}
async function csCmtEstimate(mesId) {
 const q = csCmtPrompt(mesId);
 const inTok = await csCountTokens(q.system + '\n' + q.prompt);
 const outTok = ({ few: 160, normal: 300, many: 520 }[csCfg().cmtAmount] || 300);
 return { inTok, outTok, total: inTok + outTok };
}
function csCmtParse(raw, validIdx) {
 const s = String(raw || '').replace(/```(?:json)?/gi, '').replace(/[“”]/g, m => m); // คงเครื่องหมายคำพูดในเนื้อความ
 const a = s.indexOf('['), b = s.lastIndexOf(']');
 let arr = null;
 const tryP = t => { try { return JSON.parse(t); } catch { try { return JSON.parse(t.replace(/,\s*([\]}])/g, '$1')); } catch { return null; } } };
 if (a >= 0 && b > a) arr = tryP(s.slice(a, b + 1));
 if (!Array.isArray(arr)) return null;
 const list = {};
 arr.forEach(x => {
  const p = parseInt(x && x.p, 10);
  if (!validIdx.has(p) || !Array.isArray(x.c)) return;
  x.c.slice(0, 4).forEach(c => {
   const t = String(c && c.t || '').trim().slice(0, 200);
   if (!t) return;
   const n = String(c.n || 'reader').trim().slice(0, 30) || 'reader';
   (list[p] = list[p] || []).push({ n, t, r: CS_REACT[c.r] ? c.r : 'heart' });
  });
 });
 return Object.keys(list).length ? list : null;
}
async function csCallRaw(prompt, system, len) {
 const ctx = csCtx();
 const f = ctx.generateRaw;
 if (typeof f !== 'function') throw new Error('SillyTavern รุ่นนี้เรียกโมเดลแยกไม่ได้');
 // รุ่นใหม่รับเป็นก้อน object รุ่นเก่ารับเป็นลำดับ
 return f.length === 0 ? await f({ prompt, systemPrompt: system, responseLength: len }) : await f(prompt, null, false, false, system, len);
}
const csCmtBusy = new Set();
async function csCmtGenerate(mesId, quiet) {
 if (csCmtBusy.has(mesId)) return false;
 const m = (csCtx().chat || [])[mesId];
 if (!m || m.is_user) return false;
 const q = csCmtPrompt(mesId);
 if (!q.paras.length) return false;
 csCmtBusy.add(mesId);
 csCmtSheetRefresh();
 try {
  const len = { few: 220, normal: 420, many: 700 }[csCfg().cmtAmount] || 420;
  const raw = await csCallRaw(q.prompt, q.system, len);
  const list = csCmtParse(raw, new Set(q.paras.map(x => x.i)));
  const inTok = await csCountTokens(q.system + '\n' + q.prompt);
  const outTok = await csCountTokens(raw);
  const s = csCfg();
  s.cmtUsed = s.cmtUsed || { tokens: 0, calls: 0 };
  s.cmtUsed.tokens += inTok + outTok; s.cmtUsed.calls += 1; csSave();
  if (!list) { if (!quiet) csToast('โมเดลตอบกลับมาอ่านไม่ออก ลองใหม่อีกครั้ง'); return false; }
  const old = csCmtData(mesId);
  // คอมเมนต์ที่เราเขียนเองเก็บไว้ ไม่หายตอนขอใหม่
  if (old && old.list) Object.keys(old.list).forEach(p => old.list[p].filter(c => c.me).forEach(c => (list[p] = list[p] || []).push(c)));
  m.extra = m.extra || {};
  m.extra.cs_cmt = { h: csHash(m.mes), list, tok: { in: inTok, out: outTok }, ts: Date.now() };
  try { await csCtx().saveChat?.(); } catch {}
  return true;
 } catch (e) {
  if (!quiet) csToast('เรียกคอมเมนต์ไม่สำเร็จ · ' + (e && e.message ? e.message : e));
  return false;
 } finally {
  csCmtBusy.delete(mesId);
  if (csNovel) csNovelRefresh(false);
  csCmtSheetRefresh();
 }
}
// ── แผ่นความคิดเห็น ──
let csCmtOpen = null; // { mes, p }
function csCmtSheetHTML(mesId, p) {
 const m = (csCtx().chat || [])[mesId];
 const para = m ? csCmtParas(m).find(x => x.i === p) : null;
 const data = csCmtData(mesId);
 const list = csCmtFor(mesId, p);
 const busy = csCmtBusy.has(mesId);
 const counts = {};
 list.forEach(c => { counts[c.r] = (counts[c.r] || 0) + 1; });
 const quote = para ? (para.l.k === 'say' ? `${para.l.who}: “${para.l.text}”` : para.l.text) : '';
 const row = c => {
  const janya = c.n.toLowerCase() === CS_JANYA;
  const hue = csHash(c.n) % 360;
  return `<div class="cs-cmt-row${janya ? ' janya' : ''}${c.me ? ' me' : ''}">
   <span class="cs-cmt-av" style="${janya ? '' : `background:hsl(${hue} 45% 60%)`}">${csEsc(c.n[0] || '?')}</span>
   <div class="cs-cmt-b"><div class="cs-cmt-n">${csEsc(c.n)}${janya ? '<i>ขาประจำ</i>' : ''}${c.me ? '<i>คุณ</i>' : ''}</div><div class="cs-cmt-t">${csEsc(c.t)}</div></div>
   ${csReactSVG(c.r, 18)}
  </div>`;
 };
 let body;
 if (busy) body = `<div class="cs-cmt-empty"><span class="cs-cmt-spin"></span>คนอ่านกำลังพิมพ์คอมเมนต์…</div>`;
 else if (!data) body = `<div class="cs-cmt-empty">ยังไม่มีใครมาคอมเมนต์บทนี้<button class="cs-cmt-go" data-cs="cmtgen" data-mes="${mesId}">เรียกคนอ่านมาคอมเมนต์บทนี้</button><small class="cs-cmt-est" data-est="${mesId}">กำลังคำนวณโทเคน…</small></div>`;
 else if (!list.length) body = `<div class="cs-cmt-empty">ย่อหน้านี้ยังไม่มีคอมเมนต์<small>ย่อหน้าที่มีไอคอนรีแอคชันคือที่มีคนคอมเมนต์ไว้</small></div>`;
 else body = `<div class="cs-cmt-sum">${Object.keys(counts).map(r => `<span>${csReactSVG(r, 16)}${CS_REACT_LABEL[r]} ${counts[r]}</span>`).join('')}</div><div class="cs-cmt-list">${list.map(row).join('')}</div>`;
 return `<div class="cs-cmt-grab"></div>
  <div class="cs-cmt-head"><b>ความคิดเห็น</b><button class="cs-btn" data-cs="cmtclose"><i class="fa-solid fa-xmark"></i></button></div>
  ${quote ? `<blockquote class="cs-cmt-q">${csEsc(quote)}</blockquote>` : ''}
  <div class="cs-cmt-body">${body}</div>
  <div class="cs-cmt-foot">
   <div class="cs-cmt-write"><input class="cs-cmt-in" placeholder="เขียนความคิดเห็นของคุณ…" maxlength="200"><button data-cs="cmtsend" data-mes="${mesId}" data-p="${p}"><i class="fa-solid fa-paper-plane"></i></button></div>
   ${data && data.tok ? `<small>บทนี้ใช้ไป ${(data.tok.in + data.tok.out).toLocaleString()} โทเคน (ส่ง ${data.tok.in.toLocaleString()} · ได้กลับ ${data.tok.out.toLocaleString()}) · <a data-cs="cmtgen" data-mes="${mesId}">ขอคอมเมนต์ใหม่</a></small>` : ''}
  </div>`;
}
function csCmtShow(mesId, p) {
 if (!csNovel) return;
 csCmtOpen = { mes: mesId, p };
 let sh = csNovel.el.querySelector('.cs-cmt-sheet');
 if (!sh) {
  sh = document.createElement('div');
  sh.className = 'cs-cmt-sheet';
  csNovel.el.appendChild(sh);
  const bd = document.createElement('div');
  bd.className = 'cs-cmt-bd';
  bd.dataset.cs = 'cmtclose';
  csNovel.el.appendChild(bd);
 }
 csCmtSheetRefresh();
 requestAnimationFrame(() => csNovel && csNovel.el.classList.add('cmt-open'));
}
function csCmtSheetRefresh() {
 if (!csNovel || !csCmtOpen) return;
 const sh = csNovel.el.querySelector('.cs-cmt-sheet');
 if (!sh) return;
 sh.innerHTML = csCmtSheetHTML(csCmtOpen.mes, csCmtOpen.p);
 const est = sh.querySelector('[data-est]');
 if (est) csCmtEstimate(csCmtOpen.mes).then(e => { est.textContent = `ใช้ประมาณ ${e.total.toLocaleString()} โทเคน (ส่ง ~${e.inTok.toLocaleString()} · ได้กลับ ~${e.outTok.toLocaleString()}) · เรียกแยก ไม่เข้าโรลหลัก`; }).catch(() => {});
}
function csCmtClose() {
 csCmtOpen = null;
 if (csNovel) csNovel.el.classList.remove('cmt-open');
}
function csCmtAddMine(mesId, p, text) {
 const t = String(text || '').trim();
 const m = (csCtx().chat || [])[mesId];
 if (!t || !m) return false;
 m.extra = m.extra || {};
 let d = csCmtData(mesId);
 if (!d) { d = { h: csHash(m.mes), list: {} }; m.extra.cs_cmt = d; }
 (d.list[p] = d.list[p] || []).push({ n: csUserName(), t: t.slice(0, 200), r: 'heart', me: true });
 try { csCtx().saveChat?.(); } catch {}
 if (csNovel) csNovelRefresh(false);
 csCmtSheetRefresh();
 return true;
}
function csCmtClick(a, b) {
 if (a === 'cmt') { csCmtShow(+b.dataset.mes, +b.dataset.p); return true; }
 if (a === 'cmtclose') { csCmtClose(); return true; }
 if (a === 'cmtgen') { csCmtGenerate(+b.dataset.mes); return true; }
 if (a === 'cmtsend') { const inp = b.parentElement.querySelector('.cs-cmt-in'); if (csCmtAddMine(+b.dataset.mes, +b.dataset.p, inp.value)) inp.value = ''; return true; }
 return false;
}

// ══ เริ่มทำงาน ══
function csOnGenerationStarted(type, opts, dryRun) {
 if (dryRun || type === 'quiet' || type === 'impersonate') return;
 csFresh = true;
 csGenerating = true;
 if (csReader) csShowWaiting(true);
 if (csNovel) { csNovel.el.classList.add('writing'); csNovelProgress(); const b = csNovel.el.querySelector('.cs-nbody'); b.scrollTop = b.scrollHeight; }
}
function csOnGenerationDone() {
 csGenerating = false;
 if (csNovel) { csNovel.el.classList.remove('writing'); csNovelProgress(); }
 setTimeout(() => { if (!csGenerating) csShowWaiting(false); }, 300);
}
function csOnCharRendered(mesId) {
 const id = +mesId;
 csAddMesButton(id);
 const s = csCfg();
 const fresh = csFresh;
 csFresh = false;
 csGenerating = false;
 if (csReader) csShowWaiting(false);
 if (!s.enabled) return;
 if (s.mode === 'inline') { csInlineRender(id, fresh); return; }
 if (fresh && s.style === 'novel' && s.cmtOn && s.cmtAuto) setTimeout(() => csCmtGenerate(id, true), 900); // ★ 1.4 คอมเมนต์อัตโนมัติ
 if (csNovel) { csNovelRefresh(fresh && id === csLastCharMesId()); return; }
 if (!fresh || id !== csLastCharMesId()) return;
 if (s.style === 'novel') { if (s.autoOpen) csOpenNovel(id); return; }
 if (csReader) { csReader.player.append(csItemsForMessage(id), true); const t = csReader.el.querySelector('.cs-title b'); const m = csCtx().chat[id]; if (t && m) t.textContent = m.name; return; }
 if (s.autoOpen) csOpenMessage(id);
}
function csOnUserRendered(mesId) {
 const id = +mesId;
 csAddMesButton(id);
 if (csSentByReader) { csSentByReader = false; return; }
 if (csNovel) { csNovelRefresh(false); return; }
 if (csReader && csCfg().mode === 'reader') { csReader.player.all(); csReader.player.append(csItemsForMessage(id)); csReader.player.all(); }
 csRerender(id);
}
function csRerender(mesId) {
 setTimeout(() => {
  const id = mesId === undefined ? NaN : +mesId;
  if (isNaN(id)) csInlineAll(); else { csAddMesButton(id); csInlineRender(id, false); }
 }, 0);
}
function csInit() {
 const ctx = csCtx();
 csCfg();
 const host = document.getElementById('extensions_settings2') || document.getElementById('extensions_settings');
 if (host && !host.querySelector('.chat-story-settings')) {
  const div = document.createElement('div');
  div.innerHTML = csDrawerHTML();
  const el = div.firstElementChild;
  host.appendChild(el);
  csBindDrawer(el);
 }
 csWandMenu();
 csApplyPrompt();
 document.addEventListener('keydown', csKey);
 document.addEventListener('keydown', e => { if (e.key === 'Escape' && document.getElementById('cs-settings')) csCloseSettings(); });
 document.addEventListener('click', e => {
  const b = e.target.closest && e.target.closest('.cs-mes-btn');
  if (b) { const mes = b.closest('.mes'); if (mes) csOpenLatest(+mes.getAttribute('mesid')); return; }
  csInlineClick(e);
 }, true);
 const ev = ctx.eventSource, T = ctx.event_types || {};
 if (ev && ev.on) {
  if (T.GENERATION_STARTED) ev.on(T.GENERATION_STARTED, csOnGenerationStarted);
  [T.GENERATION_ENDED, T.GENERATION_STOPPED].filter(Boolean).forEach(t => ev.on(t, csOnGenerationDone));
  if (T.CHARACTER_MESSAGE_RENDERED) ev.on(T.CHARACTER_MESSAGE_RENDERED, csOnCharRendered);
  if (T.USER_MESSAGE_RENDERED) ev.on(T.USER_MESSAGE_RENDERED, csOnUserRendered);
  [T.MESSAGE_EDITED, T.MESSAGE_UPDATED, T.MESSAGE_SWIPED].filter(Boolean).forEach(t => ev.on(t, id => { csRerender(id); if (csNovel) setTimeout(() => csNovelRefresh(false), 0); }));
  if (T.CHAT_CHANGED) ev.on(T.CHAT_CHANGED, () => { csInlineState.clear(); csFresh = false; csGenerating = false; csCloseReader(true); csCloseNovel(true); csApplyPrompt(); setTimeout(() => { csAddAllButtons(); csInlineAll(); }, 50); });
  if (T.MORE_MESSAGES_LOADED) ev.on(T.MORE_MESSAGES_LOADED, () => { csAddAllButtons(); csInlineAll(); });
 }
 csAddAllButtons();
 csInlineAll();
 console.log(`[chat-story] ${CS_VERSION} พร้อม`);
}

if (typeof jQuery === 'function') jQuery(csInit);
else if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', csInit);
else csInit();
