const assertJump = require('./helpers/assertJump');
const timer = require('./helpers/timer');
var RSKVestedTokenMock = artifacts.require("./helpers/RSKVestedTokenMock.sol");

contract('RSKVestedToken', async (accounts) => {
    let token = null;
    let now = 0;

    const tokenAmount = 50;

    const granter = accounts[0];
    const receiver = accounts[1];

    beforeEach(async() => {
        token = await RSKVestedTokenMock.new(granter, 100);
        now = web3.eth.getBlock(web3.eth.blockNumber).timestamp;
    });

    it('granter can grant tokens without vesting', async () => {
        await token.transfer(receiver, tokenAmount, { from: granter});

        assert.equal(await token.balanceOf(receiver), tokenAmount);
        assert.equal(await token.transferableTokens(receiver, now), tokenAmount);
    });

    contract('getting a revokable/non-burnable token grant', async () =>{
        const cliff = 10000;
        const vesting = 20000; //seconds

        beforeEach(async () => {
            await token.grantVestedTokens(receiver, tokenAmount, now + cliff, now, now + cliff, now + vesting, true, false, { from: granter});
        });

        it('tokens are received', async () => {
            assert.equal(await token.balanceOf(receiver), tokenAmount);
        });

        it('has 0 transferable tokens before cliff', async () => {
            assert.equal(await token.transferableTokens(receiver, now), 0);
        });

        it('all tokens are tranasferable after vesting', async () => {
            assert.equal(await token.transferableTokens(receiver, now + vesting), tokenAmount);
        });

        it('throws when trying to transfer non vested tokens', async () => {
            try{
                await token.transfer(accounts[7], 1, {from: receiver});
            }catch (e) {
                return assertJump(e);
            }
            assert.fail('should have thrown before');
        })

        it('throws when trying to transfer from non vested tokens', async () => {
            try{
                await token.approve(accounts[7], 1, { from: receiver });
                await token.transferFrom(receiver, accounts[7], tokenAmount, {from: accounts[7]});
            }catch (e) {
                return assertJump(e);
            }
            assert.fail('should have thrown before');
        })
    });

});