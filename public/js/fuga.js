import { mostrarTexto, mostrarOpcoes } from './interface.js'
import { batalha } from './batalha.js'
import { gerarNumeroAleatorio0_20 } from './personagem.js'

let personagemA
let personagemB
let falhas = 0
let vitorias = 0
let turno = 1

function iniciarFuga(protagonista, inimigo) {
  personagemA = protagonista
  personagemB = inimigo
  falhas = 0
  vitorias = 0
  turno = 1

  mostrarTexto("------ A fuga começou ------")
  mostrarTexto("3 falhas para ser pego, 3 vitórias para fugir")
  proximoTurno()
}

function proximoTurno() {
  if (falhas >= 3) {
    mostrarTexto(`Infelizmente, ${personagemA.nome} foi capturado!`)
    mostrarOpcoes([])
    return
  }

  if (vitorias >= 3) {
    mostrarTexto(`Parabéns! ${personagemA.nome} conseguiu fugir com sucesso!`)
    mostrarOpcoes([])
    return
  }

  mostrarTexto(`---- Turno ${turno} ----`)
  const velocidadePersonagemA = personagemA.velocidade / 2 + gerarNumeroAleatorio0_20()

  mostrarOpcoes([
    {
      texto: "Continuar fugindo",
      acao: () => tentarFugir(velocidadePersonagemA)
    },
    {
      texto: "Desistir e lutar",
      acao: () => desistir()
    }
  ])
}

function tentarFugir(velocidade) {
  if (velocidade > personagemB.velocidade) {
    vitorias++
    mostrarTexto(`${personagemA.nome} alcançou velocidade ${velocidade.toFixed(1)} e venceu o turno!`)
  } else {
    falhas++
    mostrarTexto(`${personagemA.nome} correu a ${velocidade.toFixed(1)}, mas ${personagemB.nome} se aproximou!`)
  }
  mostrarTexto(`Vitórias: ${vitorias}, Falhas: ${falhas}`)
  turno++
  setTimeout(proximoTurno, 1000)
}

function desistir() {
  const dano = falhas * 10
  mostrarTexto(`Você desistiu! Sofreu ${dano} de dano como penalidade.`)
  personagemA.levarDano(dano)
  batalha(personagemA, personagemB)
}

export { iniciarFuga }

