const prefersReducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
const ready = (fn) => {
  if (document.readyState !== "loading") fn();
  else document.addEventListener("DOMContentLoaded", fn, { once: true });
};

ready(() => {
  initIcons();
  initHeader();
  initMenu();
  initPreloader();
  initScrollProgress();
  initBackToTop();
  initStickyContrast();
  initClickRipples();
  initNativeReveals();
  initLenis();
  initHeroCanvas();
  initGsap();
  initSwipers();
  initTilt();
  initFaq();
  initTabs();
  initCounters();
  initGallery();
  initFilters();
  initMatterPieces();
  initMagneticButtons();
  initLottie();
  initMotionOne();
  initAnimeTouches();
});

function initIcons() {
  window.lucide?.createIcons();
}

function initHeader() {
  const header = document.querySelector(".site-header");
  if (!header) return;
  let lastY = window.scrollY;
  const sync = () => {
    const currentY = window.scrollY;
    header.classList.toggle("is-scrolled", currentY > 18);
    header.classList.toggle("is-hidden", currentY > lastY && currentY > 420);
    lastY = currentY;
  };
  sync();
  window.addEventListener("scroll", sync, { passive: true });
}

function initMenu() {
  const toggle = document.querySelector(".menu-toggle");
  const links = document.querySelector(".nav__links");
  if (!toggle || !links) return;
  toggle.addEventListener("click", () => {
    const open = !links.classList.contains("is-open");
    links.classList.toggle("is-open", open);
    toggle.setAttribute("aria-expanded", String(open));
  });
}

function initPreloader() {
  const preloader = document.querySelector(".preloader");
  if (!preloader || prefersReducedMotion) return;
  window.addEventListener("load", () => {
    window.setTimeout(() => preloader.classList.add("is-hidden"), 650);
  }, { once: true });
}

function initLenis() {
  if (prefersReducedMotion || !window.Lenis) return;
  const lenis = new window.Lenis({ lerp: .075, wheelMultiplier: .92, touchMultiplier: 1.15, smoothWheel: true });
  window.chococrazeLenis = lenis;
  function raf(time) {
    lenis.raf(time);
    window.ScrollTrigger?.update();
    requestAnimationFrame(raf);
  }
  requestAnimationFrame(raf);
}

function initScrollProgress() {
  let bar = document.querySelector(".scroll-progress");
  if (!bar) {
    bar = document.createElement("div");
    bar.className = "scroll-progress";
    bar.setAttribute("aria-hidden", "true");
    document.body.prepend(bar);
  }
  const sync = () => {
    const max = document.documentElement.scrollHeight - window.innerHeight;
    const progress = max > 0 ? window.scrollY / max : 0;
    bar.style.transform = `scaleX(${Math.max(0, Math.min(1, progress))})`;
  };
  sync();
  window.addEventListener("scroll", sync, { passive: true });
  window.addEventListener("resize", sync);
}

function initBackToTop() {
  let button = document.querySelector(".back-to-top");
  if (!button) {
    button = document.createElement("button");
    button.className = "back-to-top icon-btn";
    button.type = "button";
    button.setAttribute("aria-label", "Back to top");
    button.innerHTML = '<i data-lucide="arrow-up"></i>';
    document.body.append(button);
    initIcons();
  }
  const sync = () => button.classList.toggle("is-visible", window.scrollY > window.innerHeight * .85);
  sync();
  window.addEventListener("scroll", sync, { passive: true });
  button.addEventListener("click", () => {
    if (window.chococrazeLenis) window.chococrazeLenis.scrollTo(0);
    else window.scrollTo({ top: 0, behavior: prefersReducedMotion ? "auto" : "smooth" });
  });
}

function initStickyContrast() {
  const sync = () => {
    const x = Math.min(window.innerWidth - 24, Math.max(24, window.innerWidth - 92));
    const y = Math.min(window.innerHeight - 24, Math.max(24, window.innerHeight - 108));
    const section = document.elementFromPoint(x, y)?.closest(".section--dark, .site-footer, .hero, .page-hero");
    document.body.classList.toggle("sticky-on-dark", Boolean(section));
  };
  sync();
  window.addEventListener("scroll", sync, { passive: true });
  window.addEventListener("resize", sync);
}

