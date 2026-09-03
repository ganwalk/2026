# Changelog

Histórico das mudanças feitas no site, mais recentes primeiro. Cada entrada
corresponde a um PR mergeado em `main`.

## Exp III — refinamentos de UX

- Fita de Möbius reposicionada para a direita da coluna de texto (centralizada
  em telas estreitas) e passa a reagir aos glitches procedurais pontuais, não
  só à degradação progressiva por tempo.
- Removido o botão "Clique para ouvir": a Exp III toca automaticamente ao
  entrar, como as outras duas.
- Corrigido: versos longos quebrando linha quando em destaque — fonte da linha
  ativa agora se ajusta dinamicamente à largura disponível.

## Exp III — objeto geométrico fluido

- Adicionado um objeto de linhas (inicialmente um icosaedro, depois trocado por
  uma fita de Möbius para não repetir a forma da Exp I) atrás do texto,
  ondulando continuamente e pulsando a cada linha da letra revelada.
- Intensidade da ondulação escalada pela degradação progressiva já existente.

## Exp III — travamento simulado + pré-save

- Adicionado o sistema de degradação progressiva (tremor, estática, corrupção
  de texto) que se intensifica no primeiro minuto de reprodução.
- Ao chegar em 1 minuto, o áudio "trava" (stutter simulado) antes de revelar
  uma tela de chamada para pré-save (`ditto.fm/simulacro-ganwalk`), com opção
  de reiniciar a experiência.

## Paleta de cores — inversão para dark mode

- Paleta do site invertida de volta para fundo escuro (marrom quase-preto) com
  texto/acentos claros, mantendo a mesma família de cores.

## Exp III — calibração dos timestamps

- Timestamps iniciais (estimativa estrutural) substituídos pelos valores reais,
  coletados através do Modo Sync.

## Exp III — Lyrics Terminal (lançamento)

- Nova terceira experiência: letra revelada em sincronia com o áudio, no
  estilo "terminal" já usado nas páginas de créditos/links.
- Duração efetiva da faixa corrigida (a UI ignora ~30s de silêncio no final do
  arquivo de áudio).
- Modo Sync embutido (Shift+S) para calibrar os timestamps de cada linha
  ouvindo a faixa e marcando com a barra de espaço.

## Paleta de cores — tons da nova capa

- Exp I e Exp II re-temadas para refletir a paleta sépia/terracota de uma nova
  capa de álbum, depois ajustada para fundo claro (creme/pergaminho) a pedido.

---

Para o estado atual (não histórico) de como cada experiência funciona, ver
[`EXPERIENCES.md`](EXPERIENCES.md).
