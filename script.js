/* ============================================================
   Utsav Khatiwada, portfolio "circuit board" theme
   Shared behaviour: circuit background, boot overlay, matrix
   rain, scroll progress, reveal-on-scroll.
   Each effect only runs when its element exists on the page.
   ============================================================ */

(function () {
    'use strict';

    /* ---------- animated circuit-board background ----------
       Generates seeded PCB traces as an SVG with light pulses
       travelling along them. Config comes from data attributes
       on the #circuit element (seed / height / count).       */

    function makeTraces(seed, w, h, n) {
        var s = seed;
        function rand() { s = (s * 16807) % 2147483647; return s / 2147483647; }
        var traces = [];
        var pads = [];
        for (var i = 0; i < n; i++) {
            var y = 30 + rand() * (h - 60);
            var x = -20;
            var d = 'M ' + x + ' ' + Math.round(y);
            while (x < w + 20) {
                x += 90 + rand() * 240;
                d += ' L ' + Math.round(Math.min(x, w + 20)) + ' ' + Math.round(y);
                if (x < w && rand() < 0.75) {
                    var dy = (rand() < 0.5 ? -1 : 1) * (30 + rand() * 80);
                    var nx = x + Math.abs(dy);
                    var ny = Math.max(24, Math.min(h - 24, y + dy));
                    d += ' L ' + Math.round(nx) + ' ' + Math.round(ny);
                    pads.push({ x: Math.round(x), y: Math.round(y) });
                    x = nx;
                    y = ny;
                }
            }
            traces.push({ d: d, dur: 6 + rand() * 8, delay: -rand() * 12 });
        }
        return { traces: traces, pads: pads };
    }

    function buildCircuit() {
        var host = document.getElementById('circuit');
        if (!host) return;
        var seed = parseInt(host.getAttribute('data-seed') || '1337', 10);
        var height = parseInt(host.getAttribute('data-height') || '3400', 10);
        var count = parseInt(host.getAttribute('data-count') || '44', 10);
        var data = makeTraces(seed, 1920, height, count);

        var parts = [];
        parts.push('<svg width="100%" height="100%" viewBox="0 0 1920 ' + height + '" preserveAspectRatio="xMidYMid slice" style="position:absolute;inset:0;">');
        parts.push('<g opacity="0.5">');
        data.traces.forEach(function (t) {
            parts.push('<path d="' + t.d + '" fill="none" stroke="#155c31" stroke-width="1.5"/>');
        });
        data.pads.forEach(function (p) {
            parts.push('<circle cx="' + p.x + '" cy="' + p.y + '" r="3.5" fill="#03100a" stroke="#2c8a4f" stroke-width="1.5"/>');
        });
        parts.push('</g><g>');
        data.traces.forEach(function (t) {
            var begin = t.delay.toFixed(2) + 's';
            var dur = t.dur.toFixed(2) + 's';
            parts.push('<circle r="8" fill="rgba(57,255,122,0.28)"><animateMotion dur="' + dur + '" repeatCount="indefinite" path="' + t.d + '" begin="' + begin + '"/></circle>');
            parts.push('<circle r="3.5" fill="#c9ffdf"><animateMotion dur="' + dur + '" repeatCount="indefinite" path="' + t.d + '" begin="' + begin + '"/></circle>');
        });
        parts.push('</g></svg>');
        host.innerHTML = parts.join('');
    }

    /* ---------- BIOS boot overlay (first visit per session) ---------- */

    var BOOT_LINES = [
        'CPU  : UTSAV KHATIWADA @ SYDNEY.AU .............. OK',
        'MEM  : 3+ YEARS IT SUPPORT ...................... OK',
        'NET  : TAILSCALE VPN TUNNEL ..................... CONNECTED',
        'GPU  : ZEBRA TC53 HANDHELD ...................... DETECTED',
        'SSD  : RASPBERRY PI 4 HOMELAB ................... MOUNTED',
        'SEC  : MFA + CONDITIONAL ACCESS ................. ENFORCED',
        'SRV  : NEPAL-POS.SERVICE ........................ ACTIVE (RUNNING)',
        'CFG  : config t .................................. APPLIED',
        'CRN  : crontab -l ................................ 1 JOB SCHEDULED',
        'LOADING PORTFOLIO.SYS ........................... 100%',
        'BOOT SEQUENCE COMPLETE. WELCOME, VISITOR'
    ];

    function setupBoot() {
        var boot = document.getElementById('boot');
        if (!boot) return;

        var booted = false;
        try { booted = sessionStorage.getItem('uk_booted') === '1'; } catch (e) {}
        if (booted) { boot.classList.add('done'); return; }

        var linesHost = boot.querySelector('.boot-lines');
        var count = 0;
        var timer = setInterval(function () {
            if (count < BOOT_LINES.length) {
                var div = document.createElement('div');
                div.className = 'boot-line';
                div.textContent = BOOT_LINES[count];
                linesHost.appendChild(div);
                count++;
            }
            if (count >= BOOT_LINES.length) {
                clearInterval(timer);
                setTimeout(end, 800);
            }
        }, 230);

        function end() {
            if (boot.classList.contains('done')) return;
            try { sessionStorage.setItem('uk_booted', '1'); } catch (e) {}
            clearInterval(timer);
            boot.classList.add('closing');
            setTimeout(function () { boot.classList.add('done'); }, 550);
            window.removeEventListener('keydown', end);
        }

        boot.addEventListener('click', end);
        window.addEventListener('keydown', end);
    }

    /* ---------- matrix rain in the hero ---------- */

    function setupMatrix() {
        var c = document.getElementById('matrix');
        if (!c) return;
        var ctx = c.getContext('2d');
        var fs = 16;
        var cols = Math.floor(c.width / fs);
        var drops = [];
        for (var i = 0; i < cols; i++) drops.push(Math.floor(Math.random() * 35));
        var chars = '01<>/{}$#@ABCDEF';
        ctx.fillStyle = '#03100a';
        ctx.fillRect(0, 0, c.width, c.height);
        setInterval(function () {
            ctx.fillStyle = 'rgba(3,16,10,0.14)';
            ctx.fillRect(0, 0, c.width, c.height);
            ctx.font = fs + 'px monospace';
            for (var i = 0; i < cols; i++) {
                var ch = chars[Math.floor(Math.random() * chars.length)];
                ctx.fillStyle = Math.random() < 0.08 ? '#b6ffd0' : '#1f9e52';
                ctx.fillText(ch, i * fs, drops[i] * fs);
                if (drops[i] * fs > c.height && Math.random() > 0.972) drops[i] = 0;
                drops[i]++;
            }
        }, 66);
    }

    /* ---------- scroll progress bar under the nav ---------- */

    function setupProgress() {
        var bar = document.getElementById('progress');
        if (!bar) return;
        window.addEventListener('scroll', function () {
            var el = document.documentElement;
            var max = el.scrollHeight - el.clientHeight;
            bar.style.width = (max > 0 ? Math.min(100, (el.scrollTop / max) * 100) : 0) + '%';
        }, { passive: true });
    }

    /* ---------- reveal-on-scroll ---------- */

    function setupReveal() {
        var els = document.querySelectorAll('[data-reveal]');
        if (!els.length) return;
        var io = new IntersectionObserver(function (entries) {
            entries.forEach(function (en) {
                if (en.isIntersecting) {
                    en.target.style.opacity = '1';
                    en.target.style.transform = 'none';
                    io.unobserve(en.target);
                }
            });
        }, { threshold: 0.12 });
        els.forEach(function (el, i) {
            el.style.opacity = '0';
            el.style.transform = 'translateY(28px)';
            var delay = ((i % 4) * 0.09).toFixed(2) + 's';
            el.style.transition = 'opacity 0.7s ease ' + delay + ', transform 0.7s ease ' + delay;
            io.observe(el);
        });
    }

    /* ---------- skills nav link plays an "ls" before settling ---------- */

    function setupSkillsLs() {
        var link = document.querySelector('.nav-link[href="#skills"]');
        var term = document.querySelector('#skills .term');
        if (!link || !term) return;
        var timer = null;
        link.addEventListener('click', function () {
            term.classList.add('ls-active');
            clearTimeout(timer);
            timer = setTimeout(function () {
                term.classList.remove('ls-active');
            }, 1400);
        });
    }

    document.addEventListener('DOMContentLoaded', function () {
        buildCircuit();
        setupBoot();
        setupMatrix();
        setupProgress();
        setupReveal();
        setupSkillsLs();
    });
})();
