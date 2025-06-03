import React, {useEffect} from "react";
import { Link } from "react-router-dom";
import { useContract } from "../context/ContractContext";
export default function Home() {
    const contract = useContract();
    
  useEffect(() => {

    if (contract) {
      console.log("✅ Contract connected:", contract);
    } else {
      console.log("❌ Contract is null (not connected)");
    }
  }, [contract]);

  return (
    <div className="text-center mt-10 text-2xl">
      🏠 Welcome to the GroupBuy DApp!
      <div className="mt-8 space-x-4">
        <Link to="/rooms">
          <button className="bg-blue-500 text-white px-4 py-2 rounded">방 리스트 보기</button>
        </Link>
        <Link to="/create">
          <button className="bg-green-500 text-white px-4 py-2 rounded">방 만들기</button>
        </Link>
        <Link to="/login">
          <button className="bg-gray-500 text-white px-4 py-2 rounded">로그인</button>
        </Link>
      </div>
    </div>
  );
}