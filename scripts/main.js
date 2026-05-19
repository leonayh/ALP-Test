/* ══════════════════════════════════════════════════════════
   ALP demo — main.js
   包含：
   ① Hero intro（comment #2：H1 黃底左→右，然後段落淡入）
   ② Hero scroll expand（comment #1：phase A 原地撐滿、phase B natural）
   ③ KPI count-up（comment #3）
   ④ Highlights sticky slides（comment #4）
   ⑤ 通用 scroll-reveal（.reveal / .hl-bar）
   ⑥ Solution title sticky（comment #5）— 由 CSS 處理
   ⑦ Solution card hover scale 1.1（comment #6）— CSS 處理
   ⑧ News card hover scale 1.1（comment #7）— CSS 處理
   ⑨ Map fade-in 降級版（comment #8 完整版需要分層素材）
══════════════════════════════════════════════════════════ */

'use strict';

/* ─── Easing ─── */
const easeOut   = t => 1 - Math.pow(1 - t, 3);
const easeInOut = t => t < 0.5 ? 4*t*t*t : 1 - Math.pow(-2*t + 2, 3) / 2;

function tween(duration, step, done) {
  const start = performance.now();
  (function tick(now) {
    const raw = Math.min((now - start) / duration, 1);
    step(raw);
    if (raw < 1) requestAnimationFrame(tick);
    else if (done) done();
  })(performance.now());
}

function wait(ms, fn) { setTimeout(fn, ms); }

const isMobile = () => window.innerWidth <= 768;


/* ══════════════════════════════════════════════════════════
   ⓪ FLUID SCALE — 1440 → 1920 等比放大 (Option B)
   1440 為設計基準。1440 < w < 1920：body zoom = w/1440。
   w >= 1920：鎖在 1.3333x（避免無限放大）。
   w <= 1440：不放大，交給原 RWD media queries (1280/1024/768/480)。
   用 `zoom` 而非 `transform: scale()` 是因為:
   - 不會破壞 position:sticky (hero / highlights 都靠它)
   - vh/vw 仍以實際 viewport 計算 (banner/highlights 的 100vh 機制不受影響)
   - scrollY/offsetTop 仍以 CSS px (zoom 前) 為單位，hero scroll 數學不需要改
══════════════════════════════════════════════════════════ */
(function fluidScaleModule() {
  const BASE_W = 1440;
  const MAX_W  = 1920;
  const MAX_SCALE = MAX_W / BASE_W;   // 1.3333…

  function applyScale() {
    const w = window.innerWidth;
    let scale = 1;
    if (w > BASE_W) {
      scale = Math.min(w / BASE_W, MAX_SCALE);
    }
    document.body.style.zoom = (scale === 1) ? '' : String(scale);
    document.documentElement.style.setProperty('--body-zoom', String(scale));
  }

  applyScale();
  window.addEventListener('resize', applyScale);
})();


