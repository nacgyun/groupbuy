import React from "react";
import { Link } from "react-router-dom";

export default function Navbar() {
  return (
    <nav className="bg-white shadow p-4 flex justify-center space-x-6">
      <Link to="/" className="text-blue-600 font-semibold hover:underline">Home</Link>
      <Link to="/deposit" className="text-blue-600 font-semibold hover:underline">Deposit</Link>
      <Link to="/rooms" className="text-blue-600 font-semibold hover:underline">Room List</Link>
      <Link to="/create" className="text-blue-600 font-semibold hover:underline">Create Room</Link>
      <Link to="/login" className="text-blue-600 font-semibold hover:underline">Login</Link>
    </nav>
  );
}