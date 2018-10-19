var RSKToken = artifacts.require("./RSKToken.sol");

module.exports = function(deployer, network, accounts) {
  return deployer.deploy(RSKToken);
};

// module.exports = function(deployer, network, accounts) {
//   return deployer.deploy(RSKToken)
//   .then(function(instance) {
//     const _values = [];
//     const _tos = [];

//     for(let i = 0; i < accounts.length/2; i++){
//       _values.push( (i%2 + 1) * 100);
//       _tos.push(accounts[i+1]);
//     }
    
//     // web3.utils.toWei(1000, 'ether'),
//     // test batchTransfer 
//     //instance.batchTransfer(_tos, _values);
//     // test Vesting
//     instance.grantVestedTokens(
//       accounts[5], 
//       1000 * 1000000000000000000,
//       1450656000,
//       1482192000,
//       1576800000,
//       true,
//       false
//     );

//     return instance;
//     // return instance.batchTransfer(accounts);
//   })
//   .then(function(instance){
//     return instance.transferableTokens(accounts[5], Math.round(new Date().getTime() / 1000));
//   })
//   .then(function(value) {
//     console.log('-----------');
//     console.log(value.toNumber());
//   });

//   // RSKToken.deployed().then(function(instance) {
//   //   return instance.totalSupply;
//   // });

// };
