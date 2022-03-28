import { task } from "hardhat/config";

const contractAddress = "0xC1ACa97CD3971193F33441F0831787C2df828180";

task("unstake", "Get Your LP's back")
  .addParam("amount", "How much do you want to get back")
  .setAction(async (taskArgs, hre) => {
    const token = await hre.ethers.getContractAt("Staking", contractAddress);
    await token.unstake(taskArgs.amount);
    console.log(`Unstake successfully: ${taskArgs.amount}.`);
});