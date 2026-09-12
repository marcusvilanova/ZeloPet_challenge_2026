drop table t_ch_alerta cascade constraint;
drop table t_ch_auditoria_dml cascade constraint;
drop table t_ch_clinica cascade constraint;
drop table t_ch_fato_cuidado cascade constraint;
drop table t_ch_pet cascade constraint;
drop table t_ch_pet_tutor cascade constraint;
drop table t_ch_triagem cascade constraint;
drop table t_ch_tutor cascade constraint;
drop table t_ch_usuario cascade constraint;

/* ============================================================================
   PROJETO ZELO — DDL DAS TABELAS
   Convenção de tabelas: T_CH_<ENTIDADE>
   Convenção de atributos:
     id_ = identificador
     nm_ = nome
     ds_ = descrição, texto ou informação descritiva
     tp_ = tipo
     st_ = status ou situação
     dt_ = data
     dh_ = data e hora
     vl_ = valor
     qt_ = quantidade
     fl_ = indicador lógico (S/N)

   Observação: este arquivo contém somente a criação das tabelas, constraints,
   chaves e relacionamentos. Não contém INSERTs, funções, procedimentos ou
   triggers.
   ============================================================================ */

/* ============================ TABELAS PRINCIPAIS ========================== */

-- Usuários da plataforma: tutores, veterinários e gestores.
CREATE TABLE T_CH_USUARIO (
    id_usuario       NUMBER GENERATED ALWAYS AS IDENTITY,
    nm_usuario       VARCHAR2(120) NOT NULL,
    ds_email         VARCHAR2(160) NOT NULL,
    ds_senha         VARCHAR2(255),
    tp_usuario       VARCHAR2(20) NOT NULL,
    st_usuario       CHAR(1) DEFAULT 'S' NOT NULL,
    dt_criacao       TIMESTAMP DEFAULT SYSTIMESTAMP NOT NULL,
    CONSTRAINT PK_T_CH_USUARIO PRIMARY KEY (id_usuario),
    CONSTRAINT UK_T_CH_USUARIO_EMAIL UNIQUE (ds_email),
    CONSTRAINT CK_T_CH_USUARIO_TIPO CHECK (tp_usuario IN ('TUTOR','VETERINARIO','GESTOR')),
    CONSTRAINT CK_T_CH_USUARIO_STATUS CHECK (st_usuario IN ('S','N'))
);

-- Dados específicos do tutor, relacionados ao usuário da plataforma.
CREATE TABLE T_CH_TUTOR (
    id_tutor         NUMBER GENERATED ALWAYS AS IDENTITY,
    id_usuario       NUMBER NOT NULL,
    nr_telefone      VARCHAR2(25),
    nm_cidade        VARCHAR2(80),
    sg_estado        CHAR(2),
    dt_criacao       TIMESTAMP DEFAULT SYSTIMESTAMP NOT NULL,
    CONSTRAINT PK_T_CH_TUTOR PRIMARY KEY (id_tutor),
    CONSTRAINT UK_T_CH_TUTOR_USUARIO UNIQUE (id_usuario),
    CONSTRAINT FK_T_CH_TUTOR_USUARIO FOREIGN KEY (id_usuario)
        REFERENCES T_CH_USUARIO (id_usuario)
);

-- Clínicas parceiras que recebem triagens e encaminhamentos.
CREATE TABLE T_CH_CLINICA (
    id_clinica       NUMBER GENERATED ALWAYS AS IDENTITY,
    nm_clinica       VARCHAR2(160) NOT NULL,
    nr_cnpj          VARCHAR2(18),
    nr_telefone      VARCHAR2(25),
    ds_endereco      VARCHAR2(220),
    nm_cidade        VARCHAR2(80),
    sg_estado        CHAR(2),
    st_clinica       CHAR(1) DEFAULT 'S' NOT NULL,
    dt_criacao       TIMESTAMP DEFAULT SYSTIMESTAMP NOT NULL,
    CONSTRAINT PK_T_CH_CLINICA PRIMARY KEY (id_clinica),
    CONSTRAINT UK_T_CH_CLINICA_CNPJ UNIQUE (nr_cnpj),
    CONSTRAINT CK_T_CH_CLINICA_STATUS CHECK (st_clinica IN ('S','N'))
);

-- Animais acompanhados pelo sistema Zelo.
CREATE TABLE T_CH_PET (
    id_pet           NUMBER GENERATED ALWAYS AS IDENTITY,
    nm_pet           VARCHAR2(100) NOT NULL,
    tp_especie       VARCHAR2(30) NOT NULL,
    nm_raca          VARCHAR2(80),
    tp_sexo          CHAR(1),
    dt_nascimento    DATE,
    vl_peso_kg       NUMBER(6,2),
    fl_castrado      CHAR(1),
    dt_criacao       TIMESTAMP DEFAULT SYSTIMESTAMP NOT NULL,
    CONSTRAINT PK_T_CH_PET PRIMARY KEY (id_pet),
    CONSTRAINT CK_T_CH_PET_ESPECIE CHECK (tp_especie IN ('CAO','GATO','OUTRO')),
    CONSTRAINT CK_T_CH_PET_SEXO CHECK (tp_sexo IN ('M','F','I')),
    CONSTRAINT CK_T_CH_PET_PESO CHECK (vl_peso_kg IS NULL OR vl_peso_kg > 0),
    CONSTRAINT CK_T_CH_PET_CASTRADO CHECK (fl_castrado IN ('S','N'))
);

-- Relação N:N para o recurso Multi-Tutor.
CREATE TABLE T_CH_PET_TUTOR (
    id_pet_tutor     NUMBER GENERATED ALWAYS AS IDENTITY,
    id_pet           NUMBER NOT NULL,
    id_tutor         NUMBER NOT NULL,
    fl_principal     CHAR(1) DEFAULT 'N' NOT NULL,
    dt_vinculo       DATE DEFAULT SYSDATE NOT NULL,
    CONSTRAINT PK_T_CH_PET_TUTOR PRIMARY KEY (id_pet_tutor),
    CONSTRAINT UK_T_CH_PET_TUTOR UNIQUE (id_pet, id_tutor),
    CONSTRAINT FK_T_CH_PT_PET FOREIGN KEY (id_pet)
        REFERENCES T_CH_PET (id_pet),
    CONSTRAINT FK_T_CH_PT_TUTOR FOREIGN KEY (id_tutor)
        REFERENCES T_CH_TUTOR (id_tutor),
    CONSTRAINT CK_T_CH_PT_PRINCIPAL CHECK (fl_principal IN ('S','N'))
);

