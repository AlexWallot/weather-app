const sharp = require('sharp');
const fs = require('fs');
const path = require('path');

// Créer le dossier icons s'il n'existe pas
const iconsDir = path.join(__dirname, '..', 'public', 'icons');
if (!fs.existsSync(iconsDir)) {
  fs.mkdirSync(iconsDir, { recursive: true });
}

// Tailles d'icônes nécessaires
const sizes = [72, 96, 128, 144, 152, 192, 384, 512];

async function generateIcons() {
  for (const size of sizes) {
    try {
      // Créer un SVG simple
      const svg = `
        <svg width="${size}" height="${size}" viewBox="0 0 ${size} ${size}" fill="none" xmlns="http://www.w3.org/2000/svg">
          <rect width="${size}" height="${size}" rx="${size/8}" fill="#667eea"/>
          <circle cx="${size/2}" cy="${size/2}" r="${size/3}" fill="#ffffff" opacity="0.9"/>
          <path d="M${size/2} ${size/5}C${size/2} ${size/5} ${size/2.4} ${size/3.2} ${size/2.4} ${size/2.4}C${size/2.4} ${size/1.6} ${size/2.2} ${size/1.8} ${size/2} ${size/1.8}C${size/1.8} ${size/1.8} ${size/1.6} ${size/1.6} ${size/1.6} ${size/2.4}C${size/1.6} ${size/3.2} ${size/2} ${size/5} ${size/2} ${size/5}Z" fill="#667eea"/>
          <text x="${size/2}" y="${size/1.4}" text-anchor="middle" fill="#667eea" font-family="Arial, sans-serif" font-size="${size/8}" font-weight="bold">°C</text>
        </svg>
      `;

      // Convertir SVG en PNG optimisé
      await sharp(Buffer.from(svg))
        .png({ 
          quality: 90, 
          compressionLevel: 9,
          palette: true
        })
        .toFile(path.join(iconsDir, `icon-${size}x${size}.png`));
      
      console.log(`✅ Icon ${size}x${size} created`);
    } catch (error) {
      console.error(`❌ Error creating icon ${size}x${size}:`, error.message);
    }
  }
}

generateIcons().then(() => {
  console.log('🎉 All icons generated successfully!');
}).catch(error => {
  console.error('💥 Error generating icons:', error);
});
