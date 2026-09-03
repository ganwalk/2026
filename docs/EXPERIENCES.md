# As três experiências — detalhes técnicos

Tudo vive em `index.htm`, num único `<script>` no final do `<body>`. Cada
experiência é um objeto global (`App1`, `App2`, `App3`) mais um pedaço do objeto
`Nav`, que cuida de mostrar/esconder seções e trocar as variáveis de cor do tema.

## Nav — o roteador do site

`Nav` não usa URLs nem router de verdade: `Nav.goToExperienceN()` troca a classe
`active` na `<section>` certa, ajusta a barra/menu mobile, e sobrescreve as
variáveis CSS de tema em `document.documentElement.style`. Ao sair de uma
experiência, `Nav` chama `AppN.transitionOut()` (para de tocar áudio, cancela o
loop de animação); ao entrar, chama `AppN.resume()` (ou `AppN.start()` na
primeira vez, quando aplicável).

Isso significa: qualquer coisa nova que precise "pausar quando eu saio da tela"
tem que ser pendurada em `transitionOut`/`pause`, senão continua rodando em
segundo plano.

## Exp I — Visualizer (`App1`)

- Áudio: `calma.mp3`, carregado via `fetch()` + `AudioContext.decodeAudioData`
  (não usa `<audio>`), o que permite tocar ao contrário (`reverseBuffer`) e
  aplicar efeitos via Web Audio API nativa: delay/feedback, convolver (reverb),
  chorus (panner com LFO), overdrive (wave shaper), EQ de 3 bandas, filtro
  passa-baixa "interativo" que reage ao arrastar o mouse na tela.
- Visual: cena Three.js com um icosaedro em wireframe no centro, uma grade de
  linhas atrás e três "linhas de onda" embaixo, todos reagindo às bandas de
  frequência (grave/médio/agudo) extraídas de um `AnalyserNode` a cada frame.
  Post-processing com `UnrealBloomPass`.
- Cores customizáveis: os inputs `p1-bg-color`/`p1-fg-color` escrevem direto nas
  variáveis CSS do tema e nos materiais do Three.js.
- Tema "mostarda": mecanismo latente (`isYellowEventActive` em `App1.animate`,
  hoje fixado em `false`) que troca a cor do visualizer para o acento
  `--mustard` em um ponto específico da faixa — para reativar, é só trocar essa
  condição.

## Exp II — ASCII Cam (`App2`)

- Fonte de imagem: um clipe de vídeo padrão (`ORIGINAL_CLIP`, hospedado à parte),
  upload de vídeo/imagem, ou webcam.
- Áudio de fundo: `satisfazacredito.mp3`, tocado num `<audio>` nativo roteado
  pela Web Audio API só para poder aplicar um delay de transição entre telas.
- Renderização: a cada frame, a imagem/vídeo é desenhada num canvas escondido em
  baixa resolução (`p2-hidden-canvas`), lida pixel a pixel, e cada pixel vira um
  caractere (do conjunto fixo `"ganwalk"`) desenhado no canvas visível
  (`p2-output-canvas`), com cor interpolada entre `font1` (pixel escuro) e
  `font2` (pixel claro) — um duotone.
- Controles: resolução da grade, tamanho da fonte, threshold, inversão, "caos"
  (embaralha qual caractere é usado), fundo sólido ou a própria mídia por trás
  em opacidade reduzida, gravação via `MediaRecorder` e export de frame como PNG.

## Exp III — Lyrics Terminal (`App3`)

A mais nova das três, e a mais "orquestrada" — vale explicar em partes.

### Sincronização da letra

`App3.lines` é um array de `{ t: segundos, text: "..." }`. A cada frame
(`App3.animate` → `syncTo`), o índice da linha atual é recalculado a partir de
`audio.currentTime`; linhas passadas ficam com opacidade reduzida ("past"),
linhas futuras aparecem mascaradas (`mask()` troca cada caractere não-espaço por
`▓`), e a linha atual ganha destaque e digitação. `App3.songEnd` (2:45) existe
porque o arquivo de áudio tem ~30s de silêncio no final — a UI trava a barra de
progresso nesse ponto em vez de deixar tocar o silêncio.

### Modo Sync — recalibrando os timestamps

Os timestamps em `App3.lines` foram coletados manualmente, não adivinhados.
Dentro da Exp III, **Shift+S** liga um modo em que:

- todas as linhas ficam totalmente legíveis (sem máscara);
- **Espaço** grava o `currentTime` do áudio como o timestamp da próxima linha;
- **Backspace** desfaz a última marcação;
- o painel no canto (que não cobre o texto) mostra quantas linhas já foram
  marcadas e qual é a próxima;
- o botão "Copiar Timestamps" gera o array pronto (`lines: [...]`) na área de
  transferência, para colar direto em `App3.lines` no código.

Isso é o mecanismo esperado para re-sincronizar a letra caso a faixa de áudio
mude ou os timestamps precisem de ajuste fino.

### Degradação progressiva e travamento (`FREEZE_AT`)

Do início da faixa até `App3.FREEZE_AT` (60s por padrão), `App3.applyGlitch(intensity)`
escala de 0 a 1 e dirige:

- tremor/skew do container de texto (`#p3-terminal`);
- um canvas de estática em baixa resolução (`#p3-noise-canvas`, pixelated);
- corrupção momentânea de linhas já reveladas (`corruptRandomLine`);
- flashes de texto de "erro" (`flashGlitchText`, tokens em `App3.glitchTokens`).

Ao cruzar `FREEZE_AT`, `App3.triggerFreeze()` simula um stutter de áudio (seeks
curtos + `play()` repetidos, acelerando) por ~2s, com glitch no máximo, e então
`finishFreeze()` esconde a UI normal e revela `#p3-presave-overlay`: uma tela
limpa com a chamada para pré-save (link de `ditto.fm`) e um botão "Reiniciar"
que zera tudo (`App3.replay()`).

Um token de cancelamento (`_freezeToken`) garante que essa sequência não continue
rodando em segundo plano se o usuário sair da Exp III no meio do travamento.

### Objeto geométrico fluido (fita de Möbius)

Atrás do texto (à direita da coluna em telas largas, centralizado em telas
estreitas — ver `App3.onGeoResize`), uma fita de Möbius renderizada como malha
de linhas (`App3.buildMoebiusGeometry`, parametrização própria, não usa
geometria pronta do Three.js) ondula continuamente por deslocamento de vértices
baseado em ruído senoidal (`App3.renderGeo`). Ela reage a três coisas:

1. **cada linha revelada** dispara um pulso (`App3.pulseGeo`, chamado de dentro
   de `syncTo`) que expande e acelera a rotação por um instante;
2. **a degradação progressiva** (mesmo `intensity` de `applyGlitch`) aumenta a
   amplitude da ondulação e a velocidade de rotação;
3. **os glitches procedurais pontuais** (corrupção de linha, flash de erro)
   disparam um "kick" (`App3.geoGlitchKick`) que faz a fita tremer de posição,
   igual ao resto da tela.

A cor da fita acompanha `--highlight-color` do tema ativo (`App3.updateGeoColor`).

### Ajuste automático de tamanho de linha

Versos longos, quando em destaque (fonte maior), poderiam quebrar em duas
linhas dependendo da largura da tela. `App3.fitLineText(el)` mede a largura real
do texto com um canvas 2D (`measureText`) e reduz o `font-size` daquela linha
via estilo inline só o suficiente para caber em uma linha só; `white-space:
nowrap` + `overflow: hidden` no CSS servem de proteção extra. Roda sempre que
uma linha vira "active" e também no `resize` da janela.