/* ══════════════════════════════════════════════════════════
   ① ② HERO — intro sequence + scroll expand
══════════════════════════════════════════════════════════ */
(function heroModule() {
  const banner    = document.getElementById('banner');
  const stage     = document.getElementById('banner-stage') || banner;
  const textBlock = document.getElementById('banner-text');
  const line1     = document.getElementById('banner-line1');
  const line2     = document.getElementById('banner-line2');
  const hlBar     = document.getElementById('banner-hl');
  const heroFrame = document.getElementById('hero-frame');
  const heroVideo = heroFrame ? heroFrame.querySelector('video') : null;
  const scrollHint= document.getElementById('scroll-hint');
  const pauseBtn  = document.getElementById('banner-pause');

  if (!banner || !heroFrame) return;

  /* ── Pause button (Figma node 47:6545)
     顯示時機：hero 進入 fullscreen 後 (由 onScrollHero 控制 is-visible) */
  if (pauseBtn && heroVideo) {
    pauseBtn.addEventListener('click', () => {
      if (heroVideo.paused) {
        heroVideo.play();
        pauseBtn.classList.remove('is-paused');
        pauseBtn.setAttribute('aria-label', 'Pause hero video');
      } else {
        heroVideo.pause();
        pauseBtn.classList.add('is-paused');
        pauseBtn.setAttribute('aria-label', 'Play hero video');
      }
    });
  }

  /* ── Geometry (Figma node 2326:825 → w480 h120 @ (341, 258) in 1440×720 title area) ──
     Width scales with banner width (1440 base).
     Height/Y scale with banner height (720 base — Figma title 區). */
  function heroInitial() {
    if (isMobile()) {
      // 手機：鎖在 stage 下 40% 區域
      const bh = stage.offsetHeight;
      return {
        width:  stage.offsetWidth,
        height: Math.round(bh * 0.42),
        top:    Math.round(bh * 0.58),
        left:   0,
      };
    }
    const bw     = stage.offsetWidth;
    const bh     = stage.offsetHeight;
    const scaleX = bw / 1440;
    const scaleY = bh / 720;
    return {
      width:  Math.round(480 * scaleX),
      height: Math.round(120 * scaleY),
      top:    Math.round(258 * scaleY),   // Figma y=258 in 720 title
      left:   Math.round(341 * scaleX),   // Figma x=341
    };
  }

  function heroFinal() {
    return {
      width:  stage.offsetWidth,
      height: stage.offsetHeight,
      top:    0,
      left:   0,
    };
  }

  function applyGeom(g) {
    heroFrame.style.top    = g.top    + 'px';
    heroFrame.style.left   = g.left   + 'px';
    heroFrame.style.width  = g.width  + 'px';
    heroFrame.style.height = g.height + 'px';
    if (heroVideo) heroVideo.style.height = g.height + 'px';
  }

  /* 初始位置（fonts 還沒 ready 時先放一個大概的位置） */
  if (!isMobile()) applyGeom(heroInitial());

  /* ── Intro sequence (comment #2)
     順序：line1 淡入 → 黃底 scaleX 0→1 → line2 淡入 → Hero frame fade in → scroll hint */
  let introPlayed = false;
  function playIntro() {
    if (introPlayed) return;
    introPlayed = true;

    wait(200, () => {
      /* 1. line1 fade in */
      line1.classList.add('is-visible');
      wait(400, () => {
        /* 2. yellow bar scaleX */
        hlBar.classList.add('is-visible');
        wait(550, () => {
          /* 3. line2 fade in */
          line2.classList.add('is-visible');
          wait(250, () => {
            /* 4. hero frame fade in */
            heroFrame.classList.add('is-visible');
            wait(400, () => {
              /* 5. scroll hint */
              if (scrollHint) scrollHint.style.opacity = '1';
            });
          });
        });
      });
    });
  }

  /* Fonts 載完後正確定位 hero + 播 intro */
  if (document.fonts && document.fonts.ready) {
    document.fonts.ready.then(() => {
      if (!isMobile()) applyGeom(heroInitial());
      playIntro();
    });
  } else {
    playIntro();
  }

  /* ── Scroll expand (comment #1)
     banner = 200vh sticky driver；stage = 100vh 黏在視窗。
     Expand 行程 = banner.offsetHeight - stage.offsetHeight（= 100vh）。
     行程內：hero 原地放大到滿版（頁面不會真的往下滑，被 sticky 鎖住）。
     行程結束後：sticky 釋放，整個 banner 自然離開視窗。 */
  function onScrollHero() {
    if (isMobile()) return;   // 手機不做 expand 動畫

    const scrollY    = window.scrollY || document.documentElement.scrollTop;
    const bannerTop  = banner.offsetTop;
    const expandDist = Math.max(1, banner.offsetHeight - stage.offsetHeight);
    const raw        = (scrollY - bannerTop) / expandDist;

    if (raw <= 0) {
      applyGeom(heroInitial());
      heroFrame.classList.remove('is-fullscreen');
      if (introPlayed && scrollHint) scrollHint.style.opacity = '1';
      if (pauseBtn) pauseBtn.classList.remove('is-visible');
      return;
    }

    if (raw >= 1) {
      applyGeom(heroFinal());
      heroFrame.classList.add('is-fullscreen');
      if (scrollHint) scrollHint.style.opacity = '0';
      if (pauseBtn) pauseBtn.classList.add('is-visible');
      return;
    }

    const p    = easeInOut(raw);
    const from = heroInitial();
    const to   = heroFinal();

    applyGeom({
      width:  Math.round(from.width  + (to.width  - from.width)  * p),
      height: Math.round(from.height + (to.height - from.height) * p),
      top:    Math.round(from.top    + (to.top    - from.top)    * p),
      left:   Math.round(from.left   + (to.left   - from.left)   * p),
    });

    heroFrame.classList.toggle('is-fullscreen', p > 0.85);
    if (pauseBtn) pauseBtn.classList.toggle('is-visible', p > 0.85);
    if (scrollHint) scrollHint.style.opacity = String(Math.max(0, 1 - raw * 3));
  }

  window.addEventListener('scroll', onScrollHero, { passive: true });
  window.addEventListener('resize', () => {
    if (!isMobile() && window.scrollY < banner.offsetTop + 10) {
      applyGeom(heroInitial());
    }
    onScrollHero();
  });
})();


