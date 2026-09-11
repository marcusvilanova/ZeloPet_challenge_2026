# Zelo — Java Advanced (Sprint 3) · Challenge FIAP 2026

> **Zelo: cuidado contínuo antes da urgência.**
> Uma plataforma que conecta tutores, clínicas veterinárias e um núcleo de IA para transformar o cuidado com pets em algo contínuo, e não apenas uma reação quando já é emergência.

Este repositório contém a parte de **Java Advanced** (Sprint 3, entrega 12/09) do projeto Zelo, que desenvolvemos para o Challenge FIAP 2026. 

- **Disciplina:** Java Advanced — Sprint 3
- **Stack:** Java 17 · Spring Boot 3.3.4 · Spring MVC + Thymeleaf · Spring Data JPA/Hibernate · Flyway · Spring Security · Bean Validation · Lombok · H2 (dev/test) e Oracle (produção)

### Integrantes do grupo (Challenge FIAP 2026 — projeto Zelo)

| Nome | RM |
|---|---|
| Gabriel Robertoni Padilha | 566293 |
| Hebert Lopes dos Santos | 563192 |
| Nicolas Monteiro Ramiro | 562380 |
| Marcus Vinícius Vila Nova da Silva | 558771 |
| Bruno Ferreira | 563489 |

---

## Sumário