function initClickRipples() {
  if (prefersReducedMotion) return;
  document.addEventListener("click", (event) => {
    const target = event.target.closest(".btn, .icon-btn, .tab, .filter-bar button, .product-card__quick a");
    if (!target) return;
    const rect = target.getBoundingClientRect();
    const ripple = document.createElement("span");
    ripple.className = "ripple";
    ripple.style.left = `${event.clientX - rect.left}px`;
    ripple.style.top = `${event.clientY - rect.top}px`;
    target.append(ripple);
    window.setTimeout(() => ripple.remove(), 700);
  });
}

function initNativeReveals() {
  const revealItems = document.querySelectorAll(".product-card, .gallery-tile, .gallery-spotlight a, .suggested-item, .add-on, .utility-panel");
  if (!revealItems.length || !("IntersectionObserver" in window) || window.gsap || prefersReducedMotion) return;
  revealItems.forEach((item) => {
    item.style.opacity = "0";
    item.style.transform = "translateY(22px)";
    item.style.transition = "opacity .7s ease, transform .7s cubic-bezier(.22, 1, .36, 1)";
  });
  const observer = new IntersectionObserver((entries) => {
    entries.forEach((entry) => {
      if (!entry.isIntersecting) return;
      entry.target.style.opacity = "1";
      entry.target.style.transform = "translateY(0)";
      observer.unobserve(entry.target);
    });
  }, { threshold: .16 });
  revealItems.forEach((item) => observer.observe(item));
}

async function initHeroCanvas() {
  const canvas = document.querySelector(".hero__canvas");
  if (!canvas || prefersReducedMotion) return;
  let THREE;
  try {
    THREE = await import("https://cdn.jsdelivr.net/npm/three/build/three.module.js");
  } catch {
    initCanvasFallback(canvas);
    return;
  }

  const scene = new THREE.Scene();
  const camera = new THREE.PerspectiveCamera(55, 1, .1, 100);
  camera.position.z = 7;
  const renderer = new THREE.WebGLRenderer({ canvas, alpha: true, antialias: true });
  renderer.setPixelRatio(Math.min(window.devicePixelRatio, 1.7));

  const group = new THREE.Group();
  scene.add(group);
  const material = new THREE.MeshStandardMaterial({
    color: 0x5b2d20,
    roughness: .42,
    metalness: .08,
  });

  for (let i = 0; i < 28; i += 1) {
    const geometry = i % 3 === 0
      ? new THREE.BoxGeometry(.34, .22, .16)
      : new THREE.IcosahedronGeometry(.16, 0);
    const piece = new THREE.Mesh(geometry, material);
    piece.position.set((Math.random() - .5) * 10, (Math.random() - .5) * 6, (Math.random() - .5) * 5);
    piece.rotation.set(Math.random() * Math.PI, Math.random() * Math.PI, 0);
    piece.userData.speed = .002 + Math.random() * .006;
    group.add(piece);
  }

  scene.add(new THREE.AmbientLight(0xffecd5, 1.4));
  const key = new THREE.PointLight(0xf2b484, 2.5, 16);
  key.position.set(3, 2, 4);
  scene.add(key);

  const resize = () => {
    const rect = canvas.getBoundingClientRect();
    renderer.setSize(rect.width, rect.height, false);
    camera.aspect = rect.width / Math.max(rect.height, 1);
    camera.updateProjectionMatrix();
  };
  resize();
  window.addEventListener("resize", resize);

  const animate = () => {
    group.rotation.y += .0018;
    group.children.forEach((piece) => {
      piece.rotation.x += piece.userData.speed;
      piece.rotation.y += piece.userData.speed * .7;
    });
    renderer.render(scene, camera);
    requestAnimationFrame(animate);
  };
  animate();
}

function initCanvasFallback(canvas) {
  const ctx = canvas.getContext("2d");
  if (!ctx) return;
  const pieces = Array.from({ length: 24 }, () => ({
    x: Math.random(),
    y: Math.random(),
    r: 5 + Math.random() * 15,
    s: .15 + Math.random() * .5,
  }));
  const resize = () => {
    const rect = canvas.getBoundingClientRect();
    canvas.width = Math.max(1, Math.floor(rect.width * Math.min(window.devicePixelRatio, 1.6)));
    canvas.height = Math.max(1, Math.floor(rect.height * Math.min(window.devicePixelRatio, 1.6)));
  };
  resize();
  window.addEventListener("resize", resize);
  const draw = () => {
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    ctx.fillStyle = "rgba(216, 168, 93, .42)";
    pieces.forEach((piece) => {
      piece.y = (piece.y + piece.s / 1000) % 1;
      ctx.beginPath();
      ctx.ellipse(piece.x * canvas.width, piece.y * canvas.height, piece.r * 1.7, piece.r, Math.PI / 5, 0, Math.PI * 2);
      ctx.fill();
    });
    requestAnimationFrame(draw);
  };
  draw();
}

