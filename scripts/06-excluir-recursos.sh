#!/usr/bin/env bash
set -euo pipefail
source "$(dirname "$0")/00-configurar-ambiente.sh"
az group delete --name "$RESOURCE_GROUP" --yes --no-wait
echo "Exclusao solicitada para $RESOURCE_GROUP."
