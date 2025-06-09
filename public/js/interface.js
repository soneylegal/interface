// Para escrever no navegador
function mostrarTexto(texto) {
  const caixa = document.getElementById("caixa-de-dialogo")
  caixa.innerHTML += `<p>${texto}</p>`
  caixa.scrollTop = caixa.scrollHeight
}

// Botoes de comando
function mostrarOpcoes(opcoes) {
  const comandos = document.getElementById("comandos")
  comandos.innerHTML = ""

  opcoes.forEach(opcao => {
    const botao = document.createElement("button")
    botao.textContent = opcao.texto
    botao.onclick = () => opcao.acao()
    comandos.appendChild(botao)
  })
}

// Cenario e personagens
function atualizarImagemPersonagem(estado) {
  const img = document.querySelector("#jogador img")
  switch (estado) {
    case "ataque":
      img.src = "imgspjcangaco/protagonista_ataque.png"
      break
    case "rip":
      img.src = "imgspjcangaco/protagonista_rip.png"
      break
    default:
      img.src = "imgspjcangaco/protagonista_relaxado.png"
  }
}

function atualizarCenario(nomeCenario) {
  const imagens = document.querySelectorAll('#cenario img')
  imagens.forEach(img => img.classList.remove('ativo'))
  const imagemAtual = document.getElementById(nomeCenario)
  if (imagemAtual) imagemAtual.classList.add('ativo')
}

function atualizarInterface({cenario, estadoJogador}) {
  if (cenario) atualizarCenario(cenario)
  if (estadoJogador) atualizarImagemPersonagem(estadoJogador)
}

// Importações
import { setDialogos } from './dadosCompartilhados.js'
import { escolherProta } from './escolherProtagonista.js'
import { Tutorial, Fase1, Fase2, Fase3, Fase4 } from './fases.js'
import {
  lampiao,
  francisctexeira,
  volante,
  bandidoscidade,
  bandidoscidade2,
  zerufino
} from './personagem.js'
import { exibirMapa, Cidade, Vila, Delegacia, Venda, Igreja, Caatinga, Fazenda1, Fazenda2 } from './mapa.js'

let jogador

// Função principal chamada após carregar diálogos
function comecarJogo() {
  const nome = document.getElementById("nomeJogador").value
  if (!nome) {
    alert("Digite um nome")
    return
  }

  escolherProta(nome).then(jogadorEscolhido => {
    jogador = jogadorEscolhido
    mostrarTexto(`Seja bem-vindo, ${jogador.nome}! O sertão te espera.`)

    const _tutorial = new Tutorial("Tutorial", "não concluído")
    atualizarInterface({cenario: "caatinga", estadoJogador: ""})
    mostrarTexto(_tutorial.mostrarTutorial)
    _tutorial.iniciarTutorial(jogador, lampiao)

    const _fase1 = new Fase1("Fase 1", "não concluída")
    atualizarInterface({cenario: "fase1", estadoJogador: ""})
    mostrarTexto(_fase1.mostrarfase1())
    _fase1.missaoDaJoia(jogador, francisctexeira)

    const _fase2 = new Fase2("Fase 2", "não concluída")
    atualizarInterface({cenario: "fase2", estadoJogador: ""})
    mostrarTexto(_fase2.mostrarfase2())
    _fase2.missaoResgate(jogador, volante)

    const _fase3 = new Fase3("Fase 3", "não concluída")
    atualizarInterface({cenario: "fase3", estadoJogador: ""})
    mostrarTexto(_fase3.mostrarfase3())
    _fase3.irParaCidade(jogador, bandidoscidade, bandidoscidade2)

    const _fase4 = new Fase4("Fase 4", "não concluída")
    atualizarInterface({cenario: "fase4", estadoJogador: ""})
    mostrarTexto(_fase4.mostrarfase4())
    _fase4.irParaFazendaCoronel(jogador, zerufino)
    _fase4.fimDeJogo(true)
  })
}

window.comecarJogo = comecarJogo

// Carregar os diálogos antes de iniciar
fetch('/api/dialogos')
  .then(res => res.json())
  .then(data => {
    setDialogos(data)
  })

export {
  mostrarTexto,
  mostrarOpcoes,
  atualizarImagemPersonagem,
  atualizarCenario,
  atualizarInterface
} 