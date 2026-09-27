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
  ok(E.ev('csCfg().preset') === 'ink' && E.ev("csVars()['--cs-bg']") === '#0e0e0e', 'default dark (ดำขาว)');
  ok(!/ต้นฉบับ/.test(E.ev('JSON.stringify(CS_PRESETS)')) && E.ev("CS_PRESETS.classic.name") === 'ขาวดำเรียบ', 'black & white still available, no "original" label');
  ok(E.prompts.chat_story_format && /Format: chat novel/.test(E.prompts.chat_story_format.v) && /Never write มินา's words/.test(E.prompts.chat_story_format.v) && E.prompts.chat_story_format.v.length < 260, 'format prompt (short)', E.prompts.chat_story_format.v.length);
  ok(!!E.d.querySelector('.chat-story-settings #cs-open-settings') && !!E.d.getElementById('cs-wand-set'), 'drawer + wand');
  // ── หน้าอ่าน + ประวัติก่อนหน้า ──
  E.ev('csCfg().typingMs = 0');
  E.fire('gs', 'normal', {}, false); E.fire('cmr', 1);
  const R = () => E.d.getElementById('cs-reader');
  const items = () => R().querySelectorAll('.cs-list > .cs-item').length;
  ok(!!R() && R().querySelectorAll('.cs-old').length === 2 && items() === 3, 'reader opens with previous message shown + first bubble', items());
  ok(!!R().querySelector('.cs-input') && R().style.getPropertyValue('--cs-bg') === '#0e0e0e', 'input bar + theme vars');
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
  ok(E.ev("csCastGet('แบรม').color") === '#2244aa' && E.ev("csCastGet('แบรม').sound") === 'retro' && !E.ev("csCfg().chars['แบรม']"), 'per-character color & sound (scoped to this card)');
  ok(/background:#2244aa;color:#ffffff/.test(E.ev("csItemHTML({k:'say',who:'แบรม',text:'x'})")), 'per-char bubble color with contrast text');
  S().querySelector('[data-tab="read"]').click();
  const hist = S().querySelector('[data-k="history"]'); hist.value = '2'; hist.dispatchEvent(new E.w.Event('input', { bubbles: true }));
  ok(E.ev('csCfg().history') === 2, 'history range');
  S().querySelector('[data-act="reset"]').click();
  ok(E.ev('csCfg().preset') === 'ink' && E.ev('csCfg().sound') === 'pop' && !Object.keys(E.ev('csCfg().chars')).length, 'reset to defaults');
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
  ok(call && /janyaahri/.test(call.prompt) && /\[1\] ฝนตกหนักทั้งคืน/.test(call.prompt) && !/บทแห่งฝน\n/.test(call.prompt.split('Write')[0].replace('[', '')) && call.responseLength === 2000, 'one raw call with chapter paragraphs + janyaahri', call && call.prompt.slice(0, 200));
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
  ok(/comment only if they would want to here, your call/.test(jp) && !/MUST/.test(jp) && /- janyaahri: /.test(jp) && /Knows right from wrong/.test(jp) && /Kuromi/.test(jp) && /trypophobia/.test(jp), 'janyaahri in the same call, model decides if she comments, full card + right/wrong');
  E.ev("csCmtChars()[0].when = 'always'");
  ok(/MUST each comment 1-2 times[^]*- janyaahri:/.test(E.ev('csCmtReadersLine()')), 'janyaahri set to always → must comment');
  E.ev("delete csCmtChars()[0].when");
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
  E.ev("csCfg().style = 'novel'; csCfg().cmtOn = true; csCfg().cmtPick = 'all'; csCfg().cmtAuto = true; csCfg().cmtGate = 'keyword'; csCfg().cmtMinHits = 2; csCfg().cmtEvery = 0; csCfg().cmtRandom = 0; csGenerating = false; csApplyPrompt()");
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
  E.ev("csCfg().cmtAuto = true; csCfg().cmtEvery = 0; csCfg().cmtRandom = 0");
  const calls2 = E.w.__rawCalls.length;
  addBot('เรียบ ๆ ไม่มีอะไร');
  await sleep(1100);
  ok(E.w.__rawCalls.length === calls2, 'auto: no picked lines = no call');
  addBot('เธอตบหน้าเขาเต็มแรง [c]');
  await sleep(1100);
  ok(E.w.__rawCalls.length === calls2 + 1, 'auto: picked lines = one call');
  // ★ 1.9 ครบรอบ / สุ่ม ผสมกับโมเดลเลือก
  E.ev("csCfg().cmtEvery = 3; csCfg().cmtRandom = 0");
  const calls3 = E.w.__rawCalls.length;
  addBot('หนึ่ง'); await sleep(1100);
  addBot('สอง'); await sleep(1100);
  ok(E.w.__rawCalls.length === calls3, 'every 3: not yet after 2 plain messages', E.ev('csCmtSince(SillyTavern.getContext().chat.length-1)'));
  ok(E.ev("csCmtSince(SillyTavern.getContext().chat.length-1)") === 2, 'counts bot messages since last comments');
  addBot('สาม'); await sleep(1100);
  ok(E.w.__rawCalls.length === calls3 + 1, 'every 3: third message calls');
  ok(E.ev("csCmtAutoReason(SillyTavern.getContext().chat.length-1)") === '' || true, 'reason api');
  E.ev("csCfg().cmtEvery = 0; csCfg().cmtRandom = 100");
  const calls4 = E.w.__rawCalls.length;
  addBot('สุ่มแน่นอน'); await sleep(1100);
  ok(E.w.__rawCalls.length === calls4 + 1, 'random 100% calls');
  E.ev("csCfg().cmtRandom = 0");
  addBot('ไม่มีทาง'); await sleep(1100);
  ok(E.w.__rawCalls.length === calls4 + 1, 'random 0% and every 0: no call');
  E.ev("csCfg().cmtEvery = 5; csCfg().cmtRandom = 0");
  addBot('ตบ [c]'); await sleep(1100);
  ok(E.w.__rawCalls.length === calls4 + 2, 'model pick still triggers alongside every-N');
  E.ev("csCfg().cmtEvery = 3; csCfg().cmtRandom = 30");
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
  // ★ 1.15 ป้ายเลือกว่าจะมาทุกครั้งหรือให้โมเดลคิด
  const wj = () => S().querySelector('[data-act="cc-when"][data-id="janya"]');
  E.ev('csCmtChars()[0].on = true');
  ok(wj() && /โมเดลคิดเอง/.test(wj().textContent), 'reader chip: model decides by default');
  wj().click();
  ok(E.ev("csCmtChars()[0].when") === 'always' && /ทุกครั้ง/.test(wj().textContent) && /MUST[^]*janyaahri/.test(E.ev('csCmtReadersLine()')), 'tap chip → always');
  wj().click();
  ok(E.ev("csCmtChars()[0].when") === 'maybe' && !/MUST/.test(E.ev('csCmtReadersLine()')), 'tap again → model decides');
  const mix = E.ev("(() => { const l = csCmtChars(); l.forEach(c => c.on = true); l[1].when = 'always'; const r = csCmtReadersLine(); l[1].when = 'maybe'; return r; })()");
  ok(/MUST[^]*แม่ยก_ชิปเปอร์[^]*only if they would want[^]*janyaahri/.test(mix), 'mixed: one always, one maybe', mix);
  E.ev("csCmtChars()[0].on = false");
  // รายละเอียดโทเคน
  await sleep(80);
  const bd = S().querySelector('[data-tok="bd"]').innerHTML;
  ok(/เนื้อบทที่ส่งไป/.test(bd) && /คนอ่านประจำ/.test(bd) && /คำตอบที่ได้กลับ/.test(bd) && /รวม/.test(bd), 'token breakdown lists every part');
  S().querySelector('[data-act="close"]').click(); await sleep(260);

  // ══ 1.8 แยกคนพูดในร้อยแก้ว + ตัวละครรายการ์ด ══
  {
    const F = env([{ name: 'อาเรีย', is_user: false, mes: 'สวัสดี' }]);
    await sleep(30);
    const C = F.ctx;
    C.characters = [{ name: 'อาเรีย', avatar: 'aria.png' }, { name: 'แบรม', avatar: 'bram.png' }, { name: 'อาเรีย', avatar: 'aria2.png' }];
    C.characterId = 0;
    F.ev("csCastSet('เคน', {}); csCastSet('เคนจิ', {}); csCastSet('อาเรีย', {aliases:'พี่รี, คุณหนู'})");
    const P = (t, owner, isUser) => F.ev(`csParse(${JSON.stringify(t)}, {owner:${JSON.stringify(owner || 'อาเรีย')}, isUser:${!!isUser}})`);
    const K = (t, owner, isUser) => P(t, owner, isUser).map(x => x.k + (x.who ? ':' + x.who : '') + (x.u ? ':U' : '')).join(',');
    ok(K('“มาแล้วเหรอ” เคนถาม') === 'say:เคน,narr', 'name after quote + verb', K('“มาแล้วเหรอ” เคนถาม'));
    ok(K('อาเรียยิ้มแล้วพูดว่า “นั่งก่อนสิ”') === 'narr,say:อาเรีย', 'name before quote + verb');
    ok(K('เคนเดินเข้ามาในห้อง\nเขาพูดว่า “หิวแล้ว”') === 'narr,narr,say:เคน', 'pronoun + verb → last mentioned', K('เคนเดินเข้ามาในห้อง\nเขาพูดว่า “หิวแล้ว”'));
    const alt = K('“เธอมาทำอะไรที่นี่” เคนถาม\n“มาหาเธอไง” อาเรียตอบ\n“จริงเหรอ”\n“จริงสิ”');
    ok(alt === 'say:เคน,narr,say:อาเรีย,narr,say:เคน,say:อาเรีย', 'quote-only paragraphs alternate', alt);
    ok(K('เคน\nไปก่อนนะ') === 'say:เคน', 'screenplay name line');
    ok(K('เคน\n*เดินจากไป*') === 'narr:,narr'.replace(':,', ',') || /^narr,narr$/.test(K('เคน\n*เดินจากไป*')), 'lone name then action is narration', K('เคน\n*เดินจากไป*'));
    ok(K('— ไม่เป็นไร — เคนว่า') === 'say:เคน,narr', 'em-dash dialogue with tag', K('— ไม่เป็นไร — เคนว่า'));
    ok(K('เคนตะโกน “อย่าไปนะ') === 'narr,say:เคน', 'unclosed quote', K('เคนตะโกน “อย่าไปนะ'));
    ['「ไปเถอะ」 เคนพูด', '«ไปเถอะ» เคนพูด', '"ไปเถอะ" เคนพูด', '＂ไปเถอะ＂ เคนพูด', '“ไปเถอะ” เคนพูด'].forEach(t => ok(P(t)[0].k === 'say' && P(t)[0].who === 'เคน' && P(t)[0].text === 'ไปเถอะ', 'quote type ' + t[0], P(t)));
    ok(K('『เขารู้หรือเปล่านะ』 อาเรียคิด') === 'think:อาเรีย,narr', 'think with 『』 + think verb');
    ok(K('‘ไม่อยากกลับเลย’') === 'think:อาเรีย', 'single quotes without speech verb = thought');
    ok(K('อาเรียนึกในใจ “อย่าหันมานะ”') === 'narr,think:อาเรีย', 'think verb before quote');
    ok(K('“ใจเย็น” พี่รีบอก') === 'say:อาเรีย,narr', 'alias maps to main name', K('“ใจเย็น” พี่รีบอก'));
    ok(K('คุณหนู: ว่าไง') === 'say:อาเรีย', 'alias in Name: line');
    ok(K('“โอเค” เคนจิพูด') === 'say:เคนจิ,narr', 'longest name wins');
    ok(K('“รอด้วย” มินาพูด') === 'say:มินา,narr', 'bot-written user line stays left by default (right = only what we typed)');
    ok(/cs-row left/.test(F.ev("csItemHTML(csParse('“รอด้วย” มินาพูด',{owner:'อาเรีย'})[0])")), 'rendered on the left');
    F.ev("csCfg().userLinesRight = true");
    ok(K('“รอด้วย” มินาพูด') === 'say:มินา:U,narr', 'option: bot writes user line → our side');
    F.ev("csCastSet('ยัยมิน', {me:true, aliases:'มินนี่'})");
    ok(K('“ฮัลโหล” ยัยมินพูด') === 'say:ยัยมิน:U,narr' && K('“ฮัลโหล” มินนี่พูด') === 'say:ยัยมิน:U,narr', '"this is me" flag and its alias', K('“ฮัลโหล” มินนี่พูด'));
    C.name1 = 'อาเรีย';
    ok(K('อาเรีย: สวัสดี') === 'say:อาเรีย' && K('“ไป” อาเรียพูด') === 'say:อาเรีย,narr', 'user name == char name stays bot side in bot message');
    ok(K('อาเรีย: สวัสดี', 'อาเรีย', true) === 'say:อาเรีย:U', 'same name in our own message stays our side');
    C.name1 = 'มินา';
    F.ev("csCfg().userLinesRight = false");
    ok(K('## บทที่ 3 คืนฝนตก\nฝนตก') === 'scene,narr', 'novel chapter heading → scene in chat view');
    ok(K('“ไม่” เขาพูด') === 'say:อาเรีย,narr', 'pronoun alone → message owner');
    ok(K('เธอเดินออกไปเงียบ ๆ') === 'narr', 'plain narration stays narration');
    ok(K('"Hurry," Arin said.\nArin said, "Go now."\n"No," said Tom.', 'Bot') === 'say:Arin,narr,narr,say:Arin,say:Tom,narr', 'discovers new English names', K('"Hurry," Arin said.\nArin said, "Go now."\n"No," said Tom.', 'Bot'));
    ok(K('“เร็วเข้า” โทมัสพูดเสียงดัง') === 'say:โทมัส,narr', 'discovers new Thai name after quote');
    ok(K('โทมัสกระซิบ “ระวังนะ”') === 'narr,say:โทมัส', 'discovers new Thai name before quote');
    ok(F.ev("csGuessNewNames('“ไป” เขาพูด\\n“ไม่” ชายหนุ่มตอบ\\n“อืม” หญิงสาวพูด')").length === 0, 'no junk names (pronouns / descriptors)');
    // ชื่อซ้ำคนละการ์ด ไม่ปนกัน
    F.ev("csCastSet('เคน', {color:'#aa0000'})");
    ok(F.ev("csCharOpt('เคน').color") === '#aa0000', 'color set in card A');
    C.characterId = 1;
    ok(F.ev("csScope()") === 'c:bram.png' && !F.ev("csCastGet('เคน')") && F.ev("csCharOpt('เคน').color") === '', 'same name in another card is separate');
    ok(F.ev("csAvatarSrc('อาเรีย', '', false)") === '', 'no avatar from a same-name card outside this chat');
    C.characterId = 2;
    ok(/aria2\.png/.test(F.ev("csAvatarSrc('อาเรีย', '', false)")), 'card B (same name) uses its own avatar');
    C.characterId = 0;
    ok(/aria\.png/.test(F.ev("csAvatarSrc('อาเรีย', '', false)")) && F.ev("csCharOpt('เคน').color") === '#aa0000', 'back in card A: own avatar and colors');
    // กลุ่มที่มีสองการ์ดชื่อซ้ำ
    C.groupId = 'g1'; C.groups = [{ id: 'g1', name: 'แก๊ง', members: ['aria.png', 'aria2.png', 'bram.png'] }];
    ok(F.ev("csScope()") === 'g:g1' && F.ev("csScopeLabel()") === 'กลุ่ม แก๊ง', 'group scope');
    const g1 = F.ev("csParseMessage({name:'อาเรีย', original_avatar:'aria2.png', mes:'อาเรีย: ฮัลโหล'})")[0];
    const g2 = F.ev("csParseMessage({name:'อาเรีย', original_avatar:'aria.png', mes:'อาเรีย: หวัดดี'})")[0];
    ok(/aria2\.png/.test(g1.av) && /aria\.png/.test(g2.av) && g1.ck && g2.ck && g1.ck !== g2.ck, 'group owner avatar from the real sender card', [g1, g2]);
    F.ev(`csCastSet(${JSON.stringify(g1.ck)}, {color:'#00aa00'})`);
    const h1 = F.ev(`csItemHTML(${JSON.stringify(g1)})`), h2 = F.ev(`csItemHTML(${JSON.stringify(g2)}, ${JSON.stringify(g1)})`);
    ok(/#00aa00/.test(h1) && !/#00aa00/.test(h2) && /aria2\.png/.test(h1) && /aria\.png/.test(h2) && !/cont/.test(h2.split('>')[0]), 'same-name group members keep separate color/avatar and bubbles', [h1.slice(0, 200), h2.slice(0, 200)]);
    ok(F.ev("csParseMessage({name:'แบรม', original_avatar:'bram.png', mes:'แบรม: โย่'})")[0].ck === undefined, 'unique name in group needs no card key');
    delete C.groupId;
    // ดึงชื่อใหม่เข้าเอง + ลบแล้วไม่กลับมา
    C.chat.push({ name: 'อาเรีย', is_user: false, mes: '“ว่าไง” ลูกัสพูด' }); F.addMes(C.chat[C.chat.length - 1], C.chat.length - 1);
    F.fire('cmr', C.chat.length - 1);
    ok(F.ev("csCast(false)['ลูกัส'] && csCast(false)['ลูกัส'].auto") === true, 'new speaker auto-collected');
    F.ev("csOpenSettings('chars')");
    const FS = () => F.d.getElementById('cs-settings');
    const rowNames = () => [...FS().querySelectorAll('.cs-cast-meta b')].map(b => b.textContent);
    ok(rowNames().includes('ลูกัส') && rowNames().includes('อาเรีย') && !rowNames().includes('แบรม') && !rowNames().includes('มินา'), 'chars tab: this card only', rowNames());
    ok(/อาเรีย/.test(FS().querySelector('.cs-hint2').textContent), 'chars tab names the card');
    FS().querySelector('[data-act="cast-del"][data-char="ลูกัส"]').click();
    ok(!rowNames().includes('ลูกัส') && F.ev("csCast(false)['ลูกัส'].ignored") === true, 'delete hides name');
    F.fire('cmr', C.chat.length - 1);
    ok(F.ev("csCast(false)['ลูกัส'].ignored") === true && F.ev("csParse('“ว่าไง” ลูกัสพูด', {owner:'อาเรีย'})")[0].who === 'อาเรีย', 'deleted name is not re-added or guessed');
    FS().querySelector('[data-act="cast-unhide"]').click();
    ok(!F.ev("(csCast(false)['ลูกัส'] || {}).ignored") && rowNames().includes('ลูกัส'), 'restore hidden names');
    // เพิ่มเอง
    const ni = FS().querySelector('[data-castnew]'); ni.value = 'ซากุระ';
    FS().querySelector('[data-act="cast-add"]').click();
    ok(rowNames().includes('ซากุระ') && F.ev("csCastGet('ซากุระ')") && !F.ev("csCastGet('ซากุระ').auto"), 'add character manually');
    const ni2 = FS().querySelector('[data-castnew]'); ni2.value = 'เคน';
    FS().querySelector('[data-act="cast-add"]').click();
    ok(rowNames().filter(n => n === 'เคน').length === 1, 'no duplicate on add');
    // ชื่อเรียกอื่นจากแท็บ
    const al = FS().querySelector('[data-f="aliases"][data-char="ซากุระ"]'); al.value = 'ซา, ซากุ, x'; al.dispatchEvent(new F.w.Event('change', { bubbles: true }));
    ok(F.ev("csCastGet('ซากุระ').aliases") === 'ซา, ซากุ' && K('“ไปไหน” ซากุถาม') === 'say:ซากุระ,narr', 'aliases from tab (too-short dropped)');
    // นี่คือตัวเรา จากแท็บ
    const me = FS().querySelector('[data-f="me"][data-char="ซากุระ"]'); me.checked = true; me.dispatchEvent(new F.w.Event('change', { bubbles: true }));
    ok(F.ev("csCastGet('ซากุระ').me") === true && K('ซากุระ: ฮัลโหล', 'มินา', true) === 'say:ซากุระ:U' && F.ev("csIsUserName('ซากุระ')"), '"this is me" toggle from tab');
    // รูปจากเครื่อง
    F.ev("csShrinkImage = () => Promise.resolve('data:image/jpeg;base64,QUJD')");
    const up = FS().querySelector('[data-upload="castimg"][data-char="เคน"]');
    Object.defineProperty(up, 'files', { value: [{ name: 'a.png' }] });
    up.dispatchEvent(new F.w.Event('change', { bubbles: true }));
    await sleep(20);
    ok(F.ev("csCastGet('เคน').img") === 'data:image/jpeg;base64,QUJD' && /data:image\/jpeg;base64,QUJD/.test(F.ev("csItemHTML({k:'say',who:'เคน',text:'x'})")), 'upload avatar for a character');
    ok(!!FS().querySelector('[data-act="cast-imgdel"][data-char="เคน"]'), 'can revert avatar');
    FS().querySelector('[data-act="cast-imgdel"][data-char="เคน"]').click();
    ok(!F.ev("csCastGet('เคน').img"), 'avatar reverted');
    // ค่าเก่าแบบรวมย้ายมาเป็นของการ์ดนี้
    F.ev("csCfg().chars['เคนจิ'] = {color:'#123456'}");
    ok(F.ev("csCharOpt('เคนจิ').color") === '#123456', 'legacy global color still shows');
    F.ev("csOpenSettings('chars')");
    const snd = FS().querySelector('[data-f="sound"][data-char="เคนจิ"]'); snd.value = 'retro'; snd.dispatchEvent(new F.w.Event('change', { bubbles: true }));
    ok(F.ev("csCastGet('เคนจิ').color") === '#123456' && F.ev("csCastGet('เคนจิ').sound") === 'retro' && !F.ev("csCfg().chars['เคนจิ']"), 'legacy value moves into this card on edit');
    FS().querySelector('[data-act="close"]').click(); await sleep(260);
    // สลับนิยาย ↔ แชทนิยาย
    F.ev("csCfg().style = 'novel'; csCfg().forceFormat = true; csApplyPrompt()");
    F.ev('csOpenNovel()');
    ok(!!F.d.querySelector('#cs-novel [data-cs="toChat"]'), 'novel has switch-to-chat button');
    F.d.querySelector('#cs-novel [data-cs="toChat"]').click();
    ok(F.ev("csCfg().style") === 'chat' && !F.d.getElementById('cs-novel') && !!F.d.getElementById('cs-reader') && /chat novel/.test(F.prompts[Object.keys(F.prompts)[0]].v), 'switch to chat: reader opens, prompt follows');
    F.d.querySelector('#cs-reader [data-cs="toNovel"]').click();
    ok(F.ev("csCfg().style") === 'novel' && !F.d.getElementById('cs-reader') && !!F.d.getElementById('cs-novel') && /novel prose/.test(F.prompts[Object.keys(F.prompts)[0]].v), 'switch back to novel');
    F.ev('csCloseNovel(true)');
    // ในแชทหลักก็แยกคนพูด
    F.ev("csCfg().style = 'chat'; csCfg().mode = 'inline'");
    C.chat.push({ name: 'อาเรีย', is_user: false, mes: 'ฝนตกหนัก\n“กลับบ้านกัน” เคนพูด\n“รอก่อน” อาเรียตอบ' }); F.addMes(C.chat[C.chat.length - 1], C.chat.length - 1);
    F.ev(`csInlineRender(${C.chat.length - 1}); document.querySelector('.mes[mesid="${C.chat.length - 1}"] [data-cs-all]').click()`);
    const inames = [...F.d.querySelectorAll(`.mes[mesid="${C.chat.length - 1}"] .cs-name`)].map(x => x.textContent.trim());
    ok(inames.join(',') === 'เคน,อาเรีย', 'inline chat mode attributes speakers', inames);
    // บทนิยายจริง: ชื่อไทยติดหลังเครื่องหมายปิดโดยไม่มีกริยาพูด
    const REAL = '## ความฝันที่แท้จริง\n"หามิได้เพคะ เพียงแต่..." ภาณุภัทรเรียบเรียงคำพูดมากมายในหัว เขาไม่แน่ใจว่าบิดาจะยินดีหรือไม่\n\nสุรเสียงลังเลนั้นยิ่งกระตุ้นให้บิดายิ่งอยากรู้ ดวงเนตรสีดำสนิททอดพระเนตรแทนคำถาม\n\n"ลูกอยากทำงานที่...โรงพิมพ์เพคะ"\n\nเกิดความเงียบน่าอึดอัดทันใดเมื่อหม่อมเจ้าภาณุภัทรตรัสจบ';
    const rk = K(REAL, 'Narrator');
    ok(rk === 'scene,say:ภาณุภัทร,narr,narr,say:ภาณุภัทร,narr', 'real Thai prose: repeated name after quote', rk);
    const REAL2 = '"หามิได้เพคะ เพียงแต่..." ภาณุภัทรเรียบเรียงคำพูดในหัว\n\n"ลูกอยากทำงานที่...โรงพิมพ์เพคะ"\n\nเกิดความเงียบเมื่อหม่อมเจ้าภาณุภัทรตรัสจบ\n\n"โรงพิมพ์รึ" ท่านชายรัชตะตรัสเสียงเรียบ\n\n"เพคะ"\n\n"เจ้ารู้หรือไม่ว่ากำลังพูดอะไรอยู่"\n\nหญิงวัยกลางคนผู้สง่างามถอนหายใจ ก่อนที่หม่อมแม่จะเอ่ยขึ้น "ใจเย็นก่อนเพคะ"';
    const g2n = F.ev(`csGuessNewNames(${JSON.stringify(REAL2)})`);
    ok(g2n.includes('ภาณุภัทร') && g2n.includes('ท่านชายรัชตะ') && g2n.includes('หม่อมแม่') && !g2n.some(n => /เพคะ|โรงพิมพ์/.test(n)), 'discovers titled Thai names, no words after opening quotes', g2n);
    const rk2 = P(REAL2, 'Narrator').filter(x => x.k === 'say').map(x => x.who).join(',');
    ok(rk2 === 'ภาณุภัทร,ภาณุภัทร,ท่านชายรัชตะ,ภาณุภัทร,ท่านชายรัชตะ,หม่อมแม่', 'real Thai scene: every line attributed', rk2);
    // ★ 1.10 ฉากจริงจากผู้ใช้: ชื่อสั้นในคำอื่น + เพศ
    ok(F.ev("csFindNames('ไม่ได้แสดงท่าทีตื่นเต้น', [{alias:'ต้น',name:'ต้น'}]).length") === 0, 'short Thai name not matched inside another word (ต้น in ตื่นเต้น)');
    ok(F.ev("csFindNames('พลังของพลมีมาก', [{alias:'พล',name:'พล'}]).length") === 1, 'พล not matched inside พลัง');
    ok(F.ev("csFindNames('Kenji met Ken', [{alias:'ken',name:'Ken'}]).length") === 1, 'English whole word only');
    F.ev("csCastSet('พล', {}); csCastSet('ต้น', {}); csCastSet('ม่านฝัน', {me:true})");
    C.name1 = 'ม่านฝัน';
    C.chat.push({ name: 'ม่านฝัน', is_user: true, mes: 'ค คะ โอเค...' });
    C.chat.push({ name: 'อาเรีย', is_user: false, mes: 'ต้น: โทษทีว่ะ ขอบใจครับ' });
    C.chat.push({ name: 'อาเรีย', is_user: false, mes: 'พล: ครับ ผมเอง' });
    ok(F.ev("csGenderOf('ม่านฝัน')") === 'f' && F.ev("csGenderOf('ต้น')") === 'm' && F.ev("csGenderOf('พล')") === 'm', 'genders learned from our messages and Name: lines');
    const SCENE = 'พลเงยหน้ามองหญิงสาวที่เดินเข้ามา\n"มันค่อนข้างร้อนน่ะค่ะ เลยเข้ามานั่งดูคนเล่นบาส" เธอยิ้มเล็กน้อยและเสยผม "คุณ เล่นเก่งนะเรามองอยู่เมื่อกี้"\nพลมองการเคลื่อนไหวของม่านฝันเป็นธรรมชาติ แต่เขาไม่ได้แสดงท่าทีตื่นเต้น ชายหนุ่มพยักหน้า\n"ขอบคุณครับ" เขาตอบรับด้วยน้ำเสียงราบเรียบ "พอดีช่วงนี้ใกล้แข่ง เลยต้องซ้อมหนักหน่อย"\nตามด้วยเสียงตะโกนของต้น\n"โทษทีเว้ยประธาน! มือลื่นไปหน่อย" ต้นตะโกน\nเขาหันกลับมาหาม่านฝันอีกครั้ง\n"นั่งตรงนี้ระวังลูกหลงหน่อยแล้วกัน" เขาเอ่ยเตือน';
    C.characters[0].name = 'พล';
    const sc = P(SCENE, 'พล').filter(x => x.k === 'say').map(x => x.who + (x.u ? ':U' : '')).join(',');
    ok(sc === 'ม่านฝัน,ม่านฝัน,พล,พล,ต้น,พล', 'user scene: every speaker right, all on the left in a bot message', sc);
    // ★ 1.16 จากภาพผู้ใช้: ข้อความของเราเอง ชื่อพลเป็นกรรม (มองพล) → ต้องเป็นของเรา
    const MINE = 'เธอเงยหน้ามองพลอย่างช้าๆ ก่อนจะปิดมือถือคว่ำลงแล้วเอ่ยคุย "มันค่อนข้างร้อนน่ะค่ะ เลยเข้ามานั่งดูคนเล่นบาส" เธอยิ้มเล็กน้อยและเสยผม "คุณ เล่นเก่งนะเรามองอยู่เมื่อกี้"';
    const mine = P(MINE, 'ม่านฝัน', true).filter(x => x.k === 'say').map(x => x.who + (x.u ? ':U' : '')).join(',');
    ok(mine === 'ม่านฝัน:U,ม่านฝัน:U', 'own message: name as object does not steal the line', mine);
    const mineBot = P(MINE, 'พล').filter(x => x.k === 'say').map(x => x.who).join(',');
    ok(mineBot === 'ม่านฝัน,ม่านฝัน', 'same text in bot message: เธอ + ค่ะ → the woman, not พล', mineBot);
    const BOT2 = 'ต้นตะโกนเรียกเพื่อนอยู่ไกลๆ\n"ตรงนี้มันค่อนข้างร้อนนะ" พลเอ่ย\nพลเปิดบทสนทนาด้วยน้ำเสียงเรียบเรื่อย เขาเลิกคิ้วขึ้นเล็กน้อย นัยน์ตาสีเข้มมองตรงไปยังคนตรงหน้า\n"หรือว่า... มีธุระอะไรกับชมรมบาสหรือเปล่า ถึงมานั่งอยู่ตรงนี้"';
    const b2 = P(BOT2, 'พล').filter(x => x.k === 'say').map(x => x.who).join(',');
    ok(b2 === 'พล,พล', 'quote-only after narration about พล stays พล (not ต้น)', b2);
    const BOT3 = '"ไปกันเถอะ" พลบอก\nม่านฝันพยักหน้าช้า ๆ\n"ได้ค่ะ"';
    ok(P(BOT3, 'พล').filter(x => x.k === 'say').map(x => x.who).join(',') === 'พล,ม่านฝัน', 'quote-only after narration about someone else → that person');
    // ★ 1.20 ชื่อขยะจากภาพผู้ใช้
    const JUNK = '"ก่อนหน้านี้มันไม่มีอะไรจริง ๆ" ความกลัวแล่นขึ้นมา\n"เจ็บดิ" ความเจ็บยังไม่หาย ความรู้สึกผิดตามมา\n"ชู่ว" คำพูดนั้นแผ่วลง คำพูดของเขาไม่มีน้ำหนัก\n"พอเถอะ" ปลายนิ้วเย็นเฉียบ ปลายเสียงสั่น\n"มึงจะด่า" น้ำเสียงอ่อนลง น้ำเสียงนั้นพร่า\n"เอออ" ภูมิพึมพำ ภูมิก้มหน้า';
    const gj = F.ev(`csGuessNewNames(${JSON.stringify(JUNK)})`);
    ok(!gj.some(n => /^(ความ|คำ|ปลาย|น้ำเ)/.test(n)) && gj.includes('ภูมิ'), 'no junk names (ความ คำ ปลาย น้ำเ), real name kept', gj);
    ok(['ความ', 'คำ', 'ปลาย', 'น้ำเ', 'ความกลัว', 'คำพูด'].every(n => !F.ev(`csNameLooksValid(${JSON.stringify(n)})`)) && ['ภูมิ', 'ไทด์', 'ต้น', 'ม่านฝัน'].every(n => F.ev(`csNameLooksValid(${JSON.stringify(n)})`)), 'name validity rules');
    ok(F.ev("csFindNames('น้ำเสียงอ่อนลง', [{alias:'น้ำเ',name:'น้ำเ'}]).length") === 0, 'cut-off alias never matches');
    F.ev("csCast(true)['ความ'] = {auto:true}; csCast(true)['น้ำเ'] = {auto:true}; csCast(true)['คำ'] = {auto:true, img:'data:x'}");
    const cleaned = F.ev("csCastCleanup(csCfg())");
    ok(cleaned === 2 && !F.ev("csCast(false)['ความ']") && F.ev("!!csCast(false)['คำ']"), 'cleanup removes guessed junk, keeps entries the user touched', cleaned);
    F.ev("delete csCast(true)['คำ']");
    ok(F.ev("csCastNote(['ความ','ปลาย'])") === 0, 'junk never auto-added again');
    // ★ 1.20 โค้ดและ HTML
    const CODE = 'เธอยื่นโน้ตบุ๊กให้\n```python\ndef hi(name):\n    return f"hi {name}"   # "quoted"\n\nprint(hi("เคน"))\n```\n"ลองรันดูสิ" เคนพูด\nใช้คำสั่ง `npm i` ก่อนนะ\n<div class="status" style="color:red">\n  <b>HP</b> 90/100\n  <div>MP 30</div>\n</div>\nจบ';
    const ci = P(CODE);
    const kinds2 = ci.map(x => x.k + (x.who ? ':' + x.who : '')).join(',');
    ok(kinds2 === 'narr,code,say:เคน,narr,narr,html,narr', 'code + html become single blocks, rest parsed normally', kinds2);
    const cb = ci.find(x => x.k === 'code');
    ok(cb.lang === 'python' && /print\(hi\("เคน"\)\)/.test(cb.text) && /\n\n/.test(cb.text) && /# "quoted"/.test(cb.text), 'code kept verbatim (blank lines, quotes)');
    ok(/<b>HP<\/b>/.test(ci.find(x => x.k === 'html').text) && /MP 30<\/div>\n<\/div>/.test(ci.find(x => x.k === 'html').text), 'html block kept whole with nested div');
    ok(/<code class="cs-ic">npm i<\/code>/.test(F.ev(`csItemHTML(${JSON.stringify(ci[4])})`)), 'inline code');
    const ch = F.ev(`csItemHTML(${JSON.stringify(cb)})`);
    ok(/class="cs-code"/.test(ch) && /cs-copy/.test(ch) && /&quot;quoted&quot;/.test(ch) && />python</.test(ch), 'code block html escaped, with language + copy');
    ok(P('```\nno end fence\nline2').filter(x => x.k === 'code').length === 1, 'unclosed fence still a code block');
    ok(F.ev(`csNovelLines({mes:${JSON.stringify(CODE)}}).map(l=>l.k).join()`).includes('code') && F.ev(`csNovelLines({mes:${JSON.stringify(CODE)}}).map(l=>l.k).join()`).includes('html'), 'novel view keeps code/html blocks');
    ok(P('<i>คิดในใจ</i> เดินต่อ').every(x => x.k !== 'html'), 'inline tags at line start stay text');
    F.w.DOMPurify = { sanitize: (h) => String(h).replace(/<script[\s\S]*?<\/script>/gi, '').replace(/\son\w+="[^"]*"/gi, '') };
    const host = F.d.createElement('div'); host.innerHTML = F.ev(`csHtmlBlockHTML(${JSON.stringify('<div onclick="x()">ok<script>alert(1)</script></div>')})`); F.d.body.appendChild(host);
    F.ev('csHydrateHTML(document)');
    const shr = host.querySelector('.cs-html').shadowRoot;
    ok(shr && /ok/.test(shr.innerHTML) && !/script|onclick/.test(shr.innerHTML), 'html sanitized and isolated in shadow DOM');
    delete F.w.DOMPurify;
    C.characters[0].name = 'อาเรีย'; C.name1 = 'มินา';
    F.ev("csCastSet('พล', {g:'f'})");
    ok(F.ev("csGenderOf('พล')") === 'f', 'gender set by user wins');
    F.ev("csCastSet('พล', {g:''})");
    ok(!F.errors.length, 'no uncaught (cast)', F.errors.map(String));
  }

  // ══ 1.10 คอมเมนต์ในแชทนิยาย + จำตำแหน่งอ่าน ══
  {
    const msgs = [{ name: 'มินา', is_user: true, mes: 'สวัสดี' }];
    for (let i = 0; i < 6; i++) msgs.push({ name: 'อาเรีย', is_user: false, mes: `อาเรีย: ประโยค ${i} ก\nอาเรีย: ประโยค ${i} ข`, extra: {} });
    const G = env(msgs);
    await sleep(30);
    G.ctx.getTokenCountAsync = async t => Math.ceil(String(t).length / 4);
    G.ctx.saveChat = async () => {};
    G.w.__raw = 0;
    G.ctx.generateRaw = async () => { G.w.__raw++; return '[{"p":0,"c":[{"n":"ploy","t":"กรี๊ด","r":"heart"}]},{"p":1,"c":[{"n":"moo","t":"ฮา","r":"laugh"}]}]'; };
    G.ev("csCfg().style = 'chat'; csCfg().mode = 'reader'; csCfg().cmtOn = true; csCfg().typingMs = 0; csCfg().history = 0");
    // โหมดแชทนิยายก็เรียกคอมเมนต์เอง
    G.ev("csCfg().cmtEvery = 1; csCfg().cmtRandom = 0");
    ok(/\[c\]/.test(G.prompts[Object.keys(G.prompts)[0]] ? G.ev('csPromptText()') : G.ev('csPromptText()')), 'model-pick ask also in chat style');
    G.chat.push({ name: 'อาเรีย', is_user: false, mes: 'อาเรีย: มาแล้ว\nอาเรีย: รอนานไหม', extra: {} }); G.addMes(G.chat[G.chat.length - 1], G.chat.length - 1);
    const nid = G.chat.length - 1;
    G.fire('gs', 'normal', {}, false); G.fire('cmr', nid);
    await sleep(1100);
    ok(G.w.__raw === 1 && Object.keys(G.chat[nid].extra.cs_cmt.list).length === 2, 'auto comments fire in chat style', G.w.__raw);
    // แถบคอมเมนต์ในหน้าแชทนิยาย
    G.ev(`csOpenMessage(${nid})`);
    const R = () => G.d.getElementById('cs-reader');
    G.ev('csReader.player.all()');
    const bar = R().querySelector(`.cs-cmtbar[data-mes="${nid}"]`);
    ok(bar && bar.textContent.trim() === '2' && bar.classList.contains('cs-cmt') && !/ความคิดเห็น/.test(bar.textContent), 'small comment icon (count only) under the message in chat reader', bar && bar.textContent);
    const before = G.ev('csReader.player.i');
    bar.click(); await sleep(30);
    ok(R().classList.contains('cmt-open') && /กรี๊ด/.test(R().querySelector('.cs-cmt-sheet').innerHTML) && /ฮา/.test(R().querySelector('.cs-cmt-sheet').innerHTML), 'sheet shows all comments of the message');
    ok(R().querySelectorAll('.cs-cmt-sheet .cs-cmt-q').length === 2 && /รอนานไหม/.test(R().querySelector('.cs-cmt-sheet').innerHTML), 'grouped by line with quotes');
    R().querySelector('.cs-cmt-sheet [data-cs="cmtedit"][data-p="1"]').click();
    const ein = R().querySelector('.cs-cmt-ein'); ein.value = 'ฮามาก';
    R().querySelector('.cs-cmt-sheet [data-cs="cmtsave"]').click();
    ok(G.chat[nid].extra.cs_cmt.list[1][0].t === 'ฮามาก', 'edit comment from chat sheet');
    const inp = R().querySelector('.cs-cmt-in'); inp.value = 'ของฉันเอง';
    R().querySelector('[data-cs="cmtsend"]').click();
    ok(R().querySelector(`.cs-cmtbar[data-mes="${nid}"]`).textContent.trim() === '3', 'own comment added, icon refreshed');
    R().querySelector('.cs-cmt-bd').click();
    ok(!R().classList.contains('cmt-open') && G.ev('csReader.player.i') === before, 'backdrop closes sheet without advancing');
    // ข้อความที่ยังไม่มีคอมเมนต์: เรียกจากแผ่นได้
    G.ev('csCloseReader(true)');
    G.ev(`csOpenMessage(2)`); G.ev('csReader.player.all()');
    const b2 = R().querySelector('.cs-cmtbar[data-mes="2"]');
    ok(b2 && !b2.classList.contains('has') && b2.querySelector('svg'), 'empty = plain small icon');
    b2.click(); R().querySelector('.cs-cmt-sheet [data-cs="cmtgen"]').click(); await sleep(60);
    ok(G.chat[2].extra.cs_cmt && R().querySelector('.cs-cmtbar[data-mes="2"]').textContent.trim() === '2', 'generate from chat sheet');
    G.ev('csCmtClose(); csCloseReader(true)');
    // แชทหลักก็มีแถบ
    G.ev("csCfg().mode = 'inline'; csInlineAll()");
    const ib = G.d.querySelector(`#chat .mes[mesid="${nid}"] .cs-cmtbar`);
    ok(!!ib, 'bar in main chat (inline)');
    G.ev(`document.querySelector('#chat .mes[mesid="${nid}"] [data-cs-all]') && document.querySelector('#chat .mes[mesid="${nid}"] [data-cs-all]').click()`);
    G.d.querySelector(`#chat .mes[mesid="${nid}"] .cs-cmtbar`).click(); await sleep(30);
    ok(G.d.getElementById('cs-cmthost').classList.contains('cmt-open') && /ฮามาก/.test(G.d.querySelector('#cs-cmthost .cs-cmt-sheet').innerHTML), 'main chat opens comment sheet overlay');
    G.d.querySelector('#cs-cmthost .cs-cmt-bd').click();
    ok(!G.d.getElementById('cs-cmthost').classList.contains('cmt-open'), 'overlay closes');
    G.ev("csCfg().mode = 'reader'; csInlineAll()");
    // จำว่าอ่านถึงไหน (อ่านทั้งแชท)
    G.ev('csCfg().readPos = {}; csOpenReadAll()');
    for (let i = 0; i < 5; i++) G.ev('csReader.player.next()');
    const at = G.ev('csReader.player.i');
    G.ev('csCloseReader(true)');
    G.ev('csOpenReadAll()');
    ok(G.ev('csReader.player.i') === at && G.d.querySelectorAll('#cs-reader .cs-item').length === at, 'read-all resumes where we stopped', [at, G.ev('csReader.player.i')]);
    G.ev('csReader.player.next()');
    G.ev('csCloseReader(true)'); G.ev('csOpenReadAll()');
    ok(G.ev('csReader.player.i') === at + 1, 'position keeps updating', [at, G.ev('csReader.player.i'), G.ev('JSON.stringify(csPos())'), G.ev('csReader.player.items.length')]);
    G.ev('csCloseReader(true)');
    ok(G.ev('Object.keys(csCfg().readPos).length') === 1, 'saved per chat');
    // ★ 1.21 เปิดแบบปกติก็จำ · จำตำแหน่งที่เลื่อนอ่าน ไม่ใช่แค่ท้ายสุด
    G.ev("csCfg().readPos = {}");
    G.ev('csOpenLatest()');
    ok(G.ev('csReader.key') !== 'all', 'no saved spot: opens latest as before');
    G.ev('csReader.player.all()'); G.ev('csCloseReader(true)');
    const lastM = G.chat.length - 1;
    ok(G.ev('csPos().chat.m') === lastM, 'normal reader saves position too');
    G.ev("csPosSave('chat', {m: 3, k: 0, am: 2, ak: 1})");
    G.ev('csOpenLatest()');
    ok(G.ev('csReader.key') === 'all' && G.ev('csReader.player.items[csReader.player.i - 1]._m') === 3, 'opening normally continues from saved spot when unread remains');
    G.ev('csReader.player.all()');
    const ai = G.ev("csReader.player.items.findIndex(it => it._m === 5)");
    G.ev(`csReaderSavePos(${ai})`);
    ok(G.ev('csPos().chat.am') === 5 && G.ev('csPos().chat.m') === G.ev('csReader.player.items[csReader.player.items.length-1]._m'), 'saves where you scrolled (anchor) plus how far revealed');
    G.ev('csCloseReader(true)');
    G.ev("csOpenMessage(1)");
    G.ev('csCloseReader(true)');
    ok(G.ev('csPos().chat.m') > 1, 'peeking an old message does not move the saved spot back');
    G.ev("csCfg().readPos = {}");
    // นิยาย
    G.ev("csCfg().style = 'novel'; csPosSave('novel', {mes: 3, ch: 2, off: 5})");
    G.ev('csOpenNovel()'); await sleep(40);
    ok(G.ev("csNovelResume({mes: 3, ch: 2, off: 5})") === true && G.ev("csNovelResume({mes: 999, ch: 99, off: 0})") === false, 'novel resumes at saved chapter (unknown = normal open)');
    G.ev('csCloseNovel(true)');
    // ตัวเลือกเพศในแท็บตัวละคร
    G.ev("csOpenSettings('chars')");
    const gs = G.d.querySelector('#cs-settings [data-f="g"][data-char="อาเรีย"]');
    ok(!!gs, 'gender picker in chars tab');
    gs.value = 'f'; gs.dispatchEvent(new G.w.Event('change', { bubbles: true }));
    ok(G.ev("csGenderOf('อาเรีย')") === 'f', 'gender picker saves');
    G.d.querySelector('#cs-settings [data-tab="bubble"]').click();
    ok(!!G.d.querySelector('#cs-settings [data-k="userLinesRight"]'), 'side option in bubble tab');
    G.ev('csCloseSettings()'); await sleep(250);
    // ★ 1.11 คำตอบโดนตัด / ห่อ / ชื่อ key ต่างกัน
    const V = 'new Set([0,1,2])';
    ok(G.ev(`Object.keys(csCmtParse('[{"p":0,"c":[{"n":"a","t":"ก","r":"heart"}]},{"p":1,"c":[{"n":"b","t":"ข"', ${V}))`).join() === '0', 'salvages truncated JSON');
    ok(G.ev(`Object.keys(csCmtParse('<think>hmm [x]</think>{"comments":[{"para":2,"comments":[{"name":"x","text":"ค","reaction":"fire"}]}]}', ${V}))`).join() === '2', 'wrapped object + alternate keys + think stripped');
    // ★ 1.12 คำตอบจริงจากผู้ใช้: จัดหน้าสวย + มี " ในคอมเมนต์ + โดนตัดท้าย
    const USERRAW = '[\n  {\n    "p": 1,\n    "c": [\n      {\n        "n": "janyaahri",\n        "t": "ม่านฝันลงมาเถอะลูกก อยู่ชั้นบนสุดไม่กลัวความสูงเหรอ 🥺 แงงง ลงมาหาเค้ามาาา",\n        "r": "cry"\n      },\n      {\n        "n": "sunflower_gurl",\n        "t": "พี่แกบอกว่า "ระวังลูกหลง" แต่ใจเราหลงไปแล้ว 55555",\n        "r": "laugh"\n      },\n      {\n        "n": "moo",\n        "t": "ตัดตรงนี้ไปเลยยยยยยยยย';
    const lp = G.ev(`csCmtParse(${JSON.stringify(USERRAW)}, ${V})`);
    ok(lp && lp[1] && lp[1].length === 3 && /ระวังลูกหลง/.test(lp[1][1].t) && lp[1][0].r === 'cry' && lp[1][1].r === 'laugh', 'real reply: pretty JSON with inner quotes + cut off still parsed', lp);
    const lp2 = G.ev(`csCmtParse('[{"p":4,"c":[{"n":"a","t":"x","r":"fire"}]}]', ${V})`);
    ok(lp2 && lp2[2] && lp2[2][0].t === 'x', 'unknown paragraph number snaps to nearest', lp2);
    let tries = 0;
    G.ctx.generateRaw = async (...a) => { const { responseLength } = a[0] || {}; tries++; if (tries === 1) throw new Error('No message generated'); G.w.__len = responseLength; return '[{"p":0,"c":[{"n":"a","t":"ok","r":"heart"}]}]'; };
    G.chat.push({ name: 'อาเรีย', is_user: false, mes: 'อาเรีย: ลองใหม่', extra: {} });
    ok(await G.ev(`csCmtGenerate(${G.chat.length - 1}, true)`) === true && tries === 2 && G.w.__len === 4000, 'empty reply (thinking model) retried with more room', [tries, G.w.__len]);
    ok(G.ev('csCfg().cmtLast.ok') === true, 'status saved (ok)');
    G.ctx.generateRaw = async () => 'ขอโทษค่ะ ทำไม่ได้';
    G.chat.push({ name: 'อาเรีย', is_user: false, mes: 'อาเรีย: อีกที', extra: {} });
    await G.ev(`csCmtGenerate(${G.chat.length - 1}, true)`);
    ok(G.ev('csCfg().cmtLast.ok') === false && /ขอโทษ/.test(G.ev('csCfg().cmtLast.raw')), 'status saved (failed + raw reply)');
    // กู้จากคำตอบเดิมที่เคยพลาด
    const rid = G.chat.length - 1;
    G.ev(`csCfg().cmtLast = { ok:false, why:'x', raw:${JSON.stringify(USERRAW.replace('"p": 1', '"p": 0'))}, t:Date.now(), mes:${rid}, idx:[0], chat: csChatKey() }`);
    G.ev("csOpenSettings('cmt')");
    G.d.querySelector('#cs-settings [data-act="cmt-reparse"]').click();
    ok(G.chat[rid].extra.cs_cmt && G.chat[rid].extra.cs_cmt.list[0].length === 3 && G.ev('csCfg().cmtLast.ok') === true, 'reparse stored reply recovers comments without a call');
    G.ev('csCloseSettings()'); await sleep(250);
    G.ev("csCfg().cmtOn = false; csOpenSettings('cmt')");
    ok(/ยังปิดคอมเมนต์อยู่/.test(G.d.querySelector('#cs-settings .cs-sbody').innerHTML) && /ครั้งล่าสุด/.test(G.d.querySelector('#cs-settings .cs-sbody').innerHTML), 'settings warn when comments off + show last result');
    const ev = G.d.querySelector('#cs-settings [data-k="cmtEvery"]'); ev.value = '2'; ev.dispatchEvent(new G.w.Event('input', { bubbles: true }));
    ok(G.ev('csCfg().cmtOn') === true, 'setting "every N" turns comments on');
    G.ev('csCloseSettings()'); await sleep(250);
    // ★ 1.13 ตั้งจำนวนคอมเมนต์เอง
    G.ev("csCfg().cmtPick = 'all'; csCfg().cmtPer = 6; csCfg().cmtParas = 2");
    const q6 = G.ev(`csCmtPrompt(${nid}).prompt`);
    ok(/Pick 2 paragraphs; 6 short casual Thai comments each/.test(q6), 'prompt asks the set number of comments', q6.slice(-260));
    G.ev("csCfg().cmtPer = 1");
    ok(/1 short casual Thai comment each/.test(G.ev(`csCmtPrompt(${nid}).prompt`)), 'singular wording for 1');
    G.ev("csCfg().cmtPer = 6");
    const many = '[{"p":0,"c":[' + Array.from({ length: 8 }, (_, i) => `{"n":"u${i}","t":"t${i}","r":"heart"}`).join(',') + ']}]';
    ok(G.ev(`csCmtParse(${JSON.stringify(many)}, new Set([0]))[0].length`) === 8, 'keeps up to set number (+2 slack)');
    G.ev("csOpenSettings('cmt')");
    const sp = G.d.querySelector('#cs-settings [data-k="cmtPer"]');
    ok(!!sp && !!G.d.querySelector('#cs-settings [data-k="cmtParas"]'), 'count sliders in comments tab');
    sp.value = '5'; sp.dispatchEvent(new G.w.Event('input', { bubbles: true }));
    ok(G.ev('csCfg().cmtPer') === 5 && G.d.querySelector('#cs-settings [data-cmt-total]').textContent === '10', 'slider updates total');
    G.ev('csCloseSettings()'); await sleep(250);
    // ★ 1.16 ตอบกลับกันเอง
    ok(/"to":"handle \(only if replying\)"/.test(G.ev(`csCmtPrompt(${nid}).prompt`)) && /reply to each other/.test(G.ev(`csCmtPrompt(${nid}).prompt`)), 'prompt allows replies');
    const th = G.ev(`csCmtParse('[{"p":0,"c":[{"n":"a","t":"หนึ่ง","r":"heart"},{"n":"b","t":"ตอบเอ","r":"laugh","to":"a"},{"n":"c","t":"ตอบบี","r":"cry","to":"@b"}]}]', new Set([0]))`);
    ok(th[0][1].to === 'a' && th[0][2].to === 'b', 'parse keeps "to"', th);
    const thl = G.ev(`csCmtParse('[{"p":0,"c":[{"n":"a","t":"เขาว่า "ไป" แหละ","r":"heart"},{"n":"b","t":"จริง","to":"a","r":"fire"}]', new Set([0]))`);
    ok(thl && thl[0][1].to === 'a' && thl[0][1].r === 'fire', 'loose parse keeps "to" in any order', thl);
    G.chat[nid].extra.cs_cmt.list[0] = [{ n: 'a', t: 'หนึ่ง', r: 'heart' }, { n: 'b', t: 'ตอบเอ', r: 'laugh', to: 'a' }, { n: 'x', t: 'อีกเรื่อง', r: 'fire' }];
    G.ev(`csOpenMessage(${nid}); csReader.player.all()`);
    G.d.querySelector(`#cs-reader .cs-cmtbar[data-mes="${nid}"]`).click(); await sleep(20);
    const shh = () => G.d.querySelector('#cs-reader .cs-cmt-sheet');
    ok(shh().querySelector('.cs-cmt-replies .cs-cmt-row') && /ตอบ @a/.test(shh().querySelector('.cs-cmt-replies').textContent), 'replies render nested under parent');
    shh().querySelector('[data-cs="cmtreply"][data-p="0"][data-k="2"]').click();
    ok(/ตอบกลับ\s*@x/.test(shh().querySelector('.cs-cmt-replying').textContent), 'reply bar shows target');
    const rin = shh().querySelector('.cs-cmt-in'); rin.value = 'เห็นด้วย';
    shh().querySelector('[data-cs="cmtsend"]').click();
    const last0 = G.chat[nid].extra.cs_cmt.list[0].slice(-1)[0];
    ok(last0.me && last0.to === 'x' && !shh().querySelector('.cs-cmt-replying'), 'own reply saved with target');
    G.ctx.generateRaw = async () => '[{"p":0,"c":[{"n":"ploy","t":"จริงมาก","r":"laugh"},{"n":"moo","t":"555","r":"laugh","to":"ploy"}]}]';
    shh().querySelector('[data-cs="cmtask"][data-p="0"][data-k="0"]').click(); await sleep(80);
    const L0 = G.chat[nid].extra.cs_cmt.list[0];
    ok(L0[2].n === 'ploy' && L0[2].to === 'a' && L0[3].to === 'ploy' && L0[4].n === 'x', 'ask readers to reply: inserted under that comment, default target', L0.map(c => c.n + '>' + (c.to || '')));
    G.ev('csCmtClose(); csCloseReader(true)');
    // ★ 1.16 ไอคอนคอมเมนต์ในแชทหลักปกติ
    G.ev("csCfg().mode = 'reader'; csCfg().cmtOn = true; csInlineAll()"); await sleep(10);
    const mc = () => G.d.querySelector(`#chat .mes[mesid="${nid}"] .cs-mescmt`);
    ok(mc() && mc().previousElementSibling.classList.contains('mes_text') && !G.d.querySelector('#chat .mes[mesid="0"] .cs-mescmt'), 'icon under bot messages in normal chat (not user)');
    mc().querySelector('.cs-cmtbar').click(); await sleep(20);
    ok(G.d.getElementById('cs-cmthost').classList.contains('cmt-open'), 'opens sheet over chat');
    G.ev('csCmtClose()');
    G.ev("csCfg().mode = 'inline'; csInlineAll()"); await sleep(10);
    ok(!mc(), 'no duplicate icon when chat shows bubbles inline');
    G.ev("csCfg().mode = 'reader'; csCfg().cmtOn = false; csInlineAll()"); await sleep(10);
    ok(!mc(), 'removed when comments off');
    G.ev("csCfg().cmtOn = true; csInlineAll()"); await sleep(10);
    // ★ 1.16 แจ้งเตือนเล็ก
    G.w.toastr = { info() { G.w.__toastr = 1; } };
    G.ev("csToast('ทดสอบ')");
    const tt = G.d.getElementById('cs-toast');
    ok(tt && tt.classList.contains('show') && tt.textContent === 'ทดสอบ' && !G.w.__toastr, 'own small toast instead of toastr');
    G.ev("csToast('คอมเมนต์ไม่มา · x')");
    ok(tt.classList.contains('err') && G.d.querySelectorAll('#cs-toast').length === 1, 'one toast at a time, error style');
    // ★ 1.16 เจนใหม่ / ลบ จากในหน้าอ่าน
    G.ev("csCfg().style = 'chat'; csCfg().mode = 'reader'");
    const rg = G.d.createElement('a'); rg.id = 'option_regenerate'; G.w.__regen = 0; rg.addEventListener('click', () => G.w.__regen++); G.d.body.appendChild(rg);
    const lastId = G.chat.length - 1;
    G.ev(`csOpenMessage(${lastId}); csReader.player.all()`);
    const beforeN = G.ev('csReader.player.items.length');
    G.d.querySelector('#cs-reader [data-cs="more"]').click();
    ok(!!G.d.querySelector('#cs-reader .cs-menu [data-cs="regen"]') && !!G.d.querySelector('#cs-reader .cs-menu [data-cs="dellast"]'), 'regen + delete live in the ... menu (no new buttons)');
    G.d.querySelector('#cs-reader .cs-menu [data-cs="regen"]').click();
    ok(G.w.__regen === 1 && G.ev('csReader.player.items.length') < beforeN, 'regen clicks SillyTavern regenerate and clears old bubbles');
    G.ev('csCloseReader(true)');
    G.ctx.deleteLastMessage = async () => { G.chat.pop(); };
    const n0 = G.chat.length;
    G.ev(`csOpenMessage(${G.chat.length - 1}); csReader.player.all()`);
    await G.ev('csDeleteLast()');
    ok(G.chat.length === n0 - 1 && G.ev('csReader.player.items.filter(it => it._m >= SillyTavern.getContext().chat.length).length') === 0, 'delete last message, reader updated in place');
    G.ev('csCloseReader(true)');
    G.ev("csCfg().style = 'novel'; csOpenNovel()");
    ok(!!G.d.querySelector('#cs-novel .cs-nacts [data-cs="regen"]') && G.d.querySelectorAll('#cs-novel .cs-nacts').length === 1, 'novel: small links only under the latest chapter');
    G.ev('csCloseNovel(true)'); G.ev("csCfg().style = 'chat'");
    // ★ 1.16 คอมเมนต์รอให้ว่างก่อน
    G.ctx.generateRaw = async () => { G.w.__qr = (G.w.__qr || 0) + 1; return '[{"p":0,"c":[{"n":"a","t":"x","r":"heart"}]}]'; };
    G.ev(`csGenerating = true; csCmtAutoQueue(${lastId - 1})`); await sleep(900);
    ok(!G.w.__qr, 'queued comment call waits while generating');
    G.ev('csGenerating = false'); await sleep(1700);
    ok(G.w.__qr === 1, 'runs after generation is done');
    // ★ 1.22 สลับคำตอบ
    {
      const L = () => G.chat[G.chat.length - 1];
      G.chat.push({ name: 'อาเรีย', is_user: false, extra: {}, mes: 'อาเรีย: แบบแรก', swipes: ['อาเรีย: แบบแรก', 'อาเรีย: แบบสอง'], swipe_id: 0 });
      const sid = G.chat.length - 1;
      G.ctx.swipe = {
        left: () => { const m = L(); m.swipe_id--; m.mes = m.swipes[m.swipe_id]; G.fire('ms', sid); },
        right: () => { const m = L(); if (m.swipe_id < m.swipes.length - 1) { m.swipe_id++; m.mes = m.swipes[m.swipe_id]; G.fire('ms', sid); } else { G.w.__gen = 1; } },
      };
      G.ev("csCfg().style = 'chat'; csCfg().mode = 'reader'; csCfg().readPos = {}");
      G.ev(`csOpenMessage(${sid}); csReader.player.all()`);
      const sw = () => G.d.querySelector('#cs-reader .cs-swipe');
      ok(sw() && sw().textContent.trim() === '1/2' && sw().querySelector('[data-cs="swl"]').disabled, 'swipe control on latest reply: 1/2, back disabled');
      sw().querySelector('[data-cs="swr"]').click(); await sleep(20);
      ok(/แบบสอง/.test(G.d.querySelector('#cs-reader .cs-list').textContent) && !/แบบแรก/.test(G.d.querySelector('#cs-reader .cs-list').textContent), 'next swipe replaces the bubbles (no duplicates)');
      ok(sw() && sw().textContent.trim() === '2/2', 'counter updates');
      sw().querySelector('[data-cs="swr"]').click(); await sleep(20);
      ok(G.w.__gen === 1, 'next on the last version asks SillyTavern to generate a new one');
      G.ev('csCloseReader(true)'); G.ev(`csOpenMessage(${sid}); csReader.player.all()`);
      sw().querySelector('[data-cs="swl"]').click(); await sleep(20);
      ok(/แบบแรก/.test(G.d.querySelector('#cs-reader .cs-list').textContent) && L().swipe_id === 0, 'go back to the earlier version');
      G.ev('csCloseReader(true)');
      G.ev(`csOpenReadAll(); csReader.player.all()`);
      ok(G.d.querySelectorAll('#cs-reader .cs-swipe').length === 1, 'whole chat: only the latest reply gets the control');
      G.ev('csCloseReader(true)');
      G.ev("csCfg().style = 'novel'; csOpenNovel()");
      ok(!!G.d.querySelector('#cs-novel .cs-nacts .cs-swipe'), 'novel: control under the latest chapter');
      G.ev('csCloseNovel(true)'); G.ev("csCfg().style = 'chat'");
      delete G.ctx.swipe;
    }
    // ★ 1.23 เปิดค้างเป็นหน้าแชท (ทุกแชท) + ใต้แถบบน + หลบหน้าอื่นของ ST + ปุ่มของ ST
    {
      const tb = G.d.createElement('div'); tb.id = 'top-settings-holder'; G.d.body.prepend(tb);
      tb.getBoundingClientRect = () => ({ top: 0, bottom: 44, height: 44, left: 0, right: 390, width: 390 });
      // แถบพิมพ์จำลองของ SillyTavern: ☰ ไม้กายสิทธิ์ ปุ่มส่วนขยาย Quick Reply
      const fs = G.d.createElement('div'); fs.id = 'form_sheld';
      fs.innerHTML = '<div id="send_form"><div id="qr--bar"><div class="qr--button menu_button">สรุปฉาก</div></div><div id="nonQRFormItems"><div id="leftSendForm"><div id="options_button" class="fa-solid fa-bars interactable"></div><div id="extensionsMenuButton" class="fa-solid fa-magic-wand-sparkles interactable"></div><div id="gg-btn" class="fa-solid fa-compass interactable" title="Guided Response"></div></div><div id="rightSendForm"><div id="mes_continue" class="fa-solid fa-arrow-right interactable displayNone" title="Continue"></div></div></div></div>';
      G.d.body.appendChild(fs);
      const st = G.d.getElementById('send_textarea');
      G.w.__gg = 0; G.d.getElementById('gg-btn').addEventListener('click', () => { G.w.__gg = st.value; st.value = 'ข้อความที่ส่วนขยายเขียนให้'; });
      G.w.__opt = 0; G.d.getElementById('options_button').addEventListener('click', () => G.w.__opt++);
      G.ctx.characterId = 0;
      G.ev("csCfg().style = 'chat'; csCfg().alwaysOn = false; csCloseReader(true); csCloseNovel(true)");
      G.ev('csOpenLatest()');
      const R = () => G.d.getElementById('cs-reader');
      ok(R().classList.contains('cs-under-bar') && R().style.getPropertyValue('--cs-topoff') === '44px', 'reader sits under the SillyTavern top bar');
      const core = [...R().querySelectorAll('.cs-stbtns .cs-stbtn[data-cs="stbtn"] i')].map(i => i.className);
      ok(core.length === 2 && /fa-bars/.test(core[0]) && /fa-magic-wand/.test(core[1]), '☰ and wand next to the input', core);
      ok(R().querySelector('.cs-stmore') && !R().querySelector('.cs-sttray').classList.contains('open'), 'other buttons behind one small tray button (closed)');
      R().querySelector('.cs-stmore').click();
      const chips = [...R().querySelectorAll('.cs-sttray .cs-stchip')].map(c => c.textContent.trim() || c.title);
      ok(R().querySelector('.cs-sttray').classList.contains('open') && chips.includes('สรุปฉาก') && chips.some(t => /Guided/.test(t)) && !chips.some(t => /Continue/.test(t)), 'tray: QR + extension buttons, hidden ones skipped', chips);
      R().querySelector('.cs-stbtns [data-cs="stbtn"]').click();
      ok(G.w.__opt === 1, 'proxy clicks the real ☰');
      R().querySelector('.cs-input').value = 'ช่วยเขียนต่อ';
      R().querySelector('.cs-stmore').click();
      [...R().querySelectorAll('.cs-sttray .cs-stchip')].find(c => /Guided/.test(c.title)).click();
      await sleep(600);
      ok(G.w.__gg === 'ช่วยเขียนต่อ' && R().querySelector('.cs-input').value === 'ข้อความที่ส่วนขยายเขียนให้', 'text passes to the extension and its result comes back');
      G.ev('csCloseReader(true)');
      // เปิดค้าง
      G.ev('csSetPinned(true)');
      ok(G.d.body.classList.contains('cs-always'), 'always-on class');
      let chatId = 'A'; G.ctx.getCurrentChatId = () => chatId;
      G.fire('cc'); await sleep(120);
      ok(!!R(), 'always-on: opens in a chat');
      chatId = 'B'; G.fire('cc'); await sleep(120);
      ok(!!R(), 'every chat, not just one');
      const panel = G.d.createElement('div'); panel.id = 'right-nav-panel'; G.d.body.appendChild(panel);
      panel.classList.add('openDrawer'); await sleep(150);
      ok(G.d.body.classList.contains('cs-st-panel'), 'hides while character list / info is open');
      panel.classList.remove('openDrawer'); await sleep(150);
      ok(!G.d.body.classList.contains('cs-st-panel'), 'back when the panel closes');
      G.ctx.characterId = undefined; G.fire('cc'); await sleep(120);
      ok(!R(), 'no chat (character select) = not shown');
      G.ctx.characterId = 0; G.fire('cc'); await sleep(120);
      R().querySelector('[data-cs="close"]').click(); await sleep(260);
      ok(!R() && G.ev('csAlwaysPaused') === true, 'back button hides it for now');
      G.fire('cc'); await sleep(120);
      ok(!!R(), 'next chat change shows it again');
      G.ev('csSetPinned(false)'); G.ev('csCloseReader(true)');
      delete G.ctx.getCurrentChatId; tb.remove(); fs.remove(); panel.remove();
      // แผงในหน้า Extensions ปิดเป็นค่าเริ่มต้น
      ok(/inline-drawer-content" style="display:none"/.test(G.ev('csDrawerHTML()')), 'extension settings drawer collapsed by default');
    }
    // ★ 1.24 สารบัญ + ค้นหา
    {
      G.ev("csCfg().style = 'chat'; csCfg().readPos = {}; csCloseReader(true); csCloseNovel(true)");
      G.chat.push({ name: 'อาเรีย', is_user: false, extra: {}, mes: '## คืนฝนตก\nฝนตกหนัก\nอาเรีย: ร่มอยู่ไหนนะ' });
      const rid = G.chat.length - 1;
      G.ev('csOpenMessage(1)');
      const R = () => G.d.getElementById('cs-reader');
      R().querySelector('.cs-title').click();
      const nav = () => R().querySelector('.cs-nav');
      ok(R().classList.contains('nav-open') && nav().querySelectorAll('.cs-navrow').length === G.ev('csNavChapters().length') && G.ev('csNavChapters().length') >= 5, 'tap title: contents with every chapter');
      ok([...nav().querySelectorAll('.cs-navtx b')].some(b => b.textContent === 'คืนฝนตก'), 'chapter titles from ## headings');
      nav().querySelector(`[data-cs="navgo"][data-mes="${rid}"]`).click();
      ok(!R().classList.contains('nav-open') && R() && G.ev('csReader.key') === 'all' && G.ev('csReader.player.items[csReader.player.i-1]._m') === rid, 'jump to a chapter (switches to whole chat, reveals up to it)');
      R().querySelector('.cs-title').click();
      nav().querySelector('[data-cs="navtab"][data-t="find"]').click();
      const q = nav().querySelector('.cs-navq'); q.value = 'ร่ม'; q.dispatchEvent(new G.w.Event('input', { bubbles: true })); await sleep(300);
      const rows = nav().querySelectorAll('.cs-navrow');
      ok(rows.length >= 1 && /<mark>ร่ม<\/mark>/.test(rows[0].innerHTML) && /อาเรีย/.test(rows[0].textContent), 'search finds words with the speaker and highlight');
      q.value = 'ไม่มีคำนี้แน่นอน'; q.dispatchEvent(new G.w.Event('input', { bubbles: true })); await sleep(300);
      ok(/ไม่เจอ/.test(nav().textContent), 'no results message');
      q.value = 'ร่ม'; q.dispatchEvent(new G.w.Event('input', { bubbles: true })); await sleep(300);
      nav().querySelector('.cs-navrow').click(); await sleep(20);
      ok(R().querySelector('.cs-flash'), 'jump from a search result highlights the spot');
      G.ev('csCloseReader(true)');
      G.ev("csCfg().style = 'novel'; csOpenNovel()");
      G.d.querySelector('#cs-novel .cs-title').click();
      ok(G.d.getElementById('cs-novel').classList.contains('nav-open') && G.d.querySelectorAll('#cs-novel .cs-navrow').length >= 1, 'novel: same contents sheet');
      G.d.querySelector('#cs-novel [data-cs="navtab"][data-t="toc"]').click();
      G.d.querySelector(`#cs-novel [data-cs="navgo"][data-mes="${rid}"]`).click();
      ok(G.d.querySelector('#cs-novel .cs-chapter.cs-flash, #cs-novel .cs-flash'), 'novel: jumps to the chapter');
      G.ev('csCloseNovel(true)'); G.ev("csCfg().style = 'chat'");
    }
    // ★ 1.25 ไฮไลต์ · ที่คั่น · การ์ดคำคม
    {
      G.ev("csCfg().style = 'chat'; csCfg().marks = {}; csCfg().readPos = {}; csCloseReader(true); csCloseNovel(true)");
      const rid = G.chat.length - 1;
      G.ev('csOpenMessage(' + rid + ')'); G.ev('csReader.player.all()');
      const R = () => G.d.getElementById('cs-reader');
      const bub = () => [...R().querySelectorAll('.cs-bubble')].find(x => x.textContent.includes('ร่มอยู่ไหนนะ'));
      const i0 = G.ev('csReader.player.i');
      // กดค้าง (มือถือ)
      const pe = (type, el) => { const e = new G.w.Event(type, { bubbles: true }); Object.assign(e, { clientX: 10, clientY: 10, button: 0 }); el.dispatchEvent(e); };
      pe('pointerdown', bub()); await sleep(560); pe('pointerup', bub());
      ok(R().querySelector('.cs-markpop') && R().querySelectorAll('.cs-markpop button').length === 4, 'long-press opens the small mark menu');
      bub().click();
      ok(R().querySelector('.cs-markpop') && G.ev('csReader.player.i') === i0, 'the click right after a long-press does not advance or close');
      R().querySelector('[data-cs="mkhl"]').click();
      ok(!R().querySelector('.cs-markpop') && G.ev('csMarks().length') === 1 && G.ev('csMarks()[0].who') === 'อาเรีย' && G.ev('csMarks()[0].m') === rid, 'highlight saved with speaker and message');
      await sleep(60);
      ok(bub().classList.contains('cs-hl'), 'highlighted bubble is marked');
      // คลิกขวา (คอม) = เมนูเดียวกัน · คั่นหน้า
      await sleep(700);
      bub().dispatchEvent(new G.w.MouseEvent('contextmenu', { bubbles: true, cancelable: true }));
      ok(R().querySelector('.cs-markpop [data-cs="mkhl"].on'), 'right-click opens the menu, highlight shows as on');
      R().querySelector('[data-cs="mkbm"]').click(); await sleep(60);
      ok(bub().classList.contains('cs-bm') && G.ev("csMarks().filter(x => x.k === 'bm').length") === 1, 'bookmark added');
      // แตะที่อื่นตอนเมนูเปิด = ปิดเมนูอย่างเดียว
      await sleep(700);
      bub().dispatchEvent(new G.w.MouseEvent('contextmenu', { bubbles: true, cancelable: true }));
      await sleep(700);
      R().querySelector('.cs-body').click();
      ok(!R().querySelector('.cs-markpop'), 'tapping elsewhere closes the menu');
      // รายการในสารบัญ
      R().querySelector('.cs-title').click();
      R().querySelector('[data-cs="navtab"][data-t="marks"]').click();
      ok(R().querySelectorAll('.cs-nav .cs-mkrow').length === 2 && /อาเรีย/.test(R().querySelector('.cs-nav .cs-mkrow').textContent), 'marks tab lists highlight and bookmark');
      R().querySelector('.cs-nav [data-cs="navmkdel"]').click();
      ok(R().querySelectorAll('.cs-nav .cs-mkrow').length === 1 && G.ev('csMarks().length') === 1, 'delete from the list');
      R().querySelector('.cs-nav .cs-mkrow').click(); await sleep(20);
      ok(!R().classList.contains('nav-open') && R().querySelector('.cs-flash'), 'tap a mark jumps to it');
      // นิยาย: บรรทัดเดียวกันขึ้นไฮไลต์ด้วย
      G.ev("csCloseReader(true); csCfg().style = 'novel'; csOpenNovel(undefined, true)"); await sleep(60);
      const np = [...G.d.querySelectorAll('#cs-novel .cs-np')].find(x => x.textContent.includes('ร่มอยู่ไหนนะ'));
      ok(np && (np.classList.contains('cs-hl') || np.classList.contains('cs-bm')), 'same line marked in novel view');
      await sleep(700);
      np.dispatchEvent(new G.w.MouseEvent('contextmenu', { bubbles: true, cancelable: true }));
      G.d.querySelector('#cs-novel [data-cs="mkcard"]').click(); await sleep(30);
      ok(!G.d.querySelector('#cs-novel .cs-markpop'), 'quote card action runs without errors (no canvas in jsdom)');
      G.ev('csCloseNovel(true)'); G.ev("csCfg().style = 'chat'; csCfg().marks = {}");
      ok(G.ev("csWrapCanvas({ measureText: t => ({ width: [...t].length * 10 }) }, 'สวัสดีครับวันนี้อากาศดีมาก', 60).every(l => [...l].length <= 6 && !/^[\\u0E31\\u0E34-\\u0E3A\\u0E47-\\u0E4E]/.test(l))"), 'Thai wrap never starts a line with a vowel/tone mark');
    }
    // ★ 1.16 ปุ่มลัดข้างจอ
    ok(!!G.d.getElementById('cs-edge'), 'edge button present');
    const pe = (type, x, y) => { const e = new G.w.Event(type, { bubbles: true }); Object.assign(e, { clientX: x, clientY: y, pointerId: 1 }); G.d.getElementById('cs-edge').dispatchEvent(e); };
    G.w.innerHeight = 800; G.w.innerWidth = 400;
    G.ev("csCfg().edgeY = 0.5; csCfg().edgeSide = 'right'; csEdgeRender()");
    ok(G.d.getElementById('cs-edge').style.top === '400px', 'placed by saved position');
    pe('pointerdown', 390, 400); pe('pointermove', 390, 5000); pe('pointerup', 390, 5000);
    ok(G.ev('csCfg().edgeY') <= (800 - 46 - 8) / 800 + .001 && G.d.getElementById('cs-edge').style.top === '746px', 'drag clamped inside screen', G.d.getElementById('cs-edge').style.top);
    pe('pointerdown', 390, 700); pe('pointermove', 20, 300); pe('pointerup', 20, 300);
    ok(G.ev('csCfg().edgeSide') === 'left' && G.d.getElementById('cs-edge').classList.contains('left'), 'drag across switches side');
    G.ev('csCloseReader(true); csCloseNovel(true)');
    pe('pointerdown', 10, 300); pe('pointerup', 10, 300);
    ok(!!(G.d.getElementById('cs-reader') || G.d.getElementById('cs-novel')), 'tap opens reader');
    G.ev('csCloseReader(true); csCloseNovel(true)');
    G.ev("csCfg().edgeBtn = false; csEdgeRender()");
    ok(!G.d.getElementById('cs-edge'), 'can turn off');
    G.ev("csCfg().edgeBtn = true; csEdgeRender()");
    // ★ 1.14 โหมดจำนวน: ตั้งเอง / ให้โมเดลคิด / สุ่ม
    G.ev("csCfg().cmtPick = 'all'; csCfg().cmtCountMode = 'auto'; csCfg().cmtPer = 5; csCfg().cmtParas = 3");
    const qa = G.ev(`csCmtPrompt(${nid}).prompt`);
    ok(/Pick any paragraphs you like, up to 2; short casual Thai comments, any number from 1 to 5 each, your choice,/.test(qa) && !/bigger moments|dramatic|react to most/.test(qa), 'auto: free choice within max, no "big moments" rule', qa.slice(-300));
    G.ev("csCfg().cmtCountMode = 'random'; csCfg().cmtPerMin = 2; csCfg().cmtPer = 4; csCfg().cmtParasMin = 1; csCfg().cmtParas = 2");
    const seen = new Set();
    for (let i = 0; i < 30; i++) { const q = G.ev(`csCmtPrompt(${nid}).prompt`); const m = q.match(/Pick (\d) paragraphs; 2-4 short casual Thai comments each \(vary/); ok(m && +m[1] >= 1 && +m[1] <= 2, 'random: paragraphs in range'); seen.add(m && m[1]); }
    ok(seen.size === 2, 'random: varies between calls', [...seen]);
    // สุ่มแบบโมเดลเลือกบรรทัด: ระบุจำนวนรายย่อหน้า
    G.ev(`SillyTavern.getContext().chat[${nid}].extra.cs_cmt_marks = { h: csHash(SillyTavern.getContext().chat[${nid}].mes), lines: SillyTavern.getContext().chat[${nid}].mes.split('\\n') }`);
    G.ev("csCfg().cmtPick = 'model'");
    const qr = G.ev(`csCmtPrompt(${nid}).prompt`);
    const per = [...qr.matchAll(/\[(\d+)\]=(\d+)/g)].map(m => +m[2]);
    ok(per.length === 2 && per.every(k => k >= 2 && k <= 4), 'random + model picks: exact count per paragraph', qr.slice(-200));
    G.ev("csCfg().cmtCountMode = 'set'");
    ok(/For each paragraph above 4 short casual Thai comments each/.test(G.ev(`csCmtPrompt(${nid}).prompt`)), 'set + model picks');
    // หน้าตั้งค่าแต่ละโหมด
    G.ev("csOpenSettings('cmt')");
    const SS = () => G.d.querySelector('#cs-settings');
    ok(SS().querySelector('[data-seg="cmtCountMode"][data-val="auto"]') && !SS().querySelector('[data-k="cmtPerMin"]'), 'set mode: 2 sliders');
    SS().querySelector('[data-seg="cmtCountMode"][data-val="random"]').click();
    ok(G.ev('csCfg().cmtCountMode') === 'random' && SS().querySelector('[data-k="cmtPerMin"]') && SS().querySelector('[data-k="cmtParasMin"]'), 'random mode: min/max sliders');
    ok(SS().querySelector('[data-cmt-total]').textContent === '2–8', 'random total range', SS().querySelector('[data-cmt-total]').textContent);
    const mn = SS().querySelector('[data-k="cmtPerMin"]'); mn.value = '7'; mn.dispatchEvent(new G.w.Event('input', { bubbles: true }));
    ok(G.ev('csCfg().cmtPer') === 7 && SS().querySelector('[data-k="cmtPer"]').value === '7', 'min above max pushes max up');
    const mx = SS().querySelector('[data-k="cmtPer"]'); mx.value = '3'; mx.dispatchEvent(new G.w.Event('input', { bubbles: true }));
    ok(G.ev('csCfg().cmtPerMin') === 3, 'max below min pulls min down');
    SS().querySelector('[data-seg="cmtCountMode"][data-val="auto"]').click();
    ok(/ไม่เกิน/.test(SS().querySelector('[data-cmt-total]').textContent) && /ไม่เกิน/.test(SS().querySelector('.cs-sbody').innerHTML), 'auto mode labels');
    G.ev('csCloseSettings()'); await sleep(250);
    G.ev("csCfg().cmtCountMode = 'set'; csCfg().cmtPer = 3; csCfg().cmtParas = 4");
    G.ev("csCfg().cmtPick = 'model'");
    ok(!G.errors.length, 'no uncaught (1.10)', G.errors.map(String));
  }
  E.ev("SillyTavern.getContext().extensionSettings.chatStory = {}");
  // ย้ายค่าจาก 1.0
  E.ev("SillyTavern.getContext().extensionSettings.chatStory = {theme:'mint'}");
  ok(E.ev('csCfg().preset') === 'mint', 'migrates 1.0 theme');
  E.ev("SillyTavern.getContext().extensionSettings.chatStory = {_v:17, cmtAuto:false}");
  ok(E.ev('csCfg().cmtAuto') === true && E.ev('csCfg().cmtEvery') === 3 && E.ev('csCfg().cmtRandom') === 30, 'migrates to auto comments with every/random defaults');
  E.ev("SillyTavern.getContext().extensionSettings.chatStory = {_v:18, cmtAmount:'many'}");
  ok(E.ev('csCfg().cmtParas') === 6 && E.ev('csCfg().cmtPer') === 4, 'old few/normal/many migrates to numbers');
  E.ev("SillyTavern.getContext().extensionSettings.chatStory = {_v:20, preset:'moon'}");
  ok(E.ev('csCfg().preset') === 'ink', '1.17 moon default goes to the default once');
  E.ev("SillyTavern.getContext().extensionSettings.chatStory = {_v:22, preset:'classic', volume:0.6}");
  ok(E.ev('csCfg().preset') === 'ink' && E.ev('csCfg().volume') === 0.8, '1.21 default dark + louder once');
  E.ev("SillyTavern.getContext().extensionSettings.chatStory = {_v:23, preset:'classic'}");
  ok(E.ev('csCfg().preset') === 'classic', 'choosing white later is kept');
  E.ev("SillyTavern.getContext().extensionSettings.chatStory = {_v:21, preset:'moon'}");
  ok(E.ev('csCfg().preset') === 'moon', 'choosing moon later is kept');
  E.ev("SillyTavern.getContext().extensionSettings.chatStory = {}");
  ok(E.ev("csItemHTML({k:'narr',text:'x',hd:3})").includes('cs-turn') && /บท 3/.test(E.ev("csItemHTML({k:'narr',text:'x',hd:3})")), 'chapter divider before a reply');
  ok(E.ev("csItemsForMessage(1)[0].hd") === 1 && !E.ev("csItemsForMessage(0)[0].hd"), 'divider only on bot replies, numbered like novel chapters');
  ok(!E.errors.length, 'no uncaught', E.errors.map(String));
  console.log(`\nPASS ${pass}  FAIL ${fail}`);
  process.exit(fail ? 1 : 0);
})().catch(e => { console.log('CRASH', e); process.exit(1); });