-- Triagens realizadas pelo agente de inteligência do Zelo.
CREATE TABLE T_CH_TRIAGEM (
    id_triagem       NUMBER GENERATED ALWAYS AS IDENTITY,
    id_pet           NUMBER NOT NULL,
    id_clinica       NUMBER,
    id_tutor         NUMBER,
    tp_canal         VARCHAR2(15) NOT NULL,
    ds_relato        VARCHAR2(2000) NOT NULL,
    vl_score_risco   NUMBER(5,2) NOT NULL,
    tp_urgencia      VARCHAR2(15) NOT NULL,
    ds_analise_visual VARCHAR2(1000),
    dh_encaminhamento TIMESTAMP,
    st_triagem       VARCHAR2(20) DEFAULT 'ABERTA' NOT NULL,
    dt_criacao       TIMESTAMP DEFAULT SYSTIMESTAMP NOT NULL,
    CONSTRAINT PK_T_CH_TRIAGEM PRIMARY KEY (id_triagem),
    CONSTRAINT FK_T_CH_TRIAGEM_PET FOREIGN KEY (id_pet)
        REFERENCES T_CH_PET (id_pet),
    CONSTRAINT FK_T_CH_TRIAGEM_CLINICA FOREIGN KEY (id_clinica)
        REFERENCES T_CH_CLINICA (id_clinica),
    CONSTRAINT FK_T_CH_TRIAGEM_TUTOR FOREIGN KEY (id_tutor)
        REFERENCES T_CH_TUTOR (id_tutor),
    CONSTRAINT CK_T_CH_TRIAGEM_CANAL CHECK (tp_canal IN ('TEXTO','AUDIO','IMAGEM')),
    CONSTRAINT CK_T_CH_TRIAGEM_SCORE CHECK (vl_score_risco BETWEEN 0 AND 100),
    CONSTRAINT CK_T_CH_TRIAGEM_URGENCIA CHECK (tp_urgencia IN ('BAIXA','MEDIA','ALTA','EMERGENCIA')),
    CONSTRAINT CK_T_CH_TRIAGEM_STATUS CHECK (st_triagem IN ('ABERTA','ENCAMINHADA','ATENDIDA','CANCELADA'))
);

-- Alertas de vacina, check-up, retenção e acompanhamento pós-consulta.
CREATE TABLE T_CH_ALERTA (
    id_alerta        NUMBER GENERATED ALWAYS AS IDENTITY,
    id_pet           NUMBER NOT NULL,
    id_clinica       NUMBER,
    tp_alerta        VARCHAR2(25) NOT NULL,
    nm_alerta        VARCHAR2(160) NOT NULL,
    ds_alerta        VARCHAR2(1000),
    dt_prevista      DATE NOT NULL,
    dh_envio         TIMESTAMP,
    st_alerta        VARCHAR2(15) DEFAULT 'PENDENTE' NOT NULL,
    dt_criacao       TIMESTAMP DEFAULT SYSTIMESTAMP NOT NULL,
    CONSTRAINT PK_T_CH_ALERTA PRIMARY KEY (id_alerta),
    CONSTRAINT FK_T_CH_ALERTA_PET FOREIGN KEY (id_pet)
        REFERENCES T_CH_PET (id_pet),
    CONSTRAINT FK_T_CH_ALERTA_CLINICA FOREIGN KEY (id_clinica)
        REFERENCES T_CH_CLINICA (id_clinica),
    CONSTRAINT CK_T_CH_ALERTA_TIPO CHECK (tp_alerta IN ('VACINA','CHECKUP','RETENCAO','POS_CONSULTA')),
    CONSTRAINT CK_T_CH_ALERTA_STATUS CHECK (st_alerta IN ('PENDENTE','ENVIADO','CONCLUIDO','CANCELADO'))
);

/* ================================ TABELA DE FATOS ========================= */

-- Tabela de fatos para agregações por clínica e tipo de cuidado.
CREATE TABLE T_CH_FATO_CUIDADO (
    id_fato          NUMBER GENERATED ALWAYS AS IDENTITY,
    id_clinica       NUMBER NOT NULL,
    id_pet           NUMBER,
    tp_cuidado       VARCHAR2(30) NOT NULL,
    dt_cuidado       DATE NOT NULL,
    qt_cuidado       NUMBER(10,2) DEFAULT 1 NOT NULL,
    vl_cuidado       NUMBER(12,2) NOT NULL,
    tp_origem        VARCHAR2(20) NOT NULL,
    CONSTRAINT PK_T_CH_FATO_CUIDADO PRIMARY KEY (id_fato),
    CONSTRAINT FK_T_CH_FATO_CLINICA FOREIGN KEY (id_clinica)
        REFERENCES T_CH_CLINICA (id_clinica),
    CONSTRAINT FK_T_CH_FATO_PET FOREIGN KEY (id_pet)
        REFERENCES T_CH_PET (id_pet),
    CONSTRAINT CK_T_CH_FATO_TIPO CHECK (tp_cuidado IN ('TRIAGEM','CONSULTA','VACINA','CHECKUP','RETORNO')),
    CONSTRAINT CK_T_CH_FATO_QUANTIDADE CHECK (qt_cuidado > 0),
    CONSTRAINT CK_T_CH_FATO_VALOR CHECK (vl_cuidado >= 0),
    CONSTRAINT CK_T_CH_FATO_ORIGEM CHECK (tp_origem IN ('APP','CLINICA','INTEGRACAO'))
);

/* ============================ TABELA DE AUDITORIA ========================= */

-- Armazena as operações DML realizadas sobre T_CH_TRIAGEM.
CREATE TABLE T_CH_AUDITORIA_DML (
    id_auditoria     NUMBER GENERATED ALWAYS AS IDENTITY,
    nm_usuario       VARCHAR2(128) NOT NULL,
    tp_operacao      VARCHAR2(10) NOT NULL,
    dh_operacao      TIMESTAMP DEFAULT SYSTIMESTAMP NOT NULL,
    nm_tabela        VARCHAR2(128) NOT NULL,
    id_registro      VARCHAR2(100),
    ds_valor_anterior CLOB,
    ds_valor_novo    CLOB,
    CONSTRAINT PK_T_CH_AUDITORIA PRIMARY KEY (id_auditoria),
    CONSTRAINT CK_T_CH_AUDITORIA_OPERACAO CHECK (tp_operacao IN ('INSERT','UPDATE','DELETE'))
);

/* ======================= 2. TRIGGER DE AUDITORIA ========================== */

CREATE OR REPLACE TRIGGER TRG_T_CH_AUDITORIA_TRIAGEM
AFTER INSERT OR UPDATE OR DELETE ON T_CH_TRIAGEM
FOR EACH ROW
DECLARE
    v_tp_operacao VARCHAR2(10);
    v_ds_anterior CLOB;
    v_ds_novo CLOB;
