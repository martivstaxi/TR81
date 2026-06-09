/* TR81 — paylaşılan i18n (yalnızca İngilizce + Türkçe). Tüm sayfalar bu dosyayı YÜKLER, sonra window.I18N.t / .lang kullanır.
   Cihaz dili Türkçe ise 'tr', değilse 'en'. */
window.I18N=(function(){
const REG={
  en:{medit:'Mediterranean',marmara:'Marmara',aegean:'Aegean',black:'Black Sea',central:'Central Anatolia',east:'Eastern Anatolia',southeast:'Southeastern Anatolia'},
  tr:{medit:'Akdeniz',marmara:'Marmara',aegean:'Ege',black:'Karadeniz',central:'İç Anadolu',east:'Doğu Anadolu',southeast:'Güneydoğu Anadolu'}
};
const D={
en:{h1:'Discover<br>Türkiye',tag:'Scenic locations across 81 provinces.',scroll:'Scroll ↓',trend:'Trending',trendsub:'The most-visited places.',regions:'Regions',search:'Search a province…',swipe:'Swipe',
  tap:'Open',freeTap:'Free',lockedTap:'Buy',unlockBtn:'Buy',ownTxt:'Owned',explore:'Explore',pwBuy:'Unlock all 81',pwTry:'Explore Muğla now',pwLocked:'locked',
  haveCode:'Unlock',codePh:'Enter your code',codeGo:'Unlock',codeOk:'Unlocked!',codeOkSub:'Taking you in…',codeErr:'That code is not valid.',codeEmpty:'Enter your code.',
  codeDeliver:'Your code is sent with your Shopier purchase.',codeHelp:'Questions?',
  maps:'Directions',spots:'scenic spots to explore',fullH:'Next stop: the world',fullP:'You’ve explored Türkiye. Now every location in the world awaits.',fullB:'All World Locations',
  demoH:'So many places to explore',demoP:'Every one of the 81 provinces has special spots waiting. Unlock them all.',demoB:'All 81',empty:'Loading…',fail:'Could not load locations.'},
tr:{h1:'Türkiye<span class="sfx">’yi</span><br>Keşfet',tag:'81 ilin manzaralı konumları.',scroll:'Kaydır ↓',trend:'Popüler',trendsub:'En çok ziyaret edilen yerler.',regions:'Bölgeler',search:'İl ara…',swipe:'Kaydır',
  tap:'Aç',freeTap:'Ücretsiz',lockedTap:'Satın al',unlockBtn:'Satın Al',ownTxt:'Açık',explore:'Keşfet',pwBuy:'81 İl Kilidini Aç',pwTry:'Muğla konumlarına şimdi eriş',pwLocked:'kilitli',
  haveCode:'Kilidi Aç',codePh:'Kodunu gir',codeGo:'Aç',codeOk:'Açıldı!',codeOkSub:'Yönlendiriliyorsun…',codeErr:'Bu kod geçersiz.',codeEmpty:'Lütfen kodunu gir.',
  codeDeliver:'Kodun, Shopier siparişinle birlikte iletilir.',codeHelp:'Soruların için',
  maps:'Konum',spots:'manzaralı yerin konumları',fullH:'Sıradaki durak: dünya',fullP:'Türkiye’yi keşfettin. Şimdi tüm dünyanın konumları seni bekliyor.',fullB:'Tüm Dünya Konumları',
  demoH:'Gezilecek o kadar çok yer var ki',demoP:'81 ilin her birinde keşfedilmeyi bekleyen özel konumlar var. Hepsinin kilidini aç.',demoB:'81 İL',empty:'Yükleniyor…',fail:'Konumlar yüklenemedi.'}
};
function pick(){
  const b=(navigator.language||navigator.userLanguage||'en').toLowerCase();
  return b.startsWith('tr')?'tr':'en';
}
const lang=pick();
const t=Object.assign({},D.en,D[lang]||{});
t.names=REG[lang]||REG.en;
try{document.documentElement.lang=lang;}catch(e){}
return {lang:lang,t:t,rtl:false};
})();
