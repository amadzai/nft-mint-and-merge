import WalletBalance from "./WalletBalance";
import PropTypes from 'prop-types';
import { useEffect, useState, useCallback } from "react";
import { Row, Col, Button } from 'reactstrap';

import { ethers } from "ethers";
import Warriors from '../artifacts/contracts/WarriorsNFT.sol/Warriors.json'
import { selectWarrior, getTokenIdForWarrior } from '../utils/gacha.js';

import summonImage from '../assets/summon.png';
import '../App.css'

const contractAddress = '0x5FbDB2315678afecb367f032d93F642f64180aa3'

const provider = new ethers.providers.Web3Provider(window.ethereum);
const signer = provider.getSigner();
const contract = new ethers.Contract(contractAddress, Warriors.abi, signer);

function Home() {
    const [totalMinted, setTotalMinted] = useState(0);
    const [mintedTokens, setMintedTokens] = useState([]); // Keep track of all minted tokens
    const MAX_TOKENS = 18; // Maximum number of tokens that can be minted

    useEffect(() => {
        getCount();
    }, []);

    const getCount = async () => {
        const count = await contract.count();
        console.log(parseInt(count));
        setTotalMinted(parseInt(count));
    };

    // Create an array of minted NFTs
    const nfts = mintedTokens;

    const handleMintedToken = (tokenId) => {
        setMintedTokens((prevTokens) => [...prevTokens, tokenId]);
        console.log(mintedTokens.size);
        console.log([...mintedTokens]);
    };

    return (
        <div>
            <WalletBalance />

            <Row>
                {/* Render all the minted NFTs */}
                {nfts.map((tokenId) => (
                    <Col sm="4" key={tokenId}>
                        <NFTImage tokenId={parseInt(tokenId)} isMinting={false} getCount={getCount} />
                    </Col>
                ))}

                {/* Add an extra slot for minting a new NFT if total minted is less than MAX_TOKENS */}
                {totalMinted < MAX_TOKENS && (
                    <Col sm="4">
                        <NFTImage handleMintedToken={handleMintedToken} isMinting={true} getCount={getCount} />
                    </Col>
                )}
            </Row>
        </div>
    );
}

function NFTImage({ tokenId, getCount, isMinting, handleMintedToken }) {
    const contentId = 'QmeMmnTrU4Cx5mUHXb66esBhir4kmdBvrKQtqXxa9DzEcL';
    const metadataURI = `${contentId}/${tokenId}.json`; // for minting
    const metadataJSONURI = `https://gateway.pinata.cloud/ipfs/${contentId}/${tokenId}.json`; // for fetching metadata
    const imageURI = `https://gateway.pinata.cloud/ipfs/${contentId}/${tokenId}.png`;

    const [isMinted, setIsMinted] = useState(false);
    const [attributes, setAttributes] = useState(null);

    const getMintedStatus = useCallback(async () => {
        console.log(`Checking if token ${tokenId} is minted...`);
        const result = await contract.isContentOwned(metadataURI);
        console.log(`Token ${tokenId} is minted:`, result);
        setIsMinted(result);

        if (!result) {
            setAttributes(null);
        }
    }, [metadataURI, tokenId]);

    const fetchMetadata = useCallback(async () => {
        if (isMinted) {
            try {
                const response = await fetch(metadataJSONURI);
                const metadata = await response.json();
                setAttributes(metadata.attributes);
            } catch (error) {
                console.error(`Failed to fetch metadata for token ${tokenId}:`, error);
            }
        }
    }, [metadataJSONURI, isMinted, tokenId]);

    useEffect(() => {
        if (!isMinting) {
            getMintedStatus();
        }
    }, [getMintedStatus, isMinting]);

    useEffect(() => {
        if (isMinted) {
            fetchMetadata();
        }
    }, [fetchMetadata, isMinted]);

    const mintToken = async () => {
        // Use gacha system to select a rarity
        let selectedRarity = selectWarrior();
        console.log(`Selected rarity: ${selectedRarity}`);

        // Get a random token ID based on rarity
        let tokenId = getTokenIdForWarrior(selectedRarity);

        while (tokenId === null) {
            console.log(`Re-rolling due to no available tokens for rarity: ${selectedRarity}`);
            selectedRarity = selectWarrior();  // Pick a new rarity via gacha if no more tokens for a rarity
            tokenId = getTokenIdForWarrior(selectedRarity); 
        }

        const metadataURI = `${contentId}/${tokenId}.json`;

        const connection = contract.connect(signer);
        const addr = connection.address;
        console.log(`Minting token ${tokenId} with rarity ${selectedRarity}...`);

        const result = await contract.payToMint(addr, tokenId, metadataURI, {
            value: ethers.utils.parseEther('0.05'),
        });

        await result.wait();
        getMintedStatus();
        handleMintedToken(tokenId); 
        getCount();
    };

    async function getURI() {
        console.log(`GETURI Token number ${tokenId}`)
        const uri = await contract.tokenURI(tokenId);
        console.log(uri)
        alert(uri);
    }

    return (
        <div>
            <img
                src={isMinting || !isMinted ? summonImage : imageURI}
                className="img-fluid mt-4"
                alt={`Token ${tokenId}`}
            />
            <h5>ID #{tokenId}</h5>

            {isMinted && attributes && (
                <div>
                    <p>Rarity: {attributes.find(attr => attr.trait_type === 'Rarity')?.value}</p>
                    <p>Attack: {attributes.find(attr => attr.trait_type === 'Attack')?.value}</p>
                    <p>Defense: {attributes.find(attr => attr.trait_type === 'Defense')?.value}</p>
                </div>
            )}

            {!isMinted || isMinting ? (
                <Button onClick={mintToken} color="primary" className="d-block m-auto">
                    Mint
                </Button>
            ) : (
                <Button onClick={getURI} color="secondary" className="d-block m-auto">
                    Owned! Show URI
                </Button>
            )}
        </div>
    );
}

NFTImage.propTypes = {
    tokenId: PropTypes.number,
    getCount: PropTypes.func.isRequired,
    isMinting: PropTypes.bool.isRequired,
    handleMintedToken: PropTypes.func
};

export default Home;