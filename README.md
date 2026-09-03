# GANWALK — Site Oficial

Site interativo do GANWALK: uma landing page em página única (`index.htm`) com três
experiências audiovisuais construídas em cima das músicas da banda, além de links e
créditos. Sem framework, sem build step — HTML/CSS/JS puro em um único arquivo,
pronto para publicar como está.

## Estrutura do repositório

```
.
├── index.htm              # o site inteiro: markup, estilos e scripts das 3 experiências
├── calma.mp3               # faixa usada na Exp I (Visualizer)
├── satisfazacredito.mp3    # faixa de fundo da Exp II (ASCII Cam)
├── simulacro.mp3            # faixa usada na Exp III (Lyrics Terminal)
├── intro.mp3                # não referenciado no site atualmente
├── chasm-loop.mp3           # não referenciado no site atualmente
└── docs/
    ├── EXPERIENCES.md      # como cada experiência funciona por dentro
    └── CHANGELOG.md        # histórico das mudanças feitas no site
```

`intro.mp3` e `chasm-loop.mp3` estão no repositório mas não são carregados por
nenhuma das três experiências hoje — ficaram de uma versão anterior do site.

## Rodando localmente

Não há build. Basta servir o diretório com qualquer servidor estático (abrir o
`index.htm` direto como `file://` funciona para a maior parte da UI, mas o
`fetch()` do áudio da Exp I e alguns recursos do navegador exigem `http(s)://`):

```bash
python3 -m http.server 8080
# depois abra http://localhost:8080/index.htm
```

## As três experiências

O site abre num loader ("GANWALK") e depois de clicar entra direto na **Exp I**.
A navegação entre experiências fica no menu do topo (`Exp I`, `Exp II`, `Exp III`)
e também numa barra própria no mobile.

| | Nome | O quê |
|---|---|---|
| **Exp I** | Visualizer | Cena 3D (Three.js) reativa ao áudio de `calma.mp3`, com pitch/delay/reverb/chorus/overdrive/EQ ao vivo e cores customizáveis. |
| **Exp II** | ASCII Cam | Webcam, vídeo ou imagem carregada convertidos em ASCII/pixel art em tempo real, sincronizados com `satisfazacredito.mp3`, com gravação e exportação. |
| **Exp III** | Lyrics Terminal | A letra de `simulacro.mp3` é revelada linha a linha em sincronia com o áudio; a partir de 1 minuto o site simula estar "quebrando" antes de revelar a chamada para pré-save. |

Detalhes de implementação de cada uma (estrutura do código, como funciona o Modo
Sync da Exp III, o sistema de degradação/travamento, etc.) estão em
[`docs/EXPERIENCES.md`](docs/EXPERIENCES.md).

## Tema e cores

Todas as cores do site vivem em variáveis CSS (`--bg-color`, `--highlight-color`,
`--highlight-rgb`, `--record-color`, `--mustard`, etc.) definidas em `:root` e
sobrescritas via `Nav.goToExperienceN()` a cada troca de experiência — Exp I e
Exp III usam a mesma paleta neutra, Exp II usa um acento diferente. Trocar a
paleta do site inteiro é uma questão de editar esses valores nos poucos pontos
onde aparecem hardcoded (inputs de cor padrão, defaults de `App1`/`App2`, o tema
"mostarda") — todos listados em `docs/EXPERIENCES.md`.

## Créditos

Música e experiências: **@ganwalk**. Créditos completos (mixagem, masterização,
colaborações por faixa) estão na tela de Créditos do próprio site.
