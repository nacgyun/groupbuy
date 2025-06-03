import React, { useEffect, useState } from "react";
import { useContract } from "../context/ContractContext";

export default function RoomList() {
  const contract = useContract();
  const [rooms, setRooms] = useState([]);

  useEffect(() => {
    const fetchRooms = async () => {
      if (!contract) return;
  
      try {
        const [ids, prices, targets, currents, deadlines, completeds] = await contract.getPurchaseInfo();
        const list = ids.map((id, i) => ({
          id: id.toString(),
          price: prices[i].toString(),
          target: targets[i].toString(),
          current: currents[i].toString(),
          deadline: deadlines[i].toString(),
          completed: completeds[i],
        }));
        setRooms(list);
      } catch (error) {
        console.error("⚠️ Failed to fetch purchase info:", error);
        setRooms([]); // 실패했을 경우 빈 리스트로 초기화
      }
    };
  
    fetchRooms();
  }, [contract]);

  return (
    <div className="p-4">
      <h2 className="text-xl font-bold text-center mb-4">📃 Room List</h2>
      <ul className="space-y-3">
        {rooms.map((room) => (
          <li key={room.id} className="border rounded p-3 shadow">
            <p><strong>ID:</strong> {room.id}</p>
            <p><strong>Price:</strong> {room.price} wei</p>
            <p><strong>Participants:</strong> {room.current} / {room.target}</p>
            <p><strong>Deadline:</strong> {new Date(room.deadline * 1000).toLocaleString()}</p>
            <p><strong>Status:</strong> {room.completed ? "✅ Completed" : "⏳ In Progress"}</p>
          </li>
        ))}
      </ul>
    </div>
  );
}