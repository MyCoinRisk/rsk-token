var RSKToken = artifacts.require("./RSKToken.sol");

module.exports = function(deployer) {

  // issue token 
  deployer.deploy(RSKToken);
  // do vest 

};
