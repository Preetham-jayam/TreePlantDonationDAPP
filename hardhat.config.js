require("@nomiclabs/hardhat-waffle");

module.exports = {
  solidity: "0.8.4",
  networks:{
    hardhat:{},
    sepolia:{
      url: "https://eth-sepolia.g.alchemy.com/v2/f_olXWNtz28_Mh8-u0CpAS-watfyGnxy",
      accounts:[`0x${"dbcfe66847a0e62f91c4faa239f4af7b45caff2efd6ce872135b6acded1a4946"}`,],
    },
  },
  paths: {
    artifacts: "./src/backend/artifacts",
    sources: "./src/backend/contracts",
    cache: "./src/backend/cache",
    tests: "./src/backend/test"
  },
};
