import hardhat from 'hardhat';
import { expect } from 'chai';

const { ethers } = hardhat;

describe('WarriorNFT', function () {
  let Warrior, warrior, owner, addr1, addr2;

  beforeEach(async function () {
    // Get the contract factory and signers (test accounts)
    Warrior = await ethers.getContractFactory('Warrior');
    [owner, addr1, addr2] = await ethers.getSigners();

    // Deploy the contract with the owner's address
    warrior = await Warrior.deploy(owner.address);
    await warrior.deployed();
  });

  it('Should mint and transfer an NFT after paying', async function () {
    const recipient = addr1.address;

    // Remove "ipfs://" from the metadata URI to avoid double prepending
    const metadataURI = 'some_unique_content';

    // Check initial balance (BigNumber comparison)
    let balance = await warrior.balanceOf(recipient);
    expect(balance.eq(0)).to.be.true;  // Use BigNumber comparison

    // Mint the NFT using payToMint function (send 0.05 Ether)
    const mintTx = await warrior.connect(addr1).payToMint(recipient, metadataURI, {
      value: ethers.utils.parseEther('0.05'),
    });
    await mintTx.wait(); // Wait for the transaction to complete

    // Check balance after minting
    balance = await warrior.balanceOf(recipient);
    expect(balance.eq(1)).to.be.true;  // Use BigNumber comparison

    // Verify token URI is correct
    const tokenURI = await warrior.tokenURI(0);
    expect(tokenURI).to.equal(`ipfs://${metadataURI}`);
  });
});