// =============================================
// 💼 MISIVA MVP - HARDHAT WALLETS
// =============================================
// Lista de las 20 wallets de prueba de Hardhat

export const HARDHAT_WALLETS = [
  {
    id: 1,
    address: "0xf39Fd6e51aad88F6F4ce6aB8827279cffFb92266",
    label: "Wallet #1"
  },
  {
    id: 2,
    address: "0x70997970C51812dc3A010C7d01b50e0d17dc79C8",
    label: "Wallet #2"
  },
  {
    id: 3,
    address: "0x3C44CdDdB6a900fa2b585dd299e03d12FA4293BC",
    label: "Wallet #3"
  },
  {
    id: 4,
    address: "0x90F79bf6EB2c4f870365E785982E1f101E93b906",
    label: "Wallet #4"
  },
  {
    id: 5,
    address: "0x15d34AAf54267DB7D7c367839AAf71A00a2C6A65",
    label: "Wallet #5"
  },
  {
    id: 6,
    address: "0x9965507D1a55bcC2695C58ba16FB37d819B0A4dc",
    label: "Wallet #6"
  },
  {
    id: 7,
    address: "0x976EA74026E726554dB657fA54763abd0C3a0aa9",
    label: "Wallet #7"
  },
  {
    id: 8,
    address: "0x14dC79964da2C08b23698B3D3cc7Ca32193d9955",
    label: "Wallet #8"
  },
  {
    id: 9,
    address: "0x23618e81E3f5cdF7f54C3d65f7FBc0aBf5B21E8f",
    label: "Wallet #9"
  },
  {
    id: 10,
    address: "0xa0Ee7A142d267C1f36714E4a8F75612F20a79720",
    label: "Wallet #10"
  },
  {
    id: 11,
    address: "0xBcd4042DE499D14e55001CcbB24a551F3b954096",
    label: "Wallet #11"
  },
  {
    id: 12,
    address: "0x71bE63f3384f5fb98995898A86B02Fb2426c5788",
    label: "Wallet #12"
  },
  {
    id: 13,
    address: "0xFABB0ac9d68B0B445fB7357272Ff202C5651694a",
    label: "Wallet #13"
  },
  {
    id: 14,
    address: "0x1CBd3b2770909D4e10f157cABC84C7264073C9Ec",
    label: "Wallet #14"
  },
  {
    id: 15,
    address: "0xdF3e18d64BC6A983f673Ab319CCaE4f1a57C7097",
    label: "Wallet #15"
  },
  {
    id: 16,
    address: "0xcd3B766CCDd6AE721141F452C550Ca635964ce71",
    label: "Wallet #16"
  },
  {
    id: 17,
    address: "0x2546BcD3c84621e976D8185a91A922aE77ECEc30",
    label: "Wallet #17"
  },
  {
    id: 18,
    address: "0xbDA5747bFD65F08deb54cb465eB87D40e51B197E",
    label: "Wallet #18"
  },
  {
    id: 19,
    address: "0xdD2FD4581271e230360230F9337D5c0430Bf44C0",
    label: "Wallet #19"
  },
  {
    id: 20,
    address: "0x8626f6940E2eb28930eFb4CeF49B2d1F2C9C1199",
    label: "Wallet #20"
  }
];

/**
 * Obtener wallet de forma rotativa según el índice
 * @param {number} index - Índice del POAP (empezando desde 1)
 * @returns {object} Wallet object con address y label
 */
export function getRotativeWallet(index) {
  // Convertir a índice 0-based y hacer módulo 20
  const walletIndex = (index - 1) % HARDHAT_WALLETS.length;
  return HARDHAT_WALLETS[walletIndex];
}

/**
 * Formatear address para mostrar (0x1234...5678)
 * @param {string} address - Wallet address completa
 * @returns {string} Address formateada
 */
export function formatAddress(address) {
  if (!address) return '';
  return `${address.substring(0, 6)}...${address.substring(address.length - 4)}`;
}