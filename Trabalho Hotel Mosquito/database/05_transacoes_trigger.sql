-- =============================================================
-- Hotel do Mosquito — Script 05: Transações + Trigger
-- =============================================================

USE hotel_mosquito;

DELIMITER $$

-- =============================================================
-- TRIGGER
-- Registra automaticamente qualquer alteração no preço da diária.
-- =============================================================

DROP TRIGGER IF EXISTS trg_atualiza_preco_quarto $$
CREATE TRIGGER trg_atualiza_preco_quarto
    AFTER UPDATE ON quarto
    FOR EACH ROW
BEGIN
    IF NEW.preco_diaria <> OLD.preco_diaria THEN
        INSERT INTO historico_preco (numero_quarto, preco_anterior, preco_novo, data_alteracao)
        VALUES (OLD.numero, OLD.preco_diaria, NEW.preco_diaria, NOW());
    END IF;
END $$

-- =============================================================
-- sp_AtualizarPrecoQuarto
-- Única forma de alterar o preço — aciona trg_atualiza_preco_quarto.
-- =============================================================

DROP PROCEDURE IF EXISTS sp_AtualizarPrecoQuarto $$
CREATE PROCEDURE sp_AtualizarPrecoQuarto(
    IN p_numero       SMALLINT UNSIGNED,
    IN p_preco_diaria DECIMAL(10,2)
)
BEGIN
    IF p_preco_diaria <= 0 THEN
        SIGNAL SQLSTATE '45000'
            SET MESSAGE_TEXT = 'Preço da diária deve ser maior que zero.';
    END IF;

    UPDATE quarto
    SET preco_diaria = p_preco_diaria
    WHERE numero = p_numero;

    IF ROW_COUNT() = 0 THEN
        SIGNAL SQLSTATE '45000'
            SET MESSAGE_TEXT = 'Quarto não encontrado.';
    END IF;

    SELECT ROW_COUNT() AS linhas_afetadas;
END $$

-- =============================================================
-- sp_RealizarCheckIn
-- Abre a hospedagem a partir de uma reserva confirmada.
-- Atualiza reserva → 'checkin_realizado' e quarto → 'ocupado'.
-- Toda a operação é atômica (BEGIN / COMMIT / ROLLBACK).
-- =============================================================

DROP PROCEDURE IF EXISTS sp_RealizarCheckIn $$
CREATE PROCEDURE sp_RealizarCheckIn(
    IN p_id_reserva     INT UNSIGNED,
    IN p_id_funcionario INT UNSIGNED
)
BEGIN
    DECLARE v_numero_quarto   SMALLINT UNSIGNED;
    DECLARE v_status_reserva  VARCHAR(30);
    DECLARE v_preco_diaria    DECIMAL(10,2);
    DECLARE v_id_hospedagem   INT UNSIGNED;

    DECLARE EXIT HANDLER FOR SQLEXCEPTION
    BEGIN
        ROLLBACK;
        RESIGNAL;
    END;

    START TRANSACTION;

    -- Bloqueia a reserva para evitar check-in duplo simultâneo
    SELECT r.numero_quarto, r.status, q.preco_diaria
    INTO   v_numero_quarto, v_status_reserva, v_preco_diaria
    FROM   reserva r
    JOIN   quarto  q ON q.numero = r.numero_quarto
    WHERE  r.id = p_id_reserva
    FOR UPDATE;

    IF v_numero_quarto IS NULL THEN
        SIGNAL SQLSTATE '45000'
            SET MESSAGE_TEXT = 'Reserva não encontrada.';
    END IF;

    IF v_status_reserva NOT IN ('pendente', 'confirmada') THEN
        SIGNAL SQLSTATE '45000'
            SET MESSAGE_TEXT = 'Reserva não está em situação válida para check-in.';
    END IF;

    -- Cria a hospedagem
    INSERT INTO hospedagem (
        id_reserva,
        data_checkin_real,
        valor_total_diarias,
        valor_total_consumos,
        valor_total_final,
        status,
        id_funcionario_checkin
    )
    VALUES (
        p_id_reserva,
        NOW(),
        0.00,   -- calculado no checkout
        0.00,
        0.00,
        'aberta',
        p_id_funcionario
    );

    SET v_id_hospedagem = LAST_INSERT_ID();

    -- Atualiza status da reserva
    UPDATE reserva
    SET status = 'checkin_realizado'
    WHERE id = p_id_reserva;

    -- Marca quarto como ocupado
    UPDATE quarto
    SET status = 'ocupado'
    WHERE numero = v_numero_quarto;

    COMMIT;

    SELECT v_id_hospedagem AS id_hospedagem;
