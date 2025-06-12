const hre = require('hardhat');

async function main() {
  const [deployer] = await hre.ethers.getSigners();
  const factory = await hre.ethers.getContractFactory('BiXiaERC20');
  const token = await factory.deploy(deployer.address);
  await token.waitForDeployment();

  // Get and print the contract address
  const myContractDeployedAddress = await token.getAddress();
  console.log(`Deployed to ${myContractDeployedAddress}`);
}

main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});