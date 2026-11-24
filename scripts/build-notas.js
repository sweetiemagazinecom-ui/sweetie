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
const ldir = path.join(root, 'data', 'links');
if (fs.existsSync(ldir)) {
  ajustes.links = fs.readdirSync(ldir).filter(f => f.endsWith('.json')).map(f => {
    try { return JSON.parse(fs.readFileSync(path.join(ldir, f), 'utf8')); } catch (e) { console.warn('Link con error, se omite:', f); return null; }
  }).filter(l => l && l.name && l.url).sort((a, b) => String(a.name).localeCompare(String(b.name), 'es'));
}
fs.writeFileSync(path.join(root, 'data', 'notas.json'), JSON.stringify(Object.assign({}, ajustes, { articles }), null, 2));
console.log('Sweetie: ' + articles.length + ' notas y ' + (ajustes.links || []).length + ' links combinados en data/notas.json');
