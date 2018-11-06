pragma solidity ^0.4.24;

import "openzeppelin-solidity/contracts/token/ERC20/ERC20Detailed.sol";
import "openzeppelin-solidity/contracts/token/ERC20/ERC20.sol";

contract RskToken is ERC20, ERC20Detailed {
    string public constant _name = "RSKToken";
    string public constant _symbol = "RSK";
    uint8 public constant _decimals = 18;

    constructor(uint256 _cap) public ERC20Detailed(_name, _symbol, _decimals) {
        require(_cap > 0);
        _mint(msg.sender, _cap);
    }

}
