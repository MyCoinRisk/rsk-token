var RSKToken = artifacts.require("./RSKToken.sol");
var RSKVestedToken = artifacts.require("./RSKVestedToken.sol")

module.exports = function(deployer, network, accounts) {

    deployer.deploy(RSKToken);
    deployer.deploy(RSKVestedToken);



    // const amount = 10000 * 1e18;
    // const amount = 10000;
    // const beneficiary = accounts[1];
    // const start = 1450656000;
    //
    // deployer.deploy(RSKToken)
    //     .then(() => {
    //         const rskToken = RSKToken.at(RSKToken.address);
    //         console.log("rskToken:", rskToken.address);
    //         return deployer.deploy(TokenTimelock, rskToken.address, beneficiary, start);
    //     })
    //     .then((t) => {
    //         const rskToken = RSKToken.at(RSKToken.address);
    //         console.log("tokenTimelock: ", t.address);
    //         rskToken.transfer(t.address, amount);
    //         return rskToken.balanceOf(t.address);
    //     }).then((v) => {
    //         console.log("TokenTimelock:", v);
    //         deployer.deploy(RSKVestedToken);
    //     });

};

