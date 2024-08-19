import hardhat from 'hardhat';
import { expect } from 'chai';

const { ethers } = hardhat;

describe('WarriorsNFT', function () {
  let Warriors, warriors, owner, addr1, addr2;

  beforeEach(async function () {
    // Get the contract factory and signers (test accounts)
    Warriors = await ethers.getContractFactory('Warriors');
    [owner, addr1, addr2] = await ethers.getSigners();

    // Deploy the contract with the owner's address
    warriors = await Warriors.deploy(owner.address);
    await warriors.deployed();
  });

  it('Should mint and transfer an NFT after paying', async function () {
    const recipient = addr1.address;

    // Remove "ipfs://" from the metadata URI to avoid double prepending
    const metadataURI = 'some_unique_content';

    // Check initial balance (BigNumber comparison)
    let balance = await warriors.balanceOf(recipient);
    expect(balance.eq(0)).to.be.true;  // Use BigNumber comparison

    // Mint the NFT using payToMint function (send 0.05 Ether)
    const mintTx = await warriors.connect(addr1).payToMint(recipient, metadataURI, {
      value: ethers.utils.parseEther('0.05'),
    });
    await mintTx.wait(); // Wait for the transaction to complete

    // Check balance after minting
    balance = await warriors.balanceOf(recipient);
    expect(balance.eq(1)).to.be.true;  // Use BigNumber comparison

    // Verify token URI is correct
    const tokenURI = await warriors.tokenURI(0);
    expect(tokenURI).to.equal(`ipfs://${metadataURI}`);
  });
});