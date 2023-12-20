# Criação da tabela usuarios

CREATE TABLE banco.usuarios (
  idusuarios INT NOT NULL AUTO_INCREMENT,
  nome VARCHAR(45) NOT NULL,
  email VARCHAR(45) NOT NULL,
  senha VARCHAR(200) NOT NULL,
  telefone VARCHAR(45) NOT NULL,
  PRIMARY KEY (idusuarios),
  UNIQUE INDEX email_UNIQUE (email ASC)
);

# Criação da tabela produtos

CREATE TABLE IF NOT EXISTS banco.produtos (
  id INT AUTO_INCREMENT PRIMARY KEY,
  nome VARCHAR(255) NOT NULL,
  descricao TEXT,
  preco DECIMAL(10, 2),
  usuario_id INT,
  imagem_1 VARCHAR(255),
  imagem_2 VARCHAR(255),
  imagem_3 VARCHAR(255),
  imagem_4 VARCHAR(255),
  FOREIGN KEY (usuario_id) REFERENCES banco.usuarios(idusuarios)
);


