#!/bin/bash

# PlayFitness Database Backup & Local View Setup
# Para usar: ./backup_db.sh

PROJECT_REF="hnrrwynukzerysxgsvvl"
HOST="db.$PROJECT_REF.supabase.co"
PORT="5432"
USER="postgres"
DBNAME="postgres"

echo "--------------------------------------------------------"
echo "🌀 PLAYFITNESS - GERADOR DE BACKUP POSTGRESQL"
echo "--------------------------------------------------------"
echo "Conectando ao Supabase em Cloud..."

# Tentativa de dump
pg_dump "postgresql://$USER@$HOST:$PORT/$DBNAME" > backup_playfitness_$(date +%Y%m%d).sql

if [ $? -eq 0 ]; then
    echo "✅ Backup realizado com sucesso: backup_playfitness_$(date +%Y%m%d).sql"
    echo "Sugestão: Use 'psql' local para visualizar os dados offline."
else
    echo "❌ Erro ao realizar backup. Verifique se a senha informada está correta."
fi
