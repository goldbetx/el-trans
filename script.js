/* =========================================================
   EL TRANS — JavaScript i përbashkët (vanilla, pa framework)
   Detyrat:
     1) Menyja hamburger
     2) Animacionet e shfaqjes (fade-in + slide-up) në scroll
     3) Numëratorët (count-up)
     4) Udhëtimi i kamionit i lidhur me scroll-in (vetëm faqja kryesore)
     5) Hartat Leaflet me pamje të errët (destinacionet + kontakti)
   ========================================================= */

// A i ka çaktivizuar përdoruesi animacionet?
const reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

/* ---------- 1) MENYJA HAMBURGER ---------- */
const navToggle = document.querySelector('.nav-toggle');
const mainNav = document.querySelector('.main-nav');
if (navToggle && mainNav) {
  navToggle.addEventListener('click', () => {
    const isOpen = mainNav.classList.toggle('open');
    navToggle.setAttribute('aria-expanded', isOpen ? 'true' : 'false');
  });
}

/* ---------- 2) ANIMACIONET E SHFAQJES ---------- */
// Cilat elemente shfaqen me fade + slide kur hyjnë në ekran.
const revealSelector =
  '.section-title, .section-sub, .eyebrow, .card, .value, .service-row, ' +
  '.gallery-grid figure, .stat, .about-grid > div, .about-img, ' +
  '.contact-info, .contact-form, .hero-text';

if (!reduceMotion) {
  const revealEls = document.querySelectorAll(revealSelector);
  revealEls.forEach(el => el.classList.add('reveal'));

  const revealObserver = new IntersectionObserver((entries, obs) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add('in');
        obs.unobserve(entry.target); // një herë mjafton
      }
    });
  }, { threshold: 0.15, rootMargin: '0px 0px -40px 0px' });

  revealEls.forEach(el => revealObserver.observe(el));
}

/* ---------- 3) NUMËRATORËT (count-up) ---------- */
function countUp(el) {
  const target = parseInt(el.dataset.target, 10);
  const suffix = el.dataset.suffix || '';
  const duration = 1600;
  const start = performance.now();
  function tick(now) {
    const progress = Math.min((now - start) / duration, 1);
    const eased = 1 - Math.pow(1 - progress, 3); // ease-out
    el.textContent = Math.round(eased * target) + suffix;
    if (progress < 1) requestAnimationFrame(tick);
  }
  requestAnimationFrame(tick);
}

const statNums = document.querySelectorAll('.stat-num');
if (statNums.length) {
  const statObserver = new IntersectionObserver((entries, obs) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        countUp(entry.target);
        obs.unobserve(entry.target);
      }
    });
  }, { threshold: 0.5 });
  statNums.forEach(num => statObserver.observe(num));
}

/* ---------- 4) UDHËTIMI I KAMIONIT (scroll-driven) ----------
   Kamioni ndjek një vijë rrugore. Pozicioni i tij përcaktohet
   DREJTPËRDREJT nga sa larg ke skroluar brenda seksionit .journey.
   Poshtë = përpara, lart = mbrapa. Pa GPS, vetëm SVG.
*/
const journey = document.querySelector('.journey');
const journeySvg = document.getElementById('journey-svg');

if (journey && journeySvg) {
  const SVGNS = 'http://www.w3.org/2000/svg';

  // Koordinatat në sistemin e viewBox (1000 x 600), të projektuara
  // sipas pozicionit real gjeografik të secilit shtet.
  const cities = [
    [546, 395], // Elbasan (Shqipëri) — nisja
    [700, 472], // Greqi
    [603, 374], // Maqedoni e Veriut
    [561, 305], // Serbi
    [682, 356], // Bullgari
    [800, 314], // Rumani
    [226, 376], // Itali
    [389, 222], // Austri
    [264, 116]  // Gjermani — mbërritja
  ];

  // Emrat sipas gjuhës së faqes
  const labels = (document.documentElement.lang === 'en')
    ? ['Elbasan', 'Greece', 'North Macedonia', 'Serbia', 'Bulgaria', 'Romania', 'Italy', 'Austria', 'Germany']
    : ['Elbasan', 'Greqi', 'Maqedoni e Veriut', 'Serbi', 'Bullgari', 'Rumani', 'Itali', 'Austri', 'Gjermani'];

  // Ndërto string-un "d" të vijës nga pikat
  let d = 'M ' + cities[0][0] + ' ' + cities[0][1];
  for (let i = 1; i < cities.length; i++) d += ' L ' + cities[i][0] + ' ' + cities[i][1];

  const routeBg = document.getElementById('route-bg');
  const routeProg = document.getElementById('route-progress');
  routeBg.setAttribute('d', d);
  routeProg.setAttribute('d', d);

  const total = routeBg.getTotalLength();
  routeProg.style.strokeDasharray = total;
  routeProg.style.strokeDashoffset = total;

  // Sa larg (0–1) ndodhet çdo pin përgjatë rrugës
  const fracs = [0];
  let cum = 0;
  for (let i = 1; i < cities.length; i++) {
    cum += Math.hypot(cities[i][0] - cities[i - 1][0], cities[i][1] - cities[i - 1][1]);
    fracs.push(cum);
  }
  for (let i = 0; i < fracs.length; i++) fracs[i] = fracs[i] / cum;

  // Vendos pinat + etiketat
  const pinsG = document.getElementById('pins');
  const pinEls = [];
  cities.forEach((c, i) => {
    const g = document.createElementNS(SVGNS, 'g');
    g.setAttribute('class', 'pin');
    g.setAttribute('transform', `translate(${c[0]},${c[1]})`);

    const circle = document.createElementNS(SVGNS, 'circle');
    circle.setAttribute('r', '6');
    g.appendChild(circle);

    const t = document.createElementNS(SVGNS, 'text');
    t.setAttribute('text-anchor', 'middle');
    t.setAttribute('y', i === 1 ? '24' : '-14'); // Greqia poshtë, pjesa tjetër lart
    t.setAttribute('class', 'pin-label');
    t.textContent = labels[i];
    g.appendChild(t);

    pinsG.appendChild(g);
    pinEls.push(g);
  });

  const truck = document.getElementById('truck');

  // Përditëson pozicionin sipas scroll-it
  function update() {
    const travel = journey.offsetHeight - window.innerHeight;
    const progress = Math.max(0, Math.min(1, (-journey.getBoundingClientRect().top) / travel));

    // Pozicioni i kamionit përgjatë vijës (kamioni mbetet vertikal për lexueshmëri)
    const pt = routeBg.getPointAtLength(progress * total);
    truck.setAttribute('transform', `translate(${pt.x}, ${pt.y})`);

    // "Vizato" pjesën e përshkruar të rrugës
    routeProg.style.strokeDashoffset = total * (1 - progress);

    // Ndez pinat një nga një kur kamioni i kalon
    pinEls.forEach((el, i) => {
      el.classList.toggle('lit', progress + 0.0005 >= fracs[i]);
    });
  }

  // rAF për performancë të mirë (edhe në celular)
  let ticking = false;
  function onScroll() {
    if (!ticking) {
      requestAnimationFrame(() => { update(); ticking = false; });
      ticking = true;
    }
  }
  window.addEventListener('scroll', onScroll, { passive: true });
  window.addEventListener('resize', update);
  update(); // pozicioni fillestar
}

