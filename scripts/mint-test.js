// =============================================
// 🧪 MISIVA MVP - TEST MINT SCRIPT
// =============================================
// Script para probar el minteo de POAPs

const hre = require("hardhat");

async function main() {
  console.log("🧪 Iniciando test de mint...\n");

  // ========== CONFIGURACIÓN ==========
  // 👇 REEMPLAZÁ con tu contract address del deploy
  const CONTRACT_ADDRESS = "0x5FbDB2315678afecb367f032d93F642f64180aa3";
  
  // ========== OBTENER CUENTAS ==========
  const [deployer, user1, user2, user3] = await hre.ethers.getSigners();
  
  console.log("👤 Deployer (Owner):", deployer.address);
  console.log("👤 Usuario 1:", user1.address);
  console.log("👤 Usuario 2:", user2.address);
  console.log("👤 Usuario 3:", user3.address);
  console.log();

  // ========== CONECTAR AL CONTRATO ==========
  console.log("🔗 Conectando al contrato...");
  const EcoPOAP = await hre.ethers.getContractFactory("EcoPOAP");
  const ecoPOAP = EcoPOAP.attach(CONTRACT_ADDRESS);
  
  console.log("✅ Conectado al contrato:", CONTRACT_ADDRESS);
  console.log();

  // ========== INFO DEL CONTRATO ==========
  console.log("📊 Información del contrato:");
  const name = await ecoPOAP.name();
  const symbol = await ecoPOAP.symbol();
  const totalSupply = await ecoPOAP.totalSupply();
  
  console.log(`   Nombre: ${name}`);
  console.log(`   Símbolo: ${symbol}`);
  console.log(`   Total Supply: ${totalSupply.toString()}`);
  console.log();

  // ========== MINTEAR POAP A USER1 ==========
  console.log("🪙 Minteando POAP #1 a Usuario 1...");
  const tx1 = await ecoPOAP.mint(user1.address);
  const receipt1 = await tx1.wait();
  
  console.log("✅ POAP #1 minteado!");
  console.log(`   Tx Hash: ${receipt1.hash}`);
  console.log(`   Gas usado: ${receipt1.gasUsed.toString()}`);
  console.log();

  // ========== MINTEAR POAP A USER2 ==========
  console.log("🪙 Minteando POAP #2 a Usuario 2...");
  const tx2 = await ecoPOAP.mint(user2.address);
  const receipt2 = await tx2.wait();
  
  console.log("✅ POAP #2 minteado!");
  console.log(`   Tx Hash: ${receipt2.hash}`);
  console.log();

  // ========== MINTEAR POAP A USER3 ==========
  console.log("🪙 Minteando POAP #3 a Usuario 3...");
  const tx3 = await ecoPOAP.mint(user3.address);
  const receipt3 = await tx3.wait();
  
  console.log("✅ POAP #3 minteado!");
  console.log(`   Tx Hash: ${receipt3.hash}`);
  console.log();

  // ========== VERIFICAR SUPPLY ==========
  console.log("📊 Verificando supply actualizado...");
  const newTotalSupply = await ecoPOAP.totalSupply();
  console.log(`   Total Supply: ${newTotalSupply.toString()}`);
  console.log();

  // ========== VER BALANCES ==========
  console.log("💰 Balances de usuarios:");
  const balance1 = await ecoPOAP.balanceOf(user1.address);
  const balance2 = await ecoPOAP.balanceOf(user2.address);
  const balance3 = await ecoPOAP.balanceOf(user3.address);
  
  console.log(`   Usuario 1: ${balance1.toString()} POAP(s)`);
  console.log(`   Usuario 2: ${balance2.toString()} POAP(s)`);
  console.log(`   Usuario 3: ${balance3.toString()} POAP(s)`);
  console.log();

  // ========== VER TOKEN IDs DE USER1 ==========
  console.log("🔍 Token IDs de Usuario 1:");
  const tokens1 = await ecoPOAP.tokensOfOwner(user1.address);
  console.log(`   Token IDs: [${tokens1.toString()}]`);
  
  // ========== VER TOKEN URI ==========
  if (tokens1.length > 0) {
    const tokenId = tokens1[0];
    const tokenURI = await ecoPOAP.tokenURI(tokenId);
    console.log(`   Token URI del #${tokenId}: ${tokenURI}`);
  }
  console.log();

  // ========== PRUEBA DE BATCH MINT ==========
  console.log("🎯 Probando batch mint...");
  const recipients = [user1.address, user2.address]; // Mintear uno más a cada uno
  
  const batchTx = await ecoPOAP.batchMint(recipients);
  const batchReceipt = await batchTx.wait();
  
  console.log("✅ Batch mint exitoso!");
  console.log(`   Tx Hash: ${batchReceipt.hash}`);
  console.log(`   POAPs minteados: ${recipients.length}`);
  console.log();

  // ========== VERIFICAR BALANCES FINALES ==========
  console.log("💰 Balances finales:");
  const finalBalance1 = await ecoPOAP.balanceOf(user1.address);
  const finalBalance2 = await ecoPOAP.balanceOf(user2.address);
  const finalBalance3 = await ecoPOAP.balanceOf(user3.address);
  
  console.log(`   Usuario 1: ${finalBalance1.toString()} POAP(s)`);
  console.log(`   Usuario 2: ${finalBalance2.toString()} POAP(s)`);
  console.log(`   Usuario 3: ${finalBalance3.toString()} POAP(s)`);
  console.log();

  // ========== SUPPLY FINAL ==========
  const finalSupply = await ecoPOAP.totalSupply();
  console.log("📊 Supply final:", finalSupply.toString());
  console.log();

  console.log("✨ Test completado exitosamente!\n");
}

// ========== MANEJO DE ERRORES ==========
main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error("\n❌ Error durante el test:");
    console.error(error);
    process.exit(1);
  });