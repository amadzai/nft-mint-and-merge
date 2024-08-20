const hre = require("hardhat");

async function main() {
    const Warriors = await ethers.getContractFactory('Warriors');
  
    const [owner] = await ethers.getSigners();
  
    const warriors = await Warriors.deploy(owner.address);
  
    await warriors.deployed();
  
    console.log('WarriorsNFT deployed to:', warriors.address);
  }
  
  main()
    .then(() => process.exit(0))
    .catch((error) => {
      console.error(error);
      process.exit(1);
    });