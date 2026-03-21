import { waapi, stagger, splitText, animate, onScroll, utils } from "https://cdn.jsdelivr.net/npm/animejs/+esm";

/**
 * DUKAANMITRA - CONVERSION OPTIMIZED ENGINE
 * Focused on content clarity and subtle engagement.
 */

// 1. HERO REVEAL
function initHero() {
    // Simple staggered entrance for hero elements
    animate('.hero-content > *', {
        opacity: [0, 1],
        translateY: [20, 0],
        delay: stagger(100),
        duration: 800,
        ease: 'out(3)'
    });
}

// 2. SCROLL REVEAL (Minimal Noise)
function initScrollReveals() {
    // Reveal sections one by one
    onScroll({
        targets: '.reveal',
        enter: (self) => {
            animate(self.target, {
                opacity: [0, 1],
                translateY: [30, 0],
                duration: 1000,
                ease: 'out(4)'
            });
        }
    });

    // Staggered problem cards
    onScroll({
        targets: '.problem-grid',
        enter: () => {
            animate('.problem-card', {
                opacity: [0, 1],
                translateY: [20, 0],
                delay: stagger(100),
                duration: 600,
                ease: 'out(2)'
            });
        }
    });
}

// 3. SCROLL PROGRESS
function initScrollProgress() {
    window.addEventListener('scroll', () => {
        const winScroll = document.body.scrollTop || document.documentElement.scrollTop;
        const height = document.documentElement.scrollHeight - document.documentElement.clientHeight;
        const scrolled = (winScroll / height) * 100;
        utils.set('.scroll-progress', { width: scrolled + '%' });
    });
}

// 4. CHAT SIMULATION LOOP
function initChatSims() {
    // Subtle float for simulator visuals to make them look alive
    animate('.f-visual', {
        translateY: [0, -10, 0],
        duration: 4000,
        loop: true,
        ease: 'inOut(2)'
    });
}

// INITIALIZE
document.addEventListener('DOMContentLoaded', () => {
    initHero();
    initScrollReveals();
    initScrollProgress();
    initChatSims();
});