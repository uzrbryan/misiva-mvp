// =============================================
// 🗄️ MISIVA MVP - DATABASE SETUP (PostgreSQL + Neon)
// =============================================

const { Pool } = require('pg');
require('dotenv').config();

// ========== CONFIGURACIÓN ==========
const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
  ssl: {
    rejectUnauthorized: false // Necesario para Neon
  }
});

// ========== INICIALIZAR TABLA ==========
const initDatabase = async () => {
  console.log('🗄️  Inicializando base de datos...\n');

  const createTableQuery = `
    CREATE TABLE IF NOT EXISTS claims (
      id SERIAL PRIMARY KEY,
      wallet_address VARCHAR(42) NOT NULL,
      user_name VARCHAR(100),
      token_id INTEGER UNIQUE NOT NULL,
      tx_hash VARCHAR(66) UNIQUE,
      material_type VARCHAR(50),
      weight DECIMAL(10,2),
      ecopoint_location VARCHAR(100),
      fecha_creacion TIMESTAMP DEFAULT CURRENT_TIMESTAMP
    );

    CREATE INDEX IF NOT EXISTS idx_wallet_address ON claims(wallet_address);
    CREATE INDEX IF NOT EXISTS idx_fecha_creacion ON claims(fecha_creacion);
  `;

  try {
    await pool.query(createTableQuery);
    console.log('✅ Tabla "claims" creada/verificada exitosamente');
    
    // Verificar conexión
    const result = await pool.query('SELECT COUNT(*) FROM claims');
    console.log(`📊 Registros actuales en la tabla: ${result.rows[0].count}`);
    console.log('✅ Conexión a Neon exitosa!\n');
  } catch (error) {
    console.error('❌ Error al inicializar la base de datos:');
    console.error(error.message);
    throw error;
  }
};

// ========== FUNCIONES DE BASE DE DATOS ==========

/**
 * Verificar si una wallet ya reclamó POAP hoy
 */
const checkRateLimit = async (walletAddress) => {
  const hoursLimit = parseInt(process.env.RATE_LIMIT_HOURS || '24');
  
  const query = `
    SELECT * FROM claims 
    WHERE wallet_address = $1 
    AND fecha_creacion > NOW() - INTERVAL '${hoursLimit} hours'
    ORDER BY fecha_creacion DESC
    LIMIT 1
  `;

  try {
    const result = await pool.query(query, [walletAddress.toLowerCase()]);
    
    if (result.rows.length > 0) {
      const lastClaim = result.rows[0];
      return {
        canClaim: false,
        lastClaim: lastClaim.fecha_creacion,
        message: `Ya reclamaste un POAP en las últimas ${hoursLimit} horas`
      };
    }

    return { canClaim: true };
  } catch (error) {
    console.error('Error checking rate limit:', error);
    throw error;
  }
};

/**
 * Guardar un nuevo claim
 */
const saveClaim = async (claimData) => {
  const {
    walletAddress,
    userName,
    tokenId,
    txHash,
    materialType = null,
    weight = null,
    ecopointLocation = null
  } = claimData;

  const query = `
    INSERT INTO claims 
    (wallet_address, user_name, token_id, tx_hash, material_type, weight, ecopoint_location)
    VALUES ($1, $2, $3, $4, $5, $6, $7)
    RETURNING *
  `;

  try {
    const result = await pool.query(query, [
      walletAddress.toLowerCase(),
      userName,
      tokenId,
      txHash,
      materialType,
      weight,
      ecopointLocation
    ]);

    return result.rows[0];
  } catch (error) {
    console.error('Error saving claim:', error);
    throw error;
  }
};

/**
 * Obtener todos los POAPs de una wallet
 */
const getPOAPsByWallet = async (walletAddress) => {
  const query = `
    SELECT * FROM claims 
    WHERE wallet_address = $1 
    ORDER BY fecha_creacion DESC
  `;

  try {
    const result = await pool.query(query, [walletAddress.toLowerCase()]);
    return result.rows;
  } catch (error) {
    console.error('Error getting POAPs:', error);
    throw error;
  }
};

/**
 * Obtener el próximo token ID disponible
 */
const getNextTokenId = async () => {
  const query = `
    SELECT COALESCE(MAX(token_id), 0) + 1 as next_id 
    FROM claims
  `;

  try {
    const result = await pool.query(query);
    return result.rows[0].next_id;
  } catch (error) {
    console.error('Error getting next token ID:', error);
    throw error;
  }
};

/**
 * Obtener estadísticas generales
 */
const getStats = async () => {
  const query = `
    SELECT 
      COUNT(*) as total_poaps,
      COUNT(DISTINCT wallet_address) as unique_users,
      SUM(weight) as total_weight,
      material_type,
      COUNT(*) as count_by_material
    FROM claims
    GROUP BY material_type
  `;

  try {
    const result = await pool.query(query);
    return result.rows;
  } catch (error) {
    console.error('Error getting stats:', error);
    throw error;
  }
};

// ========== EXPORTS ==========
module.exports = {
  pool,
  initDatabase,
  checkRateLimit,
  saveClaim,
  getPOAPsByWallet,
  getNextTokenId,
  getStats
};

// ========== AUTO-INIT (si se ejecuta directamente) ==========
if (require.main === module) {
  initDatabase()
    .then(() => {
      console.log('✨ Base de datos lista para usar!\n');
      process.exit(0);
    })
    .catch((error) => {
      console.error('❌ Error fatal:', error.message);
      process.exit(1);
    });
}