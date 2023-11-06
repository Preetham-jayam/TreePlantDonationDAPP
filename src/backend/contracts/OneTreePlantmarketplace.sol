// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

import "hardhat/console.sol";
import "@openzeppelin/contracts/token/ERC721/extensions/ERC721URIStorage.sol";

contract OneTreeNFTMarketplace is ERC721URIStorage {
    address payable public owner;
    uint256 public listPrice = 0.01 ether;
    uint256 public tokenIdCounter = 1;

    constructor() ERC721("OneTreePlantedNFT", "OTPNFT") {
        owner = payable(msg.sender);
    }

    struct Tree {
        uint256 tokenId;
        string location;
        string species;
        address donor;
        uint256 amount;
    }

    mapping(uint256 => Tree) public tokenIdToTree;
    mapping(address => uint256[]) public myNFTs;

    function donateAndMintNFT(
        string memory location,
        string memory species,
        string memory tokenURI
    ) public payable {
        require(msg.value >= listPrice, "Insufficient donation amount");
        uint256 tokenId = tokenIdCounter;

        _mint(msg.sender, tokenId);
        _setTokenURI(tokenId, tokenURI);

        Tree memory tree = Tree(
            tokenId,
            location,
            species,
            msg.sender,
            msg.value
        );
        tokenIdToTree[tokenId] = tree;
        myNFTs[msg.sender].push(tokenId);

        tokenIdCounter++;

        payable(owner).transfer(listPrice);
    }

    function sellNFT(uint256 tokenId, uint256 price) public {
        require(_isApprovedOrOwner(msg.sender, tokenId), "Not the owner");
        require(tokenIdToTree[tokenId].amount == 0, "NFT is already sold");
        require(price > 0, "Price should be greater than 0");

        tokenIdToTree[tokenId].amount = price;
    }

    function purchaseNFT(uint256 tokenId) public payable {
        require(
            tokenIdToTree[tokenId].amount > 0,
            "NFT not available for purchase"
        );
        uint256 price = tokenIdToTree[tokenId].amount;

        require(msg.value >= price, "Insufficient funds");

        address previousOwner = tokenIdToTree[tokenId].donor;
        // address contractOwner = owner;

        tokenIdToTree[tokenId].donor = msg.sender;

        // payable(contractOwner).transfer(listPrice);

        _transfer(previousOwner, msg.sender, tokenId);
        payable(previousOwner).transfer(price);
    }

    function withdraw() public {
        require(msg.sender == owner, "Only the owner can withdraw funds");
        payable(owner).transfer(address(this).balance);
    }

    function createToken(
        string memory tokenURI,
        uint256 price
    ) public payable returns (uint) {
        require(msg.value == listPrice, "Send enough ether to list.");
        require(price > 0, "Make sure the price isn't negative");
        uint256 tokenId = tokenIdCounter;
        tokenIdCounter++;

        _mint(msg.sender, tokenId);
        _setTokenURI(tokenId, tokenURI);
        createListedToken(tokenId, price);

        payable(owner).transfer(listPrice);

        return tokenId;
    }

    function createListedToken(uint256 tokenId, uint256 price) private {
        tokenIdToTree[tokenId].amount = price;
    }

    function getAllNFTs() public view returns (Tree[] memory) {
        uint256 totalNFTs = tokenIdCounter - 1;
        Tree[] memory allNFTs = new Tree[](totalNFTs);

        for (uint256 i = 1; i < tokenIdCounter; i++) {
            allNFTs[i - 1] = tokenIdToTree[i];
        }

        return allNFTs;
    }

  function getMyNFTs() public view returns (Tree[] memory) {
    uint256[] memory nfts = myNFTs[msg.sender];
    uint256 totalNFTs = nfts.length;
    uint256 count = 0;
    Tree[] memory myNFTsList = new Tree[](totalNFTs);

    for (uint256 i = 0; i < totalNFTs; i++) {
        uint256 tokenId = nfts[i];
        if (_isApprovedOrOwner(msg.sender, tokenId)) {
            myNFTsList[count] = tokenIdToTree[tokenId];
            count++;
        }
    }

    Tree[] memory result = new Tree[](count);
    for (uint256 i = 0; i < count; i++) {
        result[i] = myNFTsList[i];
    }

    return result;
}

}
