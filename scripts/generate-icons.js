import sharp from 'sharp';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const root = path.resolve(__dirname, '..');
const outDir = path.join(root, 'public/icons');

const ICONS = [
  { file: 'icon-64x64.png', size: 64, padding: 0.1 },
  { file: 'icon-180x180.png', size: 180, padding: 0.1 },
  { file: 'icon-192x192.png', size: 192, padding: 0.1 },
  { file: 'icon-512x512.png', size: 512, padding: 0.1 },
  { file: 'icon-192x192-maskable.png', size: 192, padding: 0.15 },
  { file: 'icon-512x512-maskable.png', size: 512, padding: 0.15 },
];

const BRAND_COLOR = '#2DBC8B';

async function generateIcons() {
  if (!fs.existsSync(outDir)) {
    fs.mkdirSync(outDir, { recursive: true });
  }

  const svgBuffer = fs.readFileSync(
    path.join(root, 'public/kuentasklaras-logo.svg')
  );
  const ASPECT = 709 / 726;

  for (const { file, size, padding } of ICONS) {
    const paddedSize = size * (1 - padding * 2);
    let logoW, logoH;

    if (ASPECT > 1) {
      logoW = paddedSize;
      logoH = paddedSize / ASPECT;
    } else {
      logoH = paddedSize;
      logoW = paddedSize * ASPECT;
    }

    const bg = await sharp({
      create: {
        width: size,
        height: size,
        channels: 4,
        background: BRAND_COLOR,
      },
    })
      .png()
      .toBuffer();

    const logo = await sharp(svgBuffer)
      .resize(Math.round(logoW), Math.round(logoH))
      .png()
      .toBuffer();

    const left = Math.round((size - logoW) / 2);
    const top = Math.round((size - logoH) / 2);

    await sharp(bg)
      .composite([{ input: logo, left, top }])
      .png()
      .toFile(path.join(outDir, file));

    console.log(`  ✓ ${file} (${size}x${size})`);
  }
}

generateIcons().catch((err) => {
  console.error('Error generating icons:', err);
  process.exit(1);
});
