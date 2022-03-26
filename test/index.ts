import { ethers } from "hardhat";
import { expect } from "chai";
import { KadyrovToken, Staking, KadyrovToken__factory, Staking__factory } from "../typechain"
import { SignerWithAddress } from "@nomiclabs/hardhat-ethers/signers";
import { BigNumber } from "ethers";

describe("Staking Token", function () {
  let stakingToken: KadyrovToken;
  let rewardToken: KadyrovToken;
  let staking: Staking;
  let owner : SignerWithAddress;
  let addr1 : SignerWithAddress;

  beforeEach(async function () {
    [owner, addr1] = await ethers.getSigners();
    stakingToken = await new KadyrovToken__factory(owner).deploy();
    rewardToken = await new KadyrovToken__factory(owner).deploy();
    staking = await new Staking__factory(owner).deploy(
      stakingToken.address,
      rewardToken.address
    );
  });

  describe("Deploy check", () => {

    it("rewardToken exists", async () => {
      const RewardToken = await staking.getRewardsToken();
      expect(rewardToken.address).to.eq(RewardToken);
    });
    
    it("stakingToken exists", async () => {
      const stakeToken = await staking.getStakingToken();
      expect(stakingToken.address).to.eq(stakeToken);
    });

    it("Role exists", async () => {
      const ADMIN_ROLE = ethers.utils.id("ADMIN_ROLE");
      expect(true).to.eq(await staking.hasRole(ADMIN_ROLE, owner.address));
    });

    it("TotalSupply should be zero", async () => {
      expect(await staking.getTotalSupply()).to.eq(0);
    });

    it("RewardRate should be eq to default value", async () => {
      expect(await staking.getRewardTime()).to.eq(600);
    });

    it("ClaimTime should be eq to default value", async () => {
      expect(await staking.getClaimTime()).to.eq(1200);
    });

    it("BalanceOf should be zero", async () => {
      expect(await staking.balanceOf(owner.address)).to.eq(0);
    });

  });

  describe("Stake", () => {
    let balanceBefore: BigNumber;
    let balanceAfter: BigNumber;
    let tokenBalanceBefore: BigNumber;
    let tokenBalanceAfter: BigNumber;

    beforeEach(async () => {
      tokenBalanceBefore = await stakingToken.balanceOf(staking.address);
      balanceBefore = await stakingToken.balanceOf(owner.address);

      await stakingToken.approve(staking.address, 0, 1000);
      await staking.stake(100);

      tokenBalanceAfter = await stakingToken.balanceOf(staking.address);
      balanceAfter = await stakingToken.balanceOf(owner.address);
    });

    it("Shouldn't stake without approve", async () => {
      await stakingToken.approve(staking.address, 1000, 0);
      await stakingToken.transfer(owner.address, 1000);
      await rewardToken.transfer(staking.address, 1000);
      const tx = staking.connect(owner).stake(1000);
      await expect(tx).to.be.revertedWith('Not enough allowance');
    });

    it("If amount of staking is 0 - revert", async () => {
      await expect(staking.stake(0)).to.be.revertedWith("Cannot stake nothing");
    });

    it("Stake should change totalSupply", async () => {
      expect(await staking.getTotalSupply()).to.eq(100);
    });

    it("StakingToken balance should increase", async () => {
      expect(tokenBalanceBefore.add(100)).to.eq(tokenBalanceAfter);
    });

    it("balance increased", async () => {
      expect(balanceBefore.sub(100)).to.eq(balanceAfter);
    });

  });
});
