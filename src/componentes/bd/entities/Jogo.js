class Jogo {
    constructor(id, nome, descricao, categoria, numeroJogadoresMin, numeroJogadoresMax, ativo, valor, dataCadastro) {
        this.id = id;
        this.nome = nome;
        this.descricao = descricao;
        this.categoria = categoria;
        this.numeroJogadoresMin = numeroJogadoresMin;
        this.numeroJogadoresMax = numeroJogadoresMax;
        this.ativo = ativo;
        this.valor = valor;
        this.dataCadastro = dataCadastro;
    }
}

module.exports = Jogo;