BEGIN
    IF INSERTING THEN
        v_tp_operacao := 'INSERT';
        v_ds_anterior := NULL;
        v_ds_novo := '{"id_triagem":' || :NEW.id_triagem ||
                     ',"id_pet":' || :NEW.id_pet ||
                     ',"vl_score_risco":' || TO_CHAR(:NEW.vl_score_risco, 'FM990D00', 'NLS_NUMERIC_CHARACTERS=''.,''') ||
                     ',"st_triagem":"' || :NEW.st_triagem || '"}';
    ELSIF UPDATING THEN
        v_tp_operacao := 'UPDATE';
        v_ds_anterior := '{"id_triagem":' || :OLD.id_triagem ||
                         ',"id_pet":' || :OLD.id_pet ||
                         ',"vl_score_risco":' || TO_CHAR(:OLD.vl_score_risco, 'FM990D00', 'NLS_NUMERIC_CHARACTERS=''.,''') ||
                         ',"st_triagem":"' || :OLD.st_triagem || '"}';
        v_ds_novo := '{"id_triagem":' || :NEW.id_triagem ||
                     ',"id_pet":' || :NEW.id_pet ||
                     ',"vl_score_risco":' || TO_CHAR(:NEW.vl_score_risco, 'FM990D00', 'NLS_NUMERIC_CHARACTERS=''.,''') ||
                     ',"st_triagem":"' || :NEW.st_triagem || '"}';
    ELSE
        v_tp_operacao := 'DELETE';
        v_ds_anterior := '{"id_triagem":' || :OLD.id_triagem ||
                         ',"id_pet":' || :OLD.id_pet ||
                         ',"vl_score_risco":' || TO_CHAR(:OLD.vl_score_risco, 'FM990D00', 'NLS_NUMERIC_CHARACTERS=''.,''') ||
                         ',"st_triagem":"' || :OLD.st_triagem || '"}';
        v_ds_novo := NULL;
    END IF;

    INSERT INTO T_CH_AUDITORIA_DML (
        nm_usuario, tp_operacao, dh_operacao, nm_tabela, id_registro,
        ds_valor_anterior, ds_valor_novo
    ) VALUES (
        SYS_CONTEXT('USERENV', 'SESSION_USER'), v_tp_operacao, SYSTIMESTAMP,
        'T_CH_TRIAGEM', TO_CHAR(NVL(:NEW.id_triagem, :OLD.id_triagem)),
        v_ds_anterior, v_ds_novo
    );
EXCEPTION
    WHEN VALUE_ERROR THEN
        RAISE_APPLICATION_ERROR(-20301, 'Erro de formato na auditoria da triagem.');
    WHEN OTHERS THEN
        IF SQLCODE BETWEEN -20399 AND -20300 THEN
            RAISE;
        END IF;
        RAISE_APPLICATION_ERROR(-20302, 'Erro inesperado no trigger de auditoria: ' || SQLERRM);
END;
/

/* ============================ 3. CARGA DE DADOS ============================ */

-- Cinco usuários válidos.
INSERT INTO T_CH_USUARIO (nm_usuario, ds_email, ds_senha, tp_usuario) VALUES
('Ana Carolina Souza', 'ana.souza@zelo.com.br', 'hash_ana', 'TUTOR');
INSERT INTO T_CH_USUARIO (nm_usuario, ds_email, ds_senha, tp_usuario) VALUES
('Bruno Henrique Lima', 'bruno.lima@zelo.com.br', 'hash_bruno', 'TUTOR');
INSERT INTO T_CH_USUARIO (nm_usuario, ds_email, ds_senha, tp_usuario) VALUES
('Carla Mendes Rocha', 'carla.rocha@zelo.com.br', 'hash_carla', 'TUTOR');
INSERT INTO T_CH_USUARIO (nm_usuario, ds_email, ds_senha, tp_usuario) VALUES
('Dra. Fernanda Alves', 'fernanda.alves@zelo.com.br', 'hash_fernanda', 'VETERINARIO');
INSERT INTO T_CH_USUARIO (nm_usuario, ds_email, ds_senha, tp_usuario) VALUES
('Eduardo Martins', 'eduardo.martins@zelo.com.br', 'hash_eduardo', 'GESTOR');

-- Cinco tutores, vinculados por e-mail para não depender de IDs fixos.
INSERT INTO T_CH_TUTOR (id_usuario, nr_telefone, nm_cidade, sg_estado)
SELECT id_usuario, '(11) 99999-1001', 'São Paulo', 'SP' FROM T_CH_USUARIO WHERE ds_email = 'ana.souza@zelo.com.br';
INSERT INTO T_CH_TUTOR (id_usuario, nr_telefone, nm_cidade, sg_estado)
SELECT id_usuario, '(11) 99999-1002', 'São Paulo', 'SP' FROM T_CH_USUARIO WHERE ds_email = 'bruno.lima@zelo.com.br';
INSERT INTO T_CH_TUTOR (id_usuario, nr_telefone, nm_cidade, sg_estado)
SELECT id_usuario, '(21) 99999-1003', 'Rio de Janeiro', 'RJ' FROM T_CH_USUARIO WHERE ds_email = 'carla.rocha@zelo.com.br';
INSERT INTO T_CH_TUTOR (id_usuario, nr_telefone, nm_cidade, sg_estado)
SELECT id_usuario, '(31) 99999-1004', 'Belo Horizonte', 'MG' FROM T_CH_USUARIO WHERE ds_email = 'fernanda.alves@zelo.com.br';
INSERT INTO T_CH_TUTOR (id_usuario, nr_telefone, nm_cidade, sg_estado)
SELECT id_usuario, '(41) 99999-1005', 'Curitiba', 'PR' FROM T_CH_USUARIO WHERE ds_email = 'eduardo.martins@zelo.com.br';

-- Cinco clínicas.
INSERT INTO T_CH_CLINICA (nm_clinica, nr_cnpj, nr_telefone, ds_endereco, nm_cidade, sg_estado) VALUES
('Clínica Vet Vida', '11.111.111/0001-01', '(11) 3000-1001', 'Rua das Flores, 100', 'São Paulo', 'SP');
INSERT INTO T_CH_CLINICA (nm_clinica, nr_cnpj, nr_telefone, ds_endereco, nm_cidade, sg_estado) VALUES
('Hospital Animal Cuidar', '22.222.222/0001-02', '(11) 3000-1002', 'Av. Central, 200', 'São Paulo', 'SP');
INSERT INTO T_CH_CLINICA (nm_clinica, nr_cnpj, nr_telefone, ds_endereco, nm_cidade, sg_estado) VALUES
('Pet Saúde RJ', '33.333.333/0001-03', '(21) 3000-1003', 'Rua do Sol, 300', 'Rio de Janeiro', 'RJ');
INSERT INTO T_CH_CLINICA (nm_clinica, nr_cnpj, nr_telefone, ds_endereco, nm_cidade, sg_estado) VALUES
('Vet Minas Integrada', '44.444.444/0001-04', '(31) 3000-1004', 'Rua do Parque, 400', 'Belo Horizonte', 'MG');
INSERT INTO T_CH_CLINICA (nm_clinica, nr_cnpj, nr_telefone, ds_endereco, nm_cidade, sg_estado) VALUES
('Clínica Amigo Fiel', '55.555.555/0001-05', '(41) 3000-1005', 'Av. Paraná, 500', 'Curitiba', 'PR');

