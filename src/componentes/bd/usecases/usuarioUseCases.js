const { pool } = require('../config');
const Usuario = require('../entities/Usuario');

const autenticaUsuarioDB = async (objeto) => {
    try {
        const { email, senha } = objeto;
        const results = await pool.query(
            `SELECT * FROM usuarios WHERE email = $1 AND senha = $2`,
            [email, senha]
        );
        if (results.rowCount == 0) {
            throw "Usuário ou senha inválidos";
        }
        const usuario = results.rows[0];
        return new Usuario(usuario.email, usuario.tipo, usuario.telefone, usuario.nome);
    } catch (err) {
        throw "Erro ao autenticar o usuário: " + err;
    }
};

const addUsuarioDB = async (objeto) => {
    try {
        const { email, senha, tipo, telefone, nome } = objeto;

        const results = await pool.query(
            `INSERT INTO usuarios (email, senha, tipo, telefone, nome) 
             VALUES ($1, $2, $3, $4, $5) 
             RETURNING email, tipo, telefone, nome`,
            [email, senha, tipo, telefone, nome]
        );

        if (results.rowCount === 0) {
            throw new Error("Erro ao adicionar o usuário");
        }

        const usuario = results.rows[0];
        return {
            email: usuario.email,
            tipo: usuario.tipo,
            telefone: usuario.telefone,
            nome: usuario.nome,
        };
    } catch (err) {
        throw new Error("Erro ao adicionar o usuário: " + err.message);
    }
};

// Função para obter os dados do usuário atual pelo email
const getUsuarioPorEmailDB = async (objeto) => {
    try {
        const { email } = objeto;

        if (!email) {
            throw new Error("Email não fornecido.");
        }

        const results = await pool.query(
            `SELECT * FROM usuarios WHERE email = $1`,
            [email]
        );

        if (results.rowCount === 0) {
            throw new Error("Usuário não encontrado.");
        }
        const usuario = results.rows[0];
        return new Usuario(
            usuario.email,
            usuario.tipo,
            usuario.telefone,
            usuario.nome
        );
    } catch (err) {
        throw new Error(`Erro ao obter o usuário: ${err.message || err}`);
    }
};

// Função para atualizar dados do usuário (exceto tipo)
const updateUsuarioDB = async (objeto) => {
    try {
        const { email, nome, telefone, senha } = objeto;

        // Atualiza nome, telefone e senha. Caso não queira alterar a senha se estiver vazia,
        // você pode fazer uma lógica condicional aqui.
        const results = await pool.query(
            `UPDATE usuarios 
             SET nome = $1, telefone = $2, senha = $3
             WHERE email = $4
             RETURNING email, tipo, telefone, nome, senha`,
            [nome, telefone, senha, email]
        );

        if (results.rowCount === 0) {
            throw new Error("Usuário não encontrado ou email inexistente");
        }

        const usuario = results.rows[0];
        return new Usuario(usuario.nome, usuario.email, usuario.telefone);
    } catch (err) {
        throw new Error("Erro ao atualizar o usuário: " + err.message);
    }
};


module.exports = {
    autenticaUsuarioDB,
    addUsuarioDB,
    getUsuarioPorEmailDB,
    updateUsuarioDB
};
