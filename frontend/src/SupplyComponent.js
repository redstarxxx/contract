import { Grid } from '@mui/material';

export default function SupplyComponent({ contract }) {

  // const totalSupply = useCall({ contract, method: 'name', args: ["0xc15a7d022121bebd01912cbf99647c7081001c85e5ffe7b23509b4edf4489ec7"] });
  // const maxSupply = useCall({ contract, method: 'MAX_TO_MINT', args: ["0xc15a7d022121bebd01912cbf99647c7081001c85e5ffe7b23509b4edf4489ec7"]});
  // const totalSupplyFormatted = totalSupply ? utils.formatEther(totalSupply.value.toString()) : '...';
  // const maxSupplyFormatted = maxSupply ? utils.formatEther(maxSupply.value.toString()) : '...';

  const totalSupply = contract.MAX_TO_MINT()

  const centeredText = { textAlign: 'center' };

  return (
    <Grid item xs={12}>
      <h3 style={centeredText}>
        Total Supply: {totalSupply}
      </h3>
    </Grid>
  );
}