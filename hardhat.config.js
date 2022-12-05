require("@nomicfoundation/hardhat-toolbox");
require('dotenv').config()

const API_URL = process.env.API_URL
const PRIVATE_KEY = process.env.PRIVATE_KEY

/** @type import('hardhat/config').HardhatUserConfig */
module.exports = {
  networks: {
    hardhat: {
    },
    goerli: {
      url: API_URL,
      accounts: [PRIVATE_KEY]
    }
  },
  solidity: {
    version: "0.8.17",
    settings : {
      optimizer : {
        enabled: true,
        runs: 200
      }
    },
  },
  // paths: {
  //   artifacts: './client/src/artifacts'
  // },
  gasReporter: {
    currency: 'USD',
    gasPrice: 21
  }
};
