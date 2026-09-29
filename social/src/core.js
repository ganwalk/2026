// GANWALK — motor de composição para reels (1080x1920, determinístico por frame)
const W = 1080, H = 1920, FPS = 30;
const PAL = {
  bg: '#120c07', cream: '#ece0c6', must: '#d99a4e', red: '#c1442e',
  dim: '#8a7355', comment: '#6b5a42', str: '#c9a876', op: '#a3835a',
  bgRGB: [18, 12, 7], creamRGB: [236, 224, 198], mustRGB: [217, 154, 78], redRGB: [193, 68, 46]
};
const C = document.getElementById('c');
C.width = W; C.height = H;
const g = C.getContext('2d', { willReadFrequently: true });

// ---------- util ----------
function mulberry(a) { return function () { a |= 0; a = a + 0x6D2B79F5 | 0; let t = Math.imul(a ^ a >>> 15, 1 | a); t = t + Math.imul(t ^ t >>> 7, 61 | t) ^ t; return ((t ^ t >>> 14) >>> 0) / 4294967296; }; }
let R = mulberry(1);
const clamp = (x, a = 0, b = 1) => Math.max(a, Math.min(b, x));
const lerp = (a, b, t) => a + (b - a) * t;
const ease = t => t < 0.5 ? 4 * t * t * t : 1 - Math.pow(-2 * t + 2, 3) / 2;
const easeOut = t => 1 - Math.pow(1 - clamp(t), 3);
const inR = (t, a, b) => t >= a && t < b;
const prog = (t, a, b) => clamp((t - a) / (b - a));
function mk(w, h) { const c = document.createElement('canvas'); c.width = w; c.height = h; return c; }
function loadImg(src) { return new Promise(r => { const i = new Image(); i.onload = () => r(i); i.src = src; }); }

let DATA, BANDS, IMG;
function band(f) { const b = BANDS[Math.min(BANDS.length - 1, Math.max(0, f))]; return { bass: b[0], mid: b[1], high: b[2], rms: b[3], on: b[4] }; }

async function boot(json) {
  DATA = await (await fetch(json)).json(); BANDS = DATA.bands;
  IMG = await loadImg('capa.jpg');
  await document.fonts.load('700 100px Astloch'); await document.fonts.load('400 40px Silkscreen');
  await document.fonts.load('700 40px Silkscreen'); await document.fonts.load('400 40px Inter');
  await document.fonts.load('700 40px Inter');
  buildGrain();
  return Math.round(DATA.dur * FPS);
}

// ---------- texto ----------
const F = {
  ast: s => `700 ${s}px Astloch`, silk: s => `400 ${s}px Silkscreen`, silkB: s => `700 ${s}px Silkscreen`,
  inter: s => `400 ${s}px Inter`, interB: s => `700 ${s}px Inter`, mono: s => `700 ${s}px "DejaVu Sans Mono", monospace`
};
function txt(s, x, y, font, color, align = 'center', glow = 0, ctx = g) {
  ctx.font = font; ctx.textAlign = align; ctx.textBaseline = 'middle'; ctx.fillStyle = color;
  if (glow) { ctx.shadowColor = color; ctx.shadowBlur = glow; }
  ctx.fillText(s, x, y); ctx.shadowBlur = 0;
}
function fitSize(s, fontFn, maxW, maxSize, minSize = 20) {
  let sz = maxSize; g.font = fontFn(sz);
  const w = g.measureText(s).width; if (w > maxW) sz = Math.max(minSize, Math.floor(sz * maxW / w));
  return sz;
}
function wrap(s, fontFn, size, maxW) {
  g.font = fontFn(size); const words = s.split(' '); const out = []; let cur = '';
  for (const w of words) { const t = cur ? cur + ' ' + w : w; if (g.measureText(t).width > maxW && cur) { out.push(cur); cur = w; } else cur = t; }
  if (cur) out.push(cur); return out;
}
// máscara do site: caracteres não revelados viram ▓, fronteira embaralhada
const SCR = 'ganwalk▓░/\\_#<>';
function reveal(s, p, seed = 0) {
  const n = s.length, k = Math.floor(p * (n + 3)); const r = mulberry(seed + Math.floor(p * 40)); let o = '';
  for (let i = 0; i < n; i++) {
    const ch = s[i];
    if (ch === ' ') { o += ' '; continue; }
    if (i < k - 2) o += ch; else if (i < k + 1) o += SCR[Math.floor(r() * SCR.length)]; else o += '▓';
  }
  return o;
}
function maskAll(s) { return s.replace(/[^ ]/g, '▓'); }
// ▓ não existe na Silkscreen/Astloch: desenha blocos manualmente, resto com a fonte
function glyphLine(s, x, y, size, fontFn, color, align = 'center', glow = 0, ctx = g) {
  ctx.font = fontFn(size); ctx.textBaseline = 'middle';
  const widths = [...s].map(ch => ch === '▓' || ch === '░' ? size * 0.62 : ctx.measureText(ch).width);
  const total = widths.reduce((a, b) => a + b, 0);
  let cx = align === 'center' ? x - total / 2 : align === 'right' ? x - total : x;
  ctx.fillStyle = color; if (glow) { ctx.shadowColor = color; ctx.shadowBlur = glow; }
  [...s].forEach((ch, i) => {
    if (ch === '▓' || ch === '░') {
      const a = ctx.globalAlpha; ctx.globalAlpha = a * (ch === '▓' ? 0.55 : 0.3);
      ctx.fillRect(cx + size * 0.05, y - size * 0.36, widths[i] - size * 0.1, size * 0.72); ctx.globalAlpha = a;
    } else { ctx.textAlign = 'left'; ctx.fillText(ch, cx, y); }
    cx += widths[i];
  });
  ctx.shadowBlur = 0; return total;
}

