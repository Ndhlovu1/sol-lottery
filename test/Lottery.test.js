const ganache = require('ganache');
const { Web3 } = require('web3');
// updated imports added for convenience
const assert = require('assert');
const web3 = new Web3(ganache.provider())

const { interface, bytecode } = require('../compile');

let lottery;
let accounts;

beforeEach(async () => {

    accounts = await web3.eth.getAccounts();

    lottery = await new web3.eth.Contract(JSON.parse(interface))
        .deploy({ data: bytecode })
        .send({ from: accounts[0], gas: '1000000' })
});

describe('Lottery Contract', () => {

    it('deploys a contract', () => {
        assert.ok(lottery.options.address)
    })

    it('One Account', async () => {

        await lottery.methods.enter().send({
            from : accounts[0],
            value : web3.utils.toWei('0.02', 'ether')
        })

         //Attempt to call player methoid to get the list of players
        const players = await lottery.methods.getPlayers().call({
            from: accounts[0]
        })

        //Ensure
        assert.equal(accounts[0], players[0])
        assert.equal(1, players.length)

    })

    it('Multiple Accounts', async () => {

        await lottery.methods.enter().send({
            from : accounts[0],
            value : web3.utils.toWei('0.02', 'ether')
        })

        await lottery.methods.enter().send({
            from : accounts[1],
            value : web3.utils.toWei('0.02', 'ether')
        })

        await lottery.methods.enter().send({
            from : accounts[2],
            value : web3.utils.toWei('0.02', 'ether')
        })

        const players = await lottery.methods.getPlayers().call({
            from : accounts[0]
        })

        assert.equal(accounts[0], players[0])
        assert.equal(accounts[1], players[1])
        assert.equal(accounts[2], players[2])

    })

    //Verify that the user enters the correct ammount
    it ('Minimum Amount to of Ether', async () => {
        try{
            await lottery.methods.enter().send({
                from: accounts[0],
                value : 0
            })
            //Make this test fail
            assert(false)
        }
        catch (error) {
            assert(error)
        }

    })

    //Test the Pick Winner()
    it('Only Manager Selects Winner', async () => {
        try{
            await lottery.methods.pickWinner().send({
                from: accounts[1],
            })
            assert(false)
        }
        catch (err){
            assert(err)
        }
    })

    //Overal Test that does it all at once
    it('Sends Money to Winner & Resets', async () => {
        try{
            await lottery.methods.enter().send({
                from : accounts[0],
                value : web3.utils.toWei('2','ether')
            })

            const initBal = await web3.eth.getBalance(accounts[0]) //Returns value of the ether

            await lottery.methods.pickWinner().send({
                from: accounts[0]
            })

            const finalBal = await web3.eth.getBalance(accounts[0])

            const dif = finalBal - initBal
            //console.log(finalBal - initBal)
            assert(dif > web3.utils.toWei('1.8', 'ether')
                
            )

        }
        catch(error){
            assert(error)
        }


    })

   
})

