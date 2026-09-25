// Escola Pequenos Brilhantes — interações do site (sem dependências)
(function () {
  var WHATSAPP = '5588992904080';
  var MAP_SRC = 'https://maps.google.com/maps?q=R.%20Quintino%20Bocai%C3%BAva%2C%20779%2C%20Cruzeiro%2C%20Camocim%20-%20CE&z=16&output=embed';

  var root = document.documentElement;
  var reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  if (!('IntersectionObserver' in window) || reduceMotion) root.classList.remove('js');

  // Links de WhatsApp com mensagem pronta (atributo data-wa)
  document.querySelectorAll('[data-wa]').forEach(function (el) {
    el.href = 'https://wa.me/' + WHATSAPP + '?text=' + encodeURIComponent(el.dataset.wa);
    el.target = '_blank';
    el.rel = 'noopener';
  });

  // Menu mobile
  var nav = document.getElementById('nav');
  var toggle = document.getElementById('navToggle');
  function setMenu(open) {
    nav.classList.toggle('is-open', open);
    toggle.setAttribute('aria-expanded', String(open));
    toggle.setAttribute('aria-label', open ? 'Fechar menu' : 'Abrir menu');
  }
  toggle.addEventListener('click', function (e) {
    e.stopPropagation();
    setMenu(!nav.classList.contains('is-open'));
  });
  nav.addEventListener('click', function (e) {
    if (e.target.closest('a')) setMenu(false);
  });
  document.addEventListener('click', function (e) {
    if (nav.classList.contains('is-open') && !nav.contains(e.target)) setMenu(false);
  });
  document.addEventListener('keydown', function (e) {
    if (e.key === 'Escape') setMenu(false);
  });

  // Header com sombra ao rolar
  var header = document.getElementById('header');
  var ticking = false;
  function onScroll() {
    if (ticking) return;
    ticking = true;
    requestAnimationFrame(function () {
      header.classList.toggle('is-scrolled', window.scrollY > 8);
      ticking = false;
    });
  }
  window.addEventListener('scroll', onScroll, { passive: true });
  onScroll();

  if ('IntersectionObserver' in window) {
    // Elementos surgindo ao rolar
    if (root.classList.contains('js')) {
      var revealObs = new IntersectionObserver(function (entries) {
        entries.forEach(function (entry) {
          if (!entry.isIntersecting) return;
          entry.target.classList.add('is-visible');
          revealObs.unobserve(entry.target);
        });
      }, { threshold: 0.1, rootMargin: '0px 0px -40px 0px' });
      document.querySelectorAll('.reveal').forEach(function (el) {
        var siblings = el.parentElement.querySelectorAll(':scope > .reveal');
        var i = Array.prototype.indexOf.call(siblings, el);
        el.style.transitionDelay = Math.min(i, 5) * 70 + 'ms';
        revealObs.observe(el);
      });
    }

    // Item ativo no menu
    var links = nav.querySelectorAll('a[href^="#"]:not(.btn)');
    var sectionObs = new IntersectionObserver(function (entries) {
      entries.forEach(function (entry) {
        if (!entry.isIntersecting) return;
        links.forEach(function (a) {
          a.classList.toggle('is-active', a.getAttribute('href') === '#' + entry.target.id);
        });
      });
    }, { rootMargin: '-45% 0px -50% 0px' });
    document.querySelectorAll('main section[id]').forEach(function (s) { sectionObs.observe(s); });
  }

  // Filtros da galeria
  var filters = document.querySelectorAll('.filter');
  var items = document.querySelectorAll('.gallery .g');
  filters.forEach(function (btn) {
    btn.addEventListener('click', function () {
      var cat = btn.dataset.filter;
      filters.forEach(function (b) {
        var on = b === btn;
        b.classList.toggle('is-active', on);
        b.setAttribute('aria-pressed', String(on));
      });
      items.forEach(function (item) {
        var show = cat === 'all' || item.dataset.cat === cat;
        item.classList.toggle('is-hidden', !show);
        item.classList.remove('is-in');
        if (show) { void item.offsetWidth; item.classList.add('is-in'); }
      });
    });
  });

  // FAQ: abrir uma pergunta fecha as outras
  var faqs = document.querySelectorAll('.faq details');
  faqs.forEach(function (d) {
    d.addEventListener('toggle', function () {
      if (d.open) faqs.forEach(function (o) { if (o !== d) o.open = false; });
    });
  });

  // Mapa do Google só carrega quando pedido
  var loadMap = document.getElementById('loadMap');
  if (loadMap) {
    loadMap.addEventListener('click', function () {
      var iframe = document.createElement('iframe');
      iframe.src = MAP_SRC;
      iframe.title = 'Mapa: Escola Pequenos Brilhantes em Camocim-CE';
      iframe.loading = 'lazy';
      iframe.referrerPolicy = 'no-referrer-when-downgrade';
      document.getElementById('map').appendChild(iframe);
    });
  }

  document.getElementById('year').textContent = new Date().getFullYear();
})();