/* ══════════════════════════════════════════════════════════
   ③ KPI COUNT-UP (comment #3)
══════════════════════════════════════════════════════════ */
(function kpiCountUp() {
  const nums = document.querySelectorAll('.kpi__number[data-target]');
  if (!nums.length) return;

  function countUp(el) {
    const target  = parseFloat(el.dataset.target);
    const suffix  = el.dataset.suffix || '';
    const isFloat = el.dataset.target.includes('.');
    const dur     = 1800;
    const start   = performance.now();
    (function tick(now) {
      const raw = Math.min((now - start) / dur, 1);
      const val = easeOut(raw) * target;
      el.textContent = (isFloat ? val.toFixed(1) : Math.floor(val)) + suffix;
      if (raw < 1) requestAnimationFrame(tick);
      else el.textContent = (isFloat ? target.toFixed(1) : target) + suffix;
    })(performance.now());
  }

  const obs = new IntersectionObserver(entries => {
    entries.forEach(e => {
      if (e.isIntersecting) {
        obs.unobserve(e.target);
        countUp(e.target);
      }
    });
  }, { threshold: 0.5 });

  nums.forEach(n => obs.observe(n));
})();


/* ══════════════════════════════════════════════════════════
   ④ HIGHLIGHTS — sticky slides (comment #4)
══════════════════════════════════════════════════════════ */
(function highlightsModule() {
  const section = document.getElementById('section-highlights');
  const slides  = [0, 1, 2].map(i => document.getElementById('hl-slide-' + i));
  /* 共用一份 title-list,3 個 item 各自切換 is-active 來做變形動畫 */
  const titleItems = section
    ? section.querySelectorAll('.highlights__title-list .hl-item[data-slide]')
    : [];
  if (!section || !slides[0]) return;

  let currentIdx = -1;
  function setActive(idx) {
    if (idx === currentIdx) return;
    const prev = currentIdx;
    currentIdx = idx;
    slides.forEach((s, i) => {
      if (!s) return;
      s.classList.remove('is-active', 'is-prev');
      if (i === idx)      s.classList.add('is-active');
      else if (i === prev) s.classList.add('is-prev');
    });
    titleItems.forEach((t, i) => t.classList.toggle('is-active', i === idx));
  }

  function onScrollHl() {
    if (isMobile()) {
      setActive(0);
      return;
    }
    const rect = section.getBoundingClientRect();
    const vh   = window.innerHeight;
    if (rect.top > 0)      { setActive(0); return; }
    if (rect.bottom <= vh) { setActive(2); return; }
    /* 切換門檻 = CSS --hl-step（預設 400px，約滑鼠 4 下）。 */
    const stepPx = parseFloat(
      getComputedStyle(section).getPropertyValue('--hl-step')
    ) || 400;
    const idx = Math.min(Math.floor(Math.abs(rect.top) / stepPx), 2);
    setActive(idx);
  }

  setActive(0);
  window.addEventListener('scroll', onScrollHl, { passive: true });
  window.addEventListener('resize', onScrollHl);
  onScrollHl();

  /* 點 inactive item 跳到對應 slide */
  titleItems.forEach(item => {
    item.addEventListener('click', () => {
      if (item.classList.contains('is-active')) return;
      const idx = parseInt(item.dataset.slide, 10);
      if (isNaN(idx)) return;
      const stepPx = parseFloat(
        getComputedStyle(section).getPropertyValue('--hl-step')
      ) || 400;
      const offsetY = section.offsetTop + idx * stepPx + 10;
      window.scrollTo({ top: offsetY, behavior: 'smooth' });
    });
  });
})();


/* ══════════════════════════════════════════════════════════
   ⑤ SCROLL-REVEAL: .reveal + .hl-bar
══════════════════════════════════════════════════════════ */
(function scrollReveal() {
  const obs = new IntersectionObserver(entries => {
    entries.forEach(e => {
      if (e.isIntersecting) {
        obs.unobserve(e.target);
        e.target.classList.add('is-visible');
      }
    });
  }, { threshold: 0.15 });

  document.querySelectorAll('.reveal').forEach(el => obs.observe(el));

  /* hl-bar：可能獨立出現，也可能被 reveal 元素包著 */
  const barObs = new IntersectionObserver(entries => {
    entries.forEach(e => {
      if (e.isIntersecting) {
        barObs.unobserve(e.target);
        // 延遲一點讓文字先 reveal，再拉黃底
        setTimeout(() => e.target.classList.add('is-visible'), 120);
      }
    });
  }, { threshold: 0.2 });

  document.querySelectorAll('.hl-bar').forEach(el => barObs.observe(el));
})();


