# contract

hardhat-tutorial 合约文件
安装hardhat,Hardhat Ethers插件
npx hardhat init
npm install --save-dev hardhat @nomicfoundation/hardhat-ethers ethers@6
安装OpenZeppelin智能合约
npm install @openzeppelin/contracts

删除node_modules的300多M
编译生成json文件
npx hardhat compile
发布到moonbase
npx hardhat run scripts/deploy.js --network moonbase