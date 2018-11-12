pragma solidity ^0.4.24;

import "openzeppelin-solidity/contracts/ownership/Ownable.sol";
import "openzeppelin-solidity/contracts/math/SafeMath.sol";
import "openzeppelin-solidity/contracts/token/ERC20/TokenTimelock.sol";
import "openzeppelin-solidity/contracts/drafts/TokenVesting.sol";
import "./RskToken.sol";
import "./RskCrowdsaleConfig.sol";

/**
 * @title RSKCrowdsale
 * @dev RSK Token Crowdsale implementation
 */
contract RSKCrowdsale is Ownable, RskCrowdsaleConfig {
    using SafeMath for uint256;
    using SafeERC20 for RskToken;

    // Token contract
    RskToken public token;

    uint64 public startTime;

    // TokenTimelock
    TokenTimelock public patternsTimelock;
    TokenTimelock public companyTimelock;

    // TokenVesting
    TokenVesting public employeesVesting;
    TokenVesting public advisorsVesting;

    /**
     * @dev RSKTokenAllocate contract constructor
     * @param _startTime - Unix timestamp representing
     */
    constructor(uint64 _startTime) public {
        require(_startTime >= now);

        startTime = _startTime;

        // mints all possible tokens to crowdsale contract
        token = new RskToken(TOTAL_SUPPLY_CAP);
        token.mint(address(this), TOTAL_SUPPLY_CAP);

        // Set a quarter , a year, 4 years after startTime, respectively
        uint64 quaterPeriod = uint64(startTime + ONE_QUATER_PERIOD);
        uint64 yearPeriod = uint64(startTime + ONE_YEAR_PERIOD);
        uint64 twoYearPeriod = uint64(startTime + 2 * ONE_YEAR_PERIOD);
        uint64 fourYearPeriod = uint64(startTime + 4 * ONE_YEAR_PERIOD);


        // Instantiation of token timelock
        patternsTimelock = new TokenTimelock(token, PATTERNS_LOCK_ADDR, quaterPeriod);
        companyTimelock = new TokenTimelock(token, COMPANY_LOCK_ADDR, yearPeriod);

        // Instantiation of token vesting
        employeesVesting = new TokenVesting(EMPLOYEES_VESTING_ADDR, startTime, yearPeriod, fourYearPeriod, true);
        advisorsVesting = new TokenVesting(ADVISORS_VESTING_ADDR, startTime, quaterPeriod, twoYearPeriod, true);

        // Genesis allocation of tokens
        token.safeTransfer(FOUNDATION_POOL_ADDR, FOUNDATION_POOL_TOKENS);

        // Allocation of vested tokens
        token.safeTransfer(patternsTimelock, PATTERNS_LOCK_TOKENS);
        token.safeTransfer(companyTimelock, COMPANY_LOCK_TOKENS);
        token.safeTransfer(employeesVesting, EMPLOYEES_VESTING_TOKENS);
        token.safeTransfer(advisorsVesting, ADVISORS_VESTING_TOKENS);
    }

    /**
     * @dev release time-locked tokens
     */
    function releaseLockPatterns() public {
        patternsTimelock.release();
    }

    function releaseLockCompany() public {
        companyTimelock.release();
    }

    /**
     * @dev release vesting tokens
     */
    function releaseVestingEmployees() public {
        employeesVesting.release(token);
    }

    function releaseVestingAdvisors() public {
        advisorsVesting.release(token);
    }

    /**
     * @dev revoke vesting tokens
     */
    function revokeVestingEmployees() public onlyOwner {
        employeesVesting.revoke(token);
    }

    function revokeVestingAdvisors() public onlyOwner {
        advisorsVesting.revoke(token);
    }
}
