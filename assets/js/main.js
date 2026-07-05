/* =============================================
   Particle Canvas
   ============================================= */
const canvas  = document.getElementById('particles-canvas');
const ctx     = canvas.getContext('2d');
let particles = [];
let raf;

function resize() {
  canvas.width  = window.innerWidth;
  canvas.height = window.innerHeight;
}

function spawn() {
  particles = [];
  const n = Math.min(Math.floor(window.innerWidth / 14), 120);
  for (let i = 0; i < n; i++) {
    particles.push({
      x:  Math.random() * canvas.width,
      y:  Math.random() * canvas.height,
      r:  Math.random() * 1.4 + 0.4,
      vx: (Math.random() - 0.5) * 0.28,
      vy: (Math.random() - 0.5) * 0.28,
      a:  Math.random() * 0.45 + 0.15,
    });
  }
}

function draw() {
  ctx.clearRect(0, 0, canvas.width, canvas.height);

  for (let i = 0; i < particles.length; i++) {
    const p = particles[i];

    // dot
    ctx.beginPath();
    ctx.arc(p.x, p.y, p.r, 0, Math.PI * 2);
    ctx.fillStyle = `rgba(99,102,241,${p.a})`;
    ctx.fill();

    // connections
    for (let j = i + 1; j < particles.length; j++) {
      const q  = particles[j];
      const dx = p.x - q.x, dy = p.y - q.y;
      const d  = Math.sqrt(dx * dx + dy * dy);
      if (d < 130) {
        ctx.beginPath();
        ctx.moveTo(p.x, p.y);
        ctx.lineTo(q.x, q.y);
        ctx.strokeStyle = `rgba(99,102,241,${(1 - d / 130) * 0.12})`;
        ctx.lineWidth = 0.6;
        ctx.stroke();
      }
    }

    // move + wrap
    p.x += p.vx; p.y += p.vy;
    if (p.x < 0 || p.x > canvas.width)  p.vx *= -1;
    if (p.y < 0 || p.y > canvas.height) p.vy *= -1;
  }

  raf = requestAnimationFrame(draw);
}

resize(); spawn(); draw();
window.addEventListener('resize', () => { resize(); spawn(); }, { passive: true });

/* =============================================
   Typewriter
   ============================================= */
const roles = [
  'Machine Learning Engineer',
  'Data Scientist',
  'NLP Researcher',
  'Gen-AI Developer',
  'Data Engineer',
  'UC Berkeley MIDS Student',
];
let ri = 0, ci = 0, del = false;
const tw = document.getElementById('typewriter');

function type() {
  const word = roles[ri];
  if (del) {
    tw.textContent = word.slice(0, ci--);
    if (ci < 0) {
      del = false;
      ri  = (ri + 1) % roles.length;
      setTimeout(type, 450);
      return;
    }
  } else {
    tw.textContent = word.slice(0, ci++);
    if (ci > word.length) {
      del = true;
      setTimeout(type, 2200);
      return;
    }
  }
  setTimeout(type, del ? 45 : 75);
}
setTimeout(type, 1100);

/* =============================================
   Theme toggle
   ============================================= */
const root   = document.documentElement;
const icon   = document.getElementById('theme-icon');
const toggle = document.getElementById('theme-toggle');

function applyTheme(t) {
  root.setAttribute('data-theme', t);
  icon.className = t === 'dark' ? 'fas fa-sun' : 'fas fa-moon';
}

applyTheme(localStorage.getItem('theme') || 'dark');

toggle.addEventListener('click', () => {
  const next = root.getAttribute('data-theme') === 'dark' ? 'light' : 'dark';
  applyTheme(next);
  localStorage.setItem('theme', next);
});

/* =============================================
   Mobile nav
   ============================================= */
const burger   = document.getElementById('hamburger');
const navLinks = document.getElementById('nav-links');

burger.addEventListener('click', () => {
  burger.classList.toggle('open');
  navLinks.classList.toggle('open');
});
navLinks.querySelectorAll('.nav-link').forEach(l => {
  l.addEventListener('click', () => {
    burger.classList.remove('open');
    navLinks.classList.remove('open');
  });
});

/* =============================================
   Scroll effects
   ============================================= */
const navbar   = document.getElementById('navbar');
const bar      = document.getElementById('scroll-progress');
const btt      = document.getElementById('back-to-top');
const sections = document.querySelectorAll('section[id]');
const links    = document.querySelectorAll('.nav-link');

window.addEventListener('scroll', () => {
  const y  = window.scrollY;
  const dh = document.body.scrollHeight - window.innerHeight;
  bar.style.width = `${(y / dh) * 100}%`;
  navbar.classList.toggle('scrolled', y > 50);
  btt.classList.toggle('visible', y > 500);

  // active link
  sections.forEach(s => {
    const { top, height } = s.getBoundingClientRect();
    if (top <= 130 && top + height > 130) {
      links.forEach(l => l.classList.remove('active'));
      const a = document.querySelector(`.nav-link[href="#${s.id}"]`);
      if (a) a.classList.add('active');
    }
  });
}, { passive: true });

btt.addEventListener('click', () => window.scrollTo({ top: 0, behavior: 'smooth' }));

/* =============================================
   Counter animation
   ============================================= */
function animateCounters() {
  document.querySelectorAll('.stat-num[data-target]').forEach(el => {
    const target = +el.dataset.target;
    let start = null;
    const step = ts => {
      if (!start) start = ts;
      const p = Math.min((ts - start) / 1400, 1);
      const e = 1 - Math.pow(1 - p, 3);
      el.textContent = Math.round(e * target);
      if (p < 1) requestAnimationFrame(step);
    };
    requestAnimationFrame(step);
  });
}

(function() {
  const el = document.getElementById('about');
  if (!el) return;
  let fired = false;
  const io = new IntersectionObserver(entries => {
    if (entries[0].isIntersecting && !fired) {
      fired = true;
      io.disconnect();
      animateCounters();
    }
  }, { threshold: 0.25 });
  io.observe(el);
})();

/* =============================================
   Project filter
   ============================================= */
document.querySelectorAll('.filter-btn').forEach(btn => {
  btn.addEventListener('click', () => {
    document.querySelectorAll('.filter-btn').forEach(b => b.classList.remove('active'));
    btn.classList.add('active');
    const f = btn.dataset.filter;
    document.querySelectorAll('.project-card').forEach(card => {
      const cats = card.dataset.cat || '';
      card.classList.toggle('hidden', f !== 'all' && !cats.includes(f));
    });
  });
});

/* =============================================
   AOS
   ============================================= */
AOS.init({ duration: 680, easing: 'ease-out-cubic', once: true, offset: 70 });
