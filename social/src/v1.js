// VÍDEO 1 — o site: "entre, toque, quebre"
const VIS = visualizer(), MOB = moebius();
const LOADER = ['Sintonizando o éter', 'Tecendo a realidade', 'Escutando o vazio', 'Decifrando ecos'];
// letra da Exp III no tempo do vídeo (simulacro começa em 47.3s da faixa, em t=14.75)
const L3 = [[47.63, 'A hora que'], [48.68, 'Que você vai'], [49.88, 'E vai pra que'], [50.95, 'Pra onde vai'], [52.21, 'E o que que faz'], [53.32, 'Fazendo o que'], [54.50, 'Quando é que vai'], [55.73, 'Me entender']]
  .map(([s, x]) => [14.75 + s - 47.3, x]);

function header(label, sub, t, color = PAL.cream) {
  // "EXP I — VISUALIZER"  + contador estilo capa
  glyphLine(label, 90, 300, 40, F.silkB, color, 'left', 10);
  g.globalAlpha = .7; txt(sub, 90, 350, F.silk(24), color, 'left'); g.globalAlpha = 1;
  g.fillStyle = color; g.globalAlpha = .35; g.fillRect(90, 385, 900, 2); g.globalAlpha = 1;
}
function caption(s, y, t0, t, size = 58, color = PAL.cream) {
  const p = prog(t, t0, t0 + 0.35);
  const lines = wrap(s, F.silk, size, 880);
  g.fillStyle = color === PAL.bg ? 'rgba(236,224,198,0.7)' : 'rgba(18,12,7,0.62)'; g.fillRect(0, y - size * 0.9, W, lines.length * size * 1.25 + size * 0.55);
  lines.forEach((ln, i) => glyphLine(reveal(ln, p, i * 13 + (t0 * 10 | 0)), W / 2, y + i * size * 1.25, size, F.silk, color, 'center', 14));
}
function playerBar(name, t, cur, color, y = 1480, cover = false) {
  g.fillStyle = 'rgba(18,12,7,0.9)'; g.fillRect(70, y - 60, 940, 120); g.strokeStyle = 'rgba(236,224,198,0.3)'; g.lineWidth = 2; g.strokeRect(70, y - 60, 940, 120);
  let tx = 205;
  if (cover) { const [sx, sy, sw, sh] = cropFit('full', 1, 1); g.drawImage(IMG, sx, sy, sw, sh, 90, y - 45, 90, 90); }
  else { // Exp I: play + reverse, como no site
    g.strokeStyle = color; g.fillStyle = color; g.lineWidth = 2;
    g.beginPath(); g.arc(130, y, 38, 0, 7); g.stroke(); g.beginPath(); g.moveTo(118, y - 16); g.lineTo(118, y + 16); g.lineTo(146, y); g.fill();
    g.beginPath(); g.arc(225, y, 38, 0, 7); g.stroke(); g.beginPath(); g.arc(225, y, 16, Math.PI * 0.2, Math.PI * 1.6); g.stroke();
    g.beginPath(); g.moveTo(205, y - 22); g.lineTo(205, y - 4); g.lineTo(222, y - 10); g.fill(); tx = 290;
  }
  txt(name, tx, y - 15, F.silkB(30), color, 'left'); const m = Math.floor(cur / 60), s = Math.floor(cur % 60);
  txt(`${m}:${String(s).padStart(2, '0')}`, tx, y + 22, F.silk(22), PAL.dim, 'left');
  g.fillStyle = 'rgba(236,224,198,0.25)'; g.fillRect(470, y - 2, 500, 4); g.fillStyle = color; g.fillRect(470, y - 2, 500 * ((cur % 60) / 60), 4);
  g.beginPath(); g.arc(470 + 500 * ((cur % 60) / 60), y, 12, 0, 7); g.fill();
}
function slider(label, x, y, w, v, color) {
  txt(label, x, y - 28, F.silk(22), color, 'left'); txt(String(Math.round(v * 100)).padStart(3, '0'), x + w, y - 28, F.silk(22), PAL.dim, 'right');
  g.fillStyle = 'rgba(236,224,198,0.2)'; g.fillRect(x, y - 2, w, 4); g.fillStyle = color; g.fillRect(x, y - 2, w * v, 4);
  g.beginPath(); g.arc(x + w * v, y, 13, 0, 7); g.fill();
}
function touch(x, y, t, color = PAL.cream) {
  g.strokeStyle = color; g.lineWidth = 3; g.globalAlpha = .9; g.beginPath(); g.arc(x, y, 34, 0, 7); g.stroke();
  const p = (t * 1.6) % 1; g.globalAlpha = 1 - p; g.beginPath(); g.arc(x, y, 34 + p * 70, 0, 7); g.stroke(); g.globalAlpha = 1;
}

