import "@nomicfoundation/hardhat-toolbox";
import { config } from "dotenv";
config();

const { PRIVATE_KEY, ALCHEMY_AMOY_URL, ALCHEMY_POLYGON_URL } = process.env;

// Validación de variables críticas
if (!PRIVATE_KEY) {
  console.warn("⚠️  WARNING: PRIVATE_KEY not found in .env file");
}

if (!ALCHEMY_AMOY_URL) {
  console.warn("⚠️  WARNING: ALCHEMY_AMOY_URL not found in .env file");
}

/** @type import('hardhat/config').HardhatUserConfig */
export default {
  solidity: {
    version: "0.8.21",
    settings: {
      optimizer: {
        enabled: true,
        runs: 200,
      },
    },
  },
  networks: {
    // Polygon Amoy Testnet (recomendada para testing)
    amoy: {
      url: ALCHEMY_AMOY_URL || "https://rpc-amoy.polygon.technology/",
      accounts: PRIVATE_KEY ? [`0x${PRIVATE_KEY}`] : [],
      chainId: 80002,
      gasPrice: 35000000000, // 35 gwei
    },
    // Polygon Mainnet (para producción)
    polygon: {
      url: ALCHEMY_POLYGON_URL || "https://polygon-rpc.com/",
      accounts: PRIVATE_KEY ? [`0x${PRIVATE_KEY}`] : [],
      chainId: 137,
    },
    // Localhost para testing local (opcional)
    localhost: {
      url: "http://127.0.0.1:8545",
    },
  },
  paths: {
    sources: "./contracts",
    tests: "./test",
    cache: "./cache",
    artifacts: "./artifacts",
  },
  // Configuración de Etherscan para verificar contratos (opcional)
  etherscan: {
    apiKey: {
      polygonAmoy: process.env.POLYGONSCAN_API_KEY || "",
      polygon: process.env.POLYGONSCAN_API_KEY || "",
    },
  },
};