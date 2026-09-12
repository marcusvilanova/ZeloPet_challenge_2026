# IA no Zelo — Disruptive Architectures: IoT, IoB & Generative AI

Documentação do componente de Inteligência Artificial da solução Zelo para a CLYVO VET, conforme os objetivos da disciplina (definição do problema, dados necessários, estratégia de personalização e arquitetura de integração).

## Problema de negócio

Hoje o tutor procura a clínica majoritariamente quando já existe urgência. O papel da IA no Zelo é **antecipar** esse momento: interpretar relatos do tutor (texto, e no futuro imagem/áudio), estimar a prioridade do caso e apoiar a triagem antes que o quadro se agrave — sem nunca substituir o diagnóstico do médico veterinário.

## Abordagem híbrida

A IA atua em conjunto com regras de segurança determinísticas:

- **IA / NLP e classificação**: interpreta o relato do tutor, extrai sinais relevantes (sintomas, espécie, histórico) e sugere uma prioridade inicial.
- **Regras de negócio**: definem os limites do sistema, validam a confiança da classificação e decidem quando o caso deve ser obrigatoriamente encaminhado a um humano.
- Essa lógica já está prototipada no backend Java, em [`ClassificadorDeUrgencia`](../backend-java/src/main/java/br/com/fiap/zelo/service/ClassificadorDeUrgencia.java) e [`TriagemService`](../backend-java/src/main/java/br/com/fiap/zelo/service/TriagemService.java), que compõem o fluxo de triagem (`Triagem`, `NivelUrgencia`, `StatusTriagem`) usado como base para evoluir a camada de IA.

## Dados necessários

Para embasar a personalização e a futura evolução do classificador de urgência/imagem, foram levantados 5 conjuntos de dados públicos de referência (descritos em detalhe em [`dataset-amostras/Dataset/DataSet - Descritivos.docx`](dataset-amostras/Dataset/DataSet%20-%20Descritivos.docx)):

| # | Dataset | Tipo | Uso pretendido |
|---|---|---|---|
| 1 | Saúde veterinária animal (gestação, parto, diagnóstico) | Tabular (`Animal_Vet.xlsx`) | Sinais de saúde específicos por espécie, apoio a diagnóstico |
| 2 | Dados clínicos veterinários (10.000 registros de cães e gatos) | Tabular (`veterinary_clinical_data.csv`) | Modelagem preditiva de doenças comuns, base para priorização |
| 3 | Doenças de pele em cães | Imagens rotuladas | Classificação visual (visão computacional) para triagem dermatológica |
| 4 | Surtos de doenças em animais (2006–atual, 6.371 eventos) | Tabular (`dataset.csv`) | Análise epidemiológica e de risco por região/espécie |
| 5 | Doenças em pets (27 classes, +5.000 imagens) | Imagens rotuladas | Classificação de doenças em cães, gatos e outros pets |

### Sobre o dataset de imagens

Os datasets de imagem (itens 3 e 5) somam ~650 MB e **não foram incluídos neste repositório** para manter o repositório leve e dentro dos limites práticos do GitHub. Ficam preservados localmente com o grupo; esta pasta mantém apenas os artefatos tabulares e descritivos, que já são suficientes para reproduzir a análise exploratória e a justificativa da abordagem.

## Fluxo de dados (arquitetura)

```
Tutor (app/web) → API (Java/Spring) → Triagem/ClassificadorDeUrgencia
                                            │
                                            ├─ regras de negócio (limites, confiança)
                                            └─ componente de IA (classificação/priorização)
                                                    │
                                    dados de treino/apoio: tabulares (1, 2, 4) e imagem (3, 5)
                                            │
                                  encaminhamento humano quando necessário → painel da clínica
```

## Abordagem de IA escolhida e justificativa

Sistema de classificação/priorização (motor de regras inteligente apoiado por modelo preditivo), em vez de um único LLM generativo, porque:

- O domínio exige respostas auditáveis e explicáveis (saúde animal).
- Os dados disponíveis (itens 1, 2 e 4) são majoritariamente estruturados, favorecendo modelos preditivos/classificadores.
- Os dados de imagem (itens 3 e 5) permitem evoluir para um classificador de visão computacional como camada adicional de apoio ao relato do tutor.
- IA generativa (LLM) fica reservada à personalização da comunicação com o tutor, não à decisão clínica.
