pragma solidity ^0.4.23;

import "truffle/Assert.sol";
import "truffle/DeployedAddresses.sol";
import "../contracts/RSKToken.sol";

contract TestRSKToken {
    RSKToken rskToken = RSKToken(DeployedAddresses.RSKToken());
    uint256 public constant INITIAL_SUPPLY = 20000 * (10 ** uint256(18));


    function testRSKToken() public {
        address owner = rskToken.owner();

        Assert.equal(INITIAL_SUPPLY, rskToken.balanceOf(owner), "should be equal");

    }

}
