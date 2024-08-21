import PropTypes from 'prop-types';
import { useEffect, useState, useCallback } from "react";
import { Button } from 'reactstrap';

// import { ethers } from "ethers"; // If using payToMint
import { selectWarrior, getTokenIdForWarrior } from '../utils/gacha.js';

import summonImage from '../assets/summon.png';
import '../App.css'

const NFTImage = ({ tokenId, getCount, isMinting, handleMintedToken, contract, signer }) => {
    // Or replace with your CID
    const contentId = 'QmeMmnTrU4Cx5mUHXb66esBhir4kmdBvrKQtqXxa9DzEcL';
    const metadataURI = `${contentId}/${tokenId}.json`; // for minting
    const metadataJSONURI = `https://gateway.pinata.cloud/ipfs/${contentId}/${tokenId}.json`; // for fetching metadata
    const imageURI = `https://gateway.pinata.cloud/ipfs/${contentId}/${tokenId}.png`;

    const [isMinted, setIsMinted] = useState(false);
    const [attributes, setAttributes] = useState(null);

    const getMintedStatus = useCallback(async () => {
        console.log(`Checking if token ${tokenId} is minted...`);
        const result = await contract.isContentOwned(metadataURI);
        setIsMinted(result);
        if (!result) setAttributes(null);
    }, [metadataURI, tokenId, contract]);

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
        if (!isMinting) getMintedStatus();
    }, [getMintedStatus, isMinting]);

    useEffect(() => {
        if (isMinted) fetchMetadata();
    }, [fetchMetadata, isMinted]);

    const mintToken = async () => {
        let selectedRarity = selectWarrior();
        let tokenId = getTokenIdForWarrior(selectedRarity);
        while (tokenId === null) {
            selectedRarity = selectWarrior();
            tokenId = getTokenIdForWarrior(selectedRarity);
        }

        const metadataURI = `${contentId}/${tokenId}.json`;
        const connection = contract.connect(signer);

        // If using payToMint
        // const result = await contract.payToMint(connection.address, tokenId, metadataURI, selectedRarity, {
        //     value: ethers.utils.parseEther('0.05'),
        // });

        const result = await contract.safeMint(connection.address, tokenId, metadataURI, selectedRarity, {});

        await result.wait();
        getMintedStatus();
        handleMintedToken(tokenId);
        getCount();
    };

    const getURI = async () => {
        const uri = await contract.tokenURI(tokenId);
        alert(uri);
    };

    return (
        <div className="card my-4 warrior-card" style={{ width: "24rem" }}>
            <img
                src={isMinting || !isMinted ? summonImage : imageURI}
                className="img-fluid"
                alt={`Token ${tokenId}`}
            />
            <h5 className='mt-3 warrior-text'>ID #{tokenId}</h5>
            {isMinted && attributes && (
                <div>
                    <p className='warrior-text'>Rarity: {attributes.find(attr => attr.trait_type === 'Rarity')?.value}</p>
                    <p className='warrior-text'>Attack: {attributes.find(attr => attr.trait_type === 'Attack')?.value}</p>
                    <p className='warrior-text'>Defense: {attributes.find(attr => attr.trait_type === 'Defense')?.value}</p>
                </div>
            )}

            {!isMinted || isMinting ? (
                <Button onClick={mintToken} className="d-block mb-4 mx-5 mint-button warrior-text">Mint</Button>
            ) : (
                <Button onClick={getURI} className="d-block mb-4 mx-5 uri-button warrior-text">Owned! Show URI</Button>
            )}
        </div>
    );
};

NFTImage.propTypes = {
    tokenId: PropTypes.number,
    getCount: PropTypes.func.isRequired,
    isMinting: PropTypes.bool.isRequired,
    handleMintedToken: PropTypes.func,
    contract: PropTypes.object.isRequired,
    signer: PropTypes.object.isRequired,
};

export default NFTImage;