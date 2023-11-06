require("@nomiclabs/hardhat-waffle");

module.exports = {
  solidity: "0.8.4",
  networks:{
    hardhat:{},
    mumbai:{
      url: "https://polygon-mumbai.g.alchemy.com/v2/m8AxTJ9gftXFtQiq4dBB4Jf6cQWedi36",
      accounts:[`0x${"7c852118294e51e653712a81e05800f419141751be58f605c371e15141b007a6"}`,],
    },
  },
  paths: {
    artifacts: "./src/backend/artifacts",
    sources: "./src/backend/contracts",
    cache: "./src/backend/cache",
    tests: "./src/backend/test"
  },
};
