pragma solidity ^0.4.23;

import "zeppelin/token/VestedToken.sol";

contract RSKToken is VestedToken {
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
}

