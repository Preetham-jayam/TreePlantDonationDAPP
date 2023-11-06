const { expect } = require("chai");
const { ethers } = require("hardhat");

describe("OneTreePlanted", function () {
  let OneTreePlanted;
  let oneTreePlanted;
  let NFT;
  let nft;
  let owner, contributor, buyer;

  const treeLocation = "TestLocation";
  const treeSpecies = "TestSpecies";
  const initialPrice = ethers.utils.parseEther("1.0");

  beforeEach(async function () {
    [owner, contributor, buyer] = await ethers.getSigners();

    // Deploy the NFT contract
    NFT = await ethers.getContractFactory("NFT");
    nft = await NFT.deploy();
    await nft.deployed();

    const ERC20Factory = await ethers.getContractFactory("MyERC20Token");
  const initialSupply = 1000; // Replace with the desired initial supply
  const nativeToken = await ERC20Factory.deploy(initialSupply);
  await nativeToken.deployed();

    // Deploy the OneTreePlanted contract, passing the address of the NFT contract
    OneTreePlanted = await ethers.getContractFactory("OneTreePlanted");
    oneTreePlanted = await OneTreePlanted.deploy(nativeToken.address,nft.address);
    await oneTreePlanted.deployed();
  });

  it("Should allow owner to plant a tree as an NFT", async function () {
    await oneTreePlanted.connect(owner).plantTree(treeLocation, treeSpecies);
    const treeDetails = await oneTreePlanted.getTokenDetails(1);

    expect(treeDetails.location).to.equal(treeLocation);
    expect(treeDetails.species).to.equal(treeSpecies);
    expect(treeDetails.planter).to.equal(owner.address);
  });

//   it("Should allow a contributor to contribute tokens and plant a tree as an NFT", async function () {
//     const contributionAmount = ethers.utils.parseEther("2.0");

//     // Get the initial balance of the contributor
//     const initialContributorBalance = await contributor.getBalance();

//     // Send a transaction from contributor to the oneTreePlanted contract
//     await contributor.sendTransaction({ to: oneTreePlanted.address, value: contributionAmount });

//     // Call the contribute function
//     await oneTreePlanted.connect(contributor).contribute(contributionAmount, treeLocation, treeSpecies);

//     // Check the final balance of the contributor after the contribution
//     const finalContributorBalance = await contributor.getBalance();

//     // Verify that the contributor's balance has decreased by the contributionAmount
//     expect(finalContributorBalance).to.equal(initialContributorBalance.sub(contributionAmount));

//     // Check the details of the planted tree
//     const treeDetails = await oneTreePlanted.getTokenDetails(1);
//     expect(treeDetails.location).to.equal(treeLocation);
//     expect(treeDetails.species).to.equal(treeSpecies);
//     expect(treeDetails.planter).to.equal(contributor.address);
// });


  it("Should allow the owner to list a tree for sale", async function () {
    await oneTreePlanted.connect(owner).plantTree(treeLocation, treeSpecies);
    await oneTreePlanted.connect(owner).listTreeForSale(1, initialPrice);

    const treeDetails = await oneTreePlanted.getTokenDetails(1);

    expect(treeDetails.price).to.equal(initialPrice);
    expect(treeDetails.isForSale).to.equal(true);
  });

//   it("Should allow a buyer to purchase a tree listed for sale", async function () {
//     await oneTreePlanted.connect(owner).plantTree(treeLocation, treeSpecies);
//     await oneTreePlanted.connect(owner).listTreeForSale(1, initialPrice);
  
//     const ownerInitialBalance = await owner.getBalance();
//     const buyerInitialBalance = await buyer.getBalance();
  
//     const tx = await oneTreePlanted.connect(buyer).buyTree(1, { value: initialPrice });
//     await tx.wait();
  
//     const ownerFinalBalance = await owner.getBalance();
//     const buyerFinalBalance = await buyer.getBalance();
  
//     const treeDetails = await oneTreePlanted.getTokenDetails(1);
  
//     expect(treeDetails.isForSale).to.equal(false);
  
//     // Ensure the buyer's balance has decreased and the owner's balance has increased
//     expect(buyerFinalBalance.sub(buyerInitialBalance).gte(-initialPrice)).to.equal(true);  // Buyer's balance decreased
//     expect(ownerFinalBalance.sub(ownerInitialBalance).gte(initialPrice)).to.equal(true);  // Owner's balance increased
//   });
  


  it("Should not allow a purchase if the buyer sends an insufficient amount", async function () {
    const insufficientPrice = ethers.utils.parseEther("0.5");

    await oneTreePlanted.connect(owner).plantTree(treeLocation, treeSpecies);
    await oneTreePlanted.connect(owner).listTreeForSale(1, initialPrice);

    await expect(
      oneTreePlanted.connect(buyer).buyTree(1, { value: insufficientPrice })
    ).to.be.revertedWith("Insufficient funds");
  });
});
