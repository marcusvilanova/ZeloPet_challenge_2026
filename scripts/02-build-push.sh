#!/usr/bin/env bash
set -euo pipefail
source "$(dirname "$0")/00-configurar-ambiente.sh"

az acr login --name "$ACR_NAME"
docker build -f docker/db/Dockerfile -t "$DB_IMAGE:$IMAGE_TAG" .
docker build -f docker/app/Dockerfile -t "$APP_IMAGE:$IMAGE_TAG" .
docker tag "$DB_IMAGE:$IMAGE_TAG" "$ACR_NAME.azurecr.io/$DB_IMAGE:$IMAGE_TAG"
docker tag "$APP_IMAGE:$IMAGE_TAG" "$ACR_NAME.azurecr.io/$APP_IMAGE:$IMAGE_TAG"
docker push "$ACR_NAME.azurecr.io/$DB_IMAGE:$IMAGE_TAG"
docker push "$ACR_NAME.azurecr.io/$APP_IMAGE:$IMAGE_TAG"
az acr repository list --name "$ACR_NAME" --output table
