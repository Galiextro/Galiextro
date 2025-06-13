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

fs.copyFile(srcPath, destPath, (err) => {
  if (err) {
    console.error('Error al copiar:', err);
    process.exit(1);
  }
  console.log(`Archivo copiado de ${srcFile} a ${destFile} ✅`);
});
