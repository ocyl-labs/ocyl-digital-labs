/* script.js — load projects.json, render cards, handle form & bg canvas */
(() => {
  const PROJECTS_JSON = 'projects.json'; // uses local projects.json (array of objects)
  const GRID_ID = 'projects-grid';
  const LOADER_ID = 'projects-loader';
  const ERROR_ID = 'projects-error';
  const CANVAS_ID = 'bg-canvas';

  // Mobile nav toggle
  function initNav() {
    const btn = document.querySelector('.hamburger');
    const menu = document.querySelector('.nav-menu');
    if (!btn || !menu) return;
    btn.addEventListener('click', () => {
      const expanded = btn.getAttribute('aria-expanded') === 'true';
      btn.setAttribute('aria-expanded', String(!expanded));
      menu.classList.toggle('active');
    });
    // smooth scrolling for anchor links
    document.querySelectorAll('a[href^="#"]').forEach(a => {
      a.addEventListener('click', (ev) => {
        const target = document.querySelector(a.getAttribute('href'));
        if (target) {
          ev.preventDefault();
          target.scrollIntoView({behavior:'smooth',block:'start'});
          menu.classList.remove('active');
          btn.setAttribute('aria-expanded', 'false');
        }
      });
    });
  }

  // Render functions
  function showLoader(show = true) {
    const loader = document.getElementById(LOADER_ID);
    if (!loader) return;
    loader.style.display = show ? 'flex' : 'none';
    loader.setAttribute('aria-hidden', String(!show));
  }
  function showError(msg) {
    const el = document.getElementById(ERROR_ID);
    if (!el) return;
    el.hidden = false;
    el.textContent = msg;
  }

  function createCard(p) {
    const card = document.createElement('article');
    card.className = 'project-card';
    card.innerHTML = `
      <img src="${p.image}" alt="${escapeHtml(p.title)}" loading="lazy" />
      <h3>${escapeHtml(p.title)}</h3>
      <p>${escapeHtml(p.description || '')}</p>
      <div class="progress-bar" aria-hidden="false">
        <div class="progress-fill" style="width:${Number(p.progress || 0)}%"></div>
      </div>
    `;
    return card;
  }

  // Safe text
  function escapeHtml(s='') {
    return String(s).replace(/[&<>"']/g, c => ({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));
  }

  // Fetch projects.json and render
  async function loadProjects() {
    showLoader(true);
    try {
      const res = await fetch(PROJECTS_JSON, { cache: 'no-store' });
      if (!res.ok) throw new Error(`projects.json fetch failed: ${res.status}`);
      const data = await res.json();
      if (!Array.isArray(data)) throw new Error('projects.json is not an array');

      const grid = document.getElementById(GRID_ID);
      grid.innerHTML = '';

      data.forEach(project => {
        const card = document.createElement('div');
        card.className = 'project-card';
        card.innerHTML = `
          <!-- Images removed; use green placeholder div instead -->
          <div class="project-image-placeholder"
               style="background: linear-gradient(135deg, var(--accent-green), var(--bright-green));
                      height: 200px; border-radius: 5px; margin-bottom: 1rem;
                      display: flex; align-items: center; justify-content: center;
                      color: var(--primary-black); font-weight: bold;">
          </div>
          <h3>${escapeHtml(project.name)}</h3>
          <p>${escapeHtml(project.description || '')}</p>
          <div class="progress-bar">
            <div class="progress-fill" style="width:${Number(project.progress) || 0}%"></div>
          </div>
          <p>Progress: ${Number(project.progress) || 0}% - ${escapeHtml(project.status || '')}</p>
        `;
        grid.appendChild(card);
      });

    } catch (err) {
      console.error(err);
      showError('Could not load projects. Please refresh or check the repository.');
    } finally {
      showLoader(false);
    }
  }

  // Contact form: default posts to Formspree via form action attribute; we also intercept for nicer UX
  function initForm() {
    const form = document.getElementById('contact-form');
    const status = document.getElementById('form-status');
    if (!form) return;
    form.addEventListener('submit', async (e) => {
      e.preventDefault();
      status.textContent = 'Sending…';
      const action = form.getAttribute('action');
      const formData = new FormData(form);
      try {
        // If action not set, simply show message (dev fallback)
        if (!action || action.includes('your-id')) {
          status.textContent = 'Configure Formspree action URL in index.html to receive messages.';
          form.reset();
          return;
        }
        const res = await fetch(action, {method:'POST', body: formData, headers: {'Accept':'application/json'}});
        if (res.ok) {
          status.textContent = 'Thanks — message sent!';
          form.reset();
        } else {
          const json = await res.json().catch(()=>null);
          status.textContent = (json && json.error) ? json.error : 'Error sending form';
        }
      } catch (err) {
        console.error(err);
        status.textContent = 'Network error sending message';
      }
    });
  }

  // Lightweight particle background (optional). Keep minimal for performance.
  function initCanvasBG() {
    const canvas = document.getElementById(CANVAS_ID);
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    let w, h, raf;
    const pts = [];
    function resize() {
      w = canvas.width = innerWidth;
      h = canvas.height = innerHeight;
    }
    window.addEventListener('resize', resize);
    resize();

    // init points
    const count = Math.max(20, Math.floor(w * 0.02));
    for (let i=0;i<count;i++){
      pts.push({
        x: Math.random()*w,
        y: Math.random()*h,
        vx: (Math.random()-0.5)*0.3,
        vy: (Math.random()-0.5)*0.3,
        r: 0.6 + Math.random()*1.6
      });
    }

    function loop(){
      ctx.clearRect(0,0,w,h);
      for (const p of pts) {
        p.x += p.vx; p.y += p.vy;
        if (p.x<0) p.x = w; if (p.x>w) p.x = 0;
        if (p.y<0) p.y = h; if (p.y>h) p.y = 0;
        ctx.beginPath();
        ctx.fillStyle = 'rgba(57,255,20,0.08)';
        ctx.arc(p.x,p.y,p.r,0,Math.PI*2);
        ctx.fill();
      }
      raf = requestAnimationFrame(loop);
    }
    loop();
  }

  // init on DOMContentLoaded
  document.addEventListener('DOMContentLoaded', () => {
    initNav();
    initForm();
    loadProjects();
    // init canvas background — optional, comment out if not desired or performance-critical:
    initCanvasBG();
  });

})();
