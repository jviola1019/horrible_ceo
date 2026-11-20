"""Build a no-install single-file HTML edition from the native source modules."""
from pathlib import Path
import re,base64
root=Path(__file__).resolve().parents[1]
html=(root/'index.html').read_text()
css=(root/'styles.css').read_text()
svg=(root/'assets/office.svg').read_text()
css=css.replace("url('assets/office.svg')",'url(data:image/svg+xml;base64,'+base64.b64encode(svg.encode()).decode()+')')
sources=[]
for name in ['data.js','engine.js','storage.js','app.js']:
  s=(root/'src'/name).read_text()
  s=re.sub(r'^import\s+.+?\s+from\s+[\'"].+?[\'"].*?;\s*$', '', s,flags=re.M)
  s=re.sub(r'\bexport\s+(?=(?:const|function|async function|class)\b)', '', s)
  sources.append('\n// --- '+name+' ---\n'+s)
js='\n'.join(sources)
assert not re.search(r'^\s*(?:import|export)\b',js,re.M)
html=re.sub(r'\s*<link rel="icon"[^>]+>', '',html)
html=re.sub(r'\s*<link rel="apple-touch-icon"[^>]+>', '',html)
html=re.sub(r'\s*<link rel="manifest"[^>]+>', '',html)
html=html.replace('<link rel="stylesheet" href="styles.css">','<style>'+css+'</style>')
html=html.replace('<script type="module" src="src/app.js"></script>','<script>\n(()=>{\n'+js+'\n})();\n</script>')
html=html.replace("if('serviceWorker' in navigator && (location.protocol==='https:'||location.hostname==='localhost'||location.hostname==='127.0.0.1'))navigator.serviceWorker.register('./sw.js').catch(()=>{});",'')
(root/'play.html').write_text(html)
print('Singlefile build complete')