-- Cinco pets.
INSERT INTO T_CH_PET (nm_pet, tp_especie, nm_raca, tp_sexo, dt_nascimento, vl_peso_kg, fl_castrado) VALUES
('Thor', 'CAO', 'Golden Retriever', 'M', DATE '2020-04-10', 28.50, 'S');
INSERT INTO T_CH_PET (nm_pet, tp_especie, nm_raca, tp_sexo, dt_nascimento, vl_peso_kg, fl_castrado) VALUES
('Luna', 'GATO', 'Siamês', 'F', DATE '2021-08-22', 4.20, 'S');
INSERT INTO T_CH_PET (nm_pet, tp_especie, nm_raca, tp_sexo, dt_nascimento, vl_peso_kg, fl_castrado) VALUES
('Nina', 'CAO', 'Shih-tzu', 'F', DATE '2019-02-15', 6.80, 'S');
INSERT INTO T_CH_PET (nm_pet, tp_especie, nm_raca, tp_sexo, dt_nascimento, vl_peso_kg, fl_castrado) VALUES
('Max', 'CAO', 'Labrador', 'M', DATE '2018-11-03', 31.00, 'N');
INSERT INTO T_CH_PET (nm_pet, tp_especie, nm_raca, tp_sexo, dt_nascimento, vl_peso_kg, fl_castrado) VALUES
('Mia', 'GATO', 'SRD', 'F', DATE '2022-06-30', 3.70, 'S');

-- Cinco vínculos pet/tutor, habilitando o Multi-Tutor.
INSERT INTO T_CH_PET_TUTOR (id_pet, id_tutor, fl_principal)
SELECT p.id_pet, t.id_tutor, 'S' FROM T_CH_PET p CROSS JOIN T_CH_TUTOR t
WHERE p.nm_pet = 'Thor' AND t.nr_telefone = '(11) 99999-1001';
INSERT INTO T_CH_PET_TUTOR (id_pet, id_tutor, fl_principal)
SELECT p.id_pet, t.id_tutor, 'S' FROM T_CH_PET p CROSS JOIN T_CH_TUTOR t
WHERE p.nm_pet = 'Luna' AND t.nr_telefone = '(11) 99999-1002';
INSERT INTO T_CH_PET_TUTOR (id_pet, id_tutor, fl_principal)
SELECT p.id_pet, t.id_tutor, 'S' FROM T_CH_PET p CROSS JOIN T_CH_TUTOR t
WHERE p.nm_pet = 'Nina' AND t.nr_telefone = '(21) 99999-1003';
INSERT INTO T_CH_PET_TUTOR (id_pet, id_tutor, fl_principal)
SELECT p.id_pet, t.id_tutor, 'S' FROM T_CH_PET p CROSS JOIN T_CH_TUTOR t
WHERE p.nm_pet = 'Max' AND t.nr_telefone = '(31) 99999-1004';
INSERT INTO T_CH_PET_TUTOR (id_pet, id_tutor, fl_principal)
SELECT p.id_pet, t.id_tutor, 'S' FROM T_CH_PET p CROSS JOIN T_CH_TUTOR t
WHERE p.nm_pet = 'Mia' AND t.nr_telefone = '(41) 99999-1005';

-- Cinco triagens. Estes INSERTs também alimentam a auditoria via trigger.
INSERT INTO T_CH_TRIAGEM (id_pet, id_clinica, id_tutor, tp_canal, ds_relato, vl_score_risco, tp_urgencia, ds_analise_visual, dh_encaminhamento, st_triagem)
SELECT p.id_pet, c.id_clinica, t.id_tutor, 'TEXTO', 'Pet com apatia e redução de apetite.', 72, 'ALTA', 'Score corporal abaixo do esperado.', SYSTIMESTAMP, 'ENCAMINHADA'
FROM T_CH_PET p CROSS JOIN T_CH_CLINICA c CROSS JOIN T_CH_TUTOR t WHERE p.nm_pet='Thor' AND c.nm_clinica='Clínica Vet Vida' AND t.nr_telefone='(11) 99999-1001';
INSERT INTO T_CH_TRIAGEM (id_pet, id_clinica, id_tutor, tp_canal, ds_relato, vl_score_risco, tp_urgencia, ds_analise_visual, dh_encaminhamento, st_triagem)
SELECT p.id_pet, c.id_clinica, t.id_tutor, 'AUDIO', 'Vômitos recorrentes desde a manhã.', 88, 'EMERGENCIA', 'Imagem não disponibilizada.', SYSTIMESTAMP, 'ENCAMINHADA'
FROM T_CH_PET p CROSS JOIN T_CH_CLINICA c CROSS JOIN T_CH_TUTOR t WHERE p.nm_pet='Luna' AND c.nm_clinica='Hospital Animal Cuidar' AND t.nr_telefone='(11) 99999-1002';
INSERT INTO T_CH_TRIAGEM (id_pet, id_clinica, id_tutor, tp_canal, ds_relato, vl_score_risco, tp_urgencia, ds_analise_visual, st_triagem)
SELECT p.id_pet, c.id_clinica, t.id_tutor, 'IMAGEM', 'Alteração observada nas fezes.', 45, 'MEDIA', 'Possível alteração de consistência.', 'ABERTA'
FROM T_CH_PET p CROSS JOIN T_CH_CLINICA c CROSS JOIN T_CH_TUTOR t WHERE p.nm_pet='Nina' AND c.nm_clinica='Pet Saúde RJ' AND t.nr_telefone='(21) 99999-1003';
INSERT INTO T_CH_TRIAGEM (id_pet, id_clinica, id_tutor, tp_canal, ds_relato, vl_score_risco, tp_urgencia, ds_analise_visual, st_triagem)
SELECT p.id_pet, c.id_clinica, t.id_tutor, 'TEXTO', 'Coceira persistente e vermelhidão na pele.', 61, 'ALTA', 'Região avermelhada identificada.', 'ABERTA'
FROM T_CH_PET p CROSS JOIN T_CH_CLINICA c CROSS JOIN T_CH_TUTOR t WHERE p.nm_pet='Max' AND c.nm_clinica='Vet Minas Integrada' AND t.nr_telefone='(31) 99999-1004';
INSERT INTO T_CH_TRIAGEM (id_pet, id_clinica, id_tutor, tp_canal, ds_relato, vl_score_risco, tp_urgencia, ds_analise_visual, st_triagem)
SELECT p.id_pet, c.id_clinica, t.id_tutor, 'AUDIO', 'Acompanhamento preventivo sem sintomas graves.', 18, 'BAIXA', 'Sem alteração visual relevante.', 'ATENDIDA'
FROM T_CH_PET p CROSS JOIN T_CH_CLINICA c CROSS JOIN T_CH_TUTOR t WHERE p.nm_pet='Mia' AND c.nm_clinica='Clínica Amigo Fiel' AND t.nr_telefone='(41) 99999-1005';

