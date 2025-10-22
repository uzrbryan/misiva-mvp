// =============================================
// 🚀 MISIVA MVP - BACKEND SERVER
// =============================================

const express = require('express');
const cors = require('cors');
require('dotenv').config();

const { initDatabase } = require('./db');
const mintRoutes = require('./routes/mint');

// ========== CONFIGURACIÓN ==========
const app = express();
const PORT = process.env.PORT || 5000;

// ========== MIDDLEWARES ==========

// CORS - Permitir requests desde el frontend
app.use(cors({
  origin: process.env.CORS_ORIGIN || 'http://localhost:3000',
  credentials: true
}));

// Parser de JSON
app.use(express.json());

// Logger de requests
app.use((req, res, next) => {
  const timestamp = new Date().toISOString();
  console.log(`[${timestamp}] ${req.method} ${req.path}`);
  next();
});

// ========== ROUTES ==========

// Health check
app.get('/health', (req, res) => {
  res.json({
    status: 'ok',
    service: 'Misiva Backend API',
    timestamp: new Date().toISOString()
  });
});

// API routes
app.use('/api', mintRoutes);

// 404 handler
app.use((req, res) => {
  res.status(404).json({
    error: 'Endpoint no encontrado',
    path: req.path
  });
});

// Error handler
app.use((error, req, res, next) => {
  console.error('Error global:', error);
  res.status(500).json({
    error: 'Error interno del servidor',
    message: error.message
  });
});

// ========== INICIALIZACIÓN ==========

const startServer = async () => {
  try {
    console.log('🚀 Iniciando servidor Misiva Backend...\n');

    // Verificar variables de entorno
    if (!process.env.DATABASE_URL) {
      throw new Error('DATABASE_URL no configurada en .env');
    }
    if (!process.env.CONTRACT_ADDRESS) {
      throw new Error('CONTRACT_ADDRESS no configurada en .env');
    }
    if (!process.env.RPC_URL) {
      throw new Error('RPC_URL no configurada en .env');
    }
    if (!process.env.PRIVATE_KEY) {
      throw new Error('PRIVATE_KEY no configurada en .env');
    }

    console.log('✅ Variables de entorno verificadas');

    // Inicializar base de datos
    await initDatabase();

    // Iniciar servidor
    app.listen(PORT, () => {
      console.log('\n' + '='.repeat(60));
      console.log('✨ SERVIDOR INICIADO EXITOSAMENTE');
      console.log('='.repeat(60));
      console.log(`🌐 URL: http://localhost:${PORT}`);
      console.log(`📊 Health check: http://localhost:${PORT}/health`);
      console.log(`🪙 Mint endpoint: http://localhost:${PORT}/api/mint`);
      console.log(`🔍 Get POAPs: http://localhost:${PORT}/api/poaps/:wallet`);
      console.log(`📈 Stats: http://localhost:${PORT}/api/stats`);
      console.log('='.repeat(60) + '\n');
      console.log('💡 Tip: Asegúrate de que Hardhat node esté corriendo');
      console.log('   Comando: npx hardhat node\n');
    });

  } catch (error) {
    console.error('❌ Error al iniciar servidor:');
    console.error(error.message);
    process.exit(1);
  }
};

// Iniciar servidor
startServer();

// ========== MANEJO DE SEÑALES ==========

process.on('SIGINT', () => {
  console.log('\n\n👋 Cerrando servidor...');
  process.exit(0);
});

process.on('SIGTERM', () => {
  console.log('\n\n👋 Cerrando servidor...');
  process.exit(0);
});