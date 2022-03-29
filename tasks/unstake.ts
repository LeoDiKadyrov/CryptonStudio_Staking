import { task } from "hardhat/config";

const contractAddress = "0x164ec64b5dF3B804547FE08413431268dd9160ca";

task("unstake", "Get Your LP's back")
  .addParam("amount", "How much do you want to get back")
  .setAction(async (taskArgs, hre) => {
    const token = await hre.ethers.getContractAt("Staking", contractAddress);
    await token.unstake(taskArgs.amount);
    console.log(`Unstake successfully: ${taskArgs.amount}.`);
});