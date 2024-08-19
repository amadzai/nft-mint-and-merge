const hre = require("hardhat");

async function main() {
    // Get the contract factory
    const Warriors = await ethers.getContractFactory('Warriors');
  
    // Get the signers (accounts) from Hardhat
    const [owner] = await ethers.getSigners();
  
    // Deploy the contract and pass the owner's address to the constructor
    const warriors = await Warriors.deploy(owner.address);
  
    // Wait for the deployment to complete
    await warriors.deployed();
  
    console.log('WarriorsNFT deployed to:', warriors.address);
  }
  
  main()
    .then(() => process.exit(0))
    .catch((error) => {
      console.error(error);
      process.exit(1);
    });