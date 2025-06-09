import { Protagonista } from "./protagonista.js"
import { Habilidades, CaixaItens } from "./arsenal.js"
import { mostrarTexto, mostrarOpcoes } from './interface.js'

// HABILIDADES
const pistola = new Habilidades("pistola", 20, 2)
const espingarda = new Habilidades("espingarda", 30, 6)
const soco = new Habilidades("soco", 15 , 2)
const peixera = new Habilidades("peixeira", 30, 4)
const padinCico = new Habilidades("em nome de padin ciço", 60, 10)
const penitencia = new Habilidades("penitencia", 40, 4)

// CAIXA DE ITENS
const caixa = new CaixaItens()
caixa.adicionarItem(0)
caixa.adicionarItem("cantil de água")
caixa.adicionarItem("pistola velha")
caixa.adicionarItem("faca enferrujada")

// Função para escolha da ocupação com interface
let resolveEscolha = null

function escolherProta(nomeJogador) {
  return new Promise((resolve) => {
    mostrarTexto("Escolha sua ocupação:")
    mostrarOpcoes([
      {
        texto: "1: Atirador",
        acao: () => {
          const jogador = new Protagonista(nomeJogador, "atirador", 120, 5, 10, 50, pistola, espingarda, 10, caixa)
          mostrarResumo(jogador)
          resolve(jogador)
        }
      },
      {
        texto: "2: Cabra da Pexte",
        acao: () => {
          const jogador = new Protagonista(nomeJogador, "cabra da pexte", 160, 10, 4, 50, soco, peixera, 10, caixa)
          mostrarResumo(jogador)
          resolve(jogador)
        }
      },
      {
        texto: "3: Espiritualista",
        acao: () => {
          const jogador = new Protagonista(nomeJogador, "espiritualista", 120, 7, 2, 50, padinCico, penitencia, 10, caixa)
          mostrarResumo(jogador)
          resolve(jogador)
        }
      }
    ])
  })
}

// Mostra os atributos do jogador na interface
function mostrarResumo(jogador) {
  mostrarTexto("Características do personagem escolhido:")
  mostrarTexto(`Nome: ${jogador.nome}`)
  mostrarTexto(`Ocupação: ${jogador.ocupacao}`)
  mostrarTexto(`Vida: ${jogador.vida}`)
  mostrarTexto(`Armadura: ${jogador.armadura}`)
  mostrarTexto(`Dinheiro: ${jogador.dinheiro}`)

  mostrarTexto(`Habilidade 1: ${jogador.habilidade1.nome} | Dano: ${jogador.habilidade1.dano} | Falha: ${jogador.habilidade1.falha}`)
  mostrarTexto(`Habilidade 2: ${jogador.habilidade2.nome} | Dano: ${jogador.habilidade2.dano} | Falha: ${jogador.habilidade2.falha}`)
}

export { escolherProta }
