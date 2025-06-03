import React, { useState } from "react";

export default function Login() {
  const [account, setAccount] = useState("");

  const connectWallet = async () => {
    if (window.ethereum) {
      try {
        // MetaMask에 계정 요청
        const accounts = await window.ethereum.request({
          method: "eth_requestAccounts",
        });
        setAccount(accounts[0]);
        console.log("지갑 연결됨:", accounts[0]);
      } catch (error) {
        console.error("연결 실패:", error);
      }
    } else {
      alert("MetaMask를 설치해주세요!");
    }
  };

  return (
    <div className="text-center mt-10">
      <h1 className="text-2xl mb-4">🔐 MetaMask 로그인</h1>
      {account ? (
        <p>✅ 연결된 지갑: {account}</p>
      ) : (
        <button
          onClick={connectWallet}
          className="bg-blue-600 text-white px-6 py-2 rounded"
        >
          MetaMask 지갑 연결
        </button>
      )}
    </div>
  );
}
