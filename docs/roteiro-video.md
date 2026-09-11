# Roteiro do vídeo - prova da entrega

Grave em no mínimo 720p, com voz clara, sem legenda e sem cortes durante os testes e a comprovação no banco.

## 1. Abertura e criação na Azure

1. Mostre que a pasta do projeto ainda não existe.
2. Faça `git clone` do repositório. O professor exige que os testes comecem assim.
3. Entre na pasta e mostre brevemente `README.md`, arquitetura e `script_bd.sql`.
4. Execute o login e confirme a assinatura: `az login` e `az account show -o table`.
5. Exporte as três senhas apenas no terminal, sem mostrá-las no vídeo.
6. Execute, exatamente na ordem do README, os scripts 01, 02, 03 e 04.
7. Mostre o grupo de recursos, ACR, dois ACIs, Key Vault e Storage pela CLI.

## 2. Aplicação e persistência

1. Abra o FQDN da aplicação e o Swagger.
2. Mostre `/actuator/health` com status `UP`.
3. Consulte as duas linhas iniciais de `pets` e `cuidados` pela API.
4. Entre no MySQL do ACI conforme o README e execute a primeira consulta de `docs/consultas-evidencia.sql`.

## 3. CRUD individual das duas tabelas

Para cada operação, mostre a requisição na aplicação e imediatamente o `SELECT` no banco:

1. POST de um pet; anote o ID e faça `SELECT * FROM pets WHERE id = ID;`.
2. POST de um cuidado associado; anote o ID e faça `SELECT * FROM cuidados WHERE id = ID;`.
3. PUT do pet; faça o SELECT e destaque `nome_tutor` alterado.
4. PUT do cuidado; faça o SELECT e destaque descrição e status alterados.
5. GET das coleções e GET individual de cada registro.
6. DELETE do cuidado; faça SELECT e mostre zero linhas.
7. DELETE do pet; faça SELECT e mostre zero linhas.

## 4. Prova de persistência

1. Reinicie o ACI do banco.
2. Aguarde voltar ao estado `Running`.
3. Faça novamente os SELECTs das duas linhas iniciais.
4. Explique que o Azure Files preserva `/var/lib/mysql` mesmo após o reinício.

## 5. Fechamento

Mostre `az container list`, `az acr repository list` e os logs dos dois containers. Reforce que aplicação e banco estão containerizados, o app executa como usuário `10001` e todos os recursos foram criados por CLI.
