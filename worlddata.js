/* TR81 — world.html tasarım denemeleri için paylaşılan veri + yardımcılar.
   Sadece EN + TR. Cihaz dili 'tr' ile başlıyorsa Türkçe, değilse İngilizce.
   Her ülke: [iso, slug, continent]. continent: eu|as|me|am|af|oc */
window.WORLD = (function () {
  const COUNTRIES = [
    ['tr','turkiye','eu'],['us','unitedstates','am'],['fr','france','eu'],['es','spain','eu'],['it','italy','eu'],
    ['mx','mexico','am'],['gb','unitedkingdom','eu'],['de','germany','eu'],['gr','greece','eu'],['at','austria','eu'],
    ['jp','japan','as'],['my','malaysia','as'],['th','thailand','as'],['sa','saudiarabia','me'],['ae','unitedarabemirates','me'],
    ['pt','portugal','eu'],['cn','china','as'],['hr','croatia','eu'],['pl','poland','eu'],['nl','netherlands','eu'],
    ['hu','hungary','eu'],['bh','bahrain','me'],['ca','canada','am'],['kr','southkorea','as'],['ma','morocco','af'],
    ['vn','vietnam','as'],['cz','czechrepublic','eu'],['sg','singapore','as'],['ro','romania','eu'],['id','indonesia','as'],
    ['eg','egypt','af'],['dk','denmark','eu'],['ch','switzerland','eu'],['be','belgium','eu'],['al','albania','eu'],
    ['kz','kazakhstan','as'],['do','dominicanrepublic','am'],['se','sweden','eu'],['ie','ireland','eu'],['ph','philippines','as'],
    ['in','india','as'],['bs','bahamas','am'],['au','australia','oc'],['bg','bulgaria','eu'],['tw','taiwan','as'],
    ['br','brazil','am'],['tn','tunisia','af'],['ru','russia','eu'],['uz','uzbekistan','as'],['ar','argentina','am'],
    ['qa','qatar','me'],['co','colombia','am'],['za','southafrica','af'],['no','norway','eu'],['nz','newzealand','oc'],
    ['pe','peru','am'],['md','moldova','eu'],['sk','slovakia','eu'],['kh','cambodia','as'],['ad','andorra','eu'],
    ['ge','georgia','eu'],['jo','jordan','me'],['si','slovenia','eu'],['rs','serbia','eu'],['jm','jamaica','am'],
    ['om','oman','me'],['cy','cyprus','eu'],['uy','uruguay','am'],['cl','chile','am'],['hk','hongkong','as'],
    ['mo','macau','as'],['la','laos','as'],['sv','elsalvador','am'],['dz','algeria','af'],['il','israel','me'],
    ['kw','kuwait','me'],['mt','malta','eu'],['kg','kyrgyzstan','as'],['lb','lebanon','me'],['pk','pakistan','as'],
    ['fi','finland','eu'],['pa','panama','am'],['me','montenegro','eu'],['pr','puertorico','am'],['cr','costarica','am'],
    ['cu','cuba','am'],['az','azerbaijan','as'],['ke','kenya','af'],['am','armenia','as'],['is','iceland','eu'],
    ['zm','zambia','af'],['lk','srilanka','as'],['mv','maldives','as'],['mz','mozambique','af'],['tz','tanzania','af'],
    ['sm','sanmarino','eu'],['gt','guatemala','am'],['ee','estonia','eu'],['zw','zimbabwe','af'],['bo','bolivia','am'],
    ['lu','luxembourg','eu'],['ec','ecuador','am'],['aw','aruba','am'],['rw','rwanda','af'],['lv','latvia','eu'],
    ['sn','senegal','af'],['ug','uganda','af'],['tj','tajikistan','as'],['mu','mauritius','af'],['mm','myanmar','as'],
    ['ve','venezuela','am'],['ni','nicaragua','am'],['ng','nigeria','af'],['ba','bosniaandherzegovina','eu'],['et','ethiopia','af'],
    ['np','nepal','as'],['ls','lesotho','af'],['gh','ghana','af'],['lt','lithuania','eu'],['xk','kosovo','eu'],
    ['cd','drcongo','af'],['mn','mongolia','as'],['ir','iran','me'],['bd','bangladesh','as'],['sd','sudan','af'],
    ['iq','iraq','me'],['af','afghanistan','as'],['ao','angola','af'],['ua','ukraine','eu'],['ye','yemen','me'],
    ['mg','madagascar','af'],['ci','ivorycoast','af'],['cm','cameroon','af'],['ne','niger','af'],['ml','mali','af'],
    ['bf','burkinafaso','af'],['mw','malawi','af'],['td','chad','af'],['so','somalia','af'],['bj','benin','af'],
    ['gn','guinea','af'],['bi','burundi','af'],['ss','southsudan','af'],['ht','haiti','am'],['hn','honduras','am'],
    ['pg','papuanewguinea','oc'],['tg','togo','af'],['sl','sierraleone','af'],['by','belarus','eu'],['py','paraguay','am']
  ];

  /* öne çıkan / popüler (search-first ve spotlight tasarımları için) */
  const POPULAR = ['tr','us','fr','it','jp','es','gb','de','gr','ae','th','nl'];

  /* serbest (ücretsiz) ülke — Türkiye */
  const FREE = 'turkiye';

  const CONT = {
    en:{eu:'Europe',as:'Asia',me:'Middle East',am:'Americas',af:'Africa',oc:'Oceania'},
    tr:{eu:'Avrupa',as:'Asya',me:'Orta Doğu',am:'Amerika',af:'Afrika',oc:'Okyanusya'}
  };
  const CONT_ORDER = ['eu','as','me','am','af','oc'];

  const STR = {
    en:{kick:'The World',title:'Explore the World',sub:'Beautiful places in 150 countries',
        search:'Search a country…',count:'150 countries',free:'Free',back:'Back',
        popular:'Popular',all:'All countries',spotlight:'In the spotlight',open:'Open',
        empty:'No countries found.'},
    tr:{kick:'Dünya',title:'Dünyayı Keşfet',sub:'150 ülkede güzel yerler',
        search:'Ülke ara…',count:'150 ülke',free:'Ücretsiz',back:'Geri',
        popular:'Popüler',all:'Tüm ülkeler',spotlight:'Öne çıkan',open:'Aç',
        empty:'Ülke bulunamadı.'}
  };

  const lang = (navigator.language || 'en').toLowerCase().startsWith('tr') ? 'tr' : 'en';
  try { document.documentElement.lang = lang; } catch (e) {}

  const customNames = { xk:{ tr:'Kosova', en:'Kosovo' }, cd:{ tr:'Demokratik Kongo', en:'DR Congo' } };

  function name(iso) {
    if (customNames[iso] && customNames[iso][lang]) return customNames[iso][lang];
    try {
      const dn = new Intl.DisplayNames([lang], { type: 'region' });
      return dn.of(iso.toUpperCase()) || iso.toUpperCase();
    } catch (e) { return iso.toUpperCase(); }
  }

  /* emoji bayrak (fallback) */
  const emoji = iso => String.fromCodePoint(...[...iso.toUpperCase()].map(c => 0x1F1E6 + c.charCodeAt(0) - 65));
  const flagUrl = iso => `https://flagcdn.com/w160/${iso.toLowerCase()}.png`;

  /* arama normalize (TR/aksan duyarsız) */
  const norm = t => (t || '').toLowerCase().replace(/[çğıöşüáàäâéèëêíìïîóòôúùûñ]/g, ch => ({
    ç:'c',ğ:'g',ı:'i',ö:'o',ş:'s',ü:'u',á:'a',à:'a',ä:'a',â:'a',é:'e',è:'e',ë:'e',ê:'e',
    í:'i',ì:'i',ï:'i',î:'i',ó:'o',ò:'o',ô:'o',ú:'u',ù:'u',û:'u',ñ:'n'
  }[ch]) || ch);

  /* link hedefi */
  const href = slug => `${slug}.html`;

  /* her ülke için zenginleştirilmiş kayıt */
  const list = COUNTRIES.map(([iso, slug, cont]) => ({
    iso, slug, cont, name: name(iso), emoji: emoji(iso), flag: flagUrl(iso),
    free: slug === FREE, popular: POPULAR.includes(iso), href: href(slug)
  }));

  return { lang, t: STR[lang], list, cont: CONT[lang], contOrder: CONT_ORDER,
           popular: POPULAR, free: FREE, norm, emoji, flagUrl };
})();
