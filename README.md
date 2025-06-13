# Contract

## hardhat-tutorial 合约文件

### 1. 配置 Hardhat

1. 复制配置文件示例：

```bash
cp hardhat-tutorial/hardhat.config.sample.js hardhat-tutorial/hardhat.config.js
```

2. 编辑 hardhat.config.js，替换以下内容：
   - 将 'YOUR_PRIVATE_KEY_HERE' 替换为您的私钥
   - 根据需要修改其他配置参数

注意：请勿将包含真实私钥的 hardhat.config.js 提交到代码仓库

### 2. 安装 hardhat 与 Hardhat Ethers 插件

```bash
npx hardhat init
npm install --save-dev hardhat @nomicfoundation/hardhat-ethers ethers@6
```

### 3. 安装 OpenZeppelin 智能合约

```bash
npm install @openzeppelin/contracts
```

### 4. 合约操作

```bash
# 删除 node_modules (约300M)
rm -rf node_modules

# 编译生成 json 文件
npx hardhat compile

# 发布到 moonbase
npx hardhat run scripts/deploy.js --network moonbase
```

## frontend 的 React 项目

### 1. 创建和配置项目

```bash
# 创建项目
npx create-react-app frontend
cd frontend

# 安装依赖
npm install ethers@5.6.9 @usedapp/core @mui/material @mui/system @emotion/react @emotion/styled

# 启动项目
npm run start
```

### 2. 合约文件配置

把合约的 json 文件拷贝过来，以 MintableERC20 为例：

```
项目结构：
|--artifacts
   |--@openzeppelin
   |--build-info
   |--contracts
      |--MintableERC20.sol
      |--MintableERC20.json    # 源文件位置
|--cache
|--contracts
|--frontend
   |--public
   |--src
      |--MintableERC20.json    # 目标位置
```

### 3. 合约调用示例

```javascript
// React 组件中调用合约
import MintableERC20 from "./MintableERC20.json";
import { Contract } from "ethers";

const contractAddress = "INSERT_CONTRACT_ADDRESS";

function App() {
  const contract = new Contract(contractAddress, MintableERC20.abi);
  // ...
}
```
