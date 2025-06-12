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





frontend的react项目
npx create-react-app frontend
cd frontend
npm install ethers@5.6.9 @usedapp/core @mui/material @mui/system @emotion/react @emotion/styled
npm run start


把合约的json文件拷贝过来, MintableERC20为例
|--artifacts
    |--@openzeppelin
    |--build-info
    |--contracts
        |--MintableERC20.sol
            |--MintableERC20.json // This is the file you're looking for!
            ...
|--cache
|--contracts
|--frontend
    |--public
    |--src
        |--MintableERC20.json // Copy the file to here!
        ...
    ...
...



// ... 调用合约代码
import MintableERC20 from './MintableERC20.json'; 
import { Contract } from 'ethers';

const contractAddress = 'INSERT_CONTRACT_ADDRESS';

function App() {
  const contract = new Contract(contractAddress, MintableERC20.abi);
  // ...
}




