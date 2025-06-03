import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { useContract } from "../context/ContractContext";

export default function RoomDetail() {
  const { id } = useParams();
  const contract = useContract();
  const [room, setRoom] = useState(null);
  const [loading, setLoading] = useState(false);
  const [hasJoined, setHasJoined] = useState(false);
  const [userAddress, setUserAddress] = useState("");
  const [isWithdrawn, setIsWithdrawn] = useState(false);

  const fetchRoom = async () => {
    try {
      const [
        unitPrice,
        targetParticipants,
        currentParticipants,
        deadline,
        isCompleted,
        creator,
        itemName // 🔸 추가된 부분
      ] = await contract.getPurchase(id);

      const purchaseData = await contract.purchases(id);
      setIsWithdrawn(purchaseData.isWithdrawn);

      setRoom({
        id,
        itemName,
        price: unitPrice.toString(),
        target: targetParticipants.toString(),
        current: currentParticipants.toString(),
        deadline: deadline.toString(),
        completed: isCompleted,
        creator: creator.toLowerCase()
      });
    } catch (err) {
      console.error("❌ 방 정보 조회 실패:", err);
    }
  };

  const fetchParticipation = async () => {
    if (!window.ethereum) return;
    const accounts = await window.ethereum.request({ method: "eth_requestAccounts" });
    const account = accounts[0];
    setUserAddress(account.toLowerCase());

    try {
      const count = await contract.getParticipationCount(id, account);
      setHasJoined(Number(count) > 0);
    } catch (err) {
      console.error("❌ 참여 여부 조회 실패:", err);
    }
  };

  useEffect(() => {
    if (contract && id) {
      fetchRoom();
      fetchParticipation();
    }
  }, [contract, id]);

  const handleParticipate = async () => {
    try {
      setLoading(true);
      const tx = await contract.participate(id);
      await tx.wait();
      alert("✅ 참여 완료!");
      window.location.reload();
    } catch (err) {
      console.error("❌ 참여 실패:", err);
      alert("❌ 참여 실패");
    } finally {
      setLoading(false);
    }
  };

  const handleCancel = async () => {
    try {
      setLoading(true);
      const tx = await contract.cancelParticipation(id);
      await tx.wait();
      alert("🚫 참여 취소됨");
      window.location.reload();
    } catch (err) {
      console.error("❌ 취소 실패:", err);
      alert("❌ 취소 실패");
    } finally {
      setLoading(false);
    }
  };

  const handleWithdraw = async () => {
    try {
      setLoading(true);
      const tx = await contract.withdraw(id);
      await tx.wait();
      alert("💸 정산 완료!");
      fetchRoom();
    } catch (err) {
      console.error("❌ 정산 실패:", err);
      alert("❌ 정산 실패");
    } finally {
      setLoading(false);
    }
  };

  if (!room) return <p className="p-4">방 정보를 불러오는 중...</p>;

  return (
    <div className="p-4">
      <h2 className="text-2xl font-bold mb-4">🛒 Room #{room.id}</h2>
      <p><strong>📦 Item:</strong> {room.itemName}</p> {/* 🔸 여기 표시 */}
      <p><strong>Price:</strong> {room.price} wei</p>
      <p><strong>Participants:</strong> {room.current} / {room.target}</p>
      <p><strong>Deadline:</strong> {new Date(room.deadline * 1000).toLocaleString()}</p>
      <p><strong>Status:</strong> {room.completed ? "✅ Completed" : "⏳ In Progress"}</p>

      {!room.completed && (
        <div className="mt-6 space-x-4">
          <button
            onClick={handleParticipate}
            disabled={loading}
            className="bg-green-600 text-white px-4 py-2 rounded disabled:opacity-50"
          >
            {loading ? "참여 중..." : "✅ 참여하기"}
          </button>
          {hasJoined && (
            <button
              onClick={handleCancel}
              disabled={loading}
              className="bg-red-600 text-white px-4 py-2 rounded disabled:opacity-50"
            >
              {loading ? "취소 중..." : "🚫 참여 취소"}
            </button>
          )}
        </div>
      )}

      {room.completed && userAddress === room.creator && (
        <div className="mt-6">
          {isWithdrawn ? (
            <button disabled className="bg-gray-400 text-white px-4 py-2 rounded">
              ✅ 정산 완료
            </button>
          ) : (
            <button
              onClick={handleWithdraw}
              disabled={loading}
              className="bg-yellow-500 text-white px-4 py-2 rounded disabled:opacity-50"
            >
              {loading ? "정산 중..." : "💸 정산받기"}
            </button>
          )}
        </div>
      )}
    </div>
  );
}
