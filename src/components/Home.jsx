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
                        <NFTImage tokenId={tokenId} getCount={getCount} />
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
    const metadataURI = `${contentId}/${tokenId}.json`;
    const imageURI = `https://gateway.pinata.cloud/ipfs/${contentId}/${tokenId}.png`;

    const [isMinted, setIsMinted] = useState(false);

    const getMintedStatus = useCallback(async () => {
        const result = await contract.isContentOwned(metadataURI);
        console.log(result);
        setIsMinted(result);
    }, [metadataURI]);

    useEffect(() => {
        if (!isMinting) {
            getMintedStatus();
        }
    }, [getMintedStatus, isMinting]);

    const mintToken = async () => {
        const connection = contract.connect(signer);
        const addr = connection.address;
        const result = await contract.payToMint(addr, metadataURI, {
            value: ethers.utils.parseEther('0.05'),
        });

        await result.wait();
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
                className="img-fluid"
                alt={`Token ${tokenId}`}
                style={{ width: '100%', height: 'auto' }}
            />
            <h5>ID #{tokenId}</h5>
            {!isMinted || isMinting ? (
                <Button onClick={mintToken} color="primary" style={{ display: 'block', margin: '10px auto' }}>
                    Mint
                </Button>
            ) : (
                <Button onClick={getURI} color="secondary" style={{ display: 'block', margin: '10px auto' }}>
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