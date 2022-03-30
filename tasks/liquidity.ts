import { task } from "hardhat/config";

const contractAddress = "0x42a37754a6f0fD927907bA831a11C56FF94f7266";

task("liquidity", "Get Your LP's back")
  .addParam("firstamount", "Number of first token")
  .addParam("secondamount", "Number of second token")
  .setAction(async (taskArgs, hre) => {
    const token = await hre.ethers.getContractAt("Staking", contractAddress);
    await token._addLiquidity(taskArgs.firstamount, taskArgs.secondamount);
});