-- Cinco alertas.
INSERT INTO T_CH_ALERTA (id_pet, id_clinica, tp_alerta, nm_alerta, ds_alerta, dt_prevista, st_alerta)
SELECT p.id_pet, c.id_clinica, 'VACINA', 'Reforço anual de vacina', 'Verificar carteira e aplicar reforço.', DATE '2026-10-10', 'PENDENTE'
FROM T_CH_PET p CROSS JOIN T_CH_CLINICA c WHERE p.nm_pet='Thor' AND c.nm_clinica='Clínica Vet Vida';
INSERT INTO T_CH_ALERTA (id_pet, id_clinica, tp_alerta, nm_alerta, ds_alerta, dt_prevista, st_alerta)
SELECT p.id_pet, c.id_clinica, 'CHECKUP', 'Check-up semestral', 'Agendar avaliação preventiva.', DATE '2026-10-15', 'PENDENTE'
FROM T_CH_PET p CROSS JOIN T_CH_CLINICA c WHERE p.nm_pet='Luna' AND c.nm_clinica='Hospital Animal Cuidar';
INSERT INTO T_CH_ALERTA (id_pet, id_clinica, tp_alerta, nm_alerta, ds_alerta, dt_prevista, st_alerta)
SELECT p.id_pet, c.id_clinica, 'POS_CONSULTA', 'Acompanhamento pós-consulta', 'Confirmar evolução do quadro.', DATE '2026-09-20', 'ENVIADO'
FROM T_CH_PET p CROSS JOIN T_CH_CLINICA c WHERE p.nm_pet='Nina' AND c.nm_clinica='Pet Saúde RJ';
INSERT INTO T_CH_ALERTA (id_pet, id_clinica, tp_alerta, nm_alerta, ds_alerta, dt_prevista, st_alerta)
SELECT p.id_pet, c.id_clinica, 'RETENCAO', 'Retorno preventivo', 'Convidar tutor para novo acompanhamento.', DATE '2026-11-02', 'PENDENTE'
FROM T_CH_PET p CROSS JOIN T_CH_CLINICA c WHERE p.nm_pet='Max' AND c.nm_clinica='Vet Minas Integrada';
INSERT INTO T_CH_ALERTA (id_pet, id_clinica, tp_alerta, nm_alerta, ds_alerta, dt_prevista, st_alerta)
SELECT p.id_pet, c.id_clinica, 'VACINA', 'Vacina antirrábica', 'Verificar necessidade da dose anual.', DATE '2026-12-05', 'CONCLUIDO'
FROM T_CH_PET p CROSS JOIN T_CH_CLINICA c WHERE p.nm_pet='Mia' AND c.nm_clinica='Clínica Amigo Fiel';

-- Dez fatos: mais de cinco linhas detalhadas para permitir subtotais.
INSERT INTO T_CH_FATO_CUIDADO (id_clinica, id_pet, tp_cuidado, dt_cuidado, qt_cuidado, vl_cuidado, tp_origem)
SELECT c.id_clinica, p.id_pet, 'TRIAGEM', DATE '2026-08-01', 1, 80, 'APP' FROM T_CH_CLINICA c CROSS JOIN T_CH_PET p WHERE c.nm_clinica='Clínica Vet Vida' AND p.nm_pet='Thor';
INSERT INTO T_CH_FATO_CUIDADO (id_clinica, id_pet, tp_cuidado, dt_cuidado, qt_cuidado, vl_cuidado, tp_origem)
SELECT c.id_clinica, p.id_pet, 'CONSULTA', DATE '2026-08-02', 1, 220, 'CLINICA' FROM T_CH_CLINICA c CROSS JOIN T_CH_PET p WHERE c.nm_clinica='Clínica Vet Vida' AND p.nm_pet='Thor';
INSERT INTO T_CH_FATO_CUIDADO (id_clinica, id_pet, tp_cuidado, dt_cuidado, qt_cuidado, vl_cuidado, tp_origem)
SELECT c.id_clinica, p.id_pet, 'VACINA', DATE '2026-08-03', 1, 95, 'CLINICA' FROM T_CH_CLINICA c CROSS JOIN T_CH_PET p WHERE c.nm_clinica='Clínica Vet Vida' AND p.nm_pet='Thor';
INSERT INTO T_CH_FATO_CUIDADO (id_clinica, id_pet, tp_cuidado, dt_cuidado, qt_cuidado, vl_cuidado, tp_origem)
SELECT c.id_clinica, p.id_pet, 'TRIAGEM', DATE '2026-08-04', 1, 80, 'APP' FROM T_CH_CLINICA c CROSS JOIN T_CH_PET p WHERE c.nm_clinica='Hospital Animal Cuidar' AND p.nm_pet='Luna';
INSERT INTO T_CH_FATO_CUIDADO (id_clinica, id_pet, tp_cuidado, dt_cuidado, qt_cuidado, vl_cuidado, tp_origem)
SELECT c.id_clinica, p.id_pet, 'CONSULTA', DATE '2026-08-05', 1, 280, 'CLINICA' FROM T_CH_CLINICA c CROSS JOIN T_CH_PET p WHERE c.nm_clinica='Hospital Animal Cuidar' AND p.nm_pet='Luna';
INSERT INTO T_CH_FATO_CUIDADO (id_clinica, id_pet, tp_cuidado, dt_cuidado, qt_cuidado, vl_cuidado, tp_origem)
SELECT c.id_clinica, p.id_pet, 'CHECKUP', DATE '2026-08-06', 1, 160, 'CLINICA' FROM T_CH_CLINICA c CROSS JOIN T_CH_PET p WHERE c.nm_clinica='Hospital Animal Cuidar' AND p.nm_pet='Luna';
INSERT INTO T_CH_FATO_CUIDADO (id_clinica, id_pet, tp_cuidado, dt_cuidado, qt_cuidado, vl_cuidado, tp_origem)
SELECT c.id_clinica, p.id_pet, 'TRIAGEM', DATE '2026-08-07', 1, 80, 'APP' FROM T_CH_CLINICA c CROSS JOIN T_CH_PET p WHERE c.nm_clinica='Pet Saúde RJ' AND p.nm_pet='Nina';
INSERT INTO T_CH_FATO_CUIDADO (id_clinica, id_pet, tp_cuidado, dt_cuidado, qt_cuidado, vl_cuidado, tp_origem)
SELECT c.id_clinica, p.id_pet, 'RETORNO', DATE '2026-08-08', 1, 120, 'CLINICA' FROM T_CH_CLINICA c CROSS JOIN T_CH_PET p WHERE c.nm_clinica='Pet Saúde RJ' AND p.nm_pet='Nina';
INSERT INTO T_CH_FATO_CUIDADO (id_clinica, id_pet, tp_cuidado, dt_cuidado, qt_cuidado, vl_cuidado, tp_origem)
SELECT c.id_clinica, p.id_pet, 'CONSULTA', DATE '2026-08-09', 1, 210, 'CLINICA' FROM T_CH_CLINICA c CROSS JOIN T_CH_PET p WHERE c.nm_clinica='Vet Minas Integrada' AND p.nm_pet='Max';
INSERT INTO T_CH_FATO_CUIDADO (id_clinica, id_pet, tp_cuidado, dt_cuidado, qt_cuidado, vl_cuidado, tp_origem)
SELECT c.id_clinica, p.id_pet, 'VACINA', DATE '2026-08-10', 1, 90, 'CLINICA' FROM T_CH_CLINICA c CROSS JOIN T_CH_PET p WHERE c.nm_clinica='Clínica Amigo Fiel' AND p.nm_pet='Mia';

