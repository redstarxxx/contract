require("@nomicfoundation/hardhat-toolbox");
require('@nomicfoundation/hardhat-ethers');

/** @type import('hardhat/config').HardhatUserConfig */
module.exports = {
  solidity: "0.8.28",
  networks: {
    moonbase: {
      url: 'https://rpc.api.moonbase.moonbeam.network',
      chainId: 1287, // Moonbase Alpha TestNet Chain ID
      accounts: [
        // 在这里填入您的私钥
        // 警告：永远不要在生产环境中提交真实的私钥
        'YOUR_PRIVATE_KEY_HERE'
      ]
    }
  }
};

/**
 * 配置文件说明：
 * 1. 将此文件重命名为 hardhat.config.js
 * 2. 将 YOUR_PRIVATE_KEY_HERE 替换为您的实际私钥
 *
 * 安全提示：
 * - 不要直接在配置文件中存储私钥
 * - 建议使用环境变量来存储私钥
 * - 确保不要将包含真实私钥的配置文件提交到git仓库
 */
