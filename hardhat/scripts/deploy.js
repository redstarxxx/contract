const readline = require("readline");
const { ethers, artifacts } = require("hardhat");

function askQuestion(query) {
  const rl = readline.createInterface({
    input: process.stdin,
    output: process.stdout,
  });

  return new Promise((resolve) =>
    rl.question(query, (ans) => {
      rl.close();
      resolve(ans.trim());
    })
  );
}

async function main() {
  const contractName = await askQuestion("请输入要部署的合约名称（不带.sol 后缀）: ");

  if (!contractName) {
    console.log("未输入合约名称，退出程序...");
    return;
  }

  const fullyQualifiedName = `contracts/${contractName}.sol:${contractName}`;
  const [deployer] = await ethers.getSigners();
  console.log("✅ 部署账户:", deployer.address);

  const ContractFactory = await ethers.getContractFactory(fullyQualifiedName);
  const artifact = await artifacts.readArtifact(contractName);
  const constructorInputs = artifact.abi.find((item) => item.type === "constructor")?.inputs || [];

  let args = [];

  // 判断是否为 ERC721（基于 ABI 判断是否有 mint/address,string）
  const isERC721 = artifact.abi.some(
    (item) =>
      item.type === "function" &&
      item.name === "mint" &&
      item.inputs?.length === 2 &&
      item.inputs[0].type === "address" &&
      item.inputs[1].type === "string"
  );

  // 处理构造参数
  if (constructorInputs.length > 0) {
    for (const input of constructorInputs) {
      if (isERC721 && input.name === "name") {
        const name = await askQuestion("请输入 NFT 名称: ");
        args.push(name);
      } else if (isERC721 && input.name === "symbol") {
        const symbol = await askQuestion("请输入 NFT 符号: ");
        args.push(symbol);
      } else if (input.type === "address") {
        args.push(deployer.address);
      } else {
        throw new Error(`❌ 不支持的构造参数类型: ${input.type}（字段名：${input.name}）`);
      }
    }
  }

  const contract = await ContractFactory.deploy(...args);
  await contract.waitForDeployment();
  const contractAddr = await contract.getAddress();
  console.log(`🎉 合约 ${contractName} 已部署: ${contractAddr}`);

  // 如果是 NFT 合约，自动 mint
  if (isERC721) {
    console.log("🧠 检测到此为 NFT 合约，准备 mint...");
    const tokenURI = await askQuestion("请输入 NFT 的 CID（例如 ipfs://xxx）: ");
    const receiver = await askQuestion("请输入接收地址（留空为当前部署者）: ");
    const to = receiver || deployer.address;

    const tx = await contract.mint(to, tokenURI);
    await tx.wait();

    console.log(`✅ NFT 已铸造给: ${to}`);
    console.log(`🖼️ Token URI: ${tokenURI}`);
  } else {
    console.log("✅ 非 NFT 合约，部署完成。");
  }
}

main().catch((error) => {
  console.error("❌ 部署失败:", error);
  process.exitCode = 1;
});
