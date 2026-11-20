"""Chromium desktop and mobile end-to-end smoke tests; CI requires served modular build."""
from pathlib import Path
from functools import partial
from threading import Thread
from http.server import ThreadingHTTPServer,SimpleHTTPRequestHandler
from playwright.sync_api import sync_playwright
import os
import shutil
ROOT=Path(__file__).resolve().parents[1]
server=ThreadingHTTPServer(('127.0.0.1',0),partial(SimpleHTTPRequestHandler,directory=str(ROOT)))
Thread(target=server.serve_forever,daemon=True).start()
url=f'http://127.0.0.1:{server.server_port}/'
try:
 with sync_playwright() as p:
  kw={'headless':True}
  chrome=shutil.which('google-chrome') or shutil.which('chromium') or shutil.which('chromium-browser')
  if chrome:kw.update(executable_path=chrome,args=['--no-sandbox'])
  browser=p.chromium.launch(**kw)
  for label,viewport in [('desktop',{'width':1440,'height':900}),('iphone',{'width':390,'height':844})]:
   ctx=browser.new_context(viewport=viewport,accept_downloads=True);page=ctx.new_page();page.set_default_timeout(12000);errs=[]
   page.on('pageerror',lambda e:errs.append(str(e)))
   hosted=True
   try:
    response=page.goto(url,wait_until='networkidle',timeout=15000)
    assert response.status==200
   except Exception as e:
    if 'ERR_BLOCKED_BY_ADMINISTRATOR' not in str(e) or os.getenv('REQUIRE_HOSTED_TEST')=='1':raise
    hosted=False;page.close();page=ctx.new_page();page.set_default_timeout(12000)
    page.on('pageerror',lambda e:errs.append(str(e)))
    page.set_content((ROOT/'play.html').read_text(),wait_until='domcontentloaded')
   assert page.locator('h1').inner_text()=='Business as unusual.'
   bounds=page.evaluate('({scroll:document.documentElement.scrollWidth,view:innerWidth})');assert bounds['scroll']<=bounds['view']+2,bounds
   if label=='iphone':assert page.locator('.mobile-nav').is_visible()
   page.locator('button[data-nav="products"]:visible').first.click();assert page.get_by_text('New product portfolio').count()==1
   page.locator('button[data-choice="launch"][data-value="rock"]').click()
   page.locator('button[data-nav="dashboard"]:visible').first.click()
   assert page.get_by_text('AI-Powered Rock').count()>=1
   page.locator('button[data-action="play"]').click();assert page.locator('dialog[open]').count()==1
   page.locator('button[data-action="closeReport"]').click();assert page.locator('dialog[open]').count()==0
   page.locator('button[data-nav="finance"]:visible').first.click();assert page.get_by_text('Quarterly ledger').count()>=1
   with page.expect_download() as dl:page.locator('button[data-action="exportCsv"]').click()
   assert dl.value.suggested_filename.endswith('.csv')
   page.locator('button[data-nav="board"]:visible').first.click()
   with page.expect_download() as dl:page.locator('button[data-action="exportSave"]:visible').first.click()
   assert dl.value.suggested_filename.endswith('.json')
   if hosted:
    page.reload(wait_until='networkidle')
    assert 'Q2' in page.locator('.topline').inner_text() or '2 / 12' in page.locator('.topline').inner_text()
    page.evaluate("Promise.race([navigator.serviceWorker.ready, new Promise((_,reject)=>setTimeout(()=>reject(new Error('Service worker did not activate within 10 seconds')),10000))])")
    ctx.set_offline(True);page.reload(wait_until='domcontentloaded')
    assert page.locator('.topline').count()==1;ctx.set_offline(False)
   assert not errs,errs
   print(label,'PASS', 'hosted modular PWA' if hosted else 'standalone fallback')
   ctx.close()
  browser.close()
finally:
 server.shutdown();server.server_close()
