import { task } from "hardhat/config";

const contractAddress = "0x42a37754a6f0fD927907bA831a11C56FF94f7266";

task("approve", "Allowing another user to withdraw tokens from your balance")
  .addParam("spender", "The address to give access to")
  .addParam("current", "Current number of allowed tokens")
  .addParam("value", "Amount of tokens to allow for address")
  .setAction(async (taskArgs, hre) => {
    const { spender, current, value } = taskArgs;
    const kdvt = await hre.ethers.getContractAt("KadyrovToken", contractAddress);
    await kdvt.approve(spender, current, value);
});