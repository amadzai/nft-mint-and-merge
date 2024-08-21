import WalletBalance from "./WalletBalance";
import { useEffect, useState} from "react";
import { Row, Col } from 'reactstrap';

import { ethers } from "ethers";
import Warriors from '../artifacts/contracts/WarriorsNFT.sol/Warriors.json'
import NFTImage from "./NFTImage";
import MergeAndMint from "./MergeAndMint";
import Header from "./Header"

import '../App.css'

// Replace with your localhost contract address
const contractAddress = '0x5FbDB2315678afecb367f032d93F642f64180aa3';

// For Amoy TestNet
// const contractAddress = '[YOUR_TESTNET_ADDRESS]';

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
            <Header />
            <Row className="justify-content-center">
                {mintedTokens.map((tokenId) => (
                    <Col key={tokenId} className="col-sm-auto">
                        <NFTImage tokenId={parseInt(tokenId)} isMinting={false} getCount={getCount} handleMintedToken={handleMintedToken} contract={contract} signer={signer} />
                    </Col>
                ))}
                {totalMinted < MAX_TOKENS && (
                    <Col className="col-sm-auto">
                        <NFTImage isMinting={true} getCount={getCount} handleMintedToken={handleMintedToken} contract={contract} signer={signer} />
                    </Col>
                )}
            </Row>
            {totalMinted < MAX_TOKENS && (
                <Row className="m-4">
                    <MergeAndMint setMintedTokens={setMintedTokens} getCount={getCount} contract={contract} signer={signer} />
                </Row>
            )}
            <WalletBalance />
        </div>
    );
}

export default Home;