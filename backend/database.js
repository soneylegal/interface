const mysql = require("mysql2");

class Database {
  constructor() {
    this.connection = mysql.createConnection({
      host: "localhost",
      user: "root",
      password: "12345678",
      database: "test",
    });
  }

  query(sql, params = []) {
    return new Promise((resolve, reject) => {
      this.connection.query(sql, params, (err, results) => {
        if (err) reject(err);
        else resolve(results);
      });
    });
  }

  async getDialogos() {
    const sql = `
      SELECT dialogo.id_dialogo, dialogo.fala, personagem.nome 
      FROM dialogo 
      INNER JOIN personagem ON dialogo.fk_id_personagem = personagem.id_personagem 
      ORDER BY id_dialogo
    `;
    return this.query(sql);
  }
}

module.exports = Database;
