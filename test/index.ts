import { ethers } from "hardhat";
import { expect } from "chai";
import { KadyrovToken, Staking, KadyrovToken__factory, Staking__factory } from "../typechain"
import { SignerWithAddress } from "@nomiclabs/hardhat-ethers/signers";


describe("Staking Token", function () {
  let stakingToken: KadyrovToken;
  let rewardToken: KadyrovToken;
  let staking: Staking;
  let signers: SignerWithAddress[];

  beforeEach(async function () {
    signers = await ethers.getSigners();
    stakingToken = await new KadyrovToken__factory(signers[0]).deploy();
    rewardToken = await new KadyrovToken__factory(signers[0]).deploy();
    staking = await new Staking__factory(signers[0]).deploy(
      stakingToken.address,
      rewardToken.address
    );
  });

  describe("Constructor check", () => {

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
      expect(true).to.eq(await staking.hasRole(ADMIN_ROLE, signers[0].address));
    });

  });
});