/* ══════════════════════════════════════════════════════════
   ⑩ HEADER — menu open/close + mobile accordion
══════════════════════════════════════════════════════════ */
(function headerMenu() {
  const header   = document.querySelector('.header');
  const btnOpen  = document.getElementById('btn-menu');
  const btnClose = document.getElementById('btn-close');   /* optional — hamburger morph 後就不再需要分開的 X */
  const panel    = document.getElementById('header-menu');
  if (!header || !btnOpen || !panel) return;

  function open()  {
    header.classList.add('is-menu-open');
    btnOpen.setAttribute('aria-expanded', 'true');
    panel.setAttribute('aria-hidden', 'false');
  }
  function close() {
    header.classList.remove('is-menu-open');
    btnOpen.setAttribute('aria-expanded', 'false');
    panel.setAttribute('aria-hidden', 'true');
    /* 收合時把所有 accordion row 關掉，下次開回來重置 */
    panel.querySelectorAll('.menu-row.is-open').forEach(r => r.classList.remove('is-open'));
  }

  btnOpen.addEventListener('click', () => {
    if (header.classList.contains('is-menu-open')) close(); else open();
  });
  if (btnClose) btnClose.addEventListener('click', close);
  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape' && header.classList.contains('is-menu-open')) close();
  });

  /* ── Mobile accordion (≤1024)
     點 primary 有子選單時：開啟此 row、自動收合其它 row（一次只開一個）
     desktop 不啟用（子選單永遠展開）。 */
  const ACCORDION_BP = 1024;
  panel.addEventListener('click', (e) => {
    if (window.innerWidth > ACCORDION_BP) return;
    const primary = e.target.closest('.menu-primary');
    if (!primary) return;
    const row = primary.closest('.menu-row');
    if (!row || row.dataset.hasSub !== 'true') return;
    e.preventDefault();
    const wasOpen = row.classList.contains('is-open');
    panel.querySelectorAll('.menu-row.is-open').forEach(r => r.classList.remove('is-open'));
    if (!wasOpen) row.classList.add('is-open');
  });

  /* resize 跨過 breakpoint 時，重置 accordion 狀態 */
  let lastBp = window.innerWidth > ACCORDION_BP;
  window.addEventListener('resize', () => {
    const nowBp = window.innerWidth > ACCORDION_BP;
    if (nowBp !== lastBp) {
      panel.querySelectorAll('.menu-row.is-open').forEach(r => r.classList.remove('is-open'));
      lastBp = nowBp;
    }
  });
})();


/* ══════════════════════════════════════════════════════════
   ⑩.5 HEADER — auto-hide on scroll
   往下捲時隱藏 header (transform translateY -100%)，往上捲時顯示。
   例外：仍在 hero (banner) 區內時保持顯示，不觸發隱藏動畫
   （per design — hero 區 header 不動）。
   選單開啟時也保持顯示（避免黑底飄走）。
══════════════════════════════════════════════════════════ */
(function headerScrollHide() {
  const header = document.querySelector('.header');
  const banner = document.getElementById('banner');
  if (!header) return;

  const HIDE_THRESHOLD = 80;     // 滾過 80px 後才開始觸發隱藏
  const DELTA_THRESHOLD = 6;     // 滾動量小於 6px 時忽略 (避免抖動)

  let lastY = window.scrollY || 0;
  let hidden = false;

  function inHero() {
    if (!banner) return false;
    const bottom = banner.offsetTop + banner.offsetHeight;
    return window.scrollY < bottom;
  }

  function show() {
    if (!hidden) return;
    header.classList.remove('is-hidden');
    hidden = false;
  }
  function hide() {
    if (hidden) return;
    header.classList.add('is-hidden');
    hidden = true;
  }

  let ticking = false;
  function onScroll() {
    if (ticking) return;
    ticking = true;
    requestAnimationFrame(() => {
      const y  = window.scrollY || 0;
      const dy = y - lastY;

      /* 選單開啟、在 hero 區、或剛載入靠近頂端 → 永遠顯示 */
      if (header.classList.contains('is-menu-open') || inHero() || y < HIDE_THRESHOLD) {
        show();
      } else if (Math.abs(dy) >= DELTA_THRESHOLD) {
        if (dy > 0)  hide();
        else         show();
      }

      lastY = y;
      ticking = false;
    });
  }

  window.addEventListener('scroll', onScroll, { passive: true });
  window.addEventListener('resize', onScroll);
})();


