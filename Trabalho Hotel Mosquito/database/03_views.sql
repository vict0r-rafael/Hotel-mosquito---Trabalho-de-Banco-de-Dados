-- =============================================================
-- Hotel do Mosquito — Script 03: Views
-- =============================================================

USE hotel_mosquito;

-- -------------------------------------------------------------
-- vw_clientes
-- Listagem completa de clientes
-- -------------------------------------------------------------
CREATE OR REPLACE VIEW vw_clientes AS
SELECT
    id,
    nome,
    cpf,
    email,
    telefone,
    endereco
FROM cliente;

-- -------------------------------------------------------------
-- vw_quartos
-- Listagem completa de quartos com categoria
-- -------------------------------------------------------------
CREATE OR REPLACE VIEW vw_quartos AS
SELECT
    q.numero,
    q.andar,
    q.capacidade,
    q.status,
    q.preco_diaria,
    cq.nome   AS categoria,
    cq.descricao AS descricao_categoria
FROM quarto q
JOIN categoria_quarto cq ON cq.id = q.id_categoria;

-- -------------------------------------------------------------
-- vw_quartos_disponiveis
-- Apenas quartos com status 'disponivel'
-- -------------------------------------------------------------
CREATE OR REPLACE VIEW vw_quartos_disponiveis AS
SELECT
    q.numero,
    q.andar,
    q.capacidade,
    q.preco_diaria,
    cq.nome AS categoria
FROM quarto q
JOIN categoria_quarto cq ON cq.id = q.id_categoria
WHERE q.status = 'disponivel';

-- -------------------------------------------------------------
-- vw_ocupacao_atual
-- Hospedagens ativas com dados do quarto e cliente
-- -------------------------------------------------------------
CREATE OR REPLACE VIEW vw_ocupacao_atual AS
SELECT
    h.id                    AS id_hospedagem,
    q.numero                AS numero_quarto,
    cq.nome                 AS categoria_quarto,
    c.nome                  AS nome_cliente,
    c.cpf                   AS cpf_cliente,
    r.data_checkin_prev,
    r.data_checkout_prev,
    h.data_checkin_real,
    h.valor_total_diarias,
    h.valor_total_consumos,
    h.valor_total_final
FROM hospedagem h
JOIN reserva r         ON r.id           = h.id_reserva
JOIN cliente c         ON c.id           = r.id_cliente
JOIN quarto q          ON q.numero       = r.numero_quarto
JOIN categoria_quarto cq ON cq.id        = q.id_categoria
WHERE h.status = 'ativa';

-- -------------------------------------------------------------
-- vw_reservas
-- Todas as reservas com dados de cliente e quarto
-- -------------------------------------------------------------
CREATE OR REPLACE VIEW vw_reservas AS
SELECT
    r.id,
    r.status,
    r.data_checkin_prev,
    r.data_checkout_prev,
    r.data_criacao,
    c.nome          AS nome_cliente,
    c.cpf           AS cpf_cliente,
    c.telefone      AS telefone_cliente,
    q.numero        AS numero_quarto,
    cq.nome         AS categoria_quarto,
    q.preco_diaria,
    f.nome          AS nome_funcionario
FROM reserva r
JOIN cliente c         ON c.id     = r.id_cliente
JOIN quarto q          ON q.numero = r.numero_quarto
JOIN categoria_quarto cq ON cq.id  = q.id_categoria
JOIN funcionario f     ON f.id     = r.id_funcionario;

-- -------------------------------------------------------------
-- vw_historico_reservas_clientes
-- Histórico completo de reservas por cliente
-- -------------------------------------------------------------
CREATE OR REPLACE VIEW vw_historico_reservas_clientes AS
SELECT
    c.id            AS id_cliente,
    c.nome          AS nome_cliente,
    c.cpf,
    r.id            AS id_reserva,
    r.status        AS status_reserva,
    r.data_checkin_prev,
    r.data_checkout_prev,
    q.numero        AS numero_quarto,
    cq.nome         AS categoria_quarto,
    h.data_checkin_real,
    h.data_checkout_real,
    h.valor_total_final
FROM cliente c
JOIN reserva r         ON r.id_cliente   = c.id
JOIN quarto q          ON q.numero       = r.numero_quarto
JOIN categoria_quarto cq ON cq.id        = q.id_categoria
LEFT JOIN hospedagem h ON h.id_reserva   = r.id;

