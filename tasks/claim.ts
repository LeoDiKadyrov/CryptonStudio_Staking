import { task } from "hardhat/config";

const contractAddress = "0x164ec64b5dF3B804547FE08413431268dd9160ca";

task("claim", "Claim your reward tokens")
    .setAction(async (hre) => {
        const token = await hre.ethers.getContractAt("Staking", contractAddress);
        await token.claim();
        console.log("Claimed successfully");
});