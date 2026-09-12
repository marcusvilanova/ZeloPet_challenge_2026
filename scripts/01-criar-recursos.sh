#!/usr/bin/env bash
set -euo pipefail
source "$(dirname "$0")/00-configurar-ambiente.sh"
require_secret MYSQL_ROOT_PASSWORD MYSQL_USER MYSQL_PASSWORD

az group create --name "$RESOURCE_GROUP" --location "$LOCATION"
az provider register --namespace Microsoft.ContainerRegistry --wait
az provider register --namespace Microsoft.ContainerInstance --wait
az provider register --namespace Microsoft.Storage --wait
az provider register --namespace Microsoft.KeyVault --wait

az acr create --resource-group "$RESOURCE_GROUP" --name "$ACR_NAME" \
  --sku Basic --location "$LOCATION" --admin-enabled true

az storage account create --resource-group "$RESOURCE_GROUP" \
  --name "$STORAGE_ACCOUNT" --location "$LOCATION" --sku Standard_LRS

STORAGE_CONNECTION=$(az storage account show-connection-string \
  --resource-group "$RESOURCE_GROUP" --name "$STORAGE_ACCOUNT" \
  --query connectionString -o tsv)
az storage share create --name "$FILE_SHARE" --account-name "$STORAGE_ACCOUNT" \
  --connection-string "$STORAGE_CONNECTION"

az keyvault create --name "$KEY_VAULT" --resource-group "$RESOURCE_GROUP" \
  --location "$LOCATION" --enable-rbac-authorization false
az keyvault secret set --vault-name "$KEY_VAULT" --name mysql-root-password --value "$MYSQL_ROOT_PASSWORD" >/dev/null
az keyvault secret set --vault-name "$KEY_VAULT" --name mysql-user --value "$MYSQL_USER" >/dev/null
az keyvault secret set --vault-name "$KEY_VAULT" --name mysql-password --value "$MYSQL_PASSWORD" >/dev/null

ACR_USERNAME=$(az acr credential show --name "$ACR_NAME" --query username -o tsv)
ACR_PASSWORD=$(az acr credential show --name "$ACR_NAME" --query passwords[0].value -o tsv)
az keyvault secret set --vault-name "$KEY_VAULT" --name acr-username --value "$ACR_USERNAME" >/dev/null
az keyvault secret set --vault-name "$KEY_VAULT" --name acr-password --value "$ACR_PASSWORD" >/dev/null

echo "Recursos base criados via Azure CLI."
