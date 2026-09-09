# Advanced Business Development with .NET - Projeto Zelo

Este módulo contém a API RESTful desenvolvida em ASP.NET Core, integrando com o banco de dados Oracle, como parte do Challenge 2026.

## Equipe Desenvolvedora
- Hebert Lopes do santos (RM: 563192)
- Marcus Vinícius Vila Nova da Silva (RM: 558771)
- Nicolas Monteiro Ramiro (RM: 562380)
- Gabriel Robertoni Padilha (RM: 566293)
- Bruno Ferreira (RM: 563489)

## Objetivo do Projeto
Desenvolver uma API RESTful utilizando ASP.NET Core (Controllers), aplicando boas práticas de desenvolvimento, estruturação de rotas, integração com banco de dados Oracle via Entity Framework Core, autenticação, observabilidade e documentação profissional da aplicação com Swagger.

## Tecnologias Utilizadas
- .NET 8.0
- ASP.NET Core Web API
- Entity Framework Core + Oracle Database
- Autenticação JWT (Bearer)
- Serilog (logging estruturado)
- OpenTelemetry (tracing distribuído e métricas)
- Health Checks (Microsoft.Extensions.Diagnostics.HealthChecks)
- xUnit + Moq (testes unitários e de integração)
- Swagger/OpenAPI

## Funcionalidades Implementadas

### Sprints anteriores
- CRUD completo de Tutores e Pets.
- Busca com parâmetros (filtros por nome e espécie) e paginação de resultados.
- Migrations para controle de versão do banco.
- Validações de modelo e retornos HTTP corretos (200, 201, 204, 400, 404, 409, 401).
- Documentação Swagger com comentários XML.

### 3ª Sprint (esta entrega)
- **Modelagem de dados atualizada**: entidades `ZELO_USUARIO`, `ZELO_TUTOR`, `ZELO_PET` e `ZELO_PET_TUTOR`, alinhadas à modelagem relacional oficial do projeto Zelo (usuário como identidade base, tutor como especialização 1:1, relação N:N entre pets e tutores para suportar múltiplos responsáveis pelo mesmo animal).
- **Autenticação JWT**: cadastro de tutor (`POST /api/tutores`) cria o usuário de acesso com senha protegida por hash (`PasswordHasher`); login (`POST /api/auth/login`) retorna um token Bearer. Endpoints de consulta/alteração de Tutores e todos os endpoints de Pets exigem autenticação.
- **Health Checks e Observabilidade**: endpoints de verificação de saúde da API, da conexão com o banco Oracle e de disponibilidade de serviço externo.
- **Logging estruturado** com Serilog, em console e arquivo, com níveis Information/Warning/Error.
- **Tracing distribuído e métricas** com OpenTelemetry.
- **Testes automatizados** unitários (camada de serviços/domínio, com mocks) e de integração (endpoints reais via `WebApplicationFactory`).

## Como Executar

### Pré-requisitos
- SDK do .NET 8.0 instalado.
- Acesso a um banco de dados Oracle.

### Configuração do Banco de Dados
1. Abra o arquivo `ZeloApi.Net/appsettings.json`.
2. A string de conexão `OracleConnection` já está configurada com as credenciais do ambiente acadêmico.
3. Aplique as migrations para criar as tabelas `ZELO_USUARIO`, `ZELO_TUTOR`, `ZELO_PET` e `ZELO_PET_TUTOR`:
   ```bash
   cd ZeloApi.Net
   dotnet ef database update
   ```

### Executando a Aplicação
```bash
cd ZeloApi.Net
dotnet restore
dotnet run
```
A API estará disponível em http://localhost:5000 (ou na porta exibida no console).
A documentação Swagger pode ser acessada na raiz (`/`).

## Autenticação

1. Cadastre um tutor em `POST /api/tutores` (endpoint público) informando `nome`, `email`, `senha`, `telefone`, `cidade` e `estado`.
2. Faça login em `POST /api/auth/login` com `email` e `senha`. A resposta traz o `token` JWT e sua validade.
3. Envie o token nas próximas requisições protegidas no cabeçalho:
   ```
   Authorization: Bearer {token}
   ```

## Documentação das Rotas

### Auth
- `POST /api/auth/login` — Autentica um usuário e retorna um token JWT. (público)

### Tutores
- `GET /api/tutores` — Lista tutores (paginação `?page=1&size=10`, busca `?nome=Maria`). **Requer autenticação.**
- `GET /api/tutores/{id}` — Retorna um tutor específico. **Requer autenticação.**
- `POST /api/tutores` — Cadastra um novo tutor (cria também o usuário de acesso). (público)
- `PUT /api/tutores/{id}` — Atualiza um tutor existente. **Requer autenticação.**
- `DELETE /api/tutores/{id}` — Remove um tutor existente. **Requer autenticação.**

