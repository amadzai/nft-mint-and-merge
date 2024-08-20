require("@nomiclabs/hardhat-waffle");

/** @type import('hardhat/config').HardhatUserConfig */
module.exports = {
  solidity: "0.8.20",
  paths: {
    artifacts: './src/artifacts',
  },
  networks: {
    hardhat: {
      gas: 12000000, 
      blockGasLimit: 0x1fffffffffffff,
    //   mining: {
    //     auto: false,
    //     interval: 5000 
    //   },
    },
  },
};
