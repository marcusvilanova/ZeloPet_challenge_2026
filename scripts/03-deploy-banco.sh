#!/usr/bin/env bash
set -euo pipefail
source "$(dirname "$0")/00-configurar-ambiente.sh"
require_secret MYSQL_ROOT_PASSWORD MYSQL_USER MYSQL_PASSWORD

ACR_USERNAME=$(az keyvault secret show --vault-name "$KEY_VAULT" --name acr-username --query value -o tsv)
ACR_PASSWORD=$(az keyvault secret show --vault-name "$KEY_VAULT" --name acr-password --query value -o tsv)
SUBSCRIPTION_ID=$(az account show --query id --output tsv)

STORAGE_KEY=$(az rest \
  --method post \
  --url "https://management.azure.com/subscriptions/${SUBSCRIPTION_ID}/resourceGroups/${RESOURCE_GROUP}/providers/Microsoft.Storage/storageAccounts/${STORAGE_ACCOUNT}/listKeys?api-version=2024-01-01" \
  --query 'keys[0].value' \
  --output tsv)

az container create --resource-group "$RESOURCE_GROUP" --name "$DB_ACI" \
  --image "$ACR_NAME.azurecr.io/$DB_IMAGE:$IMAGE_TAG" --cpu 1 --memory 2 \
  --os-type Linux --dns-name-label "$DB_ACI" --ports 3306 \
  --registry-login-server "$ACR_NAME.azurecr.io" \
  --registry-username "$ACR_USERNAME" --registry-password "$ACR_PASSWORD" \
  --azure-file-volume-account-name "$STORAGE_ACCOUNT" \
  --azure-file-volume-account-key "$STORAGE_KEY" \
  --azure-file-volume-share-name "$FILE_SHARE" \
  --azure-file-volume-mount-path /var/lib/mysql \
  --environment-variables MYSQL_DATABASE=zelo \
  --secure-environment-variables \
    MYSQL_ROOT_PASSWORD="$MYSQL_ROOT_PASSWORD" MYSQL_USER="$MYSQL_USER" MYSQL_PASSWORD="$MYSQL_PASSWORD" \
  --restart-policy Always

az container show --resource-group "$RESOURCE_GROUP" --name "$DB_ACI" \
  --query '{nome:name,estado:instanceView.state,ip:ipAddress.ip}' --output table
