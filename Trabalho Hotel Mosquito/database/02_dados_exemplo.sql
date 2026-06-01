-- =============================================================
-- Hotel do Mosquito — Script 02: Dados de Exemplo
-- =============================================================

USE hotel_mosquito;

-- -------------------------------------------------------------
-- CATEGORIA_QUARTO
-- -------------------------------------------------------------
INSERT INTO categoria_quarto (nome, descricao) VALUES
    ('Standard',  'Quarto simples com cama de solteiro, TV e ar-condicionado.'),
    ('Duplo',     'Quarto com duas camas de solteiro, ideal para dois hóspedes.'),
    ('Casal',     'Quarto com cama de casal, TV smart e frigobar.'),
    ('Suite',     'Suite ampla com banheira, sala de estar e varanda privativa.'),
    ('Luxo',      'Quarto premium com vista para o jardim, hidromassagem e minibar.');

-- -------------------------------------------------------------
-- QUARTO
-- -------------------------------------------------------------
INSERT INTO quarto (numero, andar, capacidade, status, preco_diaria, id_categoria) VALUES
    (101, 1, 1, 'disponivel',  120.00, 1),
    (102, 1, 2, 'disponivel',  150.00, 2),
    (103, 1, 2, 'manutencao',  150.00, 2),
    (104, 1, 2, 'disponivel',  180.00, 3),
    (201, 2, 2, 'disponivel',  180.00, 3),
    (202, 2, 2, 'ocupado',     180.00, 3),
    (203, 2, 3, 'disponivel',  220.00, 4),
    (204, 2, 3, 'disponivel',  220.00, 4),
    (301, 3, 2, 'disponivel',  350.00, 5),
    (302, 3, 4, 'disponivel',  400.00, 5);

-- -------------------------------------------------------------
-- FUNCIONARIO
-- senhas em bcrypt do plain-text abaixo (hash gerado pela aplicação):
--   gerente      → "gerente123"
--   recepcao1    → "recepcao123"
--   recepcao2    → "recepcao456"
-- -------------------------------------------------------------
INSERT INTO funcionario (nome, cpf, cargo, login, senha_hash, perfil, ativo) VALUES
    ('Carlos Andrade',   '00000000001', 'Gerente Geral',  'gerente',   '$2b$10$KIxQrSr.FqCM6NrF2Bx/PuwSQoHvxUFSV7jMxM4H1i2I4s9rJa6W6', 'gerente',       1),
    ('Fernanda Lima',    '00000000002', 'Recepcionista',  'recepcao1', '$2b$10$I9cKcBe7Pv6JzKLjP6kV5OSmHGAg9gC3mHDlB7GqAQKS4i/2f.tR6', 'recepcionista', 1),
    ('Marcos Pereira',   '00000000003', 'Recepcionista',  'recepcao2', '$2b$10$7jDdMrE.FqCM6NrF2Bx/PuKIxQrSr8M4H1i2I4s9rJa6W6IxQrS', 'recepcionista', 1);

-- -------------------------------------------------------------
-- CLIENTE
-- -------------------------------------------------------------
INSERT INTO cliente (nome, cpf, email, telefone, endereco) VALUES
    ('Ana Souza',         '11111111111', 'ana.souza@email.com',       '(11) 91111-1111', 'Rua das Flores, 10 - São Paulo/SP'),
    ('Bruno Costa',       '22222222222', 'bruno.costa@email.com',     '(21) 92222-2222', 'Av. Atlântica, 200 - Rio de Janeiro/RJ'),
    ('Carla Mendes',      '33333333333', 'carla.mendes@email.com',    '(31) 93333-3333', 'Rua Ouro Preto, 55 - Belo Horizonte/MG'),
    ('Diego Ferreira',    '44444444444', 'diego.ferreira@email.com',  '(41) 94444-4444', 'Rua XV de Novembro, 300 - Curitiba/PR'),
    ('Elisa Ramos',       '55555555555', 'elisa.ramos@email.com',     '(51) 95555-5555', 'Av. Independência, 88 - Porto Alegre/RS'),
    ('Felipe Alves',      '66666666666', 'felipe.alves@email.com',    '(62) 96666-6666', 'Setor Central, 12 - Goiânia/GO'),
    ('Gabriela Nunes',    '77777777777', 'gabriela.nunes@email.com',  '(71) 97777-7777', 'Rua Chile, 45 - Salvador/BA'),
    ('Henrique Matos',    '88888888888', 'henrique.matos@email.com',  '(81) 98888-8888', 'Av. Boa Viagem, 999 - Recife/PE'),
    ('Isabela Rocha',     '99999999999', 'isabela.rocha@email.com',   '(85) 99999-9999', 'Rua Tibúrcio, 77 - Fortaleza/CE'),
    ('João Paulo Silva',  '12121212121', 'joao.silva@email.com',      '(92) 91212-1212', 'Av. Eduardo Ribeiro, 50 - Manaus/AM');

