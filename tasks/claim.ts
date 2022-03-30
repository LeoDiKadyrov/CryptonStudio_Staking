import { task } from "hardhat/config";

const contractAddress = "0x42a37754a6f0fD927907bA831a11C56FF94f7266";

task("claim", "Claim your reward tokens")
    .setAction(async (hre) => {
        const token = await hre.ethers.getContractAt("Staking", contractAddress);
        await token.claim();
        console.log("Claimed successfully");
});