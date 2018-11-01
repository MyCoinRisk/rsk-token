var RSKToken = artifacts.require("./RSKToken.sol");
var RSKVestedToken = artifacts.require("./RSKVestedToken.sol")

module.exports = function(deployer, network, accounts) {
  deployer.deploy(RSKToken);
  deployer.deploy(RSKVestedToken);
};