-- -------------------------------------------------------------
-- PRODUTO_SERVICO
-- -------------------------------------------------------------
INSERT INTO produto_servico (nome, preco_venda, tipo, ativo) VALUES
    ('Água mineral 500ml',    4.00,  'produto', 1),
    ('Refrigerante lata',     7.00,  'produto', 1),
    ('Cerveja long neck',    10.00,  'produto', 1),
    ('Sanduíche natural',    18.00,  'produto', 1),
    ('Prato feito',          35.00,  'produto', 1),
    ('Café da manhã',        25.00,  'servico', 1),
    ('Lavanderia (peça)',    15.00,  'servico', 1),
    ('Transfer aeroporto',   80.00,  'servico', 1),
    ('Massagem 60 min',     120.00,  'servico', 1),
    ('Aluguel de bicicleta', 30.00,  'servico', 1);

-- -------------------------------------------------------------
-- RESERVA (alguns exemplos variados de status)
-- -------------------------------------------------------------
INSERT INTO reserva (id_cliente, numero_quarto, data_checkin_prev, data_checkout_prev, status, id_funcionario, data_criacao) VALUES
    (1, 101, CURDATE() - INTERVAL 5 DAY, CURDATE() - INTERVAL 3 DAY, 'concluida',         2, NOW() - INTERVAL 7 DAY),
    (2, 202, CURDATE() - INTERVAL 2 DAY, CURDATE() + INTERVAL 1 DAY, 'checkin_realizado', 2, NOW() - INTERVAL 4 DAY),
    (3, 201, CURDATE() + INTERVAL 1 DAY, CURDATE() + INTERVAL 3 DAY, 'confirmada',        3, NOW() - INTERVAL 1 DAY),
    (4, 203, CURDATE() + INTERVAL 2 DAY, CURDATE() + INTERVAL 5 DAY, 'pendente',          2, NOW()),
    (5, 301, CURDATE() - INTERVAL 1 DAY, CURDATE() + INTERVAL 2 DAY, 'checkin_realizado', 3, NOW() - INTERVAL 2 DAY),
    (6, 104, CURDATE() + INTERVAL 3 DAY, CURDATE() + INTERVAL 6 DAY, 'confirmada',        2, NOW()),
    (7, 302, CURDATE() - INTERVAL 3 DAY, CURDATE() - INTERVAL 1 DAY, 'concluida',         3, NOW() - INTERVAL 5 DAY),
    (8, 204, CURDATE(),                  CURDATE() + INTERVAL 2 DAY, 'confirmada',        2, NOW());

-- -------------------------------------------------------------
-- HOSPEDAGEM (para as reservas com checkin realizado / concluídas)
-- reserva 1 → concluída
-- reserva 2 → ativa (quarto 202 ocupado)
-- reserva 5 → ativa (quarto 301 ocupado)
-- reserva 7 → concluída
-- -------------------------------------------------------------
INSERT INTO hospedagem (id_reserva, data_checkin_real, data_checkout_real, valor_total_diarias, valor_total_consumos, valor_total_final, status, id_funcionario_checkin) VALUES
    (1, NOW() - INTERVAL 5 DAY, NOW() - INTERVAL 3 DAY, 240.00,  45.00,  285.00, 'finalizada', 2),
    (2, NOW() - INTERVAL 2 DAY, NULL,                   360.00,   0.00,  360.00, 'ativa',      2),
    (5, NOW() - INTERVAL 1 DAY, NULL,                   350.00,   0.00,  350.00, 'ativa',      3),
    (7, NOW() - INTERVAL 3 DAY, NOW() - INTERVAL 1 DAY, 800.00, 130.00,  930.00, 'finalizada', 3);

-- -------------------------------------------------------------
-- CONSUMO (hospedagens 1 e 4 — as finalizadas)
-- -------------------------------------------------------------
INSERT INTO consumo (id_hospedagem, id_produto_servico, quantidade, preco_unitario, data_hora) VALUES
    -- hospedagem id=1 (reserva 1, Ana, quarto 101)
    (1, 1, 3,   4.00, NOW() - INTERVAL 5 DAY + INTERVAL 2 HOUR),
    (1, 6, 2,  25.00, NOW() - INTERVAL 4 DAY + INTERVAL 8 HOUR),
    -- hospedagem id=4 (reserva 7, Gabriela, quarto 302)
    (4, 9, 1, 120.00, NOW() - INTERVAL 2 DAY + INTERVAL 14 HOUR),
    (4, 2, 2,   7.00, NOW() - INTERVAL 2 DAY + INTERVAL 20 HOUR),
    (4, 8, 1,  80.00, NOW() - INTERVAL 1 DAY + INTERVAL 9 HOUR);
