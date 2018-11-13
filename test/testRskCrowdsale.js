const chai = require("chai");
const chaiAsPromised = require("chai-as-promised");
chai.use(chaiAsPromised);
const { expect } = chai;

const time = require("./helpers/time");
const shouldFail = require("./helpers/shouldFail");

const RskCrowdsale = artifacts.require("RskCrowdsale");
const RskToken = artifacts.require("RskToken");
const TokenVesting = artifacts.require("TokenVesting");


contract('RskCrowdsale', async (accounts) => {

    const [owner, companyAddr, foundationAddr] = accounts;
    const eAddrs = [accounts[3], accounts[4], accounts[5]];
    const eAmounts = [1.6 * 1000 * 1000 * 1000, 0.8 * 1000 * 1000 * 1000, 7.5 * 1000 * 1000];

    const aAddrs = [accounts[6], accounts[7]];
    const aAmounts = [0.2 * 1000 * 1000 * 1000, 0.2 * 1000 * 1000 * 1000];

    const pAddrs = [accounts[8], accounts[9]];
    const pAmounts = [0.2 * 1000 * 1000, 0.2 * 1000 * 1000 * 1000];

    const companyAmount = 2.4 * 1000 * 1000 * 1000;
    const foundationAmount = 12 * 1000 * 1000 * 1000;

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
        this.token = RskToken.at(await this.rskCrowdsale.token());

        this.rskCrowdsale.initTransfer(pAddrs, pAmounts);
        this.rskCrowdsale.initEmployeesVesting(eAddrs, eAmounts);
        this.rskCrowdsale.initAdvisorsVesting(aAddrs, aAmounts);

        console.log(await this.rskCrowdsale.getEmployeeVesting(1));

        // this.employeesVesting = TokenVesting.at(await this.rskCrowdsale.employeesVesting());
        // this.advisorsVesting = TokenVesting.at(await this.rskCrowdsale.advisorsVesting());

        // console.log("rskCrowdsale address=", rskCrowdsale.address);
        // console.log("token address=", token.address);
    });

    contract('tokens allocation', () => {
        it ('sets owner on deploy', async () => {
            expect(await this.rskCrowdsale.owner()).to.equal(owner);
        });

        it ('should put correct amount of RskToken in foundation and employee address', async () => {
            expect(await balanceOf(this.token, foundationAddr)).to.equal(foundationAmount);
            expect(await balanceOf(this.token, companyAddr)).to.equal(companyAmount);
        });

        it ('cannot be released before cliff', async () => {
            await shouldFail.reverting(this.rskCrowdsale.releaseEmployeeVesting(0));
            await shouldFail.reverting(this.rskCrowdsale.releaseAdvisorVesting(0));
        });

        it('employees tokens can release after vesting', async () => {

            // expect(await balanceOf(this.token, this.employeesVesting)).to.equal(employeesAmount);
            // expect(await balanceOf(this.token, this.advisorsVesting)).to.equal(advisorsAmount);
            // expect(await balanceOf(this.token, employeesAddr)).to.equal(0);
            //
            //
            // await time.increaseTo(this.starTime + time.duration.years(2));
            //
            //
            // await time.increaseTo(this.starTime + time.duration.years(4));
            // await this.rskCrowdsale.releaseVestingEmployees();
            //
            // expect(await balanceOf(this.token, employeesAddr)).to.equal(employeesAmount);

            // let before = await time.latest();
            // console.log(before, await time.latest(), (await time.latest() - before)/time.duration.years(1));
            // console.log("owner=", owner, "employeesVesting=", await this.employeesVesting.owner(), "rskCrowdsale=", this.rskCrowdsale.address);
        });


    });


});