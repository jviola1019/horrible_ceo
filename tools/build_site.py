"""Create only the verified public files for static hosting under any project subpath."""
from pathlib import Path
import shutil,json
root=Path(__file__).resolve().parents[1]
dist=root/'dist'
if dist.exists():shutil.rmtree(dist)
dist.mkdir()
for f in ['index.html','styles.css','manifest.webmanifest','sw.js']:
 shutil.copy2(root/f,dist/f)
for d in ['src','assets']:shutil.copytree(root/d,dist/d)
(dist/'.nojekyll').write_text('')
manifest=json.loads((dist/'manifest.webmanifest').read_text())
for i in manifest['icons']:assert (dist/i['src']).stat().st_size>500
assert (dist/'src/app.js').is_file()
print('GitHub Pages dist built')
