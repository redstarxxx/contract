import { useEffect, useState } from "react";
import { ethers } from "ethers";

// import abiFile from './BiXiaERC20//BiXiaERC20.json'; 

import abiFile from './NoteContract//Note611.json'; 



// 配置区
const contractAddress = "0x46Ae6B8DF20c92004C73A29BC72D7DfCA9E4FC74"; // 替换为你的合约地址

const RPC_URL = "https://rpc.api.moonbase.moonbeam.network";
const rawKey = "0xc15a7d022121bebd01912cbf99647c7081001c85e5ffe7b23509b4edf4489ec7" || "";
const PRIVATE_KEY = rawKey.startsWith("0x") ? rawKey : "0x" + rawKey;


function App() {

  const [note, setNote] = useState("");
  const [notes, setNotes] = useState([]);
  const [contract, setContract] = useState(null);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  // 添加新的状态
  const [notification, setNotification] = useState(null);
  const [isOwner, setIsOwner] = useState(false);
  const [confirmingClear, setConfirmingClear] = useState(false);
  const [balance, setBalance] = useState(null);

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
          setNotification({
            type: 'warning',
            message: '账户余额不足',
            details: {
              error: '请先从水龙头获取测试代币: https://faucet.moonbeam.network'
            }
          });
        }

        setContract(instance);
        const data = await instance.getNotes();
        setNotes(data);

        // 检查当前用户是否是合约拥有者
        const ownerAddress = await instance.owner();
        const currentAddress = wallet.address;
        setIsOwner(ownerAddress.toLowerCase() === currentAddress.toLowerCase());
      } catch (err) {
        console.error("初始化失败:", err);
      } finally {
        setLoading(false);
      }
    };
    init();
  }, []);

  const handleAdd = async () => {
    if (!note.trim()) return;
    // 检查余额是否足够
    if (balance === 0n) {
      setNotification({
        type: 'error',
        message: '余额不足',
        details: {
          error: '请先从水龙头获取测试代币: https://faucet.moonbeam.network'
        }
      });
      return;
    }

    setSubmitting(true);
    try {
      const tx = await contract.addNote(note);
      await tx.wait();
      const data = await contract.getNotes();
      setNotes(data);
      setNote("");
      // 显示成功提示
      setNotification({
        type: 'success',
        message: '提交成功！',
        details: {
          contractAddress: contractAddress,
          txHash: tx.hash
        }
      });
    } catch (err) {
      console.error("提交失败:", err);
      // 修改错误提示，针对不同错误类型显示不同消息
      let errorMessage = err.message;
      if (err.code === 'INSUFFICIENT_FUNDS') {
        errorMessage = '账户余额不足，请从水龙头获取测试代币: https://faucet.moonbeam.network';
      }
      setNotification({
        type: 'error',
        message: '提交失败！',
        details: {
          error: errorMessage
        }
      });
    } finally {
      setSubmitting(false);
    }
  };

  // 添加清空笔记的处理函数
  const handleClear = async () => {
    if (!isOwner) {
      const ownerAddress = await contract.owner();
      setNotification({
        type: 'warning',
        message: '权限提示',
        details: {
          error: `只有合约拥有者（${ownerAddress}）才能清空笔记`
        }
      });
      return;
    }

    setConfirmingClear(true);
  };

  // 确认清空的处理函数
  const confirmClear = async () => {
    setSubmitting(true);
    try {
      // 检查是否是合约拥有者
      const ownerAddress = await contract.owner();
      const provider = new ethers.JsonRpcProvider(RPC_URL);
      const wallet = new ethers.Wallet(PRIVATE_KEY, provider);

      if (ownerAddress.toLowerCase() !== wallet.address.toLowerCase()) {
        throw new Error("只有合约拥有者才能清空笔记");
      }

      const tx = await contract.clearNotes();
      console.log("清空交易已发送:", tx.hash);

      // 等待交易确认
      const receipt = await tx.wait();
      console.log("清空交易已确认:", receipt);

      if (receipt.status === 0) {
        throw new Error("交易被回滚");
      }

      const data = await contract.getNotes();
      setNotes(data);
      setNotification({
        type: 'success',
        message: '清空成功！',
        details: {
          contractAddress: contractAddress,
          txHash: tx.hash
        }
      });
    } catch (err) {
      console.error("清空失败:", err);
      let errorMessage = err.message;
      if (err.code === 'INSUFFICIENT_FUNDS') {
        errorMessage = '账户余额不足，请从水龙头获取测试代币: https://faucet.moonbeam.network';
      } else if (err.code === 'CALL_EXCEPTION') {
        errorMessage = '操作被拒绝，可能是因为您不是合约拥有者';
      }
      setNotification({
        type: 'error',
        message: '清空失败！',
        details: {
          error: errorMessage
        }
      });
    } finally {
      setSubmitting(false);
      setConfirmingClear(false);
    }
  };

  // 添加通知关闭函数
  const closeNotification = () => {
    setNotification(null);
  };

  return (
    <div style={{
      minHeight: "100vh",
      display: "flex",
      justifyContent: "center",
      alignItems: "center",
      background: "#f2f2f2",
      fontFamily: "'Segoe UI', sans-serif"
    }}>
      {notification && (
        <div style={{
          position: 'fixed',
          top: '20px',
          right: '20px',
          background: notification.type === 'success' ? '#4CAF50' :
          notification.type === 'warning' ? '#ff9800' : '#f44336',
          color: 'white',
          padding: '20px',
          borderRadius: '10px',
          boxShadow: '0 4px 6px rgba(0,0,0,0.1)',
          zIndex: 1000,
          maxWidth: '400px'
        }}>
          <div style={{ marginBottom: '10px', fontWeight: 'bold' }}>
            {notification.message}
          </div>
          <div style={{ fontSize: '12px', wordBreak: 'break-all' }}>
            {notification.type === 'success' ? (
              <>
                <div>合约地址: {notification.details.contractAddress}</div>
                <div>交易哈希: {notification.details.txHash}</div>
              </>
            ) : (
              <div>错误信息: {notification.details.error}</div>
            )}
          </div>
          <button
            onClick={closeNotification}
            style={{
              position: 'absolute',
              top: '10px',
              right: '10px',
              background: 'none',
              border: 'none',
              color: 'white',
              cursor: 'pointer',
              fontSize: '16px'
            }}
          >
            ×
          </button>
        </div>
      )}

      {/* 添加确认弹窗 */}
      {confirmingClear && (
        <div style={{
          position: 'fixed',
          top: 0,
          left: 0,
          right: 0,
          bottom: 0,
          background: 'rgba(0,0,0,0.5)',
          display: 'flex',
          justifyContent: 'center',
          alignItems: 'center',
          zIndex: 1000
        }}>
          <div style={{
            background: 'white',
            padding: '20px',
            borderRadius: '10px',
            maxWidth: '400px',
            width: '90%'
          }}>
            <h3 style={{ marginTop: 0 }}>确认清空</h3>
            <p>请确认是否要清空所有笔记？此操作不可撤销。</p>
            <div style={{ display: 'flex', gap: '10px', justifyContent: 'flex-end' }}>
              <button
                onClick={() => setConfirmingClear(false)}
                style={{
                  padding: '8px 16px',
                  border: '1px solid #ccc',
                  borderRadius: '5px',
                  background: '#fff'
                }}
              >
                取消
              </button>
              <button
                onClick={confirmClear}
                disabled={submitting}
                style={{
                  padding: '8px 16px',
                  background: '#f44336',
                  color: 'white',
                  border: 'none',
                  borderRadius: '5px',
                  cursor: submitting ? 'not-allowed' : 'pointer'
                }}
              >
                {submitting ? '处理中...' : '确认清空'}
              </button>
            </div>
          </div>
        </div>
      )}

      <div style={{
        background: "#fff",
        padding: "30px",
        borderRadius: "20px",
        boxShadow: "0 8px 20px rgba(0,0,0,0.08)",
        width: "90%",
        maxWidth: "600px"
      }}>
        <h2 style={{ textAlign: "center", marginBottom: "20px" }}>📝 区块链记事本</h2>

        <div style={{ display: "flex", gap: "10px", marginBottom: "20px" }}>
          <input
            type="text"
            placeholder="输入你的内容"
            value={note}
            onChange={(e) => setNote(e.target.value)}
            style={{
              flex: 1,
              padding: "12px 16px",
              fontSize: "16px",
              borderRadius: "10px",
              border: "1px solid #ccc",
              outline: "none",
              background: "#f9f9f9"
            }}
          />
          <button
            onClick={handleAdd}
            disabled={submitting}
            style={{
              padding: "12px 20px",
              backgroundColor: submitting ? "#aaa" : "#4CAF50",
              color: "#fff",
              border: "none",
              borderRadius: "10px",
              cursor: submitting ? "not-allowed" : "pointer",
              transition: "background 0.3s"
            }}
          >
            {submitting ? "提交中…" : "提交"}
          </button>
          {/* 添加清空按钮 - 对所有用户可见 */}
          <button
            onClick={handleClear}
            disabled={submitting}
            style={{
              padding: "12px 20px",
              backgroundColor: "#f44336",
              color: "#fff",
              border: "none",
              borderRadius: "10px",
              cursor: submitting ? "not-allowed" : "pointer",
              transition: "background 0.3s",
              opacity: isOwner ? 1 : 0.8
            }}
            title={isOwner ? "清空所有笔记" : "只有合约拥有者才能清空笔记"}
          >
            清空
          </button>
        </div>

        <div>
          {loading ? (
            <p style={{ textAlign: "center", color: "#888" }}>加载中…</p>
          ) : (
            <ul style={{ listStyle: "none", padding: 0, margin: 0 }}>
              {notes.map((n, i) => (
                <li
                  key={i}
                  style={{
                    background: "#f7f7f7",
                    padding: "12px 16px",
                    marginBottom: "10px",
                    borderRadius: "8px",
                    border: "1px solid #e0e0e0"
                  }}
                >
                  {n}
                </li>
              ))}
              {notes.length === 0 && (
                <li style={{ textAlign: "center", color: "#999" }}>暂无记录</li>
              )}
            </ul>
          )}
        </div>
      </div>
    </div>
  );
}

export default App;
