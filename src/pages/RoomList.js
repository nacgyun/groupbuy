import React, { useEffect, useState } from "react";
import { useContract } from "../context/ContractContext";
import { Link } from "react-router-dom";

export default function RoomList() {
  const contract = useContract();
  const [rooms, setRooms] = useState([]);

  useEffect(() => {
    const fetchRooms = async () => {
      if (!contract) return;

      try {
        const [ids, prices, targets, currents, deadlines, completeds, itemNames] = await contract.getPurchaseInfo();
        const list = ids.map((id, i) => ({
          id: id.toString(),
          price: prices[i].toString(),
          target: targets[i].toString(),
          current: currents[i].toString(),
          deadline: deadlines[i].toString(),
          completed: completeds[i],
          itemName: itemNames[i]   // 아이템 이름 추가
        }));
        setRooms(list);
      } catch (error) {
        console.error("⚠️ Failed to fetch purchase info:", error);
        setRooms([]);
      }
    };

    fetchRooms();
  }, [contract]);

  return (
    <div className="p-4">
      <h2 className="text-xl font-bold text-center mb-4">📃 Room List</h2>
      <ul className="space-y-3">
        {rooms.map((room) => (
          <li key={room.id} className="border rounded p-3 shadow hover:bg-gray-100">
            <Link to={`/room/${room.id}`}>
              <p><strong>🆔 ID:</strong> {room.id}</p>
              <p><strong>📦 Item:</strong> {room.itemName}</p>
              <p><strong>💰 Price:</strong> {room.price} wei</p>
              <p><strong>👥 Participants:</strong> {room.current} / {room.target}</p>
              <p><strong>⏰ Deadline:</strong> {new Date(room.deadline * 1000).toLocaleString()}</p>
              <p><strong>Status:</strong> {room.completed ? "✅ Completed" : "⏳ In Progress"}</p>
            </Link>
          </li>
        ))}
      </ul>
    </div>
  );
}
