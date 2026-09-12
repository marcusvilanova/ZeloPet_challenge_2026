-- ================================================================
-- ZELO - ESTRUTURA DO BANCO DE DADOS MYSQL 8
-- Tabelas CORE: pets e cuidados, relacionadas por chave estrangeira.
-- ================================================================

CREATE DATABASE IF NOT EXISTS zelo
  CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;
USE zelo;

-- PETS: representa o animal acompanhado longitudinalmente pelo Zelo.
CREATE TABLE IF NOT EXISTS pets (
    id              BIGINT       NOT NULL AUTO_INCREMENT COMMENT 'Identificador unico do pet',
    nome            VARCHAR(100) NOT NULL COMMENT 'Nome do pet',
    especie         VARCHAR(30)  NOT NULL COMMENT 'Especie do animal, por exemplo Cao ou Gato',
    raca            VARCHAR(80)  NULL     COMMENT 'Raca declarada pelo tutor',
    data_nascimento DATE         NOT NULL COMMENT 'Data de nascimento do pet',
    nome_tutor      VARCHAR(120) NOT NULL COMMENT 'Nome do tutor responsavel',
    CONSTRAINT pk_pets PRIMARY KEY (id)
) ENGINE=InnoDB COMMENT='Animais acompanhados pelo ecossistema Zelo';

-- CUIDADOS: registra o plano preventivo e a linha do tempo do pet.
CREATE TABLE IF NOT EXISTS cuidados (
    id            BIGINT       NOT NULL AUTO_INCREMENT COMMENT 'Identificador unico do cuidado',
    pet_id        BIGINT       NOT NULL COMMENT 'Pet ao qual o cuidado pertence',
    tipo          VARCHAR(40)  NOT NULL COMMENT 'Categoria: VACINA, CONSULTA, EXAME ou MEDICAMENTO',
    descricao     VARCHAR(255) NOT NULL COMMENT 'Orientacao ou procedimento planejado',
    data_prevista DATE         NOT NULL COMMENT 'Data prevista para realizacao',
    status        VARCHAR(20)  NOT NULL COMMENT 'PENDENTE, CONCLUIDO, ATRASADO ou CANCELADO',
    CONSTRAINT pk_cuidados PRIMARY KEY (id),
    CONSTRAINT fk_cuidado_pet FOREIGN KEY (pet_id) REFERENCES pets(id),
    CONSTRAINT ck_cuidado_status CHECK (status IN ('PENDENTE','CONCLUIDO','ATRASADO','CANCELADO'))
) ENGINE=InnoDB COMMENT='Acoes preventivas e acompanhamentos dos pets';

CREATE INDEX ix_cuidados_pet_data ON cuidados (pet_id, data_prevista);

-- Duas linhas significativas em cada tabela, exigidas no enunciado.
INSERT INTO pets (nome, especie, raca, data_nascimento, nome_tutor) VALUES
  ('Thor', 'Cao', 'Golden Retriever', '2021-03-15', 'Mariana Costa'),
  ('Luna', 'Gato', 'Sem raca definida', '2022-08-10', 'Rafael Lima');

INSERT INTO cuidados (pet_id, tipo, descricao, data_prevista, status) VALUES
  (1, 'VACINA', 'Reforco anual da vacina multipla V10', '2026-10-15', 'PENDENTE'),
  (2, 'CONSULTA', 'Retorno preventivo com avaliacao de peso', '2026-10-20', 'PENDENTE');
