import React, { useEffect, useState } from 'react';
import Card from 'react-bootstrap/Card';
import Container from 'react-bootstrap/Container';
import Row from 'react-bootstrap/Row';
import Col from 'react-bootstrap/Col';
import {ethers} from 'ethers';

const MyNFTs = ({ marketplace ,userAddress}) => {
  console.log(userAddress);
 
  const [trees, setTrees] = useState([]);

  useEffect(() => {
    async function fetchPlantedTrees() {
      const userTrees=[];
      if (marketplace) {
        try {
          const allNFTs = await marketplace.getAllNFTs();
          allNFTs.map((nft)=>{
            if(nft.donor.toLowerCase()===userAddress){
              userTrees.push(nft);
            }
          })

          setTrees(userTrees);
        } catch (error) {
          console.error('Error fetching planted trees:', error);
        }
      }
    }

    fetchPlantedTrees();
  }, [marketplace]);

  

  return (
    <Container>
      <h2>My NFTs</h2>
      {trees.length===0 && <h3>No NFTs . Donate and Plant a tree</h3>}
      <Row>
        {trees.map((nft) => (
          <Col md={4} key={nft.tokenId.toNumber()}>
            <Card className="mb-4">
              <Card.Body>
                <Card.Title>Token ID: {nft.tokenId.toNumber()}</Card.Title>
                <Card.Text>Location: {nft.location}</Card.Text>
                <Card.Text>Species: {nft.species}</Card.Text>
                <Card.Text>Donation Amount (ETH): {ethers.utils.formatEther(nft.amount)}</Card.Text>
              </Card.Body>
            </Card>
          </Col>
        ))}
      </Row>
    </Container>
  );
};

export default MyNFTs;
