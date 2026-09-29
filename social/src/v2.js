// VÍDEO 2 — SIMULACRO: cópia da cópia, até o sistema travar
const MOB = moebius();
// letra no tempo do vídeo (áudio começa em 45.0s da faixa)
const LY = [[45.09, 'Eu to feliz por hora'], [47.63, 'A hora que'], [48.68, 'Que você vai'], [49.88, 'E vai pra que'], [50.95, 'Pra onde vai'],
  [52.21, 'E o que que faz'], [53.32, 'Fazendo o que'], [54.50, 'Quando é que vai'], [55.73, 'Me entender'], [57.06, 'Entender'],
  [59.45, 'É tão fácil entender'], [61.70, 'O que mostraram um milhão de vezes para você'], [66.37, 'Então vai lá']].map(([s, x]) => [s - 45.0, x]);
const lineAt = t => LY.reduce((a, [s], i) => t >= s ? i : a, -1);
const T0 = 2.4;  // intro em glitch antes de "Eu to feliz por hora"
const T_FREEZE = 22.8, T_BLACK = 24.2, T_END = 25.7;  // T_BLACK→T_END: 1,5s de silêncio + carregando 0-100%

const _bg = mk(W, H); const _bgc = _bg.getContext('2d', { willReadFrequently: true });
// capa em sépia com slit-scan guiado pelo grave
function coverBG(crop, t, b, opt = {}) {
  const { zoom = 1.05 + t * 0.01, dark = PAL.bgRGB, light = PAL.creamRGB, contrast = 1.35, expo = 0.05, slit = 1, ox = 0, oy = 0 } = opt;
  const [sx, sy, sw, sh] = cropFit(crop, W, H, zoom, ox, oy);
  _bgc.drawImage(IMG, sx, sy, sw, sh, 0, 0, W, H);
  duotone(_bgc, 0, 0, W, H, dark, light, contrast, expo);
  for (let y = 0; y < H; y += 12) {
    const dx = Math.sin(y * 0.011 + t * 3.1) * (6 + b.bass * 60) * slit + (R() < b.on * 0.04 ? (R() - .5) * 300 : 0);
    g.drawImage(_bg, 0, y, W, 12, dx, y, W, 12);
  }
}
function bigLine(s, p, y, seed, opt = {}) {
  const { fontFn = F.silkB, max = 150, color = PAL.cream, bar = true, glow = 26, maxW = 920 } = opt;
  const lines = [];
  let sz = fitSize(s, fontFn, maxW, max);
  if (sz < max * 0.62) { sz = Math.round(max * 0.7); lines.push(...wrap(s, fontFn, sz, maxW)); sz = Math.min(sz, ...lines.map(l => fitSize(l, fontFn, maxW, sz))); } else lines.push(s);
  const lh = sz * 1.22, y0 = y - (lines.length - 1) * lh / 2;
  if (bar) { g.fillStyle = 'rgba(18,12,7,0.78)'; g.fillRect(0, y0 - sz * 0.85, W, lines.length * lh + sz * 0.45); }
  lines.forEach((l, i) => glyphLine(reveal(l, p, seed + i * 11), W / 2, y0 + i * lh, sz, fontFn, color, 'center', glow));
}
function hud(t, b, col = PAL.cream) {
  // homenagem à capa: "EXPERIÊNCIA ........ 3/7" + sequência numérica
  g.globalAlpha = 0.85; txt('EXPERIÊNCIA', 90, 1450, F.silk(24), col, 'left'); txt('3/7', 990, 1450, F.silk(24), col, 'right');
  g.fillStyle = col; for (let x = 330; x < 930; x += 14) g.fillRect(x, 1458, 4, 4);
  const digs = '06288844802'.split('').map((d, i) => (R() < 0.08 + b.on * 0.2) ? String(Math.floor(R() * 10)) : d).join('   ');
  txt(digs, W / 2, 1505, F.silk(24), col); g.globalAlpha = 1;
}
function titleTop(t, b) {
  const gw = glyphLine('GANWALK', 90, 210, 26, F.silk, PAL.dim, 'left'); g.globalAlpha = 0.6; glyphLine('feat. KF No Beat', 90 + gw + 14, 212, 18, F.silk, PAL.dim, 'left'); g.globalAlpha = 1;
  glyphLine('SIMULACRO', 990, 210, 26, F.silk, PAL.dim, 'right');
}

