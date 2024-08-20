import hardhat from 'hardhat';
const { ethers } = hardhat;

async function main() {
    const [deployer] = await ethers.getSigners();
  
    console.log("Deploying contract with the account:", deployer.address);
  
    const Warriors = await ethers.getContractFactory("Warriors");
    const warriors = await Warriors.deploy(deployer.address);
    
    await warriors.deployed();
    console.log("Warriors contract deployed to:", warriors.address);
  
    for (let i = 0; i < 19; i++) {
      console.log(`Minting token ${i}`);
      
      const tx = await warriors.payToMint(deployer.address, `metadata${i}.json`, {
        value: ethers.utils.parseEther("0.05"),
        gasLimit: 12000000,  
      });
      
      await tx.wait();
      
      console.log(`Token ${i} minted successfully.`);
    }
  }
  
  main().catch((error) => {
    console.error(error);  
  });
