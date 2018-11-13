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

    // Issue Token start time
    uint64 public startTime;

    // TokenVesting
    TokenVesting[10] public employeesVesting;
    TokenVesting[9] public advisorsVesting;

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

        // Genesis allocation of tokens
        token.safeTransfer(FOUNDATION_POOL_ADDR, FOUNDATION_POOL_TOKENS);
        token.safeTransfer(COMPANY_POOL_ADDR, COMPANY_POOL_TOKENS);
    }

    /**
     * @dev init transfer
     * @param _tos address[] The address array which the tokens will be transferred to.
     * @param _vals uint256[] The amount of tokens to be transferred
     */
    function initTransfer(address[] _tos, uint256[] _vals) onlyOwner public {
        require(_tos.length > 0);
        require(_tos.length == _vals.length);

        // Transfer
        for(uint256 i = 0; i < _tos.length; i++) {
            token.safeTransfer(_tos[i], _vals[i]);
        }
    }
    /**
     * @dev Init employeesVesting
     * @param _tos address[]
     * @param _vals uint256[]
     */
    function initEmployeesVesting(address[] _tos, uint256[] _vals) onlyOwner public {
        require(_tos.length > 0);
        require(_tos.length == _vals.length);
        for(uint256 i = 0; i < employeesVesting.length; i++) {
            employeesVesting[i] = createEmployeeVesting(_tos[i], _vals[i]);
        }
    }

    function releaseEmployeeVesting(uint256 vestId) public {
        require(vestId > 0 && vestId < employeesVesting.length);
        TokenVesting vesting = employeesVesting[vestId];
        vesting.release(token);
    }

    function revokeEmployeeVesting(uint256 vestId) onlyOwner public {
        require(vestId > 0 && vestId < employeesVesting.length);
        TokenVesting vesting = employeesVesting[vestId];
        // Token of vesting will return to owner() of vesting contract
        vesting.revoke(token);
    }


    function createEmployeeVesting(address _beneficiary, uint256 _amount) internal returns (TokenVesting _vesting) {
        _vesting = new TokenVesting(_beneficiary, startTime, ONE_YEAR_PERIOD, 4 * ONE_YEAR_PERIOD, true);
        // TODO For revoke ?
        _vesting.transferOwnership(owner());

        token.safeTransfer(_vesting, _amount);
    }

    /**
     * @dev advisorsVesting
     *
     */
    function initAdvisorsVesting(address[] _tos, uint256[] _vals) onlyOwner public {
        require(_tos.length > 0);
        require(_tos.length == _vals.length);
        for (uint256 i = 0; i < advisorsVesting.length; i++) {
            advisorsVesting[i] = createAdvisorVesting(_tos[i], _vals[i]);
        }
    }

    function releaseAdvisorVesting(uint256 vestId) public {
        require(vestId > 0 && vestId < advisorsVesting.length);
        TokenVesting vesting = advisorsVesting[vestId];
        vesting.release(token);
    }

    function revokeAdvisorVesting(uint256 vestId) onlyOwner public {
        require(vestId > 0 && vestId < advisorsVesting.length);
        TokenVesting vesting = advisorsVesting[vestId];
        // Token of vesting will return to owner() of vesting contract
        vesting.revoke(token);
    }

    function createAdvisorVesting(address _beneficiary, uint256 _amount) internal returns (TokenVesting _vesting) {
        _vesting = new TokenVesting(_beneficiary, startTime, ONE_QUATER_PERIOD, 2 * ONE_YEAR_PERIOD, true);
        // TODO For revoke
        _vesting.transferOwnership(owner());

        token.safeTransfer(_vesting, _amount);
    }
}
