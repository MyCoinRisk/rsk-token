pragma solidity ^0.4.24;

import "openzeppelin-solidity/contracts/ownership/Ownable.sol";
import "openzeppelin-solidity/contracts/math/SafeMath.sol";
import "openzeppelin-solidity/contracts/token/ERC20/TokenTimelock.sol";
import "openzeppelin-solidity/contracts/drafts/TokenVesting.sol";
import "openzeppelin-solidity/contracts/math/Math.sol";
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

    // Issue Token start time
    uint64 public startTime;

    // TokenVesting
    TokenVesting[10] public employeesVesting;
    TokenVesting[10] public advisorsVesting;

    modifier verifyEmployeeIdx(uint256 idx) {
        require(idx >= 0 && idx < employeesVesting.length);
        _;
    }

    modifier verifyAdvisorIdx(uint256 idx) {
        require(idx >= 0 && idx < advisorsVesting.length);
        _;
    }


    /**
     * @dev RSKTokenAllocate contract constructor
     * @param _startTime - Unix timestamp representing
     */
    constructor(
        uint64 _startTime
    )
    public {
        require(_startTime >= now);

        startTime = _startTime;

        // mints all possible tokens to crowdsale contract
        token = new RskToken(TOTAL_SUPPLY_CAP);
        token.mint(address(this), TOTAL_SUPPLY_CAP);
    }

    /**
     * @dev batch transfer
     * @param _tos address[] The address array which the tokens will be transferred to.
     * @param _vals uint256[] The amount of tokens to be transferred
     */
    function batchTransfer(address[] _tos, uint256[] _vals) onlyOwner public {
        require(_tos.length > 0);
        require(_tos.length == _vals.length);

        // Transfer
        for(uint256 i = 0; i < _tos.length; i++) {
            token.safeTransfer(_tos[i], _vals[i] * MIN_TOKEN_UNIT);
        }
    }

    /**
     * @dev Init EmployeesVesting
     * @param _tos address[] The address array which the tokens will be vested;
     * @param _vals uint256[] The amount of tokens to be vested
     */
    function initEmployeesVesting(address[] _tos, uint256[] _vals) onlyOwner public {
        require(_tos.length > 0);
        require(_tos.length == _vals.length);
        uint256 length = Math.min(_tos.length, employeesVesting.length);
        for(uint256 i = 0; i < length; i++) {
            employeesVesting[i] = createEmployeeVesting(_tos[i], _vals[i] * MIN_TOKEN_UNIT);
        }
    }

    /**
     * @dev Init AdvisorsVesting
     * @param _tos address[] The address array which the tokens will be vested;
     * @param _vals uint256[] The amount of tokens to be vested
     */
    function initAdvisorsVesting(address[] _tos, uint256[] _vals) onlyOwner public {
        require(_tos.length > 0);
        require(_tos.length == _vals.length);
        uint256 length = Math.min(_tos.length, advisorsVesting.length);
        for (uint256 i = 0; i < length; i++) {
            advisorsVesting[i] = createAdvisorVesting(_tos[i], _vals[i] * MIN_TOKEN_UNIT);
        }
    }

    /**
     * @dev Release Employee Vesting By _vestId
     * @param _vestId The vestId of employee vesting
     */
    function releaseEmployeeVesting(uint256 _vestId) verifyEmployeeIdx(_vestId) public {
        TokenVesting vesting = employeesVesting[_vestId];
        vesting.release(token);
    }

    /**
     * @dev Revoke Employee Vesting By _vestId
     * @param _vestId The vestId of employee vesting
     */
    function revokeEmployeeVesting(uint256 _vestId) verifyEmployeeIdx(_vestId) onlyOwner public {
        TokenVesting vesting = employeesVesting[_vestId];
        // Token of vesting will return to owner() of vesting contract
        vesting.revoke(token);
    }

    /**
     * @dev Release Advisor Vesting By _vestId
     * @param _vestId The vestId of employee vesting
     */
    function releaseAdvisorVesting(uint256 _vestId) verifyAdvisorIdx(_vestId) public {
        TokenVesting vesting = advisorsVesting[_vestId];
        vesting.release(token);
    }

    /**
     * @dev Revoke Employee Vesting By _vestId
     * @param _vestId The vestId of employee vesting
     */
    function revokeAdvisorVesting(uint256 _vestId) verifyAdvisorIdx(_vestId) onlyOwner public {
        TokenVesting vesting = advisorsVesting[_vestId];
        // Token of vesting will return to owner() of vesting contract
        vesting.revoke(token);
    }

    /**
     * @dev Create Employee Vesting
     * @param _beneficiary The beneficiary of vesting
     * @param _amount The amount of tokens
     */
    function createEmployeeVesting(address _beneficiary, uint256 _amount) internal returns (TokenVesting) {
        TokenVesting vesting = new TokenVesting(_beneficiary, startTime, ONE_YEAR_PERIOD, 4 * ONE_YEAR_PERIOD, true);
        token.safeTransfer(vesting, _amount);
        return vesting;
    }

    /**
     * @dev Create Advisor Vesting
     * @param _beneficiary The beneficiary of vesting
     * @param _amount The amount of tokens
     */
    function createAdvisorVesting(address _beneficiary, uint256 _amount) internal returns (TokenVesting) {
        TokenVesting vesting = new TokenVesting(_beneficiary, startTime, ONE_QUATER_PERIOD, 2 * ONE_YEAR_PERIOD, true);
        token.safeTransfer(vesting, _amount);
        return vesting;
    }

    function getEmployeeVesting(uint256 _vestId) verifyEmployeeIdx(_vestId) public view returns (TokenVesting) {
        return employeesVesting[_vestId];
    }

    function getAdvisorVesting(uint256 _vestId) verifyAdvisorIdx(_vestId) public view returns (TokenVesting) {
        return advisorsVesting[_vestId];
    }
}
