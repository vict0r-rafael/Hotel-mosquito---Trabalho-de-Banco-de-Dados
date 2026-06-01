-- =============================================================
-- Hotel do Mosquito — Script 04: Stored Procedures de CRUD
-- =============================================================

USE hotel_mosquito;

DELIMITER $$

-- =============================================================
-- AUTH
-- =============================================================

-- sp_Login
-- Retorna dados do funcionário (sem senha_hash) + perfil.
-- A verificação do bcrypt é feita na aplicação; aqui só buscamos
-- pelo login para que o backend compare o hash.
DROP PROCEDURE IF EXISTS sp_Login $$
CREATE PROCEDURE sp_Login(IN p_login VARCHAR(60))
BEGIN
    SELECT id, nome, cpf, cargo, login, senha_hash, perfil, ativo
    FROM funcionario
    WHERE login = p_login
      AND ativo = 1;
END $$

-- =============================================================
-- CLIENTES
-- =============================================================

DROP PROCEDURE IF EXISTS sp_CriarCliente $$
CREATE PROCEDURE sp_CriarCliente(
    IN p_nome     VARCHAR(120),
    IN p_cpf      CHAR(11),
    IN p_email    VARCHAR(120),
    IN p_telefone VARCHAR(20),
    IN p_endereco VARCHAR(255)
)
BEGIN
    INSERT INTO cliente (nome, cpf, email, telefone, endereco)
    VALUES (p_nome, p_cpf, p_email, p_telefone, p_endereco);

    SELECT LAST_INSERT_ID() AS id;
END $$

DROP PROCEDURE IF EXISTS sp_BuscarCliente $$
CREATE PROCEDURE sp_BuscarCliente(IN p_id INT UNSIGNED)
BEGIN
    IF p_id IS NULL THEN
        SELECT * FROM vw_clientes ORDER BY nome;
    ELSE
        SELECT * FROM vw_clientes WHERE id = p_id;
    END IF;
END $$

DROP PROCEDURE IF EXISTS sp_AtualizarCliente $$
CREATE PROCEDURE sp_AtualizarCliente(
    IN p_id       INT UNSIGNED,
    IN p_nome     VARCHAR(120),
    IN p_cpf      CHAR(11),
    IN p_email    VARCHAR(120),
    IN p_telefone VARCHAR(20),
    IN p_endereco VARCHAR(255)
)
BEGIN
    UPDATE cliente
    SET nome     = COALESCE(p_nome,     nome),
        cpf      = COALESCE(p_cpf,      cpf),
        email    = COALESCE(p_email,    email),
        telefone = COALESCE(p_telefone, telefone),
        endereco = COALESCE(p_endereco, endereco)
    WHERE id = p_id;

    SELECT ROW_COUNT() AS linhas_afetadas;
END $$

DROP PROCEDURE IF EXISTS sp_DeletarCliente $$
CREATE PROCEDURE sp_DeletarCliente(IN p_id INT UNSIGNED)
BEGIN
    DELETE FROM cliente WHERE id = p_id;
    SELECT ROW_COUNT() AS linhas_afetadas;
END $$

-- =============================================================
-- QUARTOS
-- =============================================================

DROP PROCEDURE IF EXISTS sp_CriarQuarto $$
CREATE PROCEDURE sp_CriarQuarto(
    IN p_numero       SMALLINT UNSIGNED,
    IN p_andar        TINYINT UNSIGNED,
    IN p_capacidade   TINYINT UNSIGNED,
    IN p_status       ENUM('disponivel','ocupado','manutencao','reservado'),
    IN p_preco_diaria DECIMAL(10,2),
    IN p_id_categoria INT UNSIGNED
)
BEGIN
    INSERT INTO quarto (numero, andar, capacidade, status, preco_diaria, id_categoria)
    VALUES (p_numero, p_andar, p_capacidade, p_status, p_preco_diaria, p_id_categoria);

    SELECT p_numero AS numero;
END $$

