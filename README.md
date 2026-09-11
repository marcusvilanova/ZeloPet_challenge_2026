# Zelo — Java Advanced (Sprint 3) · Challenge FIAP 2026

> **Zelo: cuidado contínuo antes da urgência.**
> Plataforma que conecta tutores, clínicas veterinárias e um núcleo de IA pra transformar o cuidado com pets em algo contínuo, e não só uma reação quando já é emergência.

Esse repositório é só a parte de **Java Advanced** (Sprint 3, entrega 12/09) dentro do projeto Zelo do Challenge FIAP 2026. As outras disciplinas (Banco de Dados, .NET, DevOps, Mobile, Disruptive Architectures) ficam com o resto do grupo e não entram aqui.

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
- [Decisões que tomei durante o desenvolvimento](#decisões-que-tomei-durante-o-desenvolvimento)
- [Mapeamento com a rubrica de Java Advanced](#mapeamento-com-a-rubrica-de-java-advanced)
- [Problemas que apareceram no caminho](#problemas-que-apareceram-no-caminho)
- [Testes automatizados](#testes-automatizados)
- [Estrutura do projeto](#estrutura-do-projeto)
- [O que ainda falta antes de entregar](#o-que-ainda-falta-antes-de-entregar)

---

## Como executar

### Pré-requisitos

- JDK 17+
- Maven 3.9+
- Acesso à internet liberado pro Maven Central na primeira build (baixa as dependências)

### Opção 1 — perfil `oracle` (padrão, banco Oracle real do time de Banco de Dados)

Troquei o perfil padrão de `dev` pra `oracle` porque conversei com o professor e ele confirmou que o certo é a aplicação persistir de verdade no Oracle da FIAP, não só em memória. Então hoje, rodando sem especificar nada, já tenta conectar direto na instância real.

Pré-requisito: o time de Banco de Dados já precisa ter rodado o `zelo_criar.sql` deles no schema (ver seção mais abaixo sobre a ordem certa). As credenciais nunca ficam no `application.yml` (o repo é público), tem duas formas de passar:

- **Variáveis de ambiente**: `ORACLE_USER` e `ORACLE_PASSWORD` antes de rodar (no terminal, ou em Run/Debug Configurations → Environment variables no IntelliJ). `ORACLE_URL` já vem com um padrão apontando pro `oracle.fiap.com.br:1521:ORCL`.
- **Arquivo local `src/main/resources/application-oracle.yml`**: só com `spring.datasource.username`/`password`, o Spring Boot carrega ele sozinho quando o perfil `oracle` tá ativo. Esse arquivo tá no `.gitignore`, nunca vai pro GitHub — em outra máquina ele simplesmente não existe e cai nos valores de exemplo até alguém criar o seu.

```bash
mvn spring-boot:run
```

Sobe em `http://localhost:8080`. O Flyway só aplica a migration incremental (`db/migration/oracle`) e os dados cadastrados ficam gravados de verdade no banco do grupo.

### Opção 2 — perfil `dev` (H2 em memória, sem depender de rede/credenciais)

Serve pra quando não tem acesso à rede da FIAP, tipo em casa sem VPN. Os dados somem a cada reinício, é só memória:

```bash
mvn spring-boot:run -Dspring-boot.run.profiles=dev
```

Console H2 em `http://localhost:8080/h2-console` (JDBC URL: `jdbc:h2:mem:zelodb`, usuário `sa`, senha em branco).

Não muda nenhuma linha de código entre os dois perfis, é só a flag.

### Gerar o JAR

```bash
mvn clean package
java -jar target/zelo-java.jar
```

(usa o perfil `oracle` por padrão — passa `--spring.profiles.active=dev` se quiser H2)

---

## Contas de demonstração

Criadas pela migration `V2__seed_data.sql`. Senha igual pra todo mundo: `Zelo@123`.

| Perfil | E-mail | O que dá pra fazer |
|---|---|---|
| TUTOR | `tutor@zelo.com.br` | Cadastrar pets, abrir triagens, ver/confirmar plano de cuidado |
| VETERINARIO | `veterinario@zelo.com.br` | Painel da clínica, fila de triagens, gerenciar alertas |
| GESTOR | `gestor@zelo.com.br` | Tudo do veterinário + administrar o cadastro da clínica |

Também dá pra criar conta de tutor livremente pela tela de cadastro — só TUTOR tem autocadastro público (motivo explicado mais abaixo).

---

## Arquitetura e decisões técnicas

- **Spring MVC + Thymeleaf** em vez de SPA separada: cobre o requisito de frontend com menos risco de integração dentro do prazo, e dá pra usar `thymeleaf-extras-springsecurity6` (`sec:authorize`) pra esconder/mostrar coisa por perfil direto no template.
- **Bootstrap 5 via CDN** como base, com uma identidade visual própria por cima (`static/css/app.css`): paleta verde/coral, tipografia Poppins/Inter, navbar com glass effect, cards com sombra, landing page própria.
- **Flyway** com duas migrations rodando tanto no H2 (modo Oracle) em dev/test quanto no Oracle real — mesmo SQL nos dois, já que a sintaxe é pensada em Oracle desde o começo (`NUMBER`, `VARCHAR2`, `CHECK` etc).
- **Spring Security** com `DaoAuthenticationProvider` + `BCryptPasswordEncoder`, três perfis (TUTOR/VETERINARIO/GESTOR), rotas protegidas por prefixo e redirecionamento pós-login que muda por perfil. CSRF ligado em tudo (menos `/h2-console/**`).
- **Camada de serviço com regra de negócio de verdade**, não CRUD anêmico: `TriagemService` e `AlertaService` têm máquina de estado com validação de transição, e lançam exceção de negócio própria tratada tanto local (mensagem flash) quanto global (`GlobalExceptionHandler`).
- **Classificação de urgência determinística** (`ClassificadorDeUrgencia`) — importante: isso **não é** o núcleo de IA do Zelo (isso fica pra Disruptive Architectures em outra sprint). Aqui é regra por palavra-chave com pontuação, nada de modelo de IA rodando.

---

## Os dois fluxos completos exigidos pela Sprint 3

### 1. Triagem e Encaminhamento (`TriagemService`, tabela `T_CH_TRIAGEM`)

Tutor relata o que tá acontecendo com o pet → sistema classifica a urgência sozinho (BAIXA/MEDIA/ALTA/EMERGENCIA) → entra na fila da clínica, priorizada por urgência e depois por ordem de chegada → clínica encaminha e conclui, ou qualquer lado cancela:

```
ABERTA --(clínica encaminha)--> ENCAMINHADA --(atendimento)--> ATENDIDA
    \_____________________(tutor ou clínica cancela)_____________________/--> CANCELADA
```

### 2. Alertas e Plano de Cuidado (`AlertaService`, tabela `T_CH_ALERTA`)

Lembretes de vacina, retorno, medicamento — criados pelo tutor ou pela clínica — passam por um ciclo de confirmação:

```
PENDENTE --(clínica dispara)--> ENVIADO --(tutor confirma)--> CONCLUIDO
    \_______________________(cancelado por qualquer lado)_______________________/--> CANCELADO
```

Os dois fluxos têm validação completa (Bean Validation nos DTOs) e vão além de CRUD: classificação automática, fila priorizada, máquina de estado com transição negada por regra, e checagem de posse (um tutor não mexe em pet de outro tutor, uma clínica não mexe em triagem de outra clínica).

---

## Como esse projeto se conecta ao banco do time de Banco de Dados

Essa seção mudou depois que recebemos o DDL de verdade do time de banco (`zelo_criar.sql`). No final ficou assim: **o time de Banco de Dados cria e é dono do schema inteiro**, e o Java roda em cima desse schema já existente, em vez de criar do zero.

| Quem cria | O quê | Onde |
|---|---|---|
| Time de Banco de Dados (`zelo_criar.sql`, fora desse repo) | As 7 tabelas operacionais (`T_CH_USUARIO`, `T_CH_TUTOR`, `T_CH_CLINICA`, `T_CH_PET`, `T_CH_PET_TUTOR`, `T_CH_TRIAGEM`, `T_CH_ALERTA`) + `T_CH_FATO_CUIDADO` e `T_CH_AUDITORIA_DML` | Script PL/SQL da disciplina de Database |
| Esse projeto (Flyway, perfil `oracle`) | Só `T_CH_CLINICA_EQUIPE` (tabela extra que não tá no DDL deles) + massa de dados mínima de login | `src/main/resources/db/migration/oracle/` |

As entidades JPA foram remapeadas pra bater exatamente com os nomes reais do DDL deles (`T_CH_<ENTIDADE>`, colunas com prefixo `id_`/`nm_`/`ds_`/`tp_`/`st_`...).

**Ordem que importa na instância real:** primeiro o time de banco roda `zelo_criar.sql` (cria as 9 tabelas, sem inserir nada), só depois disso o Java roda com o perfil `oracle` — aí sim o Flyway aplica `V1__create_equipe_table.sql` e `V2__seed_data.sql`. Se inverter a ordem, o boot quebra com `table or view does not exist`.

As credenciais do Oracle vêm por variável de ambiente (`ORACLE_URL`/`ORACLE_USER`/`ORACLE_PASSWORD`) ou pelo arquivo local `application-oracle.yml`, nunca hardcoded no `application.yml`.

---

## Decisões que tomei durante o desenvolvimento

Fui anotando o motivo de cada decisão pra não esquecer na hora de defender na banca:

1. **Três perfis (TUTOR/VETERINARIO/GESTOR)** — vêm direto do `CHECK` da coluna `tp_usuario` no DDL do time de banco, pra não ter divergência entre o schema deles e a aplicação.
2. **Tabela extra `T_CH_CLINICA_EQUIPE`** — não existe no `zelo_criar.sql` deles, mas precisava pra vincular VETERINARIO/GESTOR a uma clínica (N:N). Como nenhuma FK deles aponta pra ela, criei ela separada tanto no schema de dev/test quanto no Oracle real, sem interferir no que já existe.
3. **Sem autocadastro público pra VETERINARIO/GESTOR** — só TUTOR se cadastra sozinho. Perfil de clínica entra via seed ou por um GESTOR já existente, pra ninguém se autopromover a integrante de clínica.
4. **Os dois fluxos escolhidos** (Triagem e Alertas) mapeiam direto pras tabelas `T_CH_TRIAGEM`/`T_CH_ALERTA` e são o núcleo do produto Zelo (triagem inteligente + cuidado contínuo).
5. **Exclusão de clínica é lógica** (`st_clinica` S/N) — preserva o histórico de triagens/alertas que tem FK pra clínica.
6. **Exclusão de pet é física mas bloqueada se já tem histórico** — em vez de deixar a constraint do banco estourar um erro feio, o `PetController` bloqueia com uma mensagem.
7. **`StatusTriagem` segue o `CHECK` real** (ABERTA/ENCAMINHADA/ATENDIDA/CANCELADA) — não tem "em análise" separado porque o DDL deles não previu isso.
8. **`T_CH_PET_TUTOR` usa PK própria (`id_pet_tutor`)**, não composta — foi como o time de banco desenhou, então a entidade `PetTutor` usa `Long id` simples.
9. **Perfil padrão trocado pra `oracle`** — combinado com o professor, pra persistir de verdade. Trade-off: quem rodar sem acesso à rede da FIAP ou sem credencial configurada vai ver o boot falhar — nesse caso usa `SPRING_PROFILES_ACTIVE=dev`. O perfil `test` não foi afetado, continua fixo em H2.

---

## Mapeamento com a rubrica de Java Advanced (Sprint 3)

| Critério | Onde está |
|---|---|
| Frontend (30 pts) | Thymeleaf + Bootstrap 5, uma tela por caso de uso, validação client+server visível |
| Versionamento de banco com Flyway (20 pts) | Migrations em dev/test e oracle, `ddl-auto: none` (só o Flyway/script do time de banco mexe no schema) |
| Spring Security, 2+ perfis, proteção de rotas (30 pts) | `SecurityConfig` — TUTOR/VETERINARIO/GESTOR, rotas por prefixo, login com redirect por perfil, CSRF, BCrypt |
| 2 fluxos completos além de CRUD, com validação (20 pts) | Triagem/Encaminhamento + Alertas/Plano de Cuidado, Bean Validation nos DTOs |
| Qualidade de código | Camadas separadas (controller/service/repository/DTO), exceções de domínio próprias, sem código morto |

---

## Problemas que apareceram no caminho

Alguns bugs e ajustes que fui encontrando enquanto desenvolvia e testava, deixando registrado porque foi trabalho de verdade resolver isso e pode cair pergunta na arguição:

- **Builder do Lombok ignorando valor padrão**: `Usuario.ativo` tinha `= "S"` direto no campo, mas sem `@Builder.Default` o builder do Lombok ignora esse valor e cria o objeto com `null`. Corrigi adicionando a anotação.
- **Colunas de timestamp com `nullable = false`**: como `criado_em` é preenchido pelo próprio banco (`DEFAULT CURRENT_TIMESTAMP`) e nunca pelo Java, deixar `nullable = false` no lado do Hibernate podia estourar validação antes do insert. Tirei essa restrição do lado Java.
- **JPQL comparando enum com string dentro de `CASE WHEN`**: funcionava, mas não é bem portável. Troquei pra só filtrar/ordenar por data na query, e a priorização por urgência ficou num `Comparator` em Java mesmo, mais fácil de testar.
- **Import faltando** no `ClinicaGerenciarController` (`@RequestMapping` sem import).
- **Consulta N+1**: adicionei `join fetch` nas queries que alimentam telas de lista, pra não fazer uma query por linha.
- **Tipo `NUMBER` sem precisão dando erro no Hibernate**: rodando pela primeira vez fora do ambiente de teste, o Hibernate recusou subir reclamando de tipo de coluna (esperava BIGINT, achava NUMERIC). É uma limitação conhecida de Oracle + Hibernate — Oracle não tem BIGINT nativo, então qualquer NUMBER sempre aparece como NUMERIC pro driver. Resolvi de vez trocando `ddl-auto` de `validate` pra `none` nos três perfis — o Flyway continua sendo o dono do schema, só o Hibernate parou de tentar validar um tipo que o Oracle não consegue reportar do jeito que ele espera.
- **Remapeamento inteiro do schema** quando chegou o DDL real do Nicolas: os nomes de tabela/coluna são bem diferentes do que eu tinha suposto antes (`T_CH_USUARIO` em vez de `zelo_usuario`, colunas com prefixo `nm_`/`ds_`/`tp_` etc), e alguns enums tiveram que ser ajustados pra bater com os `CHECK` constraints reais (ex: `Especie` virou `CAO`/`GATO`). Deu trabalho, mas foi só mapeamento — a lógica de negócio não mudou.
- **Faltava a dependência `flyway-database-oracle`**: ao testar contra o Oracle de verdade pela primeira vez, a conexão funcionou mas o Flyway não reconheceu o banco (`Unsupported Database: Oracle 19.3`) — porque desde a versão 9/10 o suporte a cada banco virou um artefato Maven separado do `flyway-core`. Adicionei a dependência no `pom.xml` e resolveu.
- **Faltava `baseline-on-migrate`**: resolvido o de cima, apareceu outro erro (`Found non-empty schema... but no schema history table`) porque o schema do Nicolas já vem com tabelas criadas fora do controle do Flyway (pelo script dele). Configurei `baseline-on-migrate: true` e `baseline-version: "0"` no perfil oracle — esse `"0"` é importante porque nossa primeira migration também se chama `V1`, e se deixasse no padrão do Flyway (que é `1`) ele ia achar que já tinha rodado e pulava a criação da `T_CH_CLINICA_EQUIPE` sem avisar nada.

Depois desses dois últimos ajustes rodei a aplicação de novo contra o Oracle da FIAP de verdade e funcionou ponta a ponta: conectou, o Flyway aplicou o baseline e as duas migrations, e a aplicação subiu certinho. Testei inclusive cadastrando um pet, fechando a aplicação e abrindo de novo — o pet continuou lá, confirmando que tá persistindo no banco mesmo, não só em memória.

- **Redesign da tela**: o layout inicial usava só o Bootstrap padrão com a cor da marca por cima, refiz com uma identidade visual própria (paleta verde/coral, tipografia Poppins/Inter, cards com sombra, landing page nova). Só mexi em HTML/CSS, nenhuma lógica ou nome de campo mudou.

---

## Testes automatizados

Ficam em `src/test/java`.

| Classe | O que valida |
|---|---|
| `ClassificadorDeUrgenciaTest` | Regra de classificação por palavra-chave: cada nível, normalização de acento/caixa, teto de 100 |
| `TriagemServiceTest` | Abertura de triagem, ordenação da fila, transições de status permitidas/negadas |
| `AlertaServiceTest` | Criação, envio, confirmação, cancelamento, checagem de posse |
| `PetServiceTest` | Cadastro cria o vínculo Pet-Tutor, checagem de posse antes de editar/excluir |
| `RepositoriosJpaTest` | `@DataJpaTest` contra H2 real com Flyway rodando, confirma queries JPQL e inserts |
| `SecurityRouteProtectionTest` | Redirecionamento pra login, 403 entre perfis, CSRF obrigatório |
| `ZeloApplicationTests` | Smoke test — contexto Spring completo sobe com o perfil `test` |

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
├── db/migration/dev/      Flyway pro H2 (dev/test) — schema completo + seed
├── db/migration/oracle/   Flyway pro Oracle real — só T_CH_CLINICA_EQUIPE + seed mínimo
├── templates/             Thymeleaf
└── static/css/            identidade visual

src/test/java/...       JUnit 5 + Mockito + AssertJ + Spring Boot Test
```

---

## O que ainda falta antes de entregar

- Subir o repositório no GitHub (público).
- Confirmar com o Nicolas que a tabela extra e o seed não vão bagunçar nada do lado dele.
- Gravar o vídeo de demonstração (máx. 10 min).
- Revisar a seção de "Problemas" e "Decisões" antes da arguição oral individual, porque é ali que costuma cair pergunta de "por que você fez assim?".
