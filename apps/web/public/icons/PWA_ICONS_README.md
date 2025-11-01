# Ícones PWA - Instruções de Geração

Este projeto está configurado para usar ícones PWA. Para gerar os ícones PNG necessários a partir do logo existente, você pode usar uma das seguintes opções:

## Opção 1: Usar um gerador online (Mais Fácil)

1. Acesse: https://www.pwabuilder.com/imageGenerator
2. Faça upload do arquivo `public/images/logo/logo-dark.svg` ou `public/images/logo/logo-dark.png`
3. Baixe os ícones gerados
4. Coloque os ícones neste diretório (`public/icons/`)

## Opção 2: Usar ImageMagick (via Terminal)

```bash
# Instalar ImageMagick (se ainda não tiver)
brew install imagemagick  # macOS
# ou
apt-get install imagemagick  # Linux

# Navegar para o diretório do projeto
cd /Users/sqpaloma/Projetos/upcraftcrew/apps/web

# Gerar os ícones
convert public/images/logo/logo-dark.png -resize 72x72 public/icons/icon-72x72.png
convert public/images/logo/logo-dark.png -resize 96x96 public/icons/icon-96x96.png
convert public/images/logo/logo-dark.png -resize 128x128 public/icons/icon-128x128.png
convert public/images/logo/logo-dark.png -resize 144x144 public/icons/icon-144x144.png
convert public/images/logo/logo-dark.png -resize 152x152 public/icons/icon-152x152.png
convert public/images/logo/logo-dark.png -resize 192x192 public/icons/icon-192x192.png
convert public/images/logo/logo-dark.png -resize 384x384 public/icons/icon-384x384.png
convert public/images/logo/logo-dark.png -resize 512x512 public/icons/icon-512x512.png
```

## Opção 3: Usar Sharp (Node.js)

```bash
# Instalar sharp
pnpm add -D sharp

# Criar e executar um script
node scripts/generate-pwa-icons.js
```

## Tamanhos Necessários

- 72x72
- 96x96
- 128x128
- 144x144
- 152x152
- 192x192
- 384x384
- 512x512

## Importante

Os ícones devem ter fundo sólido (não transparente) para melhor visualização em diferentes dispositivos.