// ---------- cenas ----------
function sLoader(t, f, b) {
  g.fillStyle = PAL.bg; g.fillRect(0, 0, W, H);
  const mi = Math.floor(t / 0.5) % 4, col = mi === 3 ? PAL.must : PAL.cream;
  const fl = R() < 0.08 ? 0.4 : 1; g.globalAlpha = fl;
  txt('GANWALK', W / 2, 900, F.ast(fitSize('GANWALK', F.ast, 900, 200)), col, 'center', 40);
  const msg = LOADER[mi] + '.'.repeat(1 + Math.floor(t * 6) % 3);
  txt(msg, W / 2, 1030, F.inter(46), col); g.globalAlpha = 1;
  glyphLine('GANWALK | OFICIAL (C) 2026', W / 2, 200, 26, F.silk, PAL.dim);
  caption('um site que você toca.', 470, 0.15, t, 60);
  if (t > 1.35) { const k = easeOut(prog(t, 1.35, 1.7)); touch(W / 2, 1250 - (1 - k) * 200, t, PAL.cream); txt('CLIQUE PARA ENTRAR', W / 2, 1360, F.silk(30), PAL.dim); }
}
function sExp1(t, f, b) {
  const lt = t - 2, mustard = t >= 5.0, inv = t >= 6.9;
  const bg = inv ? PAL.cream : PAL.bg, fg = inv ? PAL.bg : (mustard ? PAL.must : PAL.cream);
  g.fillStyle = bg; g.fillRect(0, 0, W, H);
  const img = VIS.render(lt, b, fg, inv ? '#b8a684' : (mustard ? '#5a3f1f' : '#3a2e22'));
  const sz = 1080 * (1 + b.bass * 0.06);
  if (inv) { g.drawImage(img, (W - sz) / 2, 860 - sz / 2, sz, sz); } else glowDraw(img, (W - sz) / 2, 860 - sz / 2, sz, sz, 22, 0.9);
  header('EXP I — VISUALIZER', 'three.js · web audio · ao vivo', t, fg);
  // painel de efeitos sendo "tocado"
  const sl = [['PITCH', .5 + .35 * Math.sin(lt * 1.3)], ['DELAY', .3 + .3 * Math.sin(lt * .9 + 1) + b.mid * .2], ['REVERB', .6 + .25 * Math.sin(lt * .7 + 2)], ['OVERDRIVE', clamp(.2 + b.bass * .7)]];
  g.fillStyle = inv ? 'rgba(236,224,198,0.6)' : 'rgba(18,12,7,0.5)'; g.fillRect(70, 1180, 940, 230);
  sl.forEach(([n, v], i) => slider(n, 110 + (i % 2) * 460, 1250 + Math.floor(i / 2) * 110, 400, clamp(v), fg));
  // dedo arrastando (filtro interativo do site)
  const tx = W / 2 + Math.sin(lt * 1.7) * 330, ty = 820 + Math.cos(lt * 1.1) * 260; touch(tx, ty, lt, fg);
  caption(mustard ? (inv ? 'inverta tudo.' : 'mude as cores. mude o som.') : 'arraste. distorça. desafine.', 470, mustard ? (inv ? 6.9 : 5.0) : 2.05, t, 52, fg);
  playerBar('calma', t, 138 + t, fg);
  if (b.on > 0.9) { rgbSplit(10 * b.on); }
}
const CLIP = {};
async function clipFrame(i) { i = Math.max(0, Math.min(191, i)); if (!CLIP[i]) CLIP[i] = await loadImg(`clip/${String(i).padStart(4, '0')}.jpg`); return CLIP[i]; }
function sExp2(t, f, b, img) {
  const lt = t - 8.25, shot = Math.min(3, Math.floor(lt / 1.6));
  // resolução muda a cada plano e "pula" nos ataques
  const cell = [18, 12, 22, 14][shot] + (b.on > 1 ? 6 : 0);
  const alt = shot >= 2; const light = alt ? PAL.must : PAL.cream, dark = alt ? PAL.red : PAL.comment;
  g.fillStyle = PAL.bg; g.fillRect(0, 0, W, H);
  // mídia por trás em opacidade reduzida (opção do site)
  const [sx, sy, sw, sh] = cropFit('clip', W, H, 1 + (lt % 1.6) * 0.05); g.globalAlpha = 0.16; g.drawImage(img, sx, sy, sw, sh, 0, 0, W, H); g.globalAlpha = 1;
  ascii('clip', cell, { img, contrast: 1.8, chaos: clamp(lt / 6) * 0.5 + b.on * 0.2, dark, light, zoom: 1 + (lt % 1.6) * 0.05, seed: f, invert: shot === 1 });
  g.fillStyle = 'rgba(18,12,7,0.75)'; g.fillRect(0, 250, W, 150);
  header('EXP II — ASCII CAM', 'webcam · vídeo · imagem → texto', t, PAL.cream);
  if (Math.floor(t * 2) % 2 === 0) { g.fillStyle = PAL.red; g.beginPath(); g.arc(880, 300, 14, 0, 7); g.fill(); }
  txt('REC', 910, 301, F.silkB(28), PAL.red, 'left'); txt('00:0' + Math.floor(lt), 990, 350, F.silk(22), PAL.red, 'right');
  caption(lt < 3.2 ? 'qualquer imagem vira ascii.' : 'sua câmera. seu caos.', 495, lt < 3.2 ? 8.3 : 11.45, t, 54);
  g.fillStyle = 'rgba(18,12,7,0.8)'; g.fillRect(0, 1400, W, 110);
  txt('Clique para criar.', W / 2, 1455, F.silk(40), PAL.cream, 'center', 10);
  if (lt % 1.6 < 0.07 && lt > 0.1) { negative(0.9); slices(8, 120); }
}
function sExp3(t, f, b, gl) {
  g.fillStyle = PAL.bg; g.fillRect(0, 0, W, H);
  const cur = L3.reduce((a, [s], i) => t >= s ? i : a, -1);
  const pulse = cur >= 0 ? Math.exp(-(t - L3[cur][0]) * 5) : 0;
  const img = MOB.render(t, 0.06 + gl * 0.35 + pulse * 0.15, 1 + gl * 3 + pulse * 2, PAL.cream, gl * 0.4 * (R() < gl ? 1 : 0));
  const sz = 1250 * (1 + pulse * 0.08); g.globalAlpha = 0.75; glowDraw(img, (W - sz) / 2, 900 - sz / 2, sz, sz, 16, 0.6); g.globalAlpha = 1;
  g.save(); shake(gl * 26);
  header('EXP III — LYRICS TERMINAL', 'a letra se escreve em tempo real', t);
  // lista de linhas: passadas apagadas, atual em destaque, futuras mascaradas
  const y0 = 820 - cur * 104;
  L3.forEach(([s, x], i) => {
    const y = y0 + i * 104 + (i > cur ? 40 : 0); if (y < 440 || y > 1450) return;
    if (i < cur) { g.globalAlpha = 0.3; glyphLine(x, W / 2, y, 44, F.silk, PAL.cream); }
    else if (i === cur) { g.globalAlpha = 1; glyphLine(reveal(x, prog(t, s, s + 0.4), i * 7), W / 2, y + 20, fitSize(x, F.silk, 920, 76), F.silk, PAL.cream, 'center', 22); }
    else { g.globalAlpha = 0.35; glyphLine(maskAll(x), W / 2, y + 20, 44, F.silk, PAL.cream); }
  });
  g.globalAlpha = 1; g.restore();
  staticNoise(Math.pow(gl, 1.8) * 0.5);
  // corrupção / tokens de erro
  if (R() < gl * 0.35) errToken(R, 38);
  if (R() < gl * 0.5) slices(3 + (gl * 8 | 0), 60 * gl);
  playerBar('Simulacro', t, 47.3 + (t - 14.75), PAL.cream, 1480, true);
}
let frozen = null;
function sFreeze(t, f, b) {
  // o site "trava": frames repetem, fatias, negativo — segue o stutter do áudio
  if (!frozen) { frozen = mk(W, H); frozen.getContext('2d').drawImage(C, 0, 0); }
  const p = prog(t, 22.2, 23.6);
  g.drawImage(frozen, 0, 0);
  blocks(10 + p * 40 | 0, R, 160);
  slices(8 + p * 20 | 0, 200 * p + 30);
  rgbSplit(10 + p * 30);
  if (R() < 0.25 + p * 0.3) negative(0.9);
  staticNoise(0.3 + p * 0.5);
  errToken(R, 44);
  sepia(0.55 + p * 0.3);
  pixelate(1 + p * p * 24);
  if (p > 0.9) { g.fillStyle = PAL.bg; g.globalAlpha = (p - .9) * 10; g.fillRect(0, 0, W, H); g.globalAlpha = 1; }
}

