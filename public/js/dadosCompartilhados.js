// para pegador do banco e conseguir usar nos outros arqvs

let dialogos = []

function setDialogos(data) {
  dialogos = data
}

function getDialogos() {
  return dialogos
}

export { setDialogos, getDialogos }
