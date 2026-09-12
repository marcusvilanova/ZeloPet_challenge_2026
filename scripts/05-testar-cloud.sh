#!/usr/bin/env bash
set -euo pipefail
source "$(dirname "$0")/00-configurar-ambiente.sh"
APP_FQDN=$(az container show --resource-group "$RESOURCE_GROUP" --name "$APP_ACI" --query ipAddress.fqdn -o tsv)
BASE_URL="http://${APP_FQDN}:8080/api"

echo "1) CONSULTA INICIAL"
curl --fail --silent --show-error "$BASE_URL/pets"; echo
curl --fail --silent --show-error "$BASE_URL/cuidados"; echo

echo "2) INCLUSAO DE PET"
PET_RESPONSE=$(curl --fail --silent --show-error -X POST "$BASE_URL/pets" \
  -H 'Content-Type: application/json' \
  -d '{"nome":"Mel","especie":"Cao","raca":"Beagle","dataNascimento":"2023-04-12","nomeTutor":"Carla Souza"}')
echo "$PET_RESPONSE"
PET_ID=$(echo "$PET_RESPONSE" | sed -n 's/.*"id":\([0-9]*\).*/\1/p')

echo "3) INCLUSAO DE CUIDADO RELACIONADO"
CUIDADO_RESPONSE=$(curl --fail --silent --show-error -X POST "$BASE_URL/cuidados" \
  -H 'Content-Type: application/json' \
  -d "{\"petId\":$PET_ID,\"tipo\":\"EXAME\",\"descricao\":\"Hemograma preventivo anual\",\"dataPrevista\":\"2026-11-05\",\"status\":\"PENDENTE\"}")
echo "$CUIDADO_RESPONSE"
CUIDADO_ID=$(echo "$CUIDADO_RESPONSE" | sed -n 's/.*"id":\([0-9]*\).*/\1/p')

echo "4) ALTERACAO DO PET E DO CUIDADO"
curl --fail --silent --show-error -X PUT "$BASE_URL/pets/$PET_ID" -H 'Content-Type: application/json' \
  -d '{"nome":"Mel","especie":"Cao","raca":"Beagle","dataNascimento":"2023-04-12","nomeTutor":"Carla Souza Ferreira"}'; echo
curl --fail --silent --show-error -X PUT "$BASE_URL/cuidados/$CUIDADO_ID" -H 'Content-Type: application/json' \
  -d "{\"petId\":$PET_ID,\"tipo\":\"EXAME\",\"descricao\":\"Hemograma preventivo realizado\",\"dataPrevista\":\"2026-11-05\",\"status\":\"CONCLUIDO\"}"; echo

echo "IDs para comprovacao no banco: PET_ID=$PET_ID CUIDADO_ID=$CUIDADO_ID"
echo "A exclusao deve ser feita primeiro em cuidados e depois em pets."
