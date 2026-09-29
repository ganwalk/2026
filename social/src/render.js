// uso: node render.js v1 [preview frames csv] -> mp4 ou pngs
const { chromium } = require('/opt/node22/lib/node_modules/playwright');
const { spawn } = require('child_process'); const fs = require('fs');
const [,, name, preview, outPath] = process.argv; const dir = __dirname;
(async () => {
  const b = await chromium.launch({ args: ['--use-gl=angle', '--use-angle=swiftshader', '--enable-unsafe-swiftshader', '--ignore-gpu-blocklist'] });
  const p = await b.newPage({ viewport: { width: 1080, height: 1920 } });
  p.on('console', m => console.log('[page]', m.text())); p.on('pageerror', e => console.log('[err]', e.message));
  await p.goto(`http://localhost:8799/${name}.html`); const N = await p.evaluate(() => window.READY);
  console.log('frames', N);
  if (preview) {
    for (const f of preview.split(',').map(Number)) {
      const d = await p.evaluate(async f => { await render(f); return C.toDataURL('image/jpeg', 0.9); }, f);
      fs.writeFileSync(`${dir}/prev/${name}_${String(f).padStart(4, '0')}.jpg`, Buffer.from(d.split(',')[1], 'base64'));
    }
  } else {
    const ff = spawn('ffmpeg', ['-v', 'error', '-y', '-f', 'image2pipe', '-vcodec', 'mjpeg', '-framerate', '30', '-i', '-', '-i', `${dir}/${name}.wav`,
      '-c:v', 'libx264', '-preset', 'slow', '-crf', '19', '-maxrate', '14M', '-bufsize', '28M', '-pix_fmt', 'yuv420p', '-profile:v', 'high', '-r', '30',
      '-c:a', 'aac', '-b:a', '256k', '-ar', '48000', '-movflags', '+faststart', '-shortest', outPath], { stdio: ['pipe', 'inherit', 'inherit'] });
    const t0 = Date.now();
    for (let f = 0; f < N; f++) {
      const d = await p.evaluate(async f => { await render(f); return C.toDataURL('image/jpeg', 0.96); }, f);
      if (!ff.stdin.write(Buffer.from(d.split(',')[1], 'base64'))) await new Promise(r => ff.stdin.once('drain', r));
      if (f % 60 === 0) console.log(f, '/', N, ((Date.now() - t0) / 1000).toFixed(0) + 's');
    }
    ff.stdin.end(); await new Promise(r => ff.on('close', r));
  }
  await b.close();
})();
