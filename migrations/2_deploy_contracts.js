var RskCrowdsale = artifacts.require("./RskCrowdsale.sol");

module.exports = function(deployer, network, accounts) {
    deployer.deploy(RskCrowdsale, Date.now());
};