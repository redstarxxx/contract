require("@nomicfoundation/hardhat-toolbox");

/** @type import('hardhat/config').HardhatUserConfig */
module.exports = {
  solidity: "0.8.28",
  networks: {
    moonbase: {
      url: "https://rpc.api.moonbase.moonbeam.network",                                 // 测试链RPC
      accounts: ["0x================================================================"], // 替换为你的私钥
      chainId: 1287,                                                                    // Moonbase Alpha的Chain ID
      gas: 8000000,                                                                     // 设置合适的Gas限制
      gasPrice: 1000000000,                                                             // 设置Gas价格（单位为Wei）
      timeout: 20000,                                                                   // 设置超时时间（单位为毫秒）
    }
  }
};
