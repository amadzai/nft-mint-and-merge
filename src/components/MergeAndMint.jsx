import PropTypes from 'prop-types';
import { useState } from "react";
import { Button } from 'reactstrap';

// import { ethers } from "ethers"; // If using payToMint
import { getTokenIdForWarrior } from '../utils/gacha.js';

import '../App.css'

const MergeAndMint = ({ setMintedTokens, getCount, contract, signer }) => {
    const [tokenId1, setTokenId1] = useState('');
    const [tokenId2, setTokenId2] = useState('');
    const [canMerge, setCanMerge] = useState(null);
    const [mergeMessage, setMergeMessage] = useState('');
    const [burntTokenIds, setBurntTokenIds] = useState([]);
    // Or replace with your CID
    const contentId = 'QmeMmnTrU4Cx5mUHXb66esBhir4kmdBvrKQtqXxa9DzEcL';

    const checkMergeEligibility = async () => {
        try {
            const result = await contract.canMerge(tokenId1, tokenId2);
            setCanMerge(result);
            setMergeMessage(`Tokens ${tokenId1} and ${tokenId2} can ${result ? '' : 'not'} be merged.`);
        } catch (error) {
            console.error("Error checking merge eligibility:", error.message);
        }
    };

    const handleMergeAndMint = async () => {
        if (!canMerge) return;
        try {
            const mergeTx = await contract.mergeTokens(tokenId1, tokenId2);
            await mergeTx.wait();

            const currentRarity = await contract.tokenRarity(tokenId1);
            const nextRarity = await contract.getNextRarity(currentRarity);
            const newTokenId = getTokenIdForWarrior(nextRarity);

            // If using payToMint
            // const mintTx = await contract.payToMint(signer.getAddress(), newTokenId, `${contentId}/${newTokenId}.json`, nextRarity, {
            //     gasLimit: 500000,
            //     value: ethers.utils.parseEther('0.05'),
            // });

            const mintTx = await contract.safeMint(signer.getAddress(), newTokenId, `${contentId}/${newTokenId}.json`, nextRarity);
            await mintTx.wait();

            setMintedTokens((prevTokens) => prevTokens.filter(id => id !== tokenId1 && id !== tokenId2));
            setMintedTokens((prevTokens) => [...prevTokens, newTokenId]);
            getCount();
            setBurntTokenIds((prevBurntTokens) => [...prevBurntTokens, tokenId1, tokenId2]);
            setCanMerge(null);
            setMergeMessage('');
        } catch (error) {
            console.error("Error merging and minting:", error.message);
        }
    };

    return (
        <div>
            <input type="number" value={tokenId1} onChange={(e) => setTokenId1(e.target.value)} className="m-3" placeholder="Enter Token ID 1" />
            <input type="number" value={tokenId2} onChange={(e) => setTokenId2(e.target.value)} className="m-3" placeholder="Enter Token ID 2" />
            <Button onClick={checkMergeEligibility} className="check-button">Check Merge Eligibility</Button>
            {mergeMessage && (
                <div>
                    <p className='warrior-text'>{mergeMessage}</p>
                    {canMerge && (
                        <Button onClick={handleMergeAndMint} className='mint-button'>Merge and Mint New Token</Button>
                    )}
                </div>
            )}
            {burntTokenIds.length > 0 && (
                <div className="mt-3">
                    <h5 className='warrior-text'>Burnt Tokens:</h5>
                        {burntTokenIds.map((burntTokenId, index) => (
                            <li className='warrior-text' key={index}>Token ID #{burntTokenId}</li>
                        ))}
                </div>
            )}
        </div>
    );
};

MergeAndMint.propTypes = {
    setMintedTokens: PropTypes.func.isRequired,
    getCount: PropTypes.func.isRequired,
    contract: PropTypes.object.isRequired,
    signer: PropTypes.object.isRequired,
};

export default MergeAndMint;