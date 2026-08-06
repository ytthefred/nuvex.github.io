// ===========================================================
// NUVEX PORTFOLIO — базовый скрипт
// Ничего трогать не обязательно, всё работает "из коробки".
// ===========================================================

document.getElementById("year").textContent = new Date().getFullYear();

/* -----------------------------------------------------------
   1. Подсветка активного пункта в боковом меню при скролле
----------------------------------------------------------- */
const navLinks = document.querySelectorAll(".side-nav a");
const sections = [...navLinks].map(link => document.querySelector(link.getAttribute("href")));

const observer = new IntersectionObserver((entries) => {
  entries.forEach(entry => {
    if (entry.isIntersecting) {
      const id = "#" + entry.target.id;
      navLinks.forEach(link => {
        link.classList.toggle("active", link.getAttribute("href") === id);
      });
    }
  });
}, { threshold: 0.5 });

sections.forEach(sec => { if (sec) observer.observe(sec); });

/* -----------------------------------------------------------
   2. Плавающие цветные квадратики ("блоки") — атмосфера,
      не мешает кликам. Цвета — палитра Roblox.
----------------------------------------------------------- */
const canvas = document.getElementById("snowfall");
const ctx = canvas.getContext("2d");
const BLOCK_COLORS = ["#e6242a", "#ffb400", "#16a34a", "#0064e0"];
let flakes = [];
let animationId;

function resize() {
  canvas.width = window.innerWidth;
  canvas.height = window.innerHeight;
}

function makeFlakes() {
  const count = window.innerWidth < 720 ? 22 : 42;
  flakes = Array.from({ length: count }, () => ({
    x: Math.random() * canvas.width,
    y: Math.random() * canvas.height,
    s: Math.random() * 6 + 4,
    speed: Math.random() * 0.5 + 0.15,
    drift: Math.random() * 0.5 - 0.25,
    spin: Math.random() * 0.02 - 0.01,
    angle: Math.random() * Math.PI,
    opacity: Math.random() * 0.35 + 0.12,
    color: BLOCK_COLORS[Math.floor(Math.random() * BLOCK_COLORS.length)]
  }));
}

function draw() {
  ctx.clearRect(0, 0, canvas.width, canvas.height);
  flakes.forEach(f => {
    ctx.save();
    ctx.globalAlpha = f.opacity;
    ctx.translate(f.x, f.y);
    ctx.rotate(f.angle);
    ctx.fillStyle = f.color;
    ctx.fillRect(-f.s / 2, -f.s / 2, f.s, f.s);
    ctx.restore();

    f.y += f.speed;
    f.x += f.drift;
    f.angle += f.spin;
    if (f.y > canvas.height) { f.y = -8; f.x = Math.random() * canvas.width; }
  });
  ctx.globalAlpha = 1;
  animationId = requestAnimationFrame(draw);
}

const prefersReducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

if (!prefersReducedMotion) {
  resize();
  makeFlakes();
  draw();
  window.addEventListener("resize", () => { resize(); makeFlakes(); });
} else {
  canvas.style.display = "none";
}
