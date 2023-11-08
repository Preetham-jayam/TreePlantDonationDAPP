import React, { useState } from "react";
import { ethers } from "ethers";
import 'bootstrap/dist/css/bootstrap.min.css';

const PINATA_API_KEY = "502796fba2467467a7bf";
const PINATA_API_SECRET = "50a0e788309544dba23ca61b0349c125e0fc649a74d212f1fc39679c9e531d76";

const DonateAndPlantTree = ({ marketplace, account }) => {
  const [donationAmount, setDonationAmount] = useState(0);
  const [location, setLocation] = useState("");
  const [species, setSpecies] = useState("");
  const [ipfsHash, setIpfsHash] = useState("");

  const handleCombinedAction = async () => {
    try {
      if (donationAmount <= 0 || location === "" || species === "") {
        alert("Please fill in all the fields");
        return;
      }

      // Handle IPFS upload
      const data = { donationAmount, location, species };
      const response = await fetch("https://api.pinata.cloud/pinning/pinJSONToIPFS", {
        method: "POST",
        headers: {
          "pinata_api_key": PINATA_API_KEY,
          "pinata_secret_api_key": PINATA_API_SECRET,
          "Content-Type": "application/json",
        },
        body: JSON.stringify(data),
      });

      if (response.ok) {
        const { IpfsHash } = await response.json();
        setIpfsHash(IpfsHash);
        
        const donationAmountInWei = ethers.utils.parseEther(donationAmount.toString());
        const tokenURI = `ipfs://${IpfsHash}`;
        await marketplace.donateAndMintNFT(location, species, tokenURI, {
          value: donationAmountInWei,
        });

        alert("Donation successful! You received an NFT.");
        setDonationAmount(0);
        setLocation('');
        setSpecies('');
      } else {
        alert("Unable to add data to IPFS Pinata");
      }
    } catch (error) {
      console.error("Error donating and planting a tree:", error);
    }
  };

  return (
    <div className="container my-4">
      <h2 className="text-center">Donate and Plant a Tree</h2>
      <form>
        <div className="form-group">
          <label htmlFor="donationAmount">Donation amount (ETH):</label>
          <input
            type="number"
            id="donationAmount"
            className="form-control"
            value={donationAmount}
            onChange={(e) => setDonationAmount(e.target.value)}
          />
        </div>
        <div className="form-group">
          <label htmlFor="location">Location:</label>
          <input
            type="text"
            id="location"
            className="form-control"
            value={location}
            onChange={(e) => setLocation(e.target.value)}
          />
        </div>
        <div className="form-group">
          <label htmlFor="species">Species:</label>
          <input
            type="text"
            id="species"
            className="form-control"
            value={species}
            onChange={(e) => setSpecies(e.target.value)}
          />
        </div>
        <button
          type="button"
          className="btn btn-primary btn-block my-3"
          onClick={handleCombinedAction}
        >
          Donate
        </button>
      </form>
    </div>
  );
};

export default DonateAndPlantTree;