- [Como executar](#como-executar)
- [Contas de demonstração](#contas-de-demonstração)
- [Arquitetura e decisões técnicas](#arquitetura-e-decisões-técnicas)
- [Os dois fluxos completos exigidos pela Sprint 3](#os-dois-fluxos-completos-exigidos-pela-sprint-3)
- [Como esse projeto se conecta ao banco do time de Banco de Dados](#como-esse-projeto-se-conecta-ao-banco-do-time-de-banco-de-dados)
- [Decisões que tomamos durante o desenvolvimento](#decisões-que-tomamos-durante-o-desenvolvimento)
- [Mapeamento com a rubrica de Java Advanced](#mapeamento-com-a-rubrica-de-java-advanced)
- [Testes automatizados](#testes-automatizados)
- [Estrutura do projeto](#estrutura-do-projeto)

---

## Como executar

### Pré-requisitos

- JDK 17+
- Maven 3.9+
- Acesso à internet liberado para o Maven Central na primeira build (baixa as dependências)

### Opção 1 — perfil `oracle` (padrão, banco Oracle real do time de Banco de Dados)

- **Variáveis de ambiente**: definimos `ORACLE_USER` e `ORACLE_PASSWORD` antes de rodar (no terminal, ou em Run/Debug Configurations → Environment variables no IntelliJ). `ORACLE_URL` já vem com um valor padrão apontando para `oracle.fiap.com.br:1521:ORCL`.
- **Arquivo local `src/main/resources/application-oracle.yml`**: contém só `spring.datasource.username`/`password`, carregado automaticamente pelo Spring Boot quando o perfil `oracle` está ativo. Deixamos esse arquivo no `.gitignore`, então ele nunca vai para o GitHub — em outra máquina ele simplesmente não existe, e a aplicação cai nos valores de exemplo até alguém criar o seu.

```bash
mvn spring-boot:run
```

Sobe em `http://localhost:8080`. O Flyway aplica só a migration incremental (`db/migration/oracle`) e os dados cadastrados ficam gravados de verdade no banco do grupo.

### Opção 2 — perfil `dev` (H2 em memória, sem depender de rede/credenciais)

Usamos esse perfil quando não há acesso à rede da FIAP — em casa, sem VPN, por exemplo. Os dados não persistem entre execuções, já que ficam só em memória:

```bash
mvn spring-boot:run -Dspring-boot.run.profiles=dev
```

Console H2 disponível em `http://localhost:8080/h2-console` (JDBC URL: `jdbc:h2:mem:zelodb`, usuário `sa`, senha em branco).

Nenhuma linha de código muda entre os dois perfis — só a flag.

### Gerar o JAR

```bash
mvn clean package
java -jar target/zelo-java.jar
```

(usa o perfil `oracle` por padrão — passe `--spring.profiles.active=dev` se quiser H2)

---

## Contas de demonstração

Criadas pela migration `V2__seed_data.sql`. Senha igual para todas: `Zelo@123`.

| Perfil | E-mail | O que consegue fazer |
|---|---|---|
| TUTOR | `tutor@zelo.com.br` | Cadastrar pets, abrir triagens, ver e confirmar o plano de cuidado |
| VETERINARIO | `veterinario@zelo.com.br` | Painel da clínica, fila de triagens, gerenciar alertas |
| GESTOR | `gestor@zelo.com.br` | Tudo o que o veterinário faz, além de administrar o cadastro da clínica |

Também é possível criar uma conta de tutor livremente pela tela de cadastro — deixamos o autocadastro público só para o perfil TUTOR (o motivo está explicado mais abaixo).

---

## Arquitetura e decisões técnicas

- **Escolhemos Spring MVC + Thymeleaf** em vez de uma SPA separada: essa opção cobre o requisito de frontend com menos risco de integração dentro do prazo da sprint, e nos permite usar `thymeleaf-extras-springsecurity6` (`sec:authorize`) para mostrar ou esconder elementos por perfil direto no template.
- **Usamos Bootstrap 5 via CDN** como base, com uma identidade visual própria construída por cima (`static/css/app.css`): paleta verde e coral, tipografia Poppins/Inter, navbar com efeito de vidro, cartões com sombra e uma landing page própria.
- **Implementamos o Flyway** com duas migrations, rodando tanto no H2 (modo Oracle) em dev/test quanto no Oracle real — o mesmo SQL nos dois ambientes, já que escrevemos a sintaxe pensando em Oracle desde o início (`NUMBER`, `VARCHAR2`, `CHECK` etc).
- **Configuramos o Spring Security** com `DaoAuthenticationProvider` e `BCryptPasswordEncoder`, com três perfis (TUTOR/VETERINARIO/GESTOR), rotas protegidas por prefixo e redirecionamento pós-login que muda conforme o perfil. Deixamos o CSRF ativo em toda a aplicação, exceto em `/h2-console/**`.
- **Construímos uma camada de serviço com regra de negócio de verdade**, não um CRUD anêmico: `TriagemService` e `AlertaService` têm uma máquina de estado com validação de transição, e lançam exceções de negócio próprias, tratadas tanto localmente (mensagem flash) quanto de forma global (`GlobalExceptionHandler`).
- **A classificação de urgência** (`ClassificadorDeUrgencia`) é determinística — vale deixar claro que isso não é o núcleo de IA do Zelo (essa parte fica para a disciplina de Disruptive Architectures, em outra sprint). Aqui usamos uma regra por palavra-chave com pontuação, sem nenhum modelo de IA em execução.

---

## Os dois fluxos completos exigidos pela Sprint 3

### 1. Triagem e Encaminhamento (`TriagemService`, tabela `T_CH_TRIAGEM`)

O tutor relata o que está acontecendo com o pet, o sistema classifica a urgência automaticamente (BAIXA/MEDIA/ALTA/EMERGENCIA) e a triagem entra na fila da clínica, priorizada por urgência e depois por ordem de chegada. A clínica encaminha e conclui o atendimento, ou qualquer um dos dois lados pode cancelar:

```
ABERTA --(clínica encaminha)--> ENCAMINHADA --(atendimento)--> ATENDIDA
    \_____________________(tutor ou clínica cancela)_____________________/--> CANCELADA
```

### 2. Alertas e Plano de Cuidado (`AlertaService`, tabela `T_CH_ALERTA`)

Lembretes de vacina, retorno e medicamento — criados pelo tutor ou pela clínica — passam por um ciclo de confirmação:

```
PENDENTE --(clínica dispara)--> ENVIADO --(tutor confirma)--> CONCLUIDO
    \_______________________(cancelado por qualquer lado)_______________________/--> CANCELADO
```

Implementamos validação completa nos dois fluxos (Bean Validation nos DTOs) e fomos além do CRUD básico: classificação automática, fila priorizada, máquina de estado com transições negadas por regra, e checagem de posse (um tutor não acessa pet de outro tutor, e uma clínica não mexe na triagem de outra clínica).

---

## Como esse projeto se conecta ao banco do time de Banco de Dados

Reescrevemos essa seção depois de recebermos o DDL de verdade do time de Banco de Dados (`zelo_criar.sql`). No final, ficou definido assim: **o time de Banco de Dados cria e é dono do schema inteiro**, e a aplicação Java roda em cima desse schema já existente, em vez de criá-lo do zero.

| Quem cria | O quê | Onde |
|---|---|---|
| Time de Banco de Dados (`zelo_criar.sql`, fora deste repo) | As 7 tabelas operacionais (`T_CH_USUARIO`, `T_CH_TUTOR`, `T_CH_CLINICA`, `T_CH_PET`, `T_CH_PET_TUTOR`, `T_CH_TRIAGEM`, `T_CH_ALERTA`) + `T_CH_FATO_CUIDADO` e `T_CH_AUDITORIA_DML` | Script PL/SQL da disciplina de Database |
| Este projeto (Flyway, perfil `oracle`) | Só `T_CH_CLINICA_EQUIPE` (tabela extra que não está no DDL deles) + massa de dados mínima de login | `src/main/resources/db/migration/oracle/` |

Remapeamos as entidades JPA para bater exatamente com os nomes reais do DDL deles (`T_CH_<ENTIDADE>`, colunas com prefixo `id_`/`nm_`/`ds_`/`tp_`/`st_`...).

**Ordem que importa na instância real:** primeiro o time de banco roda `zelo_criar.sql` (cria as 9 tabelas, sem inserir nada); só depois disso rodamos a aplicação Java com o perfil `oracle` — aí sim o Flyway aplica `V1__create_equipe_table.sql` e `V2__seed_data.sql`. Se invertermos essa ordem, o boot quebra com `table or view does not exist`.

As credenciais do Oracle vêm por variável de ambiente (`ORACLE_URL`/`ORACLE_USER`/`ORACLE_PASSWORD`) ou pelo arquivo local `application-oracle.yml` — nunca gravamos credenciais no `application.yml` principal.

---

## Decisões que tomamos durante o desenvolvimento

1. **Escolhemos três perfis (TUTOR/VETERINARIO/GESTOR)** porque eles vêm direto do `CHECK` da coluna `tp_usuario` no DDL do time de banco — assim evitamos qualquer divergência entre o schema deles e a aplicação.
2. **Criamos a tabela extra `T_CH_CLINICA_EQUIPE`**, que não existe no `zelo_criar.sql` deles, porque precisávamos vincular VETERINARIO/GESTOR a uma clínica (relação N:N). Como nenhuma FK deles aponta para ela, a criamos separadamente tanto no schema de dev/test quanto no Oracle real, sem interferir no que já existia.
3. **Decidimos não abrir autocadastro público para VETERINARIO/GESTOR** — só TUTOR se cadastra sozinho. O perfil de clínica entra via seed ou por um GESTOR já existente, para que ninguém consiga se autopromover a integrante de uma clínica.
4. **Escolhemos os dois fluxos (Triagem e Alertas)** porque mapeiam diretamente para as tabelas `T_CH_TRIAGEM`/`T_CH_ALERTA` e representam o núcleo do produto Zelo (triagem inteligente e cuidado contínuo).
5. **Optamos por exclusão lógica de clínica** (`st_clinica` S/N), para preservar o histórico de triagens e alertas que têm FK para a clínica.
6. **Na exclusão de pet, decidimos bloquear quando já existe histórico**, em vez de deixar a constraint do banco estourar um erro feio — o `PetController` trata isso com uma mensagem amigável.
7. **Mantivemos o `StatusTriagem` seguindo o `CHECK` real** (ABERTA/ENCAMINHADA/ATENDIDA/CANCELADA) — não existe um estado "em análise" separado porque o DDL deles não previu isso.
8. **Seguimos o desenho do time de banco em `T_CH_PET_TUTOR`**, que usa uma PK própria (`id_pet_tutor`) em vez de PK composta — por isso a entidade `PetTutor` usa um `Long id` simples.
9. **Trocamos o perfil padrão para `oracle`**, combinado com o professor, para que os dados persistam de verdade. Sabemos do trade-off: quem rodar o projeto sem acesso à rede da FIAP ou sem a credencial configurada vai ver o boot falhar — nesse caso, basta usar `SPRING_PROFILES_ACTIVE=dev`. O perfil `test` não foi afetado e continua fixo em H2.

---

## Mapeamento com a rubrica de Java Advanced

| Critério | Onde está |
|---|---|
| Frontend (30 pts) | Thymeleaf + Bootstrap 5, uma tela por caso de uso, validação client e server-side visível |
| Versionamento de banco com Flyway (20 pts) | Migrations em dev/test e oracle, `ddl-auto: none` (só o Flyway/script do time de banco mexe no schema) |
| Spring Security, 2+ perfis, proteção de rotas (30 pts) | `SecurityConfig` — TUTOR/VETERINARIO/GESTOR, rotas por prefixo, login com redirect por perfil, CSRF, BCrypt |
| 2 fluxos completos além de CRUD, com validação (20 pts) | Triagem/Encaminhamento e Alertas/Plano de Cuidado, Bean Validation nos DTOs |
| Qualidade de código | Camadas separadas (controller/service/repository/DTO), exceções de domínio próprias, sem código morto |

---

## Testes automatizados

Organizamos a suíte em `src/test/java`.

| Classe | O que valida |
|---|---|
| `ClassificadorDeUrgenciaTest` | Regra de classificação por palavra-chave: cada nível, normalização de acento/caixa, teto de 100 |
| `TriagemServiceTest` | Abertura de triagem, ordenação da fila, transições de status permitidas e negadas |
| `AlertaServiceTest` | Criação, envio, confirmação, cancelamento, checagem de posse |
| `PetServiceTest` | Cadastro cria o vínculo Pet-Tutor, checagem de posse antes de editar ou excluir |
| `RepositoriosJpaTest` | `@DataJpaTest` contra H2 real com Flyway rodando, confirma queries JPQL e inserts |
| `SecurityRouteProtectionTest` | Redirecionamento para login, 403 entre perfis, CSRF obrigatório |
| `ZeloApplicationTests` | Smoke test — o contexto Spring completo sobe com o perfil `test` |

---

## Estrutura do projeto

```
src/main/java/br/com/fiap/zelo/
├── domain/            entidades JPA + enums
├── repository/        Spring Data JPA + queries customizadas
├── security/          UserDetails, success handler, contexto do usuário logado
├── service/           regras de negócio, máquina de estado, classificador de urgência
├── web/controller/    controllers MVC (auth, dashboard, pets, triagens, alertas, clínica)
├── web/dto/           formulários com Bean Validation
├── web/advice/        tratamento global de exceções
└── config/            Spring Security

src/main/resources/
├── db/migration/dev/      Flyway para o H2 (dev/test) — schema completo + seed
├── db/migration/oracle/   Flyway para o Oracle real — só T_CH_CLINICA_EQUIPE + seed mínimo
├── templates/             Thymeleaf
└── static/css/            identidade visual

src/test/java/...       JUnit 5 + Mockito + AssertJ + Spring Boot Test
```
