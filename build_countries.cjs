/* TR81 — dünya ülkelerini (ABD ve Türkiye HARİÇ) eski tasarımdan il-şablonuna geçirir.
   - data/<slug>.json üretir  {name:{tr,en}, slug, locations:[{name, map, photos[]}]}
   - <slug>.html'i ince kabuğa indirir (il.css + il.js, window.IL mode:'country')
   Kaynak: eski <slug>.html içindeki .city-section blokları (il sayfalarıyla AYNI markup).
   İsim: Intl.DisplayNames (tr+en) — eski gradient-text İngilizce olduğundan kullanılmaz.
   Çalıştır:  node build_countries.cjs           (yaz)
              node build_countries.cjs --dry      (sadece rapor) */
const fs=require('fs'),path=require('path');
const ROOT=__dirname;
const DRY=process.argv.includes('--dry');
const DATA=path.join(ROOT,'data');
if(!DRY&&!fs.existsSync(DATA))fs.mkdirSync(DATA);

/* ülke listesi: worlddata.js COUNTRIES'ten [iso,slug] çek; ABD + Türkiye hariç */
const wd=fs.readFileSync(path.join(ROOT,'worlddata.js'),'utf8');
const COUNTRIES=[...wd.matchAll(/\['([a-z]{2})','([a-z]+)','[a-z]{2}'\]/g)].map(m=>[m[1],m[2]]);
const EXCLUDE=new Set(['us','tr']);   /* abd (eyaletli ayrı yapı) + türkiye (->index.html) */

const nameTR=new Intl.DisplayNames(['tr'],{type:'region'});
const nameEN=new Intl.DisplayNames(['en'],{type:'region'});
const CUSTOM={xk:{tr:'Kosova',en:'Kosovo'},cd:{tr:'Demokratik Kongo',en:'DR Congo'}};
function names(iso){
  if(CUSTOM[iso])return CUSTOM[iso];
  const I=iso.toUpperCase();
  return {tr:nameTR.of(I)||I, en:nameEN.of(I)||I};
}

const clean=t=>t.replace(/<[^>]*>/g,'').replace(/📍|📸/g,'').replace(/\s+/g,' ').trim();

/* eski <slug>.html -> locations[] (build_provinces.parseOld ile aynı mantık) */
function parseLocations(html){
  const locations=[];
  const parts=html.split(/<div class="city-section">/).slice(1);
  for(const part of parts){
    const m=part.match(/<a\s+href="([^"]*)"[^>]*class="location-link"[^>]*>([\s\S]*?)<\/a>/);
    if(!m)continue;
    const map=m[1];
    const locName=clean(m[2]);
    const photos=[];
    const scope=part.split(/<div class="city-section">/)[0];
    const re=/data-photo="([^"]*)"/g;let pm;
    while((pm=re.exec(scope))!==null)photos.push(pm[1]);
    if(locName&&map)locations.push({name:locName,map,photos});
  }
  return locations;
}

function shell(nameTr,slug){
  return `<!DOCTYPE html>
<html lang="tr">
<head>
<meta charset="utf-8">
<meta name="viewport" content="width=device-width,initial-scale=1.0,viewport-fit=cover">
<title>${nameTr} — TR81</title>
<link rel="preconnect" href="https://fonts.googleapis.com">
<link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
<link href="https://fonts.googleapis.com/css2?family=Bebas+Neue&family=Inter:wght@400;500;600;700;800&display=swap" rel="stylesheet">
<link rel="stylesheet" href="il.css?v=3">
<script src="i18n.js?v=4"></script>
</head>
<body>
<div class="app">
  <header class="top">
    <a class="back" href="world.html" aria-label="Geri"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M15 5l-7 7 7 7"/></svg></a>
    <span class="sp"></span>
  </header>
  <section class="intro"><h1>${nameTr}</h1><div class="cnt" id="cnt"></div></section>
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
<script>window.IL={slug:'${slug}',mode:'country'};</script>
<script src="il.js?v=7"></script>
</body>
</html>
`;
}

const report=[];let total=0,zero=0;
for(const [iso,slug] of COUNTRIES){
  if(EXCLUDE.has(iso)){report.push([slug,'(atlandı)','—']);continue;}
  const src=path.join(ROOT,slug+'.html');
  if(!fs.existsSync(src)){report.push([slug,'DOSYA YOK','—']);zero++;continue;}
  const html=fs.readFileSync(src,'utf8');
  const locations=parseLocations(html);
  const nm=names(iso);
  report.push([slug,nm.tr,locations.length]);
  if(locations.length===0)zero++; else total+=locations.length;
  if(!DRY){
    const out={name:nm,slug,locations};
    fs.writeFileSync(path.join(DATA,slug+'.json'),JSON.stringify(out,null,1));
    fs.writeFileSync(src,shell(nm.tr,slug));
  }
}

report.sort((a,b)=>a[0].localeCompare(b[0]));
console.log('slug'.padEnd(22),'name(tr)'.padEnd(24),'konum');
for(const [s,n,c] of report)console.log(String(s).padEnd(22),String(n).padEnd(24),c);
console.log('-----');
console.log('ülke:',report.length,'| işlenen konum:',total,'| boş/atlanan:',zero,DRY?'(DRY — yazılmadı)':'(yazıldı)');
