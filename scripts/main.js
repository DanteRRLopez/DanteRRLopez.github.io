// Establece el año actual en el pie de página
// Uso: presente en todos los HTML que incluyen <span id="year"></span>
// Archivo(s) relacionados: todas las páginas HTML (index.html, portfolio.html, about.html, cv.html, blog.html, cloud&analytics.html, project-management.html)
document.getElementById('year').textContent = new Date().getFullYear();
const btn = document.querySelector('.nav-toggle');
const links = document.getElementById('nav-links');
// Variables para el control del menú de navegación responsive
// Selector `.nav-toggle` se añade en los HTML si se desea un botón hamburguesa.
// Selector `#nav-links` es la lista principal de navegación (estilizada en assets/css/styles.css)
if (btn && links) {
  // Añade manejador para alternar navegación en pantallas pequeñas
  // Explicación: cambia el atributo aria-expanded y la clase .open en #nav-links
  btn.addEventListener('click', () => {
    const open = btn.getAttribute('aria-expanded') === 'true';
    btn.setAttribute('aria-expanded', String(!open));
    links.classList.toggle('open');
  });
}

// Hover inverso: al pasar el cursor sobre un elemento flotante, resaltar la tarjeta relacionada
// ------------------------------------------------------------
// Hover inverso para elementos flotantes
// Propósito: Cuando el usuario pasa el cursor sobre un icono flotante
// (ej. en la página de Portafolio), se resalta la tarjeta del proyecto
// relacionada. Esto mejora la correlación visual entre iconos y tarjetas.
// Selectores implicados:
// - .floating-item[data-related]  (HTML: portfolio.html y otras páginas con elementos flotantes)
// - .card[data-project-id]        (render-portfolio.js / scripts que renderizan las tarjetas)
// Uso en CSS: .floating-highlight (assets/css/styles.css)
(function() {
  /**
   * bindFloatingHover
   * - Registra handlers mouseenter/mouseleave en cada elemento flotante
   * - Añade / quita la clase .floating-highlight en la tarjeta relacionada
   * - No devuelve valor; actúa directamente sobre el DOM
   */
  function bindFloatingHover() {
    const items = document.querySelectorAll('.floating-item[data-related]');
    items.forEach(it => {
      it.addEventListener('mouseenter', () => {
        const id = it.getAttribute('data-related');
        const card = document.querySelector('.card[data-project-id="' + id + '"]');
        if (card) card.classList.add('floating-highlight');
      });
      it.addEventListener('mouseleave', () => {
        const id = it.getAttribute('data-related');
        const card = document.querySelector('.card[data-project-id="' + id + '"]');
        if (card) card.classList.remove('floating-highlight');
      });
    });
  }

  // Ejecuta el enlace inicial y asegura re-vinculación si el grid se actualiza dinámicamente
  bindFloatingHover();
  const grid = document.getElementById('grid');
  if (grid && window.MutationObserver) {
    const mo = new MutationObserver(() => bindFloatingHover());
    mo.observe(grid, { childList: true, subtree: true });
  }
})();

