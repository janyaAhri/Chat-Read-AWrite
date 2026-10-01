// Chat Story (แชทนิยาย) — ส่วนเสริม SillyTavern
// อ่านคำตอบของบอทแบบนิยายแชท: แตะหนึ่งครั้ง เด้งหนึ่งฟอง พร้อมเสียง · พิมพ์ตอบได้ในหน้าอ่าน
// สองแบบ: แชทนิยาย (chat) · นิยาย (novel)  ·  สองโหมด: หน้าอ่านเปิดทับแชท (reader) · แชทหลัก (inline)

const CS_VERSION = '1.40.6';
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
 ttsRate: 1, ttsNarr: true, ttsVoice: '', // ★ 1.27 อ่านออกเสียง
 ttsEngine: 'device', ttsGVoice: '', ttsEVoice: '', ttsAuto: false, ttsBtn: true, ttsWord: false, // ★ 1.37 google (ฟรี) | gemini (30 เสียง) | device
 cmtWith: 'reply', // ★ 1.36 คอมเมนต์มากับคำตอบหลัก (ขอครั้งเดียว) | separate
 sfx: 'off', sfxVol: .7, // ★ 1.31 เสียงเอฟเฟกต์: off | tap | auto
 ambient: 'off', ambVol: .35, // ★ 1.29 เสียงบรรยากาศ: off | auto | rain | sea | cafe | night | fire
 swipeCh: false, // ★ 1.28 ปัดซ้ายขวาเปลี่ยนบท (ปิดไว้ก่อน บางคนไม่ชอบ)
 mode: 'reader',        // reader | inline
 autoOpen: true,
 forceFormat: true,
 speakGuess: true,      // ★ 1.41 ไม่มีป้ายชื่อ = เดาคนพูด (ปิด = คำพูดที่ไม่แน่ใจแสดงเป็นบรรยาย)
 preset: 'ink',
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
 volume: 0.8,
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
 keepTopBar: true,      // ★ 1.23 หน้าอ่านเริ่มใต้แถบบนของ SillyTavern (กดเมนูของ ST ได้ตลอด)
 alwaysOn: false,       // ★ 1.23 เปิดหน้าอ่านค้างเป็นหน้าแชททุกแชท (หลบให้หน้าอื่นของ SillyTavern)
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
 if (!CS_PRESETS[s.preset] && s.preset !== 'custom') s.preset = 'ink';
 if (s.preset === 'custom' && !s.custom) s.custom = { ...CS_PRESETS.classic.c };
 if (!s.chars || typeof s.chars !== 'object') s.chars = {};
 if ((s._v || 0) < 13) { if (s.paraGap === 0.9) s.paraGap = 1.2; s._v = 13; } // หน้านิยายแบบใหม่ห่างขึ้น
 if (s._v < 15) { if (s.userInNovel === 'mark') s.userInNovel = 'same'; delete s.cmtJanya; s._v = 15; } // ★ 1.5 ค่าเริ่มต้นใหม่
 if (s._v < 16) { if (s.cmtGate === 'ask') s.cmtGate = 'keyword'; s._v = 16; } // ★ 1.6 ถามโมเดลกลายเป็นให้โมเดลเลือกบรรทัด
 if (s._v < 18) { s.cmtAuto = true; s._v = 18; } // ★ 1.9 คอมเมนต์มาเองเป็นค่าเริ่มต้น (ครบรอบ/สุ่ม/โมเดลเลือก)
 if (s._v < 19) { const m = { few: [2, 2], normal: [4, 3], many: [6, 4] }[s.cmtAmount] || [4, 3]; s.cmtParas = m[0]; s.cmtPer = m[1]; s._v = 19; } // ★ 1.13 ตั้งจำนวนเองเป็นตัวเลข
 if (s._v < 20) s._v = 20;
 if (s._v < 21) { if (s.preset === 'moon') s.preset = 'classic'; s._v = 21; }
 if (s._v < 22) { csCastCleanup(s); s._v = 22; }
 if (s._v < 23) { if (s.preset === 'classic') s.preset = 'ink'; if (s.volume === 0.6) s.volume = 0.8; s._v = 23; } // ★ 1.21 ค่าเริ่มต้นดำขาว + เสียงดังขึ้น // ★ 1.20 ล้างชื่อที่เดาผิด (ความ คำ ปลาย น้ำเ …) // ★ 1.18 กลับมาเริ่มที่ขาวดำเรียบ (จันทร์นวลยังเลือกได้)
 if (s._v < 24) { if (s.sfx === 'auto') s.sfx = 'off'; s._v = 24; }
 if (s._v < 25) { if (s.ttsEngine === 'google') s.ttsEngine = 'device'; s._v = 25; } // ★ 1.38 เสียงในเครื่องเป็นค่าเริ่มต้น // ★ 1.32 เอฟเฟกต์ปิดเป็นค่าเริ่มต้น
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
 if (csCfg().style === 'novel') return `[Format: novel prose. First line: ## chapter title. Each spoken line = own paragraph: [Name] “words” (thought: [Name (คิด)] “…”). Never write ${un}'s words or actions.]`;
 return `[Format: chat novel, one short line per bubble. Speech: Name: text | Thought: Name (คิด): text | Narration: own line, no name | Scene change: [place / time]. Every spoken line starts with the speaker's name. Never write ${un}'s words or actions.]`;
}
// ★ 1.5 ถามโมเดลไปกับคำตอบโรลหลักเลย ไม่ต้องเรียกแยก
// ★ 1.6 โมเดลเลือกเองตอนเขียนว่าบทพูดหรือการกระทำไหนสมควรมีคนคอมเมนต์
const CS_CMT_ASK = `[End 1-3 lines readers would react to (any dialogue or action) with [c].]`;
function csCmtAskOn() { const s = csCfg(); return s.enabled && s.cmtOn && s.cmtPick === 'model' && !csCmtInlineOn(); } // ★ 1.10 ใช้ได้ทั้งนิยายและแชทนิยาย
/** ★ 1.41 สิ่งที่ส่วนขยายแทรกเข้าพรอมต์ แยกเป็นส่วน ๆ (ใช้ทั้งส่งจริงและโชว์โทเคน) */
function csPromptParts() {
 const s = csCfg();
 return [
  s.enabled && s.forceFormat ? { id: 'format', label: 'คำสั่งรูปแบบ', text: csFormatPrompt() } : null,
  csCmtAskOn() ? { id: 'ask', label: 'ให้โมเดลเลือกบรรทัดคอมเมนต์', text: CS_CMT_ASK } : null,
  csCmtInlineOn() && csCmtAskNow ? { id: 'cmt', label: 'คอมเมนต์มากับคำตอบ', text: csCmtInlinePrompt(csCmtAskNow) } : null,
 ].filter(Boolean);
}
function csPromptText() { return csPromptParts().map(x => x.text).join('\n'); }
let csLastInject = null; // เจนครั้งล่าสุดแทรกอะไรไปบ้าง
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
  .replace(/<cs-cmt>[\s\S]*?(?:<\/cs-cmt>|$)/gi, '')
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
 let t = String(text || '').replace(/<think(?:ing)?>[\s\S]*?<\/think(?:ing)?>/gi, '').replace(/<cs-cmt>[\s\S]*?(?:<\/cs-cmt>|$)/gi, '').replace(/\[\[POCKET_PHONE_SYNC_V2\]\][\s\S]*?\[\[\/POCKET_PHONE_SYNC_V2\]\]/g, '').replace(/\r/g, '');
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
 if (/[.!?。！？,，"“”*\[\]]/.test(s)) return false;
 if (s.split(/\s+/).length > 4) return false;
 if (/^(http|https)$/i.test(s)) return false;
 return true;
}
// ══ ★ 1.41 ป้ายชื่อคนพูด [ชื่อ] “คำพูด” — แม่นยำ ไม่ต้องเดา ══
const CS_TAG_RE = /\[([^\[\]\n]{1,40})\]\s*[:：]?\s*(“[^”\n]*”|"[^"\n]*"|「[^」\n]*」|『[^』\n]*』|＂[^＂\n]*＂)/g;
/** แยกบรรทัดที่มีป้าย → [{k:'narr',text} | {k:'say'|'think', who, text}] · ไม่มีป้าย = null */
function csTagSplit(line) {
 const t = String(line || '');
 if (t.indexOf('[') < 0) return null;
 CS_TAG_RE.lastIndex = 0;
 const parts = [];
 let m, prev = 0, any = false;
 while ((m = CS_TAG_RE.exec(t))) {
  const raw = m[1].trim();
  const tm = raw.match(/^(.+?)\s*(?:[(（]([^)）]{1,16})[)）]|[|｜]\s*(.{1,16}))\s*$/);
  const who = (tm ? tm[1] : raw).replace(/\*/g, '').trim();
  const tag = tm ? (tm[2] || tm[3] || '').trim() : '';
  // ป้ายที่โมเดลใส่เอง เชื่อได้ · กันแค่ของที่ไม่ใช่ชื่อชัด ๆ (ฉาก / เวลา / สรรพนาม)
  if (!csLooksLikeName(who) || /[\/\d:：]/.test(who) || CS_NAME_STOP.test(who) || /^(ความ|คำ|การ)/.test(who)) continue;
  any = true;
  const before = t.slice(prev, m.index).replace(/^[\s,，:：\-–—]+|[\s,，:：\-–—]+$/g, '');
  if (before) parts.push({ k: 'narr', text: before });
  const think = (tag && CS_THOUGHT.test(tag)) || m[2][0] === '『';
  parts.push({ k: think ? 'think' : 'say', who, tag: think ? (tag || 'คิด') : '', text: csStripQuotes(m[2]) });
  prev = CS_TAG_RE.lastIndex;
 }
 if (!any) return null;
 const after = t.slice(prev).replace(/^[\s,，:：\-–—]+|[\s,，:：\-–—]+$/g, '');
 if (after) parts.push({ k: 'narr', text: after });
 return parts;
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
  const tagged = csTagSplit(line);
  if (tagged) {
   flush();
   tagged.forEach(x => {
    if (x.k === 'narr') { csSeeNarr(st, x.text, known); out.push({ k: 'narr', text: x.text.replace(/\*+/g, '').trim() }); return; }
    const who = csCanonName(x.who, known);
    out.push({ k: x.k, who, tag: x.tag, text: x.text, u: csUFlag(who, owner, isUser), c: 'tag' });
    if (x.k === 'say') st.last = [who, ...st.last.filter(y => y !== who)].slice(0, 2);
    csSee(st, [who]);
   });
   continue;
  }
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
const CS_TH_VERBS = 'พูด|ตอบ|ถาม|ตรัส|รับสั่ง|กระซิบ|ตะโกน|ตวาด|เอ่ย|บอก|แย้ง|พึมพำ|บ่น|ทัก|กล่าว|อ้อน|เปรย|งึมงำ|หัวเราะ|ยิ้ม|ตะคอก|โวยวาย|ครวญ|ถอนหายใจ|หันมา|หันไป|ร้องไห้|สะอื้น';
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
  if (csCfg().speakGuess === false && st.pc !== 'name' && st.pc !== 'line') { out.push({ k: 'narr', text: `“${t}”` }); st.pc = ''; st.since = []; st.sinceG = ''; return; }
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
const CS_OBJ_BEFORE = /(ทาง|มอง|หา|ถึง|กับ|ให้|ของ|ที่|ไป|ต่อ|แก่|จาก|ใส่|เรียก|ชวน|ถาม|ตาม|พา|จ้อง|ใกล้|ข้าง|หลัง|กอด|จับ|แตะ|ผลัก|ดึง|โอบ|เห็น|รอ|บอก|ตอบ|at|to|with|toward|towards|behind)\s*$/i;
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
  // ★ 1.36 ชื่อที่ถูกเรียกในคำพูด (…แหละพล) ไม่ใช่คนพูด
  const addr = n => !!qtext && String(qtext).includes(n);
  const sn = (st.since || []).find(n => ok(n) && !addr(n)) || (st.since || []).find(ok);
  if (sn && !addr(sn)) return sn;
  if (st.last.length === 2 && ok(st.last[1]) && !addr(st.last[1])) return st.last[1];
  if (st.last.length >= 1 && ok(st.last[0]) && !addr(st.last[0]) && addr(st.last[1] || '')) return st.last[0];
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
 const sw = it.end !== undefined ? csSwipeHTML(it.end) : '';
 const cm = it.cm !== undefined && csCfg().cmtOn ? csCmtBarHTML(it.cm) : '';
 return sw || cm ? html + `<div class="cs-endrow">${sw}${cm}</div>` : html;
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
  ${showAv ? `<div class="cs-avwrap">${cont ? '' : `<span class="cs-proft" data-cs="prof" data-who="${csEsc(it.who)}" data-ck="${csEsc(it.ck || '')}" data-av="${csEsc(it.av || '')}">${csAvatarHTML(it.who, it.av, user || csIsUserName(it.who), it.ck)}</span>`}</div>` : ''}
  <div class="cs-col">${cont || side === 'right' ? '' : `<div class="cs-name" data-cs="prof" data-who="${csEsc(it.who)}" data-ck="${csEsc(it.ck || '')}" data-av="${csEsc(it.av || '')}"${nstyle}>${csEsc(it.who)}${it.tag && it.k !== 'think' ? ` <i>${csEsc(it.tag)}</i>` : ''}</div>`}
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
/** ★ 1.21 ทางออกเสียงรวม: คอมเพรสเซอร์กันแตก แล้วค่อยดันให้ดังขึ้น */
let csMasterNode = null, csMasterCtx = null;
function csMaster(ac) {
 if (csMasterNode && csMasterCtx === ac) return csMasterNode;
 try {
  if (typeof ac.createDynamicsCompressor !== 'function') return ac.destination;
  const c = ac.createDynamicsCompressor();
  c.threshold.value = -20; c.knee.value = 12; c.ratio.value = 6; c.attack.value = .002; c.release.value = .12;
  const g = ac.createGain(); g.gain.value = 1.6;
  c.connect(g); g.connect(ac.destination);
  csMasterNode = c; csMasterCtx = ac;
  return c;
 } catch { return ac.destination; }
}
function csNote(ac, t0, f, dur, vol, type, f2) {
 const o = ac.createOscillator(), g = ac.createGain();
 o.type = type || 'sine';
 o.frequency.setValueAtTime(f, t0);
 if (f2) o.frequency.exponentialRampToValueAtTime(f2, t0 + dur);
 g.gain.setValueAtTime(0.0001, t0);
 g.gain.exponentialRampToValueAtTime(Math.max(0.0002, vol), t0 + 0.008);
 g.gain.exponentialRampToValueAtTime(0.0001, t0 + dur);
 o.connect(g); g.connect(csMaster(ac));
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
  const vol = v * .85, t0 = ac.currentTime + .005; // ★ 1.21 ดังขึ้น (เดิม .32)
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
  w.dataset.i = idx;
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
   w.dataset.i = idx;
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
 if (items.length && m && !m.is_user) items[items.length - 1].end = mesId; // ★ 1.22 ท้ายข้อความบอท (ไว้วางปุ่มสลับคำตอบ)
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
   <div class="cs-title" data-cs="nav" title="สารบัญ · ค้นหา · ที่คั่น · สถิติ"><b>${csEsc(title || csCharName() || 'แชทนิยาย')}</b><small class="cs-sub"></small></div>
   <button class="cs-btn" data-cs="toNovel" title="สลับเป็นแบบนิยาย"><i class="fa-solid fa-book"></i></button>
   <button class="cs-btn" data-cs="auto" title="เล่นอัตโนมัติ"><i class="fa-solid fa-play"></i></button>
   <button class="cs-btn" data-cs="more" title="เพิ่มเติม"><i class="fa-solid fa-ellipsis"></i></button>
   <div class="cs-menu">
    <button data-cs="back"><i class="fa-solid fa-rotate-left"></i>ย้อนกลับหนึ่งฟอง</button>
    <button data-cs="rechap"><i class="fa-solid fa-backward"></i>อ่านบทนี้ใหม่</button>
    <button data-cs="all"><i class="fa-solid fa-forward-fast"></i>แสดงทั้งหมด</button>
    <button data-cs="nav"><i class="fa-solid fa-list"></i>สารบัญ · ค้นหา · ที่คั่น</button>
    <button data-cs="tts"><i class="fa-solid fa-volume-high"></i>อ่านออกเสียง</button>
    <button data-cs="sfxtoggle">${csSfxToggleLabel()}</button>
    <button data-cs="amb"><i class="fa-solid fa-cloud-rain"></i>เสียงบรรยากาศ · เอฟเฟกต์</button>
    <button data-cs="full"><i class="fa-solid fa-expand"></i>เต็มจอ</button>
    <button data-cs="regen"><i class="fa-solid fa-rotate-right"></i>เจนใหม่</button>
    <button data-cs="dellast"><i class="fa-solid fa-trash-can"></i>ลบข้อความล่าสุด</button>
    <button data-cs="pin"><i class="fa-solid fa-thumbtack"></i>เปิดค้างเป็นหน้าแชท</button>
    <button data-cs="settings"><i class="fa-solid fa-sliders"></i>ปรับแต่ง</button>
   </div>
  </div>
  <div class="cs-progress"><i></i></div>
  <div class="cs-body" data-cs="tap"><div class="cs-list"></div>
   <div class="cs-hint">แตะเพื่ออ่านต่อ</div>
   <div class="cs-end"><span>อ่านถึงล่าสุดแล้ว</span></div>
  </div>
  ${s.showInput ? `${csToolsHTML(s)}<div class="cs-inputbar">
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
 csReader = { el, player, auto: null, chatKey: csChatKey(), chatLen: (csCtx().chat || []).length };
 csApplyUnderBar(el); csPinSync(); csStBtnsRender(el); document.body.classList.add('cs-open');
 if (pre && pre.length) player.preload(pre);
 el.addEventListener('click', csReaderClick);
 csExtBind(el);
 csMarksBind(el);
 csSwipeChBind(el);
 csAmbKick();
 csStatBind(el);
 if (csCfg().sfx !== 'off') csSfxFilesLoad();
 el.querySelector('.cs-body').addEventListener('scroll', csReaderOnScroll, { passive: true });
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
 csReaderSavePos();
 csAmbAutoSoon();
 const send = el.querySelector('.cs-send i');
 if (send) send.className = csGenerating ? 'fa-solid fa-stop' : 'fa-solid fa-paper-plane';
 const sb = el.querySelector('.cs-send'); if (sb) { sb.title = csGenerating ? 'หยุด' : 'ส่ง'; sb.setAttribute('aria-label', sb.title); }
 if (player.done) csStopAuto();
 csMesxSoon();
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
 if (csMarkClick(e, b)) return;
 if (b && b.dataset.cs === 'mesx') { e.stopPropagation(); csMesxClick(b); return; }
 if (csTtsClick(e, b)) return;
 if (b && csNavClick(b.dataset.cs, b)) { e.stopPropagation(); csReader && csReader.el.querySelector('.cs-menu')?.classList.remove('open'); return; }
 if (csNavIsOpen()) { if (!e.target.closest('.cs-nav')) csNavClose(); return; }
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
 if (a === 'rechap') { menu && menu.classList.remove('open'); return csChatRestartChapter(); }
 if (a === 'all') { menu && menu.classList.remove('open'); csStopAuto(); return csReader.player.all(); }
 if (a === 'settings') { menu && menu.classList.remove('open'); return csOpenSettings(); }
 if (a === 'regen') { menu && menu.classList.remove('open'); return csRegen(); }
 if (a === 'pin') { menu && menu.classList.remove('open'); return csSetPinned(!csIsPinned()); }
 if (a === 'stbtn') return csStBtnClick(b);
 if (a === 'sttray') return csReader.el.querySelector('.cs-sttray')?.classList.toggle('open');
 if (a === 'swl' || a === 'swr') return csSwipe(a === 'swl' ? -1 : 1);
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
 csTtsStop();
 csStatFlush();
 csAmbStopSoon();
 if (!instant && csIsPinned()) csAlwaysPaused = true;
 setTimeout(() => { if (!csReader && !csNovel) document.body.classList.remove('cs-open'); }, 0);
 clearTimeout(csReaderScrollT); csReaderSavePos();
 if (csCmtOpen && csCmtOpen.host === csReader.el) csCmtClose();
 document.getElementById('cs-settings') && csCloseSettings();
 csStopAuto();
 const el = csReader.el;
 csSelEnd();
 if (csReader.player.typing) clearTimeout(csReader.player.typing.timer);
 csExtReturn();
 csReader = null;
 if (instant) { if (el !== csKeepEl) el.remove(); return; }
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
 return csOpenReader(csItemsForChat(mesId), m && !m.is_user ? m.name : csCharName(), csItemsForChat(from, mesId));
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
// ══ ★ 1.22 สลับคำตอบ (swipe ของ SillyTavern) จากในหน้าอ่าน ══
/** ข้อความล่าสุดเป็นของบอทไหม และตอนนี้อยู่คำตอบที่เท่าไหร่จากทั้งหมด */
function csSwipeState(mesId) {
 const chat = csCtx().chat || [];
 const m = chat[mesId];
 if (!m || m.is_user || m.is_system || mesId !== chat.length - 1) return null;
 const total = Array.isArray(m.swipes) && m.swipes.length ? m.swipes.length : 1;
 const cur = Math.min(total, Math.max(1, (m.swipe_id | 0) + 1));
 return { cur, total };
}
function csSwipeHTML(mesId) {
 const st = csSwipeState(mesId);
 if (!st) return '';
 return `<div class="cs-swipe" data-mes="${mesId}"><button data-cs="swl" aria-label="คำตอบก่อนหน้า"${st.cur <= 1 ? ' disabled' : ''}><i class="fa-solid fa-chevron-left"></i></button><span>${st.cur}/${st.total}</span><button data-cs="swr" aria-label="${st.cur >= st.total ? 'เจนคำตอบใหม่' : 'คำตอบถัดไป'}"><i class="fa-solid fa-chevron-right"></i></button></div>`;
}
/** dir: -1 ก่อนหน้า · 1 ถัดไป (ถ้าอยู่อันสุดท้าย SillyTavern จะเจนอันใหม่ให้) */
function csSwipe(dir) {
 if (csGenerating || csStBusy()) { csToast('รอให้ตอบเสร็จก่อน'); return false; }
 const ctx = csCtx();
 const chat = ctx.chat || [];
 const id = chat.length - 1;
 const st = csSwipeState(id);
 if (!st) { csToast('สลับได้เฉพาะคำตอบล่าสุดของบอท'); return false; }
 if (dir < 0 && st.cur <= 1) return false;
 csReaderPrune(id);
 try {
  const api = ctx.swipe && (dir < 0 ? ctx.swipe.left : ctx.swipe.right);
  if (typeof api === 'function') { const r = api(null, {}); if (r && r.catch) r.catch(() => {}); }
  else document.querySelector(`#chat .mes[mesid="${id}"] .${dir < 0 ? 'swipe_left' : 'swipe_right'}`)?.click();
 } catch { csToast('สลับคำตอบไม่ได้'); return false; }
 return true;
}
/** หลังสลับ: เอาฟองของคำตอบใหม่มาแทน (ถ้ากำลังเจนอันใหม่ รอให้เสร็จก่อน) */
function csOnSwiped(mesId) {
 const id = +mesId;
 if (csReader) {
  csReaderPrune(id);
  if (!csGenerating && !csStBusy()) { csReader.player.append(csItemsForMessage(id), true); }
 }
 if (csNovel) setTimeout(() => csNovelRefresh(false), 0);
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
  csDelBusy = true;
  try { if (typeof ctx.deleteLastMessage === 'function') await ctx.deleteLastMessage(); else { chat.pop(); document.querySelector('#chat .mes:last-child')?.remove(); } } finally { csDelBusy = false; }
  Promise.resolve(ctx.saveChat?.()).catch(() => csToast('บันทึกไฟล์แชทไม่สำเร็จ'));
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
/** เมนูในไม้กายสิทธิ์: มีปุ่มลอยอยู่แล้ว = ไม่ต้องมี · ปิดปุ่มลอย = เมนูกลับมา (ไม่งั้นเปิดหน้าอ่านไม่ได้) */
function csWandMenu() {
 const menu = document.getElementById('extensionsMenu');
 const want = !(csCfg().enabled && csCfg().edgeBtn);
 if (!want) { ['cs-wand', 'cs-wand-novel', 'cs-wand-all', 'cs-wand-set'].forEach(id => document.getElementById(id)?.remove()); return; }
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
let csSetTab = 'read';
const CS_TABS = [['read', 'ทั่วไป', 'fa-sliders'], ['look', 'หน้าตา', 'fa-palette'], ['text', 'ตัวอักษร', 'fa-font'], ['bubble', 'ฟองแชท', 'fa-comment'], ['novel', 'หน้านิยาย', 'fa-book-bookmark'], ['play', 'การอ่าน', 'fa-book-open'], ['sound', 'เสียง', 'fa-volume-high'], ['cmt', 'คอมเมนต์', 'fa-comment-dots'], ['chars', 'ตัวละคร', 'fa-user-group']];
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
   ${s.cmtAuto ? `<div class="cs-card"><div class="cs-cardh">ขอคอมเมนต์ยังไง</div>${csSeg('cmtWith', [['reply', 'มากับคำตอบ (ครั้งเดียว)'], ['separate', 'ขอแยกทีหลัง']])}<div class="cs-hint2" style="margin:2px 0 6px">${s.cmtWith === 'separate' ? 'ตอบเสร็จแล้วค่อยเรียกคนอ่านอีกครั้ง = ใช้โควตา 2 ครั้ง แต่คำตอบหลักไม่ยาวขึ้น' : 'โมเดลเขียนคอมเมนต์ต่อท้ายคำตอบในครั้งเดียว ระบบดึงออกก่อนแสดง · ประหยัดโควตา'}</div></div>` : ''}
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
   ${csPromptTokCardHTML()}
   <div class="cs-card cs-tokcard"><div class="cs-cardh">เรียกคนอ่านเอง (แตะไอคอน / ขอคอมเมนต์ใหม่)<small>เป็นคำขอแยกหนึ่งครั้ง ส่งเฉพาะเนื้อบท + คำสั่ง ไม่แนบทั้งแชท</small></div>
    <div class="cs-srow"><div class="cs-slb"><span>ต่อครั้ง</span><small>คำนวณจากบทล่าสุด · รวมขาไป + คำตอบโดยประมาณ</small></div><div class="cs-sctl"><b data-tok="cmt">…</b></div></div>
    <details class="cs-tokbd"><summary>ดูว่ามีอะไรบ้าง ทำไมใช้เท่านี้</summary><div data-tok="bd">กำลังคำนวณ…</div></details>
    <div class="cs-srow"><div class="cs-slb"><span>ใช้ไปแล้วทั้งหมด</span><small>${u.calls} ครั้ง</small></div><div class="cs-sctl"><b>${u.tokens.toLocaleString()} โทเคน</b><button class="cs-btn2" data-act="cmt-reset">ล้างตัวนับ</button></div></div>
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
  const eng = s.ttsEngine || 'device';
  if (eng === 'edge' && csEdgePlug === null) csEdgePlugProbe().then(ok => { if (ok && csSetTab === 'sound' && document.getElementById('cs-settings')) csRenderSettingsBody(); });
  return `<div class="cs-card"><div class="cs-cardh">อ่านออกเสียง<small>ปุ่ม 🔊 ข้างช่องพิมพ์ · แตะบรรทัดไหนระหว่างอ่าน = อ่านบรรทัดนั้น · กดค้าง → อ่านตรงนี้</small></div>
    ${csToggle('ttsAuto', 'อ่านคำตอบใหม่ให้ฟังเอง', 'บอทตอบเสร็จแล้วเริ่มอ่านทันที')}${csToggle('ttsBtn', 'ปุ่ม 🔊 ข้างช่องพิมพ์')}${csToggle('ttsNarr', 'อ่านบรรยายด้วย', 'ปิด = อ่านเฉพาะบทพูด')}${csRange('ttsRate', 'ความเร็ว', .6, 1.8, .1, 'x')}
    ${csSelect('ttsEngine', 'เสียงจาก', [['device', 'เสียงในเครื่อง'], ['edge', 'Edge · เสียงไทยธรรมชาติ ฟรี'], ['google', 'Google · ฟรี'], ['gemini', 'Gemini · 30 เสียง']], eng === 'edge' ? (csEdgePlug ? '✓ ใช้ผ่านปลั๊กอิน Edge TTS ของ SillyTavern · ตัวละครได้เสียงตามเพศ' : 'เสียงนิวรัลของ Microsoft ฟรี · ถ้าขึ้นว่าต่อไม่ได้ ให้ลงปลั๊กอิน SillyTavern-EdgeTTS-Plugin (ตั้ง enableServerPlugins: true ใน config.yaml แล้วรีสตาร์ท) · ระหว่างนั้นใช้เสียงเครื่องแทนให้เอง') : eng === 'gemini' ? 'ตัวละครได้เสียงของตัวเอง · ใช้คีย์ Google AI Studio ใน SillyTavern · โควตาเต็มสลับเป็น Google เอง' : eng === 'google' ? 'ผ่านเซิร์ฟเวอร์ SillyTavern ไม่ต้องใช้คีย์ · ตัวละครต่างกันที่ระดับเสียง' : 'ตัวละครได้เสียงและระดับเสียงต่างกันตามเพศ')}
    ${eng === 'edge' ? csSelect('ttsEVoice', 'เสียงผู้บรรยาย', [['', 'อัตโนมัติ (เปรมวดี)'], ...CS_EVOICES.map(v => [v.id, csEVoiceLabel(v)])]) : eng === 'gemini' ? csSelect('ttsGVoice', 'เสียงผู้บรรยาย', [['', 'อัตโนมัติ (Charon)'], ...CS_GVOICES.map(v => [v.id, `${v.id} · ${v.g === 'f' ? 'หญิง' : 'ชาย'} · ${v.d}`])]) : eng === 'device' ? csSelect('ttsVoice', 'เสียงผู้บรรยาย', [['', 'อัตโนมัติ'], ...csVoicesTh().map(v => [v.name, csEsc(v.name)])]) : ''}
    ${csToggle('ttsWord', 'ไฮไลต์ทีละคำด้วย', 'ปิดไว้ = คลุมทั้งบรรทัดสีเทาอ่อน')}</div>
   <div class="cs-card"><div class="cs-cardh">เอฟเฟกต์และบรรยากาศ<small>ตั้งละเอียดได้ที่เมนู → เสียงบรรยากาศ · เอฟเฟกต์</small></div>${csSeg('sfx', [['off', 'ปิดเอฟเฟกต์'], ['tap', 'แตะคำเพื่อฟัง'], ['auto', 'อัตโนมัติ']])}${csRange('sfxVol', 'ความดังเอฟเฟกต์', 0, 1, .05, '')}${csSelect('ambient', 'เสียงบรรยากาศ', [['off', 'ปิด'], ['auto', 'อัตโนมัติตามฉาก'], ...CS_AMB.map(a => [a.id, a.name])])}${csRange('ambVol', 'ความดังบรรยากาศ', 0, 1, .05, '')}</div>
   <div class="cs-cardh cs-grouph">เสียงฟองเด้ง</div><div class="cs-card"><div class="cs-cardh">เสียงฟองเด้ง <small>แตะเพื่อเลือกและฟัง</small></div><div class="cs-sounds">${CS_SOUNDS.map(x => `<button class="cs-sound${s.sound === x.id ? ' on' : ''}" data-sound="${x.id}"><i class="fa-solid ${x.id === 'none' ? 'fa-volume-xmark' : x.id === 'custom' ? 'fa-file-audio' : 'fa-music'}"></i><span>${x.name}</span></button>`).join('')}</div>
   ${s.sound === 'custom' ? `<div class="cs-srow"><div class="cs-slb"><span>ไฟล์เสียงของฉัน</span><small>${s.customSound ? (s.customSound.startsWith('data:') ? 'อัปโหลดไว้แล้ว' : csEsc(s.customSound.slice(0, 60))) : 'ยังไม่มี · ไฟล์สั้น ๆ ไม่เกิน 200 KB'}</small></div><div class="cs-sctl cs-sctl-col"><label class="cs-btn2">เลือกไฟล์<input type="file" accept="audio/*" data-upload="sound" hidden></label><input class="cs-text" data-k="customSound" placeholder="หรือวางลิงก์ mp3/ogg" value="${s.customSound && !s.customSound.startsWith('data:') ? csEsc(s.customSound) : ''}"></div></div>` : ''}</div>
   <div class="cs-card">${csRange('volume', 'ความดัง', 0, 1, .05, '')}${csToggle('pitchVary', 'เสียงสูงต่ำต่างกันรายตัวละคร', 'ฟังแล้วรู้ว่าใครพูด')}${csToggle('narrSound', 'มีเสียงตอนบรรยายและเปลี่ยนฉาก')}${csToggle('vibrate', 'สั่นเบา ๆ บนมือถือ', 'ใช้ได้บนมือถือ Android')}
    <div class="cs-srow"><div class="cs-slb"><span>ลองฟังทั้งชุด</span></div><div class="cs-sctl"><button class="cs-btn2" data-act="test-sound"><i class="fa-solid fa-play"></i> ฟัง</button></div></div></div>`;
 }
 if (tab === 'play') {
  return `<div class="cs-card">${csRange('history', 'แสดงข้อความก่อนหน้า', 0, 20, 1, ' ข้อความ')}${csRange('typingMs', 'จุดพิมพ์ก่อนฟองเด้ง', 0, 1200, 50, ' ms')}${csRange('autoSpeed', 'ความเร็วเล่นอัตโนมัติ (▶)', .5, 3, .25, 'x')}</div>
   <div class="cs-card">${csToggle('swipeCh', 'ปัดซ้ายขวาเพื่อเปลี่ยนบท', 'ปัดซ้าย = บทถัดไป · ปัดขวา = บทก่อนหน้า')}</div>
   <div class="cs-card">${csSelect('plainUser', 'ข้อความของเราที่ไม่มีเครื่องหมาย', [['auto', 'เดาให้'], ['say', 'เป็นคำพูด'], ['narr', 'เป็นบรรยาย']], 'ในเครื่องหมายคำพูด = คำพูด · *ดอกจัน* = บรรยาย')}</div>
   <div class="cs-hint2">อ่านออกเสียง เอฟเฟกต์ และบรรยากาศ อยู่ในแท็บเสียง</div>`;
 }
 if (tab === 'chars') return csCharsTabHTML();
 // ทั่วไป
 return `<div class="cs-card">${csToggle('enabled', 'เปิดใช้แชทนิยาย')}<div class="cs-cardh">แบบการอ่าน</div>${csSeg('style', [['chat', 'แชทนิยาย'], ['novel', 'นิยาย']])}<div class="cs-cardh">แสดงที่</div>${csSeg('mode', [['reader', 'หน้าอ่านเปิดทับแชท'], ['inline', 'ในแชทหลัก']])}</div>
  <div class="cs-card"><div class="cs-cardh">การเปิดหน้าอ่าน</div>${csToggle('alwaysOn', 'เปิดค้างเป็นหน้าแชท', 'ทุกแชท · ไปหน้าเลือกตัวละครจะหลบให้ · ปุ่มข้างจอ = ซ่อน/แสดง')}${csToggle('autoOpen', 'บอทตอบเสร็จแล้วเปิดเอง')}${csToggle('keepTopBar', 'เห็นแถบบนของ SillyTavern', 'กดเมนู สลับแชท ได้โดยไม่ต้องปิดหน้าอ่าน')}${csToggle('edgeBtn', 'ปุ่มลัดชิดขอบจอ', 'ลากขึ้นลงได้ · ลากไปอีกฝั่งเพื่อย้ายข้าง')}</div>
  <div class="cs-card"><div class="cs-cardh">ช่องพิมพ์</div>${csToggle('showInput', 'ช่องพิมพ์ในหน้าอ่าน')}${csToggle('enterSend', 'กด Enter เพื่อส่ง', 'Shift+Enter ขึ้นบรรทัดใหม่')}</div>
  <div class="cs-card cs-tokcard"><div class="cs-cardh">สั่งบอท</div>${csToggle('forceFormat', 'สั่งบอทเขียนตามแบบที่เลือก', 'แชทนิยาย: ชื่อ: คำพูด · นิยาย: [ชื่อ] “คำพูด” (ป้ายชื่อไม่โชว์ ใช้บอกว่าใครพูด)')}${csToggle('speakGuess', 'เดาคนพูดเมื่อไม่มีชื่อ', 'ปิด = คำพูดที่ไม่มีชื่อกำกับจะแสดงเป็นบรรยาย ไม่เสี่ยงใส่ชื่อผิด')}</div>
  ${csPromptTokCardHTML()}
  <div class="cs-card cs-btnrow"><button class="cs-btn2" data-act="read-last"><i class="fa-solid fa-book-open"></i> เปิดหน้าอ่าน</button><button class="cs-btn2" data-act="read-all"><i class="fa-solid fa-book"></i> อ่านทั้งแชท</button><button class="cs-btn2 danger" data-act="reset"><i class="fa-solid fa-rotate"></i> คืนค่าเริ่มต้น</button></div>
  <div class="cs-foot">Paper-Whisper ${CS_VERSION} · แตะหรือ Space อ่านต่อ · ลูกศรซ้ายย้อนกลับ · Esc ปิด</div>`;
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
 // ★ 1.38 ตัวอย่างโชว์เฉพาะแท็บหน้าตา · แถบแท็บเลื่อนให้เห็นแท็บที่เลือก
 el.classList.toggle('cs-nopreview', !['look', 'text', 'bubble'].includes(csSetTab));
 const tb = el.querySelector('.cs-tabs'), on = tb && tb.querySelector('button.on');
 if (tb && on) { const d = on.offsetLeft - tb.scrollLeft; if (d < 0 || d + on.offsetWidth > tb.clientWidth) tb.scrollLeft = on.offsetLeft - 12; }
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
/** ★ 1.41 การ์ด "พรอมต์ที่ส่วนขยายยิงไปให้โมเดล" — นับเฉพาะขาไป */
function csPromptTokCardHTML() {
 const s = csCfg();
 const inl = csCmtInlineOn(), sep = s.cmtOn && s.cmtAuto && s.cmtWith === 'separate';
 const row = (label, sub, key) => `<div class="cs-srow"><div class="cs-slb"><span>${label}</span><small>${sub}</small></div><div class="cs-sctl"><b data-tok="${key}">…</b></div></div>`;
 return `<div class="cs-card cs-tokcard"><div class="cs-cardh">พรอมต์ที่ส่วนขยายยิงไปให้โมเดล<small>นับเฉพาะขาไป (ที่แนบไปกับคำขอ) ไม่รวมคำตอบที่ได้กลับ</small></div>
  ${row('คำสั่งรูปแบบ', s.enabled && s.forceFormat ? 'แนบทุกครั้งที่บอทตอบ' : 'ปิดอยู่ = 0', 'p-format')}
  ${csCmtAskOn() ? row('ให้โมเดลเลือกบรรทัดคอมเมนต์', 'แนบทุกครั้งที่บอทตอบ', 'p-ask') : ''}
  ${inl ? row('คอมเมนต์มากับคำตอบ', 'แนบเฉพาะครั้งที่ถึงรอบคอมเมนต์ · ไม่มีคำขอเพิ่ม', 'p-cmt') : ''}
  ${sep ? row('ขอคอมเมนต์แยก', 'คำขอใหม่อีกครั้ง ต่อบท (ส่งเนื้อบท + คำสั่ง)', 'p-sep') : ''}
  ${row('รวมต่อครั้งที่บอทตอบ', inl ? 'ครั้งปกติ / ครั้งที่มีคอมเมนต์' : 'ทุกครั้ง', 'p-total')}
  <div class="cs-srow"><div class="cs-slb"><span>เจนครั้งล่าสุด</span><small data-tok="p-lastwhen">${csLastInject ? new Date(csLastInject.t).toLocaleTimeString('th-TH', { hour: '2-digit', minute: '2-digit' }) : 'ยังไม่ได้เจนตั้งแต่เปิดหน้า'}</small></div><div class="cs-sctl"><b data-tok="p-last">${csLastInject ? '…' : '–'}</b></div></div>
  <details class="cs-tokbd"><summary>ดูข้อความที่แนบไปจริง</summary><div data-tok="p-text"></div></details></div>`;
}
async function csFillPromptTok(root) {
 const q = k => [...root.querySelectorAll(`[data-tok="${k}"]`)];
 if (!q('p-format').length && !q('p-last').length) return;
 const s = csCfg();
 const n = async t => (t ? await csCountTokens(t) : 0);
 const fmt = s.enabled && s.forceFormat ? await n(csFormatPrompt()) : 0;
 const ask = csCmtAskOn() ? await n(CS_CMT_ASK) : 0;
 const cmt = csCmtInlineOn() ? await n(csCmtInlinePrompt('must')) : 0;
 const set = (k, v) => q(k).forEach(el => { el.textContent = v; });
 set('p-format', `~${fmt.toLocaleString()} โทเคน`);
 set('p-ask', `~${ask.toLocaleString()} โทเคน`);
 set('p-cmt', `~${cmt.toLocaleString()} โทเคน`);
 set('p-total', cmt ? `~${(fmt + ask).toLocaleString()} / ~${(fmt + ask + cmt).toLocaleString()}` : `~${(fmt + ask).toLocaleString()} โทเคน`);
 if (q('p-sep').length) { const id = csLastCharMesId(); set('p-sep', id < 0 ? 'ยังไม่มีบท' : `~${(await csCmtEstimate(id)).inTok.toLocaleString()} โทเคน`); }
 if (csLastInject) {
  let tot = 0; const bits = [];
  for (const x of csLastInject.parts) { const k = await n(x.text); tot += k; bits.push(`${x.label} ${k.toLocaleString()}`); }
  q('p-last').forEach(el => { el.textContent = `~${tot.toLocaleString()} โทเคน`; el.title = bits.join(' · '); });
  q('p-lastwhen').forEach(el => { el.textContent += bits.length ? ` · ${bits.join(' + ')}` : ' · ไม่ได้แนบอะไร'; });
 }
 const parts = csLastInject ? csLastInject.parts : [s.enabled && s.forceFormat ? { label: 'คำสั่งรูปแบบ', text: csFormatPrompt() } : null, csCmtAskOn() ? { label: 'ให้โมเดลเลือกบรรทัดคอมเมนต์', text: CS_CMT_ASK } : null, csCmtInlineOn() ? { label: 'คอมเมนต์มากับคำตอบ (ตัวอย่าง)', text: csCmtInlinePrompt('must') } : null].filter(Boolean);
 q('p-text').forEach(el => { el.innerHTML = parts.length ? parts.map(x => `<div class="cs-bdrow"><span><b>${csEsc(x.label)}</b></span></div><pre class="cs-raw">${csEsc(x.text)}</pre>`).join('') : '<p class="cs-bdnote">ตอนนี้ไม่ได้แนบอะไรไปกับพรอมต์</p>'; });
}
/** เติมตัวเลขโทเคนในหน้าตั้งค่า (นับจริงด้วยตัวนับของ SillyTavern) */
function csFillTokens(root) {
 const s = csCfg();
 csFillPromptTok(root);
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
 [csReader && csReader.el, csNovel && csNovel.el].forEach(h => h && h.classList.toggle('cs-swipech', !!csCfg().swipeCh));
 if (csReader) { csApplyVars(csReader.el); if (full) csRerenderReader(); }
 if (csNovel) { csApplyVars(csNovel.el); csApplyNovelVars(csNovel.el); if (full) csNovelRefresh(false); }
 csRenderPreview();
 clearTimeout(csRefreshTimer);
 csRefreshTimer = setTimeout(() => { csApplyPrompt(); csInlineAll(); csSyncDrawer(); csEdgeRender(); csWandMenu(); }, 120);
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
  if (!n) { csToast('พิมพ์ชื่อก่อนนะ'); inp && inp.focus({ preventScroll: true }); return; }
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
 if (el.dataset.k === 'alwaysOn') { csSetPinned(el.checked); if (el.checked) csPinOpen(); return; }
 if (el.dataset.k && el.type === 'checkbox') { csSet(el.dataset.k, el.checked); if (el.dataset.k === 'keepTopBar') { csApplyUnderBar(csReader && csReader.el); csApplyUnderBar(csNovel && csNovel.el); } if (el.dataset.k === 'cmtAuto' && el.checked) csCfg().cmtOn = true; csAfterChange(true); if (el.dataset.k === 'cmtAuto' || el.dataset.k === 'cmtOn') csRenderSettingsBody(); return; }
 if (el.dataset.k && el.tagName === 'SELECT') { csSet(el.dataset.k, el.value); if (el.dataset.k === 'ttsEngine') { csTtsFail = ''; csTtsFail2 = false; csTtsCache.clear(); csEdgePlug = null; csRenderSettingsBody(); } if (el.dataset.k === 'ambient') { csAmbStop(); csAmbSet(el.value); } csAfterChange(true); return; }
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
  <div class="inline-drawer-toggle inline-drawer-header"><b>Paper-Whisper · แชทนิยาย</b><div class="inline-drawer-icon fa-solid fa-circle-chevron-down down"></div></div>
  <div class="inline-drawer-content" style="display:none">
   <label class="checkbox_label"><input type="checkbox" id="cs-enabled"${s.enabled ? ' checked' : ''}><span>เปิดใช้</span></label>
   <label class="cs-dl">แบบการอ่าน <select id="cs-style" class="text_pole"><option value="chat"${s.style === 'chat' ? ' selected' : ''}>แชทนิยาย (ฟองแชท แตะทีละฟอง)</option><option value="novel"${s.style === 'novel' ? ' selected' : ''}>นิยาย (อ่านแบบหนังสือ)</option></select></label>
   <label class="cs-dl">แสดงที่ <select id="cs-mode" class="text_pole"><option value="reader"${s.mode === 'reader' ? ' selected' : ''}>หน้าอ่านเปิดทับแชท</option><option value="inline"${s.mode === 'inline' ? ' selected' : ''}>ในแชทหลัก</option></select></label>
   <label class="checkbox_label"><input type="checkbox" id="cs-force"${s.forceFormat ? ' checked' : ''}><span>สั่งบอทเขียนแบบนิยายแชท</span></label>
   <label class="checkbox_label"><input type="checkbox" id="cs-edge-on"${s.edgeBtn ? ' checked' : ''}><span>ปุ่มลอยข้างจอ (ปิด = เปิดหน้าอ่านจากเมนูไม้กายสิทธิ์แทน)</span></label>
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
 on('cs-edge-on', 'change', e => { s.edgeBtn = e.target.checked; csSave(); csEdgeRender(); csWandMenu(); });
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
 if (q('cs-edge-on')) q('cs-edge-on').checked = !!s.edgeBtn;
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
  const tagged = csTagSplit(line);
  if (tagged) { tagged.forEach(x => out.push(x.k === 'narr' ? { k: 'p', text: x.text, raw: x.text } : { k: x.k, who: x.who, text: x.text, raw: line, tagged: 1 })); return; }
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
 if (l.k === 'say' && l.tagged) return `<p class="cs-np" data-who="${csEsc(l.who)}">“${csNovelFmt(l.text)}”${tail}</p>`; // ★ 1.41 ป้ายชื่อไม่โชว์ในหน้านิยาย ใช้บอกเสียงอ่าน
 if (l.k === 'say') return `<p class="cs-np"><span class="cs-nwho" data-cs="prof" data-who="${csEsc(l.who)}">${csEsc(l.who)}</span> “${csNovelFmt(l.text)}”${tail}</p>`;
 if (l.k === 'think') return `<p class="cs-np cs-nthink"${l.who ? ` data-who="${csEsc(l.who)}"` : ''}>${csNovelFmt(l.text)}${tail}</p>`;
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
 const uids = (ch.ids || []).filter(i => i !== ch.botId);
 const userPart = s.userInNovel === 'hide' ? '' : ch.user.map((m, k) => `<div class="cs-nuser${s.userInNovel === 'mark' ? ' mark' : ''}" data-umes="${uids[k] ?? ''}">${csNovelLines(m).map(l => csNovelLineHTML(l, true)).join('')}</div>`).join('');
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
  ${ch.bot && ch.botId === csLastCharMesId() && ch.botId === (csCtx().chat || []).length - 1 ? `<div class="cs-nacts">${csSwipeHTML(ch.botId)}<a data-cs="regen">เจนใหม่</a><span>·</span><a data-cs="dellast">ลบ${w}นี้</a></div>` : ''}
 </section>`;
}
// ★ 1.41.4 หน้านิยายวาดทีละช่วง (ไม่เกิน CS_NOVEL_MAX บท) — เดิมอ่านต่อจากบทเก่าจะวาดทั้งเรื่องทีเดียว แชทยาว + มือถือ = ค้าง
let csNovelWinLast = null;
function csNovelWin(n, win) {
 if (win === true) return { start: 0, end: n };
 if (win && typeof win === 'object') { const st = Math.max(0, Math.min(win.start | 0, n)); const en = win.end === undefined || win.end >= n ? n : Math.max(st, win.end | 0); return { start: st, end: en }; }
 return { start: Math.max(0, n - CS_NOVEL_MAX), end: n };
}
function csNovelChaptersHTML(chs, from, to) { return chs.slice(from, to).map((ch, k) => csNovelChapterHTML(ch, from + k + 1)).join(''); }
function csNovelNextBtn(n, end) { return end < n ? `<button class="cs-nnextload" data-cs="nnextload">โหลด${csChWord()}ต่อไป (${n - end} ${csChWord()})</button>` : ''; }
function csNovelBodyHTML(win) {
 const chs = csNovelChapters();
 const w = csNovelWin(chs.length, win);
 csNovelWinLast = { ...w, n: chs.length };
 if (csNovel) csNovel.win = csNovelWinLast;
 return (w.start > 0 ? `<button class="cs-nmore" data-cs="nmore">โหลด${csChWord()}ก่อนหน้า (${w.start} ${csChWord()})</button>` : '')
  + csNovelChaptersHTML(chs, w.start, w.end)
  + csNovelNextBtn(chs.length, w.end)
  + `<div class="cs-nwriting"><span></span><span></span><span></span><em>กำลังเขียน${csChWord()}ต่อไป</em></div>`;
}
/** ลำดับบท (เริ่ม 0) ของข้อความนี้ · ไม่เจอ = -1 */
function csNovelIdxOf(mesId, chNo) {
 const chs = csNovelChapters();
 if (mesId >= 0) { const i = chs.findIndex(ch => ch.botId === mesId || (ch.ids || []).includes(mesId)); if (i >= 0) return i; const j = chs.findIndex(ch => ch.botId !== undefined && ch.botId >= mesId); if (j >= 0) return j; }
 if (chNo > 0 && chNo <= chs.length) return chNo - 1;
 return -1;
}
/** วาดช่วงรอบบทนี้ (ถ้ายังไม่อยู่บนหน้า) */
function csNovelShowIdx(idx) {
 if (!csNovel || idx < 0) return;
 const body = csNovel.el.querySelector('.cs-nbody');
 const w = csNovel.win || { start: 0, end: 0 };
 if (idx >= w.start && idx < w.end) return;
 const st = Math.max(0, idx - 2);
 body.querySelector('.cs-page').innerHTML = csNovelBodyHTML({ start: st, end: st + CS_NOVEL_MAX });
 csMesxSoon(200);
}
/** เลื่อนใกล้ท้าย = โหลดบทต่อไปต่อท้าย (ไม่วาดใหม่ทั้งหน้า ตำแหน่งไม่กระโดด) */
function csNovelLoadNext() {
 if (!csNovel || !csNovel.win) return;
 const chs = csNovelChapters(), w = csNovel.win, n = chs.length;
 if (w.end >= n) return;
 const body = csNovel.el.querySelector('.cs-nbody'), page = body.querySelector('.cs-page');
 const to = Math.min(n, w.end + CS_NOVEL_MAX);
 const btn = page.querySelector('.cs-nnextload');
 const html = csNovelChaptersHTML(chs, w.end, to) + csNovelNextBtn(n, to);
 if (btn) { btn.insertAdjacentHTML('beforebegin', html); btn.remove(); } else page.querySelector('.cs-nwriting')?.insertAdjacentHTML('beforebegin', html);
 csNovel.win = { start: w.start, end: to, n };
 csMesxSoon(200);
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
   <div class="cs-title" data-cs="nav" title="สารบัญ · ค้นหา · ที่คั่น"><b>${csEsc(csCharName() || 'นิยาย')}</b><small class="cs-sub"></small></div>
   <button class="cs-btn" data-cs="toChat" title="สลับเป็นแชทนิยาย"><i class="fa-solid fa-comments"></i></button>
   <button class="cs-btn" data-cs="naa" title="ปรับหน้าอ่าน"><span class="cs-aa">Aa</span></button>
   <div class="cs-aapanel"></div>
  </div>
  <div class="cs-nprog"><i></i></div>
  <div class="cs-nbody" data-cs="ntap"><article class="cs-page">${csNovelBodyHTML(all ? { start: 0, end: CS_NOVEL_MAX } : undefined)}</article></div>
  <div class="cs-nbottom">
   <div class="cs-nnav"><button data-cs="nprev" aria-label="${csChWord()}ก่อนหน้า"><i class="fa-solid fa-arrow-up"></i></button><span class="cs-npct"></span><button data-cs="nnext" aria-label="${csChWord()}ถัดไป"><i class="fa-solid fa-arrow-down"></i></button></div>
   ${s.showInput ? `${csToolsHTML(s)}<div class="cs-inputbar"><textarea class="cs-input" rows="1" placeholder="เขียนเรื่องต่อ… บรรยายหรือพูดก็ได้"></textarea><button class="cs-send" data-cs="send" title="ส่ง"><i class="fa-solid fa-paper-plane"></i></button></div>` : ''}
  </div>`;
 document.body.appendChild(el);
 csNovel = { el, chatKey: csChatKey(), win: csNovelWinLast };
 csApplyUnderBar(el); csPinSync(); csStBtnsRender(el); document.body.classList.add('cs-open');
 el.addEventListener('click', csNovelClick);
 csExtBind(el);
 csMesxSoon(300);
 csMarksBind(el);
 csSwipeChBind(el);
 csAmbKick();
 csStatBind(el);
 if (csCfg().sfx !== 'off') csSfxFilesLoad();
 const body = el.querySelector('.cs-nbody');
 body.addEventListener('scroll', csNovelProgress, { passive: true });
 body.addEventListener('scroll', csNovelPosSave, { passive: true });
 csBindInput(el);
 el.classList.toggle('writing', csGenerating);
 // ★ 1.10 ไม่ได้ระบุข้อความ = อ่านต่อจากที่ค้างไว้
 const saved = (csPos() || {}).novel;
 const want = saved && (mesId === undefined ? (resume || !all) : !all && saved.mes >= mesId) ? saved : null;
 requestAnimationFrame(() => { el.classList.add('show'); if (!(want && csNovelResume(want))) csNovelGoto(mesId !== undefined ? mesId : all ? 0 : undefined); if (csNovel && csNovel.el === el) csNovel.ready = true; });
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
 csNovelPosT = setTimeout(csNovelPosNow, 350);
}
/** บันทึกทันที (ตอนปิด ไม่ต้องรอหยุดเลื่อน) */
function csNovelPosNow() {
 clearTimeout(csNovelPosT);
 if (!csNovel || !csNovel.ready) return;
 const body = csNovel.el.querySelector('.cs-nbody');
 const chs = [...body.querySelectorAll('.cs-chapter')];
 const cur = chs.filter(c => c.offsetTop - body.scrollTop <= 4).pop() || chs[0];
 if (cur) csPosSave('novel', { mes: cur.dataset.mes === '' ? -1 : +cur.dataset.mes, ch: +cur.dataset.ch, off: Math.max(0, Math.round(body.scrollTop - cur.offsetTop)) }, csNovel.chatKey);
}
/** เลื่อนกลับไปตำแหน่งที่อ่านค้าง · คืน true ถ้าเจอ */
function csNovelResume(pos) {
 if (!csNovel || !pos) return false;
 const body = csNovel.el.querySelector('.cs-nbody');
 const find = () => [...body.querySelectorAll('.cs-chapter')].find(c => (pos.mes >= 0 ? c.dataset.mes !== '' && +c.dataset.mes === pos.mes : +c.dataset.ch === pos.ch));
 let c = find();
 if (!c) { csNovelShowIdx(csNovelIdxOf(pos.mes, pos.ch)); c = find(); }
 if (!c) return false;
 const chs = [...body.querySelectorAll('.cs-chapter')];
 if (c === chs[chs.length - 1] && (!csNovel.win || csNovel.win.end >= csNovel.win.n) && pos.off < 40) return false; // ค้างที่ต้นบทล่าสุด = เปิดปกติ
 body.scrollTop = c.offsetTop + (pos.off || 0);
 csNovelProgress();
 if (c !== chs[chs.length - 1]) csToast(`อ่านต่อจาก${csChWord()}ที่ ${c.dataset.ch}`);
 return true;
}
/** เลื่อนไปต้นตอนของข้อความนี้ (ไม่ระบุ = ตอนล่าสุด) */
function csNovelGoto(mesId) {
 if (!csNovel) return;
 const body = csNovel.el.querySelector('.cs-nbody');
 if (mesId !== undefined && mesId !== null) csNovelShowIdx(csNovelIdxOf(mesId));
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
 csAmbAutoSoon();
 if (!csNovel) return;
 const body = csNovel.el.querySelector('.cs-nbody');
 const max = body.scrollHeight - body.clientHeight;
 if (body.clientHeight > 0 && csNovel.win && csNovel.win.end < csNovel.win.n && max - body.scrollTop < 900) csNovelLoadNext();
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
 const w = csNovel.win;
 const keep = w ? { start: w.start, end: w.end >= w.n ? undefined : w.end } : undefined;
 csApplyVars(csNovel.el);
 csApplyNovelVars(csNovel.el);
 body.querySelector('.cs-page').innerHTML = csNovelBodyHTML(keep);
 csMesxSoon(200);
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
 if (csMarkClick(e, b)) return;
 if (csTtsClick(e, b)) return;
 if (b && csNavClick(b.dataset.cs, b)) { e.stopPropagation(); return; }
 if (csNavIsOpen() && !e.target.closest('.cs-nav')) { csNavClose(); return; }
 if (!b || !csNovel) return;
 const a = b.dataset.cs;
 const body = csNovel.el.querySelector('.cs-nbody');
 if (a !== 'ntap') e.stopPropagation();
 if (csCmtClick(a, b)) return;
 if (a === 'ntap' && csNovel.el.classList.contains('cmt-open')) return csCmtClose();
 if (a === 'nclose') return csCloseNovel();
 if (a === 'regen') return csRegen();
 if (a === 'pin') { csNovel.el.querySelector('.cs-aapanel')?.classList.remove('open'); return csSetPinned(!csIsPinned()); }
 if (a === 'stbtn') return csStBtnClick(b);
 if (a === 'sttray') return csNovel.el.querySelector('.cs-sttray')?.classList.toggle('open');
 if (a === 'swl' || a === 'swr') return csSwipe(a === 'swl' ? -1 : 1);
 if (a === 'dellast') return csDeleteLast();
 if (a === 'toChat') return csSwitchStyle('chat');
 if (a === 'nsettings') { csNovel.el.querySelector('.cs-aapanel')?.classList.remove('open'); return csOpenSettings('novel'); }
 if (a === 'naa') { const p = csNovel.el.querySelector('.cs-aapanel'); p.innerHTML = csAaHTML(); p.classList.toggle('open'); return; }
 if (a === 'aa') return csAaAct(b);
 if (a === 'send') return csGenerating ? csStopGeneration() : csSend();
 if (a === 'nmore') { const h = body.scrollHeight, w = csNovel.win || { start: 0, end: undefined }; body.querySelector('.cs-page').innerHTML = csNovelBodyHTML({ start: Math.max(0, w.start - CS_NOVEL_MAX), end: w.end }); body.scrollTop += body.scrollHeight - h; csMesxSoon(200); return; }
 if (a === 'nnextload') { csNovelLoadNext(); return; }
 if (a === 'nprev' || a === 'nnext') { csNovelStep(a === 'nnext' ? 1 : -1); return; }
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
  <button class="cs-aamore" data-cs="tts"><i class="fa-solid fa-volume-high"></i>อ่านออกเสียง</button>
  <button class="cs-aamore" data-cs="sfxtoggle">${csSfxToggleLabel()}</button>
  <button class="cs-aamore" data-cs="full"><i class="fa-solid fa-expand"></i>${csFull ? 'ออกจากเต็มจอ' : 'เต็มจอ'}</button>
  <button class="cs-aamore" data-cs="amb"><i class="fa-solid fa-cloud-rain"></i>เสียงบรรยากาศ · เอฟเฟกต์${csCfg().ambient !== 'off' ? ` · ${csAmbLabel()}` : ''}</button>
  <button class="cs-aamore" data-cs="pin"><i class="fa-solid fa-thumbtack"></i>${csIsPinned() ? 'เลิกเปิดค้าง' : 'เปิดค้างเป็นหน้าแชท'}</button>
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
 csTtsStop();
 csStatFlush();
 csAmbStopSoon();
 if (!instant && csIsPinned()) csAlwaysPaused = true;
 setTimeout(() => { if (!csReader && !csNovel) document.body.classList.remove('cs-open'); }, 0);
 if (csCmtOpen && csCmtOpen.host === csNovel.el) csCmtClose();
 const el = csNovel.el;
 csSelEnd();
 csNovelPosNow();
 csExtReturn();
 csNovel = null;
 if (instant) { if (el !== csKeepEl) el.remove(); return; }
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
let csKeepEl = null; // หน้าเดิมค้างไว้ให้หน้าใหม่จางขึ้นมาทับ (ไม่วาป)
function csSwitchStyle(style) {
 const s = csCfg();
 if (style !== 'novel' && style !== 'chat') return;
 s.style = style;
 csSave();
 csApplyPrompt();
 const oldEl = (csReader && csReader.el) || (csNovel && csNovel.el) || null;
 csKeepEl = oldEl;
 csCloseReader(true);
 csCloseNovel(true);
 csKeepEl = null;
 if (oldEl) { oldEl.classList.add('cs-leaving'); oldEl.style.pointerEvents = 'none'; }
 if (s.mode === 'inline') csInlineAll();
 csOpenLatest();
 if (oldEl) setTimeout(() => oldEl.remove(), 320);
 try { csSyncDrawer(); } catch {}
 csToast(style === 'novel' ? 'แบบนิยาย' : 'แบบแชทนิยาย', 'ok');
}
// ══ ★ 1.10 จำว่าอ่านถึงไหน (แยกแต่ละแชท) ══
function csChatKey() {
 try { const ctx = csCtx(); const id = (typeof ctx.getCurrentChatId === 'function' && ctx.getCurrentChatId()) || ctx.chatId; if (id) return String(id); } catch {}
 return csScope();
}
// ★ 1.39 สำรองที่อ่านไว้ในเครื่องด้วย — ถ้าการตั้งค่าของ SillyTavern ยังไม่ได้บันทึก (ปิดแอปเร็ว / เซฟไม่ผ่าน) ก็ยังจำได้
const CS_POS_LS = 'chatStory.readPos';
function csPosLocal() { try { const o = JSON.parse(localStorage.getItem(CS_POS_LS) || '{}'); return o && typeof o === 'object' && !Array.isArray(o) ? o : {}; } catch { return {}; } }
function csPosLocalPut(k, v) {
 try {
  const o = csPosLocal();
  o[k] = v;
  const keys = Object.keys(o);
  if (keys.length > 60) keys.sort((a, b) => ((o[a] || {}).t || 0) - ((o[b] || {}).t || 0)).slice(0, keys.length - 60).forEach(x => delete o[x]);
  localStorage.setItem(CS_POS_LS, JSON.stringify(o));
 } catch {}
}
function csPos(key) {
 const s = csCfg();
 if (!s.readPos || typeof s.readPos !== 'object') s.readPos = {};
 const k = key || csChatKey();
 const a = s.readPos[k] || null, b = csPosLocal()[k] || null;
 if (b && typeof b === 'object' && (!a || (b.t || 0) > (a.t || 0))) { s.readPos[k] = b; return b; }
 return a;
}
/** key = แชทที่หน้าอ่านนั้นเปิดมา (★ 1.41.2 ตอนสลับแชท SillyTavern เปลี่ยนแชทไปก่อน ห้ามบันทึกลงแชทใหม่) */
function csPosSave(part, val, key) {
 const s = csCfg();
 if (!s.readPos || typeof s.readPos !== 'object') s.readPos = {};
 const k = key || csChatKey();
 s.readPos[k] = { ...(csPos(k) || {}), [part]: val, t: Date.now() };
 csPosLocalPut(k, s.readPos[k]);
 const keys = Object.keys(s.readPos);
 if (keys.length > 60) keys.sort((a, b) => (s.readPos[a].t || 0) - (s.readPos[b].t || 0)).slice(0, keys.length - 60).forEach(x => delete s.readPos[x]);
 csSave();
}
// ══ ★ 1.23 หน้าอ่านอยู่ใต้แถบบนของ SillyTavern + ปักไว้ในแชท ══
function csTopBarBottom() {
 try {
  const el = document.getElementById('top-settings-holder') || document.getElementById('top-bar');
  const r = el && el.getBoundingClientRect();
  return r && r.height && r.bottom > 0 && r.bottom < csViewH() / 3 ? Math.round(r.bottom) : 0;
 } catch { return 0; }
}
function csApplyUnderBar(el) {
 if (!el) return;
 const on = !csFull && !!csCfg().keepTopBar && csTopBarBottom() > 0;
 el.classList.toggle('cs-under-bar', on);
 el.style.setProperty('--cs-topoff', (on ? csTopBarBottom() : 0) + 'px');
}
function csIsPinned() { return !!csCfg().alwaysOn; }
let csAlwaysPaused = false; // ปิดชั่วคราว (กดย้อนกลับ/ปุ่มข้างจอ) จนกว่าจะสลับแชทหรือกดเปิดใหม่
function csSetPinned(on) {
 const s = csCfg();
 s.alwaysOn = !!on;
 csAlwaysPaused = false;
 csSave();
 csPinSync();
 document.body.classList.toggle('cs-always', !!on);
 csToast(on ? 'เปิดค้างเป็นหน้าแชทแล้ว' : 'เลิกเปิดค้างแล้ว', 'ok');
}
/** อัปเดตป้ายปักในหน้าอ่านที่เปิดอยู่ */
function csPinSync() {
 const on = csIsPinned();
 [csReader && csReader.el, csNovel && csNovel.el].filter(Boolean).forEach(el => {
  el.classList.toggle('cs-pinned', on);
  el.querySelectorAll('[data-cs="pin"]').forEach(b => { b.innerHTML = `<i class="fa-solid fa-thumbtack"></i>${on ? 'เลิกเปิดค้าง' : 'เปิดค้างเป็นหน้าแชท'}`; });
 });
}
/** มีแชทเปิดอยู่ไหม (ไม่ใช่หน้าเลือกตัวละคร) */
function csHasChat() { try { const c = csCtx(); return (c.characterId !== undefined && c.characterId !== null && c.characterId !== '') || !!c.groupId; } catch { return false; } }
/** โหมดเปิดค้าง: เข้าแชทไหนก็เปิดหน้าอ่านให้เอง */
function csPinOpen() { if (csCfg().enabled && csIsPinned() && !csAlwaysPaused && csHasChat() && !csReader && !csNovel) csOpenLatest(); }
/** หน้าอื่นของ SillyTavern (เลือกตัวละคร ข้อมูลตัวละคร แผงตั้งค่า) เปิดอยู่ = หลบให้ */
function csStPanelOpen() {
 if (document.querySelector('#right-nav-panel.openDrawer, #left-nav-panel.openDrawer, .drawer-content.openDrawer:not(.pinnedOpen), #character_popup[style*="flex"], #character_popup[style*="block"]')) return true;
 // ★ 1.36 ☰ → ลบข้อความ (เลือกในแชทหลัก) · แก้ข้อความในแชทหลัก = หลบให้จนเสร็จ
 return csVisible(document.getElementById('dialogue_del_mes')) || !!document.getElementById('curEditTextarea');
}
let csStPanelWas = false;
function csSyncStPanels() {
 const open = csStPanelOpen();
 document.body.classList.toggle('cs-st-panel', open);
 if (open === csStPanelWas) return;
 csStPanelWas = open;
 if (open) csExtReturn(); else csStBtnsAll();
}
// ══ ★ 1.23 ปุ่มท้ายช่องพิมพ์ของ SillyTavern (☰ ไม้กายสิทธิ์ ปุ่มส่วนขยายอื่น ๆ Quick Reply) ดึงมาไว้ในหน้าอ่าน ══
let csProxyTargets = [];
function csVisible(el) { try { if (!el || !el.isConnected) return false; const cs = getComputedStyle(el); return cs.display !== 'none' && cs.visibility !== 'hidden' && !el.classList.contains('displayNone'); } catch { return false; } }
function csStButtons() {
 const core = ['#options_button', '#extensionsMenuButton'].map(q => document.querySelector(q)).filter(csVisible);
 const skip = new Set(['send_but', 'mes_stop', 'send_textarea', 'options_button', 'extensionsMenuButton', 'file_form', 'nonQRFormItems', 'leftSendForm', 'rightSendForm']);
 const extras = [];
 const add = el => { if (!el || skip.has(el.id) || extras.includes(el) || core.includes(el) || el.closest('#file_form') || /stscript_/.test(el.className || '') && !csVisible(el)) return; if (csVisible(el)) extras.push(el); };
 document.querySelectorAll('#leftSendForm > *, #rightSendForm > *').forEach(add);
 document.querySelectorAll('#send_form .qr--button, #send_form button, #send_form .menu_button, #form_sheld > :not(#send_form):not(#dialogue_del_mes) [class*="fa-"], #form_sheld > :not(#send_form):not(#dialogue_del_mes) button').forEach(el => {
  if (el.closest('#nonQRFormItems') && !el.closest('#leftSendForm, #rightSendForm')) return;
  add(el.closest('button, .qr--button, .menu_button, .interactable') || el);
 });
 return { core, extras: extras.slice(0, 30) };
}
function csProxyBtn(el, cls) {
 const i = csProxyTargets.push(el) - 1;
 const icon = [...(el.classList || [])].concat([...(el.querySelector('i[class*="fa-"]')?.classList || [])]).filter(c => /^fa-/.test(c) && c !== 'fa-fw');
 const label = (el.getAttribute('title') || el.textContent || '').trim().replace(/\s+/g, ' ').slice(0, 18);
 const ic = icon.length ? `<i class="fa-solid ${icon.filter(c => !/^fa-(solid|regular|brands)$/.test(c)).join(' ')}"></i>` : '';
 return `<button class="${cls}" data-cs="stbtn" data-i="${i}" title="${csEsc(label)}" aria-label="${csEsc(label || 'ปุ่ม')}">${ic}${cls === 'cs-stchip' && (label && (!ic || el.classList.contains('qr--button'))) ? `<span>${csEsc(label)}</span>` : ''}</button>`;
}
function csStBtnsRender(host) {
 if (!host) return;
 const box = host.querySelector('.cs-stbtns');
 if (!box) return;
 csProxyTargets = csProxyTargets.filter(Boolean).length > 300 ? [] : csProxyTargets;
 const { core, extras } = csStButtons();
 box.innerHTML = core.concat(extras).map(el => csProxyBtn(el, 'cs-stbtn')).join('');
 csExtBorrow(host);
}
function csStBtnsAll() { [csReader && csReader.el, csNovel && csNovel.el].forEach(csStBtnsRender); }
/** กดปุ่มของ SillyTavern แทนผู้ใช้: ส่งข้อความที่พิมพ์ในหน้าอ่านไปช่องพิมพ์จริงก่อน แล้วรับกลับถ้าปุ่มนั้นเขียนลงช่องพิมพ์ */
function csStBtnClick(b) {
 const el = csProxyTargets[+b.dataset.i];
 if (!el || !el.isConnected) { csStBtnsAll(); return; }
 const host = b.closest('#cs-reader, #cs-novel');
 const done = csStInputPush(host);
 const lift = csLiftWatch();
 // ☰ ของ SillyTavern ปิดตัวเองเมื่อคลิกไหลขึ้นไปถึงหน้าเว็บ → ส่งคลิกแบบไม่ไหลขึ้น · ปุ่มอื่นคลิกปกติ (ส่วนขยายบางตัวรอคลิกที่ไหลขึ้นมา)
 if (el.id === 'options_button') el.dispatchEvent(new MouseEvent('click', { bubbles: false, cancelable: true }));
 else el.click();
 lift(); done();
}
/** ส่งข้อความในช่องพิมพ์ของหน้าอ่านไปช่องพิมพ์จริงของ ST · คืนฟังก์ชันที่คอยรับข้อความกลับ ถ้าปุ่มนั้นเขียน/ล้างช่องพิมพ์ */
function csStInputPush(host) {
 const ta = host && host.querySelector('.cs-input');
 const st = document.getElementById('send_textarea');
 if (!ta || !st) return () => {};
 if (ta.value !== st.value && (ta.value.trim() || !st.value.trim())) { st.value = ta.value; st.dispatchEvent(new Event('input', { bubbles: true })); }
 const before = st.value;
 return () => {
  clearInterval(csStInputT);
  let n = 0;
  csStInputT = setInterval(() => { n++; if (st.value !== before) { if (ta.isConnected) { ta.value = st.value; ta.dispatchEvent(new Event('input', { bubbles: true })); } clearInterval(csStInputT); } if (n > 120) clearInterval(csStInputT); }, 400);
 };
}
let csStInputT = 0;
// ══ ★ 1.40 ส่วนขยายอื่นใช้คู่ได้: ย้ายแถบของจริงมาไว้ในหน้าอ่าน (Guided Generations · Quick Reply · Context Usage Meter ฯลฯ) ══
function csToolsHTML(s) {
 return `<div class="cs-extstrip"></div><div class="cs-tools"><div class="cs-stbtns"></div>${s.ttsBtn !== false ? csTtsBtnHTML() : ''}<div class="cs-extdock"></div></div>`;
}
let csBorrowed = [];
/** ของที่ส่วนขยายเสียบไว้รอบช่องพิมพ์ของ ST: ใต้/บน #send_form (แถบยาว) และใน #send_form (แถวปุ่ม) */
function csExtCandidates() {
 const out = [];
 const ok = c => c && !/^(FORM|INPUT|SCRIPT|STYLE|TEMPLATE|TEXTAREA)$/.test(c.tagName) && !/^cs-/.test(c.id || '');
 const fs = document.getElementById('form_sheld'), sf = document.getElementById('send_form');
 if (fs) [...fs.children].forEach(c => { if (ok(c) && !['dialogue_del_mes', 'send_form', 'img_form'].includes(c.id)) out.push([c, 'strip']); });
 if (sf) [...sf.children].forEach(c => { if (ok(c) && !['file_form', 'nonQRFormItems'].includes(c.id)) out.push([c, 'dock']); });
 return out;
}
function csExtBorrow(host) {
 if (!host || !host.isConnected || csStPanelOpen()) return;
 const strip = host.querySelector('.cs-extstrip'), dock = host.querySelector('.cs-extdock');
 if (!strip || !dock) return;
 csExtCandidates().forEach(([el, where]) => {
  const ph = document.createComment('cs-borrow');
  const parent = el.parentNode;
  el.before(ph);
  (where === 'strip' ? strip : dock).appendChild(el);
  csBorrowed.push({ el, ph, parent });
 });
 host.classList.toggle('cs-hasext', !!(strip.children.length || dock.children.length));
}
/** คืนทุกอย่างกลับที่เดิมของ ST (ปิดหน้าอ่าน / หน้าอื่นของ ST เปิด) */
function csExtReturn() {
 const list = csBorrowed; csBorrowed = [];
 list.forEach(({ el, ph, parent }) => {
  try {
   if (ph.isConnected) ph.replaceWith(el);
   else if (parent && parent.isConnected) parent.appendChild(el);
   else (document.getElementById('send_form') || document.body).appendChild(el);
  } catch {}
  try { ph.remove(); } catch {}
 });
}
/** เมนู/ป๊อปอัปที่ส่วนขยายเปิดจากการกดในหน้าอ่าน ให้ลอยเหนือหน้าอ่าน (ไม่งั้นไปโผล่ข้างหลัง) */
function csLiftWatch() {
 const vis = el => { try { const c = getComputedStyle(el); return c.display !== 'none' && c.visibility !== 'hidden' && (c.position === 'fixed' || c.position === 'absolute'); } catch { return false; } };
 const before = new Set([...document.body.children].filter(vis));
 return () => [60, 250, 700].forEach(ms => setTimeout(() => {
  if (!csReader && !csNovel) return;
  [...document.body.children].forEach(el => {
   if (before.has(el) || /^cs-/.test(el.id || '') || el.tagName === 'DIALOG' || !vis(el)) return;
   const z = parseInt(getComputedStyle(el).zIndex, 10);
   if (!(z >= 10060)) el.style.setProperty('z-index', '10085', 'important');
  });
 }, ms));
}
/** กดของจริงที่ย้ายมา: ส่งข้อความในช่องพิมพ์ไปก่อน (Guided Generations ใช้ข้อความในช่อง) + ยกเมนูที่เด้ง */
function csExtBind(host) {
 let done = null, lift = null;
 host.addEventListener('pointerdown', e => {
  if (!e.target.closest || !e.target.closest('.cs-extdock, .cs-extstrip')) return;
  done = csStInputPush(host); lift = csLiftWatch();
 }, true);
 host.addEventListener('click', e => {
  if (!e.target.closest || !e.target.closest('.cs-extdock, .cs-extstrip')) return;
  if (!done) { done = csStInputPush(host); lift = csLiftWatch(); }
  e.stopPropagation(); // ไม่ให้ไปนับเป็นแตะอ่านต่อ
  const d = done, l = lift; done = lift = null;
  setTimeout(() => { d(); l(); }, 0);
 });
}
// ══ ★ 1.40 ปุ่มที่ส่วนขยายใส่ไว้ใต้ข้อความ (เช่น Message Reactions ♥ 💬 📖) → แสดงในหน้าอ่านด้วย ══
const CS_MES_NATIVE = /(^|\s)(ch_name|mes_text|mes_reasoning_details|mes_reasoning|mes_media_wrapper|mes_file_wrapper|mes_img_wrapper|mes_video_wrapper|mes_bias|mes_edit_buttons|mes_timer|mesIDDisplay|tokenCounterDisplay|swipe_left|swipe_right|swipeRightBlock|mes_buttons)(\s|$)/;
function csMesxButtons(mesId) {
 const mes = document.querySelector(`#chat .mes[mesid="${mesId}"]`);
 const block = mes && mes.querySelector('.mes_block');
 if (!block) return [];
 const out = [];
 [...block.children].forEach(w => {
  const cls = typeof w.className === 'string' ? w.className : '';
  if (CS_MES_NATIVE.test(cls) || /(^|\s)cs-/.test(cls) || /^cs-/.test(w.id || '') || !csVisible(w)) return;
  const btns = [...w.querySelectorAll('button, .menu_button, [role="button"], .interactable')].filter(csVisible);
  (btns.length ? btns : w.querySelector('[class*="fa-"]') ? [w] : []).forEach(b => out.push(b));
 });
 return out.slice(0, 8);
}
function csMesxHTML(mesId) {
 const btns = csMesxButtons(mesId);
 if (!btns.length) return '';
 return btns.map((b, k) => {
  const icon = [...(b.classList || [])].concat([...(b.querySelector('i[class*="fa-"]')?.classList || [])]).filter(c => /^fa-/.test(c) && !/^fa-(solid|regular|brands|fw)$/.test(c));
  const label = (b.getAttribute('title') || b.textContent || '').trim().replace(/\s+/g, ' ').slice(0, 20);
  const on = /(^|\s|-)(active|selected|checked|on|toggled)(\s|-|$)/.test(typeof b.className === 'string' ? b.className : '');
  let color = '';
  if (on) { try { color = getComputedStyle(b.querySelector('i') || b).color; } catch {} }
  return `<button class="cs-mesxb${on ? ' on' : ''}" data-cs="mesx" data-m="${mesId}" data-k="${k}" title="${csEsc(label)}" aria-label="${csEsc(label || 'ปุ่ม')}"${color ? ` style="color:${csEsc(color)}"` : ''}>${icon.length ? `<i class="fa-solid ${icon.join(' ')}"></i>` : `<span>${csEsc(label.slice(0, 6) || '•')}</span>`}</button>`;
 }).join('');
}
function csMesxRow(mesId) {
 const html = csMesxHTML(mesId);
 if (!html) return null;
 const row = document.createElement('div');
 row.className = 'cs-mesx';
 row.dataset.m = mesId;
 row.innerHTML = html;
 return row;
}
/** ใส่แถวปุ่มท้ายข้อความที่อ่านครบแล้ว (แชทนิยาย) / ท้ายบท (นิยาย) */
function csMesxDecorate() {
 try {
  if (csReader) {
   const p = csReader.player, list = csReader.el.querySelector('.cs-list');
   const want = new Map();
   list.querySelectorAll(':scope > .cs-item[data-i]').forEach(el => {
    const i = +el.dataset.i, it = p.items[i];
    if (!it || it._m === undefined || i >= p.i) return;
    const nx = p.items[i + 1];
    if (nx && nx._m === it._m) return;
    want.set(it._m, el);
   });
   list.querySelectorAll(':scope > .cs-mesx').forEach(r => { const a = want.get(+r.dataset.m); if (!a || r.previousElementSibling !== a) r.remove(); });
   want.forEach((el, m) => {
    const old = el.nextElementSibling && el.nextElementSibling.classList.contains('cs-mesx') ? el.nextElementSibling : null;
    const row = csMesxRow(m);
    if (old) { if (row) { if (old.innerHTML !== row.innerHTML) old.innerHTML = row.innerHTML; } else old.remove(); }
    else if (row) el.after(row);
   });
  }
  if (csNovel) {
   csNovel.el.querySelectorAll('.cs-chapter[data-mes]').forEach(ch => {
    if (ch.dataset.mes === '') return;
    const m = +ch.dataset.mes;
    const old = ch.querySelector(':scope > .cs-mesx');
    const row = csMesxRow(m);
    if (old) { if (row) { if (old.innerHTML !== row.innerHTML) old.innerHTML = row.innerHTML; } else old.remove(); }
    else if (row) ch.appendChild(row);
   });
  }
 } catch {}
}
let csMesxT = 0;
function csMesxSoon(ms) { clearTimeout(csMesxT); csMesxT = setTimeout(csMesxDecorate, ms || 80); }
function csMesxClick(b) {
 const btn = csMesxButtons(+b.dataset.m)[+b.dataset.k];
 if (!btn) { csToast('ปุ่มนี้อยู่ในข้อความที่ SillyTavern ยังไม่ได้โหลด'); csMesxSoon(); return; }
 const lift = csLiftWatch();
 btn.click();
 lift();
 [60, 400, 1200].forEach(ms => setTimeout(csMesxDecorate, ms));
}

// ══ ★ 1.24 สารบัญ + ค้นหาในเรื่อง ══
let csNavState = { tab: 'toc', q: '' };
function csNavHost() { return csNovel ? csNovel.el : csReader ? csReader.el : null; }
function csNavIsOpen() { const h = csNavHost(); return !!(h && h.classList.contains('nav-open')); }
/** รายการบท: ชื่อบท (## / [ฉาก]) หรือประโยคแรก */
function csNavChapters() {
 return csNovelChapters().filter(ch => ch.bot).map((ch, i) => {
  const lines = csNovelLines(ch.bot);
  const t = lines.find(l => l.k === 'title') || lines.find(l => l.k === 'scene');
  const first = lines.find(l => l.k === 'p' || l.k === 'say');
  return { n: i + 1, id: ch.botId, title: t ? t.text : '', preview: first ? (first.k === 'say' ? `${first.who}: ${first.text}` : first.text) : '' };
 });
}
function csNavCurrentId() {
 if (csNovel) {
  const body = csNovel.el.querySelector('.cs-nbody');
  const cur = [...body.querySelectorAll('.cs-chapter')].filter(c => c.offsetTop - body.scrollTop <= 80).pop();
  return cur && cur.dataset.mes !== '' ? +cur.dataset.mes : -1;
 }
 if (csReader) { const p = csReader.player; const it = p.items[Math.min(p.i, p.items.length) - 1]; return it && it._m !== undefined ? it._m : -1; }
 return -1;
}
/** ค้นหาทั้งแชท: คำ หรือชื่อคนพูด */
function csNavSearch(q) {
 q = String(q || '').trim().toLowerCase();
 if (q.length < 1) return [];
 const chat = csCtx().chat || [];
 const out = [];
 let chN = 0;
 chat.forEach((m, id) => {
  if (!m || m.is_system) return;
  if (!m.is_user) chN++;
  if (out.length >= 80) return;
  const items = csParseMessage(m);
  items.forEach(it => {
   if (out.length >= 80 || !it.text) return;
   const hay = (it.who ? it.who + ' ' : '') + it.text;
   const i = hay.toLowerCase().indexOf(q);
   if (i < 0) return;
   out.push({ id, ch: m.is_user ? chN + 1 : chN, who: it.who || '', text: it.text, user: !!m.is_user });
  });
 });
 return out;
}
function csNavMark(text, q) {
 const t = String(text), i = t.toLowerCase().indexOf(q.toLowerCase());
 if (i < 0 || !q) return csEsc(t.slice(0, 120));
 const a = Math.max(0, i - 36), b = Math.min(t.length, i + q.length + 60);
 return (a > 0 ? '…' : '') + csEsc(t.slice(a, i)) + '<mark>' + csEsc(t.slice(i, i + q.length)) + '</mark>' + csEsc(t.slice(i + q.length, b)) + (b < t.length ? '…' : '');
}
function csNavHTML() {
 if (csNavState.tab === 'edit') return csEditHTML();
 if (csNavState.tab === 'prof') return csProfHTML();
 if (csNavState.tab === 'amb') return csAmbHTML();
 const w = csChWord();
 const tabs = `<div class="cs-navtabs"><button data-cs="navtab" data-t="toc" class="${csNavState.tab === 'toc' ? 'on' : ''}">สารบัญ</button><button data-cs="navtab" data-t="find" class="${csNavState.tab === 'find' ? 'on' : ''}">ค้นหา</button><button data-cs="navtab" data-t="marks" class="${csNavState.tab === 'marks' ? 'on' : ''}">ที่คั่น</button><button data-cs="navtab" data-t="stats" class="${csNavState.tab === 'stats' ? 'on' : ''}">สถิติ</button></div>`;
 let body;
 if (csNavState.tab === 'toc') {
  const chs = csNavChapters(), cur = csNavCurrentId();
  body = chs.length ? `<div class="cs-navlist">${chs.map(c => `<button class="cs-navrow${c.id === cur ? ' cur' : ''}" data-cs="navgo" data-mes="${c.id}"><span class="cs-navno">${String(c.n).padStart(2, '0')}</span><span class="cs-navtx"><b>${csEsc(c.title || `${w}ที่ ${c.n}`)}</b><small>${csEsc(c.preview.slice(0, 70))}</small></span></button>`).join('')}</div>` : `<div class="cs-navempty">ยังไม่มี${w}</div>`;
 } else if (csNavState.tab === 'stats') {
  body = csStatsHTML();
 } else if (csNavState.tab === 'marks') {
  const list = csMarks(false).slice().sort((x, y) => (x.m - y.m) || (x.at - y.at));
  body = list.length ? `<div class="cs-navlist">${list.map(x => `<div class="cs-navrow cs-mkrow" role="button" data-cs="navgo" data-mes="${Math.max(0, x.m)}" data-q="${csEsc(x.t.slice(0, 24))}"><span class="cs-navno"><i class="fa-solid ${x.k === 'bm' ? 'fa-bookmark' : 'fa-highlighter'}"></i></span><span class="cs-navtx">${x.who ? `<b>${csEsc(x.who)}</b>` : ''}<small>${csEsc(x.t.slice(0, 160))}</small></span><button class="cs-mkdel" data-cs="navmkdel" data-at="${x.at}" aria-label="ลบ"><i class="fa-solid fa-xmark"></i></button></div>`).join('')}</div>`
   : `<div class="cs-navempty">ยังไม่มีที่คั่นหรือไฮไลต์<br><small>กดค้างที่ข้อความไหนก็ได้ แล้วเลือก ไฮไลต์ / คั่นไว้</small></div>`;
 } else {
  const res = csNavSearch(csNavState.q);
  body = `<div class="cs-navfind"><i class="fa-solid fa-magnifying-glass"></i><input class="cs-navq" type="search" placeholder="ค้นหาคำ หรือชื่อตัวละคร" value="${csEsc(csNavState.q)}" enterkeyhint="search"></div>
   <div class="cs-navlist">${csNavState.q ? (res.length ? `<div class="cs-navcount">เจอ ${res.length}${res.length >= 80 ? '+' : ''} ที่</div>` + res.map(r => `<button class="cs-navrow" data-cs="navgo" data-mes="${r.id}" data-q="${csEsc(csNavState.q)}"><span class="cs-navno">${String(r.ch).padStart(2, '0')}</span><span class="cs-navtx">${r.who ? `<b>${csEsc(r.who)}</b>` : ''}<small>${csNavMark(r.text, csNavState.q)}</small></span></button>`).join('') : `<div class="cs-navempty">ไม่เจอ "${csEsc(csNavState.q)}"</div>`) : ''}</div>`;
 }
 return `<div class="cs-cmt-grab"></div><div class="cs-navhead">${tabs}<button class="cs-navx" data-cs="navclose" aria-label="ปิด"><i class="fa-solid fa-xmark"></i></button></div>${body}`;
}
function csNavOpen(tab) {
 const host = csNavHost();
 if (!host) return;
 if (tab) csNavState.tab = tab;
 let sh = host.querySelector(':scope > .cs-nav');
 if (!sh) {
  sh = document.createElement('div'); sh.className = 'cs-nav'; host.appendChild(sh);
  const bd = document.createElement('div'); bd.className = 'cs-nav-bd'; bd.dataset.cs = 'navclose'; host.appendChild(bd);
  sh.addEventListener('input', e => { if (e.target.classList.contains('cs-navq')) { csNavState.q = e.target.value; clearTimeout(csNavT); csNavT = setTimeout(() => csNavRefresh(true), 220); } });
  sh.addEventListener('change', e => csProfChange(e.target));
  sh.addEventListener('input', e => { if (e.target.dataset && e.target.dataset.amb === 'sfxvol') { csCfg().sfxVol = +e.target.value; clearTimeout(csAmbSaveT); csAmbSaveT = setTimeout(() => { csSave(); csSfxPlay('drip'); }, 250); } });
  sh.addEventListener('input', e => { if (e.target.dataset && e.target.dataset.amb === 'vol') { csCfg().ambVol = +e.target.value; csAmbVolume(); clearTimeout(csAmbSaveT); csAmbSaveT = setTimeout(csSave, 400); } });
 }
 csNavRefresh();
 void sh.offsetHeight; // ให้ทรานสิชันเลื่อนขึ้นทำงาน
 host.classList.add('nav-open');
 // ★ 1.36 เลื่อนเฉพาะรายการในแผ่น (scrollIntoView เคยเลื่อนทั้งหน้าอ่านจนแถบบนหลุดจอ กดกลับไม่ได้)
 if (csNavState.tab === 'toc') setTimeout(() => { const r = sh.querySelector('.cs-navrow.cur'), l = r && r.closest('.cs-navlist'); if (r && l) l.scrollTop += r.getBoundingClientRect().top - l.getBoundingClientRect().top - l.clientHeight / 2 + r.offsetHeight / 2; csHostUnscroll(host); }, 60);
}
let csNavT = 0;
function csNavRefresh(keepFocus, focusFind) {
 const host = csNavHost(); const sh = host && host.querySelector(':scope > .cs-nav');
 if (!sh) return;
 const pos = keepFocus ? sh.querySelector('.cs-navq')?.selectionStart : null;
 // พิมพ์ค้นหาอยู่: เปลี่ยนแค่รายการผล ไม่แตะช่องพิมพ์ (กันแป้นพิมพ์ไทยสะดุด)
 if (keepFocus && sh.querySelector('.cs-navq') && csNavState.tab === 'find') {
  const tmp = document.createElement('div'); tmp.innerHTML = csNavHTML();
  sh.querySelector('.cs-navlist').replaceWith(tmp.querySelector('.cs-navlist'));
  return;
 }
 sh.innerHTML = csNavHTML();
 const q = sh.querySelector('.cs-navq');
 if (q && (keepFocus || focusFind)) { q.focus({ preventScroll: true }); if (pos !== null && pos !== undefined) q.setSelectionRange(pos, pos); }
}
function csNavClose() { const h = csNavHost(); if (h) { h.classList.remove('nav-open'); csHostUnscroll(h); } }
/** หน้าอ่านต้องไม่ถูกเลื่อนทั้งกล่อง (มือถือเลื่อนตอนแป้นพิมพ์ขึ้น/โฟกัสช่องพิมพ์) · เลื่อนกลับที่เดิม */
function csHostUnscroll(h) { if (!h) return; if (h.scrollTop) h.scrollTop = 0; if (h.scrollLeft) h.scrollLeft = 0; try { if (window.scrollY || window.scrollX) window.scrollTo(0, 0); } catch {} }
function csNavClick(a, b) {
 if (a === 'nav') { csNavOpen(['prof', 'amb', 'edit'].includes(csNavState.tab) ? 'toc' : ''); return true; }
 if (a === 'editsave') { csEditSave(); return true; }
 if (a === 'amb') { if (!csSfxFiles) csSfxFilesLoad().then(() => { if (csNavIsOpen() && csNavState.tab === 'amb') csNavRefresh(); }); csReader && csReader.el.querySelector('.cs-menu')?.classList.remove('open'); csNovel && csNovel.el.querySelector('.cs-aapanel')?.classList.remove('open'); csNavOpen('amb'); return true; }
 if (a === 'ambset') { csAmbSet(b.dataset.v); csNavRefresh(); return true; }
 if (a === 'prof') { Object.assign(csNavState, { who: b.dataset.who || '', ck: b.dataset.ck || '', av: b.dataset.av || '' }); csNavOpen('prof'); return true; }
 if (a === 'proffind') { csNavState.q = csNavState.who; csNavState.tab = 'find'; csNavRefresh(); return true; }
 if (a === 'profmore') { csNavClose(); csOpenSettings('chars'); return true; }
 if (a === 'navclose') { csNavClose(); return true; }
 if (a === 'navtab') { csNavState.tab = b.dataset.t; csNavRefresh(false, b.dataset.t === 'find'); return true; }
 if (a === 'navmkdel') { const l = csMarks(true), i = l.findIndex(x => String(x.at) === b.dataset.at); if (i >= 0) { l.splice(i, 1); csSave(); } csNavRefresh(); csMarksApplyAll(); return true; }
 if (a === 'navgo') { csNavClose(); csJumpTo(+b.dataset.mes, b.dataset.q || ''); return true; }
 return false;
}
/** กระโดดไปข้อความ (บท) นี้ในหน้าที่เปิดอยู่ · มีคำค้นก็ไฮไลต์จุดที่เจอ */
function csJumpTo(mesId, q) {
 const flash = (root, scroller) => {
  let el = null;
  if (q) el = [...root.querySelectorAll('.cs-np, .cs-bubble, .cs-narr, .cs-name, .cs-nwho')].find(x => x.textContent.toLowerCase().includes(q.toLowerCase()));
  el = el || root;
  const sc = scroller;
  if (sc) sc.scrollTop = Math.max(0, el.getBoundingClientRect().top - sc.getBoundingClientRect().top + sc.scrollTop - 90);
  el.classList.add('cs-flash'); setTimeout(() => el.classList.remove('cs-flash'), 1600);
 };
 if (csNovel) {
  const body = csNovel.el.querySelector('.cs-nbody');
  const chapId = (() => { const chat = csCtx().chat || []; for (let i = mesId; i < chat.length; i++) if (chat[i] && !chat[i].is_user && !chat[i].is_system) return i; return mesId; })();
  const find = () => [...body.querySelectorAll('.cs-chapter')].find(c => c.dataset.mes !== '' && +c.dataset.mes === chapId);
  let c = find();
  if (!c) { csNovelShowIdx(csNovelIdxOf(chapId)); c = find(); }
  if (c) flash(c, body);
  csNovelProgress();
  return;
 }
 if (!csReader || csReader.key !== 'all') { csCloseReader(true); csOpenReadAll(true); }
 if (!csReader) return;
 const p = csReader.player;
 const idx = p.items.findIndex(it => it._m !== undefined && it._m >= mesId);
 if (idx < 0) return;
 const lastIdx = (() => { let j = idx; while (j + 1 < p.items.length && p.items[j + 1]._m === p.items[idx]._m) j++; return j; })();
 if (lastIdx >= p.i) p.skipTo(lastIdx + 1);
 const el = csReader.el.querySelector(`.cs-list > .cs-item[data-i="${idx}"]`);
 const items = [...csReader.el.querySelectorAll('.cs-list > .cs-item[data-i]')].filter(x => { const i = +x.dataset.i; return i >= idx && i <= lastIdx; });
 const hit = q ? items.find(x => x.textContent.toLowerCase().includes(q.toLowerCase())) : null;
 if (el) flash(hit || el, csReader.el.querySelector('.cs-body'));
 csReaderSavePos();
}
// ══ ★ 1.25 ไฮไลต์ · ที่คั่น · การ์ดคำคม — กดค้าง (หรือคลิกขวา) ที่ข้อความ ══
const CS_MARK_SEL = '.cs-bubble:not(.cs-typing), .cs-narr, .cs-scene, .cs-np, .cs-nscene';
let csMarkSuppress = 0, csMarkCur = null;
function csMarkNorm(t) { return String(t || '').replace(/[“”"]/g, '').replace(/\s+/g, ' ').trim(); }
/** ข้อความของบรรทัด (ไม่รวมชื่อคนพูดและปุ่ม) · ใช้เทียบกันได้ทั้งแชทนิยายและนิยาย */
function csMarkText(el) {
 const c = el.cloneNode(true);
 c.querySelectorAll('.cs-nwho, .cs-cmt, button').forEach(x => x.remove());
 return csMarkNorm(c.textContent);
}
function csMarkItem(el) {
 const item = el.closest('.cs-item[data-i]');
 return item && csReader && csReader.el.contains(item) ? csReader.player.items[+item.dataset.i] : null;
}
function csMarkWho(el) {
 const w = el.querySelector(':scope > .cs-nwho');
 if (w) return w.textContent.trim();
 const it = csMarkItem(el);
 return it && it.who && (it.k === 'say' || it.k === 'think') ? it.who : '';
}
function csMarkMes(el) {
 const it = csMarkItem(el);
 if (it) return it._m !== undefined ? it._m : -1;
 const u = el.closest('.cs-nuser[data-umes]');
 if (u && u.dataset.umes !== '') return +u.dataset.umes;
 const ch = el.closest('.cs-chapter');
 if (ch && ch.dataset.mes !== '') return +ch.dataset.mes;
 return -1;
}
function csMarks(create) {
 const s = csCfg();
 if (!s.marks || typeof s.marks !== 'object') s.marks = {};
 const k = csChatKey();
 if (!Array.isArray(s.marks[k])) { if (!create) return []; s.marks[k] = []; }
 return s.marks[k];
}
function csMarkFind(t, kind) { return csMarks(false).find(x => x.t === t && x.k === kind); }
function csMarkToggle(kind, t, m, who) {
 const list = csMarks(true);
 const i = list.findIndex(x => x.t === t && x.k === kind);
 if (i >= 0) list.splice(i, 1);
 else { list.push({ k: kind, t: t.slice(0, 600), m, who: who || '', at: Date.now() + list.length }); if (list.length > 300) list.shift(); }
 csSave(); csMarksApplyAll();
 return i < 0;
}
function csMarksApply(root) {
 if (!root) return;
 const list = csMarks(false);
 if (!list.length && !root.querySelector('.cs-hl, .cs-bm')) return;
 const hl = list.filter(x => x.k !== 'bm').map(x => x.t), bm = list.filter(x => x.k === 'bm').map(x => x.t);
 // ตรงกันพอดี หรือบรรทัดหนึ่งครอบอีกบรรทัด (นิยายรวมบรรยาย+คำพูดไว้ย่อหน้าเดียว แชทนิยายแยกเป็นฟอง)
 const hit = (arr, t) => arr.some(m => m === t || (m.length >= 8 && t.includes(m)) || (t.length >= 8 && m.includes(t)));
 root.querySelectorAll(CS_MARK_SEL).forEach(el => {
  const t = csMarkText(el);
  el.classList.toggle('cs-hl', !!t && hit(hl, t));
  el.classList.toggle('cs-bm', !!t && hit(bm, t));
 });
}
function csMarksApplyAll() { csMarksApply(csReader && csReader.el); csMarksApply(csNovel && csNovel.el); }
function csMarksBind(host) {
 host.addEventListener('scroll', () => csHostUnscroll(host)); // ตัวหน้าอ่านไม่เลื่อน เลื่อนได้แค่เนื้อหาข้างใน
 host.addEventListener('focusout', () => setTimeout(() => csHostUnscroll(host), 80)); // แป้นพิมพ์มือถือหุบ = ดึงจอกลับที่เดิม
 let t = 0, sx = 0, sy = 0, target = null;
 const cancel = () => { clearTimeout(t); t = 0; target = null; };
 host.addEventListener('pointerdown', e => {
  if (e.button > 0) return;
  const el = e.target.closest && e.target.closest(CS_MARK_SEL);
  if (!el || e.target.closest('button, a, .cs-code, .cs-html, .cs-nav, .cs-markpop, .cs-qcard, .cs-cmt-sheet')) return;
  cancel(); target = el; sx = e.clientX || 0; sy = e.clientY || 0;
  t = setTimeout(() => { const el2 = target; cancel(); if (el2 && el2.isConnected) { csMarkSuppress = Date.now(); csMarkMenu(el2); } }, 480);
 }, { passive: true });
 host.addEventListener('pointermove', e => { if (t && Math.hypot((e.clientX || 0) - sx, (e.clientY || 0) - sy) > 10) cancel(); }, { passive: true });
 ['pointerup', 'pointercancel'].forEach(n => host.addEventListener(n, () => { if (t) cancel(); }, { passive: true }));
 host.querySelectorAll('.cs-body, .cs-nbody').forEach(b => b.addEventListener('scroll', () => { if (t) cancel(); csMarkMenuClose(); }, { passive: true }));
 host.addEventListener('contextmenu', e => {
  const el = e.target.closest && e.target.closest(CS_MARK_SEL);
  if (!el || e.target.closest('a, .cs-code, .cs-html, .cs-nav')) return;
  e.preventDefault();
  if (host.querySelector('.cs-markpop')) return; // มือถือ: กดค้างเปิดไปแล้ว
  csMarkMenu(el);
 });
 let q = 0;
 const mo = new MutationObserver(() => { if (q) return; q = setTimeout(() => { q = 0; csMarksApply(host); csSfxPass(host); }, 30); });
 mo.observe(host, { childList: true, subtree: true });
 csMarksApply(host);
 csSfxBind(host);
 csSfxPass(host, true);
 const s = csCfg();
 if (!s.tipMarks) { s.tipMarks = 1; csSave(); setTimeout(() => csToast('ใหม่: กดค้างที่ข้อความเพื่อไฮไลต์หรือคั่นหน้า'), 1400); }
}
function csMarkMenu(el) {
 const host = el.closest('#cs-reader, #cs-novel');
 if (!host) return;
 csMarkMenuClose();
 const t = csMarkText(el);
 if (!t) return;
 csMarkCur = { el, t, m: csMarkMes(el), who: csMarkWho(el) };
 const hl = !!csMarkFind(t, 'hl'), bm = !!csMarkFind(t, 'bm');
 const pop = document.createElement('div');
 pop.className = 'cs-markpop';
 pop.innerHTML = `<button data-cs="mkhl" class="${hl ? 'on' : ''}"><i class="fa-solid fa-highlighter"></i><span>${hl ? 'เอาออก' : 'ไฮไลต์'}</span></button>`
  + `<button data-cs="mkbm" class="${bm ? 'on' : ''}"><i class="fa-${bm ? 'solid' : 'regular'} fa-bookmark"></i><span>${bm ? 'เอาออก' : 'คั่นไว้'}</span></button>`
  + `<button data-cs="mkcard"><i class="fa-regular fa-image"></i><span>การ์ด</span></button>`
  + `<button data-cs="mkcopy"><i class="fa-regular fa-copy"></i><span>คัดลอก</span></button>`
  + `<button data-cs="mkread" title="อ่านออกเสียงจากตรงนี้"><i class="fa-solid fa-volume-high"></i><span>อ่าน</span></button>`
  + (csMarkCur.m >= 0 ? `<button data-cs="mkedit"><i class="fa-solid fa-pen"></i><span>แก้ไข</span></button><button data-cs="mkdel" title="ลบ (เลือกได้หลายข้อความ)"><i class="fa-regular fa-trash-can"></i><span>ลบ</span></button>` : '');
 host.appendChild(pop);
 const r = el.getBoundingClientRect(), hr = host.getBoundingClientRect();
 const w = pop.offsetWidth || 236, h = pop.offsetHeight || 54;
 const barB = (host.querySelector('.cs-top, .cs-ntop')?.getBoundingClientRect().bottom || hr.top + 56) - hr.top;
 let top = r.top - hr.top - h - 8;
 if (top < barB + 4) top = Math.min(r.bottom - hr.top + 8, hr.height - h - 90);
 pop.style.top = Math.max(barB + 4, top) + 'px';
 pop.style.left = Math.max(8, Math.min(r.left - hr.left + r.width / 2 - w / 2, hr.width - w - 8)) + 'px';
 el.classList.add('cs-marking');
 setTimeout(() => { try { window.getSelection && window.getSelection().removeAllRanges(); } catch {} }, 30);
 try { navigator.vibrate && navigator.vibrate(8); } catch {}
}
function csMarkMenuClose() {
 document.querySelectorAll('.cs-markpop').forEach(p => p.remove());
 document.querySelectorAll('.cs-marking').forEach(x => x.classList.remove('cs-marking'));
 csMarkCur = null;
}
/** เรียกก่อนตัวจัดการคลิกของหน้าอ่าน · true = จัดการแล้ว ไม่ต้องทำต่อ */
function csMarkClick(e, b) {
 if (csSelClick(e, b)) return true;
 const a = b && b.dataset.cs;
 if (csExtraClick(e, b, a)) return true;
 if (a && /^mk/.test(a)) { e.stopPropagation(); csMarkAct(a); return true; }
 if (a && /^q(save|share|close)$/.test(a)) { e.stopPropagation(); csQuoteAct(a, b); return true; }
 if (e.target.closest && e.target.closest('.cs-qcard')) { if (!e.target.closest('.cs-qbox')) csQuoteClose(); e.stopPropagation(); return true; }
 if (Date.now() - csMarkSuppress < 650) { csMarkSuppress = 0; e.stopPropagation(); return true; } // คลิกเดียวที่ตามมาหลังยกนิ้ว
 if (document.querySelector('.cs-markpop')) { e.stopPropagation(); csMarkMenuClose(); return true; }
 return false;
}
function csMarkAct(a) {
 const c = csMarkCur;
 if (!c) return csMarkMenuClose();
 csMarkMenuClose();
 if (a === 'mkhl') csToast(csMarkToggle('hl', c.t, c.m, c.who) ? 'ไฮไลต์แล้ว' : 'เอาไฮไลต์ออกแล้ว', 'ok');
 else if (a === 'mkbm') csToast(csMarkToggle('bm', c.t, c.m, c.who) ? 'คั่นไว้แล้ว · ดูได้ที่สารบัญ' : 'เอาที่คั่นออกแล้ว', 'ok');
 else if (a === 'mkcopy') {
  const txt = (c.who ? c.who + ': ' : '') + c.t;
  try { navigator.clipboard.writeText(txt).then(() => csToast('คัดลอกแล้ว', 'ok'), () => csToast('คัดลอกไม่ได้')); } catch { csToast('คัดลอกไม่ได้'); }
 } else if (a === 'mkcard') csQuoteCard(c.t, c.who, c.m);
 else if (a === 'mkedit') csEditOpen(c.m);
 else if (a === 'mkdel') csSelStart(c.m);
 else if (a === 'mkread') csTtsStart(c.el);
}
// ══ ★ 1.41 เลือกลบหลายข้อความ: กดค้าง → ลบ… → แตะเลือกข้อความอื่นเพิ่ม → ลบทีเดียว ══
let csSel = null, csDelBusy = false;
function csSelHost() { return (csReader && csReader.el) || (csNovel && csNovel.el) || null; }
function csSelStart(mesId) {
 const host = csSelHost();
 if (!host || !(mesId >= 0)) return;
 if (csGenerating || csStBusy()) { csToast('รอให้ตอบเสร็จก่อน'); return; }
 csMarkMenuClose();
 csSel = { host, ids: new Set([mesId]) };
 host.classList.add('cs-selmode');
 let bar = host.querySelector('.cs-selbar');
 if (!bar) { bar = document.createElement('div'); bar.className = 'cs-selbar'; host.appendChild(bar); }
 csSelPaint();
 try { navigator.vibrate && navigator.vibrate(8); } catch {}
}
function csSelEnd() {
 if (!csSel) return;
 const h = csSel.host;
 csSel = null;
 h.classList.remove('cs-selmode');
 h.querySelectorAll('.cs-selbar').forEach(x => x.remove());
 h.querySelectorAll('.cs-picked, .cs-selbot').forEach(x => x.classList.remove('cs-picked', 'cs-selbot'));
}
/** ข้อความของจุดที่แตะ (แชทนิยาย: ฟอง · นิยาย: ย่อหน้าของเรา หรือเนื้อบท) */
function csSelMesOf(t) {
 if (!t || !t.closest) return -1;
 const item = t.closest('.cs-item[data-i]');
 if (item && csReader && csReader.el.contains(item)) { const it = csReader.player.items[+item.dataset.i]; return it && it._m !== undefined ? it._m : -1; }
 const u = t.closest('.cs-nuser[data-umes]');
 if (u && u.dataset.umes !== '') return +u.dataset.umes;
 const ch = t.closest('.cs-chapter[data-mes]');
 if (ch && ch.dataset.mes !== '' && !t.closest('.cs-chead, .cs-nacts, .cs-mesx')) return +ch.dataset.mes;
 return -1;
}
function csSelPaint() {
 if (!csSel) return;
 const { host, ids } = csSel;
 if (csReader && host === csReader.el) host.querySelectorAll('.cs-list > .cs-item[data-i]').forEach(el => { const it = csReader.player.items[+el.dataset.i]; el.classList.toggle('cs-picked', !!it && ids.has(it._m)); });
 host.querySelectorAll('.cs-nuser[data-umes]').forEach(el => el.classList.toggle('cs-picked', el.dataset.umes !== '' && ids.has(+el.dataset.umes)));
 host.querySelectorAll('.cs-chapter[data-mes]').forEach(el => el.classList.toggle('cs-selbot', el.dataset.mes !== '' && ids.has(+el.dataset.mes)));
 const bar = host.querySelector('.cs-selbar');
 if (bar) bar.innerHTML = `<button data-cs="selx">ยกเลิก</button><span>${ids.size ? `เลือก ${ids.size} ข้อความ` : 'แตะข้อความที่จะลบ'}</span><button data-cs="seldel" class="del"${ids.size ? '' : ' disabled'}><i class="fa-regular fa-trash-can"></i>ลบ</button>`;
}
/** ระหว่างเลือก: แตะ = เลือก/ไม่เลือก · ไม่อ่านต่อ ไม่เปิดเมนู */
function csSelClick(e, b) {
 if (!csSel) return false;
 if (!csSel.host.contains(e.target)) return false;
 e.stopPropagation();
 const a = b && b.dataset.cs;
 if (a === 'selx') { csSelEnd(); return true; }
 if (a === 'seldel') { const ids = [...csSel.ids]; csDeleteMany(ids); return true; }
 if (e.target.closest('.cs-selbar')) return true;
 const m = csSelMesOf(e.target);
 if (m >= 0) { if (csSel.ids.has(m)) csSel.ids.delete(m); else csSel.ids.add(m); csSelPaint(); }
 return true;
}
/** เลขข้อความหลังลบ (ข้อความที่ถูกลบ → ข้อความก่อนหน้าที่ยังอยู่) */
function csShiftIdx(x, del) {
 if (!(x >= 0)) return x;
 let y = x;
 while (y >= 0 && del.has(y)) y--;
 if (y < 0) return -1;
 let n = 0; del.forEach(d => { if (d < y) n++; });
 return y - n;
}
function csPosShift(del) {
 const pos = csPos();
 if (pos) {
  const c = pos.chat;
  if (c && c.m !== undefined) { const nm = csShiftIdx(c.m, del); const gone = del.has(c.m); c.m = nm; if (gone) c.k = 1e9; if (c.am !== undefined) { const ga = del.has(c.am); c.am = csShiftIdx(c.am, del); if (ga) c.ak = 1e9; } if (nm < 0) delete pos.chat; }
  if (pos.novel && pos.novel.mes >= 0) { const g = del.has(pos.novel.mes); pos.novel.mes = csShiftIdx(pos.novel.mes, del); if (g) pos.novel.off = 0; if (pos.novel.mes < 0) delete pos.novel; }
  csPosSave('_', 0);
 }
 csMarks(false).forEach(x => { if (x.m >= 0) x.m = del.has(x.m) ? -1 : csShiftIdx(x.m, del); });
}
async function csDeleteMany(idList) {
 if (csGenerating || csStBusy()) { csToast('รอให้ตอบเสร็จก่อน'); return false; }
 const ctx = csCtx(), chat = ctx.chat || [];
 const list = [...new Set(idList)].filter(i => chat[i]).sort((a, b) => b - a);
 if (!list.length) { csSelEnd(); return false; }
 const first = chat[list[list.length - 1]];
 if (!confirm(list.length === 1 ? `ลบข้อความนี้?\n\n“${String(first.mes || '').replace(/\s+/g, ' ').slice(0, 80)}…”` : `ลบ ${list.length} ข้อความที่เลือก?`)) return false;
 csSelEnd();
 const wasReader = !!csReader, wasNovel = !!csNovel;
 const del = new Set(list);
 csTtsStop();
 csPosShift(del);
 csDelBusy = true;
 let reload = false;
 try {
  for (const id of list) {
   const shown = document.querySelector(`#chat .mes[mesid="${id}"]`);
   if (shown && typeof ctx.deleteMessage === 'function') await ctx.deleteMessage(id, undefined, false, false);
   else { chat.splice(id, 1); if (shown) shown.remove(); reload = true; }
  }
  await ctx.saveChat?.();
 } catch (e) { console.warn('[chat-story] delete', e); reload = true; }
 csDelBusy = false;
 if (reload && typeof ctx.reloadCurrentChat === 'function') {
  try { await ctx.reloadCurrentChat(); } catch {}
  if (wasReader && !csReader && !csNovel) csOpenLatest();
  if (wasNovel && !csNovel && !csReader) csOpenLatest();
 } else {
  if (wasReader && csReader) { csCloseReader(true); csOpenLatest(); }
  if (wasNovel && csNovel) csNovelRefresh(false);
 }
 csToast(`ลบแล้ว ${list.length} ข้อความ`, 'ok');
 return true;
}
/** ตัดบรรทัดบนแคนวาส: ภาษาไทยไม่มีเว้นวรรค ตัดตามคำ (Intl.Segmenter) หรือตามตัวอักษรไม่แยกสระ/วรรณยุกต์ */
function csWrapCanvas(g, text, maxW) {
 let toks;
 try { toks = [...new Intl.Segmenter('th', { granularity: 'word' }).segment(text)].map(x => x.segment); }
 catch { toks = String(text).match(/[฀-ะาำ฿-ๆ๏-๿][ัิ-ฺ็-๎]*|[^\s฀-๿]+|\s+/g) || [text]; }
 const lines = [];
 let line = '';
 const push = () => { if (line.trim()) lines.push(line.trim()); line = ''; };
 toks.forEach(tok => {
  if (g.measureText(line + tok).width <= maxW) { line += tok; return; }
  if (line.trim()) { push(); tok = tok.replace(/^\s+/, ''); }
  if (g.measureText(tok).width <= maxW) { line = tok; return; }
  (tok.match(/.[ัิ-ฺ็-๎]*/gu) || [tok]).forEach(ch => { if (g.measureText(line + ch).width > maxW && line) push(); line += ch; });
 });
 push();
 return lines;
}
function csChapterNo(mesId) {
 const chat = csCtx().chat || [];
 let n = 0;
 for (let i = 0; i <= Math.min(mesId, chat.length - 1); i++) if (chat[i] && !chat[i].is_user && !chat[i].is_system) n++;
 return mesId >= 0 ? n : 0;
}
async function csQuoteCard(text, who, mesId) {
 const W = 1080, H = 1350, pad = 118;
 const c = document.createElement('canvas');
 c.width = W; c.height = H;
 let g = null;
 try { g = c.getContext('2d'); } catch {}
 if (!g) { csToast('ทำการ์ดไม่ได้ในเบราว์เซอร์นี้'); return null; }
 const col = csColors();
 const ff = csFontFamily() === 'inherit' ? '-apple-system, system-ui, sans-serif' : csFontFamily();
 try { if (document.fonts && document.fonts.load) await Promise.race([document.fonts.load(`48px ${ff}`, text.slice(0, 24)), new Promise(r => setTimeout(r, 1200))]); } catch {}
 g.fillStyle = col.bg; g.fillRect(0, 0, W, H);
 g.globalAlpha = .28; g.strokeStyle = col.ink2; g.lineWidth = 2; g.strokeRect(54, 54, W - 108, H - 108); g.globalAlpha = 1;
 const room = H - 520;
 const len = [...text].length;
 let fs = len < 40 ? 66 : len < 90 ? 56 : len < 180 ? 46 : len < 320 ? 38 : 32, lines;
 for (;;) { g.font = `${fs}px ${ff}`; lines = csWrapCanvas(g, text, W - pad * 2); if (lines.length * fs * 1.6 <= room || fs <= 26) break; fs -= 2; }
 const lh = fs * 1.6;
 const maxL = Math.max(1, Math.floor(room / lh));
 if (lines.length > maxL) { lines = lines.slice(0, maxL); lines[maxL - 1] = lines[maxL - 1].replace(/.{0,2}$/u, '') + '…'; }
 let y = (H - lines.length * lh) / 2 - 30;
 g.textAlign = 'left';
 g.globalAlpha = .45; g.fillStyle = col.ink2; g.font = '170px Georgia, "Times New Roman", serif'; g.textBaseline = 'alphabetic'; g.fillText('“', pad - 14, y + 40); g.globalAlpha = 1;
 g.fillStyle = col.ink; g.font = `${fs}px ${ff}`; g.textBaseline = 'top';
 lines.forEach((l, i) => g.fillText(l, pad, y + i * lh));
 y += lines.length * lh + 44;
 if (who) { g.fillStyle = col.ink2; g.font = `600 ${Math.round(fs * .55 + 12)}px ${ff}`; g.fillText('— ' + who, pad, y); }
 const n = csChapterNo(mesId);
 g.textBaseline = 'alphabetic'; g.font = `28px ${ff}`; g.fillStyle = col.ink2;
 g.fillText([csCharName() || '', n ? `${csChWord()}ที่ ${n}` : ''].filter(Boolean).join(' · '), pad, H - 104);
 g.textAlign = 'right'; g.globalAlpha = .55; g.fillText('Paper-Whisper', W - pad, H - 104); g.globalAlpha = 1;
 let url = '';
 try { url = c.toDataURL('image/png'); } catch {}
 if (!url || url.length < 32) { csToast('ทำการ์ดไม่ได้ในเบราว์เซอร์นี้'); return null; }
 csQuoteSheet(url, c, (who ? who + ': ' : '') + text);
 return url;
}
function csQuoteSheet(url, canvas, text) {
 const host = (csReader && csReader.el) || (csNovel && csNovel.el);
 if (!host) return;
 csQuoteClose();
 const sh = document.createElement('div');
 sh.className = 'cs-qcard';
 sh.innerHTML = `<div class="cs-qbox"><img alt="การ์ดคำคม" src="${url}"><div class="cs-qacts">`
  + `<button data-cs="qsave"><i class="fa-solid fa-download"></i>บันทึกรูป</button>`
  + (navigator.share ? `<button data-cs="qshare"><i class="fa-solid fa-arrow-up-from-bracket"></i>แชร์</button>` : '')
  + `<button data-cs="qclose" aria-label="ปิด"><i class="fa-solid fa-xmark"></i></button></div></div>`;
 sh._canvas = canvas; sh._url = url; sh._text = text;
 host.appendChild(sh);
}
function csQuoteClose() { document.querySelectorAll('.cs-qcard').forEach(x => x.remove()); }
function csQuoteAct(a) {
 const sh = document.querySelector('.cs-qcard');
 if (!sh || a === 'qclose') return csQuoteClose();
 const name = 'quote-' + new Date().toISOString().slice(0, 19).replace(/\D/g, '') + '.png';
 if (a === 'qsave') {
  const l = document.createElement('a'); l.href = sh._url; l.download = name;
  document.body.appendChild(l); l.click(); l.remove();
  csToast('บันทึกรูปแล้ว', 'ok');
  return;
 }
 if (a === 'qshare') {
  const done = () => {}, fail = e => { if (!e || e.name !== 'AbortError') csToast('แชร์ไม่ได้'); };
  try {
   sh._canvas.toBlob(b => {
    try {
     const f = b && typeof File === 'function' ? new File([b], name, { type: 'image/png' }) : null;
     const data = f && navigator.canShare && navigator.canShare({ files: [f] }) ? { files: [f] } : { text: sh._text };
     navigator.share(data).then(done, fail);
    } catch (e) { fail(e); }
   }, 'image/png');
  } catch (e) { fail(e); }
 }
}
// ══ ★ 1.26 การ์ดตัวละคร: แตะรูปหรือชื่อ ══
/** นับบทพูดของชื่อนี้ทั้งแชท · บทแรก/ล่าสุดที่โผล่ · ประโยคล่าสุด */
function csProfStats(name, ck) {
 const chat = csCtx().chat || [];
 const low = String(name || '').trim().toLowerCase();
 const r = { n: 0, first: 0, last: 0, firstId: -1, firstLine: '', lastLine: '' };
 let ch = 0;
 chat.forEach((m, id) => {
  if (!m || m.is_system) return;
  if (!m.is_user) ch++;
  csParseMessage(m).forEach(it => {
   if ((it.k !== 'say' && it.k !== 'think') || String(it.who || '').trim().toLowerCase() !== low) return;
   if (ck && it.ck && it.ck !== ck) return;
   const c = m.is_user ? ch + 1 : ch;
   r.n++;
   if (r.firstId < 0) { r.first = c; r.firstId = id; r.firstLine = it.text; }
   r.last = c;
   if (it.k === 'say') r.lastLine = it.text;
  });
 });
 return r;
}
function csProfHTML() {
 const who = csNavState.who || '', ck = csNavState.ck || '';
 const key = ck || who;
 const o = csCast(false)[key] || csCastGet(who) || {};
 const card = !!csStCharFor(who);
 const me = csIsUserName(who);
 const st = csProfStats(who, ck);
 const g = o.g || '', gg = g || csGenderOf(who);
 const w = csChWord();
 const role = card ? 'การ์ดตัวละคร' : me ? 'ตัวเรา' : 'ตัวละครในเรื่อง';
 const gl = gg ? (gg === 'm' ? 'ชาย' : 'หญิง') + (g ? '' : ' · เดาเอา') : '';
 return `<div class="cs-cmt-grab"></div><div class="cs-navhead cs-profhead"><span></span><button class="cs-navx" data-cs="navclose" aria-label="ปิด"><i class="fa-solid fa-xmark"></i></button></div>
 <div class="cs-prof">
  <div class="cs-profid">${csAvatarHTML(who, csNavState.av || '', me, ck)}<div><b>${csEsc(who)}</b><small>${[role, gl].filter(Boolean).join(' · ')}</small></div></div>
  <div class="cs-profstats"><span><b>${st.n}</b><small>บทพูด</small></span><span><b>${st.first || '–'}</b><small>โผล่ครั้งแรก · ${w}</small></span><span><b>${st.last || '–'}</b><small>ล่าสุด · ${w}</small></span></div>
  ${st.lastLine ? `<blockquote class="cs-profq">“${csEsc(st.lastLine.slice(0, 160))}”</blockquote>` : ''}
  <div class="cs-proff">
   <label class="cs-profrow"><span>เพศ</span><select class="cs-sel" data-pf="g">${[['', 'อัตโนมัติ'], ['m', 'ชาย'], ['f', 'หญิง']].map(([v, l]) => `<option value="${v}"${g === v ? ' selected' : ''}>${l}</option>`).join('')}</select></label>
   ${csTtsEngine() === 'edge' ? `<label class="cs-profrow"><span>เสียงอ่าน</span><select class="cs-sel" data-pf="evoice"><option value="">อัตโนมัติ (${csEsc(csEVoiceLabel(CS_EVOICES.find(v => v.id === csEVoiceFor(who)) || CS_EVOICES[0]))})</option>${CS_EVOICES.map(v => `<option value="${v.id}"${o.evoice === v.id ? ' selected' : ''}>${csEVoiceLabel(v)}</option>`).join('')}</select></label>` : csTtsEngine() === 'gemini' ? `<label class="cs-profrow"><span>เสียงอ่าน</span><select class="cs-sel" data-pf="gvoice"><option value="">อัตโนมัติ (${csEsc(csGVoiceFor(who))})</option>${CS_GVOICES.map(v => `<option value="${v.id}"${o.gvoice === v.id ? ' selected' : ''}>${v.id} · ${v.g === 'f' ? 'หญิง' : 'ชาย'} · ${v.d}</option>`).join('')}</select></label>` : csTtsEngine() === 'device' && csTtsOk() ? `<label class="cs-profrow"><span>เสียงอ่าน</span><select class="cs-sel" data-pf="voice"><option value="">อัตโนมัติ</option>${csVoicesTh().map(v => `<option value="${csEsc(v.name)}"${o.voice === v.name ? ' selected' : ''}>${csEsc(v.name)}</option>`).join('')}</select></label>` : ''}
   ${true ? `
   <label class="cs-profrow"><span>ระดับเสียง</span><select class="cs-sel" data-pf="pitch">${[['', 'อัตโนมัติ'], ['0.75', 'ต่ำ'], ['1', 'กลาง'], ['1.25', 'สูง']].map(([v, l]) => `<option value="${v}"${String(o.pitch || '') === v ? ' selected' : ''}>${l}</option>`).join('')}</select><button class="cs-proftry" data-cs="ttstry" aria-label="ลองฟัง"><i class="fa-solid fa-play"></i></button></label>` : ''}
   ${card ? '' : `<label class="cs-profrow"><span>ชื่อเรียกอื่น</span><input class="cs-text" data-pf="aliases" value="${csEsc(o.aliases || '')}" placeholder="เช่น พี่มิ, คุณหนู" maxlength="200"></label>
   <label class="cs-profrow cs-profme"><span>นี่คือตัวเรา</span><input type="checkbox" data-pf="me"${o.me ? ' checked' : ''}></label>`}
  </div>
  <div class="cs-profacts">${st.firstId >= 0 ? `<button data-cs="navgo" data-mes="${st.firstId}" data-q="${csEsc(st.firstLine.slice(0, 24))}"><i class="fa-solid fa-flag"></i>ไปฉากแรก</button>` : ''}<button data-cs="proffind"><i class="fa-solid fa-magnifying-glass"></i>บทพูดทั้งหมด</button><button data-cs="profmore"><i class="fa-solid fa-sliders"></i>ตั้งค่าเพิ่ม</button></div>
 </div>`;
}
function csProfChange(el) {
 const f = el && el.dataset && el.dataset.pf;
 if (!f || csNavState.tab !== 'prof') return;
 const who = csNavState.who, key = csNavState.ck || who;
 const v = f === 'me' ? !!el.checked : String(el.value || '').trim();
 csCastEdit(key, who, { [f]: v === false ? '' : v });
 csToast(f === 'voice' || f === 'pitch' || f === 'gvoice' || f === 'evoice' ? 'บันทึกแล้ว' : 'บันทึกแล้ว · มีผลตอนเปิดอ่านใหม่', 'ok');
 if (f === 'voice' || f === 'pitch' || f === 'gvoice' || f === 'evoice') csTtsTry();
 if (f !== 'aliases') csNavRefresh();
}
// ══ ★ 1.27 อ่านออกเสียง (เสียงของเบราว์เซอร์ · ไม่ใช้โทเคน) ══
let csTts = null; // { kind: chat|novel, idx, tok, paused }
function csTtsOk() { try { return 'speechSynthesis' in window && typeof window.SpeechSynthesisUtterance === 'function'; } catch { return false; } }
function csVoices() { try { return window.speechSynthesis.getVoices() || []; } catch { return []; } }
function csVoicesTh() { const v = csVoices(); const th = v.filter(x => /^th/i.test(x.lang || '')); return th.length ? th : v; }
const CS_VOICE_M = /niwat|pattara|male|ชาย|\bman\b/i;
/** เสียงของใคร: ตั้งเองที่การ์ด > ผู้บรรยาย (ไม่มีชื่อ) > เลือกตามเพศจากเสียงไทยที่มี */
function csVoiceFor(who) {
 const all = csVoices();
 const byName = n => n && all.find(v => v.name === n);
 if (who) { const o = csCastGet(who) || {}; const v = byName(o.voice); if (v) return v; }
 const th = csVoicesTh();
 const narr = byName(csCfg().ttsVoice) || th.find(v => !CS_VOICE_M.test(v.name)) || th[0] || null;
 if (!who || th.length < 2) return narr;
 const g = csGenderOf(who);
 const m = th.filter(v => CS_VOICE_M.test(v.name)), f = th.filter(v => !CS_VOICE_M.test(v.name));
 const pool = g === 'm' && m.length ? m : g === 'f' && f.length ? f : th;
 return pool[csHash(who) % pool.length];
}
/** ระดับเสียง: ตั้งเอง > ตามเพศ (ถ้าเสียงเป็นผู้หญิงแต่ตัวละครชาย กดต่ำลง) + ต่างกันนิดหน่อยตามชื่อ */
function csPitchFor(who, voice) {
 if (!who) return 1;
 const o = csCastGet(who) || {};
 if (+o.pitch) return +o.pitch;
 const g = csGenderOf(who);
 const base = g === 'm' ? (voice && CS_VOICE_M.test(voice.name) ? .95 : .72) : g === 'f' ? 1.12 : 1;
 return Math.max(.5, Math.min(1.8, base + ((csHash(who) % 9) - 4) * .025));
}
function csTtsClean(t) { return String(t || '').replace(/\u0000CSBLK\d+\u0000/g, '').replace(/[*_`~#>|]+/g, '').replace(/\s+/g, ' ').trim(); }
/** ตัดเป็นท่อนสั้น (Chrome ตัดเสียงยาว ๆ กลางคัน) */
function csTtsChunks(t) {
 const out = [];
 let r = t;
 while (r.length > 180) {
  let cut = Math.max(r.lastIndexOf(' ', 180), r.lastIndexOf('. ', 180) + 1, r.lastIndexOf('! ', 180) + 1, r.lastIndexOf('? ', 180) + 1);
  if (cut < 60) cut = 180;
  out.push(r.slice(0, cut).trim()); r = r.slice(cut).trim();
 }
 if (r) out.push(r);
 return out;
}
function csSpeak(text, who, done) {
 if (csTtsEngine() !== 'device') return csSpeakAudio(text, who, null, done);
 const t = csTts, tok = t ? t.tok : 0;
 const alive = () => (t ? csTts === t && t.tok === tok && !t.paused : true);
 const chunks = csTtsChunks(csTtsClean(text));
 if (!chunks.length) return setTimeout(() => alive() && done(), 0);
 const v = csVoiceFor(who), pitch = csPitchFor(who, v), rate = +csCfg().ttsRate || 1;
 let i = 0;
 const step = () => {
  if (!alive()) return;
  if (i >= chunks.length) return done();
  const u = new window.SpeechSynthesisUtterance(chunks[i++]);
  u.lang = (v && v.lang) || 'th-TH';
  try { if (v) u.voice = v; } catch {}
  u.rate = rate; u.pitch = pitch;
  let fired = false;
  const go = () => { if (fired) return; fired = true; setTimeout(step, 80); };
  u.onend = go;
  u.onerror = e => { if (e && /interrupted|canceled/.test(e.error || '')) return; go(); };
  try { window.speechSynthesis.speak(u); } catch { go(); }
 };
 step();
}
function csTtsWant(it) {
 if (!it || it.k === 'code' || it.k === 'html') return false;
 if (!csTtsClean(it.text)) return false;
 return (it.k !== 'narr' && it.k !== 'scene') || csCfg().ttsNarr !== false;
}
function csTtsNovelEls() {
 if (!csNovel) return [];
 const n = csCfg().ttsNarr !== false;
 return [...csNovel.el.querySelectorAll('.cs-page .cs-np, .cs-page .cs-nscene')].filter(e => n || e.querySelector('.cs-nwho') || /[“"「『]/.test(e.textContent));
}
function csTtsHost() { return (csReader && csReader.el) || (csNovel && csNovel.el) || null; }
function csTtsStart(fromEl) {
 if (!csTtsOk() && csTtsEngine() === 'device') { csToast('เบราว์เซอร์นี้อ่านออกเสียงไม่ได้'); return false; }
 csTtsStop();
 csTtsUnlock();
 const at = csTtsIdxOf(fromEl);
 if (at) { csStopAuto(); csTts = { kind: at.kind, idx: at.idx, tok: 0 }; csTtsBar(); csTtsNext(); csTtsBtnSync(); return true; }
 if (csReader) {
  csStopAuto();
  const p = csReader.player;
  p.finishTyping && p.finishTyping();
  // อ่านจบแล้ว = เริ่มจากที่เห็นบนจอ · ยังไม่จบ = เริ่มจากฟองล่าสุดที่เพิ่งเด้ง
  const idx = p.i >= p.items.length ? Math.max(p.floor || 0, csReaderAnchorIdx()) : Math.max(p.floor || 0, p.i - 1);
  csTts = { kind: 'chat', idx: Math.max(0, idx), tok: 0 };
 } else if (csNovel) {
  const body = csNovel.el.querySelector('.cs-nbody');
  const top = body.getBoundingClientRect().top + 60;
  const els = csTtsNovelEls();
  const idx = els.findIndex(e => e.getBoundingClientRect().bottom > top);
  csTts = { kind: 'novel', idx: Math.max(0, idx), tok: 0 };
 } else return false;
 csTtsBar();
 csTtsNext();
 csTtsBtnSync();
 return true;
}
function csTtsScroll(el, sc) {
 if (!el || !sc) return;
 const r = el.getBoundingClientRect(), sr = sc.getBoundingClientRect();
 if (r.top < sr.top + 70 || r.bottom > sr.bottom - 110) sc.scrollTop += r.top - sr.top - sc.clientHeight * .3;
}
function csTtsNext() {
 const t = csTts;
 if (!t) return;
 t.tok++;
 document.querySelectorAll('.cs-speaking').forEach(x => x.classList.remove('cs-speaking'));
 csTtsWordClear();
 if (t.paused) return csTtsBar();
 const next = () => { if (csTts === t) { t.idx++; if (t.kind === 'chat') csReaderSavePos(); csTtsNext(); } };
 if (t.kind === 'chat') {
  if (!csReader) return csTtsStop();
  const p = csReader.player;
  while (t.idx < p.items.length && !csTtsWant(p.items[t.idx])) t.idx++;
  if (t.idx >= p.items.length) { if (p.i < p.items.length) p.all(); return csTtsStop(true); }
  while (p.i <= t.idx) { p.finishTyping && p.finishTyping(); if (!p.next()) break; p.finishTyping && p.finishTyping(); }
  const it = p.items[t.idx];
  const box = csReader.el.querySelector(`.cs-list > .cs-item[data-i="${t.idx}"]`);
  const el = box && (box.querySelector('.cs-bubble, .cs-narr, .cs-scene') || box);
  if (el) { el.classList.add('cs-speaking'); csTtsScroll(el, csReader.el.querySelector('.cs-body')); }
  const who = it.k === 'say' || it.k === 'think' ? it.who : '';
  t.prog = `${t.idx + 1}/${p.items.length}`;
  csTtsBar(who);
  csTtsPrefetch(t);
  if (el && box !== el) { csSfxDecorate(csReader.el); csSpeakMap(csTtsTextMap(el), who, next); } else csSpeak(it.text, who, next);
 } else {
  if (!csNovel) return csTtsStop();
  const els = csTtsNovelEls();
  if (t.idx >= els.length) return csTtsStop(true);
  const el = els[t.idx];
  const who = (el.querySelector('.cs-nwho') || {}).textContent || el.dataset.who || '';
  el.classList.add('cs-speaking'); csTtsScroll(el, csNovel.el.querySelector('.cs-nbody'));
  t.prog = `${t.idx + 1}/${els.length}`;
  csTtsBar(who.trim());
  csTtsPrefetch(t);
  csSpeakMap(csTtsTextMap(el), who.trim(), next);
 }
}
function csTtsStop(finished) {
 const was = !!csTts;
 csTts = null;
 csTtsBtnSync();
 csTtsWordClear();
 try { if (was && csTtsOk()) window.speechSynthesis.cancel(); } catch {}
 csTtsAudioStop();
 document.querySelectorAll('.cs-speaking').forEach(x => x.classList.remove('cs-speaking'));
 document.querySelectorAll('.cs-ttsbar').forEach(x => x.remove());
 if (finished && was) csToast('อ่านจบแล้ว', 'ok');
}
function csTtsPause() {
 const t = csTts;
 if (!t) return;
 t.paused = !t.paused;
 if (t.paused) { t.tok++; try { window.speechSynthesis.cancel(); } catch {} csTtsAudioStop(); csTtsBar(t.who); }
 else csTtsNext(); // อ่านบรรทัดเดิมต่อตั้งแต่ต้นบรรทัด
}
function csTtsSkip(d) { const t = csTts; if (!t) return; try { window.speechSynthesis.cancel(); } catch {} csTtsAudioStop(); t.idx = Math.max(0, t.idx + (d || 1)); t.paused = false; csTtsNext(); }
function csTtsBar(who) {
 const host = csTtsHost();
 if (!host || !csTts) return;
 if (who !== undefined) csTts.who = who;
 let bar = host.querySelector(':scope > .cs-ttsbar');
 if (!bar) { bar = document.createElement('div'); bar.className = 'cs-ttsbar'; host.appendChild(bar); }
 const p = csTts.paused;
 bar.innerHTML = `<button data-cs="ttsprev" aria-label="บรรทัดก่อน"><i class="fa-solid fa-backward-step"></i></button><button data-cs="ttspause" aria-label="${p ? 'อ่านต่อ' : 'พัก'}"><i class="fa-solid ${p ? 'fa-play' : 'fa-pause'}"></i></button><span class="cs-ttswho">${p ? 'พักไว้' : csEsc(csTts.who || 'บรรยาย')}${csTts.prog ? `<small>${csTts.prog}</small>` : ''}</span><button data-cs="ttsnext" aria-label="บรรทัดถัดไป"><i class="fa-solid fa-forward-step"></i></button><button data-cs="ttsstop" aria-label="หยุด"><i class="fa-solid fa-xmark"></i></button>`;
}
/** ลองฟังเสียงตัวละครในการ์ด */
function csTtsTry() {
 if (!csTtsOk() && csTtsEngine() === 'device') return;
 const who = csNavState.who;
 if (!who) return;
 try { window.speechSynthesis.cancel(); } catch {}
 csTtsAudioStop(); csTtsUnlock();
 const st = csProfStats(who, csNavState.ck);
 const save = csTts; csTts = null;
 csSpeak(st.lastLine || ('สวัสดี ฉันชื่อ' + who), who, () => {});
 csTts = save;
}
/** เรียกก่อนตัวจัดการคลิกของหน้าอ่าน · true = จัดการแล้ว */
function csTtsClick(e, b) {
 const a = b && b.dataset.cs;
 if (a === 'tts') { e.stopPropagation(); csReader && csReader.el.querySelector('.cs-menu')?.classList.remove('open'); csNovel && csNovel.el.querySelector('.cs-aapanel')?.classList.remove('open'); if (csTts) csTtsStop(); else csTtsStart(); return true; }
 if (a === 'ttstry') { e.stopPropagation(); e.preventDefault(); csTtsTry(); return true; }
 if (!csTts) return false;
 if (a === 'ttsstop') { e.stopPropagation(); csTtsStop(); return true; }
 if (a === 'ttspause') { e.stopPropagation(); csTtsPause(); return true; }
 if (a === 'ttsnext' || a === 'ttsprev') { e.stopPropagation(); csTtsSkip(a === 'ttsnext' ? 1 : -1); return true; }
 // แตะบรรทัดไหนระหว่างอ่าน = อ่านบรรทัดนั้น · แตะที่ว่าง = ข้ามไปบรรทัดถัดไป
 if (a === 'tap' || a === 'ntap') { if (e.target.closest && e.target.closest('a,button')) return false; e.stopPropagation(); const line = e.target.closest && e.target.closest(CS_MARK_SEL); if (line && csTtsIdxOf(line)) csTtsStart(line); else csTtsSkip(1); return true; }
 return false;
}
// ══ ★ 1.28 ปัดซ้ายขวาเปลี่ยนบท (เปิดในตั้งค่า) ══
/** นิยาย: ไปบทถัดไป/ก่อนหน้า (อยู่กลางบทแล้วถอย = กลับต้นบทนี้ก่อน) · คืนเลขบทที่ไป */
function csNovelStep(dir) {
 if (!csNovel) return 0;
 const body = csNovel.el.querySelector('.cs-nbody');
 if (dir > 0 && csNovel.win && csNovel.win.end < csNovel.win.n) { const all = body.querySelectorAll('.cs-chapter'); const last = all[all.length - 1]; if (last && last.offsetTop - body.scrollTop <= 20) csNovelLoadNext(); }
 const chs = [...body.querySelectorAll('.cs-chapter')];
 if (!chs.length) return 0;
 const idx = Math.max(0, chs.filter(c => c.offsetTop - body.scrollTop <= 20).length - 1);
 const t = chs[Math.max(0, Math.min(chs.length - 1, idx + (dir > 0 ? 1 : (body.scrollTop - (chs[idx]?.offsetTop || 0) > 40 ? 0 : -1))))];
 if (!t) return 0;
 body.scrollTo ? body.scrollTo({ top: t.offsetTop - 12, behavior: 'smooth' }) : (body.scrollTop = t.offsetTop - 12);
 return +t.dataset.ch || 0;
}
/** แชทนิยาย: ถัดไป = เปิดถึงต้นบทถัดไปแล้วเลื่อนไปที่เส้นคั่นบท · ก่อนหน้า = กลับต้นบทนี้/บทก่อน */
function csChatStep(dir) {
 if (!csReader) return 0;
 const p = csReader.player, body = csReader.el.querySelector('.cs-body');
 csStopAuto();
 const a = Math.max(0, csReaderAnchorIdx()); // ข้อความก่อนหน้าที่โหลดไว้ (ใต้ floor) ก็อยู่บนจอ ถอยไปได้
 let j = -1;
 if (dir > 0) {
  for (let i = a + 1; i < p.items.length; i++) if (p.items[i].hd) { j = i; break; }
  if (j < 0) { p.all(); csToast('อ่านถึงล่าสุดแล้ว'); return 0; }
  if (j >= p.i) p.skipTo(j + 1);
 } else {
  let c = -1;
  for (let i = Math.min(a, p.i - 1); i >= 0; i--) if (p.items[i] && p.items[i].hd) { c = i; break; }
  const el = c >= 0 ? csReader.el.querySelector(`.cs-list > .cs-item[data-i="${c}"]`) : null;
  const mid = el && body && body.getBoundingClientRect().top + 60 - el.getBoundingClientRect().top > 40;
  if (c >= 0 && mid) j = c;
  else for (let i = (c >= 0 ? c : a) - 1; i >= 0; i--) if (p.items[i] && p.items[i].hd) { j = i; break; }
  if (j < 0) { if (body) body.scrollTop = 0; return 0; }
 }
 const el = csReader.el.querySelector(`.cs-list > .cs-item[data-i="${j}"]`);
 if (el && body) body.scrollTop += el.getBoundingClientRect().top - body.getBoundingClientRect().top - 56;
 csReaderSavePos(j);
 return p.items[j].hd;
}
function csChPill(n) {
 const host = csTtsHost();
 if (!host || !n) return;
 host.querySelector(':scope > .cs-chpill')?.remove();
 const d = document.createElement('div');
 d.className = 'cs-chpill';
 d.textContent = `${csChWord()}ที่ ${n}`;
 host.appendChild(d);
 setTimeout(() => d.remove(), 1100);
}
function csSwipeChBind(host) {
 let st = null;
 host.classList.toggle('cs-swipech', !!csCfg().swipeCh); // ปัดแนวนอนเป็นของหน้าอ่าน ไม่ให้เบราว์เซอร์ถอยหน้า
 const pt = e => (e.changedTouches && e.changedTouches[0]) || (e.touches && e.touches[0]) || e;
 host.addEventListener('touchstart', e => {
  st = null;
  if (!csCfg().swipeCh || (e.touches && e.touches.length > 1)) return;
  const t = pt(e);
  const w = window.innerWidth || 400;
  if (t.clientX < 22 || t.clientX > w - 22) return; // ขอบจอเป็นท่าย้อนกลับของเบราว์เซอร์
  if (e.target.closest && e.target.closest('.cs-code, .cs-html, pre, input, textarea, select, .cs-nav, .cs-cmt-sheet, .cs-markpop, .cs-qcard, .cs-ttsbar, .cs-inputbar, .cs-sttray, .cs-aapanel, .cs-menu, .cs-top, .cs-ntop, .cs-swipe')) return;
  st = { x: t.clientX, y: t.clientY, t: Date.now() };
 }, { passive: true });
 host.addEventListener('touchend', e => {
  const s0 = st; st = null;
  if (!s0 || !csCfg().swipeCh) return;
  const t = pt(e), dx = t.clientX - s0.x, dy = t.clientY - s0.y;
  if (Math.abs(dx) < 70 || Math.abs(dy) > 50 || Math.abs(dx) < Math.abs(dy) * 2 || Date.now() - s0.t > 700) return;
  if (host.classList.contains('nav-open') || host.classList.contains('cmt-open') || host.querySelector('.cs-markpop, .cs-qcard, .cs-menu.open, .cs-aapanel.open')) return;
  try { if (window.getSelection && String(window.getSelection()).length) return; } catch {}
  const dir = dx < 0 ? 1 : -1;
  const n = host.id === 'cs-novel' ? csNovelStep(dir) : csChatStep(dir);
  csChPill(n);
 }, { passive: true });
 host.addEventListener('touchcancel', () => { st = null; }, { passive: true });
}
// ══ ★ 1.29 เสียงบรรยากาศ — สังเคราะห์สดด้วย Web Audio (ไม่มีไฟล์เสียง) ══
const CS_AMB = [
 { id: 'rain', name: 'ฝน', icon: 'fa-cloud-rain', kw: /ฝน|พายุ|ฟ้าร้อง|ฟ้าผ่า|หยดน้ำ|ร่ม|rain|storm|thunder/gi },
 { id: 'sea', name: 'คลื่น', icon: 'fa-water', kw: /ทะเล|คลื่น|ชายหาด|หาดทราย|ริมหาด|มหาสมุทร|เรือ|beach|ocean|waves?|sea\b/gi },
 { id: 'cafe', name: 'ร้านกาแฟ', icon: 'fa-mug-hot', kw: /คาเฟ่|ร้านกาแฟ|ร้านอาหาร|ร้านขนม|โรงอาหาร|ภัตตาคาร|บาร์|กาแฟ|แก้วชา|cafe|coffee|restaurant|\bbar\b/gi },
 { id: 'night', name: 'กลางคืน', icon: 'fa-moon', kw: /กลางคืน|ยามค่ำ|ค่ำคืน|ดึกสงัด|เที่ยงคืน|จิ้งหรีด|แสงจันทร์|พระจันทร์|ดวงดาว|night|midnight|moon|crickets?/gi },
 { id: 'fire', name: 'เตาผิง', icon: 'fa-fire', kw: /เตาผิง|กองไฟ|ฟืน|เปลวไฟ|แคมป์ไฟ|ผิงไฟ|fireplace|campfire|bonfire/gi }
];
let csAmb = null, csAmbT = 0, csAmbSaveT = 0, csAmbStopT = 0;
const csAmbBuf = {};
function csAmbLabel() { const s = csCfg(); if (s.ambient === 'auto') { const cur = csAmb && CS_AMB.find(x => x.id === csAmb.id); return 'อัตโนมัติ' + (cur ? ` (${cur.name})` : ''); } const x = CS_AMB.find(a => a.id === s.ambient); return x ? x.name : 'ปิด'; }
/** เดาฉากจากคำในบท (นับคำ เอาอันที่เจอมากสุด) */
function csAmbDetect(text) {
 const t = String(text || '');
 let best = '', n = 0;
 CS_AMB.forEach(a => { const c = (t.match(a.kw) || []).length; if (c > n) { n = c; best = a.id; } });
 return best;
}
function csAmbSceneText() {
 const chat = csCtx().chat || [];
 let id = -1;
 if (csReader) { const p = csReader.player; const it = p.items[Math.min(p.i, p.items.length) - 1]; id = it && it._m !== undefined ? it._m : -1; }
 else if (csNovel) id = csNavCurrentId();
 if (id < 0) id = chat.length - 1;
 // บทของบอทที่อ่านอยู่ + ข้อความเราก่อนหน้า (บอกฉากได้เหมือนกัน)
 return [chat[id - 1], chat[id]].filter(m => m && !m.is_system).map(m => m.mes || '').join('\n');
}
function csAmbWant() {
 const s = csCfg();
 if (!csReader && !csNovel) return '';
 if (s.ambient === 'auto') return csAmbDetect(csAmbSceneText()) || (csAmb ? csAmb.id : '');
 return CS_AMB.some(a => a.id === s.ambient) ? s.ambient : '';
}
function csAmbKick() { clearTimeout(csAmbStopT); if (csCfg().ambient !== 'off') setTimeout(csAmbSync, 50); }
function csAmbAutoSoon() { if (csCfg().ambient !== 'auto') return; clearTimeout(csAmbT); csAmbT = setTimeout(csAmbSync, 900); }
function csAmbStopSoon() { clearTimeout(csAmbStopT); csAmbStopT = setTimeout(() => { if (!csReader && !csNovel) csAmbStop(); }, 250); }
function csAmbSync() {
 const want = csAmbWant();
 if ((csAmb ? csAmb.id : '') === want) return;
 csAmbStop();
 if (want) csAmbStart(want);
}
function csAmbSet(v) {
 const s = csCfg();
 s.ambient = v === 'auto' || CS_AMB.some(a => a.id === v) ? v : 'off';
 csSave();
 if (s.ambient === 'off') return csAmbStop();
 csAc(); // แตะเลือก = ท่าทางผู้ใช้ เปิดเสียงได้
 if (s.ambient === 'auto') { csAmbSync(); if (!csAmb) csToast('ยังไม่เจอฉากที่มีเสียง · จะเปิดเองเมื่อเจอ เช่น ฝน ทะเล คาเฟ่'); return; }
 csAmbStop(); const w = csAmbWant(); if (w) csAmbStart(w);
}
function csAmbVolume() { if (csAmb && csAmb.out && csAmb.ac) { try { csAmb.out.gain.setTargetAtTime(Math.max(0, Math.min(1, +csCfg().ambVol || 0)) * .6, csAmb.ac.currentTime, .15); } catch {} } }
function csAmbNoise(ac, kind) {
 const k = kind + ac.sampleRate;
 if (csAmbBuf[k]) return csAmbBuf[k];
 const len = Math.floor(ac.sampleRate * 4), b = ac.createBuffer(1, len, ac.sampleRate), d = b.getChannelData(0);
 let last = 0;
 for (let i = 0; i < len; i++) { const w = Math.random() * 2 - 1; if (kind === 'brown') { last = (last + .02 * w) / 1.02; d[i] = last * 3.5; } else d[i] = w; }
 return (csAmbBuf[k] = b);
}
function csAmbStart(id) {
 const ac = csAc();
 if (!ac) return;
 try {
  const out = ac.createGain();
  out.gain.value = 0.0001;
  out.connect(ac.destination);
  const A = { id, ac, out, nodes: [out], timers: [] };
  const src = (kind, rate) => { const n = ac.createBufferSource(); n.buffer = csAmbNoise(ac, kind); n.loop = true; if (rate) n.playbackRate.value = rate; n.start(); A.nodes.push(n); return n; };
  const filt = (type, f, q) => { const n = ac.createBiquadFilter(); n.type = type; n.frequency.value = f; if (q) n.Q.value = q; A.nodes.push(n); return n; };
  const gain = v => { const g = ac.createGain(); g.gain.value = v; A.nodes.push(g); return g; };
  const chain = (...ns) => { for (let i = 0; i < ns.length - 1; i++) ns[i].connect(ns[i + 1]); return ns[ns.length - 1]; };
  const lfo = (param, hz, depth) => { const o = ac.createOscillator(); o.frequency.value = hz; const g = gain(depth); o.connect(g); g.connect(param); o.start(); A.nodes.push(o); };
  const every = (min, max, fn) => { const tick = () => { if (csAmb !== A) return; try { fn(); } catch {} A.timers.push(setTimeout(tick, min + Math.random() * (max - min))); }; A.timers.push(setTimeout(tick, min)); };
  const burst = (f, q, v, dur, type) => { const t = ac.currentTime, n = ac.createBufferSource(); n.buffer = csAmbNoise(ac, 'white'); const bf = ac.createBiquadFilter(); bf.type = type || 'bandpass'; bf.frequency.value = f; bf.Q.value = q; const g = ac.createGain(); g.gain.setValueAtTime(v, t); g.gain.exponentialRampToValueAtTime(.0001, t + dur); n.connect(bf); bf.connect(g); g.connect(out); n.start(t, Math.random() * 3); n.stop(t + dur + .02); };
  const ping = (f, v, dur) => { const t = ac.currentTime, o = ac.createOscillator(), g = ac.createGain(); o.frequency.value = f; g.gain.setValueAtTime(v, t); g.gain.exponentialRampToValueAtTime(.0001, t + dur); o.connect(g); g.connect(out); o.start(t); o.stop(t + dur + .02); };
  if (id === 'rain') {
   chain(src('brown'), filt('highpass', 350), filt('lowpass', 5200), gain(1.8), out);
   chain(src('white'), filt('bandpass', 2600, .6), gain(.14), out);
   every(25, 110, () => burst(1600 + Math.random() * 3200, 2.5, .08 + Math.random() * .14, .02 + Math.random() * .03));
  } else if (id === 'sea') {
   const g = gain(.8);
   chain(src('brown', .8), filt('lowpass', 850), g, out);
   lfo(g.gain, .085, .65);
   const h = gain(.06); chain(src('white'), filt('highpass', 3000), h, out); lfo(h.gain, .085, .05);
  } else if (id === 'cafe') {
   const g = gain(1.3);
   chain(src('brown', 1.4), filt('bandpass', 520, .45), g, out);
   lfo(g.gain, .32, .3);
   every(250, 900, () => burst(280 + Math.random() * 650, 1.6, .14 + Math.random() * .14, .3 + Math.random() * .6)); // เสียงคุยพึมพำ
   every(1800, 6000, () => ping(2300 + Math.random() * 1600, .09, .35)); // แก้วช้อนกระทบ
  } else if (id === 'night') {
   chain(src('brown', .6), filt('lowpass', 380), gain(.9), out);
   const cr = f => () => { for (let k = 0; k < 3; k++) setTimeout(() => csAmb === A && ping(f + Math.random() * 60, .06, .045), k * 70); };
   every(700, 1300, cr(4350));
   every(900, 1700, cr(4780));
  } else if (id === 'fire') {
   chain(src('brown', .7), filt('lowpass', 560), gain(1.1), out);
   every(35, 320, () => burst(1800 + Math.random() * 2500, .9, .15 + Math.random() * .45, .008 + Math.random() * .02, 'highpass'));
  } else return;
  csAmb = A;
  csAmbVolume();
 } catch (e) { csAmb = null; }
}
function csAmbStop() {
 const A = csAmb;
 csAmb = null;
 if (!A) return;
 A.timers.forEach(clearTimeout);
 try { A.out.gain.setTargetAtTime(.0001, A.ac.currentTime, .25); } catch {}
 setTimeout(() => A.nodes.forEach(n => { try { n.stop && n.stop(); } catch {} try { n.disconnect(); } catch {} }), 1200);
}
function csAmbHTML() {
 const s = csCfg();
 const cur = csAmb ? csAmb.id : '';
 const btn = (v, icon, name, extra) => `<button class="cs-ambbtn${s.ambient === v ? ' on' : ''}" data-cs="ambset" data-v="${v}"><i class="fa-solid ${icon}"></i><span>${name}</span>${extra || ''}</button>`;
 return `<div class="cs-cmt-grab"></div><div class="cs-navhead cs-profhead"><b class="cs-ambh">เสียงบรรยากาศ · เอฟเฟกต์</b><button class="cs-navx" data-cs="navclose" aria-label="ปิด"><i class="fa-solid fa-xmark"></i></button></div>
 <div class="cs-amb">
  <div class="cs-ambgrid">${btn('off', 'fa-volume-xmark', 'ปิด')}${btn('auto', 'fa-wand-magic-sparkles', 'อัตโนมัติ', s.ambient === 'auto' && cur ? `<small>${csEsc((CS_AMB.find(a => a.id === cur) || {}).name || '')}</small>` : '')}${CS_AMB.map(a => btn(a.id, a.icon, a.name)).join('')}</div>
  <div class="cs-ambvol"><i class="fa-solid fa-volume-low"></i><input type="range" class="cs-range" data-amb="vol" min="0" max="1" step=".05" value="${+s.ambVol}"><i class="fa-solid fa-volume-high"></i></div>
  <div class="cs-ambnote">อัตโนมัติ = ฟังจากคำในบทที่อ่านอยู่ เช่น ฝน ทะเล คาเฟ่ กลางคืน กองไฟ · เสียงสร้างสดในเครื่อง ไม่ใช้เน็ตหรือโทเคน</div>
  ${csSfxSheetHTML()}
 </div>`;
}
// ══ ★ 1.30 สถิติการอ่าน ══
let csStatLast = 0, csStatDirty = 0, csStatIv = 0, csStatCache = null;
function csStats() {
 const s = csCfg();
 if (!s.stats || typeof s.stats !== 'object') s.stats = {};
 if (!s.stats.days || typeof s.stats.days !== 'object') s.stats.days = {};
 if (!s.stats.chats || typeof s.stats.chats !== 'object') s.stats.chats = {};
 return s.stats;
}
function csDayKey(d) { d = d || new Date(); return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}-${String(d.getDate()).padStart(2, '0')}`; }
/** นับเวลาอ่านเฉพาะตอนหน้าอ่านเปิด มองเห็น และมีการแตะ/เลื่อน/ฟังเสียงอ่านใน 90 วินาทีที่ผ่านมา */
function csStatTick(sec) {
 if (!csReader && !csNovel) return false;
 try { if (document.visibilityState === 'hidden') return false; } catch {}
 if (!csTts && Date.now() - csStatLast > 90000) return false;
 const S = csStats(), day = csDayKey(), k = csChatKey();
 S.days[day] = (S.days[day] || 0) + sec;
 const c = S.chats[k] || (S.chats[k] = { sec: 0, first: day });
 c.sec += sec; c.last = day;
 const keys = Object.keys(S.days).sort();
 while (keys.length > 120) delete S.days[keys.shift()];
 if (++csStatDirty >= 4) csStatFlush();
 return true;
}
function csStatFlush() { if (csStatDirty) { csStatDirty = 0; csSave(); } }
function csStatBind(host) {
 csStatLast = Date.now();
 const ping = () => { csStatLast = Date.now(); };
 ['pointerdown', 'keydown', 'wheel', 'touchstart'].forEach(n => host.addEventListener(n, ping, { passive: true }));
 host.querySelectorAll('.cs-body, .cs-nbody').forEach(b => b.addEventListener('scroll', ping, { passive: true }));
 if (!csStatIv) csStatIv = setInterval(() => csStatTick(15), 15000);
}
function csFmtDur(sec) {
 const m = Math.round((sec || 0) / 60);
 if (m < 1) return (sec || 0) > 0 ? 'ไม่ถึงนาที' : '0 นาที';
 return m < 60 ? `${m} นาที` : `${Math.floor(m / 60)} ชม.${m % 60 ? ` ${m % 60} นาที` : ''}`;
}
/** ตัวเลขของเรื่องนี้ (เก็บไว้จนกว่าแชทจะยาวขึ้น) */
function csStatStory() {
 const chat = csCtx().chat || [], key = csChatKey() + ':' + chat.length + ':' + (chat.length ? String(chat[chat.length - 1].mes || '').length : 0);
 if (csStatCache && csStatCache.key === key) return csStatCache;
 let chapters = 0, chars = 0, userMsgs = 0;
 const who = new Map();
 chat.forEach(m => {
  if (!m || m.is_system) return;
  if (m.is_user) userMsgs++; else chapters++;
  chars += csCleanText(csBlocks(m.mes || '').text).replace(/\s+/g, '').length;
  csParseMessage(m).forEach(it => { if ((it.k === 'say' || it.k === 'think') && it.who) who.set(it.who, (who.get(it.who) || 0) + 1); });
 });
 const speakers = [...who].sort((a, b) => b[1] - a[1]).slice(0, 6);
 return (csStatCache = { key, chapters, chars, userMsgs, speakers });
}
function csStatStreak(days) {
 let n = 0;
 const d = new Date();
 if (!((days[csDayKey(d)] || 0) >= 60)) d.setDate(d.getDate() - 1); // วันนี้ยังไม่ได้อ่าน ไม่ตัดสตรีค
 while ((days[csDayKey(d)] || 0) >= 60) { n++; d.setDate(d.getDate() - 1); }
 return n;
}
function csStatsHTML() {
 const S = csStats(), st = csStatStory(), mine = S.chats[csChatKey()] || { sec: 0 };
 const w = csChWord(), num = n => Number(n || 0).toLocaleString('th-TH');
 const marks = csMarks(false), hl = marks.filter(x => x.k !== 'bm').length, bm = marks.length - hl;
 const est = Math.max(1, Math.ceil(st.chars / 900)) * 60; // ภาษาไทยอ่านราว 900 ตัวอักษรต่อนาที
 const week = [];
 const dn = ['อา', 'จ', 'อ', 'พ', 'พฤ', 'ศ', 'ส'];
 for (let i = 6; i >= 0; i--) { const d = new Date(); d.setDate(d.getDate() - i); week.push({ l: i ? dn[d.getDay()] : 'วันนี้', sec: S.days[csDayKey(d)] || 0 }); }
 const wmax = Math.max(60, ...week.map(x => x.sec));
 const smax = st.speakers.length ? st.speakers[0][1] : 1;
 const streak = csStatStreak(S.days);
 const total = Object.values(S.days).reduce((a, b) => a + b, 0);
 return `<div class="cs-stats">
  <div class="cs-profstats"><span><b>${num(st.chapters)}</b><small>${w}</small></span><span><b>${num(st.chars)}</b><small>ตัวอักษร</small></span><span><b>${csFmtDur(est).replace(' นาที', '<i>น.</i>').replace('ชม.', '<i>ชม.</i>')}</b><small>ถ้าอ่านรวดเดียว</small></span></div>
  <div class="cs-statrow"><span>เวลาที่อ่านเรื่องนี้</span><b>${csFmtDur(mine.sec)}</b></div>
  ${hl || bm ? `<div class="cs-statrow"><span>ไฮไลต์ · ที่คั่น</span><b>${num(hl)} · ${num(bm)}</b></div>` : ''}
  ${st.speakers.length ? `<div class="cs-stath">ใครพูดเยอะสุด</div><div class="cs-statbars">${st.speakers.map(([n, c]) => `<div class="cs-statbar"><span>${csEsc(n)}</span><i><em style="width:${Math.max(4, Math.round(c / smax * 100))}%"></em></i><b>${num(c)}</b></div>`).join('')}</div>` : ''}
  <div class="cs-stath">7 วันล่าสุด <small>${streak ? `อ่านติดกัน ${streak} วัน` : ''}${total ? `${streak ? ' · ' : ''}รวมทุกเรื่อง ${csFmtDur(total)}` : ''}</small></div>
  <div class="cs-statweek">${week.map(x => `<div title="${csFmtDur(x.sec)}"><i><em style="height:${x.sec ? Math.max(6, Math.round(x.sec / wmax * 100)) : 0}%"></em></i><small>${x.l}</small></div>`).join('')}</div>
 </div>`;
}
// ══ ★ 1.31 เสียงเอฟเฟกต์ — คำที่มีเสียงขีดเส้นประไว้ · แตะเล่น · อัตโนมัติเมื่อฟองเด้ง/เลื่อนถึง/อ่านออกเสียงถึง ══
let csFull = false;
function csFullToggle() {
 csFull = !csFull;
 const d = document, el = d.documentElement;
 try {
  if (csFull && !d.fullscreenElement && el.requestFullscreen) { const r = el.requestFullscreen({ navigationUI: 'hide' }); if (r && r.catch) r.catch(() => {}); }
  else if (!csFull && d.fullscreenElement && d.exitFullscreen) { const r = d.exitFullscreen(); if (r && r.catch) r.catch(() => {}); }
 } catch {}
 d.body.classList.toggle('cs-full', csFull);
 [csReader && csReader.el, csNovel && csNovel.el].forEach(h => h && csApplyUnderBar(h));
 csNovel && csNovel.el.querySelector('.cs-aapanel')?.classList.remove('open');
 csToast(csFull ? 'เต็มจอแล้ว · เมนูเดิมกดอีกครั้งเพื่อออก' : 'ออกจากเต็มจอแล้ว');
}
try { document.addEventListener('fullscreenchange', () => { if (!document.fullscreenElement && csFull) { csFull = false; document.body.classList.remove('cs-full'); [csReader && csReader.el, csNovel && csNovel.el].forEach(h => h && csApplyUnderBar(h)); } }); } catch {}
/** แชทนิยาย: ซ่อนฟองตั้งแต่ต้นบทที่อ่านอยู่ แล้วแตะอ่านบทนี้ใหม่ (บทก่อนหน้าไม่แตะ) */
function csChatRestartChapter() {
 if (!csReader) return;
 const p = csReader.player;
 csStopAuto(); csTtsStop();
 if (p.typing) { clearTimeout(p.typing.timer); p.typing.el.remove(); p.i = p.typing.idx; p.typing = null; }
 const a = Math.max(0, Math.min(csReaderAnchorIdx(), p.i - 1));
 let c = -1;
 for (let i = a; i >= 0; i--) if (p.items[i] && p.items[i].hd) { c = i; break; }
 if (c < 0) c = 0;
 if ((p.floor || 0) > c) p.floor = c;
 csReader.el.querySelectorAll('.cs-list > .cs-item[data-i]').forEach(x => { if (+x.dataset.i >= c) x.remove(); });
 p.i = c;
 p.next();
 csReaderUpdate();
 csReaderSavePos();
 csToast(`อ่าน${csChWord()}${p.items[c] && p.items[c].hd ? 'ที่ ' + p.items[c].hd : 'นี้'}ใหม่ · แตะเพื่ออ่านต่อ`);
}
// ── คลังเสียง: สังเคราะห์ทั้งหมด (ไม่มีไฟล์) ──
function csSfxP(ac, out, t0) {
 const at = t => t0 + t;
 const env = (g, t, v, a, dur, sus) => {
  v = Math.max(.0002, v);
  g.gain.setValueAtTime(.0001, at(t));
  g.gain.exponentialRampToValueAtTime(v, at(t) + a);
  if (sus) { g.gain.setValueAtTime(v, at(t) + Math.max(a, dur - .06)); g.gain.exponentialRampToValueAtTime(.0001, at(t) + dur); }
  else g.gain.exponentialRampToValueAtTime(.0001, at(t) + dur);
 };
 const R = Math.random;
 const P = {
  R, end: 0,
  n(t, dur, o = {}) {
   P.end = Math.max(P.end, t + dur);
   const src = ac.createBufferSource(); src.buffer = csAmbNoise(ac, o.brown ? 'brown' : 'white');
   const f = ac.createBiquadFilter(); f.type = o.type || 'bandpass'; f.frequency.setValueAtTime(o.f || 1000, at(t));
   if (o.f2) f.frequency.exponentialRampToValueAtTime(o.f2, at(t) + dur); f.Q.value = o.q || 1;
   const g = ac.createGain(); env(g, t, o.v ?? .5, o.a ?? .004, dur, o.sus);
   src.connect(f); f.connect(g); g.connect(out); src.start(at(t), R() * 3); src.stop(at(t) + dur + .05);
  },
  s(t, fr, dur, o = {}) {
   P.end = Math.max(P.end, t + dur);
   const osc = ac.createOscillator(); osc.type = o.type || 'sine'; osc.frequency.setValueAtTime(fr, at(t));
   if (o.path) o.path.forEach(([tt, ff]) => osc.frequency.linearRampToValueAtTime(ff, at(t) + tt));
   else if (o.f2) osc.frequency.exponentialRampToValueAtTime(o.f2, at(t) + (o.gl || dur));
   if (o.vib) { const l = ac.createOscillator(), lg = ac.createGain(); l.frequency.value = o.vib[0]; lg.gain.value = o.vib[1]; l.connect(lg); lg.connect(osc.frequency); l.start(at(t)); l.stop(at(t) + dur + .05); }
   let node = osc;
   if (o.lp || o.bp) { const f = ac.createBiquadFilter(); f.type = o.bp ? 'bandpass' : 'lowpass'; f.frequency.value = o.bp || o.lp; f.Q.value = o.q || 1; osc.connect(f); node = f; }
   const g = ac.createGain(); env(g, t, o.v ?? .3, o.a ?? .005, dur, o.sus);
   node.connect(g); g.connect(out); osc.start(at(t)); osc.stop(at(t) + dur + .05);
  }
 };
 return P;
}
const csFxGun = (P, t, v = .85) => { P.n(t, .18, { type: 'lowpass', f: 4000, f2: 600, v, a: .001 }); P.s(t, 150, .25, { f2: 40, v: .8 * v, a: .001 }); P.n(t + .05, .6, { brown: 1, type: 'lowpass', f: 500, v: .3 * v }); };
const csFxThud = (P, t, v = .9) => { P.s(t, 80, .35, { f2: 35, v, a: .002 }); P.n(t, .35, { brown: 1, type: 'lowpass', f: 500, v: v * .9, a: .002 }); };
const csFxStep = (P, t, v = .6) => { P.n(t, .09, { brown: 1, type: 'lowpass', f: 500, v, a: .004 }); P.n(t, .04, { type: 'bandpass', f: 1800, q: 2, v: v * .14, a: .002 }); };
const csFxCrackle = (P, t, n, spread) => { for (let i = 0; i < n; i++) P.n(t + P.R() * spread, .01 + P.R() * .02, { type: 'highpass', f: 1800 + P.R() * 2500, v: .15 + P.R() * .4, a: .001 }); };
const CS_VOW = { a: [800, 1200], e: [500, 1900], i: [320, 2300], o: [520, 900], u: [350, 800] };
/** เสียงคนแบบง่าย: คลื่นฟันเลื่อยผ่านฟอร์แมนต์สระ */
const csFxVox = (P, t, f0, dur, vw, o = {}) => { const [f1, f2] = CS_VOW[vw] || CS_VOW.a, v = o.v ?? .5, c = { type: 'sawtooth', a: o.a ?? .02, path: o.path, f2: o.f2, vib: o.vib, sus: o.sus }; P.s(t, f0, dur, { ...c, bp: f1, q: 4, v }); P.s(t, f0, dur, { ...c, bp: f2, q: 6, v: v * .45 }); };
const CS_SFX = [
 // ธรรมชาติ
 { id: 'thunder', n: 'ฟ้าผ่า', k: 'ฟ้าผ่า|ฟ้าร้อง|ฟ้าคำราม|เปรี้ยง|ครืน|สายฟ้า|thunder|lightning', p: P => { P.n(0, .25, { type: 'highpass', f: 800, v: .9, a: .002 }); P.n(.02, 3, { brown: 1, type: 'lowpass', f: 300, f2: 80, v: 1, a: .05 }); P.n(.3, 2.2, { brown: 1, type: 'lowpass', f: 180, v: .7, a: .2 }); } },
 { id: 'gust', n: 'ลมกระโชก', k: 'ลมพัด|ลมกระโชก|ลมแรง|ลมหวีดหวิว|พายุ|gust|gale|wind howl', p: P => P.n(0, 2.2, { type: 'bandpass', f: 300, f2: 900, q: 1.2, v: .5, a: .7 }) },
 { id: 'quake', n: 'แผ่นดินไหว', k: 'แผ่นดินไหว|พื้นสั่น|สั่นสะเทือน|earthquake|tremor', p: P => { P.n(0, 3.5, { brown: 1, type: 'lowpass', f: 120, v: 1, a: .6 }); P.s(0, 35, 3.5, { v: .5, a: .6, vib: [3, 6] }); } },
 { id: 'splash', n: 'น้ำกระเซ็น', k: 'ตูมลงน้ำ|กระโดดน้ำ|กระโดดลงน้ำ|ตกน้ำ|น้ำกระเซ็น|สาดน้ำ|พลัดตกลงน้ำ|splash', p: P => { P.n(0, .6, { type: 'bandpass', f: 3000, f2: 500, q: .8, v: .6, a: .005 }); P.n(0, .9, { brown: 1, type: 'lowpass', f: 600, v: .5 }); for (let i = 0; i < 6; i++) P.s(.3 + i * .07, 400 + P.R() * 600, .05, { f2: 1200, v: .08 }); } },
 { id: 'drip', n: 'หยดน้ำ', k: 'หยดน้ำ|หยดติ๋ง|ติ๋ง|น้ำหยด|drip', p: P => { P.s(0, 800, .12, { f2: 2000, gl: .05, v: .3, a: .001 }); P.s(.45, 900, .1, { f2: 2200, gl: .05, v: .2, a: .001 }); } },
 { id: 'pour', n: 'รินน้ำ', k: 'รินน้ำ|รินชา|รินไวน์|รินเหล้า|เทน้ำ|pour', p: P => { for (let i = 0; i < 14; i++) P.s(i * .07, 300 + P.R() * 500, .06, { f2: 900, v: .16 }); P.n(0, 1, { type: 'bandpass', f: 1200, q: .8, v: .25, a: .1 }); } },
 { id: 'bubble', n: 'ฟองอากาศ', k: 'ฟองอากาศ|ปุด ?ๆ|เดือดปุด|bubbl', p: P => { for (let i = 0; i < 6; i++) P.s(i * .09 + P.R() * .03, 300 + P.R() * 300, .07, { f2: 900 + P.R() * 600, v: .15 }); } },
 { id: 'flame', n: 'ไฟลุก', k: 'ไฟลุก|ลุกไหม้|ลุกท่วม|ไฟไหม้|จุดไฟ|เปลวเพลิง|เพลิง|burst into flames|flames?|ignite', p: P => { P.n(0, 1.2, { brown: 1, type: 'lowpass', f: 200, f2: 1500, v: .7, a: .2 }); csFxCrackle(P, .3, 10, 1); } },
 // อาวุธ ต่อสู้
 { id: 'gun', n: 'ปืน', k: 'ยิงปืน|เสียงปืน|ลั่นไก|เหนี่ยวไก|ปืนลั่น|ยิงใส่|ยิงสวน|ยิง(?!ธนู)|gunshot|opened fire|fired a shot', p: P => csFxGun(P, 0) },
 { id: 'mgun', n: 'ปืนกล', k: 'ปืนกล|กระสุนรัว|ยิงรัว|รัวกระสุน|ห่ากระสุน|machine ?gun|gunfire', p: P => { for (let i = 0; i < 9; i++) csFxGun(P, i * .09, .55); } },
 { id: 'reload', n: 'ขึ้นลำ', k: 'บรรจุกระสุน|ขึ้นลำ|ง้างนก|เปลี่ยนแม็ก|reload|cocked', p: P => { P.n(0, .04, { type: 'bandpass', f: 1500, q: 2, v: .6, a: .001 }); P.n(.18, .05, { type: 'bandpass', f: 2500, q: 2, v: .6, a: .001 }); } },
 { id: 'cannon', n: 'ปืนใหญ่', k: 'ปืนใหญ่|cannon', p: P => { P.s(0, 70, .8, { f2: 25, v: .75, a: .001 }); P.n(0, 1.8, { brown: 1, type: 'lowpass', f: 700, f2: 90, v: .8, a: .005 }); } },
 { id: 'boom', n: 'ระเบิด', k: '(?<!อารมณ์)ระเบิด(?!อารมณ์|หัวเราะ|ความ)|ตูม(?!ลงน้ำ)|บึ้ม|explosion|explode|blast', p: P => { P.s(0, 90, 1, { f2: 30, v: .9 }); P.n(0, 2.5, { brown: 1, type: 'lowpass', f: 900, f2: 100, v: 1, a: .01 }); P.n(0, .4, { type: 'lowpass', f: 3000, v: .6 }); csFxCrackle(P, .4, 12, 1.5); } },
 { id: 'swdraw', n: 'ชักดาบ', k: 'ชักดาบ|ถอดดาบ|ดึงดาบ|ชักกระบี่|ถอดกระบี่|unsheathe|drew (?:his|her|the) sword', p: P => { P.n(0, .5, { type: 'bandpass', f: 2500, f2: 7000, q: 4, v: .9, a: .05 }); P.s(.4, 3200, .6, { v: .1 }); } },
 { id: 'swclash', n: 'ดาบกระทบ', k: 'ดาบกระทบ|ปะทะดาบ|ฟาดดาบ|ฟันดาบ|คมดาบ|ใบดาบ|เคร้ง|แกร๊ง|ประดาบ|sword clash|clang|clash', p: P => { [1200, 2710, 3960, 5230, 6800].forEach((f, i) => P.s(0, f, 1.2 - i * .15, { v: .12, a: .001 })); P.n(0, .06, { type: 'highpass', f: 2000, v: .6, a: .001 }); } },
 { id: 'slash', n: 'ฟันฉับ', k: 'ฉึก|ฉับ|แทง|เชือด|ฟัน(?=เข้า|ลง|ใส่|ขาด|ฉับ)|slash|stab', p: P => { P.n(0, .25, { type: 'bandpass', f: 800, f2: 4000, q: 2, v: .4, a: .08 }); P.n(.22, .12, { brown: 1, type: 'lowpass', f: 600, v: .6, a: .002 }); } },
 { id: 'arrow', n: 'ธนู', k: 'ยิงธนู|ลูกธนู|น้าวคันธนู|ธนู|arrow|longbow', p: P => { P.s(0, 190, .3, { type: 'triangle', f2: 170, v: .4, a: .001 }); P.n(.05, .3, { type: 'bandpass', f: 1500, f2: 4000, q: 2, v: .3, a: .05 }); P.n(.37, .1, { brown: 1, type: 'lowpass', f: 700, v: .7, a: .002 }); } },
 { id: 'whip', n: 'แส้', k: 'ฟาดแส้|แส้|whip', p: P => { P.n(0, .2, { type: 'bandpass', f: 600, f2: 3000, q: 2, v: .3, a: .1 }); P.n(.2, .03, { type: 'highpass', f: 3000, v: 1, a: .001 }); } },
 { id: 'whoosh', n: 'วูบ', k: 'ฟึ่บ|ฟุ่บ|วูบ|หวือ|เหวี่ยง|พุ่งผ่าน|พุ่งเข้าใส่|swoosh|whoosh', p: P => P.n(0, .45, { type: 'bandpass', f: 400, f2: 2500, q: 1.5, v: .5, a: .15 }) },
 { id: 'punch', n: 'ต่อย', k: 'ต่อย|ชก|หมัด|ผลัวะ|พลั่ก|ตุ้บ|เตะ|ถีบ|กระทืบ|punch|kicked|kicks', p: P => { P.s(0, 120, .18, { f2: 50, v: .9, a: .001 }); P.n(0, .08, { type: 'lowpass', f: 2000, v: .6, a: .001 }); } },
 { id: 'slap', n: 'ตบ', k: 'ตบ(?!มือ|ไหล่|บ่า)|เพียะ|ฉาด|slap', p: P => { P.n(0, .09, { type: 'highpass', f: 1500, v: .8, a: .001 }); P.n(0, .05, { type: 'bandpass', f: 900, v: .4, a: .001 }); } },
 { id: 'chain', n: 'โซ่', k: 'โซ่|ตรวน|กุญแจมือ|chains?|shackle', p: P => { for (let i = 0; i < 8; i++) P.s(i * .06 + P.R() * .03, 2500 + P.R() * 2500, .12, { v: .08, a: .001 }); P.n(0, .5, { type: 'highpass', f: 3000, v: .1 }); } },
 // บ้าน ของใช้
 { id: 'steps', n: 'เสียงเดิน', k: 'ก้าวเดิน|เดินเข้า|เดินออก|เดินไป|เดินมา|เดินตาม|เดินวน|เดินช้า|ย่อง|ฝีเท้า|เสียงเท้า|ก้าวยาว|footsteps?|walked|tiptoe', p: P => { for (let i = 0; i < 4; i++) csFxStep(P, i * .42); } },
 { id: 'run', n: 'วิ่ง', k: 'วิ่ง|ออกวิ่ง|ran off|running|sprint', p: P => { for (let i = 0; i < 7; i++) csFxStep(P, i * .19, .5); } },
 { id: 'knock', n: 'เคาะประตู', k: 'เคาะประตู|เคาะ|ก๊อก ?ๆ|ก๊อก|knock', p: P => { for (let i = 0; i < 3; i++) { P.s(i * .18, 190, .1, { v: .6, a: .001, f2: 150 }); P.n(i * .18, .05, { type: 'bandpass', f: 1100, q: 3, v: .4, a: .001 }); } } },
 { id: 'creak', n: 'ประตูเอี๊ยด', k: 'เปิดประตู|ผลักประตู|แง้มประตู|บานพับ|เอี๊ยด|opened the door|creak', p: P => P.s(0, 260, 1.1, { type: 'sawtooth', path: [[.5, 420], [1.1, 330]], vib: [28, 30], bp: 900, q: 6, v: 1, a: .1 }) },
 { id: 'slam', n: 'ปิดประตูปัง', k: 'กระแทกประตู|ปิดประตูดัง|ปิดประตูปัง|ปิดประตูใส่|slammed|(?<!ขนม)ปัง(?!ๆ|กอน)', p: P => { P.s(0, 90, .4, { f2: 40, v: .9, a: .001 }); P.n(0, .5, { brown: 1, type: 'lowpass', f: 700, v: .8, a: .001 }); P.n(.03, .25, { type: 'bandpass', f: 1500, v: .2 }); } },
 { id: 'close', n: 'ปิดประตู', k: 'ปิดประตู|closed the door', p: P => { P.s(0, 110, .25, { f2: 60, v: .5, a: .002 }); P.n(0, .15, { brown: 1, type: 'lowpass', f: 900, v: .4, a: .002 }); } },
 { id: 'lock', n: 'กุญแจ', k: 'ไขกุญแจ|ลูกกุญแจ|ล็อกประตู|ปลดล็อก|คลิก|unlock|click', p: P => { P.n(0, .03, { type: 'bandpass', f: 3000, q: 3, v: .5, a: .001 }); P.n(.12, .04, { type: 'bandpass', f: 2000, q: 3, v: .6, a: .001 }); } },
 { id: 'glass', n: 'แก้วแตก', k: 'เพล้ง|แก้วแตก|กระจกแตก|จานแตก|แตกกระจาย|shatter', p: P => { P.n(0, .3, { type: 'highpass', f: 3000, v: .6, a: .001 }); for (let i = 0; i < 14; i++) P.s(P.R() * .5, 2500 + P.R() * 5000, .15 + P.R() * .3, { v: .06, a: .001 }); } },
 { id: 'clink', n: 'ชนแก้ว', k: 'ชนแก้ว|กริ๊ก|แก้วกระทบ|cheers|clink', p: P => { P.s(0, 3100, .6, { v: .18, a: .001 }); P.s(0, 4700, .4, { v: .1, a: .001 }); } },
 { id: 'coin', n: 'เหรียญ', k: 'เหรียญ|ถุงเงิน|เหรียญทอง|coins?', p: P => { P.s(0, 2600, .4, { v: .18, a: .001 }); P.s(.08, 3400, .5, { v: .15, a: .001 }); } },
 { id: 'paper', n: 'กระดาษ', k: 'พลิกหน้า|หน้ากระดาษ|กระดาษ|ฉีก|จดหมาย|page turn|paper|rustl', p: P => { for (let i = 0; i < 5; i++) P.n(i * .05, .08, { type: 'highpass', f: 2500, v: .2, a: .01 }); } },
 { id: 'typing', n: 'พิมพ์', k: 'พิมพ์ข้อความ|พิมพ์ตอบ|กดพิมพ์|แป้นพิมพ์|คีย์บอร์ด|typing|keyboard', p: P => { for (let i = 0; i < 12; i++) P.n(i * .09 + P.R() * .04, .02, { type: 'bandpass', f: 2000 + P.R() * 1500, q: 3, v: .8, a: .001 }); } },
 { id: 'camera', n: 'ถ่ายรูป', k: 'ถ่ายรูป|ชัตเตอร์|แชะ|กดถ่าย|camera|shutter', p: P => { P.n(0, .03, { type: 'highpass', f: 3000, v: .6, a: .001 }); P.n(.09, .04, { type: 'bandpass', f: 1800, v: .5, a: .001 }); } },
 { id: 'phone', n: 'โทรศัพท์', k: 'โทรศัพท์ดัง|มือถือดัง|โทรศัพท์สั่น|มือถือสั่น|สายเรียกเข้า|ริงโทน|phone rang|ringtone', p: P => { for (let i = 0; i < 2; i++) { P.s(i * 1.1, 880, .8, { type: 'square', lp: 2500, v: .1, vib: [18, 90], sus: 1 }); } } },
 { id: 'notif', n: 'แจ้งเตือน', k: 'แจ้งเตือน|ข้อความเข้า|ติ๊ง|notification|ding', p: P => { P.s(0, 1320, .5, { v: .25 }); P.s(.12, 1760, .7, { v: .25 }); } },
 { id: 'clock', n: 'นาฬิกา', k: 'นาฬิกา(?!ปลุก)|ติ๊กต็อก|tick-tock|ticking|clock', p: P => { for (let i = 0; i < 6; i++) P.n(i * .5, .02, { type: 'bandpass', f: i % 2 ? 3000 : 2400, q: 5, v: 1, a: .001 }); } },
 { id: 'alarm', n: 'นาฬิกาปลุก', k: 'นาฬิกาปลุก|สัญญาณเตือน|เสียงเตือนภัย|alarm|beep', p: P => { for (let i = 0; i < 6; i++) P.s(i * .25, 1000, .12, { type: 'square', lp: 3000, v: .1, sus: 1, a: .002 }); } },
 { id: 'bell', n: 'ระฆัง', k: 'ระฆัง|ฆ้อง|bell tolled|church bell|gong', p: P => [1, 2.76, 5.4, 8.93].forEach((m, i) => P.s(0, 330 * m, 3 / (i + 1), { v: .2 / (i + 1), a: .002 })) },
 { id: 'chime', n: 'กระดิ่ง', k: 'กระดิ่ง|กริ่ง|กดออด|เสียงออด|doorbell|chime|jingle', p: P => { P.s(0, 1319, .9, { v: .2 }); P.s(.35, 1047, 1.2, { v: .2 }); } },
 { id: 'crunch', n: 'เคี้ยว', k: 'กรุบ|เคี้ยว|งับ|กัดคำ|crunch|chew', p: P => { for (let i = 0; i < 4; i++) P.n(i * .22, .08, { type: 'bandpass', f: 1500 + P.R() * 1000, q: .8, v: .4, a: .003 }); } },
 { id: 'gulp', n: 'ดื่ม', k: 'อึก|กลืน|ซดน้ำ|ยกดื่ม|ดื่มรวด|gulp|drank', p: P => { P.s(0, 300, .12, { f2: 120, v: .4 }); P.s(.35, 280, .12, { f2: 110, v: .35 }); } },
 { id: 'stomach', n: 'ท้องร้อง', k: 'ท้องร้อง|ท้องประท้วง|stomach growl', p: P => P.s(0, 80, 1, { type: 'sawtooth', lp: 300, v: .25, a: .1, path: [[.4, 140], [1, 70]], vib: [12, 20] }) },
 { id: 'snore', n: 'กรน', k: 'กรน|snor', p: P => { for (let i = 0; i < 2; i++) P.n(i * 1.3, 1, { brown: 1, type: 'bandpass', f: 180, q: 3, v: 1, a: .4 }); } },
 { id: 'kiss', n: 'จุ๊บ', k: 'จุ๊บ|จูบ|หอมแก้ม|kiss', p: P => { P.n(0, .04, { type: 'bandpass', f: 2500, q: 2, v: .5, a: .001 }); P.s(0, 1200, .05, { f2: 600, v: .15, a: .001 }); } },
 { id: 'snap', n: 'ดีดนิ้ว', k: 'ดีดนิ้ว|snapped (?:his|her) fingers', p: P => P.n(0, .02, { type: 'highpass', f: 2500, v: .8, a: .001 }) },
 { id: 'clap', n: 'ปรบมือ', k: 'ปรบมือ|ตบมือ|เสียงเชียร์|โห่ร้อง|applause|clapp|cheered', p: P => { for (let i = 0; i < 60; i++) P.n(P.R() * 2.2, .03, { type: 'bandpass', f: 1200 + P.R() * 1500, q: 1.5, v: .15 + P.R() * .2, a: .001 }); } },
 { id: 'fall', n: 'ล้ม', k: 'ล้มลง|ล้มตึง|หกล้ม|ทรุดลง|ตกลงมา|ร่วงลง|ล้มทั้งยืน|ตุบ|ตึ้ง|thud|fell', p: P => csFxThud(P, 0) },
 { id: 'crash', n: 'โครม', k: 'โครม|พังทลาย|ถล่ม|พังลงมา|ชนกัน|พังยับ|crash|collapse', p: P => { P.n(0, 1.6, { brown: 1, type: 'lowpass', f: 1200, f2: 200, v: .9, a: .005 }); P.n(0, .8, { type: 'highpass', f: 2500, v: .3 }); [.15, .4, .7].forEach(t => csFxThud(P, t, .6)); } },
 { id: 'wood', n: 'ไม้หัก', k: 'ไม้หัก|กิ่งไม้หัก|หักดัง|กร๊อบ|แกร๊ก|crack', p: P => { P.n(0, .12, { type: 'bandpass', f: 1500, q: 1, v: .9, a: .001 }); P.s(0, 300, .1, { f2: 120, v: .3, a: .001 }); } },
 { id: 'heart', n: 'หัวใจเต้น', k: 'หัวใจเต้น|ใจเต้น|ตึกตัก|ตึก ?ตัก|heartbeat|heart pound', p: P => { for (let i = 0; i < 3; i++) { P.s(i * .8, 60, .12, { f2: 40, v: .9, a: .005 }); P.s(i * .8 + .22, 55, .14, { f2: 38, v: .7, a: .005 }); } } },
 // รถ เมือง
 { id: 'horn', n: 'แตรรถ', k: 'บีบแตร|แตรรถ|honk', p: P => { [0, .6].forEach(t => { P.s(t, 400, .45, { type: 'square', lp: 1500, v: .12, sus: 1 }); P.s(t, 500, .45, { type: 'square', lp: 1500, v: .12, sus: 1 }); }); } },
 { id: 'engine', n: 'เครื่องยนต์', k: 'เครื่องยนต์|สตาร์ทรถ|บิดคันเร่ง|ติดเครื่อง|เร่งเครื่อง|engine|revved', p: P => { P.s(0, 50, 1.8, { type: 'sawtooth', f2: 140, lp: 500, v: .4, a: .1, vib: [25, 5] }); P.n(0, 1.8, { brown: 1, type: 'lowpass', f: 300, v: .4, a: .2 }); } },
 { id: 'brake', n: 'เบรก', k: 'เบรก|ล้อเสียดสี|brakes?|screech', p: P => { P.s(0, 1800, .9, { type: 'sawtooth', bp: 2500, q: 8, v: .6, vib: [30, 60], a: .02 }); P.n(0, .9, { type: 'bandpass', f: 3000, v: .3, a: .02 }); } },
 { id: 'siren', n: 'ไซเรน', k: 'ไซเรน|หวอ|รถพยาบาล|รถตำรวจ|รถดับเพลิง|siren|ambulance', p: P => P.s(0, 650, 3, { type: 'square', lp: 2000, v: .1, a: .05, sus: 1, path: [[.75, 950], [1.5, 650], [2.25, 950], [3, 650]] }) },
 { id: 'train', n: 'รถไฟ', k: 'รถไฟ|หวูด|train(?!ing)', p: P => [466, 554, 698].forEach(f => P.s(0, f, 1.3, { type: 'sawtooth', lp: 1800, v: .07, a: .08, sus: 1 })) },
 { id: 'plane', n: 'เครื่องบิน', k: 'เครื่องบิน|เฮลิคอปเตอร์|airplane|plane|jet|helicopter', p: P => { P.n(0, 3, { brown: 1, type: 'lowpass', f: 200, f2: 600, v: .7, a: 1 }); P.s(0, 800, 3, { f2: 600, v: .02, a: 1 }); } },
 { id: 'fireworks', n: 'พลุ', k: 'พลุ|ดอกไม้ไฟ|firework', p: P => { P.s(0, 600, 1, { f2: 2500, v: .06, a: .05 }); P.n(1, .4, { type: 'lowpass', f: 2500, v: .8, a: .002 }); csFxCrackle(P, 1.2, 20, 1); } },
 // สัตว์
 { id: 'cat', n: 'แมว', k: 'เหมียว|เมี้ยว|ง้าว|แมว|meow|kitten|cats?', p: P => P.s(0, 480, .7, { type: 'sawtooth', path: [[.15, 820], [.45, 700], [.7, 520]], bp: 1200, q: 3, v: .35, a: .05, vib: [6, 8] }) },
 { id: 'purr', n: 'แมวคราง', k: 'ครางครืด|คลอเคลีย|purr', p: P => { for (let i = 0; i < 8; i++) P.n(i * .12, .1, { brown: 1, type: 'lowpass', f: 250, v: .5, a: .02 }); } },
 { id: 'dog', n: 'หมาเห่า', k: 'โฮ่ง|บ๊อก|เห่า|หมา(?!ป่า|ย|ก)|สุนัข|ลูกหมา|woof|bark|dogs?|puppy', p: P => { for (let i = 0; i < 2; i++) { P.s(i * .32, 300, .16, { type: 'sawtooth', f2: 170, bp: 700, q: 2, v: .6, a: .01 }); P.n(i * .32, .12, { type: 'bandpass', f: 900, v: .25, a: .01 }); } } },
 { id: 'wolf', n: 'หมาป่าหอน', k: 'หมาป่า|หอน(?!าฬิกา)|howl|wol(?:f|ves)', p: P => { P.s(0, 380, 2.5, { path: [[.6, 700], [2, 560], [2.4, 420]], vib: [5, 12], v: .3, a: .3 }); P.s(0, 760, 2.5, { path: [[.6, 1400], [2, 1120], [2.4, 840]], v: .06, a: .3 }); } },
 { id: 'roar', n: 'คำราม', k: 'คำราม|แยกเขี้ยว|เสือ(?!ก)|สิงโต|หมี(?!่)|มังกร|สัตว์ประหลาด|ปีศาจ|อสูร|roar|growl|dragon|monster|tiger|lion|beast', p: P => { P.s(0, 80, 1.4, { type: 'sawtooth', path: [[.4, 120], [1.4, 70]], lp: 700, v: .6, a: .1, vib: [20, 6] }); P.n(0, 1.4, { brown: 1, type: 'lowpass', f: 800, v: .5, a: .1 }); } },
 { id: 'horse', n: 'ม้า', k: 'ม้า(?!นั่ง)|ควบม้า|กีบเท้า|horse|gallop', p: P => { for (let i = 0; i < 4; i++) [0, .08, .16].forEach(d => { const t = i * .36 + d; P.s(t, 260, .06, { v: .5, a: .001, f2: 180 }); P.n(t, .04, { type: 'bandpass', f: 1500, q: 3, v: .2, a: .001 }); }); } },
 { id: 'cow', n: 'วัว', k: 'วัว|มอ ?ๆ|cows?|moo', p: P => P.s(0, 140, 1.4, { type: 'sawtooth', path: [[.3, 160], [1.3, 120]], lp: 800, v: .35, a: .15 }) },
 { id: 'sheep', n: 'แกะ', k: 'แกะ(?!สลัก|ออก|ห่อ|กล่อง|รอย|มือ)|แพะ(?!รับบาป)|แบ๊ะ|sheep|goat', p: P => P.s(0, 400, .8, { type: 'sawtooth', vib: [9, 30], bp: 1200, q: 2, v: .3, a: .05 }) },
 { id: 'elephant', n: 'ช้าง', k: 'ช้าง|elephant', p: P => P.s(0, 400, .9, { type: 'sawtooth', path: [[.3, 700], [.9, 600]], lp: 2500, v: .3, vib: [10, 20], a: .05 }) },
 { id: 'rooster', n: 'ไก่ขัน', k: 'ไก่ขัน|เอ้กอี้|rooster', p: P => P.s(0, 500, 1.3, { type: 'sawtooth', path: [[.2, 700], [.35, 650], [.6, 900], [1.2, 600]], bp: 1400, q: 2, v: .3, vib: [30, 15], a: .03 }) },
 { id: 'hen', n: 'ไก่', k: '(?<!ข้าวมัน|น่อง|เนื้อ|ปีก)ไก่(?!ทอด|ย่าง|ต้ม|ผัด|ไข่|งวง)|กุ๊ก|chicken|hens?', p: P => { for (let i = 0; i < 4; i++) P.s(i * .15, 500, .07, { type: 'sawtooth', bp: 1000, q: 3, v: .3, a: .005 }); } },
 { id: 'duck', n: 'เป็ด', k: 'เป็ด|ก๊าบ|ducks?|quack', p: P => { [0, .25].forEach(t => P.s(t, 300, .15, { type: 'square', bp: 1100, q: 4, v: .9, a: .01 })); } },
 { id: 'bird', n: 'นก', k: 'นกร้อง|เสียงนก|ฝูงนก|นกน้อย|จิ๊บ|ทวีต|chirp|birdsong|birds?', p: P => { for (let i = 0; i < 5; i++) P.s(i * .13, 3200 + P.R() * 1500, .08, { f2: 4800 + P.R() * 1000, v: .12, a: .005 }); } },
 { id: 'crow', n: 'อีกา', k: 'อีกา|กาดำ|crow(?!d)|raven', p: P => { [0, .4].forEach(t => P.s(t, 700, .25, { type: 'sawtooth', f2: 500, bp: 1300, q: 1.5, v: .35, a: .01, vib: [50, 40] })); } },
 { id: 'owl', n: 'นกฮูก', k: 'นกฮูก|ฮูก|owl|hoot', p: P => { P.s(0, 420, .35, { f2: 390, v: .25, a: .05 }); P.s(.55, 430, .25, { v: .2 }); P.s(.85, 410, .5, { f2: 370, v: .22, a: .05 }); } },
 { id: 'wings', n: 'กระพือปีก', k: 'กระพือปีก|ขยับปีก|โผบิน|flap|wings', p: P => { for (let i = 0; i < 6; i++) P.n(i * .12, .08, { brown: 1, type: 'lowpass', f: 700, v: .5, a: .02 }); } },
 { id: 'frog', n: 'กบ', k: 'กบ(?!ฏ)|อ๊บ|คางคก|frog|croak', p: P => { [0, .35].forEach(t => P.s(t, 180, .18, { type: 'square', bp: 600, q: 4, v: .25, vib: [40, 40], a: .01 })); } },
 { id: 'snake', n: 'งู', k: 'งู|ฟ่อ|hiss|snake', p: P => P.n(0, 1.2, { type: 'highpass', f: 4000, v: .25, a: .1 }) },
 { id: 'bee', n: 'ผึ้ง', k: 'ผึ้ง|แมลงวัน|ยุง|หึ่ง|buzz|bees?|mosquito', p: P => P.s(0, 230, 1.5, { type: 'sawtooth', lp: 2000, v: .25, a: .2, vib: [7, 25] }) },
 // แฟนตาซี บรรยากาศ
 { id: 'magic', n: 'เวทมนตร์', k: 'เวทมนตร์|เวทย์|คาถา|ร่ายเวท|ร่ายมนตร์|มนตร์|ประกายแสง|วิ้ง|แสงวาบ|magic|spell|sparkl', p: P => { [1047, 1319, 1568, 2093, 2637, 3136].forEach((f, i) => P.s(i * .07, f, .8, { v: .1, a: .005 })); P.n(0, 1, { type: 'highpass', f: 6000, v: .08, a: .2 }); } },
 { id: 'warp', n: 'วาร์ป', k: 'วาร์ป|เทเลพอร์ต|หายวับ|ปรากฏตัว|teleport|vanish', p: P => { P.s(0, 200, .6, { f2: 2000, v: .15, a: .02 }); P.n(0, .6, { type: 'bandpass', f: 500, f2: 5000, q: 3, v: .2, a: .1 }); } },
 { id: 'zap', n: 'ไฟช็อต', k: 'ไฟช็อต|ไฟฟ้า|ช็อต|ประกายไฟ|กระแสไฟ|zap|electric|spark', p: P => { P.s(0, 120, .6, { type: 'sawtooth', v: .18, vib: [60, 80], lp: 3000, a: .005 }); P.n(0, .6, { type: 'bandpass', f: 3000, q: .7, v: .2, a: .005 }); csFxCrackle(P, 0, 8, .6); } },
 { id: 'laser', n: 'เลเซอร์', k: 'เลเซอร์|ลำแสง|laser|beam', p: P => { [0, .18].forEach(t => P.s(t, 1600, .25, { type: 'square', f2: 200, lp: 3000, v: .12, a: .002 })); } },
 { id: 'ghost', n: 'หลอน', k: 'ผี(?!เสื้อ)|วิญญาณ|หลอน|ขนลุก|สยอง|ghost|haunt|eerie|creepy', p: P => { P.s(0, 220, 3, { v: .12, a: 1, vib: [.5, 8] }); P.s(0, 233, 3, { v: .1, a: 1 }); P.s(0, 330, 3, { v: .06, a: 1.2, vib: [.3, 10] }); } },
 // ดนตรี
 { id: 'drum', n: 'กลอง', k: 'ตีกลอง|กลอง|ตึ่ง|drum', p: P => { for (let i = 0; i < 3; i++) P.s(i * .18, 150 - i * 25, .3, { f2: 60, v: .8, a: .002 }); P.n(0, .1, { brown: 1, type: 'lowpass', f: 800, v: .4 }); } },
 { id: 'piano', n: 'เปียโน', k: 'เปียโน|piano', p: P => [523, 659, 784].forEach((f, i) => { P.s(i * .12, f, 1.4, { type: 'triangle', v: .2, a: .003 }); P.s(i * .12, f * 2, .8, { v: .05, a: .003 }); }) },
 { id: 'guitar', n: 'กีตาร์', k: 'กีตาร์|ดีดกีตาร์|guitar|strum', p: P => [196, 247, 294, 392, 494].forEach((f, i) => P.s(i * .04, f, 1.5, { type: 'triangle', v: .15, a: .002, lp: 2500 })) },
 { id: 'violin', n: 'ไวโอลิน', k: 'ไวโอลิน|violin|cello', p: P => P.s(0, 440, 1.4, { type: 'sawtooth', lp: 3000, vib: [5.5, 6], v: .12, a: .25, sus: 1 }) },
 { id: 'flute', n: 'ขลุ่ย', k: 'ขลุ่ย|ฟลุต|flute', p: P => { P.s(0, 880, .6, { vib: [5, 8], v: .15, a: .08 }); P.s(.55, 988, .8, { vib: [5, 8], v: .15, a: .05 }); } },
 { id: 'whistle', n: 'ผิวปาก', k: 'ผิวปาก|whistl', p: P => P.s(0, 1500, .8, { path: [[.3, 2200], [.8, 1800]], v: .15, a: .03 }) },
 // ★ 1.32 คน · ของตก
 { id: 'chatter', n: 'คนคุยกัน', k: '', p: P => { const vs = 'aeiou'; for (let i = 0; i < 22; i++) { const f0 = [130, 200, 250][i % 3] * (.9 + P.R() * .2); csFxVox(P, P.R() * 2.2, f0, .12 + P.R() * .14, vs[Math.floor(P.R() * 5)], { v: .35, f2: f0 * (.85 + P.R() * .3) }); } } },
 { id: 'laugh', n: 'หัวเราะ', k: '', p: P => { for (let i = 0; i < 6; i++) { csFxVox(P, i * .16, 230 - i * 8, .1, 'a', { v: .45, a: .01 }); P.n(i * .16, .09, { type: 'bandpass', f: 1500, v: .08 }); } } },
 { id: 'giggle', n: 'คิกคัก', k: '', p: P => { for (let i = 0; i < 5; i++) csFxVox(P, i * .11, 400 + P.R() * 40, .07, 'i', { v: .8, a: .008 }); } },
 { id: 'cry', n: 'ร้องไห้', k: '', p: P => { for (let i = 0; i < 3; i++) { csFxVox(P, i * .6, 330, .48, 'u', { path: [[.15, 380], [.48, 260]], vib: [7, 12], v: .35, a: .05 }); P.n(i * .6 + .5, .12, { type: 'bandpass', f: 1200, v: .12 }); } } },
 { id: 'scream', n: 'กรี๊ด', k: '', p: P => csFxVox(P, 0, 900, 1.2, 'a', { path: [[.2, 1100], [1.2, 800]], vib: [8, 40], v: .45, a: .03 }) },
 { id: 'gasp', n: 'เฮือก', k: '', p: P => P.n(0, .4, { type: 'bandpass', f: 900, f2: 2200, q: 1.5, v: .45, a: .1 }) },
 { id: 'sigh', n: 'ถอนหายใจ', k: '', p: P => P.n(0, 1.3, { type: 'bandpass', f: 1100, f2: 450, q: 1.2, v: .4, a: .25 }) },
 { id: 'cough', n: 'ไอ', k: '', p: P => { for (let i = 0; i < 3; i++) { P.n(i * .32, .14, { type: 'lowpass', f: 1600, v: .6, a: .005 }); P.s(i * .32, 180, .1, { f2: 90, v: .25 }); } } },
 { id: 'sneeze', n: 'จาม', k: '', p: P => { P.n(0, .45, { type: 'bandpass', f: 700, f2: 1600, v: .3, a: .35 }); P.n(.5, .22, { type: 'highpass', f: 1500, v: .8, a: .003 }); } },
 { id: 'yawn', n: 'หาว', k: '', p: P => csFxVox(P, 0, 260, 1.4, 'a', { path: [[.4, 420], [1.4, 200]], v: .3, a: .2 }) },
 { id: 'drop', n: 'ของตก', k: '', p: P => { P.s(0, 200, .12, { f2: 90, v: .6, a: .002 }); P.n(0, .1, { type: 'bandpass', f: 1200, v: .4, a: .002 }); P.s(.24, 240, .07, { f2: 120, v: .3 }); P.n(.24, .05, { type: 'bandpass', f: 1400, v: .2 }); P.s(.4, 260, .05, { v: .15 }); } },
 // ★ 1.34 เสียงใหม่จากชุดเสียงจริง (ไม่มีไฟล์ = เสียงสังเคราะห์ง่าย ๆ)
 { id: 'pig', n: 'หมู', k: '', p: P => { for (let i = 0; i < 3; i++) P.s(i * .2, 250, .12, { type: 'sawtooth', bp: 800, q: 3, v: .4, vib: [40, 50] }); } },
 { id: 'baby', n: 'เด็กร้องไห้', k: '', p: P => { for (let i = 0; i < 2; i++) csFxVox(P, i * .8, 450, .7, 'a', { path: [[.2, 520], [.7, 380]], vib: [6, 20], v: .4, a: .05 }); } },
 { id: 'can', n: 'เปิดกระป๋อง', k: '', p: P => { P.n(0, .03, { type: 'highpass', f: 2000, v: .6, a: .001 }); P.n(.03, .8, { type: 'highpass', f: 5000, v: .2, a: .01 }); } },
 { id: 'heli', n: 'เฮลิคอปเตอร์', k: '', p: P => { for (let i = 0; i < 16; i++) P.n(i * .1, .07, { brown: 1, type: 'lowpass', f: 600, v: .5, a: .005 }); } },
 { id: 'chainsaw', n: 'เลื่อยยนต์', k: '', p: P => P.s(0, 110, 2, { type: 'sawtooth', lp: 2500, v: .3, vib: [30, 20], a: .1, sus: 1 }) },
 { id: 'saw', n: 'เลื่อย', k: '', p: P => { for (let i = 0; i < 4; i++) P.n(i * .35, .3, { type: 'bandpass', f: 1500, f2: 2500, q: 2, v: .35, a: .1 }); } },
 { id: 'vacuum', n: 'ดูดฝุ่น', k: '', p: P => P.n(0, 2, { type: 'bandpass', f: 900, q: .8, v: .4, a: .2, sus: 1 }) },
 { id: 'washer', n: 'เครื่องซักผ้า', k: '', p: P => P.n(0, 2.5, { brown: 1, type: 'lowpass', f: 400, v: .5, a: .3, sus: 1 }) },
 { id: 'flush', n: 'ชักโครก', k: '', p: P => P.n(0, 2, { type: 'bandpass', f: 800, f2: 300, q: .7, v: .5, a: .1 }) },
 { id: 'brush', n: 'แปรงฟัน', k: '', p: P => { for (let i = 0; i < 8; i++) P.n(i * .18, .14, { type: 'highpass', f: 3000, v: .25, a: .03 }); } },
 { id: 'waves', n: 'คลื่นซัด', k: '', p: P => { P.n(0, 2.5, { brown: 1, type: 'lowpass', f: 300, f2: 1500, v: .7, a: .8 }); P.n(.8, 1.7, { type: 'highpass', f: 2500, v: .2, a: .3 }); } },
 { id: 'downpour', n: 'ฝนตกหนัก', k: '', p: P => P.n(0, 3, { type: 'bandpass', f: 2500, q: .5, v: .45, a: .4 }) },
 { id: 'clatter', n: 'ของโลหะตก', k: '', p: P => { [0, .18, .3].forEach((t, k) => { P.n(t, .05, { type: 'bandpass', f: 2500, v: .5 / (k + 1), a: .001 }); [2100, 3300, 4700].forEach(f => P.s(t, f * (1 + k * .03), .4, { v: .08 / (k + 1), a: .001 })); }); } }
];
/** ★ 1.32 จับเฉพาะคำเสียงตรง ๆ หรือวลีที่บอกว่ามีเสียงจริง — แค่เอ่ยชื่อสัตว์/สิ่งของไม่ดัง */
const CS_SFX_K = {
 thunder: 'ฟ้าผ่า|ฟ้าร้อง|ฟ้าคำราม|เปรี้ยง|ครืน ?ๆ|thunderclap|lightning struck',
 gust: 'ลมกระโชก|หวีดหวิว|gust of wind|wind howled',
 quake: 'แผ่นดินไหว|พื้นสั่นสะเทือน|earthquake',
 splash: 'ตูมลงน้ำ|กระโดดลงน้ำ|ตกลงไปในน้ำ|น้ำกระเซ็น|จ๋อม|splashed',
 drip: 'ติ๋ง ?ๆ|ติ๋ง|น้ำหยดติ๋ง|dripping',
 pour: 'รินน้ำ|รินชา|รินไวน์|รินเหล้า|poured',
 bubble: 'ปุด ?ๆ|เดือดปุด|bubbling',
 flame: 'พรึ่บ|ไฟลุกท่วม|ลุกเป็นไฟ|burst into flames',
 gun: 'ยิงปืน|เสียงปืน|ปืนลั่น|ลั่นไก|เหนี่ยวไก|(?<!ขนม)ปัง(?= ?!)|gunshot|opened fire',
 mgun: 'ปืนกล|ยิงรัว|กระสุนรัว|ห่ากระสุน|machine ?gun',
 reload: 'บรรจุกระสุน|ขึ้นลำ|ง้างนก|reloaded',
 cannon: 'ยิงปืนใหญ่|ปืนใหญ่ยิง|cannon fire',
 boom: 'ระเบิดดัง|ระเบิดขึ้น|ระเบิดออก|ตูม(?!ลงน้ำ)|บึ้ม|exploded|explosion',
 swdraw: 'ชักดาบ|ถอดดาบ|ชักกระบี่|ถอดกระบี่|unsheathed',
 swclash: 'ดาบกระทบ|ปะทะดาบ|เคร้ง|แกร๊ง|swords clashed|clang',
 slash: 'ฉึก|แทงเข้า|slashed|stabbed',
 arrow: 'ยิงธนู|ปล่อยลูกธนู|ลูกธนูพุ่ง|ฟิ้ว|loosed an arrow',
 whip: 'ฟาดแส้|เพี้ยะ|cracked the whip',
 whoosh: 'ฟึ่บ|ฟุ่บ|หวือ|whoosh|swoosh',
 punch: 'ต่อยเข้า|ชกเข้า|ผลัวะ|พลั่ก|ตุ้บ|โป๊ก|punched',
 slap: 'ตบหน้า|เพียะ|ฉาด|slapped',
 chain: 'โซ่กระทบ|เสียงโซ่|chains rattled',
 steps: 'เสียงฝีเท้า|เสียงเท้า|ย่องเข้ามา|footsteps',
 run: 'วิ่งตึงตัง|ตึงตัง|วิ่งหนี|ran away',
 knock: 'เคาะประตู|ก๊อก ?ๆ|ก๊อก|knocked on the door',
 creak: 'เอี๊ยด|ประตูลั่น|creaked',
 slam: 'กระแทกประตู|ปิดประตูดังปัง|ปิดประตูปัง|slammed',
 close: 'ปิดประตูเบา ?ๆ|closed the door',
 lock: 'ไขกุญแจ|แกร๊ก|unlocked',
 glass: '(?:แก้ว|จาน|ชาม|กระจก|ขวด|แจกัน|ถ้วย)\\S{0,8}?แตก|เพล้ง|shattered',
 clink: 'ชนแก้ว|แก้วกระทบกัน|clinked',
 coin: 'เหรียญกระทบ|เหรียญหล่น|coins jingled',
 paper: 'พลิกหน้ากระดาษ|ฉีกกระดาษ|ขยำกระดาษ|turned the page',
 typing: 'รัวแป้นพิมพ์|ต๊อกแต๊ก|typing',
 camera: 'แชะ|ชัตเตอร์|shutter clicked',
 phone: 'โทรศัพท์ดัง|มือถือดัง|เสียงเรียกเข้า|ริงโทน|phone rang',
 notif: 'ติ๊ง|เสียงแจ้งเตือน|ding',
 clock: 'ติ๊กต็อก|tick-tock',
 alarm: 'นาฬิกาปลุกดัง|เสียงนาฬิกาปลุก|สัญญาณเตือนภัย|alarm went off',
 bell: 'ระฆังดัง|ตีระฆัง|เสียงระฆัง|เหง่ง|ตีฆ้อง|bell tolled',
 chime: 'กดกริ่ง|กดออด|กริ่งดัง|เสียงกระดิ่ง|กรุ๊งกริ๊ง|doorbell',
 crunch: 'กรุบ|กร้วม|crunch',
 gulp: 'อึก ?ๆ|อึกใหญ่|gulped',
 stomach: 'ท้องร้อง|โครกคราก|stomach growled',
 snore: 'กรนเสียงดัง|ครอก|snored',
 kiss: 'จุ๊บ|ฟอด|kissed',
 snap: 'ดีดนิ้ว|snapped (?:his|her) fingers',
 clap: 'ปรบมือ|เสียงเชียร์|applause',
 fall: 'ล้มตึง|ล้มลงกับพื้น|ล้มโครม|ตุบ|ตึ้ง|thud',
 crash: 'โครม|พังครืน|ถล่มลงมา|crashed',
 wood: 'กิ่งไม้หัก|ไม้หัก|กร๊อบ|snapped in two',
 heart: 'ตึกตัก|หัวใจเต้นแรง|heart pounded',
 horn: 'บีบแตร|ปี๊น|honked',
 engine: 'สตาร์ทรถ|บิดคันเร่ง|เร่งเครื่อง|บรื้น|engine roared|revved',
 brake: 'เบรกดังเอี๊ยด|ล้อเสียดสี|เบรกกะทันหัน|screeched',
 siren: 'ไซเรน|เสียงหวอ|หวอ ?ๆ|siren',
 train: 'หวูดรถไฟ|ฉึกฉัก|train whistle',
 plane: 'เครื่องบินบินผ่าน|เสียงเครื่องบิน|jet roared',
 fireworks: 'จุดพลุ|พลุแตก|ดอกไม้ไฟ|fireworks',
 cat: 'เหมียว|เมี้ยว|แมวร้อง|meowed',
 purr: 'ครางครืด|แมวคราง|purring',
 dog: 'โฮ่ง|บ๊อก|หมาเห่า|เสียงเห่า|woof|barked',
 wolf: 'หมาป่าหอน|หอนยาว|โหยหวน|howled',
 roar: 'คำราม|roared|growled',
 horse: 'ควบม้า|กีบม้า|กุบกับ|galloped',
 cow: 'มอ ?ๆ|วัวร้อง|mooed',
 sheep: 'แบ๊ะ|แกะร้อง|bleated',
 elephant: 'ช้างร้อง|แปร๋น|trumpeted',
 rooster: 'ไก่ขัน|เอ้กอี้|crowed',
 hen: 'กุ๊ก ?ๆ|ไก่ร้อง|clucked',
 duck: 'ก๊าบ|เป็ดร้อง|quacked',
 bird: 'นกร้อง|เสียงนก|จิ๊บ ?ๆ|chirped|birdsong',
 crow: 'อีการ้อง|cawed',
 owl: 'นกฮูกร้อง|ฮู้ ?ๆ|hooted',
 wings: 'กระพือปีก|พึ่บพั่บ|flapped',
 frog: 'อ๊บ|กบร้อง|croaked',
 snake: 'ฟ่อ|hissed',
 bee: 'หึ่ง|buzzed',
 magic: 'ร่ายเวท|ร่ายคาถา|วิ้ง|แสงวาบ|cast (?:a|the) spell',
 warp: 'วาร์ป|เทเลพอร์ต|หายวับ|teleported',
 zap: 'ไฟช็อต|ไฟฟ้าช็อต|zapped',
 laser: 'ยิงเลเซอร์|ลำแสงพุ่ง|laser fired',
 ghost: 'ขนลุกซู่|เสียงหลอน|ghostly wail',
 drum: 'ตีกลอง|ตึ่ง ?ๆ|drums beat',
 piano: 'เล่นเปียโน|piano played',
 guitar: 'ดีดกีตาร์|เล่นกีตาร์|strummed',
 violin: 'สีไวโอลิน|เล่นไวโอลิน',
 flute: 'เป่าขลุ่ย|เป่าฟลุต',
 whistle: 'ผิวปาก|whistled',
 chatter: 'เสียงคุยจอแจ|จอแจ|เซ็งแซ่|พูดคุยกันเสียงดัง|chatter',
 laugh: 'ฮ่า ?ๆ|ฮ่าฮ่า|หัวเราะลั่น|หัวเราะเสียงดัง|หัวเราะร่า|laughed out loud',
 giggle: 'คิกคัก|คิก ?ๆ|giggled',
 cry: 'ฮือ ?ๆ|สะอื้น|ร้องไห้โฮ|sobbed',
 scream: 'กรี๊ด|กรีดร้อง|screamed',
 gasp: 'เฮือก|gasped',
 sigh: 'เฮ้อ|ถอนหายใจ|sighed',
 cough: 'แค่ก ?ๆ|ไอค่อกแค่ก|กระแอม|coughed',
 sneeze: 'ฮัดชิ่ว|ฮัดเช้ย|sneezed',
 yawn: 'หาวหวอด|yawned',
 drop: 'หล่นลงพื้น|ตกลงพื้น|ร่วงลงพื้น|หล่นตุ้บ|ตกพื้น|dropped',
 clatter: '(?:ช้อน|ส้อม|มีด|กระทะ|ถาด)\\S{0,6}?(?:หล่น|ตก)|เคร้งคร้าง|clattered',
 pig: 'อู๊ด ?ๆ|อู๊ด|หมูร้อง|oinked',
 baby: 'เด็กร้องไห้|ทารกร้อง|เสียงเด็กร้อง|อุแว้|baby cried',
 can: 'เปิดกระป๋อง|ดึงฝากระป๋อง|cracked open a can',
 heli: 'เฮลิคอปเตอร์|helicopter',
 chainsaw: 'เลื่อยยนต์|chainsaw',
 saw: 'เลื่อยไม้|ชักเลื่อย|sawing',
 vacuum: 'ดูดฝุ่น|vacuuming',
 washer: 'เครื่องซักผ้า|washing machine',
 flush: 'กดชักโครก|flushed',
 brush: 'แปรงฟัน|brushed (?:his|her|my) teeth',
 waves: 'คลื่นซัด|คลื่นกระทบฝั่ง|คลื่นกระทบโขดหิน|waves crashed',
 downpour: 'ฝนตกหนัก|ฝนเทลงมา|ฝนกระหน่ำ|ห่าฝน|pouring rain'
};
CS_SFX.forEach(x => { if (CS_SFX_K[x.id] !== undefined) x.k = CS_SFX_K[x.id]; });
/** ★ 1.34 คำค้นภาษาอังกฤษ (หาเสียงจริงใน Pixabay · จับคู่ชื่อไฟล์) */
const CS_SFX_EN = {"thunder": "thunder", "gust": "wind gust", "quake": "earthquake rumble", "splash": "water splash", "drip": "water drip", "pour": "pouring water", "bubble": "bubbles", "flame": "fire whoosh", "gun": "gunshot", "mgun": "machine gun", "reload": "gun reload", "cannon": "cannon", "boom": "explosion", "swdraw": "sword unsheath", "swclash": "sword clash", "slash": "sword slash", "arrow": "arrow", "whip": "whip crack", "whoosh": "whoosh", "punch": "punch", "slap": "slap", "chain": "chains", "steps": "footsteps", "run": "running footsteps", "knock": "door knock", "creak": "door creak", "slam": "door slam", "close": "door close", "lock": "key lock", "glass": "glass break", "clink": "glass clink", "coin": "coins", "paper": "paper", "typing": "keyboard typing", "camera": "camera shutter", "phone": "phone ringing", "notif": "notification", "clock": "clock ticking", "alarm": "alarm clock", "bell": "church bell", "chime": "doorbell", "crunch": "crunch eating", "gulp": "gulp", "stomach": "stomach growl", "snore": "snoring", "kiss": "kiss", "snap": "finger snap", "clap": "applause", "fall": "body fall", "crash": "crash", "wood": "wood crack", "heart": "heartbeat", "horn": "car horn", "engine": "car engine", "brake": "tire screech", "siren": "siren", "train": "train whistle", "plane": "airplane", "fireworks": "fireworks", "cat": "cat meow", "purr": "cat purr", "dog": "dog bark", "wolf": "wolf howl", "roar": "monster roar", "horse": "horse gallop", "cow": "cow moo", "sheep": "sheep", "elephant": "elephant", "rooster": "rooster", "hen": "chicken", "duck": "duck quack", "bird": "birds chirping", "crow": "crow", "owl": "owl", "wings": "wings flapping", "frog": "frog", "snake": "snake hiss", "bee": "bee buzz", "magic": "magic spell", "warp": "teleport", "zap": "electric zap", "laser": "laser", "ghost": "ghost", "drum": "drum", "piano": "piano", "guitar": "guitar strum", "violin": "violin", "flute": "flute", "whistle": "whistling", "chatter": "crowd talking", "laugh": "laugh", "giggle": "giggle", "cry": "crying", "scream": "scream", "gasp": "gasp", "sigh": "sigh", "cough": "cough", "sneeze": "sneeze", "yawn": "yawn", "drop": "object drop", "clatter": "metal clatter", "pig": "pig", "baby": "baby crying", "can": "can opening", "heli": "helicopter", "chainsaw": "chainsaw", "saw": "hand saw", "vacuum": "vacuum cleaner", "washer": "washing machine", "flush": "toilet flush", "brush": "brushing teeth", "waves": "waves crashing", "downpour": "heavy rain"};
CS_SFX.forEach(x => { x.re = x.k ? new RegExp(x.k, 'gi') : null; });
/** หาเสียงในข้อความ: ไม่ซ้อนกัน อันที่เริ่มก่อนและยาวกว่าชนะ */
function csSfxFind(text) {
 const t = String(text || ''), all = [];
 CS_SFX.forEach(x => { if (!x.re) return; x.re.lastIndex = 0; let m; while ((m = x.re.exec(t))) {
  if (!m[0]) { x.re.lastIndex++; continue; }
  // คำอังกฤษต้องเป็นคำเต็ม (cat ไม่ติดใน location) ยอมให้มีท้ายคำ s/ed/ing
  if (/^[a-z]/i.test(m[0]) && /[a-z]/i.test(t[m.index - 1] || '')) continue;
  if (/[a-z]$/i.test(m[0])) { const tail = (t.slice(m.index + m[0].length).match(/^[a-z]*/i) || [''])[0]; if (tail && !/^(e|s|es|ed|d|ing|y|er|ers)$/i.test(tail)) continue; }
  all.push({ id: x.id, i: m.index, len: m[0].length }); } });
 all.sort((a, b) => a.i - b.i || b.len - a.len);
 const out = []; let end = 0;
 all.forEach(h => { if (h.i >= end) { out.push(h); end = h.i + h.len; } });
 return out;
}
let csSfxOut = null, csSfxCur = null, csSfxBusyUntil = 0, csSfxPending = null, csSfxT = 0;
/** เล่นเสียงเดียวทันที (ตัดเสียงที่ค้างอยู่ให้ค่อย ๆ เงียบ) · คืนความยาวเป็นวินาที */
function csSfxRun(id) {
 const b = csSfxBufs.get(id);
 if (b) return csSfxRunBuf(id, b);
 if (csSfxFiles && csSfxFiles[id]) {
  // มีไฟล์จริงแต่ยังโหลดไม่เสร็จ: รอไฟล์ ไม่เล่นเสียงสังเคราะห์แทน
  const t0 = Date.now();
  csSfxBusyUntil = Date.now() + 1500;
  csSfxBuf(id).then(bb => { if (bb && Date.now() - t0 < 4000) csSfxRunBuf(id, bb); else if (!bb) csSfxRunSynth(id); });
  return 1;
 }
 return csSfxRunSynth(id);
}
function csSfxRunSynth(id) {
 const x = CS_SFX.find(e => e.id === id);
 const ac = x && csAc();
 if (!ac || typeof ac.createBiquadFilter !== 'function') return 0;
 try {
  if (!csSfxOut || csSfxOut.context !== ac) { csSfxOut = ac.createGain(); csSfxOut.connect(csMaster(ac)); }
  csSfxOut.gain.value = Math.max(0, Math.min(1, +csCfg().sfxVol || 0));
  csSfxStopCur();
  const g = ac.createGain(); g.gain.value = 1; g.connect(csSfxOut);
  const P = csSfxP(ac, g, ac.currentTime + .02);
  x.p(P);
  const dur = Math.min(4, P.end || .5);
  csSfxCur = { g, ac };
  csSfxPill(x.n);
  csSfxBusyUntil = Date.now() + dur * 1000 + 450; // เว้นจังหวะก่อนเสียงถัดไป
  return dur;
 } catch { return 0; }
}
function csSfxStopCur() {
 const c = csSfxCur;
 csSfxCur = null;
 if (c) { try { c.g.gain.setTargetAtTime(0, c.ac.currentTime, .05); } catch {} }
}
/** แตะเล่น/ลองฟัง: เล่นเลย ล้างคิว */
function csSfxPlay(id, force) {
 if (!CS_SFX.some(e => e.id === id) || (csCfg().sfx === 'off' && !force)) return false;
 clearTimeout(csSfxT); csSfxPending = null;
 return csSfxRun(id) > 0;
}
/** อัตโนมัติ: เข้าคิว รอเสียงก่อนหน้าจบ · เลื่อนเร็วจนค้างหลายอัน = เอาอันล่าสุดอันเดียว (แบบเว็บตูน) */
function csSfxQueue(id, delay) {
 csSfxPending = id;
 csSfxBuf(id); // เริ่มโหลดไฟล์ไว้ก่อนถึงคิว
 clearTimeout(csSfxT);
 const wait = Math.max(delay ?? 350, csSfxBusyUntil - Date.now());
 csSfxT = setTimeout(() => { const p = csSfxPending; csSfxPending = null; if (p && csCfg().sfx !== 'off') csSfxRun(p); }, wait);
}
/** เสียงของบรรทัดนี้: เสียงเดียว (คำแรก) เข้าคิว · บรรทัดเดิมไม่ซ้ำภายใน 3 วิ */
function csSfxPlayIn(el, reading) {
 const s = csCfg();
 if (!el || s.sfx === 'off' || (s.sfx === 'tap' && !reading)) return 0;
 if (el._sfxAt && Date.now() - el._sfxAt < 3000) return 0;
 const sp = el.querySelector('.cs-sfx');
 if (!sp) return 0;
 el._sfxAt = Date.now();
 const id = sp.dataset.sfx;
 csSfxQueue(id, reading ? 150 : 350);
 const flash = () => { sp.classList.add('cs-sfxon'); setTimeout(() => sp.classList.remove('cs-sfxon'), 700); };
 setTimeout(flash, Math.max(350, csSfxBusyUntil - Date.now()));
 return 1;
}
const CS_SFX_SKIP = '.cs-code, .cs-html, code, pre, .cs-sfx, .cs-cmt, button, .cs-nwho, .cs-name, .cs-turn';
/** ใส่เส้นประใต้คำที่มีเสียง (ครั้งเดียวต่อบรรทัด) · คืนบรรทัดที่เพิ่งทำ */
function csSfxDecorate(root) {
 if (!root || csCfg().sfx === 'off') return [];
 const fresh = [];
 root.querySelectorAll(CS_MARK_SEL).forEach(el => {
  if (el.dataset.sfxd) return;
  el.dataset.sfxd = '1';
  const w = document.createTreeWalker(el, 4, { acceptNode: n => (n.parentElement && n.parentElement.closest(CS_SFX_SKIP) ? 2 : 1) });
  const nodes = [];
  while (w.nextNode()) nodes.push(w.currentNode);
  let any = false;
  nodes.forEach(tn => {
   const v = tn.nodeValue, hits = csSfxFind(v);
   if (!hits.length) return;
   const frag = document.createDocumentFragment();
   let p = 0;
   hits.forEach(h => {
    frag.append(v.slice(p, h.i));
    const sp = document.createElement('span');
    sp.className = 'cs-sfx'; sp.dataset.cs = 'sfx'; sp.dataset.sfx = h.id; sp.textContent = v.slice(h.i, h.i + h.len);
    frag.append(sp); p = h.i + h.len;
   });
   frag.append(v.slice(p));
   tn.replaceWith(frag);
   any = true;
  });
  if (any) fresh.push(el);
 });
 return fresh;
}
function csSfxUndecorate(root) {
 if (!root) return;
 root.querySelectorAll('.cs-sfx').forEach(x => x.replaceWith(document.createTextNode(x.textContent)));
 root.querySelectorAll('[data-sfxd]').forEach(x => { delete x.dataset.sfxd; x.normalize(); });
}
/** หลังฟองเด้ง: ขีดเส้นคำใหม่ แล้วเล่นเสียงของฟองที่เพิ่งเด้ง (แชทนิยาย) หรือส่งให้ตัวเฝ้าเลื่อน (นิยาย) */
function csSfxPass(host, first) {
 const fresh = csSfxDecorate(host);
 if (!fresh.length) return;
 if (host.id === 'cs-novel') { const io = host._sfxIO; if (io) fresh.forEach(el => io.observe(el)); return; }
 if (first || csTts) return;
 fresh.forEach(el => { if (el.closest('.cs-item.cs-pop, .cs-item.cs-swap')) csSfxPlayIn(el); });
}
function csSfxBind(host) {
 if (host.id !== 'cs-novel' || typeof IntersectionObserver !== 'function') return;
 const at = Date.now();
 const body = host.querySelector('.cs-nbody');
 try {
  host._sfxIO = new IntersectionObserver(es => es.forEach(e => {
   if (!e.isIntersecting || csTts || Date.now() - at < 1200 || e.target._sfxDone) return;
   e.target._sfxDone = 1;
   csSfxPlayIn(e.target);
  }), { root: body, rootMargin: '-42% 0px -42% 0px', threshold: 0 });
 } catch {}
}
function csSfxSheetHTML() {
 const s = csCfg();
 const seg = [['off', 'ปิด'], ['tap', 'แตะคำเพื่อฟัง'], ['auto', 'อัตโนมัติ']].map(([v, l]) => `<button class="${s.sfx === v ? 'on' : ''}" data-cs="sfxset" data-v="${v}">${l}</button>`).join('');
 return `<div class="cs-ambsec">เสียงเอฟเฟกต์ <small>${CS_SFX.length} เสียง</small></div>
  <div class="cs-navtabs cs-sfxseg">${seg}</div>
  <div class="cs-ambvol"><i class="fa-solid fa-volume-low"></i><input type="range" class="cs-range" data-amb="sfxvol" min="0" max="1" step=".05" value="${+s.sfxVol}"><i class="fa-solid fa-volume-high"></i></div>
  <div class="cs-ambnote">คำที่มีเสียงมีเส้นประใต้คำ แตะเพื่อฟังได้ทุกโหมด · อัตโนมัติ = ดังเองเมื่อฟองเด้ง เลื่อนถึง หรืออ่านออกเสียงถึง</div>
  <details class="cs-sfxall"><summary>ฟังเสียงทั้งหมด${csSfxFiles ? ` · เสียงจริง ${CS_SFX.filter(x => csSfxFiles[x.id]).length}/${CS_SFX.length}` : ''}</summary>
   <div class="cs-ambnote" style="margin:4px 0 8px">● = เสียงจริง · 🔍 = หาเสียงนี้ใน Pixabay</div>
   <div class="cs-sfxchips">${CS_SFX.map(x => `<span class="cs-sfxchip${csSfxFiles && csSfxFiles[x.id] ? ' real' : ''}"><button data-cs="sfxtry" data-v="${x.id}">${csSfxFiles && csSfxFiles[x.id] ? '● ' : ''}${csEsc(x.n)}</button><a href="${csSfxPixabay(x.id)}" target="_blank" rel="noopener" aria-label="หาใน Pixabay">🔍</a></span>`).join('')}</div></details>`;
}
/** ปุ่มเพิ่มเติม (เรียกก่อนตัวจัดการคลิกอื่น) */
function csExtraClick(e, b, a) {
 if (!a) return false;
 if (a === 'sfx') { e.stopPropagation(); csSfxPlay(b.dataset.sfx, true); b.classList.add('cs-sfxon'); setTimeout(() => b.classList.remove('cs-sfxon'), 700); return true; }
 if (a === 'sfxtry') { e.stopPropagation(); csSfxPlay(b.dataset.v, true); return true; }
 if (a === 'sfxset') {
  e.stopPropagation();
  const was = csCfg().sfx; csCfg().sfx = b.dataset.v; if (b.dataset.v !== 'off') csCfg().sfxLast = b.dataset.v; else { csSfxStopCur(); clearTimeout(csSfxT); csSfxPending = null; } csSave();
  const hosts = [csReader && csReader.el, csNovel && csNovel.el].filter(Boolean);
  if (b.dataset.v === 'off') hosts.forEach(csSfxUndecorate); else if (was === 'off') hosts.forEach(h => csSfxDecorate(h));
  csNavRefresh();
  return true;
 }
 if (a === 'sfxtoggle') { e.stopPropagation(); csSfxToggle(); return true; }
 if (a === 'full') { e.stopPropagation(); csReader && csReader.el.querySelector('.cs-menu')?.classList.remove('open'); csFullToggle(); return true; }
 return false;
}
// ══ ★ 1.33 อ่านออกเสียงตามทีละคำ · เอฟเฟกต์ดังตรงคำ · สวิตช์เปิดปิดเอฟเฟกต์ ══
/** ข้อความของบรรทัดจากหน้าจอจริง พร้อมตำแหน่งตัวอักษร → จุดในหน้า และจุดที่มีเอฟเฟกต์ */
function csTtsTextMap(el) {
 const skip = '.cs-nwho, .cs-cmt, button, .cs-code, .cs-html';
 const w = document.createTreeWalker(el, 4, { acceptNode: n => (n.parentElement && n.parentElement !== el && n.parentElement.closest(skip) && el.contains(n.parentElement.closest(skip)) ? 2 : 1) });
 const nodes = [];
 let full = '';
 while (w.nextNode()) { const n = w.currentNode; nodes.push({ n, s: full.length }); full += n.nodeValue; }
 const sfx = [...el.querySelectorAll('.cs-sfx')].map(sp => { const hit = nodes.find(x => x.n === sp.firstChild); return hit ? { at: hit.s, id: sp.dataset.sfx, sp, done: false } : null; }).filter(Boolean);
 return { el, nodes, full, sfx, words: null };
}
function csTtsWords(map) {
 if (map.words) return map.words;
 const out = [];
 try { for (const g of new Intl.Segmenter('th', { granularity: 'word' }).segment(map.full)) if (g.isWordLike !== false && g.segment.trim()) out.push([g.index, g.index + g.segment.length]); }
 catch { const re = /\S+/g; let m; while ((m = re.exec(map.full))) out.push([m.index, m.index + m[0].length]); }
 return (map.words = out);
}
function csTtsRange(map, a, b) {
 const find = off => { for (let i = map.nodes.length - 1; i >= 0; i--) if (map.nodes[i].s <= off) return { n: map.nodes[i].n, o: Math.min(off - map.nodes[i].s, map.nodes[i].n.nodeValue.length) }; return null; };
 const x = find(a), y = find(Math.max(a, b));
 if (!x || !y) return null;
 const r = document.createRange(); r.setStart(x.n, x.o); r.setEnd(y.n, y.o);
 return r;
}
function csTtsWordClear() { try { if (window.CSS && CSS.highlights) CSS.highlights.delete('cs-tts'); } catch {} document.querySelectorAll('.cs-ttsword').forEach(x => x.classList.remove('cs-ttsword')); }
/** ไฮไลต์คำที่อ่านอยู่ · ถึงคำที่มีเอฟเฟกต์ = เล่นตอนนั้นเลย */
function csTtsMark(map, pos, len) {
 let a = pos, b = pos + (len || 0);
 if (!len) { const wd = csTtsWords(map).find(x => x[0] <= pos && pos < x[1]) || csTtsWords(map).find(x => x[0] >= pos); if (wd) { a = wd[0]; b = wd[1]; } else b = pos + 2; }
 map.pos = a;
 if (csCfg().ttsWord) try { if (window.CSS && CSS.highlights && typeof Highlight === 'function') { const r = csTtsRange(map, a, b); if (r) CSS.highlights.set('cs-tts', new Highlight(r)); } } catch {}
 map.sfx.forEach(x => {
  if (x.done || x.at > b) return;
  x.done = true;
  if (csCfg().sfx === 'off') return;
  csSfxQueue(x.id, 0);
  x.sp.classList.add('cs-sfxon'); setTimeout(() => x.sp.classList.remove('cs-sfxon'), 900);
 });
}
/** อ่านบรรทัดจากหน้าจอ: ใช้จุดแบ่งคำของเสียงอ่าน ถ้าเบราว์เซอร์ไม่ส่งมา ประมาณจากเวลา */
function csSpeakMap(map, who, done) {
 if (csTtsEngine() !== 'device') return csSpeakAudio(map.full, who, map, done);
 const t = csTts, tok = t ? t.tok : 0;
 const alive = () => (t ? csTts === t && t.tok === tok && !t.paused : true);
 const full = map.full;
 const chunks = [];
 { let base = 0, r = full; while (r.length > 180) { let cut = Math.max(r.lastIndexOf(' ', 180), r.lastIndexOf('. ', 180) + 1); if (cut < 60) cut = 180; chunks.push({ base, text: r.slice(0, cut) }); base += cut; r = r.slice(cut); } if (r.trim()) chunks.push({ base, text: r }); }
 const finish = () => { csTtsWordClear(); done(); };
 if (!chunks.length || !csTtsClean(full)) return setTimeout(() => alive() && finish(), 0);
 const v = csVoiceFor(who), pitch = csPitchFor(who, v), rate = +csCfg().ttsRate || 1;
 let i = 0, iv = 0;
 const step = () => {
  clearInterval(iv);
  if (!alive()) return;
  if (i >= chunks.length) { map.sfx.forEach(x => { if (!x.done) csTtsMark(map, x.at, 1); }); return finish(); }
  const c = chunks[i++];
  const u = new window.SpeechSynthesisUtterance(c.text);
  u.lang = (v && v.lang) || 'th-TH';
  try { if (v) u.voice = v; } catch {}
  u.rate = rate; u.pitch = pitch;
  let fired = false, got = false, t0 = 0;
  const go = () => { if (fired) return; fired = true; clearInterval(iv); setTimeout(step, 80); };
  u.onboundary = e => { if (!alive() || !e || typeof e.charIndex !== 'number') return; got = true; csTtsMark(map, c.base + e.charIndex, e.charLength || 0); };
  u.onstart = () => { t0 = Date.now(); csTtsMark(map, c.base, 0); iv = setInterval(() => { if (!alive()) return clearInterval(iv); if (!got && t0) csTtsMark(map, Math.min(c.base + c.text.length - 1, c.base + Math.floor((Date.now() - t0) / 1000 * 13 * rate)), 0); }, 140); };
  u.onend = go;
  u.onerror = e => { if (e && /interrupted|canceled/.test(e.error || '')) return; go(); };
  try { window.speechSynthesis.speak(u); } catch { go(); }
 };
 step();
}
function csSfxToggleLabel() { return csCfg().sfx === 'off' ? '<i class="fa-solid fa-volume-xmark"></i>เอฟเฟกต์: ปิด · แตะเพื่อเปิด' : '<i class="fa-solid fa-wand-magic-sparkles"></i>เอฟเฟกต์: เปิด · แตะเพื่อปิด'; }
/** เปิด/ปิดเอฟเฟกต์ทั้งหมดในแตะเดียว (เปิดกลับเป็นโหมดที่เคยใช้) */
function csSfxToggle() {
 const s = csCfg(), hosts = [csReader && csReader.el, csNovel && csNovel.el].filter(Boolean);
 if (s.sfx === 'off') { s.sfx = s.sfxLast && s.sfxLast !== 'off' ? s.sfxLast : 'auto'; hosts.forEach(h => csSfxDecorate(h)); csToast(`เปิดเอฟเฟกต์แล้ว · ${s.sfx === 'tap' ? 'แตะคำเพื่อฟัง' : 'อัตโนมัติ'}`, 'ok'); }
 else { s.sfxLast = s.sfx; s.sfx = 'off'; csSfxStopCur(); clearTimeout(csSfxT); csSfxPending = null; hosts.forEach(csSfxUndecorate); csToast('ปิดเอฟเฟกต์ทั้งหมดแล้ว', 'ok'); }
 csSave();
 document.querySelectorAll('[data-cs="sfxtoggle"]').forEach(b => { b.innerHTML = csSfxToggleLabel(); });
 csReader && csReader.el.querySelector('.cs-menu')?.classList.remove('open');
 csNovel && csNovel.el.querySelector('.cs-aapanel')?.classList.remove('open');
 if (csNavIsOpen() && csNavState.tab === 'amb') csNavRefresh();
}
/** ป้ายเล็กบอกชื่อเสียงที่เพิ่งดัง */
function csSfxPill(name) {
 const host = (csReader && csReader.el) || (csNovel && csNovel.el);
 if (!host || !name) return;
 host.querySelector(':scope > .cs-sfxpill')?.remove();
 const d = document.createElement('div');
 d.className = 'cs-sfxpill';
 d.innerHTML = `<i class="fa-solid fa-volume-high"></i>${csEsc(name)}`;
 host.appendChild(d);
 setTimeout(() => d.remove(), 1500);
}
// ══ ★ 1.34 เสียงจริง: ไฟล์ในโฟลเดอร์ sounds/ ของส่วนขยาย (sounds/index.json บอกว่าเสียงไหนใช้ไฟล์อะไร) ══
let csSfxFiles = null, csSfxBase = '', csSfxFilesP = null;
const csSfxBufs = new Map(), csSfxLoading = new Map();
function csSfxFilesLoad() {
 if (csSfxFilesP) return csSfxFilesP;
 csSfxFilesP = (async () => {
  const found = {};
  if (typeof fetch !== 'function') return (csSfxFiles = found);
  const bases = [...new Set([...document.querySelectorAll('script[src*="/scripts/extensions/"]')].map(x => ((x.getAttribute('src') || '').match(/^(.*\/scripts\/extensions\/.+?)\/index\.js(?:[?#].*)?$/) || [])[1]).filter(Boolean))];
  for (const base of bases) {
   try {
    const r = await fetch(base + '/sounds/index.json', { cache: 'no-cache' });
    if (!r.ok) continue;
    const j = await r.json();
    if (j && typeof j === 'object') { Object.assign(found, j.files || j); csSfxBase = base + '/sounds/'; break; }
   } catch {}
  }
  return (csSfxFiles = found);
 })();
 return csSfxFilesP;
}
function csSfxBuf(id) {
 if (csSfxBufs.has(id)) return Promise.resolve(csSfxBufs.get(id));
 if (csSfxLoading.has(id)) return csSfxLoading.get(id);
 const pr = (async () => {
  const f = (await csSfxFilesLoad())[id];
  const ac = csAc();
  if (!f || !ac || typeof ac.decodeAudioData !== 'function') return null;
  const r = await fetch(csSfxBase + f.split('/').map(encodeURIComponent).join('/'));
  if (!r.ok) return null;
  const b = await ac.decodeAudioData(await r.arrayBuffer());
  csSfxBufs.set(id, b);
  return b;
 })().catch(() => null).finally(() => csSfxLoading.delete(id));
 csSfxLoading.set(id, pr);
 return pr;
}
/** เล่นไฟล์จริง · ยาวเกิน 6 วิค่อย ๆ เบาลงแล้วหยุด */
function csSfxRunBuf(id, b) {
 const ac = csAc();
 if (!ac) return 0;
 try {
  if (!csSfxOut || csSfxOut.context !== ac) { csSfxOut = ac.createGain(); csSfxOut.connect(csMaster(ac)); }
  csSfxOut.gain.value = Math.max(0, Math.min(1, +csCfg().sfxVol || 0));
  csSfxStopCur();
  const g = ac.createGain(); g.connect(csSfxOut);
  const src = ac.createBufferSource(); src.buffer = b; src.connect(g);
  const t = ac.currentTime + .01, dur = Math.min(6, b.duration || 1);
  g.gain.setValueAtTime(1, t);
  if (b.duration > 6) { g.gain.setValueAtTime(1, t + 5.2); g.gain.linearRampToValueAtTime(0, t + 6); }
  src.start(t); src.stop(t + dur + .02);
  csSfxCur = { g, ac };
  csSfxBusyUntil = Date.now() + dur * 1000 + 450;
  const x = CS_SFX.find(e => e.id === id);
  if (x) csSfxPill(x.n);
  return dur;
 } catch { return 0; }
}
function csSfxPixabay(id) { return 'https://pixabay.com/sound-effects/search/' + encodeURIComponent(CS_SFX_EN[id] || id) + '/'; }
// ══ ★ 1.36 คอมเมนต์มากับคำตอบหลัก — ขอครั้งเดียว ไม่เปลืองโควตา ══
let csCmtAskNow = '';
function csCmtInlineOn() { const s = csCfg(); return !!(s.enabled && s.cmtOn && s.cmtAuto && s.cmtWith !== 'separate'); }
/** คำตอบที่กำลังจะมา ควรมีคอมเมนต์ไหม (เช็กก่อนเจน) · 'must' | 'maybe' | '' */
function csCmtNextReason() {
 const s = csCfg(), chat = csCtx().chat || [];
 if (s.cmtGate === 'always' && s.cmtPick !== 'model') return 'must';
 const every = Math.max(0, s.cmtEvery | 0);
 const last = csLastCharMesId();
 const ex = (chat[last] && chat[last].extra) || {};
 const had = !!((ex.cs_cmt && ex.cs_cmt.list && Object.keys(ex.cs_cmt.list).length) || ex.cs_cmt_try);
 const since = last < 0 || had ? 1 : csCmtSince(last) + 1; // รวมคำตอบที่กำลังจะมา
 if (every && since >= every) return 'must';
 const pct = Math.max(0, Math.min(100, +s.cmtRandom || 0));
 if (pct && Math.random() * 100 < pct) return 'must';
 if (s.cmtPick === 'model' || s.cmtGate === 'keyword') return 'maybe';
 return '';
}
function csCmtInlinePrompt(why) {
 const s = csCfg(), mode = csCmtMode(), per = csCmtPer(), np = csCmtNParas();
 const cnt = mode === 'auto' ? `up to ${np} lines, 1-${per} comments each, your choice` : mode === 'random' ? `${csRnd(csCmtParasMin(), np)} lines, ${csCmtPerMin()}-${per} comments each` : `${np} lines, ${per} comment${per > 1 ? 's' : ''} each`;
 return [`[After the story, add Thai web-novel reader comments for this reply inside <cs-cmt>...</cs-cmt> at the very end (hidden, not part of the story).${why === 'maybe' ? ' Add it only if readers would really react to this reply; otherwise leave it out.' : ''}`,
  `Number the story's non-empty lines from 0 (every line counts, dialogue too) and pick any lines readers react to: ${cnt}, from different reader handles (fangirling, shipping, jokes, theories, tears, anger).${s.cmtReplies ? ' Readers may reply to each other ("to": handle).' : ''}`,
  csCmtReadersLine(), csCmtFmt() + ']'].filter(Boolean).join('\n');
}
/** ดึงบล็อก <cs-cmt> ออกจากข้อความ เก็บเป็นคอมเมนต์ของบทนั้น · คืน true ถ้ามีบล็อก */
function csCmtTakeInline(mesId) {
 const ctx = csCtx(), m = (ctx.chat || [])[mesId];
 if (!m || m.is_user || !/<cs-cmt>/i.test(m.mes || '')) return false;
 const mm = String(m.mes).match(/<cs-cmt>([\s\S]*?)(?:<\/cs-cmt>|$)/i);
 const raw = mm ? mm[1] : '';
 m.mes = String(m.mes).replace(/\s*<cs-cmt>[\s\S]*?(?:<\/cs-cmt>|$)/gi, '').trim();
 if (Array.isArray(m.swipes) && m.swipe_id !== undefined && typeof m.swipes[m.swipe_id] === 'string') m.swipes[m.swipe_id] = m.mes;
 m.extra = m.extra || {};
 m.extra.cs_cmt_try = 1;
 const idx = new Set(csCmtParas(m).map(x => x.i));
 const list = csCmtParse(raw, idx);
 if (list) {
  m.extra.cs_cmt = { h: csHash(m.mes), list, tok: { in: 0, out: 0 }, ts: Date.now(), inline: 1 };
  const n = Object.values(list).flat().length;
  csCmtStatus(true, `ได้ ${n} คอมเมนต์ (มากับคำตอบ)`, '');
  csToast(`💬 ${n} คอมเมนต์ใหม่`, 'ok');
 } else if (raw.trim()) csCmtStatus(false, 'คอมเมนต์ที่มากับคำตอบอ่านไม่ได้', raw, mesId, [...idx]);
 try { ctx.updateMessageBlock?.(mesId, m); } catch {}
 try { ctx.saveChat?.(); } catch {}
 return true;
}
// ══ ★ 1.36 แก้ไขข้อความจากในหน้าอ่าน ══
function csEditOpen(mesId) {
 const m = (csCtx().chat || [])[mesId];
 if (!m || m.is_system) return csToast('แก้ข้อความนี้ไม่ได้');
 csNavState.edit = mesId;
 csNavOpen('edit');
 const ta = csNavHost()?.querySelector('.cs-editta');
 if (ta) { ta.focus({ preventScroll: true }); ta.setSelectionRange(ta.value.length, ta.value.length); }
}
function csEditHTML() {
 const m = (csCtx().chat || [])[csNavState.edit] || {};
 return `<div class="cs-cmt-grab"></div><div class="cs-navhead cs-profhead"><b class="cs-ambh">แก้ไขข้อความ${m.name ? ` · ${csEsc(m.name)}` : ''}</b><button class="cs-navx" data-cs="navclose" aria-label="ปิด"><i class="fa-solid fa-xmark"></i></button></div>
 <div class="cs-edit"><textarea class="cs-editta" rows="8">${csEsc(m.mes || '')}</textarea>
  <div class="cs-profacts"><button data-cs="navclose">ยกเลิก</button><button class="pri" data-cs="editsave"><i class="fa-solid fa-check"></i>บันทึก</button></div></div>`;
}
/** บันทึกข้อความที่แก้: แชทหลัก + ไฟล์แชท + หน้าอ่าน (คอมเมนต์เดิมยังอยู่) */
async function csEditSave() {
 const id = csNavState.edit, ctx = csCtx(), m = (ctx.chat || [])[id];
 const ta = csNavHost()?.querySelector('.cs-editta');
 if (!m || !ta) return csNavClose();
 const text = ta.value.replace(/\s+$/, '');
 if (!text.trim()) return csToast('ข้อความว่างไม่ได้ · ถ้าจะลบใช้เมนู ☰');
 if (text !== m.mes) {
  const hadCmt = csCmtData(id);
  m.mes = text;
  if (Array.isArray(m.swipes) && m.swipe_id !== undefined && typeof m.swipes[m.swipe_id] === 'string') m.swipes[m.swipe_id] = text;
  if (hadCmt) hadCmt.h = csHash(text);
  try { ctx.updateMessageBlock?.(id, m); } catch {}
  try { await ctx.saveChat?.(); } catch {}
  try { const T = ctx.event_types || {}; if (T.MESSAGE_EDITED) await ctx.eventSource?.emit?.(T.MESSAGE_EDITED, id); } catch {}
  csReaderReplaceMes(id);
  if (csNovel) csNovelRefresh(false);
  csToast('บันทึกแล้ว', 'ok');
 }
 csNavClose();
}
/** เปลี่ยนฟองของข้อความเดียวในหน้าอ่าน โดยไม่รีเซ็ตที่อ่าน */
function csReaderReplaceMes(id) {
 if (!csReader) return;
 const p = csReader.player;
 const fresh = csItemsForMessage(id);
 const shownIds = p.items.slice(0, p.i).filter(it => it._m === id).length;
 const out = [];
 let newI = 0, ins = false;
 p.items.forEach((it, k) => {
  if (it._m === id) { if (!ins) { ins = true; out.push(...fresh); if (shownIds) newI += fresh.length; } return; }
  out.push(it);
  if (k < p.i) newI++;
 });
 if (!ins) return;
 if (p.typing) { clearTimeout(p.typing.timer); p.typing.el.remove(); p.typing = null; }
 p.items = out; p.i = Math.min(out.length, newI);
 csRerenderReader();
 csReaderUpdate();
}
/** ☰ ในหน้าอ่าน: สวมบท (Impersonate) เขียนลงช่องพิมพ์ของ SillyTavern → ดึงมาใส่ช่องพิมพ์ในหน้าอ่าน */
function csMirrorStInput() {
 const host = (csReader && csReader.el) || (csNovel && csNovel.el);
 const ta = host && host.querySelector('.cs-input'), st = document.getElementById('send_textarea');
 if (!ta || !st) return;
 const before = st.value;
 let n = 0;
 const t = setInterval(() => { n++; if (st.value !== before && st.value.trim()) { ta.value = st.value; ta.dispatchEvent(new Event('input', { bubbles: true })); clearInterval(t); } if (n > 120) clearInterval(t); }, 500);
}
// ══ ★ 1.37 เสียงอ่าน: Google (ฟรี) · Gemini (30 เสียง) · เสียงเครื่อง — ผ่านเซิร์ฟเวอร์ SillyTavern ══
const CS_GVOICES = [
 ['Kore', 'f', 'หนักแน่น'], ['Leda', 'f', 'สาวใส'], ['Aoede', 'f', 'สบาย ๆ'], ['Callirhoe', 'f', 'ง่าย ๆ'], ['Autonoe', 'f', 'สดใส'], ['Despina', 'f', 'นุ่ม'], ['Erinome', 'f', 'ชัด'], ['Laomedeia', 'f', 'ร่าเริง'],
 ['Achernar', 'f', 'เบา'], ['Gacrux', 'f', 'ผู้ใหญ่'], ['Pulcherrima', 'f', 'มั่นใจ'], ['Vindemiatrix', 'f', 'อ่อนโยน'], ['Sulafat', 'f', 'อบอุ่น'], ['Zephyr', 'f', 'สว่าง'],
 ['Puck', 'm', 'ร่าเริง'], ['Charon', 'm', 'เล่าเรื่อง'], ['Fenrir', 'm', 'ตื่นเต้น'], ['Orus', 'm', 'หนักแน่น'], ['Enceladus', 'm', 'แหบลมหายใจ'], ['Iapetus', 'm', 'ชัด'], ['Umbriel', 'm', 'สบาย ๆ'], ['Algieba', 'm', 'นุ่มลื่น'],
 ['Algenib', 'm', 'แหบ'], ['Rasalgethi', 'm', 'รู้เรื่อง'], ['Alnilam', 'm', 'หนักแน่น'], ['Schedar', 'm', 'เรียบ'], ['Achird', 'm', 'เป็นมิตร'], ['Zubenelgenubi', 'm', 'ชิล'], ['Sadachbia', 'm', 'มีชีวิตชีวา'], ['Sadaltager', 'm', 'ปราชญ์']
].map(([id, g, d]) => ({ id, g, d }));
let csTtsEl = null, csTtsLoop = 0, csTtsFail = '';
const csTtsCache = new Map();
function csTtsEngine() { const e = csCfg().ttsEngine; if (e === 'edge') return csTtsFail === 'edge' ? 'device' : 'edge'; if (e === 'gemini') return csTtsFail === 'gemini' ? (csTtsFail2 ? 'device' : 'google') : 'gemini'; if (e === 'google') return csTtsFail === 'google' ? 'device' : 'google'; return 'device'; }
let csTtsFail2 = false;
/** เสียง Gemini ของแต่ละคน: ตั้งเอง > ตามเพศ ไม่ซ้ำกันตามชื่อ · ผู้บรรยายใช้เสียงที่ตั้งไว้ */
function csGVoiceFor(who) {
 const s = csCfg();
 if (!who) return s.ttsGVoice || 'Charon';
 const o = csCastGet(who) || {};
 if (o.gvoice) return o.gvoice;
 const g = csGenderOf(who);
 const pool = CS_GVOICES.filter(v => !g || v.g === g).filter(v => v.id !== (s.ttsGVoice || 'Charon'));
 return pool[csHash(who) % pool.length].id;
}
/** Google มีเสียงไทยเสียงเดียว: ตัวละครต่างกันที่ระดับเสียง (เล่นเร็ว/ช้าลงเล็กน้อย) */
function csGRateFor(who) { if (!who) return 1; return Math.max(.8, Math.min(1.2, 1 + (csPitchFor(who) - 1) * .55)); }
function csTtsKey(eng, voice, text) { return eng + '|' + voice + '|' + String(text).replace(/[^\p{L}\p{N}]+/gu, ''); }
function csTtsFetch(text, who) {
 const eng = csTtsEngine(), clean = csTtsClean(text).slice(0, 900);
 const voice = eng === 'gemini' ? csGVoiceFor(who) : eng === 'edge' ? csEVoiceFor(who) : 'th';
 const ep = eng === 'edge' ? csEPitchFor(who) : 0;
 const key = csTtsKey(eng, voice + (ep ? '@' + ep : ''), clean);
 if (csTtsCache.has(key)) return csTtsCache.get(key);
 if (eng === 'edge') {
  const pe = csEdgeGet(clean, voice, ep).catch(e => { csTtsCache.delete(key); throw Object.assign(e, { eng: 'edge' }); });
  csTtsCache.set(key, pe);
  if (csTtsCache.size > 40) csTtsCache.delete(csTtsCache.keys().next().value);
  return pe;
 }
 const ctx = csCtx();
 const headers = (typeof ctx.getRequestHeaders === 'function' ? ctx.getRequestHeaders() : { 'Content-Type': 'application/json' });
 const body = eng === 'gemini'
  ? { text: (who ? 'Say this Thai line as a character in a drama, natural and in the right emotion: ' : 'Read this like a Thai audiobook narrator: ') + clean, voice, model: 'gemini-2.5-flash-preview-tts' }
  : { text: clean, voice: 'th' };
 const pr = fetch(eng === 'gemini' ? '/api/google/generate-native-tts' : '/api/google/generate-voice', { method: 'POST', headers, body: JSON.stringify(body) })
  .then(async r => { if (!r.ok) { let m = ''; try { m = (await r.json()).error || ''; } catch {} throw Object.assign(new Error(m || ('HTTP ' + r.status)), { status: r.status, eng }); } return r.blob(); })
  .catch(e => { csTtsCache.delete(key); throw Object.assign(e, { eng }); });
 csTtsCache.set(key, pr);
 if (csTtsCache.size > 40) csTtsCache.delete(csTtsCache.keys().next().value);
 return pr;
}
// ══ ★ 1.40.4 เสียง Edge (Microsoft) — เสียงนิวรัลไทยฟรี ต่อตรงจากเบราว์เซอร์ ไม่ต้องใช้คีย์ / ปลั๊กอินเซิร์ฟเวอร์ ══
const CS_EVOICES = [
 ['th-TH-PremwadeeNeural', 'f', 'เปรมวดี', 'ไทย · นุ่ม'], ['th-TH-AcharaNeural', 'f', 'อัจฉรา', 'ไทย · สดใส'], ['th-TH-NiwatNeural', 'm', 'นิวัฒน์', 'ไทย · ชาย'],
 ['en-US-AvaMultilingualNeural', 'f', 'Ava', 'หลายภาษา'], ['en-US-EmmaMultilingualNeural', 'f', 'Emma', 'หลายภาษา'], ['fr-FR-VivienneMultilingualNeural', 'f', 'Vivienne', 'หลายภาษา'], ['de-DE-SeraphinaMultilingualNeural', 'f', 'Seraphina', 'หลายภาษา'],
 ['en-US-AndrewMultilingualNeural', 'm', 'Andrew', 'หลายภาษา'], ['en-US-BrianMultilingualNeural', 'm', 'Brian', 'หลายภาษา'], ['fr-FR-RemyMultilingualNeural', 'm', 'Remy', 'หลายภาษา'], ['de-DE-FlorianMultilingualNeural', 'm', 'Florian', 'หลายภาษา']
].map(([id, g, n, d]) => ({ id, g, n, d, th: id.startsWith('th-') }));
const CS_EDGE_TOKEN = '6A5AA1D4EAFF4E9FB37E23D68491D6F4';
const CS_EDGE_VER = '1-143.0.3650.75';
const CS_EDGE_WSS = 'wss://speech.platform.bing.com/consumer/speech/synthesize/readaloud/edge/v1';
function csEVoiceLabel(v) { return `${v.n} · ${v.g === 'f' ? 'หญิง' : 'ชาย'} · ${v.d}`; }
/** เสียง Edge ของแต่ละคน: ตั้งเอง > เสียงไทยตามเพศ (ไม่ชนกับผู้บรรยายถ้ามีให้เลือก) */
function csEVoiceFor(who) {
 const s = csCfg(), narr = s.ttsEVoice || 'th-TH-PremwadeeNeural';
 if (!who) return narr;
 const o = csCastGet(who) || {};
 if (o.evoice) return o.evoice;
 const g = csGenderOf(who), th = CS_EVOICES.filter(v => v.th);
 let pool = th.filter(v => !g || v.g === g);
 if (pool.length > 1) pool = pool.filter(v => v.id !== narr);
 return (pool.length ? pool : th)[csHash(who) % (pool.length || th.length)].id;
}
/** เสียงเดียวกันหลายคน = ต่างกันที่ระดับเสียง (%) · ตั้งระดับเสียงเองในโปรไฟล์ได้ */
function csEPitchFor(who) {
 if (!who) return 0;
 const o = csCastGet(who) || {};
 if (+o.pitch) return Math.max(-30, Math.min(30, Math.round((+o.pitch - 1) * 50)));
 return ((csHash(who) % 9) - 4) * 2;
}
/** SHA-256 (ข้อความ ASCII) → hex · เขียนเองเพราะ crypto.subtle ใช้ได้แค่ https/localhost */
const csShaKH = (() => {
 const k = [], h = [], frac = x => ((x - Math.floor(x)) * 4294967296) >>> 0;
 for (let n = 2; k.length < 64; n++) {
  let prime = true;
  for (let d = 2; d * d <= n; d++) if (n % d === 0) { prime = false; break; }
  if (!prime) continue;
  if (h.length < 8) h.push(frac(Math.sqrt(n)));
  k.push(frac(Math.cbrt(n)));
 }
 return { k, h };
})();
function csSha256Hex(str) {
 const bytes = Array.from(unescape(encodeURIComponent(str)), c => c.charCodeAt(0));
 const bitLen = bytes.length * 8;
 bytes.push(0x80);
 while (bytes.length % 64 !== 56) bytes.push(0);
 for (let i = 7; i >= 0; i--) bytes.push(i >= 4 ? 0 : (bitLen >>> (i * 8)) & 255);
 const H = csShaKH.h.slice(), K = csShaKH.k, W = new Array(64);
 const rot = (x, n) => (x >>> n) | (x << (32 - n));
 for (let o = 0; o < bytes.length; o += 64) {
  for (let i = 0; i < 16; i++) W[i] = (bytes[o + i * 4] << 24) | (bytes[o + i * 4 + 1] << 16) | (bytes[o + i * 4 + 2] << 8) | bytes[o + i * 4 + 3];
  for (let i = 16; i < 64; i++) {
   const s0 = rot(W[i - 15], 7) ^ rot(W[i - 15], 18) ^ (W[i - 15] >>> 3), s1 = rot(W[i - 2], 17) ^ rot(W[i - 2], 19) ^ (W[i - 2] >>> 10);
   W[i] = (W[i - 16] + s0 + W[i - 7] + s1) | 0;
  }
  let [a, b, c, d, e, f, g, h] = H;
  for (let i = 0; i < 64; i++) {
   const t1 = (h + (rot(e, 6) ^ rot(e, 11) ^ rot(e, 25)) + ((e & f) ^ (~e & g)) + K[i] + W[i]) | 0;
   const t2 = ((rot(a, 2) ^ rot(a, 13) ^ rot(a, 22)) + ((a & b) ^ (a & c) ^ (b & c))) | 0;
   h = g; g = f; f = e; e = (d + t1) | 0; d = c; c = b; b = a; a = (t1 + t2) | 0;
  }
  [a, b, c, d, e, f, g, h].forEach((x, i) => { H[i] = (H[i] + x) | 0; });
 }
 return H.map(x => (x >>> 0).toString(16).padStart(8, '0')).join('');
}
/** โทเคนที่บริการขอ: เวลา (Windows ticks ปัดลงทีละ 5 นาที) + รหัสไคลเอนต์ → SHA-256 ตัวพิมพ์ใหญ่ */
function csEdgeGec(nowMs) {
 const B = BigInt; // ไม่ใช้ 123n ตรง ๆ — เบราว์เซอร์เก่าจะอ่านไฟล์ไม่ได้ทั้งไฟล์
 let t = B(Math.floor((nowMs || Date.now()) / 1000)) + B(11644473600);
 t -= t % B(300);
 return csSha256Hex((t * B(10000000)).toString() + CS_EDGE_TOKEN).toUpperCase();
}
function csEdgeId() { return Array.from({ length: 32 }, () => '0123456789abcdef'[Math.random() * 16 | 0]).join(''); }
function csEdgeTime() {
 const d = new Date(), D = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'], M = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'], z = n => String(n).padStart(2, '0');
 return `${D[d.getUTCDay()]} ${M[d.getUTCMonth()]} ${z(d.getUTCDate())} ${d.getUTCFullYear()} ${z(d.getUTCHours())}:${z(d.getUTCMinutes())}:${z(d.getUTCSeconds())} GMT+0000 (Coordinated Universal Time)`;
}
function csEdgeSsml(text, voice, pitch) {
 const x = String(text).replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/'/g, '&apos;').replace(/"/g, '&quot;');
 const p = (pitch >= 0 ? '+' : '') + (pitch | 0) + '%';
 return `<speak version='1.0' xmlns='http://www.w3.org/2001/10/synthesis' xml:lang='en-US'><voice name='${voice}'><prosody pitch='${p}' rate='+0%' volume='+0%'>${x}</prosody></voice></speak>`;
}
/** ★ 1.40.5 ปลั๊กอิน Edge TTS ของ SillyTavern (เซิร์ฟเวอร์ต่อ Microsoft ให้) — มือถือหลายเครื่องต่อตรงจากเบราว์เซอร์ไม่ได้ */
let csEdgePlug = null; // null = ยังไม่รู้ · true/false
/** fetch ที่มีเวลาจำกัด — ปลั๊กอินเงียบ = ไม่รอตลอดไป (ไม่งั้นการอ่านค้าง แตะจอแล้วเหมือนกดไม่ได้) */
function csFetchT(url, opt, ms) {
 const ac = typeof AbortController === 'function' ? new AbortController() : null;
 const t = setTimeout(() => { try { ac && ac.abort(); } catch {} }, ms);
 return Promise.race([
  fetch(url, Object.assign({}, opt, ac ? { signal: ac.signal } : {})),
  new Promise((_, rej) => setTimeout(() => rej(new Error('timeout')), ms + 50)),
 ]).finally(() => clearTimeout(t));
}
function csEdgePlugProbe() {
 if (csEdgePlug !== null) return Promise.resolve(csEdgePlug);
 const ctx = csCtx();
 const headers = typeof ctx.getRequestHeaders === 'function' ? ctx.getRequestHeaders() : {};
 return csFetchT('/api/plugins/edge-tts/probe', { method: 'POST', headers }, 5000)
  .then(r => (csEdgePlug = !!r.ok), () => (csEdgePlug = false));
}
function csEdgeViaPlugin(text, voice) {
 const ctx = csCtx();
 const headers = typeof ctx.getRequestHeaders === 'function' ? ctx.getRequestHeaders() : { 'Content-Type': 'application/json' };
 return csFetchT('/api/plugins/edge-tts/generate', { method: 'POST', headers, body: JSON.stringify({ text, voice, rate: 0 }) }, 12000)
  .then(r => { if (!r.ok) throw new Error('plugin HTTP ' + r.status); return r.blob(); })
  .then(b => { if (!b || !b.size) throw new Error('plugin: empty audio'); return b; })
  .catch(e => { throw Object.assign(e instanceof Error ? e : new Error(String(e)), { eng: 'edge', plugin: true }); });
}
/** เสียง Edge: มีปลั๊กอิน = ผ่านเซิร์ฟเวอร์ · ไม่มี = ต่อตรง */
function csEdgeGet(text, voice, pitch) {
 return csEdgePlugProbe().then(ok => ok ? csEdgeViaPlugin(text, voice) : csEdgeFetch(text, voice, pitch));
}
/** ขอเสียงหนึ่งท่อน → Blob mp3 · ต่อไม่ได้ / ช้าเกิน = reject (แล้วสลับเป็นเสียงเครื่องเอง) */
function csEdgeFetch(text, voice, pitch) {
 return new Promise((resolve, reject) => {
  let ws = null, over = false;
  const chunks = [];
  const finish = err => {
   if (over) return;
   over = true; clearTimeout(timer);
   try { if (ws) { ws.onmessage = ws.onerror = ws.onclose = null; ws.close(); } } catch {}
   if (err || !chunks.length) reject(Object.assign(new Error(err || 'no audio'), { eng: 'edge' }));
   else resolve(new Blob(chunks, { type: 'audio/mpeg' }));
  };
  const timer = setTimeout(() => finish('timeout'), 20000);
  try { ws = new WebSocket(`${CS_EDGE_WSS}?TrustedClientToken=${CS_EDGE_TOKEN}&Sec-MS-GEC=${csEdgeGec()}&Sec-MS-GEC-Version=${CS_EDGE_VER}&ConnectionId=${csEdgeId()}`); }
  catch (e) { return finish('connect'); }
  ws.binaryType = 'arraybuffer';
  ws.onopen = () => {
   const ts = csEdgeTime();
   try {
    ws.send(`X-Timestamp:${ts}\r\nContent-Type:application/json; charset=utf-8\r\nPath:speech.config\r\n\r\n{"context":{"synthesis":{"audio":{"metadataoptions":{"sentenceBoundaryEnabled":"false","wordBoundaryEnabled":"false"},"outputFormat":"audio-24khz-48kbitrate-mono-mp3"}}}}`);
    ws.send(`X-RequestId:${csEdgeId()}\r\nContent-Type:application/ssml+xml\r\nX-Timestamp:${ts}Z\r\nPath:ssml\r\n\r\n${csEdgeSsml(text, voice, pitch)}`);
   } catch { finish('send'); }
  };
  ws.onmessage = e => {
   try {
    const d = e.data;
    if (typeof d === 'string') { if (/Path:\s*turn\.end/i.test(d)) finish(); return; }
    if (!d || typeof d.byteLength !== 'number' || typeof d.slice !== 'function' || d.byteLength < 2) return;
    const u = new Uint8Array(d), n = (u[0] << 8) | u[1]; // 2 ไบต์แรก = ความยาวหัวข้อความ แล้วตามด้วยเสียง mp3
    if (2 + n > u.length) return;
    const head = String.fromCharCode.apply(null, u.subarray(2, 2 + n));
    if (/Path:\s*audio\s*(\r|\n|$)/i.test(head) && u.length > 2 + n) chunks.push(d.slice(2 + n));
   } catch { finish('bad data'); }
  };
  ws.onerror = () => finish('network');
  ws.onclose = () => finish(chunks.length ? 'closed early' : 'closed');
 });
}
/** ตัวเล่นเสียงตัวเดียวใช้ทั้งเรื่อง · ปลดล็อกตอนแตะเริ่มอ่าน (มือถือไม่ยอมเล่นเสียงที่ไม่ได้มาจากการแตะ) */
function csTtsUnlock() {
 try {
  if (!csTtsEl) { csTtsEl = new Audio(); csTtsEl.preload = 'auto'; }
  if (!csTtsEl.dataset || !csTtsEl.dataset.ok) {
   csTtsEl.src = 'data:audio/wav;base64,UklGRiQAAABXQVZFZm10IBAAAAABAAEAQB8AAEAfAAABAAgAZGF0YQAAAAA=';
   const r = csTtsEl.play(); if (r && r.catch) r.catch(() => {});
   if (csTtsEl.dataset) csTtsEl.dataset.ok = '1';
  }
 } catch {}
}
function csTtsAudioStop() { clearInterval(csTtsLoop); try { if (csTtsEl) { csTtsEl.onended = null; csTtsEl.onerror = null; csTtsEl.pause(); } } catch {} }
function csSpeakAudio(text, who, map, done) {
 const t = csTts, tok = t ? t.tok : 0;
 const alive = () => (t ? csTts === t && t.tok === tok && !t.paused : true);
 const clean = csTtsClean(text);
 if (!clean) return setTimeout(() => alive() && done(), 0);
 const eng = csTtsEngine();
 const fallback = e => {
  if (!alive()) return;
  const was = e && e.eng || eng;
  if (csTtsFail === 'gemini' && was === 'google') csTtsFail2 = true; else csTtsFail = was;
  csToast(was === 'gemini' ? `Gemini ใช้ไม่ได้${e && e.status === 429 ? ' (โควตาเต็ม)' : ''} · ใช้ Google แทน` : was === 'edge' ? (e && e.plugin ? 'ปลั๊กอิน Edge TTS ตอบไม่ได้ · ใช้เสียงเครื่องแทน' : 'Microsoft ไม่รับการต่อตรงจากเบราว์เซอร์นี้ · ใช้เสียงเครื่องแทน · ดูวิธีแก้ที่ ตั้งค่า → เสียง') : 'เสียง Google ใช้ไม่ได้ · ใช้เสียงเครื่องแทน', 'err');
  if (map) csSpeakMap(map, who, done); else csSpeak(text, who, done);
 };
 csTtsFetch(clean, who).then(blob => {
  if (!alive()) return;
  if (!csTtsEl) csTtsEl = new Audio();
  const a = csTtsEl, url = URL.createObjectURL(blob);
  const rate = +csCfg().ttsRate || 1;
  a.onended = null; a.onerror = null;
  a.src = url;
  const gr = eng === 'google' ? csGRateFor(who) : 1;
  try { a.preservesPitch = gr === 1; a.mozPreservesPitch = gr === 1; a.webkitPreservesPitch = gr === 1; } catch {}
  a.playbackRate = Math.max(.5, Math.min(2.5, rate * gr));
  let fin = false;
  const end = () => { if (fin) return; fin = true; clearInterval(csTtsLoop); URL.revokeObjectURL(url); if (alive()) { if (map) map.sfx.forEach(x => { if (!x.done) csTtsMark(map, x.at, 1); }); csTtsWordClear(); done(); } };
  a.onended = end;
  a.onerror = () => { if (!fin) { fin = true; clearInterval(csTtsLoop); fallback({ eng }); } };
  clearInterval(csTtsLoop);
  if (map) csTtsLoop = setInterval(() => { if (!alive()) return clearInterval(csTtsLoop); const d = a.duration; if (d && isFinite(d)) csTtsMark(map, Math.min(map.full.length - 1, Math.floor(a.currentTime / d * map.full.length)), 0); }, 140);
  const pr = a.play();
  if (pr && pr.catch) pr.catch(e => { if (!fin && alive()) { fin = true; clearInterval(csTtsLoop); if (e && e.name === 'NotAllowedError') { csToast('แตะ ⏵ ที่แถบอ่านอีกครั้งเพื่อให้เสียงเล่น'); t && (t.paused = true); csTtsBar(t && t.who); } else fallback({ eng }); } });
 }).catch(fallback);
}
/** โหลดเสียงบรรทัดถัดไปไว้ก่อน (ไม่ต้องรอตอนอ่านถึง) */
function csTtsPrefetch(t) {
 if (!t || csTtsEngine() === 'device') return;
 try {
  if (t.kind === 'chat' && csReader) {
   const p = csReader.player;
   let j = t.idx + 1;
   while (j < p.items.length && !csTtsWant(p.items[j])) j++;
   const it = p.items[j];
   if (it) csTtsFetch(it.text, it.k === 'say' || it.k === 'think' ? it.who : '').catch(() => {});
  } else if (t.kind === 'novel') {
   const el = csTtsNovelEls()[t.idx + 1];
   if (el) csTtsFetch(csTtsTextMap(el).full, ((el.querySelector('.cs-nwho') || {}).textContent || el.dataset.who || '').trim()).catch(() => {});
  }
 } catch {}
}
// ══ ★ 1.38 ปุ่มลัดอ่านออกเสียง · อ่านคำตอบใหม่เอง · เริ่มอ่านจากบรรทัดที่แตะ ══
function csTtsBtnHTML() { return `<button class="cs-ttsbtn${csTts ? ' on' : ''}" data-cs="tts" title="อ่านออกเสียง" aria-label="อ่านออกเสียง"><i class="fa-solid ${csTts ? 'fa-stop' : 'fa-volume-high'}"></i></button>`; }
function csTtsBtnSync() { document.querySelectorAll('.cs-ttsbtn').forEach(b => { b.classList.toggle('on', !!csTts); const i = b.querySelector('i'); if (i) i.className = 'fa-solid ' + (csTts ? 'fa-stop' : 'fa-volume-high'); }); }
/** บรรทัดนี้อยู่ลำดับที่เท่าไรของการอ่าน */
function csTtsIdxOf(el) {
 if (!el || !el.closest) return null;
 if (csReader && csReader.el.contains(el)) { const box = el.closest('.cs-item[data-i]'); return box ? { kind: 'chat', idx: +box.dataset.i } : null; }
 if (csNovel && csNovel.el.contains(el)) { const line = el.closest('.cs-np, .cs-nscene'); const k = line ? csTtsNovelEls().indexOf(line) : -1; return k >= 0 ? { kind: 'novel', idx: k } : null; }
 return null;
}
/** คำตอบใหม่มาถึง: อ่านให้ฟังเองตั้งแต่บรรทัดแรกของคำตอบนั้น */
function csTtsAutoRead(id) {
 if (!csCfg().ttsAuto || csTts) return;
 setTimeout(() => {
  if (csTts) return;
  if (csReader) {
   const p = csReader.player, idx = p.items.findIndex(it => it._m === id);
   if (idx < 0) return;
   csTtsUnlock(); csStopAuto();
   csTts = { kind: 'chat', idx, tok: 0 };
  } else if (csNovel) {
   const els = csTtsNovelEls(), idx = els.findIndex(e => { const c = e.closest('.cs-chapter'); return c && +c.dataset.mes === id; });
   if (idx < 0) return;
   csTtsUnlock();
   csTts = { kind: 'novel', idx, tok: 0 };
  } else return;
  csTtsBar(); csTtsNext(); csTtsBtnSync();
 }, 350);
}
/** ★ 1.21 จำตำแหน่งในแชทนิยาย: แตะถึงฟองไหน (r) + ฟองที่อยู่บนสุดของจอตอนนี้ (a) ทุกโหมดการเปิด */
function csReaderAnchorIdx() {
 if (!csReader) return -1;
 const body = csReader.el.querySelector('.cs-body');
 const items = [...csReader.el.querySelectorAll('.cs-list > .cs-item[data-i]')];
 if (!body || !items.length) return -1;
 const top = body.getBoundingClientRect().top + 72; // ใต้แถบบน
 // ค้นแบบแบ่งครึ่ง: วัดไม่กี่ฟอง แทนไล่วัดทุกฟอง
 let lo = 0, hi = items.length - 1;
 if (items[hi].getBoundingClientRect().bottom <= top) return +items[hi].dataset.i;
 while (lo < hi) { const mid = (lo + hi) >> 1; if (items[mid].getBoundingClientRect().bottom > top) hi = mid; else lo = mid + 1; }
 return +items[lo].dataset.i;
}
function csReaderSavePos(anchorIdx) {
 if (!csReader) return;
 const p = csReader.player;
 const last = p.items[Math.min(p.i, p.items.length) - 1];
 const aIdx = anchorIdx !== undefined ? anchorIdx : csReaderAnchorIdx();
 const a = aIdx >= 0 ? p.items[aIdx] : null;
 if (!last || last._m === undefined) return;
 const key = csReader.chatKey;
 const old = (csPos(key) || {}).chat || {};
 // เปิดดูข้อความเดียวแล้วยังไม่ได้อ่านเลย ไม่ทับตำแหน่งเดิมที่ไกลกว่า
 if (csReader.key !== 'all' && csReader.key !== 'win' && old.m !== undefined && (last._m < old.m || (last._m === old.m && last._k < (old.k || 0)))) return;
 csPosSave('chat', { m: last._m, k: last._k, am: a && a._m !== undefined ? a._m : last._m, ak: a && a._m !== undefined ? a._k : last._k }, key);
}
let csReaderScrollT = 0;
/** หน้าอ่านนี้ยังเป็นของแชทปัจจุบันไหม (ถ้าแชทเปลี่ยนแล้ว = ไม่ต้องวัดตำแหน่งบนจอ) */
function csReaderStale() { return !csReader || (csReader.chatKey && csReader.chatKey !== csChatKey()); }
/** บันทึกที่อ่านทันที (ออกจากแอป / สลับแท็บ / ปิดหน้า / ก่อนสลับแชท) */
function csPosFlush() {
 try { if (csReader) csReaderSavePos(); } catch {}
 try { if (csNovel) csNovelPosNow(); } catch {}
}
function csReaderOnScroll() { clearTimeout(csReaderScrollT); csReaderScrollT = setTimeout(() => csReaderSavePos(), 300); }
/** อ่านทั้งแชทแบบฟอง ต่อจากฟองล่าสุดที่อ่านค้างไว้ */
function csOpenReadAll(quiet, opt) {
 if (csCfg().style === 'novel') return csOpenNovel(undefined, true, true);
 opt = opt || {};
 const items = csItemsForChat(opt.from || 0);
 const r = csOpenReader(items, opt.title || 'ทั้งแชท');
 if (!r) return r;
 r.key = opt.from ? 'win' : 'all';
 const pos = csPos() && csPos().chat;
 if (pos) {
  const find = (m, k) => { let i = items.findIndex(it => it._m === m && it._k === k); if (i < 0) { const j = items.findIndex(it => it._m > m); i = j < 0 ? items.length - 1 : j - 1; } return i; };
  const idx = find(pos.m, pos.k);
  if (idx > 0 && idx < items.length) {
   r.player.skipTo(idx + 1);
   // เลื่อนไปฟองที่อ่านอยู่ตอนปิด (ไม่ใช่ท้ายสุดเสมอ)
   if (pos.am !== undefined) {
    const ai = find(pos.am, pos.ak);
    const el = r.el.querySelector(`.cs-list > .cs-item[data-i="${ai}"]`);
    const body = r.el.querySelector('.cs-body');
    if (el && body && ai < idx) body.scrollTop = Math.max(0, el.offsetTop - 76);
   }
   if (!quiet) csToast('อ่านต่อจากที่ค้างไว้', 'ok');
  }
 }
 // ★ 1.39 ข้อความที่เราพิมพ์ต่อจากจุดที่อ่าน = ของเราเอง แสดงเลย ไม่ต้องแตะ
 const p = r.player;
 while (p.i > 0 && p.i < p.items.length && csItemIsUser(p.items[p.i])) p.skipTo(p.i + 1);
 // เปิดจากปุ่มบนข้อความ: เลื่อนไปข้อความนั้น
 if (opt.focus !== undefined) {
  const fi = p.items.findIndex(it => it._m === opt.focus);
  if (fi >= 0 && fi >= p.i) p.skipTo(fi + 1);
  const el = fi >= 0 && r.el.querySelector(`.cs-list > .cs-item[data-i="${fi}"]`), body = r.el.querySelector('.cs-body');
  if (el && body) body.scrollTop = Math.max(0, el.offsetTop - 76);
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
  } else if (e.type === 'pointerup') {
   if (csIsPinned() && (csReader || csNovel)) { csCloseReader(); csCloseNovel(); } // โหมดเปิดค้าง: ปุ่มข้างจอ = ซ่อน/แสดง
   else { csAlwaysPaused = false; csOpenLatest(); }
  }
 };
 el.addEventListener('pointerup', end);
 el.addEventListener('pointercancel', end);
 el.addEventListener('keydown', e => { if (e.key === 'Enter' || e.key === ' ') { e.preventDefault(); csOpenLatest(); } });
 el.tabIndex = 0;
}
/** เปิดหน้าอ่านตามแบบที่เลือก */
function csOpenLatest(mesId) {
 if (csCfg().style === 'novel') return csOpenNovel(mesId);
 // ★ 1.39 มีที่อ่านค้างไว้ = เปิดต่อจากตรงนั้นทุกครั้ง (อ่านจบแล้วก็เห็นทั้งหมดเหมือนตอนปิด ไม่เริ่มใหม่)
 const chat = csCtx().chat || [];
 const pos = (csPos() || {}).chat;
 if (pos && pos.m !== undefined && chat[pos.m] && (mesId === undefined || mesId <= pos.m)) {
  let from = Math.min(pos.am !== undefined ? pos.am : pos.m, mesId !== undefined ? mesId : pos.m), n = 0;
  while (from > 0 && n < 30) { from--; if (chat[from] && !chat[from].is_system) n++; }
  return csOpenReadAll(false, { from, title: csCharName() || 'แชทนิยาย', focus: mesId });
 }
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
 if (a === 'cmtedit') { csCmtEditing = `${b.dataset.p}:${b.dataset.k}`; csCmtSheetRefresh(); const t = csCmtOpen && csCmtOpen.host.querySelector('.cs-cmt-ein'); if (t) { t.focus({ preventScroll: true }); t.setSelectionRange(t.value.length, t.value.length); } return true; }
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
 if (a === 'cmtreply') { const c = csCmtFor(+b.dataset.mes, +b.dataset.p)[+b.dataset.k]; if (c) { csCmtReplyTo = { mes: +b.dataset.mes, p: +b.dataset.p, n: c.n }; csCmtSheetRefresh(); const i = csCmtOpen && csCmtOpen.host.querySelector('.cs-cmt-in'); if (i) i.focus({ preventScroll: true }); } return true; }
 if (a === 'cmtnoreply') { csCmtReplyTo = null; csCmtSheetRefresh(); return true; }
 if (a === 'cmtask') { csCmtReplyGen(+b.dataset.mes, +b.dataset.p, +b.dataset.k); return true; }
 return false;
}

// ══ เริ่มทำงาน ══
function csOnGenerationStarted(type, opts, dryRun) {
 if (dryRun || type === 'quiet' || type === 'impersonate') return;
 if (csCmtInlineOn()) { csCmtAskNow = csCmtNextReason(); csApplyPrompt(); }
 try { csLastInject = { t: Date.now(), parts: csPromptParts() }; } catch {}
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
 const inl = csCmtTakeInline(id); // ★ 1.36 คอมเมนต์ที่มากับคำตอบ
 const want = csCmtTakeMark(id); // ★ 1.6 ป้าย [c] ที่โมเดลเลือก ลบออกก่อนแสดงทุกโหมด
 csCastCollect([id]); // ★ 1.8 ชื่อใหม่เข้ารายชื่อตัวละครของแชทนี้
 // ★ 1.9 เช็กก่อนแยกโหมด (เดิมโหมดแชทหลักข้ามไป คอมเมนต์เลยไม่มา)
 if (fresh && s.cmtOn && s.cmtAuto && !csCmtInlineOn() && csCmtShouldAuto(id, want)) csCmtAutoQueue(id);
 if (inl) { csCmtAskNow = ''; csApplyPrompt(); }
 if (s.mode === 'inline') { csInlineRender(id, fresh); return; }
 if (csNovel) { csNovelRefresh(fresh && id === csLastCharMesId()); if (fresh) csTtsAutoRead(id); return; }
 if (!fresh || id !== csLastCharMesId()) return;
 if (s.style === 'novel') { if (s.autoOpen) csOpenNovel(id); return; }
 if (csReader) { csReaderPrune(id); csReader.player.append(csItemsForMessage(id), true); csTtsAutoRead(id); const t = csReader.el.querySelector('.cs-title b'); const m = csCtx().chat[id]; if (t && m) t.textContent = m.name; return; }
 if (s.autoOpen) csOpenMessage(id);
}
function csOnUserRendered(mesId) {
 const id = +mesId;
 csAddMesButton(id);
 if (csCfg().enabled) csCastCollect([id]);
 if (csSentByReader) { csSentByReader = false; if (csReader) csReader.player.items.forEach(it => { if (it._m === undefined && it.u !== false) it._m = id; }); return; }
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
  if ((csReader || csNovel) && e.target.closest && e.target.closest('#options')) { csMirrorStInput(); [150, 600, 1500].forEach(ms => setTimeout(csSyncStPanels, ms)); }
 }, true);
 const ev = ctx.eventSource, T = ctx.event_types || {};
 if (ev && ev.on) {
  if (T.GENERATION_STARTED) ev.on(T.GENERATION_STARTED, csOnGenerationStarted);
  [T.GENERATION_ENDED, T.GENERATION_STOPPED].filter(Boolean).forEach(t => ev.on(t, csOnGenerationDone));
  if (T.CHARACTER_MESSAGE_RENDERED) ev.on(T.CHARACTER_MESSAGE_RENDERED, csOnCharRendered);
  [T.CHARACTER_MESSAGE_RENDERED, T.MESSAGE_UPDATED, T.MESSAGE_EDITED, T.MESSAGE_SWIPED, T.MORE_MESSAGES_LOADED].filter(Boolean).forEach(t => ev.on(t, () => { if (csReader || csNovel) csMesxSoon(500); }));
  if (T.USER_MESSAGE_RENDERED) ev.on(T.USER_MESSAGE_RENDERED, csOnUserRendered);
  if (T.MESSAGE_DELETED) ev.on(T.MESSAGE_DELETED, () => { if (!csDelBusy) setTimeout(() => { if (!csDelBusy) csAfterDelete(); }, 0); });
  if (T.MESSAGE_SWIPED) ev.on(T.MESSAGE_SWIPED, id => csOnSwiped(id));
  [T.MESSAGE_EDITED, T.MESSAGE_UPDATED, T.MESSAGE_SWIPED].filter(Boolean).forEach(t => ev.on(t, id => { csRerender(id); if (csNovel) setTimeout(() => csNovelRefresh(false), 0); }));
  if (T.CHAT_CHANGED) ev.on(T.CHAT_CHANGED, () => { csPosFlush(); csTtsStop(); csCmtPending = null; clearTimeout(csCmtAutoT); csInlineState.clear(); csFresh = false; csGenerating = false; csCloseReader(true); csCloseNovel(true); csAlwaysPaused = false; csApplyPrompt(); setTimeout(() => { csAddAllButtons(); csInlineAll(); csPinOpen(); }, 60); });
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
 const onResize = () => { const el = document.getElementById('cs-edge'); if (el) csEdgePlace(el); csApplyUnderBar(csReader && csReader.el); csApplyUnderBar(csNovel && csNovel.el); };
 window.addEventListener('resize', onResize);
 // ★ 1.41.2 มือถือ: สลับแอป / ปิดแท็บ = บันทึกที่อ่านทันที
 document.addEventListener('visibilitychange', () => { if (document.visibilityState === 'hidden') csPosFlush(); });
 window.addEventListener('pagehide', csPosFlush);
 if (window.visualViewport) window.visualViewport.addEventListener('resize', onResize);
 document.body.classList.toggle('cs-always', csIsPinned());
 setTimeout(csPinOpen, 300); // เปิดเว็บมาในแชท = เปิดหน้าอ่านเลย (โหมดเปิดค้าง)
 try {
  // หน้าอื่นของ SillyTavern เปิด/ปิด → หลบ/กลับมา
  let tp = 0;
  new MutationObserver(() => { clearTimeout(tp); tp = setTimeout(csSyncStPanels, 60); }).observe(document.body, { subtree: true, attributes: true, attributeFilter: ['class', 'style'] });
  // ปุ่มท้ายช่องพิมพ์เปลี่ยน (ส่วนขยายเพิ่มปุ่ม / QR เปลี่ยน) → ดึงใหม่
  const sf = document.getElementById('form_sheld');
  let tb = 0;
  if (sf) new MutationObserver(() => { clearTimeout(tb); tb = setTimeout(csStBtnsAll, 300); }).observe(sf, { subtree: true, childList: true, attributes: true, attributeFilter: ['class', 'style'] });
 } catch {}
 console.log(`[chat-story] ${CS_VERSION} พร้อม`);
}

if (typeof jQuery === 'function') jQuery(csInit);
else if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', csInit);
else csInit();
