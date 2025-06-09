import {
  Vila,
  Cidade,
  Fazenda1,
  Fazenda2,
  Delegacia,
  Igreja,
  Caatinga,
  Venda,
} from "./mapa.js";
import { batalha } from "./batalha.js";
import { Protagonista } from "./protagonista.js";
import { Habilidades, CaixaItens } from "./arsenal.js"; // Mantido, mas nem tudo é usado diretamente
import {
  Personagem, // Mantido, mas nem tudo é usado diretamente
  gerarNumeroAleatorio0_20, // Mantido, mas nem tudo é usado diretamente
  lampiao,
  francisctexeira,
  volante,
  bandidoscidade,
  bandidoscidade2,
  zerufino,
} from "./personagem.js";
import { iniciarFuga } from "./fuga.js";
import { mostrarTexto, mostrarOpcoes } from "./interface.js";
import { getDialogos } from "./dadosCompartilhados.js";

let inventario = [0, "cantil de água", "pistola velha", "faca enferrujada"]; // Inventário inicial do jogo

let VendaLoja = {
  nomelocal: "----- Mercearia Secos e Molhados -----",
  Itens: [
    "Água ardente",
    "Curativos",
    "Munição",
    "Parabelo",
    "Colete",
    "Carne de sol",
  ],
};

let fasesconcluidas = 0;

const dialogosPorFase = {
  tutorial: [1, 2, 3],
  fase1: [4, 5, 6, 7, 8, 9],
  fase2: [10, 11, 12, 13],
  fase3: [14, 15, 16, 17, 18, 19, 20, 21, 22, 23, 24],
  fase4: [25, 26, 27, 28],
};

function mostrarDialogosPorIds(ids) {
  const dialogos = getDialogos();
  ids.forEach((id) => {
    const d = dialogos.find((d) => d.id_dialogo === id);
    if (d) {
      mostrarTexto(`**${d.nome}:** ${d.fala}`);
    } else {
      console.warn(`Diálogo com ID ${id} não encontrado.`);
    }
  });
}

class Fases {
  #nomeFase;
  #status;
  constructor(nomeFase, status) {
    this.#nomeFase = nomeFase;
    this.#status = status;
  }
  // Getters para exibir o nome da fase
  get mostrarTutorial() {
    return `\n**[${this.#nomeFase}]**\n`;
  }
  get mostrarfase1() {
    return `\n**[${this.#nomeFase}]**\n`;
  }
  get mostrarfase2() {
    return `**[${this.#nomeFase}]**\n`;
  }
  get mostrarfase3() {
    return `\n**[${this.#nomeFase}]**\n`;
  }
  get mostrarfase4() {
    return `\n**[${this.#nomeFase}]**\n`;
  }
  get mostrarStatusFase() {
    return this.#status;
  }

  missaoConcluida() {
    this.#status = "concluída";
    mostrarTexto(`**Fase "${this.#nomeFase}" concluída!**`);
  }

  // Cura um percentual da vida máxima do protagonista
  curaPosBatalha(protagonista) {
    // Para simplificar, assumimos que a vida atual do protagonista é o máximo
    // Ou você pode ter um atributo `vidaMaxima` no Personagem/Protagonista
    const vidaMaxima = protagonista.vida; // Isso precisa ser a vida inicial do personagem
    const curaPorcentagem = 0.4; // 40% de cura
    const curaQuantidade = vidaMaxima * curaPorcentagem;
    protagonista.aumentarVida(curaQuantidade);
    mostrarTexto(
      `Você se recuperou e ganhou **${curaQuantidade.toFixed(
        0
      )}** pontos de vida. Vida atual: **${protagonista.vida.toFixed(0)}**.`
    );
  }
}

