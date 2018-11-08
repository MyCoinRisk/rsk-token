const chai = require("chai");
const chaiAsPromised = require("chai-as-promised");
const increaseTime = require("./helper/timeTravel");

const now = () => web3.eth.getBlock(web3.eth.blockNumber).timestamp;
const day = 24 * 60 * 60;

chai.use(chaiAsPromised);
const { expect } = chai;

const RskCrowdsale = artifacts.require("RskCrowdsale");


contract('RskCrowdsale', async (accounts) => {

    const [owner, other] = accounts;
    console.log(owner, other);

    let rskCrowdsale;
    let token;

    async function balanceOf(address) {
        return Math.round(web3.fromWei(await token.balanceOf(address), "ether").toNumber());
    }

    beforeEach(async () => {
        await RskCrowdsale.new(now() + day)
            .then((instance) => {
                rskCrowdsale = instance;
                token = instance.token();
                console.log("address:", instance.address);
            });
    });

    contract('tokens allocation', () => {
        it ('sets owner on deploy', async () => {
            expect(await rskCrowdsale.owner()).to.equal(owner);
        });

        it('should put 20 billion RskToken in the first account', async () => {
            let amount = 20 * 1000 * 1000 * 1000;
            expect(balanceOf(accounts[0])).to.equal(amount);
        });
    });


});