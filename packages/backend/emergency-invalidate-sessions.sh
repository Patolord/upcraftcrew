#!/bin/bash

###############################################################################
# 🚨 SCRIPT DE EMERGÊNCIA: Invalidar Todas as Sessões
###############################################################################
# 
# Use em casos de comprometimento de secrets (BETTER_AUTH_SECRET)
# 
# ⚠️ ATENÇÃO: Isso DESCONECTARÁ TODOS os usuários do sistema!
#
# Uso:
#   ./emergency-invalidate-sessions.sh [--prod]
#
###############################################################################

set -e

# Cores para output
RED='\033[0;31m'
YELLOW='\033[1;33m'
GREEN='\033[0;32m'
NC='\033[0m' # No Color

echo -e "${RED}╔═══════════════════════════════════════════════════════════╗${NC}"
echo -e "${RED}║  🚨 SCRIPT DE EMERGÊNCIA - INVALIDAÇÃO DE SESSÕES       ║${NC}"
echo -e "${RED}╚═══════════════════════════════════════════════════════════╝${NC}"
echo ""

# Determinar ambiente
ENVIRONMENT="dev"
CONVEX_FLAGS=""

if [[ "$1" == "--prod" ]]; then
  ENVIRONMENT="prod"
  CONVEX_FLAGS="--prod"
  echo -e "${RED}⚠️  AMBIENTE: PRODUÇÃO${NC}"
else
  echo -e "${YELLOW}⚠️  AMBIENTE: DESENVOLVIMENTO${NC}"
fi

echo ""
echo -e "${YELLOW}Este script irá:${NC}"
echo "  1. Invalidar TODAS as sessões ativas"
echo "  2. Desconectar TODOS os usuários"
echo "  3. Registrar ação no audit log"
echo ""

# Confirmação
read -p "Você tem certeza? Digite 'INVALIDATE' para confirmar: " confirmation

if [[ "$confirmation" != "INVALIDATE" ]]; then
  echo -e "${RED}✗ Cancelado${NC}"
  exit 1
fi

echo ""
echo -e "${YELLOW}🔄 Invalidando todas as sessões...${NC}"

# Executar mutation no Convex
cd /Users/sqpaloma/Projetos/upcraftcrew/packages/backend

RESULT=$(npx convex run sessions:invalidateAllSessions $CONVEX_FLAGS)

echo ""
echo -e "${GREEN}✓ Sessões invalidadas com sucesso!${NC}"
echo ""
echo "Resultado:"
echo "$RESULT"
echo ""

echo -e "${YELLOW}📋 Próximos passos:${NC}"
echo "  1. Rotacione BETTER_AUTH_SECRET"
echo "  2. Rotacione GOOGLE_CLIENT_SECRET"
echo "  3. Rotacione RESEND_API_KEY"
echo "  4. Atualize variáveis de ambiente em produção"
echo "  5. Faça redeploy da aplicação"
echo "  6. Notifique usuários (se necessário)"
echo ""
echo -e "${GREEN}✓ Script concluído${NC}"

