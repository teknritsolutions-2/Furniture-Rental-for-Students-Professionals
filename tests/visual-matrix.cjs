/* Layout invariants + screenshots. Uses the same environment variables as browser-regression.cjs. */
const { chromium } = require(process.env.PLAYWRIGHT_PATH || 'playwright');
const fs = require('node:fs');
const base = process.env.BASE_URL || 'http://127.0.0.1:8000';
const output = process.env.QA_OUTPUT || '/private/tmp/nestloop-qa';
(async () => {
  fs.mkdirSync(output, {recursive:true});
  const browser = await chromium.launch({headless:true,...(process.env.BROWSER_PATH?{executablePath:process.env.BROWSER_PATH}:{})});
  const page = await browser.newPage({reducedMotion:'reduce'});
  const errors=[], failures=[], heroSizes={}, captures=[];
  page.on('pageerror',e=>errors.push(e.message));
  const paths=['index.html',...fs.readdirSync('pages').filter(f=>f.endsWith('.html')).map(f=>'pages/'+f),'404.html',...['browse','rentals','billing','requests','documents','settings'].map(v=>'pages/dashboard.html#'+v)];
  let count=0;
  for(const path of paths) {
    await page.goto(base+'/'+path);
    await page.locator('img').evaluateAll(imgs=>imgs.forEach(i=>i.loading='eager'));
    await page.evaluate(()=>Promise.all([...document.images].map(i=>i.decode().catch(()=>{}))));
    for(const width of [1440,1280,1024,820,768,430,390,360,320]) {
      await page.setViewportSize({width,height:1000});
      await page.evaluate(()=>new Promise(resolve=>requestAnimationFrame(()=>requestAnimationFrame(resolve))));
      for(const theme of ['light','dark']) for(const dir of ['ltr','rtl']) {
        await page.evaluate(({theme,dir})=>{document.documentElement.dataset.theme=theme;document.documentElement.dir=dir},{theme,dir});
        await page.evaluate(()=>new Promise(resolve=>requestAnimationFrame(()=>requestAnimationFrame(resolve))));
        const result=await page.evaluate(()=>({overflow:document.documentElement.scrollWidth>innerWidth+1,broken:[...document.images].filter(i=>!i.naturalWidth).map(i=>i.src),hero:document.querySelector('.hero-h1')?getComputedStyle(document.querySelector('.hero-h1')).fontSize:null}));
        if(result.overflow||result.broken.length) failures.push({path,width,theme,dir,...result});
        if(result.hero) heroSizes[path+'-'+width]=result.hero;
        count++;
        const main=['index.html','pages/home2.html','pages/packages.html','pages/package-details.html','pages/pricing.html','pages/dashboard.html','pages/dashboard.html#billing'];
        if(width===820||([1440,390].includes(width)&&main.includes(path)&&((theme==='light'&&dir==='ltr')||(theme==='dark'&&dir==='rtl')))) {
          const name=path.replace('pages/','').replace('.html','').replace('#','-')+'-'+width+'-'+theme+'-'+dir+'.png';
          await page.screenshot({path:output+'/'+name});captures.push(name);
        }
      }
    }
    console.log('CHECKED',path);
  }
  for(const width of [1440,1280,1024,820,768,430,390,360,320]) {
    if(heroSizes['index.html-'+width]!==heroSizes['pages/home2.html-'+width]) failures.push({typography:'Homepage H1 mismatch',width});
  }
  await page.setViewportSize({width:1400,height:1000});
  for(const mode of ['light-ltr','dark-rtl','light-rtl','dark-ltr']) {
    const selected=captures.filter(f=>f.includes('-820-'+mode));
    await page.setContent(`<body style="margin:0;padding:12px;display:grid;grid-template-columns:repeat(4,1fr);gap:12px;background:#d9ddd9;font:13px sans-serif">${selected.map(f=>`<div><p>${f}</p><img style="width:100%" src="data:image/png;base64,${fs.readFileSync(output+'/'+f).toString('base64')}"></div>`).join('')}</body>`);
    await page.screenshot({path:output+'/contact-'+mode+'.png',fullPage:true});
  }
  fs.writeFileSync(output+'/visual-results.json',JSON.stringify({count,failures,errors,heroSizes,captures},null,2));
  console.log(JSON.stringify({count,failures,errors}));
  await browser.close();if(failures.length||errors.length) process.exitCode=1;
})().catch(e=>{console.error(e);process.exit(1)});