// ---------- cenas ----------
function s1(t, f, b) { // "Eu to feliz por hora" — hook
  coverBG('figure', t, b, { expo: 0.12 - t * 0.02 });
  const k = easeOut(prog(t, 0, 0.5));
  g.fillStyle = 'rgba(18,12,7,0.8)'; g.fillRect(0, 290, W, 300);
  txt('Simulacro', W / 2, 410, F.ast(fitSize('Simulacro', F.ast, 940, 230)), PAL.cream, 'center', 40 + b.bass * 40);
  glyphLine('ganwalk feat. KF No Beat', W / 2, 545, 28, F.silk, PAL.dim);
  if (t < 0.5) { slices(18 * (1 - k) | 0, 200 * (1 - k)); rgbSplit(30 * (1 - k)); }
  bigLine('Eu to feliz por hora', prog(t, 0.09, 0.9), 1180, 3, { max: 96 });
  titleTop(t, b); hud(t, b);
}
const RAPID = [
  (t, b, f) => { g.fillStyle = PAL.bg; g.fillRect(0, 0, W, H); ascii('face1', 16, { chaos: 0.15, seed: f }); },
  (t, b) => { coverBG('figure', t, b, { dark: PAL.creamRGB, light: PAL.bgRGB, zoom: 1.4 }); },
  (t, b) => { coverBG('face2', t, b, { slit: 2 }); pixelate(10); },
  (t, b) => { coverBG('plant', t, b, { dark: [40, 20, 8], light: PAL.mustRGB, contrast: 1.6 }); },
  (t, b, f) => { g.fillStyle = PAL.bg; g.fillRect(0, 0, W, H); ascii('face3', 14, { dark: PAL.red, light: PAL.must, chaos: 0.3, seed: f }); },
  (t, b) => { coverBG('panel', t, b, { zoom: 1.0 + t * 0.03 }); slices(12, 90); },
  (t, b, f) => { g.fillStyle = PAL.bg; g.fillRect(0, 0, W, H); ascii('figure', 26, { chaos: 0.05, seed: f, invert: true }); }
];
const RY = [760, 1180, 900, 640, 1120, 820, 1000];
function s2(t, f, b) { // perguntas em cortes secos
  const i = lineAt(t), k = i - 1, [s0, x] = LY[i];
  RAPID[k % RAPID.length](t, b, f);
  bigLine(x, prog(t, s0, s0 + 0.28), RY[k % RY.length], i * 5, { max: k % 3 === 1 ? 170 : 140, fontFn: k % 3 === 1 ? F.ast : F.silkB, color: k === 3 ? PAL.must : PAL.cream });
  titleTop(t, b); hud(t, b);
  if (t - s0 < 0.1) { negative(1); rgbSplit(26); slices(10, 160); }
}
function s3(t, f, b) { // "Me entender" / "Entender" — eco
  g.fillStyle = PAL.bg; g.fillRect(0, 0, W, H);
  const i = lineAt(t), [s0, x] = LY[i];
  const mobA = prog(t, 11.5, 14.4);
  if (mobA > 0) { const img = MOB.render(t, 0.1 + b.bass * 0.2, 1.5, PAL.must); g.globalAlpha = mobA * 0.8; glowDraw(img, -135, 420, 1350, 1350, 14, 0.5); g.globalAlpha = 1; }
  if (i === 8) {
    coverBG('face1', t, b, { zoom: 1.2 + (t - s0) * 0.1 }); g.fillStyle = 'rgba(18,12,7,0.55)'; g.fillRect(0, 0, W, H);
    bigLine('ME ENTENDER', prog(t, s0, s0 + 0.3), 960, 17, { fontFn: F.silkB, max: 150, bar: true, glow: 40 });
  } else {
    // "ENTENDER" se repetindo, cada cópia mais apagada — a cópia da cópia
    const lt = t - s0, n = Math.min(14, 1 + Math.floor(lt * 7));
    for (let j = 0; j < n; j++) {
      const y = 330 + ((j * 112 + lt * 60) % 1200), hl = j === n - 1;
      g.globalAlpha = hl ? 1 : Math.max(0.08, 0.6 - j * 0.04);
      glyphLine(hl ? reveal('ENTENDER', prog(lt, 0, 0.25), j) : (j % 3 === 2 ? maskAll('ENTENDER') : 'ENTENDER'), W / 2 + (j % 2 ? 1 : -1) * j * 6, y, hl ? 150 : 110, F.silkB, hl ? PAL.must : PAL.cream, 'center', hl ? 30 : 0);
    }
    g.globalAlpha = 1;
  }
  titleTop(t, b); hud(t, b, PAL.dim);
  if (t - s0 < 0.08) { negative(0.9); slices(8, 120); }
}
function s4(t, f, b) { // terminal (Exp III)
  g.fillStyle = PAL.bg; g.fillRect(0, 0, W, H);
  const cur = lineAt(t), gl = prog(t, 14.45, 16.7) * 0.3;
  const pulse = Math.exp(-(t - LY[cur][0]) * 5);
  const img = MOB.render(t, 0.08 + gl * 0.3 + pulse * .15, 1 + pulse * 2, PAL.cream); glowDraw(img, -135, 300, 1350, 1350, 16, 0.6);
  const show = [8, 9, 10, 11, 12];
  show.forEach((i, j) => {
    const [, x] = LY[i], y = 560 + j * 150;
    if (i < cur) { g.globalAlpha = 0.3; bigLine(x, 1, y, i, { max: 50, bar: false, glow: 0, fontFn: F.silk }); }
    else if (i === cur) { g.globalAlpha = 1; bigLine(x, prog(t, LY[i][0], LY[i][0] + 0.5), y, i, { max: 84, glow: 26 }); }
    else { g.globalAlpha = 0.35; bigLine(maskAll(x), 1, y, i, { max: 50, bar: false, glow: 0, fontFn: F.silk }); }
  });
  g.globalAlpha = 1; staticNoise(gl * 0.4);
  titleTop(t, b); hud(t, b, PAL.dim);
}
// feedback recursivo: cada frame é uma cópia reduzida do anterior
const FB = mk(W, H), fbc = FB.getContext('2d'); const FB2 = mk(W, H), fb2 = FB2.getContext('2d');
function s5(t, f, b) {
  const lt = t - LY[11][0];
  fb2.clearRect(0, 0, W, H); fb2.drawImage(FB, 0, 0);
  fbc.fillStyle = PAL.bg; fbc.fillRect(0, 0, W, H);
  fbc.save(); fbc.translate(W / 2, H / 2 - 40); fbc.rotate(0.012 + b.bass * 0.02); const sc = 0.93 - b.on * 0.02; fbc.scale(sc, sc);
  fbc.globalAlpha = 0.97; fbc.drawImage(FB2, -W / 2, -H / 2); fbc.restore();
  // moldura nova: a capa, sempre a mesma, cada vez mais longe do original
  const fw = 1000, fh = 1000 * H / W * 0.98;
  fbc.save(); fbc.strokeStyle = PAL.cream; fbc.lineWidth = 6; fbc.strokeRect((W - fw) / 2, (H - fh) / 2 - 40, fw, fh);
  if (f % 3 === 0) { const [sx, sy, sw, sh] = cropFit('full', 300, 300); fbc.globalAlpha = 0.95; fbc.drawImage(IMG, sx, sy, sw, sh, W / 2 - 290 + Math.sin(t * 2) * 130, 380, 580, 580); }
  fbc.restore();
  g.drawImage(FB, 0, 0);
  sepia(0.5);
  // letra, palavra a palavra
  const words = LY[11][1].split(' '), nW = Math.min(words.length, Math.floor(lt / 0.45) + 1);
  const shown = words.slice(0, nW).join(' ');
  bigLine(shown.toUpperCase(), 1, 1150, 1, { max: 104, fontFn: F.silkB, maxW: 940 });
  // contador de cópias
  const n = Math.min(1000000, Math.floor(Math.pow(10, prog(lt, 0.3, 4.3) * 6)));
  g.fillStyle = 'rgba(18,12,7,0.85)'; g.fillRect(0, 1340, W, 80);
  txt('CÓPIA Nº ' + n.toLocaleString('pt-BR').padStart(9, '0'), W / 2, 1380, F.silk(40), PAL.must, 'center', 14);
  titleTop(t, b);
  if (b.on > 1.0) slices(5, 50);
}
function s6(t, f, b) { // "Então vai lá" — degradação máxima
  const lt = t - LY[12][0], gl = clamp(0.5 + lt / 1.4 * 0.5);
  g.drawImage(FB, 0, 0); sepia(0.5);
  g.fillStyle = `rgba(18,12,7,${0.3 + gl * 0.3})`; g.fillRect(0, 0, W, H);
  g.save(); shake(gl * 40);
  bigLine('ENTÃO VAI LÁ', prog(lt, 0, 0.3), 960, 77, { fontFn: F.silkB, max: 120, glow: 40 });
  g.restore();
  staticNoise(gl * 0.5);
  if (R() < gl) errToken(R, 42);
  slices(6 + gl * 14 | 0, 120 * gl); if (R() < 0.3 * gl) blocks(20, R); rgbSplit(gl * 18);
  titleTop(t, b);
}
let frozen = null;
function sFreeze(t, f, b) {
  if (!frozen) { frozen = mk(W, H); frozen.getContext('2d').drawImage(C, 0, 0); }
  const p = prog(t, T_FREEZE, T_BLACK);
  g.drawImage(frozen, 0, 0);
  // frames "pulam pra trás" em sincronia com o stutter
  if (Math.floor(t * (8 + p * 30)) % 2) g.drawImage(frozen, 0, -40 * p, W, H);
  blocks(10 + p * 40 | 0, R, 160); slices(8 + p * 22 | 0, 220 * p + 30); rgbSplit(10 + p * 30);
  if (R() < 0.25 + p * 0.3) negative(0.9);
  staticNoise(0.3 + p * 0.5); errToken(R, 46); sepia(0.55 + p * 0.3); pixelate(1 + p * p * 28);
  if (p > 0.88) { g.fillStyle = PAL.bg; g.globalAlpha = (p - .88) / .12; g.fillRect(0, 0, W, H); g.globalAlpha = 1; }
}
// silêncio: o sistema recarrega de 0 a 100% (com travadas) e revela a tela final
const LOADK = [[0, 0], [0.15, 0], [0.4, 23], [0.55, 37], [0.75, 38], [0.88, 68], [1.03, 71], [1.22, 99], [1.4, 99], [1.44, 100]];
const LOADMSG = ['Sintonizando o éter', 'Tecendo a realidade', 'Escutando o vazio', 'Decifrando ecos', 'Recalibrando simulação'];
function loadPct(lt) { for (let i = 1; i < LOADK.length; i++) if (lt < LOADK[i][0]) { const [t0, v0] = LOADK[i - 1], [t1, v1] = LOADK[i]; return Math.floor(v0 + (v1 - v0) * (lt - t0) / (t1 - t0)); } return 100; }
function sLoading(t, f) {
  const lt = t - T_BLACK, pc = loadPct(lt), jump = pc - loadPct(lt - 1 / FPS);
  g.fillStyle = PAL.bg; g.fillRect(0, 0, W, H);
  if (lt < 0.15) { cursor(W / 2 - 15, 960, t * 3, 70, PAL.cream); return; }
  const col = pc === 100 ? PAL.must : PAL.cream;
  g.font = F.silkB(170); const dw = g.measureText(String(pc).padStart(3, '0')).width; g.font = F.interB(140); const pw = g.measureText('%').width;
  txt(String(pc).padStart(3, '0'), W / 2 - (dw + pw + 16) / 2, 960, F.silkB(170), col, 'left', 30);
  txt('%', W / 2 + (dw + pw + 16) / 2 - pw, 966, F.interB(140), col, 'left', 30);
  const cells = 20, on = Math.round(pc / 100 * cells); let bar = ''; for (let i = 0; i < cells; i++) bar += i < on ? '▓' : '░';
  g.globalAlpha = 1; glyphLine(bar, W / 2, 1110, 40, F.silk, col, 'center');
  const mi = Math.min(LOADMSG.length - 1, Math.floor((lt - 0.15) / 0.26));
  txt(LOADMSG[mi] + '.'.repeat(1 + Math.floor(t * 6) % 3), W / 2, 1200, F.inter(40), PAL.dim);
  if (jump > 3) { slices(6, 60); rgbSplit(10); }
  if (lt > 1.44) { negative(1); slices(10, 120); }
}
function sEnd(t, f, b) {
  const lt = t - T_END;
  g.fillStyle = PAL.bg; g.fillRect(0, 0, W, H);
  ascii('figure', 18, { alpha: 0.1, chaos: 0.1, seed: f >> 2 });
  const k = easeOut(prog(lt, 0, 0.5));
  // capa
  const cs = 800, cx = (W - cs) / 2, cy = 300 + (1 - k) * 40;
  g.globalAlpha = k; const [sx, sy, sw, sh] = cropFit('full', 1, 1); g.drawImage(IMG, sx, sy, sw, sh, cx, cy, cs, cs); g.globalAlpha = 1;
  g.strokeStyle = 'rgba(236,224,198,0.5)'; g.lineWidth = 2; g.strokeRect(cx - 12, cy - 12, cs + 24, cs + 24);
  // bordas da capa corrompendo no ritmo
  if (b.on > 0.7 || R() < 0.08) { const s = snap(); for (let j = 0; j < 4; j++) { const y = cy + R() * cs, h = 6 + R() * 40; g.drawImage(s, cx, y, cs, h, cx + (R() - .5) * 90, y, cs, h); } }
  txt('GANWALK', W / 2, 205, F.ast(fitSize('GANWALK', F.ast, 520, 96)), PAL.cream, 'center', 24);
  const p1 = prog(lt, 0.3, 0.8), p2 = prog(lt, 0.8, 1.3), p3 = prog(lt, 1.3, 1.8), p4 = prog(lt, 2.1, 2.6);
  glyphLine(reveal('SIMULACRO', p1, 1), W / 2, 1235, 104, F.silkB, PAL.cream, 'center', 24 + b.bass * 20);
  glyphLine(reveal('ganwalk feat. KF No Beat', p2, 3), W / 2, 1310, 30, F.silk, PAL.dim);
  glyphLine(reveal('EM TODAS AS PLATAFORMAS', p3, 5), W / 2, 1370, 40, F.silk, PAL.must, 'center', 12);
  if (p4 > 0) glyphLine(reveal('link na bio', p4, 8), W / 2, 1425, 30, F.silk, PAL.dim);
  // a letra continua, baixinho
  const lp = prog(lt, 0.18, 1.2); if (lp > 0 && lt < 2.2) { g.globalAlpha = 0.7; glyphLine(reveal('...errado.', lp, 4), W / 2, 1150, 30, F.silk, PAL.dim); g.globalAlpha = 1; }
  if (lt < 0.3) { slices(14, 140); rgbSplit(20); if (lt < 0.08) negative(1); }
  if (lt > 9.1) { g.fillStyle = PAL.bg; g.globalAlpha = prog(lt, 9.1, 9.95); g.fillRect(0, 0, W, H); g.globalAlpha = 1; }
}