function initGsap() {
  if (!window.gsap || prefersReducedMotion) return;
  const { gsap } = window;
  window.ScrollTrigger && gsap.registerPlugin(window.ScrollTrigger);
  window.Flip && gsap.registerPlugin(window.Flip);
  window.SplitText && gsap.registerPlugin(window.SplitText);

  document.querySelectorAll("[data-split]").forEach((el) => {
    if (!window.SplitText) return;
    window.SplitText.create(el, {
      type: "lines, words",
      mask: "lines",
      autoSplit: true,
      onSplit(self) {
        return gsap.from(self.words, {
          yPercent: 110,
          opacity: 0,
          duration: .9,
          stagger: .025,
          ease: "power3.out",
        });
      },
    });
  });

  gsap.utils.toArray("[data-reveal]").forEach((el) => {
    gsap.from(el, {
      y: 54,
      opacity: 0,
      duration: 1,
      ease: "power3.out",
      scrollTrigger: { trigger: el, start: "top 84%" },
    });
  });

  gsap.utils.toArray(".section").forEach((section) => {
    gsap.from(section.querySelectorAll(".section-kicker, .section-title, .section-copy, .section-cta"), {
      y: 28,
      opacity: 0,
      duration: .8,
      stagger: .08,
      ease: "power3.out",
      scrollTrigger: { trigger: section, start: "top 78%" },
    });
  });

  gsap.utils.toArray("[data-parallax]").forEach((el) => {
    gsap.to(el, {
      yPercent: -10,
      ease: "none",
      scrollTrigger: { trigger: el, scrub: true },
    });
  });
}

function initSwipers() {
  if (!window.Swiper) return;
  document.querySelectorAll(".product-swiper").forEach((el) => {
    new window.Swiper(el, {
      slidesPerView: 1.15,
      spaceBetween: 22,
      loop: true,
      autoplay: prefersReducedMotion ? false : { delay: 3200, disableOnInteraction: false },
      pagination: { el: el.querySelector(".swiper-pagination"), clickable: true },
      navigation: {
        nextEl: el.parentElement?.querySelector(".swiper-next"),
        prevEl: el.parentElement?.querySelector(".swiper-prev"),
      },
      breakpoints: {
        680: { slidesPerView: 2.05 },
        980: { slidesPerView: 3 },
      },
    });
  });

  document.querySelectorAll(".review-swiper").forEach((el) => {
    new window.Swiper(el, {
      slidesPerView: 1,
      spaceBetween: 18,
      loop: true,
      autoplay: prefersReducedMotion ? false : { delay: 4200 },
      breakpoints: { 820: { slidesPerView: 2.1 } },
    });
  });
}

function initTilt() {
  if (prefersReducedMotion || !window.VanillaTilt) return;
  window.VanillaTilt.init(document.querySelectorAll("[data-tilt]"), {
    max: 6,
    speed: 600,
    glare: true,
    "max-glare": .18,
  });
}

function initFaq() {
  document.querySelectorAll(".faq-item button").forEach((button) => {
    button.addEventListener("click", () => {
      const item = button.closest(".faq-item");
      const open = !item.classList.contains("is-open");
      item.classList.toggle("is-open", open);
      button.setAttribute("aria-expanded", String(open));
    });
  });
}

function initTabs() {
  document.querySelectorAll("[data-tabs]").forEach((tabs) => {
    const buttons = [...tabs.querySelectorAll(".tab")];
    const panels = buttons.map((button) => document.getElementById(button.getAttribute("aria-controls")));
    buttons.forEach((button, index) => {
      button.addEventListener("click", () => {
        buttons.forEach((btn, btnIndex) => btn.setAttribute("aria-selected", String(btnIndex === index)));
        panels.forEach((panel, panelIndex) => {
          if (panel) panel.hidden = panelIndex !== index;
        });
      });
    });
  });
}

function initCounters() {
  const counters = document.querySelectorAll("[data-count]");
  if (!counters.length || !("IntersectionObserver" in window)) return;
  const observer = new IntersectionObserver((entries) => {
    entries.forEach((entry) => {
      if (!entry.isIntersecting) return;
      const el = entry.target;
      const value = Number(el.dataset.count || 0);
      if (window.countUp?.CountUp) {
        const count = new window.countUp.CountUp(el, value, { duration: 2, separator: "," });
        count.start();
      } else {
        el.textContent = value.toLocaleString();
      }
      observer.unobserve(el);
    });
  }, { threshold: .45 });
  counters.forEach((counter) => observer.observe(counter));
}

