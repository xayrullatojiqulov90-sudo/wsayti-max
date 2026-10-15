/* =========================================================
   WASYT — shared interactions
   ========================================================= */
(function(){
  'use strict';

  /* ---- persisted color theme ---- */
  (function(){
    var root = document.documentElement;
    var navRight = document.querySelector('.nav-right');
    var mobileMenu = document.querySelector('.mobile-menu');
    function makeToggle(className){
      var button = document.createElement('button');
      button.type = 'button';
      button.className = 'theme-toggle ' + className;
      button.setAttribute('aria-label', 'Переключить тему');
      button.setAttribute('title', 'Переключить тему');
      button.addEventListener('click', function(){
        var next = root.getAttribute('data-theme') === 'dark' ? 'light' : 'dark';
        root.setAttribute('data-theme', next);
        try{ localStorage.setItem('wasyt-theme', next); }catch(_){}
        document.querySelectorAll('.theme-toggle').forEach(function(toggle){
          toggle.textContent = next === 'dark' ? '☀' : '☾';
          toggle.setAttribute('aria-pressed', next === 'dark' ? 'true' : 'false');
        });
      });
      return button;
    }
    var current = root.getAttribute('data-theme') || 'light';
    if(navRight){
      var desktopToggle = makeToggle('theme-toggle--desktop');
      desktopToggle.textContent = current === 'dark' ? '☀' : '☾';
      desktopToggle.setAttribute('aria-pressed', current === 'dark' ? 'true' : 'false');
      navRight.insertBefore(desktopToggle, navRight.querySelector('.burger'));
    }
    if(mobileMenu){
      var mobileToggle = makeToggle('theme-toggle--mobile');
      mobileToggle.textContent = current === 'dark' ? '☀' : '☾';
      mobileToggle.setAttribute('aria-pressed', current === 'dark' ? 'true' : 'false');
      mobileMenu.insertBefore(mobileToggle, mobileMenu.firstChild);
    }
  })();

  document.querySelectorAll('.socials a[href="#"], .foot-list a[href="#"]').forEach(function(link){
    link.setAttribute('aria-disabled', 'true');
    link.setAttribute('title', 'Ссылка временно недоступна');
    link.addEventListener('click', function(event){ event.preventDefault(); });
  });

  /* ============================================================
     LEAD DELIVERY → Telegram backend (/api/lead)
     ============================================================ */
  window.WASYT_SEND_LEAD = function(payload){
    payload = payload || {};
    try{
      payload.page = (location.pathname.split('/').pop() || 'index.html');
      payload.lang = (window.WASYT_LANG ? window.WASYT_LANG() : 'ru');
    }catch(_){}
    return fetch('/api/lead', {
      method:'POST',
      headers:{ 'Content-Type':'application/json' },
      body: JSON.stringify(payload)
    }).then(function(r){
      return r.json().then(function(data){
        return { ok: r.ok && !!(data && data.ok), error: data && data.error };
      }).catch(function(){ return { ok:false, error:'invalid-response' }; });
    });
  };

  // collect label/value pairs from a .field-based form
  function leadFields(form){
    var fields = [];
    form.querySelectorAll('.field').forEach(function(field){
      var input = field.querySelector('input, select, textarea');
      if(!input) return;
      var val = (input.value || '').trim();
      if(!val) return;
      var label = field.querySelector('label');
      var name = label
        ? label.textContent.replace(/\*/g, '').replace(/\s+/g, ' ').trim()
        : (input.getAttribute('name') || input.getAttribute('placeholder') || 'Поле');
      fields.push({ label:name, value:val });
    });
    return fields;
  }

  /* ---- sticky header shadow ---- */
  var header = document.querySelector('.site-header');
  function onScroll(){
    if(!header) return;
    header.classList.toggle('scrolled', window.scrollY > 8);
  }
  window.addEventListener('scroll', onScroll, {passive:true});
  onScroll();

  /* ---- mobile menu ---- */
  var burger = document.querySelector('.burger');
  var mmenu  = document.querySelector('.mobile-menu');
  if(burger && mmenu){
    burger.addEventListener('click', function(){
      mmenu.classList.toggle('open');
      document.body.style.overflow = mmenu.classList.contains('open') ? 'hidden' : '';
    });
    mmenu.querySelectorAll('a,[data-open-demo],.m-close').forEach(function(a){
      a.addEventListener('click', function(){
        mmenu.classList.remove('open');
        document.body.style.overflow = '';
      });
    });
  }

  /* ============================================================
     LANGUAGE SWITCHER + LIVE TRANSLATION ENGINE
     Translates RU → UZ / EN across static and dynamically
     generated DOM, including content injected after load.
     ============================================================ */
  var I18N = (window.WASYT_I18N && window.WASYT_I18N.dict) || {};
  var curLang = 'ru';
  var hasCyr = /[А-Яа-яЁё]/;

  function lookup(ru){
    var e = I18N[ru];
    if(!e) return null;
    if(curLang === 'uz') return e[0];
    if(curLang === 'en') return e[1];
    return null;
  }

  // should this element (or its ancestors) be skipped?
  function i18nSkip(el){
    while(el && el.nodeType === 1 && el !== document.body){
      var tag = el.tagName;
      if(tag === 'SCRIPT' || tag === 'STYLE' || tag === 'svg' || tag === 'SVG') return true;
      if(el.classList && el.classList.contains('lang-menu')) return true;
      if(el.getAttribute && el.getAttribute('data-no-i18n') !== null) return true;
      el = el.parentNode;
    }
    return false;
  }

  function translateTextNode(node){
    var ru = node.__ru;
    if(ru === undefined){
      var raw = node.nodeValue;
      if(!raw) return;
      if(!hasCyr.test(raw)) return;       // nothing translatable, ignore forever
      ru = raw;
      node.__ru = raw;
    }
    var trimmed = ru.trim();
    var lead = ru.slice(0, ru.length - ru.replace(/^\s+/, '').length);
    var trail = ru.slice(ru.replace(/\s+$/, '').length);
    var target = (curLang === 'ru') ? trimmed : (lookup(trimmed) || trimmed);
    var val = lead + target + trail;
    if(node.nodeValue !== val) node.nodeValue = val;
  }

  function translateAttr(el, attr){
    var key = '__ru_' + attr;
    var ru = el[key];
    if(ru === undefined){
      var raw = el.getAttribute(attr);
      if(!raw || !hasCyr.test(raw)) return;
      ru = raw; el[key] = raw;
    }
    var trimmed = ru.trim();
    var target = (curLang === 'ru') ? trimmed : (lookup(trimmed) || trimmed);
    if(el.getAttribute(attr) !== target) el.setAttribute(attr, target);
  }

  var ATTRS = ['placeholder', 'aria-label', 'title'];

  function translateTree(root){
    if(!root) return;
    if(root.nodeType === 3){ if(!i18nSkip(root.parentNode)) translateTextNode(root); return; }
    if(root.nodeType !== 1) return;
    if(i18nSkip(root)) return;
    // text nodes
    var walker = document.createTreeWalker(root, NodeFilter.SHOW_TEXT, {
      acceptNode: function(n){ return i18nSkip(n.parentNode) ? NodeFilter.FILTER_REJECT : NodeFilter.FILTER_ACCEPT; }
    });
    var nodes = [], n;
    while((n = walker.nextNode())) nodes.push(n);
    for(var i=0;i<nodes.length;i++) translateTextNode(nodes[i]);
    // attributes on root + descendants
    ATTRS.forEach(function(a){ if(root.hasAttribute && root.hasAttribute(a)) translateAttr(root, a); });
    root.querySelectorAll('[placeholder],[aria-label],[title]').forEach(function(el){
      if(i18nSkip(el)) return;
      if(el.hasAttribute('placeholder')) translateAttr(el, 'placeholder');
      if(el.hasAttribute('aria-label')) translateAttr(el, 'aria-label');
      if(el.hasAttribute('title')) translateAttr(el, 'title');
    });
  }

  var i18nBusy = false;
  function applyLang(code){
    curLang = (code === 'uz' || code === 'en') ? code : 'ru';
    document.documentElement.setAttribute('lang', curLang);
    document.querySelectorAll('.lang .cur').forEach(function(el){ el.textContent = curLang.toUpperCase(); });
    document.querySelectorAll('.lang-menu a').forEach(function(a){
      a.classList.toggle('active', a.getAttribute('data-lang') === curLang);
    });
    // document title
    if(document.__ruTitle === undefined) document.__ruTitle = document.title;
    var tt = (curLang === 'ru') ? document.__ruTitle : (lookup(document.__ruTitle) || document.__ruTitle);
    if(document.title !== tt) document.title = tt;
    // body tree
    i18nBusy = true;
    translateTree(document.body);
    i18nBusy = false;
    document.dispatchEvent(new CustomEvent('wasyt:lang', { detail: curLang }));
  }
  window.WASYT_TR = function(ru){ return (curLang === 'ru') ? ru : (lookup(ru) || ru); };
  window.WASYT_LANG = function(){ return curLang; };

  // wire the dropdowns
  document.querySelectorAll('.lang').forEach(function(lang){
    var btn = lang.querySelector('.lang-btn');
    btn && btn.addEventListener('click', function(e){
      e.stopPropagation();
      lang.classList.toggle('open');
    });
    lang.querySelectorAll('.lang-menu a').forEach(function(a){
      a.addEventListener('click', function(e){
        e.preventDefault();
        var code = a.getAttribute('data-lang');
        try{ localStorage.setItem('wasyt-lang', code); }catch(_){}
        applyLang(code);
        lang.classList.remove('open');
      });
    });
  });
  document.addEventListener('click', function(){
    document.querySelectorAll('.lang.open').forEach(function(l){ l.classList.remove('open'); });
  });

  // observe dynamically-inserted / changed content and translate it
  if('MutationObserver' in window){
    var mo = new MutationObserver(function(muts){
      if(curLang === 'ru') return;       // nothing to do in source language
      if(i18nBusy) return;
      i18nBusy = true;
      for(var i=0;i<muts.length;i++){
        var m = muts[i];
        if(m.type === 'childList'){
          for(var j=0;j<m.addedNodes.length;j++) translateTree(m.addedNodes[j]);
        } else if(m.type === 'characterData'){
          if(!i18nSkip(m.target.parentNode)) translateTextNode(m.target);
        } else if(m.type === 'attributes'){
          if(!i18nSkip(m.target)) translateAttr(m.target, m.attributeName);
        }
      }
      i18nBusy = false;
    });
    mo.observe(document.body, {
      childList: true, subtree: true, characterData: true,
      attributes: true, attributeFilter: ATTRS
    });
  }

  // restore saved choice
  try{
    var saved = localStorage.getItem('wasyt-lang');
    if(saved && saved !== 'ru') applyLang(saved);
  }catch(_){}

  /* ---- scroll reveal (freeze-proof) ---- */
  var html = document.documentElement;
  var revealEls = document.querySelectorAll('[data-reveal]');
  function settle(el){ el.classList.add('done'); }      // snap to final, kill transition
  if('IntersectionObserver' in window && revealEls.length){
    var io = new IntersectionObserver(function(entries){
      entries.forEach(function(en){
        if(en.isIntersecting){
          var el = en.target;
          el.classList.add('in');
          io.unobserve(el);
          // hard-settle shortly after, so a frozen transition can't keep it hidden
          setTimeout(function(){ settle(el); }, 900);
        }
      });
    }, {threshold:.06, rootMargin:'0px 0px -6% 0px'});
    revealEls.forEach(function(el){ io.observe(el); });
    function revealInView(){
      revealEls.forEach(function(el){
        if(el.classList.contains('in')) return;
        var r = el.getBoundingClientRect();
        if(r.top < (window.innerHeight||document.documentElement.clientHeight) + 80){
          el.classList.add('in');
          setTimeout(function(){ settle(el); }, 900);
        }
      });
    }
    window.addEventListener('load', revealInView);
    revealInView();
    setTimeout(revealInView, 200);
    // absolute safety: settle everything after 2s no matter what
    setTimeout(function(){ revealEls.forEach(settle); html.classList.remove('pre'); }, 2000);
  } else {
    revealEls.forEach(settle);
    html.classList.remove('pre');
  }

  /* ---- stat count-up ---- */
  function animateNum(el){
    var target = parseInt(el.getAttribute('data-count'),10) || 0;
    var suffix = el.getAttribute('data-suffix') || '';
    var start = null, dur = 1400;
    function step(ts){
      if(!start) start = ts;
      var p = Math.min((ts-start)/dur,1);
      var eased = 1 - Math.pow(1-p,3);
      el.textContent = Math.round(target*eased) + suffix;
      if(p<1) requestAnimationFrame(step);
    }
    requestAnimationFrame(step);
  }
  var countEls = document.querySelectorAll('[data-count]');
  function runCount(el){ if(!el._done){ el._done = true; animateNum(el); } }
  if('IntersectionObserver' in window){
    var io2 = new IntersectionObserver(function(entries){
      entries.forEach(function(en){
        if(en.isIntersecting){ runCount(en.target); io2.unobserve(en.target); }
      });
    }, {threshold:.4});
    countEls.forEach(function(el){ io2.observe(el); });
    // fallback: ensure numbers always render even if IO never fires
    setTimeout(function(){ countEls.forEach(runCount); }, 800);
  } else {
    countEls.forEach(runCount);
  }

  /* ---- carousel ---- */
  document.querySelectorAll('[data-carousel]').forEach(function(car){
    var track = car.querySelector('.track');
    var prev  = car.querySelector('[data-prev]');
    var next  = car.querySelector('[data-next]');
    if(!track) return;
    function amount(){
      var card = track.querySelector('.news-card');
      return card ? card.getBoundingClientRect().width + 22 : 380;
    }
    prev && prev.addEventListener('click', function(){ track.scrollBy({left:-amount(),behavior:'smooth'}); });
    next && next.addEventListener('click', function(){ track.scrollBy({left: amount(),behavior:'smooth'}); });
  });

  /* ---- accordion ---- */
  document.querySelectorAll('[data-accordion]').forEach(function(acc){
    var items = acc.querySelectorAll('.acc-item');
    items.forEach(function(item){
      var head = item.querySelector('.acc-head');
      var body = item.querySelector('.acc-body');
      head && head.addEventListener('click', function(){
        var open = item.classList.contains('open');
        items.forEach(function(it){
          it.classList.remove('open');
          var b = it.querySelector('.acc-body'); if(b) b.style.maxHeight = null;
        });
        if(!open){
          item.classList.add('open');
          body.style.maxHeight = body.scrollHeight + 'px';
        }
      });
    });
    // open first by default
    var first = acc.querySelector('.acc-item');
    if(first){ first.classList.add('open'); var b=first.querySelector('.acc-body'); if(b) b.style.maxHeight=b.scrollHeight+'px'; }
  });

  /* ---- video modal ---- */
  var modal = document.getElementById('video-modal');
  var iframe = modal && modal.querySelector('iframe');
  var src = iframe && iframe.getAttribute('data-src');
  function openModal(){
    if(!modal) return;
    if(iframe && src) iframe.setAttribute('src', src + (src.indexOf('?')>-1?'&':'?') + 'autoplay=1');
    modal.classList.add('open');
    document.body.style.overflow = 'hidden';
  }
  function closeModal(){
    if(!modal) return;
    modal.classList.remove('open');
    if(iframe) iframe.setAttribute('src','');
    document.body.style.overflow = '';
  }
  document.querySelectorAll('[data-open-video]').forEach(function(b){ b.addEventListener('click', openModal); });
  modal && modal.querySelectorAll('[data-close-modal]').forEach(function(b){ b.addEventListener('click', closeModal); });
  document.addEventListener('keydown', function(e){ if(e.key==='Escape') closeModal(); });

  /* ---- toast ---- */
  function toast(msg){
    var t = document.getElementById('toast');
    if(!t) return;
    t.querySelector('.txt').textContent = msg;
    t.classList.add('show');
    clearTimeout(t._t);
    t._t = setTimeout(function(){ t.classList.remove('show'); }, 4200);
  }

  /* ---- pricing billing toggle ---- */
  document.querySelectorAll('[data-billing]').forEach(function(grp){
    var btns = grp.querySelectorAll('button');
    btns.forEach(function(b){
      b.addEventListener('click', function(){
        btns.forEach(function(x){ x.classList.remove('active'); });
        b.classList.add('active');
        var mode = b.getAttribute('data-mode');
        document.querySelectorAll('[data-price]').forEach(function(el){
          el.textContent = el.getAttribute(mode === 'year' ? 'data-year' : 'data-month');
        });
        document.querySelectorAll('[data-save]').forEach(function(el){
          var txt = el.getAttribute(mode === 'year' ? 'data-year' : 'data-month');
          var svg = el.querySelector('svg');
          el.textContent = txt;
          if(svg) el.insertBefore(svg, el.firstChild);
        });
        document.querySelectorAll('[data-per]').forEach(function(el){
          el.textContent = '/мес';
        });
      });
    });
  });

  /* ---- form validation ---- */
  document.querySelectorAll('[data-validate]').forEach(function(form){
    var status = document.createElement('p');
    status.className = 'form-status';
    status.setAttribute('role', 'status');
    status.setAttribute('aria-live', 'polite');
    form.appendChild(status);
    function inputValid(input){
      var rule = input.getAttribute('data-rule') || '';
      var val = (input.value || '').trim();
      if(rule.indexOf('required') > -1 && !val) return false;
      if(rule.indexOf('email') > -1 && val && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(val)) return false;
      if(rule.indexOf('phone') > -1 && val && val.replace(/\D/g, '').length < 7) return false;
      return true;
    }
    function updateInput(input, force){
      if(!force && !input.dataset.touched) return inputValid(input);
      input.dataset.touched = 'true';
      var field = input.closest('.field');
      var valid = inputValid(input);
      if(field){
        field.classList.toggle('err', !valid);
        var message = field.querySelector('.msg');
        if(message){
          if(!message.id) message.id = 'field-error-' + Math.random().toString(36).slice(2, 9);
          input.setAttribute('aria-describedby', message.id);
        }
      }
      input.setAttribute('aria-invalid', valid ? 'false' : 'true');
      return valid;
    }
    form.addEventListener('submit', function(e){
      e.preventDefault();
      var ok = true;
      form.querySelectorAll('[data-rule]').forEach(function(input){
        if(!updateInput(input, true)) ok = false;
      });
      if(ok){
        var sbtn = form.querySelector('button[type="submit"]');
        var okMsg = form.getAttribute('data-success') || 'Форма успешно отправлена! Мы свяжемся с вами в ближайшее время.';
        var prevTxt = sbtn ? sbtn.innerHTML : '';
        status.textContent = '';
        if(sbtn){ sbtn.disabled = true; sbtn.innerHTML = 'Отправка…'; }
        window.WASYT_SEND_LEAD({ kind:'form', fields: leadFields(form) }).then(function(res){
          if(res && res.ok){
            form.reset();
            form.querySelectorAll('[data-rule]').forEach(function(input){
              input.removeAttribute('aria-invalid');
              input.removeAttribute('aria-describedby');
              delete input.dataset.touched;
            });
            status.textContent = '';
            toast(okMsg);
          } else {
            status.textContent = 'Не удалось отправить заявку. Данные сохранены в форме — попробуйте ещё раз или позвоните нам.';
            toast('Не удалось отправить заявку. Попробуйте ещё раз или позвоните нам.');
          }
        }).catch(function(){
          status.textContent = 'Нет соединения с сервером. Данные сохранены в форме — попробуйте ещё раз.';
          toast('Ошибка соединения. Проверьте интернет и попробуйте снова.');
        }).then(function(){
          if(sbtn){ sbtn.disabled = false; sbtn.innerHTML = prevTxt; }
        });
      }
    });
    form.querySelectorAll('[data-rule]').forEach(function(input){
      input.addEventListener('input', function(){
        updateInput(input, false);
        status.textContent = '';
      });
      input.addEventListener('blur', function(){ updateInput(input, true); });
    });
  });

  /* ============================================================
     SHOP CART
     ============================================================ */
  var CART_KEY = 'wasyt-cart';
  function readCart(){ try{ return JSON.parse(localStorage.getItem(CART_KEY)||'[]'); }catch(_){ return []; } }
  function writeCart(c){ try{ localStorage.setItem(CART_KEY, JSON.stringify(c)); }catch(_){ } }
  function fmt(n){ return n.toString().replace(/\B(?=(\d{3})+(?!\d))/g,' '); }
  function cartCount(c){ return c.reduce(function(s,i){ return s + i.qty; }, 0); }
  function cartTotal(c){ return c.reduce(function(s,i){ return s + i.qty*i.price; }, 0); }

  function addToCart(id,name,price,img){
    var c = readCart();
    var row = c.filter(function(i){ return i.id===id; })[0];
    if(row){ row.qty++; if(img && !row.img) row.img = img; } else { c.push({id:id,name:name,price:price,qty:1,img:img||''}); }
    writeCart(c); syncCart(); openCart();
  }
  function setQty(id,delta){
    var c = readCart();
    var row = c.filter(function(i){ return i.id===id; })[0];
    if(!row) return;
    row.qty += delta;
    if(row.qty<=0){ c = c.filter(function(i){ return i.id!==id; }); }
    writeCart(c); syncCart();
  }
  function removeItem(id){
    writeCart(readCart().filter(function(i){ return i.id!==id; })); syncCart();
  }

  var boxSvg = '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.6"><path d="M21 16V8a2 2 0 0 0-1-1.73l-7-4a2 2 0 0 0-2 0l-7 4A2 2 0 0 0 3 8v8a2 2 0 0 0 1 1.73l7 4a2 2 0 0 0 2 0l7-4A2 2 0 0 0 21 16z"/><polyline points="3.27 6.96 12 12.01 20.73 6.96"/><line x1="12" y1="22.08" x2="12" y2="12"/></svg>';

  // look up a product image from the catalog DOM (used to backfill cart rows added before images were stored)
  function imgForId(id){
    var card = document.querySelector('.product[data-id="'+id+'"]');
    var im = card && card.querySelector('.pimg img');
    return im ? im.getAttribute('src') : '';
  }

  function syncCart(){
    var c = readCart();
    var n = cartCount(c);
    // badges on all cart buttons
    document.querySelectorAll('.cart-btn').forEach(function(b){
      b.classList.toggle('has', n>0);
      var bd = b.querySelector('.badge'); if(bd) bd.textContent = n;
    });
    // drawer body
    var items = document.getElementById('cart-items');
    var foot  = document.getElementById('cart-foot');
    if(!items) return;
    if(!c.length){
      items.innerHTML = '<div class="cart-empty">'+boxSvg.replace('1.6','1.4')+'<div>Корзина пуста.<br>Добавьте оборудование из каталога.</div></div>';
      if(foot) foot.style.display='none';
      return;
    }
    if(foot) foot.style.display='';
    items.innerHTML = c.map(function(i){
      var src = i.img || imgForId(i.id);
      var altText = (i.name||'').replace(/"/g,'&quot;');
      var media = '<div class="ri'+(src?' has-img':'')+'">'+boxSvg+
        (src ? '<img src="'+src+'" alt="'+altText+'" loading="lazy" onerror="this.remove();this.parentNode.classList.remove(\'has-img\')">' : '')+
      '</div>';
      return '<div class="cart-row">'+
        media+
        '<div class="rc"><b>'+i.name+'</b><div class="rp">'+fmt(i.price)+' <span>сум</span></div>'+
          '<div class="qty" style="margin-top:8px"><button data-dec="'+i.id+'">−</button><span>'+i.qty+'</span><button data-inc="'+i.id+'">+</button></div>'+
        '</div>'+
        '<div class="rt"><button class="rm" data-rm="'+i.id+'">Удалить</button></div>'+
      '</div>';
    }).join('');
    var tot = document.getElementById('cart-total-val');
    if(tot) tot.innerHTML = fmt(cartTotal(c)) + ' <span>сум</span>';
  }

  function openCart(){ var d=document.getElementById('cart-drawer'); if(d){ d.classList.add('open'); document.body.style.overflow='hidden'; } if(typeof showCartStep==='function') showCartStep(); }
  function closeCart(){ var d=document.getElementById('cart-drawer'); if(d){ d.classList.remove('open'); document.body.style.overflow=''; } }

  // delegate clicks
  document.addEventListener('click', function(e){
    var add = e.target.closest('[data-add]');
    if(add){
      var pcard = add.closest('.product');
      var pim = pcard && pcard.querySelector('.pimg img');
      addToCart(add.getAttribute('data-add'), add.getAttribute('data-name'), parseInt(add.getAttribute('data-price'),10), pim ? pim.getAttribute('src') : '');
      return;
    }
    if(e.target.closest('[data-open-cart]')){ openCart(); return; }
    if(e.target.closest('[data-close-cart]')){ closeCart(); return; }
    var inc=e.target.closest('[data-inc]'); if(inc){ setQty(inc.getAttribute('data-inc'),1); return; }
    var dec=e.target.closest('[data-dec]'); if(dec){ setQty(dec.getAttribute('data-dec'),-1); return; }
    var rm=e.target.closest('[data-rm]'); if(rm){ removeItem(rm.getAttribute('data-rm')); return; }
  });
  document.addEventListener('keydown', function(e){ if(e.key==='Escape') closeCart(); });

  // ensure the 2-step checkout form exists in every cart drawer (only shop.html ships it in markup)
  (function ensureCheckoutForm(){
    var foot = document.getElementById('cart-foot');
    if(!foot || document.getElementById('cart-form')) return;   // shop.html already has it
    var btn = document.getElementById('cart-checkout');
    var stepWrap = document.createElement('div'); stepWrap.id = 'cart-step-cart';
    if(btn && btn.parentNode === foot){
      foot.insertBefore(stepWrap, btn);
      stepWrap.appendChild(btn);
      var hint = foot.querySelector('p.hint'); if(hint) stepWrap.appendChild(hint);
    }
    var form = document.createElement('form');
    form.id = 'cart-form'; form.className = 'cart-form'; form.setAttribute('novalidate',''); form.hidden = true;
    form.innerHTML =
      '<div class="field" id="cf-name-field"><label for="cf-name">Имя и фамилия</label>'+
      '<input type="text" id="cf-name" placeholder="Введите имя и фамилию" autocomplete="name"><div class="msg">Укажите имя и фамилию</div></div>'+
      '<div class="field" id="cf-phone-field"><label for="cf-phone">Номер телефона</label>'+
      '<input type="tel" id="cf-phone" data-no-i18n placeholder="+998 90 123 45 67" autocomplete="tel" inputmode="tel"><div class="msg">Укажите корректный номер телефона</div></div>'+
      '<button class="btn btn-primary" type="submit">Отправить заявку</button>'+
      '<button class="cart-form-back" type="button" id="cart-form-back">← Назад к корзине</button>';
    foot.appendChild(form);
  })();

  // checkout from drawer — two steps: cart → contact form
  var checkout = document.getElementById('cart-checkout');
  var cartStep = document.getElementById('cart-step-cart');
  var cartForm = document.getElementById('cart-form');
  var cartFormBack = document.getElementById('cart-form-back');
  var cfName = document.getElementById('cf-name');
  var cfPhone = document.getElementById('cf-phone');
  var cartStatus = cartForm && cartForm.querySelector('.form-status');
  if(cartForm && !cartStatus){
    cartStatus = document.createElement('p');
    cartStatus.className = 'form-status';
    cartStatus.setAttribute('role', 'status');
    cartStatus.setAttribute('aria-live', 'polite');
    cartForm.appendChild(cartStatus);
  }
  function validateCartField(input, force){
    if(!input) return true;
    if(!force && !input.dataset.touched) return true;
    input.dataset.touched = 'true';
    var digits = input.value.replace(/\D/g, '');
    var valid = input === cfName ? input.value.trim().length >= 2 : digits.length >= 7;
    input.closest('.field').classList.toggle('err', !valid);
    input.setAttribute('aria-invalid', valid ? 'false' : 'true');
    var message = input.closest('.field').querySelector('.msg');
    if(message){
      if(!message.id) message.id = input.id + '-error';
      input.setAttribute('aria-describedby', message.id);
    }
    return valid;
  }
  [cfName, cfPhone].forEach(function(input){
    if(!input) return;
    input.addEventListener('input', function(){
      validateCartField(input, false);
      if(cartStatus) cartStatus.textContent = '';
    });
    input.addEventListener('blur', function(){ validateCartField(input, true); });
  });

  function showCartStep(){
    if(cartStep) cartStep.hidden = false;
    if(cartForm) cartForm.hidden = true;
    if(cfName){ cfName.closest('.field').classList.remove('err'); }
    if(cfPhone){ cfPhone.closest('.field').classList.remove('err'); }
  }
  function showFormStep(){
    if(cartStep) cartStep.hidden = true;
    if(cartForm) cartForm.hidden = false;
    if(cfName) setTimeout(function(){ cfName.focus(); }, 50);
  }
  if(checkout){
    checkout.addEventListener('click', function(){
      var c = readCart();
      if(!c.length) return;
      showFormStep();
    });
  }
  if(cartFormBack){ cartFormBack.addEventListener('click', showCartStep); }
  if(cartForm){
    cartForm.addEventListener('submit', function(e){
      e.preventDefault();
      var c = readCart();
      if(!c.length) return;
      var ok = true;
      var name = (cfName.value||'').trim();
      var phone = (cfPhone.value||'').trim();
      if(!validateCartField(cfName, true)) ok = false;
      if(!validateCartField(cfPhone, true)) ok = false;
      if(!ok) return;
      var orderItems = c.map(function(i){ return { name:i.name, qty:i.qty, price:i.price }; });
      var submitButton = cartForm.querySelector('button[type="submit"]');
      var previousText = submitButton ? submitButton.textContent : '';
      if(cartStatus) cartStatus.textContent = '';
      if(submitButton){ submitButton.disabled = true; submitButton.textContent = 'Отправка…'; }
      window.WASYT_SEND_LEAD({
        kind:'cart',
        fields:[ { label:'Имя', value:name }, { label:'Телефон', value:phone } ],
        cart: orderItems,
        total: cartTotal(c)
      }).then(function(res){
        if(res && res.ok){
          writeCart([]); syncCart(); closeCart();
          cartForm.reset(); showCartStep();
          cartForm.querySelectorAll('[aria-invalid]').forEach(function(input){
            input.removeAttribute('aria-invalid');
            input.removeAttribute('aria-describedby');
            delete input.dataset.touched;
          });
          toast('Спасибо, ' + name + '! Заявка оформлена — менеджер свяжется с вами по номеру ' + phone + '.');
        } else {
          if(cartStatus) cartStatus.textContent = 'Не удалось отправить заявку. Корзина сохранена — попробуйте ещё раз или позвоните нам.';
          toast('Не удалось отправить заявку. Корзина сохранена.');
        }
      }).catch(function(){
        if(cartStatus) cartStatus.textContent = 'Нет соединения с сервером. Корзина сохранена — попробуйте ещё раз.';
        toast('Ошибка соединения. Корзина сохранена.');
      }).then(function(){
        if(submitButton){ submitButton.disabled = false; submitButton.textContent = previousText; }
      });
    });
  }

  syncCart();

  /* ============================================================
     HERO — rotating category (word + mascot category chip)
     ============================================================ */
  var rotWord = document.getElementById('rotWord');
  if(rotWord){
    var I = {
      clothing:'<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M20.38 3.46L16 2a4 4 0 0 1-8 0L3.62 3.46a2 2 0 0 0-1.34 2.23l.58 3.47a1 1 0 0 0 .99.84H6v10a2 2 0 0 0 2 2h8a2 2 0 0 0 2-2V10h2.15a1 1 0 0 0 .99-.84l.58-3.47a2 2 0 0 0-1.34-2.23z"/></svg>',
      shoes:'<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M2 7v7a2 2 0 0 0 2 2h15a3 3 0 0 0 3-3c0-1.3-.8-2.2-2-2.7L13 8l-1-3H4a2 2 0 0 0-2 2z"/><line x1="2" y1="12" x2="8" y2="12"/></svg>',
      electronics:'<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><rect x="6" y="2" width="12" height="20" rx="2"/><line x1="10.5" y1="18" x2="13.5" y2="18"/></svg>',
      cosmetics:'<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M12 2l2.4 6.6L21 11l-6.6 2.4L12 20l-2.4-6.6L3 11l6.6-2.4z"/></svg>',
      accessories:'<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><circle cx="12" cy="13" r="6"/><polyline points="12 10 12 13 14 14"/><path d="M9 4.5L9.5 2h5l.5 2.5"/></svg>'
    };
    var CATS = [
      {word:'одежды',     label:'Магазин одежды',     icon:I.clothing},
      {word:'обуви',      label:'Магазин обуви',      icon:I.shoes},
      {word:'электроники',label:'Магазин электроники',icon:I.electronics},
      {word:'косметики',  label:'Магазин косметики',  icon:I.cosmetics},
      {word:'аксессуаров',label:'Магазин аксессуаров',icon:I.accessories}
    ];
    var catIcon  = document.getElementById('catIcon');
    var catLabel = document.getElementById('catLabel');
    var slides   = Array.prototype.slice.call(document.querySelectorAll('.hero-stage .hslide'));
    var i = 0;

    function apply(c){
      var tr = window.WASYT_TR || function(x){ return x; };
      // heading word
      rotWord.textContent = tr(c.word);
      rotWord.classList.remove('anim'); void rotWord.offsetWidth; rotWord.classList.add('anim');
      setTimeout(function(){ rotWord.classList.remove('anim'); }, 650);
      // category chip
      if(catIcon)  catIcon.innerHTML = c.icon;
      if(catLabel) catLabel.textContent = tr(c.label);
      if(catIcon){ catIcon.classList.remove('anim'); void catIcon.offsetWidth; catIcon.classList.add('anim'); }
    }
    // re-render current category text when language changes
    document.addEventListener('wasyt:lang', function(){ apply(CATS[i]); });

    var FADE = 600; // identical fade duration for appear & disappear

    function tween(el, from, to, dur, done){
      el.style.opacity = String(from);
      var start = null;
      function step(ts){
        if(!start) start = ts;
        var p = Math.min((ts - start) / dur, 1);
        el.style.opacity = String(from + (to - from) * p);
        if(p < 1){ requestAnimationFrame(step); }
        else if(done){ done(); }
      }
      requestAnimationFrame(step);
    }

    function show(next){
      if(!slides.length) return;
      var cur = slides[i];
      // disappear: dim out + drift left (symmetric with appear)
      cur.classList.remove('active');
      cur.classList.add('leaving');
      tween(cur, 1, 0, FADE, function(){ cur.classList.remove('leaving'); cur.style.opacity = ''; });
      i = next;
      var nx = slides[i];
      // appear: same speed, same fade, mirrored — glide in from the right + brighten up
      setTimeout(function(){
        nx.style.opacity = '0';
        nx.classList.add('active');
        tween(nx, 0, 1, FADE, function(){ nx.style.opacity = ''; });
        apply(CATS[i]);
      }, FADE + 60);
    }

    var prefersReduce = window.matchMedia && window.matchMedia('(prefers-reduced-motion:reduce)').matches;
    apply(CATS[0]);
    if(slides.length){
      // keep rotating even under reduce-motion — the crossfade is opacity-only (motion-safe), just slower
      setInterval(function(){ show((i + 1) % slides.length); }, prefersReduce ? 6000 : 3000);
    }

    // bfcache fix: returning via browser Back restores the page frozen mid-fade, which can leave
    // a half-faded ".leaving" slide stuck visible on top of the active one (images look stacked).
    // Re-sync to exactly one clean active slide matching the carousel index.
    window.addEventListener('pageshow', function(e){
      if(!e.persisted) return;
      slides.forEach(function(s, idx){ s.style.opacity = ''; s.classList.remove('leaving'); s.classList.toggle('active', idx === i); });
      apply(CATS[i]);
    });
  }

  /* ============================================================
     iOS-friendly video autoplay (Low Power Mode / Safari rescue)
     iOS often refuses muted inline autoplay; nudge play(), play
     when scrolled into view, and on first interaction.
     ============================================================ */
  (function(){
    var vids = [].slice.call(document.querySelectorAll('video[autoplay]'));
    if(!vids.length) return;
    function nudge(v){
      try{ v.muted = true; v.setAttribute('muted',''); v.setAttribute('playsinline',''); }catch(_){}
      var p = v.play(); if(p && p.catch) p.catch(function(){});
    }
    function kickAll(){ vids.forEach(function(v){ if(v.paused) nudge(v); }); }
    vids.forEach(nudge);
    window.addEventListener('load', kickAll);
    if('IntersectionObserver' in window){
      var vio = new IntersectionObserver(function(es){
        es.forEach(function(e){ if(e.isIntersecting) nudge(e.target); });
      }, {threshold:.1});
      vids.forEach(function(v){ vio.observe(v); });
    }
    function vonce(){ kickAll(); document.removeEventListener('touchstart', vonce); document.removeEventListener('click', vonce); }
    document.addEventListener('touchstart', vonce, {once:true, passive:true});
    document.addEventListener('click', vonce, {once:true, passive:true});
    document.addEventListener('visibilitychange', function(){ if(!document.hidden) kickAll(); });
    window.addEventListener('pageshow', function(e){ if(e.persisted) kickAll(); });
  })();

})();
