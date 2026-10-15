from pathlib import Path
from urllib.parse import urljoin, urlparse
import re
import urllib.request

root = Path(__file__).resolve().parent
base = "https://wasyt.uz/"
index = urllib.request.urlopen(base).read().decode("utf-8")
(root / "index.html").write_text(index, encoding="utf-8")

refs = re.findall(r'''(?:src|href)=["']([^"']+)["']''', index)
asset_refs = []
for ref in refs:
    if ref.startswith(("http://", "https://", "#", "mailto:", "tel:")):
        continue
    asset_refs.append(ref)

seen = set()
for ref in asset_refs:
    if ref in seen:
        continue
    seen.add(ref)
    target = urljoin(base, ref)
    req = urllib.request.Request(target, headers={"User-Agent": "Mozilla/5.0"})
    data = urllib.request.urlopen(req).read()
    local_path = root / ref
    local_path.parent.mkdir(parents=True, exist_ok=True)
    local_path.write_bytes(data)

css_files = list((root / "assets" / "css").glob("*.css"))
for css_file in css_files:
    text = css_file.read_text(encoding="utf-8")
    css_refs = re.findall(r'''url\((?:["']?)([^"')]+)(?:["']?)\)''', text)
    for ref in css_refs:
        if ref.startswith(("http://", "https://", "data:", "#")):
            continue
        local_ref = urljoin("https://wasyt.uz/", ref)
        if local_ref in seen:
            continue
        try:
            req = urllib.request.Request(local_ref, headers={"User-Agent": "Mozilla/5.0"})
            data = urllib.request.urlopen(req).read()
            local_path = root / urllib.parse.urlparse(local_ref).path.lstrip("/")
            local_path.parent.mkdir(parents=True, exist_ok=True)
            local_path.write_bytes(data)
            seen.add(local_ref)
        except Exception:
            pass

print(f"Copied {len(seen)} local assets")