END $$

-- =============================================================
-- sp_RealizarCheckOut
-- Fecha a hospedagem: calcula diárias, consolida totais e
-- libera o quarto.
-- Recepcionista recebe valor mascarado (sem detalhamento de lucro).
-- Gerente recebe todos os campos.
-- =============================================================

DROP PROCEDURE IF EXISTS sp_RealizarCheckOut $$
CREATE PROCEDURE sp_RealizarCheckOut(
    IN p_id_hospedagem  INT UNSIGNED,
    IN p_id_funcionario INT UNSIGNED
)
BEGIN
    DECLARE v_checkin_real      DATETIME;
    DECLARE v_status_hosp       VARCHAR(20);
    DECLARE v_numero_quarto     SMALLINT UNSIGNED;
    DECLARE v_preco_diaria      DECIMAL(10,2);
    DECLARE v_dias              INT;
    DECLARE v_total_diarias     DECIMAL(10,2);
    DECLARE v_total_consumos    DECIMAL(10,2);
    DECLARE v_total_final       DECIMAL(10,2);
    DECLARE v_perfil_func       ENUM('gerente','recepcionista');

    DECLARE EXIT HANDLER FOR SQLEXCEPTION
    BEGIN
        ROLLBACK;
        RESIGNAL;
    END;

    START TRANSACTION;

    -- Bloqueia hospedagem
    SELECT h.data_checkin_real,
           h.status,
           h.valor_total_consumos,
           r.numero_quarto
    INTO   v_checkin_real,
           v_status_hosp,
           v_total_consumos,
           v_numero_quarto
    FROM   hospedagem h
    JOIN   reserva    r ON r.id = h.id_reserva
    WHERE  h.id = p_id_hospedagem
    FOR UPDATE;

    IF v_numero_quarto IS NULL THEN
        SIGNAL SQLSTATE '45000'
            SET MESSAGE_TEXT = 'Hospedagem não encontrada.';
    END IF;

    IF v_status_hosp <> 'aberta' THEN
        SIGNAL SQLSTATE '45000'
            SET MESSAGE_TEXT = 'Hospedagem já foi encerrada.';
    END IF;

    -- Busca preço atual do quarto
    SELECT preco_diaria INTO v_preco_diaria
    FROM quarto WHERE numero = v_numero_quarto;

    -- Calcula número de diárias (mínimo 1)
    SET v_dias = GREATEST(DATEDIFF(NOW(), v_checkin_real), 1);
    SET v_total_diarias = v_dias * v_preco_diaria;
    SET v_total_final   = v_total_diarias + v_total_consumos;

    -- Fecha a hospedagem
    UPDATE hospedagem
    SET data_checkout_real    = NOW(),
        valor_total_diarias   = v_total_diarias,
        valor_total_final     = v_total_final,
        status                = 'fechada'
    WHERE id = p_id_hospedagem;

    -- Marca reserva como concluída
    UPDATE reserva
    SET status = 'concluida'
    WHERE id = (SELECT id_reserva FROM hospedagem WHERE id = p_id_hospedagem);

    -- Libera o quarto
    UPDATE quarto
    SET status = 'disponivel'
    WHERE numero = v_numero_quarto;

    COMMIT;

    -- Retorno condicional por perfil
    SELECT perfil INTO v_perfil_func
    FROM funcionario WHERE id = p_id_funcionario;

    IF v_perfil_func = 'gerente' THEN
        SELECT
            p_id_hospedagem   AS id_hospedagem,
            v_dias            AS dias_hospedado,
            v_preco_diaria    AS preco_diaria,
            v_total_diarias   AS total_diarias,
            v_total_consumos  AS total_consumos,
            v_total_final     AS total_final;
    ELSE
        -- Recepcionista vê apenas o total a cobrar
        SELECT
            p_id_hospedagem   AS id_hospedagem,
            v_total_final     AS total_a_cobrar;
    END IF;
END $$

DELIMITER ;
