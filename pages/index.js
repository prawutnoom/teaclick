import { useEffect, useState } from "react";
import { ethers } from "ethers";
import abi from "../public/abi.json";
import Head from "next/head";

const contractAddress = "0x5f81F2fbdE2B89BA0bF9c0C4d6CC15e83B08B686"; // Replace with actual contract

export default function Home() {
  const [provider, setProvider] = useState(null);
  const [signer, setSigner] = useState(null);
  const [contract, setContract] = useState(null);
  const [clicksToday, setClicksToday] = useState(0);

  useEffect(() => {
    if (provider && signer) {
      const instance = new ethers.Contract(contractAddress, abi, signer);
      setContract(instance);
      fetchClickCount(instance);
    }
  }, [provider, signer]);

  const connectWallet = async () => {
    if (!window.ethereum) return alert("Please install MetaMask");
    const web3Provider = new ethers.providers.Web3Provider(window.ethereum);
    await web3Provider.send("eth_requestAccounts", []);
    const signer = web3Provider.getSigner();
    setProvider(web3Provider);
    setSigner(signer);
  };

  const handleClick = async () => {
    if (!contract) return;
    const tx = await contract.click();
    await tx.wait();
    fetchClickCount(contract);
  };

  const fetchClickCount = async (contractInstance) => {
    const count = await contractInstance.getTodayClickCount();
    setClicksToday(count.toNumber());
  };

  return (
    <>
      <Head>
        <title>TeaClick</title>
      </Head>
      <main className="container">
        <h1>🫖 TeaClick</h1>
        <button onClick={connectWallet}>Connect Wallet</button>
        <button onClick={handleClick}>Click!</button>
        <p>Today's Clicks: {clicksToday}</p>
      </main>
    </>
  );
}
