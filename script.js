/* ══════════════════════════════════════
   TORICO TAROT — script.js
   ══════════════════════════════════════ */

/* ──────────────────────────────────────
   1. セクション・リビール
   セクションが表示域に入ったら、直下要素を同時に表示
   ────────────────────────────────────── */
(function initSectionReveal() {
  const sections = document.querySelectorAll('section');
  if (!sections.length) return;

  document.documentElement.classList.add('is-js');

  const showSection = (section) => {
    Array.from(section.children).forEach((element) => {
      element.classList.add('is-visible');
    });
  };

  sections.forEach((section) => {
    Array.from(section.children).forEach((element) => {
      element.classList.add('section-reveal');
    });
  });

  const reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  if (!('IntersectionObserver' in window) || reduceMotion) {
    sections.forEach(showSection);
    return;
  }

  const observer = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (!entry.isIntersecting) return;
        showSection(entry.target);
        observer.unobserve(entry.target);
      });
    },
    { threshold: 0.14 }
  );

  sections.forEach((section) => observer.observe(section));
})();


/* ──────────────────────────────────────
   2. スティッキーバー制御
   ・HEROセクションが画面外に出たら表示
   ・CTAセクションに達したら非表示（重複防止）
   ────────────────────────────────────── */
(function initStickyBar() {
  const bar  = document.querySelector('.sticky-bar');
  const hero = document.querySelector('.hero');
  const cta  = document.querySelector('.cta-section');
  if (!bar || !hero) return;

  const heroObs = new IntersectionObserver(
    ([entry]) => {
      if (entry.isIntersecting) {
        bar.classList.add('is-hidden');    // HEROが見えてる → バーを隠す
      } else {
        bar.classList.remove('is-hidden'); // HEROが消えた → バーを出す
      }
    },
    { threshold: 0 }
  );
  heroObs.observe(hero);

  if (cta) {
    const ctaObs = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          bar.classList.add('is-hidden');    // CTAが見えてる → バーを隠す
        } else {
          bar.classList.remove('is-hidden');
        }
      },
      { threshold: 0.3 }
    );
    ctaObs.observe(cta);
  }
})();


/* ──────────────────────────────────────
   3. FAQアコーディオン
   <details> / <summary> はネイティブで動くが、
   アニメーションを滑らかにするための補助
   ────────────────────────────────────── */
(function initFaq() {
  const allDetails = document.querySelectorAll('details');

  allDetails.forEach((detail) => {
    detail.addEventListener('toggle', () => {
      // 他を閉じる（アコーディオン動作）
      if (detail.open) {
        allDetails.forEach((other) => {
          if (other !== detail && other.open) other.removeAttribute('open');
        });
      }
    });
  });
})();


/* ──────────────────────────────────────
   4. スムーズスクロール（href="#xxx" 対応）
   ────────────────────────────────────── */
(function initSmoothScroll() {
  document.querySelectorAll('a[href^="#"]').forEach((anchor) => {
    anchor.addEventListener('click', (e) => {
      const target = document.querySelector(anchor.getAttribute('href'));
      if (!target) return;
      e.preventDefault();
      target.scrollIntoView({ behavior: 'smooth', block: 'start' });
    });
  });
})();