DROP PROCEDURE IF EXISTS sp_BuscarQuarto $$
CREATE PROCEDURE sp_BuscarQuarto(IN p_numero SMALLINT UNSIGNED)
BEGIN
    IF p_numero IS NULL THEN
        SELECT * FROM vw_quartos ORDER BY numero;
    ELSE
        SELECT * FROM vw_quartos WHERE numero = p_numero;
    END IF;
END $$

DROP PROCEDURE IF EXISTS sp_AtualizarQuarto $$
CREATE PROCEDURE sp_AtualizarQuarto(
    IN p_numero       SMALLINT UNSIGNED,
    IN p_andar        TINYINT UNSIGNED,
    IN p_capacidade   TINYINT UNSIGNED,
    IN p_status       ENUM('disponivel','ocupado','manutencao','reservado'),
    IN p_preco_diaria DECIMAL(10,2),
    IN p_id_categoria INT UNSIGNED
)
BEGIN
    UPDATE quarto
    SET andar        = COALESCE(p_andar,        andar),
        capacidade   = COALESCE(p_capacidade,   capacidade),
        status       = COALESCE(p_status,       status),
        preco_diaria = COALESCE(p_preco_diaria, preco_diaria),
        id_categoria = COALESCE(p_id_categoria, id_categoria)
    WHERE numero = p_numero;

    SELECT ROW_COUNT() AS linhas_afetadas;
END $$

DROP PROCEDURE IF EXISTS sp_DeletarQuarto $$
CREATE PROCEDURE sp_DeletarQuarto(IN p_numero SMALLINT UNSIGNED)
BEGIN
    DELETE FROM quarto WHERE numero = p_numero;
    SELECT ROW_COUNT() AS linhas_afetadas;
END $$

-- =============================================================
-- FUNCIONÁRIOS
-- =============================================================

DROP PROCEDURE IF EXISTS sp_CriarFuncionario $$
CREATE PROCEDURE sp_CriarFuncionario(
    IN p_nome       VARCHAR(120),
    IN p_cpf        CHAR(11),
    IN p_cargo      VARCHAR(60),
    IN p_login      VARCHAR(60),
    IN p_senha_hash VARCHAR(255),
    IN p_perfil     ENUM('gerente','recepcionista')
)
BEGIN
    INSERT INTO funcionario (nome, cpf, cargo, login, senha_hash, perfil)
    VALUES (p_nome, p_cpf, p_cargo, p_login, p_senha_hash, p_perfil);

    SELECT LAST_INSERT_ID() AS id;
END $$

DROP PROCEDURE IF EXISTS sp_BuscarFuncionario $$
CREATE PROCEDURE sp_BuscarFuncionario(IN p_id INT UNSIGNED)
BEGIN
    IF p_id IS NULL THEN
        SELECT * FROM vw_funcionarios ORDER BY nome;
    ELSE
        SELECT * FROM vw_funcionarios WHERE id = p_id;
    END IF;
END $$

DROP PROCEDURE IF EXISTS sp_AtualizarFuncionario $$
CREATE PROCEDURE sp_AtualizarFuncionario(
    IN p_id         INT UNSIGNED,
    IN p_nome       VARCHAR(120),
    IN p_cpf        CHAR(11),
    IN p_cargo      VARCHAR(60),
    IN p_login      VARCHAR(60),
    IN p_senha_hash VARCHAR(255),
    IN p_perfil     ENUM('gerente','recepcionista'),
    IN p_ativo      TINYINT(1)
)
BEGIN
    UPDATE funcionario
    SET nome       = COALESCE(p_nome,       nome),
        cpf        = COALESCE(p_cpf,        cpf),
        cargo      = COALESCE(p_cargo,      cargo),
        login      = COALESCE(p_login,      login),
        senha_hash = COALESCE(p_senha_hash, senha_hash),
        perfil     = COALESCE(p_perfil,     perfil),
        ativo      = COALESCE(p_ativo,      ativo)
    WHERE id = p_id;

    SELECT ROW_COUNT() AS linhas_afetadas;
END $$

