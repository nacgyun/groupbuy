import React, { useEffect } from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Home from "./pages/Home";
import Deposit from "./pages/Deposit";
import RoomList from "./pages/RoomList";
import CreateRoom from "./pages/CreateRoom";
import RoomDetail from "./pages/RoomDetail";
import Login from "./pages/Login";
import Navbar from "./components/NavBar";
import { ContractProvider } from "./context/ContractContext";
import { useContract } from "./context/ContractContext";

function App() {
  
  const contract = useContract();

  useEffect(() => {
    if (contract) {
      console.log("✅ Connected contract:", contract);
    }
  }, [contract]);
  return (
    <ContractProvider>
    <Router>
      <Navbar />
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/deposit" element={<Deposit />} />
        <Route path="/rooms" element={<RoomList />} />
        <Route path="/create" element={<CreateRoom />} />
        <Route path="/rooms/:id" element={<RoomDetail />} />
        <Route path="/login" element={<Login />} />
      </Routes>
    </Router>
    </ContractProvider>
  );
}

export default App;

