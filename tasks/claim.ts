import { task } from "hardhat/config";

const contractAddress = "0x73876230C2d5bab158613FF9D05218b73bCf6b8E";

task("claim", "Claim your reward tokens")
    .setAction(async (hre) => {
        const token = await hre.ethers.getContractAt("Staking", contractAddress);
        await token.claim();
        console.log("Claimed successfully");
});