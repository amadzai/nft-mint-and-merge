// SPDX-License-Identifier: MIT
// Compatible with OpenZeppelin Contracts ^5.0.0
pragma solidity ^0.8.20;

import "@openzeppelin/contracts/token/ERC721/ERC721.sol";
import "@openzeppelin/contracts/token/ERC721/extensions/ERC721URIStorage.sol";
import "@openzeppelin/contracts/token/ERC721/extensions/ERC721Burnable.sol";
import "@openzeppelin/contracts/access/Ownable.sol";

contract Warriors is ERC721, ERC721URIStorage, ERC721Burnable, Ownable {
    // Variable to keep track of the next token ID to be minted
    uint256 private _nextTokenId;

    // Keep track of existing URIs that have been minted
    mapping(string => uint256) existingURIs;
    // Store the current count of minted tokens for each rarity level
    mapping(string => uint256) public rarityMintedCount;
    // Define the maximum tokens allowed for each rarity level
    mapping(string => uint256) public rarityMaxCount;
    // Mapping to store the rarity of each token
    mapping(uint256 => string) public tokenRarity;

    // Define the rarity levels
    string[] public rarityLevels = [
        "Common",
        "Rare",
        "Epic",
        "Mythic",
        "Legendary"
    ];

    constructor(
        address initialOwner
    ) ERC721("Warriors", "WAR") Ownable(initialOwner) {
        // Set max counts for each rarity
        rarityMaxCount["Common"] = 4;
        rarityMaxCount["Rare"] = 4;
        rarityMaxCount["Epic"] = 4;
        rarityMaxCount["Mythic"] = 4;
        rarityMaxCount["Legendary"] = 2;
    }

    // function _baseURI() internal pure override returns (string memory) {
    //     return "ipfs://";
    // }

    function safeMint(address to, string memory uri) public onlyOwner {
        uint256 tokenId = _nextTokenId++;
        _safeMint(to, tokenId);
        _setTokenURI(tokenId, uri);
    }

    function tokenURI(
        uint256 tokenId
    ) public view override(ERC721, ERC721URIStorage) returns (string memory) {
        return super.tokenURI(tokenId);
    }

    function supportsInterface(
        bytes4 interfaceId
    ) public view override(ERC721, ERC721URIStorage) returns (bool) {
        return super.supportsInterface(interfaceId);
    }

    // Check if an existing URI is already owned
    function isContentOwned(string memory uri) public view returns (bool) {
        return existingURIs[uri] == 1;
    }

    // Declare an event to log token existence
    event TokenExistenceCheck(string tokenURI, uint256 uri);

    // Allows other people to pay using Ether for an NFT
    function payToMint(
        address recipient,
        uint256 tokenId,
        string memory metadataURI,
        string memory rarity
    ) public payable returns (uint256) {
        require(existingURIs[metadataURI] != 1, "NFT already minted!");
        require(msg.value >= 0.05 ether, "Insufficient amount!");

        _nextTokenId++; // Increment to track number of minted IDs
        existingURIs[metadataURI] = 1;

        _mint(recipient, tokenId);
        _setTokenURI(tokenId, metadataURI);
        tokenRarity[tokenId] = rarity;

        emit TokenExistenceCheck(metadataURI, existingURIs[metadataURI]);

        return tokenId;
    }

    // Get current count of minted tokens
    function count() public view returns (uint256) {
        return _nextTokenId;
    }

    // Merging related
    function canMerge(
        uint256 tokenId1,
        uint256 tokenId2
    ) public view returns (bool) {
        require(
            existingURIs[tokenURI(tokenId1)] == 1,
            string(
                abi.encodePacked(
                    "Token 1 ",
                    tokenURI(tokenId1),
                    " does not exist"
                )
            )
        );
        require(
            existingURIs[tokenURI(tokenId2)] == 1,
            string(
                abi.encodePacked(
                    "Token 2 ",
                    tokenURI(tokenId2),
                    " does not exist"
                )
            )
        );

        return compareRarity(tokenId1, tokenId2);
    }

    // Function to compare rarity based on on-chain data
    function compareRarity(
        uint256 tokenId1,
        uint256 tokenId2
    ) public view returns (bool) {
        string memory rarity1 = tokenRarity[tokenId1];
        string memory rarity2 = tokenRarity[tokenId2];

        // Check if either token is Legendary; if so, return false
        if (
            keccak256(bytes(rarity1)) == keccak256(bytes("Legendary")) ||
            keccak256(bytes(rarity2)) == keccak256(bytes("Legendary"))
        ) {
            return false; // Legendary tokens cannot be merged
        }

        return (keccak256(bytes(rarity1)) == keccak256(bytes(rarity2)));
    }
}