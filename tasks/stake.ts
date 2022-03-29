import { task } from "hardhat/config";

const contractAddress = "0x164ec64b5dF3B804547FE08413431268dd9160ca";

task("stake", "Stake your tokens")
  .addParam("amount", "Amount of token to stake")
  .setAction(async (taskArgs, hre) => {
    const token = await hre.ethers.getContractAt("Staking", contractAddress);
    await token.stake(taskArgs.amount);
    console.log(`Staked successfully: ${taskArgs.amount}`);
});