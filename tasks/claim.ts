import { task } from "hardhat/config";

const contractAddress = "0xC1ACa97CD3971193F33441F0831787C2df828180";

task("claim", "Claim your reward tokens")
    .setAction(async (hre) => {
        const token = await hre.ethers.getContractAt("Staking", contractAddress);
        await token.claim();
        console.log("Claimed successfully");
});