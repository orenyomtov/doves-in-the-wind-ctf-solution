import { ethers } from "hardhat";

async function main() {
  const signer = ethers.provider.getSigner(0);
  const oddNumbersSum = "1002"
  const solutionFactory = new ethers.ContractFactory([], `0x3d600d80600a3d3981f361${oddNumbersSum}3246351b175952593df33258351b175952593df3`, signer)
  const solution = await solutionFactory.deploy()
  await solution.deployed()
  console.log(`Deployed solution to ${solution.address}`);

  const deployedCode = await ethers.provider.getCode(solution.address);
  console.log(`Deployed bytecode: ${deployedCode}`);
}

// We recommend this pattern to be able to use async/await everywhere
// and properly handle errors.
main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});
