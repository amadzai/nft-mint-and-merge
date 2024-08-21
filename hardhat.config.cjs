require("@nomiclabs/hardhat-waffle");
require("@nomiclabs/hardhat-waffle");
require("@nomiclabs/hardhat-ethers");
require("@nomiclabs/hardhat-etherscan");
require('dotenv').config();  // To load environment variables from .env

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
    },
    polygonAmoy: {
        url: process.env.POLYGON_AMOY_RPC_URL,
        accounts: [process.env.ACCOUNT_PRIVATE_KEY],
        chainId: 80002
      }
  },
  etherscan: {
    apiKey: {
      polygonAmoy: process.env.POLYGONSCAN_API_KEY
    },
  }
};
