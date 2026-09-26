// Chat Story (แชทนิยาย) — ส่วนเสริม SillyTavern
// อ่านคำตอบของบอทแบบนิยายแชท: แตะหนึ่งครั้ง เด้งหนึ่งฟอง พร้อมเสียง · พิมพ์ตอบได้ในหน้าอ่าน
// สองแบบ: แชทนิยาย (chat) · นิยาย (novel)  ·  สองโหมด: หน้าอ่านเปิดทับแชท (reader) · แชทหลัก (inline)

const CS_VERSION = '1.20.0';
const CS_KEY = 'chatStory';
const CS_PROMPT_KEY = 'chat_story_format';

// ══ ธีมสำเร็จรูป ══
// ช่องสี: bg พื้น · bar แถบบน/ล่าง · ink ตัวหนังสือ · ink2 ตัวหนังสือรอง · inBg/inInk ฟองตัวละคร · outBg/outInk ฟองเรา
//        narrBg พื้นบรรยาย · accent สีเน้น · name สีชื่อ
const CS_COLOR_KEYS = ['bg', 'bar', 'ink', 'ink2', 'inBg', 'inInk', 'outBg', 'outInk', 'narrBg', 'accent', 'name'];
const CS_COLOR_LABELS = { bg: 'พื้นหลัง', bar: 'แถบบนและช่องพิมพ์', ink: 'ตัวหนังสือ', ink2: 'ตัวหนังสือรอง / บรรยาย', inBg: 'ฟองตัวละคร', inInk: 'ตัวหนังสือในฟองตัวละคร', outBg: 'ฟองของเรา', outInk: 'ตัวหนังสือในฟองของเรา', narrBg: 'พื้นบรรยาย', accent: 'สีเน้น', name: 'ชื่อตัวละคร' };
const CS_PRESETS = {
 classic: { name: 'ขาวดำเรียบ', c: { bg: '#ffffff', bar: '#ffffff', ink: '#141414', ink2: '#8f8f8f', inBg: '#f2f2f0', inInk: '#141414', outBg: '#141414', outInk: '#ffffff', narrBg: '#f7f7f5', accent: '#141414', name: '#595959' } },
 moon: { name: 'จันทร์นวล', c: { bg: '#faf7f2', bar: '#faf7f2', ink: '#2a2530', ink2: '#8b8394', inBg: '#efe9e1', inInk: '#2a2530', outBg: '#5b4b8a', outInk: '#ffffff', narrBg: '#f2ede5', accent: '#c26d5a', name: '#7a6f86' } },
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
 { id: 'system', name: 'ตามเครื่อง', ff: "-apple-system,BlinkMacSystemFont,'SF Pro Text','Helvetica Neue','Sukhumvit Set','Thonburi','Noto Sans Thai',system-ui,sans-serif" }, // ★ 1.19 ฟอนต์ระบบแบบ iOS
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
 narrStyle: 'plain',    // plain ร้อยแก้วชิดซ้าย · center กลางจอ · box ในกล่อง · italic ตัวเอียง
 sound: 'pop',
 volume: 0.6,
 pitchVary: true,
 narrSound: true,
 vibrate: false,
 customSound: '',
 typingMs: 450,
 autoSpeed: 1,
 userSide: 'right',
 userLinesRight: false,  // ★ 1.10 บทของตัวเราที่บอทเขียน ให้อยู่ฝั่งเราไหม (ปิด = ฝั่งขวามีแต่ข้อความที่เราพิมพ์จริง)
 readPos: {},           // ★ 1.10 { แชท: { chat:{m,k}, novel:{mes,off} } } อ่านถึงไหน
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
 cmtAuto: true,         // เรียกคอมเมนต์เองตามเงื่อนไข (โมเดลเลือก · ครบรอบ · สุ่ม · คีย์เวิร์ด)
 cmtAmount: 'normal',   // (เก่า) few | normal | many
 edgeBtn: true,         // ★ 1.16 ปุ่มลัดชิดขอบจอ
 edgeSide: 'right',
 edgeY: 0.62,           // ตำแหน่งแนวตั้ง (สัดส่วนความสูงจอ)
 cmtReplies: true,      // ★ 1.16 คนอ่านตอบกลับกันเองได้
 cmtCountMode: 'set',   // ★ 1.14 set ตั้งเอง · auto ให้โมเดลคิดตามความเด็ด (ไม่เกินค่าสูงสุด) · random สุ่มในช่วง
 cmtPer: 3,             // ★ 1.13 คอมเมนต์ต่อย่อหน้า (auto/random = ค่าสูงสุด)
 cmtPerMin: 1,          // ★ 1.14 สุ่ม: ต่ำสุดต่อย่อหน้า
 cmtParas: 4,           // ★ 1.13 จำนวนย่อหน้าที่มีคนเม้นท์ (auto/random = ค่าสูงสุด)
 cmtParasMin: 2,        // ★ 1.14 สุ่ม: ต่ำสุดกี่ย่อหน้า
 cmtEvery: 3,           // ★ 1.9 ครบกี่ข้อความของบอทแล้วเรียกคอมเมนต์ (0 = ไม่ใช้)
 cmtRandom: 30,         // ★ 1.9 โอกาสสุ่มเรียกต่อข้อความ (%) (0 = ไม่ใช้)
 cmtPick: 'model',     // ไอคอนขึ้นตรงไหน: model โมเดลเลือกบรรทัดตอนเขียน · all ทุกย่อหน้า
 cmtGate: 'keyword',    // (แบบทุกย่อหน้า) ด่านก่อนเรียกอัตโนมัติ: keyword คำในบท · always ทุกบท
 cmtKeywords: 'จูบ, กอด, รัก, สารภาพ, หึง, ร้องไห้, น้ำตา, เลือด, ตาย, ฆ่า, ตบ, โกรธ, ทรยศ, ความลับ, เลิก, แต่งงาน, ตกใจ, กรีดร้อง, เจ็บ, คิดถึง, จับมือ, หน้าแดง, kiss, love, confess, cry, blood, die, betray',
 cmtMinHits: 2,         // เจอคีย์เวิร์ดกี่คำถึงเรียก
 cmtUsed: null,         // { tokens, calls } สะสม
 pageWidth: 680,        // ความกว้างหน้ากระดาษ (px)
 userInNovel: 'same',   // same เหมือนเนื้อเรื่อง · mark มีเส้นกำกับ · hide ซ่อน
 chars: {},             // (เก่า ก่อน 1.8) { ชื่อ: { color, sound } } ใช้ทุกการ์ด
 cast: {},              // ★ 1.8 { 'c:การ์ด' | 'g:กลุ่ม': { ชื่อ: { color, sound, img, aliases, me, auto, ignored } } } แยกตามการ์ด
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
 if (s._v < 15) { if (s.userInNovel === 'mark') s.userInNovel = 'same'; delete s.cmtJanya; s._v = 15; } // ★ 1.5 ค่าเริ่มต้นใหม่
 if (s._v < 16) { if (s.cmtGate === 'ask') s.cmtGate = 'keyword'; s._v = 16; } // ★ 1.6 ถามโมเดลกลายเป็นให้โมเดลเลือกบรรทัด
 if (s._v < 18) { s.cmtAuto = true; s._v = 18; } // ★ 1.9 คอมเมนต์มาเองเป็นค่าเริ่มต้น (ครบรอบ/สุ่ม/โมเดลเลือก)
 if (s._v < 19) { const m = { few: [2, 2], normal: [4, 3], many: [6, 4] }[s.cmtAmount] || [4, 3]; s.cmtParas = m[0]; s.cmtPer = m[1]; s._v = 19; } // ★ 1.13 ตั้งจำนวนเองเป็นตัวเลข
 if (s._v < 20) s._v = 20;
 if (s._v < 21) { if (s.preset === 'moon') s.preset = 'classic'; s._v = 21; }
 if (s._v < 22) { csCastCleanup(s); s._v = 22; } // ★ 1.20 ล้างชื่อที่เดาผิด (ความ คำ ปลาย น้ำเ …) // ★ 1.18 กลับมาเริ่มที่ขาวดำเรียบ (จันทร์นวลยังเลือกได้)
 return s;
}
function csSave() { try { csCtx().saveSettingsDebounced(); } catch {} }
function csEsc(s) { return String(s == null ? '' : s).replace(/[&<>"']/g, c => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c])); }
function csHash(s) { let h = 0; s = String(s || ''); for (let i = 0; i < s.length; i++) h = (h * 31 + s.charCodeAt(i)) >>> 0; return h; }
function csUserName() { try { return csCtx().name1 || 'You'; } catch { return 'You'; } }
function csCharName() { try { return csCtx().name2 || ''; } catch { return ''; } }
/** ★ 1.16 แจ้งเตือนเล็ก ๆ เม็ดเดียวด้านล่าง ไม่บังเนื้อหา ไม่ต้องกดปิด (แตะผ่านได้) */
let csToastT = 0;
function csToast(t, kind) {
 try {
  let el = document.getElementById('cs-toast');
  if (!el) { el = document.createElement('div'); el.id = 'cs-toast'; el.setAttribute('role', 'status'); el.setAttribute('aria-live', 'polite'); document.body.appendChild(el); }
  const k = kind || (/ไม่ได้|ไม่สำเร็จ|ไม่เจอ|ไม่มา|พลาด/.test(t) ? 'err' : 'info');
  el.className = k;
  el.textContent = String(t);
  void el.offsetWidth;
  el.classList.add('show');
  clearTimeout(csToastT);
  csToastT = setTimeout(() => el.classList.remove('show'), k === 'err' ? 3200 : 1900);
 } catch { console.log('[chat-story]', t); }
}
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
 // ★ 1.5 ย่อให้สั้นที่สุด คำสั่งนี้แทรกทุกเทิร์น ทุกคำคือโทเคน
 if (csCfg().style === 'novel') return `[Format: novel prose in paragraphs, dialogue in “ ”. First line: ## chapter title. No "Name:" lines. Never write ${un}'s words or actions.]`;
 return `[Format: chat novel, one short line per bubble. Speech: Name: text | Thought: Name (คิด): text | Narration: own line, no name | Scene change: [place / time]. Never write ${un}'s words or actions.]`;
}
// ★ 1.5 ถามโมเดลไปกับคำตอบโรลหลักเลย ไม่ต้องเรียกแยก
// ★ 1.6 โมเดลเลือกเองตอนเขียนว่าบทพูดหรือการกระทำไหนสมควรมีคนคอมเมนต์
const CS_CMT_ASK = `[End 1-3 lines readers would react to (any dialogue or action) with [c].]`;
function csCmtAskOn() { const s = csCfg(); return s.enabled && s.cmtOn && s.cmtPick === 'model'; } // ★ 1.10 ใช้ได้ทั้งนิยายและแชทนิยาย
function csPromptText() {
 const s = csCfg();
 return [s.enabled && s.forceFormat ? csFormatPrompt() : '', csCmtAskOn() ? CS_CMT_ASK : ''].filter(Boolean).join('\n');
}
function csApplyPrompt() {
 try {
  const ctx = csCtx();
  if (typeof ctx.setExtensionPrompt !== 'function') return;
  ctx.setExtensionPrompt(CS_PROMPT_KEY, csPromptText(), 1, 1, false, 0);
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
  .replace(/^\s*\[cmt\]\s*$/gim, '')
  .replace(/\s*\[c\]/gi, '')
  .replace(/\r/g, '');
}
// ══ ★ 1.20 โค้ดและ HTML: แยกออกเป็นบล็อกก่อน ไม่ให้ถูกหั่นเป็นฟองหรือโดนลบแท็ก ══
const CS_BLK_RE = /^\u0000CSBLK(\d+)\u0000$/;
const CS_HTML_BLOCK = 'div|details|table|section|article|figure|center|blockquote|ul|ol|pre|style|svg|img|hr|aside|header|footer|nav|main|summary|dl';
/** ดึง ```โค้ด``` และบล็อก HTML ออกมาเป็นชิ้น แทนที่ด้วยบรรทัดคั่นที่จะไม่ถูกแตะ */
function csBlocks(text) {
 const blocks = [];
 let t = String(text || '').replace(/<think(?:ing)?>[\s\S]*?<\/think(?:ing)?>/gi, '').replace(/\[\[POCKET_PHONE_SYNC_V2\]\][\s\S]*?\[\[\/POCKET_PHONE_SYNC_V2\]\]/g, '').replace(/\r/g, '');
 const mark = b => { blocks.push(b); return `\n\u0000CSBLK${blocks.length - 1}\u0000\n`; };
 // ```lang ... ``` (ปิดไม่ครบก็เอาถึงท้ายข้อความ)
 t = t.replace(/(^|\n)[ \t]*```([\w+#.-]*)[^\n]*\n([\s\S]*?)(?:\n[ \t]*```[ \t]*(?=\n|$)|$)/g, (m0, pre, lang, code) => pre + mark({ k: 'code', lang: lang || '', text: code.replace(/\n+$/, '') }));
 // บล็อก HTML ที่ขึ้นต้นบรรทัดด้วยแท็กระดับบล็อก ไปจนแท็กปิดครบ
 const lines = t.split('\n'), out = [];
 const open = new RegExp(`<(${CS_HTML_BLOCK})\\b(?![^>]*\\/>)`, 'gi'), close = new RegExp(`</(${CS_HTML_BLOCK})\\s*>`, 'gi');
 const voidOnly = new RegExp(`^<(img|hr)\\b`, 'i');
 for (let i = 0; i < lines.length; i++) {
  const L = lines[i];
  if (!new RegExp(`^\\s*<(${CS_HTML_BLOCK})\\b`, 'i').test(L)) { out.push(L); continue; }
  let depth = 0, j = i, buf = [];
  do {
   const x = lines[j];
   buf.push(x);
   depth += ((x.match(open) || []).filter(tag => !voidOnly.test(tag)).length) - (x.match(close) || []).length;
   j++;
  } while (depth > 0 && j < lines.length);
  out.push(mark({ k: 'html', text: buf.join('\n') }).trim());
  i = j - 1;
 }
 return { text: out.join('\n'), blocks };
}
function csBlockItem(line, blocks) {
 const m = String(line).match(CS_BLK_RE);
 return m && blocks[+m[1]] ? { ...blocks[+m[1]] } : null;
}
/** HTML ที่ผู้ใช้/บอทใส่มา: ผ่านตัวกรองของ SillyTavern (DOMPurify) แล้วแสดงในกล่องแยก สไตล์ไม่รั่วไปทั้งหน้า */
const csHtmlStore = new Map();
function csHtmlBlockHTML(html) {
 const key = 'h' + csHash(html);
 csHtmlStore.set(key, html);
 return `<div class="cs-html" data-hk="${key}"></div>`;
}
function csSanitize(html) {
 const P = window.DOMPurify || (window.SillyTavern && SillyTavern.libs && SillyTavern.libs.DOMPurify);
 if (!P || typeof P.sanitize !== 'function') return null;
 return P.sanitize(String(html), { ADD_TAGS: ['style'], FORBID_TAGS: ['script', 'iframe', 'object', 'embed', 'form', 'input', 'button', 'textarea', 'select', 'link', 'meta', 'base'], FORBID_ATTR: ['srcdoc'] });
}
function csHydrateHTML(root) {
 (root || document).querySelectorAll('.cs-html[data-hk]:not([data-h])').forEach(el => {
  el.dataset.h = '1';
  const raw = csHtmlStore.get(el.dataset.hk) || '';
  const clean = csSanitize(raw);
  if (clean === null || !el.attachShadow) { el.innerHTML = `<pre class="cs-code-pre"><code>${csEsc(raw)}</code></pre>`; el.classList.add('as-code'); return; }
  const sh = el.attachShadow({ mode: 'open' });
  sh.innerHTML = `<style>:host{display:block;all:initial;font:inherit;color:inherit;}*{box-sizing:border-box;max-width:100%;}img{height:auto;}</style>${clean}`;
 });
}
function csCodeBlockHTML(b) {
 return `<div class="cs-code"><div class="cs-codeh"><span>${csEsc(b.lang || 'โค้ด')}</span><button class="cs-copy" type="button">คัดลอก</button></div><pre><code>${csEsc(b.text)}</code></pre></div>`;
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
/** @returns {Array<{k:'say'|'think'|'narr'|'scene', who?:string, tag?:string, text:string, u?:boolean, av?:string, ck?:string}>} */
function csParse(text, opt) {
 const o = opt || {};
 const out = [];
 const isUser = !!o.isUser;
 const owner = String(o.owner || (isUser ? csUserName() : csCharName()) || '').trim();
 const pb = csBlocks(text);
 const lines = csCleanText(pb.text).split(/\n+/).map(s => s.trim()).filter(Boolean);
 // ★ 1.8 ชื่อที่รู้จักในแชทนี้ + ชื่อใหม่ที่เดาได้จากบท ใช้หาว่าใครพูดในร้อยแก้ว
 const known = o.known || csKnownNames([owner, ...csGuessNewNames(lines.filter(l => !CS_BLK_RE.test(l)).join('\n'))]);
 const st = { last: [], seen: [], since: [], sinceG: '', mention: null, pending: null, pc: '', ng: !!o.noGender, um: isUser };
 // ชื่อบทละครค้างไว้แต่บรรทัดถัดไปไม่ใช่คำพูด = เป็นบรรยายธรรมดา
 const flush = () => { if (st.pending) { out.push({ k: 'narr', text: st.pendingRaw || st.pending }); st.pending = null; } };
 const pushSay = (who, body, tag) => {
  String(body).split(/(\*[^*]+\*)/).forEach(part => {
   if (!part.trim()) return;
   if (/^\*[^*]+\*$/.test(part.trim())) out.push({ k: 'narr', text: part.trim().slice(1, -1).trim() });
   else { const t = csStripQuotes(part); if (t) out.push({ k: tag && CS_THOUGHT.test(tag) ? 'think' : 'say', who, tag: tag || '', text: t, u: csUFlag(who, owner, isUser), c: 'line' }); }
  });
  st.last = [who, ...st.last.filter(x => x !== who)].slice(0, 2);
  csSee(st, [who]);
 };
 for (const raw of lines) {
  const blk = csBlockItem(raw, pb.blocks);
  if (blk) { flush(); out.push(blk); continue; } // โค้ด / HTML ทั้งก้อนเป็นหนึ่งชิ้น
  const line = raw.replace(/^>\s*/, '');
  if (/^[-=*_~]{3,}$/.test(line)) { flush(); continue; }
  let m = line.match(/^\[([^\]]{1,80})\]$/);
  if (m) { flush(); out.push({ k: 'scene', text: m[1].trim() }); continue; }
  // หัวบทแบบนิยาย (## ชื่อบท) กลายเป็นป้ายฉากในแชท
  m = line.match(/^#{1,6}\s*(.{1,120})$/);
  if (m) { flush(); const t = m[1].replace(/[#*]+/g, '').trim(); if (t) out.push({ k: 'scene', text: t }); continue; }
  m = line.match(/^\**\s*([^:：\n“”"「」『』]{1,40}?)\s*\**\s*(?:[(（]([^)）]{1,16})[)）])?\s*\**\s*[:：]\s*(.+)$/);
  if (m && csLooksLikeName(m[1].replace(/\*/g, ''))) { flush(); pushSay(csCanonName(m[1].replace(/\*/g, '').trim(), known), m[3], m[2]); continue; }
  m = line.match(/^\*+([^*]+)\*+$/);
  if (m) { flush(); csSeeNarr(st, m[1], known); out.push({ k: 'narr', text: m[1].trim() }); continue; }
  if (owner && csProseLine(line, owner, known, st, out, isUser)) continue;
  if (isUser) {
   if (/\*[^*]+\*/.test(line)) { pushSay(owner || csUserName(), line, ''); continue; }
   if (csGuessPlain(line) === 'narr') { out.push({ k: 'narr', text: line }); continue; }
   pushSay(owner || csUserName(), line, '');
   continue;
  }
  out.push({ k: 'narr', text: line.replace(/\*+/g, '').trim() });
 }
 flush();
 // รูปของเจ้าของข้อความ (ในกลุ่มใช้รูปการ์ดที่ส่งข้อความนั้นจริง ๆ ไม่หาจากชื่อ)
 if (o.av || o.ck) out.forEach(it => { if ((it.k === 'say' || it.k === 'think') && it.who === owner && !it.u) { if (o.av) it.av = o.av; if (o.ck) it.ck = o.ck; } });
 return out.filter(x => x.text);
}
/** ฟองนี้อยู่ฝั่งเราไหม · ในข้อความบอท ชื่อตรงกับเจ้าของข้อความ = ฝั่งบอทเสมอ แม้ชื่อซ้ำกับเรา */
function csUFlag(who, owner, isUserMsg) {
 if (isUserMsg) return who === owner || csIsUserName(who);
 // ★ 1.10 ข้อความของบอท: ฝั่งขวาเก็บไว้ให้ข้อความที่เราพิมพ์จริง เว้นแต่ตั้งไว้
 return who === owner || !csCfg().userLinesRight ? false : csIsUserName(who);
}
/** ชื่อเรียกอื่น → ชื่อหลัก (เช่น "พี่มิ:" → มิกะ) */
function csCanonName(n, known) {
 const k = String(n || '').trim().toLowerCase();
 const hit = (known || []).find(x => x.alias.toLowerCase() === k);
 return hit ? hit.name : String(n || '').trim();
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
/** ฟองนี้ของเราไหม ใช้ธงจากตอนแยกข้อความก่อน (รู้ว่ามาจากข้อความใคร) */
function csItemIsUser(it) { return it && it.u !== undefined ? !!it.u : csIsUser(it && it.who); }
function csUserAvatar() {
 try { const ctx = csCtx(); const f = ctx.userAvatar || window.user_avatar; if (f) return `/thumbnail?type=persona&file=${encodeURIComponent(f)}`; } catch {}
 const img = [...document.querySelectorAll('#chat .mes[is_user="true"] .avatar img')].pop();
 return img ? img.getAttribute('src') : '';
}
function csThumb(file) { return file && file !== 'none' ? `/thumbnail?type=avatar&file=${encodeURIComponent(file)}` : ''; }
/** รูปตัวละคร: รูปที่ตั้งเองในแชทนี้ > รูปของการ์ดที่ส่งข้อความนั้น > การ์ดในแชทนี้ที่ชื่อตรง · ไม่หยิบการ์ดชื่อซ้ำที่อยู่นอกแชท */
function csAvatarSrc(who, av, user, ck) {
 const o = csCastGet(ck || who) || (ck ? csCastGet(who) : null);
 if (o && o.img) return o.img;
 if (user) return csUserAvatar();
 if (av) return av;
 const c = csStCharFor(who);
 return c ? csThumb(c.avatar) : '';
}
function csAvatarHTML(who, av, user, ck) {
 const src = csAvatarSrc(who, av, user === undefined ? csIsUser(who) : user, ck);
 const hue = csHash(who) % 360;
 const fb = `<span class="cs-av cs-av-fb" style="background:linear-gradient(150deg,hsl(${hue} 30% 62%),hsl(${(hue + 40) % 360} 25% 40%))">${csEsc(String(who || '?').trim()[0] || '?')}</span>`;
 if (!src) return fb;
 return `<img class="cs-av" src="${csEsc(src)}" alt="" onerror="this.outerHTML=this.dataset.fb" data-fb="${csEsc(fb)}">`;
}
// ── ตัวละครแยกตามการ์ด/กลุ่ม (ชื่อซ้ำคนละการ์ดไม่ปนกัน) ──
function csScope() {
 try {
  const ctx = csCtx();
  if (ctx.groupId) return 'g:' + ctx.groupId;
  const c = (ctx.characters || [])[ctx.characterId];
  if (c) return 'c:' + (c.avatar || c.name);
  return 'c:' + (ctx.name2 || 'none');
 } catch { return 'c:none'; }
}
function csScopeLabel() {
 try {
  const ctx = csCtx();
  if (ctx.groupId) { const g = (ctx.groups || []).find(x => x.id === ctx.groupId); return 'กลุ่ม ' + (g ? g.name : ''); }
  return csCharName() || 'แชทนี้';
 } catch { return 'แชทนี้'; }
}
function csCast(create) {
 const s = csCfg();
 if (!s.cast || typeof s.cast !== 'object') s.cast = {};
 const k = csScope();
 if (!s.cast[k] && create) s.cast[k] = {};
 return s.cast[k] || {};
}
/** ค่าของชื่อนี้ในแชทนี้ (ไม่สนตัวพิมพ์เล็กใหญ่) */
function csCastGet(name) {
 const n = String(name || '').trim();
 if (!n) return null;
 const c = csCast(false);
 if (c[n]) return c[n].ignored ? null : c[n];
 const k = Object.keys(c).find(x => x.toLowerCase() === n.toLowerCase());
 return k && !c[k].ignored ? c[k] : null;
}
/** การ์ดในแชทนี้ที่ชื่อซ้ำกัน (เช่นกลุ่มที่มีสองการ์ดชื่อเดียวกัน) แยกค่าด้วยไฟล์การ์ด */
function csDupNames() {
 const seen = new Map();
 csStCharsInScope().forEach(c => { const k = String(c.name || '').trim().toLowerCase(); seen.set(k, (seen.get(k) || 0) + 1); });
 return new Set([...seen].filter(([, n]) => n > 1).map(([k]) => k));
}
function csCastKey(name, file) {
 const n = String(name || '').trim();
 return file && csDupNames().has(n.toLowerCase()) ? `${n} · ${String(file).replace(/\.[a-z]+$/i, '')}` : '';
}
/** ผู้ใช้เคยแก้อะไรกับชื่อนี้ไหม (รูป สี เสียง ชื่อเรียกอื่น เพศ ตัวเรา) */
function csCastTouched(o) { return !!(o && (o.img || o.color || o.sound || o.aliases || o.me || o.g || o.added)); }
/** ★ 1.20 ล้างชื่อขยะที่เคยเดาผิดแล้วเก็บไว้ (เฉพาะที่เดาเองและผู้ใช้ไม่เคยแก้) */
function csCastCleanup(s) {
 let n = 0;
 Object.values(s.cast || {}).forEach(c => Object.keys(c || {}).forEach(k => { const o = c[k]; if (o && o.auto && !o.ignored && !csCastTouched(o) && !csNameLooksValid(k)) { delete c[k]; n++; } }));
 return n;
}
function csCastSet(name, patch) {
 const n = String(name || '').trim().slice(0, 90);
 if (!n) return null;
 const c = csCast(true);
 c[n] = { ...(c[n] || {}), ...patch };
 Object.keys(c[n]).forEach(k => { if (c[n][k] === '' || c[n][k] === undefined) delete c[n][k]; });
 csSave();
 return c[n];
}
/** ชื่อใหม่ที่เจอ ดึงเข้ารายชื่อเอง (ไม่ตั้งค่าอะไร แค่ให้ขึ้นในรายการ) */
function csCastNote(names) {
 const c = csCast(true);
 let added = 0;
 (names || []).forEach(n => {
  n = String(n || '').trim();
  if (!n || n.length > 40 || csIsUserName(n) || Object.keys(c).length >= 120 || !csNameLooksValid(n)) return;
  if (Object.keys(c).some(x => x.toLowerCase() === n.toLowerCase())) return; // มีแล้ว หรือผู้ใช้ลบทิ้งไว้ (ignored) ไม่ดึงกลับ
  c[n] = { auto: true };
  added++;
 });
 if (added) csSave();
 return added;
}
/** ตัวละครจาก SillyTavern เฉพาะที่อยู่ในแชทนี้ — การ์ดชื่อซ้ำที่อยู่นอกแชทไม่ถูกหยิบมาปน */
function csStCharsInScope() {
 try {
  const ctx = csCtx();
  const chars = ctx.characters || [];
  if (ctx.groupId) {
   const g = (ctx.groups || []).find(x => x.id === ctx.groupId);
   return g ? (g.members || []).map(av => chars.find(c => c && c.avatar === av)).filter(Boolean) : [];
  }
  const c = chars[ctx.characterId];
  return c ? [c] : [];
 } catch { return []; }
}
function csStCharFor(who) {
 const n = String(who || '').trim().toLowerCase();
 return csStCharsInScope().find(c => String(c.name || '').trim().toLowerCase() === n) || null;
}
/** ชื่อทั้งหมดที่รู้จักในแชทนี้ + ชื่อเรียกอื่น → ชื่อหลัก (ยาวก่อน กันชื่อสั้นไปจับในชื่อยาว) */
function csKnownNames(extra) {
 const map = new Map();
 const add = (alias, name) => { alias = String(alias || '').trim(); if (alias.length >= 2 && !map.has(alias.toLowerCase())) map.set(alias.toLowerCase(), { alias, name: String(name || alias).trim() }); };
 const cast = csCast(false);
 const ign = new Set(Object.keys(cast).filter(n => cast[n].ignored).map(n => n.toLowerCase()));
 // ชื่อเรียกอื่นใส่ก่อน ชื่อที่ผู้ใช้ตั้งเองชนะชื่อที่เดาได้
 Object.keys(cast).forEach(n => { if (cast[n].ignored || n.includes(' · ') || (cast[n].auto && !csCastTouched(cast[n]) && !csNameLooksValid(n))) return; add(n, n); String(cast[n].aliases || '').split(/[,，、\n]/).forEach(a => add(a, n)); });
 csStCharsInScope().forEach(c => add(c.name, c.name));
 add(csCharName(), csCharName());
 const un = csUserName();
 add(un, un);
 try { const ctx = csCtx(); const pu = ctx.powerUserSettings; if (pu && pu.personas && ctx.userAvatar) add(pu.personas[ctx.userAvatar], un); } catch {}
 (extra || []).forEach(n => { if (!ign.has(String(n || '').trim().toLowerCase())) add(n, n); });
 return [...map.values()].sort((a, b) => b.alias.length - a.alias.length);
}
function csIsUserName(n) {
 const k = String(n || '').trim().toLowerCase();
 if (!k) return false;
 const names = [csUserName()];
 try { const ctx = csCtx(); const pu = ctx.powerUserSettings; if (pu && pu.personas && ctx.userAvatar) names.push(pu.personas[ctx.userAvatar]); } catch {}
 if (names.filter(Boolean).some(x => String(x).trim().toLowerCase() === k)) return true;
 const c = csCast(false);
 const hit = Object.keys(c).find(x => x.toLowerCase() === k);
 if (hit && c[hit].me && !c[hit].ignored) return true;
 // ชื่อเรียกอื่นของตัวเรา
 return Object.keys(c).some(x => c[x].me && !c[x].ignored && String(c[x].aliases || '').split(/[,，、\n]/).some(a => a.trim().toLowerCase() === k));
}
/** หาชื่อในข้อความ ไม่ให้ชื่อสั้นซ้อนในชื่อยาว */
/** ชื่อต้องไม่ใช่ท่อนหนึ่งของคำอื่น: ไทยไม่มีวรรณยุกต์/สระลอยต่อท้าย ไม่มีสระหน้า (เ แ โ ใ ไ) นำ เช่น "ต้น" ใน "ตื่นเต้น" · อังกฤษต้องเป็นคำเต็ม */
function csNameEdgeOk(low, i, a) {
 const pre = low[i - 1] || '', nx = low[i + a.length] || '';
 if (/[\u0E00-\u0E7F]/.test(a)) {
  if (/[เแโใไ]$/.test(a)) return false;
  if (/[เแโใไ]/.test(pre) && !/^[เแโใไ]/.test(a)) return false;
  if (/[\u0E30-\u0E3A\u0E47-\u0E4E]/.test(nx)) return false;
  return true;
 }
 return !/[a-z0-9_]/i.test(pre) && !/[a-z0-9_]/i.test(nx);
}
function csFindNames(text, known) {
 const found = [];
 const low = String(text || '').toLowerCase();
 const taken = new Array(low.length).fill(false);
 known.forEach(k => {
  const a = k.alias.toLowerCase();
  let i = low.indexOf(a);
  while (i >= 0) {
   let free = csNameEdgeOk(low, i, a);
   if (free) for (let j = i; j < i + a.length; j++) if (taken[j]) { free = false; break; }
   if (free) { for (let j = i; j < i + a.length; j++) taken[j] = true; found.push({ name: k.name, i, end: i + a.length }); }
   i = low.indexOf(a, i + 1);
  }
 });
 return found.sort((x, y) => x.i - y.i);
}
// ── เดาชื่อใหม่ที่ยังไม่เคยเจอ จากตำแหน่งติดคำพูด+กริยาพูด ──
const CS_TH_VERBS = 'พูด|ตอบ|ถาม|ตรัส|รับสั่ง|กระซิบ|ตะโกน|ตวาด|เอ่ย|บอก|แย้ง|พึมพำ|บ่น|ทัก|กล่าว|อ้อน|เปรย|งึมงำ';
const CS_EN_VERBS = 'said|says|asked|asks|whispered|shouted|replied|murmured|muttered|yelled|called|added|snapped|sighed|answered|cried|exclaimed|began|continued|breathed|growled|hissed';
const CS_NAME_STOP = /^(เขา|เธอ|หล่อน|ท่าน|มัน|เจ้า|ฉัน|ผม|ข้า|เรา|คุณ|แก|นาย|ตัวเอง|เสียง|he|she|they|i|we|you|it|the|a|an|his|her|their|then|and|but|so|when|as|that|this|there|someone|everyone|nobody|somebody|mr|mrs|ms|miss|sir|lady|voice|everybody|nothing)$/i;
const CS_NAME_STOP_PRE = /^(เขา|เธอ|หล่อน|ฉัน|ผม|พวก|ทั้ง|ทุก|ใคร|บาง|อีก|เสียง|แล้ว|จึง|ก่อน|พลาง|ทันที|ขณะ|และ|แต่|หรือ|ถ้า|เมื่อ|ค่อย|รีบ|หัน|ยิ้ม|มอง|พยัก|ส่าย|เอ่ย|กล่าว|ถาม|ตอบ|พูด|บอก|ร้อง|ชาย|หญิง|เด็ก|คน|ใคร|อะไร|ไม่|ก็)/;
// ★ 1.20 คำนามไทยที่ชอบตามหลังเครื่องหมายคำพูดหรือซ้ำบ่อย (ไม่ใช่ชื่อคน)
const CS_NOT_NAME = /^(ความ|คำ|การ|เสียง|น้ำเสียง|น้ำตา|น้ำ|ปลาย|สายตา|แววตา|ดวงตา|นัยน์ตา|ใบหน้า|หน้า|ท่าที|ท่าทาง|ริมฝีปาก|รอยยิ้ม|หัวใจ|ลมหายใจ|ร่าง|มือ|ฝ่ามือ|แขน|ขา|นิ้ว|ปาก|ตา|หัว|ตัว|ข้อ|สิ่ง|เรื่อง|ห้อง|บ้าน|ประตู|โทรศัพท์|มือถือ|หน้าจอ|จอ|ข้อความ|บรรยากาศ|อากาศ|ลม|ฝน|แสง|เงา|กลิ่น|อ้อม|อก|ไหล่|คอ|เส้นผม|ผม|หลัง|ข้าง|ใต้|บน|ใน|นอก|ระหว่าง|หลังจาก|ขณะ|เวลา|วัน|คืน|เช้า|บ่าย|เย็น|ครั้ง|ประโยค|คำพูด|คำตอบ|คำถาม|อารมณ์|ความรู้สึก|หัวเราะ|รอย|ภาพ|ใจ|โลก|ชีวิต|เพื่อน|ผู้|พี่|น้อง|แม่|พ่อ)$|^(ความ|คำ|การ|น้ำเสียง|สายตา|แววตา|ใบหน้า|ริมฝีปาก|รอยยิ้ม|หัวใจ|ลมหายใจ|ปลายนิ้ว|ปลาย|บรรยากาศ|ข้อความ)/;
/** ชื่อที่เดาได้ต้องดูเป็นชื่อจริง: ไม่ใช่คำนามทั่วไป ไม่จบกลางพยางค์ (น้ำเ) ไม่ขึ้นต้นด้วยสระลอย */
function csNameLooksValid(n) {
 n = String(n || '').trim();
 if (n.length < 2 || n.length > 30) return false;
 if (/[\u0E00-\u0E7F]/.test(n)) {
  if (/^[\u0E30-\u0E3A\u0E47-\u0E4E]/.test(n)) return false;       // ขึ้นต้นด้วยสระ/วรรณยุกต์
  if (/[เแโใไ]$/.test(n)) return false;                                 // จบด้วยสระหน้า = ตัดกลางคำ (น้ำเ)
  if (/^[ก-ฮ]$/.test(n.slice(-1)) && n.length === 2 && !/[ะ-ฺ็-๎]/.test(n)) return false; // สองพยัญชนะเปล่า ๆ
  if (CS_NOT_NAME.test(n) || CS_NAME_STOP.test(n) || CS_NAME_STOP_PRE.test(n)) return false;
 }
 return true;
}
function csGuessNewNames(text) {
 // " ตรง ๆ เป็นได้ทั้งเปิดและปิด จับคู่ทีละบรรทัดให้เป็น “ ” ก่อน จะได้ไม่เอาคำหลังเครื่องหมายเปิดไปเดาเป็นชื่อ
 const t = String(text || '').split('\n').map(l => { let k = 0, j = 0; return l.replace(/"/g, () => (k++ % 2 ? '”' : '“')).replace(/＂/g, () => (j++ % 2 ? '”' : '“')); }).join('\n');
 if (!/[“”「」『』«»]/.test(t)) return [];
 const hits = new Map();
 const add = n => {
  n = String(n || '').trim();
  for (let r = 0; r < 3; r++) n = n.replace(/^(ทันใดนั้น|ก่อนที่|ขณะที่|หลังจากที่|แล้ว|จึง|ก่อน|พลาง|ส่วน|ฝ่าย|และ|แต่|ที่|เมื่อ|พอ|ซึ่ง)/, '').replace(/(ก็|จึง|เลย|ถึง|รีบ|จะ|ได้|พลัน|ค่อย ?ๆ|เบา ?ๆ)$/, '').trim();
  if (n.length < 2 || n.length > 20 || !csNameLooksValid(n) || !/^[ก-ฮเแโใไA-Z]/.test(n)) return;
  if (/(คน|นั้น|นี้|ทุก|หนุ่ม|สาว|เสียง|ตัว|ของ|ที่|ใน|กับ|ให้|ไป|มา|ขึ้น|ลง|อยู่|ได้|แล้ว)$/.test(n)) return;
  hits.set(n, (hits.get(n) || 0) + 1);
 };
 let m;
 // ”…” มิกะพูด / “…” มิกะกระซิบ
 const th1 = new RegExp(`[”」』»]\\s*(?:,|，)?\\s*([ก-๙]{2,16}?)(?:ก็|จึง)?(?:${CS_TH_VERBS})`, 'g');
 while ((m = th1.exec(t))) add(m[1]);
 // มิกะพูดว่า “…” / มิกะเอ่ยขึ้น “…”
 const th2 = new RegExp(`(?:^|[\\s.!?！？”」』])([ก-๙]{2,24}?)(?:ก็|จึง)?(?:${CS_TH_VERBS})[ก-๙ \\t]{0,16}?[“「『«]`, 'gm');
 while ((m = th2.exec(t))) add(m[1]);
 // ”…” ภาณุภัทรเรียบเรียงคำ… — ภาษาไทยไม่เว้นวรรค: เอาช่วงหลังเครื่องหมายปิดที่ยาวที่สุดซึ่งโผล่ซ้ำที่อื่นในบท (ชื่อคนมักถูกเอ่ยซ้ำ)
 const th3 = /[”」』»][ \t]*([ก-๙]{4,24})/g;
 while ((m = th3.exec(t))) {
  const seg = m[1];
  for (let L = Math.min(18, seg.length); L >= 4; L--) {
   const sub = seg.slice(0, L), nx = seg[L] || '';
   if (/^[ะ-ฺ็-๎]/.test(nx)) continue; // ตัดกลางพยางค์
   // ชื่อที่เดาจากการซ้ำ: ต้องขึ้นต้นประโยค/ท่อน (หลังช่องว่าง เครื่องหมาย หรือต้นบรรทัด) อย่างน้อย 2 ครั้ง
   if (t.split(sub).length - 1 >= 2 && (t.match(new RegExp(`(^|[\\s“”"「」『』])${sub.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')}`, 'gm')) || []).length >= 1) { add(sub); break; }
  }
 }
 // "…," Arin said / "…" said Arin / Arin said, "…"
 const en1 = new RegExp(`[”]\\s*,?\\s*([A-Z][a-z]+(?:\\s[A-Z][a-z]+)?)\\s+(?:${CS_EN_VERBS})\\b`, 'g');
 while ((m = en1.exec(t))) add(m[1]);
 const en2 = new RegExp(`\\b(?:${CS_EN_VERBS})\\s+([A-Z][a-z]+(?:\\s[A-Z][a-z]+)?)\\b`, 'g');
 while ((m = en2.exec(t))) add(m[1]);
 const en3 = new RegExp(`(?:^|[.!?”]\\s+)([A-Z][a-z]+(?:\\s[A-Z][a-z]+)?)\\s+(?:${CS_EN_VERBS})\\b[^“\\n]{0,24}[“]`, 'gm');
 while ((m = en3.exec(t))) add(m[1]);
 // ตัดชื่อที่มีชื่อสั้นกว่านำหน้า (ภาณุภัทรเรียบเรียงคำ → มี ภาณุภัทร อยู่แล้ว)
 const base = [...hits.keys()].concat(Object.keys(csCast(false)).filter(k => !k.includes(' · ')), csStCharsInScope().map(c => String(c.name || '').trim())).filter(Boolean);
 return [...hits.keys()].filter(n => !csIsUserName(n) && !base.some(b => b !== n && b.length >= 2 && n.startsWith(b))).slice(0, 12);
}
const CS_SAY_VERB = /(พูด|ตอบ|ถาม|ตรัส|รับสั่ง|กระซิบ|ตะโกน|ตวาด|เอ่ย|บอก|แย้ง|ร้อง|พึมพำ|บ่น|สวน|ทัก|ขาน|เปรย|กล่าว|อ้อน|งึมงำ|ครวญ|หัวเราะ|ว่า|said|says|ask(?:ed|s)?|whisper(?:ed|s)?|shout(?:ed|s)?|repl(?:ied|ies)|murmur(?:ed|s)?|mutter(?:ed|s)?|yell(?:ed|s)?|call(?:ed|s)?|add(?:ed|s)|snap(?:ped|s)?|sigh(?:ed|s)?)/i;
const CS_THINK_VERB = /(คิด|นึก|ในใจ|ในหัว|ภาวนา|thought|thinks|wonder(?:ed|s)?)/i;
const CS_PRONOUN = /(^|[\s“"])(เขา|เธอ|หล่อน|ท่าน|มัน|เจ้า|he|she|they)(?=\s|$|[^฀-๿a-z])/i;
// เครื่องหมายคำพูดทุกแบบ (คู่เปิดปิด) · ‘ ’ กับ 『』 ถือเป็นความคิดถ้าไม่มีคำพูดกำกับ
const CS_Q_ANY = /“([^”]+)”|"([^"]+)"|「([^」]+)」|『([^』]+)』|«([^»]+)»|‹([^›]+)›|＂([^＂]+)＂|‘([^’]+)’|”([^”]+)”/g;
/**
 * แยกบรรทัดร้อยแก้วเป็นบรรยาย + คำพูด พร้อมหาว่าใครพูด
 * st = สถานะข้ามบรรทัดในข้อความเดียว { last:[คนพูดล่าสุด 2 คน], mention:ชื่อที่ถูกเอ่ยล่าสุด, pending:ชื่อบทละคร }
 */
function csProseLine(line, owner, known, st, out, isUserMsg) {
 const say = (who, text, think) => {
  const t = String(text || '').trim();
  if (!t) return;
  out.push({ k: think ? 'think' : 'say', who, tag: think ? 'คิด' : '', text: t, u: csUFlag(who, owner, isUserMsg), c: st.pc || 'weak' });
  if (!think) { st.last = [who, ...st.last.filter(x => x !== who)].slice(0, 2); }
  st.pc = ''; st.since = []; st.sinceG = '';
 };
 const narr = t => { t = String(t || '').replace(/\*+/g, '').replace(/^[\s,，:：\-–—]+|[\s,，:：\-–—]+$/g, '').trim(); if (t) out.push({ k: 'narr', text: t }); };
 const names = csFindNames(line, known);
 const seeIn = t => csSee(st, csFindNames(t, known).map(x => x.name));
 // แบบบทละคร: บรรทัดก่อนหน้าเป็นชื่อล้วน
 if (st.pending) { const who = st.pending; st.pending = null; st.pc = 'line'; say(who, csStripQuotes(line.replace(/^[—–\-]\s*/, '')), false); return true; }
 const bare = line.replace(/[:：]$/, '').trim().toLowerCase();
 const exact = known.find(k => k.alias.toLowerCase() === bare);
 if (exact) { st.pending = exact.name; st.pendingRaw = line; return true; }
 // บทพูดขึ้นต้นด้วยขีดยาว
 let m = line.match(/^[—–]\s*(.+?)\s*[—–]\s*(.+)$/); // — คำพูด — เคนว่า
 if (m && !/[“"「『«]/.test(m[1])) { const who = csPickSpeaker('', m[2], known, st, owner, false, m[1]); say(who, m[1], false); narr(m[2]); seeIn(m[2]); return true; }
 m = line.match(/^[—–]\s*(.+)$/);
 if (m && !/[“"「『«]/.test(m[1])) { const who = csPickSpeaker('', '', known, st, owner, true, m[1]); say(who, m[1], false); return true; }
 // เปิดเครื่องหมายคำพูดแล้วไม่ปิด
 const opens = (line.match(/[“"「『«]/g) || []).length, closes = (line.match(/[”"」』»]/g) || []).length;
 CS_Q_ANY.lastIndex = 0;
 const hasPair = CS_Q_ANY.test(line);
 CS_Q_ANY.lastIndex = 0;
 if (!hasPair) {
  m = line.match(/^(.*?)[“「『«](.+)$/);
  if (m && opens > closes) { narr(m[1]); seeIn(m[1]); say(csPickSpeaker(m[1], '', known, st, owner, !m[1].trim(), m[2]), m[2], /『/.test(line)); return true; }
  csSeeNarr(st, line, known); // บรรทัดบรรยาย: จำว่าใครอยู่ในฉาก
  return false;
 }
 const segs = [];
 let mm;
 while ((mm = CS_Q_ANY.exec(line))) segs.push({ i: mm.index, end: CS_Q_ANY.lastIndex, q: (mm.slice(1).find(Boolean) || '').trim(), mark: mm[0][0] });
 const quoteOnly = !line.replace(CS_Q_ANY, '').replace(/[\s.,，…!?！？]/g, '');
 let prevEnd = 0;
 segs.forEach((sg, k) => {
  const before = line.slice(prevEnd, sg.i);
  const after = line.slice(sg.end, k + 1 < segs.length ? segs[k + 1].i : line.length);
  narr(before);
  seeIn(before);
  const cue = before + ' ' + after;
  const thinkMark = sg.mark === '『' || sg.mark === '‘';
  const think = (thinkMark && !CS_SAY_VERB.test(cue)) || (CS_THINK_VERB.test(cue) && !CS_SAY_VERB.test(cue.replace(CS_THINK_VERB, '')));
  const who = csPickSpeaker(before, after, known, st, owner, quoteOnly, sg.q);
  say(who, sg.q, think);
  seeIn(after);
  prevEnd = sg.end;
  if (k === segs.length - 1) narr(after);
 });
 return true;
}
/** จำคนที่ถูกเอ่ยถึงในฉาก ล่าสุดอยู่หน้า */
/** บรรทัดบรรยายล้วนหลังคนพูด: ใครถูกเอ่ยถึง / เธอ-เขา ขึ้นต้น = คนที่น่าจะพูดต่อ */
function csSeeNarr(st, text, known) {
 const names = csFindNames(text, known).filter(x => !csNameIsObject(text, x)).map(x => x.name);
 csSee(st, csFindNames(text, known).map(x => x.name));
 st.since = [...new Set([...names.slice().reverse(), ...(st.since || [])])];
 const g = csGenderWord(String(text).trim());
 if (g) st.sinceG = g;
}
// ชื่อที่เป็นกรรม (มองพล / เดินไปหาพล) ไม่ใช่คนทำ
const CS_OBJ_BEFORE = /(มอง|หา|ถึง|กับ|ให้|ของ|ที่|ไป|ต่อ|แก่|จาก|ใส่|เรียก|ชวน|ถาม|ตาม|พา|จ้อง|ใกล้|ข้าง|หลัง|กอด|จับ|แตะ|ผลัก|ดึง|โอบ|เห็น|รอ|บอก|ตอบ|at|to|with|toward|towards|behind)\s*$/i;
function csNameIsObject(text, x) { return CS_OBJ_BEFORE.test(String(text).slice(Math.max(0, x.i - 10), x.i)); }
function csSee(st, names) {
 (names || []).forEach(n => { if (n) st.seen = [n, ...(st.seen || []).filter(x => x !== n)].slice(0, 12); });
 st.mention = (st.seen || [])[0] || st.mention;
}
// ── เพศ ใช้ตัดตัวเลือกตอนเดาคนพูด (ค่ะ/ครับ ในคำพูด · เธอ/เขา ในบรรยาย) ──
const CS_G_M = /(ครับ|คับ)(?![ก-๙])|ครับผม|ขอรับ|กระผม/;
const CS_G_F = /(ค่ะ|คะ|ค่า|คร้า|คร่า|ดิฉัน)(?![ก-๙])|นะคะ|จ้ะ/;
function csGenderText(t) {
 t = String(t || '').replace(/พ่ะย่ะค่ะ|พะยะค่ะ|พ่ะย่ะ/g, '');
 const m = CS_G_M.test(t), f = CS_G_F.test(t);
 return m && !f ? 'm' : f && !m ? 'f' : '';
}
function csGenderWord(w) {
 return /^(เธอ|หล่อน|หญิงสาว|เด็กสาว|she\b|her\b)/i.test(w) ? 'f' : /^(เขา(?!ไป|มา)|ชายหนุ่ม|เด็กหนุ่ม|he\b|his\b)/i.test(w) ? 'm' : '';
}
/** บรรยายติดคำพูด: ท่อนหลังขึ้นต้น หรือท่อนก่อนหน้าท่อนสุดท้ายขึ้นต้นด้วย เธอ/เขา */
function csGenderCue(before, after) {
 const a = String(after || '').trim();
 const bl = String(before || '').trim().split(/\s+/).filter(Boolean);
 return csGenderWord(a) || (bl.length ? csGenderWord(bl[bl.length - 1]) || (bl.length > 1 ? csGenderWord(bl[bl.length - 2]) : '') : '');
}
let csGCache = { key: '', map: new Map() };
/** เพศที่เรียนจากแชท: บรรทัด "ชื่อ: …" ข้อความของเราเอง และคำพูดที่มีชื่อกำกับชัด */
function csGenderLearned() {
 const chat = csCtx().chat || [];
 const lastM = chat[chat.length - 1];
 const key = csScope() + ':' + chat.length + ':' + csHash(lastM && lastM.mes);
 if (csGCache.key === key) return csGCache.map;
 csGCache = { key, map: new Map() };
 const votes = {};
 chat.slice(-80).forEach(m => {
  if (!m || m.is_system) return;
  let items = [];
  try { items = csParse(m.mes, { isUser: !!m.is_user, owner: m.name, noGender: true }); } catch {}
  items.forEach(it => {
   if (it.k !== 'say' || !it.who) return;
   if (!(it.c === 'line' || it.c === 'name' || (m.is_user && it.who === m.name))) return;
   const g = csGenderText(it.text);
   if (!g) return;
   const k = it.who.toLowerCase();
   votes[k] = votes[k] || { m: 0, f: 0 };
   votes[k][g]++;
  });
 });
 Object.keys(votes).forEach(k => { const v = votes[k]; if (v.m && v.m >= v.f * 2) csGCache.map.set(k, 'm'); else if (v.f && v.f >= v.m * 2) csGCache.map.set(k, 'f'); });
 return csGCache.map;
}
/** เพศจากคำอธิบายการ์ด / เพอร์โซนา */
function csGenderDesc(n) {
 let txt = '';
 try {
  if (csIsUserName(n)) { const ctx = csCtx(); const pu = ctx.powerUserSettings || {}; txt = (pu.persona_descriptions && pu.persona_descriptions[ctx.userAvatar] && pu.persona_descriptions[ctx.userAvatar].description) || pu.persona_description || ''; }
  else { const c = csStCharFor(n); if (c) txt = [c.description, c.personality, c.data && c.data.description].filter(Boolean).join(' '); }
 } catch {}
 const f = (String(txt).match(/\b(she|her|hers|herself|female|woman|girl)\b|ผู้หญิง|หญิงสาว|เพศหญิง/gi) || []).length;
 const m = (String(txt).match(/\b(he|him|his|himself|male|man|boy)\b|ผู้ชาย|ชายหนุ่ม|เพศชาย/gi) || []).length;
 return f >= 2 && f >= m * 2 ? 'f' : m >= 2 && m >= f * 2 ? 'm' : '';
}
/** เพศของตัวละคร: ที่ผู้ใช้ตั้ง > เรียนจากแชท > คำอธิบายการ์ด · ไม่รู้ = '' */
function csGenderOf(name) {
 const n = String(name || '').trim();
 if (!n) return '';
 const o = csCastGet(n);
 if (o && (o.g === 'm' || o.g === 'f')) return o.g;
 return csGenderLearned().get(n.toLowerCase()) || csGenderDesc(n);
}
/** เลือกคนพูดจากบริบทรอบคำพูด · st.pc บอกความมั่นใจ (name = มีชื่อติดคำพูด) */
function csPickSpeaker(before, after, known, st, owner, quoteOnly, qtext) {
 st.seen = st.seen || [];
 const gq = st.ng ? '' : (csGenderText(qtext) || csGenderCue(before, after));
 const ok = n => !gq || !n || (csGenderOf(n) || gq) === gq;
 const b = csFindNames(before, known), a = csFindNames(after, known);
 const cands = [];
 const lb = before.length;
 // ★ 1.16 กริยาพูดต้องอยู่ติดชื่อ (ไม่เกิน ~14 ตัว) และชื่อต้องเป็นคนทำ ไม่ใช่กรรม (มองพล…แล้วเอ่ย = ไม่ใช่พลพูด)
 b.forEach(x => {
  const gap = before.slice(x.end), obj = csNameIsObject(before, x);
  const tight = !obj && gap.length <= 14 && CS_SAY_VERB.test(gap);
  cands.push({ name: x.name, d: lb - x.end - (tight ? 40 : 0) + (obj ? 60 : 0), tight });
 });
 a.forEach(x => {
  const gap = after.slice(0, x.i), tail = after.slice(x.end, x.end + 14), obj = csNameIsObject(after, x);
  const tight = !obj && (CS_SAY_VERB.test(tail) || (gap.length <= 14 && CS_SAY_VERB.test(gap)));
  cands.push({ name: x.name, d: x.i - (tight ? 40 : 0) + (obj ? 60 : 0) + 1, tight });
 });
 cands.sort((x, y) => x.d - y.d);
 const near = cands.filter(c => c.d <= 60);
 const gText = st.ng ? '' : csGenderText(qtext);
 const hardNo = n => gText && csGenderOf(n) && csGenderOf(n) !== gText; // ค่ะ/ครับ ขัดกับเพศที่รู้แน่
 // ข้อความที่เราพิมพ์เอง: เป็นของเรา เว้นแต่มีชื่อติดคำพูดชัด ๆ
 if (st.um) { const t = near.find(c => c.tight && !hardNo(c.name)); if (t) { st.pc = 'name'; return t.name; } return owner; }
 // ชื่อติดคำพูด + กริยาพูด ชนะ · ชื่อใกล้ ๆ ที่เพศไม่ขัด
 if (near.length && ((near[0].tight && !hardNo(near[0].name)) || ok(near[0].name))) { if (near[0].d <= 20) st.pc = 'name'; return near[0].name; }
 const nearOk = near.find(c => ok(c.name));
 if (nearOk) return nearOk.name;
 const scene = [...new Set([...st.seen, ...st.last, owner, csUserName()].filter(Boolean))];
 // คนในฉาก: เพศตรงชัด > ไม่รู้เพศ · คนที่เพิ่งถูกเอ่ยถึง > ตัวละครหลักของข้อความ (สรรพนามมักหมายถึงตัวหลัก) > คนอื่น
 const rank = n => !gq ? 1 : (csGenderOf(n) === gq ? 2 : csGenderOf(n) ? 0 : 1);
 const firstOk = () => {
  for (const r of [2, 1]) {
   if (st.seen[0] && rank(st.seen[0]) === r) return st.seen[0];
   if (owner && st.seen.includes(owner) && rank(owner) === r) return owner;
   const n = scene.find(x => rank(x) === r);
   if (n) return n;
  }
  return '';
 };
 const cue = before + ' ' + after;
 // เขา/เธอ + กริยาพูด = คนในฉากที่ถูกเอ่ยถึงล่าสุด (เพศตรงกัน)
 if (CS_PRONOUN.test(cue) && CS_SAY_VERB.test(cue)) { const n = firstOk(); if (n) return n; }
 // คำพูดล้วน: บรรยายระหว่างทางเอ่ยถึงใคร (ไม่ใช่กรรม) = คนนั้นพูด · เธอ/เขาขึ้นต้น = คนในฉากเพศนั้น · ไม่มีเลย = สลับกับอีกคน
 if (quoteOnly) {
  const sn = (st.since || []).find(ok);
  if (sn) return sn;
  if (st.sinceG) { const n = scene.find(x => csGenderOf(x) === st.sinceG && ok(x)); if (n) return n; }
  if (st.last.length === 2 && ok(st.last[1])) return st.last[1];
  if (st.last.length >= 1 && !cands.length && ok(st.last[0])) return st.last[0]; // พูดต่อจากคนเดิม
 }
 // รู้เพศจาก ค่ะ/ครับ หรือ เธอ/เขา แต่ไม่มีชื่อ = คนในฉากที่เพศตรง
 if (gq) { const n = firstOk(); if (n) return n; }
 if (cands.length) return cands[0].name;
 return st.seen[0] && !quoteOnly && CS_SAY_VERB.test(cue) ? st.seen[0] : owner;
}

function csFmt(t) { return csEsc(t).replace(/`([^`\n]+)`/g, '<code class="cs-ic">$1</code>').replace(/\*\*([^*]+)\*\*/g, '<b>$1</b>').replace(/_([^_]+)_/g, '<i>$1</i>'); }
/** ค่าของตัวละคร (สี เสียง) ในแชทนี้ · ค่าเก่าก่อน 1.8 ที่ตั้งแบบรวมใช้เป็นค่าสำรอง */
function csCharOpt(who, ck) {
 const n = String(who || '').trim();
 const legacy = csCfg().chars[n] || {};
 const own = (ck && csCastGet(ck)) || csCastGet(n) || {};
 return { color: own.color || legacy.color || '', sound: own.sound || legacy.sound || '' };
}
function csItemHTML(it, prev) {
 const html = (it.hd ? `<div class="cs-turn" aria-label="${csChWord()}ที่ ${it.hd}"><span>${csChWord()} ${it.hd}</span></div>` : '') + csItemHTML0(it, prev);
 return it.cm !== undefined && csCfg().cmtOn ? html + csCmtBarHTML(it.cm) : html;
}
function csItemHTML0(it, prev) {
 if (it.k === 'code') return csCodeBlockHTML(it);
 if (it.k === 'html') return csHtmlBlockHTML(it.text);
 if (it.k === 'scene') return `<div class="cs-scene"><span>${csFmt(it.text)}</span></div>`;
 if (it.k === 'narr') return `<div class="cs-narr">${csFmt(it.text)}</div>`;
 const s = csCfg();
 const user = csItemIsUser(it);
 const side = user ? (s.userSide === 'left' ? 'left' : 'right') : 'left';
 const cont = prev && (prev.k === 'say' || prev.k === 'think') && prev.who === it.who && csItemIsUser(prev) === user && (prev.ck || '') === (it.ck || '');
 const hue = csHash(it.ck || it.who) % 360;
 const co = csCharOpt(it.who, it.ck);
 const bstyle = co.color && it.k !== 'think' ? ` style="--cs-bb:${csEsc(co.color)};background:${csEsc(co.color)};color:${csTextOn(co.color)}"` : '';
 const nstyle = s.nameColor === 'rainbow' ? ` style="color:hsl(${hue} 55% ${csLum(csColors().bg) < .2 ? 72 : 42}%)"` : (co.color ? ` style="color:${csEsc(co.color)}"` : '');
 const showAv = side === 'left' && s.avatar !== 'none';
 return `<div class="cs-row ${side}${cont ? ' cont' : ''}">
  ${showAv ? `<div class="cs-avwrap">${cont ? '' : csAvatarHTML(it.who, it.av, user || csIsUserName(it.who), it.ck)}</div>` : ''}
  <div class="cs-col">${cont || side === 'right' ? '' : `<div class="cs-name"${nstyle}>${csEsc(it.who)}${it.tag && it.k !== 'think' ? ` <i>${csEsc(it.tag)}</i>` : ''}</div>`}
   <div class="cs-bubble${it.k === 'think' ? ' think' : ''}"${bstyle}>${csFmt(it.text)}</div></div>
 </div>`;
}
function csTypingHTML(who) {
 const s = csCfg();
 const it = who && typeof who === 'object' ? who : { who };
 const user = csItemIsUser(it);
 const side = user ? (s.userSide === 'left' ? 'left' : 'right') : 'left';
 return `<div class="cs-row ${side} cs-typing-row">${side === 'left' && s.avatar !== 'none' ? `<div class="cs-avwrap">${csAvatarHTML(it.who, it.av, user, it.ck)}</div>` : ''}<div class="cs-col"><div class="cs-bubble cs-typing"><span></span><span></span><span></span></div></div></div>`;
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
 if ((it.k === 'narr' || it.k === 'scene' || it.k === 'code' || it.k === 'html') && !s.narrSound) return false;
 if (s.sound === 'none') return false;
 const kind = it.k === 'narr' || it.k === 'code' || it.k === 'html' ? 'narr' : it.k === 'scene' ? 'scene' : it.k === 'think' ? 'think' : (csItemIsUser(it) ? 'out' : 'in');
 const per = it.who ? csCharOpt(it.who, it.ck).sound : '';
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
  if (ms > 0 && (it.k === 'say' || it.k === 'think') && !csItemIsUser(it)) {
   const el = document.createElement('div');
   el.className = 'cs-item cs-pop';
   el.innerHTML = csTypingHTML(it);
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
 /** แสดงถึงฟองที่ n ทันที ไม่มีเสียง (อ่านต่อจากที่ค้าง) */
 skipTo(n) {
  if (this.typing) { clearTimeout(this.typing.timer); this.typing.el.remove(); this.i = this.typing.idx; this.typing = null; }
  while (this.i < Math.min(n, this.items.length)) { this.render(this.i, false).classList.add('cs-old'); this.i++; }
  csScrollEnd([...this.list.querySelectorAll(':scope > .cs-item')].pop(), true);
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
 const chat = csCtx().chat || [];
 const m = chat[mesId];
 if (!m || m.is_system) return [];
 const items = csMarkCmt(csParseMessage(m), m, mesId);
 // ★ 1.18 เส้นคั่นบทตอนเริ่มคำตอบของบอท (เลขเดียวกับหน้านิยาย)
 if (items.length && !m.is_user) { let n = 0; for (let i = 0; i <= mesId; i++) if (chat[i] && !chat[i].is_user && !chat[i].is_system) n++; items[0].hd = n; }
 return items;
}
/** ★ 1.10 ฟองสุดท้ายของข้อความบอทมีแถบคอมเมนต์ (แชทนิยายก็ดูคอมเมนต์ได้) · จำว่ามาจากข้อความไหนไว้เซฟตำแหน่งอ่าน */
function csMarkCmt(items, m, mesId) {
 items.forEach((it, k) => { it._m = mesId; it._k = k; });
 const s = csCfg();
 if (items.length && m && !m.is_user && s.enabled && s.cmtOn) items[items.length - 1].cm = mesId;
 return items;
}
/** รูปและกุญแจของการ์ดที่ส่งข้อความนี้จริง ๆ (ในกลุ่มมีชื่อซ้ำได้ ดูจากไฟล์การ์ดไม่ใช่ชื่อ) */
function csMessageOwner(m) {
 if (!m || m.is_user) return { av: '', ck: '' };
 let file = m.original_avatar || '';
 if (!file) { try { const ctx = csCtx(); if (!ctx.groupId) { const c = (ctx.characters || [])[ctx.characterId]; if (c && String(c.name || '').trim() === String(m.name || '').trim()) file = c.avatar; } } catch {} }
 if (!file && m.force_avatar) { const r = String(m.force_avatar).match(/[?&]file=([^&]+)/); if (r) try { file = decodeURIComponent(r[1]); } catch { file = r[1]; } }
 const av = file ? csThumb(file) : (m.force_avatar || '');
 return { av, ck: file ? csCastKey(m.name, file) : '' };
}
function csParseMessage(m) {
 const o = csMessageOwner(m);
 return csParse(m.mes, { isUser: !!m.is_user, owner: m.name, av: o.av, ck: o.ck });
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
   <button class="cs-btn" data-cs="toNovel" title="สลับเป็นแบบนิยาย"><i class="fa-solid fa-book"></i></button>
   <button class="cs-btn" data-cs="auto" title="เล่นอัตโนมัติ"><i class="fa-solid fa-play"></i></button>
   <button class="cs-btn" data-cs="more" title="เพิ่มเติม"><i class="fa-solid fa-ellipsis"></i></button>
   <div class="cs-menu">
    <button data-cs="back"><i class="fa-solid fa-rotate-left"></i>ย้อนกลับหนึ่งฟอง</button>
    <button data-cs="all"><i class="fa-solid fa-forward-fast"></i>แสดงทั้งหมด</button>
    <button data-cs="regen"><i class="fa-solid fa-rotate-right"></i>เจนใหม่</button>
    <button data-cs="dellast"><i class="fa-solid fa-trash-can"></i>ลบข้อความล่าสุด</button>
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
 if (sub) sub.textContent = csGenerating ? 'กำลังพิมพ์…' : csCmtBusy.size ? 'คนอ่านกำลังเม้นท์…' : (total ? `${shown}/${total}` : '');
 el.classList.toggle('done', player.done);
 el.classList.toggle('generating', csGenerating);
 if (csReader.key === 'all') { const it = player.items[Math.min(player.i, player.items.length) - 1]; if (it && it._m !== undefined) csPosSave('chat', { m: it._m, k: it._k }); }
 const send = el.querySelector('.cs-send i');
 if (send) send.className = csGenerating ? 'fa-solid fa-stop' : 'fa-solid fa-paper-plane';
 const sb = el.querySelector('.cs-send'); if (sb) { sb.title = csGenerating ? 'หยุด' : 'ส่ง'; sb.setAttribute('aria-label', sb.title); }
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
 if (b && b.dataset.cs !== 'tap' && csCmtClick(b.dataset.cs, b)) { e.stopPropagation(); return; }
 if (csCmtIsOpen()) { if (!e.target.closest('.cs-cmt-sheet')) csCmtClose(); return; }
 const menu = csReader && csReader.el.querySelector('.cs-menu');
 if (menu && menu.classList.contains('open') && !e.target.closest('.cs-menu')) { menu.classList.remove('open'); if (!b || b.dataset.cs === 'tap') return; }
 if (!b || !csReader) return;
 const a = b.dataset.cs;
 if (a !== 'tap') e.stopPropagation();
 if (a === 'close') return csCloseReader();
 if (a === 'toNovel') return csSwitchStyle('novel');
 if (a === 'more') return menu && menu.classList.toggle('open');
 if (a === 'back') { menu && menu.classList.remove('open'); csStopAuto(); return csReader.player.back(); }
 if (a === 'all') { menu && menu.classList.remove('open'); csStopAuto(); return csReader.player.all(); }
 if (a === 'settings') { menu && menu.classList.remove('open'); return csOpenSettings(); }
 if (a === 'regen') { menu && menu.classList.remove('open'); return csRegen(); }
 if (a === 'dellast') { menu && menu.classList.remove('open'); return csDeleteLast(); }
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
 if (csCmtOpen && csCmtOpen.host === csReader.el) csCmtClose();
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
 if (csCmtIsOpen()) { if (e.key === 'Escape') { e.preventDefault(); csCmtClose(); } return; }
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
 if (csGenerating) { csToast('รอให้ตอบเสร็จก่อน'); return false; }
 const st = document.getElementById('send_textarea');
 const btn = document.getElementById('send_but');
 if (!st || !btn) { csToast('หาช่องส่งข้อความไม่เจอ'); return false; }
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
/** ★ 1.16 เจนใหม่โดยไม่ต้องออกจากหน้าอ่าน (ใช้ปุ่ม Regenerate ของ SillyTavern) */
function csRegen() {
 if (csGenerating || csStBusy()) { csToast('รอให้ตอบเสร็จก่อน'); return false; }
 const chat = csCtx().chat || [];
 const last = chat[chat.length - 1];
 if (last && !last.is_user && !last.is_system) { csReaderPrune(chat.length - 1); }
 const b = document.getElementById('option_regenerate');
 if (b) b.click();
 else { try { csCtx().generate('regenerate'); } catch (e) { csToast('เจนใหม่ไม่ได้'); return false; } }
 return true;
}
/** ลบข้อความล่าสุด (ถามก่อน) แล้วอัปเดตหน้าอ่านทันที */
async function csDeleteLast() {
 if (csGenerating || csStBusy()) { csToast('รอให้ตอบเสร็จก่อน'); return false; }
 const ctx = csCtx();
 const chat = ctx.chat || [];
 const m = chat[chat.length - 1];
 if (!m) { csToast('ไม่มีข้อความให้ลบ'); return false; }
 const who = m.is_user ? 'ข้อความของเรา' : `ข้อความของ ${m.name}`;
 if (!confirm(`ลบ${who}ล่าสุด?\n\n“${String(m.mes || '').replace(/\s+/g, ' ').slice(0, 80)}…”`)) return false;
 try {
  if (typeof ctx.deleteLastMessage === 'function') await ctx.deleteLastMessage();
  else { chat.pop(); document.querySelector('#chat .mes:last-child')?.remove(); }
  await ctx.saveChat?.();
 } catch (e) { csToast('ลบไม่สำเร็จ'); return false; }
 csAfterDelete();
 csToast('ลบแล้ว', 'ok');
 return true;
}
/** เอาฟองของข้อความตั้งแต่ id นี้ออกจากหน้าอ่าน */
function csReaderPrune(fromId) {
 if (!csReader) return;
 const p = csReader.player;
 if (p.typing) { clearTimeout(p.typing.timer); p.typing.el.remove(); p.typing = null; }
 const keep = p.items.filter(it => it._m === undefined || it._m < fromId);
 const shownKept = p.items.slice(0, p.i).filter(it => it._m === undefined || it._m < fromId).length;
 const floorKept = p.items.slice(0, p.floor || 0).filter(it => it._m === undefined || it._m < fromId).length;
 p.items = keep; p.i = shownKept; p.floor = floorKept;
 csRerenderReader();
 csReaderUpdate();
}
function csAfterDelete() {
 const n = (csCtx().chat || []).length;
 csReaderPrune(n);
 if (csNovel) csNovelRefresh(false);
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
 const items = csMarkCmt(csParseMessage(m), m, mesId);
 if (!items.length) return;
 csLoadCurrentFont();
 mes.querySelector('.cs-mescmt')?.remove();
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
 const bar = e.target.closest && e.target.closest('#chat .cs-cmtbar');
 if (bar) { e.stopPropagation(); e.preventDefault(); csCmtClick('cmtall', bar); return; }
 const wrap = e.target.closest('.cs-inline');
 if (!wrap || wrap.classList.contains('done')) return;
 const mes = wrap.closest('.mes');
 const p = csInlineState.get(mes ? +mes.getAttribute('mesid') : NaN);
 if (!p) return;
 e.stopPropagation();
 if (e.target.closest('[data-cs-all]')) p.all(); else p.next();
}
function csInlineAll() {
 setTimeout(csMesCmtAll, 0);
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
 if (!extra || extra.querySelector('.cs-mes-btn')) { csMesCmt(mesId); return; }
 const b = document.createElement('div');
 b.className = 'mes_button cs-mes-btn fa-solid fa-book-open interactable';
 b.title = 'อ่านแบบนิยายแชท';
 b.tabIndex = 0;
 extra.prepend(b);
 csMesCmt(mesId);
}
function csAddAllButtons() { document.querySelectorAll('#chat .mes').forEach(m => csAddMesButton(m.getAttribute('mesid'))); }
/** ★ 1.16 ไอคอนคอมเมนต์ใต้ข้อความบอทในแชทหลักของ SillyTavern (แตะแล้วเปิดแผ่นคอมเมนต์ทับแชท) */
function csMesCmt(mesId) {
 const mes = document.querySelector(`#chat .mes[mesid="${mesId}"]`);
 if (!mes) return;
 const s = csCfg(), m = (csCtx().chat || [])[mesId];
 const box = mes.querySelector('.mes_text');
 const old = mes.querySelector('.cs-mescmt');
 const inInline = box && box.querySelector('.cs-cmtbar, .cs-inline'); // แชทหลักแบบฟองมีไอคอนในตัวแล้ว
 if (!(s.enabled && s.cmtOn && m && !m.is_user && !m.is_system && box) || inInline) { if (old) old.remove(); return; }
 const html = csCmtBarHTML(+mesId).replace('cs-cmtbar-wrap', 'cs-cmtbar-wrap cs-mescmt');
 if (old) old.outerHTML = html; else box.insertAdjacentHTML('afterend', html);
}
function csMesCmtAll() { document.querySelectorAll('#chat .mes').forEach(m => csMesCmt(m.getAttribute('mesid'))); }
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
 mk('cs-wand-all', 'fa-book', 'อ่านทั้งแชท', () => csOpenReadAll());
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
 const keepTop = box.scrollTop; // ★ 1.5 ปรับค่าแล้วตัวอย่างไม่เด้งกลับขึ้นบน
 requestAnimationFrame(() => { box.scrollTop = keepTop; });
 csApplyVars(box);
 csLoadCurrentFont();
 box.classList.toggle('novel', csCfg().style === 'novel');
 if (csCfg().style === 'novel') {
  csApplyNovelVars(box);
  const cn = csCharName() || 'ตัวละคร';
  box.innerHTML = `<div class="cs-page"><section class="cs-chapter"><header class="cs-chead"><span class="cs-cno"><b>12</b><small>${csChWord()}</small></span><h2 class="cs-ctitle">คำตอบที่ห้องสมุด</h2><span class="cs-cbook">${csEsc(csCharName() || 'ชื่อเรื่อง')}</span></header>
   <div class="cs-nuser${csCfg().userInNovel === 'mark' ? ' mark' : ''}"${csCfg().userInNovel === 'hide' ? ' hidden' : ''}><p class="cs-np">${csEsc(csUserName())} ผลักประตูห้องสมุดเข้าไปเบา ๆ</p></div>
   <p class="cs-np">แสงแดดสุดท้ายลอดผ่านหน้าต่างบานสูง ${csEsc(cn)} เงยหน้าขึ้นจากหนังสือ “ยังไม่กลับบ้านอีกเหรอ ฉันรออยู่ตั้งนานแล้วนะ”</p>
   <p class="cs-np">เสียงนาฬิกาบนผนังเดินช้าลงราวกับจงใจ</p></section></div>`;
  return;
 }
 const items = csPreviewItems();
 box.innerHTML = `<div class="cs-list">${items.map((it, i) => `<div class="cs-item">${csItemHTML(it, items[i - 1])}</div>`).join('')}</div>`;
}
/** ดึงชื่อคนพูดใหม่จากข้อความเข้ารายชื่อตัวละครของแชทนี้ */
function csCastCollect(ids) {
 const chat = csCtx().chat || [];
 const names = [];
 (ids || []).forEach(i => {
  const m = chat[i];
  if (!m || m.is_system) return;
  try { csParseMessage(m).forEach(it => { if ((it.k === 'say' || it.k === 'think') && it.who && !it.u && !it.ck) names.push(it.who); }); } catch {}
 });
 return csCastNote(names);
}
/** รายชื่อในแท็บตัวละคร: การ์ดในแชทนี้ก่อน แล้วชื่อที่เพิ่มเอง แล้วชื่อที่เจอในเรื่อง */
function csSpeakers() {
 const chat = csCtx().chat || [];
 csCastCollect(chat.map((m, i) => i).slice(-60));
 const rows = [], seen = new Set();
 const push = r => { const k = r.key.toLowerCase(); if (seen.has(k)) return; seen.add(k); seen.add(r.name.toLowerCase()); rows.push(r); };
 const dup = csDupNames();
 csStCharsInScope().forEach(c => {
  const name = String(c.name || '').trim();
  const key = dup.has(name.toLowerCase()) ? csCastKey(name, c.avatar) : name;
  if (key) push({ key, name, card: true, av: csThumb(c.avatar), file: dup.has(name.toLowerCase()) ? c.avatar : '' });
 });
 const cast = csCast(false);
 const ks = Object.keys(cast).filter(k => !cast[k].ignored && !k.includes(' · '));
 ks.filter(k => !cast[k].auto).concat(ks.filter(k => cast[k].auto)).forEach(k => push({ key: k, name: k }));
 return rows;
}
function csCharsTabHTML() {
 const rows = csSpeakers();
 const cast = csCast(false);
 const hidden = Object.keys(cast).filter(k => cast[k].ignored).length;
 const th = csColors().inBg;
 const row = r => {
  const o = cast[r.key] || {};
  const co = csCharOpt(r.name, r.key !== r.name ? r.key : '');
  const k = csEsc(r.key);
  const badges = [r.card ? 'การ์ด' : '', o.me ? 'ตัวเรา' : '', !r.card && o.auto ? 'เจอในเรื่อง' : '', !r.card && !o.auto ? 'เพิ่มเอง' : ''].filter(Boolean);
  return `<div class="cs-card cs-charrow" data-row="${k}">
   <div class="cs-charh"><label class="cs-cast-pic" title="เปลี่ยนรูป">${csAvatarHTML(r.name, r.av, false, r.key)}<i class="fa-solid fa-camera"></i><input type="file" accept="image/*" data-upload="castimg" data-char="${k}" hidden></label>
    <span class="cs-cast-meta"><b>${csEsc(r.name)}</b><small>${badges.map(x => `<i>${x}</i>`).join('')}${r.file ? `<em>${csEsc(r.file)}</em>` : ''}</small></span>
    ${r.card ? '' : `<button class="cs-cast-x" data-act="cast-del" data-char="${k}" title="ลบออกจากรายชื่อ"><i class="fa-solid fa-trash-can"></i></button>`}</div>
   <div class="cs-charc"><label class="cs-color sm"><input type="color" data-char="${k}" data-name="${csEsc(r.name)}" data-f="color" value="${co.color || th}"><span class="cs-sw" style="background:${co.color || th}"></span><span class="cs-cl"><b>สีฟอง</b><small>${co.color ? co.color : 'ตามธีม'}</small></span></label>
    <select class="cs-sel" data-char="${k}" data-name="${csEsc(r.name)}" data-f="sound"><option value="">เสียงตามค่าหลัก</option>${CS_SOUNDS.filter(x => x.id !== 'custom').map(x => `<option value="${x.id}"${co.sound === x.id ? ' selected' : ''}>${x.name}</option>`).join('')}</select></div>
   <div class="cs-charc"><span class="cs-cast-gl">เพศ</span><select class="cs-sel" data-char="${k}" data-f="g">${[['', 'อัตโนมัติ' + (() => { const g = o.g ? '' : csGenderOf(r.name); return g ? ` (เดาว่า${g === 'm' ? 'ชาย' : 'หญิง'})` : ''; })()], ['m', 'ชาย'], ['f', 'หญิง']].map(([v, l]) => `<option value="${v}"${(o.g || '') === v ? ' selected' : ''}>${l}</option>`).join('')}</select></div>
   ${r.file ? '' : `<input class="cs-text cs-cast-alias" data-char="${k}" data-f="aliases" value="${csEsc(o.aliases || '')}" placeholder="ชื่อเรียกอื่น คั่นด้วย , เช่น พี่มิ, คุณหนู" maxlength="200">`}
   <div class="cs-cast-foot">${r.file ? '' : `<label class="cs-cast-me"><input type="checkbox" data-char="${k}" data-f="me"${o.me ? ' checked' : ''}><span>นี่คือตัวเรา</span></label>`}<span></span>
    ${o.img ? `<button class="cs-link" data-act="cast-imgdel" data-char="${k}">ใช้รูปเดิม</button>` : ''}${co.color || co.sound ? `<button class="cs-link" data-act="cast-reset" data-char="${k}" data-name="${csEsc(r.name)}">ล้างสีเสียง</button>` : ''}</div>
  </div>`;
 };
 return `<div class="cs-hint2">ตัวละครของ <b>${csEsc(csScopeLabel())}</b> เท่านั้น · การ์ดอื่นที่ชื่อซ้ำตั้งแยกกัน ไม่ปนกัน · ชื่อใหม่ที่เจอในเรื่องเข้ามาเอง · ชื่อเรียกอื่นกับเพศช่วยให้รู้ว่าใครพูด (ค่ะ/ครับ · เธอ/เขา)</div>
  <div class="cs-card cs-cast-add"><input class="cs-text" data-castnew placeholder="เพิ่มตัวละครเอง พิมพ์ชื่อ" maxlength="40"><button class="cs-btn2 pri" data-act="cast-add"><i class="fa-solid fa-plus"></i> เพิ่ม</button></div>
  ${rows.length ? rows.map(row).join('') : `<div class="cs-empty">ยังไม่มีตัวละครในแชทนี้</div>`}
  ${hidden ? `<div class="cs-hint2" style="text-align:center">ลบออกไปแล้ว ${hidden} ชื่อ (จะไม่ดึงกลับเอง) · <button class="cs-link" data-act="cast-unhide">คืนทั้งหมด</button></div>` : ''}`;
}
/** แก้ค่าตัวละครในแชทนี้ · ค่าเก่าแบบรวมของชื่อนี้ย้ายมาเป็นของแชทนี้แทน */
function csCastEdit(key, name, patch) {
 const s = csCfg();
 const n = String(name || key || '').trim();
 if (s.chars[n]) { const old = s.chars[n]; delete s.chars[n]; const cur = csCast(true)[key] || {}; patch = { color: cur.color || old.color, sound: cur.sound || old.sound, ...patch }; }
 return csCastSet(key, patch);
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
   <div class="cs-card">${csToggle('cmtOn', 'คอมเมนต์และรีแอคชันท้ายย่อหน้า', 'กล่องคอมเมนต์ท้ายทุกย่อหน้า · ยังไม่ใช้โทเคนจนกว่าจะเรียกคนอ่าน')}${csToggle('cmtAuto', 'คอมเมนต์มาเอง', 'ตามเงื่อนไขด้านล่าง ผสมกันได้ อันไหนถึงก่อนก็มา · ปิดไว้ = มาเมื่อแตะไอคอน')}</div>
   ${!s.cmtOn ? `<div class="cs-warn"><i class="fa-solid fa-circle-exclamation"></i> ยังปิดคอมเมนต์อยู่ เปิดสวิตช์ "คอมเมนต์และรีแอคชันท้ายย่อหน้า" ด้านบนก่อน คอมเมนต์ถึงจะขึ้น</div>` : ''}
   ${s.cmtLast ? `<div class="cs-card cs-cmtlast ${s.cmtLast.ok ? 'ok' : 'bad'}"><div class="cs-srow"><div class="cs-slb"><span>${s.cmtLast.ok ? '✓ เรียกคอมเมนต์ครั้งล่าสุดสำเร็จ' : '✕ เรียกคอมเมนต์ครั้งล่าสุดไม่สำเร็จ'}</span><small>${csEsc(s.cmtLast.why)} · ${new Date(s.cmtLast.t).toLocaleString('th-TH', { hour: '2-digit', minute: '2-digit', day: 'numeric', month: 'short' })}</small></div></div>${s.cmtLast.raw ? `<details class="cs-tokbd"><summary>ดูคำตอบดิบจากโมเดล</summary><pre class="cs-raw">${csEsc(s.cmtLast.raw)}</pre></details>` : ''}${!s.cmtLast.ok && s.cmtLast.raw && s.cmtLast.mes !== undefined ? `<div class="cs-btnrow" style="margin-top:8px"><button class="cs-btn2" data-act="cmt-reparse"><i class="fa-solid fa-rotate"></i> อ่านคำตอบนี้ใหม่ (ไม่ใช้โทเคน)</button></div>` : ''}</div>` : ''}
   ${s.cmtAuto ? `<div class="cs-card"><div class="cs-cardh">มาเมื่อไหร่<small>ผสมกันได้ ตั้งเป็น 0 = ไม่ใช้ข้อนั้น · แต่ละครั้งที่มา = เรียกคอมเมนต์หนึ่งครั้ง</small></div>
    ${s.cmtPick === 'model' ? `<div class="cs-hint2" style="margin:2px 0 6px"><i class="fa-solid fa-wand-magic-sparkles"></i> โมเดลเลือกบรรทัดตอนเขียน → มาทันทีในบทนั้น</div>` : ''}
    ${csRange('cmtEvery', 'ครบทุก', 0, 10, 1, ' ข้อความ')}<div class="cs-hint2" style="margin:-2px 0 6px">นับข้อความของบอทตั้งแต่ครั้งล่าสุดที่มีคอมเมนต์ ครบแล้วมาแน่ ๆ</div>
    ${csRange('cmtRandom', 'สุ่มโอกาส', 0, 100, 5, '%')}<div class="cs-hint2" style="margin:-2px 0 6px">ทุกข้อความใหม่มีโอกาสเท่านี้ที่คนอ่านจะโผล่มา</div></div>` : ''}
   ${csCmtCharsHTML()}
   <div class="cs-card">${csToggle('cmtReplies', 'คนอ่านตอบกลับกันเอง', 'โมเดลเลือกเองว่าใครจะตอบใคร · กด "ตอบกลับ" หรือ "เรียกคนตอบ" ใต้คอมเมนต์ได้เสมอ')}</div>
   <div class="cs-card"><div class="cs-cardh">ใครเลือกว่าจะคอมเมนต์บรรทัดไหน</div>${csSeg('cmtPick', [['model', 'โมเดลเลือกตอนเขียน'], ['all', 'คนอ่านเลือกเอง']])}
    ${s.cmtPick === 'model' ? `<div class="cs-hint2" style="margin:2px 0 6px">ทุกบท โมเดลเลือก 1–3 บทพูดหรือการกระทำที่คนอ่านน่าจะรีแอค ติดป้ายไว้ ระบบลบป้ายออกให้ก่อนแสดง · ฝากไปกับคำตอบโรลหลัก ใช้ <b data-tok="ask">…</b> ต่อเทิร์น · ตอนเรียกคอมเมนต์ส่งแค่บรรทัดที่เลือก (กับย่อหน้าที่แตะ) ไม่ส่งทั้งบท</div>` : `<div class="cs-hint2" style="margin:2px 0 6px">ส่งทั้งบทให้คนอ่านเลือกเองว่าจะเม้นท์ตรงไหน ไม่เพิ่มโทเคนในโรลหลัก แต่ต่อครั้งแพงกว่า</div>`}</div>
   ${s.cmtAuto && s.cmtPick !== 'model' ? `<div class="cs-card"><div class="cs-cardh">คำในบทก็เรียกได้<small>ใช้คู่กับครบรอบและสุ่มด้านบน</small></div>${csSeg('cmtGate', [['keyword', 'เจอคีย์เวิร์ด'], ['always', 'ทุกบท']])}
    ${s.cmtGate === 'keyword' ? `<div class="cs-hint2" style="margin:2px 0 6px">ไม่ใช้โทเคน ดูคำในบท เจอครบตามที่ตั้งถึงเรียก</div>${csRange('cmtMinHits', 'ต้องเจออย่างน้อย', 1, 6, 1, ' คำ')}
     <div class="cs-srow" style="flex-direction:column;align-items:stretch;gap:6px"><div class="cs-slb"><span>คีย์เวิร์ด</span><small>คั่นด้วยจุลภาค เพิ่มหรือลบเองได้</small></div><textarea class="cs-text cs-kw" data-k="cmtKeywords" rows="3">${csEsc(s.cmtKeywords)}</textarea></div>` : ''}
    ${s.cmtGate === 'always' ? `<div class="cs-hint2" style="margin:2px 0 6px">เรียกทุกบทใหม่ ใช้โทเคนทุกบท</div>` : ''}</div>` : ''}
   ${csCmtCountCard()}
   <div class="cs-card cs-tokcard"><div class="cs-cardh">โทเคนที่ใช้</div>
    <div class="cs-srow"><div class="cs-slb"><span>คอมเมนต์ต่อครั้ง</span><small>เรียกแยก ไม่แนบแชท ไม่เข้าโรลหลัก · คำนวณจากบทล่าสุด</small></div><div class="cs-sctl"><b data-tok="cmt">…</b></div></div>
    <details class="cs-tokbd"><summary>ดูว่ามีอะไรบ้าง ทำไมใช้เท่านี้</summary><div data-tok="bd">กำลังคำนวณ…</div></details>
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
   <div class="cs-card"><div class="cs-cardh">บรรยาย</div>${csSeg('narrStyle', [['plain', 'ร้อยแก้ว'], ['center', 'กลางจอ'], ['box', 'ในกล่อง'], ['italic', 'ตัวเอียง']])}</div>
   <div class="cs-card">${csToggle('showNames', 'แสดงชื่อเหนือฟอง')}${csSelect('nameColor', 'สีชื่อ', [['theme', 'ตามธีม'], ['rainbow', 'สีต่างกันรายคน']])}${csSelect('userSide', 'ฝั่งของเรา', [['right', 'ขวา'], ['left', 'ซ้าย']])}${csToggle('userLinesRight', 'บทของตัวเราที่บอทเขียน อยู่ฝั่งเรา', 'ปิดไว้ = ฝั่งเรามีแต่ข้อความที่เราพิมพ์เอง บทที่บอทเขียนแทนอยู่ซ้ายพร้อมชื่อ')}</div>`;
 }
 if (tab === 'sound') {
  return `<div class="cs-card"><div class="cs-cardh">เสียงฟองเด้ง <small>แตะเพื่อเลือกและฟัง</small></div><div class="cs-sounds">${CS_SOUNDS.map(x => `<button class="cs-sound${s.sound === x.id ? ' on' : ''}" data-sound="${x.id}"><i class="fa-solid ${x.id === 'none' ? 'fa-volume-xmark' : x.id === 'custom' ? 'fa-file-audio' : 'fa-music'}"></i><span>${x.name}</span></button>`).join('')}</div>
   ${s.sound === 'custom' ? `<div class="cs-srow"><div class="cs-slb"><span>ไฟล์เสียงของฉัน</span><small>${s.customSound ? (s.customSound.startsWith('data:') ? 'อัปโหลดไว้แล้ว' : csEsc(s.customSound.slice(0, 60))) : 'ยังไม่มี · ไฟล์สั้น ๆ ไม่เกิน 200 KB'}</small></div><div class="cs-sctl cs-sctl-col"><label class="cs-btn2">เลือกไฟล์<input type="file" accept="audio/*" data-upload="sound" hidden></label><input class="cs-text" data-k="customSound" placeholder="หรือวางลิงก์ mp3/ogg" value="${s.customSound && !s.customSound.startsWith('data:') ? csEsc(s.customSound) : ''}"></div></div>` : ''}</div>
   <div class="cs-card">${csRange('volume', 'ความดัง', 0, 1, .05, '')}${csToggle('pitchVary', 'เสียงสูงต่ำต่างกันรายตัวละคร', 'ฟังแล้วรู้ว่าใครพูด')}${csToggle('narrSound', 'มีเสียงตอนบรรยายและเปลี่ยนฉาก')}${csToggle('vibrate', 'สั่นเบา ๆ บนมือถือ', 'ใช้ได้บนมือถือ Android')}
    <div class="cs-srow"><div class="cs-slb"><span>ลองฟังทั้งชุด</span></div><div class="cs-sctl"><button class="cs-btn2" data-act="test-sound"><i class="fa-solid fa-play"></i> ฟัง</button></div></div></div>`;
 }
 if (tab === 'chars') return csCharsTabHTML();
 // read
 return `<div class="cs-card"><div class="cs-cardh">แบบการอ่าน</div>${csSeg('style', [['chat', 'แชทนิยาย'], ['novel', 'นิยาย']])}<div class="cs-cardh">แสดงที่</div>${csSeg('mode', [['reader', 'หน้าอ่านเปิดทับแชท'], ['inline', 'ในแชทหลัก']])}</div>
  <div class="cs-card">${csSelect('plainUser', 'ข้อความของเราที่ไม่มีเครื่องหมาย', [['auto', 'เดาให้'], ['say', 'เป็นคำพูด'], ['narr', 'เป็นบรรยาย']], 'ในเครื่องหมายคำพูด = คำพูด · *ดอกจัน* = บรรยาย · ไม่มีเลยตามที่ตั้งนี้')}</div>
  <div class="cs-card cs-tokcard"><div class="cs-srow"><div class="cs-slb"><span>คำสั่งรูปแบบกินโทเคนต่อเทิร์น</span><small>${s.enabled && s.forceFormat ? 'แทรกเข้าโรลหลักทุกครั้งที่บอทตอบ' : 'ปิดอยู่ ไม่ใช้โทเคน'}</small></div><div class="cs-sctl"><b data-tok="format">…</b></div></div></div>
  <div class="cs-card">${csToggle('enabled', 'เปิดใช้แชทนิยาย')}${csToggle('autoOpen', 'บอทตอบเสร็จแล้วเปิดหน้าอ่านเอง', 'โหมดหน้าอ่าน')}${csToggle('forceFormat', 'สั่งบอทเขียนตามแบบที่เลือก', 'แชทนิยาย: ชื่อ: คำพูด · นิยาย: ย่อหน้าต่อเนื่อง')}</div>
  <div class="cs-card">${csToggle('edgeBtn', 'ปุ่มลัดชิดขอบจอ', 'แตะเปิดหน้าอ่าน · ลากขึ้นลงได้ · ลากไปอีกฝั่งเพื่อย้ายข้าง')}</div>
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
 el.addEventListener('keydown', csSettingsKey);
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
// ── คนอ่านประจำ ──
let csCcEdit = null; // id ที่กำลังแก้ หรือ 'new'
function csCmtCharsHTML() {
 const list = csCmtChars();
 const av = c => c.img ? `<img class="cs-cc-av" src="${csEsc(c.img)}" alt="">` : `<span class="cs-cc-av${c.builtin ? ' janya' : ''}" style="${c.builtin ? '' : `background:hsl(${csHash(c.name) % 360} 45% 60%)`}">${csEsc((c.name || '?')[0])}</span>`;
 const form = c => `<div class="cs-cc-form">
   <label class="cs-cc-pic">${av(c)}<span>เปลี่ยนรูป</span><input type="file" accept="image/*" data-upload="ccimg" data-id="${c.id}" hidden></label>
   <input class="cs-text cs-cc-name" value="${csEsc(c.name)}" placeholder="ชื่อคนอ่าน" maxlength="30"${c.builtin ? ' disabled' : ''}>
   ${c.builtin ? `<small class="cs-cc-note">นิสัยของ janyaahri ใช้คาร์เดิมครบ แก้ไม่ได้ เปลี่ยนรูปได้</small>` : `<textarea class="cs-text cs-cc-desc" rows="3" maxlength="300" placeholder="นิสัยคร่าว ๆ เช่น ขี้แซะ ชิปพระนาง ชอบเดาเนื้อเรื่อง">${csEsc(c.desc || '')}</textarea><small class="cs-cc-note">นิสัยยิ่งยาวยิ่งใช้โทเคน · ยาวสุด 300 ตัวอักษร</small>`}
   <div class="cs-cc-btns">${c.builtin || c.id === 'new' ? '' : `<button class="cs-btn2 danger" data-act="cc-del" data-id="${c.id}">ลบ</button>`}<span></span><button class="cs-btn2" data-act="cc-cancel">ยกเลิก</button><button class="cs-btn2 pri" data-act="cc-save" data-id="${c.id}">บันทึก</button></div>
  </div>`;
 return `<div class="cs-card"><div class="cs-cardh">คนอ่านประจำ<small>อยู่ในการเรียกเดียวกัน · แตะป้ายใต้ชื่อเพื่อเลือกว่ามาทุกครั้ง หรือให้โมเดลคิดเองว่าจะเม้นท์ไหม</small></div>
  ${list.map(c => csCcEdit === c.id ? form(c) : `<div class="cs-cc-row">${av(c)}<span class="cs-cc-meta"><b>${csEsc(c.name)}${c.builtin ? ' <i>ขาประจำ</i>' : ''}</b><small>${csEsc(c.builtin ? 'สดใส น่ารัก ขี้อ้อน เจ้าชู้นิด ๆ บางทีเบื่อ งอนง่าย รู้ผิดรู้ถูก' : (c.desc || 'ยังไม่ได้ใส่นิสัย'))}</small><button class="cs-cc-when${c.when === 'always' ? ' always' : ''}" data-act="cc-when" data-id="${c.id}"><i class="fa-solid ${c.when === 'always' ? 'fa-thumbtack' : 'fa-dice'}"></i> ${csCcWhenLabel(c)}</button></span>
    <button class="cs-cc-edit" data-act="cc-edit" data-id="${c.id}" title="แก้ไข"><i class="fa-solid fa-pen"></i></button>
    <label class="cs-switch"><input type="checkbox" data-cc-on="${c.id}"${c.on ? ' checked' : ''}><span></span></label></div>`).join('')}
  ${csCcEdit === 'new' ? form({ id: 'new', name: '', desc: '', img: csCcNewImg || '' }) : `<button class="cs-cc-add" data-act="cc-add"><i class="fa-solid fa-plus"></i> เพิ่มคนอ่าน</button>`}
 </div>`;
}
let csCcNewImg = '';
/** ย่อรูปเป็น 96×96 เก็บในตั้งค่าได้ไม่อ้วน */
function csShrinkImage(file) {
 return new Promise(resolve => {
  const r = new FileReader();
  r.onload = () => {
   const img = new Image();
   img.onload = () => {
    try {
     const c = document.createElement('canvas'); c.width = c.height = 96;
     const g = c.getContext('2d');
     const k = Math.max(96 / img.width, 96 / img.height), w = img.width * k, h = img.height * k;
     g.drawImage(img, (96 - w) / 2, (96 - h) / 2, w, h);
     resolve(c.toDataURL('image/jpeg', 0.82));
    } catch { resolve(String(r.result || '')); }
   };
   img.onerror = () => resolve('');
   img.src = String(r.result || '');
  };
  r.onerror = () => resolve('');
  r.readAsDataURL(file);
 });
}
function csCcClick(act, el) {
 const list = csCmtChars();
 const id = el.dataset.id;
 if (act === 'cc-add') { csCcEdit = 'new'; csCcNewImg = ''; return true; }
 if (act === 'cc-edit') { csCcEdit = id; return true; }
 if (act === 'cc-when') { const c = list.find(x => x.id === id); if (c) { c.when = c.when === 'always' ? 'maybe' : 'always'; csSave(); } return true; }
 if (act === 'cc-cancel') { csCcEdit = null; csCcNewImg = ''; return true; }
 if (act === 'cc-del') { const c = list.find(x => x.id === id); if (c && !c.builtin && confirm(`ลบ ${c.name} ออกจากคนอ่านประจำ?`)) { list.splice(list.indexOf(c), 1); csCcEdit = null; csSave(); } return true; }
 if (act === 'cc-save') {
  const f = el.closest('.cs-cc-form');
  const name = (f.querySelector('.cs-cc-name')?.value || '').trim().slice(0, 30);
  const desc = (f.querySelector('.cs-cc-desc')?.value || '').trim().slice(0, 300);
  if (id === 'new') {
   if (!name) { csToast('ใส่ชื่อคนอ่านก่อนนะ'); return false; }
   list.push({ id: 'cc' + Date.now().toString(36), name, desc, img: csCcNewImg || '', on: true });
  } else {
   const c = list.find(x => x.id === id);
   if (c) { if (!c.builtin && name) c.name = name; if (!c.builtin) c.desc = desc; }
  }
  csCcEdit = null; csCcNewImg = '';
  csSave();
  return true;
 }
 return false;
}
/** เติมตัวเลขโทเคนในหน้าตั้งค่า (นับจริงด้วยตัวนับของ SillyTavern) */
function csFillTokens(root) {
 const s = csCfg();
 root.querySelectorAll('[data-tok="format"]').forEach(async el => {
  const t = csPromptText();
  if (!t) { el.textContent = '0 โทเคน'; return; }
  el.textContent = `~${(await csCountTokens(t)).toLocaleString()} โทเคน`;
 });
 root.querySelectorAll('[data-tok="ask"]').forEach(async el => { el.textContent = `~${(await csCountTokens(CS_CMT_ASK)).toLocaleString()} โทเคน`; });
 root.querySelectorAll('[data-tok="bd"]').forEach(async el => {
  const id = csLastCharMesId();
  if (id < 0) { el.textContent = 'ยังไม่มีบท'; return; }
  const b = await csCmtBreakdown(id);
  el.innerHTML = b.rows.map(([k, sub, n]) => `<div class="cs-bdrow"><span><b>${csEsc(k)}</b><small>${csEsc(sub)}</small></span><em>${n.toLocaleString()}</em></div>`).join('')
   + `<div class="cs-bdrow total"><span><b>รวม</b></span><em>~${b.total.toLocaleString()}</em></div>`
   + `<p class="cs-bdnote">ภาษาไทยใช้โทเคนมากกว่าภาษาอังกฤษราว 2–3 เท่าต่อข้อความยาวเท่ากัน ส่วนที่หนักที่สุดคือเนื้อบท · ถ้าให้โมเดลเลือกบรรทัด จะส่งแค่ 1–3 บรรทัดแทนทั้งบท ถูกลงมาก · คนอ่านประจำแต่ละคนเพิ่มตามความยาวนิสัยที่ใส่ ปิดคนที่ไม่ใช้ได้</p>`;
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
 csRefreshTimer = setTimeout(() => { csApplyPrompt(); csInlineAll(); csSyncDrawer(); csEdgeRender(); }, 120);
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
 const a = el.closest('[data-act]');
 if (!a) return;
 const act = a.dataset.act;
 if (act === 'close') return csCloseSettings();
 if (act.startsWith('cc-')) { if (csCcClick(act, a)) csRenderSettingsBody(); return; }
 if (act.startsWith('cast-')) return csCastAct(act, a);
 if (act === 'cmt-reparse') { csCmtReparse(); return csRenderSettingsBody(); }
 if (act === 'cmt-reset') { s.cmtUsed = { tokens: 0, calls: 0 }; csSave(); return csRenderSettingsBody(); }
 if (act === 'test-sound') { [['in', csCharName() || 'A'], ['in', 'B'], ['out', csUserName()], ['narr'], ['scene']].forEach(([k, w], i) => setTimeout(() => csPlaySound(s.sound, k, w), i * 360)); return; }
 if (act === 'read-last') { csCloseSettings(); csOpenLatest(); return; }
 if (act === 'read-all') { csCloseSettings(); csOpenReadAll(); return; }
 if (act === 'reset') {
  if (!confirm('คืนค่าหน้าตา เสียง และการอ่านทั้งหมดเป็นค่าเริ่มต้น?')) return;
  const keep = { enabled: s.enabled, cast: s.cast }; // ตัวละครรายการ์ดไม่ใช่หน้าตา เก็บไว้
  Object.keys(s).forEach(k => delete s[k]);
  Object.assign(s, keep, { _migrated: true });
  csCfg();
  csAfterChange(true);
  return csRenderSettingsBody();
 }
}
function csCastAct(act, a) {
 const key = a.dataset.char;
 if (act === 'cast-add') {
  const inp = document.querySelector('#cs-settings [data-castnew]');
  const n = String(inp && inp.value || '').trim().slice(0, 40);
  if (!n) { csToast('พิมพ์ชื่อก่อนนะ'); inp && inp.focus(); return; }
  const c = csCast(true);
  const hit = Object.keys(c).find(x => x.toLowerCase() === n.toLowerCase());
  if (hit && !c[hit].ignored) { csToast(`มี ${hit} อยู่แล้ว`); return; }
  if (hit) delete c[hit];
  csCastSet(n, { added: Date.now() });
 } else if (act === 'cast-del') {
  if (!confirm(`ลบ ${key} ออกจากรายชื่อตัวละครของแชทนี้? (รูป สี เสียง และชื่อเรียกอื่นหายด้วย)`)) return;
  const c = csCast(true);
  c[key] = { ignored: true };
  csSave();
 } else if (act === 'cast-unhide') {
  const c = csCast(true);
  Object.keys(c).forEach(k => { if (c[k].ignored) delete c[k]; });
  csSave();
 } else if (act === 'cast-imgdel') csCastSet(key, { img: '' });
 else if (act === 'cast-reset') { delete csCfg().chars[a.dataset.name || key]; csCastSet(key, { color: '', sound: '' }); }
 csAfterChange(true);
 csRenderSettingsBody();
}
function csSettingsInput(e) {
 const el = e.target;
 if (el.dataset.k && el.type === 'range') {
  const v = +el.value;
  csSet(el.dataset.k, v);
  if (/^cmt(Per|Paras)(Min)?$/.test(el.dataset.k)) {
   // ต่ำสุดห้ามเกินสูงสุด: เลื่อนอีกอันตามให้
   const pair = { cmtPerMin: ['cmtPer', 1], cmtPer: ['cmtPerMin', -1], cmtParasMin: ['cmtParas', 1], cmtParas: ['cmtParasMin', -1] }[el.dataset.k];
   const c = csCfg(), other = pair[0];
   if (csCmtMode() === 'random' && (pair[1] > 0 ? v > c[other] : v < c[other])) {
    c[other] = v;
    const o = document.querySelector(`#cs-settings [data-k="${other}"]`); if (o) o.value = v;
    const ol = document.querySelector(`#cs-settings [data-v="${other}"]`); if (ol) ol.textContent = v + (o ? o.dataset.unit || '' : '');
   }
   const t = document.querySelector('#cs-settings [data-cmt-total]'); if (t) t.textContent = csCmtTotalText();
  }
  if ((el.dataset.k === 'cmtEvery' || el.dataset.k === 'cmtRandom') && v > 0 && !csCfg().cmtOn) { csCfg().cmtOn = true; csApplyPrompt(); setTimeout(csRenderSettingsBody, 0); } // ตั้งให้คอมเมนต์มา = เปิดคอมเมนต์ให้เลย
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
  csCastEdit(el.dataset.char, el.dataset.name, { color: el.value });
  const lab = el.parentElement; lab.querySelector('.cs-sw').style.background = el.value; lab.querySelector('small').textContent = el.value;
  csAfterChange(true);
 }
}
function csSettingsKey(e) {
 if (e.key === 'Enter' && e.target && e.target.dataset && e.target.dataset.castnew !== undefined) { e.preventDefault(); const b = document.querySelector('#cs-settings [data-act="cast-add"]'); if (b) csCastAct('cast-add', b); }
}
function csSettingsChange(e) {
 const el = e.target;
 const s = csCfg();
 if (el.dataset.k && el.type === 'checkbox') { csSet(el.dataset.k, el.checked); if (el.dataset.k === 'cmtAuto' && el.checked) csCfg().cmtOn = true; csAfterChange(true); if (el.dataset.k === 'cmtAuto' || el.dataset.k === 'cmtOn') csRenderSettingsBody(); return; }
 if (el.dataset.k && el.tagName === 'SELECT') { csSet(el.dataset.k, el.value); csAfterChange(true); return; }
 if (el.dataset.k && el.classList.contains('cs-text')) {
  csSet(el.dataset.k, el.value.trim());
  csAfterChange();
  if (el.dataset.k === 'fontCustom') csRenderSettingsBody();
  return;
 }
 if (el.dataset.char && el.dataset.f === 'sound') {
  csCastEdit(el.dataset.char, el.dataset.name, { sound: el.value });
  csAfterChange();
  if (el.value) csPlaySound(el.value, 'in', el.dataset.name || el.dataset.char);
  return;
 }
 if (el.dataset.char && el.dataset.f === 'aliases') {
  const v = el.value.split(/[,，、\n]/).map(x => x.trim()).filter(x => x.length >= 2 && x.toLowerCase() !== el.dataset.char.toLowerCase()).slice(0, 12).join(', ');
  csCastEdit(el.dataset.char, '', { aliases: v });
  el.value = v;
  csAfterChange(true);
  return;
 }
 if (el.dataset.char && el.dataset.f === 'g') {
  csCastEdit(el.dataset.char, '', { g: el.value });
  csGCache.key = '';
  csAfterChange(true);
  return;
 }
 if (el.dataset.char && el.dataset.f === 'me') {
  csCastEdit(el.dataset.char, '', { me: el.checked || '' });
  csAfterChange(true);
  return csRenderSettingsBody();
 }
 if (el.dataset.upload === 'castimg' && el.files && el.files[0]) {
  const key = el.dataset.char;
  csShrinkImage(el.files[0]).then(url => {
   if (!url) { csToast('อ่านรูปไม่ได้'); return; }
   csCastEdit(key, '', { img: url });
   csAfterChange(true);
   csRenderSettingsBody();
  });
  return;
 }
 if (el.dataset.ccOn) { const c = csCmtChars().find(x => x.id === el.dataset.ccOn); if (c) { c.on = el.checked; csSave(); csFillTokens(document.getElementById('cs-settings')); } return; }
 if (el.dataset.upload === 'ccimg' && el.files && el.files[0]) {
  const id = el.dataset.id;
  csShrinkImage(el.files[0]).then(url => {
   if (!url) { csToast('อ่านรูปไม่ได้'); return; }
   if (id === 'new') csCcNewImg = url;
   else { const c = csCmtChars().find(x => x.id === id); if (c) c.img = url; csSave(); }
   // เก็บค่าที่พิมพ์ค้างไว้ก่อนวาดใหม่
   const f = el.closest('.cs-cc-form');
   const keep = f ? { n: f.querySelector('.cs-cc-name')?.value, d: f.querySelector('.cs-cc-desc')?.value } : null;
   csRenderSettingsBody();
   const f2 = document.querySelector('#cs-settings .cs-cc-form');
   if (f2 && keep) { if (keep.n !== undefined && f2.querySelector('.cs-cc-name')) f2.querySelector('.cs-cc-name').value = keep.n; if (keep.d !== undefined && f2.querySelector('.cs-cc-desc')) f2.querySelector('.cs-cc-desc').value = keep.d; }
  });
  return;
 }
 if (el.dataset.upload === 'sound' && el.files && el.files[0]) {
  const file = el.files[0];
  if (file.size > 200 * 1024) { csToast('ไฟล์ใหญ่เกิน 200 KB'); return; }
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
 on('cs-read-all', 'click', () => csOpenReadAll());
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
 const pb = csBlocks(m.mes);
 csCleanText(pb.text).split(/\n+/).map(x => x.trim()).filter(Boolean).forEach(line => {
  const blk = csBlockItem(line, pb.blocks);
  if (blk) { out.push(blk); return; }
  if (/^[-=*_~]{3,}$/.test(line)) { out.push({ k: 'break' }); return; }
  let r = line.match(/^#{1,4}\s*(.{1,120})$/) || line.match(/^(?:บทที่|ตอนที่|Chapter)\s*\d+\s*[:：.\-–]?\s*(.{1,120})$/i);
  if (r) { out.push({ k: 'title', text: r[1].replace(/[#*]+/g, '').trim() }); return; }
  r = line.match(/^\[([^\]]{1,80})\]$/);
  if (r) { out.push({ k: 'scene', text: r[1].trim() }); return; }
  r = line.match(/^\**\s*([^:：\n]{1,40}?)\s*\**\s*(?:[(（]([^)）]{1,16})[)）])?\s*\**\s*[:：]\s*(.+)$/);
  if (r && csLooksLikeName(r[1].replace(/\*/g, ''))) {
   const who = r[1].replace(/\*/g, '').trim();
   const body = csStripQuotes(r[3].replace(/\*([^*]+)\*/g, '$1'));
   out.push({ k: r[2] && CS_THOUGHT.test(r[2]) ? 'think' : 'say', who, text: body, raw: line });
   return;
  }
  out.push({ k: 'p', text: line, raw: line });
 });
 return out;
}
function csNovelFmt(t) {
 return csEsc(t).replace(/`([^`\n]+)`/g, '<code class="cs-ic">$1</code>').replace(/\*\*([^*]+)\*\*/g, '<b>$1</b>').replace(/\*([^*]+)\*/g, '<i>$1</i>').replace(/_([^_]+)_/g, '<i>$1</i>');
}
function csNovelLineHTML(l, user, cmt) {
 const tail = cmt ? csCmtButtonHTML(cmt.mes, cmt.i) : '';
 if (l.k === 'code') return csCodeBlockHTML(l);
 if (l.k === 'html') return csHtmlBlockHTML(l.text);
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
  <header class="cs-chead" aria-label="${w}ที่ ${n}">
   <span class="cs-cno"><b>${String(n).padStart(2, '0')}</b><small>${w}</small></span>
   ${title ? `<h2 class="cs-ctitle">${csNovelFmt(title.text)}</h2>` : ''}
   <span class="cs-cbook">${csEsc(csCharName() || '')}</span>
  </header>
  ${userPart}
  ${lines.map((l, i) => l === title ? '' : csNovelLineHTML(l, false, s.cmtOn && ch.bot && csCmtShowIcon(ch.botId, i, l) ? { mes: ch.botId, i } : null)).join('')}
  ${ch.bot ? `<footer class="cs-cfoot" aria-label="จบ${w}ที่ ${n}"><span>❖</span></footer>` : ''}
  ${ch.bot && ch.botId === csLastCharMesId() && ch.botId === (csCtx().chat || []).length - 1 ? `<div class="cs-nacts"><a data-cs="regen">เจนใหม่</a><span>·</span><a data-cs="dellast">ลบ${w}นี้</a></div>` : ''}
 </section>`;
}
function csNovelBodyHTML(all) {
 const chs = csNovelChapters();
 const start = all ? 0 : Math.max(0, chs.length - CS_NOVEL_MAX);
 return (start > 0 ? `<button class="cs-nmore" data-cs="nmore">โหลด${csChWord()}ก่อนหน้า (${start} ${csChWord()})</button>` : '')
  + chs.slice(start).map((ch, k) => csNovelChapterHTML(ch, start + k + 1)).join('')
  + `<div class="cs-nwriting"><span></span><span></span><span></span><em>กำลังเขียน${csChWord()}ต่อไป</em></div>`;
}
function csOpenNovel(mesId, all, resume) {
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
   <button class="cs-btn" data-cs="toChat" title="สลับเป็นแชทนิยาย"><i class="fa-solid fa-comments"></i></button>
   <button class="cs-btn" data-cs="naa" title="ปรับหน้าอ่าน"><span class="cs-aa">Aa</span></button>
   <div class="cs-aapanel"></div>
  </div>
  <div class="cs-nprog"><i></i></div>
  <div class="cs-nbody" data-cs="ntap"><article class="cs-page">${csNovelBodyHTML(all)}</article></div>
  <div class="cs-nbottom">
   <div class="cs-nnav"><button data-cs="nprev" aria-label="${csChWord()}ก่อนหน้า"><i class="fa-solid fa-arrow-up"></i></button><span class="cs-npct"></span><button data-cs="nnext" aria-label="${csChWord()}ถัดไป"><i class="fa-solid fa-arrow-down"></i></button></div>
   ${s.showInput ? `<div class="cs-inputbar"><textarea class="cs-input" rows="1" placeholder="เขียนเรื่องต่อ… บรรยายหรือพูดก็ได้"></textarea><button class="cs-send" data-cs="send" title="ส่ง"><i class="fa-solid fa-paper-plane"></i></button></div>` : ''}
  </div>`;
 document.body.appendChild(el);
 csNovel = { el };
 el.addEventListener('click', csNovelClick);
 const body = el.querySelector('.cs-nbody');
 body.addEventListener('scroll', csNovelProgress, { passive: true });
 body.addEventListener('scroll', csNovelPosSave, { passive: true });
 csBindInput(el);
 el.classList.toggle('writing', csGenerating);
 // ★ 1.10 ไม่ได้ระบุข้อความ = อ่านต่อจากที่ค้างไว้
 const want = mesId === undefined && (resume || !all) ? (csPos() || {}).novel : null;
 requestAnimationFrame(() => { el.classList.add('show'); if (!(want && csNovelResume(want))) csNovelGoto(mesId !== undefined ? mesId : all ? 0 : undefined); });
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
let csNovelPosT = 0;
function csNovelPosSave() {
 clearTimeout(csNovelPosT);
 csNovelPosT = setTimeout(() => {
  if (!csNovel) return;
  const body = csNovel.el.querySelector('.cs-nbody');
  const chs = [...body.querySelectorAll('.cs-chapter')];
  const cur = chs.filter(c => c.offsetTop - body.scrollTop <= 4).pop() || chs[0];
  if (cur) csPosSave('novel', { mes: cur.dataset.mes === '' ? -1 : +cur.dataset.mes, ch: +cur.dataset.ch, off: Math.max(0, Math.round(body.scrollTop - cur.offsetTop)) });
 }, 350);
}
/** เลื่อนกลับไปตำแหน่งที่อ่านค้าง · คืน true ถ้าเจอ */
function csNovelResume(pos) {
 if (!csNovel || !pos) return false;
 const body = csNovel.el.querySelector('.cs-nbody');
 const find = () => [...body.querySelectorAll('.cs-chapter')].find(c => (pos.mes >= 0 ? c.dataset.mes !== '' && +c.dataset.mes === pos.mes : +c.dataset.ch === pos.ch));
 let c = find();
 if (!c && body.querySelector('.cs-nmore')) { body.querySelector('.cs-page').innerHTML = csNovelBodyHTML(true); c = find(); }
 if (!c) return false;
 const chs = [...body.querySelectorAll('.cs-chapter')];
 if (c === chs[chs.length - 1] && pos.off < 40) return false; // ค้างที่ต้นบทล่าสุด = เปิดปกติ
 body.scrollTop = c.offsetTop + (pos.off || 0);
 csNovelProgress();
 if (c !== chs[chs.length - 1]) csToast(`อ่านต่อจาก${csChWord()}ที่ ${c.dataset.ch}`);
 return true;
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
 const p = csNovel.el.querySelector('.cs-npct');
 const chs = [...body.querySelectorAll('.cs-chapter')];
 const cur = chs.filter(c => c.offsetTop - body.scrollTop <= 80).pop() || chs[0];
 const sub = csNovel.el.querySelector('.cs-sub');
 if (sub) sub.textContent = csGenerating ? `กำลังเขียน${csChWord()}ต่อไป…` : csCmtBusy.size ? 'คนอ่านกำลังเม้นท์…' : (cur ? `${csChWord()}ที่ ${cur.dataset.ch}` : '');
 if (p) { const last = chs.length ? chs[chs.length - 1].dataset.ch : 0; p.textContent = cur ? `${cur.dataset.ch} / ${last}` : ''; }
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
 if (a === 'regen') return csRegen();
 if (a === 'dellast') return csDeleteLast();
 if (a === 'toChat') return csSwitchStyle('chat');
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
 if (csCmtOpen && csCmtOpen.host === csNovel.el) csCmtClose();
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
/** ★ 1.8 สลับนิยาย ↔ แชทนิยายได้ทันทีจากหน้าอ่าน · บทเก่าแยกคนพูดให้ ส่วนบทต่อไปบอทเขียนตามแบบใหม่ */
function csSwitchStyle(style) {
 const s = csCfg();
 if (style !== 'novel' && style !== 'chat') return;
 s.style = style;
 csSave();
 csApplyPrompt();
 csCloseReader(true);
 csCloseNovel(true);
 if (s.mode === 'inline') csInlineAll();
 csOpenLatest();
 try { csSyncDrawer(); } catch {}
 csToast(style === 'novel' ? 'แบบนิยาย' : 'แบบแชทนิยาย', 'ok');
}
// ══ ★ 1.10 จำว่าอ่านถึงไหน (แยกแต่ละแชท) ══
function csChatKey() {
 try { const ctx = csCtx(); const id = (typeof ctx.getCurrentChatId === 'function' && ctx.getCurrentChatId()) || ctx.chatId; if (id) return String(id); } catch {}
 return csScope();
}
function csPos() {
 const s = csCfg();
 if (!s.readPos || typeof s.readPos !== 'object') s.readPos = {};
 const k = csChatKey();
 return s.readPos[k] || null;
}
function csPosSave(part, val) {
 const s = csCfg();
 if (!s.readPos || typeof s.readPos !== 'object') s.readPos = {};
 const k = csChatKey();
 s.readPos[k] = { ...(s.readPos[k] || {}), [part]: val, t: Date.now() };
 const keys = Object.keys(s.readPos);
 if (keys.length > 60) keys.sort((a, b) => (s.readPos[a].t || 0) - (s.readPos[b].t || 0)).slice(0, keys.length - 60).forEach(x => delete s.readPos[x]);
 csSave();
}
/** อ่านทั้งแชทแบบฟอง ต่อจากฟองล่าสุดที่อ่านค้างไว้ */
function csOpenReadAll() {
 if (csCfg().style === 'novel') return csOpenNovel(undefined, true, true);
 const items = csItemsForChat(0);
 const r = csOpenReader(items, 'ทั้งแชท');
 if (!r) return r;
 r.key = 'all';
 const pos = csPos() && csPos().chat;
 if (pos) {
  let idx = items.findIndex(it => it._m === pos.m && it._k === pos.k);
  if (idx < 0) idx = items.findIndex(it => it._m > pos.m) - 1;
  if (idx > 0 && idx < items.length) { r.player.skipTo(idx + 1); csToast('อ่านต่อจากที่ค้างไว้', 'ok'); }
 }
 return r;
}
// ══ ★ 1.16 ปุ่มลัดชิดขอบจอ: แตะเปิดหน้าอ่าน · ลากขึ้นลงได้ · ลากข้ามจอเพื่อย้ายข้าง · ไม่หลุดจอ ══
const CS_EDGE_H = 46, CS_EDGE_W = 26;
function csViewH() { return (window.visualViewport && window.visualViewport.height) || window.innerHeight || 800; }
function csViewW() { return (window.visualViewport && window.visualViewport.width) || window.innerWidth || 400; }
/** ขอบบน-ล่างที่ปุ่มไปได้: ใต้แถบบนของ SillyTavern · เหนือช่องพิมพ์ · ไม่หลุดจอ */
function csEdgeBounds() {
 let lo = 8, hi = csViewH() - CS_EDGE_H - 8;
 try {
  const top = document.getElementById('top-settings-holder') || document.getElementById('top-bar');
  if (top) { const r = top.getBoundingClientRect(); if (r.height && r.bottom < csViewH() / 2) lo = Math.max(lo, r.bottom + 6); }
  const form = document.getElementById('send_form') || document.getElementById('form_sheld');
  if (form) { const r = form.getBoundingClientRect(); if (r.height && r.top > csViewH() / 2) hi = Math.min(hi, r.top - CS_EDGE_H - 6); }
 } catch {}
 return hi > lo ? [lo, hi] : [8, csViewH() - CS_EDGE_H - 8];
}
function csEdgeClampTop(top) { const [lo, hi] = csEdgeBounds(); return Math.max(lo, Math.min(hi, top)); }
function csEdgePlace(el) {
 const s = csCfg();
 el.classList.toggle('left', s.edgeSide === 'left');
 el.style.left = s.edgeSide === 'left' ? '0px' : '';
 el.style.right = s.edgeSide === 'left' ? '' : '0px';
 el.style.top = csEdgeClampTop((+s.edgeY || .62) * csViewH()) + 'px';
 el.style.transform = '';
}
function csEdgeRender() {
 const s = csCfg();
 let el = document.getElementById('cs-edge');
 if (!s.enabled || !s.edgeBtn) { if (el) el.remove(); return null; }
 if (!el) {
  el = document.createElement('div');
  el.id = 'cs-edge';
  el.setAttribute('role', 'button');
  el.setAttribute('aria-label', 'เปิดหน้าอ่าน');
  el.innerHTML = '<i class="fa-solid fa-book-open"></i>';
  document.body.appendChild(el);
  csEdgeBind(el);
 }
 csEdgePlace(el);
 return el;
}
function csEdgeBind(el) {
 let st = null;
 el.addEventListener('pointerdown', e => {
  st = { x: e.clientX, y: e.clientY, top: el.offsetTop, moved: false, id: e.pointerId };
  try { el.setPointerCapture(e.pointerId); } catch {}
  el.classList.add('press');
 });
 el.addEventListener('pointermove', e => {
  if (!st) return;
  const dx = e.clientX - st.x, dy = e.clientY - st.y;
  if (!st.moved && Math.abs(dx) + Math.abs(dy) > 7) st.moved = true;
  if (!st.moved) return;
  el.style.top = csEdgeClampTop(st.top + dy) + 'px';
  const left = csCfg().edgeSide === 'left';
  el.style.transform = `translateX(${Math.max(left ? 0 : -csViewW() + CS_EDGE_W, Math.min(left ? csViewW() - CS_EDGE_W : 0, dx))}px)`;
 });
 const end = e => {
  if (!st) return;
  const s = csCfg(), moved = st.moved;
  el.classList.remove('press');
  st = null;
  if (moved) {
   s.edgeSide = e.clientX < csViewW() / 2 ? 'left' : 'right';
   s.edgeY = Math.round(parseFloat(el.style.top) / csViewH() * 1000) / 1000;
   csSave();
   csEdgePlace(el);
  } else if (e.type === 'pointerup') csOpenLatest();
 };
 el.addEventListener('pointerup', end);
 el.addEventListener('pointercancel', end);
 el.addEventListener('keydown', e => { if (e.key === 'Enter' || e.key === ' ') { e.preventDefault(); csOpenLatest(); } });
 el.tabIndex = 0;
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
 box.innerHTML = `<div class="cs-ninline${m.is_user ? ' user' : ''}">${csNovelLines(m).map(l => csNovelLineHTML(l, m.is_user)).join('')}${!m.is_user && csCfg().cmtOn ? csCmtBarHTML(mesId) : ''}</div>`;
 const w = box.firstElementChild;
 csApplyVars(w); csApplyNovelVars(w);
 csMesCmt(mesId);
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
// ★ 1.17 เครื่องหมายโน้ตข้างหน้า: จุดเล็กชายขอบ (ยังไม่มีคอมเมนต์) · วงตัวเลข (มีแล้ว)
const CS_CMT_ICON = '<svg viewBox="0 0 24 24" aria-hidden="true"><circle cx="12" cy="12" r="3.2" fill="currentColor"/></svg>';
const CS_JANYA = 'janyaahri';
const CS_JANYA_DESC = 'usually cheerful, bright, cute, affectionate, friendly, easygoing; sometimes bored, easily annoyed, moody or distant. Hates being alone and losing people. Many exes, seems flirty. Bisexual. Likes plushies, Kuromi, pink, purple, cute soft things, sky, clouds, cozy places. Fears trypophobia and heights. Knows right from wrong: praises what is right, calls out what is wrong.';
function csCmtChars() {
 const s = csCfg();
 if (!Array.isArray(s.cmtChars)) s.cmtChars = [{ id: 'janya', name: CS_JANYA, desc: CS_JANYA_DESC, img: '', on: true, builtin: true }];
 return s.cmtChars;
}
function csCmtCharByName(n) { const k = String(n || '').trim().toLowerCase(); return csCmtChars().find(c => c.name.trim().toLowerCase() === k); }
/** บรรทัดคนอ่านประจำในคำสั่ง — ทุกคนที่เปิดไว้อยู่ในการเรียกเดียวกัน */
function csCmtReadersLine() {
 const on = csCmtChars().filter(c => c.on && c.name.trim());
 if (!on.length) return '';
 const line = c => `- ${c.name.trim()}: ${c.builtin ? CS_JANYA_DESC : String(c.desc || 'a regular reader').trim().slice(0, 300)}`;
 // ★ 1.15 แต่ละคน: มาทุกครั้ง หรือให้โมเดลคิดเองว่าคนนี้จะเม้นท์ไหม
 const must = on.filter(c => c.when === 'always'), maybe = on.filter(c => c.when !== 'always');
 return [must.length ? 'These readers MUST each comment 1-2 times in their own voice:\n' + must.map(line).join('\n') : '',
  maybe.length ? 'These readers comment only if they would want to here, your call (0-2 times each, own voice):\n' + maybe.map(line).join('\n') : ''].filter(Boolean).join('\n');
}
function csCcWhenLabel(c) { return c.when === 'always' ? 'มาเม้นท์ทุกครั้ง' : 'โมเดลคิดเองว่าจะเม้นท์ไหม'; }
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
 if (!list.length) return `<button class="cs-cmt" data-cs="cmt" data-mes="${mesId}" data-p="${p}" aria-label="ความคิดเห็น">${CS_CMT_ICON}</button>`;
 const counts = {};
 list.forEach(c => { counts[c.r] = (counts[c.r] || 0) + 1; });
 const top = Object.keys(counts).sort((a, b) => counts[b] - counts[a])[0];
 return `<button class="cs-cmt has" data-cs="cmt" data-mes="${mesId}" data-p="${p}" data-r="${top}" aria-label="ความคิดเห็น ${list.length}"><span>${list.length}</span></button>`;
}
/** แถบคอมเมนต์ท้ายข้อความ (แชทนิยาย · แชทหลัก) แตะแล้วเห็นคอมเมนต์ทั้งบท */
function csCmtBarHTML(mesId) {
 // ★ 1.11 ไอคอนเล็กชิดขวาแบบหน้านิยาย ไม่เกะกะ
 const d = csCmtData(mesId);
 const all = d && d.list ? Object.values(d.list).flat() : [];
 const counts = {};
 all.forEach(c => { counts[c.r] = (counts[c.r] || 0) + 1; });
 const top = Object.keys(counts).sort((a, b) => counts[b] - counts[a])[0];
 const inner = csCmtBusy.has(mesId) ? '<span class="cs-cmt-spin sm"></span>' : all.length ? `${csReactSVG(top, 14)}<span>${all.length}</span>` : CS_CMT_ICON;
 return `<div class="cs-cmtbar-wrap"><button class="cs-cmt cs-cmtbar${all.length ? ' has' : ''}" data-cs="cmtall" data-mes="${mesId}" aria-label="ความคิดเห็น ${all.length}">${inner}</button></div>`;
}
function csCmtBarsRefresh(mesId) {
 document.querySelectorAll(`.cs-cmtbar[data-mes="${mesId}"]`).forEach(b => { const w = b.closest('.cs-cmtbar-wrap'); if (w) w.outerHTML = csCmtBarHTML(mesId).replace('cs-cmtbar-wrap', w.className); });
}
/** แผ่นคอมเมนต์เปิดบนหน้านิยาย หน้าแชทนิยาย หรือทับแชทหลัก */
function csCmtHost() {
 if (csNovel) return csNovel.el;
 if (csReader) return csReader.el;
 let h = document.getElementById('cs-cmthost');
 if (!h) {
  h = document.createElement('div');
  h.id = 'cs-cmthost';
  document.body.appendChild(h);
  h.addEventListener('click', e => { const b = e.target.closest('[data-cs]'); if (b) { e.stopPropagation(); csCmtClick(b.dataset.cs, b); } });
 }
 csApplyVars(h);
 return h;
}
/** การ์ดจำนวนคอมเมนต์: ตั้งเอง · ให้โมเดลคิด · สุ่ม */
function csCmtCountCard() {
 const md = csCmtMode();
 const R = (k, l, max, u) => csRange(k, l, 1, max, 1, u);
 const rows = md === 'set' ? R('cmtPer', 'คอมเมนต์ต่อย่อหน้า', 10, ' คอมเมนต์') + R('cmtParas', 'จำนวนย่อหน้าที่มีคนเม้นท์', 12, ' ย่อหน้า')
  : md === 'auto' ? R('cmtPer', 'ต่อย่อหน้าไม่เกิน', 10, ' คอมเมนต์') + R('cmtParas', 'ย่อหน้าไม่เกิน', 12, ' ย่อหน้า')
  : R('cmtPerMin', 'ต่อย่อหน้า ตั้งแต่', 10, ' คอมเมนต์') + R('cmtPer', 'ถึง', 10, ' คอมเมนต์') + R('cmtParasMin', 'จำนวนย่อหน้า ตั้งแต่', 12, ' ย่อหน้า') + R('cmtParas', 'ถึง', 12, ' ย่อหน้า');
 const hint = md === 'set' ? 'ได้เท่านี้ทุกครั้ง' : md === 'auto' ? 'โมเดลเลือกเองอิสระ ย่อหน้าไหน กี่คอมเมนต์ก็ได้ ไม่เกินที่ตั้ง' : 'สุ่มใหม่ทุกครั้ง แต่ละย่อหน้าได้ไม่เท่ากัน';
 return `<div class="cs-card"><div class="cs-cardh">จำนวนคอมเมนต์<small>ต่อครั้งที่คนอ่านมา</small></div>${csSeg('cmtCountMode', [['set', 'ตั้งเอง'], ['auto', 'ให้โมเดลคิด'], ['random', 'สุ่ม']])}
  <div class="cs-hint2" style="margin:2px 0 6px">${hint}</div>${rows}
  <div class="cs-hint2" style="margin:-2px 0 6px">ถ้าโมเดลเลือกบรรทัดไว้ตอนเขียน จำนวนย่อหน้าตามบรรทัดที่เลือก (บวกย่อหน้าที่แตะ) · รวม <b data-cmt-total>${csCmtTotalText()}</b> คอมเมนต์</div></div>`;
}
function csCmtTotalText() {
 const md = csCmtMode();
 if (md === 'random') { const a = csCmtPerMin() * csCmtParasMin(), b = csCmtPer() * csCmtNParas(); return a === b ? `${a}` : `${a}–${b}`; }
 return (md === 'auto' ? 'ไม่เกิน ' : '') + csCmtPer() * csCmtNParas();
}
function csCmtFmt() {
 return `Compact JSON only, no " inside text: [{"p":n,"c":[{"n":"handle","t":"text","r":"heart|fire|laugh|cry|shock|angry"${csCfg().cmtReplies ? ',"to":"handle (only if replying)"' : ''}}]}]`;
}
function csCmtPer() { return Math.max(1, Math.min(10, csCfg().cmtPer | 0 || 3)); }
function csCmtNParas() { return Math.max(1, Math.min(12, csCfg().cmtParas | 0 || 4)); }
function csCmtPerMin() { return Math.max(1, Math.min(csCmtPer(), csCfg().cmtPerMin | 0 || 1)); }
function csCmtParasMin() { return Math.max(1, Math.min(csCmtNParas(), csCfg().cmtParasMin | 0 || 1)); }
function csCmtMode() { const m = csCfg().cmtCountMode; return m === 'auto' || m === 'random' ? m : 'set'; }
function csRnd(a, b) { return a + Math.floor(Math.random() * (b - a + 1)); }
/** จำนวนคอมเมนต์ที่จะขอครั้งนี้ ตามโหมด · คืน { n ย่อหน้า, head, each, perMax } */
function csCmtPlan(paras, pickedCount) {
 const mode = csCmtMode();
 const pMax = csCmtPer(), pMin = mode === 'random' ? csCmtPerMin() : pMax;
 const nMax = csCmtNParas(), nMin = mode === 'random' ? csCmtParasMin() : nMax;
 const cw = k => k === 1 ? '1 short casual Thai comment' : `${k} short casual Thai comments`;
 let n, head, each;
 if (pickedCount) { n = paras.length; head = 'For each paragraph above'; }
 else if (mode === 'auto') { n = Math.min(paras.length, nMax); head = `Pick any paragraphs you like, up to ${n};`; }
 else { n = Math.min(paras.length, mode === 'random' ? csRnd(nMin, nMax) : nMax); head = `Pick ${n} paragraphs;`; }
 if (mode === 'auto') each = pMax === 1 ? '1 short casual Thai comment each' : `short casual Thai comments, any number from 1 to ${pMax} each, your choice,`;
 else if (mode === 'random') each = pickedCount ? `short casual Thai comments, exactly this many per paragraph: ${paras.map(x => `[${x.i}]=${csRnd(pMin, pMax)}`).join(' ')},` : pMin === pMax ? cw(pMax) + ' each' : `${pMin}-${pMax} short casual Thai comments each (vary the number)`;
 else each = cw(pMax) + ' each';
 return { n, head, each, perMax: pMax, perAvg: (pMin + pMax) / 2, mode };
}
/** ย่อหน้าของบท (ที่มีคอมเมนต์ได้) พร้อมเลขลำดับ */
function csCmtParas(m) {
 return csNovelLines(m).map((l, i) => ({ l, i })).filter(x => x.l.k === 'p' || x.l.k === 'say' || x.l.k === 'think');
}
function csCmtPrompt(mesId, extraIdx) {
 const s = csCfg();
 const m = (csCtx().chat || [])[mesId];
 const all = csCmtParas(m);
 // ★ 1.7 ส่งแค่บรรทัดที่โมเดลเลือก + ย่อหน้าที่เราแตะ ถ้าไม่มีเลยให้คนอ่านเลือกเองจากทั้งบท
 const want = new Set(s.cmtPick === 'model' ? all.filter(x => csCmtIsMarked(mesId, x.l)).map(x => x.i) : []);
 if (s.cmtPick === 'model' && extraIdx !== undefined && extraIdx !== null && all.some(x => x.i === extraIdx)) want.add(extraIdx);
 const picked = all.filter(x => want.has(x.i));
 const paras = (picked.length ? picked : all).slice(0, 24);
 const plan = csCmtPlan(paras, picked.length);
 const n = plan.n;
 const body = paras.map(x => `[${x.i}] ${x.l.k === 'say' ? `${x.l.who}: ${x.l.text}` : x.l.text}`.slice(0, 125)).join('\n');
 const instr = `${plan.head} ${plan.each} from different reader handles (fangirling, shipping, jokes, theories, tears, anger).${s.cmtReplies ? ' Readers may reply to each other ("to": handle), your call.' : ''}`;
 const readers = csCmtReadersLine();
 const fmt = csCmtFmt();
 const system = 'Thai web-novel reader comments.';
 return { system, prompt: [body, '', instr, readers, fmt].filter(x => x !== null && x !== undefined && (x !== '' || true)).filter((x, i, a) => !(x === '' && i !== 1)).join('\n'), paras, parts: { system, body, instr, readers, fmt, count: paras.length, picked: picked.length } };
}
// นับทีละรายการ — ตัวนับของ SillyTavern ตอบ 0 ได้ถ้าเรียกพร้อมกันหลายอัน
let csTokQueue = Promise.resolve();
function csCountTokens(text) {
 const t = String(text || '');
 const est = () => Math.ceil(t.length / 2.6); // ประมาณคร่าว ๆ ถ้านับจริงไม่ได้
 const run = async () => {
  try {
   const f = csCtx().getTokenCountAsync;
   if (typeof f === 'function') { const n = await f(t); if (n > 0 || !t.trim()) return n; }
  } catch {}
  return est();
 };
 const p = csTokQueue.then(run, run);
 csTokQueue = p.catch(() => {});
 return p;
}
async function csCmtEstimate(mesId, extraIdx) {
 const q = csCmtPrompt(mesId, extraIdx);
 const inTok = await csCountTokens(q.system + '\n' + q.prompt);
 // คำตอบกลับ: ประมาณจากจำนวนย่อหน้าที่ต้องคอมเมนต์ × คอมเมนต์ละ ~30 โทเคน
 const md = csCmtMode();
 const per = md === 'random' ? (csCmtPerMin() + csCmtPer()) / 2 : md === 'auto' ? Math.max(1, csCmtPer() * .7) : csCmtPer();
 const np = q.parts.picked ? q.paras.length : Math.min(q.paras.length, md === 'random' ? (csCmtParasMin() + csCmtNParas()) / 2 : csCmtNParas());
 const outTok = Math.round(30 + np * per * 45);
 return { inTok, outTok, total: inTok + outTok, q };
}
/** แยกให้ดูว่าโทเคนไปอยู่ตรงไหนบ้าง */
async function csCmtBreakdown(mesId) {
 const e = await csCmtEstimate(mesId);
 const P = e.q.parts;
 const rows = [
  ['เนื้อบทที่ส่งไป', `${P.count} ย่อหน้า ${P.picked ? '(เฉพาะบรรทัดที่เลือก)' : '(ทั้งบท ให้คนอ่านเลือกเอง)'} ย่อหน้าละไม่เกิน 120 ตัวอักษร`, await csCountTokens(P.body)],
  ['คนอ่านประจำ', csCmtChars().filter(c => c.on).map(c => c.name).join(', ') || 'ไม่มี', P.readers ? await csCountTokens(P.readers) : 0],
  ['คำสั่ง + รูปแบบคำตอบ', 'บอกให้เขียนคอมเมนต์สั้น ๆ และตอบเป็น JSON', await csCountTokens(P.system + '\n' + P.instr + '\n' + P.fmt)],
  ['คำตอบที่ได้กลับ (ประมาณ)', 'คอมเมนต์ที่โมเดลเขียนกลับมา', e.outTok],
 ];
 return { rows, total: e.total };
}
function csCmtParse(raw, validIdx) {
 const s = String(raw || '').replace(/<think(?:ing)?>[\s\S]*?<\/think(?:ing)?>/gi, '').replace(/```(?:json)?/gi, '');
 const tryP = t => { try { return JSON.parse(t); } catch { try { return JSON.parse(t.replace(/,\s*([\]}])/g, '$1')); } catch { return null; } } };
 let arr = null;
 const a = s.indexOf('['), b = s.lastIndexOf(']');
 if (a >= 0 && b > a) arr = tryP(s.slice(a, b + 1));
 if (arr && !Array.isArray(arr) && typeof arr === 'object') arr = arr.comments || arr.data || Object.values(arr).find(Array.isArray) || null;
 if (!Array.isArray(arr)) {
  const o = s.indexOf('{');
  const whole = o >= 0 ? tryP(s.slice(o, s.lastIndexOf('}') + 1)) : null;
  if (whole && typeof whole === 'object' && whole.p === undefined) arr = Array.isArray(whole) ? whole : (whole.comments || whole.data || null);
 }
 // ★ 1.11 คำตอบโดนตัดกลางทาง: เก็บก้อน {"p":…} ที่ครบ
 if (!Array.isArray(arr)) arr = csCmtSalvage(s);
 // ★ 1.12 JSON พัง (มี " ในคอมเมนต์ ฯลฯ): ไล่หาทีละช่องด้วยรูปแบบ
 if (!Array.isArray(arr) || !arr.length) arr = csCmtLoose(s);
 if (!Array.isArray(arr)) return null;
 const valid = [...validIdx].sort((x, y) => x - y);
 // เลขย่อหน้าที่ไม่มีจริง: ปัดไปย่อหน้าที่ใกล้ที่สุด ดีกว่าทิ้งคอมเมนต์
 const snap = p => { if (validIdx.has(p) || !valid.length || isNaN(p)) return p; const n = valid.reduce((a, b) => Math.abs(b - p) < Math.abs(a - p) ? b : a); return Math.abs(n - p) <= 3 ? n : p; };
 const list = {};
 arr.forEach(x => {
  if (!x || typeof x !== 'object') return;
  const p = snap(parseInt(x.p ?? x.para ?? x.paragraph ?? x.i, 10));
  const cs = x.c || x.comments || x.cmt;
  if (!validIdx.has(p) || !Array.isArray(cs)) return;
  cs.slice(0, csCmtPer() + 2).forEach(c => { // ไม่เกินที่ตั้ง (+2 เผื่อ)
   const t = String(c && (c.t ?? c.text ?? c.comment) || '').trim().slice(0, 200);
   if (!t) return;
   const n = String(c.n ?? c.name ?? c.user ?? 'reader').trim().slice(0, 30) || 'reader';
   const r = c.r ?? c.react ?? c.reaction;
   const to = String(c.to ?? c.reply ?? c.re ?? '').replace(/^@/, '').trim().slice(0, 30);
   (list[p] = list[p] || []).push({ n, t, r: CS_REACT[r] ? r : 'heart', ...(to && to !== n ? { to } : {}) });
  });
 });
 return Object.keys(list).length ? list : null;
}
/** ★ 1.12 อ่านคำตอบที่เคยพลาดใหม่ด้วยตัวอ่านรุ่นใหม่ ไม่ต้องเรียกโมเดลอีก */
function csCmtReparse() {
 const s = csCfg(), L = s.cmtLast;
 const m = L && (csCtx().chat || [])[L.mes];
 if (!L || !m || m.is_user || (L.chat && L.chat !== csChatKey())) { csToast('ข้อความนั้นไม่อยู่ในแชทนี้แล้ว'); return false; }
 const idx = new Set(L.idx && L.idx.length ? L.idx : csCmtParas(m).map(x => x.i));
 const list = csCmtParse(L.raw, idx);
 if (!list) { csToast('ยังอ่านไม่ได้ ลองขอใหม่'); return false; }
 const old = csCmtData(L.mes);
 if (old && old.list) Object.keys(old.list).forEach(p => old.list[p].filter(c => c.me).forEach(c => (list[p] = list[p] || []).push(c)));
 m.extra = m.extra || {};
 m.extra.cs_cmt = { h: csHash(m.mes), list, tok: old && old.tok, ts: Date.now() };
 try { csCtx().saveChat?.(); } catch {}
 const n = Object.values(list).flat().length;
 csCmtStatus(true, `อ่านคำตอบเดิมใหม่ ได้ ${n} คอมเมนต์`, '');
 csToast(`💬 กู้ได้ ${n} คอมเมนต์`, 'ok');
 if (csNovel) csNovelRefresh(false);
 csCmtBarsRefresh(L.mes);
 return true;
}
/** จำผลครั้งล่าสุดไว้โชว์ในแท็บคอมเมนต์ (หาสาเหตุเวลาไม่ขึ้น) */
function csCmtStatus(ok, why, raw, mesId, idx) {
 const s = csCfg();
 s.cmtLast = { ok, why: String(why || '').slice(0, 200), raw: String(raw || '').slice(0, 3000), t: Date.now(), mes: mesId, idx: idx || null, chat: csChatKey() };
 csSave();
}
/** อ่านแบบไม่ง้อ JSON: หา "p": เลข แล้วเก็บ n / t / r ที่ตามมา (t ยาวไปจนเจอ "r" หรือปิดก้อน) */
function csCmtLoose(s) {
 const out = [];
 const ps = [...s.matchAll(/"(?:p|para|paragraph)"\s*:\s*"?(\d+)"?/g)];
 ps.forEach((m, k) => {
  const seg = s.slice(m.index + m[0].length, k + 1 < ps.length ? ps[k + 1].index : s.length);
  const c = [];
  const re = /"(?:n|name)"\s*:\s*"([^"\n]{0,40})"\s*,\s*"(?:t|text)"\s*:\s*"([\s\S]*?)"\s*((?:,\s*"\w+"\s*:\s*"[^"\n]{0,40}"\s*)*)}/g;
  let x;
  while ((x = re.exec(seg))) {
   const kv = {}; (x[3] || '').replace(/"(\w+)"\s*:\s*"([^"\n]*)"/g, (_, k, v) => { kv[k] = v; });
   c.push({ n: x[1], t: x[2].replace(/\\n/g, ' ').replace(/\\"/g, '"'), r: kv.r || kv.react || kv.reaction || 'heart', ...(kv.to || kv.reply ? { to: kv.to || kv.reply } : {}) });
  }
  // คอมเมนต์สุดท้ายที่โดนตัด (ยังไม่ปิด) — เอาถ้ามีข้อความพอ
  const lastN = Math.max(seg.lastIndexOf('"n"'), seg.lastIndexOf('"name"'));
  const tail = lastN >= 0 ? seg.slice(lastN).match(/^"(?:n|name)"\s*:\s*"([^"\n]{0,40})"\s*,\s*"(?:t|text)"\s*:\s*"([^]{6,})$/) : null;
  if (tail && !c.some(y => y.n === tail[1] && tail[2].startsWith(y.t))) c.push({ n: tail[1], t: tail[2].replace(/"[\s\S]*$/, '').trim() + '…', r: 'heart' });
  if (c.length) out.push({ p: +m[1], c });
 });
 return out.length ? out : null;
}
/** ดึงก้อน {...} ที่ปิดวงเล็บครบจากคำตอบที่ถูกตัด */
function csCmtSalvage(s) {
 const out = [];
 let depth = 0, start = -1, inStr = false, esc = false;
 for (let i = 0; i < s.length; i++) {
  const ch = s[i];
  if (inStr) { if (esc) esc = false; else if (ch === '\\') esc = true; else if (ch === '"') inStr = false; continue; }
  if (ch === '"') { inStr = true; continue; }
  if (ch === '{') { if (depth === 0) start = i; depth++; }
  else if (ch === '}' && depth > 0) { depth--; if (depth === 0 && start >= 0) { try { const o = JSON.parse(s.slice(start, i + 1)); if (o && (o.p !== undefined || o.para !== undefined)) out.push(o); } catch {} start = -1; } }
 }
 return out.length ? out : null;
}
async function csCallRaw(prompt, system, len) {
 const ctx = csCtx();
 const f = ctx.generateRaw;
 if (typeof f !== 'function') throw new Error('SillyTavern รุ่นนี้เรียกโมเดลแยกไม่ได้');
 // รุ่นใหม่รับเป็นก้อน object รุ่นเก่ารับเป็นลำดับ
 return f.length === 0 ? await f({ prompt, systemPrompt: system, responseLength: len }) : await f(prompt, null, false, false, system, len);
}
/** ป้าย [c] ท้ายบรรทัดที่โมเดลเลือก: ลบออกจากข้อความจริง แล้วจำว่าบรรทัดไหน */
function csCmtTakeMark(mesId) {
 const ctx = csCtx();
 const m = (ctx.chat || [])[mesId];
 if (!m || m.is_user || !/\[c(mt)?\]/i.test(m.mes || '')) return false;
 const marked = [];
 const lines = String(m.mes).split('\n').map(line => {
  if (!/\[c\]/i.test(line)) return line;
  const clean = line.replace(/\s*\[c\]/gi, '');
  if (clean.trim()) marked.push(clean.trim());
  return clean;
 });
 m.mes = lines.join('\n').replace(/\s*\[cmt\]\s*/gi, '\n').replace(/\n{3,}/g, '\n\n').trim();
 if (Array.isArray(m.swipes) && m.swipe_id !== undefined && typeof m.swipes[m.swipe_id] === 'string') m.swipes[m.swipe_id] = m.mes;
 m.extra = m.extra || {};
 m.extra.cs_cmt_marks = { h: csHash(m.mes), lines: marked.slice(0, 5) };
 try { ctx.updateMessageBlock?.(mesId, m); } catch {}
 try { ctx.saveChat?.(); } catch {}
 return marked.length > 0;
}
/** บรรทัดที่โมเดลเลือกไว้ (ข้อความถูกแก้ = ใช้ไม่ได้) */
function csCmtMarks(mesId) {
 const m = (csCtx().chat || [])[mesId];
 const d = m && m.extra && m.extra.cs_cmt_marks;
 return d && d.h === csHash(m.mes) ? d.lines : [];
}
function csCmtIsMarked(mesId, l) { const mk = csCmtMarks(mesId); return !!(l && l.raw && mk.includes(l.raw.replace(/\s*\[c\]/gi, '').trim())); }
/** ย่อหน้านี้ควรมีไอคอนไหม */
function csCmtShowIcon(mesId, i, l) {
 // ★ 1.7 กล่องคอมเมนต์ท้ายทุกย่อหน้าเหมือนแอพอ่านนิยาย แม้ยังไม่มีคนเม้นท์
 return !!l && (l.k === 'p' || l.k === 'say' || l.k === 'think');
}
/** คีย์เวิร์ดที่เจอในบท (ไม่ซ้ำคำ) */
function csCmtHits(mesId) {
 const m = (csCtx().chat || [])[mesId];
 const t = String(m && m.mes || '').toLowerCase();
 return String(csCfg().cmtKeywords || '').split(/[,\n]/).map(x => x.trim().toLowerCase()).filter(Boolean).filter((w, i, a) => a.indexOf(w) === i && t.includes(w));
}
/** ควรเรียกคอมเมนต์อัตโนมัติสำหรับบทนี้ไหม */
/** ข้อความของบอทตั้งแต่ครั้งล่าสุดที่มีคอมเมนต์ (รวมข้อความนี้) — นับจากแชทเอง ไม่ต้องเก็บตัวนับ */
function csCmtSince(mesId) {
 const chat = csCtx().chat || [];
 let n = 0;
 for (let i = mesId; i >= 0; i--) {
  const m = chat[i];
  if (!m || m.is_user || m.is_system) continue;
  const d = m.extra && m.extra.cs_cmt;
  if (i !== mesId && ((d && d.list && Object.keys(d.list).length) || m.extra?.cs_cmt_try)) break; // เคยเรียกแล้ว (สำเร็จหรือไม่ก็ตาม)
  n++;
 }
 return n;
}
/** ★ 1.9 เงื่อนไขเรียกคอมเมนต์เอง ผสมกันได้ อันไหนผ่านก็เรียก · คืนชื่อเหตุผล หรือ '' */
function csCmtAutoReason(mesId) {
 const s = csCfg();
 if (s.cmtPick === 'model' && csCmtMarks(mesId).length > 0) return 'model'; // โมเดลเลือกบรรทัดไว้
 if (s.cmtPick !== 'model') {
  if (s.cmtGate === 'always') return 'always';
  if (csCmtHits(mesId).length >= Math.max(1, s.cmtMinHits | 0)) return 'keyword';
 }
 const every = Math.max(0, s.cmtEvery | 0);
 if (every && csCmtSince(mesId) >= every) return 'every';
 const pct = Math.max(0, Math.min(100, +s.cmtRandom || 0));
 if (pct && Math.random() * 100 < pct) return 'random';
 return '';
}
function csCmtShouldAuto(mesId) { return !!csCmtAutoReason(mesId); }
const csCmtBusy = new Set();
// ★ 1.16 คอมเมนต์อัตโนมัติรอให้โมเดลว่างก่อน ไม่แย่งคิวกับคำตอบโรลหลัก (API หลายเจ้ารับทีละคำขอ)
let csCmtPending = null, csCmtAutoT = 0;
function csStBusy() {
 if (csGenerating) return true;
 const st = document.getElementById('mes_stop');
 try { return !!(st && st.offsetParent !== null && getComputedStyle(st).display !== 'none'); } catch { return false; }
}
function csCmtAutoQueue(id) {
 csCmtPending = id;
 clearTimeout(csCmtAutoT);
 csCmtAutoT = setTimeout(csCmtAutoKick, 700);
}
function csCmtAutoKick() {
 if (csCmtPending === null) return;
 if (csStBusy()) { csCmtAutoT = setTimeout(csCmtAutoKick, 1500); return; } // ยังเจนอยู่ รอก่อน
 const id = csCmtPending;
 csCmtPending = null;
 csCmtGenerate(id, true);
}
async function csCmtGenerate(mesId, quiet, extraIdx) {
 if (csCmtBusy.has(mesId)) return false;
 const m = (csCtx().chat || [])[mesId];
 if (!m || m.is_user) return false;
 const q = csCmtPrompt(mesId, extraIdx);
 if (!q.paras.length) return false;
 m.extra = m.extra || {};
 m.extra.cs_cmt_try = 1; // นับรอบใหม่จากตรงนี้ แม้เรียกไม่สำเร็จ จะได้ไม่ยิงซ้ำทุกข้อความ
 csCmtBusy.add(mesId);
 csReaderUpdate(); csNovelProgress();
 csCmtBarsRefresh(mesId);
 csCmtSheetRefresh();
 try {
  // ★ 1.11 เผื่อที่ให้โมเดลที่คิดก่อนตอบ (Gemini / R1) และภาษาไทยที่กินโทเคน · ใช้จริงเท่าที่ตอบ
  // เผื่อที่ตามจำนวนที่ตั้ง (ภาษาไทย ~80 โทเคน/คอมเมนต์ + ที่คิดของโมเดล)
  const len = Math.min(8000, Math.max(2000, 800 + q.paras.length * csCmtPer() * 110));
  let raw = '';
  try { raw = await csCallRaw(q.prompt, q.system, len); }
  catch (e) { if (/no message|empty/i.test(String(e && e.message || e)) && !csStBusy()) raw = await csCallRaw(q.prompt, q.system, len * 2); else throw e; }
  let list = csCmtParse(raw, new Set(q.paras.map(x => x.i)));
  // ลองใหม่เฉพาะตอนโมเดลว่าง ไม่ถ่วงคำตอบโรลหลัก
  if (!list && !String(raw || '').trim() && !csStBusy()) { raw = await csCallRaw(q.prompt, q.system, len * 2); list = csCmtParse(raw, new Set(q.paras.map(x => x.i))); }
  const inTok = await csCountTokens(q.system + '\n' + q.prompt);
  const outTok = await csCountTokens(raw);
  const s = csCfg();
  s.cmtUsed = s.cmtUsed || { tokens: 0, calls: 0 };
  s.cmtUsed.tokens += inTok + outTok; s.cmtUsed.calls += 1; csSave();
  if (!list) { csCmtStatus(false, String(raw || '').trim() ? 'โมเดลตอบมาแต่อ่านเป็นคอมเมนต์ไม่ได้' : 'โมเดลตอบกลับมาว่างเปล่า', raw, mesId, q.paras.map(x => x.i)); csToast('คอมเมนต์ไม่มา · ดูสาเหตุในตั้งค่า', 'err'); return false; }
  const old = csCmtData(mesId);
  // คอมเมนต์ที่เราเขียนเองเก็บไว้ ไม่หายตอนขอใหม่ · ย่อหน้าอื่นที่ไม่ได้ขอใหม่ก็เก็บไว้
  const asked = new Set(q.paras.map(x => x.i));
  if (old && old.list) Object.keys(old.list).forEach(p => {
   const keep = asked.has(+p) ? old.list[p].filter(c => c.me) : old.list[p];
   keep.forEach(c => (list[p] = list[p] || []).push(c));
  });
  m.extra = m.extra || {};
  const prevTok = old && old.tok ? old.tok : { in: 0, out: 0 };
  m.extra.cs_cmt = { h: csHash(m.mes), list, tok: { in: prevTok.in + inTok, out: prevTok.out + outTok }, ts: Date.now() };
  try { await csCtx().saveChat?.(); } catch {}
  const n = Object.values(list).flat().length;
  csCmtStatus(true, `ได้ ${n} คอมเมนต์`, '');
  if (quiet) csToast(`💬 ${n} คอมเมนต์ใหม่`, 'ok');
  return true;
 } catch (e) {
  const why = e && e.message ? e.message : String(e);
  csCmtStatus(false, why, '');
  csToast('คอมเมนต์ไม่มา · ' + String(why).slice(0, 40), 'err');
  return false;
 } finally {
  csCmtBusy.delete(mesId);
  csReaderUpdate();
  if (csNovel) csNovelRefresh(false);
  csCmtBarsRefresh(mesId);
  csCmtSheetRefresh();
 }
}
/** ★ 1.16 เรียกคนอ่านมาตอบคอมเมนต์หนึ่งอัน (ต่อท้าย ไม่ลบของเดิม) */
async function csCmtReplyGen(mesId, p, k) {
 if (csCmtBusy.has(mesId)) return false;
 const m = (csCtx().chat || [])[mesId];
 const list = csCmtFor(mesId, p);
 const target = list[k];
 if (!m || !target) return false;
 const para = csCmtParas(m).find(x => x.i === p);
 const ptxt = para ? (para.l.k === 'say' ? `${para.l.who}: ${para.l.text}` : para.l.text) : '';
 const thread = list.map(c => `${c.n}${c.to ? ` (to ${c.to})` : ''}: ${c.t}`).join('\n').slice(-1200);
 const prompt = [`Paragraph: ${ptxt.slice(0, 300)}`, `Comments:\n${thread}`, '', `Write 1-3 short casual Thai replies from readers to ${target.n}'s comment "${target.t.slice(0, 120)}" (others may join in, your call). Not ${target.n} replying to themself unless natural.`, csCmtReadersLine(), `Compact JSON only, no " inside text: [{"p":${p},"c":[{"n":"handle","t":"text","r":"heart|fire|laugh|cry|shock|angry","to":"handle"}]}]`].filter(Boolean).join('\n');
 const system = 'Thai web-novel reader comments.';
 csCmtBusy.add(mesId);
 csCmtBarsRefresh(mesId); csCmtSheetRefresh(); csReaderUpdate();
 try {
  const raw = await csCallRaw(prompt, system, 1200);
  const got = csCmtParse(raw, new Set([p]));
  const add = got && got[p] ? got[p].map(c => ({ ...c, to: c.to || target.n })) : [];
  const inTok = await csCountTokens(system + '\n' + prompt), outTok = await csCountTokens(raw);
  const s = csCfg(); s.cmtUsed = s.cmtUsed || { tokens: 0, calls: 0 }; s.cmtUsed.tokens += inTok + outTok; s.cmtUsed.calls += 1; csSave();
  if (!add.length) { csCmtStatus(false, 'ตอบกลับ: อ่านคำตอบไม่ได้', raw); csToast('ยังไม่มีใครตอบ'); return false; }
  const d = csCmtData(mesId);
  const L = (d.list[p] = d.list[p] || []);
  let j = k + 1;
  while (j < L.length && L[j].to) j++; // ต่อท้ายคำตอบที่มีอยู่ใต้คอมเมนต์นี้
  L.splice(j, 0, ...add);
  d.tok = { in: ((d.tok && d.tok.in) || 0) + inTok, out: ((d.tok && d.tok.out) || 0) + outTok };
  try { await csCtx().saveChat?.(); } catch {}
  csCmtStatus(true, `มีคนตอบ ${add.length}`, '');
  return true;
 } catch (e) {
  csToast('เรียกคนตอบไม่สำเร็จ');
  return false;
 } finally {
  csCmtBusy.delete(mesId);
  if (csNovel) csNovelRefresh(false);
  csCmtBarsRefresh(mesId); csCmtSheetRefresh(); csReaderUpdate();
 }
}
// ── แผ่นความคิดเห็น ──
let csCmtOpen = null; // { mes, p }
let csCmtEditing = '';
let csCmtReplyTo = null; // { mes, p, n } กำลังตอบคอมเมนต์ของใคร
/** จัดคอมเมนต์เป็นเธรด: คนที่ตอบ ("to") อยู่ใต้คอมเมนต์ล่าสุดของคนนั้นก่อนหน้า */
function csCmtThreadHTML(list, p, row) {
 const kids = {}, top = [];
 list.forEach((c, k) => {
  let parent = -1;
  if (c.to) for (let j = k - 1; j >= 0; j--) if (list[j].n.toLowerCase() === String(c.to).toLowerCase()) { parent = j; break; }
  if (parent >= 0) (kids[parent] = kids[parent] || []).push(k); else top.push(k);
 });
 const draw = (k, depth) => row(list[k], k, p) + (kids[k] ? `<div class="cs-cmt-replies${depth >= 2 ? ' flat' : ''}">${kids[k].map(x => draw(x, depth + 1)).join('')}</div>` : '');
 return top.map(k => draw(k, 0)).join('');
} // 'ย่อหน้า:ลำดับ' ที่กำลังแก้
function csCmtSheetHTML(mesId, p) {
 const m = (csCtx().chat || [])[mesId];
 const paras = m ? csCmtParas(m) : [];
 const whole = p === -1;
 const para = whole ? null : paras.find(x => x.i === p);
 const data = csCmtData(mesId);
 const list = whole ? (data && data.list ? Object.values(data.list).flat() : []) : csCmtFor(mesId, p);
 const busy = csCmtBusy.has(mesId);
 const counts = {};
 list.forEach(c => { counts[c.r] = (counts[c.r] || 0) + 1; });
 const qt = pa => pa ? (pa.l.k === 'say' ? `${pa.l.who}: “${pa.l.text}”` : pa.l.text) : '';
 const row = (c, k, pp) => {
  const ch = csCmtCharByName(c.n);
  const janya = !!ch;
  const hue = csHash(c.n) % 360;
  const editing = csCmtEditing === `${pp}:${k}`;
  const act = `data-mes="${mesId}" data-p="${pp}" data-k="${k}"`;
  return `<div class="cs-cmt-row${janya ? ' janya' : ''}${c.me ? ' me' : ''}">
   ${ch && ch.img ? `<img class="cs-cmt-av" src="${csEsc(ch.img)}" alt="">` : `<span class="cs-cmt-av" style="${janya ? '' : `background:hsl(${hue} 45% 60%)`}">${csEsc(c.n[0] || '?')}</span>`}
   <div class="cs-cmt-b"><div class="cs-cmt-n">${csEsc(c.n)}${janya ? '<i>ขาประจำ</i>' : ''}${c.me ? '<i>คุณ</i>' : ''}${c.to ? `<em class="cs-cmt-to">ตอบ @${csEsc(c.to)}</em>` : ''}</div>
    ${editing ? `<div class="cs-cmt-edit"><textarea class="cs-cmt-ein" rows="2" maxlength="200">${csEsc(c.t)}</textarea>
     <div class="cs-cmt-reacts">${Object.keys(CS_REACT).map(r => `<button class="${c.r === r ? 'on' : ''}" data-cs="cmtreact" data-r="${r}" title="${CS_REACT_LABEL[r]}">${csReactSVG(r, 18)}</button>`).join('')}</div>
     <div class="cs-cmt-ebtns"><button data-cs="cmtcancel">ยกเลิก</button><button class="pri" data-cs="cmtsave" ${act}>บันทึก</button></div></div>`
    : `<div class="cs-cmt-t">${csEsc(c.t)}</div>
     <div class="cs-cmt-tools"><button data-cs="cmtreply" ${act}><i class="fa-solid fa-reply"></i> ตอบกลับ</button><button data-cs="cmtask" ${act} title="ให้คนอ่านคนอื่นมาตอบคอมเมนต์นี้"><i class="fa-solid fa-comments"></i> เรียกคนตอบ</button><button data-cs="cmtedit" ${act}><i class="fa-solid fa-pen"></i></button><button data-cs="cmtdel" ${act}><i class="fa-solid fa-trash"></i></button></div>`}</div>
   ${csReactSVG(c.r, 18)}
  </div>`;
 };
 const gp = whole ? undefined : p;
 let body;
 if (busy) body = `<div class="cs-cmt-empty"><span class="cs-cmt-spin"></span>คนอ่านกำลังพิมพ์คอมเมนต์…</div>`;
 else if (!list.length) body = `<div class="cs-cmt-empty">${data && !whole ? 'ย่อหน้านี้ยังไม่มีคอมเมนต์' : 'ยังไม่มีใครมาคอมเมนต์'}<button class="cs-cmt-go" data-cs="cmtgen" data-mes="${mesId}"${gp !== undefined ? ` data-p="${gp}"` : ''}>เรียกคนอ่านมาคอมเมนต์</button><small class="cs-cmt-est" data-est="${mesId}"${gp !== undefined ? ` data-p="${gp}"` : ''}>กำลังคำนวณโทเคน…</small><small>หรือเขียนคอมเมนต์ของคุณเองด้านล่าง ไม่ใช้โทเคน</small></div>`;
 else {
  const sum = `<div class="cs-cmt-sum">${Object.keys(counts).map(r => `<span>${csReactSVG(r, 16)}${CS_REACT_LABEL[r]} ${counts[r]}</span>`).join('')}</div>`;
  if (whole) body = sum + Object.keys(data.list).map(Number).sort((x, y) => x - y).map(pp => {
   const pa = paras.find(x => x.i === pp);
   return `<blockquote class="cs-cmt-q sm">${csEsc(qt(pa)).slice(0, 160)}</blockquote><div class="cs-cmt-list">${csCmtThreadHTML(data.list[pp], pp, row)}</div>`;
  }).join('');
  else body = sum + `<div class="cs-cmt-list">${csCmtThreadHTML(list, p, row)}</div>`;
 }
 const writeP = whole ? (paras.length ? paras[paras.length - 1].i : 0) : p;
 return `<div class="cs-cmt-grab"></div>
  <div class="cs-cmt-head"><b>ความคิดเห็น${whole && list.length ? ` ${list.length}` : ''}</b><button class="cs-btn" data-cs="cmtclose"><i class="fa-solid fa-xmark"></i></button></div>
  ${!whole && para ? `<blockquote class="cs-cmt-q">${csEsc(qt(para))}</blockquote>` : ''}
  <div class="cs-cmt-body">${body}</div>
  <div class="cs-cmt-foot">
   ${csCmtReplyTo && csCmtReplyTo.mes === mesId ? `<div class="cs-cmt-replying">ตอบกลับ <b>@${csEsc(csCmtReplyTo.n)}</b><button data-cs="cmtnoreply" aria-label="ยกเลิก"><i class="fa-solid fa-xmark"></i></button></div>` : ''}
   <div class="cs-cmt-write"><input class="cs-cmt-in" placeholder="${csCmtReplyTo && csCmtReplyTo.mes === mesId ? `ตอบ @${csEsc(csCmtReplyTo.n)}…` : 'เขียนความคิดเห็นของคุณ…'}" maxlength="200"><button data-cs="cmtsend" data-mes="${mesId}" data-p="${csCmtReplyTo && csCmtReplyTo.mes === mesId ? csCmtReplyTo.p : writeP}"><i class="fa-solid fa-paper-plane"></i></button></div>
   ${data && data.tok ? `<small>บทนี้ใช้ไป ${(data.tok.in + data.tok.out).toLocaleString()} โทเคน (ส่ง ${data.tok.in.toLocaleString()} · ได้กลับ ${data.tok.out.toLocaleString()}) · <a data-cs="cmtgen" data-mes="${mesId}">ขอคอมเมนต์ใหม่</a></small>` : ''}
  </div>`;
}
function csCmtShow(mesId, p) {
 const host = csCmtHost();
 csCmtOpen = { mes: mesId, p, host };
 let sh = host.querySelector(':scope > .cs-cmt-sheet');
 if (!sh) {
  sh = document.createElement('div');
  sh.className = 'cs-cmt-sheet';
  host.appendChild(sh);
  const bd = document.createElement('div');
  bd.className = 'cs-cmt-bd';
  bd.dataset.cs = 'cmtclose';
  host.appendChild(bd);
 }
 csCmtSheetRefresh();
 requestAnimationFrame(() => host.classList.add('cmt-open'));
}
function csCmtSheetRefresh() {
 if (!csCmtOpen) return;
 if (!csCmtOpen.host || !csCmtOpen.host.isConnected) { csCmtOpen = null; return; }
 const sh = csCmtOpen.host.querySelector(':scope > .cs-cmt-sheet');
 if (!sh) return;
 sh.innerHTML = csCmtSheetHTML(csCmtOpen.mes, csCmtOpen.p);
 const est = sh.querySelector('[data-est]');
 if (est) csCmtEstimate(csCmtOpen.mes, csCmtOpen.p === -1 ? undefined : csCmtOpen.p).then(e => { est.textContent = `ใช้ประมาณ ${e.total.toLocaleString()} โทเคน (ส่ง ~${e.inTok.toLocaleString()} · ได้กลับ ~${e.outTok.toLocaleString()}) · เรียกแยก ไม่เข้าโรลหลัก`; }).catch(() => {});
}
function csCmtClose() {
 const host = csCmtOpen && csCmtOpen.host;
 csCmtReplyTo = null;
 csCmtOpen = null;
 csCmtEditing = '';
 [host, csNovel && csNovel.el, csReader && csReader.el, document.getElementById('cs-cmthost')].forEach(h => h && h.classList.remove('cmt-open'));
}
function csCmtIsOpen() { return !!(csCmtOpen && csCmtOpen.host && csCmtOpen.host.classList.contains('cmt-open')); }
function csCmtAddMine(mesId, p, text, to) {
 const t = String(text || '').trim();
 const m = (csCtx().chat || [])[mesId];
 if (!t || !m) return false;
 m.extra = m.extra || {};
 let d = csCmtData(mesId);
 if (!d) { d = { h: csHash(m.mes), list: {} }; m.extra.cs_cmt = d; }
 (d.list[p] = d.list[p] || []).push({ n: csUserName(), t: t.slice(0, 200), r: 'heart', me: true, ...(to ? { to } : {}) });
 csCmtReplyTo = null;
 try { csCtx().saveChat?.(); } catch {}
 if (csNovel) csNovelRefresh(false);
 csCmtBarsRefresh(mesId);
 csCmtSheetRefresh();
 return true;
}
/** แก้หรือลบคอมเมนต์หนึ่งอัน (ทั้งของคนอ่านและของเรา) */
function csCmtEdit(mesId, p, k, text, react) {
 const d = csCmtData(mesId);
 const list = d && d.list && d.list[p];
 if (!list || !list[k]) return false;
 if (text === null) { list.splice(k, 1); if (!list.length) delete d.list[p]; }
 else { const t = String(text).trim().slice(0, 200); if (!t) return false; list[k].t = t; if (react && CS_REACT[react]) list[k].r = react; list[k].edited = true; }
 try { csCtx().saveChat?.(); } catch {}
 csCmtEditing = '';
 if (csNovel) csNovelRefresh(false);
 csCmtBarsRefresh(mesId);
 csCmtSheetRefresh();
 return true;
}
function csCmtClick(a, b) {
 if (a === 'cmtedit') { csCmtEditing = `${b.dataset.p}:${b.dataset.k}`; csCmtSheetRefresh(); const t = csCmtOpen && csCmtOpen.host.querySelector('.cs-cmt-ein'); if (t) { t.focus(); t.setSelectionRange(t.value.length, t.value.length); } return true; }
 if (a === 'cmtcancel') { csCmtEditing = ''; csCmtSheetRefresh(); return true; }
 if (a === 'cmtreact') { b.parentElement.querySelectorAll('button').forEach(x => x.classList.toggle('on', x === b)); return true; }
 if (a === 'cmtsave') {
  const box = b.closest('.cs-cmt-edit');
  const r = box.querySelector('.cs-cmt-reacts .on');
  csCmtEdit(+b.dataset.mes, +b.dataset.p, +b.dataset.k, box.querySelector('.cs-cmt-ein').value, r ? r.dataset.r : null);
  return true;
 }
 if (a === 'cmtdel') {
  const c = csCmtFor(+b.dataset.mes, +b.dataset.p)[+b.dataset.k];
  if (c && confirm(`ลบคอมเมนต์ของ ${c.n}?`)) csCmtEdit(+b.dataset.mes, +b.dataset.p, +b.dataset.k, null);
  return true;
 }
 if (a === 'cmt') { csCmtEditing = ''; csCmtShow(+b.dataset.mes, +b.dataset.p); return true; }
 if (a === 'cmtall') { csCmtEditing = ''; csCmtShow(+b.dataset.mes, -1); return true; }
 if (a === 'cmtclose') { csCmtClose(); return true; }
 if (a === 'cmtgen') { csCmtGenerate(+b.dataset.mes, false, b.dataset.p !== undefined ? +b.dataset.p : undefined); return true; }
 if (a === 'cmtsend') { const inp = b.parentElement.querySelector('.cs-cmt-in'); const to = csCmtReplyTo && csCmtReplyTo.mes === +b.dataset.mes ? csCmtReplyTo.n : ''; if (csCmtAddMine(+b.dataset.mes, +b.dataset.p, inp.value, to)) inp.value = ''; return true; }
 if (a === 'cmtreply') { const c = csCmtFor(+b.dataset.mes, +b.dataset.p)[+b.dataset.k]; if (c) { csCmtReplyTo = { mes: +b.dataset.mes, p: +b.dataset.p, n: c.n }; csCmtSheetRefresh(); const i = csCmtOpen && csCmtOpen.host.querySelector('.cs-cmt-in'); if (i) i.focus(); } return true; }
 if (a === 'cmtnoreply') { csCmtReplyTo = null; csCmtSheetRefresh(); return true; }
 if (a === 'cmtask') { csCmtReplyGen(+b.dataset.mes, +b.dataset.p, +b.dataset.k); return true; }
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
 const want = csCmtTakeMark(id); // ★ 1.6 ป้าย [c] ที่โมเดลเลือก ลบออกก่อนแสดงทุกโหมด
 csCastCollect([id]); // ★ 1.8 ชื่อใหม่เข้ารายชื่อตัวละครของแชทนี้
 // ★ 1.9 เช็กก่อนแยกโหมด (เดิมโหมดแชทหลักข้ามไป คอมเมนต์เลยไม่มา)
 if (fresh && s.cmtOn && s.cmtAuto && csCmtShouldAuto(id, want)) csCmtAutoQueue(id);
 if (s.mode === 'inline') { csInlineRender(id, fresh); return; }
 if (csNovel) { csNovelRefresh(fresh && id === csLastCharMesId()); return; }
 if (!fresh || id !== csLastCharMesId()) return;
 if (s.style === 'novel') { if (s.autoOpen) csOpenNovel(id); return; }
 if (csReader) { csReader.player.append(csItemsForMessage(id), true); const t = csReader.el.querySelector('.cs-title b'); const m = csCtx().chat[id]; if (t && m) t.textContent = m.name; return; }
 if (s.autoOpen) csOpenMessage(id);
}
function csOnUserRendered(mesId) {
 const id = +mesId;
 csAddMesButton(id);
 if (csCfg().enabled) csCastCollect([id]);
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
  if (T.MESSAGE_DELETED) ev.on(T.MESSAGE_DELETED, () => setTimeout(csAfterDelete, 0));
  [T.MESSAGE_EDITED, T.MESSAGE_UPDATED, T.MESSAGE_SWIPED].filter(Boolean).forEach(t => ev.on(t, id => { csRerender(id); if (csNovel) setTimeout(() => csNovelRefresh(false), 0); }));
  if (T.CHAT_CHANGED) ev.on(T.CHAT_CHANGED, () => { csCmtPending = null; clearTimeout(csCmtAutoT); csInlineState.clear(); csFresh = false; csGenerating = false; csCloseReader(true); csCloseNovel(true); csApplyPrompt(); setTimeout(() => { csAddAllButtons(); csInlineAll(); }, 50); });
  if (T.MORE_MESSAGES_LOADED) ev.on(T.MORE_MESSAGES_LOADED, () => { csAddAllButtons(); csInlineAll(); });
 }
 csAddAllButtons();
 csInlineAll();
 csEdgeRender();
 // ★ 1.20 ปุ่มคัดลอกโค้ด (จับก่อนหน้าอ่าน จะได้ไม่นับเป็นแตะอ่านต่อ) + วาด HTML ในกล่องแยก
 document.addEventListener('click', e => {
  const b = e.target.closest && e.target.closest('.cs-copy');
  if (!b) return;
  e.stopPropagation(); e.preventDefault();
  const code = b.closest('.cs-code')?.querySelector('code')?.textContent || '';
  const done = () => { b.textContent = 'คัดลอกแล้ว'; setTimeout(() => { b.textContent = 'คัดลอก'; }, 1400); };
  try { navigator.clipboard.writeText(code).then(done, () => csToast('คัดลอกไม่ได้')); } catch { csToast('คัดลอกไม่ได้'); }
 }, true);
 try { new MutationObserver(() => csHydrateHTML(document)).observe(document.body, { childList: true, subtree: true }); } catch {}
 const onResize = () => { const el = document.getElementById('cs-edge'); if (el) csEdgePlace(el); };
 window.addEventListener('resize', onResize);
 if (window.visualViewport) window.visualViewport.addEventListener('resize', onResize);
 console.log(`[chat-story] ${CS_VERSION} พร้อม`);
}

if (typeof jQuery === 'function') jQuery(csInit);
else if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', csInit);
else csInit();
