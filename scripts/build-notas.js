// Junta data/ajustes.json + data/notas/*.json en data/notas.json (lo que lee la revista).
// Se ejecuta solo en Cloudflare antes de publicar.
const fs = require('fs'), path = require('path');
const root = path.join(__dirname, '..');
const dir = path.join(root, 'data', 'notas');
const ajustes = JSON.parse(fs.readFileSync(path.join(root, 'data', 'ajustes.json'), 'utf8'));
const articles = fs.existsSync(dir) ? fs.readdirSync(dir).filter(f => f.endsWith('.json')).map(f => {
  try { const a = JSON.parse(fs.readFileSync(path.join(dir, f), 'utf8')); a.id = f.replace(/\.json$/, ''); return a; }
  catch (e) { console.warn('Nota con error, se omite:', f, e.message); return null; }
}).filter(Boolean) : [];
articles.sort((a, b) => String(b.date || '').localeCompare(String(a.date || '')) || String(b.time || '').localeCompare(String(a.time || '')));
fs.writeFileSync(path.join(root, 'data', 'notas.json'), JSON.stringify(Object.assign({}, ajustes, { articles }), null, 2));
console.log('Sweetie: ' + articles.length + ' notas combinadas en data/notas.json');
