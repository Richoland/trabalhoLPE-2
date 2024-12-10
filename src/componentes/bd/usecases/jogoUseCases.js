const { pool } = require('../config');
const Jogo = require('../entities/Jogo');

const getJogosDB = async () => {
    try {
        const { rows } = await pool.query(`SELECT id, nome, descricao, categoria, 
                numero_jogadores_min, numero_jogadores_max 
                FROM jogos
                ORDER BY nome`);
        return rows.map((jogo) =>
            new Jogo(jogo.id, jogo.nome, jogo.descricao, jogo.categoria,
                jogo.numero_jogadores_min, jogo.numero_jogadores_max));
    } catch (err) {
        throw "Erro ao recuperar jogos: " + err;
    }
}

const deleteJogoDB = async (id) => {
    try {
        const results = await pool.query(`DELETE FROM jogos WHERE id = $1`, [id]);
        if (results.rowCount == 0) {
            throw `Nenhum jogo encontrado com o ID ${id} para ser removido`;
        } else {
            return `Jogo removido com sucesso!`;
        }
    } catch (err) {
        throw 'Erro ao remover o jogo: ' + err;
    }
}

const addJogoDB = async (objeto) => {
    try {
        const { nome, descricao, categoria, numeroJogadoresMin, numeroJogadoresMax } = objeto;
        await pool.query(`INSERT INTO jogos (nome, descricao, categoria, 
            numero_jogadores_min, numero_jogadores_max) 
            VALUES ($1, $2, $3, $4, $5)`,
            [nome, descricao, categoria, numeroJogadoresMin, numeroJogadoresMax]);
    } catch (err) {
        throw 'Erro ao inserir o jogo: ' + err;
    }
}

const updateJogoDB = async (objeto) => {
    try {
        const { id, nome, descricao, categoria, numeroJogadoresMin, numeroJogadoresMax } = objeto;
        const results = await pool.query(`UPDATE jogos SET nome = $2, descricao = $3, 
            categoria = $4, numero_jogadores_min = $5, numero_jogadores_max = $6
            WHERE id = $1`,
            [id, nome, descricao, categoria, numeroJogadoresMin, numeroJogadoresMax]);
        if (results.rowCount == 0) {
            throw `Nenhum jogo encontrado com o ID ${id} para ser alterado`;
        }
    } catch (err) {
        throw 'Erro ao alterar o jogo: ' + err;
    }
}

const getJogoPorIdDB = async (id) => {
    try {
        const results = await pool.query(`SELECT id, nome, descricao, categoria, 
                numero_jogadores_min, numero_jogadores_max 
                FROM jogos
                WHERE id = $1`, [id]);
        if (results.rowCount == 0) {
            throw `Nenhum jogo encontrado com o ID ${id}`;
        } else {
            const jogo = results.rows[0];
            return new Jogo(jogo.id, jogo.nome, jogo.descricao, jogo.categoria,
                jogo.numero_jogadores_min, jogo.numero_jogadores_max);
        }
    } catch (err) {
        throw 'Erro ao recuperar o jogo: ' + err;
    }
};
const getNomesJogosDB = async () => {
    try {
        const results = await pool.query("SELECT id, nome FROM jogos");
        return results.rows; // Retorna os jogos com `id` e `nome`
    } catch (err) {
        throw new Error("Erro ao buscar nomes dos jogos: " + err);
    }
};

module.exports = {
    getJogosDB,
    deleteJogoDB,
    addJogoDB,
    updateJogoDB,
    getJogoPorIdDB,
    getNomesJogosDB
};
