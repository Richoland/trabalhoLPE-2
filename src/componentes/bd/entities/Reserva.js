class Reserva {
    constructor(id, dataReserva, quantidadePessoas, usuarioEmail, jogoId) {
        this.id = id; // Identificador único
        this.dataReserva = dataReserva; // Data e hora da reserva
        this.quantidadePessoas = quantidadePessoas; // Número inteiro
        this.usuarioEmail = usuarioEmail; // E-mail do usuário
        this.jogoId = jogoId; // ID do jogo
    }
}

module.exports = Reserva;
