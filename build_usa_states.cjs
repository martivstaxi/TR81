/* TR81 — 50 ABD eyaletini (usa_<slug>.html) eski tasarımdan il-şablonuna geçirir.
   - data/usa_<slug>.json  {name, slug:'usa_<slug>', locations:[{name, map, photos[]}]}
   - usa_<slug>.html ince kabuk (il.css + il.js, mode 'country', home -> unitedstates.html)
   Kaynak: eski usa_<slug>.html içindeki .city-section blokları (ülkelerle AYNI markup).
   Çalıştır:  node build_usa_states.cjs [--dry] */
const fs=require('fs'),path=require('path');
const ROOT=__dirname;
const DRY=process.argv.includes('--dry');
const DATA=path.join(ROOT,'data');
if(!DRY&&!fs.existsSync(DATA))fs.mkdirSync(DATA);

/* eyalet listesi: unitedstates.html const states=[...] */
const us=fs.readFileSync(path.join(ROOT,'unitedstates.html'),'utf8');
const STATES=Function('return '+us.match(/const states = (\[[\s\S]*?\]);/)[1])();

const clean=t=>t.replace(/<[^>]*>/g,'').replace(/📍|📸/g,'').replace(/\s+/g,' ').trim();
function parseLocations(html){
  const locations=[];
  const parts=html.split(/<div class="city-section">/).slice(1);
  for(const part of parts){
    const m=part.match(/<a\s+href="([^"]*)"[^>]*class="location-link"[^>]*>([\s\S]*?)<\/a>/);
    if(!m)continue;
    const map=m[1], locName=clean(m[2]), photos=[];
    const scope=part.split(/<div class="city-section">/)[0];
    const re=/data-photo="([^"]*)"/g;let pm;
    while((pm=re.exec(scope))!==null)photos.push(pm[1]);
    if(locName&&map)locations.push({name:locName,map,photos});
  }
  return locations;
}

function shell(name,slug){
  return `<!DOCTYPE html>
<html lang="tr">
<head>
<meta charset="utf-8">
<meta name="viewport" content="width=device-width,initial-scale=1.0,viewport-fit=cover">
<title>${name} — TR81</title>
<link rel="preconnect" href="https://fonts.googleapis.com">
<link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
<link href="https://fonts.googleapis.com/css2?family=Bebas+Neue&family=Inter:wght@400;500;600;700;800&display=swap" rel="stylesheet">
<link rel="stylesheet" href="il.css?v=3">
<script src="i18n.js?v=4"></script>
</head>
<body>
<div class="app">
  <header class="top">
    <a class="back" href="unitedstates.html" aria-label="Geri"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M15 5l-7 7 7 7"/></svg></a>
    <span class="sp"></span>
  </header>
  <section class="intro"><h1>${name}</h1><div class="cnt" id="cnt"></div></section>
  <main id="list"></main>
  <div class="cta" id="cta"></div>
</div>
<div class="lb" id="lb" role="dialog" aria-modal="true" aria-label="Foto&#287;raflar">
  <div class="lbx" id="lbx" role="button" aria-label="Kapat">&#10005;</div>
  <div class="stage"><div class="track" id="lbtrack"></div></div>
  <div class="foot">
    <div class="nm" id="lbnm"></div>
    <div class="ctrls">
      <div class="nav" id="lbprev" role="button" aria-label="&#214;nceki">&#8249;</div>
      <div class="dots" id="lbdots"></div>
      <div class="nav" id="lbnext" role="button" aria-label="Sonraki">&#8250;</div>
    </div>
    <a class="maplink" id="lbmap" href="#" target="_blank" rel="noopener"></a>
  </div>
</div>
<script>window.IL={slug:'usa_${slug}',mode:'country',home:'unitedstates.html'};</script>
<script src="il.js?v=8"></script>
</body>
</html>
`;
}

const report=[];let total=0,zero=0;
for(const [slug,name] of STATES){
  const src=path.join(ROOT,'usa_'+slug+'.html');
  if(!fs.existsSync(src)){report.push([slug,'DOSYA YOK','—']);zero++;continue;}
  const locations=parseLocations(fs.readFileSync(src,'utf8'));
  report.push([slug,name,locations.length]);
  if(locations.length===0)zero++; else total+=locations.length;
  if(!DRY){
    fs.writeFileSync(path.join(DATA,'usa_'+slug+'.json'),JSON.stringify({name,slug:'usa_'+slug,locations},null,1));
    fs.writeFileSync(src,shell(name,slug));
  }
}
report.sort((a,b)=>a[0].localeCompare(b[0]));
console.log('slug'.padEnd(18),'name'.padEnd(18),'konum');
for(const [s,n,c] of report)console.log(String(s).padEnd(18),String(n).padEnd(18),c);
console.log('-----');
console.log('eyalet:',report.length,'| konum:',total,'| boş:',zero,DRY?'(DRY)':'(yazıldı)');