// ---------- imagem ----------
// recorte "cover" da capa (coords em px da imagem 3000x3000)
function drawCrop(ctx, sx, sy, sw, sh, dx, dy, dw, dh) { ctx.drawImage(IMG, sx, sy, sw, sh, dx, dy, dw, dh); }
const CROPS = {
  figure: [1080, 180, 1780, 2820],     // pessoa (vertical)
  full: [0, 0, 3000, 3000],
  face1: [135, 800, 780, 390],          // painel esquerdo, rosto 1
  face2: [135, 1225, 780, 440],
  face3: [135, 1715, 780, 440],
  panel: [70, 60, 900, 2880],           // painel inteiro
  plant: [800, 600, 900, 1500],
  clip: [0, 0, 720, 540]              // clipe padrão da Exp II (ORIGINAL_CLIP do site)
};
function cropFit(name, dw, dh, zoom = 1, ox = 0, oy = 0) {
  let [sx, sy, sw, sh] = CROPS[name]; const ar = dw / dh;
  if (sw / sh > ar) { const nw = sh * ar; sx += (sw - nw) / 2; sw = nw; } else { const nh = sw / ar; sy += (sh - nh) / 2; sh = nh; }
  const zw = sw / zoom, zh = sh / zoom; sx += (sw - zw) / 2 + ox * sw; sy += (sh - zh) / 2 + oy * sh;
  return [sx, sy, zw, zh];
}
// duotone sépia do site, com contraste/exposição
const _tone = mk(W, H); const _tctx = _tone.getContext('2d', { willReadFrequently: true });
function duotone(ctx, x, y, w, h, dark, light, contrast = 1.2, expo = 0) {
  const id = ctx.getImageData(x, y, w, h), d = id.data;
  for (let i = 0; i < d.length; i += 4) {
    let l = (d[i] * .3 + d[i + 1] * .59 + d[i + 2] * .11) / 255; l = clamp((l - .5) * contrast + .5 + expo);
    d[i] = dark[0] + (light[0] - dark[0]) * l; d[i + 1] = dark[1] + (light[1] - dark[1]) * l; d[i + 2] = dark[2] + (light[2] - dark[2]) * l;
  }
  ctx.putImageData(id, x, y);
}

