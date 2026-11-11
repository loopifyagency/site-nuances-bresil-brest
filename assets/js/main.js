/* ==========================================================================
   Nuances Brésil Brest Harteloire — « Le miroir »
   GSAP + ScrollTrigger + SplitText + Lenis. Tout est local (assets/vendor).
   Les fonctions « core » marchent sans GSAP ; le mouvement s'y ajoute.
   ========================================================================== */
(() => {
  'use strict';

  const doc = document.documentElement;
  const body = document.body;
  const $ = (s, c = document) => c.querySelector(s);
  const $$ = (s, c = document) => Array.from(c.querySelectorAll(s));
  const reduce = matchMedia('(prefers-reduced-motion: reduce)').matches;
  const fine = matchMedia('(hover: hover) and (pointer: fine)').matches;
  const isWide = () => matchMedia('(min-width: 900px)').matches;
  const NBSP = ' ';
  let lenis = null;

  /* ------------------------------------------------------------------
     Courbe « boucle » : cycloïde allongée (le fil rouge secondaire)
     ------------------------------------------------------------------ */
  function makeCurl(w, h, pitch, ratio, drift) {
    const a = pitch / (2 * Math.PI);
    const b = a * (1 + ratio);
    const turns = w / pitch;
    const steps = Math.ceil(turns * 34);
    const cy = h / 2;
    let d = '';
    for (let i = 0; i <= steps; i++) {
      const t = (i / steps) * turns * 2 * Math.PI;
      const x = b + a * t - b * Math.sin(t);
      const y = cy - b * Math.cos(t) + drift * Math.sin(t / 7.3);
      d += (i ? 'L' : 'M') + x.toFixed(1) + ' ' + y.toFixed(1) + ' ';
    }
    return d;
  }

  /* ------------------------------------------------------------------
     Horaires : statut ouvert / fermé à l'heure de Paris
     ------------------------------------------------------------------ */
  const HOURS = { 1: [540, 1140], 2: [540, 1140], 3: [540, 1140], 4: [540, 1140], 5: [540, 1140], 6: [540, 1080], 0: null };
  const DAYS_FR = ['dimanche', 'lundi', 'mardi', 'mercredi', 'jeudi', 'vendredi', 'samedi'];
  const WEEKDAY = { Sun: 0, Mon: 1, Tue: 2, Wed: 3, Thu: 4, Fri: 5, Sat: 6 };
  const fmtHour = (min) => { const h = Math.floor(min / 60), m = min % 60; return h + NBSP + 'h' + (m ? String(m).padStart(2, '0') : ''); };

  function parisNow() {
    const parts = new Intl.DateTimeFormat('en-US', { timeZone: 'Europe/Paris', weekday: 'short', hour: 'numeric', minute: 'numeric', hourCycle: 'h23' }).formatToParts(new Date());
    const get = (t) => parts.find((p) => p.type === t).value;
    return { day: WEEKDAY[get('weekday')], minutes: parseInt(get('hour'), 10) * 60 + parseInt(get('minute'), 10) };
  }

  function updateStatus() {
    let now;
    try { now = parisNow(); } catch (e) { return; }
    const today = HOURS[now.day];
    let text, open = false;
    if (today && now.minutes >= today[0] && now.minutes < today[1]) {
      open = true;
      text = 'Ouvert maintenant · jusqu’à ' + fmtHour(today[1]);
    } else if (today && now.minutes < today[0]) {
      text = 'Fermé · ouvre aujourd’hui à ' + fmtHour(today[0]);
    } else {
      let label = '';
      for (let i = 1; i <= 7; i++) {
        const d = (now.day + i) % 7;
        if (HOURS[d]) { label = (i === 1 ? 'demain' : DAYS_FR[d]) + ' à ' + fmtHour(HOURS[d][0]); break; }
      }
      text = 'Fermé · rouvre ' + label;
    }
    $$('[data-status]').forEach((el) => {
      el.classList.toggle('is-open', open);
      $('[data-status-text]', el).textContent = text;
    });
    $$('[data-hours] tr').forEach((tr) => tr.classList.toggle('is-today', parseInt(tr.dataset.day, 10) === now.day));
  }

  /* ------------------------------------------------------------------
     Menu mobile (ouverture en cercle gérée par le CSS)
     ------------------------------------------------------------------ */
  function setupMenu() {
    const burger = $('.burger');
    const menu = $('#menu');
    if (!burger || !menu) return;
    const set = (open) => {
      burger.setAttribute('aria-expanded', String(open));
      burger.setAttribute('aria-label', open ? 'Fermer le menu' : 'Ouvrir le menu');
      menu.classList.toggle('is-open', open);
      body.classList.toggle('menu-open', open);
      if (open) menu.removeAttribute('inert'); else menu.setAttribute('inert', '');
      if (lenis) open ? lenis.stop() : lenis.start();
      else body.style.overflow = open ? 'hidden' : '';
    };
    burger.addEventListener('click', () => set(burger.getAttribute('aria-expanded') !== 'true'));
    $$('[data-menu-link]').forEach((a) => a.addEventListener('click', () => set(false)));
    document.addEventListener('keydown', (e) => { if (e.key === 'Escape' && menu.classList.contains('is-open')) { set(false); burger.focus(); } });
    matchMedia('(min-width: 900px)').addEventListener('change', (e) => { if (e.matches) set(false); });
    window.__closeMenu = () => set(false);
  }

  /* ------------------------------------------------------------------
     Barre mobile : visible après l'accueil, masquée sur l'appel final
     ------------------------------------------------------------------ */
  function setupMobileBar() {
    const bar = $('[data-mbar]');
    if (!bar || !('IntersectionObserver' in window)) return;
    const state = { hero: true, cta: false, footer: false };
    const apply = () => bar.classList.toggle('is-visible', !state.hero && !state.cta && !state.footer);
    const watch = (sel, key) => {
      const el = $(sel); if (!el) return;
      new IntersectionObserver(([en]) => { state[key] = en.isIntersecting; apply(); }, { threshold: 0.18 }).observe(el);
    };
    watch('.hero', 'hero'); watch('.cta', 'cta'); watch('.footer', 'footer');
  }

  /* ------------------------------------------------------------------
     Avis : défilement natif + glisser à la souris + boutons + progression
     ------------------------------------------------------------------ */
  function setupReviews() {
    const rail = $('[data-rail]');
    if (!rail) return;
    rail.setAttribute('data-lenis-prevent', '');
    const bar = $('[data-review-bar]');
    const step = () => { const c = $('.review', rail); return c ? c.getBoundingClientRect().width + parseFloat(getComputedStyle(rail).columnGap || 16) : 360; };
    const update = () => {
      const max = rail.scrollWidth - rail.clientWidth;
      const p = max > 0 ? rail.scrollLeft / max : 1;
      if (bar) bar.style.transform = 'scaleX(' + (0.18 + 0.82 * p).toFixed(3) + ')';
    };
    rail.addEventListener('scroll', update, { passive: true });
    window.addEventListener('resize', update);
    update();
    const go = (dir) => rail.scrollBy({ left: dir * step(), behavior: reduce ? 'auto' : 'smooth' });
    $('[data-review-prev]').addEventListener('click', () => go(-1));
    $('[data-review-next]').addEventListener('click', () => go(1));

    let down = false, startX = 0, startLeft = 0, moved = 0;
    rail.addEventListener('pointerdown', (e) => {
      if (e.pointerType !== 'mouse' || e.button !== 0) return;
      down = true; moved = 0; startX = e.clientX; startLeft = rail.scrollLeft;
    });
    window.addEventListener('pointermove', (e) => {
      if (!down) return;
      const dx = e.clientX - startX; moved = Math.max(moved, Math.abs(dx));
      if (moved > 4) { rail.classList.add('is-dragging'); rail.scrollLeft = startLeft - dx; }
    });
    const end = () => {
      if (!down) return; down = false;
      if (rail.classList.contains('is-dragging')) {
        const target = Math.round(rail.scrollLeft / step()) * step();
        rail.classList.remove('is-dragging');
        rail.scrollTo({ left: target, behavior: reduce ? 'auto' : 'smooth' });
      }
    };
    window.addEventListener('pointerup', end);
    window.addEventListener('pointercancel', end);
  }

  /* ------------------------------------------------------------------
     Galerie : visionneuse (<dialog>)
     ------------------------------------------------------------------ */
  function setupLightbox() {
    const dlg = $('[data-lightbox-dialog]');
    if (!dlg || typeof dlg.showModal !== 'function') return;
    dlg.setAttribute('data-lenis-prevent', '');
    const items = [];
    $$('[data-lightbox]').forEach((btn) => {
      const img = $('img', btn);
      items[parseInt(btn.dataset.lightbox, 10)] = { src: img.currentSrc || img.src, alt: img.alt, cap: $('.shot__cap', btn).textContent, btn };
    });
    const imgEl = $('[data-lb-img]', dlg), capEl = $('[data-lb-cap]', dlg);
    let idx = 0, opener = null;
    const show = (i) => {
      idx = (i + items.length) % items.length;
      const it = items[idx];
      imgEl.src = it.src; imgEl.alt = it.alt; capEl.textContent = it.cap;
    };
    $$('[data-lightbox]').forEach((btn) => btn.addEventListener('click', () => {
      opener = btn; show(parseInt(btn.dataset.lightbox, 10)); dlg.showModal(); if (lenis) lenis.stop();
    }));
    $('[data-lb-close]', dlg).addEventListener('click', () => dlg.close());
    $('[data-lb-prev]', dlg).addEventListener('click', () => show(idx - 1));
    $('[data-lb-next]', dlg).addEventListener('click', () => show(idx + 1));
    dlg.addEventListener('click', (e) => { if (e.target === dlg) dlg.close(); });
    dlg.addEventListener('keydown', (e) => { if (e.key === 'ArrowLeft') show(idx - 1); if (e.key === 'ArrowRight') show(idx + 1); });
    dlg.addEventListener('close', () => { if (lenis) lenis.start(); if (opener) opener.focus(); });
  }

  /* ==================================================================
     MOUVEMENT
     ================================================================== */
  function motion() {
    gsap.registerPlugin(ScrollTrigger, SplitText);
    ScrollTrigger.config({ ignoreMobileResize: true });
    gsap.defaults({ ease: 'expo.out' });

    const heroImg = $('.hero__mirror .mirror__img');
    const header = $('[data-header]');
    const hero = $('.hero');
    const mm = gsap.matchMedia();

    /* ---------- Smooth scroll ---------- */
    if (!reduce && typeof Lenis !== 'undefined') {
      lenis = new Lenis({ lerp: 0.1, smoothWheel: true });
      lenis.on('scroll', ScrollTrigger.update);
      gsap.ticker.add((t) => lenis.raf(t * 1000));
      gsap.ticker.lagSmoothing(0);
    }

    $$('a[href^="#"]').forEach((a) => a.addEventListener('click', (e) => {
      const id = a.getAttribute('href');
      if (!id || id.length < 2) return;
      const target = $(id);
      if (!target) return;
      e.preventDefault();
      if (window.__closeMenu) window.__closeMenu();
      if (lenis) lenis.scrollTo(id === '#accueil' ? 0 : target, { duration: 1.7, easing: (t) => 1 - Math.pow(1 - t, 4) });
      else target.scrollIntoView({ behavior: reduce ? 'auto' : 'smooth' });
    }));

    /* ---------- Fils (courbes dessinées) ---------- */
    $$('[data-curl]').forEach((path) => {
      const [w, h, pitch, ratio, drift] = path.dataset.curl.split(',').map(Number);
      path.setAttribute('d', makeCurl(w, h, pitch, ratio, drift));
      path.setAttribute('pathLength', '1');
      path.style.strokeDasharray = '1';
      path.style.strokeDashoffset = reduce ? '0' : '1';
    });

    if (reduce) { reducedBehaviours(); window.__nbReady = true; return; }

    /* ---------- Animations d'entrée de l'accueil (préparées, jouées après le préchargeur) ---------- */
    const intro = gsap.timeline({ paused: true, defaults: { ease: 'expo.out' } });
    intro
      .from('.hero__wall', { xPercent: 10, opacity: 0, duration: 1.8 }, 0)
      .from('.hero__line-in', { yPercent: 115, duration: 1.5, stagger: 0.12 }, 0.1)
      .from('.hero__lead, .hero__actions > *', { y: 30, opacity: 0, duration: 1.2, stagger: 0.1 }, 0.4)
      .from('.hero__mirror', { scale: 0.86, opacity: 0, duration: 1.6 }, 0.15)
      .from('.hero__mirror2', { scale: 0.4, opacity: 0, duration: 1.4 }, 0.5)
      .from('.badge', { scale: 0, rotation: -120, duration: 1.4 }, 0.65)
      .from('.bulbs--hero .bulb', { yPercent: -115, duration: 1.8, stagger: 0.14 }, 0.25)
      .from('.hero__scroll', { opacity: 0, y: 20, duration: 1 }, 1.1)
      .fromTo('.hero__curl path', { strokeDashoffset: 1 }, { strokeDashoffset: 0, duration: 2.6, ease: 'power2.inOut' }, 0.4);

    /* ---------- Préchargeur : un anneau se dessine, puis s'ouvre en cercle sur l'accueil ---------- */
    const loader = $('.loader');
    const startLoader = () => {
      const ring = $('.loader__ring');
      const name = $('.loader__name');
      const pct = $('[data-pct]');
      const proxy = { p: 0, r: 64 };
      const split = SplitText.create(name, { type: 'chars', mask: 'chars', charsClass: 'l-char' });
      const imgReady = heroImg && !heroImg.complete ? new Promise((r) => { heroImg.addEventListener('load', r, { once: true }); heroImg.addEventListener('error', r, { once: true }); setTimeout(r, 4000); }) : Promise.resolve();
      const ready = Promise.all([document.fonts ? document.fonts.ready : Promise.resolve(), imgReady]);

      const tl = gsap.timeline();
      tl.from(split.chars, { yPercent: 115, duration: 0.9, stagger: 0.035 }, 0.1)
        .to(ring, { strokeDashoffset: 0, duration: 1.5, ease: 'power2.inOut' }, 0)
        .to(proxy, { p: 100, duration: 1.7, ease: 'power1.inOut', onUpdate: () => { pct.textContent = Math.round(proxy.p); } }, 0);

      Promise.all([tl.then(), ready]).then(() => {
        const maxR = Math.hypot(innerWidth, innerHeight) / 2 + 60;
        const draw = () => { hero.style.clipPath = 'circle(' + proxy.r + 'px at 50% 50%)'; ring.setAttribute('r', proxy.r); };
        draw();
        const open = gsap.timeline({ onComplete: finishLoader });
        open
          .to([name, pct.parentElement], { yPercent: -30, opacity: 0, duration: 0.55, ease: 'power3.in' }, 0)
          .to(proxy, { r: maxR, duration: 1.45, ease: 'expo.inOut', onUpdate: draw }, 0.08)
          .to(ring, { opacity: 0, duration: 0.5, ease: 'power2.in' }, 0.95)
          .add(() => intro.play(), 0.45);
        if (lenis) lenis.stop();
      });
    };
    const finishLoader = () => {
      hero.style.clipPath = '';
      loader.remove();
      doc.classList.remove('is-loading');
      body.classList.remove('is-loading');
      if (lenis) lenis.start();
      ScrollTrigger.refresh();
      gsap.fromTo(header, { yPercent: -110 }, { yPercent: 0, duration: 1.1, clearProps: 'transform' });
    };
    doc.classList.add('is-loading');
    body.classList.add('is-loading');
    startLoader();

    /* ---------- En-tête : se cache en descendant, revient en remontant ---------- */
    let headerHidden = false;
    ScrollTrigger.create({
      start: 0, end: 'max',
      onUpdate: (self) => {
        const y = self.scroll();
        header.classList.toggle('is-solid', y > 40);
        const hide = y > 260 && self.direction === 1 && !body.classList.contains('menu-open');
        if (hide !== headerHidden && (hide || self.direction === -1 || y <= 260)) {
          headerHidden = hide;
          gsap.to(header, { yPercent: hide ? -110 : 0, duration: 0.6, ease: 'power3.out', overwrite: true });
        }
      },
    });

    gsap.to('.progress span', { scaleX: 1, ease: 'none', scrollTrigger: { start: 0, end: 'max', scrub: 0.2 } });

    /* ---------- Titres : lignes masquées qui montent ---------- */
    $$('[data-split]').forEach((el) => {
      let played = false;
      SplitText.create(el, {
        type: 'lines', mask: 'lines', linesClass: 'split-line', maskClass: 'split-mask', autoSplit: true,
        onSplit: (self) => {
          if (played) return;
          return gsap.from(self.lines, {
            yPercent: 112, duration: 1.3, stagger: 0.09,
            scrollTrigger: { trigger: el, start: 'top 86%', once: true },
            onComplete: () => { played = true; },
          });
        },
      });
    });
    $$('[data-fade]').forEach((el) => gsap.from(el, { y: 26, opacity: 0, duration: 1.2, scrollTrigger: { trigger: el, start: 'top 92%', once: true } }));

    /* ---------- Accueil : parallax multicouche + reflet + ampoules ---------- */
    if (isWide()) {
      const st = { trigger: hero, start: 'top top', end: 'bottom top', scrub: true };
      gsap.to('.hero__wall', { yPercent: 8, ease: 'none', scrollTrigger: st });
      gsap.to('.hero__copy', { yPercent: -10, ease: 'none', scrollTrigger: st });
      gsap.to('.hero__mirror', { yPercent: -7, ease: 'none', scrollTrigger: st });
      gsap.to('.hero__mirror .mirror__img', { yPercent: 9, scale: 1.12, ease: 'none', scrollTrigger: st });
      gsap.to('.hero__mirror2', { yPercent: -34, ease: 'none', scrollTrigger: st });
      gsap.to('.badge', { yPercent: -60, rotation: 40, ease: 'none', scrollTrigger: st });
      gsap.to('.hero__curl', { yPercent: -22, ease: 'none', scrollTrigger: st });
    }
    $$('.mirror__sheen').forEach((s) => gsap.set(s, { xPercent: -30 }));
    $$('.mirror').forEach((m) => {
      const sheen = $('.mirror__sheen', m);
      if (!sheen) return;
      gsap.fromTo(sheen, { xPercent: -45 }, { xPercent: 45, ease: 'none', scrollTrigger: { trigger: m, start: 'top bottom', end: 'bottom top', scrub: 0.6 } });
    });

    $$('.bulb').forEach((b, i) => {
      gsap.to($('.bulb__in', b), { rotation: (i % 2 ? 1 : -1) * (2.2 + (i % 3) * 0.7), duration: 2.6 + (i % 3) * 0.6, ease: 'sine.inOut', yoyo: true, repeat: -1, transformOrigin: '50% 0%' });
    });
    if (fine) {
      const setters = $$('.bulb').map((b) => gsap.quickTo(b, 'rotation', { duration: 1.4, ease: 'power3.out' }));
      window.addEventListener('pointermove', (e) => {
        const x = e.clientX / innerWidth - 0.5;
        setters.forEach((set, i) => set(x * -9 * (1 + (i % 3) * 0.2)));
      }, { passive: true });
    }

    /* ---------- Bandeaux : défilement infini, vitesse et sens suivent le scroll ---------- */
    const bandTweens = $$('.band').map((band) => {
      const dir = parseInt(band.dataset.dir, 10);
      const track = $('.band__track', band);
      const tween = gsap.fromTo(track, { xPercent: dir < 0 ? 0 : -50 }, { xPercent: dir < 0 ? -50 : 0, duration: 38, ease: 'none', repeat: -1 });
      return tween;
    });
    ScrollTrigger.create({
      trigger: '[data-bands]', start: 'top bottom', end: 'bottom top',
      onUpdate: (self) => {
        const boost = gsap.utils.clamp(0, 5, Math.abs(self.getVelocity()) / 420);
        const target = (self.direction || 1) * (1 + boost);
        bandTweens.forEach((t) => gsap.to(t, { timeScale: target, duration: 0.5, overwrite: true }));
      },
      onLeave: () => bandTweens.forEach((t) => gsap.to(t, { timeScale: 1, duration: 0.6 })),
      onLeaveBack: () => bandTweens.forEach((t) => gsap.to(t, { timeScale: 1, duration: 0.6 })),
    });

    /* ---------- Le salon : section pinnée, un miroir qui s'ouvre quatre fois ---------- */
    mm.add('(min-width: 900px) and (prefers-reduced-motion: no-preference)', () => {
      const pin = $('[data-story-pin]');
      const chapters = $$('.chapter', pin);
      const texts = chapters.map((c) => $('.chapter__text', c));
      const glass = chapters.map((c) => $('.mirror__glass', c));
      const imgs = chapters.map((c) => $('img', c));
      const dots = $$('.story__dots li', pin);
      const open = 'circle(76% at 50% 50%)', shut = 'circle(0% at 50% 50%)';
      texts.forEach((t, i) => gsap.set(t, i ? { autoAlpha: 0, yPercent: 10 } : {}));
      glass.forEach((g, i) => gsap.set(g, { clipPath: i ? shut : open }));
      const setDot = (n) => dots.forEach((d, i) => d.classList.toggle('is-on', i === n));
      setDot(0);

      const tl = gsap.timeline({
        defaults: { ease: 'none' },
        scrollTrigger: { trigger: pin, start: 'top top', end: '+=330%', pin: true, scrub: 0.7, anticipatePin: 1, onUpdate: () => setDot(gsap.utils.clamp(0, chapters.length - 1, Math.round(tl.time()))) },
      });
      chapters.forEach((c, i) => {
        if (!i) return;
        tl.to(texts[i - 1], { autoAlpha: 0, yPercent: -10, duration: 0.38, ease: 'power2.in' }, i - 0.28)
          .to(glass[i], { clipPath: open, duration: 0.8, ease: 'power2.inOut' }, i - 0.3)
          .fromTo(imgs[i], { scale: 1.3 }, { scale: 1, duration: 1, ease: 'power2.out' }, i - 0.3)
          .fromTo(texts[i], { autoAlpha: 0, yPercent: 10 }, { autoAlpha: 1, yPercent: 0, duration: 0.5, ease: 'power2.out' }, i + 0.08);
      });
      tl.to({}, { duration: 0.55 });
      return () => { dots.forEach((d) => d.classList.remove('is-on')); };
    });
    mm.add('(max-width: 899px)', () => {
      $$('.chapter').forEach((c) => {
        gsap.fromTo($('.mirror__glass', c), { clipPath: 'circle(0% at 50% 50%)' }, { clipPath: 'circle(76% at 50% 50%)', duration: 1.5, scrollTrigger: { trigger: c, start: 'top 75%', once: true } });
        gsap.from($('.chapter__text', c), { y: 36, opacity: 0, duration: 1.2, scrollTrigger: { trigger: c, start: 'top 82%', once: true } });
      });
    });

    /* ---------- Prestations : entrée en cascade + inclinaison 3D avec reflet ---------- */
    gsap.from('.svc', { y: 70, opacity: 0, duration: 1.3, stagger: 0.11, scrollTrigger: { trigger: '.services__grid', start: 'top 84%', once: true } });
    gsap.from('.svc__mirror', { scale: 0.6, opacity: 0, duration: 1.6, delay: 0.3, stagger: 0.2, scrollTrigger: { trigger: '.services__grid', start: 'top 80%', once: true } });
    if (fine && isWide()) {
      $$('[data-tilt]').forEach((card) => {
        gsap.set(card, { transformPerspective: 1300 });
        const rx = gsap.quickTo(card, 'rotationX', { duration: 0.7, ease: 'power3.out' });
        const ry = gsap.quickTo(card, 'rotationY', { duration: 0.7, ease: 'power3.out' });
        card.addEventListener('pointermove', (e) => {
          const r = card.getBoundingClientRect();
          const px = (e.clientX - r.left) / r.width, py = (e.clientY - r.top) / r.height;
          ry((px - 0.5) * 10); rx(-(py - 0.5) * 10);
          card.style.setProperty('--mx', (px * 100).toFixed(1) + '%');
          card.style.setProperty('--my', (py * 100).toFixed(1) + '%');
        });
        card.addEventListener('pointerleave', () => { rx(0); ry(0); });
      });
    }

    /* ---------- La visite : défilement horizontal piloté par le scroll vertical ---------- */
    mm.add('(min-width: 900px) and (prefers-reduced-motion: no-preference)', () => {
      const pin = $('[data-visit-pin]');
      const track = $('[data-visit-track]');
      const thread = $('[data-visit-curl]');
      const bar = $('.visit__bar span');
      const dist = () => Math.max(0, track.scrollWidth - window.innerWidth);
      const drawThread = () => {
        const svg = thread.ownerSVGElement;
        const w = track.scrollWidth, h = pin.clientHeight;
        svg.setAttribute('width', w); svg.setAttribute('height', h); svg.setAttribute('viewBox', '0 0 ' + w + ' ' + h);
        thread.setAttribute('d', makeCurl(w, h, 150, 0.52, h * 0.1));
        thread.setAttribute('pathLength', '1');
        thread.style.strokeDasharray = '1';
      };
      drawThread();
      const move = gsap.to(track, {
        x: () => -dist(), ease: 'none',
        scrollTrigger: { trigger: pin, start: 'top top', end: () => '+=' + dist(), pin: true, scrub: 0.9, anticipatePin: 1, invalidateOnRefresh: true, onRefreshInit: drawThread },
      });
      const scrubbed = { trigger: pin, start: 'top top', end: () => '+=' + dist(), scrub: 0.9, invalidateOnRefresh: true };
      gsap.fromTo(thread, { strokeDashoffset: 1 }, { strokeDashoffset: 0, ease: 'none', scrollTrigger: scrubbed });
      gsap.fromTo(bar, { scaleX: 0 }, { scaleX: 1, ease: 'none', scrollTrigger: scrubbed });
      $$('.step', track).forEach((step) => {
        const trig = { trigger: step, containerAnimation: move, start: 'left 92%', toggleActions: 'play none none reverse' };
        gsap.from($('.step__body', step), { y: 50, opacity: 0, duration: 1.1, scrollTrigger: trig });
        const g = $('.mirror__glass', step);
        gsap.fromTo(g, { clipPath: 'circle(0% at 50% 50%)' }, { clipPath: 'circle(76% at 50% 50%)', duration: 1.4, scrollTrigger: trig });
        gsap.from($('.step__n', step), { scale: 0, duration: 0.9, delay: 0.3, scrollTrigger: trig });
      });
    });

    /* ---------- Le vrac : le flacon se remplit ---------- */
    const liquid = $('.bottle__liquid');
    if (liquid) {
      gsap.fromTo(liquid, { scaleY: 0.04 }, { scaleY: 1, ease: 'none', scrollTrigger: { trigger: '[data-bottle]', start: 'top 82%', end: 'bottom 38%', scrub: 0.7 } });
      gsap.from('.vrac__list li', { y: 36, opacity: 0, duration: 1.1, stagger: 0.14, scrollTrigger: { trigger: '.vrac__list', start: 'top 88%', once: true } });
    }

    /* ---------- Chiffres : compteurs à rouleaux dans la phrase ---------- */
    $$('.odo').forEach((odo) => {
      const val = odo.dataset.odo;
      odo.textContent = '';
      [...val].forEach((ch, i) => {
        const digit = document.createElement('span'); digit.className = 'odo__digit';
        const reel = document.createElement('span'); reel.className = 'odo__reel';
        for (let n = 0; n < 10; n++) { const s = document.createElement('span'); s.textContent = n; reel.appendChild(s); }
        digit.appendChild(reel); odo.appendChild(digit);
        gsap.to(reel, { yPercent: -10 * parseInt(ch, 10), duration: 2.6 + i * 0.5, ease: 'expo.out', scrollTrigger: { trigger: '[data-figures]', start: 'top 62%', once: true } });
      });
    });
    gsap.from('.figures__sentence', { y: 40, opacity: 0, duration: 1.4, scrollTrigger: { trigger: '[data-figures]', start: 'top 78%', once: true } });
    gsap.fromTo('.figures__ring', { scale: 0.7 }, { scale: 1.05, ease: 'none', scrollTrigger: { trigger: '[data-figures]', start: 'top bottom', end: 'bottom top', scrub: true } });

    /* ---------- Galerie : cercles qui s'ouvrent, colonnes à vitesses différentes, inclinaison au survol ---------- */
    $$('.shot').forEach((shot) => {
      const btn = $('.shot__btn', shot);
      gsap.fromTo(btn, { clipPath: 'circle(0% at 50% 50%)' }, { clipPath: 'circle(82% at 50% 50%)', duration: 1.7, ease: 'expo.out', scrollTrigger: { trigger: shot, start: 'top 90%', once: true }, onComplete: () => { btn.style.clipPath = 'none'; } });
      gsap.fromTo($('img', btn), { yPercent: -6 }, { yPercent: 6, ease: 'none', scrollTrigger: { trigger: shot, start: 'top bottom', end: 'bottom top', scrub: true } });
      if (fine && isWide()) {
        gsap.set(shot, { transformPerspective: 1100 });
        const rx = gsap.quickTo(shot, 'rotationX', { duration: 0.8, ease: 'power3.out' });
        const ry = gsap.quickTo(shot, 'rotationY', { duration: 0.8, ease: 'power3.out' });
        shot.addEventListener('pointermove', (e) => {
          const r = shot.getBoundingClientRect();
          ry(((e.clientX - r.left) / r.width - 0.5) * 8); rx(-((e.clientY - r.top) / r.height - 0.5) * 8);
        });
        shot.addEventListener('pointerleave', () => { rx(0); ry(0); });
      }
    });
    if (isWide()) {
      $$('.gallery__col').forEach((col) => {
        const speed = parseFloat(col.dataset.speed || '1');
        gsap.to(col, { y: (1 - speed) * 420, ease: 'none', scrollTrigger: { trigger: '.gallery__cols', start: 'top bottom', end: 'bottom top', scrub: 0.6 } });
      });
    }

    /* ---------- Avis ---------- */
    gsap.from('.review', { y: 80, opacity: 0, duration: 1.3, stagger: 0.1, scrollTrigger: { trigger: '[data-rail]', start: 'top 88%', once: true } });

    /* ---------- Appel à l'action : le miroir s'allume, le cercle d'ambre remplit la page ---------- */
    const cta = $('[data-cta]');
    gsap.fromTo('.cta__flood', { '--r': '0%' }, { '--r': '130%', ease: 'none', scrollTrigger: { trigger: cta, start: 'top 88%', end: 'top 4%', scrub: 0.5 } });
    gsap.from('.cta__actions > *', { y: 50, opacity: 0, duration: 1.3, stagger: 0.15, scrollTrigger: { trigger: '.cta__actions', start: 'top 92%', once: true } });
    gsap.from('.cta .bulb', { yPercent: -120, duration: 1.8, stagger: 0.15, scrollTrigger: { trigger: cta, start: 'top 60%', once: true } });

    /* ---------- Nous trouver ---------- */
    gsap.fromTo('.contact__map .mirror__glass', { clipPath: 'circle(0% at 50% 50%)' }, { clipPath: 'circle(76% at 50% 50%)', duration: 1.8, scrollTrigger: { trigger: '.contact__visual', start: 'top 82%', once: true } });
    gsap.from('.contact__facade', { y: 70, rotation: -12, opacity: 0, duration: 1.6, delay: 0.25, scrollTrigger: { trigger: '.contact__visual', start: 'top 78%', once: true } });
    gsap.from('.contact__info > *:not(h2)', { y: 30, opacity: 0, duration: 1.1, stagger: 0.09, scrollTrigger: { trigger: '.contact__info', start: 'top 80%', once: true } });

    /* ---------- Pied de page : le grand nom monte lettre par lettre ---------- */
    const fname = $('[data-footer-name]');
    if (fname) {
      const fs = SplitText.create(fname, { type: 'chars', mask: 'chars', charsClass: 'f-char', maskClass: 'split-mask' });
      gsap.from(fs.chars, { yPercent: 112, duration: 1.5, stagger: 0.04, scrollTrigger: { trigger: '.footer', start: 'top 75%', once: true } });
    }

    /* ---------- Boutons magnétiques ---------- */
    if (fine && isWide()) {
      const mags = $$('[data-magnetic]').map((el) => ({ el, x: gsap.quickTo(el, 'x', { duration: 0.8, ease: 'elastic.out(1, 0.5)' }), y: gsap.quickTo(el, 'y', { duration: 0.8, ease: 'elastic.out(1, 0.5)' }) }));
      window.addEventListener('pointermove', (e) => {
        mags.forEach((m) => {
          const r = m.el.getBoundingClientRect();
          const cx = r.left + r.width / 2, cy = r.top + r.height / 2;
          const dx = e.clientX - cx, dy = e.clientY - cy;
          const near = Math.hypot(dx, dy) < r.width * 0.85;
          m.x(near ? dx * 0.32 : 0); m.y(near ? dy * 0.32 : 0);
        });
      }, { passive: true });
    }

    /* ---------- Curseur ---------- */
    const cursor = $('.cursor');
    if (cursor && fine) {
      const label = $('.cursor__label', cursor);
      const cx = gsap.quickTo(cursor, 'x', { duration: 0.35, ease: 'power3.out' });
      const cy = gsap.quickTo(cursor, 'y', { duration: 0.35, ease: 'power3.out' });
      let seen = false;
      window.addEventListener('pointermove', (e) => {
        cx(e.clientX); cy(e.clientY);
        if (!seen) { seen = true; gsap.to(cursor, { opacity: 1, duration: 0.4 }); }
      }, { passive: true });
      document.addEventListener('pointerover', (e) => {
        const t = e.target;
        let scale = 1, text = '';
        if (t.closest('[data-lightbox]')) { scale = 2.3; text = 'Voir'; }
        else if (t.closest('[data-rail]')) { scale = 2.3; text = 'Glisser'; }
        else if (t.closest('a, button, [data-tilt]')) { scale = 1.6; }
        label.textContent = text;
        gsap.to(cursor, { scale, duration: 0.45, overwrite: 'auto' });
      });
      document.addEventListener('pointerleave', () => gsap.to(cursor, { opacity: 0, duration: 0.3 }));
    }

    /* ---------- Rafraîchir les mesures quand tout est chargé ---------- */
    window.addEventListener('load', () => ScrollTrigger.refresh());
    if (document.fonts) document.fonts.ready.then(() => ScrollTrigger.refresh());

    window.__nbReady = true;
  }

  /* Mouvement réduit : tout est affiché tel quel, seules les fonctions utiles restent. */
  function reducedBehaviours() {
    const loader = $('.loader'); if (loader) loader.remove();
    $$('.band__group[aria-hidden="true"]').forEach((g) => g.remove());
    $$('.bulb').forEach((b) => (b.style.transform = 'none'));
    const liquid = $('.bottle__liquid'); if (liquid) liquid.style.transform = 'scaleY(1)';
    const header = $('[data-header]');
    const onScroll = () => header.classList.toggle('is-solid', window.scrollY > 40);
    window.addEventListener('scroll', onScroll, { passive: true }); onScroll();
  }

  /* ------------------------------------------------------------------ */
  function init() {
    updateStatus();
    setInterval(updateStatus, 60000);
    setupMenu();
    setupMobileBar();
    setupReviews();
    setupLightbox();
    if (window.gsap && window.ScrollTrigger && window.SplitText) {
      try { motion(); } catch (err) {
        console.error('[nuances] animation désactivée :', err);
        doc.className = 'no-js';
        body.classList.remove('is-loading');
        const l = $('.loader'); if (l) l.remove();
        window.__nbReady = true;
      }
    }
  }
  if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', init); else init();
})();