/* ══════════════════════════════════════════════════════════
   ⑨ MAP fade-in
══════════════════════════════════════════════════════════ */
(function mapModule() {
  const mapImg = document.getElementById('map-img');
  if (!mapImg) return;
  const obs = new IntersectionObserver(entries => {
    entries.forEach(e => {
      if (e.isIntersecting) {
        obs.unobserve(e.target);
        mapImg.classList.add('is-visible');
      }
    });
  }, { threshold: 0.2 });
  obs.observe(mapImg);
})();


/* ══════════════════════════════════════════════════════════
   ⑫ CTA — 色塊左→右掃入 + 內容延後進場
   時序：
     t=0      色塊開始 scaleX 掃入（0.9s 完成）
     t=0.95s  色塊到位 → 內容開始淡入（headline → sub → btns）
══════════════════════════════════════════════════════════ */
(function ctaModule() {
  const cta = document.querySelector('.cta');
  if (!cta) return;

  const obs = new IntersectionObserver(entries => {
    entries.forEach(e => {
      if (!e.isIntersecting) return;
      obs.unobserve(e.target);

      cta.classList.add('is-bg-in');
      setTimeout(() => {
        cta.classList.add('is-content-in');
      }, 950);
    });
  }, { threshold: 0.3 });

  obs.observe(cta);
})();


/* ══════════════════════════════════════════════════════════
   ⑬ SOLUTION CARDS — per-card 遮罩開啟 + label 淡入
   每張卡進視窗時加 .is-revealed；同排 stagger 由 CSS 處理。
══════════════════════════════════════════════════════════ */
(function solutionCardsReveal() {
  const cards = document.querySelectorAll('.solution__card');
  if (!cards.length) return;

  const obs = new IntersectionObserver(entries => {
    entries.forEach(e => {
      if (!e.isIntersecting) return;
      obs.unobserve(e.target);
      e.target.classList.add('is-revealed');
    });
  }, { threshold: 0.25 });

  cards.forEach(c => obs.observe(c));
})();


/* ══════════════════════════════════════════════════════════
   ⑪ LOGO TONE — 偵測 logo 後方元素的背景色，動態切 fill
   做法：取 logo 中心點，先把 logo 暫時關掉 pointer 事件、用
   document.elementFromPoint 找下方元素，往上回溯找到第一個有
   實際 background-color 的祖先，依其 luminance 判斷 light/dark。
   只在 scroll/resize 時觸發，throttle 到 rAF。
══════════════════════════════════════════════════════════ */
(function logoTone() {
  const logo = document.querySelector('.header__logo');
  if (!logo) return;

  function rgbToLuminance(rgbStr) {
    // 解析 "rgb(r, g, b)" 或 "rgba(r, g, b, a)"
    const m = rgbStr.match(/\d+(\.\d+)?/g);
    if (!m || m.length < 3) return null;
    const [r, g, b, a] = m.map(Number);
    // alpha 0 視為透明、不採信
    if (a !== undefined && a < 0.1) return null;
    // 簡化版相對亮度（Rec. 709）
    return (0.2126 * r + 0.7152 * g + 0.0722 * b) / 255;
  }

  function findEffectiveBg(el) {
    // 沿著 DOM 向上找，直到拿到不透明的背景色
    let node = el;
    while (node && node !== document.documentElement) {
      const bg = getComputedStyle(node).backgroundColor;
      const lum = rgbToLuminance(bg);
      if (lum !== null) return lum;
      node = node.parentElement;
    }
    // 全部透明 → 預設視為白底
    return 1;
  }

  function update() {
    const rect = logo.getBoundingClientRect();
    const cx = rect.left + rect.width / 2;
    const cy = rect.top + rect.height / 2;

    // 暫時讓 logo 不擋射線
    const prevPE = logo.style.pointerEvents;
    logo.style.pointerEvents = 'none';
    const below = document.elementFromPoint(cx, cy);
    logo.style.pointerEvents = prevPE;

    if (!below) return;

    const lum = findEffectiveBg(below);
    // luminance 0.5 是中間值；hero 黑底 ≈ 0、白底 = 1
    if (lum < 0.5) {
      logo.classList.add('is-on-dark');
      logo.classList.remove('is-on-light');
    } else {
      logo.classList.add('is-on-light');
      logo.classList.remove('is-on-dark');
    }
  }

  // rAF gate
  let ticking = false;
  function onScroll() {
    if (ticking) return;
    ticking = true;
    requestAnimationFrame(() => { update(); ticking = false; });
  }

  // 初始化
  if (document.fonts && document.fonts.ready) {
    document.fonts.ready.then(update);
  } else {
    update();
  }
  window.addEventListener('scroll', onScroll, { passive: true });
  window.addEventListener('resize', onScroll);
})();