function initGallery() {
  if (!window.lightGallery) return;
  document.querySelectorAll("[data-gallery]").forEach((gallery) => {
    window.lightGallery(gallery, { selector: "a", download: false, counter: false });
  });
}

function initFilters() {
  document.querySelectorAll("[data-filter-group]").forEach((group) => {
    const grid = document.querySelector(group.dataset.target);
    if (!grid) return;
    const useIsotope = window.Isotope && grid.id !== "product-grid";
    const isotope = useIsotope ? new window.Isotope(grid, { itemSelector: "[data-category]" }) : null;
    group.addEventListener("click", (event) => {
      const button = event.target.closest("button[data-filter]");
      if (!button) return;
      group.querySelectorAll("button").forEach((btn) => btn.classList.toggle("is-active", btn === button));
      const filter = button.dataset.filter;
      if (isotope) isotope.arrange({ filter });
      else grid.querySelectorAll("[data-category]").forEach((item) => {
        item.hidden = filter !== "*" && !item.matches(filter);
        item.style.position = "";
        item.style.left = "";
        item.style.top = "";
        item.style.transform = "";
      });
    });
  });
}

function initMatterPieces() {
  const canvas = document.querySelector(".matter-chocolates");
  if (!canvas || prefersReducedMotion || !window.Matter) return;
  const { Engine, Render, Runner, Bodies, Composite, Mouse, MouseConstraint } = window.Matter;
  const engine = Engine.create();
  const render = Render.create({
    canvas,
    engine,
    options: {
      width: canvas.clientWidth,
      height: canvas.clientHeight,
      background: "transparent",
      wireframes: false,
      pixelRatio: Math.min(window.devicePixelRatio, 1.6),
    },
  });
  const width = canvas.clientWidth;
  const height = canvas.clientHeight;
  const pieces = Array.from({ length: 24 }, (_, i) => Bodies.rectangle(
    36 + (i % 8) * 58,
    28 + Math.floor(i / 8) * 42,
    36,
    24,
    { chamfer: { radius: 6 }, render: { fillStyle: i % 2 ? "#4d281d" : "#2a1510" } },
  ));
  Composite.add(engine.world, [
    Bodies.rectangle(width / 2, height + 20, width, 36, { isStatic: true, render: { visible: false } }),
    ...pieces,
    MouseConstraint.create(engine, { mouse: Mouse.create(canvas), constraint: { stiffness: .2, render: { visible: false } } }),
  ]);
  Render.run(render);
  Runner.run(Runner.create(), engine);
}

function initMagneticButtons() {
  if (prefersReducedMotion) return;
  document.querySelectorAll(".btn").forEach((button) => {
    button.addEventListener("pointermove", (event) => {
      const rect = button.getBoundingClientRect();
      const x = (event.clientX - rect.left - rect.width / 2) * .18;
      const y = (event.clientY - rect.top - rect.height / 2) * .18;
      button.style.transform = `translate(${x}px, ${y}px)`;
    });
    button.addEventListener("pointerleave", () => {
      button.style.transform = "";
    });
  });
}

function initLottie() {
  const target = document.querySelector(".preloader__lottie");
  if (!target || !window.lottie || prefersReducedMotion) return;
  window.lottie.loadAnimation({
    container: target,
    renderer: "svg",
    loop: true,
    autoplay: true,
    path: target.dataset.lottie,
  });
}

function initMotionOne() {
  if (!window.Motion || prefersReducedMotion) return;
  document.querySelectorAll("[data-motion-pop]").forEach((el) => {
    el.addEventListener("mouseenter", () => window.Motion.animate(el, { scale: 1.025 }, { duration: .24 }));
    el.addEventListener("mouseleave", () => window.Motion.animate(el, { scale: 1 }, { duration: .24 }));
  });
}

function initAnimeTouches() {
  if (!window.anime || prefersReducedMotion) return;
  window.anime({
    targets: ".hero__pill",
    translateY: [-5, 5],
    direction: "alternate",
    loop: true,
    duration: 2600,
    delay: window.anime.stagger(180),
    easing: "easeInOutSine",
  });
  window.anime({
    targets: ".taste-dock a",
    translateX: [-4, 4],
    direction: "alternate",
    loop: true,
    duration: 3200,
    delay: window.anime.stagger(220),
    easing: "easeInOutSine",
  });
}