class Tutorial extends Fases {
  constructor(nomeFase, status) {
    super(nomeFase, status);
  }
  async iniciarTutorial(protagonistaA, adversario) {
    mostrarDialogosPorIds(dialogosPorFase.tutorial);
    await new Promise((resolve) => {
      // Espera a ação do jogador para iniciar a batalha
      mostrarOpcoes([
        {
          texto: "Iniciar Batalha do Tutorial",
          acao: async () => {
            mostrarTexto("Iniciando batalha do tutorial...");
            const vitoria = await batalha(protagonistaA, adversario); // Aguarda o resultado da batalha
            if (vitoria) {
              this.missaoConcluida();
              this.curaPosBatalha(protagonistaA);
              mostrarTexto(
                "Parabéns! Você venceu o tutorial e está pronto para o sertão!"
              );
            } else {
              mostrarTexto(
                "Você foi derrotado no tutorial. Tente novamente para dominar as habilidades!"
              );
              // Lógica de game over ou reiniciar (a interface.js pode cuidar disso)
            }
            resolve(); // Resolve a Promise, permitindo que a próxima fase comece
          },
        },
      ]);
    });
  }
}

class Fase1 extends Fases {
  constructor(nomeFase, status) {
    super(nomeFase, status);
  }
  async missaoDaJoia(protagonistaA, adversario) {
    mostrarDialogosPorIds(dialogosPorFase.fase1);
    mostrarTexto(`**Local:** ${Fazenda1.nomelocal}`);
    mostrarTexto(`>>> **Informações:** ${Fazenda1.informacoes}`);

    const vitoriaBatalha = await batalha(protagonistaA, adversario); // Aguarda o resultado da batalha
    if (vitoriaBatalha) {
      this.curaPosBatalha(protagonistaA);
      mostrarTexto("Você derrotou o Coronel Texeira e recuperou a joia!");

      await new Promise((resolve) => {
        // Espera a escolha do jogador
        mostrarOpcoes([
          {
            texto: "Ficar com a joia (Reputação baixa, item valioso)",
            acao: () => {
              protagonistaA.caixa.mudarItem(0, "joia"); // Adiciona a joia ao inventário na posição 0
              protagonistaA.perderReputacao(5); // Exemplo de perda de reputação
              mostrarTexto(
                `Narração: **${protagonistaA.nome}** decidiu ficar com a joia. Sua reputação diminuiu um pouco.`
              );
              mostrarTexto("Você guardou a joia consigo.");
              resolve();
            },
          },
          {
            texto: "Devolver a joia (Reputação alta, terço de proteção)",
            acao: () => {
              protagonistaA.caixa.mudarItem(0, "terço"); // Adiciona o terço ao inventário na posição 0
              protagonistaA.ganharReputacao(10); // Exemplo de ganho de reputação
              mostrarTexto(
                "Você devolveu a joia e ganhou um terço como proteção. Sua reputação aumentou!"
              );
              resolve();
            },
          },
        ]);
      });
      this.missaoConcluida();
    } else {
      mostrarTexto(
        "Você foi derrotado e não conseguiu recuperar a joia. O sertão se torna mais perigoso..."
      );
      // Lógica de game over ou reiniciar
    }
  }
}

class Fase2 extends Fases {
  constructor(nomeFase, status) {
    super(nomeFase, status);
  }
  async missaoResgate(protagonistaA, adversario) {
    mostrarDialogosPorIds(dialogosPorFase.fase2);
    mostrarTexto(`**Local:** ${Delegacia.nomelocal}`);
    mostrarTexto(`>>> **Informações:** ${Delegacia.informacoes}`);
    mostrarTexto("Você precisa resgatar Batoré da delegacia!");

    const vitoriaBatalha = await batalha(protagonistaA, adversario); // Aguarda a batalha
    if (vitoriaBatalha) {
      mostrarTexto(
        "Você derrotou o Volante! Agora, você precisa escapar com Batoré..."
      );
      const vitoriaFuga = await iniciarFuga(protagonistaA, adversario); // Aguarda o resultado da fuga

      if (vitoriaFuga) {
        mostrarTexto(
          "Você e Batoré escaparam com sucesso! A missão foi cumprida."
        );
        this.missaoConcluida(); // Conclui a fase
      } else {
        mostrarTexto(
          "Você não conseguiu escapar com Batoré. Ele foi recapturado..."
        );
        // Lógica de game over
      }
    } else {
      mostrarTexto(
        "Você foi derrotado na delegacia e não conseguiu salvar Batoré. A missão falhou."
      );
      // Lógica de game over
    }
  }
  // Método específico para a conclusão da Fase 2, adicionando recompensas
  missaoResgateConcluida(protagonistaA) {
    super.missaoConcluida(); // Chama o método da classe pai
    fasesconcluidas = 2; // Atualiza o contador de fases concluídas
    protagonistaA.receberDinheiro(125); // Adiciona dinheiro ao protagonista
    mostrarTexto("Recompensa recebida: **+125 dinheiro** por salvar Batoré!");
    this.curaPosBatalha(protagonistaA);
  }
}

