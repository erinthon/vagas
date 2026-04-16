-- =============================================================
-- RESET + SEED — Vagas Condomínio
-- Limpa todas as tabelas e repopula com dados de exemplo.
-- Execute no banco 'vagas' com a aplicação parada ou após startup.
-- =============================================================

SET FOREIGN_KEY_CHECKS = 0;

TRUNCATE TABLE solicitacoes;
TRUNCATE TABLE ofertas;
TRUNCATE TABLE vagas;
TRUNCATE TABLE moradores;
TRUNCATE TABLE cargos;
TRUNCATE TABLE condominios;

SET FOREIGN_KEY_CHECKS = 1;

-- ---------------------------------------------------------------
-- Condomínios
-- ---------------------------------------------------------------
INSERT INTO condominios (id, nome, cnpj, endereco, telefone, email) VALUES
(1, 'Residencial das Flores',  '12.345.678/0001-99', 'Rua das Acácias, 100 - Jardim Primavera', '(11) 3333-1111', 'contato@flores.com.br'),
(2, 'Edifício Solar Blumenau', '98.765.432/0001-11', 'Av. Brasil, 500 - Centro',                '(47) 3333-2222', 'solar@blumenau.com.br'),
(3, 'Condomínio Vista Verde',  '55.123.456/0001-77', 'Rua das Palmeiras, 200 - Vila Nova',      '(11) 3333-3333', 'vistaverde@email.com');

-- ---------------------------------------------------------------
-- Cargos
-- ---------------------------------------------------------------
INSERT INTO cargos (id, nome, condominio_id) VALUES
-- Residencial das Flores
(1, 'Síndico',              1),
(2, 'Sub-Síndico Bloco A',  1),
(3, 'Sub-Síndico Bloco B',  1),
(4, 'Conselheiro Fiscal',   1),
-- Edifício Solar Blumenau
(5, 'Síndico',              2),
(6, 'Sub-Síndico',          2),
(7, 'Conselheiro',          2),
-- Condomínio Vista Verde
(8, 'Síndico',              3),
(9, 'Sub-Síndico Bloco 1',  3),
(10,'Sub-Síndico Bloco 2',  3);

-- ---------------------------------------------------------------
-- Moradores
-- ---------------------------------------------------------------
INSERT INTO moradores (id, nome, apartamento, bloco, email, telefone, google_id, foto_perfil, condominio_id, cargo_id) VALUES
(1, 'Ana Lima',        '101', 'A', 'ana.lima@email.com',        '(11) 91111-1111', NULL, NULL, 1, 1),
(2, 'Bruno Souza',     '202', 'A', 'bruno.souza@email.com',     '(11) 92222-2222', NULL, NULL, 1, 2),
(3, 'Carla Mendes',    '303', 'B', 'carla.mendes@email.com',    '(11) 93333-3333', NULL, NULL, 1, 3),
(4, 'Diego Ferreira',  '404', 'B', 'diego.ferreira@email.com',  '(11) 94444-4444', NULL, NULL, 2, 5),
(5, 'Eva Castro',      '105', 'C', 'eva.castro@email.com',      '(11) 95555-5555', NULL, NULL, 2, 6),
(6, 'Felipe Nunes',    '201', '1', 'felipe.nunes@email.com',    '(11) 96666-6666', NULL, NULL, 3, 8),
(7, 'Gabriela Ramos',  '302', '2', 'gabriela.ramos@email.com',  '(11) 97777-7777', NULL, NULL, 3, NULL);

-- ---------------------------------------------------------------
-- Vagas
-- ---------------------------------------------------------------
INSERT INTO vagas (id, numero, tipo, proprietario_id) VALUES
(1,  1,  'COBERTA',    1),
(2,  2,  'COBERTA',    1),
(3,  3,  'DESCOBERTA', 2),
(4,  4,  'DESCOBERTA', 3),
(5,  5,  'COBERTA',    4),
(6,  6,  'DESCOBERTA', 5),
(7,  7,  'DESCOBERTA', 6),
(8,  8,  'COBERTA',    7);

-- ---------------------------------------------------------------
-- Ofertas
-- ---------------------------------------------------------------
INSERT INTO ofertas (id, morador_id, vaga_id, data_inicio, data_fim, observacao, status) VALUES
-- Ativas
(1, 1, 1, '2026-04-20', '2026-04-30', 'Viagem de férias, vaga livre o mês todo.',  'ATIVA'),
(2, 2, 3, '2026-04-18', '2026-04-25', 'Disponível nos fins de semana.',             'ATIVA'),
(3, 4, 5, '2026-05-01', '2026-05-15', 'Reforma no carro, não usarei a vaga.',       'ATIVA'),
(4, 5, 6, '2026-04-17', '2026-04-19', 'Só por este feriado.',                       'ATIVA'),
(5, 6, 7, '2026-04-22', '2026-04-28', 'Viagem de trabalho.',                        'ATIVA'),
-- Encerradas
(6, 3, 4, '2026-03-01', '2026-03-15', 'Oferta encerrada antecipadamente.',          'ENCERRADA'),
(7, 1, 2, '2026-02-10', '2026-02-20', 'Congresso em São Paulo.',                    'ENCERRADA');

-- ---------------------------------------------------------------
-- Solicitações
-- ---------------------------------------------------------------
INSERT INTO solicitacoes (id, morador_id, data_inicio, data_fim, observacao, status, oferta_id) VALUES
-- Pendentes
(1, 2, '2026-04-20', '2026-04-23', 'Visita de familiar com carro grande.',  'PENDENTE',  NULL),
(2, 3, '2026-05-02', '2026-05-05', 'Emprestando carro de amigo.',           'PENDENTE',  NULL),
(3, 5, '2026-04-21', '2026-04-22', 'Necessito só por um dia.',              'PENDENTE',  NULL),
(4, 7, '2026-04-23', '2026-04-24', 'Carro do filho visitando.',             'PENDENTE',  NULL),
-- Atendidas
(5, 4, '2026-03-05', '2026-03-10', 'Reforma rápida no veículo.',            'ATENDIDA',  6),
(6, 1, '2026-02-11', '2026-02-15', 'Carro na revisão.',                     'ATENDIDA',  7),
-- Cancelada
(7, 2, '2026-01-10', '2026-01-12', 'Cancelei a viagem.',                    'CANCELADA', NULL);
