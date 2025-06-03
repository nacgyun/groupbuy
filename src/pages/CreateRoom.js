import React, { useState } from "react";
import { useContract } from "../context/ContractContext";

export default function CreateRoom() {
  const contract = useContract();
  const [unitPrice, setUnitPrice] = useState("");
  const [target, setTarget] = useState("");
  const [duration, setDuration] = useState("");
  const [purchaseId, setPurchaseId] = useState("");

  const handleCreate = async () => {
    if (!contract) return;
    try {
      await contract.setupPurchase(purchaseId, unitPrice, target, duration);
      alert("Room created successfully");
    } catch (err) {
      console.error(err);
      alert("Error creating room");
    }
  };

  return (
    <div className="p-4 max-w-md mx-auto">
      <h2 className="text-xl font-bold text-center mb-4">🆕 Create New Room</h2>
      <input type="text" placeholder="Room ID" value={purchaseId} onChange={(e) => setPurchaseId(e.target.value)} className="w-full border p-2 mb-2" />
      <input type="text" placeholder="Unit Price (wei)" value={unitPrice} onChange={(e) => setUnitPrice(e.target.value)} className="w-full border p-2 mb-2" />
      <input type="text" placeholder="Target Participants" value={target} onChange={(e) => setTarget(e.target.value)} className="w-full border p-2 mb-2" />
      <input type="text" placeholder="Duration (seconds)" value={duration} onChange={(e) => setDuration(e.target.value)} className="w-full border p-2 mb-4" />
      <button onClick={handleCreate} className="bg-blue-500 text-white px-4 py-2 rounded w-full">Create Room</button>
    </div>
  );
}