// ---------- CRÉDITOS: retrato ASCII "digitado" como no CodeTyper do site ----------
let ART = null, ARTC = null; const ART_FS = 8.8, ART_CW = ART_FS * 0.602, ART_X = (W - 199 * ART_FS * 0.602) / 2, ART_Y0 = 290;
async function loadArt() {
  ART = await (await fetch('credits_art.json')).json();
  ARTC = mk(Math.ceil(199 * ART_CW), Math.ceil(145 * ART_FS)); const x = ARTC.getContext('2d');
  x.font = `400 ${ART_FS}px "DejaVu Sans Mono", monospace`; x.textBaseline = 'top'; x.fillStyle = PAL.cream;
  ART.forEach((l, j) => { for (let i = 0; i < l.length; i++) if (l[i] !== ' ') x.fillText(l[i], i * ART_CW, j * ART_FS); });
}
const CRED = [['c', '/**'], ['c', '_'], ['k', 'Calma -'], ['c', 'música e experiências por: @ganwalk'], ['c', 'violões e percussões adicionais: @kiiiiiiiron e @jeanuaifi'],
  ['c', 'mixagem e masterização por: @bodimm_'], ['c', '_'], ['c', '_'], ['k', 'Satisfaz/Acredito -'], ['c', 'música e experiências por: @ganwalk'],
  ['c', 'mixagem e masterização por: @bodimm_'], ['c', '_'], ['c', '_'], ['c', '(c) 2026'], ['c', '_'], ['c', '_'], ['c', 'Estamos aí! ᕕ(⌐□_□)ᕗ ♪♬']];
