var RSKToken = artifacts.require("./RSKToken.sol");

module.exports = function(deployer, network, accounts) {
  return deployer.deploy(RSKToken);
};

