// บีบ src/index.js · src/style.css → index.js · style.css (ไฟล์ที่ SillyTavern โหลดจริง)
// ใช้: npm i terser@5 csso@5 && node src/build.js
const fs = require('fs'), path = require('path');
const { minify } = require('terser');
const csso = require('csso');
const root = path.join(__dirname, '..');
(async () => {
 const r = await minify(fs.readFileSync(path.join(__dirname, 'index.js'), 'utf8'), { ecma: 2020, module: false, compress: { passes: 2 }, mangle: { toplevel: false }, format: { comments: false, preamble: '// Paper-Whisper · แชทนิยาย สำหรับ SillyTavern · https://github.com/janyaAhri/Paper-Whisper · ต้นฉบับอ่านง่าย: src/' } });
 fs.writeFileSync(path.join(root, 'index.js'), r.code);
 fs.writeFileSync(path.join(root, 'style.css'), csso.minify(fs.readFileSync(path.join(__dirname, 'style.css'), 'utf8'), { restructure: false }).css);
 console.log('built');
})();
