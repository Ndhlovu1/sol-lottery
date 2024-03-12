const HDWalletProvider = require('@truffle/hdwallet-provider');
const { Web3 } = require('web3');
const { interface, bytecode } = require('./compile');
const ganache = require('ganache')

const provider = new HDWalletProvider(
   //Test Account
    "shiver cancel mechanic divorce crowd foam guess shrug give video clip still",
    //Infura API
    "https://sepolia.infura.io/v3/0eadc5b550dd46ceb632e6dfdc913c85"
);
const web3 = new Web3(provider);

const deploy = async () => {
  const accounts = await web3.eth.getAccounts();

  console.log('Attempting to deploy from account', accounts[0]);

  const result = await new web3.eth.Contract(JSON.parse(interface))
    .deploy({ data: bytecode })
    .send({ gas: '1000000', from: accounts[0] });

  console.log(interface);
  console.log("Contract deployed to", result.options.address);
  provider.engine.stop();
};
deploy();