class Fase3 extends Fases {
  constructor(nomeFase, status) {
    super(nomeFase, status);
  }
  async irParaCidade(protagonistaA, adversario, adversario2) {
    mostrarTexto(`**Local:** ${Cidade.nomelocal}`);
    mostrarTexto(`>>> **Informações:** ${Cidade.informacoes}`);
    mostrarDialogosPorIds([14]);

    // Permite ao jogador escolher para onde ir na cidade
    await new Promise((resolve) => {
      mostrarOpcoes([
        {
          texto: "Visitar a Vila Piranhas",
          acao: async () => {
            await this.irParaVila(protagonistaA, adversario, adversario2);
            resolve();
          },
        },
        {
          texto: "Ir para a Mercearia Secos e Molhados",
          acao: async () => {
            await this.irParaVenda(protagonistaA, adversario, adversario2);
            resolve();
          },
        },
        {
          texto: "Ir para a Igreja do Padinho Cicero",
          acao: async () => {
            await this.irParaIgreja(protagonistaA, adversario, adversario2);
            resolve();
          },
        },
      ]);
    });

    mostrarTexto(
      "Após suas andanças pela cidade, é hora de encarar a Caatinga..."
    );
    await this.irParaCaatinga(protagonistaA, adversario, adversario2); // Força ir para a Caatinga após as escolhas
  }

  async irParaVila(protagonistaA, adversario, adversario2) {
    mostrarTexto(`**Local:** ${Vila.nomelocal}`);
    mostrarTexto(`>>> **Informações:** ${Vila.informacoes}`);
    mostrarDialogosPorIds([15, 16, 17, 18]);
    mostrarTexto("Você explorou a Vila Piranhas.");
    // Não força ir para a venda aqui, apenas retorna para o loop de opções da cidade
  }

  async irParaVenda(protagonistaA, adversario, adversario2) {
    mostrarTexto(`**Local:** ${Venda.nomelocal}`);
    mostrarTexto(`**Informações:** ${VendaLoja.nomelocal}`); // Mostra o nome da loja

    // Lógica para adicionar itens ao inventário com base na joia
    const novosItens = [];
    if (protagonistaA.caixa.receberItem(0) === "joia") {
      VendaLoja.Itens.forEach((item) => {
        if (!inventario.includes(item)) {
          inventario.push(item);
          novosItens.push(item);
        }
      });
    } else {
      ["Parabelo", "Água ardente", "Munição", "Curativos"].forEach((item) => {
        if (!inventario.includes(item)) {
          inventario.push(item);
          novosItens.push(item);
        }
      });
    }
    if (novosItens.length > 0) {
      mostrarTexto(
        `Você adquiriu os seguintes itens: **${novosItens.join(", ")}**.`
      );
    } else {
      mostrarTexto("Não há novos itens para você aqui no momento.");
    }
    mostrarTexto("Compra efetuada com sucesso! Seu inventário foi atualizado.");
  }

