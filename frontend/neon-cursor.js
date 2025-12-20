(function () {
    'use strict';

    const prefersReducedMotion = window.matchMedia && window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    const canHover = window.matchMedia && window.matchMedia('(hover: hover)').matches;
    const finePointer = window.matchMedia && window.matchMedia('(pointer: fine)').matches;

    const cfg = window.PORTFOLIO_CONFIG;
    const enabledByConfig = !cfg
        || !cfg.effects
        || !cfg.effects.neonCursor
        || cfg.effects.neonCursor.enabled !== false;

    if (!enabledByConfig || prefersReducedMotion || !canHover || !finePointer) return;

    const existing = document.getElementById('neon-cursor-root');
    if (existing) return;

    const style = document.createElement('style');
    style.id = 'neon-cursor-style';
    style.textContent = `
        .use-neon-cursor,
        .use-neon-cursor * {
            cursor: none !important;
        }

        #neon-cursor-root {
            position: fixed;
            left: 0;
            top: 0;
            width: 0;
            height: 0;
            pointer-events: none;
            z-index: 10001;
            transform: translate3d(0,0,0);
        }

        #neon-cursor-root .neon-cursor-core {
            position: absolute;
            width: 10px;
            height: 10px;
            border-radius: 999px;
            transform: translate(-50%, -50%);
            background: radial-gradient(circle at 30% 30%, rgba(255,255,255,0.95) 0%, rgba(0,245,255,0.95) 35%, rgba(0,245,255,0.35) 70%, rgba(0,245,255,0) 100%);
            box-shadow:
                0 0 10px rgba(0, 245, 255, 0.9),
                0 0 26px rgba(0, 245, 255, 0.55),
                0 0 46px rgba(123, 47, 247, 0.25);
            filter: saturate(1.2);
        }

        #neon-cursor-root .neon-cursor-ring {
            position: absolute;
            width: 28px;
            height: 28px;
            border-radius: 999px;
            transform: translate(-50%, -50%);
            border: 1px solid rgba(0, 245, 255, 0.55);
            box-shadow:
                0 0 10px rgba(0, 245, 255, 0.35),
                inset 0 0 10px rgba(0, 245, 255, 0.15);
            background: radial-gradient(circle, rgba(0,245,255,0.10) 0%, rgba(0,245,255,0.0) 60%);
        }

        #neon-cursor-root .neon-cursor-crosshair {
            position: absolute;
            width: 22px;
            height: 22px;
            transform: translate(-50%, -50%);
            opacity: 0.85;
        }

        #neon-cursor-root .neon-cursor-crosshair::before,
        #neon-cursor-root .neon-cursor-crosshair::after {
            content: '';
            position: absolute;
            left: 50%;
            top: 50%;
            transform: translate(-50%, -50%);
            background: rgba(0, 245, 255, 0.65);
            box-shadow: 0 0 10px rgba(0,245,255,0.45);
        }

        #neon-cursor-root .neon-cursor-crosshair::before {
            width: 1px;
            height: 22px;
        }

        #neon-cursor-root .neon-cursor-crosshair::after {
            width: 22px;
            height: 1px;
        }

        #neon-cursor-root .neon-cursor-trail {
            position: absolute;
            width: 16px;
            height: 16px;
            border-radius: 999px;
            transform: translate(-50%, -50%);
            background: radial-gradient(circle, rgba(0,245,255,0.16) 0%, rgba(0,245,255,0.0) 70%);
            filter: blur(0.2px);
            opacity: 0.0;
        }

        #neon-cursor-root.neon-down .neon-cursor-ring {
            transform: translate(-50%, -50%) scale(0.86);
            border-color: rgba(0, 245, 255, 0.8);
            box-shadow:
                0 0 14px rgba(0, 245, 255, 0.55),
                inset 0 0 12px rgba(0, 245, 255, 0.25);
        }

        #neon-cursor-root.neon-interactive .neon-cursor-ring {
            width: 36px;
            height: 36px;
            border-color: rgba(123, 47, 247, 0.65);
            box-shadow:
                0 0 14px rgba(123, 47, 247, 0.35),
                inset 0 0 12px rgba(0, 245, 255, 0.18);
        }

        #neon-cursor-root.neon-interactive .neon-cursor-core {
            box-shadow:
                0 0 12px rgba(0, 245, 255, 0.9),
                0 0 34px rgba(0, 245, 255, 0.6),
                0 0 60px rgba(123, 47, 247, 0.35);
        }
    `;
    document.head.appendChild(style);

    const root = document.createElement('div');
    root.id = 'neon-cursor-root';

    const ring = document.createElement('div');
    ring.className = 'neon-cursor-ring';

    const crosshair = document.createElement('div');
    crosshair.className = 'neon-cursor-crosshair';

    const core = document.createElement('div');
    core.className = 'neon-cursor-core';

    const trailA = document.createElement('div');
    trailA.className = 'neon-cursor-trail';
    const trailB = document.createElement('div');
    trailB.className = 'neon-cursor-trail';
    const trailC = document.createElement('div');
    trailC.className = 'neon-cursor-trail';

    root.appendChild(trailC);
    root.appendChild(trailB);
    root.appendChild(trailA);
    root.appendChild(ring);
    root.appendChild(crosshair);
    root.appendChild(core);
    document.body.appendChild(root);

    document.documentElement.classList.add('use-neon-cursor');

    let targetX = window.innerWidth / 2;
    let targetY = window.innerHeight / 2;
    let ringX = targetX;
    let ringY = targetY;
    let trail1X = targetX;
    let trail1Y = targetY;
    let trail2X = targetX;
    let trail2Y = targetY;
    let trail3X = targetX;
    let trail3Y = targetY;
    let visible = false;

    function setPos(el, x, y) {
        el.style.left = `${x}px`;
        el.style.top = `${y}px`;
    }

    function lerp(a, b, t) {
        return a + (b - a) * t;
    }

    function animate() {
        ringX = lerp(ringX, targetX, 0.22);
        ringY = lerp(ringY, targetY, 0.22);

        trail1X = lerp(trail1X, targetX, 0.18);
        trail1Y = lerp(trail1Y, targetY, 0.18);

        trail2X = lerp(trail2X, trail1X, 0.14);
        trail2Y = lerp(trail2Y, trail1Y, 0.14);

        trail3X = lerp(trail3X, trail2X, 0.12);
        trail3Y = lerp(trail3Y, trail2Y, 0.12);

        setPos(core, targetX, targetY);
        setPos(crosshair, ringX, ringY);
        setPos(ring, ringX, ringY);
        setPos(trailA, trail1X, trail1Y);
        setPos(trailB, trail2X, trail2Y);
        setPos(trailC, trail3X, trail3Y);

        if (visible) {
            trailA.style.opacity = '0.55';
            trailB.style.opacity = '0.35';
            trailC.style.opacity = '0.2';
        }

        requestAnimationFrame(animate);
    }

    function isInteractiveTarget(el) {
        if (!el || el === document.documentElement) return false;
        return Boolean(
            el.closest('a, button, input, textarea, select, label, summary, [role="button"], [role="link"]')
        );
    }

    window.addEventListener('mousemove', (e) => {
        targetX = e.clientX;
        targetY = e.clientY;
        if (!visible) {
            visible = true;
            root.style.display = 'block';
        }

        root.classList.toggle('neon-interactive', isInteractiveTarget(e.target));
    }, { passive: true });

    window.addEventListener('mousedown', () => {
        root.classList.add('neon-down');
    }, { passive: true });

    window.addEventListener('mouseup', () => {
        root.classList.remove('neon-down');
    }, { passive: true });

    window.addEventListener('mouseleave', () => {
        visible = false;
        root.style.display = 'none';
        trailA.style.opacity = '0';
        trailB.style.opacity = '0';
        trailC.style.opacity = '0';
    }, { passive: true });

    root.style.display = 'none';
    animate();
})();

