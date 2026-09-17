"use strict";

/* =============================================
   CONFIG
============================================= */
const CONFIG = {
  emailjs: {
    serviceId: "YOUR_SERVICE_ID",     // ⬅ replace with your EmailJS service ID
    templateId: "YOUR_TEMPLATE_ID",   // ⬅ replace with your EmailJS template ID
    publicKey: "YOUR_PUBLIC_KEY"      // ⬅ replace with your EmailJS public key
  },
  typingStrings: [
    "Final-Year Zoology Student",
    "AI & Data Science Enthusiast",
    "Python Developer",
    "Machine Learning Explorer",
    "Artificial Intelligence Enthusiast"
  ]
};

const prefersReducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
const isMobile = window.innerWidth < 768;

/* =============================================
   THEME TOGGLE
============================================= */
function initTheme() {
  const body = document.body;
  const toggleBtn = document.getElementById("themeToggle");
  const saved = localStorage.getItem("portfolio-theme");
  if (saved) body.setAttribute("data-theme", saved);

  toggleBtn.addEventListener("click", () => {
    const current = body.getAttribute("data-theme");
    const next = current === "dark" ? "light" : "dark";
    body.setAttribute("data-theme", next);
    localStorage.setItem("portfolio-theme", next);
  });
}

/* =============================================
   MOBILE NAV
============================================= */
function initMobileNav() {
  const hamburger = document.getElementById("hamburger");
  const navMenu = document.getElementById("navMenu");

  hamburger.addEventListener("click", () => {
    const isOpen = navMenu.classList.toggle("active");
    hamburger.classList.toggle("active");
    hamburger.setAttribute("aria-expanded", isOpen);
  });

  navMenu.querySelectorAll(".nav-link").forEach(link => {
    link.addEventListener("click", () => {
      navMenu.classList.remove("active");
      hamburger.classList.remove("active");
      hamburger.setAttribute("aria-expanded", "false");
    });
  });
}

/* =============================================
   ACTIVE NAV LINK ON SCROLL
============================================= */
function initActiveNavObserver() {
  const sections = document.querySelectorAll("section[id]");
  const navLinks = document.querySelectorAll(".nav-link");

  const observer = new IntersectionObserver(
    (entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          const id = entry.target.getAttribute("id");
          navLinks.forEach(link => {
            link.classList.toggle("active", link.dataset.section === id);
          });
        }
      });
    },
    { rootMargin: "-40% 0px -55% 0px", threshold: 0 }
  );

  sections.forEach(section => observer.observe(section));
}

/* =============================================
   TYPING ANIMATION
============================================= */
function initTypingAnimation() {
  const el = document.getElementById("typedText");
  if (!el) return;
  let stringIndex = 0, charIndex = 0, deleting = false;

  function tick() {
    const current = CONFIG.typingStrings[stringIndex];
    if (!deleting) {
      el.textContent = current.slice(0, ++charIndex);
      if (charIndex === current.length) {
        deleting = true;
        setTimeout(tick, 1600);
        return;
      }
    } else {
      el.textContent = current.slice(0, --charIndex);
      if (charIndex === 0) {
        deleting = false;
        stringIndex = (stringIndex + 1) % CONFIG.typingStrings.length;
      }
    }
    setTimeout(tick, deleting ? 40 : 80);
  }
  tick();
}

/* =============================================
   SCROLL REVEAL
============================================= */
function initScrollReveal() {
  const revealEls = document.querySelectorAll(".reveal");
  if (prefersReducedMotion) {
    revealEls.forEach(el => el.classList.add("in-view"));
    return;
  }
  const observer = new IntersectionObserver(
    (entries, obs) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          entry.target.classList.add("in-view");
          obs.unobserve(entry.target);
        }
      });
    },
    { threshold: 0.15 }
  );
  revealEls.forEach(el => observer.observe(el));
}

/* =============================================
   DNA HELIX GENERATOR
============================================= */
function generateDNA() {
  const container = document.getElementById("dnaHelix");
  if (!container) return;
  const count = isMobile ? 14 : 22;
  const fragment = document.createDocumentFragment();

  for (let i = 0; i < count; i++) {
    const rung = document.createElement("div");
    rung.className = "dna-rung";
    rung.style.top = `${i * (220 / count)}px`;
    rung.style.transform = `rotateY(${i * 28}deg)`;

    const dotA = document.createElement("span");
    dotA.className = "dna-dot dna-dot-a";
    const bar = document.createElement("span");
    bar.className = "dna-bar";
    const dotB = document.createElement("span");
    dotB.className = "dna-dot dna-dot-b";

    rung.append(dotA, bar, dotB);
    fragment.appendChild(rung);
  }
  container.appendChild(fragment);

  if (!prefersReducedMotion) {
    let angle = 0;
    function rotateHelix() {
      angle = (angle + 0.15) % 360;
      container.style.transform = `translateY(-50%) rotateY(${angle}deg)`;
      requestAnimationFrame(rotateHelix);
    }
    rotateHelix();
  }
}

