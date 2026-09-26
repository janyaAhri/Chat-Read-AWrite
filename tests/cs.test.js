// ทดสอบ Chat Story 1.1
const fs = require('fs'), path = require('path');
const { JSDOM } = require('jsdom');
let pass = 0, fail = 0;
const ok = (c, n, x) => { if (c) pass++; else { fail++; console.log('FAIL:', n, x !== undefined ? JSON.stringify(x) : ''); } };
const sleep = ms => new Promise(r => setTimeout(r, ms));

function env(chat) {
  const dom = new JSDOM(`<!DOCTYPE html><body><div id="extensions_settings2"></div><div id="extensionsMenu"></div><div id="chat"></div><textarea id="send_textarea"></textarea><div id="send_but"></div><div id="mes_stop"></div></body>`, { runScripts: 'outside-only', pretendToBeVisual: true, url: 'http://localhost/' });
  const w = dom.window;
  const handlers = {}, prompts = {};
  w.__notes = 0;
  w.AudioContext = function () { return { state: 'running', currentTime: 0, destination: {}, createOscillator() { return { type: '', frequency: { setValueAtTime() {}, exponentialRampToValueAtTime() {} }, connect() {}, start() { w.__notes++; }, stop() {} }; }, createGain() { return { gain: { setValueAtTime() {}, exponentialRampToValueAtTime() {} }, connect() {} }; } }; };
  w.confirm = () => true;
  const ctx = { extensionSettings: {}, saveSettingsDebounced() {}, name1: 'มินา', name2: 'อาเรีย', chat,
    characters: [{ name: 'อาเรีย', avatar: 'aria.png' }, { name: 'แบรม', avatar: 'bram.png' }],
    eventSource: { on(e, f) { (handlers[e] = handlers[e] || []).push(f); } },
    event_types: { GENERATION_STARTED: 'gs', GENERATION_ENDED: 'ge', GENERATION_STOPPED: 'gst', CHARACTER_MESSAGE_RENDERED: 'cmr', USER_MESSAGE_RENDERED: 'umr', MESSAGE_EDITED: 'me', MESSAGE_UPDATED: 'mu', MESSAGE_SWIPED: 'ms', CHAT_CHANGED: 'cc' },
    setExtensionPrompt(k, v, pos, depth) { prompts[k] = { v, pos, depth }; },
    messageFormatting: t => 'ORIG:' + t };
  w.SillyTavern = { getContext: () => ctx };
  w.console = console;
  const addMes = (m, i) => { const d = w.document.createElement('div'); d.className = 'mes'; d.setAttribute('mesid', i); d.setAttribute('is_user', m.is_user ? 'true' : 'false'); d.innerHTML = `<div class="mes_buttons"><div class="extraMesButtons"></div></div><div class="mes_text">ORIG:${m.mes}</div>`; w.document.getElementById('chat').appendChild(d); };
  chat.forEach(addMes);
  const errors = [];
  w.addEventListener('error', e => errors.push(e.error || e.message));
  w.eval(fs.readFileSync(path.join(__dirname, '..', 'index.js'), 'utf8') + '\n;window.__cs = s => eval(s);');
  const fire = (e, ...a) => (handlers[e] || []).forEach(f => f(...a));
  // ปุ่มส่งของ SillyTavern ปลอม
  w.__sent = [];
  w.document.getElementById('send_but').addEventListener('click', () => {
    const t = w.document.getElementById('send_textarea').value;
    w.__sent.push(t);
    chat.push({ name: 'มินา', is_user: true, mes: t }); addMes(chat[chat.length - 1], chat.length - 1);
    fire('umr', chat.length - 1);
    fire('gs', 'normal', {}, false);
  });
  return { w, ctx, chat, prompts, fire, errors, addMes, ev: s => w.__cs(s), d: w.document };
}

const REPLY = `<think>วางแผน</think>
[ร้านกาแฟหน้ามหาลัย / บ่ายสาม]
ฝนเริ่มตกหนักจนกระจกร้านขึ้นฝ้า
อาเรีย: "มาช้านะ"
อาเรีย: เปียกหมดเลย *ยื่นผ้าให้* เช็ดก่อน
อาเรีย (คิด): จริง ๆ ก็ดีใจที่มา
**แบรม**: ว่าไง
*ทุกคนเงียบไปครู่หนึ่ง*
[[POCKET_PHONE_SYNC_V2]]{"v":2}[[/POCKET_PHONE_SYNC_V2]]
มินา: ขอโทษนะ`;

