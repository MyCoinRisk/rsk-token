const RSKToken = artifacts.require("RSKToken");

contract('RskToken', async (accounts) => {

  it("should put 20000 RSKToken in the first account", async() => {
    let instance = await RSKToken.deployed();
    let balance = await instance.balanceOf.call(accounts[0]);
    let amount = 20 * 1000 * 1000 * 1000;
    assert.equal(balance.toNumber(), web3.toWei(amount, 'ether'));
  });

  it("should send coin correctly", async () => {
      let accountOne = accounts[0];
      let accountTwo = accounts[1];

      let amount = 100;
      // let amount = 10000;

      let instance = await RSKToken.deployed();
      let rskToken = instance;

      let balance = await rskToken.balanceOf.call(accountOne);
      let accountOneStartingBalance = balance.toNumber();

      balance = await rskToken.balanceOf.call(accountTwo);
      let accountTwoStartingBalance = balance.toNumber();

      await rskToken.transfer(accountTwo, amount, {from: accountOne});

      balance = await rskToken.balanceOf.call(accountOne);
      let accountOneEndingBalance = balance.toNumber();

      balance = await rskToken.balanceOf.call(accountTwo);
      let accountTwoEndingBalance = balance.toNumber();

      // console.log(amount)
      // console.log(accountOneEndingBalance, accountOneStartingBalance - amount)
      // console.log(accountTwoEndingBalance, accountTwoStartingBalance + amount)

      assert.equal(accountOneEndingBalance, accountOneStartingBalance - amount, "Amount wasn't correctly taken from AccountOne");
      assert.equal(accountTwoEndingBalance, accountTwoStartingBalance + amount, "Amount wasn't correctly taken from AccountTwo");

  });


})