DROP PROCEDURE IF EXISTS sp_DeletarFuncionario $$
CREATE PROCEDURE sp_DeletarFuncionario(IN p_id INT UNSIGNED)
BEGIN
    -- Soft-delete: desativa em vez de remover, preservando histórico
    UPDATE funcionario SET ativo = 0 WHERE id = p_id;
    SELECT ROW_COUNT() AS linhas_afetadas;
END $$

-- =============================================================
-- RESERVAS
-- =============================================================

DROP PROCEDURE IF EXISTS sp_CriarReserva $$
CREATE PROCEDURE sp_CriarReserva(
    IN p_id_cliente         INT UNSIGNED,
    IN p_numero_quarto      SMALLINT UNSIGNED,
    IN p_data_checkin_prev  DATE,
    IN p_data_checkout_prev DATE,
    IN p_id_funcionario     INT UNSIGNED
)
BEGIN
    -- Verifica conflito de datas para o mesmo quarto
    IF EXISTS (
        SELECT 1 FROM reserva
        WHERE numero_quarto = p_numero_quarto
          AND status NOT IN ('cancelada', 'concluida')
          AND p_data_checkin_prev  < data_checkout_prev
          AND p_data_checkout_prev > data_checkin_prev
    ) THEN
        SIGNAL SQLSTATE '45000'
            SET MESSAGE_TEXT = 'Quarto indisponível para o período solicitado.';
    END IF;

    INSERT INTO reserva (id_cliente, numero_quarto, data_checkin_prev, data_checkout_prev, id_funcionario)
    VALUES (p_id_cliente, p_numero_quarto, p_data_checkin_prev, p_data_checkout_prev, p_id_funcionario);

    -- Marca quarto como reservado
    UPDATE quarto SET status = 'reservado' WHERE numero = p_numero_quarto;

    SELECT LAST_INSERT_ID() AS id;
END $$

DROP PROCEDURE IF EXISTS sp_BuscarReserva $$
CREATE PROCEDURE sp_BuscarReserva(IN p_id INT UNSIGNED)
BEGIN
    IF p_id IS NULL THEN
        SELECT * FROM vw_reservas ORDER BY data_checkin_prev DESC;
    ELSE
        SELECT * FROM vw_reservas WHERE id = p_id;
    END IF;
END $$

DROP PROCEDURE IF EXISTS sp_AtualizarReserva $$
CREATE PROCEDURE sp_AtualizarReserva(
    IN p_id                 INT UNSIGNED,
    IN p_data_checkin_prev  DATE,
    IN p_data_checkout_prev DATE,
    IN p_status             ENUM('pendente','confirmada','checkin_realizado','cancelada','concluida')
)
BEGIN
    UPDATE reserva
    SET data_checkin_prev  = COALESCE(p_data_checkin_prev,  data_checkin_prev),
        data_checkout_prev = COALESCE(p_data_checkout_prev, data_checkout_prev),
        status             = COALESCE(p_status,             status)
    WHERE id = p_id;

    SELECT ROW_COUNT() AS linhas_afetadas;
END $$

DROP PROCEDURE IF EXISTS sp_DeletarReserva $$
CREATE PROCEDURE sp_DeletarReserva(IN p_id INT UNSIGNED)
BEGIN
    DECLARE v_quarto SMALLINT UNSIGNED;

    SELECT numero_quarto INTO v_quarto
    FROM reserva WHERE id = p_id;

    -- Cancela a reserva
    UPDATE reserva SET status = 'cancelada' WHERE id = p_id;

    -- Libera o quarto somente se não há outra reserva ativa
    IF NOT EXISTS (
        SELECT 1 FROM reserva
        WHERE numero_quarto = v_quarto
          AND status NOT IN ('cancelada', 'concluida')
          AND id <> p_id
    ) THEN
        UPDATE quarto SET status = 'disponivel' WHERE numero = v_quarto;
    END IF;

    SELECT ROW_COUNT() AS linhas_afetadas;
END $$

