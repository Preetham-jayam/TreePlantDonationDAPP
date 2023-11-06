import {
  BrowserRouter,
  Routes,
  Route
} from "react-router-dom";
import Navigation from './Navbar';
import { useState, useEffect } from 'react'
import { ethers } from "ethers"
import { Spinner } from 'react-bootstrap'
import TreePlantingMarketplaceAbi from '../contractsData/OneTreeNFTMarketplace.json';
import TreePlantingMarketplaceAddress from '../contractsData/OneTreeNFTMarketplace-address.json';
import Home from "./Home";
import PlantedTreesList from "./PlantedTreesList";
import MyNFTs from "./MyNFTs";

function App() {
  const [loading, setLoading] = useState(true);
  const [account, setAccount] = useState(null);
  const [marketplace, setMarketplace] = useState({});

  const web3Handler = async () => {
    if (window.ethereum) {
      try {
        const accounts = await window.ethereum.request({ method: 'eth_requestAccounts' });
        setAccount(accounts[0]);
        const provider = new ethers.providers.Web3Provider(window.ethereum);
        const signer = provider.getSigner();

        window.ethereum.on('chainChanged', (chainId) => {
          window.location.reload();
        });

        window.ethereum.on('accountsChanged', async function (accounts) {
          setAccount(accounts[0]);
        });

        loadContracts(signer);
      } catch (error) {
        console.error("Error connecting to Metamask:", error);
      }
    } else {
      console.log("Metamask not detected");
    }
  };

  const loadContracts = async (signer) => {
    try {
      const marketplace = new ethers.Contract(
        TreePlantingMarketplaceAddress.address,
        TreePlantingMarketplaceAbi.abi,
        signer
      );
      setMarketplace(marketplace);

      setLoading(false);
    } catch (error) {
      console.error("Error loading contracts:", error);
    }
  };

  useEffect(() => {
    web3Handler();
  }, []);

  return (
    <BrowserRouter>
      <div className="app">
        <>
          <Navigation account={account} web3Handler={web3Handler}/>
        </>
        <div>
          {loading ? (
            <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', minHeight: '80vh' }}>
              <Spinner animation="border" style={{ display: 'flex' }} />
              <p className='mx-3 my-0'>Awaiting Metamask Connection...</p>
            </div>
          ) : (
            <Routes>
              <Route path="/" element={
                <Home marketplace={marketplace} account={account} />
              } />
              <Route path="/plantedTrees" element={
                <PlantedTreesList marketplace={marketplace} userAddress={account} />
              } />
              <Route path='/mynfts' element={
                <MyNFTs marketplace={marketplace} userAddress={account} />
              } />
            </Routes>
          )}
        </div>
      </div>
    </BrowserRouter>
  );
}

export default App;
