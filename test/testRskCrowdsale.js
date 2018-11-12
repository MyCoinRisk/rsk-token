const chai = require("chai");
const chaiAsPromised = require("chai-as-promised");
chai.use(chaiAsPromised);
const { expect } = chai;

const time = require("./helpers/time");
const shouldFail = require("./helpers/shouldFail");

const RskCrowdsale = artifacts.require("RskCrowdsale");
const RskToken = artifacts.require("RskToken");
const TokenVesting = artifacts.require("TokenVesting");
const TokenTimelock = artifacts.require("TokenTimelock");


contract('RskCrowdsale', async (accounts) => {

    const [owner, employeesAddr, advisorsAddr, patternsAddr, companyAddr, foundationAddr] = accounts;

    const totalSupply = 12 * 1000 * 1000 * 1000;
    const patternsAmount = 1.5 * 1000 * 1000 * 1000;
    const companyAmount = 2.4 * 1000 * 1000 * 1000;
    const employeesAmount = 3 * 1000 * 1000 * 1000;
    const advisorsAmount = 1.1 * 1000 * 1000 * 1000;
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
        this.employeesVesting = TokenVesting.at(await this.rskCrowdsale.employeesVesting());
        this.advisorsVesting = TokenVesting.at(await this.rskCrowdsale.advisorsVesting());

        this.patternsTimelock = TokenTimelock.at(await this.rskCrowdsale.patternsTimelock());
        this.companyTimelock = TokenTimelock.at(await this.rskCrowdsale.companyTimelock());

        // console.log("rskCrowdsale address=", rskCrowdsale.address);
        // console.log("token address=", token.address);
    });

    contract('tokens allocation', () => {
        it ('sets owner on deploy', async () => {
            expect(await this.rskCrowdsale.owner()).to.equal(owner);
        });

        it('should put 12 billion RskToken in foundation address', async () => {
            expect(await balanceOf(this.token, foundationAddr)).to.equal(foundationAmount);
        });

        it('cannot be released before limit time', async () => {
            await shouldFail.reverting(this.rskCrowdsale.releaseLockPatterns());
            await shouldFail.reverting(this.rskCrowdsale.releaseLockCompany());
            await shouldFail.reverting(this.patternsTimelock.release());
            await shouldFail.reverting(this.companyTimelock.release());
        });

        it('can be release after limit time', async () => {
            await time.increaseTo(this.starTime + time.duration.months(3));
            await this.rskCrowdsale.releaseLockPatterns();
            expect(await balanceOf(this.token, patternsAddr)).to.equal(patternsAmount);

            await time.increaseTo(this.starTime + time.duration.years(1));
            await this.rskCrowdsale.releaseLockCompany();
            expect(await balanceOf(this.token, companyAddr)).to.equal(companyAmount);
        });

        it('cannot be released before cliff', async () => {
            await shouldFail.reverting(this.rskCrowdsale.releaseVestingEmployees());
            await shouldFail.reverting(this.rskCrowdsale.releaseVestingAdvisors());
            await shouldFail.reverting(this.employeesVesting.release(this.token.address));
            await shouldFail.reverting(this.advisorsVesting.release(this.token.address));
        });

        it('employees tokens can release after vesting', async () => {

            expect(await balanceOf(this.token, this.employeesVesting)).to.equal(employeesAmount);
            expect(await balanceOf(this.token, this.advisorsVesting)).to.equal(advisorsAmount);
            expect(await balanceOf(this.token, employeesAddr)).to.equal(0);


            await time.increaseTo(this.starTime + time.duration.years(2));


            await time.increaseTo(this.starTime + time.duration.years(4));
            await this.rskCrowdsale.releaseVestingEmployees();

            expect(await balanceOf(this.token, employeesAddr)).to.equal(employeesAmount);

            // let before = await time.latest();
            // console.log(before, await time.latest(), (await time.latest() - before)/time.duration.years(1));
            // console.log("owner=", owner, "employeesVesting=", await this.employeesVesting.owner(), "rskCrowdsale=", this.rskCrowdsale.address);
        });


    });


});