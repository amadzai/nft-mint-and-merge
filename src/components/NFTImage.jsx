import PropTypes from 'prop-types';
import { useEffect, useState, useCallback } from "react";
import { Button } from 'reactstrap';

// import { ethers } from "ethers"; // If using payToMint
import { selectWarrior, getTokenIdForWarrior } from '../utils/gacha.js';

import summonImage from '../assets/summon.png';
import '../App.css'

const NFTImage = ({ tokenId, getCount, isMinting, handleMintedToken, contract, signer }) => {
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
                <Button onClick={mintToken} color="primary" className="d-block m-auto">Mint</Button>
            ) : (
                <Button onClick={getURI} color="secondary" className="d-block m-auto">Owned! Show URI</Button>
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