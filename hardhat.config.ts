import { HardhatUserConfig } from "hardhat/config";
import "@nomicfoundation/hardhat-toolbox";
import "hardhat-tracer";

const privateKey = "YOUR_PRIVATE_KEY_HERE";

const config: HardhatUserConfig = {
  solidity: "0.8.17",
  networks: {
    hardhat: {
      chainId: 10,
      accounts: [
        {
          privateKey,
          balance: "100000000000000000000000000000000000",
        }
      ],
      forking: {
        url: "https://mainnet.optimism.io/",
      },
    },
    optimism: {
      url: "https://mainnet.optimism.io/",
      accounts: [privateKey],
    },
  },
};

export default config;
