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

    async function balanceOf(token, address) {
        return Math.round(web3.fromWei( await token.balanceOf(address), "ether").toNumber());
    }

    function vestedAmount(total, now, start, cliffDuration, duration) {
        return (now < start + cliffDuration) ? 0 : Math.round(total * (now - start) / duration);
    }

    beforeEach(async () => {
        this.starTime = await time.latest() + time.duration.minutes(1);
        this.rskCrowdsale = await RskCrowdsale.new(this.starTime);
        this.aToken = await this.rskCrowdsale.token();
        this.token = RskToken.at(this.aToken);

        // console.log("rskCrowdsale address=", rskCrowdsale.address);
        // console.log("token address=", token.address);
    });

    contract('tokens allocation', () => {
        it ('sets owner on deploy', async () => {
            expect(await this.rskCrowdsale.owner()).to.equal(owner);
        });

        it('should put 12 billion RskToken in foundation address', async () => {
            let amount = 12 * 1000 * 1000 * 1000;
            expect(await balanceOf(this.token, accounts[5])).to.equal(amount);
        });

        it('employees tokens can release after vesting', async () => {
            let amount = 3 * 1000 * 1000 * 1000;
            let aEmployees = await this.rskCrowdsale.employeesVesting();

            console.log(aEmployees);

            expect(await balanceOf(this.token, aEmployees)).to.equal(amount);

            await time.increaseTo(this.starTime + time.duration.years(4));
            await this.rskCrowdsale.releaseVestingEmployees();
            //
            // expect(await balanceOf(accounts[1])).to.equal(amount);
        });


    });


});