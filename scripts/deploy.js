// =============================================
// 🚀 MISIVA MVP - DEPLOY SCRIPT
// =============================================
// Este script funciona para localhost Y Polygon Amoy

const hre = require("hardhat");

async function main() {
  console.log("🚀 Iniciando deploy del contrato EcoPOAP...\n");

  // ========== CONFIGURACIÓN ==========
  const NAME = "EcoPOAP Misiva";
  const SYMBOL = "EPOAP";
  
  // Metadata URI base (IPFS)
  // 👇 Por ahora usamos un placeholder, lo actualizás después con Pinata
  const BASE_TOKEN_URI = "ipfs://QmPlaceholder/";
  
  // Max supply (0 = ilimitado)
  const MAX_SUPPLY = 0; // Sin límite para el MVP

  // ========== INFO DEL DEPLOY ==========
  console.log("📋 Configuración del contrato:");
  console.log(`   Nombre: ${NAME}`);
  console.log(`   Símbolo: ${SYMBOL}`);
  console.log(`   Base URI: ${BASE_TOKEN_URI}`);
  console.log(`   Max Supply: ${MAX_SUPPLY === 0 ? "Ilimitado" : MAX_SUPPLY}`);
  console.log(`   Red: ${hre.network.name}\n`);

  // ========== OBTENER DEPLOYER ==========
  const [deployer] = await hre.ethers.getSigners();
  console.log("👤 Deploying con la cuenta:", deployer.address);
  
  // Mostrar balance (útil para debugging)
  const balance = await hre.ethers.provider.getBalance(deployer.address);
  console.log("💰 Balance:", hre.ethers.formatEther(balance), "ETH\n");

  // ========== DEPLOY DEL CONTRATO ==========
  console.log("⏳ Deployando contrato EcoPOAP...");
  
  const EcoPOAP = await hre.ethers.getContractFactory("EcoPOAP");
  const ecoPOAP = await EcoPOAP.deploy(NAME, SYMBOL, BASE_TOKEN_URI, MAX_SUPPLY);

  await ecoPOAP.waitForDeployment();
  
  const contractAddress = await ecoPOAP.getAddress();

  console.log("✅ Contrato deployado exitosamente!\n");
  console.log("📍 Contract Address:", contractAddress);
  console.log("👤 Owner:", deployer.address);

  // ========== VERIFICAR DEPLOY ==========
  console.log("\n🔍 Verificando deploy...");
  
  const name = await ecoPOAP.name();
  const symbol = await ecoPOAP.symbol();
  const maxSupply = await ecoPOAP.maxSupply();
  const baseURI = await ecoPOAP.baseTokenURI();

  console.log("   Nombre:", name);
  console.log("   Símbolo:", symbol);
  console.log("   Max Supply:", maxSupply.toString());
  console.log("   Base URI:", baseURI);

  // ========== GUARDAR PARA .ENV ==========
  console.log("\n📝 Guardá este address en tu .env:");
  console.log(`CONTRACT_ADDRESS=${contractAddress}`);

  // ========== EXPLORER LINKS ==========
  if (hre.network.name === "amoy") {
    console.log("\n🔗 Ver en PolygonScan:");
    console.log(`https://amoy.polygonscan.com/address/${contractAddress}`);
  } else if (hre.network.name === "polygon") {
    console.log("\n🔗 Ver en PolygonScan:");
    console.log(`https://polygonscan.com/address/${contractAddress}`);
  } else if (hre.network.name === "localhost") {
    console.log("\n🏠 Deploy local exitoso!");
    console.log("   Usá este address en tu backend para testing");
  }

  console.log("\n✨ Deploy completado!\n");
}

// ========== MANEJO DE ERRORES ==========
main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error("\n❌ Error durante el deploy:");
    console.error(error);
    process.exit(1);
  });