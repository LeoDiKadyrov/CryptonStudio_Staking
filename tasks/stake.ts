import { task } from "hardhat/config";

const contractAddress = "0xC1ACa97CD3971193F33441F0831787C2df828180";

task("stake", "Stake your tokens")
  .addParam("amount", "Amount of token to stake")
  .setAction(async (taskArgs, hre) => {
    const token = await hre.ethers.getContractAt("Staking", contractAddress);
    await token.stake(taskArgs.amount);
    console.log(`Staked successfully: ${taskArgs.amount}`);
});