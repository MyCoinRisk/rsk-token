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
    address public constant EMPLOYEES_VESTING_ADDR = 0x91e16D8aB6BeD42142Dcc356fC0cb03AB6D69E1d;
    address public constant ADVISORS_VESTING_ADDR = 0x0f9F21eb88B651cB8ce901c36d34A76B62E74349;
    address public constant PATTERNS_LOCK_ADDR = 0xFA845C887943AB644876a6096da79A979eEEcC34;
    address public constant COMPANY_LOCK_ADDR = 0x21E47C795Ca033cE98AD4Eea203844ca036786D9;
    address public constant FOUNDATION_POOL_ADDR = 0xB997088DbED10a4281b38D7616b56Fcc6739DAc3;

    // 3 month period, in seconds
    uint64 public constant ONE_QUATER_PERIOD = 7776000;
    // 1 yr(365 days) period, in seconds
    uint64 public constant ONE_YEAR_PERIOD = 31536000;
}
