import sharp from "sharp";

const sizes = [72, 96, 128, 144, 152, 192, 384, 512];
const destDir = "public/icons";

// SVG base
const svgBase = (size) => `
<svg width="${size}" height="${size}" xmlns="http://www.w3.org/2000/svg">
  <rect width="${size}" height="${size}" fill="#000000"/>
  <text x="50%" y="50%" text-anchor="middle" dy="0.35em" fill="#ffffff" font-family="Arial, sans-serif" font-size="${size * 0.3}" font-weight="bold">UC</text>
</svg>
`;

async function generateIcons() {
	for (const size of sizes) {
		const svg = Buffer.from(svgBase(size));
		await sharp(svg)
			.resize(size, size)
			.png()
			.toFile(`${destDir}/icon-${size}x${size}.png`);
		console.log(`✓ Criado: icon-${size}x${size}.png`);
	}
	console.log("\n✨ Todos os ícones foram gerados com sucesso!");
}

generateIcons().catch(console.error);
