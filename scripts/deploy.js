// We require the Hardhat Runtime Environment explicitly here. This is optional
// but useful for running the script in a standalone fashion through `node <script>`.
//
// You can also run a script with `npx hardhat run <script>`. If you do that, Hardhat
// will compile your contracts, add the Hardhat Runtime Environment's members to the
// global scope, and execute the script.
const hre = require("hardhat");

async function main() {
  const WAIT_BLOCK_CONFIRMATIONS = 6;

  const Contract = await hre.ethers.getContractFactory("NFTContract");
  const contract = await Contract.deploy();
  await contract.deployTransaction.wait(WAIT_BLOCK_CONFIRMATIONS);
  console.log(`ERC721Buyable Contract deployed to ${contract.address} on ${network.name}`);

  console.log("Verifying contract...");
  await hre.run(`verify:verify`, {
    address: contract.address,
    constructorArguments: [],
    contract: "contracts/NFTContract.sol:NFTContract",
  });

  console.log();

  const NONBuyableContract = await hre.ethers.getContractFactory("NFTContractNONBuyable");
  const nonBuyableContract = await NONBuyableContract.deploy();
  await nonBuyableContract.deployTransaction.wait(WAIT_BLOCK_CONFIRMATIONS);
  console.log(`NON Buyable contract deployed to ${nonBuyableContract.address} on ${network.name}`);

  console.log("Verifying non buyable contract...");
  await hre.run(`verify:verify`, {
    address: nonBuyableContract.address,
    constructorArguments: [],
    contract: "contracts/NFTContractNONBuyable.sol:NFTContractNONBuyable",
  });

  // await contract.mint();
  // await contract.mint();
  // await contract.mint();
}

// We recommend this pattern to be able to use async/await everywhere
// and properly handle errors.
main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});
