/* TR81 — 80 ili (mugla dahil 81) eski tasarımdan veri/şablon ayrımına geçirir.
   - data/<slug>.json üretir  {name, slug, locations:[{name, map, photos[]}]}
   - <slug>.html'i ince kabuğa indirir (il.css + il.js yükler, window.IL set eder)
   - mugla_demo.html = demo modlu kabuk (Shopier + kod CTA)
   Kaynak: eski <slug>.html içindeki .city-section blokları (mugla hariç).
   mugla: mevcut mugla.html içindeki const LOCS=[...] dizisi.
   Çalıştır:  node build_provinces.cjs           (yaz)
              node build_provinces.cjs --dry      (sadece rapor) */
const fs=require('fs'),path=require('path');
const ROOT=__dirname;
const DRY=process.argv.includes('--dry');
const DATA=path.join(ROOT,'data');
if(!DRY&&!fs.existsSync(DATA))fs.mkdirSync(DATA);

/* slug listesi: *_demo.html dosyalarından türet (sadece TR illeri bu desende) */
const slugs=fs.readdirSync(ROOT)
  .filter(f=>/_demo\.html$/.test(f))
  .map(f=>f.replace(/_demo\.html$/,''))
  .sort();

const cap=s=>s.charAt(0).toUpperCase()+s.slice(1);
const clean=t=>t.replace(/<[^>]*>/g,'').replace(/📍|📸/g,'').replace(/\s+/g,' ').trim();

/* eski <slug>.html -> {name, locations[]} */
function parseOld(html,slug){
  let name=(html.match(/class="gradient-text"[^>]*>([\s\S]*?)<\/span>/)||[])[1];
  name=name?clean(name):cap(slug);
  const locations=[];
  const parts=html.split(/<div class="city-section">/).slice(1);
  for(const part of parts){
    const body=part.split(/<\/div>\s*<div class="city-section">/)[0]; // güvenli sınır değil ama data-photo bölüm-içi
    const m=part.match(/<a\s+href="([^"]*)"[^>]*class="location-link"[^>]*>([\s\S]*?)<\/a>/);
    if(!m)continue;
    const map=m[1];
    const locName=clean(m[2]);
    const photos=[];
    const re=/data-photo="([^"]*)"/g;let pm;
    const scope=part.split(/<div class="city-section">/)[0]; // bu bölümün kapsamı (sonraki bölüm zaten ayrı part)
    while((pm=re.exec(scope))!==null)photos.push(pm[1]);
    if(locName&&map)locations.push({name:locName,map,photos});
  }
  return {name,locations};
}

/* mugla.html -> const LOCS=[...] */
function parseMugla(){
  const html=fs.readFileSync(path.join(ROOT,'mugla.html'),'utf8');
  const m=html.match(/const LOCS=(\[[\s\S]*?\]);/);
  if(!m)throw new Error('mugla LOCS bulunamadı');
  return {name:'Muğla',locations:JSON.parse(m[1])};
}

/* ince kabuk üret */
function shell(name,slug,mode){
  return `<!DOCTYPE html>
<html lang="tr">
<head>
<meta charset="utf-8">
<meta name="viewport" content="width=device-width,initial-scale=1.0,viewport-fit=cover">
<title>${name} — TR81</title>
<link rel="preconnect" href="https://fonts.googleapis.com">
<link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
<link href="https://fonts.googleapis.com/css2?family=Bebas+Neue&family=Inter:wght@400;500;600;700;800&display=swap" rel="stylesheet">
<link rel="stylesheet" href="il.css">
<script src="i18n.js"></script>
</head>
<body>
<div class="app">
  <header class="top">
    <a class="back" href="index.html" aria-label="Geri"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M15 5l-7 7 7 7"/></svg></a>
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
<script>window.IL={slug:'${slug}',mode:'${mode}'};</script>
<script src="il.js"></script>
</body>
</html>
`;
}

const report=[];
for(const slug of slugs){
  const jsonPath=path.join(DATA,slug+'.json');
  let data;
  if(fs.existsSync(jsonPath)){
    data=JSON.parse(fs.readFileSync(jsonPath,'utf8'));   /* veri zaten var: KORU, sadece kabuğu tazele (idempotent) */
  }else if(slug==='mugla'){
    data=parseMugla();
  }else{
    const src=path.join(ROOT,slug+'.html');
    if(!fs.existsSync(src)){report.push([slug,'YOK','—']);continue;}
    data=parseOld(fs.readFileSync(src,'utf8'),slug);
  }
  data.slug=slug;
  const out={name:data.name,slug,locations:data.locations};
  report.push([slug,data.name,data.locations.length]);
  if(!DRY){
    fs.writeFileSync(path.join(DATA,slug+'.json'),JSON.stringify(out,null,1));
    fs.writeFileSync(path.join(ROOT,slug+'.html'),shell(data.name,slug,'full'));
    if(slug==='mugla')fs.writeFileSync(path.join(ROOT,'mugla_demo.html'),shell(data.name,'mugla','demo'));
  }
}

/* rapor */
report.sort((a,b)=>a[0].localeCompare(b[0]));
let zero=0,total=0;
console.log('slug'.padEnd(16),'name'.padEnd(22),'konum');
for(const [s,n,c] of report){console.log(String(s).padEnd(16),String(n).padEnd(22),c);if(c===0||c==='—')zero++;if(typeof c==='number')total+=c;}
console.log('-----');
console.log('il sayısı:',report.length,'| toplam konum:',total,'| boş/sorunlu:',zero,DRY?'(DRY RUN — yazılmadı)':'(yazıldı)');
