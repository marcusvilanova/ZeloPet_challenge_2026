USE zelo;

-- 1. CONSULTA: evidencie os dados iniciais e o relacionamento.
SELECT p.id, p.nome, p.especie, p.nome_tutor,
       c.id AS cuidado_id, c.tipo, c.descricao, c.data_prevista, c.status
FROM pets p
JOIN cuidados c ON c.pet_id = p.id
ORDER BY p.id, c.id;

-- 2. APOS O POST DO PET: troque 3 pelo ID devolvido pela API.
SELECT * FROM pets WHERE id = 3;

-- 3. APOS O POST DO CUIDADO: troque 3 pelo ID devolvido pela API.
SELECT * FROM cuidados WHERE id = 3;

-- 4. APOS OS PUTS: prove individualmente as alteracoes.
SELECT * FROM pets WHERE id = 3;
SELECT * FROM cuidados WHERE id = 3;

-- 5. A EXCLUSAO deve respeitar a FK: cuidado primeiro, pet depois.
-- Execute os DELETEs pela API e, depois de cada um, rode o SELECT correspondente.
SELECT * FROM cuidados WHERE id = 3; -- deve retornar zero linhas
SELECT * FROM pets WHERE id = 3;     -- deve retornar zero linhas

-- 6. CONSULTA FINAL: as duas linhas significativas originais permanecem.
SELECT * FROM pets ORDER BY id;
SELECT * FROM cuidados ORDER BY id;
