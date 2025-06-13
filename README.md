# Smart Contract Testing Project

## 快速开始

#### 环境准备

```bash
# 安装依赖
cd hardhat
npm install
npm install @openzeppelin/contracts

# 配置环境
cp hardhat.config.sample.js hardhat.config.js

# 进入 note-app 目录创建软链接（重要！）
cd ..
# 需要初始化 react
cd note-app
chmod +x lns.sh    # 赋予脚本执行权限
./lns.sh          # 执行脚本创建软链接

# 配置环境变量（React 前端使用）
cp .env.sample .env   # 复制环境变量模板
# 编辑 .env 文件，配置：
# - REACT_APP_CONTRACT_ADDRESS：部署后的合约地址
# - REACT_APP_PRIVATE_KEY：账户私钥
```

#### 合约开发

合约文件位于 `contracts/` 目录下:

- MintableERC20.sol - 可铸造的 ERC20 代币合约
- Note611.sol - Note611 合约
- SimpleStorage.sol - 简单存储合约

---

本项目提供两种操作方式：

### 1. 使用自动化脚本（推荐）

```bash
# 赋予脚本执行权限
chmod +x command.sh

# 执行脚本
./command.sh
```

### 2. 手动操作步骤

#### 部署与交互

```bash
# 初始化
npx hardhat
```

```bash
# 检查源码路径
npx hardhat run scripts/check.js

# 部署合约
npx hardhat run scripts/deploy.js --network moonbase

# 合约交互
npx hardhat run scripts/interact.js --network moonbase
```

#### 测试

```bash
npx hardhat test
```

#### 其他命令

```bash
# 编译合约
npx hardhat compile

# 启动本地节点
npx hardhat node

# 清理编译文件
npx hardhat clean
```
