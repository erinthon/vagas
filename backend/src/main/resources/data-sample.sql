-- =============================================================
-- DML de exemplo — Vagas Condomínio
-- Execute no banco 'vagas' após subir a aplicação (ddl-auto=update
-- já cria as tabelas; este script apenas popula os dados).
-- =============================================================

-- ---------------------------------------------------------------
-- Condomínios
-- ---------------------------------------------------------------
INSERT INTO condominios (nome, cnpj, endereco, telefone, email) VALUES
('Residencial das Flores',  '12.345.678/0001-99', 'Rua das Acácias, 100 - Jardim Primavera', '(11) 3333-1111', 'contato@flores.com.br'),
('Edifício Solar Blumenau', '98.765.432/0001-11', 'Av. Brasil, 500 - Centro',                '(47) 3333-2222', 'solar@blumenau.com.br');

-- ---------------------------------------------------------------
-- Cargos
-- ---------------------------------------------------------------
INSERT INTO cargos (nome, condominio_id) VALUES
('Síndico',              1),
('Sub-Síndico Bloco A',  1),
('Sub-Síndico Bloco B',  1),
('Conselheiro',          1),
('Síndico',              2),
('Sub-Síndico',          2);

-- ---------------------------------------------------------------
-- Moradores
-- ---------------------------------------------------------------
INSERT INTO moradores (nome, apartamento, bloco, email, telefone, google_id, foto_perfil, condominio_id, cargo_id) VALUES
('Ana Lima',        '101', 'A', 'ana.lima@email.com',        '(11) 91111-1111', NULL, NULL, 1, 1),
('Bruno Souza',     '202', 'A', 'bruno.souza@email.com',     '(11) 92222-2222', NULL, NULL, 1, 2),
('Carla Mendes',    '303', 'B', 'carla.mendes@email.com',    '(11) 93333-3333', NULL, NULL, 1, 3),
('Diego Ferreira',  '404', 'B', 'diego.ferreira@email.com',  '(11) 94444-4444', NULL, NULL, 2, 5),
('Eva Castro',      '105', 'C', 'eva.castro@email.com',      '(11) 95555-5555', NULL, NULL, 2, NULL);

-- ---------------------------------------------------------------
-- Vagas
-- ---------------------------------------------------------------
INSERT INTO vagas (numero, tipo, proprietario_id) VALUES
(1,  'COBERTA',    1),
(2,  'COBERTA',    1),
(3,  'DESCOBERTA', 2),
(4,  'DESCOBERTA', 3),
(5,  'COBERTA',    4),
(6,  'DESCOBERTA', 5),
(7,  'DESCOBERTA', 5);

-- ---------------------------------------------------------------
-- Ofertas
-- ---------------------------------------------------------------
INSERT INTO ofertas (morador_id, vaga_id, data_inicio, data_fim, observacao, status) VALUES
-- Ativas
(1, 1, '2026-04-20', '2026-04-30', 'Viagem de férias, vaga livre o mês todo.',   'ATIVA'),
(2, 3, '2026-04-18', '2026-04-25', 'Disponível nos fins de semana.',              'ATIVA'),
(4, 5, '2026-05-01', '2026-05-15', 'Reforma no carro, não usarei a vaga.',        'ATIVA'),
(5, 6, '2026-04-17', '2026-04-19', 'Só por este feriado.',                        'ATIVA'),
-- Encerradas
(3, 4, '2026-03-01', '2026-03-15', 'Oferta encerrada antecipadamente.',           'ENCERRADA'),
(1, 2, '2026-02-10', '2026-02-20', 'Congresso em São Paulo.',                     'ENCERRADA');

-- ---------------------------------------------------------------
-- Solicitações
-- ---------------------------------------------------------------
INSERT INTO solicitacoes (morador_id, data_inicio, data_fim, observacao, status, oferta_id) VALUES
-- Pendentes
(2, '2026-04-20', '2026-04-23', 'Visita de familiar com carro grande.',   'PENDENTE',  NULL),
(3, '2026-05-02', '2026-05-05', 'Emprestando carro de amigo.',            'PENDENTE',  NULL),
(5, '2026-04-21', '2026-04-22', 'Necessito só por um dia.',               'PENDENTE',  NULL),
-- Atendidas (vinculadas a ofertas encerradas)
(4, '2026-03-05', '2026-03-10', 'Reforma rápida no veículo.',             'ATENDIDA',  5),
(1, '2026-02-11', '2026-02-15', 'Carro na revisão.',                     'ATENDIDA',  6),
-- Cancelada
(2, '2026-01-10', '2026-01-12', 'Cancelei a viagem.',                    'CANCELADA', NULL);
