import { useState, useEffect } from 'react';
import { Button, CircularProgress, TextField, Grid, Alert, Snackbar } from '@mui/material';
import { ethers } from 'ethers';

export default function MintingComponent({ contract }) {

    const [value, setValue] = useState(0);
    const [mintStatus, setMintStatus] = useState('idle'); // 'idle', 'mining', 'success', 'error'
    const [errorMessage, setErrorMessage] = useState('');
    const [successMessage, setSuccessMessage] = useState('');
    const [openSnackbar, setOpenSnackbar] = useState(false);
    const textFieldStyle = { marginBottom: '16px' };

    // 处理成功消息的显示和清除
    useEffect(() => {
        if (mintStatus === 'success') {
            setOpenSnackbar(true);
            setSuccessMessage('购币成功！');
            // 3秒后自动重置状态
            const timer = setTimeout(() => {
                setMintStatus('idle');
                setSuccessMessage('');
                setOpenSnackbar(false);
            }, 3000);
            return () => clearTimeout(timer);
        }
    }, [mintStatus]);

    const handlePurchaseMint = async () => {
        if (!contract) {
            setErrorMessage('合约未初始化');
            return;
        }
        if (!value || value <= 0) {
            setErrorMessage('请输入有效的金额');
            return;
        }

        try {
            setMintStatus('mining');
            setErrorMessage('');

            // 获取当前总供应量
            const totalSupply = await contract.totalSupply();
            const maxToMint = await contract.MAX_TO_MINT();
            const amountToMint = ethers.parseEther(value.toString());

            // 验证是否超过最大铸币量
            if (totalSupply + amountToMint > maxToMint) {
                setErrorMessage('超过最大铸币量限制');
                setMintStatus('error');
                return;
            }

            // 估算 gas
            const gasEstimate = await contract.purchaseMint.estimateGas({
                value: amountToMint
            });

            console.log("Estimated gas:", gasEstimate);

            // 发送交易
            const tx = await contract.purchaseMint({
                value: amountToMint,
                gasLimit: gasEstimate * 120n / 100n // 添加20%的气体限制作为缓冲
            });

            console.log("Transaction sent:", tx.hash);

            // 等待交易被确认
            const receipt = await tx.wait();
            console.log("Transaction confirmed:", receipt);

            setMintStatus('success');
            // 清空输入
            setValue(0);
        } catch (err) {
            console.error("Minting error:", err);
            setMintStatus('error');
            if (err.code === 'CALL_EXCEPTION') {
                setErrorMessage('交易执行失败：可能是余额不足或超出铸币限制');
            } else {
                setErrorMessage(err.message || '购币失败');
            }
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
            variant='contained'
            color={mintStatus === 'error' ? 'error' : 'primary'}
            fullWidth
            onClick={handlePurchaseMint}
            disabled={mintStatus === 'mining' || !contract}
        >
            {mintStatus === 'mining' ? <CircularProgress size={24} /> : 'Purchase Mint'}
        </Button>
        </Grid>
        {errorMessage && (
            <Grid item xs={12} style={{ marginTop: '10px', color: 'red', textAlign: 'center' }}>
                {errorMessage}
            </Grid>
        )}
        <Snackbar
            open={openSnackbar}
            autoHideDuration={3000}
            onClose={() => setOpenSnackbar(false)}
            anchorOrigin={{ vertical: 'top', horizontal: 'center' }}
        >
            <Alert
                onClose={() => setOpenSnackbar(false)}
                severity="success"
                elevation={6}
                variant="filled"
            >
                {successMessage}
            </Alert>
        </Snackbar>
    </>
    );
}