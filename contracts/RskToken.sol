pragma solidity ^0.4.24;

import "openzeppelin-solidity/contracts/token/ERC20/ERC20Detailed.sol";
import "openzeppelin-solidity/contracts/token/ERC20/ERC20Capped.sol";

contract RskToken is ERC20Capped, ERC20Detailed {
    string private constant _name = "MyCoinRisk";
    string private constant _symbol = "RSK";
    uint8 private constant _decimals = 18;

    constructor(
        uint256 _cap
    )
    ERC20Detailed(_name, _symbol, _decimals)
    ERC20Capped(_cap)
    public { }

}
