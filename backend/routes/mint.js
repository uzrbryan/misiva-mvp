// =============================================
// 🪙 MISIVA MVP - MINT ROUTE
// =============================================

const express = require('express');
const { ethers } = require('ethers');
const { checkRateLimit, saveClaim, getNextTokenId } = require('../db');

const router = express.Router();

// ========== ABI DEL CONTRATO ==========
// Solo incluimos las funciones que necesitamos
const CONTRACT_ABI = [
  "function mint(address to) external",
  "function totalSupply() external view returns (uint256)",
  "function nextTokenId() external view returns (uint256)",
  "function ownerOf(uint256 tokenId) external view returns (address)"
];

// ========== CONFIGURACIÓN BLOCKCHAIN ==========
let provider;
let wallet;
let contract;

const initBlockchain = () => {
  try {
    // Conectar a Hardhat local
    provider = new ethers.JsonRpcProvider(process.env.RPC_URL);
    
    // Wallet del deployer (firma las transacciones)
    wallet = new ethers.Wallet(process.env.PRIVATE_KEY, provider);
    
    // Conectar al contrato
    contract = new ethers.Contract(
      process.env.CONTRACT_ADDRESS,
      CONTRACT_ABI,
      wallet
    );

    console.log('✅ Blockchain conectado exitosamente');
    console.log(`   RPC: ${process.env.RPC_URL}`);
    console.log(`   Contract: ${process.env.CONTRACT_ADDRESS}`);
  } catch (error) {
    console.error('❌ Error conectando a blockchain:', error.message);
    throw error;
  }
};

// Inicializar al cargar el módulo
initBlockchain();

// ========== VALIDACIONES ==========

/**
 * Valida formato de wallet address
 */
const isValidAddress = (address) => {
  return ethers.isAddress(address);
};

/**
 * Valida nombre de usuario
 */
const isValidUserName = (name) => {
  return name && name.length >= 2 && name.length <= 100;
};

// ========== ENDPOINT: POST /api/mint ==========

router.post('/mint', async (req, res) => {
  console.log('\n🪙 Nueva solicitud de mint...');
  
  const { walletAddress, userName, materialType, weight, ecopointLocation } = req.body;

  try {
    // ========== VALIDACIONES ==========
    
    // 1. Validar wallet address
    if (!walletAddress || !isValidAddress(walletAddress)) {
      return res.status(400).json({
        success: false,
        error: 'Wallet address inválida'
      });
    }

    // 2. Validar nombre de usuario
    if (!userName || !isValidUserName(userName)) {
      return res.status(400).json({
        success: false,
        error: 'Nombre de usuario inválido (2-100 caracteres)'
      });
    }

    console.log(`   Wallet: ${walletAddress}`);
    console.log(`   Usuario: ${userName}`);

    // 3. Verificar rate limiting (1 POAP por día)
    const rateLimitCheck = await checkRateLimit(walletAddress);
    
    if (!rateLimitCheck.canClaim) {
      console.log('   ❌ Rate limit excedido');
      return res.status(429).json({
        success: false,
        error: rateLimitCheck.message,
        lastClaim: rateLimitCheck.lastClaim
      });
    }

    // ========== MINTEAR NFT ==========
    console.log('🔍 Estado actual del contrato:');
    const currentNextId = await contract.nextTokenId();
    const totalSupply = await contract.totalSupply();
    console.log('   Next Token ID:', currentNextId.toString());
    console.log('   Total Supply:', totalSupply.toString());

    console.log('   ⏳ Minteando NFT...');
    
    // Obtener el próximo token ID del contrato
    const nextTokenId = await contract.nextTokenId();
    console.log(`   Token ID: ${nextTokenId}`);

    // Ejecutar mint en el contrato
    const tx = await contract.mint(walletAddress);
    console.log(`   Tx enviada: ${tx.hash}`);
    
    // Esperar confirmación
    const receipt = await tx.wait();
    console.log(`   ✅ Tx confirmada en bloque ${receipt.blockNumber}`);

    // ========== GUARDAR EN BASE DE DATOS ==========
    
    console.log('   💾 Guardando en base de datos...');
    
    const claimData = {
      walletAddress,
      userName,
      tokenId: Number(nextTokenId),
      txHash: receipt.hash,
      materialType: materialType || null,
      weight: weight || null,
      ecopointLocation: ecopointLocation || null
    };

    const savedClaim = await saveClaim(claimData);
    console.log('   ✅ Guardado exitosamente\n');

    // ========== RESPUESTA EXITOSA ==========
    
    return res.status(200).json({
      success: true,
      message: '¡POAP minteado exitosamente!',
      data: {
        tokenId: Number(nextTokenId),
        txHash: receipt.hash,
        blockNumber: receipt.blockNumber,
        walletAddress: walletAddress,
        userName: userName,
        timestamp: savedClaim.fecha_creacion
      }
    });

  } catch (error) {
    console.error('   ❌ Error en mint:', error.message);
    
    // Errores específicos de blockchain
    if (error.code === 'CALL_EXCEPTION') {
      return res.status(500).json({
        success: false,
        error: 'Error en el contrato. Verificá que el contrato esté deployado.'
      });
    }

    if (error.code === 'NETWORK_ERROR') {
      return res.status(500).json({
        success: false,
        error: 'Error de red. Verificá que Hardhat node esté corriendo.'
      });
    }

    // Error genérico
    return res.status(500).json({
      success: false,
      error: 'Error al mintear POAP',
      details: error.message
    });
  }
});

// ========== ENDPOINT: GET /api/poaps/:wallet ==========

router.get('/poaps/:wallet', async (req, res) => {
  const { wallet } = req.params;

  try {
    // Validar wallet address
    if (!isValidAddress(wallet)) {
      return res.status(400).json({
        success: false,
        error: 'Wallet address inválida'
      });
    }

    // Obtener POAPs de la base de datos
    const { getPOAPsByWallet } = require('../db');
    const poaps = await getPOAPsByWallet(wallet);

    return res.status(200).json({
      success: true,
      count: poaps.length,
      poaps: poaps
    });

  } catch (error) {
    console.error('Error obteniendo POAPs:', error.message);
    
    return res.status(500).json({
      success: false,
      error: 'Error al obtener POAPs',
      details: error.message
    });
  }
});

// ========== ENDPOINT: GET /api/stats ==========

router.get('/stats', async (req, res) => {
  try {
    const { getStats } = require('../db');
    const stats = await getStats();

    return res.status(200).json({
      success: true,
      stats: stats
    });

  } catch (error) {
    console.error('Error obteniendo estadísticas:', error.message);
    
    return res.status(500).json({
      success: false,
      error: 'Error al obtener estadísticas',
      details: error.message
    });
  }
});

// ========== ENDPOINT: GET /api/next-token-id ==========
router.get('/next-token-id', async (req, res) => {
  try {
    console.log('🔍 Consultando next token ID...');
    
    const nextTokenId = await contract.nextTokenId();
    console.log(`   Next Token ID: ${nextTokenId.toString()}`);

    return res.status(200).json({
      success: true,
      nextTokenId: nextTokenId.toString()
    });

  } catch (error) {
    console.error('❌ Error obteniendo next token ID:', error.message);
    
    return res.status(500).json({
      success: false,
      error: 'Error al obtener next token ID',
      details: error.message
    });
  }
});

module.exports = router;