function sCredits(t, f, b) {
  const lt = t - 23.6;
  g.fillStyle = PAL.bg; g.fillRect(0, 0, W, H);
  const total = 145 * 199, n = Math.floor(total * easeOut(prog(lt, 0.15, 2.7)) ** 0.8);
  const artH = 145 * ART_FS, credY = ART_Y0 + artH + 50, LH = 44;
  // texto dos créditos, 3 chars por tick depois da arte
  const credChars = CRED.map(c => c[1].length + 4), totalC = credChars.reduce((a, c) => a + c, 0);
  let nc = Math.floor(totalC * prog(lt, 2.75, 4.2));
  let lastY = n < total ? ART_Y0 + Math.floor(n / 199) * ART_FS : credY;
  const shownLines = []; for (let i = 0; i < CRED.length && nc > 0; i++) { const k = Math.min(nc, credChars[i]); shownLines.push([i, k]); nc -= credChars[i]; lastY = credY + i * LH; }
  // scroll automático (container.scrollTop = scrollHeight)
  const scroll = Math.max(0, lastY - 1400);
  g.save(); g.translate(0, -scroll);
  // arte: linhas completas + linha atual parcial + cursor
  const r = Math.floor(n / 199), c = n % 199;
  if (r > 0) { g.save(); g.globalCompositeOperation = 'lighter'; g.filter = 'blur(6px)'; g.globalAlpha = 0.7 + b.bass * 0.3; g.drawImage(ARTC, 0, 0, ARTC.width, r * ART_FS, ART_X, ART_Y0, ARTC.width, r * ART_FS); g.restore();
    g.drawImage(ARTC, 0, 0, ARTC.width, r * ART_FS, ART_X, ART_Y0, ARTC.width, r * ART_FS); }
  if (r < 145 && c > 0) g.drawImage(ARTC, 0, r * ART_FS, c * ART_CW, ART_FS, ART_X, ART_Y0 + r * ART_FS, c * ART_CW, ART_FS);
  if (n < total) { g.fillStyle = PAL.cream; g.fillRect(ART_X + c * ART_CW, ART_Y0 + r * ART_FS - 4, 3, ART_FS + 8);
    // brilho na linha que está sendo gerada
    g.save(); g.globalCompositeOperation = 'lighter'; g.globalAlpha = 0.25; g.fillStyle = PAL.must; g.fillRect(ART_X, ART_Y0 + r * ART_FS - 3, ARTC.width, ART_FS + 6); g.restore(); }
  else if (b.on > 0.8 || R() < 0.06) { // depois de pronta, a arte pulsa com o grave
    const s = snap(); for (let j = 0; j < 3; j++) { const y = ART_Y0 + R() * artH - scroll, h = 4 + R() * 30; g.restore(); g.drawImage(s, 0, y, W, h, (R() - .5) * 60, y, W, h); g.save(); g.translate(0, -scroll); }
  }
  shownLines.forEach(([i, k]) => {
    const [kind, s0] = CRED[i], y = credY + i * LH, full = `${String(i + 1).padStart(2, ' ')}  ${s0}`.slice(0, k);
    txt(full.slice(0, 4), 50, y, F.mono(25), PAL.comment, 'left');
    txt(full.slice(4), 50 + 4 * 25 * 0.602, y, kind === 'k' ? F.mono(26) : `400 25px "DejaVu Sans Mono", monospace`, kind === 'k' ? PAL.cream : PAL.dim, 'left');
    if (i === shownLines.length - 1 && k < credChars[i]) cursor(50 + k * 25 * 0.602 + 6, y, t * 2, 30, PAL.cream);
  });
  g.restore();
  // barra do topo tipo nav
  g.fillStyle = PAL.bg; g.fillRect(0, 170, W, 100); g.fillStyle = 'rgba(236,224,198,0.3)'; g.fillRect(0, 270, W, 2);
  txt('GANWALK', 90, 222, F.ast(56), PAL.cream, 'left', 12); glyphLine('CRÉDITOS', 990, 222, 30, F.silkB, PAL.must, 'right', 10);
  if (lt < 0.25) { slices(14, 140); rgbSplit(20); if (lt < 0.07) negative(1); staticNoise(0.5); }
}
function sEnd(t, f, b) {
  const lt = t - 28.4;
  g.fillStyle = PAL.bg; g.fillRect(0, 0, W, H);
  // ascii fantasma da capa + möbius ao fundo
  ascii('clip', 18, { img: END_BG, alpha: 0.13, chaos: 0.1, seed: f >> 2 });
  const img = MOB.render(t, 0.08 + b.bass * .1, 1, PAL.must); g.globalAlpha = .35; g.drawImage(img, -120, 1120, 700, 700); g.globalAlpha = 1;
  marquee(t, 'PRE-SAVE - SIMULACRO', 150, 28, 160);
  const k = easeOut(prog(lt, 0, 0.5));
  g.globalAlpha = k; txt('GANWALK', W / 2, 430 - (1 - k) * 60, F.ast(fitSize('GANWALK', F.ast, 920, 210)), PAL.cream, 'center', 40 + b.bass * 30); g.globalAlpha = 1;
  glyphLine(reveal('música · arte · código', prog(lt, .3, .9), 3), W / 2, 580, 40, F.silk, PAL.dim);
  const items = [['EXP I', 'VISUALIZER'], ['EXP II', 'ASCII CAM'], ['EXP III', 'LYRICS TERMINAL']];
  items.forEach(([a, n], i) => {
    const p = prog(lt, 0.7 + i * 0.25, 1.1 + i * 0.25); if (p <= 0) return;
    const y = 740 + i * 125; g.strokeStyle = 'rgba(236,224,198,0.35)'; g.lineWidth = 2; g.strokeRect(110, y - 48, 860, 96);
    g.fillStyle = `rgba(236,224,198,${0.05 + (Math.floor(t * 3) % 3 === i ? 0.08 : 0)})`; g.fillRect(110, y - 48, 860, 96);
    glyphLine(reveal(a, p, i), 150, y, 38, F.silkB, PAL.must, 'left');
    glyphLine(reveal(n, p, i + 9), 930, y, 38, F.silk, PAL.cream, 'right');
  });
  const p2 = prog(lt, 1.8, 2.3);
  if (p2 > 0) {
    glyphLine(reveal('EXPERIMENTE', p2, 5), W / 2, 1210, 96, F.silkB, PAL.cream, 'center', 30 + b.bass * 20);
    glyphLine(reveal('→ link na bio', prog(lt, 2.2, 2.7), 6), W / 2, 1325, 50, F.silk, PAL.must, 'center', 14);
    cursor(W / 2 + 230, 1325, t, 46, PAL.must);
  }
  if (lt > 3.2) glyphLine('@ganwalk', W / 2, 1410, 34, F.silk, PAL.dim);
  // entrada com glitch
  if (lt < 0.35) { slices(14, 120); rgbSplit(20); if (lt < 0.1) negative(1); }
  if (b.on > 1.0 && R() < 0.5) slices(4, 40);
}

