/* global gsap, ScrollTrigger */

const $ = (sel, root = document) => root.querySelector(sel);
const $$ = (sel, root = document) => Array.from(root.querySelectorAll(sel));

function prefersReducedMotion() {
  return window.matchMedia?.("(prefers-reduced-motion: reduce)")?.matches ?? false;
}

function clamp(n, min, max) {
  return Math.max(min, Math.min(max, n));
}

function initTheme() {
  const key = "portfolio-theme";
  const saved = localStorage.getItem(key);
  const root = document.documentElement;

  const apply = (theme) => {
    if (theme === "light") root.setAttribute("data-theme", "light");
    else root.removeAttribute("data-theme");
    localStorage.setItem(key, theme);
  };

  if (saved === "light" || saved === "dark") apply(saved);

  $("#themeToggle")?.addEventListener("click", () => {
    const isLight = root.getAttribute("data-theme") === "light";
    apply(isLight ? "dark" : "light");
  });
}

function initYear() {
  const el = $("#year");
  if (el) el.textContent = String(new Date().getFullYear());
}

function initScrollIndicator() {
  const bar = $("#scrollBar");
  if (!bar) return;

  const update = () => {
    const doc = document.documentElement;
    const max = doc.scrollHeight - doc.clientHeight;
    const p = max <= 0 ? 0 : doc.scrollTop / max;
    bar.style.transform = `scaleY(${clamp(p, 0, 1)})`;
  };

  update();
  window.addEventListener("scroll", update, { passive: true });
  window.addEventListener("resize", update);
}

function initTypeLoop() {
  const el = $("#typeText");
  if (!el) return;
  const items = ["Visual Systems", "Brand Identity", "UI/UX Interfaces", "Motion Details", "Graphic Design"];
  let i = 0;

  const swap = () => {
    i = (i + 1) % items.length;
    if (prefersReducedMotion()) {
      el.textContent = items[i];
      return;
    }

    gsap.to(el, {
      opacity: 0,
      y: -6,
      duration: 0.25,
      ease: "power2.out",
      onComplete: () => {
        el.textContent = items[i];
        gsap.fromTo(
          el,
          { opacity: 0, y: 8 },
          { opacity: 1, y: 0, duration: 0.35, ease: "power3.out" },
        );
      },
    });
  };

  setInterval(swap, 2200);
}

function initCursor() {
  const cursor = $(".cursor");
  if (!cursor) return;
  const dot = $(".cursor__dot", cursor);
  const ring = $(".cursor__ring", cursor);

  const isFinePointer = window.matchMedia?.("(pointer: fine)")?.matches ?? false;
  if (!isFinePointer) return;

  document.body.classList.add("is-pointer");

  let x = window.innerWidth / 2;
  let y = window.innerHeight / 2;
  let rx = x;
  let ry = y;

  const onMove = (e) => {
    x = e.clientX;
    y = e.clientY;
    if (dot) dot.style.left = `${x}px`;
    if (dot) dot.style.top = `${y}px`;
  };

  const tick = () => {
    rx += (x - rx) * 0.14;
    ry += (y - ry) * 0.14;
    if (ring) ring.style.left = `${rx}px`;
    if (ring) ring.style.top = `${ry}px`;
    requestAnimationFrame(tick);
  };

  window.addEventListener("mousemove", onMove, { passive: true });
  window.addEventListener("mousedown", () => cursor.classList.add("is-down"));
  window.addEventListener("mouseup", () => cursor.classList.remove("is-down"));

  const hoverables = "a, button, .project, [data-magnetic]";
  $$(hoverables).forEach((el) => {
    el.addEventListener("mouseenter", () => cursor.classList.add("is-hover"));
    el.addEventListener("mouseleave", () => cursor.classList.remove("is-hover"));
  });

  tick();
}

function initMagnetic() {
  if (prefersReducedMotion()) return;
  const items = $$("[data-magnetic]");
  const strength = 12;

  items.forEach((el) => {
    el.style.willChange = "transform";

    const onMove = (e) => {
      const r = el.getBoundingClientRect();
      const mx = e.clientX - (r.left + r.width / 2);
      const my = e.clientY - (r.top + r.height / 2);
      const dx = clamp(mx / (r.width / 2), -1, 1) * strength;
      const dy = clamp(my / (r.height / 2), -1, 1) * strength;
      el.style.transform = `translate3d(${dx}px, ${dy}px, 0)`;
    };

    const reset = () => {
      el.style.transform = "translate3d(0,0,0)";
    };

    el.addEventListener("mousemove", onMove);
    el.addEventListener("mouseleave", reset);
  });
}

function initTilt() {
  if (prefersReducedMotion()) return;
  const cards = $$("[data-tilt]");
  const max = 10;

  cards.forEach((el) => {
    el.style.transformStyle = "preserve-3d";
    el.style.willChange = "transform";

    const onMove = (e) => {
      const r = el.getBoundingClientRect();
      const px = (e.clientX - r.left) / r.width;
      const py = (e.clientY - r.top) / r.height;
      const rx = (py - 0.5) * -max;
      const ry = (px - 0.5) * max;
      el.style.transform = `perspective(900px) rotateX(${rx}deg) rotateY(${ry}deg) translateY(-2px)`;
    };

    const reset = () => {
      el.style.transform = "perspective(900px) rotateX(0deg) rotateY(0deg) translateY(0px)";
    };

    el.addEventListener("mousemove", onMove);
    el.addEventListener("mouseleave", reset);
  });
}

