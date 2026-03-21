const fs = require('fs'), path = require('path');
const colorPattern = /(green|red|yellow|amber|blue|orange|purple)-\d+/g;
const counts = {};

function scan(dir) {
  for (const e of fs.readdirSync(dir, { withFileTypes: true })) {
    const f = path.join(dir, e.name);
    if (e.isDirectory()) scan(f);
    else if (e.isFile() && e.name.endsWith('.jsx')) {
      const c = fs.readFileSync(f, 'utf8');
      let m;
      colorPattern.lastIndex = 0;
      while ((m = colorPattern.exec(c)) !== null) {
        counts[m[0]] = (counts[m[0]] || 0) + 1;
      }
    }
  }
}

scan('d:/MY ASTO STORE/myasto/frontend/src');
const sorted = Object.entries(counts).sort((a, b) => b[1] - a[1]);
console.log('Remaining hardcoded color classes (by frequency):');
sorted.forEach(([cls, n]) => console.log(String(n).padStart(3), 'x', cls));
