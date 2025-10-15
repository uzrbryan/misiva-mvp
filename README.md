# 🌱 Misiva MVP - Sistema de POAPs para Reciclaje

Sistema Web3 que incentiva el reciclaje mediante la emisión de **POAPs** (Proof of Attendance Protocol) como NFTs coleccionables. Los usuarios reciben tokens únicos al participar en actividades de reciclaje, creando un registro inmutable de su compromiso ambiental.

##  Objetivo

Crear un ecosistema que combine **impacto ambiental** con **tecnología blockchain**, donde cada acción de reciclaje se recompensa con un NFT único que certifica la participación y construye una identidad digital verde.

##  Estado del Proyecto

**📍 Fase Actual: 2.3** (Desarrollo Backend)
- ✅ **Fase 2.1**: Smart Contract EcoPOAP
- ✅ **Fase 2.2**: Sistema de Metadata IPFS
- ✅ **Fase 2.3**: Testing Local & Deploy
- 🔄 **Fase 2.4**: Backend API (En desarrollo)
- ⏳ **Fase 2.5**: Integración Frontend-Backend
- ⏳ **Fase 2.6**: Deploy Testnet & Testing Final

##  Arquitectura

```
┌─────────────────────────────────────────────────┐
│  FRONTEND (HTML5 + Bootstrap + Web3.js)        │
│  • index.html (landing)                        │
│  • mis-poaps.html (colección de NFTs)         │
└──────────────────┬──────────────────────────────┘
                   │ Fetch API
                   ↓
┌─────────────────────────────────────────────────┐
│  BACKEND (Node.js + Express)                   │
│  • POST /api/mint (mintear POAP)               │
│  • GET /api/poaps/:wallet (consultar POAPs)   │
└──────────────────┬──────────────────────────────┘
                   │
        ┌──────────┴──────────┐
        ↓                     ↓
┌──────────────┐    ┌──────────────────────┐
│   SQLite     │    │   SMART CONTRACT     │
│              │    │   • EcoPOAP.sol      │
│  claims.db   │    │   • ERC-721 NFTs     │
│  - wallet    │    │   • Polygon Amoy     │
│  - token_id  │    │                      │
│  - tx_hash   │    │   FUNCIONES:         │
│  - fecha     │    │   • mint(address)    │
└──────────────┘    │   • batchMint()      │
                    │   • tokenURI()       │
                    └───────────┬──────────┘
                                ↓
                    ┌──────────────────────┐
                    │   PINATA/IPFS        │
                    │   • metadata/        │
                    │   • poap.png         │
                    │   • 1.json...20.json │
                    └──────────────────────┘
```

## 🛠️ Stack Tecnológico

### **Frontend**
- **HTML5 + CSS3** - Estructura y estilos
- **Bootstrap 5** - UI Framework (vía CDN)
- **Vanilla JavaScript (ES6+)** - Lógica del cliente
- **Web3.js** - Conexión con wallet y blockchain

### **Backend**
- **Node.js v18+** - Runtime de JavaScript
- **Express.js** - Framework web
- **viem** - Librería para interacción blockchain
- **better-sqlite3** - Base de datos local
- **cors, dotenv** - Middleware y configuración

### **Blockchain**
- **Solidity ^0.8.21** - Smart contracts
- **OpenZeppelin** - Librerías de contratos seguros
- **Hardhat** - Framework de desarrollo
- **Polygon Amoy Testnet** - Red de pruebas
- **IPFS/Pinata** - Almacenamiento descentralizado

## 📁 Estructura del Proyecto

