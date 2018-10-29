const RSKToken = artifacts.require("RSKToken");

contract('RskToken', async (accounts) => {

  it("should put 20000 RSKToken in the first account", async() => {
    let instance = await RSKToken.deployed();
    let balance = await instance.balanceOf.call(accounts[0]);
    assert.equal(balance.toNumber(), web3.toWei('20000', 'ether'));
  })


})
