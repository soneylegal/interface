import {Vila, Cidade, Fazenda1, Fazenda2, Delegacia, Igreja, Caatinga, Venda} from "./mapa.js"
import { batalha } from "./batalha.js"
import { Protagonista } from "./protagonista.js"
import { Habilidades, CaixaItens } from "./arsenal.js"
import {
  Personagem,
  gerarNumeroAleatorio0_20,
  lampiao,
  francisctexeira,
  volante,
  bandidoscidade,
  bandidoscidade2,
  zerufino
} from "./personagem.js"
import { iniciarFuga } from "./fuga.js"
import {mostrarTexto, mostrarOpcoes } from './interface.js'
import { getDialogos } from './dadosCompartilhados.js'

let inventario = [0, "cantil de água", "pistola velha", "faca enferrujada"]

let VendaLoja = {
  nomelocal: "----- Mercearia Secos e Molhados -----",
  Itens: ["Água ardente", "Curativos", "Munição", "Parabelo", "Colete", "Carne de sol"]
}

let fasesconcluidas = 0

const dialogosPorFase = {
  tutorial: [1, 2, 3],
  fase1: [4, 5, 6, 7, 8, 9],
  fase2: [10, 11, 12, 13],
  fase3: [14, 15, 16, 17, 18, 19, 20, 21, 22, 23, 24],
  fase4: [25, 26, 27, 28]
}

function mostrarDialogosPorIds(ids) {
  const dialogos = getDialogos()
  ids.forEach(id => {
    const d = dialogos.find(d => d.id_dialogo === id)
    if (d) mostrarTexto(`${d.nome}: ${d.fala}`)
  })
}

class Fases {
  #nomeFase
  #status
  constructor(nomeFase, status) {
    this.#nomeFase = nomeFase
    this.#status = status
  }
  get mostrarTutorial() {
    return `\n [${this.#nomeFase}] \n`
  }
  get mostrarfase1() {
    return `\n [${this.#nomeFase}] \n`
  }
  get mostrarfase2() {
    return `[${this.#nomeFase}] \n`
  }
  get mostrarfase3() {
    return `\n [${this.#nomeFase}] \n`
  }
  get mostrarfase4() {
    return `\n [${this.#nomeFase}] \n`
  }
  get mostrarStatusFase() {
    return this.#status
  }
  missaoConcluida() {
    mostrarTexto(`Fase concluída!`)
    return this.#status
  }
  curaFinal(protagonista) {
    protagonista.aumentarVida(40)
    mostrarTexto(`Vida após batalha: ${protagonista.vida}`)
  }
}

class Tutorial extends Fases {
  constructor(nomeFase, status) {
    super(nomeFase, status)
  }
  iniciarTutorial(protagonistaA, adversario) {
    mostrarDialogosPorIds(dialogosPorFase.tutorial)
    mostrarOpcoes([
      {
        texto: "Continuar",
        acao: () => {
          mostrarTexto("Iniciando...")
          const vitoria = batalha(protagonistaA, adversario)
          if (vitoria) {
            this.missaoConcluida()
            this.curaFinal(protagonistaA)
            mostrarTexto("Você venceu o tutorial!")
          } else {
            mostrarTexto("Você perdeu. Tente novamente.")
          }
        }
      }
    ])
  }
}

class Fase1 extends Fases {
  constructor(nomeFase, status) {
    super(nomeFase, status)
  }
  missaoDaJoia(protagonistaA, adversario) {
    mostrarDialogosPorIds(dialogosPorFase.fase1)
    mostrarTexto(`${Fazenda1.nomelocal}`)
    mostrarTexto(`>>> ${Fazenda1.informacoes}`)

    const vitoria = batalha(protagonistaA, adversario)
    if (vitoria) {
      protagonistaA.caixa.mudarItem(0, "joia")
      this.curaFinal(protagonistaA)
      mostrarTexto("Você derrotou o Coronel Texeira!")

      mostrarOpcoes([
        {
          texto: "Ficar com a joia",
          acao: () => {
            mostrarTexto(`Narração: ${protagonistaA.nome} diz que não conseguiu achar a joia.`)
            mostrarTexto("Você guardou a joia consigo.")
          }
        },
        {
          texto: "Devolver a joia",
          acao: () => {
            protagonistaA.caixa.mudarItem(0, "terço")
            mostrarTexto("Você devolveu a joia e ganhou um terço como proteção.")
          }
        }
      ])
    } else {
      mostrarTexto("Você perdeu a batalha e não conseguiu recuperar a joia.")
    }
  }
}