COMMIT;

/* =============================== 4. FUNÇÃO 1 ============================== */

-- Recebe um ID relacional e retorna os dados da triagem como JSON textual.
-- A montagem é manual, por concatenação de strings, sem built-ins JSON.
CREATE OR REPLACE FUNCTION FN_T_CH_TRIAGEM_JSON (
    p_id_triagem IN T_CH_TRIAGEM.id_triagem%TYPE
) RETURN CLOB
IS
    v_json CLOB;
    v_nm_pet T_CH_PET.nm_pet%TYPE;
    v_tp_especie T_CH_PET.tp_especie%TYPE;
    v_nm_tutor T_CH_USUARIO.nm_usuario%TYPE;
    v_nm_clinica T_CH_CLINICA.nm_clinica%TYPE;
    v_tp_canal T_CH_TRIAGEM.tp_canal%TYPE;
    v_ds_relato T_CH_TRIAGEM.ds_relato%TYPE;
    v_vl_score T_CH_TRIAGEM.vl_score_risco%TYPE;
    v_tp_urgencia T_CH_TRIAGEM.tp_urgencia%TYPE;
    v_st_triagem T_CH_TRIAGEM.st_triagem%TYPE;
BEGIN
    SELECT p.nm_pet, p.tp_especie, u.nm_usuario, c.nm_clinica,
           t.tp_canal, t.ds_relato, t.vl_score_risco,
           t.tp_urgencia, t.st_triagem
      INTO v_nm_pet, v_tp_especie, v_nm_tutor, v_nm_clinica,
           v_tp_canal, v_ds_relato, v_vl_score,
           v_tp_urgencia, v_st_triagem
      FROM T_CH_TRIAGEM t
      JOIN T_CH_PET p ON p.id_pet = t.id_pet
      LEFT JOIN T_CH_TUTOR tu ON tu.id_tutor = t.id_tutor
      LEFT JOIN T_CH_USUARIO u ON u.id_usuario = tu.id_usuario
      LEFT JOIN T_CH_CLINICA c ON c.id_clinica = t.id_clinica
     WHERE t.id_triagem = p_id_triagem;

    v_json := '{"id_triagem":' || TO_CHAR(p_id_triagem) ||
              ',"pet":{"nome":"' || REPLACE(v_nm_pet, '"', '\"') ||
              '","especie":"' || v_tp_especie || '"}' ||
              ',"tutor":"' || NVL(REPLACE(v_nm_tutor, '"', '\"'), '') || '"' ||
              ',"clinica":"' || NVL(REPLACE(v_nm_clinica, '"', '\"'), '') || '"' ||
              ',"canal":"' || v_tp_canal || '"' ||
              ',"relato":"' || REPLACE(v_ds_relato, '"', '\"') || '"' ||
              ',"score_risco":' || TO_CHAR(v_vl_score, 'FM990D00', 'NLS_NUMERIC_CHARACTERS=''.,''') ||
              ',"urgencia":"' || v_tp_urgencia || '"' ||
              ',"status":"' || v_st_triagem || '"}';
    RETURN v_json;
EXCEPTION
    WHEN NO_DATA_FOUND THEN
        RAISE_APPLICATION_ERROR(-20001, 'Exceção 1: triagem não encontrada.');
    WHEN TOO_MANY_ROWS THEN
        RAISE_APPLICATION_ERROR(-20002, 'Exceção 2: relacionamento retornou mais de uma linha.');
    WHEN VALUE_ERROR THEN
        RAISE_APPLICATION_ERROR(-20003, 'Exceção 3: erro de conversão ou tamanho do JSON.');
    WHEN OTHERS THEN
        RAISE_APPLICATION_ERROR(-20004, 'Exceção 4: erro inesperado na função JSON: ' || SQLERRM);
END;
/

/* =============================== 5. FUNÇÃO 2 ============================== */

-- Substitui uma regra lógica do sistema, classificando a urgência.
CREATE OR REPLACE FUNCTION FN_T_CH_CLASSIFICAR_URGENCIA (
    p_vl_score_risco IN NUMBER,
    p_fl_sinal_alerta IN NUMBER
) RETURN VARCHAR2
IS
BEGIN
    IF p_vl_score_risco IS NULL OR p_vl_score_risco < 0 OR p_vl_score_risco > 100 THEN
        RAISE_APPLICATION_ERROR(-20011, 'Exceção 1: score deve estar entre 0 e 100.');
    ELSIF p_fl_sinal_alerta IS NULL OR p_fl_sinal_alertA NOT IN (0, 1) THEN
        RAISE_APPLICATION_ERROR(-20012, 'Exceção 2: sinal de alerta deve ser 0 ou 1.');
    ELSIF p_fl_sinal_alerta = 1 OR p_vl_score_risco >= 80 THEN
        RETURN 'EMERGENCIA';
    ELSIF p_vl_score_risco >= 60 THEN
        RETURN 'ALTA';
    ELSIF p_vl_score_risco >= 30 THEN
        RETURN 'MEDIA';
    ELSE
        RETURN 'BAIXA';
    END IF;
