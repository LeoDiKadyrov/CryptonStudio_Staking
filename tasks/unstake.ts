import { task } from "hardhat/config";

const contractAddress = "0x73876230C2d5bab158613FF9D05218b73bCf6b8E";

task("unstake", "Get Your LP's back")
  .addParam("amount", "How much do you want to get back")
  .setAction(async (taskArgs, hre) => {
    const token = await hre.ethers.getContractAt("Staking", contractAddress);
    await token.unstake(taskArgs.amount);
    console.log(`Unstake successfully: ${taskArgs.amount}.`);
});