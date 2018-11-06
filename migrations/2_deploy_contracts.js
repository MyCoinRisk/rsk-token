var RskCrowdsaleConfig = artifacts.require("./RskCrowdsaleConfig.sol");
var RskToken = artifacts.require("./RskToken.sol");
var RskCrowdsale = artifacts.require("./RskCrowdsale.sol");

module.exports = function(deployer, network, accounts) {
    deployer.deploy(RskCrowdsaleConfig);
    deployer.deploy(RskToken);
    deployer.deploy(RskCrowdsale);
};