EXCEPTION
    WHEN VALUE_ERROR THEN
        RAISE_APPLICATION_ERROR(-20013, 'Exceção 3: valor inválido recebido.');
    WHEN OTHERS THEN
        IF SQLCODE BETWEEN -20099 AND -20000 THEN
            RAISE;
        END IF;
        RAISE_APPLICATION_ERROR(-20014, 'Exceção 4: erro inesperado na classificação: ' || SQLERRM);
END;
/

/* ============================ 6. PROCEDIMENTO 1 ========================== */

-- Realiza JOIN de quatro tabelas e exibe a função de conversão manual JSON.
CREATE OR REPLACE PROCEDURE PR_T_CH_EXIBIR_TRIAGEM_JSON (
    p_id_triagem IN T_CH_TRIAGEM.id_triagem%TYPE
)
IS
    v_json CLOB;
BEGIN
    v_json := FN_T_CH_TRIAGEM_JSON(p_id_triagem);
    DBMS_OUTPUT.PUT_LINE(DBMS_LOB.SUBSTR(v_json, 32767, 1));
EXCEPTION
    WHEN NO_DATA_FOUND THEN
        RAISE_APPLICATION_ERROR(-20101, 'Exceção 1: dados relacionados não encontrados.');
    WHEN VALUE_ERROR THEN
        RAISE_APPLICATION_ERROR(-20102, 'Exceção 2: erro de formato na saída.');
    WHEN OTHERS THEN
        RAISE_APPLICATION_ERROR(-20103, 'Exceção 3: erro no Procedimento 1: ' || SQLERRM);
END;
/

/* ============================ 7. PROCEDIMENTO 2 ========================== */

-- Lê a tabela de fatos e calcula manualmente:
-- a) subtotal da combinação clínica + tipo de cuidado;
-- b) subtotal da primeira categoria, a clínica;
-- c) total geral.
-- Não utiliza ROLLUP, CUBE, GROUPING SETS ou GROUPING.
CREATE OR REPLACE PROCEDURE PR_T_CH_RESUMO_FATOS
IS
    v_id_clinica_atual T_CH_FATO_CUIDADO.id_clinica%TYPE := NULL;
    v_tp_cuidado_atual T_CH_FATO_CUIDADO.tp_cuidado%TYPE := NULL;
    v_vl_combinacao NUMBER := 0;
    v_vl_subtotal NUMBER := 0;
    v_vl_total NUMBER := 0;
    v_tem_linha BOOLEAN := FALSE;
    v_nm_clinica T_CH_CLINICA.nm_clinica%TYPE;

    CURSOR c_fatos IS
        SELECT f.id_clinica, c.nm_clinica, f.tp_cuidado,
               f.vl_cuidado, f.id_fato
          FROM T_CH_FATO_CUIDADO f
          JOIN T_CH_CLINICA c ON c.id_clinica = f.id_clinica
         ORDER BY f.id_clinica, f.tp_cuidado, f.id_fato;
BEGIN
    DBMS_OUTPUT.PUT_LINE('============================================');
    DBMS_OUTPUT.PUT_LINE('RESUMO MANUAL DA TABELA DE FATOS');
    DBMS_OUTPUT.PUT_LINE('============================================');

    FOR r IN c_fatos LOOP
        v_tem_linha := TRUE;

        IF v_id_clinica_atual IS NULL THEN
            v_id_clinica_atual := r.id_clinica;
            v_nm_clinica := r.nm_clinica;
            v_tp_cuidado_atual := r.tp_cuidado;
        ELSIF v_id_clinica_atual <> r.id_clinica THEN
            DBMS_OUTPUT.PUT_LINE('Subtotal combinação (' || v_nm_clinica || ', ' ||
                                 v_tp_cuidado_atual || '): ' ||
                                 TO_CHAR(v_vl_combinacao, 'FM999999990D00'));
            DBMS_OUTPUT.PUT_LINE('Subtotal clínica (' || v_nm_clinica || '): ' ||
                                 TO_CHAR(v_vl_subtotal, 'FM999999990D00'));
            v_vl_combinacao := 0;
            v_vl_subtotal := 0;
            v_id_clinica_atual := r.id_clinica;
            v_nm_clinica := r.nm_clinica;
            v_tp_cuidado_atual := r.tp_cuidado;
        ELSIF v_tp_cuidado_atual <> r.tp_cuidado THEN
            DBMS_OUTPUT.PUT_LINE('Subtotal combinação (' || v_nm_clinica || ', ' ||
                                 v_tp_cuidado_atual || '): ' ||
                                 TO_CHAR(v_vl_combinacao, 'FM999999990D00'));
            v_vl_combinacao := 0;
            v_tp_cuidado_atual := r.tp_cuidado;
        END IF;

        v_vl_combinacao := v_vl_combinacao + NVL(r.vl_cuidado, 0);
        v_vl_subtotal := v_vl_subtotal + NVL(r.vl_cuidado, 0);
        v_vl_total := v_vl_total + NVL(r.vl_cuidado, 0);

        DBMS_OUTPUT.PUT_LINE('Detalhe | Clínica: ' || r.nm_clinica ||
                             ' | Cuidado: ' || r.tp_cuidado ||
                             ' | Valor: ' || TO_CHAR(r.vl_cuidado, 'FM999999990D00'));
    END LOOP;

    IF NOT v_tem_linha THEN
        RAISE_APPLICATION_ERROR(-20201, 'Exceção 1: tabela de fatos sem linhas detalhadas.');
    END IF;

    DBMS_OUTPUT.PUT_LINE('Subtotal combinação (' || v_nm_clinica || ', ' ||
                         v_tp_cuidado_atual || '): ' ||
                         TO_CHAR(v_vl_combinacao, 'FM999999990D00'));
    DBMS_OUTPUT.PUT_LINE('Subtotal clínica (' || v_nm_clinica || '): ' ||
                         TO_CHAR(v_vl_subtotal, 'FM999999990D00'));
    DBMS_OUTPUT.PUT_LINE('TOTAL GERAL: ' || TO_CHAR(v_vl_total, 'FM999999990D00'));
EXCEPTION
    WHEN NO_DATA_FOUND THEN
        RAISE_APPLICATION_ERROR(-20202, 'Exceção 2: clínica relacionada ao fato não encontrada.');
    WHEN VALUE_ERROR THEN
        RAISE_APPLICATION_ERROR(-20203, 'Exceção 3: erro de conversão numérica.');
    WHEN OTHERS THEN
        IF SQLCODE BETWEEN -20299 AND -20200 THEN
            RAISE;
        END IF;
        RAISE_APPLICATION_ERROR(-20204, 'Exceção 4: erro inesperado no Procedimento 2: ' || SQLERRM);
END;
/

COMMIT;

/* ========================= 8. TESTES DE SUCESSO =========================== */

