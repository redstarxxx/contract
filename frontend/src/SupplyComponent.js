import { useEffect, useState } from "react";
import { Grid } from '@mui/material';

export default function SupplyComponent({ contract }) {

  const [ownerAddress, setAddress] = useState([]);
  console.error("contract=", contract);
  
  const initContract = async () => {
        try {
          const ownerAddress = await contract.owner();
          setAddress(ownerAddress);
        } catch (err) {
          console.error("contract error", err);
        } finally {
        }
      };
    initContract();

  const centeredText = { textAlign: 'center' };
  console.error("ownerAddress=", ownerAddress);

  return (
    <Grid item xs={12}>
      <h3 style={centeredText}>
        OwnerAddress=={ownerAddress}
      </h3>
    </Grid>
  );
}