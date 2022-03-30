import { ethers } from "hardhat";

async function main() {
  // 0x743cA424f7eBf35220cB173AFFD32303636562Ee - reward token
  // 0xCCF78123e348a64A880B987Cd778F9965B7Aa439 - lp token
  // 0x73876230C2d5bab158613FF9D05218b73bCf6b8E - staking token

  const rewardTokenSupply = ethers.utils.parseUnits("10000000000");
  const lpTokenSupply = ethers.utils.parseUnits("10000000");

  const RewardTokenFactory = await ethers.getContractFactory("ERC20Token");
  const rewardTokenContract = await RewardTokenFactory.deploy(
    "Reward token",
    "REW",
    rewardTokenSupply
  );
  await rewardTokenContract.deployed();
  console.log("Reward token deployed to:", rewardTokenContract.address);

  const LpTokenFactory = await ethers.getContractFactory("ERC20Token");
  const lpTokenContract = await LpTokenFactory.deploy(
    "StakingToken",
    "STK",
    lpTokenSupply
  );
  await lpTokenContract.deployed();
  console.log("LP token deployed to:", lpTokenContract.address);

  // We get the contract to deploy
  const StakingFactory = await ethers.getContractFactory(
    "Staking"
  );
  const Staking = await StakingFactory.deploy(
    rewardTokenContract.address,
    lpTokenContract.address
  );

  await Staking.deployed();

  console.log("Staking contract deployed to:", Staking.address);
}

main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});
