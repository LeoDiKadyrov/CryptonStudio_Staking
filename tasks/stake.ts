import { task } from "hardhat/config";

const contractAddress = "0x73876230C2d5bab158613FF9D05218b73bCf6b8E";

task("stake", "Stake your tokens")
  .addParam("amount", "Amount of token to stake")
  .setAction(async (taskArgs, hre) => {
    const token = await hre.ethers.getContractAt("Staking", contractAddress);
    await token.stake(taskArgs.amount);
    console.log(`Staked successfully: ${taskArgs.amount}`);
});