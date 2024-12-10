const { pool } = require('../config');
const Reserva = require('../entities/Reserva');

const getReservasDB = async () => {
  try {
    const { rows } = await pool.query(`
      SELECT 
        r.id, 
        r.data_reserva, 
        r.quantidade_pessoas, 
        r.usuario_email, 
        r.jogo_id, 
        j.nome AS jogo_nome
      FROM reservas r
      JOIN jogos j ON r.jogo_id = j.id
      ORDER BY r.data_reserva
    `);
    return rows.map((reserva) => ({
      id: reserva.id,
      data_reserva: reserva.data_reserva,
      quantidade_pessoas: reserva.quantidade_pessoas,
      usuario_email: reserva.usuario_email,
      jogo_id: reserva.jogo_id,
      jogo_nome: reserva.jogo_nome,
    }));
  } catch (err) {
    throw "Erro: " + err;
  }
};


const deleteReservaDB = async (id) => {
  try {
    const results = await pool.query(`DELETE FROM reservas WHERE id = $1`, [id]);
    if (results.rowCount == 0) {
      throw `Nenhum registro encontrado com o ID ${id} para ser removido`;
    } else {
      return `Reserva removida com sucesso!`;
    }
  } catch (err) {
    throw 'Erro ao remover a reserva: ' + err;
  }
};

const addReservaDB = async (objeto) => {
  try {
    const { data_reserva, quantidade_pessoas, usuario_email, jogo_id } = objeto; // Corrigido
    await pool.query(
      `INSERT INTO reservas (data_reserva, quantidade_pessoas, usuario_email, jogo_id) 
             VALUES ($1, $2, $3, $4)`,
      [data_reserva, quantidade_pessoas, usuario_email, jogo_id] // Certifique-se de que os nomes estão consistentes
    );
  } catch (err) {
    throw 'Erro ao inserir a reserva: ' + err;
  }
};


const updateReservaDB = async (objeto) => {
  try {
    const { id, data_reserva, quantidade_pessoas, usuario_email, jogo_id } = objeto; // Alinhado ao padrão
    const results = await pool.query(
      `UPDATE reservas 
       SET data_reserva = $2, quantidade_pessoas = $3, usuario_email = $4, jogo_id = $5 
       WHERE id = $1`,
      [id, data_reserva, quantidade_pessoas, usuario_email, jogo_id] // Consistência nos nomes
    );
    if (results.rowCount === 0) {
      throw `Nenhum registro encontrado com o ID ${id} para ser alterado`;
    }
  } catch (err) {
    throw 'Erro ao alterar a reserva: ' + err;
  }
};


const getReservaPorIdDB = async (id) => {
  try {
    const results = await pool.query(`SELECT * FROM reservas WHERE id = $1`, [id]);
    if (results.rowCount == 0) {
      throw `Nenhum registro encontrado com o ID ${id}`;
    } else {
      const reserva = results.rows[0];
      return new Reserva(
        reserva.id,
        reserva.data_reserva,
        reserva.quantidade_pessoas,
        reserva.usuario_email,
        reserva.jogo_id
      );
    }
  } catch (err) {
    throw 'Erro ao recuperar a reserva: ' + err;
  }
};
const getEmailsUsuariosDB = async () => {
  try {
    const results = await pool.query("SELECT email FROM usuarios");
    return results.rows.map((row) => row.email); // Retorna apenas os e-mails
  } catch (err) {
    throw new Error("Erro ao buscar e-mails dos usuários: " + err);
  }
};

module.exports = { getReservasDB, deleteReservaDB, addReservaDB, updateReservaDB, getReservaPorIdDB, getEmailsUsuariosDB };
