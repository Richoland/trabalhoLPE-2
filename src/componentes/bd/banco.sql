create table usuarios (
	email varchar(50) not null primary key, 
	senha text not null, 
	tipo char(1)  not null, 
	check (tipo = 'A' or tipo = 'U'),
	telefone varchar(14)  not null, 
	nome varchar(50) not null
);
insert into usuarios (email, senha, tipo, telefone, nome) 
values ('jorgebavaresco@ifsul.edu.br', '123456', 'A','(54)99984-4348','Jorge Bavaresco'), 
('joao@ifsul.edu.br', '123456', 'U','(54)44484-4348','Joao');


insert into usuarios (email, senha, tipo, telefone, nome) 
values ('ricardodallagnol@ifsul.edu.br', '12345678', 'A','(54)99660-4121','Ricardo Dall Agnol');

CREATE TABLE reservas (
    id SERIAL NOT NULL PRIMARY KEY,
    data_reserva TIMESTAMP NOT NULL,
    quantidade_pessoas INT NOT NULL,
    usuario_email VARCHAR(50) NOT NULL,
    jogo_id INT NOT NULL,
    FOREIGN KEY (usuario_email) REFERENCES usuarios(email),
    FOREIGN KEY (jogo_id) REFERENCES jogos(id)
);

CREATE TABLE jogos (
    id SERIAL NOT NULL PRIMARY KEY,
    nome VARCHAR(100) NOT NULL,
    descricao TEXT,
    categoria VARCHAR(50),
    numero_jogadores_min INT NOT NULL,
    numero_jogadores_max INT NOT NULL
);

INSERT INTO jogos (nome, descricao, categoria, numero_jogadores_min, numero_jogadores_max)
VALUES 
('Catan', 'Jogo de estratégia e troca de recursos', 'Estratégia', 3, 4),
('Carcassonne', 'Jogo de colocação de peças com cidades e estradas', 'Familiar', 2, 5),
('Dixit', 'Jogo criativo com interpretação de imagens', 'Party Game', 3, 6);


INSERT INTO reservas (data_reserva, quantidade_pessoas, usuario_email, jogo_id)
VALUES 
('2024-12-25 18:30:00', 4, 'ricardodallagnol@ifsul.edu.br', 1),
('2024-12-26 15:00:00', 5, 'joao@ifsul.edu.br', 2);
