#!/usr/bin/env bash
set -euo pipefail
source "$(dirname "$0")/00-configurar-ambiente.sh"
require_secret MYSQL_USER MYSQL_PASSWORD

ACR_USERNAME=$(az keyvault secret show --vault-name "$KEY_VAULT" --name acr-username --query value -o tsv)
ACR_PASSWORD=$(az keyvault secret show --vault-name "$KEY_VAULT" --name acr-password --query value -o tsv)
DB_IP=$(az container show --resource-group "$RESOURCE_GROUP" --name "$DB_ACI" --query ipAddress.ip -o tsv)

az container create --resource-group "$RESOURCE_GROUP" --name "$APP_ACI" \
  --image "$ACR_NAME.azurecr.io/$APP_IMAGE:$IMAGE_TAG" --cpu 1 --memory 1.5 \
  --os-type Linux --dns-name-label "$APP_ACI" --ports 8080 \
  --registry-login-server "$ACR_NAME.azurecr.io" \
  --registry-username "$ACR_USERNAME" --registry-password "$ACR_PASSWORD" \
  --environment-variables \
    SPRING_DATASOURCE_URL="jdbc:mysql://${DB_IP}:3306/zelo?useSSL=false&allowPublicKeyRetrieval=true&serverTimezone=UTC" \
  --secure-environment-variables \
    SPRING_DATASOURCE_USERNAME="$MYSQL_USER" SPRING_DATASOURCE_PASSWORD="$MYSQL_PASSWORD" \
  --restart-policy Always

APP_FQDN=$(az container show --resource-group "$RESOURCE_GROUP" --name "$APP_ACI" --query ipAddress.fqdn -o tsv)
echo "Zelo: http://${APP_FQDN}:8080"
echo "Swagger: http://${APP_FQDN}:8080/swagger-ui.html"
