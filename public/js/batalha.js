import {Personagem, gerarNumeroAleatorio0_20 } from './personagem.js'
import {Habilidades, CaixaItens } from './arsenal.js'
import { Protagonista } from './protagonista.js'
import { escolherProta } from './escolherProtagonista.js'
import { mostrarTexto, mostrarOpcoes } from './interface.js'

function batalha(personagemA, personagemB) {
    mostrarTexto(`A batalha começou entre ${personagemA.nome} e ${personagemB.nome}!
`)

let vidaInicial = personagemA.vida 

let vitoria

    let turno = 1
    while (personagemA.vida > 0 && personagemB.vida > 0) {
        mostrarTexto(`--- Turno ${turno} ---`)

        let escolherHabilidade = Number(prompt("Escolha a habilidade que você quer usar (1 ou 2 0 para mostrar status): "))
        let danoA = escolherHabilidadeFunc(personagemA, escolherHabilidade)
        let danoRecebidoB = Math.max(0, danoA - personagemB.armadura)
        personagemB.levarDano(danoRecebidoB)
        
        mostrarTexto(`${personagemA.nome} atacou com ${escolherHabilidade === 1 ? personagemA.habilidade1.nome : personagemA.habilidade2.nome}, causando ${danoRecebidoB} de dano!`)
        mostrarTexto(`${personagemB.nome} agora tem ${personagemB.vida} de vida.\n`)
        
        if (personagemB.vida <= 0) {
            mostrarTexto(`${personagemB.nome} foi derrotado! ${personagemA.nome} venceu!`)
            personagemA.receberDinhero(personagemB.dinheiro)
            return vitoria = true
        }
        
        // Personagem B ataca
        let habilidadeEscolhidaB = Math.random() < 0.5 ? personagemB.habilidade1 : personagemB.habilidade2
        let danoB = 0
        
        if (habilidadeEscolhidaB.falha >= gerarNumeroAleatorio0_20()) {
            mostrarTexto(`O ataque de ${personagemB.nome} falhou!`)
        } else {
            danoB = habilidadeEscolhidaB.dano
        }
        
        let danoRecebidoA = Math.max(0, danoB - personagemA.armadura)
        personagemA.levarDano(danoRecebidoA)
        
        mostrarTexto(`${personagemB.nome} atacou com ${habilidadeEscolhidaB.nome}, causando ${danoRecebidoA} de dano!`)
        mostrarTexto(`${personagemA.nome} agora tem ${personagemA.vida} de vida.\n`)
        
        if (personagemA.vida <= 0) {
            mostrarTexto(`${personagemA.nome} foi derrotado! ${personagemB.nome} venceu!`)
            return vitoria = false
        }

        turno++
    }
    personagemA.vida += (vidaInicial-personagemA.vida) / 2
}


function escolherHabilidadeFunc(personagem, escolherHabilidade) {
    if (escolherHabilidade === 1) {
        return personagem.habilidade1.falha >= gerarNumeroAleatorio0_20() ? 0 : personagem.habilidade1.dano
    } else if (escolherHabilidade === 2) {
        return personagem.habilidade2.falha >= gerarNumeroAleatorio0_20() ? 0 : personagem.habilidade2.dano
    } else if (escolherHabilidade === 0) {
        mostrarStatus(personagem)
        return escolherHabilidadeFunc(personagem, Number(prompt('Escolha a habilidade que voce quer usar (1 ou 2 0 para mostrar status): ')))
    } else {
        mostrarTexto("Número incorreto, tente novamente.")
        return escolherHabilidadeFunc(personagem, Number(prompt("Escolha a habilidade que voce quer usar (1 ou 2 0 para mostrar status): ")))
    }

}

function mostrarStatus (personagem) {
        return mostrarTexto(`Sua vida: ${personagem.vida}\n 
            Sua armadura: ${personagem.armadura}\n 
            Seu dinheiro: ${personagem.dinheiro}\n 
            Dano de ${personagem.habilidade1.nome}: ${personagem.habilidade1.dano}\n
            Dano de ${personagem.habilidade2.nome}: ${personagem.habilidade2.dano}\n`)
}

export{ batalha, escolherHabilidadeFunc }
