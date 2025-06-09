// Este arquivo armazena os diálogos carregados do banco de dados
// para que possam ser acessados por outras partes do frontend.

let dialogos = []; // Array para armazenar os diálogos

// Define os diálogos (geralmente chamdo após o fetch do backend)
function setDialogos(data) {
  dialogos = data;
}

// Retorna os diálogos atualmente armazenados
function getDialogos() {
  return dialogos;
}

export { setDialogos, getDialogos };
