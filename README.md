1. [Presentation](#presentation)
2. [Installation Guide](#guide)
    1. [Dependencies](#dependencies)
    2. [Tests](#tests)
    3. [Deployment](#deployment)
        1. [Locally](#locally)
        2. [Testnet](#testnet)

# Presentation <a name="presentation"></a>

To understand what is the purpose of this repository please read **[EIP-ERC721Buyable.md](EIP-ERC721Buyable.md)**. The main solidity files are [ERC721Buyable.sol](./contracts/ERC721Buyable.sol) and its interface [IERC721Buyable.sol](./contracts/interfaces/IERC721Buyable.sol), the other contracts are only here for tests and integration demonstration.

the *client* folder is a react application that provides a minimal **demonstration** of how this ERC can be integrated into marketplaces but without the need for an intermediate smart contract: a **decentralized marketplace** can be built around this interface but centralized ones can still integrate it. It also includes an interface for the owner of a token allowing him to put it up for sale at any price or remove it, and for the owner of the contract to update the royalty rate. 

# Installation Guide <a name="guide"></a>

## Dependencies <a name="dependencies"></a>

Install the dependencies and devDependencies.

```sh
npm install 
# or
npm i 
```

## Tests <a name="tests"></a>

To run tests enter :

```sh
npx hardhat test 
#or
npx hardhat test .\test\buyableTokenTest.js
```

## Deployment <a name="deployment"></a>

In [deploy.js](deploy.js) ```await contract.mint();``` can be removed as it is just a way for us to interact with the blockchain right within the script without having to do it manually after.

To deploy a contract other than "NFTContract" one can just specify and create another instance of ```getContractFactory``` and repeat the next steps.

### Locally <a name="locally"></a>

To deploy locally you can just write ```npx hardhat run scripts/deploy.js```

### Testnet <a name="testnet"></a>

To deploy on a testnet like *goerli* you need to write the following command ```npx hardhat run scripts/deploy.js --network goerli``` after setting up the network and other configurations in the [hardhat.config.js](hardhat.config.js) file.

For that you wil need to fill a [.env]() file with an api url key and a private key.

```sh
API_URL="https://eth-goerli.alchemyapi.io/v2/XXXXXXX"
PRIVATE_KEY="0xXXX...XXX"
```

* The ```API_URL``` enables you to connect to the blockchain through a node given by your provider, the best-known ones are [Infura](https://infura.io/) and [Alchemy](https://www.alchemy.com/) and you can get your api url key there.
* The ```PRIVATE_KEY``` is associated with you blockchain wallet, the most famous one is [Metamask](https://metamask.io/) and can be installed as a browser extension. From there after setting up your wallet you should be able to export your private key in *account details*.

Now [hardhat.config.js](hardhat.config.js) should have these lines where it imports the *.env* variables. The ```module.exports``` is best set as follow with your solidity version compiler.

```js
require('dotenv').config()
const API_URL = process.env.API_URL
const PRIVATE_KEY = process.env.PRIVATE_KEY

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
  gasReporter: {
    currency: 'USD',
    gasPrice: 21
  }
};
```

*\* Before deploying and using any network make sure you have ETH in you wallet to pay for the transactions fees.*
