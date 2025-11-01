const sharp = require('sharp');
const fs = require('fs');
const path = require('path');

const sizes = [72, 96, 128, 144, 152, 192, 384, 512];
const inputFile = path.join(__dirname, '../public/images/logo/logo-dark.png');
const outputDir = path.join(__dirname, '../public/icons');

// Criar diretório se não existir
if (!fs.existsSync(outputDir)) {
  fs.mkdirSync(outputDir, { recursive: true });
}

async function generateIcons() {
  console.log('🚀 Gerando ícones PWA...\n');

  for (const size of sizes) {
    const outputFile = path.join(outputDir, `icon-${size}x${size}.png`);
    
    try {
      await sharp(inputFile)
        .resize(size, size, {
          fit: 'contain',
          background: { r: 0, g: 0, b: 0, alpha: 1 }
        })
        .png()
        .toFile(outputFile);
      
      console.log(`✅ Gerado: icon-${size}x${size}.png`);
    } catch (error) {
      console.error(`❌ Erro ao gerar icon-${size}x${size}.png:`, error.message);
    }
  }

  console.log('\n✨ Ícones PWA gerados com sucesso!');
}

generateIcons().catch(console.error);

