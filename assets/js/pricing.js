/* WASYT — pricing comparison accordion (data-driven) */
(function(){
  'use strict';
  var YES = '<span class="yes"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="3"><polyline points="20 6 9 17 4 12"/></svg></span>';
  var NO  = '<span class="no"></span>';
  var CHK = '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="3"><polyline points="20 6 9 17 4 12"/></svg>';
  var ICONS = {
    box:'<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.7"><path d="M21 16V8a2 2 0 0 0-1-1.73l-7-4a2 2 0 0 0-2 0l-7 4A2 2 0 0 0 3 8v8a2 2 0 0 0 1 1.73l7 4a2 2 0 0 0 2 0l7-4A2 2 0 0 0 21 16z"/><polyline points="3.27 6.96 12 12.01 20.73 6.96"/><line x1="12" y1="22.08" x2="12" y2="12"/></svg>',
    suppliers:'<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.7"><path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"/><circle cx="9" cy="7" r="4"/><path d="M23 21v-2a4 4 0 0 0-3-3.87"/><path d="M16 3.13a4 4 0 0 1 0 7.75"/></svg>',
    crm:'<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.7"><circle cx="12" cy="12" r="10"/><circle cx="12" cy="10" r="3"/><path d="M6.5 19a6 6 0 0 1 11 0"/></svg>',
    gift:'<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.7"><polyline points="20 12 20 22 4 22 4 12"/><rect x="2" y="7" width="20" height="5"/><line x1="12" y1="22" x2="12" y2="7"/><path d="M12 7H7.5a2.5 2.5 0 0 1 0-5C11 2 12 7 12 7z"/><path d="M12 7h4.5a2.5 2.5 0 0 0 0-5C13 2 12 7 12 7z"/></svg>',
    staff:'<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.7"><rect x="3" y="4" width="18" height="16" rx="2"/><circle cx="9" cy="10" r="2"/><path d="M6 16a3 3 0 0 1 6 0"/><line x1="15" y1="9" x2="18" y2="9"/><line x1="15" y1="13" x2="18" y2="13"/></svg>',
    finance:'<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.7"><path d="M21 12V7a2 2 0 0 0-2-2H5a2 2 0 0 0-2 2v10a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-1"/><path d="M16 12a2 2 0 0 0 0 4h5v-4z"/><circle cx="17.5" cy="14" r=".6" fill="currentColor" stroke="none"/></svg>',
    marketing:'<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.7"><path d="M3 11v2a1 1 0 0 0 1 1h2l4 4V6L6 10H4a1 1 0 0 0-1 1z"/><path d="M14 8a4 4 0 0 1 0 8"/><path d="M17.5 5a8 8 0 0 1 0 14"/></svg>',
    reports:'<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.7"><line x1="6" y1="20" x2="6" y2="13"/><line x1="12" y1="20" x2="12" y2="4"/><line x1="18" y1="20" x2="18" y2="9"/></svg>',
    integrations:'<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.7"><path d="M19.5 12.5l-3 3a3.5 3.5 0 0 1-5-5l1-1"/><path d="M4.5 11.5l3-3a3.5 3.5 0 0 1 5 5l-1 1"/></svg>',
    support:'<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.7"><path d="M3 18v-6a9 9 0 0 1 18 0v6"/><path d="M21 19a2 2 0 0 1-2 2h-1a2 2 0 0 1-2-2v-3a2 2 0 0 1 2-2h3zM3 19a2 2 0 0 0 2 2h1a2 2 0 0 0 2-2v-3a2 2 0 0 0-2-2H3z"/></svg>'
  };

  // [feature, startIncluded]  — Business always included
  var DATA = [
    ['box','Товарный и складской учёт',[
      ['Категоризация товаров по цветам, размерам и характеристикам',1],
      ['Учёт товаров по единицам измерения',1],
      ['Учёт комплектов и услуг',0],
      ['Автоматическое создание товаров через базу GS1',0],
      ['Создание и редактирование товаров из каталога',1],
      ['Массовая загрузка товаров через Excel',0],
      ['Онлайн просмотр остатков',1],
      ['Быстрый и расширенный поиск товаров',1],
      ['Печать ценников',1],
      ['Создание индивидуальных ценников',0],
      ['Добавление фотографий товаров',1],
      ['История движения товаров',0],
      ['Дополнительные свойства товаров',0],
      ['Изменение цен товаров',1],
      ['Массовое изменение цен',0],
      ['Полная и частичная инвентаризация',1],
      ['Перемещение товаров между магазинами',0],
      ['Учёт списания товаров',1]
    ]],
    ['suppliers','Управление поставщиками',[
      ['Справочник поставщиков',1],
      ['Взаиморасчёты с поставщиками',0],
      ['Заказы и оплаты поставщикам',0],
      ['История оплат',0],
      ['Приёмка товаров',1],
      ['Возврат товаров поставщикам',1]
    ]],
    ['crm','Управление клиентами (CRM)',[
      ['Профиль клиента',1],
      ['История покупок',1],
      ['Статистика клиента',0],
      ['Активность клиента',0],
      ['Предпочтения клиента',0],
      ['Комментарии и заметки',1],
      ['Группы и теги',0],
      ['Управление балансом клиента',0],
      ['Управление долгами клиентов',0]
    ]],
    ['gift','Лояльность клиентов',[
      ['Накопительная скидка',1],
      ['Фиксированный кешбек',0],
      ['Процентный кешбек',0]
    ]],
    ['staff','Сотрудники и роли',[
      ['Гибкие права доступа',0],
      ['Роли сотрудников',1],
      ['Ограничение входа с устройств',0],
      ['Telegram-уведомления о входе',0]
    ]],
    ['finance','Финансы',[
      ['Категории доходов и расходов',1],
      ['Учёт движения денежных средств',1],
      ['Кассовые расходы',1],
      ['Зарплаты, аренда и прочие расходы',0],
      ['Отчёт о прибылях и убытках',0]
    ]],
    ['marketing','Маркетинг',[
      ['Подарочные сертификаты',0],
      ['Автоматические скидки',0],
      ['Акция 1+1',0],
      ['Карусель скидок',0],
      ['Скидка на чек',1],
      ['Простые шаблоны акций',0],
      ['Продвинутые шаблоны акций',0],
      ['Поздравления с днём рождения',0],
      ['Массовые SMS-рассылки',0],
      ['Именные SMS-рассылки',0],
      ['Ваучеры',0],
      ['Промокоды',0]
    ]],
    ['reports','Отчёты и аналитика',[
      ['Дашборд магазина',1],
      ['Отчёт по продажам',1],
      ['Сводная статистика',1],
      ['Эффективность товаров',0],
      ['Остатки на дату',1],
      ['Визиты и покупки клиентов',0],
      ['Сегменты клиентов',0],
      ['Эффективность продавцов',0],
      ['Приход товаров',1],
      ['Движение товаров',0],
      ['Поставщики и заказы',0],
      ['Табличные отчёты',1],
      ['Графические отчёты',0],
      ['Экспорт в Excel',0],
      ['Telegram-бот статистики',0]
    ]],
    ['integrations','Интеграции',[
      ['Интернет-магазин',0],
      ['Telegram-бот',0],
      ['UDS',0],
      ['Payme',1],
      ['Click',1],
      ['Apelsin',0]
    ]],
    ['support','Обучение и поддержка',[
      ['Первичное обучение',1],
      ['Настройка оборудования',1],
      ['Стандартная поддержка',1],
      ['Телефонная поддержка',0],
      ['Выездное обучение',0]
    ]]
  ];

  var host = document.getElementById('cmp-list');
  if(!host) return;
  var html = '';
  DATA.forEach(function(cat, idx){
    var emoji = ICONS[cat[0]] || '', name = cat[1], feats = cat[2];
    var sCount = feats.filter(function(f){ return f[1]; }).length;
    var rows = feats.map(function(f){
      return '<div class="cmp-row"><div class="cr-f">'+f[0]+'</div>'+
        '<div class="cr-c">'+(f[1]?YES:NO)+'</div>'+
        '<div class="cr-c biz">'+YES+'</div>'+
        '<div class="cr-sp"></div></div>';
    }).join('');
    html += '<div class="cmp-cat'+(idx===0?' open':'')+'">'+
      '<button class="cmp-cat-head" type="button" aria-expanded="'+(idx===0)+'">'+
        '<span class="cch-t"><span class="cch-ic">'+emoji+'</span><span class="cch-txt"><h3>'+name+'</h3>'+
          '<span class="cch-n">'+feats.length+' <span>возможностей</span></span></span></span>'+
        '<span class="cch-mini">'+CHK+sCount+'</span>'+
        '<span class="cch-mini biz-mini">'+CHK+feats.length+'</span>'+
        '<svg class="cch-chev" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M6 9l6 6 6-6"/></svg>'+
      '</button>'+
      '<div class="cmp-cat-body"><div class="cmp-cat-body-in">'+rows+'</div></div>'+
    '</div>';
  });
  host.innerHTML = html;

  host.addEventListener('click', function(e){
    var head = e.target.closest('.cmp-cat-head');
    if(!head) return;
    var cat = head.closest('.cmp-cat');
    var open = cat.classList.toggle('open');
    head.setAttribute('aria-expanded', open);
  });
})();