// intro: o sinal tentando sintonizar até cair em "Eu to feliz por hora"
function sIntro(t, f, b) {
  g.fillStyle = PAL.bg; g.fillRect(0, 0, W, H);
  const p = t / T0, swell = prog(t, 1.5, T0);
  // fragmentos da capa aparecendo em faixas, cada vez mais frequentes
  const nBands = 2 + Math.floor(p * 10 + b.on * 4);
  for (let i = 0; i < nBands; i++) {
    const y = R() * H, h = 20 + R() * 160 * (0.4 + p), [sx, sy, sw, sh] = cropFit('figure', W, H, 1 + swell * 0.6);
    g.globalAlpha = 0.25 + p * 0.6; g.drawImage(IMG, sx, sy + sh * y / H, sw, sh * h / H, (R() - .5) * 200 * (1 - swell), y, W, h);
  }
  g.globalAlpha = 1;
  if (swell > 0) { const [sx, sy, sw, sh] = cropFit('figure', W, H, 1 + swell * 0.6); g.globalAlpha = swell * 0.8; g.drawImage(IMG, sx, sy, sw, sh, 0, 0, W, H); g.globalAlpha = 1; }
  sepia(0.6);
  staticNoise(0.65 * (1 - swell * 0.6));
  // título tentando se formar
  g.fillStyle = 'rgba(18,12,7,0.8)'; g.fillRect(0, 850, W, 220);
  glyphLine(reveal('SIMULACRO', prog(t, 0.2, 2.1), Math.floor(t * 12)), W / 2, 930, 120, F.silkB, PAL.cream, 'center', 30);
  if (t > 1.0) { g.globalAlpha = R() < 0.2 ? 0.3 : 0.9; glyphLine('ganwalk feat. KF No Beat', W / 2, 1025, 28, F.silk, PAL.dim); g.globalAlpha = 1; }
  txt('SINAL ' + String(Math.min(99, Math.floor(p * p * 100))).padStart(2, '0') + '%', 90, 210, F.silk(24), PAL.red, 'left');
  if (R() < 0.5) errToken(R, 38);
  slices(6 + Math.floor(p * 14), 80 + swell * 200); rgbSplit(6 + swell * 30);
  if (R() < 0.12 + swell * 0.3) negative(0.8);
  if (t > T0 - 2 / FPS) negative(1);
}

async function render(f) {
  const tg = f / FPS; R = mulberry(f * 7919 + 101); const b = band(f); const t = tg - T0;
  g.setTransform(1, 0, 0, 1, 0, 0); g.globalAlpha = 1; g.globalCompositeOperation = 'source-over';
  const i = lineAt(t);
  if (tg < T0) sIntro(tg, f, b);
  else if (t < LY[1][0]) s1(t, f, b);
  else if (i <= 7) s2(t, f, b);
  else if (i <= 9) s3(t, f, b);
  else if (i === 10) s4(t, f, b);
  else if (i === 11) s5(t, f, b);
  else if (t < T_FREEZE) s6(t, f, b);
  else if (t < T_BLACK) sFreeze(t, f, b);
  else if (t < T_END) sLoading(t, f);
  else sEnd(t, f, b);
  g.setTransform(1, 0, 0, 1, 0, 0);
  scanlines(0.12); grain(f, 0.09); vignette(0.55);
}
