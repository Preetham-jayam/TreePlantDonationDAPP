import React, { useEffect, useState } from 'react';
import Card from 'react-bootstrap/Card';
import Container from 'react-bootstrap/Container';
import Row from 'react-bootstrap/Row';
import Col from 'react-bootstrap/Col';
import Button from 'react-bootstrap/Button';
import { ethers } from 'ethers';
import TreePlantingMarketplaceAbi from '../contractsData/OneTreeNFTMarketplace.json';
import TreePlantingMarketplaceAddress from '../contractsData/OneTreeNFTMarketplace-address.json';
const PlantedTrees = ({ marketplace, userAddress }) => {
  const [trees, setTrees] = useState([]);

  useEffect(() => {
    async function fetchPlantedTrees() {
      if (marketplace) {
        try {
          const allNFTs = await marketplace.getAllNFTs();

          setTrees(allNFTs);
        } catch (error) {
          console.error('Error fetching planted trees:', error);
        }
      }
    }

    fetchPlantedTrees();
  }, [marketplace]);

  const buyNFT = async (tokenId, price) => {
    try {
      if (marketplace && userAddress) {
        const provider = new ethers.providers.Web3Provider(window.ethereum);
        const signer = provider.getSigner();
        const contract = new ethers.Contract(TreePlantingMarketplaceAddress.address, TreePlantingMarketplaceAbi.abi, signer);

        console.log(price);

        const salePrice = ethers.utils.parseEther(price); 
        console.log(salePrice);
        const transaction = await contract.purchaseNFT(tokenId, {
          value: salePrice,
        });
        await transaction.wait();
        alert('You successfully bought the NFT!');

        console.log('NFT purchased successfully.');
      }
    } catch (error) {
      console.error('Error purchasing NFT:', error);
    }
  };

  return (
    <Container>
      <h2>Planted Trees</h2>
      <Row>
        {trees.map((tree) => (
          <Col md={4} key={tree.tokenId.toNumber()} >
            <Card className="mb-4" >
              <Card.Body>
                <Card.Title>Owner: {tree.donor}</Card.Title>
                <Card.Text>tokenId:{tree.tokenId.toNumber()}</Card.Text>
                <Card.Text>Location: {tree.location}</Card.Text>
                <Card.Text>Species: {tree.species}</Card.Text>
                <Card.Text>Donation Amount (ETH): {ethers.utils.formatEther(tree.amount)}</Card.Text>
                {userAddress !== tree.donor && (
                  <Button onClick={() => buyNFT(tree.tokenId, ethers.utils.formatEther(tree.amount))}>
                    Buy for {ethers.utils.formatEther(tree.amount)} ETH
                  </Button>
                )}
              </Card.Body>
            </Card>
          </Col>
        ))}
      </Row>
    </Container>
  );
};

export default PlantedTrees;