// ---------- ASCII (Exp II) ----------
const _asc = mk(200, 360); const _actx = _asc.getContext('2d', { willReadFrequently: true });
function ascii(crop, cell, opts = {}) {
  const { x = 0, y = 0, w = W, h = H, chaos = 0, invert = false, dark = PAL.comment, light = PAL.cream, zoom = 1, ox = 0, oy = 0, bg = null, thr = 0, alpha = 1, seed = 0, img = IMG, contrast = 1 } = opts;
  const cols = Math.floor(w / (cell * 0.6)), rows = Math.floor(h / cell);
  _asc.width = cols; _asc.height = rows;
  const [sx, sy, sw, sh] = cropFit(crop, cols * 0.6, rows, zoom, ox, oy);
  _actx.drawImage(img, sx, sy, sw, sh, 0, 0, cols, rows);
  const d = _actx.getImageData(0, 0, cols, rows).data;
  const cw = w / cols, chs = 'ganwalk', r = mulberry(seed);
  if (bg) { g.fillStyle = bg; g.fillRect(x, y, w, h); }
  g.font = F.mono(cell); g.textAlign = 'center'; g.textBaseline = 'middle'; g.globalAlpha = alpha;
  const dk = hexRGB(dark), lt = hexRGB(light);
  for (let j = 0; j < rows; j++) for (let i = 0; i < cols; i++) {
    const k = (j * cols + i) * 4; let l = (d[k] * .3 + d[k + 1] * .59 + d[k + 2] * .11) / 255; if (contrast !== 1) l = clamp((l - 0.35) * contrast + 0.45); if (invert) l = 1 - l;
    if (l < thr) continue;
    let ci = Math.floor(l * (chs.length - 1)); if (r() < chaos) ci = Math.floor(r() * chs.length);
    g.fillStyle = `rgb(${lerp(dk[0], lt[0], l) | 0},${lerp(dk[1], lt[1], l) | 0},${lerp(dk[2], lt[2], l) | 0})`;
    g.fillText(chs[ci], x + i * cw + cw / 2, y + j * cell + cell / 2);
  }
  g.globalAlpha = 1;
}
function hexRGB(h) { return [parseInt(h.slice(1, 3), 16), parseInt(h.slice(3, 5), 16), parseInt(h.slice(5, 7), 16)]; }

// ---------- pós / glitch ----------
let GRAINS = [];
function buildGrain() {
  for (let k = 0; k < 6; k++) {
    const c = mk(540, 960), x = c.getContext('2d'), id = x.createImageData(540, 960), r = mulberry(k * 77 + 3);
    for (let i = 0; i < id.data.length; i += 4) { const v = r() * 255; id.data[i] = id.data[i + 1] = id.data[i + 2] = v; id.data[i + 3] = 255; }
    x.putImageData(id, 0, 0); GRAINS.push(c);
  }
}
function grain(f, a = 0.07) { g.save(); g.globalAlpha = a; g.globalCompositeOperation = 'overlay'; g.drawImage(GRAINS[f % 6], 0, 0, W, H); g.restore(); }
function scanlines(a = 0.14, step = 4) { g.save(); g.fillStyle = `rgba(0,0,0,${a})`; for (let y = 0; y < H; y += step) g.fillRect(0, y, W, step / 2); g.restore(); }
function vignette(a = 0.6) {
  const gr = g.createRadialGradient(W / 2, H / 2, H * 0.25, W / 2, H / 2, H * 0.75);
  gr.addColorStop(0, 'rgba(0,0,0,0)'); gr.addColorStop(1, `rgba(0,0,0,${a})`); g.fillStyle = gr; g.fillRect(0, 0, W, H);
}
const _snap = mk(W, H); const _sctx = _snap.getContext('2d');
function snap() { _sctx.clearRect(0, 0, W, H); _sctx.drawImage(C, 0, 0); return _snap; }
// fatias horizontais deslocadas
function slices(n, maxShift, r = R, hmax = 90) {
  const s = snap();
  for (let i = 0; i < n; i++) {
    const y = r() * H, h = 4 + r() * hmax, dx = (r() - .5) * 2 * maxShift;
    g.drawImage(s, 0, y, W, h, dx, y, W, h);
    if (r() < 0.3) { g.save(); g.globalCompositeOperation = 'difference'; g.fillStyle = PAL.cream; g.globalAlpha = .25; g.fillRect(0, y, W, h); g.restore(); }
  }
}
// separação RGB via canais
function rgbSplit(amt) {
  if (amt < 0.5) return; const s = snap();
  g.save(); g.globalCompositeOperation = 'lighter'; g.globalAlpha = 0.55;
  g.filter = 'url(#r)'; g.drawImage(s, -amt, 0); g.filter = 'url(#b)'; g.drawImage(s, amt, amt * 0.3);
  g.restore(); g.filter = 'none';
}
function negative(a = 1) { g.save(); g.globalCompositeOperation = 'difference'; g.globalAlpha = a; g.fillStyle = PAL.cream; g.fillRect(0, 0, W, H); g.restore(); }
function pixelate(k) {
  if (k <= 1) return; const s = snap(), w = Math.max(1, Math.floor(W / k)), h = Math.max(1, Math.floor(H / k));
  const t = mk(w, h); t.getContext('2d').drawImage(s, 0, 0, w, h);
  g.imageSmoothingEnabled = false; g.drawImage(t, 0, 0, W, H); g.imageSmoothingEnabled = true;
}
// estática em baixa resolução (p3-noise-canvas)
const _nz = mk(108, 192); const _nzc = _nz.getContext('2d');
function staticNoise(a, r = R, tint = PAL.creamRGB) {
  if (a <= 0) return; const id = _nzc.createImageData(108, 192);
  for (let i = 0; i < id.data.length; i += 4) { const v = r(); const on = v > 0.55; id.data[i] = tint[0]; id.data[i + 1] = tint[1]; id.data[i + 2] = tint[2]; id.data[i + 3] = on ? 255 * v * a : 0; }
  _nzc.putImageData(id, 0, 0); g.imageSmoothingEnabled = false; g.drawImage(_nz, 0, 0, W, H); g.imageSmoothingEnabled = true;
}
// blocos de dados corrompidos (datamosh-ish)
function blocks(n, r = R, size = 120) {
  const s = snap();
  for (let i = 0; i < n; i++) {
    const w = 20 + r() * size * 2, h = 10 + r() * size, x = r() * W, y = r() * H;
    g.drawImage(s, x + (r() - .5) * 200, y + (r() - .5) * 60, w, h, x, y, w, h);
  }
}
// token de erro do site
const TOKENS = ['ERRO_0x7F', 'SINAL INSTÁVEL', 'CONEXÃO PERDIDA', 'SIMULAÇÃO INSTÁVEL', 'REALIDADE.EXE NÃO RESPONDE', 'PACOTE CORROMPIDO', '▓▓▓ FALHA ▓▓▓', 'RECALIBRANDO...'];
function errToken(r, size = 40, color = PAL.red) {
  const s = TOKENS[Math.floor(r() * TOKENS.length)], y = 300 + r() * 1200, x = W / 2 + (r() - .5) * 200;
  g.save(); g.fillStyle = PAL.bg; g.globalAlpha = .85; g.font = F.silk(size);
  const w = g.measureText(s).width + 40; g.fillRect(x - w / 2, y - size * 0.8, w, size * 1.6); g.restore();
  glyphLine(s, x, y, size, F.silk, color, 'center', 12);
}
// ruído de fita / tremor
function shake(amt, r = R) { g.translate((r() - .5) * amt, (r() - .5) * amt * 0.5); }

