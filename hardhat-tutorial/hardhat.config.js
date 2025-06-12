require("@nomicfoundation/hardhat-toolbox");
require('@nomicfoundation/hardhat-ethers');

/** @type import('hardhat/config').HardhatUserConfig */
module.exports = {
  solidity: "0.8.28",
  networks: {
    moonbase: {
      url: 'https://rpc.api.moonbase.moonbeam.network',//https://rpc.api.moonbase.moonbeam.network
      chainId: 1287, // 0x507 in hex,
      accounts: ['0xc15a7d022121bebd01912cbf99647c7081001c85e5ffe7b23509b4edf4489ec7']
    }
  }
};

//我的私钥
//0x92f30da6a36470f58442a4b781a7943102874218fd093beff0a34aaa556cf096

//陛下私钥
//0xc15a7d022121bebd01912cbf99647c7081001c85e5ffe7b23509b4edf4489ec7