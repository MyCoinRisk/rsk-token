pragma solidity ^0.4.23;
import "zeppelin/token/StandardToken.sol";


contract RSKToken is StandardToken {

    string public constant name = "RSKCoin";
    string public constant symbol = "RSK";

    uint8 public constant decimals = 18;

    uint256 public constant INITIAL_SUPPLY = 2000000000 * (10 ** uint256(decimals));

    /**
     * Constructor that gives msg.sender all of existing tokens
     */
    constructor() public {
        totalSupply = INITIAL_SUPPLY;
        balances[msg.sender] = INITIAL_SUPPLY;
    }
//    function RSKToken() public {
//    }

}