// ---------- barra de marquee do site ----------
function marquee(t, text, y = 150, size = 30, speed = 180, color = PAL.must) {
  g.fillStyle = PAL.bg; g.fillRect(0, y - size, W, size * 2);
  g.fillStyle = 'rgba(236,224,198,0.3)'; g.fillRect(0, y + size, W, 2);
  g.font = F.silk(size); const unit = text + '    '; const uw = g.measureText(unit).width;
  let x = -((t * speed) % uw);
  while (x < W) { txt(unit, x, y, F.silk(size), color, 'left'); x += uw; }
}
function cursor(x, y, t, size = 60, color = PAL.cream) { if (Math.floor(t * 2.4) % 2 === 0) { g.fillStyle = color; g.fillRect(x, y - size / 2, size * 0.55, size); } }

// ---------- THREE ----------
const G3 = mk(1080, 1080);
const renderer = new THREE.WebGLRenderer({ canvas: G3, antialias: true, alpha: true, preserveDrawingBuffer: true });
renderer.setSize(1080, 1080, false); renderer.setClearColor(0x000000, 0);
function glowDraw(src, x, y, w, h, blur = 18, a = 0.9) {
  g.save(); g.globalCompositeOperation = 'lighter'; g.filter = `blur(${blur}px)`; g.globalAlpha = a; g.drawImage(src, x, y, w, h);
  g.filter = 'none'; g.globalAlpha = 1; g.drawImage(src, x, y, w, h); g.restore();
}

