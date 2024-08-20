import WalletBalance from "./WalletBalance";
import PropTypes from 'prop-types';
import { useEffect, useState, useCallback } from "react";
import { Row, Col, Button } from 'reactstrap';

import { ethers } from "ethers";
import Warriors from '../artifacts/contracts/WarriorsNFT.sol/Warriors.json'

import summonImage from '../assets/summon.png';
import '../App.css'

const contractAddress = '0x5FbDB2315678afecb367f032d93F642f64180aa3'

const provider = new ethers.providers.Web3Provider(window.ethereum);

// get the end user
const signer = provider.getSigner();

// get the smart contract
const contract = new ethers.Contract(contractAddress, Warriors.abi, signer);

function Home() {
    const [totalMinted, setTotalMinted] = useState(0);

    useEffect(() => {
        getCount();
    }, []);

    const getCount = async () => {
        const count = await contract.count();
        console.log(parseInt(count));
        setTotalMinted(parseInt(count));
    };

    // Create an array of minted NFTs
    const nfts = Array(totalMinted)
        .fill(0)
        .map((_, i) => i);

    return (
        <div>
            <WalletBalance />

            <Row>
                {/* Render all the minted NFTs */}
                {nfts.map((tokenId) => (
                    <Col sm="4" key={tokenId}>
                        <NFTImage tokenId={tokenId} isMinting={false} getCount={getCount} />
                    </Col>
                ))}

                {/* Add an extra slot for minting a new NFT */}
                <Col sm="4">
                    <NFTImage tokenId={totalMinted} isMinting={true} getCount={getCount} />
                </Col>
            </Row>
        </div>
    );
}

function NFTImage({ tokenId, getCount, isMinting }) {
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

        // Clear attributes if not minted
        if (!result) {
            console.log(`Clearing attributes for token ${tokenId} (not minted)`);
            setAttributes(null);
        }
    }, [metadataURI, tokenId]);

    const fetchMetadata = useCallback(async () => {
        if (isMinted) {
            console.log(`Fetching metadata for token ${tokenId}...`);
            try {
                const response = await fetch(metadataJSONURI);
                const metadata = await response.json();
                console.log(`Fetched metadata for token ${tokenId}:`, metadata);
                setAttributes(metadata.attributes);
            } catch (error) {
                console.error(`Failed to fetch metadata for token ${tokenId}:`, error);
            }
        } else {
            console.log(`Token ${tokenId} is not minted, skipping metadata fetch.`);
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
        const connection = contract.connect(signer);
        const addr = connection.address;
        console.log(`Minting token ${tokenId}...`);
        const result = await contract.payToMint(addr, metadataURI, {
            value: ethers.utils.parseEther('0.05'),
        });

        await result.wait();
        console.log(`Token ${tokenId} minted successfully.`);
        getMintedStatus();
        getCount();
    };

    async function getURI() {
        const uri = await contract.tokenURI(tokenId);
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

            {/* Display the attributes only if the NFT is minted */}
            {getMintedStatus() && attributes && (
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
                    Taken! Show URI
                </Button>
            )}
        </div>
    );
}

// Add PropTypes validation
NFTImage.propTypes = {
    tokenId: PropTypes.number.isRequired,
    getCount: PropTypes.func.isRequired,
    isMinting: PropTypes.bool.isRequired
};

export default Home;