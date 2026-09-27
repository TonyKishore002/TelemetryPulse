import fs from 'fs';
const s = fs.readFileSync('public/scene-state/aefb19b0-0589-4c37-878d-126365187019.json', 'utf8');
const urls = s.match(/https:\/\/[^"'\\]+/g) || [];
console.log(Array.from(new Set(urls)));