function initFilters() {
  const grid = $("#projectGrid");
  if (!grid) return;
  const filters = $$(".filter");

  const setActive = (btn) => {
    filters.forEach((b) => {
      b.classList.toggle("is-active", b === btn);
      b.setAttribute("aria-selected", String(b === btn));
    });
  };

  const apply = (key) => {
    const cards = $$(".project", grid);
    cards.forEach((card) => {
      const cat = card.getAttribute("data-category");
      const show = key === "all" || cat === key;
      card.classList.toggle("is-hidden", !show);
    });
  };

  filters.forEach((btn) => {
    btn.addEventListener("click", () => {
      const key = btn.getAttribute("data-filter") || "all";
      setActive(btn);
      apply(key);
    });
  });
}

function initGsap() {
  if (typeof gsap === "undefined") return;

  const reduced = prefersReducedMotion();
  if (reduced) {
    $$(".reveal").forEach((el) => {
      el.style.opacity = "1";
      el.style.transform = "none";
    });
    return;
  }

  if (typeof ScrollTrigger !== "undefined") {
    gsap.registerPlugin(ScrollTrigger);
  }

  gsap.to(".bg__blob--a", { x: 60, y: 30, duration: 8, repeat: -1, yoyo: true, ease: "sine.inOut" });
  gsap.to(".bg__blob--b", { x: -40, y: -30, duration: 9, repeat: -1, yoyo: true, ease: "sine.inOut" });

  gsap.to(".orb__ring--a", { rotation: 360, duration: 16, repeat: -1, ease: "none" });
  gsap.to(".orb__ring--b", { rotation: -360, duration: 20, repeat: -1, ease: "none" });
  gsap.to(".orb__ring--c", { rotation: 360, duration: 24, repeat: -1, ease: "none" });
  gsap.to(".orb__core", { scale: 1.05, duration: 2.4, repeat: -1, yoyo: true, ease: "sine.inOut" });

  const heroTl = gsap.timeline({ defaults: { ease: "power3.out" } });
  heroTl
    .to(".reveal", { opacity: 1, y: 0, duration: 0.7, stagger: 0.06 }, 0.1)
    .fromTo(".nav", { y: -10, opacity: 0 }, { y: 0, opacity: 1, duration: 0.6 }, 0);

  if (typeof ScrollTrigger !== "undefined") {
    $$(".section .reveal").forEach((el) => {
      gsap.to(el, {
        opacity: 1,
        y: 0,
        duration: 0.8,
        ease: "power3.out",
        scrollTrigger: {
          trigger: el,
          start: "top 82%",
        },
      });
    });

    // Animate skill bars + percentages once
    $$(".skill-card[data-skill]").forEach((card) => {
      const pct = $(".skill-card__pct", card);
      const fill = $(".bar__fill", card);
      const target = Number(pct?.getAttribute("data-target") || 0);
      const targetClamped = clamp(target, 0, 100);

      gsap.fromTo(
        fill,
        { width: "0%" },
        {
          width: `${targetClamped}%`,
          duration: 1.1,
          ease: "power3.out",
          scrollTrigger: {
            trigger: card,
            start: "top 80%",
            once: true,
          },
        },
      );

      if (pct) {
        const obj = { v: 0 };
        gsap.to(obj, {
          v: targetClamped,
          duration: 1.1,
          ease: "power3.out",
          scrollTrigger: { trigger: card, start: "top 80%", once: true },
          onUpdate: () => {
            pct.textContent = `${Math.round(obj.v)}%`;
          },
        });
      }
    });
  }
}

function initContactForm() {
  const form = $("#contactForm");
  const note = $("#formNote");
  if (!form || !note) return;

  form.addEventListener("submit", (e) => {
    e.preventDefault();
    const data = new FormData(form);
    const name = String(data.get("name") || "").trim();
    const email = String(data.get("email") || "").trim();
    const message = String(data.get("message") || "").trim();

    if (!name || !email || !message) {
      note.textContent = "Please fill out all fields.";
      return;
    }

    const defaultBackendUrl = "http://localhost:5000/contact";
    const backendUrl = form.dataset.backendUrl?.trim() || defaultBackendUrl;

    note.textContent = "Sending message…";

    fetch(backendUrl, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ name, email, message }),
    })
      .then((res) => {
        if (!res.ok) {
          return res.json().then((body) => {
            throw new Error(body.error || "Unable to send message");
          });
        }
        return res.json();
      })
      .then((result) => {
        note.textContent = result.message || "Message sent successfully.";
        form.reset();
      })
      .catch((error) => {
        note.textContent = "Sorry, something went wrong. Please try again.";
        console.error("Contact submit error:", error);
      });
  });
}

initTheme();
initYear();
initScrollIndicator();
initTypeLoop();
initCursor();
initMagnetic();
initTilt();
initFilters();
initGsap();
initContactForm();

