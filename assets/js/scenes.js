/* ==========================================================================
   SCENES — procedural artwork in a GTA IV loading-screen–inspired style:
   tinted skies, flat cel-shaded clouds, layered city silhouettes and one
   bold subject per panel. Everything is original SVG generated in code;
   no game assets are used.

   Scenes.scene({ subject, tint, seed, ratio, figure }) -> SVG string
   Scenes.filterDefs() -> hidden <svg> with "ink-<tint>" photo filters
   ========================================================================== */
(function () {
  const SIZES = { wide: [800, 600], tall: [600, 800], square: [700, 700], banner: [1400, 600] };

  // sky: top→bottom, cloud: [light, shade], far/near: city layers,
  // duo: 4-step gradient map used to turn photos into the same artwork style.
  const PALETTES = {
    dusk:   { sky: ["#f8dd9c", "#efa04a", "#c8532b"], sun: "#fff3cf", cloud: ["#fde4ad", "#e3884a"], far: "#b5553a", near: "#5a2316", ink: "#1b0c07", glow: "#ffd27a", duo: ["#1b0c07", "#7a321f", "#e2843f", "#fbe3b0"] },
    harbor: { sky: ["#e4ecea", "#93b8be", "#497b88"], sun: "#f8f6ec", cloud: ["#f3f7f4", "#aec9cb"], far: "#3c6974", near: "#1c3941", ink: "#0a181c", glow: "#f3f1c4", duo: ["#0a181c", "#2b5561", "#89b3ba", "#eef3ef"] },
    park:   { sky: ["#f1efcc", "#c9c58d", "#8b8a51"], sun: "#fffbe2", cloud: ["#f8f6dc", "#cdc995"], far: "#6b6c3a", near: "#32351b", ink: "#14150a", glow: "#f6efb2", duo: ["#14150a", "#4c4f29", "#a9a764", "#f3f0cf"] },
    night:  { sky: ["#1d1f3d", "#45386a", "#b05a79"], sun: "#f6ebcc", cloud: ["#6a5889", "#3a305f"], far: "#382e57", near: "#151129", ink: "#07060f", glow: "#ffcc66", duo: ["#07060f", "#2d2550", "#9a5a86", "#f2dcc4"] },
    rust:   { sky: ["#f5dac7", "#db8d6a", "#9c3f2b"], sun: "#fff1e3", cloud: ["#fbe6d6", "#df9877"], far: "#8d3a27", near: "#481b12", ink: "#170805", glow: "#ffd9a8", duo: ["#170805", "#6e2a1b", "#d27b58", "#f8e2d2"] },
    mono:   { sky: ["#f2ede1", "#d2c9b5", "#918876"], sun: "#ffffff", cloud: ["#f8f4eb", "#d6cebd"], far: "#6e6657", near: "#2e2a24", ink: "#0f0e0c", glow: "#fff4d6", duo: ["#0f0e0c", "#4a443a", "#a79e8b", "#f3eee3"] }
  };

  let uid = 0;
  const lerp = (a, b, t) => a + (b - a) * t;
  const n = (v) => Math.round(v * 10) / 10;

  function rng(seed) {
    let a = seed >>> 0 || 1;
    return function () {
      a = (a + 0x6d2b79f5) | 0;
      let t = Math.imul(a ^ (a >>> 15), 1 | a);
      t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t;
      return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
    };
  }

  /* ---------- city building blocks ---------- */

  function spire(x, top, h, w) {
    return ` M${n(x - w / 2)} ${n(top + 2)} L${n(x - w * 0.18)} ${n(top - h)} H${n(x + w * 0.18)} L${n(x + w / 2)} ${n(top + 2)} Z`;
  }

  function waterTower(cx, roof, s) {
    const lh = s * 0.45, th = s * 0.7, tw = s * 0.7, x = cx - tw / 2, ty = roof - lh - th;
    return ` M${n(x + tw * 0.1)} ${n(roof + 1)} V${n(roof - lh)} H${n(x + tw * 0.2)} V${n(roof + 1)} Z` +
      ` M${n(x + tw * 0.8)} ${n(roof + 1)} V${n(roof - lh)} H${n(x + tw * 0.9)} V${n(roof + 1)} Z` +
      ` M${n(x + tw * 0.1)} ${n(roof - lh * 0.55)} H${n(x + tw * 0.9)} V${n(roof - lh * 0.45)} H${n(x + tw * 0.1)} Z` +
      ` M${n(x)} ${n(roof - lh)} V${n(ty)} L${n(cx)} ${n(ty - tw * 0.38)} L${n(x + tw)} ${n(ty)} V${n(roof - lh)} Z`;
  }

  // Stepped art-deco skyscraper with a needle spire.
  function decoTower(x, base, h, w) {
    const X = (f) => n(x + w * f), Y = (f) => n(base - h * f);
    return `M${X(0)} ${n(base)} V${Y(0.55)} H${X(0.08)} V${Y(0.66)} H${X(0.18)} V${Y(0.76)} H${X(0.3)} V${Y(0.85)} ` +
      `H${X(0.38)} V${Y(0.92)} H${X(0.44)} V${Y(0.98)} H${X(0.475)} V${Y(1.08)} L${X(0.496)} ${Y(1.32)} H${X(0.504)} ` +
      `L${X(0.525)} ${Y(1.08)} V${Y(0.98)} H${X(0.56)} V${Y(0.92)} H${X(0.62)} V${Y(0.85)} H${X(0.7)} V${Y(0.76)} ` +
      `H${X(0.82)} V${Y(0.66)} H${X(0.92)} V${Y(0.55)} H${X(1)} V${n(base)} Z`;
  }

  function windowGrid(R, x, y0, w, base, p, u) {
    let d = "";
    const cw = 7 * u, ch = 9 * u, ww = 3 * u, wh = 4 * u;
    for (let y = y0 + 6 * u; y < base - 6 * u; y += ch)
      for (let xx = x + 4 * u; xx < x + w - 5 * u; xx += cw)
        if (R() < p) d += `M${n(xx)} ${n(y)}h${n(ww)}v${n(wh)}h${n(-ww)}z`;
    return d;
  }

  // A continuous silhouette of buildings between x0 and x1 standing on `base`.
  function skyline(R, o) {
    const u = o.unit || 1;
    let x = o.x0, d = `M${n(o.x0)} ${n(o.base)}`, extras = "", lights = "";
    while (x < o.x1) {
      const w = lerp(o.minW, o.maxW, R());
      const h = lerp(o.minH, o.maxH, Math.pow(R(), 1.5));
      const top = o.base - h, k = R();
      if (k < 0.1 && h > o.maxH * 0.45) {
        const s = w * 0.14;
        d += ` L${n(x)} ${n(top + h * 0.2)} H${n(x + s)} V${n(top + h * 0.1)} H${n(x + 2 * s)} V${n(top)} H${n(x + w - 2 * s)} V${n(top + h * 0.1)} H${n(x + w - s)} V${n(top + h * 0.2)} H${n(x + w)}`;
        extras += spire(x + w / 2, top, h * 0.25, Math.max(1.5 * u, w * 0.08));
      } else if (k < 0.2) {
        d += ` L${n(x)} ${n(top)} L${n(x + w / 2)} ${n(top - Math.min(w * 0.42, h * 0.25))} L${n(x + w)} ${n(top)}`;
      } else if (k < 0.36) {
        d += ` L${n(x)} ${n(top)} H${n(x + w)}`;
        extras += waterTower(x + w * lerp(0.25, 0.65, R()), top, Math.min(w * 0.5, 34 * u));
      } else if (k < 0.48) {
        d += ` L${n(x)} ${n(top)} H${n(x + w)}`;
        extras += spire(x + w * lerp(0.3, 0.7, R()), top, h * lerp(0.1, 0.26, R()), Math.max(1.2 * u, w * 0.04));
      } else if (k < 0.62) {
        const s = w * lerp(0.15, 0.3, R());
        d += ` L${n(x)} ${n(top + h * 0.1)} H${n(x + s)} V${n(top)} H${n(x + w - s)} V${n(top + h * 0.1)} H${n(x + w)}`;
      } else {
        d += ` L${n(x)} ${n(top)} H${n(x + w)}`;
      }
      if (o.windows) lights += windowGrid(R, x, top + h * 0.12, w, o.base, o.windows, u);
      x += w;
      if (R() < 0.1) {
        const g = lerp(3, 14, R()) * u;
        d += ` V${n(o.base)} H${n(x + g)}`;
        x += g;
      }
    }
    d += ` V${n(o.base)} Z`;
    return { body: d, extras, lights };
  }

  function city(R, o, fill, glow) {
    const c = skyline(R, o);
    let s = `<path d="${c.body}" fill="${fill}"/>`;
    if (c.extras) s += `<path d="${c.extras}" fill="${fill}"/>`;
    if (c.lights) s += `<path d="${c.lights}" fill="${glow}" opacity=".85"/>`;
    return s;
  }

  /* ---------- sky ---------- */

  function clouds(R, W, H, P, count, y0, y1) {
    let dark = "", light = "";
    for (let i = 0; i < count; i++) {
      const cx = lerp(-0.1, 1.1, R()) * W, cy = lerp(y0, y1, R()) * H, s = lerp(0.05, 0.1, R()) * Math.max(W, H);
      const blobs = 3 + Math.floor(R() * 4);
      for (let j = 0; j < blobs; j++) {
        const bx = cx + (j - blobs / 2) * s * lerp(0.55, 0.85, R());
        const by = cy - R() * s * 0.35;
        const r = s * lerp(0.5, 0.85, R());
        light += `<ellipse cx="${n(bx)}" cy="${n(by)}" rx="${n(r * 1.3)}" ry="${n(r * 0.5)}"/>`;
        dark += `<ellipse cx="${n(bx + r * 0.08)}" cy="${n(by + r * 0.2)}" rx="${n(r * 1.3)}" ry="${n(r * 0.5)}"/>`;
      }
    }
    return `<g fill="${P.cloud[1]}">${dark}</g><g fill="${P.cloud[0]}">${light}</g>`;
  }

  function streaks(R, W, H, P, count, y0, y1) {
    let s = "";
    for (let i = 0; i < count; i++) {
      const w = lerp(0.15, 0.45, R()) * W, x = lerp(-0.1, 1, R()) * W, y = lerp(y0, y1, R()) * H;
      s += `<rect x="${n(x)}" y="${n(y)}" width="${n(w)}" height="${n(lerp(2, 7, R()))}" rx="4"/>`;
    }
    return `<g fill="${P.cloud[0]}" opacity=".55">${s}</g>`;
  }

  function sun(W, H, P, id, x, y, r, rays) {
    let s = "";
    if (rays) {
      let d = "";
      const count = 16, L = Math.max(W, H) * 1.4;
      for (let i = 0; i < count; i++) {
        const a0 = (i / count) * Math.PI * 2, a1 = a0 + (Math.PI / count) * 0.6;
        d += `M${n(x)} ${n(y)}L${n(x + Math.cos(a0) * L)} ${n(y + Math.sin(a0) * L)}L${n(x + Math.cos(a1) * L)} ${n(y + Math.sin(a1) * L)}Z`;
      }
      s += `<path d="${d}" fill="${P.sun}" opacity=".12"/>`;
    }
    s += `<circle cx="${n(x)}" cy="${n(y)}" r="${n(r * 4.5)}" fill="url(#${id}h)"/>`;
    s += `<circle cx="${n(x)}" cy="${n(y)}" r="${n(r)}" fill="${P.sun}"/>`;
    return s;
  }

  function stars(R, W, H) {
    let s = "";
    for (let i = 0; i < 70; i++) s += `<circle cx="${n(R() * W)}" cy="${n(R() * H * 0.5)}" r="${n(lerp(0.6, 1.8, R()))}"/>`;
    return `<g fill="#fff" opacity=".7">${s}</g>`;
  }

  function water(R, W, H, P, id, y, sx, u) {
    let s = `<rect x="-2" y="${n(y)}" width="${W + 4}" height="${n(H - y + 2)}" fill="url(#${id}w)"/>`;
    let d = "";
    for (let i = 0; i < 14; i++) {
      const yy = y + 6 * u + i * (H - y) / 14;
      const w = lerp(20, 90, R()) * u * (1 - i / 20);
      const x = sx + lerp(-60, 60, R()) * u;
      d += `M${n(x - w / 2)} ${n(yy)}h${n(w)}`;
    }
    s += `<path d="${d}" stroke="${P.sun}" stroke-width="${n(2.2 * u)}" stroke-linecap="round" opacity=".55"/>`;
    return s;
  }

  /* ---------- subjects ---------- */

  const HEAD = "M200 128 C262 128 284 186 280 238 C276 296 244 344 200 344 C156 344 124 296 120 238 C116 186 138 128 200 128 Z";

  // Cel-shaded character bust, backlit, in shades — a stand-in until a photo is added.
  function bust(H, P, id, cx) {
    const sc = (H * 0.86) / 500, tx = cx - 200 * sc, ty = H - 500 * sc;
    return `<g transform="translate(${n(tx)} ${n(ty)}) scale(${sc.toFixed(4)})">
      <defs>
        <clipPath id="${id}hc"><path d="${HEAD}"/></clipPath>
        <clipPath id="${id}rc"><rect x="256" y="150" width="60" height="170"/></clipPath>
      </defs>
      <path d="M6 500 C16 418 80 386 160 370 L240 370 C320 386 384 418 394 500 Z" fill="${P.ink}"/>
      <path d="M6 500 C16 418 80 386 160 370 L176 378 L146 500 Z" fill="${P.near}"/>
      <path d="M302 390 C342 404 380 432 392 500" fill="none" stroke="${P.sun}" stroke-width="5" opacity=".9"/>
      <path d="M166 316 L234 316 L240 384 L160 384 Z" fill="${P.near}"/>
      <path d="M198 316 L234 316 L240 384 L194 384 Z" fill="${P.ink}"/>
      <path d="M164 318 C178 352 222 354 236 318 L238 356 L162 356 Z" fill="${P.ink}" opacity=".85"/>
      <path d="M160 372 L200 448 L240 372 L222 366 L200 404 L178 366 Z" fill="${P.far}"/>
      <path d="M162 374 L198 468 L186 500 M238 374 L202 468 L214 500" fill="none" stroke="${P.near}" stroke-width="4"/>
      <path d="M124 228 C104 224 102 268 126 274 Z" fill="${P.near}"/>
      <path d="M276 228 C296 224 298 268 274 274 Z" fill="${P.ink}"/>
      <path d="${HEAD}" fill="${P.near}"/>
      <g clip-path="url(#${id}hc)">
        <path d="M212 110 C228 190 240 262 208 360 L330 360 L330 110 Z" fill="${P.ink}"/>
        <path d="M110 296 C150 356 250 356 290 296 L290 370 L110 370 Z" fill="${P.ink}" opacity=".35"/>
      </g>
      <path d="${HEAD}" fill="none" stroke="${P.sun}" stroke-width="7" clip-path="url(#${id}rc)"/>
      <path d="M118 228 C108 156 150 110 204 112 C264 114 298 160 284 228 C278 196 262 174 238 166 C212 158 174 162 154 174 C136 186 124 204 118 228 Z" fill="${P.ink}"/>
      <path d="M150 146 C172 128 206 122 236 128" fill="none" stroke="${P.far}" stroke-width="5" stroke-linecap="round" opacity=".8"/>
      <path d="M134 214 H266" stroke="${P.ink}" stroke-width="6"/>
      <path d="M136 216 C136 206 192 206 194 216 C196 236 186 250 166 250 C146 250 136 236 136 216 Z" fill="${P.ink}"/>
      <path d="M206 216 C208 206 264 206 264 216 C264 236 254 250 234 250 C214 250 204 236 206 216 Z" fill="${P.ink}"/>
      <path d="M148 224 L164 213 M218 224 L234 213" stroke="${P.sun}" stroke-width="3" stroke-linecap="round" opacity=".75"/>
      <path d="M200 248 L190 284 Q198 290 208 286 Z" fill="${P.ink}" opacity=".55"/>
      <path d="M184 312 Q200 317 216 312" fill="none" stroke="${P.ink}" stroke-width="4" stroke-linecap="round" opacity=".7"/>
    </g>`;
  }

  // Gothic-arch suspension bridge with fanning stay cables.
  function bridge(W, H, P, u) {
    const deck = H * 0.72, ink = P.ink;
    const t1 = { x: W * 0.6, w: W * 0.12, top: H * 0.12 };
    const t2 = { x: W * 0.1, w: W * 0.055, top: H * 0.44 };
    const c1 = [t2.x + t2.w / 2, t2.top + 6 * u];
    const c2 = [t1.x + t1.w / 2, t1.top + 10 * u];
    const c3 = [W + 20, deck - 30 * u];
    const low = deck - 24 * u;
    const k1 = [(c1[0] + c2[0]) / 2, (low - 0.25 * c1[1] - 0.25 * c2[1]) / 0.5];
    const k2 = [c2[0] + (c3[0] - c2[0]) * 0.45, deck - 10 * u];
    const q = (a, k, b, t) => [
      (1 - t) * (1 - t) * a[0] + 2 * (1 - t) * t * k[0] + t * t * b[0],
      (1 - t) * (1 - t) * a[1] + 2 * (1 - t) * t * k[1] + t * t * b[1]
    ];
    let hang = "";
    for (let t = 0.04; t < 1; t += 0.035) { const p = q(c1, k1, c2, t); if (p[1] < deck) hang += `M${n(p[0])} ${n(p[1])}V${n(deck)}`; }
    for (let t = 0.05; t < 1; t += 0.05) { const p = q(c2, k2, c3, t); if (p[1] < deck) hang += `M${n(p[0])} ${n(p[1])}V${n(deck)}`; }
    let stays = "";
    for (let i = 1; i <= 6; i++) {
      stays += `M${n(c2[0])} ${n(c2[1] + 8 * u)}L${n(c2[0] - i * W * 0.045)} ${n(deck)}`;
      stays += `M${n(c2[0])} ${n(c2[1] + 8 * u)}L${n(c2[0] + i * W * 0.04)} ${n(deck)}`;
    }
    const cable = `M${n(c1[0])} ${n(c1[1])}Q${n(k1[0])} ${n(k1[1])} ${n(c2[0])} ${n(c2[1])}Q${n(k2[0])} ${n(k2[1])} ${n(c3[0])} ${n(c3[1])}`;
    const tower = (t) => {
      const x = t.x, w = t.w, top = t.top, b = H + 2, aw = w * 0.26, ah = (deck - top) * 0.42, ay = deck - 2 * u;
      let d = `M${n(x)} ${b}V${n(top + w * 0.25)}L${n(x + w * 0.08)} ${n(top)}H${n(x + w * 0.92)}L${n(x + w)} ${n(top + w * 0.25)}V${b}Z`;
      [x + w * 0.14, x + w * 0.6].forEach((ax) => {
        d += `M${n(ax)} ${n(ay)}V${n(ay - ah)}Q${n(ax)} ${n(ay - ah - aw * 0.9)} ${n(ax + aw / 2)} ${n(ay - ah - aw * 1.1)}Q${n(ax + aw)} ${n(ay - ah - aw * 0.9)} ${n(ax + aw)} ${n(ay - ah)}V${n(ay)}Z`;
      });
      return `<path fill-rule="evenodd" fill="${ink}" d="${d}"/>`;
    };
    return `<g fill="none" stroke="${ink}">
        <path d="${hang}" stroke-width="${n(1.4 * u)}" opacity=".85"/>
        <path d="${stays}" stroke-width="${n(1.2 * u)}" opacity=".75"/>
        <path d="${cable}" stroke-width="${n(3.2 * u)}"/>
        <path d="${cable}" stroke-width="${n(1.6 * u)}" transform="translate(0 ${n(5 * u)})" opacity=".8"/>
      </g>
      <rect x="-10" y="${n(deck - 6 * u)}" width="${W + 20}" height="${n(2.2 * u)}" fill="${ink}"/>
      <rect x="-10" y="${n(deck)}" width="${W + 20}" height="${n(H * 0.03)}" fill="${ink}"/>
      ${tower(t2)}${tower(t1)}`;
  }

  // A lady with a torch... or is that a coffee cup?
  function statue(W, H, P) {
    const sc = (H * 0.8) / 400, cx = W * 0.68, tx = cx - 100 * sc, ty = H * 0.95 - 400 * sc;
    const ink = P.ink;
    return `<g transform="translate(${n(tx)} ${n(ty)}) scale(${sc.toFixed(4)})">
      <g fill="${ink}">
        <path d="M-60 430 Q100 388 260 430 Z"/>
        <path d="M30 404 L170 404 L162 372 L38 372 Z"/>
        <path d="M46 372 L154 372 L148 300 L52 300 Z"/>
        <path d="M40 300 L160 300 L160 290 L40 290 Z"/>
        <path d="M60 290 L140 290 L134 270 L66 270 Z"/>
        <path d="M72 270 C74 222 80 186 86 156 L114 156 C120 186 126 222 128 270 Z"/>
        <path d="M86 158 L84 132 Q100 120 116 132 L114 158 Z"/>
        <circle cx="100" cy="112" r="11"/>
        <path d="M86 106 L76 96 L90 100 L90 86 L97 98 L103 84 L106 98 L114 88 L113 103 L124 98 L114 108 Z"/>
        <path d="M88 134 L72 66 L80 64 L96 130 Z"/>
        <path d="M64 64 L88 64 L85 46 L67 46 Z"/>
        <path d="M85 50 C96 50 96 61 86 61 L86 57 C91 57 91 54 85 54 Z"/>
        <path d="M114 140 L132 150 L130 178 L116 172 Z"/>
      </g>
      <path d="M71 40 C65 32 77 28 71 18 M80 40 C74 32 86 28 80 18" fill="none" stroke="${ink}" stroke-width="2.5" stroke-linecap="round"/>
      <path d="M92 150 C96 190 98 230 96 268" fill="none" stroke="${P.far}" stroke-width="2" opacity=".6"/>
    </g>`;
  }

  // Giant art-deco tower, lit from the left.
  function tower(W, H, P, id) {
    const w = W * 0.3, h = H * 0.7, x = W * 0.62 - w / 2, base = H + 2;
    const d = decoTower(x, base, h, w);
    let strips = "";
    for (let f = 0.05; f < 0.95; f += 0.075) {
      const sx = x + w * f;
      strips += `M${n(sx)} ${n(base - h * 0.5)}V${n(base)}`;
    }
    return `<defs><clipPath id="${id}tl"><rect x="0" y="0" width="${n(x + w * 0.5)}" height="${H}"/></clipPath></defs>
      <path d="${d}" fill="${P.ink}"/>
      <path d="${d}" fill="${P.near}" clip-path="url(#${id}tl)"/>
      <path d="${strips}" stroke="${P.ink}" stroke-width="${n(w * 0.012)}" opacity=".55"/>
      <path d="M${n(x + w * 0.5)} ${n(base - h * 1.32)}V${n(base)}" stroke="${P.sun}" stroke-width="2" opacity=".7"/>`;
  }

  // Elevated subway: steel girder, columns and a train heading home.
  function train(W, H, P, u) {
    const y = H * 0.7, gh = H * 0.055, ink = P.ink;
    let cols = "";
    for (let x = W * 0.06; x < W; x += W * 0.22) {
      const cw = 14 * u;
      cols += `M${n(x)} ${n(y + gh)}H${n(x + cw)}V${H + 2}H${n(x)}Z`;
      cols += `M${n(x + cw)} ${n(y + gh + 34 * u)}L${n(x + cw + 36 * u)} ${n(y + gh)}H${n(x + cw + 44 * u)}L${n(x + cw)} ${n(y + gh + 44 * u)}Z`;
      cols += `M${n(x)} ${n(y + gh + 34 * u)}L${n(x - 36 * u)} ${n(y + gh)}H${n(x - 44 * u)}L${n(x)} ${n(y + gh + 44 * u)}Z`;
    }
    let truss = "";
    for (let x = -gh; x < W + gh; x += gh) truss += `M${n(x)} ${n(y + 5 * u)}L${n(x + gh / 2)} ${n(y + gh - 5 * u)}L${n(x + gh)} ${n(y + 5 * u)}`;
    const ch = H * 0.1, cy = y - 7 * u - ch, cw = W * 0.27, gap = 7 * u;
    let cars = "", wins = "", wheels = "";
    for (let i = 0; i < 3; i++) {
      const x = -W * 0.2 + i * (cw + gap);
      const nose = i === 2;
      cars += nose
        ? `M${n(x)} ${n(cy)}H${n(x + cw - 24 * u)}Q${n(x + cw)} ${n(cy)} ${n(x + cw)} ${n(cy + ch * 0.5)}V${n(cy + ch)}H${n(x)}Z`
        : `M${n(x)} ${n(cy)}H${n(x + cw)}V${n(cy + ch)}H${n(x)}Z`;
      for (let wx = x + 14 * u; wx < x + cw - 30 * u; wx += 26 * u) wins += `M${n(wx)} ${n(cy + ch * 0.2)}h${n(16 * u)}v${n(ch * 0.34)}h${n(-16 * u)}z`;
      if (nose) wins += `M${n(x + cw - 22 * u)} ${n(cy + ch * 0.2)}h${n(14 * u)}v${n(ch * 0.34)}h${n(-14 * u)}z`;
      wheels += `<circle cx="${n(x + 26 * u)}" cy="${n(cy + ch + 2 * u)}" r="${n(6 * u)}"/><circle cx="${n(x + cw - 26 * u)}" cy="${n(cy + ch + 2 * u)}" r="${n(6 * u)}"/>`;
    }
    const front = -W * 0.2 + 2 * (cw + gap) + cw;
    return `<path d="M${n(front)} ${n(cy + ch * 0.55)}L${n(front + W * 0.5)} ${n(cy + ch * 0.1)}V${n(cy + ch * 1.05)}Z" fill="${P.glow}" opacity=".22"/>
      <path d="${cols}" fill="${ink}"/>
      <rect x="-10" y="${n(y)}" width="${W + 20}" height="${n(gh)}" fill="${ink}"/>
      <path d="${truss}" fill="none" stroke="${P.near}" stroke-width="${n(2 * u)}"/>
      <rect x="-10" y="${n(y - 5 * u)}" width="${W + 20}" height="${n(3 * u)}" fill="${ink}"/>
      <path d="${cars}" fill="${ink}"/>
      <path d="${wins}" fill="${P.glow}"/>
      <g fill="${ink}">${wheels}</g>`;
  }

  /* ---------- composition ---------- */

  function scene(opts) {
    const o = Object.assign({ subject: "skyline", tint: "dusk", seed: 1, ratio: "wide", figure: true }, opts);
    const P = PALETTES[o.tint] || PALETTES.dusk;
    const [W, H] = SIZES[o.ratio] || SIZES.wide;
    const R = rng(o.seed * 7919 + o.subject.length * 131 + 7);
    const id = "sc" + (++uid);
    const u = Math.min(W, H) / 600;
    const night = o.tint === "night";

    // Per-subject layout: horizon line and sun position (fractions of H/W).
    const L = {
      portrait: { hz: 0.76, sx: 0.74, sy: 0.36, water: false },
      skyline:  { hz: 0.78, sx: 0.44, sy: 0.5, water: true },
      bridge:   { hz: 0.64, sx: 0.32, sy: 0.4, water: true },
      statue:   { hz: 0.8, sx: 0.3, sy: 0.46, water: true },
      tower:    { hz: 0.86, sx: 0.28, sy: 0.34, water: false },
      train:    { hz: 0.72, sx: 0.7, sy: 0.42, water: false }
    }[o.subject] || { hz: 0.78, sx: 0.5, sy: 0.45, water: true };
    const hz = H * L.hz, sx = W * L.sx, sy = H * L.sy, sr = Math.min(W, H) * 0.075;

    let s = `<svg class="scene-svg" viewBox="0 0 ${W} ${H}" preserveAspectRatio="xMidYMid slice" aria-hidden="true" focusable="false" xmlns="http://www.w3.org/2000/svg">
      <defs>
        <linearGradient id="${id}s" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="${P.sky[0]}"/><stop offset=".55" stop-color="${P.sky[1]}"/><stop offset="1" stop-color="${P.sky[2]}"/></linearGradient>
        <radialGradient id="${id}h"><stop offset="0" stop-color="${P.sun}" stop-opacity=".95"/><stop offset=".3" stop-color="${P.sun}" stop-opacity=".35"/><stop offset="1" stop-color="${P.sun}" stop-opacity="0"/></radialGradient>
        <linearGradient id="${id}w" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="${P.far}"/><stop offset="1" stop-color="${P.near}"/></linearGradient>
      </defs>
      <rect width="${W}" height="${H}" fill="url(#${id}s)"/>`;

    if (night) s += stars(R, W, H);
    s += sun(W, H, P, id, sx, sy, sr, !night);
    s += clouds(R, W, H, P, night ? 4 : 6, 0.06, 0.38);
    s += streaks(R, W, H, P, 5, L.hz - 0.3, L.hz - 0.08);

    // Far city, hazy, with a landmark tower.
    const farMax = o.subject === "bridge" ? H * 0.2 : H * 0.3;
    if (o.subject === "statue") {
      s += city(R, { x0: -20, x1: W * 0.46, base: hz, minH: H * 0.04, maxH: H * 0.22, minW: 14 * u, maxW: 40 * u, unit: u }, P.far, P.glow);
    } else {
      s += `<path d="${decoTower(W * 0.2, hz + 2, farMax * 1.25, W * 0.07)}" fill="${P.far}"/>`;
      s += city(R, { x0: -20, x1: W + 20, base: hz + 2, minH: H * 0.05, maxH: farMax, minW: 16 * u, maxW: 46 * u, unit: u }, P.far, P.glow);
    }
    if (L.water) s += water(R, W, H, P, id, hz, sx, u);

    switch (o.subject) {
      case "portrait":
        s += city(R, { x0: -20, x1: W + 20, base: H + 2, minH: H * 0.06, maxH: H * 0.24, minW: 24 * u, maxW: 60 * u, windows: 0.1, unit: u }, P.near, P.glow);
        if (o.figure) s += bust(H, P, id, W * 0.5);
        break;
      case "skyline":
        s += city(R, { x0: -30, x1: W * 0.24, base: H + 2, minH: H * 0.3, maxH: H * 0.7, minW: 40 * u, maxW: 90 * u, windows: 0.12, unit: u }, P.ink, P.glow);
        s += city(R, { x0: W * 0.8, x1: W + 30, base: H + 2, minH: H * 0.25, maxH: H * 0.62, minW: 40 * u, maxW: 90 * u, windows: 0.12, unit: u }, P.ink, P.glow);
        break;
      case "bridge":
        s += bridge(W, H, P, u);
        break;
      case "statue":
        s += statue(W, H, P);
        break;
      case "tower":
        s += city(R, { x0: -20, x1: W * 0.45, base: H + 2, minH: H * 0.08, maxH: H * 0.3, minW: 30 * u, maxW: 70 * u, windows: 0.08, unit: u }, P.near, P.glow);
        s += tower(W, H, P, id);
        break;
      case "train":
        s += city(R, { x0: -20, x1: W + 20, base: H + 2, minH: H * 0.25, maxH: H * 0.5, minW: 34 * u, maxW: 80 * u, windows: 0.1, unit: u }, P.near, P.glow);
        s += train(W, H, P, u);
        break;
    }
    return s + "</svg>";
  }

  // Turns any photo into the same tinted, posterised, ink-lined look.
  // Use with CSS: filter: url(#ink-dusk)
  function filterDefs() {
    const rgb = (h) => [1, 3, 5].map((i) => parseInt(h.slice(i, i + 2), 16) / 255);
    const fn = (type, attrs) => ["R", "G", "B"].map((c) => `<feFunc${c} type="${type}" ${attrs(c)}/>`).join("");
    let s = '<svg class="filter-defs" width="0" height="0" aria-hidden="true" focusable="false" style="position:absolute"><defs>';
    for (const [name, P] of Object.entries(PALETTES)) {
      const c = P.duo.map(rgb);
      const table = (ch) => `tableValues="${c.map((v) => v["RGB".indexOf(ch)].toFixed(3)).join(" ")}"`;
      s += `<filter id="ink-${name}" x="0" y="0" width="100%" height="100%" color-interpolation-filters="sRGB">
        <feColorMatrix type="matrix" values=".3 .55 .15 0 0  .3 .55 .15 0 0  .3 .55 .15 0 0  0 0 0 1 0" result="g"/>
        <feComponentTransfer in="g" result="c">${fn("linear", () => 'slope="1.35" intercept="-0.14"')}</feComponentTransfer>
        <feComponentTransfer in="c" result="p">${fn("discrete", () => 'tableValues="0 0.34 0.67 1"')}</feComponentTransfer>
        <feComponentTransfer in="p" result="duo">${fn("table", table)}</feComponentTransfer>
        <feGaussianBlur in="g" stdDeviation="1.4" result="b"/>
        <feConvolveMatrix in="b" order="3" kernelMatrix="-1 -1 -1 -1 8 -1 -1 -1 -1" preserveAlpha="true" result="e"/>
        <feColorMatrix in="e" type="matrix" values="0 0 0 0 ${c[0][0].toFixed(3)}  0 0 0 0 ${c[0][1].toFixed(3)}  0 0 0 0 ${c[0][2].toFixed(3)}  7 0 0 0 -0.45" result="lines"/>
        <feMerge><feMergeNode in="duo"/><feMergeNode in="lines"/></feMerge>
      </filter>`;
    }
    return s + "</defs></svg>";
  }

  window.Scenes = { scene, filterDefs, palettes: PALETTES };
})();