let END_BG;
async function render(f) {
  if (!END_BG) { END_BG = await clipFrame(150); await loadArt(); }
  const t = f / FPS; R = mulberry(f * 7919 + 13); const b = band(f);
  g.setTransform(1, 0, 0, 1, 0, 0); g.globalAlpha = 1; g.globalCompositeOperation = 'source-over';
  if (t < 2.0) sLoader(t, f, b);
  else if (t < 8.0) sExp1(t, f, b);
  else if (t < 8.25) { sExp1(8.0, f, b); slices(20, 180); blocks(30, R); rgbSplit(24); if (f % 2) negative(1); staticNoise(0.6); }
  else if (t < 14.5) sExp2(t, f, b, await clipFrame(Math.floor((t - 8.25) * 30)));
  else if (t < 14.75) { sExp2(14.5, f, b, await clipFrame(187)); slices(20, 180); blocks(30, R); rgbSplit(24); if (f % 2) negative(1); staticNoise(0.6); }
  else if (t < 22.2) sExp3(t, f, b, clamp(prog(t, 14.75, 22.2) * 0.85 + b.on * 0.15));
  else if (t < 23.6) sFreeze(t, f, b);
  else if (t < 28.4) sCredits(t, f, b);
  else sEnd(t, f, b);
  g.setTransform(1, 0, 0, 1, 0, 0);
  // cortes de entrada do visualizer
  if (t >= 2.0 && t < 2.25) { slices(16, 140); rgbSplit(22); if (t < 2.07) negative(1); }
  scanlines(0.12); grain(f, 0.09); vignette(0.55);
}
