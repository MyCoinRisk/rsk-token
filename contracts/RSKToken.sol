pragma solidity ^0.4.23;

import "zeppelin/token/VestedToken.sol";
import "zeppelin/ownership/Ownable.sol";

contract RSKToken is VestedToken, Ownable {
    string public constant name = "RSKCoin";
    string public constant symbol = "RSK";
    uint8 public constant decimals = 18;

    uint256 public constant INITIAL_SUPPLY = 20000 * (10 ** uint256(decimals));


    /**
     * Constructor that gives msg.sender all of existing tokens
     */
    function RSKToken() {
        totalSupply = INITIAL_SUPPLY;
        balances[msg.sender] = INITIAL_SUPPLY;
    }

    /**
     * @dev Batch transfer
     * @param _tos address The address array which the tokens will be transfered to.
     * @param _vals uint256 The amount of tokens to be transfered.
     */
    function batchTransfer(address[] _tos, uint256[] _vals) onlyOwner public returns (bool) {
        require(_tos.length > 0);
        require(_tos.length == _vals.length);

        // Transfer
        for(uint256 i = 0; i < _tos.length; i++) {
            if (_vals[i] > 0) {
                transfer(_tos[i], _vals[i]);
            }
        }
        return true;
    }
}