  async irParaIgreja(protagonistaA, adversario, adversario2) {
    mostrarTexto(`**Local:** ${Igreja.nomelocal}`);
    mostrarTexto(`>>> **Informações:** ${Igreja.informacoes}`);
    if (protagonistaA.caixa.receberItem(0) !== "joia") {
      // Se não ficou com a joia, recebe a bênção
      protagonistaA.aumentarVida(20);
      mostrarTexto(
        "Você recebeu uma bênção do Padinho Cicero! Sua vida aumentou em **20 pontos**."
      );
    } else {
      mostrarTexto(
        "Você não sentiu a benção do Padinho Cicero. Talvez por estar com a joia roubada..."
      );
    }
  }

  async irParaCaatinga(protagonistaA, adversario, adversario2) {
    mostrarTexto(`**Local:** ${Caatinga.nomelocal}`);
    mostrarTexto(`>>> **Informações:** ${Caatinga.informacoes}`);
    mostrarTexto("Você encontra os bandidos... prepare-se para a luta!");

    let vitoria1 = await batalha(protagonistaA, adversario);
    if (!vitoria1) {
      mostrarTexto(
        "Você foi derrotado pelo primeiro bandido. O jogo termina aqui..."
      );
      // Lógica de game over
      return; // Impede a continuação para a segunda batalha
    }
    this.curaPosBatalha(protagonistaA);
    mostrarTexto(
      "Você derrotou o primeiro bandido. Prepare-se para o próximo!"
    );

    let vitoria2 = await batalha(protagonistaA, adversario2);
    if (!vitoria2) {
      mostrarTexto(
        "Você foi derrotado pelo segundo bandido. O jogo termina aqui..."
      );
      // Lógica de game over
      return;
    }
    this.curaPosBatalha(protagonistaA);
    mostrarDialogosPorIds([23, 24]); // Diálogos pós-batalha
    this.missaoConcluida();
  }

  missaoConcluida() {
    super.missaoConcluida(); // Chama o método da classe pai
    fasesconcluidas = 3;
    mostrarTexto("Você concluiu a **Fase 3** e limpou a Caatinga da região!");
  }
}

class Fase4 extends Fases {
  constructor(nomeFase, status) {
    super(nomeFase, status);
  }
  async irParaFazendaCoronel(protagonistaA, adversario) {
    mostrarTexto(`**Local:** ${Fazenda2.nomelocal}`);
    mostrarTexto(`>>> **Informações:** ${Fazenda2.informacoes}`);
    mostrarDialogosPorIds(dialogosPorFase.fase4); // Diálogos pré-batalha final

    const vitoriaFinal = await batalha(protagonistaA, adversario); // Batalha final
    if (vitoriaFinal) {
      this.missaoConcluida();
      this.fimDeJogo(true); // Passa true para indicar vitória
    } else {
      this.fimDeJogo(false); // Passa false para indicar derrota
    }
  }
  missaoConcluida() {
    super.missaoConcluida(); // Chama o método da classe pai
    fasesconcluidas = 4;
    // O item na posição 0 do inventário é agora um marcador de vitória
    inventario[0] = "Coroa de Campeão do Sertão"; // Exemplo de item final
    mostrarTexto(
      "Parabéns! Você completou a jornada e se tornou o verdadeiro herói do sertão!"
    );
  }
  fimDeJogo(n) {
    // O 'n' agora é um booleano (true para vitória, false para derrota)
    if (n) {
      mostrarTexto("--- **VITÓRIA!** ---");
      mostrarTexto(
        "O sertão está em paz novamente. Sua lenda será contada por gerações!"
      );
    } else {
      mostrarTexto("--- **DERROTA!** ---");
      mostrarTexto(
        "Você foi derrotado e esquecido nas terras secas do sertão. O mal prevaleceu..."
      );
    }
    mostrarTexto("Obrigado por jogar Cangaceiros!");
    // Oferece a opção de jogar novamente
    mostrarOpcoes([
      { texto: "Jogar Novamente", acao: () => location.reload() },
    ]);
  }
}

export {
  Fases,
  Tutorial,
  Fase1,
  Fase2,
  Fase3,
  Fase4,
  dialogosPorFase,
  mostrarDialogosPorIds,
};
