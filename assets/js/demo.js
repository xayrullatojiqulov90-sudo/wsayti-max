/* =========================================================
   WASYT — Demo-access wizard (10 steps)
   ========================================================= */
(function(){
  'use strict';

  var ICON = {
    person:'<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><rect x="3" y="4.5" width="18" height="15" rx="2.5"/><circle cx="9" cy="10.5" r="2.3"/><path d="M5.5 16.3a3.6 3.6 0 0 1 7 0"/><line x1="15" y1="9.5" x2="18.5" y2="9.5"/><line x1="15" y1="13.5" x2="18.5" y2="13.5"/></svg>',
    company:'<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M4 21V5a1 1 0 0 1 1-1h7a1 1 0 0 1 1 1v16"/><path d="M13 9h5a1 1 0 0 1 1 1v11"/><path d="M2.5 21h19"/><line x1="7" y1="8" x2="7.01" y2="8"/><line x1="10" y1="8" x2="10.01" y2="8"/><line x1="7" y1="12" x2="7.01" y2="12"/><line x1="10" y1="12" x2="10.01" y2="12"/><line x1="7" y1="16" x2="7.01" y2="16"/><line x1="10" y1="16" x2="10.01" y2="16"/><line x1="16" y1="13" x2="16.01" y2="13"/><line x1="16" y1="17" x2="16.01" y2="17"/></svg>',
    grocery:'<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M6 2L3 6v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2V6l-3-4z"/><line x1="3" y1="6" x2="21" y2="6"/><path d="M16 10a4 4 0 0 1-8 0"/></svg>',
    clothes:'<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M20.38 3.46L16 2a4 4 0 0 1-8 0L3.62 3.46a2 2 0 0 0-1.34 2.23l.58 3.47a1 1 0 0 0 .99.84H6v10a2 2 0 0 0 2 2h8a2 2 0 0 0 2-2V10h2.15a1 1 0 0 0 .99-.84l.58-3.47a2 2 0 0 0-1.34-2.23z"/></svg>',
    pharma:'<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M10.5 20.5L3.5 13.5a5 5 0 0 1 7-7l1 1 1-1a5 5 0 0 1 7 7l-7 7a1 1 0 0 1-1.5 0z"/><line x1="8" y1="11" x2="16" y2="11"/><line x1="12" y1="7" x2="12" y2="15"/></svg>',
    tech:'<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><rect x="2" y="3" width="20" height="14" rx="2"/><line x1="8" y1="21" x2="16" y2="21"/><line x1="12" y1="17" x2="12" y2="21"/></svg>',
    cafe:'<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M18 8h1a4 4 0 0 1 0 8h-1"/><path d="M2 8h16v9a4 4 0 0 1-4 4H6a4 4 0 0 1-4-4z"/><line x1="6" y1="1" x2="6" y2="4"/><line x1="10" y1="1" x2="10" y2="4"/><line x1="14" y1="1" x2="14" y2="4"/></svg>',
    dots:'<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><circle cx="5" cy="12" r="1.6"/><circle cx="12" cy="12" r="1.6"/><circle cx="19" cy="12" r="1.6"/></svg>',
    shoes:'<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M2 7v7a2 2 0 0 0 2 2h15a3 3 0 0 0 3-3c0-1.3-.8-2.2-2-2.7L13 8l-1-3H4a2 2 0 0 0-2 2z"/><line x1="2" y1="11" x2="13" y2="11"/></svg>',
    build:'<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M14.7 6.3a4 4 0 0 0-5.6 5.6L3 18l3 3 6.1-6.1a4 4 0 0 0 5.6-5.6l-2.5 2.5-2.1-2.1z"/></svg>',
    accessories:'<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><circle cx="12" cy="13" r="6"/><polyline points="12 10 12 13 14 14"/><path d="M9 4.5L9.5 2h5l.5 2.5"/></svg>',
    home:'<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M3 9l9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z"/><polyline points="9 22 9 12 15 12 15 22"/></svg>',
    electronics:'<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><rect x="6" y="2" width="12" height="20" rx="2"/><line x1="10.5" y1="18" x2="13.5" y2="18"/></svg>',
    cosmetics:'<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M12 2l2.4 6.6L21 11l-6.6 2.4L12 20l-2.4-6.6L3 11l6.6-2.4z"/></svg>',
    other:'<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><circle cx="5" cy="12" r="1.8"/><circle cx="12" cy="12" r="1.8"/><circle cx="19" cy="12" r="1.8"/></svg>',
    branch:'<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linejoin="round" stroke-linecap="round"><path d="M3 9l1.5-5h15L21 9"/><path d="M3 9a2.5 2.5 0 0 0 5 0 2.5 2.5 0 0 0 5 0 2.5 2.5 0 0 0 5 0 2.5 2.5 0 0 0 3 0"/><path d="M4.5 11v9h15v-9"/><path d="M9.5 20v-5h5v5"/></svg>',
    cash:'<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linejoin="round" stroke-linecap="round"><path d="M4 21h16v-7H4z"/><path d="M5 14l1.4-5h11.2L19 14"/><rect x="8.5" y="4" width="7" height="5" rx="1"/><line x1="10.5" y1="6.5" x2="13.5" y2="6.5"/><line x1="7" y1="17.5" x2="9" y2="17.5"/></svg>',
    team:'<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"/><circle cx="9" cy="7" r="4"/><path d="M23 21v-2a4 4 0 0 0-3-3.87"/><path d="M16 3.13a4 4 0 0 1 0 7.75"/></svg>',
    cashpay:'<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><rect x="2" y="6" width="20" height="12" rx="2"/><circle cx="12" cy="12" r="2.5"/></svg>',
    card:'<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><rect x="1" y="4" width="22" height="16" rx="2"/><line x1="1" y1="10" x2="23" y2="10"/></svg>',
    qr:'<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><rect x="3" y="3" width="7" height="7"/><rect x="14" y="3" width="7" height="7"/><rect x="3" y="14" width="7" height="7"/><line x1="14" y1="14" x2="14" y2="14"/><line x1="21" y1="14" x2="21" y2="21"/><line x1="14" y1="21" x2="18" y2="21"/></svg>',
    installment:'<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><rect x="3" y="4" width="18" height="18" rx="2"/><line x1="16" y1="2" x2="16" y2="6"/><line x1="8" y1="2" x2="8" y2="6"/><line x1="3" y1="10" x2="21" y2="10"/></svg>',
    check:'<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="3"><polyline points="20 6 9 17 4 12"/></svg>',
    copy:'<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><rect x="9" y="9" width="13" height="13" rx="2"/><path d="M5 15H4a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2h9a2 2 0 0 1 2 2v1"/></svg>'
  };

  var TOTAL = 10;
  var state = {
    step:1, userType:null, consultant:'auto', sphere:null,
    branches:3, registers:2, employees:12,
    pays:{cash:true,card:true,qr:true,installment:false,uzcard:true,humo:true,visa:false,mastercard:false}, units:{pcs:true,kg:false,l:false,m:false,m2:false,other:false}
  };
  var dir = 'fwd';

  function pick(label,val,key,cur){
    return '<button type="button" class="opt'+(cur===val?' sel':'')+'" data-pick="'+key+'" data-val="'+val+'" aria-pressed="'+(cur===val)+'">'+
      '<div class="chk">'+ICON.check+'</div>'+label+'</button>';
  }

  function steps(){ return {
    1: function(){
      return '<div class="demo-step'+(dir==='back'?' back':'')+'">'+
        '<div class="demo-welcome">'+
          '<div class="demo-gift">'+
            '<span class="demo-gift-badge">Бесплатно</span>'+
            '<div class="demo-gift-clip">'+
              '<span class="demo-gift-shine"></span>'+
              '<div class="days">7<small>дней</small></div>'+
              '<span class="demo-gift-foot">полный доступ</span>'+
            '</div>'+
          '</div>'+
          '<div class="demo-welcome-txt"><div class="demo-ey">Демо-доступ</div><h2>Добро пожаловать в WASYT!</h2>'+
          '<p class="sub" style="margin-bottom:0">Получите полный доступ ко всем возможностям системы бесплатно на 7 дней.</p>'+
          '<ul class="demo-wlist">'+
            '<li><span class="tick">'+ICON.check+'</span>Все функции системы</li>'+
            '<li><span class="tick">'+ICON.check+'</span>Поддержка 24/7</li>'+
            '<li><span class="tick">'+ICON.check+'</span>Без банковской карты</li>'+
          '</ul><button type="button" class="demo-quick-request" id="demo-quick-request">Быстро оставить заявку</button>'+
          '<p class="demo-quick-note">Или настройте систему под свой бизнес за 10 шагов</p></div>'+
        '</div></div>';
    },
    2: function(){
      return '<div class="demo-step'+(dir==='back'?' back':'')+'"><div class="demo-ey">Шаг 2</div><h2>Выберите тип пользователя</h2>'+
        '<p class="sub">От этого зависит настройка возможностей системы</p>'+
        '<div class="demo-opts two usertype">'+
          '<button type="button" class="opt'+(state.userType==='person'?' sel':'')+'" data-pick="userType" data-val="person" aria-pressed="'+(state.userType==='person')+'"><div class="chk">'+ICON.check+'</div><div class="oic">'+ICON.person+'</div><b>Физическое лицо</b><span>Для частных предпринимателей и самозанятых</span></button>'+
          '<button type="button" class="opt'+(state.userType==='company'?' sel':'')+'" data-pick="userType" data-val="company" aria-pressed="'+(state.userType==='company')+'"><div class="chk">'+ICON.check+'</div><div class="oic">'+ICON.company+'</div><b>Юридическое лицо</b><span>Для компаний и организаций</span></button>'+
        '</div></div>';
    },
    3: function(){
      // [имя+фамилия, опыт работы, id, фото]. Фото пусто => показываем первую букву.
      var R=(window.__resources||{});
      var people=[
        ['Botirjon Tursunaliyev','Опыт работы 3 года','c4',R.consC4||''],
        ['Ulug\'bek Oyxojayev','Опыт работы 3 года','c5',R.consC5||''],
        ['Ruxsoraxon Abdurahmonova','Опыт работы 5 лет','c6',R.consC6||''],
        ['Nizomiddin Gulyamov','Опыт работы 5 лет','c7',R.consC7||''],
        ['Samandar Pulatov','Опыт работы 3 года','c8',R.consC8||'']
      ];
      var list=people.map(function(p){
        var ava = p[3]
          ? '<div class="cg-ava photo"><img src="'+p[3]+'" alt="'+p[0]+'" onerror="this.parentNode.classList.remove(\'photo\');this.replaceWith(document.createTextNode(\''+p[0][0]+'\'))"><i class="cg-online" title="Онлайн"></i></div>'
          : '<div class="cg-ava">'+p[0][0]+'<i class="cg-online" title="Онлайн"></i></div>';
        return '<button type="button" class="cperson'+(state.consultant===p[2]?' sel':'')+'" data-consult="'+p[2]+'" aria-pressed="'+(state.consultant===p[2])+'">'+ava+'<b>'+p[0]+'</b><span>'+p[1]+'</span></button>';
      }).join('');
      return '<div class="demo-step'+(dir==='back'?' back':'')+'"><div class="demo-ey">Шаг 3</div><h2>Выберите консультанта</h2>'+
        '<p class="sub">Ваш персональный консультант поможет на всех этапах</p>'+
        '<button type="button" class="consult'+(state.consultant==='auto'?' sel':'')+'" data-consult="auto" aria-pressed="'+(state.consultant==='auto')+'"><div class="ava">'+ICON.check+'</div><div class="cn"><b>Автоматически назначить консультанта</b><span>Мы подберём лучшего специалиста для вас</span></div><div class="radio"></div></button>'+
        '<p class="sub" style="margin:18px 0 8px">Или выберите самостоятельно</p>'+
        '<div class="consult-grid">'+list+'</div></div>';
    },
    4: function(){
      var sph=[['clothes','Магазин одежды'],['grocery','Продуктовый магазин'],['build','Строительный магазин'],['accessories','Магазин аксессуаров'],['home','Товары для дома'],['electronics','Магазин электроники'],['cosmetics','Магазин косметики'],['other','Другое']];
      var cells=sph.map(function(s){
        return '<button type="button" class="opt'+(state.sphere===s[0]?' sel':'')+'" data-pick="sphere" data-val="'+s[0]+'" aria-pressed="'+(state.sphere===s[0])+'"><div class="chk">'+ICON.check+'</div><div class="oic">'+ICON[s[0]]+'</div><b>'+s[1]+'</b></button>';
      }).join('');
      return '<div class="demo-step'+(dir==='back'?' back':'')+'"><div class="demo-ey">Шаг 4</div><h2>Выберите сферу деятельности</h2>'+
        '<p class="sub">Это поможет настроить систему под ваш бизнес</p>'+
        '<div class="demo-opts three">'+cells+'</div></div>';
    },
    5: function(){ return counter('Шаг 5','Количество филиалов','Укажите количество филиалов вашего бизнеса',ICON.branch,'branches'); },
    6: function(){ return counter('Шаг 6','Количество касс','Сколько касс используется в вашем бизнесе?',ICON.cash,'registers'); },
    7: function(){
      var t=empTier(state.employees);
      return '<div class="demo-step'+(dir==='back'?' back':'')+'"><div class="demo-ey">Шаг 7</div><h2>Количество сотрудников</h2>'+
        '<p class="sub">Сколько сотрудников работает в вашей компании?</p>'+
        '<div class="demo-slider">'+
          '<div class="emp-head"><div class="big" id="emp-val">'+state.employees+(state.employees>=100?'+':'')+'</div><span class="emp-unit">сотрудников</span></div>'+
          '<div class="emp-tier" id="emp-tier" data-t="'+t.k+'"><span class="dot"></span>'+t.label+'</div>'+
          '<div class="emp-figs" id="emp-figs">'+empFigs(state.employees)+'</div>'+
          '<input type="range" min="1" max="100" value="'+state.employees+'" id="emp-range" style="--fill:'+empPct(state.employees)+'%">'+
          '<div class="ends"><span>1</span><span>100+</span></div>'+
        '</div></div>';
    },
    8: function(){
      var pays=[['cash','Наличные',ICON.cashpay],['card','Банковская карта',ICON.card],['qr','QR оплата',ICON.qr],['installment','Рассрочка',ICON.installment]];
      var cells=pays.map(function(p){
        return '<button type="button" class="opt'+(state.pays[p[0]]?' sel':'')+'" data-toggle="pays" data-key="'+p[0]+'" aria-pressed="'+state.pays[p[0]]+'"><div class="chk">'+ICON.check+'</div><div class="oic">'+p[2]+'</div><b>'+p[1]+'</b></button>';
      }).join('');
      var cards=[['uzcard','UzCard'],['humo','HUMO'],['visa','VISA'],['mastercard','Mastercard']];
      var ccells=cards.map(function(p){
        return '<button type="button" class="opt paycard'+(state.pays[p[0]]?' sel':'')+'" data-toggle="pays" data-key="'+p[0]+'" aria-pressed="'+state.pays[p[0]]+'"><div class="chk">'+ICON.check+'</div><div class="oic">'+ICON.card+'</div><b>'+p[1]+'</b></button>';
      }).join('');
      return '<div class="demo-step'+(dir==='back'?' back':'')+'"><div class="demo-ey">Шаг 8</div><h2>Выберите типы оплат</h2>'+
        '<p class="sub">Какие способы оплаты вы принимаете?</p>'+
        '<div class="demo-opts two">'+cells+'</div>'+
        '<p class="sub" style="margin:18px 0 8px">Платёжные системы</p>'+
        '<div class="demo-opts four paycards">'+ccells+'</div></div>';
    },
    9: function(){
      var u=[['pcs','шт (штука)'],['kg','кг (килограмм)'],['l','л (литр)'],['m','м (метр)'],['m2','м² (кв. метр)'],['other','Другое']];
      var cells=u.map(function(x){
        return '<button type="button" class="opt'+(state.units[x[0]]?' sel':'')+'" data-toggle="units" data-key="'+x[0]+'" aria-pressed="'+state.units[x[0]]+'"><div class="chk">'+ICON.check+'</div><b>'+x[1]+'</b></button>';
      }).join('');
      return '<div class="demo-step'+(dir==='back'?' back':'')+'"><div class="demo-ey">Шаг 9</div><h2>Выберите единицы измерения</h2>'+
        '<p class="sub">Какие единицы измерения вы используете для товаров?</p>'+
        '<div class="demo-opts three">'+cells+'</div></div>';
    },
    10: function(){
      var rows=summaryRows();
      var html=rows.map(function(r){
        return '<div class="sum-row"><div class="sum-ic">'+r.icon+'</div>'+
          '<div class="sum-tx"><div class="sum-l">'+r.label+'</div><div class="sum-v">'+r.val+'</div></div></div>';
      }).join('');
      return '<div class="demo-step demo-summary'+(dir==='back'?' back':'')+'"><div class="demo-ey">Шаг 10</div><h2>Проверьте данные</h2>'+
        '<p class="sub">Вот что мы настроим для вашего бизнеса</p>'+
        '<div class="sum-list">'+html+'</div>'+
        '<button class="btn btn-primary demo-register" id="demo-register">Зарегистрироваться</button></div>';
    }
  };}

  // ---- step 10 summary helpers ----
  var SPHERE_L={clothes:'Магазин одежды',grocery:'Продуктовый магазин',build:'Строительный магазин',accessories:'Магазин аксессуаров',home:'Товары для дома',electronics:'Магазин электроники',cosmetics:'Магазин косметики',other:'Другое'};
  var PAY_L={cash:'Наличные',card:'Банковская карта',qr:'QR оплата',installment:'Рассрочка',uzcard:'UzCard',humo:'HUMO',visa:'VISA',mastercard:'Mastercard'};
  var UNIT_L={pcs:'шт',kg:'кг',l:'л',m:'м',m2:'м²',other:'Другое'};
  var CONSULT_L={c4:'Botirjon Tursunaliyev',c5:"Ulug'bek Oyxojayev",c6:'Ruxsoraxon Abdurahmonova',c7:'Nizomiddin Gulyamov',c8:'Samandar Pulatov'};
  function selList(grp,map){
    var v=Object.keys(map).filter(function(k){return state[grp][k];}).map(function(k){return map[k];});
    return v.length?v.join(', '):'—';
  }
  function summaryRows(){
    return [
      {icon:ICON.person,label:'Тип пользователя',val: state.userType==='company'?'Юридическое лицо':(state.userType==='person'?'Физическое лицо':'—')},
      {icon:ICON.team,label:'Консультант',val: state.consultant==='auto'?'Назначить автоматически':(CONSULT_L[state.consultant]||'—')},
      {icon:ICON[state.sphere]||ICON.clothes,label:'Сфера деятельности',val: SPHERE_L[state.sphere]||'—'},
      {icon:ICON.branch,label:'Филиалы',val: String(state.branches)},
      {icon:ICON.cash,label:'Кассы',val: String(state.registers)},
      {icon:ICON.team,label:'Сотрудники',val: state.employees+(state.employees>=100?'+':'')},
      {icon:ICON.card,label:'Типы оплат',val: selList('pays',PAY_L)},
      {icon:ICON.qr,label:'Единицы измерения',val: selList('units',UNIT_L)}
    ];
  }

  function empPct(n){ return Math.round((n-1)/99*100); }
  function empTier(n){
    if(n<=5) return {k:'micro',label:'Микробизнес'};
    if(n<=20) return {k:'small',label:'Малый бизнес'};
    if(n<=50) return {k:'mid',label:'Средний бизнес'};
    return {k:'large',label:'Крупный бизнес'};
  }
  function empFigs(n){
    var FIG='<svg viewBox="0 0 24 24" fill="currentColor"><circle cx="12" cy="7" r="3.4"/><path d="M5 21v-1.5a7 7 0 0 1 14 0V21z"/></svg>';
    var shown=Math.min(n,12), html='';
    for(var i=0;i<shown;i++){ html+='<span class="fig on">'+FIG+'</span>'; }
    for(var j=shown;j<12;j++){ html+='<span class="fig">'+FIG+'</span>'; }
    if(n>12) html+='<span class="fig more">+'+(n-12)+'</span>';
    return html;
  }

  var CNT_ICON = { branches:ICON.branch, registers:ICON.cash };
  function updateCounter(k){
    var el=document.getElementById('cnt-'+k);
    if(el){ el.textContent=state[k]; el.classList.remove('pop'); void el.offsetWidth; el.classList.add('pop'); }
    var pp=document.getElementById('pips-'+k);
    if(pp) pp.innerHTML=buildPips(CNT_ICON[k]||'',state[k]);
    var presets=document.querySelectorAll('[data-set="'+k+'"]');
    for(var i=0;i<presets.length;i++){ presets[i].classList.toggle('on', state[k]===parseInt(presets[i].getAttribute('data-v'),10)); }
  }
  function buildPips(icon,n){
    var shown=Math.min(n,8), html='';
    for(var i=0;i<shown;i++){ html+='<span class="pip" style="animation-delay:'+(i*40)+'ms">'+icon+'</span>'; }
    if(n>8) html+='<span class="pip more">+'+(n-8)+'</span>';
    return html;
  }
  function counter(ey,title,sub,icon,key){
    return '<div class="demo-step'+(dir==='back'?' back':'')+'"><div class="demo-ey">'+ey+'</div><h2>'+title+'</h2>'+
      '<p class="sub">'+sub+'</p>'+
      '<div class="demo-counter">'+
        '<div class="cic"><span class="cring"></span>'+icon+'</div>'+
        '<div class="pips" id="pips-'+key+'">'+buildPips(icon,state[key])+'</div>'+
        '<div class="ctrl"><button data-cnt="'+key+'" data-d="-1" aria-label="меньше">−</button><div class="val" id="cnt-'+key+'">'+state[key]+'</div><button data-cnt="'+key+'" data-d="1" aria-label="больше">+</button></div>'+
        '<div class="presets">'+[1,3,5,10].map(function(v){return '<button class="preset'+(state[key]===v?' on':'')+'" data-set="'+key+'" data-v="'+v+'">'+v+'</button>';}).join('')+'</div>'+
        '<p class="sub" style="margin:0">Вы всегда сможете изменить это позже</p>'+
      '</div></div>';
  }

  // ---- build modal ----
  var DEMO_LOGO = (window.__resources && window.__resources.demoLogo) || 'assets/img/wasyt-logo-dark.png';
  var modal = document.createElement('div');
  modal.className = 'demo-modal'; modal.id = 'demo-modal';
  modal.innerHTML =
    '<div class="demo-bg" data-demo-close></div>'+
    '<div class="demo-card">'+
      '<div class="demo-top">'+
        '<span class="brand"><img class="logo" src="'+DEMO_LOGO+'" alt="WASYT" style="height:26px"></span>'+
        '<div class="demo-dots" id="demo-dots"></div>'+
        '<button class="demo-x" data-demo-close aria-label="Закрыть"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/></svg></button>'+
      '</div>'+
      '<div class="demo-progress"><span id="demo-bar"></span></div>'+
      '<div class="demo-body" id="demo-body"></div>'+
      '<div class="demo-foot">'+
        '<button class="btn btn-ghost btn-sm" id="demo-back">Назад</button>'+
        '<span class="demo-step-n" id="demo-stepn"></span>'+
        '<button class="btn btn-primary btn-sm" id="demo-next">Далее</button>'+
      '</div>'+
      '<div class="reg-overlay" id="reg-overlay">'+
        '<div class="reg-bg" data-reg-close></div>'+
        '<div class="reg-box">'+
          '<button class="reg-x" data-reg-close aria-label="Закрыть"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/></svg></button>'+
          '<div class="demo-ey">Заявка</div>'+
          '<h3>Оставьте свои данные</h3>'+
          '<p class="sub">Менеджер свяжется с вами и активирует демо-доступ</p>'+
          '<label class="reg-field"><span>ФИО<i>*</i></span><input type="text" id="reg-name" placeholder="Иванов Иван Иванович" autocomplete="name"></label>'+
          '<label class="reg-field"><span>Контактный номер телефона<i>*</i></span><input type="tel" id="reg-phone" placeholder="+998 90 123 45 67" autocomplete="tel"></label>'+
          '<button class="btn btn-primary reg-submit" id="reg-submit" disabled>Отправить заявку</button>'+
          '<p class="reg-status form-status" id="reg-status" role="status" aria-live="polite"></p>'+
        '</div>'+
      '</div>'+
    '</div>';
  document.body.appendChild(modal);

  var body = modal.querySelector('#demo-body');
  var dots = modal.querySelector('#demo-dots');
  var bar  = modal.querySelector('#demo-bar');
  var progress = modal.querySelector('.demo-progress');
  var backBtn = modal.querySelector('#demo-back');
  var nextBtn = modal.querySelector('#demo-next');
  var stepN = modal.querySelector('#demo-stepn');

  for(var i=0;i<TOTAL;i++){ var d=document.createElement('i'); dots.appendChild(d); }

  function valid(){
    if(state.step===2) return !!state.userType;
    if(state.step===4) return !!state.sphere;
    if(state.step===8) return Object.keys(state.pays).some(function(k){return state.pays[k];});
    if(state.step===9) return Object.keys(state.units).some(function(k){return state.units[k];});
    return true;
  }

  function render(){
    body.innerHTML = steps()[state.step]();
    // dots
    dots.querySelectorAll('i').forEach(function(d,idx){
      d.classList.toggle('on', idx===state.step-1);
      d.classList.toggle('done', idx<state.step-1);
    });
    bar.style.width = (state.step/TOTAL*100)+'%';
    if(progress){
      progress.setAttribute('role', 'progressbar');
      progress.setAttribute('aria-valuemin', '1');
      progress.setAttribute('aria-valuemax', String(TOTAL));
      progress.setAttribute('aria-valuenow', String(state.step));
      progress.setAttribute('aria-label', 'Шаг настройки');
    }
    stepN.textContent = state.step+' / '+TOTAL;
    backBtn.style.visibility = state.step===1 ? 'hidden' : 'visible';
    nextBtn.textContent = state.step===1 ? 'Начать бесплатно' : (state.step===10 ? 'Перейти в систему' : 'Далее');
    nextBtn.style.display = state.step===10 ? 'none' : '';
    nextBtn.disabled = !valid();
    nextBtn.style.opacity = valid() ? '1' : '.5';
  }

  function go(n){
    dir = n>state.step ? 'fwd' : 'back';
    state.step = Math.max(1, Math.min(TOTAL, n));
    render();
    body.scrollTop = 0;   // only reset scroll on step navigation, not on in-step toggles
  }

  // ---- events ----
  body.addEventListener('click', function(e){
    var p = e.target.closest('[data-pick]');
    if(p){ state[p.getAttribute('data-pick')] = p.getAttribute('data-val'); render(); return; }
    var c = e.target.closest('[data-consult]');
    if(c){ state.consultant = c.getAttribute('data-consult'); render(); return; }
    var t = e.target.closest('[data-toggle]');
    if(t){ var grp=t.getAttribute('data-toggle'), key=t.getAttribute('data-key'); state[grp][key]=!state[grp][key]; render(); return; }
    var cn = e.target.closest('[data-cnt]');
    if(cn){ var k=cn.getAttribute('data-cnt'); var dd=parseInt(cn.getAttribute('data-d'),10);
      state[k]=Math.max(1, state[k]+dd); updateCounter(k);
      nextBtn.disabled=!valid(); return; }
    var st = e.target.closest('[data-set]');
    if(st){ var sk=st.getAttribute('data-set'); state[sk]=parseInt(st.getAttribute('data-v'),10); updateCounter(sk);
      nextBtn.disabled=!valid(); return; }
    var cp = e.target.closest('[data-copy]');
    if(cp){ var src=document.getElementById(cp.getAttribute('data-copy')); if(src){ navigator.clipboard&&navigator.clipboard.writeText(src.textContent); cp.innerHTML=ICON.check; setTimeout(function(){cp.innerHTML=ICON.copy;},1400);} return; }
    if(e.target.closest('#demo-register')){ openReg(); return; }
    if(e.target.closest('#demo-quick-request')){ openReg(); return; }
  });

  // ---- registration overlay ----
  var regOverlay = modal.querySelector('#reg-overlay');
  var regName = modal.querySelector('#reg-name');
  var regPhone = modal.querySelector('#reg-phone');
  var regSubmit = modal.querySelector('#reg-submit');
  var regStatus = modal.querySelector('#reg-status');
  function regValid(){
    return regName.value.trim().length>=3 && regPhone.value.replace(/\D/g,'').length>=9;
  }
  function refreshReg(){
    var ok=regValid();
    regSubmit.disabled=!ok;
    regSubmit.style.opacity=ok?'1':'.5';
    [[regName, regName.value.trim().length >= 3, 'Введите не менее 3 символов'],
     [regPhone, regPhone.value.replace(/\D/g,'').length >= 9, 'Введите корректный номер телефона']].forEach(function(row){
      var input = row[0];
      var error = input.parentNode.querySelector('.reg-error');
      var touched = input.dataset.touched === 'true';
      input.setAttribute('aria-invalid', touched && !row[1] ? 'true' : 'false');
      if(touched && !row[1]){
        if(!error){
          error = document.createElement('small');
          error.className = 'reg-error';
          error.id = input.id + '-error';
          input.parentNode.appendChild(error);
        }
        error.textContent = row[2];
        input.setAttribute('aria-describedby', error.id);
      } else if(error){
        error.remove();
        input.removeAttribute('aria-describedby');
      }
    });
  }
  function openReg(){ regOverlay.classList.add('open'); if(regStatus) regStatus.textContent=''; setTimeout(function(){ regName.focus(); },220); }
  function closeReg(){
    regOverlay.classList.remove('open');
    var returnFocus = modal.querySelector('#demo-register');
    if(returnFocus) returnFocus.focus();
  }
  regOverlay.querySelectorAll('[data-reg-close]').forEach(function(b){ b.addEventListener('click', closeReg); });
  [regName,regPhone].forEach(function(inp){
    inp.addEventListener('input', function(){
      inp.dataset.touched = 'true';
      if(regStatus) regStatus.textContent = '';
      refreshReg();
    });
    inp.addEventListener('blur', function(){ inp.dataset.touched = 'true'; refreshReg(); });
  });
  regSubmit.addEventListener('click', function(){
    if(!regValid()) return;
    var nm = regName.value.trim(), ph = regPhone.value.trim();
    var fields = [ {label:'ФИО', value:nm}, {label:'Телефон', value:ph} ];
    try{ summaryRows().forEach(function(r){ fields.push({ label:r.label, value:r.val }); }); }catch(_){}
    regSubmit.disabled = true;
    regSubmit.textContent = 'Отправка…';
    if(regStatus) regStatus.textContent = '';
    var request = window.WASYT_SEND_LEAD
      ? window.WASYT_SEND_LEAD({ kind:'demo', fields:fields })
      : Promise.resolve({ ok:false });
    request.then(function(res){
      if(res && res.ok){
        closeReg(); close();
        window.toastDemo&&window.toastDemo('Заявка отправлена! Менеджер свяжется с вами в ближайшее время.');
        regName.value=''; regPhone.value='';
        delete regName.dataset.touched;
        delete regPhone.dataset.touched;
        refreshReg();
      } else if(regStatus){
        regStatus.textContent = 'Не удалось отправить заявку. Данные сохранены — попробуйте ещё раз или позвоните нам.';
      }
    }).catch(function(){
      if(regStatus) regStatus.textContent = 'Нет соединения с сервером. Данные сохранены — попробуйте ещё раз.';
    }).then(function(){
      if(regOverlay.classList.contains('open')){
        regSubmit.textContent = 'Отправить заявку';
        refreshReg();
      }
    });
  });

  body.addEventListener('input', function(e){
    if(e.target.id==='emp-range'){
      state.employees=parseInt(e.target.value,10);
      var v=document.getElementById('emp-val'); if(v) v.textContent=state.employees+(state.employees>=100?'+':'');
      e.target.style.setProperty('--fill', empPct(state.employees)+'%');
      var figs=document.getElementById('emp-figs'); if(figs) figs.innerHTML=empFigs(state.employees);
      var tier=document.getElementById('emp-tier'); if(tier){ var t=empTier(state.employees); tier.setAttribute('data-t',t.k); tier.innerHTML='<span class="dot"></span>'+t.label; }
    }
  });

  nextBtn.addEventListener('click', function(){
    if(!valid()) return;
    if(state.step===TOTAL){ close(); window.toastDemo&&window.toastDemo('Добро пожаловать в WASYT! Демо-доступ активен на 7 дней.'); return; }
    go(state.step+1);
  });
  backBtn.addEventListener('click', function(){ go(state.step-1); });

  function open(){ render(); modal.classList.add('open'); document.body.style.overflow='hidden'; }
  function close(){ modal.classList.remove('open'); document.body.style.overflow=''; }
  modal.querySelectorAll('[data-demo-close]').forEach(function(b){ b.addEventListener('click', close); });
  document.addEventListener('keydown', function(e){ if(e.key==='Escape' && modal.classList.contains('open')){ if(regOverlay.classList.contains('open')){ closeReg(); } else { close(); } } });
  document.addEventListener('click', function(e){ if(e.target.closest('[data-open-demo]')){ e.preventDefault(); open(); } });

  // expose a tiny toast that reuses site toast if present
  window.toastDemo = function(msg){
    var t=document.getElementById('toast');
    if(!t){ alert(msg); return; }
    t.querySelector('.txt').textContent=msg; t.classList.add('show');
    clearTimeout(t._t); t._t=setTimeout(function(){t.classList.remove('show');},4500);
  };
})();
