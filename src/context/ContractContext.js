// src/context/ContractContext.js
import { createContext, useContext, useEffect, useState } from "react";
import { ethers } from "ethers";
import ContractABI from "../abi/ParticipationTest.json";

const ContractContext = createContext();

export const ContractProvider = ({ children }) => {
  const [contract, setContract] = useState(null);

  useEffect(() => {
    const load = async () => {
      if (window.ethereum) {
        const provider = new ethers.BrowserProvider(window.ethereum);
        const signer = await provider.getSigner();
        const contractInstance = new ethers.Contract(
          "0xd2a5bC10698FD955D1Fe6cb468a17809A08fd005", // 실제 배포한 컨트랙트 주소로 바꾸세요
          ContractABI.abi,
          signer
        );
        setContract(contractInstance);
      }
    };
    load();
  }, []);

  return (
    <ContractContext.Provider value={contract}>
      {children}
    </ContractContext.Provider>
  );
};

export const useContract = () => useContext(ContractContext);