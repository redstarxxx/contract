import { useEthers } from '@usedapp/core';
import { Button, Grid, Card } from '@mui/material';
import { Box } from '@mui/system';
import { Contract } from 'ethers';
import BiXiaERC20 from './BiXiaERC20/BiXiaERC20.json';
import SupplyComponent from './SupplyComponent';
import Note611 from './Note611.json';

import { ethers } from "ethers";


const styles = {
  box: { minHeight: '100vh', backgroundColor: '#1b3864' },
  vh100: { minHeight: '100vh' },
  card: { borderRadius: 4, padding: 4, maxWidth: '550px', width: '100%' },
  alignCenter: { textAlign: 'center' },
};

const contractAddress = '0x7DeEE348B61b303a7D18fD6b5eE69D1a8e177Ae3';
const RPC_URL = "https://rpc.api.moonbase.moonbeam.network";
const rawKey = "0xc15a7d022121bebd01912cbf99647c7081001c85e5ffe7b23509b4edf4489ec7" || "";
const PRIVATE_KEY = rawKey.startsWith("0x") ? rawKey : "0x" + rawKey;




function App() {
  const { activateBrowserWallet, deactivate, account } = useEthers();
  const contract = new Contract(contractAddress, BiXiaERC20.abi);
  const contract1 = new Contract(contractAddress, Note611.abi);

  // const instance = new ethers.Contract(contractAddress, BiXiaERC20.abi, wallet);


  // Handle the wallet toggle
  const handleWalletConnection = () => {
    if (account) deactivate();
    else activateBrowserWallet();
  };

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
          <Button variant='contained' onClick={handleWalletConnection}>
            {account
              ? `Disconnect ${account.substring(0, 5)}...`
              : 'Connect Wallet'}
          </Button>
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