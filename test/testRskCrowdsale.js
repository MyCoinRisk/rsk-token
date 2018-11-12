const chai = require("chai");
const chaiAsPromised = require("chai-as-promised");
chai.use(chaiAsPromised);
const { expect } = chai;

const time = require("./helper/time");

const RskCrowdsale = artifacts.require("RskCrowdsale");
const RskToken = artifacts.require("RskToken");


contract('RskCrowdsale', async (accounts) => {

    const [owner, other] = accounts;
    // console.log(owner, other);

    let rskCrowdsale;
    let aToken;
    let token;

    async function balanceOf(address) {
        return Math.round(web3.fromWei( await token.balanceOf(address), "ether").toNumber());
    }

    beforeEach(async () => {
        rskCrowdsale = await RskCrowdsale.new(await time.latest() + time.duration.minutes(1));
        console.log("rskCrowdsale address=", rskCrowdsale.address);

        aToken = await rskCrowdsale.token();
        token = RskToken.at(aToken);

        console.log("token address=", token.address);
    });

    contract('tokens allocation', () => {
        it ('sets owner on deploy', async () => {
            expect(await rskCrowdsale.owner()).to.equal(owner);
        });

        it('should put 12 billion RskToken in the fifth account', async () => {
            let amount = 12 * 1000 * 1000 * 1000;
            expect(await balanceOf(accounts[5])).to.equal(amount);
        });

        

    });


});