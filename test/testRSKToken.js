const RSKToken = artifacts.require("RSKToken");
const Web3 = require('web3');
const web3 = new Web3('http://localhost:7545');


contract('RskToken', async (accounts) => {

  it("should put 20000 RSKToken in the first account", async() => {
    let instance = await RSKToken.deployed();
    let balance = await instance.balanceOf.call(accounts[0]);
    assert.equal(balance, web3.toWei('20000', 'ether').toNumber());
  })


})