// Möbius em malha de linhas (App3.buildMoebiusGeometry)
function moebius() {
  const scene = new THREE.Scene(), cam = new THREE.PerspectiveCamera(40, 1, 0.1, 100); cam.position.z = 6.2;
  const U = 140, V = 9, base = [];
  const pt = (u, v) => { const r = 1.6 + v * Math.cos(u / 2); return [r * Math.cos(u), r * Math.sin(u), v * Math.sin(u / 2)]; };
  const pos = [];
  for (let j = 0; j < V; j++) { const v = -0.55 + 1.1 * j / (V - 1); for (let i = 0; i < U; i++) { const u0 = i / U * Math.PI * 2, u1 = (i + 1) / U * Math.PI * 2; pos.push(...pt(u0, v), ...pt(u1, v)); } }
  for (let i = 0; i < U; i += 2) { const u = i / U * Math.PI * 2; for (let j = 0; j < V - 1; j++) { const v0 = -0.55 + 1.1 * j / (V - 1), v1 = -0.55 + 1.1 * (j + 1) / (V - 1); pos.push(...pt(u, v0), ...pt(u, v1)); } }
  const geo = new THREE.BufferGeometry(); const arr = new Float32Array(pos); base.push(...pos);
  geo.setAttribute('position', new THREE.BufferAttribute(arr, 3));
  const mat = new THREE.LineBasicMaterial({ color: 0xece0c6, transparent: true, opacity: 0.8 });
  const mesh = new THREE.LineSegments(geo, mat); scene.add(mesh);
  return {
    render(t, amp, rot, color, kick = 0, r = R) {
      mat.color.set(color);
      for (let i = 0; i < arr.length; i += 3) {
        const x = base[i], y = base[i + 1], z = base[i + 2];
        const n = Math.sin(x * 1.7 + t * 1.3) * Math.cos(y * 1.9 - t * 1.1) + Math.sin(z * 2.3 + t * 2.0) * 0.5;
        const s = 1 + n * amp; arr[i] = x * s; arr[i + 1] = y * s; arr[i + 2] = z * s + n * amp;
      }
      geo.attributes.position.needsUpdate = true;
      mesh.rotation.set(0.9 + Math.sin(t * .3) * .3, t * 0.35 * rot, t * 0.12 * rot);
      mesh.position.set((r() - .5) * kick, (r() - .5) * kick, 0);
      renderer.render(scene, cam); return G3;
    }
  };
}
// Exp I: icosaedro wireframe + grade + 3 linhas de onda
function visualizer() {
  const scene = new THREE.Scene(), cam = new THREE.PerspectiveCamera(50, 1, 0.1, 100); cam.position.z = 7;
  const icoG = new THREE.IcosahedronGeometry(1.9, 1);
  const ico = new THREE.LineSegments(new THREE.EdgesGeometry(icoG), new THREE.LineBasicMaterial({ color: 0xece0c6 }));
  const inner = new THREE.LineSegments(new THREE.EdgesGeometry(new THREE.IcosahedronGeometry(1.0, 0)), new THREE.LineBasicMaterial({ color: 0xece0c6, transparent: true, opacity: .5 }));
  scene.add(ico); scene.add(inner);
  const grid = new THREE.GridHelper(30, 30, 0x6b5a42, 0x6b5a42); grid.rotation.x = Math.PI / 2; grid.position.z = -6; scene.add(grid);
  const waves = []; for (let k = 0; k < 3; k++) {
    const N = 160, p = new Float32Array(N * 3); const gg = new THREE.BufferGeometry(); gg.setAttribute('position', new THREE.BufferAttribute(p, 3));
    const l = new THREE.Line(gg, new THREE.LineBasicMaterial({ color: 0xece0c6, transparent: true, opacity: 1 - k * 0.25 })); scene.add(l); waves.push({ l, p, N });
  }
  return {
    render(t, b, color, gridColor) {
      ico.material.color.set(color); inner.material.color.set(color); grid.material.color.set(gridColor);
      const s = 1 + b.bass * 0.35; ico.scale.set(s, s, s); inner.scale.setScalar(1 + b.high * 0.6);
      ico.rotation.set(t * 0.4 + b.mid * .2, t * 0.55, 0); inner.rotation.set(-t * .8, t * .3, t * .5);
      grid.position.y = -((t * 1.2) % 1);
      waves.forEach((w, k) => {
        const amp = [b.bass, b.mid, b.high][k] * 0.9 + 0.05;
        for (let i = 0; i < w.N; i++) { const x = -5 + 10 * i / (w.N - 1); w.p[i * 3] = x; w.p[i * 3 + 1] = -2.9 - k * 0.32 + Math.sin(x * (2 + k) + t * (3 + k)) * amp * 0.5 * Math.sin(i / w.N * Math.PI); w.p[i * 3 + 2] = 0; }
        w.l.geometry.attributes.position.needsUpdate = true; w.l.material.color.set(color);
      });
      renderer.render(scene, cam); return G3;
    }
  };
}

// traz qualquer desvio de cor de volta pra paleta sépia/mostarda
function sepia(a = 0.6, col = PAL.must) { g.save(); g.globalCompositeOperation = 'color'; g.globalAlpha = a; g.fillStyle = col; g.fillRect(0, 0, W, H); g.restore(); }
