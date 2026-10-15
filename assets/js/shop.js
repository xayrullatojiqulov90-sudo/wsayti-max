(function () {
  'use strict';

  var modal = document.getElementById('pd-modal');
  var modalImg = document.getElementById('pd-img');
  var modalName = document.getElementById('pd-name');
  var modalPrice = document.getElementById('pd-price');
  var modalCat = document.getElementById('pd-cat');
  var modalSpecs = document.getElementById('pd-specs');
  var modalAdd = document.getElementById('pd-add');
  var lastProductFocus = null;

  function formatPrice(value) {
    return Number(value || 0).toLocaleString('ru-RU') + ' сум';
  }

  function productData(card) {
    if (!card) return null;
    var img = card.querySelector('.pimg img');
    return {
      id: card.getAttribute('data-id') || '',
      name: card.getAttribute('data-name') || card.querySelector('h3')?.textContent || '',
      price: card.getAttribute('data-price') || '0',
      img: img ? img.getAttribute('src') : '',
      label: card.getAttribute('data-label') || 'Оборудование',
      spec: card.getAttribute('data-spec') || ''
    };
  }

  function openProductModal(card) {
    if (!modal || !modalImg || !card) return;
    var data = productData(card);
    if (!data) return;

    modalImg.src = data.img;
    modalImg.alt = data.name;
    modalName.textContent = data.name;
    modalPrice.textContent = formatPrice(data.price);
    modalCat.textContent = data.label;
    modalSpecs.innerHTML = data.spec ? data.spec.split(' · ').map(function (item) {
      return '<li>' + item + '</li>';
    }).join('') : '';
    modalAdd.setAttribute('data-add', data.id);
    modalAdd.setAttribute('data-name', data.name);
    modalAdd.setAttribute('data-price', data.price);
    lastProductFocus = document.activeElement;
    modal.classList.add('open');
    document.body.style.overflow = 'hidden';
    var closeButton = modal.querySelector('button[data-pd-close]');
    if (closeButton) closeButton.focus();
  }

  function closeProductModal() {
    if (!modal) return;
    modal.classList.remove('open');
    document.body.style.overflow = '';
    if (lastProductFocus && document.contains(lastProductFocus)) lastProductFocus.focus();
    lastProductFocus = null;
  }

  document.querySelectorAll('.product').forEach(function (card) {
    var data = productData(card);
    var image = card.querySelector('.pimg img');
    card.setAttribute('tabindex', '0');
    card.setAttribute('role', 'group');
    card.setAttribute('aria-label', (data ? data.name : 'Товар') + ' — нажмите Enter или пробел, чтобы открыть подробности');
    if (image) {
      var media = image.parentNode;
      function markReady() {
        media.classList.add('media-ready');
        image.classList.add('is-loaded');
      }
      image.addEventListener('load', markReady);
      image.addEventListener('error', function () {
        media.classList.add('media-error');
        image.classList.add('media-error');
      });
      if (image.complete) {
        if (image.naturalWidth) markReady();
        else media.classList.add('media-error');
      }
    }
    card.addEventListener('keydown', function (event) {
      if ((event.key === 'Enter' || event.key === ' ') && !event.target.closest('button, a')) {
        event.preventDefault();
        openProductModal(card);
      }
    });
  });

  document.addEventListener('click', function (event) {
    var addButton = event.target.closest('[data-add]');
    var productCard = event.target.closest('.product');
    var closeButton = event.target.closest('[data-pd-close]');

    if (closeButton) {
      closeProductModal();
      return;
    }

    if (productCard && addButton && addButton.closest('.product') === productCard) {
      return;
    }

    if (productCard && !event.target.closest('.add')) {
      openProductModal(productCard);
    }
  });

  document.addEventListener('keydown', function (event) {
    if (event.key === 'Escape') closeProductModal();
  });

  var filterBar = document.querySelector('[data-shop-filter]');
  if (filterBar) {
    var emptyState = document.createElement('p');
    emptyState.className = 'shop-empty';
    emptyState.setAttribute('role', 'status');
    emptyState.setAttribute('aria-live', 'polite');
    emptyState.textContent = 'По выбранной категории пока нет товаров.';
    emptyState.hidden = true;
    filterBar.parentNode.insertBefore(emptyState, filterBar.nextSibling);
    var buttons = filterBar.querySelectorAll('button');
    var products = Array.prototype.slice.call(document.querySelectorAll('.product'));
    var categories = Array.prototype.slice.call(document.querySelectorAll('.cat-block h2'));

    categories.forEach(function (heading) {
      var category = heading.textContent.trim();
      var button = document.createElement('button');
      button.type = 'button';
      button.setAttribute('data-cat', category);
      button.textContent = category;
      filterBar.appendChild(button);
    });

    buttons = filterBar.querySelectorAll('button');
    buttons.forEach(function (button) {
      button.type = 'button';
      button.setAttribute('aria-pressed', 'false');
      button.addEventListener('click', function () {
        buttons.forEach(function (item) {
          item.classList.toggle('active', item === button);
          item.setAttribute('aria-pressed', item === button ? 'true' : 'false');
        });
        var category = button.getAttribute('data-cat');
        var visibleCount = 0;
        products.forEach(function (product) {
          var productCategory = product.closest('.cat-block')?.querySelector('h2')?.textContent.trim();
          var visible = category === 'all' || productCategory === category;
          product.hidden = !visible;
          if (visible) visibleCount++;
        });
        emptyState.hidden = visibleCount > 0;
      });
    });

    if (buttons.length) {
      buttons[0].classList.add('active');
      buttons[0].setAttribute('aria-pressed', 'true');
    }
  }
})();
