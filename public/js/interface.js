// public/js/interface.js

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

// DOM helpers – escrever e mostrar opções
function mostrarTexto(texto) {
  const caixa = document.getElementById("caixa-de-dialogo");
  caixa.innerHTML += `<p>${texto}</p>`;
  caixa.scrollTop = caixa.scrollHeight;
}

function mostrarOpcoes(opcoes) {
  const comandos = document.getElementById("comandos");
  comandos.innerHTML = "";

  opcoes.forEach((opcao) => {
    const botao = document.createElement("button");
    botao.textContent = opcao.texto;
    botao.onclick = () => {
      comandos.innerHTML = "";
      opcao.acao();
    };
    comandos.appendChild(botao);
  });
}

// Atualizações visuais
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

// Variável global para o jogador
let jogador;

// Função principal de início do jogo
async function comecarJogo() {
  const nome = document.getElementById("nomeJogador").value;
  if (!nome) {
    alert("Por favor, digite um nome para o seu personagem.");
    return;
  }

  document.getElementById("comecar").style.display = "none";
  document.getElementById("caixa-de-dialogo").style.display = "block";
  document.getElementById("comandos").style.display = "flex";

  jogador = await escolherProta(nome);
  mostrarTexto(`Seja bem-vindo(a), **${jogador.nome}**! O sertão te espera.`);

  // TUTORIAL
  const tutorial = new Tutorial("Tutorial", "pendente");
  atualizarInterface({ cenario: "caatinga", estadoJogador: "" });
  mostrarTexto(tutorial.mostrarTutorial);
  await tutorial.iniciarTutorial(jogador, lampiao);

  // FASE 1
  const fase1 = new Fase1("A Joia do Coronel", "pendente");
  atualizarInterface({ cenario: "fase1", estadoJogador: "" });
  mostrarTexto(fase1.mostrarfase1); // Correto: acessando como propriedade/getter
  await fase1.missaoDaJoia(jogador, francisctexeira);

  // FASE 2
  const fase2 = new Fase2("Resgate na Vila", "pendente");
  atualizarInterface({ cenario: "fase2", estadoJogador: "" });
  mostrarTexto(fase2.mostrarfase2);
  await fase2.missaoResgate(jogador, volante);
  fase2.missaoResgateConcluida(jogador);

  // FASE 3
  const fase3 = new Fase3("Confronto na Cidade", "pendente");
  atualizarInterface({ cenario: "fase3", estadoJogador: "" });
  mostrarTexto(fase3.mostrarfase3);
  await fase3.irParaCidade(jogador, bandidoscidade, bandidoscidade2);

  // FASE 4
  const fase4 = new Fase4("Fazenda do Coronel", "pendente");
  atualizarInterface({ cenario: "fase4", estadoJogador: "" });
  mostrarTexto(fase4.mostrarfase4);
  await fase4.irParaFazendaCoronel(jogador, zerufino);

  // Final opcional
  // mostrarTexto("Jogo encerrado. Agradecemos por jogar!");
  // mostrarOpcoes([{ texto: "Jogar Novamente", acao: () => location.reload() }]);
}

// Expondo para o HTML
window.comecarJogo = comecarJogo;

// (opcional) Carregamento dos diálogos via backend - pode ser ativado se necessário
// fetch("/api/dialogos")
//   .then((res) => res.json())
//   .then((data) => {
//     setDialogos(data);
//     console.log("Diálogos carregados com sucesso!");
//   })
//   .catch((err) => {
//     console.error("Erro ao carregar os diálogos:", err);
//     mostrarTexto("Erro ao carregar diálogos do servidor. O jogo pode não funcionar corretamente.");
//   });

export {
  mostrarTexto,
  mostrarOpcoes,
  atualizarImagemPersonagem,
  atualizarCenario,
  atualizarInterface,
};
