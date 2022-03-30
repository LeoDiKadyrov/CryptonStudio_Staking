import { task } from "hardhat/config";

const contractAddress = "0x42a37754a6f0fD927907bA831a11C56FF94f7266";

task("unstake", "Get Your LP's back")
  .addParam("amount", "How much do you want to get back")
  .setAction(async (taskArgs, hre) => {
    const token = await hre.ethers.getContractAt("Staking", contractAddress);
    await token.unstake(taskArgs.amount);
    console.log(`Unstake successfully: ${taskArgs.amount}.`);
});