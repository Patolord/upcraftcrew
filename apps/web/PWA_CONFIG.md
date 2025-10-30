# Configuração PWA - UpCraftCrew

Este documento descreve a configuração PWA (Progressive Web App) implementada no projeto.

## ✅ Configurações Implementadas

### 1. Dependências
- **@ducanh2912/next-pwa**: Plugin PWA para Next.js 15+

### 2. Arquivos de Configuração

#### `next.config.ts`
Configurado com:
- Service Worker gerado automaticamente
- Desabilitado em desenvolvimento
- Registro automático do service worker
- Fallback para página offline

#### `manifest.json`
Localizado em `public/manifest.json` com:
- Nome: UpCraftCrew
- Descrição completa
- Ícones em múltiplos tamanhos (72px a 512px)
- Tema e cores de fundo
- Modo standalone
- Idioma: pt-BR

### 3. Layout Principal (`src/app/layout.tsx`)

Metadados PWA incluídos:
- Link para manifest.json
- Configurações Apple Web App
- Meta tags de viewport e theme-color
- Ícones para iOS

### 4. Ícones PWA

Gerados automaticamente em 8 tamanhos:
- 72x72, 96x96, 128x128, 144x144
- 152x152, 192x192, 384x384, 512x512

Localizados em: `public/icons/`

### 5. Página Offline

Criada em `src/app/offline/page.tsx`:
- Exibida quando o usuário está sem conexão
- Botão para tentar reconectar
- Design responsivo

## 🚀 Como Testar

### 1. Build de Produção
```bash
cd apps/web
pnpm build
pnpm start
```

### 2. Verificar PWA

#### Chrome DevTools:
1. Abra DevTools (F12)
2. Vá para a aba "Application"
3. Verifique "Manifest" - deve mostrar todas as configurações
4. Verifique "Service Workers" - deve estar registrado
5. Teste "Offline" marcando a caixa

#### Lighthouse:
1. Abra DevTools (F12)
2. Vá para a aba "Lighthouse"
3. Selecione "Progressive Web App"
4. Clique em "Generate report"

### 3. Instalar o PWA

#### Desktop:
- Chrome/Edge: Clique no ícone de instalação na barra de endereços
- Ou vá em Menu > Instalar UpCraftCrew

#### Mobile:
- Safari iOS: Compartilhar > Adicionar à Tela de Início
- Chrome Android: Menu > Adicionar à tela inicial

## 📱 Recursos PWA

### Funcionalidades Implementadas:
✅ Instalável
✅ Funciona offline (com fallback)
✅ Service Worker
✅ Manifest configurado
✅ Ícones em múltiplos tamanhos
✅ Splash screen automática
✅ Modo standalone
✅ Theme color

### Funcionalidades Futuras (Opcional):
- [ ] Cache de páginas específicas
- [ ] Sincronização em background
- [ ] Push notifications
- [ ] Compartilhamento nativo
- [ ] Shortcuts no manifest

## 🔧 Manutenção

### Atualizar Ícones
Se precisar atualizar os ícones:
```bash
cd apps/web
node scripts/generate-pwa-icons.js
```

### Atualizar Service Worker
O service worker é gerado automaticamente a cada build. Para forçar atualização:
```bash
pnpm build
```

### Verificar Configuração
```bash
# Ver arquivos gerados
ls -la public/sw.js
ls -la public/workbox-*.js
```

## 🌐 Deploy

### Vercel (Recomendado)
A configuração PWA funciona automaticamente no Vercel:
```bash
vercel --prod
```

### Outros Serviços
Certifique-se de que:
1. Os arquivos em `public/` são servidos estaticamente
2. O service worker (`sw.js`) é acessível na raiz
3. HTTPS está habilitado (obrigatório para PWA)

## 🐛 Troubleshooting

### PWA não aparece para instalação
- Verifique se está usando HTTPS
- Confirme que o service worker está registrado
- Verifique o manifest no DevTools
- Limpe o cache e recarregue

### Ícones não aparecem
- Verifique se os arquivos PNG existem em `public/icons/`
- Confirme os caminhos no `manifest.json`
- Limpe o cache do navegador

### Service Worker não atualiza
- Incremente a versão no manifest
- Force um novo build
- Use "Update on reload" no DevTools durante desenvolvimento

## 📚 Recursos

- [Next.js PWA Plugin](https://github.com/DuCanhGH/next-pwa)
- [Web.dev PWA Guide](https://web.dev/progressive-web-apps/)
- [MDN PWA Documentation](https://developer.mozilla.org/en-US/docs/Web/Progressive_web_apps)

