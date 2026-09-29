# Reels / TikTok: GANWALK

Dois vídeos verticais (1080×1920, 30 fps, H.264 + AAC), feitos a partir da estética do site: paleta sépia
`#120c07` / `#ece0c6` / mostarda `#d99a4e` / vermelho REC `#c1442e`, com Astloch + Silkscreen, e o mesmo vocabulário
de glitch do `index.htm` (máscara `▓`, tokens de erro, estática em baixa resolução, flash de negativo e o "travamento").

| Arquivo | Duração | O quê |
|---|---|---|
| `ganwalk-site-reel.mp4` | 34,4s | Convite para o site. Passa pelo loader e pelas Exp I, II e III, o site "trava", reinicia nos Créditos (o retrato ASCII sendo gerado) e termina no card **EXPERIMENTE → link na bio** |
| `simulacro-reel.mp4` | 31,75s | Lançamento de **Simulacro**. A letra aparece em sincronia, a capa vai se degradando, o feedback recursivo mostra "um milhão de vezes", o sistema trava e aparece o card **AMANHÃ · 30.09 · EM TODAS AS PLATAFORMAS** |

A capa de *Simulacro* só aparece no que é da Simulacro: no vídeo 1, só no player da Exp III. A Exp II usa o clipe padrão do site (`ORIGINAL_CLIP`) e a Exp I usa o player de play/reverse.

Os textos importantes ficam entre y≈250 e y≈1450, fora das áreas cobertas pela interface do Reels/TikTok.

## Roteiro

### 1: o site (`ganwalk-site-reel.mp4`)
Trilha: *calma* → *satisfaz a crédito* → *simulacro*. As trocas são cortes em stutter, como se alguém estivesse zapeando entre as experiências.

- **0–2s · loader.** "GANWALK" em Astloch, com as frases do loader do site ("Sintonizando o éter…"). Gancho: *"um site que você toca."*
- **2–8s · Exp I Visualizer.** Icosaedro wireframe reagindo ao grave, médio e agudo da faixa, com sliders de pitch/delay/reverb/overdrive se mexendo. Passa pelo tema mostarda e depois pela inversão de cores. Player da *calma* com play e reverse, como no site.
- **8,25–14,5s · Exp II ASCII Cam.** O clipe padrão da Exp II (`ORIGINAL_CLIP`) convertido em ASCII com os caracteres `ganwalk`, em duotone, com a resolução pulando a cada plano. REC piscando.
- **14,75–22,2s · Exp III Lyrics Terminal.** Letra de *Simulacro* revelada linha a linha, com a fita de Möbius atrás e a degradação crescendo. A capa aparece só aqui, no player da Exp III.
- **22,2–23,6s · travamento.** "REALIDADE.EXE NÃO RESPONDE", com stutter no áudio.
- **23,6–28,4s · créditos.** Depois do travamento o site "reinicia" nos Créditos. O retrato ASCII (145×200 caracteres, o mesmo do site) vai sendo digitado caractere por caractere, como no `CodeTyper`, com a linha em geração brilhando. A tela rola sozinha e os créditos entram em estilo de comentário de código (Calma, Satisfaz/Acredito, `(c) 2026`, "Estamos aí! ᕕ(⌐□_□)ᕗ ♪♬").
- **28,4–34,4s · card final.** GANWALK · música · arte · código · EXP I / II / III · **EXPERIMENTE → link na bio** · @ganwalk.

### 2: Simulacro (`simulacro-reel.mp4`)
Trilha: *Simulacro* de 0:45 a 1:07, depois o travamento e, por fim, a volta em "Sei que isso eu já vi…" com o filtro abrindo.

- **0–2,6s.** Título "Simulacro" sobre a capa em sépia, com slit-scan guiado pelo grave, e *"Eu to feliz por hora"*.
- **2,6–10,7s.** As perguntas ("A hora que / Que você vai / E vai pra que…") entram em cortes secos, e cada linha ganha um tratamento diferente da capa (ASCII, negativo, pixel, mostarda). O HUD homenageia a capa: "EXPERIÊNCIA ........ 3/7" e a sequência numérica.
- **10,7–14,4s.** *"Me entender"* e depois *"Entender"* se repetindo, cada cópia mais apagada, enquanto a fita de Möbius entra.
- **14,4–16,7s.** Modo terminal, igual à Exp III: linhas passadas apagadas e as futuras mascaradas com `▓`.
- **16,7–21,4s.** *"O que mostraram um milhão de vezes para você"*. É um túnel de feedback recursivo, e cada frame é uma cópia reduzida do anterior (cópia da cópia, o simulacro). Um contador sobe até **CÓPIA Nº 1.000.000**.
- **21,4–24,2s.** *"Então vai lá"*, a degradação chega ao máximo e o sistema trava, como o site faz em 1:00.
- **24,45–31,75s · card.** GANWALK · capa · **SIMULACRO · Amanhã · 30.09 · em todas as plataformas · pre-save → link na bio**.

## Legendas sugeridas

**Vídeo 1**
> o site novo não é pra ler, é pra tocar.
> 3 experiências audiovisuais: distorça *calma* em tempo real, transforme sua câmera em ascii, e veja *simulacro* se escrever (e quebrar) na sua frente.
> link na bio. 🖤
> #ganwalk #glitchart #creativecoding #musicaindependente #threejs #asciiart #simulacro

**Vídeo 2**
> SIMULACRO. amanhã, 30.09, em todas as plataformas.
> não é nem uma cópia.
> pre-save no link da bio.
> #ganwalk #simulacro #lançamento #novamusica #glitchart #musicabrasileira

## Como regenerar

O código das composições está em `src/`. As composições são determinísticas por frame: canvas 2D + Three.js,
renderizadas quadro a quadro com Playwright e codificadas com ffmpeg.

```bash
# 1. decodificar as faixas para wav (44.1k) numa pasta de trabalho e montar trilhas + análise por frame
python3 src/build_audio.py <pasta>        # gera <pasta>/v/v1.wav, v2.wav, v1.json, v2.json
# 2. na pasta <pasta>/v: src/*, three.min.js (r128), fonts.css + fonts/ (Astloch, Silkscreen, Inter),
#    capa.jpg, clip/0000-0191.jpg (4 planos de 1,6s do ORIGINAL_CLIP da Exp II)
#    e credits_art.json (as 145 linhas da arte ASCII de ContentGenerator.credits no index.htm)
python3 -m http.server 8799
node render.js v1 "" v1.mp4
node render.js v2 "" v2.mp4
```
