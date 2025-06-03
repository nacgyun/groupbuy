import React from "react";
import { useParams } from "react-router-dom";

export default function RoomDetail() {
  const { id } = useParams();
  return (
    <div className="text-center mt-10 text-xl">
      🏠 Room Detail Page - ID: {id}
    </div>
  );
}