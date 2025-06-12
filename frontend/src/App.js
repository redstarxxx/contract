import { Button, Grid, Card } from '@mui/material';
import { Box } from '@mui/system';
import { useEffect, useState } from "react";
import { ethers } from "ethers";

import SupplyComponent from './SupplyComponent';

import abiFile from './BiXiaERC20//BiXiaERC20.json';

// import abiFile from './NoteContract//Note611.json';

const errorMsg = '请先从水龙头获取测试代币: https://faucet.moonbeam.network';

// 配置区
const contractAddress = "0x46Ae6B8DF20c92004C73A29BC72D7DfCA9E4FC74"; // 替换为你的合约地址
const RPC_URL = "https://rpc.api.moonbase.moonbeam.network";
const rawKey = "0xc15a7d022121bebd01912cbf99647c7081001c85e5ffe7b23509b4edf4489ec7" || "";
const PRIVATE_KEY = rawKey.startsWith("0x") ? rawKey : "0x" + rawKey;


const styles = {
  box: { minHeight: '100vh', backgroundColor: '#1b3864' },
  vh100: { minHeight: '100vh' },
  card: { borderRadius: 4, padding: 4, maxWidth: '550px', width: '100%' },
  alignCenter: { textAlign: 'center' },
};


function App() {

  const [contract, setContract] = useState(null);
  const [balance, setBalance] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const init = async () => {
      try {
        const provider = new ethers.JsonRpcProvider(RPC_URL);
        const wallet = new ethers.Wallet(PRIVATE_KEY, provider);
        const instance = new ethers.Contract(contractAddress, abiFile.abi, wallet);

        // 检查账户余额
        const balance = await provider.getBalance(wallet.address);
        setBalance(balance);

        if (balance === 0n) {
          console.error("账户余额不足:");
        }
        setContract(instance);
        
      } catch (err) {
        console.error("初始化失败:", err);
      } finally {
        setLoading(false);
      }
    };
    init();
  }, []);

  // console.log("app_contract=", contract);

  return (
    <Box sx={styles.box}>
      <Grid
        container
        direction='column'
        alignItems='center'
        justifyContent='center'
        style={styles.vh100}
      >
        <Box position='absolute' top={8} right={16}>
          {/* <Button variant='contained' onClick={handleWalletConnection}>
            {account
              ? `Disconnect ${account.substring(0, 5)}...`
              : 'Connect Wallet'}
          </Button> */}
        </Box>
        <Card sx={styles.card}>
          <h1 style={styles.alignCenter}>Mint Your Token!</h1>
          <SupplyComponent contract={contract} />
        </Card>
      </Grid>
    </Box>
  );
}

export default App;
