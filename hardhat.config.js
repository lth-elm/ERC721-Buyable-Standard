require("@nomicfoundation/hardhat-toolbox");
require("dotenv").config();

// const ETHERSCAN_KEY = process.env.ETHERSCAN_KEY;

// const GOERLI_API_URL = process.env.GOERLI_API_URL;
// const GOERLI_PRIVATE_KEY = process.env.GOERLI_PRIVATE_KEY;

/** @type import('hardhat/config').HardhatUserConfig */
module.exports = {
  solidity: {
    version: "0.8.16",
    settings: {
      optimizer: {
        enabled: true,
        runs: 200,
      },
    },
  },
  // networks: {
  //   hardhat: {},
  //   goerli: {
  //     url: GOERLI_API_URL,
  //     accounts: [GOERLI_PRIVATE_KEY],
  //   },
  // },
  // etherscan: {
  //   apiKey: ETHERSCAN_KEY,
  // },
  // paths: {
  //   artifacts: './client/src/artifacts'
  // },
  gasReporter: {
    enabled: true,
    currency: "USD",
    gasPrice: 21,
  },
};
