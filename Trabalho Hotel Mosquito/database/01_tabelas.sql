-- =============================================================
-- Hotel do Mosquito — Script 01: Banco de Dados e Tabelas
-- =============================================================

CREATE DATABASE IF NOT EXISTS hotel_mosquito
  CHARACTER SET utf8mb4
  COLLATE utf8mb4_unicode_ci;

USE hotel_mosquito;

-- -------------------------------------------------------------
-- CATEGORIA_QUARTO
-- -------------------------------------------------------------
CREATE TABLE IF NOT EXISTS categoria_quarto (
    id          INT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
    nome        VARCHAR(60)  NOT NULL,
    descricao   TEXT
) ENGINE=InnoDB;

-- -------------------------------------------------------------
-- QUARTO
-- -------------------------------------------------------------
CREATE TABLE IF NOT EXISTS quarto (
    numero        SMALLINT UNSIGNED NOT NULL PRIMARY KEY,
    andar         TINYINT UNSIGNED  NOT NULL,
    capacidade    TINYINT UNSIGNED  NOT NULL DEFAULT 1,
    status        ENUM('disponivel','ocupado','manutencao','reservado') NOT NULL DEFAULT 'disponivel',
    preco_diaria  DECIMAL(10,2)     NOT NULL,
    id_categoria  INT UNSIGNED      NOT NULL,
    CONSTRAINT fk_quarto_categoria FOREIGN KEY (id_categoria)
        REFERENCES categoria_quarto(id) ON UPDATE CASCADE
) ENGINE=InnoDB;

-- -------------------------------------------------------------
-- HISTORICO_PRECO  (populado automaticamente pela trigger)
-- -------------------------------------------------------------
CREATE TABLE IF NOT EXISTS historico_preco (
    id               INT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
    numero_quarto    SMALLINT UNSIGNED NOT NULL,
    preco_anterior   DECIMAL(10,2)     NOT NULL,
    preco_novo       DECIMAL(10,2)     NOT NULL,
    data_alteracao   DATETIME          NOT NULL DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT fk_hist_quarto FOREIGN KEY (numero_quarto)
        REFERENCES quarto(numero) ON UPDATE CASCADE
) ENGINE=InnoDB;

-- -------------------------------------------------------------
-- CLIENTE
-- -------------------------------------------------------------
CREATE TABLE IF NOT EXISTS cliente (
    id        INT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
    nome      VARCHAR(120) NOT NULL,
    cpf       CHAR(11)     NOT NULL UNIQUE,
    email     VARCHAR(120)          UNIQUE,
    telefone  VARCHAR(20),
    endereco  VARCHAR(255)
) ENGINE=InnoDB;

-- -------------------------------------------------------------
-- FUNCIONARIO
-- -------------------------------------------------------------
CREATE TABLE IF NOT EXISTS funcionario (
    id          INT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
    nome        VARCHAR(120) NOT NULL,
    cpf         CHAR(11)     NOT NULL UNIQUE,
    cargo       VARCHAR(60),
    login       VARCHAR(60)  NOT NULL UNIQUE,
    senha_hash  VARCHAR(255) NOT NULL,
    perfil      ENUM('gerente','recepcionista') NOT NULL DEFAULT 'recepcionista',
    ativo       TINYINT(1)   NOT NULL DEFAULT 1
) ENGINE=InnoDB;

-- -------------------------------------------------------------
-- RESERVA
-- -------------------------------------------------------------
CREATE TABLE IF NOT EXISTS reserva (
    id                    INT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
    id_cliente            INT UNSIGNED      NOT NULL,
    numero_quarto         SMALLINT UNSIGNED NOT NULL,
    data_checkin_prev     DATE              NOT NULL,
    data_checkout_prev    DATE              NOT NULL,
    status                ENUM('pendente','confirmada','checkin_realizado','cancelada','concluida') NOT NULL DEFAULT 'pendente',
    id_funcionario        INT UNSIGNED      NOT NULL,
    data_criacao          DATETIME          NOT NULL DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT fk_reserva_cliente    FOREIGN KEY (id_cliente)    REFERENCES cliente(id)    ON UPDATE CASCADE,
    CONSTRAINT fk_reserva_quarto     FOREIGN KEY (numero_quarto) REFERENCES quarto(numero) ON UPDATE CASCADE,
    CONSTRAINT fk_reserva_funcionario FOREIGN KEY (id_funcionario) REFERENCES funcionario(id) ON UPDATE CASCADE,
    CONSTRAINT chk_datas_reserva CHECK (data_checkout_prev > data_checkin_prev)
) ENGINE=InnoDB;

-- -------------------------------------------------------------
-- HOSPEDAGEM
-- -------------------------------------------------------------
CREATE TABLE IF NOT EXISTS hospedagem (
    id                       INT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
    id_reserva               INT UNSIGNED      NOT NULL UNIQUE,
    data_checkin_real        DATETIME          NOT NULL DEFAULT CURRENT_TIMESTAMP,
    data_checkout_real       DATETIME,
    valor_total_diarias      DECIMAL(10,2)     NOT NULL DEFAULT 0.00,
    valor_total_consumos     DECIMAL(10,2)     NOT NULL DEFAULT 0.00,
    valor_total_final        DECIMAL(10,2)     NOT NULL DEFAULT 0.00,
    status                   ENUM('ativa','finalizada') NOT NULL DEFAULT 'ativa',
    id_funcionario_checkin   INT UNSIGNED      NOT NULL,
    CONSTRAINT fk_hosp_reserva    FOREIGN KEY (id_reserva)             REFERENCES reserva(id)     ON UPDATE CASCADE,
    CONSTRAINT fk_hosp_funcionario FOREIGN KEY (id_funcionario_checkin) REFERENCES funcionario(id) ON UPDATE CASCADE
) ENGINE=InnoDB;

-- -------------------------------------------------------------
-- PRODUTO_SERVICO
-- -------------------------------------------------------------
CREATE TABLE IF NOT EXISTS produto_servico (
    id           INT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
    nome         VARCHAR(120) NOT NULL,
    preco_venda  DECIMAL(10,2) NOT NULL,
    tipo         ENUM('produto','servico') NOT NULL DEFAULT 'produto',
    ativo        TINYINT(1)   NOT NULL DEFAULT 1
) ENGINE=InnoDB;

-- -------------------------------------------------------------
-- CONSUMO
-- -------------------------------------------------------------
CREATE TABLE IF NOT EXISTS consumo (
    id                  INT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
    id_hospedagem       INT UNSIGNED      NOT NULL,
    id_produto_servico  INT UNSIGNED      NOT NULL,
    quantidade          SMALLINT UNSIGNED NOT NULL DEFAULT 1,
    preco_unitario      DECIMAL(10,2)     NOT NULL,
    data_hora           DATETIME          NOT NULL DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT fk_consumo_hospedagem FOREIGN KEY (id_hospedagem)      REFERENCES hospedagem(id)      ON UPDATE CASCADE,
    CONSTRAINT fk_consumo_produto    FOREIGN KEY (id_produto_servico) REFERENCES produto_servico(id) ON UPDATE CASCADE,
    CONSTRAINT chk_quantidade CHECK (quantidade > 0)
) ENGINE=InnoDB;
