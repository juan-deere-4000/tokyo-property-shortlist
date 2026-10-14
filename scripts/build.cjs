const fs = require('node:fs');
const path = require('node:path');

const root = path.resolve(__dirname, '..');
const output = path.join(root, 'dist');
fs.rmSync(output, { recursive: true, force: true });
fs.mkdirSync(output);
// Publish only runtime files. SQL, backups, scraper state, and tests stay out of Pages.
for (const name of ['index.html', 'notes-config.js', 'js', 'styles', 'properties', 'vendor']) {
  fs.cpSync(path.join(root, name), path.join(output, name), {
    recursive: true,
    filter: source => !path.basename(source).startsWith('.') && path.basename(source) !== 'backup-originals'
  });
}
fs.writeFileSync(path.join(output, '.nojekyll'), '');
console.log('Built static site in dist/');
