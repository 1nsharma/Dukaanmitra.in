import { animate, stagger, splitText, onScroll, waapi, utils } from "https://cdn.jsdelivr.net/npm/animejs/+esm";

/**
 * DUKAANMITRA - ANIMATION ENGINE
 * Developed like a premium MERN stack product.
 */

// 1. HERO CHARACTER ANIMATION
function initHero() {
    const split = splitText('.hero-title', { chars: true });
    
    waapi.animate(split.chars, {
        translateY: [0, -20, 0],
        rotate: [0, 5, 0],
        opacity: [0.5, 1, 0.5],
        delay: stagger(100),
        duration: 1200,
        loop: true,
        ease: 'inOut(2)'
    });

    animate('.hero-sub', {
        opacity: [0, 1],
        translateY: [20, 0],
        duration: 800,
        delay: 500,
        ease: 'out(3)'
    });
}

// 2. SCROLL REVEAL LOGIC
function initScrollReveals() {
    // Reveal Section Titles
    onScroll({
        targets: '.section-title',
        enter: (self) => {
            animate(self.target, {
                opacity: [0, 1],
                translateY: [40, 0],
                duration: 1000,
                ease: 'out(4)'
            });
        }
    });

    // Staggered Cards Reveal (Why, Benefits, Dashboard)
    const cardSections = ['.why-grid', '.benefits-grid', '.dashboard-grid'];
    cardSections.forEach(selector => {
        onScroll({
            targets: selector,
            enter: (self) => {
                animate(utils.$(selector + ' .card'), {
                    opacity: [0, 1],
                    translateY: [60, 0],
                    scale: [0.9, 1],
                    delay: stagger(150),
                    duration: 800,
                    ease: 'out(3)'
                });
            }
        });
    });

    // Flow Steps (Sequential Entrance)
    onScroll({
        targets: '.flow-container',
        enter: () => {
            animate('.flow-step', {
                translateX: [-50, 0],
                opacity: [0, 1],
                delay: stagger(200),
                duration: 1000,
                ease: 'out(4)'
            });
        }
    });

    // Setup Steps (Slide from bottom)
    onScroll({
        targets: '.setup-steps',
        enter: () => {
            animate('.setup-card', {
                translateY: [40, 0],
                opacity: [0, 1],
                delay: stagger(150),
                duration: 800,
                ease: 'out(3)'
            });
        }
    });
}

// 3. INTERACTIVE CHAT SIMULATION
function initChatDemo() {
    onScroll({
        targets: '.chat-demo',
        enter: () => {
            animate('.msg.user', {
                opacity: [0, 1],
                translateX: [20, 0],
                duration: 600,
                ease: 'out(3)'
            });
            animate('.msg.ai', {
                opacity: [0, 1],
                translateX: [-20, 0],
                duration: 600,
                delay: 1000,
                ease: 'out(3)'
            });
        }
    });
}

// 4. SCROLL PROGRESS INDICATOR
function initScrollProgress() {
    window.addEventListener('scroll', () => {
        const winScroll = document.body.scrollTop || document.documentElement.scrollTop;
        const height = document.documentElement.scrollHeight - document.documentElement.clientHeight;
        const scrolled = (winScroll / height) * 100;
        utils.set('.scroll-progress', { width: scrolled + '%' });
    });
}

// 5. MOUSE FOLLOW FEEDBACK
function initMouseFollow() {
    const follower = utils.$('.cursor-follower')[0];
    if (!follower) return;

    window.addEventListener('mousemove', (e) => {
        animate(follower, {
            x: e.clientX - 10,
            y: e.clientY - 10,
            duration: 400,
            ease: 'out(2)'
        });
    });
}

// INITIALIZE ALL
document.addEventListener('DOMContentLoaded', () => {
    initHero();
    initScrollReveals();
    initChatDemo();
    initScrollProgress();
    // initMouseFollow(); // Optional: Enabled if premium feel needed
});