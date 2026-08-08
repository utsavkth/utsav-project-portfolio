/* ============================================================
   Career and project timeline, a Sacred Timeline style canvas.
   Career milestones sit on the main trunk. Every project is a
   branch that diverges at its real start date. Click a branch
   to drill into that project's own sub timeline, built from its
   actual commit history. Pan by dragging, zoom with the wheel
   or the on screen buttons.
   ============================================================ */

(function () {
    'use strict';

    var stage = document.getElementById('timeline-stage');
    if (!stage) return;

    /* ---------- data ---------- */

    var TRUNK = [
        { date: '2020-06-15', title: 'Diploma of IT', sub: 'SABT Sydney', type: 'edu' },
        { date: '2021-04-01', title: 'Started at Hilton Sydney', sub: 'Food and Beverage Administrator', type: 'job' },
        { date: '2021-06-15', title: 'Adv. Diploma of Network Security', sub: 'SABT Sydney', type: 'edu' },
        { date: '2023-06-15', title: 'Bachelor of IT', sub: 'Victoria University, GPA 6.21/7', type: 'edu' },
        { date: '2023-07-01', title: 'Started at Security In Depth', sub: 'IT Support', type: 'job' },
        { date: '2025-06-15', title: 'ACS Professional Year in ICT', sub: 'QIBA', type: 'edu' },
        { date: '2025-08-01', title: 'Started at Interfuse Technologies', sub: 'IT Service Desk Engineer, still live', type: 'job', live: true }
    ];

    var BRANCHES = [
        {
            date: '2021-06-01', title: 'Home Server', href: 'home-server.html', live: true,
            sub: [
                { date: '2021-06', text: 'First build during university, OpenMediaVault 4, early Jellyfin' },
                { date: '2026-06-01', text: 'Full ground up rebuild begins' },
                { date: '2026-06-04', text: 'Docker media stack deployed' },
                { date: '2026-06-10', text: 'Pi-hole v6 filtering the whole network' },
                { date: '2026-06-12', text: 'Caddy reverse proxy live' },
                { date: '2026-06-14', text: 'Full monitoring suite built' },
                { date: '2026-07-03', text: 'Promoted to production, hosts the Nepal POS' }
            ]
        },
        {
            date: '2023-03-01', title: 'Student Resource Portal', href: 'student-portal.html',
            sub: [
                { date: '2023', text: 'Built during the degree' },
                { date: '2024', text: 'Shared with classmates, refined' }
            ]
        },
        {
            date: '2024-10-11', title: 'Love Language Quiz', href: 'love-language.html',
            sub: [
                { date: '2024-10-11', text: 'Project start' },
                { date: '2024-10-18', text: 'Full site structure built in one session' },
                { date: '2024-10-26', text: 'Explored separate result experiences' },
                { date: '2024-10-31', text: 'Analytics added, old files cleaned out' },
                { date: '2025-04-17', text: 'Cleanup pass ahead of relaunch' },
                { date: '2025-04-21', text: 'Relaunched with the series' }
            ]
        },
        {
            date: '2025-04-11', title: 'Attachment Style Quiz', href: 'attachment-style.html',
            sub: [
                { date: '2025-04-11', text: 'Project start' },
                { date: '2025-04-16', text: 'Full rebuild pass' },
                { date: '2025-04-21', text: 'Launched' }
            ]
        },
        {
            date: '2025-04-21', title: 'Sexual Temperament Quiz', href: 'temperament.html',
            sub: [
                { date: '2025-04-21', text: 'Project start' },
                { date: '2025-04-24', text: 'Content refinements' },
                { date: '2025-04-28', text: 'Launched' }
            ]
        },
        {
            date: '2025-04-27', title: 'I See Your True Colour', href: 'true-colour.html',
            sub: [
                { date: '2025-04-27', text: 'Built and launched' },
                { date: '2025-04-28', text: 'Copy and share features polished' },
                { date: '2026-08-06', text: 'Soul Kundali rebuilt as a proper SVG chart' }
            ]
        },
        {
            date: '2026-06-16', title: 'Homelab Watchdog', href: 'watchdog.html',
            sub: [
                { date: '2026-06-16', text: 'Built alongside home server auto updates' },
                { date: '2026-06-18', text: 'Confirmed alerting after real downtime tests' }
            ]
        },
        {
            date: '2026-06-23', title: 'Local AI Server', href: 'ai-server.html',
            sub: [
                { date: '2026-06-23', text: 'Set up from scratch in one session' },
                { date: '2026-07-05', text: 'Bulk document ingestion tested at scale' }
            ]
        },
        {
            date: '2026-07-02', title: 'Khatiwada POS SaaS', href: 'khatiwada-pos.html', live: true,
            sub: [
                { date: '2026-07-02', text: 'Project start' },
                { date: '2026-07-03', text: 'Hardened and deployed' },
                { date: '2026-07-04', text: 'Made it Nepali' },
                { date: '2026-07-09', text: 'Full UI redesign' },
                { date: '2026-07-20', text: 'Commercialisation begins' },
                { date: '2026-07-22', text: 'Login flow live' },
                { date: '2026-07-25', text: 'Security hardening shipped' },
                { date: '2026-08-06', text: 'Master dashboard and monitoring live' }
            ]
        },
        {
            date: '2026-07-12', title: 'Zebra TC53 Cashier', href: 'zebra-tc53.html',
            sub: [
                { date: '2026-07-12', text: 'Hardware purchased, project kickoff' },
                { date: '2026-07-13', text: 'Shared database and scanning built' },
                { date: '2026-07-23', text: 'Full login flow added' }
            ]
        },
        {
            date: '2026-08-02', title: 'Khatiwada Store Website', href: 'khatiwada-store.html', live: true,
            sub: [
                { date: '2026-08-02', text: 'Rebuilt from a non deployable design export' },
                { date: '2026-08-03', text: 'Live with TLS' },
                { date: '2026-08-04', text: 'Domain migrated, fully done' }
            ]
        }
    ];

    /* ---------- time axis ---------- */

    var PX_PER_MONTH = 76;
    var ORIGIN = parseDate('2020-01-01');

    function parseDate(s) {
        var parts = s.split('-');
        var y = parseInt(parts[0], 10);
        var m = parts[1] ? parseInt(parts[1], 10) - 1 : 5;
        var d = parts[2] ? parseInt(parts[2], 10) : 15;
        return new Date(Date.UTC(y, m, d));
    }

    function xForDate(s) {
        var d = parseDate(s);
        var months = (d.getUTCFullYear() - ORIGIN.getUTCFullYear()) * 12 + (d.getUTCMonth() - ORIGIN.getUTCMonth()) + (d.getUTCDate() - 1) / 30.4;
        return 140 + months * PX_PER_MONTH;
    }

    function formatDate(s) {
        var d = parseDate(s);
        var months = ['JAN', 'FEB', 'MAR', 'APR', 'MAY', 'JUN', 'JUL', 'AUG', 'SEP', 'OCT', 'NOV', 'DEC'];
        return months[d.getUTCMonth()] + ' ' + d.getUTCFullYear();
    }

    /* ---------- layout ---------- */

    var TRUNK_Y = 640;
    var BASE_REACH = 140;
    var LANE_STEP = 100;
    var MIN_GAP_PX = 130;

    TRUNK.forEach(function (n) { n.x = xForDate(n.date); });
    BRANCHES.sort(function (a, b) { return xForDate(a.date) - xForDate(b.date); });

    var lastBySide = { up: [], down: [] };
    BRANCHES.forEach(function (b, i) {
        b.x = xForDate(b.date);
        var side = i % 2 === 0 ? 'up' : 'down';
        var arr = lastBySide[side];
        var lane = 0;
        for (var j = 0; j < arr.length; j++) {
            if (Math.abs(b.x - arr[j].x) < MIN_GAP_PX) lane = Math.max(lane, arr[j].lane + 1);
        }
        arr.push({ x: b.x, lane: lane });
        b.side = side;
        b.lane = lane;
        b.reach = BASE_REACH + lane * LANE_STEP;
        b.y = side === 'up' ? TRUNK_Y - b.reach : TRUNK_Y + b.reach;
        b.nodeX = b.x + 90;
    });

    var maxX = Math.max.apply(null, TRUNK.map(function (n) { return n.x; }).concat(BRANCHES.map(function (b) { return b.nodeX + 260; })));
    var maxLane = Math.max.apply(null, BRANCHES.map(function (b) { return b.lane; }));
    var CANVAS_W = maxX + 200;
    var CANVAS_H = TRUNK_Y * 2 + (maxLane + 2) * LANE_STEP + 400;

    /* ---------- SVG build ---------- */

    var svgns = 'http://www.w3.org/2000/svg';
    function el(tag, attrs) {
        var e = document.createElementNS(svgns, tag);
        for (var k in attrs) e.setAttribute(k, attrs[k]);
        return e;
    }
    function txt(x, y, str, cls) {
        var t = el('text', { x: x, y: y, class: cls });
        t.textContent = str;
        return t;
    }

    var svg = el('svg', { width: CANVAS_W, height: CANVAS_H, viewBox: '0 0 ' + CANVAS_W + ' ' + CANVAS_H });
    var viewport = el('g', { id: 'tl-viewport' });
    svg.appendChild(viewport);

    /* faint month grid */
    var gridG = el('g', { opacity: '0.5' });
    var totalMonths = Math.ceil((CANVAS_W - 140) / PX_PER_MONTH);
    for (var mo = 0; mo <= totalMonths; mo += 6) {
        var gx = 140 + mo * PX_PER_MONTH;
        var yr = ORIGIN.getUTCFullYear() + Math.floor((ORIGIN.getUTCMonth() + mo) / 12);
        var mIdx = (ORIGIN.getUTCMonth() + mo) % 12;
        var lbl = ['JAN', 'JUL'][mIdx === 0 ? 0 : 1] + ' ' + yr;
        var line = el('line', { x1: gx, y1: 40, x2: gx, y2: CANVAS_H - 40, stroke: '#0e3b1f', 'stroke-width': '1' });
        gridG.appendChild(line);
        var gt = txt(gx + 6, 56, mIdx === 0 ? 'JAN ' + yr : 'JUL ' + yr, 'tl-sub-date');
        gt.setAttribute('opacity', '0.7');
        gridG.appendChild(gt);
    }
    viewport.appendChild(gridG);

    /* trunk line */
    var trunkPath = 'M ' + (TRUNK[0].x - 80) + ' ' + TRUNK_Y + ' L ' + (maxX + 60) + ' ' + TRUNK_Y;
    viewport.appendChild(el('path', { d: trunkPath, class: 'tl-trunk' }));
    var arrowTip = el('path', { d: 'M ' + (maxX + 60) + ' ' + TRUNK_Y + ' l -14 -8 l 0 16 z', fill: 'var(--green)' });
    viewport.appendChild(arrowTip);
    viewport.appendChild(txt(maxX + 74, TRUNK_Y + 5, 'NOW', 'tl-title'));

    /* trunk nodes */
    TRUNK.forEach(function (n) {
        var g = el('g', { class: 'tl-trunk-node' + (n.live ? ' live' : '') });
        g.appendChild(el('circle', { cx: n.x, cy: TRUNK_Y, r: 8 }));
        var above = n.type === 'edu';
        var ty = above ? TRUNK_Y - 26 : TRUNK_Y + 40;
        g.appendChild(txt(n.x, ty, formatDate(n.date), 'tl-date'));
        g.appendChild(txt(n.x, ty + (above ? -16 : 18), n.title, 'tl-title'));
        g.appendChild(txt(n.x, ty + (above ? -32 : 34), n.sub, 'tl-sub'));
        [].forEach.call(g.querySelectorAll('text'), function (t) { t.setAttribute('text-anchor', 'middle'); });
        viewport.appendChild(g);
    });

    /* dots for legend colour reuse on trunk */
    TRUNK.forEach(function (n) {
        var dotColor = n.type === 'edu' ? 'var(--gold)' : 'var(--mint)';
        var d = el('circle', { cx: n.x, cy: TRUNK_Y, r: 4, fill: dotColor });
        viewport.appendChild(d);
    });

    /* branches */
    var allGroups = [];
    var expandedGroup = null;

    BRANCHES.forEach(function (b, idx) {
        var group = el('g', { class: 'tl-branch-group', 'data-idx': idx });
        var c1x = b.x + 40, c1y = TRUNK_Y;
        var c2x = b.nodeX - 40, c2y = b.y;
        var d = 'M ' + b.x + ' ' + TRUNK_Y + ' C ' + c1x + ' ' + c1y + ', ' + c2x + ' ' + c2y + ', ' + b.nodeX + ' ' + b.y;
        group.appendChild(el('path', { d: d, class: 'tl-branch-path' }));

        var nodeG = el('g', { class: 'tl-branch-node' + (b.live ? ' live' : '') });
        nodeG.appendChild(el('circle', { cx: b.nodeX, cy: b.y, r: 9 }));
        group.appendChild(nodeG);

        var labelUp = b.side === 'up';
        var lx = b.nodeX + 16;
        var ly1 = b.y + (labelUp ? -6 : -6);
        group.appendChild(txt(lx, ly1, formatDate(b.date), 'tl-date'));
        group.appendChild(txt(lx, ly1 + 16, b.title, 'tl-title'));
        var hint = txt(lx, ly1 + 32, 'CLICK TO EXPAND ▾', 'tl-hint');
        group.appendChild(hint);

        var subG = el('g', { class: 'tl-sub-container', 'data-idx': idx, style: 'display:none' });
        group.appendChild(subG);

        group.addEventListener('click', function (ev) {
            ev.stopPropagation();
            toggleBranch(group, subG, b, hint);
        });

        allGroups.push(group);
        viewport.appendChild(group);
    });

    stage.addEventListener('click', function () {
        if (dragDistance > 6) return;
        if (expandedGroup) collapseGroup();
    });

    function collapseGroup() {
        if (!expandedGroup) return;
        expandedGroup.group.classList.remove('expanded');
        expandedGroup.subG.style.display = 'none';
        expandedGroup.hint.textContent = 'CLICK TO EXPAND ▾';
        allGroups.forEach(function (g) { g.classList.remove('tl-dimmed'); });
        expandedGroup = null;
    }

    function toggleBranch(group, subG, b, hint) {
        if (expandedGroup && expandedGroup.group === group) { collapseGroup(); return; }
        if (expandedGroup) collapseGroup();
        group.classList.add('expanded');
        subG.style.display = '';
        hint.textContent = 'CLICK TO COLLAPSE ▴';
        allGroups.forEach(function (g) { if (g !== group) g.classList.add('tl-dimmed'); });
        expandedGroup = { group: group, subG: subG, hint: hint };
        if (!subG.hasChildNodes()) {
            var dir = b.side === 'up' ? -1 : 1;
            var startX = b.nodeX + 60;
            var startY = b.y;
            var stepY = 34;
            b.sub.forEach(function (m, i) {
                var sy = startY + dir * (50 + i * stepY);
                var sx = startX + i * 18;
                var pd = 'M ' + b.nodeX + ' ' + b.y + ' L ' + sx + ' ' + sy;
                subG.appendChild(el('path', { d: pd, class: 'tl-sub-path' }));
                var sg = el('g', { class: 'tl-sub-node' });
                sg.appendChild(el('circle', { cx: sx, cy: sy, r: 4.5 }));
                sg.appendChild(txt(sx + 12, sy - 5, m.date, 'tl-sub-date'));
                var tnode = txt(sx + 12, sy + 11, m.text, 'tl-sub-text');
                sg.appendChild(tnode);
                subG.appendChild(sg);
            });
            if (b.href) {
                var lastY = startY + dir * (50 + b.sub.length * stepY);
                var linkG = el('a', {});
                linkG.setAttribute('href', b.href);
                var lt = txt(startX + b.sub.length * 18, lastY + dir * 30, 'OPEN COMPONENT PAGE →', 'tl-open-link');
                linkG.appendChild(lt);
                subG.appendChild(linkG);
            }
        }
    }

    stage.appendChild(svg);

    /* ---------- pan and zoom ---------- */

    var scale = 0.62, tx = 0, ty2 = 0;
    var dragging = false, lastX = 0, lastY = 0, dragDistance = 0;

    function applyTransform() {
        viewport.setAttribute('transform', 'translate(' + tx + ',' + ty2 + ') scale(' + scale + ')');
    }

    function centerOnNow() {
        var stageRect = stage.getBoundingClientRect();
        scale = 0.62;
        tx = stageRect.width - (maxX + 60) * scale - 60;
        ty2 = stageRect.height / 2 - TRUNK_Y * scale;
        applyTransform();
    }

    stage.addEventListener('mousedown', function (e) {
        dragging = true;
        dragDistance = 0;
        lastX = e.clientX; lastY = e.clientY;
        stage.classList.add('grabbing');
    });
    window.addEventListener('mouseup', function () { dragging = false; stage.classList.remove('grabbing'); });
    window.addEventListener('mousemove', function (e) {
        if (!dragging) return;
        dragDistance += Math.abs(e.clientX - lastX) + Math.abs(e.clientY - lastY);
        tx += e.clientX - lastX;
        ty2 += e.clientY - lastY;
        lastX = e.clientX; lastY = e.clientY;
        applyTransform();
    });

    var pinching = false, pinchStartDist = 0, pinchStartScale = 1, pinchMidX = 0, pinchMidY = 0, pinchWorldX = 0, pinchWorldY = 0;

    function touchDist(t0, t1) {
        var dx = t0.clientX - t1.clientX, dy = t0.clientY - t1.clientY;
        return Math.sqrt(dx * dx + dy * dy);
    }

    stage.addEventListener('touchstart', function (e) {
        if (e.touches.length === 1) {
            dragging = true;
            pinching = false;
            lastX = e.touches[0].clientX; lastY = e.touches[0].clientY;
        } else if (e.touches.length === 2) {
            dragging = false;
            pinching = true;
            pinchStartDist = touchDist(e.touches[0], e.touches[1]);
            pinchStartScale = scale;
            var rect = stage.getBoundingClientRect();
            pinchMidX = (e.touches[0].clientX + e.touches[1].clientX) / 2 - rect.left;
            pinchMidY = (e.touches[0].clientY + e.touches[1].clientY) / 2 - rect.top;
            pinchWorldX = (pinchMidX - tx) / scale;
            pinchWorldY = (pinchMidY - ty2) / scale;
        }
    }, { passive: true });
    stage.addEventListener('touchmove', function (e) {
        if (pinching && e.touches.length === 2) {
            var dist = touchDist(e.touches[0], e.touches[1]);
            var newScale = pinchStartScale * (dist / pinchStartDist);
            newScale = Math.max(0.18, Math.min(2.4, newScale));
            tx = pinchMidX - pinchWorldX * newScale;
            ty2 = pinchMidY - pinchWorldY * newScale;
            scale = newScale;
            applyTransform();
            return;
        }
        if (!dragging || e.touches.length !== 1) return;
        tx += e.touches[0].clientX - lastX;
        ty2 += e.touches[0].clientY - lastY;
        lastX = e.touches[0].clientX; lastY = e.touches[0].clientY;
        applyTransform();
    }, { passive: true });
    stage.addEventListener('touchend', function (e) {
        dragging = false;
        if (e.touches.length < 2) pinching = false;
        if (e.touches.length === 1) {
            dragging = true;
            lastX = e.touches[0].clientX; lastY = e.touches[0].clientY;
        }
    });

    stage.addEventListener('wheel', function (e) {
        e.preventDefault();
        var rect = stage.getBoundingClientRect();
        var mx = e.clientX - rect.left, my = e.clientY - rect.top;
        var worldX = (mx - tx) / scale, worldY = (my - ty2) / scale;
        var newScale = scale * (e.deltaY < 0 ? 1.12 : 0.89);
        newScale = Math.max(0.18, Math.min(2.4, newScale));
        tx = mx - worldX * newScale;
        ty2 = my - worldY * newScale;
        scale = newScale;
        applyTransform();
    }, { passive: false });

    var zoomInBtn = document.getElementById('tl-zoom-in');
    var zoomOutBtn = document.getElementById('tl-zoom-out');
    var resetBtn = document.getElementById('tl-reset');
    if (zoomInBtn) zoomInBtn.addEventListener('click', function () { scale = Math.min(2.4, scale * 1.25); applyTransform(); });
    if (zoomOutBtn) zoomOutBtn.addEventListener('click', function () { scale = Math.max(0.18, scale * 0.8); applyTransform(); });
    if (resetBtn) resetBtn.addEventListener('click', centerOnNow);

    centerOnNow();
})();
