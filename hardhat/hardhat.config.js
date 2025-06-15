require("@nomicfoundation/hardhat-toolbox");
require("dotenv").config();

// 从 .env 文件中读取所有必要的配置
const PRIVATE_KEY = process.env.PRIVATE_KEY;
const MOONBASE_RPC_URL = process.env.MOONBASE_RPC_URL;
const MOONBASE_API_KEY = process.env.MOONBASE_API_KEY;
const CHAIN_ID = parseInt(process.env.CHAIN_ID);

// 检查必要的环境变量是否存在
if (!PRIVATE_KEY || !MOONBASE_RPC_URL || !MOONBASE_API_KEY || !CHAIN_ID) {
  throw new Error("请在 .env 文件中设置所有必要的环境变量");
}

/** @type import("hardhat/config").HardhatUserConfig */
module.exports = {
  solidity: {
    compilers: [
      {
        version: "0.8.28"
      },
      {
        version: "0.4.17"
      }
    ]
  },
  networks: {
    moonbase: {
      url: MOONBASE_RPC_URL,
      accounts: [PRIVATE_KEY],
      chainId: CHAIN_ID,
      gas: 8000000,
      gasPrice: 2000000000,
      timeout: 20000
    }
  },
  etherscan: {
    apiKey: {
      moonbaseAlpha: MOONBASE_API_KEY
    }
  },
  sourcify: {
    enabled: false
  }
};
