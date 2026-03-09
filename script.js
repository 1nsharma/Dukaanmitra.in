/**
 * DukaanMitra – Senior Architect Refactor
 * Stack: Anime.js v4 (Modular API)
 */

const initEngine = async () => {
  try {
    // 1. Module Injection (Bundler-blind dynamic import)
    const anime = await (0, eval)('import("https://cdn.jsdelivr.net/npm/animejs/+esm")');
    const { 
      animate, 
      waapi, 
      stagger, 
      splitText, 
      onScroll, 
      createLayout, 
      createDraggable, 
      createAnimatable, 
      utils, 
      cubicBezier, 
      spring, 
      createScope 
    } = anime;

    // --- ARCHITECTURE MODULE: SCOPE & RESPONSIVE ---
    const appScope = createScope({
      mediaQueries: {
        isSmall: '(max-width: 768px)',
        reduceMotion: '(prefers-reduced-motion)',
      }
    });

    // --- ANIMATION MODULE: HERO ---
    const initHero = () => {
      const { chars } = splitText('.hero-title', { words: false, chars: true });
      
      // Character bounce loop using high-perf WAAPI
      waapi.animate(chars, {
        y: [0, -20, 0],
        opacity: [0.8, 1, 0.8],
        delay: stagger(60),
        duration: 1200,
        loop: true,
        ease: 'inOut(2)',
      });

      animate('.hero-sub', {
        opacity: [0, 0.7],
        y: [20, 0],
        duration: 1000,
        delay: 500,
        ease: 'out(3)'
      });
    };

    // --- ANIMATION MODULE: SCROLL TRIGGERS ---
    const initScrollAnimations = () => {
      // Feature Cards Entrance
      onScroll('.feature-card', {
        enter: (el) => {
          animate(el, {
            y: [60, 0],
            opacity: [0, 1],
            scale: [0.9, 1],
            duration: 800,
            delay: stagger(100),
            ease: cubicBezier(.7, .1, .5, .9)
          });
        }
      });

      // Dashboard Cards Entrance
      onScroll('.dash-card', {
        enter: (el) => {
          animate(el, {
            translateY: [100, 0],
            opacity: [0, 1],
            duration: 1200,
            ease: spring({ bounce: 0.4 })
          });
        }
      });

      // Signal Path Animation
      const signalPath = createMotionPath('#mainPath');
      onScroll('.svg-path', {
        enter: () => {
          animate('#signalDot', {
            translateX: signalPath.translateX,
            translateY: signalPath.translateY,
            rotate: signalPath.rotate,
            duration: 3000,
            loop: true,
            ease: 'linear'
          });
        }
      });
    };

    // --- ANIMATION MODULE: LAYOUT ENGINE ---
    const initLayoutMorph = () => {
      const layout = createLayout('.layout-container');
      let currentGrid = 0;
      
      const morph = () => {
        currentGrid = (currentGrid + 1) % 4;
        layout.update(({ root }) => {
          root.dataset.grid = currentGrid + 1;
        }, {
          duration: 1500,
          delay: stagger(100),
          ease: 'out(4)'
        });
      };

      setInterval(morph, 3000);
    };

    // --- ANIMATION MODULE: INTERACTION ---
    const initInteractionLab = () => {
      // Draggable Component
      createDraggable('.square-drag', {
        bounds: '.drag-bounds'
      });

      // Mouse Follow Component
      const follower = createAnimatable('.follower', {
        x: 0,
        y: 0,
        ease: 'out(3)'
      });

      const container = document.querySelector('.mouse-trigger');
      window.addEventListener('mousemove', (e) => {
        if (!container) return;
        const rect = container.getBoundingClientRect();
        // Check if mouse is within bounds
        if (e.clientX >= rect.left && e.clientX <= rect.right &&
            e.clientY >= rect.top && e.clientY <= rect.bottom) {
          const x = utils.clamp(e.clientX - rect.left - 24, 0, rect.width - 48);
          const y = utils.clamp(e.clientY - rect.top - 24, 0, rect.height - 48);
          follower.x(x);
          follower.y(y);
        }
      });
    };

    // --- ANIMATION MODULE: PHYSICS COMPARISON ---
    const initPhysicsDemo = () => {
      onScroll('.physics', {
        enter: () => {
          animate('.p1', { x: [0, '80%'], duration: 2000, loop: true, alternate: true, ease: 'out(3)' });
          animate('.p2', { x: [0, '80%'], duration: 2000, loop: true, alternate: true, ease: cubicBezier(.7, .1, .5, .9) });
          animate('.p3', { x: [0, '80%'], duration: 2000, loop: true, alternate: true, ease: spring({ bounce: 0.6 }) });
        }
      });
    };

    // --- SCROLL PROGRESS ---
    const handleScrollProgress = () => {
      window.addEventListener('scroll', () => {
        const winScroll = document.body.scrollTop || document.documentElement.scrollTop;
        const height = document.documentElement.scrollHeight - document.documentElement.clientHeight;
        const scrolled = (winScroll / height) * 100;
        utils.set('.scroll-progress', { width: scrolled + '%' });
      }, { passive: true });
    };

    // BOOTSTRAP
    initHero();
    initScrollAnimations();
    initLayoutMorph();
    initInteractionLab();
    initPhysicsDemo();
    handleScrollProgress();

  } catch (err) {
    console.error("Critical Engine Failure:", err);
  }
};

// Start the engine
initEngine();