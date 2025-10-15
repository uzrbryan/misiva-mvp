// =============================================
// 🎨 MISIVA MVP - PREPARE METADATA SCRIPT
// =============================================
// Genera 20 JSONs para los POAPs con fechas/meses diferentes

const fs = require('fs');
const path = require('path');

// ========== CONFIGURACIÓN ==========
const METADATA_DIR = path.join(__dirname, '../metadata');
const JSON_DIR = path.join(METADATA_DIR, 'json');
const TOTAL_POAPS = 20;
const START_DATE = new Date('2025-10-12'); // Fecha de inicio
const BASE_IMAGE_URI = 'ipfs://'; // Se completa con el CID después

// Meses en español
const MONTHS_ES = [
  'Enero', 'Febrero', 'Marzo', 'Abril', 'Mayo', 'Junio',
  'Julio', 'Agosto', 'Septiembre', 'Octubre', 'Noviembre', 'Diciembre'
];

// ========== FUNCIONES AUXILIARES ==========

/**
 * Formatea una fecha al formato DD/MM/YYYY
 */
function formatDate(date) {
  const day = String(date.getDate()).padStart(2, '0');
  const month = String(date.getMonth() + 1).padStart(2, '0');
  const year = date.getFullYear();
  return `${day}/${month}/${year}`;
}

/**
 * Obtiene el nombre del mes en español
 */
function getMonthInSpanish(date) {
  return MONTHS_ES[date.getMonth()];
}

/**
 * Formatea una fecha al formato YYYY-MM-DD
 */
function formatDateISO(date) {
  const day = String(date.getDate()).padStart(2, '0');
  const month = String(date.getMonth() + 1).padStart(2, '0');
  const year = date.getFullYear();
  return `${year}-${month}-${day}`;
}

/**
 * Crea un objeto JSON para un POAP
 */
function createPOAPMetadata(tokenId, date, imageUri) {
  return {
    name: `POAP Misiva #${tokenId}`,
    description: `Reclamado el ${formatDate(date)} - Prueba de participacion de reciclaje`,
    image: imageUri,
    attributes: [
      {
        trait_type: 'Token ID',
        value: String(tokenId)
      },
      {
        trait_type: 'Fecha',
        value: formatDateISO(date)
      },
      {
        trait_type: 'Mes',
        value: getMonthInSpanish(date)
      },
      {
        trait_type: 'Coleccion',
        value: 'Misiva Genesis'
      }
    ]
  };
}

/**
 * Crea directorios si no existen
 */
function ensureDirectoriesExist() {
  if (!fs.existsSync(METADATA_DIR)) {
    fs.mkdirSync(METADATA_DIR, { recursive: true });
    console.log(`✅ Carpeta creada: ${METADATA_DIR}`);
  }

  if (!fs.existsSync(JSON_DIR)) {
    fs.mkdirSync(JSON_DIR, { recursive: true });
    console.log(`✅ Carpeta creada: ${JSON_DIR}`);
  }
}

/**
 * Genera todos los JSONs
 */
function generateMetadataFiles(imageUri) {
  console.log(`\n📝 Generando ${TOTAL_POAPS} archivos JSON...\n`);

  for (let i = 1; i <= TOTAL_POAPS; i++) {
    // Calcular fecha para este POAP (suma días)
    const currentDate = new Date(START_DATE);
    currentDate.setDate(currentDate.getDate() + (i - 1));

    // Crear objeto metadata
    const metadata = createPOAPMetadata(i, currentDate, imageUri);

    // Guardar archivo JSON
    const filePath = path.join(JSON_DIR, `${i}.json`);
    fs.writeFileSync(filePath, JSON.stringify(metadata, null, 2));

    console.log(
      `   ✅ ${i}.json → POAP #${i} (${formatDate(currentDate)} - ${getMonthInSpanish(currentDate)})`
    );
  }

  console.log(`\n✨ ${TOTAL_POAPS} archivos generados exitosamente!`);
}

/**
 * Verifica si la imagen existe
 */
function checkImageExists() {
  const imagePath = path.join(METADATA_DIR, 'poap.png');
  if (!fs.existsSync(imagePath)) {
    console.warn('\n⚠️  ADVERTENCIA: No se encontró poap.png en la carpeta metadata/');
    console.warn('   Asegúrate de copiar tu imagen PNG en esa ubicación.\n');
    return false;
  }
  return true;
}

/**
 * Muestra instrucciones finales
 */
function showFinalInstructions() {
  console.log('\n' + '='.repeat(60));
  console.log('📋 PRÓXIMOS PASOS:');
  console.log('='.repeat(60));
  console.log('\n1️⃣  PREPARAR ARCHIVOS PARA PINATA:');
  console.log(`   Carpeta a subir: ${METADATA_DIR}/`);
  console.log(`   Estructura:
   metadata/
   ├── poap.png
   └── json/
       ├── 1.json
       ├── 2.json
       └── ...20.json`);

  console.log('\n2️⃣  SUBIR A PINATA:');
  console.log('   • Ve a https://app.pinata.cloud');
  console.log('   • Inicia sesión (o crea cuenta si es necesario)');
  console.log('   • Sube la carpeta "metadata" completa');
  console.log('   • Copia el CID que Pinata te genera (ej: QmAbc123...)');

  console.log('\n3️⃣  ACTUALIZAR CONTRATO:');
  console.log('   Usa el CID para actualizar baseURI:');
  console.log('   baseURI = "ipfs://QmTU_CID_AQUI/json/"');
  console.log('   (Con tu CID real de Pinata)');

  console.log('\n4️⃣  VERIFICAR METADATA:');
  console.log('   URL de ejemplo:');
  console.log('   https://gateway.pinata.cloud/ipfs/QmTU_CID_AQUI/json/1.json');

  console.log('\n' + '='.repeat(60) + '\n');
}

// ========== MAIN ==========
function main() {
  console.log('🎨 MISIVA MVP - METADATA GENERATOR\n');
  console.log('=' + '='.repeat(58) + '\n');

  try {
    // 1. Crear directorios
    ensureDirectoriesExist();

    // 2. Verificar imagen
    const imageExists = checkImageExists();
    if (!imageExists) {
      console.error('❌ No se puede continuar sin la imagen.\n');
      process.exit(1);
    }

    // 3. Generar JSONs
    const imageUri = 'ipfs://bafybeigp3ysvkuprw4sc3o2cpkqv466rsjduuw434kkmram67e4omurzh4/poap.png'; // CID real de Pinata
    generateMetadataFiles(imageUri);

    // 4. Mostrar instrucciones
    showFinalInstructions();

    console.log('✅ Generación completada!\n');
  } catch (error) {
    console.error('\n❌ Error durante la generación:');
    console.error(error.message);
    process.exit(1);
  }
}

// Ejecutar
main();