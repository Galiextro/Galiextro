const fs = require('fs');
const path = require('path');

const args = process.argv.slice(2);
if (args.length !== 2) {
  console.error('Uso: node sync-readmes.js <origen> <destino>');
  console.error('Ejemplo: node sync-readmes.js README.md README.es.md');
  process.exit(1);
}

const [srcFile, destFile] = args;

const srcPath = path.resolve(__dirname, srcFile);
const destPath = path.resolve(__dirname, destFile);

if (!fs.existsSync(srcPath)) {
  console.error(`El archivo de origen no existe: ${srcFile}`);
  process.exit(1);
}


const isDestSpanish = destFile.toLowerCase().includes('.es.');

const badgeBlock = `
---
<div align="center">
  ${isDestSpanish 
    ? `![🇪🇸 Español](https://img.shields.io/badge/Español-e91e63?style=for-the-badge&labelColor=000)`
    : `[![🇪🇸 Español](https://img.shields.io/badge/Cambiar_a-Español-e91e63?style=for-the-badge&labelColor=000)](README.es.md)`
  }
  &nbsp;&nbsp;
  ${!isDestSpanish 
    ? `![🇺🇸 English](https://img.shields.io/badge/English-1e90ff?style=for-the-badge&labelColor=000)`
    : `[![🇺🇸 English](https://img.shields.io/badge/Switch_to-English-1e90ff?style=for-the-badge&labelColor=000)](README.md)`
  }
</div>
---
`;

fs.readFile(srcPath, 'utf8', (err, data) => {
  if (err) {
    console.error('Error leyendo archivo origen:', err);
    process.exit(1);
  }

  const cleanedData = data.replace(/---\n<div align="center">[\s\S]*?<\/div>\n---/g, '');

  const regexTitle = /^(# .*)$/m;
  const match = cleanedData.match(regexTitle);

  if (!match) {
    // Si no hay título, añadimos al principio
    const newContent = badgeBlock + '\n' + cleanedData.trim();
    escribirArchivo(destPath, newContent);
  } else {
    // Insertamos después del título
    const index = match.index + match[0].length;
    const newContent = cleanedData.slice(0, index) + '\n' + badgeBlock + cleanedData.slice(index);
    escribirArchivo(destPath, newContent);
  }
});

function escribirArchivo(destPath, content) {
  fs.writeFile(destPath, content, 'utf8', (err) => {
    if (err) {
      console.error('Error escribiendo archivo destino:', err);
      process.exit(1);
    }
    console.log(`Archivo sincronizado y badges añadidos: ${destPath} ✅`);
  });
}
