import { useCall } from '@usedapp/core';
import { utils } from 'ethers';
import { Grid } from '@mui/material';

export default function SimpleTest({ contract }) {

  const getNum = useCall({ contract, method: 'get', args: [] });
  const getNumFormatted = getNum ? utils.formatEther(getNum.value.toString()) : '...';


  const centeredText = { textAlign: 'center' };

  return (
    <Grid item xs={12}>
      <h3 style={centeredText}>
        Total Supply: {getNumFormatted} 
      </h3>
    </Grid>
  );
}