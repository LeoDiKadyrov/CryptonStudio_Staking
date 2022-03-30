import { task } from "hardhat/config";

const contractAddress = "0x42a37754a6f0fD927907bA831a11C56FF94f7266";

task("stake", "Stake your tokens")
  .addParam("amount", "Amount of token to stake")
  .setAction(async (taskArgs, hre) => {
    const token = await hre.ethers.getContractAt("Staking", contractAddress);
    await token.stake(taskArgs.amount);
    console.log(`Staked successfully: ${taskArgs.amount}`);
});