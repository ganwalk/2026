# GANWALK — 2026

> Site oficial do artista GANWALK. Uma experiência audiovisual interativa construída como uma única página HTML.

[![Live](https://img.shields.io/badge/live-ganwalk.com-ffc800?style=flat-square&labelColor=000000)](https://ganwalk.github.io/2026)
[![License](https://img.shields.io/badge/license-All%20Rights%20Reserved-red?style=flat-square)](./LICENSE)

---

## Índice

- [Visão Geral](#visão-geral)
- [Experiências](#experiências)
- [Tecnologias](#tecnologias)
- [Estrutura do Projeto](#estrutura-do-projeto)
- [Como Rodar Localmente](#como-rodar-localmente)
- [Músicas](#músicas)
- [Créditos](#créditos)

---

## Visão Geral

**GANWALK | 2026** é um site artístico de página única que combina player de áudio, visualizador generativo e processador de vídeo ASCII em uma interface imersiva com estética de terminal/código. O usuário interage com a música e o visual em tempo real.

---

## Experiências

### Exp I — Visualizador Sonoro

Player de áudio completo com visualizador generativo reativo à música, construído com **Three.js** e **Web Audio API**.

| Controle | Descrição |
|---|---|
| Reprodução / Reverso | Play/pause e inversão da faixa |
| Eco Profundo | Delay com feedback |
| Câmara Etérea | Reverb convolutivo |
| Oscilador de Realidades | Efeito chorus |
| Véu Sonoro | Filtro passa-baixa |
| Tom (Velocidade) | Pitch shift via playback rate |
| Distorção Cósmica | Overdrive/waveshaper |
| EQ (L/M/H) | Equalizador de três bandas |
| Cor de Fundo / Foco | Personalização total de cores em tempo real |

**Interação extra:** arraste o cursor sobre o canvas para manipular o visualizador.

---

### Exp II — Processador ASCII

Converte qualquer fonte de vídeo em arte ASCII em tempo real com controles de renderização e exportação.

| Fonte | Descrição |
|---|---|
| Clipe | Reproduz o vídeo oficial |
| Carregar | Upload de vídeo ou imagem local |
| Câmera | Captura via webcam |

| Controle | Descrição |
|---|---|
| Tamanho | Tamanho do caractere ASCII |
| Resolução | Densidade da grade de caracteres |
| Limiar | Threshold de luminância |
| Inverter | Inverte claro/escuro |
| Caos | Jitter aleatório nos caracteres |
| Fundo Mídia | Sobreposição do vídeo original com opacidade ajustável |

**Exportação:** captura de foto (PNG) ou gravação de vídeo (WebM via MediaRecorder API).

---

## Tecnologias

| Camada | Tecnologia |
|---|---|
| Renderização 3D | [Three.js r128](https://threejs.org/) |
| Pós-processamento | UnrealBloomPass, EffectComposer |
| Áudio | Web Audio API (nativa) |
| Gravação | MediaRecorder API (nativa) |
| Fontes | Astloch, Inter, Amiko, Silkscreen (Google Fonts) |
| Markup | HTML5, CSS3 (variáveis CSS / temas dinâmicos) |
| Runtime | Vanilla JS — sem frameworks, sem bundler |

---

## Estrutura do Projeto

```
2026/
├── index.htm               # Aplicação completa (HTML + CSS + JS inline)
├── intro.mp3               # Faixa de introdução
├── calma.mp3               # Faixa "Calma"
├── satisfazacredito.mp3    # Faixa "Satisfaz/Acredito"
├── chasm-loop.mp3          # Loop ambiente
└── README.md
```

> Todo o código da aplicação reside em `index.htm` — sem dependências de build, sem node_modules.

---

## Como Rodar Localmente

Por usar `fetch`/`AudioContext` com arquivos de áudio, é necessário um servidor HTTP local (abrir o `.htm` diretamente pelo sistema de arquivos pode bloquear o áudio por política de CORS).

**Com Python:**
```bash
python3 -m http.server 8080
# acesse http://localhost:8080/index.htm
```

**Com Node.js (`npx`):**
```bash
npx serve .
```

**Com VS Code:** instale a extensão *Live Server* e clique em **Go Live**.

---

## Músicas

| Faixa | Créditos |
|---|---|
| **Calma** | Música e experiências: @ganwalk · Violões e percussões adicionais: @kiiiiiiiron, @jeanuaifi · Mix & Master: @bodimm_ |
| **Satisfaz / Acredito** | Música e experiências: @ganwalk · Mix & Master: @bodimm_ |

Pre-save / streaming: **[ditto.fm/satisfaz-acredito](https://ditto.fm/satisfaz-acredito)**

---

## Créditos

Música e experiências por **@ganwalk**

© 2026 — Todos os direitos reservados.
