const { expect } = require("chai");

describe("Halving", function () {
  it("Initial reward is 50 BLSR", async function () {
    const Token = await ethers.getContractFactory("BitcoinSolar");
    const token = await Token.deploy();
    expect(await token.calculateCurrentReward(0)).to.equal(ethers.parseEther("50"));
  });
});
