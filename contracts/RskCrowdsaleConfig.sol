pragma solidity ^0.4.24;

/**
 * @title RskCrowdsaleConfig
 * @dev Holds all constants for RskCrowdSale contract
*/
contract RskCrowdsaleConfig {
    uint256 public constant TOKEN_DECIMALS = 18;
    uint256 public constant MIN_TOKEN_UNIT = 10 ** uint256(TOKEN_DECIMALS);

    // Initial distribution amounts
    uint256 public constant TOTAL_SUPPLY_CAP = 20 * 1000 * 1000 * 1000 * MIN_TOKEN_UNIT;

    // 7.5%
    uint256 public constant PATTERNS_LOCK_TOKENS = 1.5 * 1000 * 1000 * 1000 * MIN_TOKEN_UNIT;
    // 12.0%
    uint256 public constant COMPANY_LOCK_TOKENS = 2.4 * 1000 * 1000 * 1000 * MIN_TOKEN_UNIT;
    // 15.0%
    uint256 public constant EMPLOYEES_VESTING_TOKENS = 3 * 1000 * 1000 * 1000 * MIN_TOKEN_UNIT;
    // 5.5%
    uint256 public constant ADVISORS_VESTING_TOKENS = 1.1 * 1000 * 1000 * 1000 * MIN_TOKEN_UNIT;
    // 60.0%
    uint256 public constant FOUNDATION_POOL_TOKENS = 12 * 1000 * 1000 * 1000 * MIN_TOKEN_UNIT;

    // Contract wallet addresses for initial allocation
    // TODO: only for testing, need config correct address when deploy into eth
    address public constant EMPLOYEES_VESTING_ADDR = 0x5Db5F81a812332be866757cEE16a2600bc884cd7;
    address public constant ADVISORS_VESTING_ADDR = 0xb054649d2c1B357449644dC384D55750E5Cd0f35;
    address public constant PATTERNS_LOCK_ADDR = 0x16487552efDedd6b417D760e63E2E0e83aac6435;
    address public constant COMPANY_LOCK_ADDR = 0x113603907Bd7088e520eCF8D3a9Dd60FdD12622C;
    address public constant FOUNDATION_POOL_ADDR = 0x17817f0131ef31aeDdC0C727f934AD27cC18e812;

    // 3 month period, in seconds
    uint64 public constant ONE_QUATER_PERIOD = 7776000;
    // 1 yr(365 days) period, in seconds
    uint64 public constant ONE_YEAR_PERIOD = 31536000;
}