-- -------------------------------------------------------------
-- vw_consumos_hospedagem
-- Consumos detalhados por hospedagem
-- -------------------------------------------------------------
CREATE OR REPLACE VIEW vw_consumos_hospedagem AS
SELECT
    co.id               AS id_consumo,
    h.id                AS id_hospedagem,
    c.nome              AS nome_cliente,
    q.numero            AS numero_quarto,
    ps.nome             AS produto_servico,
    ps.tipo,
    co.quantidade,
    co.preco_unitario,
    (co.quantidade * co.preco_unitario) AS subtotal,
    co.data_hora
FROM consumo co
JOIN hospedagem h  ON h.id                = co.id_hospedagem
JOIN reserva r     ON r.id                = h.id_reserva
JOIN cliente c     ON c.id                = r.id_cliente
JOIN quarto q      ON q.numero            = r.numero_quarto
JOIN produto_servico ps ON ps.id          = co.id_produto_servico;

-- -------------------------------------------------------------
-- vw_produtos_servicos
-- Listagem de produtos e serviços ativos
-- -------------------------------------------------------------
CREATE OR REPLACE VIEW vw_produtos_servicos AS
SELECT
    id,
    nome,
    tipo,
    preco_venda,
    ativo
FROM produto_servico;

-- -------------------------------------------------------------
-- vw_funcionarios
-- Listagem de funcionários sem expor senha_hash
-- -------------------------------------------------------------
CREATE OR REPLACE VIEW vw_funcionarios AS
SELECT
    id,
    nome,
    cpf,
    cargo,
    login,
    perfil,
    ativo
FROM funcionario;

-- -------------------------------------------------------------
-- vw_faturamento_mensal
-- Faturamento agregado por mês/ano (apenas hospedagens finalizadas)
-- -------------------------------------------------------------
CREATE OR REPLACE VIEW vw_faturamento_mensal AS
SELECT
    YEAR(h.data_checkout_real)                    AS ano,
    MONTH(h.data_checkout_real)                   AS mes,
    COUNT(h.id)                                   AS total_hospedagens,
    SUM(h.valor_total_diarias)                    AS total_diarias,
    SUM(h.valor_total_consumos)                   AS total_consumos,
    SUM(h.valor_total_final)                      AS faturamento_total
FROM hospedagem h
WHERE h.status = 'finalizada'
  AND h.data_checkout_real IS NOT NULL
GROUP BY YEAR(h.data_checkout_real), MONTH(h.data_checkout_real);

-- -------------------------------------------------------------
-- vw_taxa_ocupacao_mensal
-- Taxa de ocupação mensal: check-ins realizados vs total de quartos
-- -------------------------------------------------------------
CREATE OR REPLACE VIEW vw_taxa_ocupacao_mensal AS
SELECT
    YEAR(h.data_checkin_real)                         AS ano,
    MONTH(h.data_checkin_real)                        AS mes,
    COUNT(DISTINCT h.id)                              AS total_hospedagens,
    (SELECT COUNT(*) FROM quarto)                     AS total_quartos,
    ROUND(
        COUNT(DISTINCT h.id) * 100.0 /
        NULLIF((SELECT COUNT(*) FROM quarto), 0),
    2)                                                AS taxa_ocupacao_pct
FROM hospedagem h
GROUP BY YEAR(h.data_checkin_real), MONTH(h.data_checkin_real);

-- -------------------------------------------------------------
-- vw_top10_quartos
-- 10 quartos mais hospedados (hospedagens finalizadas)
-- -------------------------------------------------------------
CREATE OR REPLACE VIEW vw_top10_quartos AS
SELECT
    q.numero,
    cq.nome         AS categoria,
    q.preco_diaria,
    COUNT(h.id)     AS total_hospedagens,
    SUM(h.valor_total_diarias) AS receita_diarias
FROM quarto q
JOIN categoria_quarto cq ON cq.id = q.id_categoria
JOIN reserva r   ON r.numero_quarto = q.numero
JOIN hospedagem h ON h.id_reserva   = r.id
WHERE h.status = 'finalizada'
GROUP BY q.numero, cq.nome, q.preco_diaria
ORDER BY total_hospedagens DESC
LIMIT 10;

-- -------------------------------------------------------------
-- vw_top10_clientes
-- 10 clientes com maior gasto total (hospedagens finalizadas)
-- -------------------------------------------------------------
CREATE OR REPLACE VIEW vw_top10_clientes AS
SELECT
    c.id,
    c.nome,
    c.cpf,
    c.email,
    COUNT(h.id)          AS total_hospedagens,
    SUM(h.valor_total_final) AS gasto_total
FROM cliente c
JOIN reserva r   ON r.id_cliente  = c.id
JOIN hospedagem h ON h.id_reserva = r.id
WHERE h.status = 'finalizada'
GROUP BY c.id, c.nome, c.cpf, c.email
ORDER BY gasto_total DESC
LIMIT 10;