### Pets
- `GET /api/pets` — Lista pets (paginação `?page=1&size=10`, busca `?nome=Rex&especie=Cachorro`). **Requer autenticação.**
- `GET /api/pets/{id}` — Retorna um pet específico. **Requer autenticação.**
- `POST /api/pets` — Cria um novo pet vinculado a um tutor (`tutorId`). **Requer autenticação.**
- `PUT /api/pets/{id}` — Atualiza um pet existente. **Requer autenticação.**
- `DELETE /api/pets/{id}` — Remove um pet existente. **Requer autenticação.**

## Monitoramento e Observabilidade

### Health Checks
| Endpoint | Verificações | Uso |
|---|---|---|
| `GET /health` | API, banco de dados Oracle e serviço externo | Visão geral do estado da aplicação |
| `GET /health/live` | Somente a API (liveness) | Usado por orquestradores para saber se o processo está de pé |
| `GET /health/ready` | Banco de dados e serviço externo (readiness) | Usado por orquestradores para saber se a API está pronta para receber tráfego |

A resposta é um JSON com o status geral e o detalhamento de cada verificação (nome, status, descrição e duração), por exemplo:
```json
{
  "status": "Healthy",
  "totalDurationMs": 12.4,
  "checks": [
    { "name": "self", "status": "Healthy", "description": "API em execução", "durationMs": 0.01 },
    { "name": "oracle-database", "status": "Healthy", "description": "Conexão com o banco de dados Oracle estabelecida com sucesso", "durationMs": 10.2 },
    { "name": "external-service", "status": "Degraded", "description": "Núcleo de Inteligência (IA) não configurado (HealthChecks:ExternalService:Url)", "durationMs": 0.01 }
  ]
}
```
O serviço externo verificado (`external-service`) representa a dependência com o núcleo de inteligência do ecossistema Zelo; sua URL é configurável em `HealthChecks:ExternalService:Url` no `appsettings.json`. Quando não configurada, o status é `Degraded` (não derruba o `/health`).

### Logging
Os logs estruturados (Serilog) são gravados no console e em arquivo (`ZeloApi.Net/logs/zelo-api-AAAAMMDD.log`, com rotação diária), incluindo requisições HTTP, operações de negócio (login, cadastro, atualização, remoção) em nível `Information`, tentativas inválidas (login/cadastro) em `Warning`, e exceções não tratadas em `Error`.

Toda requisição recebe um **Correlation ID** (cabeçalho `X-Correlation-Id`, reaproveitado se o cliente já enviar um, ou gerado automaticamente). Ele é propagado pelo `CorrelationIdMiddleware` no `LogContext` do Serilog, aparecendo em todas as linhas de log geradas durante aquela requisição — Controller, Service e framework — o que permite rastrear uma mesma chamada entre as camadas da aplicação. O mesmo valor também é devolvido no cabeçalho da resposta e no corpo de respostas de erro (`correlationId`).

### Tracing e Métricas
A aplicação utiliza OpenTelemetry para instrumentar automaticamente as requisições HTTP (ASP.NET Core), chamadas HTTP de saída e o Entity Framework Core, exportando os traces para o console. As métricas de desempenho (tempo de resposta, contagem de requisições e taxa de erros por status HTTP) ficam expostas no formato Prometheus em `GET /metrics`.

## Testes

O projeto possui dois projetos de teste, organizados por tipo:

- `ZeloApi.Net.Tests.Unit`: testes unitários (xUnit + Moq) da camada de serviços/domínio, seguindo o padrão AAA (Arrange, Act, Assert) e a convenção de nomenclatura `MetodoTestado_Cenario_ResultadoEsperado`.
- `ZeloApi.Net.Tests.Integration`: testes de integração (xUnit + `WebApplicationFactory`) que sobem a API em memória (com um banco Oracle substituído por um provedor InMemory apenas nos testes) e validam o fluxo real de autenticação e os endpoints HTTP, incluindo respostas de sucesso e de erro.

### Como executar os testes
```bash
dotnet test
```
Para rodar apenas um dos projetos:
```bash
dotnet test ZeloApi.Net.Tests.Unit
dotnet test ZeloApi.Net.Tests.Integration
```

Uma coleção do Postman (`Zelo-API-DotNet.postman_collection.json`) também está incluída na raiz do projeto para facilitar os testes manuais dos endpoints.
