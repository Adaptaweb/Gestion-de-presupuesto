import sharp from 'sharp';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const root = path.resolve(__dirname, '..');
const outDir = path.join(root, 'public/icons');

const LOGO_SOURCE = path.join(root, 'public/kuentasklaras-logo.svg');
const LOGO_WIDTH = 709;
const LOGO_HEIGHT = 726;
const ASPECT = LOGO_WIDTH / LOGO_HEIGHT;

const ICONS = [
  { file: 'icon-64x64.png', size: 64, padding: 0.10 },
  { file: 'icon-180x180.png', size: 180, padding: 0.10 },
  { file: 'icon-192x192.png', size: 192, padding: 0.10 },
  { file: 'icon-196x196.png', size: 196, padding: 0.10 },
  { file: 'icon-512x512.png', size: 512, padding: 0.10 },
  { file: 'icon-192x192-maskable.png', size: 192, padding: 0.30 },
  { file: 'icon-512x512-maskable.png', size: 512, padding: 0.30 },
];

const BG_COLOR = '#1a1a1a';

async function generateIcons() {
  if (!fs.existsSync(outDir)) {
    fs.mkdirSync(outDir, { recursive: true });
  }

  const svgString = fs.readFileSync(LOGO_SOURCE, 'utf-8');

  for (const { file, size, padding } of ICONS) {
    const paddedSize = Math.round(size * (1 - padding * 2));
    let logoW, logoH;

    if (ASPECT > 1) {
      logoW = paddedSize;
      logoH = Math.round(paddedSize / ASPECT);
    } else {
      logoH = paddedSize;
      logoW = Math.round(paddedSize * ASPECT);
    }

    const bg = await sharp({
      create: {
        width: size,
        height: size,
        channels: 4,
        background: BG_COLOR,
      },
    })
      .png()
      .toBuffer();

    const logo = await sharp(Buffer.from(svgString))
      .resize(logoW, logoH)
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
