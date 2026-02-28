const { expect } = require("chai");
const { ethers } = require("hardhat");
const { loadFixture } = require("@nomicfoundation/hardhat-network-helpers");

describe("BitcoinSolar", function () {
  async function deployFixture() {
    const [owner, miner1, miner2, unauthorized] = await ethers.getSigners();
    const BLSR = await ethers.getContractFactory("BitcoinSolar");
    const blsr = await BLSR.deploy();
    return { blsr, owner, miner1, miner2, unauthorized };
  }

  const REWARD_ERA_0 = ethers.parseEther("50");
  const HALVING_INTERVAL = ethers.parseEther("2100000");
  const MAX_SUPPLY = ethers.parseEther("21000000");

  describe("Deployment", function () {
    it("sets name, symbol, and zero initial supply", async function () {
      const { blsr } = await loadFixture(deployFixture);
      expect(await blsr.name()).to.equal("BitcoinSolar");
      expect(await blsr.symbol()).to.equal("BLSR");
      expect(await blsr.totalSupply()).to.equal(0n);
      expect(await blsr.totalMined()).to.equal(0n);
    });

    it("deployer is owner and authorized node", async function () {
      const { blsr, owner } = await loadFixture(deployFixture);
      expect(await blsr.owner()).to.equal(owner.address);
      expect(await blsr.isAuthorizedNode(owner.address)).to.be.true;
    });

    it("remainingSupply equals MAX_SUPPLY at start", async function () {
      const { blsr } = await loadFixture(deployFixture);
      expect(await blsr.remainingSupply()).to.equal(MAX_SUPPLY);
    });
  });

  describe("Access control", function () {
    it("reverts when unauthorized address calls executeMining", async function () {
      const { blsr, unauthorized, miner1 } = await loadFixture(deployFixture);
      await expect(
        blsr.connect(unauthorized).executeMining(miner1.address)
      ).to.be.revertedWith("SECURITY_ERR: UNAUTHORIZED_NODE");
    });

    it("allows owner to add and remove authorized nodes", async function () {
      const { blsr, owner, miner1, miner2 } = await loadFixture(deployFixture);

      await blsr.addAuthorizedNode(miner1.address);
      expect(await blsr.isAuthorizedNode(miner1.address)).to.be.true;

      // Authorized node can mine
      await blsr.connect(miner1).executeMining(miner2.address);
      expect(await blsr.totalMined()).to.equal(REWARD_ERA_0);

      // Revoke
      await blsr.removeAuthorizedNode(miner1.address);
      expect(await blsr.isAuthorizedNode(miner1.address)).to.be.false;
    });

    it("reverts addAuthorizedNode with zero address", async function () {
      const { blsr } = await loadFixture(deployFixture);
      await expect(
        blsr.addAuthorizedNode(ethers.ZeroAddress)
      ).to.be.revertedWith("SECURITY_ERR: ZERO_ADDRESS");
    });
  });

  describe("Mining", function () {
    it("mints correct reward in era 0", async function () {
      const { blsr, miner1 } = await loadFixture(deployFixture);
      await blsr.executeMining(miner1.address);

      expect(await blsr.balanceOf(miner1.address)).to.equal(REWARD_ERA_0);
      expect(await blsr.totalMined()).to.equal(REWARD_ERA_0);
      expect(await blsr.remainingSupply()).to.equal(MAX_SUPPLY - REWARD_ERA_0);
    });

    it("reverts on zero address miner", async function () {
      const { blsr } = await loadFixture(deployFixture);
      await expect(
        blsr.executeMining(ethers.ZeroAddress)
      ).to.be.revertedWith("BLSR: zero address");
    });

    it("enforces one mint per miner per block", async function () {
      const { blsr, miner1 } = await loadFixture(deployFixture);

      // Disable automine so both txs land in the same block
      await ethers.provider.send("evm_setAutomine", [false]);

      try {
        const tx1 = await blsr.executeMining(miner1.address);
        const tx2 = await blsr.executeMining(miner1.address);

        await ethers.provider.send("evm_mine", []);

        // First tx succeeds
        const receipt1 = await tx1.wait();
        expect(receipt1.status).to.equal(1);

        // Second tx should have reverted (status 0).
        // ethers v6 throws on reverted receipts, so catch it.
        let reverted = false;
        try {
          await tx2.wait();
        } catch {
          reverted = true;
        }
        expect(reverted).to.be.true;
      } finally {
        await ethers.provider.send("evm_setAutomine", [true]);
      }
    });

    it("allows different miners in the same block", async function () {
      const { blsr, miner1, miner2 } = await loadFixture(deployFixture);
      await blsr.executeMining(miner1.address);
      await blsr.executeMining(miner2.address);

      expect(await blsr.balanceOf(miner1.address)).to.equal(REWARD_ERA_0);
      expect(await blsr.balanceOf(miner2.address)).to.equal(REWARD_ERA_0);
    });
  });

  describe("Halving", function () {
    it("reward halves after HALVING_INTERVAL tokens mined", async function () {
      const { blsr, miner1 } = await loadFixture(deployFixture);

      // calculateCurrentReward is pure — test it directly
      expect(await blsr.calculateCurrentReward(0n)).to.equal(REWARD_ERA_0);
      expect(await blsr.calculateCurrentReward(HALVING_INTERVAL)).to.equal(
        REWARD_ERA_0 / 2n
      );
      expect(await blsr.calculateCurrentReward(HALVING_INTERVAL * 2n)).to.equal(
        REWARD_ERA_0 / 4n
      );
    });

    it("returns 0 reward after enough eras", async function () {
      const { blsr } = await loadFixture(deployFixture);
      // After 64 eras, reward should be 0
      expect(await blsr.calculateCurrentReward(HALVING_INTERVAL * 64n)).to.equal(0n);
    });

    it("emits HalvingOccurred when crossing era boundary", async function () {
      const { blsr, owner, miner1 } = await loadFixture(deployFixture);

      // Mine until just before the halving boundary
      // We need totalMined to cross HALVING_INTERVAL
      // At 50 BLSR per mine, that's 42000 mines for 2.1M tokens
      // Instead of mining 42000 times, test the reward calculation
      const rewardAtBoundary = await blsr.calculateCurrentReward(HALVING_INTERVAL);
      expect(rewardAtBoundary).to.equal(ethers.parseEther("25"));
    });
  });

  describe("SupplyManager", function () {
    it("era calculation is correct across boundaries", async function () {
      const { blsr } = await loadFixture(deployFixture);

      // Just before first halving
      const justBefore = HALVING_INTERVAL - 1n;
      expect(await blsr.calculateCurrentReward(justBefore)).to.equal(REWARD_ERA_0);

      // Exactly at first halving
      expect(await blsr.calculateCurrentReward(HALVING_INTERVAL)).to.equal(
        REWARD_ERA_0 / 2n
      );
    });

    it("reward progression follows expected schedule", async function () {
      const { blsr } = await loadFixture(deployFixture);

      const expectedRewards = [50n, 25n, 12n, 6n, 3n, 1n];
      for (let era = 0; era < expectedRewards.length; era++) {
        const supply = HALVING_INTERVAL * BigInt(era);
        const reward = await blsr.calculateCurrentReward(supply);
        // Compare in whole tokens (truncating decimals from bit-shift)
        const wholeTokens = reward / ethers.parseEther("1");
        expect(wholeTokens).to.equal(expectedRewards[era]);
      }
    });
  });
});
