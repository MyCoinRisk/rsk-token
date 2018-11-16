const chai = require('chai');
const chaiAsPromised = require('chai-as-promised');
chai.use(chaiAsPromised);
const { expect } = chai;

const time = require('./helpers/time');
const shouldFail = require('./helpers/shouldFail');
const expectEvent = require('./helpers/expectEvent');
const { ethGetBlock } = require('./helpers/web3');

const RskCrowdsale = artifacts.require('RskCrowdsale');
const RskToken = artifacts.require('RskToken');
const TokenVesting = artifacts.require('TokenVesting');


contract('RskCrowdsale', async (accounts) => {

    const [owner] = accounts;
    const eAddrs = [accounts[1], accounts[2], accounts[3]];
    const eAmounts = [1.6 * 1000 * 1000 * 1000, 0.8 * 1000 * 1000 * 1000, 7.5 * 1000 * 1000];

    const aAddrs = [accounts[4], accounts[5]];
    const aAmounts = [0.2 * 1000 * 1000 * 1000, 0.2 * 1000 * 1000 * 1000];

    const pAddrs = [accounts[6], accounts[7]];
    const pAmounts = [0.2 * 1000 * 1000, 0.2 * 1000 * 1000 * 1000];

    const oAddrs = [accounts[8], accounts[9]];
    const oAmounts = [2.4 * 1000 * 1000 * 1000, 12 * 1000 * 1000 * 1000];

    async function balanceOf(token, address) {
        return Math.round(web3.fromWei( await token.balanceOf(address), "ether").toNumber());
    }

    async function logAccount(token, _accounts) {
        for (let i = 0; i < _accounts.length; i++) {
            console.log(_accounts[i], await balanceOf(token, _accounts[i]));
        }
        // console.log(rskCrowdsale.address, await balanceOf(token, rskCrowdsale.address));
    }

    function vestedAmount(total, now, start, cliffDuration, duration) {
        return (now < start + cliffDuration) ? 0 : Math.round(total * (now - start) / duration);
    }


    beforeEach(async () => {
        this.starTime = await time.latest() + time.duration.minutes(1);

        this.rskCrowdsale = await RskCrowdsale.new(this.starTime);
        this.token = RskToken.at(await this.rskCrowdsale.token());

        await this.rskCrowdsale.batchTransfer(pAddrs, pAmounts);
        await this.rskCrowdsale.batchTransfer(oAddrs, oAmounts);
        await this.rskCrowdsale.initEmployeesVesting(eAddrs, eAmounts);
        await this.rskCrowdsale.initAdvisorsVesting(aAddrs, aAmounts);
    });

    contract('tokens allocation', () => {
        it('sets owner on deploy', async () => {
            await logAccount(this.token, accounts);
            expect(await this.rskCrowdsale.owner()).to.equal(owner);
        });

        it('should put correct token in the account', async () => {
            for (let i = 0; i < pAddrs.length; i++) {
                expect(await balanceOf(this.token, pAddrs[i])).to.equal(pAmounts[i]);
            }
            for (let i = 0; i < oAddrs.length; i++) {
                expect(await balanceOf(this.token, oAddrs[i])).to.equal(oAmounts[i]);
            }
        });
    });

    contract('employees vesting', () => {

        it ('cannot be released before cliff', async () => {
            await shouldFail.reverting(this.rskCrowdsale.releaseEmployeeVesting(0));
        });

        it ('can be released after cliff', async () => {
            let idx = 0;
            await time.increaseTo(this.starTime + time.duration.years(1) + time.duration.weeks(1));
            await this.rskCrowdsale.releaseEmployeeVesting(idx);
            // expectEvent.inLogs(receipt.logs, 'TokensReleased', {
            //     token: this.token.address,
            //     amount: await this.token.balanceOf(eAddrs[idx]),
            // });
        });

        it('should have released all after end', async () => {
            let idx = 0;

            let eVesting0 = await this.rskCrowdsale.getEmployeeVesting(idx);
            // console.log(eVesting0, await balanceOf(this.token, this.rskCrowdsale.address));
            // console.log(await balanceOf(this.token, eAddrs[idx]), await balanceOf(this.token, eVesting0));

            expect(await balanceOf(this.token, eAddrs[idx])).to.equal(0);
            expect(await balanceOf(this.token, eVesting0)).to.equal(eAmounts[idx]);

            await time.increaseTo(this.starTime + time.duration.years(4));

            await this.rskCrowdsale.releaseEmployeeVesting(idx);
            expect(await balanceOf(this.token, eAddrs[idx])).to.equal(eAmounts[idx]);
            expect(await balanceOf(this.token, eVesting0)).to.equal(0);
        });

        it('should release proper amount after cliff', async () => {
            let idx = 0;
            await time.increaseTo(this.starTime + time.duration.years(1));

            const{ receipt } = await this.rskCrowdsale.releaseEmployeeVesting(idx);

            const block = await ethGetBlock(receipt.blockNumber);
            const releaseTime = block.timestamp;

            const releasedAmount = vestedAmount(eAmounts[idx], releaseTime, this.starTime, time.duration.years(1), time.duration.years(4));
            // console.log(releasedAmount, eAmounts[idx], await balanceOf(this.token, eAddrs[idx]), await balanceOf(this.token, await this.rskCrowdsale.getEmployeeVesting(idx)))
            expect(await balanceOf(this.token, eAddrs[idx])).to.equal(releasedAmount);
            expect(await balanceOf(this.token, await this.rskCrowdsale.getEmployeeVesting(idx))).to.equal(eAmounts[idx] - releasedAmount);

        });

        it('should return the non-vested tokens when revoked by owner', async () => {
            let idx = 0;
            await time.increaseTo(this.starTime + time.duration.years(1) + time.duration.weeks(12));

            let before = await balanceOf(this.token, this.rskCrowdsale.address);
            const vested = vestedAmount(eAmounts[idx], await time.latest(), this.starTime, time.duration.years(1), time.duration.years(4));

            await this.rskCrowdsale.revokeEmployeeVesting(idx);

            expect(await balanceOf(this.token, this.rskCrowdsale.address)).to.equal(before + eAmounts[idx] - vested);

            await logAccount(this.token, accounts);
        });

    });

    contract('advisors vesting', () => {
        it('cannot be released before cliff', async () => {
            await shouldFail.reverting(this.rskCrowdsale.releaseAdvisorVesting(0))
        });

        it('can be released after cliff', async () => {
            let idx = 0;
            await time.increaseTo(this.starTime + time.duration.months(3) + time.duration.weeks(1));
            await this.rskCrowdsale.releaseAdvisorVesting(idx);
        });

        it('should have released all after end', async () => {
            for (let i = 0; i < aAddrs.length; i++) {
                console.log(await balanceOf(this.token, aAddrs[i]), await balanceOf(this.token, await this.rskCrowdsale.getAdvisorVesting(i)));
            }

            let idx = 0;
            let aVesting0 = await this.rskCrowdsale.getAdvisorVesting(idx);

            expect(await balanceOf(this.token, aAddrs[idx])).to.equal(0);
            expect(await balanceOf(this.token, aVesting0)).to.equal(aAmounts[idx]);

            await time.increase(time.duration.years(2) + time.duration.weeks(1));
            // console.log(await time.latest(), this.starTime);

            await this.rskCrowdsale.releaseAdvisorVesting(idx);

            expect(await balanceOf(this.token, aAddrs[idx])).to.equal(aAmounts[idx]);
            expect(await balanceOf(this.token, aVesting0)).to.equal(0);
        });
    });

});