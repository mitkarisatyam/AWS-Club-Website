// AWS SBG VIT Pune - Shared Subpage Interaction & Canvas Particles
document.addEventListener('DOMContentLoaded', () => {
  // 1. Navigation Menu Setup
  const dropdownTrigger = document.querySelector('.has-dropdown');
  const dropdownMenu = dropdownTrigger ? dropdownTrigger.querySelector('ul') : null;
  const hamburgerBtn = document.querySelector('[data-collapse-toggle]');
  const closeBtn = document.querySelector('.close-menu-btn');

  if (dropdownTrigger && dropdownMenu) {
    const toggleMenu = (open) => {
      const isOpen = open !== undefined ? open : !dropdownMenu.classList.contains('nav-dropdown-active');
      if (isOpen) {
        dropdownMenu.classList.add('nav-dropdown-active');
        dropdownMenu.style.opacity = '1';
        dropdownMenu.style.visibility = 'visible';
      } else {
        dropdownMenu.classList.remove('nav-dropdown-active');
        dropdownMenu.style.opacity = '0';
        dropdownMenu.style.visibility = 'hidden';
      }
    };

    if (hamburgerBtn) {
      hamburgerBtn.addEventListener('click', (e) => {
        e.stopPropagation();
        toggleMenu();
      });
    }

    if (closeBtn) {
      closeBtn.addEventListener('click', (e) => {
        e.stopPropagation();
        toggleMenu(false);
      });
    }

    // Desktop hover
    if (window.innerWidth > 1024) {
      dropdownTrigger.addEventListener('mouseenter', () => toggleMenu(true));
      dropdownTrigger.addEventListener('mouseleave', () => toggleMenu(false));
    }

    // Close when clicking outside
    document.addEventListener('click', (e) => {
      if (!dropdownTrigger.contains(e.target)) {
        toggleMenu(false);
      }
    });
  }

  // Highlight current active link
  const currentPath = window.location.pathname.toLowerCase();
  document.querySelectorAll('.has-dropdown ul a').forEach(link => {
    const href = link.getAttribute('href').toLowerCase();
    if (currentPath === href || (href !== '/' && currentPath.endsWith(href))) {
      link.classList.add('text-white', 'font-semibold');
      link.style.letterSpacing = '0.05em';
    }
  });

  // 2. Custom Cursor
  const cursor = document.getElementById('cursor');
  if (cursor) {
    let cursorVisible = false;
    window.addEventListener('mousemove', (e) => {
      cursor.style.left = `${e.clientX}px`;
      cursor.style.top = `${e.clientY}px`;
      if (!cursorVisible) {
        cursor.style.opacity = '1';
        cursorVisible = true;
      }
    });

    document.addEventListener('mouseleave', () => {
      cursor.style.opacity = '0';
      cursorVisible = false;
    });

    document.addEventListener('mouseover', (e) => {
      const el = e.target.closest('[data-cursor], a, button, input, select, textarea, .subpage-card');
      if (el) {
        const size = el.getAttribute('data-cursor') || '44';
        cursor.style.width = `${Math.max(36, parseInt(size, 10))}px`;
        cursor.style.height = `${Math.max(36, parseInt(size, 10))}px`;
      } else {
        cursor.style.width = '1rem';
        cursor.style.height = '1rem';
      }
    });
  }

  // 3. Lightweight Ambient Particle Canvas Background
  const canvas = document.getElementById('subpage-canvas');
  if (canvas) {
    const ctx = canvas.getContext('2d');
    let width = canvas.width = window.innerWidth;
    let height = canvas.height = window.innerHeight;

    window.addEventListener('resize', () => {
      width = canvas.width = window.innerWidth;
      height = canvas.height = window.innerHeight;
    });

    const particles = [];
    const count = window.innerWidth < 768 ? 40 : 90;
    
    // AWS SBG Palette: warm orange, deep blue, soft violet, cyan, crisp white
    const colors = [
      'rgba(244, 140, 24, 0.45)', // AWS Orange
      'rgba(64, 137, 221, 0.45)', // Tech Blue
      'rgba(138, 88, 148, 0.35)', // Violet
      'rgba(255, 255, 255, 0.5)'   // Starlight
    ];

    for (let i = 0; i < count; i++) {
      particles.push({
        x: Math.random() * width,
        y: Math.random() * height,
        vx: (Math.random() - 0.5) * 0.45,
        vy: (Math.random() - 0.5) * 0.45,
        radius: Math.random() * 2 + 0.8,
        color: colors[Math.floor(Math.random() * colors.length)]
      });
    }

    let mouseX = -1000;
    let mouseY = -1000;
    window.addEventListener('mousemove', (e) => {
      mouseX = e.clientX;
      mouseY = e.clientY;
    });

    function renderParticles() {
      ctx.clearRect(0, 0, width, height);

      // Connecting lines for nearby particles
      for (let i = 0; i < particles.length; i++) {
        for (let j = i + 1; j < particles.length; j++) {
          const dx = particles[i].x - particles[j].x;
          const dy = particles[i].y - particles[j].y;
          const dist = Math.sqrt(dx * dx + dy * dy);
          if (dist < 110) {
            ctx.beginPath();
            ctx.moveTo(particles[i].x, particles[i].y);
            ctx.lineTo(particles[j].x, particles[j].y);
            ctx.strokeStyle = `rgba(255, 255, 255, ${0.08 * (1 - dist / 110)})`;
            ctx.lineWidth = 0.6;
            ctx.stroke();
          }
        }
      }

      // Draw and update particles
      particles.forEach(p => {
        // Interactive cursor repulsion
        const dx = p.x - mouseX;
        const dy = p.y - mouseY;
        const dist = Math.sqrt(dx * dx + dy * dy);
        if (dist < 100) {
          const angle = Math.atan2(dy, dx);
          p.x += Math.cos(angle) * 1.5;
          p.y += Math.sin(angle) * 1.5;
        }

        p.x += p.vx;
        p.y += p.vy;

        if (p.x < 0) p.x = width;
        if (p.x > width) p.x = 0;
        if (p.y < 0) p.y = height;
        if (p.y > height) p.y = 0;

        ctx.beginPath();
        ctx.arc(p.x, p.y, p.radius, 0, Math.PI * 2);
        ctx.fillStyle = p.color;
        ctx.shadowBlur = 8;
        ctx.shadowColor = p.color;
        ctx.fill();
        ctx.shadowBlur = 0;
      });

      requestAnimationFrame(renderParticles);
    }

    requestAnimationFrame(renderParticles);
  }

  // 4. Kinetic Typography & Subpage Scroll Reveal Engine
  function initSubpageTextAnimations() {
    // A. Split-Word Reveal for Page Titles
    document.querySelectorAll('.page-title').forEach(titleEl => {
      if (titleEl.dataset.splitDone) return;
      titleEl.dataset.splitDone = 'true';

      const nodes = Array.from(titleEl.childNodes);
      const fragment = document.createDocumentFragment();
      let wordCounter = 0;

      nodes.forEach(node => {
        if (node.nodeType === Node.TEXT_NODE) {
          const words = node.textContent.split(/(\s+)/);
          words.forEach(part => {
            if (!part) return;
            if (/^\s+$/.test(part)) {
              fragment.appendChild(document.createTextNode(part));
            } else {
              const mask = document.createElement('span');
              mask.className = 'word-reveal-mask';
              const inner = document.createElement('span');
              inner.className = 'word-reveal';
              inner.style.animationDelay = `${(wordCounter * 0.1) + 0.15}s`;
              inner.textContent = part;
              mask.appendChild(inner);
              fragment.appendChild(mask);
              wordCounter++;
            }
          });
        } else if (node.nodeType === Node.ELEMENT_NODE) {
          const mask = document.createElement('span');
          mask.className = 'word-reveal-mask';
          const inner = document.createElement('span');
          inner.className = 'word-reveal';
          inner.style.animationDelay = `${(wordCounter * 0.1) + 0.15}s`;
          const clone = node.cloneNode(true);
          inner.appendChild(clone);
          mask.appendChild(inner);
          fragment.appendChild(mask);
          wordCounter++;
        }
      });

      titleEl.innerHTML = '';
      titleEl.appendChild(fragment);
    });

    // B. Intersection Observer for Scroll Reveals
    const revealObserver = new IntersectionObserver((entries, obs) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          entry.target.classList.add('is-revealed');
          const accentLine = entry.target.querySelector('.heading-accent-line');
          if (accentLine) {
            accentLine.classList.add('is-revealed');
          }
          obs.unobserve(entry.target);
        }
      });
    }, {
      threshold: 0.1,
      rootMargin: '0px 0px -30px 0px'
    });

    // Auto-detect section titles, cards, and content blocks
    const targetSelectors = [
      '.subpage-card',
      '.domain-card',
      '.event-card',
      '.team-card',
      '.project-card',
      '.review-card',
      '.matcher-tile',
      '.metric-card',
      'main h2',
      'main h3:not(.subpage-card h3):not(.domain-card h3)'
    ];

    document.querySelectorAll(targetSelectors.join(',')).forEach((el) => {
      if (!el.classList.contains('scroll-reveal-card') && !el.classList.contains('scroll-reveal-text')) {
        const isCard = el.classList.contains('subpage-card') ||
                       el.classList.contains('domain-card') ||
                       el.classList.contains('team-card') ||
                       el.classList.contains('project-card') ||
                       el.classList.contains('matcher-tile');
        el.classList.add(isCard ? 'scroll-reveal-card' : 'scroll-reveal-text');

        // Automatic grid child stagger
        const parentGrid = el.closest('.grid, .matcher-grid');
        if (parentGrid) {
          const siblings = Array.from(parentGrid.children);
          const childIdx = siblings.indexOf(el);
          if (childIdx >= 0) {
            el.style.transitionDelay = `${(childIdx % 4) * 0.1}s`;
          }
        }

        // Add accent underline to section h2 if not present
        if (el.tagName === 'H2' && !el.querySelector('.heading-accent-line') && !el.closest('.subpage-card')) {
          const line = document.createElement('span');
          line.className = 'heading-accent-line';
          el.appendChild(line);
        }

        revealObserver.observe(el);
      }
    });

    // C. Re-observe for dynamically loaded items (like Events from /api/events)
    const observerMutation = new MutationObserver(mutations => {
      let shouldScan = false;
      mutations.forEach(m => {
        if (m.addedNodes.length > 0) shouldScan = true;
      });
      if (shouldScan) {
        document.querySelectorAll(targetSelectors.join(',')).forEach(el => {
          if (!el.classList.contains('scroll-reveal-card') && !el.classList.contains('scroll-reveal-text')) {
            el.classList.add('scroll-reveal-card');
            revealObserver.observe(el);
          }
        });
      }
    });

    const mainContent = document.querySelector('main') || document.body;
    observerMutation.observe(mainContent, { childList: true, subtree: true });
  }

  initSubpageTextAnimations();
});