```
misiva-mvp/
├── 📄 README.md                    # Este archivo
├── 📄 package.json                 # Dependencias del proyecto
├── 📄 hardhat.config.js           # Configuración Hardhat
├── 📄 hardhat.config.minimal.js   # Config para testing local
├── 📄 .env                        # Variables de entorno
├── 📄 .gitignore                  # Archivos ignorados
│
├── 📁 contracts/                   # Smart Contracts
│   ├── EcoPOAP.sol                # Contrato principal NFT
│   └── hardhat.config.js          # Config específica
│
├── 📁 scripts/                     # Scripts de automatización
│   ├── deploy.js                  # Deploy del contrato
│   ├── mint-test.js              # Testing de minteo
│   └── prepare-metadata.js       # Generador de metadata
│
├── 📁 metadata/                    # Metadata de NFTs
│   ├── poap.png                  # Imagen del POAP
│   └── json/                     # Metadata JSON
│       ├── 1.json                # Token #1
│       ├── 2.json                # Token #2
│       └── ...                   # Hasta 20.json
│
├── 📁 frontend/                    # Frontend web
│   ├── index.html                # Página principal
│   ├── mis-poaps.html           # Ver colección
│   ├── css/                     # Estilos compilados
│   └── assets/                  # Assets fuente
│       └── scss/                # Sass/SCSS files
│
├── 📁 backend/                     # API Backend (En desarrollo)
│   ├── server.js                # Servidor Express
│   ├── routes/                  # Rutas de API
│   └── database/               # Configuración SQLite
│
├── 📁 artifacts/                   # Contratos compilados (Hardhat)
├── 📁 cache/                      # Cache de compilación
└── 📁 node_modules/               # Dependencias instaladas
```

##  Desarrollo y Testing

### **Compilar Contratos**
```bash
npm install
npx hardhat compile
```

### **Testing Local**
```bash
# Terminal 1: Levantar nodo local
npx hardhat node --config hardhat.config.minimal.js

# Terminal 2: Deploy y testing
npx hardhat run scripts/deploy.js --config hardhat.config.minimal.js --network localhost
npx hardhat run scripts/mint-test.js --config hardhat.config.minimal.js --network localhost
```

### **Generar Metadata**
```bash
# Generar 20 archivos JSON para metadata
node scripts/prepare-metadata.js

# Resultado: metadata/json/1.json ... 20.json
```

## 🌐 Deploy en Testnet

### **Polygon Amoy**
```bash
# Configurar .env con:
# PRIVATE_KEY=tu_private_key
# ALCHEMY_AMOY_URL=https://polygon-amoy.g.alchemy.com/v2/API_KEY

# Deploy en testnet real
npx hardhat run scripts/deploy.js --network amoy
```

## 🎮 Funcionalidades Implementadas

### **Smart Contract (EcoPOAP.sol)**
- ✅ **Minteo individual**: `mint(address to)`
- ✅ **Minteo masivo**: `batchMint(address[] recipients)`
- ✅ **Metadata dinámica**: Base URI configurable
- ✅ **Control de acceso**: Solo owner puede mintear
- ✅ **Supply tracking**: Contador de tokens
- ✅ **Enumerable**: Consultar tokens por wallet

### **Sistema de Metadata**
- ✅ **IPFS Integration**: Almacenamiento descentralizado
- ✅ **Metadata JSON**: Nombre, descripción, atributos
- ✅ **Fechas dinámicas**: POAPs con fechas únicas
- ✅ **Imágenes**: PNG optimizado para NFTs

## 🔗 Enlaces y Recursos

### **Smart Contract**
- **Testnet Address**: `0x5FC8d32690cc91D4c39d9d3abcBD16989F875707` (Local)
- **Red**: Hardhat Local Network / Polygon Amoy

### **Metadata IPFS**
- **CID**: `bafybeia33b6grqnicl2cg2xstgxhb4wyzntmrklxllbu5g6naw3nyio4xa`
- **Gateway**: https://gateway.pinata.cloud/ipfs/[CID]/json/1.json

## 👥 Contribución

Este proyecto está en desarrollo activo. Las contribuciones son bienvenidas:

1. Fork del repositorio
2. Crear branch para feature (`git checkout -b feature/AmazingFeature`)
3. Commit cambios (`git commit -m 'Add some AmazingFeature'`)
4. Push al branch (`git push origin feature/AmazingFeature`)
5. Abrir Pull Request

## 📝 Licencia

Este proyecto está bajo la Licencia MIT - ver el archivo [LICENSE](LICENSE) para detalles.

## 🔍 Roadmap Futuro

- [ ] **Fase 3**: Implementación completa del backend
- [ ] **Fase 4**: Integración con múltiples wallets
- [ ] **Fase 5**: Sistema de gamificación
- [ ] **Fase 6**: Deploy en Polygon Mainnet
- [ ] **Fase 7**: Marketplace de POAPs

---
