pragma solidity ^0.4.23;

import "../../contracts/RSKVestedToken.sol";

contract RSKVestedTokenMock is RSkVestedToken {
    constructor(address initialAccount, uint initialBalance) public {
        balances[initialAccount] = initialBalance;
        totalSupply = initialBalance;
    }
}
