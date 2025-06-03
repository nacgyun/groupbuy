import React, { useEffect, useState } from "react";
import { parseEther, formatEther } from "ethers";
import { useContract } from "../context/ContractContext";

export default function Deposit() {
  const contract = useContract();
  const [account, setAccount] = useState("");
  const [balance, setBalance] = useState("0");
  const [amount, setAmount] = useState("");

  const connectWallet = async () => {
    if (window.ethereum) {
      const accounts = await window.ethereum.request({ method: "eth_requestAccounts" });
      setAccount(accounts[0]);
    }
  };

  const deposit = async () => {
    if (!contract || !amount) return;
    const tx = await contract.deposit({ value: parseEther(amount) });
    await tx.wait();
    alert("Deposited successfully");
    setAmount("");
    fetchBalance();
  };

  const fetchBalance = async () => {
    if (!contract || !account) return;
    const b = await contract.balances(account);
    setBalance(formatEther(b));
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
            className="ml-2 bg-blue-500 text-white px-4 py-1 rounded"
          >
            Deposit
          </button>
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