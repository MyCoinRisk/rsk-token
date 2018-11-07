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
    address public constant EMPLOYEES_VESTING_ADDR = 0xB2342413987FcC8381278DA88BD6c2121D40Cb12;
    address public constant ADVISORS_VESTING_ADDR = 0xD1218079b0614d798C1f6EBe0112eB9C44823525;
    address public constant PATTERNS_LOCK_ADDR = 0x76721FE8142CA9c4611b6390996D3Ac91b0d29FA;
    address public constant COMPANY_LOCK_ADDR = 0xC1De6631f470ff22740a6b89b1244E79C23c096c;
    address public constant FOUNDATION_POOL_ADDR = 0x642cb9F7169eb5C2056c8CbF874655D2a5cA4688;

    // 3 month period, in seconds
    uint64 public constant ONE_QUATER_PERIOD = 7776000;
    // 1 yr(365 days) period, in seconds
    uint64 public constant ONE_YEAR_PERIOD = 31536000;
}
