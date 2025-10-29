// =============================================
// 🪙 MISIVA MVP - MINT LOGIC
// =============================================

import { getRotativeWallet, formatAddress } from './wallets.js';

// API endpoint
const API_URL = 'http://localhost:5000/api';

/**
 * Obtener el próximo número de POAP para asignar wallet
 */
// CAMBIAR la función getNextPOAPNumber():
async function getNextPOAPNumber() {
  try {
    const response = await fetch(`${API_URL}/next-token-id`);
    const data = await response.json();
    
    if (data.success) {
      return parseInt(data.nextTokenId);
    }
    
    // Fallback al método anterior si falla
    const statsResponse = await fetch(`${API_URL}/stats`);
    const statsData = await statsResponse.json();
    
    if (statsData.success && statsData.stats.length > 0) {
      const totalPOAPs = statsData.stats.reduce((sum, stat) => sum + parseInt(stat.total_poaps), 0);
      return totalPOAPs + 1;
    }
    
    return 1;
  } catch (error) {
    console.error('Error obteniendo next token ID:', error);
    return Math.floor(Date.now() / 1000) % 20 + 1;
  }
}

/**
 * Mintear un POAP
 * @param {string} userName - Nombre del usuario
 * @returns {Promise<object>} Resultado del mint
 */
export async function mintPOAP(userName) {
  try {
    // 1. Obtener el próximo número de POAP
    const nextPOAPNumber = await getNextPOAPNumber();
    console.log(`📊 Next POAP number: ${nextPOAPNumber}`);
    
    // 2. Asignar wallet de forma rotativa
    const wallet = getRotativeWallet(nextPOAPNumber);
    console.log(`💼 Assigned wallet: ${wallet.label} (${wallet.address})`);
    
    // 3. Llamar al backend para mintear
    console.log('🔄 Calling backend...');
    const response = await fetch(`${API_URL}/mint`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        walletAddress: wallet.address,
        userName: userName
      })
    });
    
    const data = await response.json();
    
    // 4. Verificar respuesta
    if (!response.ok) {
      throw new Error(data.error || 'Error al mintear POAP');
    }
    
    if (!data.success) {
      throw new Error(data.error || 'Error desconocido');
    }
    
    console.log('✅ Mint successful!', data);
    
    // 5. Retornar datos completos
    return {
      success: true,
      userName: data.data.userName,
      walletAddress: data.data.walletAddress,
      walletAddressShort: formatAddress(data.data.walletAddress),
      tokenId: data.data.tokenId,
      txHash: data.data.txHash,
      timestamp: data.data.timestamp,
      walletLabel: wallet.label
    };
    
  } catch (error) {
    console.error('❌ Error en mintPOAP:', error);
    return {
      success: false,
      error: error.message
    };
  }
}