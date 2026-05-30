/* TR81 — paylaşılan il sayfası motoru.
   Sayfa <script>window.IL={slug:'antalya',mode:'full'}</script> tanımlar, sonra bu dosyayı yükler.
   Veri: data/<slug>.json  ->  {name, locations:[{name, map, photos:[...]}]}
   mode 'full' = kilit açık (alt CTA: Tüm Dünya Konumları -> world.html)
   mode 'demo' = ücretsiz önizleme (alt CTA: Shopier 81 İL + "Kodum var" kod kutusu) */
(function(){
const IL=window.IL||{slug:'',mode:'full'};
const T=(window.I18N&&window.I18N.t)||{},LANG=(window.I18N&&window.I18N.lang)||'en';

const PIN='<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.7" stroke-linecap="round" stroke-linejoin="round"><path d="M12 21s7-5.2 7-11a7 7 0 1 0-14 0c0 5.8 7 11 7 11Z"/><circle cx="12" cy="10" r="2.5"/></svg>';
const GLOBE='<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="12" r="9"/><path d="M3 12h18"/><path d="M12 3c2.6 2.6 4 5.7 4 9s-1.4 6.4-4 9c-2.6-2.6-4-5.7-4-9s1.4-6.4 4-9Z"/></svg>';
const LOCK='<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.7" stroke-linecap="round" stroke-linejoin="round"><rect x="5" y="10.5" width="14" height="9.5" rx="2.4"/><path d="M8 10.5V7.2A4 4 0 0 1 16 7.2v3.3"/></svg>';
const UNLOCK='<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.7" stroke-linecap="round" stroke-linejoin="round"><rect x="5" y="10.5" width="14" height="9.5" rx="2.4"/><path d="M8 10.5V7.2A4 4 0 0 1 15.6 5.6"/></svg>';

const $=id=>document.getElementById(id);
let LOCS=[];

/* ---------------- alt CTA ---------------- */
function buildCTA(){
  const cta=$('cta');
  if(IL.mode==='demo'){
    cta.innerHTML=`<h3>${T.demoH}</h3><p>${T.demoP}</p>
      <div class="ctabtns">
        <a href="https://www.shopier.com/35589307" target="_blank" rel="noopener">${LOCK}<span>${T.demoB}</span></a>
        <button class="codebtn" id="codebtn">${UNLOCK}<span>${T.haveCode}</span></button>
      </div>
      <div class="codebox" id="codebox">
        <div class="crow"><input id="codeinput" type="text" autocomplete="off" autocapitalize="characters" spellcheck="false" placeholder="${T.codePh}"><button class="go" id="codego">${T.codeGo}</button></div>
        <div class="codemsg" id="codemsg"></div>
      </div>`;
    wireCode();
  }else{
    cta.innerHTML=`<h3>${T.fullH}</h3><p>${T.fullP}</p><a href="world.html">${GLOBE}<span>${T.fullB}</span></a>`;
  }
}

/* ---- kod ile kilidi aç (index.html ile aynı mekanizma; doğru kod tüm 81 ili açar) ---- */
const LS_KEY='tr81-access';
const MASTER='02e3d09f8f4c16e579f85af78587a0ce78123f28933223277fa7feae2d7ea449';
function grantAccess(){try{localStorage.setItem(LS_KEY,'granted');}catch(e){}}
const normCode=c=>(c||'').toUpperCase().replace(/[^A-Z0-9]/g,'');
function sha256hex(ascii){
  function rr(n,x){return(x>>>n)|(x<<(32-n));}
  const K=[0x428a2f98,0x71374491,0xb5c0fbcf,0xe9b5dba5,0x3956c25b,0x59f111f1,0x923f82a4,0xab1c5ed5,0xd807aa98,0x12835b01,0x243185be,0x550c7dc3,0x72be5d74,0x80deb1fe,0x9bdc06a7,0xc19bf174,0xe49b69c1,0xefbe4786,0x0fc19dc6,0x240ca1cc,0x2de92c6f,0x4a7484aa,0x5cb0a9dc,0x76f988da,0x983e5152,0xa831c66d,0xb00327c8,0xbf597fc7,0xc6e00bf3,0xd5a79147,0x06ca6351,0x14292967,0x27b70a85,0x2e1b2138,0x4d2c6dfc,0x53380d13,0x650a7354,0x766a0abb,0x81c2c92e,0x92722c85,0xa2bfe8a1,0xa81a664b,0xc24b8b70,0xc76c51a3,0xd192e819,0xd6990624,0xf40e3585,0x106aa070,0x19a4c116,0x1e376c08,0x2748774c,0x34b0bcb5,0x391c0cb3,0x4ed8aa4a,0x5b9cca4f,0x682e6ff3,0x748f82ee,0x78a5636f,0x84c87814,0x8cc70208,0x90befffa,0xa4506ceb,0xbef9a3f7,0xc67178f2];
  let H=[0x6a09e667,0xbb67ae85,0x3c6ef372,0xa54ff53a,0x510e527f,0x9b05688c,0x1f83d9ab,0x5be0cd19];
  const bytes=[];for(let i=0;i<ascii.length;i++)bytes.push(ascii.charCodeAt(i)&0xff);
  const l=bytes.length;bytes.push(0x80);while(bytes.length%64!==56)bytes.push(0);
  const bl=l*8;for(let i=7;i>=0;i--)bytes.push((bl/Math.pow(2,i*8))&0xff);
  const w=new Array(64);
  for(let j=0;j<bytes.length;j+=64){
    for(let i=0;i<16;i++)w[i]=(bytes[j+i*4]<<24)|(bytes[j+i*4+1]<<16)|(bytes[j+i*4+2]<<8)|(bytes[j+i*4+3]);
    for(let i=16;i<64;i++){const s0=rr(7,w[i-15])^rr(18,w[i-15])^(w[i-15]>>>3),s1=rr(17,w[i-2])^rr(19,w[i-2])^(w[i-2]>>>10);w[i]=(w[i-16]+s0+w[i-7]+s1)|0;}
    let a=H[0],b=H[1],c=H[2],d=H[3],e=H[4],f=H[5],g=H[6],h=H[7];
    for(let i=0;i<64;i++){const S1=rr(6,e)^rr(11,e)^rr(25,e),ch=(e&f)^(~e&g),t1=(h+S1+ch+K[i]+w[i])|0,S0=rr(2,a)^rr(13,a)^rr(22,a),mj=(a&b)^(a&c)^(b&c),t2=(S0+mj)|0;h=g;g=f;f=e;e=(d+t1)|0;d=c;c=b;b=a;a=(t1+t2)|0;}
    H[0]=(H[0]+a)|0;H[1]=(H[1]+b)|0;H[2]=(H[2]+c)|0;H[3]=(H[3]+d)|0;H[4]=(H[4]+e)|0;H[5]=(H[5]+f)|0;H[6]=(H[6]+g)|0;H[7]=(H[7]+h)|0;
  }
  return H.map(x=>((x>>>0).toString(16).padStart(8,'0'))).join('');
}
function wireCode(){
  const codebtn=$('codebtn'),codebox=$('codebox'),codeinput=$('codeinput'),codego=$('codego'),codemsg=$('codemsg');
  codebtn.addEventListener('click',()=>{const open=codebox.classList.toggle('open');codebtn.classList.toggle('active',open);if(open)setTimeout(()=>{try{codeinput.focus();}catch(e){}},60);});
  function submitCode(){
    const raw=normCode(codeinput.value);
    if(!raw){codemsg.className='codemsg err';codemsg.textContent=T.codeEmpty;return;}
    if(sha256hex(raw)===MASTER){
      grantAccess();
      codemsg.className='codemsg ok';codemsg.textContent=T.codeOk;codego.disabled=true;
      setTimeout(()=>{location.href='index.html';},800);
    }else{codemsg.className='codemsg err';codemsg.textContent=T.codeErr;codeinput.select();}
  }
  codego.addEventListener('click',submitCode);
  codeinput.addEventListener('keydown',e=>{if(e.key==='Enter'){e.preventDefault();submitCode();}});
}

/* ---------------- liste + lightbox ---------------- */
function renderList(){
  $('cnt').textContent=LOCS.length+' '+T.spots;
  const list=$('list');list.innerHTML='';
  LOCS.forEach((loc,i)=>{
    const el=document.createElement('div');el.className='loc';
    el.innerHTML=`
      <div class="lh">
        <span class="nm">${loc.name}</span>
        <a class="maps" href="${loc.map}" target="_blank" rel="noopener" aria-label="${T.maps}">${PIN}<span class="ar">›</span></a>
      </div>
      <div class="trip">${loc.photos.map((p,k)=>`<a class="ph" data-l="${i}" data-p="${k}" role="button" tabindex="0" aria-label="${loc.name} — foto ${k+1}"><img src="${p}" alt="${loc.name}" loading="lazy"></a>`).join('')}</div>`;
    list.appendChild(el);
  });
  wireLightbox(list);
}

function wireLightbox(list){
  const lb=$('lb'),lbtrack=$('lbtrack'),lbnm=$('lbnm'),lbdots=$('lbdots'),lbmap=$('lbmap'),lbprev=$('lbprev'),lbnext=$('lbnext');
  let curL=0,curP=0;
  function renderLB(){
    const loc=LOCS[curL];
    lbtrack.innerHTML=loc.photos.map(p=>`<div class="slide"><img src="${p}" alt="${loc.name}"></div>`).join('');
    lbnm.textContent=loc.name;
    lbmap.href=loc.map;lbmap.innerHTML=PIN+'<span>'+T.maps+'</span>';
    updateLB();
  }
  function updateLB(){
    lbtrack.style.transform=`translateX(-${curP*100}%)`;
    lbdots.innerHTML=LOCS[curL].photos.map((_,i)=>`<i class="${i===curP?'on':''}"></i>`).join('');
  }
  function openLB(l,p){curL=l;curP=p;renderLB();lb.classList.add('open');document.body.style.overflow='hidden';}
  function closeLB(){lb.classList.remove('open');document.body.style.overflow='';}
  function stepLB(d){const n=LOCS[curL].photos.length;curP=(curP+d+n)%n;updateLB();}  /* sonsuz döngü */
  list.addEventListener('click',e=>{const t=e.target.closest('.ph');if(!t)return;e.preventDefault();openLB(+t.dataset.l,+t.dataset.p);});
  list.addEventListener('keydown',e=>{const t=e.target.closest('.ph');if(t&&(e.key==='Enter'||e.key===' ')){e.preventDefault();openLB(+t.dataset.l,+t.dataset.p);}});
  lbprev.onclick=()=>stepLB(-1);lbnext.onclick=()=>stepLB(1);
  $('lbx').onclick=closeLB;
  lb.addEventListener('click',e=>{if(e.target===lb||e.target.classList.contains('stage'))closeLB();});
  document.addEventListener('keydown',e=>{if(!lb.classList.contains('open'))return;if(e.key==='Escape')closeLB();else if(e.key==='ArrowRight')stepLB(1);else if(e.key==='ArrowLeft')stepLB(-1);});
  let sx=null,sy=null;
  lb.addEventListener('touchstart',e=>{sx=e.touches[0].clientX;sy=e.touches[0].clientY;},{passive:true});
  lb.addEventListener('touchend',e=>{if(sx===null)return;const dx=e.changedTouches[0].clientX-sx,dy=e.changedTouches[0].clientY-sy;if(Math.abs(dx)>40&&Math.abs(dx)>Math.abs(dy))stepLB(dx<0?1:-1);else if(dy>70&&Math.abs(dy)>Math.abs(dx))closeLB();sx=sy=null;});
}

/* ---------------- başlat ---------------- */
buildCTA();
$('cnt').textContent=T.empty;
fetch('data/'+IL.slug+'.json',{cache:'no-cache'})
  .then(r=>{if(!r.ok)throw 0;return r.json();})
  .then(d=>{
    if(d&&d.name){document.title=d.name+' — TR81';const h=document.querySelector('.intro h1');if(h)h.textContent=d.name;}
    LOCS=(d&&d.locations)||[];
    renderList();
  })
  .catch(()=>{$('cnt').textContent=T.fail;});
})();
