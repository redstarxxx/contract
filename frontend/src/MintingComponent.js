import { useState } from 'react';
import { Button, CircularProgress, TextField, Grid } from '@mui/material';

export default function MintingComponent({ contract }) {

    const [value, setValue] = useState(0);
    const [state, setMintState] = useState([]);

    // const { account, chainId, switchNetwork } = useEthers();
    // const { state, send } = useContractFunction(contract, 'purchaseMint');
    // const handlePurchaseMint = async () => {
    //     if (chainId !== MoonbaseAlpha.chainId) {
    //         await switchNetwork(MoonbaseAlpha.chainId);
    //     }
    //     send({ value: value.toString()});
    // };

    const isMining = state?.status === 'Mining';
    const textFieldStyle = { marginBottom: '16px' };

    const handlePurchaseMint = async () => {
        try {
            const stateTemp = await contract.purchaseMint();
            setMintState(stateTemp);
            console.log("stateTemp=", stateTemp);
        } catch (err) {
            console.error("contract error", err);
        } finally {
        }
    };

    return (
    <>
        <Grid item xs={12}>
        <TextField
            type='number'
            onChange={(e) => setValue(e.target.value)}
            label='Enter value in DEV'
            variant='outlined'
            fullWidth
            style={textFieldStyle}
        />
        </Grid>
        <Grid item xs={12}>
        <Button
            variant='contained' color='primary' fullWidth
            onClick={handlePurchaseMint}
            disabled={state.status === 'Mining'}
        >
            {isMining? <CircularProgress size={24} /> : 'Purchase Mint'}
        </Button>
        </Grid>
    </>
    );
}