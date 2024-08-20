import WalletBalance from "./WalletBalance";
import PropTypes from 'prop-types';
import { useEffect, useState, useCallback } from "react";

import { ethers } from "ethers";
import Warriors from '../artifacts/contracts/WarriorsNFT.sol/Warriors.json'

import summonImage from '../assets/summon.png';

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
  
    return (
      <div>
          <WalletBalance />
  
          {Array(totalMinted + 1)
          .fill(0)
          .map((_, i) => (
              <div key={i}>
              <NFTImage tokenId={i} getCount={getCount} />
              </div>
          ))}
      </div>
    );
  }

  function NFTImage({ tokenId, getCount }) {
    const contentId = 'QmeMmnTrU4Cx5mUHXb66esBhir4kmdBvrKQtqXxa9DzEcL';
    const metadataURI = `${contentId}/${tokenId}.json`;
    const imageURI = `https://gateway.pinata.cloud/ipfs/${contentId}/${tokenId}.png`;
  
    const [isMinted, setIsMinted] = useState(false);
  
    // Wrap getMintedStatus with useCallback to prevent unnecessary re-creation
    const getMintedStatus = useCallback(async () => {
        const result = await contract.isContentOwned(metadataURI);
        console.log(result);
        setIsMinted(result);
    }, [metadataURI]);  // Add metadataURI as a dependency

    useEffect(() => {
        getMintedStatus();
    }, [getMintedStatus]);  // Include getMintedStatus as a dependency
  
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
        <img src={isMinted ? imageURI : summonImage}></img>
          <h5>ID #{tokenId}</h5>
          {!isMinted ? (
            <button onClick={mintToken}>
              Mint
            </button>
          ) : (
            <button onClick={getURI}>
              Taken! Show URI
            </button>
          )}
      </div>
    );
  }

 // Add PropTypes validation
  NFTImage.propTypes = {
      tokenId: PropTypes.number.isRequired,  // If tokenId is a number
      getCount: PropTypes.func.isRequired    // If getCount is a function
  };
  
  export default Home;