/* =============================================
   PARTICLE FIELD (canvas)
============================================= */
function initParticleField() {
  const canvas = document.getElementById("particleCanvas");
  if (!canvas) return;
  const ctx = canvas.getContext("2d");
  let particles = [];
  const hero = canvas.closest(".hero");

  function resize() {
    canvas.width = hero.offsetWidth;
    canvas.height = hero.offsetHeight;
  }

  function createParticles() {
    const count = isMobile ? 25 : prefersReducedMotion ? 0 : 60;
    particles = Array.from({ length: count }, () => ({
      x: Math.random() * canvas.width,
      y: Math.random() * canvas.height,
      r: Math.random() * 1.8 + 0.6,
      vx: (Math.random() - 0.5) * 0.25,
      vy: (Math.random() - 0.5) * 0.25,
      alpha: Math.random() * 0.5 + 0.2
    }));
  }

  function draw() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    particles.forEach(p => {
      p.x += p.vx;
      p.y += p.vy;
      if (p.x < 0 || p.x > canvas.width) p.vx *= -1;
      if (p.y < 0 || p.y > canvas.height) p.vy *= -1;

      ctx.beginPath();
      ctx.arc(p.x, p.y, p.r, 0, Math.PI * 2);
      ctx.fillStyle = `rgba(34, 211, 238, ${p.alpha})`;
      ctx.fill();
    });
    if (!prefersReducedMotion) requestAnimationFrame(draw);
  }

  resize();
  createParticles();
  draw();

  window.addEventListener("resize", () => {
    resize();
    createParticles();
  });
}

/* =============================================
   HERO VISUAL — MOUSE PARALLAX
============================================= */
function initHeroParallax() {
  const stage = document.getElementById("visualStage");
  if (!stage || isMobile || prefersReducedMotion) return;

  document.querySelector(".hero").addEventListener("mousemove", (e) => {
    const { innerWidth, innerHeight } = window;
    const x = (e.clientX / innerWidth - 0.5) * 18;
    const y = (e.clientY / innerHeight - 0.5) * -18;
    stage.style.transform = `rotateY(${x}deg) rotateX(${y}deg)`;
  });

  document.querySelector(".hero").addEventListener("mouseleave", () => {
    stage.style.transform = "rotateY(0) rotateX(0)";
  });
}

/* =============================================
   3D TILT FOR CARDS
============================================= */
function initTiltCards() {
  if (isMobile || prefersReducedMotion) return;
  const cards = document.querySelectorAll(".tilt-card");

  cards.forEach(card => {
    card.addEventListener("mousemove", (e) => {
      const rect = card.getBoundingClientRect();
      const x = e.clientX - rect.left;
      const y = e.clientY - rect.top;
      const rotateX = ((y / rect.height) - 0.5) * -8;
      const rotateY = ((x / rect.width) - 0.5) * 8;
      card.style.transform = `perspective(800px) rotateX(${rotateX}deg) rotateY(${rotateY}deg) translateY(-4px)`;
    });
    card.addEventListener("mouseleave", () => {
      card.style.transform = "perspective(800px) rotateX(0) rotateY(0) translateY(0)";
    });
  });
}

/* =============================================
   CONTACT FORM (EmailJS)
============================================= */
function initContactForm() {
  const form = document.getElementById("contactForm");
  const statusEl = document.getElementById("formStatus");
  const submitBtn = document.getElementById("submitBtn");
  if (!form) return;

  if (window.emailjs && CONFIG.emailjs.publicKey !== "YOUR_PUBLIC_KEY") {
    emailjs.init(CONFIG.emailjs.publicKey);
  }

  form.addEventListener("submit", (e) => {
    e.preventDefault();
    statusEl.textContent = "";
    statusEl.className = "form-status";

    const formData = {
      name: form.name.value.trim(),
      email: form.email.value.trim(),
      subject: form.subject.value.trim(),
      message: form.message.value.trim()
    };

    if (!formData.name || !formData.email || !formData.message) {
      statusEl.textContent = "Please fill in all required fields.";
      statusEl.classList.add("error");
      return;
    }

    submitBtn.disabled = true;
    submitBtn.querySelector(".btn-text").textContent = "Sending...";

    if (!window.emailjs || CONFIG.emailjs.publicKey === "YOUR_PUBLIC_KEY") {
      // EmailJS not configured — simulate for demo purposes
      setTimeout(() => {
        statusEl.textContent = "EmailJS is not configured yet. Please add your service, template & public key in script.js.";
        statusEl.classList.add("error");
        submitBtn.disabled = false;
        submitBtn.querySelector(".btn-text").textContent = "Send Message";
      }, 900);
      return;
    }

    emailjs.send(CONFIG.emailjs.serviceId, CONFIG.emailjs.templateId, formData)
      .then(() => {
        statusEl.textContent = "Your message has been sent successfully!";
        statusEl.classList.add("success");
        form.reset();
      })
      .catch(() => {
        statusEl.textContent = "Something went wrong. Please try again later.";
        statusEl.classList.add("error");
      })
      .finally(() => {
        submitBtn.disabled = false;
        submitBtn.querySelector(".btn-text").textContent = "Send Message";
      });
  });
}

/* =============================================
   NAVBAR BACKGROUND ON SCROLL
============================================= */
function initNavbarScroll() {
  const navbar = document.getElementById("navbar");
  window.addEventListener("scroll", () => {
    navbar.style.boxShadow = window.scrollY > 20 ? "0 8px 30px rgba(0,0,0,0.25)" : "none";
  });
}

/* =============================================
   FOOTER YEAR
============================================= */
function setFooterYear() {
  const yearEl = document.getElementById("year");
  if (yearEl) yearEl.textContent = new Date().getFullYear();
}

/* =============================================
   INIT ALL
============================================= */
document.addEventListener("DOMContentLoaded", () => {
  initTheme();
  initMobileNav();
  initActiveNavObserver();
  initTypingAnimation();
  initScrollReveal();
  generateDNA();
  initParticleField();
  initHeroParallax();
  initTiltCards();
  initContactForm();
  initNavbarScroll();
  setFooterYear();
});