/* --- Cargador de anime.js + animaciones por página (no invasivo) ---
   - Este bloque inyecta dinámicamente anime.js desde un CDN y ejecuta
     pequeñas animaciones de entrada específicas por página.
   - Comportamiento seguro: si anime.js no carga, el código falla en
     silencio y la página sigue funcionando sin animaciones.
   - Ventaja: no es necesario añadir etiquetas <script> en cada HTML;
     todas las páginas que ya incluyen scripts/main.js obtienen animación.
*/
(function(){
  function loadScript(src, cb) {
    var s = document.createElement('script');
    s.src = src;
    s.async = true;
    s.onload = function() { cb(null); };
    s.onerror = function() { cb(new Error('failed to load ' + src)); };
    document.head.appendChild(s);
  }

  // Cargar desde CDN (versión estable y ampliamente disponible). Si prefieres una copia local,
  // reemplaza la URL por una ruta local (por ejemplo 'assets/js/anime.min.js').
  loadScript('https://cdnjs.cloudflare.com/ajax/libs/animejs/3.2.1/anime.min.js', function(err){
    if (err || typeof window.anime === 'undefined') return; // fallback seguro si anime.js no carga
    var anime = window.anime;

  // Animación para la página de inicio (hero)
  // Uso: index.html
  // Objetivo: animar título principal, párrafos y la imagen del hero al cargar
  function animateHome(){
      var title = document.querySelector('.hero-text h1');
      var paras = document.querySelectorAll('.hero-text p');
      var img = document.querySelector('.hero-img');
      if (title) {
        anime.timeline({ easing: 'easeOutExpo', duration: 700 })
          .add({ targets: title, translateY: [-28,0], opacity: [0,1], delay: 120 })
          .add({ targets: paras, translateY: [18,0], opacity: [0,1], delay: anime.stagger(80) }, '-=420')
          .add({ targets: img, scale: [0.94,1], opacity: [0,1], translateX: [40,0], duration: 700 }, '-=520');
      }
    }

  // Animación para el portafolio
  // Uso: portfolio.html
  // Objetivo: entrada escalonada de las tarjetas .card
  function animatePortfolio(){
      var cards = document.querySelectorAll('.card');
      if (cards && cards.length) {
        anime({ targets: cards, translateY: [18,0], opacity: [0,1], delay: anime.stagger(90), easing: 'easeOutCubic', duration: 600 });
      }
    }

  // Animación para Cloud & Data
  // Uso: cloud&analytics.html
  // Objetivo: revelar .skills-group y badges con un leve desplazamiento
  function animateCloud(){
      var groups = document.querySelectorAll('.skills-group');
      if (groups && groups.length) {
        anime({ targets: groups, translateX: [24,0], opacity: [0,1], delay: anime.stagger(100), easing: 'easeOutExpo', duration: 640 });
      }
    }

  // Animación para Gestión de Proyectos (certificaciones)
  // Uso: project-management.html
  // Objetivo: animar .cert-card y rotar/encuadrar logos de proveedores (.cert-provider img)
  function animateCerts(){
      var certs = document.querySelectorAll('.cert-card');
      var logos = document.querySelectorAll('.cert-provider img');
      if (certs && certs.length) {
        anime.timeline({ easing: 'easeOutExpo' })
          .add({ targets: certs, translateY: [18,0], opacity: [0,1], delay: anime.stagger(120), duration: 700 })
          .add({ targets: logos, rotate: [-8,0], scale: [0.92,1], opacity: [0,1], delay: anime.stagger(70), duration: 420 }, '-=480');
      }
    }

  // Animación sutil para objetos flotantes
  // Uso: varias páginas (index.html, portfolio.html, about.html, etc.)
  // Objetivo: entrada leve para .floating-item
  function animateFloating(){
      var floaters = document.querySelectorAll('.floating-item');
      if (floaters && floaters.length) {
        anime({ targets: floaters, translateY: [-10,0], opacity: [0,1], delay: anime.stagger(110), easing: 'easeOutSine', duration: 700 });
      }
    }

  // Animación genérica de encabezados
  // Uso: about.html, cv.html, blog.html
  // Objetivo: revelar elementos con .title-with-icon
  function animateHeading(){
      var headings = document.querySelectorAll('.title-with-icon');
      if (headings && headings.length) {
        anime({ targets: headings, translateX: [-18,0], opacity: [0,1], delay: anime.stagger(80), easing: 'easeOutExpo', duration: 580 });
      }
    }

    // Decide which animations to run based on filename
    var path = location.pathname.split('/').pop() || 'index.html';
    try {
      animateFloating();
      if (path === 'index.html' || path === '') animateHome();
      else if (path === 'portfolio.html') animatePortfolio();
      else if (path === 'cloud&analytics.html' || path === 'skills.html') animateCloud();
      else if (path === 'project-management.html') animateCerts();
      else animateHeading();
      // Configurar animaciones on-scroll (IntersectionObserver) para selectores
      // Estas animaciones se disparan cuando los elementos entran en el viewport
      // y se marcarán con data-animated para evitar repeticiones innecesarias.
      function setupScrollAnimations() {
        var observerOpts = { root: null, rootMargin: '0px 0px -10% 0px', threshold: 0.12 };

        function observeSelector(selector, animProps) {
          var nodes = document.querySelectorAll(selector);
          if (!nodes || nodes.length === 0) return;
          var io = new IntersectionObserver(function(entries, obs){
            entries.forEach(function(entry){
              if (!entry.isIntersecting) return;
              var el = entry.target;
              if (el.dataset && el.dataset.animated) { obs.unobserve(el); return; }
              // Ejecutar la animación para este elemento
              try {
                var props = Object.assign({}, animProps);
                props.targets = el;
                // Si la animación requiere un stagger por elemento y el selector
                // devuelve un grupo, se puede observar cada elemento por separado.
                window.anime(props);
              } catch(e) { /* ignorar errores de animación */ }
              if (el.dataset) el.dataset.animated = 'true';
              obs.unobserve(el);
            });
          }, observerOpts);
          nodes.forEach(function(n){ io.observe(n); });
        }

  // Registrar selectores comunes y sus propiedades de animación
        observeSelector('.card', { translateY: [16,0], opacity: [0,1], easing: 'easeOutCubic', duration: 520 });
        observeSelector('.skills-group', { translateX: [28,0], opacity: [0,1], easing: 'easeOutExpo', duration: 620 });
        observeSelector('.cert-card', { translateY: [18,0], opacity: [0,1], easing: 'easeOutExpo', duration: 700 });
        observeSelector('.cert-provider img', { rotate: [-8,0], scale: [0.92,1], opacity: [0,1], easing: 'easeOutBack', duration: 420 });
        observeSelector('.title-with-icon', { translateX: [-16,0], opacity: [0,1], easing: 'easeOutExpo', duration: 480 });
        observeSelector('.skill-item', { translateY: [10,0], opacity: [0,1], easing: 'easeOutSine', duration: 420 });
        observeSelector('.achievement-badge', { translateY: [12,0], opacity: [0,1], easing: 'easeOutExpo', duration: 520 });
      }

  try { setupScrollAnimations(); } catch(e) { /* ignorar */ }
    } catch (e) {
      // No permitir que la página falle si ocurre un error en la inicialización de animaciones
      console.warn('Animation init error', e);
    }
  });
})();