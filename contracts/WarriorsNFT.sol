// SPDX-License-Identifier: MIT
// Compatible with OpenZeppelin Contracts ^5.0.0
pragma solidity ^0.8.20;

import "@openzeppelin/contracts/token/ERC721/ERC721.sol";
import "@openzeppelin/contracts/token/ERC721/extensions/ERC721URIStorage.sol";
import "@openzeppelin/contracts/token/ERC721/extensions/ERC721Burnable.sol";
import "@openzeppelin/contracts/access/Ownable.sol";

// Specifies inherintance from OpenZeppelin contracts
contract Warriors is ERC721, ERC721URIStorage, ERC721Burnable, Ownable {
    // Variable to keep track of the next token ID to be minted
    uint256 private _nextTokenId;

    // Keep track of existing URIs that have been minted
    mapping(string => uint256) existingURIs;

    constructor(address initialOwner)
        ERC721("Warriors", "WAR")
        Ownable(initialOwner)
    {}

    function _baseURI() internal pure override returns (string memory) {
        return "ipfs://";
    }

    function safeMint(address to, string memory uri) public onlyOwner {
        uint256 tokenId = _nextTokenId++;
        _safeMint(to, tokenId);
        _setTokenURI(tokenId, uri);
    }

    // The following functions are overrides required by Solidity.

    function tokenURI(uint256 tokenId)
        public
        view
        override(ERC721, ERC721URIStorage)
        returns (string memory)
    {
        return super.tokenURI(tokenId);
    }

    function supportsInterface(bytes4 interfaceId)
        public
        view
        override(ERC721, ERC721URIStorage)
        returns (bool)
    {
        return super.supportsInterface(interfaceId);
    }

    // Check if an existing URI is already owned
    function isContentOwned(string memory uri) public view returns (bool) {
        return existingURIs[uri] == 1;
    }

    // Allows other people to pay using Ether for an NFT
    function payToMint(
        address recipient,
        uint256 tokenId,
        string memory metadataURI
    ) public payable returns (uint256) {
        require(existingURIs[metadataURI] != 1, 'NFT already minted!');
        require(msg.value >= 0.05 ether, 'Insufficient amount!');

        _nextTokenId++; // Increment to track number of minted IDs
        existingURIs[metadataURI] = 1;

        _mint(recipient, tokenId);
        _setTokenURI(tokenId, metadataURI);

        return tokenId;
    }

    // Get current count of minted tokens
    function count() public view returns (uint256) {
        return _nextTokenId;
    }
}