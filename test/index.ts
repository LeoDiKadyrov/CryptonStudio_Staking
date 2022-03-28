import { ethers, network } from "hardhat";
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
    let amount : number = 10;

    beforeEach(async () => {
      tokenBalanceBefore = await stakingToken.balanceOf(staking.address);
      balanceBefore = await stakingToken.balanceOf(owner.address);

      await staking.setLastUpdateTime();  
    });

    it("Shouldn't stake without approve", async () => {
      await stakingToken.approve(staking.address, 0, amount);
      await expect(staking.stake(11)).to.be.revertedWith('Not enough allowance');
    });

    it("If amount of staking is 0 - revert", async () => {
      await expect(staking.stake(0)).to.be.revertedWith("Cannot stake nothing");
    });

    it("Stake should change totalSupply", async () => {
      await stakingToken.approve(staking.address, 0, amount);
      await staking.stake(amount);
      expect(await staking.getTotalSupply()).to.eq(amount);
    });

    it("StakingToken balance should increase", async () => {
      await stakingToken.approve(staking.address, 0, amount);
      await staking.stake(amount);
      tokenBalanceAfter = await stakingToken.balanceOf(staking.address);
      expect(tokenBalanceBefore.add(10)).to.eq(tokenBalanceAfter);
    });

    it("balance increased", async () => {
      await stakingToken.approve(staking.address, 0, amount);
      await staking.stake(amount);
      balanceAfter = await stakingToken.balanceOf(owner.address);
      expect(balanceBefore.sub(10)).to.eq(balanceAfter);
    });

    it("Started time fixed", async () => {
      await stakingToken.approve(staking.address, 0, amount);
      await staking.stake(amount);
      const stakingTime = await staking.getStakingTime(owner.address);
      const blockNumber = await ethers.provider.getBlockNumber();
      const time = (await ethers.provider.getBlock(blockNumber)).timestamp;
      expect(time + 1200).to.eq(stakingTime);
    });

  });

  describe("Unstake", () => {
    let totalSupplyBefore: BigNumber;
    let totalSupplyAfter: BigNumber;
    let tokenBalanceBefore: BigNumber;
    let tokenBalanceAfter: BigNumber;
    let amount : number = 10;

    beforeEach(async () => {
      await stakingToken.transfer(staking.address, amount);
      await stakingToken.approve(staking.address, 0, amount);
      await staking.stake(amount);
      await ethers.provider.send("evm_increaseTime", [1800]);

      tokenBalanceBefore = await stakingToken.balanceOf(staking.address);
      totalSupplyBefore = await staking.getTotalSupply();

      await staking.unstake(amount);

      tokenBalanceAfter = await stakingToken.balanceOf(staking.address);
      totalSupplyAfter = await staking.getTotalSupply();
    });

    it("Should decrease token balanceOf", async () => {
      expect(tokenBalanceAfter.add(amount)).to.eq(tokenBalanceBefore);
    });

    it("Should decrease totalSupply", async () => {
      expect(totalSupplyAfter.add(amount)).to.eq(totalSupplyBefore);
    });

    it("Should revert when amount is zero", async () => {
      let tx = staking.connect(addr1).unstake(0);
      expect(tx).to.be.revertedWith("Cannot unstake nothing")
    });

    it("Should revert if stakingTime is still not ended", async () => {
      await stakingToken.transfer(staking.address, amount);
      await stakingToken.approve(staking.address, 0, amount);
      await staking.stake(amount);
      
      const tx = staking.unstake(amount);
      expect(tx).to.be.revertedWith("Staking time is still not ended")
    });

  });

  describe("Claim", () => {
    let amount : number = 10;
    let time : number = 1800;
    let rewardBalanceBefore: BigNumber;
    let rewardBalanceAfter: BigNumber;
    let expectedBalance: BigNumber;
    let earnedTokens: BigNumber;

    it("Claim should change balanceOf token right", async () => {
      rewardToken.transfer(staking.address, amount * 10);

      await stakingToken.approve(staking.address, 0, amount);
      await staking.stake(amount);

      await ethers.provider.send("evm_increaseTime", [time]);
      await staking.setLastUpdateTime();

      earnedTokens = await staking.earned(owner.address);

      rewardBalanceBefore = await rewardToken.balanceOf(owner.address);
      await staking.claim();
      rewardBalanceAfter = await rewardToken.balanceOf(owner.address);
      expectedBalance = rewardBalanceAfter.sub(rewardBalanceBefore);
      expect(earnedTokens).to.eq(expectedBalance);
    });

  });

});
