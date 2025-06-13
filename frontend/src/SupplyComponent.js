import { useState } from "react";
import { Grid } from '@mui/material';

export default function SupplyComponent({ contract }) {

  const [totalSupply, setTotalSupply] = useState([]);
  const [maxSupply, setMaxSupply] = useState([]);


  // console.log("contract=", contract);

  const initContract = async () => {
        try {
          const totalTemp = await contract.totalSupply();
          console.log("totalTemp=", totalTemp);
          setTotalSupply(totalTemp);

          const maxSupply = await contract.MAX_TO_MINT();
          setMaxSupply(maxSupply);

        } catch (err) {
          console.error("contract error", err);
        } finally {
        }
      };
  initContract();

  const centeredText = { textAlign: 'center' };

  return (
    <Grid item xs={12}>
      <h3 style={centeredText}>
        totalSupply:{totalSupply}
        <br></br>
        maxSupply:{maxSupply}
      </h3>
    </Grid>
  );
}