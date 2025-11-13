# 🚀 Guia de Configuração para Deployment

## ❌ Problema Identificado

O erro `NEXT_PUBLIC_CONVEX_SITE_URL is not set` acontecia porque:
1. O `nextJsHandler()` do Better Auth exigia essa variável
2. Algumas variáveis estavam inconsistentes entre código e ambiente

## ✅ Correções Aplicadas

### 1. Código Atualizado
- ✅ `apps/web/src/app/api/auth/[...all]/route.ts` - Agora usa `NEXT_PUBLIC_SITE_URL`
- ✅ `packages/backend/convex/auth.config.ts` - Usa `SITE_URL` com fallback

### 2. Variáveis de Ambiente Necessárias

## 📋 Configuração na VERCEL

Acesse: https://vercel.com/seu-projeto/settings/environment-variables

### Variáveis Obrigatórias:

```bash
# 1. URL do seu site (Next.js)
NEXT_PUBLIC_SITE_URL=https://www.upcraftcrew.com

# 2. URL do Convex (gerada automaticamente pelo deploy)
NEXT_PUBLIC_CONVEX_URL=https://deafening-mammoth-335.convex.cloud
# ⚠️ Esta será preenchida automaticamente pelo comando de build

# 3. Credenciais do Convex
CONVEX_DEPLOY_KEY=prod:deafening-mammoth-335|eyJ2M...
# ⚠️ Pegue no Convex Dashboard → Settings → Deploy Keys

# 4. Secret do Better Auth (mesmo valor do Convex)
BETTER_AUTH_SECRET=xaY5Cswq27uyLqx6AHLH0SsmY+eBCQDbTOy3WOzfaAU=

# 5. URL do site para o backend Convex
SITE_URL=https://www.upcraftcrew.com

# 6. Credenciais do Google OAuth
GOOGLE_CLIENT_ID=569170127767-djob8spdtt3plp14uet...
GOOGLE_CLIENT_SECRET=GOCSPX-ATMF_eP25AfQ_gJRC06JC97Xo...

# 7. Chave API do Resend
RESEND_API_KEY=re_HU8VxPcz_MTRo5cLPS3RwSJvuh1kk...
```

## 📋 Configuração no CONVEX (Produção)

Acesse: https://dashboard.convex.dev/d/deafening-mammoth-335
Vá em: **Settings → Environment Variables → Production**

### Variáveis Obrigatórias:

```bash
# 1. URL do seu site Next.js
SITE_URL=https://www.upcraftcrew.com

# 2. Secret do Better Auth
BETTER_AUTH_SECRET=xaY5Cswq27uyLqx6AHLH0SsmY+eBCQDbTOy3WOzfaAU=

# 3. URL do app nativo (se aplicável)
NATIVE_APP_URL=upcraftcrew-os://

# 4. Credenciais do Google OAuth (mesmas da Vercel)
GOOGLE_CLIENT_ID=569170127767-djob8spdtt3plp14uet...
GOOGLE_CLIENT_SECRET=GOCSPX-ATMF_eP25AfQ_gJRC06JC97Xo...

# 5. Chave API do Resend (mesma da Vercel)
RESEND_API_KEY=re_HU8VxPcz_MTRo5cLPS3RwSJvuh1kk...
```

## 🔍 Como Obter o CONVEX_DEPLOY_KEY

1. Acesse: https://dashboard.convex.dev
2. Selecione seu projeto: **deafening-mammoth-335**
3. Vá em: **Settings** → **Deploy Keys**
4. Copie a chave de **Production** (começa com `prod:`)

## 📝 Checklist de Deploy

- [ ] Todas as variáveis estão configuradas na **Vercel**
- [ ] Todas as variáveis estão configuradas no **Convex Dashboard (Production)**
- [ ] O `CONVEX_DEPLOY_KEY` está correto e é da produção
- [ ] As URLs não têm barra final (ex: `https://www.upcraftcrew.com` sem `/`)
- [ ] Fazer commit das alterações de código
- [ ] Fazer push para o repositório
- [ ] Aguardar o deploy automático da Vercel

## 🐛 Troubleshooting

### Se ainda houver erro "CONVEX_DEPLOY_KEY not found":
1. Verifique se copiou a chave completa (é uma string longa)
2. Certifique-se de que é a chave de **Production**, não Development
3. Verifique se não há espaços extras no início ou fim da chave

### Se houver erro "SITE_URL is not set":
1. Adicione `SITE_URL` no Convex Dashboard (Production)
2. Use a URL completa: `https://www.upcraftcrew.com`

### Se a autenticação não funcionar:
1. Verifique se `NEXT_PUBLIC_SITE_URL` está na Vercel
2. Verifique se `SITE_URL` está no Convex
3. Certifique-se de que ambos têm o mesmo valor

## 🎯 Próximos Passos

1. Configure todas as variáveis listadas acima
2. Faça commit e push do código atualizado
3. Aguarde o deploy automático
4. Teste a aplicação em produção
5. Verifique os logs da Vercel para confirmar que não há mais erros

---

**Última atualização:** 13/11/2025
**Status:** ✅ Código corrigido - Aguardando configuração de variáveis de ambiente

