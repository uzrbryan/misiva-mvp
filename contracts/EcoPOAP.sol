// SPDX-License-Identifier: MIT
pragma solidity ^0.8.21;

import "@openzeppelin/contracts/token/ERC721/extensions/ERC721Enumerable.sol";
import "@openzeppelin/contracts/access/Ownable.sol";

/**
 * @title EcoPOAP
 * @dev Contrato NFT POAP para el sistema de reciclaje Misiva
 * @notice Permite mintear NFTs como prueba de participación en el programa de reciclaje
 */
contract EcoPOAP is ERC721Enumerable, Ownable {
    // ========== STATE VARIABLES ==========
    
    /// @notice URI base para la metadata de los tokens (IPFS)
    string private _baseTokenURI;
    
    /// @notice Contador para el siguiente token ID
    uint256 public nextTokenId = 1;
    
    /// @notice Límite máximo de supply (0 = ilimitado)
    uint256 public immutable maxSupply;
    
    // ========== EVENTS ==========
    
    /// @notice Emitido cuando se actualiza el baseURI
    event BaseTokenURIUpdated(string newURI);
    
    /// @notice Emitido cuando se mintea un nuevo POAP
    event Minted(address indexed to, uint256 indexed tokenId);
    
    /// @notice Emitido cuando se mintean múltiples POAPs
    event BatchMinted(uint256 count);
    
    // ========== CONSTRUCTOR ==========
    
    /**
     * @notice Constructor del contrato
     * @param name_ Nombre del token (ej: "EcoPOAP Misiva")
     * @param symbol_ Símbolo del token (ej: "EPOAP")
     * @param baseTokenURI_ URI base de IPFS para metadata
     * @param maxSupply_ Máximo supply permitido (0 = ilimitado)
     */
    constructor(
        string memory name_,
        string memory symbol_,
        string memory baseTokenURI_,
        uint256 maxSupply_
    ) ERC721(name_, symbol_) Ownable(msg.sender) {
        _baseTokenURI = baseTokenURI_;
        maxSupply = maxSupply_;
    }
    
    // ========== EXTERNAL FUNCTIONS ==========
    
    /**
     * @notice Mintea un nuevo POAP a una dirección específica
     * @param to Dirección del receptor del POAP
     * @dev Solo puede ser llamada por el owner (backend)
     */
    function mint(address to) external onlyOwner {
        _safeMintChecked(to);
    }
    
    /**
     * @notice Mintea múltiples POAPs a diferentes direcciones
     * @param recipients Array de direcciones receptoras
     * @dev Útil para distribuciones masivas
     */
    function batchMint(address[] calldata recipients) external onlyOwner {
        uint256 len = recipients.length;
        require(len > 0, "Empty recipients array");
        
        for (uint256 i = 0; i < len; i++) {
            _safeMintChecked(recipients[i]);
        }
        
        emit BatchMinted(len);
    }
    
    /**
     * @notice Actualiza el baseURI de la metadata
     * @param newURI Nuevo URI base de IPFS
     * @dev Permite actualizar la metadata si es necesario
     */
    function setBaseTokenURI(string calldata newURI) external onlyOwner {
        _baseTokenURI = newURI;
        emit BaseTokenURIUpdated(newURI);
    }
    
    // ========== PUBLIC/VIEW FUNCTIONS ==========
    
    /**
     * @notice Retorna la URI de metadata de un token específico
     * @param tokenId ID del token
     * @return URI completa del token (baseURI + tokenId + .json)
     */
    function tokenURI(uint256 tokenId) public view override returns (string memory) {
        require(_ownerOf(tokenId) != address(0), "Token does not exist");
        
        // Construye la URI: ipfs://CID/1.json, ipfs://CID/2.json, etc.
        return string(abi.encodePacked(_baseTokenURI, _toString(tokenId), ".json"));
    }
    
    /**
     * @notice Retorna el baseURI actual
     * @return URI base de la metadata
     */
    function baseTokenURI() public view returns (string memory) {
        return _baseTokenURI;
    }
    
    /**
     * @notice Retorna todos los token IDs de una wallet
     * @param owner Dirección del propietario
     * @return Array de token IDs
     */
    function tokensOfOwner(address owner) public view returns (uint256[] memory) {
        uint256 balance = balanceOf(owner);
        uint256[] memory tokens = new uint256[](balance);
        
        for (uint256 i = 0; i < balance; i++) {
            tokens[i] = tokenOfOwnerByIndex(owner, i);
        }
        
        return tokens;
    }
    
    // ========== INTERNAL FUNCTIONS ==========
    
    /**
     * @notice Función interna para mintear con validaciones
     * @param to Dirección del receptor
     */
    function _safeMintChecked(address to) internal {
        require(to != address(0), "Cannot mint to zero address");
        
        // Verificar max supply si está configurado
        if (maxSupply != 0) {
            require(totalSupply() + 1 <= maxSupply, "Max supply reached");
        }
        
        uint256 tokenId = nextTokenId++;
        _safeMint(to, tokenId);
        
        emit Minted(to, tokenId);
    }
    
    /**
     * @notice Convierte uint256 a string
     * @param value Número a convertir
     * @return String representation
     */
    function _toString(uint256 value) internal pure returns (string memory) {
        if (value == 0) {
            return "0";
        }
        
        uint256 temp = value;
        uint256 digits;
        
        while (temp != 0) {
            digits++;
            temp /= 10;
        }
        
        bytes memory buffer = new bytes(digits);
        
        while (value != 0) {
            digits -= 1;
            buffer[digits] = bytes1(uint8(48 + uint256(value % 10)));
            value /= 10;
        }
        
        return string(buffer);
    }
    
    // ========== OVERRIDES ==========
    
    /**
     * @notice Override necesario para ERC721Enumerable
     */
    function supportsInterface(bytes4 interfaceId)
        public
        view
        override(ERC721Enumerable)
        returns (bool)
    {
        return super.supportsInterface(interfaceId);
    }
}