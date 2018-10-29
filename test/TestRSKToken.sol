pragma solidity ^0.4.23;

import "truffle/Assert.sol";
import "truffle/DeployedAddresses.sol";
import "../contracts/RSKToken.sol";

contract TestRSKToken {

    function testInitialBalanceUsingDeployedContract() {
        RSKToken rskToken = RSKToken(DeployedAddresses.RSKToken());

        uint256 expected = 20000 * (10 ** uint256(18));
        Assert.equal(rskToken.balanceOf(tx.origin), expected, "Owner should have 20000 * 10^18 RSKCoin initially");
    }

    function testInitialBalanceWithNewMetaCoin() {
        RSKToken rskToken = new RSKToken();

        uint256 expected = 20000 * (10 ** uint256(18));

        Assert.equal(rskToken.balanceOf(tx.origin), expected, "Owner should have 20000 * 10^18 RSKCoin initially");
    }



}
