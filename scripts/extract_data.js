// Extract all data arrays from source App.jsx into structured JSON.
const fs = require('fs');
const path = require('path');
const vm = require('vm');

const SRC = '/home/z/my-project/upload/promptcos-extracted/promptcos/src/App.jsx';
const OUT = '/home/z/my-project/scripts/data';
fs.mkdirSync(OUT, { recursive: true });

const src = fs.readFileSync(SRC, 'utf8').split('\n');
// Lines 63..3331 (1-indexed) = indices 62..3330
const rawCode = src.slice(62, 3331).join('\n');

// Find all const names
const names = [...rawCode.matchAll(/^const ([A-Z_][A-Z0-9_]*)\s*=/gm)].map(m => m[1]);
console.log(`Found ${names.length} consts:`, names.join(', '));

// Append a return statement that builds an exports object.
const codeWithReturn = rawCode + `\n;\nconst __OUT = { ${names.join(', ')} };\n__OUT;\n`;

const stubEl = () => ({ style: {}, focus() {}, select() {}, removeChild() {}, appendChild() {} });
const sandbox = {
  console,
  document: { createElement: stubEl, body: { appendChild() {}, removeChild() {} } },
  navigator: { clipboard: { writeText: () => Promise.resolve() } },
  window: { isSecureContext: false },
  Blob: function() {},
  URL: { createObjectURL: () => '' },
  setTimeout: () => {},
};
vm.createContext(sandbox);

let result;
try {
  result = vm.runInContext(codeWithReturn, sandbox, { filename: 'app-data.jsx' });
} catch (e) {
  console.error('Eval failed:', e.message);
  // Print line context
  const lines = codeWithReturn.split('\n');
  const m = e.message.match(/(\d+):/);
  if (m) console.error('Around line', m[1], ':', lines[+m[1] - 1]);
  process.exit(1);
}

const manifest = {};
for (const name of names) {
  if (result[name] === undefined) {
    console.warn(`  ! ${name} missing from result`);
    continue;
  }
  const value = result[name];
  const json = JSON.stringify(value, null, 2);
  fs.writeFileSync(path.join(OUT, `${name}.json`), json);
  const count = Array.isArray(value) ? `array[${value.length}]` : typeof value === 'object' ? `object{${Object.keys(value).length}}` : typeof value;
  manifest[name] = count;
  console.log(`  ✓ ${name} → ${count}`);
}

fs.writeFileSync(path.join(OUT, '_manifest.json'), JSON.stringify(manifest, null, 2));
console.log('\nDone. Manifest at scripts/data/_manifest.json');
