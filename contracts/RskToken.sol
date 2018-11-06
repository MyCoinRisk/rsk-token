pragma solidity ^0.4.24;

import "openzeppelin-solidity/contracts/token/ERC20/ERC20Detailed.sol";
import "openzeppelin-solidity/contracts/token/ERC20/ERC20.sol";

contract RskToken is ERC20, ERC20Detailed {
    string public constant name = "RSKToken";
    string public constant symbol = "RSK";
    uint256 public constant decimals = 18;

    constructor(uint256 _cap) public ERC20Detailed(name, symbol, decimals) {
        require(_cap > 0);
        _mint(msg.sender, _cap);
    }

}
