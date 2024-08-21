import WalletBalance from "./WalletBalance";
import { useEffect, useState} from "react";
import { Row, Col } from 'reactstrap';

import { ethers } from "ethers";
import Warriors from '../artifacts/contracts/WarriorsNFT.sol/Warriors.json'
import NFTImage from "./NFTImage";
import MergeAndMint from "./MergeAndMint";

import '../App.css'

const contractAddress = '0x5FbDB2315678afecb367f032d93F642f64180aa3';
// For Amoy TestNet
// const contractAddress = '0x56d9b46B86896f3f89Ed22fFF3389eFEa5B8B008';

const provider = new ethers.providers.Web3Provider(window.ethereum);
const signer = provider.getSigner();
const contract = new ethers.Contract(contractAddress, Warriors.abi, signer);

function Home() {
    const [totalMinted, setTotalMinted] = useState(0);
    const [mintedTokens, setMintedTokens] = useState([]);
    const MAX_TOKENS = 18;

    useEffect(() => {
        getCount();
    }, []);

    const getCount = async () => {
        const count = await contract.count();
        setTotalMinted(parseInt(count));
        console.log(parseInt(count))
    };

    const handleMintedToken = (tokenId) => {
        setMintedTokens((prevTokens) => [...prevTokens, tokenId]);
    };

    return (
        <div>
            <WalletBalance />
            <Row>
                {mintedTokens.map((tokenId) => (
                    <Col sm="4" key={tokenId}>
                        <NFTImage tokenId={parseInt(tokenId)} isMinting={false} getCount={getCount} handleMintedToken={handleMintedToken} contract={contract} signer={signer} />
                    </Col>
                ))}
                {totalMinted < MAX_TOKENS && (
                    <Col sm="4">
                        <NFTImage isMinting={true} getCount={getCount} handleMintedToken={handleMintedToken} contract={contract} signer={signer} />
                    </Col>
                )}
            </Row>
            {totalMinted < MAX_TOKENS && (
                <Row className="m-4">
                    <MergeAndMint setMintedTokens={setMintedTokens} getCount={getCount} contract={contract} signer={signer} />
                </Row>
            )}
        </div>
    );
}

export default Home;