PROMPT ===== TESTE DA FUNCAO 2 =====
SELECT FN_T_CH_CLASSIFICAR_URGENCIA(88, 0) AS resultado FROM DUAL;
SELECT FN_T_CH_CLASSIFICAR_URGENCIA(35, 0) AS resultado FROM DUAL;
SELECT FN_T_CH_CLASSIFICAR_URGENCIA(10, 0) AS resultado FROM DUAL;

PROMPT ===== TESTE DO PROCEDIMENTO 1 / FUNCAO 1 =====
DECLARE
    v_id_triagem T_CH_TRIAGEM.id_triagem%TYPE;
BEGIN
    SELECT MIN(id_triagem) INTO v_id_triagem FROM T_CH_TRIAGEM;
    PR_T_CH_EXIBIR_TRIAGEM_JSON(v_id_triagem);
END;
/

PROMPT ===== TESTE DO PROCEDIMENTO 2 =====
BEGIN
    PR_T_CH_RESUMO_FATOS;
END;
/

PROMPT ===== TESTE DA AUDITORIA =====
SELECT id_auditoria, nm_usuario, tp_operacao, dh_operacao,
       nm_tabela, id_registro, ds_valor_anterior, ds_valor_novo
  FROM T_CH_AUDITORIA_DML
 ORDER BY id_auditoria;

-- Teste explícito das três operações DML do trigger.
-- O registro temporário é inserido, atualizado e excluído, mantendo cinco
-- triagens válidas ao final da execução e gerando três eventos de auditoria.
DECLARE
    v_id_pet T_CH_PET.id_pet%TYPE;
    v_id_clinica T_CH_CLINICA.id_clinica%TYPE;
    v_id_tutor T_CH_TUTOR.id_tutor%TYPE;
    v_id_triagem T_CH_TRIAGEM.id_triagem%TYPE;
BEGIN
    SELECT id_pet INTO v_id_pet FROM T_CH_PET WHERE nm_pet = 'Thor';
    SELECT id_clinica INTO v_id_clinica FROM T_CH_CLINICA WHERE nm_clinica = 'Clínica Vet Vida';
    SELECT id_tutor INTO v_id_tutor FROM T_CH_TUTOR WHERE nr_telefone = '(11) 99999-1001';

    INSERT INTO T_CH_TRIAGEM (
        id_pet, id_clinica, id_tutor, tp_canal, ds_relato,
        vl_score_risco, tp_urgencia, ds_analise_visual, st_triagem
    ) VALUES (
        v_id_pet, v_id_clinica, v_id_tutor, 'TEXTO',
        'Registro temporário para teste do trigger DML.',
        20, 'BAIXA', 'Teste de auditoria', 'ABERTA'
    ) RETURNING id_triagem INTO v_id_triagem;

    UPDATE T_CH_TRIAGEM
       SET vl_score_risco = 25,
           ds_relato = 'Registro temporário atualizado para teste do trigger.'
     WHERE id_triagem = v_id_triagem;

    DELETE FROM T_CH_TRIAGEM WHERE id_triagem = v_id_triagem;
    COMMIT;
    DBMS_OUTPUT.PUT_LINE('TESTE DML DO TRIGGER CONCLUÍDO: INSERT, UPDATE E DELETE.');
EXCEPTION
    WHEN NO_DATA_FOUND THEN
        ROLLBACK;
        DBMS_OUTPUT.PUT_LINE('TESTE DML DO TRIGGER — erro de relacionamento: ' || SQLERRM);
    WHEN OTHERS THEN
        ROLLBACK;
        DBMS_OUTPUT.PUT_LINE('TESTE DML DO TRIGGER — erro inesperado: ' || SQLERRM);
END;
/

PROMPT ===== CONFERENCIA FINAL DA AUDITORIA =====
SELECT tp_operacao, COUNT(*) AS qt_operacoes
  FROM T_CH_AUDITORIA_DML
 GROUP BY tp_operacao
 ORDER BY tp_operacao;

/* ========================= 9. TESTES DE EXCEÇÕES ========================== */

-- Exceção da Função 1: ID inexistente.
BEGIN
    DBMS_OUTPUT.PUT_LINE(FN_T_CH_TRIAGEM_JSON(-99999));
EXCEPTION
    WHEN OTHERS THEN
        DBMS_OUTPUT.PUT_LINE('TESTE EXCEÇÃO FUNÇÃO 1: ' || SQLERRM);
END;
/

-- Exceção da Função 2: score fora do intervalo permitido.
BEGIN
    DBMS_OUTPUT.PUT_LINE(FN_T_CH_CLASSIFICAR_URGENCIA(150, 0));
EXCEPTION
    WHEN OTHERS THEN
        DBMS_OUTPUT.PUT_LINE('TESTE EXCEÇÃO FUNÇÃO 2: ' || SQLERRM);
END;
/

-- Exceção da Função 2: indicador de sinal inválido.
BEGIN
    DBMS_OUTPUT.PUT_LINE(FN_T_CH_CLASSIFICAR_URGENCIA(50, 7));
EXCEPTION
    WHEN OTHERS THEN
        DBMS_OUTPUT.PUT_LINE('TESTE EXCEÇÃO FUNÇÃO 2 / SINAL: ' || SQLERRM);
END;
/

-- Exceção do Procedimento 1: triagem inexistente.
BEGIN
    PR_T_CH_EXIBIR_TRIAGEM_JSON(-99999);
EXCEPTION
    WHEN OTHERS THEN
        DBMS_OUTPUT.PUT_LINE('TESTE EXCEÇÃO PROCEDIMENTO 1: ' || SQLERRM);
END;
/

/* ============================= 10. CONTAGENS ============================== */

PROMPT ===== CONTAGEM DE REGISTROS =====
SELECT 'T_CH_USUARIO' AS nm_tabela, COUNT(*) AS qt_registros FROM T_CH_USUARIO UNION ALL
SELECT 'T_CH_TUTOR', COUNT(*) FROM T_CH_TUTOR UNION ALL
SELECT 'T_CH_CLINICA', COUNT(*) FROM T_CH_CLINICA UNION ALL
SELECT 'T_CH_PET', COUNT(*) FROM T_CH_PET UNION ALL
SELECT 'T_CH_PET_TUTOR', COUNT(*) FROM T_CH_PET_TUTOR UNION ALL
SELECT 'T_CH_TRIAGEM', COUNT(*) FROM T_CH_TRIAGEM UNION ALL
SELECT 'T_CH_ALERTA', COUNT(*) FROM T_CH_ALERTA UNION ALL
SELECT 'T_CH_FATO_CUIDADO', COUNT(*) FROM T_CH_FATO_CUIDADO UNION ALL
SELECT 'T_CH_AUDITORIA_DML', COUNT(*) FROM T_CH_AUDITORIA_DML;