(async () => {
  const E = env([{ name: 'มินา', is_user: true, mes: 'ไปถึงแล้ว *วิ่งเข้าร้าน*' }, { name: 'อาเรีย', is_user: false, mes: REPLY }]);
  await sleep(50);
  // ── แยกฟอง ──
  const it = E.ev(`csParse(${JSON.stringify(REPLY)}, {owner:'อาเรีย'})`);
  const kinds = it.map(x => x.k + (x.who ? ':' + x.who : '')).join(',');
  ok(kinds === 'scene,narr,say:อาเรีย,say:อาเรีย,narr,say:อาเรีย,think:อาเรีย,say:แบรม,narr,say:มินา', 'parse kinds', kinds);
  ok(it[2].text === 'มาช้านะ' && it[4].text === 'ยื่นผ้าให้' && !/วางแผน|POCKET/.test(JSON.stringify(it)), 'quotes, action, think & sync stripped');
  ok(E.ev("csParse('Well, he said: nothing much')[0].k") === 'narr', 'sentence with colon stays narration');
  const u = E.ev(`csParse('ไปถึงแล้ว *วิ่งเข้าร้าน*', {isUser:true, owner:'มินา'})`);
  ok(u.length === 2 && u[0].k === 'say' && u[0].who === 'มินา' && u[1].k === 'narr', 'user message');
  // ── ค่าเริ่มต้นขาวดำ ──
  ok(E.ev('csCfg().preset') === 'classic' && E.ev("csVars()['--cs-out']") === '#111111' && E.ev("csVars()['--cs-bg']") === '#ffffff', 'default black & white');
  ok(E.prompts.chat_story_format && /Format: chat novel/.test(E.prompts.chat_story_format.v) && /Never write มินา's words/.test(E.prompts.chat_story_format.v) && E.prompts.chat_story_format.v.length < 260, 'format prompt (short)', E.prompts.chat_story_format.v.length);
  ok(!!E.d.querySelector('.chat-story-settings #cs-open-settings') && !!E.d.getElementById('cs-wand-set'), 'drawer + wand');
  // ── หน้าอ่าน + ประวัติก่อนหน้า ──
  E.ev('csCfg().typingMs = 0');
  E.fire('gs', 'normal', {}, false); E.fire('cmr', 1);
  const R = () => E.d.getElementById('cs-reader');
  const items = () => R().querySelectorAll('.cs-list > .cs-item').length;
  ok(!!R() && R().querySelectorAll('.cs-old').length === 2 && items() === 3, 'reader opens with previous message shown + first bubble', items());
  ok(!!R().querySelector('.cs-input') && R().style.getPropertyValue('--cs-bg') === '#ffffff', 'input bar + theme vars');
  const n0 = E.w.__notes;
  R().querySelector('.cs-body').click();
  ok(items() === 4 && E.w.__notes > n0, 'tap = one bubble + sound');
  R().querySelector('[data-cs="back"]').click(); R().querySelector('[data-cs="back"]').click(); R().querySelector('[data-cs="back"]').click();
  ok(items() === 2, 'back stops at history floor', items());
  R().querySelector('[data-cs="all"]').click();
  ok(R().classList.contains('done') && items() === 12 && R().querySelector('.cs-progress i').style.width === '100%', 'show all');
  // ── พิมพ์ในหน้าอ่าน ──
  const ta = R().querySelector('.cs-input');
  ta.value = 'ขอโทษนะ รถติดมาก *นั่งลง*';
  E.d.dispatchEvent(new E.w.KeyboardEvent('keydown', { key: ' ' })); // เว้นวรรคในหน้าไม่ใช่ช่องพิมพ์ = อ่านต่อ (จบแล้วไม่มีผล)
  ta.dispatchEvent(new E.w.KeyboardEvent('keydown', { key: 'Enter', bubbles: true }));
  ok(E.w.__sent[0] === 'ขอโทษนะ รถติดมาก *นั่งลง*' && ta.value === '', 'send goes to SillyTavern');
  ok(items() === 14 && /right/.test([...R().querySelectorAll('.cs-list > .cs-item')].slice(-2)[0].innerHTML), 'own bubbles appear once (no duplicate from render event)', items());
  ok(!!R().querySelector('.cs-waiting') && R().classList.contains('generating') && /กำลังพิมพ์/.test(R().querySelector('.cs-sub').textContent), 'waiting dots while bot writes');
  R().querySelector('[data-cs="send"]').click(); // ตอนนี้เป็นปุ่มหยุด
  E.chat.push({ name: 'อาเรีย', is_user: false, mes: 'อาเรีย: ไม่เป็นไร\nเธอยิ้มบาง ๆ\nอาเรีย: นั่งสิ' }); E.addMes(E.chat[3], 3);
  E.fire('cmr', 3);
  ok(!R().querySelector('.cs-waiting') && items() === 15, 'bot reply appended into open reader, first bubble shown', items());
  R().querySelector('.cs-body').click(); R().querySelector('.cs-body').click();
  ok(items() === 17 && R().classList.contains('done'), 'tap through new reply');
  // ช่องพิมพ์ไม่โดนคีย์ลัด
  ta.dispatchEvent(new E.w.KeyboardEvent('keydown', { key: 'ArrowLeft', bubbles: true }));
  ok(items() === 17, 'arrow keys in textarea ignored');
  E.d.dispatchEvent(new E.w.KeyboardEvent('keydown', { key: 'Escape' }));
  await sleep(260);
  ok(!R(), 'esc closes');
  // ── จุดพิมพ์ ──
  E.ev("csCfg().typingMs = 300; csCfg().history = 0; csOpenMessage(1)");
  R().querySelector('.cs-body').click(); R().querySelector('.cs-body').click(); // ฉาก → บรรยาย → พูด
  ok(!!R().querySelector('.cs-list .cs-typing'), 'typing dots before character bubble');
  R().querySelector('.cs-body').click();
  ok(!R().querySelector('.cs-list .cs-typing'), 'tap skips typing');
  E.ev('csCloseReader(true)');
  // ── หน้าปรับแต่ง ──
  E.ev('csCfg().typingMs = 0; csOpenMessage(1)');
  E.d.getElementById('cs-open-settings').click();
  const S = () => E.d.getElementById('cs-settings');
  ok(!!S() && S().querySelectorAll('.cs-tabs button').length === 8 && S().querySelectorAll('.cs-preview .cs-item').length === 6, 'settings sheet + live preview');
  S().querySelector('[data-preset="night"]').click();
  ok(E.ev('csCfg().preset') === 'night' && R().style.getPropertyValue('--cs-bg') === '#14131c' && S().classList.contains('cs-sdark'), 'preset applies live to reader & sheet');
  const col = S().querySelector('[data-color="outBg"]'); col.value = '#ff0000'; col.dispatchEvent(new E.w.Event('input', { bubbles: true }));
  ok(E.ev('csCfg().preset') === 'custom' && E.ev('csCfg().custom.outBg') === '#ff0000' && E.ev('csCfg().custom.bg') === '#14131c', 'color edit → custom copies current theme');
  S().querySelector('[data-tab="text"]').click();
  ok(S().querySelectorAll('.cs-font').length === 23 && !!E.d.querySelector('link[href*="fonts.googleapis.com"][href*="Kanit"]'), 'font list + previews loaded');
  S().querySelector('[data-font="kanit"]').click();
  ok(/Kanit/.test(R().style.getPropertyValue('--cs-ff')), 'font applies');
  S().querySelector('[data-font="custom"]').click();
  const fc = S().querySelector('[data-k="fontCustom"]'); fc.value = 'Chonburi'; fc.dispatchEvent(new E.w.Event('change', { bubbles: true }));
  ok(/Chonburi/.test(R().style.getPropertyValue('--cs-ff')) && !!E.d.querySelector('link[href*="Chonburi"]'), 'custom font name');
  const fs2 = S().querySelector('[data-k="fontSize"]'); fs2.value = '20'; fs2.dispatchEvent(new E.w.Event('input', { bubbles: true }));
  ok(R().style.getPropertyValue('--cs-font') === '20px' && /20px/.test(S().querySelector('[data-v="fontSize"]').textContent), 'font size range');
  S().querySelector('[data-tab="bubble"]').click();
  S().querySelector('[data-seg="avatar"][data-val="square"]').click();
  S().querySelector('[data-seg="narrStyle"][data-val="box"]').click();
  ok(R().dataset.avatar === 'square' && R().dataset.narr === 'box', 'avatar shape & narration style');
  const side = S().querySelector('[data-k="userSide"]'); side.value = 'left'; side.dispatchEvent(new E.w.Event('change', { bubbles: true }));
  ok(E.ev("csCfg().userSide") === 'left', 'user side');
  S().querySelector('[data-tab="sound"]').click();
  ok(S().querySelectorAll('.cs-sound').length === 11, 'sound grid');
  const before = E.w.__notes;
  S().querySelector('[data-sound="kalimba"]').click();
  ok(E.ev('csCfg().sound') === 'kalimba' && E.w.__notes > before, 'pick sound plays it');
  S().querySelector('[data-sound="custom"]').click();
  ok(!!S().querySelector('[data-upload="sound"]'), 'custom sound upload shown');
  S().querySelector('[data-sound="pop"]').click();
  S().querySelector('[data-tab="chars"]').click();
  const names = [...S().querySelectorAll('.cs-charrow b')].map(b => b.textContent);
  ok(names.includes('อาเรีย') && names.includes('แบรม') && !names.includes('มินา'), 'speakers listed', names);
  const cc = S().querySelector('[data-char="แบรม"][data-f="color"]'); cc.value = '#2244aa'; cc.dispatchEvent(new E.w.Event('input', { bubbles: true }));
  const cs2 = S().querySelector('[data-char="แบรม"][data-f="sound"]'); cs2.value = 'retro'; cs2.dispatchEvent(new E.w.Event('change', { bubbles: true }));
  ok(E.ev("csCfg().chars['แบรม'].color") === '#2244aa' && E.ev("csCfg().chars['แบรม'].sound") === 'retro', 'per-character color & sound');
  ok(/background:#2244aa;color:#ffffff/.test(E.ev("csItemHTML({k:'say',who:'แบรม',text:'x'})")), 'per-char bubble color with contrast text');
  S().querySelector('[data-tab="read"]').click();
  const hist = S().querySelector('[data-k="history"]'); hist.value = '2'; hist.dispatchEvent(new E.w.Event('input', { bubbles: true }));
  ok(E.ev('csCfg().history') === 2, 'history range');
  S().querySelector('[data-act="reset"]').click();
  ok(E.ev('csCfg().preset') === 'classic' && E.ev('csCfg().sound') === 'pop' && !Object.keys(E.ev('csCfg().chars')).length, 'reset to defaults');
  S().querySelector('[data-act="close"]').click(); await sleep(260);
  ok(!S(), 'settings closes');
  E.ev('csCloseReader(true)');
  // ── โหมดแชทหลัก ──
  E.ev("csCfg().mode = 'inline'; csCfg().typingMs = 0");
  E.fire('gs', 'normal', {}, false); E.fire('cmr', 1);
  const box = () => E.d.querySelector('.mes[mesid="1"] .mes_text');
  ok(!R() && box().querySelectorAll('.cs-inline .cs-item').length === 1 && /เหลือ 9 ฟอง/.test(box().innerHTML), 'inline fresh reveals one');
  box().querySelector('.cs-inline').click();
  ok(box().querySelectorAll('.cs-item').length === 2, 'inline tap');
  E.fire('me', 1); await sleep(10);
  ok(box().querySelectorAll('.cs-item').length === 2, 'inline keeps progress');
  box().querySelector('[data-cs-all]').click();
  ok(box().querySelectorAll('.cs-item').length === 10, 'inline show all');
  { const m = E.d.getElementById('cs-mode'); m.value = 'reader'; m.dispatchEvent(new E.w.Event('change')); }
  await sleep(200);
  ok(/^ORIG:/.test(box().innerHTML), 'restore original');
  // ── ปิดใช้ ──
  { const c = E.d.getElementById('cs-enabled'); c.checked = false; c.dispatchEvent(new E.w.Event('change')); }
  await sleep(200);
  E.fire('gs', 'normal', {}, false); E.fire('cmr', 1);
  ok(!R() && E.prompts.chat_story_format.v === '', 'disabled = nothing');
  { const c = E.d.getElementById('cs-enabled'); c.checked = true; c.dispatchEvent(new E.w.Event('change')); }
  E.fire('gs', 'quiet', {}, false); E.fire('cmr', 1);
  ok(!R(), 'quiet generation ignored');

  // ── บรรยายไม่ใส่ดอกจัน ──
  const P = t => E.ev(`csParse(${JSON.stringify(t)}, {isUser:true, owner:'มินา'}).map(x=>x.k).join(',')`);
  ok(P('มินาเดินเข้าร้านแล้วมองหาโต๊ะว่าง') === 'narr', 'starts with user name = narration');
  ok(P('ฉันหันไปมองหน้าต่าง ฝนยังไม่หยุดตก') === 'narr', 'first person action = narration');
  ok(P('ขอโทษนะ รถติดมาก') === 'say' && P('ไปไหนมาเหรอ') === 'say', 'short talk = speech');
  ok(P('เธอยิ้มแล้วพูดว่า "ไม่เป็นไรหรอก" ก่อนนั่งลง') === 'narr,say,narr', 'quotes split inside a line');
  ok(E.ev(`csParse('เขาหันมา “มาช้านะ”', {owner:'อาเรีย'}).map(x=>x.k+(x.who||'')).join(',')`) === 'narr,sayอาเรีย', 'bot line with quotes, no name');
  E.ev("csCfg().plainUser = 'narr'");
  ok(P('ขอโทษนะ') === 'narr', 'plain setting: always narration');
  E.ev("csCfg().plainUser = 'auto'");
  // ── โหมดนิยาย ──
  E.chat.push({ name: 'อาเรีย', is_user: false, mes: '[ห้องสมุด / หกโมงเย็น]\nแสงแดดสุดท้ายลอดผ่านหน้าต่าง\n\nเธอเงยหน้า “ยังไม่กลับอีกเหรอ”' }); E.addMes(E.chat[4], 4);
  E.ev("csCfg().mode = 'reader'; csCfg().style = 'novel'; csApplyPrompt()");
  ok(/novel prose/.test(E.prompts.chat_story_format.v) && /## chapter title/.test(E.prompts.chat_story_format.v) && E.prompts.chat_story_format.v.length < 180, 'novel prompt (short)');
  E.fire('gs', 'normal', {}, false); E.fire('cmr', 4);
  const N = () => E.d.getElementById('cs-novel');
  ok(!!N() && !R(), 'novel opens instead of chat reader');
  const chs = N().querySelectorAll('.cs-chapter');
  ok(chs.length === 3 && /บทที่ 3/.test(chs[2].innerHTML) && /ห้องสมุด/.test(chs[2].querySelector('.cs-ctitle').innerHTML) && /จบบทที่ 3/.test(chs[2].innerHTML), 'chapters (บท) + scene as title + end marker', chs.length);
  ok(!!chs[0].querySelector('.cs-nuser') && !chs[0].querySelector('.cs-nuser.mark') && /“ยังไม่กลับอีกเหรอ”/.test(chs[2].innerHTML) && /cs-nwho/.test(chs[1].innerHTML), 'user part marked, dialogue, chat lines as prose');
  ok(N().classList.contains('cs-indent') && N().style.getPropertyValue('--cs-pw') === '680px', 'novel typography vars');
  N().querySelector('.cs-nbody').click();
  ok(N().classList.contains('bars-hidden'), 'tap toggles bars');
  const nta = N().querySelector('.cs-input');
  nta.value = 'มินาวางกระเป๋าลงบนโต๊ะ'; N().querySelector('[data-cs="send"]').click();
  ok(E.w.__sent.slice(-1)[0] === 'มินาวางกระเป๋าลงบนโต๊ะ' && N().classList.contains('writing'), 'send from novel, writing indicator');
  ok(N().querySelectorAll('.cs-chapter').length === 4 && /วางกระเป๋า/.test([...N().querySelectorAll('.cs-chapter')].pop().innerHTML), 'own part shows as pending chapter');
  E.chat.push({ name: 'อาเรีย', is_user: false, mes: 'อาเรียหัวเราะเบา ๆ' }); E.addMes(E.chat[6], 6);
  E.fire('cmr', 6);
  const last = [...N().querySelectorAll('.cs-chapter')].pop();
  ok(!N().classList.contains('writing') && /หัวเราะ/.test(last.innerHTML) && /วางกระเป๋า/.test(last.innerHTML) && last.classList.contains('cs-nfresh'), 'reply completes the chapter');
  // แผง Aa
  N().querySelector('[data-cs="naa"]').click();
  ok(N().querySelector('.cs-aapanel').classList.contains('open') && N().style.getPropertyValue('--cs-font') === '18px', 'Aa panel, novel font 18');
  N().querySelector('[data-cs="aa"][data-f="size"][data-v="1"]').click(); N().querySelector('[data-cs="aa"][data-f="size"][data-v="1"]').click();
  N().querySelector('[data-cs="aa"][data-f="lh"][data-v="2.3"]').click();
  N().querySelector('[data-cs="aa"][data-f="theme"][data-v="sepia"]').click();
  ok(N().style.getPropertyValue('--cs-font') === '20px' && N().style.getPropertyValue('--cs-lh') === '2.3' && N().style.getPropertyValue('--cs-bg') === '#f4ecdf', 'Aa size / spacing / theme live');
  E.ev("csCfg().preset = 'classic'");
  N().querySelector('.cs-aapanel [data-cs="nsettings"]').click();
  ok(!!S() && S().querySelector('.cs-tabs .on').dataset.tab === 'novel' && S().querySelector('.cs-preview').classList.contains('novel'), 'Aa opens novel settings with novel preview');
  { const r = S().querySelector('[data-k="pageWidth"]'); r.value = '800'; r.dispatchEvent(new E.w.Event('input', { bubbles: true })); }
  S().querySelector('[data-k="novelIndent"]').click();
  S().querySelector('[data-seg="userInNovel"][data-val="hide"]').click();
  ok(N().style.getPropertyValue('--cs-pw') === '800px' && !N().classList.contains('cs-indent') && !N().querySelector('.cs-nuser'), 'novel settings apply live');
  S().querySelector('[data-act="close"]').click(); await sleep(260);
  E.d.dispatchEvent(new E.w.KeyboardEvent('keydown', { key: 'Escape' })); await sleep(260);
  ok(!N(), 'esc closes novel');
  E.ev("csCfg().mode = 'inline'; csCfg().userInNovel = 'mark'; csInlineAll()");
  ok(!!E.d.querySelector('.mes[mesid="4"] .cs-ninline .cs-np'), 'novel in main chat');
  E.ev("csCfg().mode = 'reader'; csCfg().style = 'chat'; csInlineAll()");
  ok(/^ORIG:/.test(E.d.querySelector('.mes[mesid="4"] .mes_text').innerHTML), 'novel inline restored');

  // ── ชื่อบทจาก ## และคำว่า ตอน ──
  ok(E.ev(`csNovelLines({mes:'## คืนที่ฝนตก\\nเขาเดินออกไป'})[0].k`) === 'title', 'chapter title line');
  E.ev("csCfg().chapterWord = 'ตอน'");
  ok(/ตอนที่ 2/.test(E.ev("csNovelChapterHTML({user:[],bot:{mes:'x'},botId:1},2)")), 'chapter word ตอน');
  E.ev("csCfg().chapterWord = 'บท'");
  // ── กดส่งเปล่า = ให้บอทเจนต่อ ──
  E.ev("csCfg().style = 'chat'; csCfg().mode = 'reader'; csGenerating = false; csOpenMessage(1)");
  const sentBefore = E.w.__sent.length, itemsBefore = items();
  R().querySelector('[data-cs="send"]').click();
  ok(E.w.__sent.length === sentBefore + 1 && E.w.__sent.slice(-1)[0] === '' && R().classList.contains('generating'), 'empty send triggers generation', E.w.__sent.slice(-1));
  E.fire('ge');
  E.ev('csCloseReader(true)');
  // ── ใช้คู่กับ Auto-Closer ──
  E.ev("csOpenMessage(1)");
  const ta2 = R().querySelector('.cs-input');
  const bi = (data, type) => { const ev = new E.w.InputEvent('beforeinput', { inputType: type || 'insertText', data, bubbles: true, cancelable: true }); ta2.dispatchEvent(ev); return ev.defaultPrevented; };
  ta2.value = ''; ta2.selectionStart = ta2.selectionEnd = 0;
  ok(bi('"') === false && ta2.value === '', 'no Auto-Closer installed = normal typing');
  const ac = E.d.createElement('div'); ac.id = 'ac-settings'; E.d.body.appendChild(ac);
  E.w.localStorage.setItem('nutho_autocloser', JSON.stringify({ pairs: [['*', '*', false, false], ['«', '»', true, true]], msgTarget: true, pairBackspace: true }));
  ok(bi('"') === true && ta2.value === '""' && ta2.selectionStart === 1, 'auto-close quote pair');
  bi('"');
  ok(ta2.value === '""' && ta2.selectionStart === 2, 'typing closer skips over');
  ta2.value = 'x'; ta2.selectionStart = ta2.selectionEnd = 1;
  ok(bi('*') === false, 'pair disabled in Auto-Closer stays off');
  ok(bi('«') === true && ta2.value === 'x«»', 'custom pair from Auto-Closer');
  ta2.selectionStart = ta2.selectionEnd = 2;
  bi(null, 'deleteContentBackward');
  ok(ta2.value === 'x', 'backspace removes empty pair');
  E.w.localStorage.setItem('nutho_autocloser', JSON.stringify({ msgTarget: false }));
  ta2.value = ''; ta2.selectionStart = ta2.selectionEnd = 0;
  ok(bi('(') === false, 'respects Auto-Closer chat toggle');
  E.ev('csCloseReader(true)');

  // ── คอมเมนต์และรีแอคชันท้ายย่อหน้า ──
  E.ctx.getTokenCountAsync = async t => Math.ceil(String(t).length / 4);
  E.ctx.saveChat = async () => { E.w.__saved = (E.w.__saved || 0) + 1; };
  E.w.__rawCalls = [];
  E.ctx.generateRaw = async function ({ prompt, systemPrompt, responseLength } = {}) {
    E.w.__rawCalls.push({ prompt, systemPrompt, responseLength });
    return 'นี่ค่ะ ```json\n[{"p":1,"c":[{"n":"janyaahri","t":"งื้อออ น่ารักกกก","r":"heart"},{"n":"ploy_22","t":"ใจบาง","r":"cry"}]},{"p":2,"c":[{"n":"moo","t":"ตายแล้ว","r":"fire"}]},{"p":99,"c":[{"n":"x","t":"ย่อหน้าไม่มีจริง","r":"heart"}]}]\n```';
  };
  E.chat.push({ name: 'อาเรีย', is_user: false, mes: '## บทแห่งฝน\nฝนตกหนักทั้งคืน\n\nเธอยื่นผ้าให้ “เช็ดก่อนสิ”\n\nแล้วทั้งคู่ก็เงียบไป' }); E.addMes(E.chat[E.chat.length - 1], E.chat.length - 1);
  const cid = E.chat.length - 1;
  E.ev("csCfg().style = 'novel'; csCfg().mode = 'reader'; csCfg().cmtOn = false; csOpenNovel()");
  ok(!N().querySelector('.cs-cmt'), 'comments off by default = no icons');
  E.ev("csCloseNovel(true); csCfg().cmtOn = true; csCfg().cmtPick = 'all'; csOpenNovel()");
  const last2 = () => [...N().querySelectorAll('.cs-chapter')].pop();
  ok(last2().querySelectorAll('.cs-cmt').length === 3 && !last2().querySelector('.cs-ctitle .cs-cmt'), 'icon at end of each paragraph (not title)');
  last2().querySelector('.cs-cmt').click();
  await sleep(30);
  const sh = () => N().querySelector('.cs-cmt-sheet');
  ok(N().classList.contains('cmt-open') && /ยังไม่มีใครมาคอมเมนต์/.test(sh().innerHTML) && E.w.__rawCalls.length === 0, 'sheet opens, nothing generated yet (0 tokens)');
  ok(/ใช้ประมาณ \d[\d,]* โทเคน/.test(sh().querySelector('[data-est]').textContent), 'token estimate shown before generating', sh().querySelector('[data-est]').textContent);
  sh().querySelector('[data-cs="cmtgen"]').click();
  await sleep(60);
  const call = E.w.__rawCalls[0];
  ok(call && /janyaahri/.test(call.prompt) && /\[1\] ฝนตกหนักทั้งคืน/.test(call.prompt) && !/บทแห่งฝน\n/.test(call.prompt.split('Write')[0].replace('[', '')) && call.responseLength === 360, 'one raw call with chapter paragraphs + janyaahri', call && call.prompt.slice(0, 200));
  ok(!/POCKET|อาเรีย: มาช้านะ/.test(call.prompt), 'prompt has only this chapter, no chat history');
  const d = E.ev(`csCmtData(${cid})`);
  ok(d && d.list[1].length === 2 && d.list[2].length === 1 && !d.list[99] && d.tok.in > 0 && d.tok.out > 0 && E.w.__saved > 0, 'comments stored with message, invalid paragraph dropped, saved');
  ok(E.ev('csCfg().cmtUsed.calls') === 1 && E.ev('csCfg().cmtUsed.tokens') === d.tok.in + d.tok.out, 'token usage counted');
  ok(last2().querySelectorAll('.cs-cmt.has').length === 2 && /2<\/span>/.test(last2().querySelectorAll('.cs-cmt.has')[0].innerHTML), 'reaction icons + counts on paragraphs');
  ok(sh().querySelector('.cs-cmt-row.janya') && /janyaahri/.test(sh().innerHTML) && /ใช้ไป \d/.test(sh().innerHTML), 'janyaahri comment with badge + tokens used');
  sh().querySelector('.cs-cmt-in').value = 'ชอบมากค่ะ'; sh().querySelector('[data-cs="cmtsend"]').click();
  ok(E.ev(`csCmtFor(${cid}, 1).some(c=>c.me && c.t==='ชอบมากค่ะ')`) && E.w.__rawCalls.length === 1, 'own comment added, no tokens');
  // แก้ไขคอมเมนต์ของคนอ่าน
  sh().querySelector('[data-cs="cmtedit"][data-k="1"]').click();
  ok(!!sh().querySelector('.cs-cmt-ein'), 'edit box opens');
  sh().querySelector('.cs-cmt-ein').value = 'ใจบางมากกกก';
  sh().querySelector('[data-cs="cmtreact"][data-r="fire"]').click();
  sh().querySelector('[data-cs="cmtsave"]').click();
  ok(E.ev(`csCmtFor(${cid}, 1)[1].t`) === 'ใจบางมากกกก' && E.ev(`csCmtFor(${cid}, 1)[1].r`) === 'fire' && !sh().querySelector('.cs-cmt-ein'), 'edit text + reaction saved');
  // ลบ
  const before3 = E.ev(`csCmtFor(${cid}, 2).length`);
  last2().querySelector(`.cs-cmt[data-p="2"]`).click();
  sh().querySelector('[data-cs="cmtdel"][data-k="0"]').click();
  ok(E.ev(`csCmtFor(${cid}, 2).length`) === before3 - 1 && !last2().querySelector(".cs-cmt.has[data-p=\"2\"]"), 'delete comment, icon back to plain');
  last2().querySelector(`.cs-cmt[data-p="1"]`).click();
  sh().querySelector('a[data-cs="cmtgen"]').click(); await sleep(60);
  ok(E.w.__rawCalls.length === 2 && E.ev(`csCmtFor(${cid}, 1).some(c=>c.me)`), 'regenerate keeps own comment');
  E.d.dispatchEvent(new E.w.KeyboardEvent('keydown', { key: 'Escape' }));
  ok(!N().classList.contains('cmt-open') && !!N(), 'esc closes sheet first');
  E.chat[cid].mes += '\nเพิ่มย่อหน้าใหม่';
  ok(E.ev(`csCmtData(${cid})`) === null, 'edited chapter invalidates old comments');
  const jp = E.ev(`csCmtPrompt(${cid}).prompt`);
  ok(/MUST each comment/.test(jp) && /- janyaahri: /.test(jp) && /Knows right from wrong/.test(jp) && /Kuromi/.test(jp) && /trypophobia/.test(jp), 'janyaahri always in the same call, full card + right/wrong');
  ok(!E.d.body.innerHTML.includes('data-k="cmtJanya"'), 'no separate janyaahri switch');
  E.ev("csCfg().cmtAuto = true; csCfg().cmtGate = 'always'; csGenerating = false");
  E.chat.push({ name: 'อาเรีย', is_user: false, mes: 'ย่อหน้าใหม่ของบทต่อไป' }); E.addMes(E.chat[E.chat.length - 1], E.chat.length - 1);
  E.fire('gs', 'normal', {}, false); E.fire('cmr', E.chat.length - 1);
  await sleep(1100);
  ok(E.w.__rawCalls.length === 3, 'auto mode generates for new chapter', E.w.__rawCalls.length);
  E.ev("csCfg().cmtAuto = false");
  // ตัวเลขโทเคนในหน้าตั้งค่า
  E.ev("csOpenSettings('cmt')");
  await sleep(50);
  ok(/~\d+ โทเคน/.test(S().querySelector('[data-tok="cmt"]').textContent) && /~\d+ โทเคน/.test(S().querySelector('[data-tok="format"]').textContent), 'token numbers in settings');
  S().querySelector('[data-act="cmt-reset"]').click();
  ok(E.ev('csCfg().cmtUsed.tokens') === 0, 'reset usage counter');
  S().querySelector('[data-act="close"]').click(); await sleep(260);
  E.ev("csCloseNovel(true); csCfg().style = 'chat'; csCfg().cmtOn = false");
  E.ev("SillyTavern.getContext().extensionSettings.chatStory = {_v: 13, userInNovel: 'mark', cmtJanya: false}");
  ok(E.ev('csCfg().userInNovel') === 'same' && E.ev('csCfg().cmtJanya') === undefined, 'migrate: own part like story, janyaahri switch removed');
  E.ev("SillyTavern.getContext().extensionSettings.chatStory = {}");
  ok(E.ev('csCfg().userInNovel') === 'same', 'default own part = like the story');
  // ตัวอย่างเลื่อนได้
  E.ev("csOpenSettings('look')");
  ok(/overflow-y:auto|overflow-y: auto/.test(require('fs').readFileSync(require('path').join(__dirname,'..','style.css'),'utf8').match(/\.cs-preview\{[^}]*\}/)[0]), 'preview scrollable');
  E.ev('csCloseSettings()'); await sleep(260);

  // ── ด่านเรียกเอง (แบบทุกย่อหน้า) ──
  E.ev("csCfg().style = 'novel'; csCfg().cmtOn = true; csCfg().cmtPick = 'all'; csCfg().cmtAuto = true; csCfg().cmtGate = 'keyword'; csCfg().cmtMinHits = 2; csGenerating = false; csApplyPrompt()");
  ok(!/\[c\]/.test(E.prompts.chat_story_format.v), 'all-paragraphs mode adds nothing to main prompt');
  const calls0 = E.w.__rawCalls.length;
  const addBot = t => { E.chat.push({ name: 'อาเรีย', is_user: false, mes: t }); E.addMes(E.chat[E.chat.length - 1], E.chat.length - 1); E.fire('gs', 'normal', {}, false); E.fire('cmr', E.chat.length - 1); return E.chat.length - 1; };
  addBot('วันนี้อากาศดี เธอเดินไปซื้อขนม');
  await sleep(1100);
  ok(E.w.__rawCalls.length === calls0, 'keyword gate: quiet chapter = no call');
  addBot('เธอร้องไห้แล้วกอดเขาไว้แน่น น้ำตาไหลไม่หยุด');
  await sleep(1100);
  ok(E.w.__rawCalls.length === calls0 + 1, 'keyword gate: dramatic chapter = one call');
  E.ev("csCfg().cmtGate = 'always'");
  addBot('ธรรมดามาก');
  await sleep(1100);
  ok(E.w.__rawCalls.length === calls0 + 2, 'always gate');
  // ── โมเดลเลือกบรรทัดที่สมควรมีคอมเมนต์ ──
  E.ev("csCfg().cmtPick = 'model'; csCfg().cmtAuto = false; csApplyPrompt()");
  ok(/with \[c\]/.test(E.prompts.chat_story_format.v) && !/none if nothing/.test(E.prompts.chat_story_format.v) && /novel prose/.test(E.prompts.chat_story_format.v), 'model-pick line rides the same main prompt');
  const mid = addBot('## คืนนั้น\nลมพัดแรงจนหน้าต่างสั่น\n\n“ฉันไม่เคยลืมเธอเลย” เขากระซิบ [c]\n\nเธอหันหลังแล้วเดินจากไปทั้งน้ำตา [c]\n\nเสียงประตูปิดลงเบา ๆ');
  ok(!/\[c\]/.test(E.chat[mid].mes) && E.chat[mid].extra.cs_cmt_marks.lines.length === 2, 'tags removed from the message, 2 lines remembered', E.chat[mid].extra.cs_cmt_marks);
  E.ev('csCloseNovel(true); csOpenNovel()');
  const lastCh = [...N().querySelectorAll('.cs-chapter')].pop();
  const icons = [...lastCh.querySelectorAll('.cs-cmt')].map(b => b.closest('p').textContent);
  ok(icons.length === 4, 'comment box at the end of every paragraph (like the app)', icons);
  const calls1 = E.w.__rawCalls.length;
  [...lastCh.querySelectorAll('.cs-cmt')].find(b => /ไม่เคยลืม/.test(b.closest('p').textContent)).click(); await sleep(20);
  N().querySelector('.cs-cmt-go').click(); await sleep(60);
  const pr = E.w.__rawCalls[calls1].prompt;
  ok(/ไม่เคยลืม/.test(pr) && /เดินจากไป/.test(pr) && !/ลมพัดแรง/.test(pr) && !/ประตูปิด/.test(pr) && /For each paragraph above/.test(pr), 'comment call sends only the picked lines');
  E.ev('csCmtClose()');
  const plain = addBot('เช้าวันใหม่ เธอตื่นสาย');
  E.ev('csCloseNovel(true); csOpenNovel()');
  ok(!![...N().querySelectorAll('.cs-chapter')].pop().querySelector('.cs-cmt'), 'nothing picked still shows comment boxes');
  // แตะย่อหน้าที่โมเดลไม่ได้เลือก = ส่งย่อหน้านั้นด้วย
  const pc = [...N().querySelectorAll('.cs-chapter')].pop().querySelector('.cs-cmt'); pc.click(); await sleep(20);
  const cBefore = E.w.__rawCalls.length;
  N().querySelector('.cs-cmt-go').click(); await sleep(60);
  ok(E.w.__rawCalls.length === cBefore + 1 && /ตื่นสาย/.test(E.w.__rawCalls[cBefore].prompt), 'tapped unpicked paragraph gets sent');
  E.ev('csCmtClose()');
  E.ev("csCfg().cmtAuto = true");
  const calls2 = E.w.__rawCalls.length;
  addBot('เรียบ ๆ ไม่มีอะไร');
  await sleep(1100);
  ok(E.w.__rawCalls.length === calls2, 'auto: no picked lines = no call');
  addBot('เธอตบหน้าเขาเต็มแรง [c]');
  await sleep(1100);
  ok(E.w.__rawCalls.length === calls2 + 1, 'auto: picked lines = one call');
  E.ev('csCloseNovel(true)');
  // ป้ายไม่โผล่ในหน้าอ่านไหนเลย
  ok(!/\[c\]|cmt/.test(E.ev("csCleanText('ก [c]\\nข\\n[cmt]')")), 'tags never shown');
  E.ev("SillyTavern.getContext().extensionSettings.chatStory.cmtAuto = false; csCfg().cmtAuto = false; csCfg().style = 'chat'; csCfg().cmtOn = false; csApplyPrompt()");
  ok(!/\[c\]/.test(E.prompts.chat_story_format.v), 'model-pick line gone when comments off');
  E.ev("SillyTavern.getContext().extensionSettings.chatStory = {_v: 15, cmtGate: 'ask'}");
  ok(E.ev('csCfg().cmtGate') === 'keyword' && E.ev('csCfg().cmtPick') === 'model', 'migrate old ask gate');
  E.ev("SillyTavern.getContext().extensionSettings.chatStory = {}");

  // ── คนอ่านประจำ ──
  E.ev("SillyTavern.getContext().extensionSettings.chatStory = {}; csCfg().style = 'novel'; csCfg().cmtOn = true");
  ok(E.ev('csCmtChars().length') === 1 && E.ev('csCmtChars()[0].name') === 'janyaahri' && E.ev('csCmtChars()[0].on') === true, 'janyaahri is there by default');
  E.ev("csOpenSettings('cmt')"); await sleep(30);
  S().querySelector('[data-act="cc-add"]').click();
  const f = () => S().querySelector('.cs-cc-form');
  f().querySelector('.cs-cc-name').value = 'แม่ยก_ชิปเปอร์';
  f().querySelector('.cs-cc-desc').value = 'ชิปพระนางสุดใจ แซะตัวร้ายตลอด';
  f().querySelector('[data-act="cc-save"]').click();
  ok(E.ev('csCmtChars().length') === 2 && E.ev('csCmtChars()[1].name') === 'แม่ยก_ชิปเปอร์' && E.ev('csCmtChars()[1].on') === true, 'add reader with + button');
  ok(/- แม่ยก_ชิปเปอร์: ชิปพระนางสุดใจ/.test(E.ev('csCmtReadersLine()')) && /- janyaahri:/.test(E.ev('csCmtReadersLine()')), 'both readers in the same call');
  E.ev("csCmtChars()[1].img = 'data:image/jpeg;base64,AAA'");
  ok(/<img class="cs-cmt-av" src="data:image\/jpeg/.test(E.ev("(() => { const m = SillyTavern.getContext().chat; m.push({name:'อาเรีย',is_user:false,mes:'ก',extra:{}}); const id = m.length-1; m[id].extra.cs_cmt = {h: csHash('ก'), list:{0:[{n:'แม่ยก_ชิปเปอร์',t:'กรี๊ด',r:'heart'}]}}; return csCmtSheetHTML(id, 0); })()")), 'custom reader avatar in comments');
  const janSw = S().querySelector('[data-cc-on="janya"]'); janSw.checked = false; janSw.dispatchEvent(new E.w.Event('change', { bubbles: true }));
  ok(E.ev('csCmtChars()[0].on') === false && !/janyaahri/.test(E.ev('csCmtReadersLine()')), 'janyaahri can be switched off');
  S().querySelector('[data-act="cc-edit"][data-id="janya"]').click();
  ok(S().querySelector('.cs-cc-form .cs-cc-name').disabled && !S().querySelector('.cs-cc-form .cs-cc-desc'), 'janyaahri card is fixed (image only)');
  S().querySelector('[data-act="cc-cancel"]').click();
  // รายละเอียดโทเคน
  await sleep(80);
  const bd = S().querySelector('[data-tok="bd"]').innerHTML;
  ok(/เนื้อบทที่ส่งไป/.test(bd) && /คนอ่านประจำ/.test(bd) && /คำตอบที่ได้กลับ/.test(bd) && /รวม/.test(bd), 'token breakdown lists every part');
  S().querySelector('[data-act="close"]').click(); await sleep(260);
  E.ev("SillyTavern.getContext().extensionSettings.chatStory = {}");
  // ย้ายค่าจาก 1.0
  E.ev("SillyTavern.getContext().extensionSettings.chatStory = {theme:'mint'}");
  ok(E.ev('csCfg().preset') === 'mint', 'migrates 1.0 theme');
  ok(!E.errors.length, 'no uncaught', E.errors.map(String));
  console.log(`\nPASS ${pass}  FAIL ${fail}`);
  process.exit(fail ? 1 : 0);
})().catch(e => { console.log('CRASH', e); process.exit(1); });
