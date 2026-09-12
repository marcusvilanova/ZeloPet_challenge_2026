# Zelo — cuidado contínuo antes da urgência

Repositório do projeto **Zelo**, desenvolvido para o **Challenge 2026** (FIAP — Análise e Desenvolvimento de Sistemas, 2º ano, 2º semestre) em parceria com a **CLYVO VET**.

## Sobre o projeto

Muitos tutores só procuram a clínica quando a situação já é urgente. O Zelo existe para mudar essa lógica: é um sistema operacional de cuidado contínuo para pets que conecta tutor, clínica veterinária e inteligência artificial, acompanhando a saúde do animal ao longo do tempo em vez de apenas reagir a emergências.

A solução tem três partes integradas:

- **Aplicativo/ambiente web do tutor** — cadastro do pet, linha do tempo, próximos cuidados e conversa com o assistente inteligente.
- **Painel da clínica** — pets acompanhados, fila de atenção e encaminhamentos que precisam de resposta profissional.
- **Núcleo de inteligência** — interpreta relatos, prioriza casos e apoia a comunicação entre tutor e clínica, sempre dentro de regras de segurança.

O diferencial da solução é o **Ciclo Zelo**: depois de um cadastro ou consulta, o tutor recebe uma orientação objetiva, confirma o que foi feito e acompanha o progresso do pet. Se parar de interagir, recebe uma retomada respeitosa, com opção de pausar. Sempre que há risco, dúvida ou pedido do tutor, o encaminhamento é humano.

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

Ao longo do semestre, cada integrante desenvolveu a entrega de uma disciplina em um repositório próprio. Para a entrega final, unificamos tudo aqui, preservando o histórico de commits original de cada um dentro da pasta correspondente:

| Pasta | Disciplina | Repositório original |
|---|---|---|
| [`backend-java/`](backend-java) | Java Advanced | [GabrielRobertoni/zelo-java](https://github.com/GabrielRobertoni/zelo-java) |
| [`backend-dotnet/`](backend-dotnet) | Advanced Business Development with .NET | [lopesadvisory/zelo-dotnet-sprint3](https://github.com/lopesadvisory/zelo-dotnet-sprint3) |
| [`devops/`](devops) | DevOps Tools & Cloud Computing | [brunoferr10/zelo-devops](https://github.com/brunoferr10/zelo-devops) |
| [`mobile/`](mobile) | Mobile Application Development | [Nicolas-Ramiro/zelo-mobile](https://github.com/Nicolas-Ramiro/zelo-mobile) |
| [`database/`](database) | Mastering Relational and Non-Relational Database | modelagem, script PL/SQL (Oracle) e documentação técnica |
| [`ai-iot/`](ai-iot) | Disruptive Architectures: IoT, IoB & Generative AI | documentação do componente de IA e datasets de apoio |

A disciplina **Compliance, Quality Assurance & Tests** é entregue à parte, por um link de acesso ao Azure Boards (plano de projeto, testes manuais e automação), sem código versionado neste repositório.

Cada pasta tem seu próprio `README.md`, com instruções específicas de instalação, execução e demonstração daquela disciplina.

## Observação sobre o dataset de IA

O dataset de imagens usado como referência para a disciplina de IA soma cerca de 650 MB e não foi incluído neste repositório. Em `ai-iot/README.md` está a documentação da abordagem, com os artefatos tabulares e descritivos mais leves.
