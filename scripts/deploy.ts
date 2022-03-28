import { ethers } from "hardhat";

async function main() {
  const StakingToken = await ethers.getContractFactory("Staking");
  const contract = await StakingToken.deploy(
    "0x4A4fD2AF4A488eDB230d66CA18aA82c2AcB19ADc",
    "0xBF3826716185ec2389ca4a226De6365E1783a387"
  );

  await contract.deployed();

  console.log("Staking deployed to:", contract.address);
}

main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});