class Fase2 extends Fases {
  constructor(nomeFase, status) {
    super(nomeFase, status)
  }
  missaoResgate(protagonistaA, adversario) {
    mostrarDialogosPorIds(dialogosPorFase.fase2)
    mostrarTexto(`${Delegacia.nomelocal}`)
    mostrarTexto(`>>> ${Delegacia.informacoes}`)

    const vitoria = batalha(protagonistaA, adversario)
    if (vitoria) {
      iniciarFuga(protagonistaA, adversario)
      mostrarTexto("Você e Batoré escaparam com sucesso!")
      this.missaoConcluida(protagonistaA)
    } else {
      mostrarTexto("Você foi derrotado e não conseguiu salvar Batoré.")
    }
  }
  missaoConcluida(protagonistaA) {
    this.status = "fase 2 concluída"
    fasesconcluidas = 2
    protagonistaA.dinheiro += 125
    mostrarTexto("Recompensa recebida: +125 dinheiro")
    return this.status
  }
}

class Fase3 extends Fases {
  constructor(nomeFase, status) {
    super(nomeFase, status)
  }
  irParaCidade(protagonistaA, adversario, adversario2) {
    mostrarTexto(`${Cidade.nomelocal}`)
    mostrarTexto(`>>> ${Cidade.informacoes}`)
    mostrarDialogosPorIds([14])

    mostrarOpcoes([
      { texto: "Ir para Vila", acao: () => this.irParaVila(protagonistaA, adversario, adversario2) },
      { texto: "Ir para Venda", acao: () => this.irParaVenda(protagonistaA, adversario, adversario2) },
      { texto: "Ir para Igreja", acao: () => this.irParaIgreja(protagonistaA, adversario, adversario2) }
    ])
  }
  irParaVila(protagonistaA, adversario, adversario2) {
    mostrarTexto(`${Vila.nomelocal}`)
    mostrarTexto(`>>> ${Vila.informacoes}`)
    mostrarDialogosPorIds([15, 16, 17, 18])
    this.irParaVenda(protagonistaA, adversario, adversario2)
  }
  irParaVenda(protagonistaA, adversario, adversario2) {
    mostrarTexto(`${Venda.nomelocal}`)
    if (protagonistaA.caixa.receberItem(0) === "joia") {
      VendaLoja.Itens.forEach(item => {
        if (!inventario.includes(item)) inventario.push(item)
      })
    } else {
      ["Parabelo", "Água ardente", "Munição", "Curativos"].forEach(item => {
        if (!inventario.includes(item)) inventario.push(item)
      })
    }
    mostrarTexto("Compra efetuada com sucesso!")
    this.irParaCaatinga(protagonistaA, adversario, adversario2)
  }
  irParaIgreja(protagonistaA, adversario, adversario2) {
    mostrarTexto(`${Igreja.nomelocal}`)
    mostrarTexto(`>>> ${Igreja.informacoes}`)
    if (protagonistaA.caixa.receberItem(0) !== "joia") {
      mostrarTexto("Você ganhou 20 de vida como bênção.")
      protagonistaA.vida += 20
    }
    this.irParaVenda(protagonistaA, adversario, adversario2)
  }
  irParaCaatinga(protagonistaA, adversario, adversario2) {
    mostrarTexto(`${Caatinga.nomelocal}`)
    mostrarTexto(`>>> ${Caatinga.informacoes}`)
    mostrarTexto("Você encontra os bandidos... prepare-se!")
    let vitoria = batalha(protagonistaA, adversario)
    if (!vitoria) return
    vitoria = batalha(protagonistaA, adversario2)
    if (!vitoria) return
    mostrarDialogosPorIds([23, 24])
    this.missaoConcluida()
  }
  missaoConcluida() {
    this.status = "fase 3 concluída"
    fasesconcluidas = 3
    mostrarTexto("Você concluiu a fase 3!")
    return this.status
  }
}

class Fase4 extends Fases {
  constructor(nomeFase, status) {
    super(nomeFase, status)
  }
  irParaFazendaCoronel(protagonistaA, adversario) {
    mostrarTexto(`${Fazenda2.nomelocal}`)
    mostrarTexto(`>>> ${Fazenda2.informacoes}`)
    mostrarDialogosPorIds(dialogosPorFase.fase4)
    const vitoria = batalha(protagonistaA, adversario)
    if (vitoria) {
      this.missaoConcluida()
      this.fimDeJogo(true)
    } else {
      this.fimDeJogo(false)
    }
  }
  missaoConcluida() {
    this.status = "fase 4 concluída"
    fasesconcluidas = 4
    inventario[0] = 9999
    mostrarTexto("Parabéns! Você completou a jornada.")
    return this.status
  }
  fimDeJogo(n) {
    if (n) {
      mostrarTexto("Obrigado por jogar! Você libertou o sertão.")
    } else {
      mostrarTexto("Você foi derrotado e esquecido no sertão...")
    }
  }
}

export { Fases, Tutorial, Fase1, Fase2, Fase3, Fase4, fimDeJogo, dialogosPorFase, mostrarDialogosPorIds }