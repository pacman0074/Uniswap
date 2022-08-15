const { ChainId, Token, WETH, Fetcher, Trade, Route, TokenAmount, TradeType , Percent } = require('@uniswap/sdk');
const { BN } = require('@openzeppelin/test-helpers');
require('dotenv').config();
const ethers = require('ethers');


module.exports = async function(done){
const DAI = new Token(ChainId.MAINNET, '0x6B175474E89094C44Da98b954EedeAC495271d0F', 18)


const pair = await Fetcher.fetchPairData(DAI, WETH[DAI.chainId])

const route = new Route([pair], WETH[DAI.chainId])

const amountIn = '1000000000000000000' // 1 WETH

const trade = new Trade(route, new TokenAmount(WETH[DAI.chainId], amountIn), TradeType.EXACT_INPUT)

const slippageTolerance = new Percent('10', '100') // 10 bips, or 0.10%

const amountOutMin = trade.minimumAmountOut(slippageTolerance).raw // needs to be converted to e.g. hex
const path = [WETH[DAI.chainId].address, DAI.address]
const to = '0x70997970C51812dc3A010C7d01b50e0d17dc79C8' // should be a checksummed recipient address
const deadline = Math.floor(Date.now() / 1000) + 60 * 20 // 20 minutes from the current Unix time
const value = trade.inputAmount.raw // // needs to be converted to e.g. hex

const provider = ethers.getDefaultProvider('http://localhost:8545'); // utilisation du provider infura https://kovan.infura.io/v3/8235e88771864d7a8b201b72fba8a130 effectuer une transaction  


const signer = new ethers.Wallet(process.env.PRIVATEKEY); // récupérer son wallet grâce au private key
const account = signer.connect(provider); // récupérer l’account qui va effectuer la transaction 



const abi = [{"inputs":[{"internalType":"uint256","name":"amountOutMin","type":"uint256"},{"internalType":"address[]","name":"path","type":"address[]"},{"internalType":"address","name":"to","type":"address"},{"internalType":"uint256","name":"deadline","type":"uint256"}],"name":"swapExactETHForTokens","outputs":[{"internalType":"uint256[]","name":"amounts","type":"uint256[]"}],"stateMutability":"payable","type":"function"}]

const contractUniswap = new ethers.Contract('0x7a250d5630B4cF539739dF2C5dAcb4c659F2488D', abi, account)

const montant = ethers.BigNumber.from('1000000000000000000');
const Tx = await contractUniswap.swapExactETHForTokens(String(amountOutMin), path, to , deadline , { value : montant, gasPrice: 20e10, gasLimit: 250000 });


console.log(`Transaction hash: ${Tx.hash}`); // afficher le hash de la transaction 
 
const receipt = await Tx.wait(); // récupérer la transaction receipt 
console.log(`Transaction was mined in block ${receipt.blockNumber}`);

done();
}
