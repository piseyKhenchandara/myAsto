const fs = require('fs'), path = require('path');

const replacements = [
  // Extended primary (green) palette
  ['green-50',  'primary-faint'],
  ['green-700', 'primary-dark'],
  ['green-800', 'primary-darker'],

  // Extended danger (red) palette
  ['red-50',  'danger-bg'],
  ['red-100', 'danger-subtle'],
  ['red-200', 'danger-border'],
  ['red-400', 'danger-muted'],
  ['red-700', 'danger-text'],

  // Info color (blue-500 = --color-info)
  ['blue-500', 'info'],
];

let total = 0;

function processDir(dir) {
  for (const e of fs.readdirSync(dir, { withFileTypes: true })) {
    const f = path.join(dir, e.name);
    if (e.isDirectory()) processDir(f);
    else if (e.isFile() && e.name.endsWith('.jsx')) {
      let content = fs.readFileSync(f, 'utf8');
      let changed = false;
      for (const [from, to] of replacements) {
        if (content.includes(from)) {
          content = content.split(from).join(to);
          changed = true;
        }
      }
      if (changed) {
        fs.writeFileSync(f, content);
        total++;
        console.log('updated:', e.name);
      }
    }
  }
}

processDir('d:/MY ASTO STORE/myasto/frontend/src');
console.log('\nTotal files updated:', total);
