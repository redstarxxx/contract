const hre = require('hardhat');

const readline = require("readline");
const { ethers } = require("hardhat");

async function askQuestion(query) {
    const rl = readline.createInterface({
    input: process.stdin,
    output: process.stdout,
    });

    return new Promise((resolve) =>
    rl.question(query, (ans) => {
      rl.close();
      resolve(ans);
    })
    );
}

async function main() {

  // note611
  const contractName = await askQuestion("请输入要部署的合约名称: ");
  const [deployer] = await ethers.getSigners();
  console.log("部署账户:", deployer.address);
  const ContractFactory = await ethers.getContractFactory(contractName);
  const contract = await ContractFactory.deploy();
  await contract.waitForDeployment();
  console.log(`${contractName} 合约部署地址:`, await contract.getAddress());

}

main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});