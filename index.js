const express = require('express')
const path = require('path')
const Database = require('./backend/database.js')

const app = express() 
const db = new Database()

app.use(express.static(path.join(__dirname, '../public')))

// Rota correta e limpa
app.get('/api/dialogos', async (req, res) => {
  try {
    const dialogos = await db.getDialogos()
    res.json(dialogos)
  } catch (err) {
    console.error(err)
    res.status(500).send('Erro ao consultar diálogos')
  }
})

// Exemplo com Express + MySQL
app.get("/dialogos/:fase", (req, res) => {
  const fase = req.params.fase;
  const sql = "SELECT personagem, fala FROM dialogos WHERE fase = ?";
  db.query(sql, [fase], (err, result) => {
    if (err) return res.status(500).send("Erro no banco");
    res.json(result);
  });
});

app.listen(3000, () => {
  console.log('Servidor rodando na porta 3000')
})
