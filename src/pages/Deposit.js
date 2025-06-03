import React, { useEffect, useState } from "react";
import { parseEther, formatEther } from "ethers";
import { useContract } from "../context/ContractContext";

export default function Deposit() {
  const contract = useContract();
  const [account, setAccount] = useState("");
  const [balance, setBalance] = useState("0");
  const [amount, setAmount] = useState("");
  const [loading, setLoading] = useState(false);

  const connectWallet = async () => {
    if (window.ethereum) {
      const accounts = await window.ethereum.request({ method: "eth_requestAccounts" });
      setAccount(accounts[0]);
    }
  };

  const deposit = async () => {
    if (!contract || !amount) return;
    try {
      setLoading(true);
      const tx = await contract.deposit({ value: parseEther(amount) });
      await tx.wait();
      alert("✅ 예치 완료");
      setAmount("");
      fetchBalance();
    } catch (err) {
      console.error("Deposit failed:", err);
      alert("❌ 예치 실패");
    } finally {
      setLoading(false);
    }
  };

  const withdraw = async () => {
    if (!contract) return;
    try {
      setLoading(true);
      const tx = await contract.withdrawMyBalance(); // ✅ 스마트컨트랙트의 출금 함수명
      await tx.wait();
      alert("💸 출금 완료!");
      fetchBalance();
    } catch (err) {
      console.error("Withdraw failed:", err);
      alert("❌ 출금 실패");
    } finally {
      setLoading(false);
    }
  };

  const fetchBalance = async () => {
    if (!contract || !account) return;
    const bal = await contract.balances(account);
    setBalance(formatEther(bal));
  };

  useEffect(() => {
    if (account) {
      fetchBalance();
    }
  }, [account, contract]);

  return (
    <div className="text-center mt-10">
      <h1 className="text-2xl font-bold mb-4">💰 Deposit ETH</h1>
      {account ? (
        <>
          <p className="mb-2">Connected: {account}</p>
          <p className="mb-4">Balance: {balance} ETH</p>
          <input
            type="text"
            value={amount}
            onChange={(e) => setAmount(e.target.value)}
            placeholder="Enter ETH amount"
            className="border px-2 py-1"
          />
          <button
            onClick={deposit}
            disabled={loading}
            className="ml-2 bg-blue-500 text-white px-4 py-1 rounded disabled:opacity-50"
          >
            {loading ? "예치 중..." : "Deposit"}
          </button>
          <div className="mt-4">
            <button
              onClick={withdraw}
              disabled={loading}
              className="bg-yellow-600 text-white px-4 py-2 rounded disabled:opacity-50"
            >
              {loading ? "출금 중..." : "💸 출금하기"}
            </button>
          </div>
        </>
      ) : (
        <button
          onClick={connectWallet}
          className="bg-green-600 text-white px-4 py-2 rounded"
        >
          Connect Wallet
        </button>
      )}
    </div>
  );
}
