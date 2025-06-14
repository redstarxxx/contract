require("@nomicfoundation/hardhat-toolbox");
require('dotenv').config();

/** @type import('hardhat/config').HardhatUserConfig */

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
      url: process.env.MOONBASE_RPC_URL,                                // Moonbase Alpha RPC
      accounts: [process.env.PRIVATE_KEY],                             // 从.env文件读取私钥
      chainId: process.env.CHAIN_ID,                                  // Moonbase Alpha的Chain ID
      gas: 8000000,                                                  // 设置合适的Gas限制
      gasPrice: 2000000000,                                          // 设置Gas价格（2 GWei）
      timeout: 20000,                                                // 设置请求超时时间
    }
  }
};
