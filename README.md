# Zelo — cuidado contínuo antes da urgência

Repositório unificado do projeto **Zelo**, desenvolvido para o **Challenge 2026 (FIAP — Análise e Desenvolvimento de Sistemas, 2º ano, 2º semestre)** em parceria com a **CLYVO VET**.

O Zelo é um sistema operacional de cuidado contínuo para pets: conecta tutor, clínica veterinária e inteligência artificial para transformar a saúde animal em uma jornada acompanhada ao longo do tempo, em vez de uma busca por ajuda apenas quando a situação já é urgente.

A solução é composta por três partes integradas — aplicativo/ambiente web do tutor, painel da clínica e um núcleo de inteligência (IA + regras de segurança) — organizadas em um **Ciclo Zelo** de cuidado contínuo: orientação objetiva, confirmação do que foi realizado, retomada respeitosa quando o tutor se afasta, e encaminhamento humano sempre que houver risco, dúvida ou solicitação.

> A IA apoia a interpretação de relatos e a personalização da comunicação, mas **não confirma diagnósticos, não prescreve medicamentos e não substitui o médico veterinário**.

## Equipe

| Integrante | RM |
|---|---|
| Bruno Ferreira | 563489 |
| Gabriel Robertoni Padilha | 566293 |
| Hebert Lopes do Santos | 563192 |
| Marcus Vinícius Vila Nova da Silva | 558771 |
| Nicolas Monteiro Ramiro | 562380 |

## Estrutura do repositório

Cada disciplina do Challenge foi desenvolvida por um integrante do grupo em um repositório próprio e é trazida aqui como subprojeto, preservando o histórico de commits original:

| Pasta | Disciplina | Repositório de origem |
|---|---|---|
| [`backend-java/`](backend-java) | Java Advanced | [GabrielRobertoni/zelo-java](https://github.com/GabrielRobertoni/zelo-java) |
| [`backend-dotnet/`](backend-dotnet) | Advanced Business Development with .NET | [lopesadvisory/zelo-dotnet-sprint3](https://github.com/lopesadvisory/zelo-dotnet-sprint3) |
| [`devops/`](devops) | DevOps Tools & Cloud Computing | [brunoferr10/zelo-devops](https://github.com/brunoferr10/zelo-devops) |
| [`mobile/`](mobile) | Mobile Application Development | [Nicolas-Ramiro/zelo-mobile](https://github.com/Nicolas-Ramiro/zelo-mobile) |
| [`database/`](database) | Mastering Relational and Non-Relational Database | modelagem, script PL/SQL (Oracle) e documentação técnica |
| [`ai-iot/`](ai-iot) | Disruptive Architectures: IoT, IoB & Generative AI | documentação do componente de IA e datasets de apoio |

A disciplina **Compliance, Quality Assurance & Tests** é entregue via Azure Boards (plano de projeto, testes manuais e automação) — não gera código versionado neste repositório; o link de acesso é entregue separadamente ao professor.

Cada subpasta mantém seu próprio `README.md` com instruções específicas de instalação, execução e demonstração daquela disciplina.

## Sobre a unificação

Este repositório consolida, em um único lugar, o trabalho feito individualmente por cada integrante em sua disciplina, para permitir a apresentação do projeto Zelo como um todo. Os subprojetos foram importados via `git subtree`, o que preserva o histórico real de commits de cada repositório original dentro da subpasta correspondente — nenhum histórico foi apagado ou "achatado" em um commit único.

O dataset de imagens usado como referência para a disciplina de IA (~650 MB) não foi incluído neste repositório por tamanho; `ai-iot/README.md` documenta a abordagem e mantém apenas os artefatos tabulares/descritivos leves.