-- =============================================================
-- PRODUTOS / SERVIÇOS
-- =============================================================

DROP PROCEDURE IF EXISTS sp_CriarProdutoServico $$
CREATE PROCEDURE sp_CriarProdutoServico(
    IN p_nome        VARCHAR(120),
    IN p_preco_venda DECIMAL(10,2),
    IN p_tipo        ENUM('produto','servico')
)
BEGIN
    INSERT INTO produto_servico (nome, preco_venda, tipo)
    VALUES (p_nome, p_preco_venda, p_tipo);

    SELECT LAST_INSERT_ID() AS id;
END $$

DROP PROCEDURE IF EXISTS sp_BuscarProdutoServico $$
CREATE PROCEDURE sp_BuscarProdutoServico(IN p_id INT UNSIGNED)
BEGIN
    IF p_id IS NULL THEN
        SELECT * FROM vw_produtos_servicos ORDER BY nome;
    ELSE
        SELECT * FROM vw_produtos_servicos WHERE id = p_id;
    END IF;
END $$

DROP PROCEDURE IF EXISTS sp_AtualizarProdutoServico $$
CREATE PROCEDURE sp_AtualizarProdutoServico(
    IN p_id          INT UNSIGNED,
    IN p_nome        VARCHAR(120),
    IN p_preco_venda DECIMAL(10,2),
    IN p_tipo        ENUM('produto','servico'),
    IN p_ativo       TINYINT(1)
)
BEGIN
    UPDATE produto_servico
    SET nome        = COALESCE(p_nome,        nome),
        preco_venda = COALESCE(p_preco_venda, preco_venda),
        tipo        = COALESCE(p_tipo,        tipo),
        ativo       = COALESCE(p_ativo,       ativo)
    WHERE id = p_id;

    SELECT ROW_COUNT() AS linhas_afetadas;
END $$

DROP PROCEDURE IF EXISTS sp_DeletarProdutoServico $$
CREATE PROCEDURE sp_DeletarProdutoServico(IN p_id INT UNSIGNED)
BEGIN
    -- Soft-delete: desativa em vez de remover
    UPDATE produto_servico SET ativo = 0 WHERE id = p_id;
    SELECT ROW_COUNT() AS linhas_afetadas;
END $$

-- =============================================================
-- CONSUMOS
-- =============================================================

DROP PROCEDURE IF EXISTS sp_RegistrarConsumo $$
CREATE PROCEDURE sp_RegistrarConsumo(
    IN p_id_hospedagem      INT UNSIGNED,
    IN p_id_produto_servico INT UNSIGNED,
    IN p_quantidade         SMALLINT UNSIGNED
)
BEGIN
    DECLARE v_preco DECIMAL(10,2);

    SELECT preco_venda INTO v_preco
    FROM produto_servico
    WHERE id = p_id_produto_servico AND ativo = 1;

    IF v_preco IS NULL THEN
        SIGNAL SQLSTATE '45000'
            SET MESSAGE_TEXT = 'Produto/serviço não encontrado ou inativo.';
    END IF;

    INSERT INTO consumo (id_hospedagem, id_produto_servico, quantidade, preco_unitario)
    VALUES (p_id_hospedagem, p_id_produto_servico, p_quantidade, v_preco);

    -- Atualiza total de consumos na hospedagem
    UPDATE hospedagem
    SET valor_total_consumos = valor_total_consumos + (v_preco * p_quantidade),
        valor_total_final    = valor_total_diarias  + valor_total_consumos + (v_preco * p_quantidade)
    WHERE id = p_id_hospedagem;

    SELECT LAST_INSERT_ID() AS id;
END $$

DROP PROCEDURE IF EXISTS sp_BuscarConsumos $$
CREATE PROCEDURE sp_BuscarConsumos(IN p_id_hospedagem INT UNSIGNED)
BEGIN
    SELECT * FROM vw_consumos_hospedagem
    WHERE id_hospedagem = p_id_hospedagem
    ORDER BY data_hora;
END $$

DELIMITER ;