/* ---------- 5) HARTAT LEAFLET (pamje e errët) ---------- */
// Pllaka të errëta falas nga CartoDB (përshtaten me temën luks).
const DARK_TILES = 'https://{s}.basemaps.cartocdn.com/dark_all/{z}/{x}/{y}.png';
const TILE_ATTR =
  '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> &copy; <a href="https://carto.com/attributions">CARTO</a>';

// 5a) Harta e destinacioneve te faqja kryesore (vetëm statike, pa GPS)
const mapEl = document.getElementById('map');
if (mapEl && window.L) {
  const elbasan = [41.1125, 20.0822];
  const map = L.map('map', { scrollWheelZoom: false }).setView([43.5, 21.0], 5);
  L.tileLayer(DARK_TILES, { attribution: TILE_ATTR, maxZoom: 18 }).addTo(map);

  const destinations = [
    ['Shqipëri', 41.3275, 19.8187], ['Kosovë', 42.6629, 21.1655],
    ['Greqi', 37.9838, 23.7275], ['Maqedoni e Veriut', 41.9981, 21.4254],
    ['Serbi', 44.7866, 20.4489], ['Bullgari', 42.6977, 23.3219],
    ['Rumani', 44.4268, 26.1025], ['Turqi', 41.0082, 28.9784],
    ['Itali', 41.9028, 12.4964], ['Gjermani', 52.5200, 13.4050],
    ['Austri', 48.2082, 16.3738]
  ];

  const homeIcon = L.divIcon({
    className: 'home-pin',
    html: '<div style="background:#C9A24B;width:16px;height:16px;border-radius:50%;border:3px solid #111418;box-shadow:0 0 10px #C9A24B;"></div>',
    iconSize: [16, 16]
  });
  L.marker(elbasan, { icon: homeIcon }).addTo(map)
    .bindPopup('<strong>EL TRANS</strong><br>Elbasan, Shqipëri (qendra)');

  destinations.forEach(([name, lat, lng]) => {
    L.circleMarker([lat, lng], { radius: 5, color: '#C9A24B', fillColor: '#C9A24B', fillOpacity: 0.9, weight: 1 })
      .addTo(map).bindPopup(name);
    L.polyline([elbasan, [lat, lng]], { color: '#C9A24B', weight: 1.5, opacity: 0.55 }).addTo(map);
  });
}

// 5b) Harta e vogël te faqja e kontaktit
const contactMapEl = document.getElementById('contact-map');
if (contactMapEl && window.L) {
  const office = [41.1125, 20.0822];
  const cmap = L.map('contact-map', { scrollWheelZoom: false }).setView(office, 14);
  L.tileLayer(DARK_TILES, { attribution: TILE_ATTR, maxZoom: 18 }).addTo(cmap);

  const officeIcon = L.divIcon({
    className: 'home-pin',
    html: '<div style="background:#C9A24B;width:16px;height:16px;border-radius:50%;border:3px solid #111418;box-shadow:0 0 10px #C9A24B;"></div>',
    iconSize: [16, 16]
  });
  L.marker(office, { icon: officeIcon }).addTo(cmap)
    .bindPopup('<strong>EL TRANS</strong><br>Rruga Kadri Hoxha, Elbasan').openPopup();
}
