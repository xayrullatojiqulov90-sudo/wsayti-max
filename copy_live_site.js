const fs = require('fs');
const path = require('path');
const root = process.cwd();
const base = 'https://wasyt.uz/';

async function fetchBytes(url) {
  const response = await fetch(url, { headers: { 'User-Agent': 'Mozilla/5.0' } });
  if (!response.ok) throw new Error(`HTTP ${response.status} for ${url}`);
  return Buffer.from(await response.arrayBuffer());
}

function writeFile(target, data) {
  fs.mkdirSync(path.dirname(target), { recursive: true });
  fs.writeFileSync(target, data);
}

function isExternalUrl(ref) {
  return /^https?:\/\//i.test(ref) || ref.startsWith('//') || ref.startsWith('mailto:') || ref.startsWith('tel:') || ref.startsWith('data:');
}

async function downloadRef(ref, seen = new Set()) {
  if (!ref || isExternalUrl(ref) || ref.startsWith('#')) return;
  const url = new URL(ref, base).href;
  if (seen.has(url)) return;
  seen.add(url);
  const data = await fetchBytes(url);
  const localPath = path.join(root, new URL(url).pathname.replace(/^\//, ''));
  writeFile(localPath, data);
  return localPath;
}

async function main() {
  const html = await fetchBytes(base);
  const htmlText = html.toString('utf8');
  const refs = [...htmlText.matchAll(/(?:src|href)=["']([^"']+)["']/g)].map(match => match[1]);
  writeFile(path.join(root, 'index.html'), htmlText);

  const seen = new Set();
  for (const ref of refs) {
    await downloadRef(ref, seen);
  }

  const cssFiles = findFiles(root, '.css');
  for (const cssFile of cssFiles) {
    const css = fs.readFileSync(cssFile, 'utf8');
    const urls = [...css.matchAll(/url\((?:["']?)([^"')]+)(?:["']?)\)/g)].map(match => match[1]);
    for (const ref of urls) {
      await downloadRef(ref, seen);
    }
  }

  console.log(`Copied website HTML and ${seen.size} local assets.`);
}

function findFiles(dir, ext) {
  const result = [];
  for (const entry of fs.readdirSync(dir, { withFileTypes: true })) {
    const full = path.join(dir, entry.name);
    if (entry.isDirectory()) result.push(...findFiles(full, ext));
    else if (entry.name.endsWith(ext)) result.push(full);
  }
  return result;
}

main().catch(error => {
  console.error(error);
  process.exit(1);
});
