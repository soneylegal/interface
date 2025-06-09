// Para escrever no navegador
function mostrarTexto(texto) {
  const caixa = document.getElementById("caixa-de-dialogo");
  // Adiciona o novo texto e garante que a caixa de diálogo role para o final
  caixa.innerHTML += `<p>${texto}</p>`;
  caixa.scrollTop = caixa.scrollHeight;
}

// Botoes de comando
function mostrarOpcoes(opcoes) {
  const comandos = document.getElementById("comandos");
  comandos.innerHTML = ""; // Limpa opções anteriores

  opcoes.forEach((opcao) => {
    const botao = document.createElement("button");
    botao.textContent = opcao.texto;
    botao.onclick = () => {
      // Limpa as opções assim que uma é clicada para evitar múltiplos cliques
      comandos.innerHTML = "";
      opcao.acao(); // Executa a ação da opção
    };
    comandos.appendChild(botao);
  });
}

// Cenario e personagens
function atualizarImagemPersonagem(estado) {
  const img = document.querySelector("#jogador img");
  switch (estado) {
    case "ataque":
      img.src = "imgspjcangaco/protagonista_ataque.png";
      break;
    case "rip":
      img.src = "imgspjcangaco/protagonista_rip.png";
      break;
    default:
      img.src = "imgspjcangaco/protagonista_relaxado.png";
  }
}

function atualizarCenario(nomeCenario) {
  const imagens = document.querySelectorAll("#cenario img");
  imagens.forEach((img) => img.classList.remove("ativo"));
  const imagemAtual = document.getElementById(nomeCenario);
  if (imagemAtual) {
    imagemAtual.classList.add("ativo");
  } else {
    console.warn(`Cenário "${nomeCenario}" não encontrado.`);
  }
}

function atualizarInterface({ cenario, estadoJogador }) {
  if (cenario) atualizarCenario(cenario);
  if (estadoJogador) atualizarImagemPersonagem(estadoJogador);
}

// Importações
import { setDialogos } from "./dadosCompartilhados.js";
import { escolherProta } from "./escolherProtagonista.js";
import { Tutorial, Fase1, Fase2, Fase3, Fase4 } from "./fases.js";
import {
  lampiao,
  francisctexeira,
  volante,
  bandidoscidade,
  bandidoscidade2,
  zerufino,
} from "./personagem.js";
// import { exibirMapa, Cidade, Vila, Delegacia, Venda, Igreja, Caatinga, Fazenda1, Fazenda2 } from './mapa.js' // Removido, pois não é usado aqui diretamente

let jogador;

// Função principal chamada após carregar diálogos
async function comecarJogo() {
  // Tornada assíncrona
  const nome = document.getElementById("nomeJogador").value;
  if (!nome) {
    alert("Por favor, digite um nome para o seu personagem.");
    return;
  }

  // Esconder o campo de nome e o botão de começar
  document.getElementById("comecar").style.display = "none";
  document.getElementById("caixa-de-dialogo").style.display = "block"; // Garante que a caixa de diálogo esteja visível
  document.getElementById("comandos").style.display = "flex"; // Garante que os comandos estejam visíveis

  // Escolher o protagonista (aguarda a Promise)
  jogador = await escolherProta(nome);
  mostrarTexto(`Seja bem-vindo(a), **${jogador.nome}**! O sertão te espera.`);

  // --- Sequência de Fases ---
  // Cada fase agora é aguardada (await) para que o jogo prossiga interativamente

  // Tutorial
  const _tutorial = new Tutorial("Tutorial", "não concluído");
  atualizarInterface({ cenario: "caatinga", estadoJogador: "" });
  mostrarTexto(_tutorial.mostrarTutorial);
  await _tutorial.iniciarTutorial(jogador, lampiao); // Aguarda a conclusão do tutorial

  // Fase 1
  const _fase1 = new Fase1("Fase 1", "não concluída");
  atualizarInterface({ cenario: "fase1", estadoJogador: "" });
  mostrarTexto(_fase1.mostrarfase1());
  await _fase1.missaoDaJoia(jogador, francisctexeira); // Aguarda a conclusão da Fase 1

  // Fase 2
  const _fase2 = new Fase2("Fase 2", "não concluída");
  atualizarInterface({ cenario: "fase2", estadoJogador: "" });
  mostrarTexto(_fase2.mostrarfase2());
  await _fase2.missaoResgate(jogador, volante); // Aguarda a conclusão da Fase 2
  _fase2.missaoResgateConcluida(jogador); // Chama o método de conclusão após a missão

  // Fase 3
  const _fase3 = new Fase3("Fase 3", "não concluída");
  atualizarInterface({ cenario: "fase3", estadoJogador: "" });
  mostrarTexto(_fase3.mostrarfase3());
  await _fase3.irParaCidade(jogador, bandidoscidade, bandidoscidade2); // Aguarda a conclusão da Fase 3

  // Fase 4
  const _fase4 = new Fase4("Fase 4", "não concluída");
  atualizarInterface({ cenario: "fase4", estadoJogador: "" });
  mostrarTexto(_fase4.mostrarfase4());
  await _fase4.irParaFazendaCoronel(jogador, zerufino); // Aguarda a conclusão da Fase 4
  // A função fimDeJogo é chamada dentro de irParaFazendaCoronel, que também é aguardada.

  // Fim do jogo (opcional, pode ser movido para dentro de Fase4.fimDeJogo)
  // mostrarTexto("Jogo encerrado. Agradecemos por jogar!")
  // mostrarOpcoes([{ texto: "Jogar Novamente", acao: () => location.reload() }])
}

// Exponha a função globalmente para que possa ser chamada pelo HTML
window.comecarJogo = comecarJogo;

// // Carregar os diálogos do backend antes de iniciar o jogo
// // Isso é feito uma única vez no carregamento da página
// fetch("/api/dialogos")
//   .then((res) => res.json())
//   .then((data) => {
//     setDialogos(data);
//     console.log("Diálogos carregados com sucesso!");
//     // O jogo só começa de fato quando o jogador clica em "Começar"
//   })
//   .catch((err) => {
//     console.error("Erro ao carregar os diálogos:", err);
//     mostrarTexto(
//       "Erro ao carregar diálogos do servidor. O jogo pode não funcionar corretamente."
//     );
//   });

export {
  mostrarTexto,
  mostrarOpcoes,
  atualizarImagemPersonagem,
  atualizarCenario,
  atualizarInterface,
};
