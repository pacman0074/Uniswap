const { ChainId, Token, WETH, Fetcher, Trade, Route, TokenAmount, TradeType , Percent } = require('@uniswap/sdk');
require('dotenv').config();
const ethers = require('ethers');


const swap = async() => {
const DAI = new Token(ChainId.MAINNET, '0x4F96Fe3b7A6Cf9725f59d353F723c1bDb64CA6Aa', 18)

// note that you may want/need to handle this async code differently,
// for example if top-level await is not an option
const pair = await Fetcher.fetchPairData(DAI, WETH[DAI.chainId])

const route = new Route([pair], WETH[DAI.chainId])

const amountIn = '1076001638659' // 1 WETH

const trade = new Trade(route, new TokenAmount(WETH[DAI.chainId], amountIn), TradeType.EXACT_INPUT)

const slippageTolerance = new Percent('50', '10000') // 50 bips, or 0.50%

const amountOutMin = trade.minimumAmountOut(slippageTolerance).raw // needs to be converted to e.g. hex
const path = [WETH[DAI.chainId].address, DAI.address]
const to = '0xA03200d73B5cC70EB0975F6bEcd21bDFD9F3f983' // should be a checksummed recipient address
const deadline = Math.floor(Date.now() / 1000) + 60 * 20 // 20 minutes from the current Unix time
const value = trade.inputAmount.raw // // needs to be converted to e.g. hex

const provider = ethers.getDefaultProvider('http://localhost:8545', {
    infura: '8235e88771864d7a8b201b72fba8a130'
   }); // utilisation du provider infura https://kovan.infura.io/v3/8235e88771864d7a8b201b72fba8a130 effectuer une transaction  

console.log("tototototototot")
const signer = new ethers.Wallet(process.env.PRIVATEKEY); // récupérer son wallet grâce au private key
const account = signer.connect(provider); // récupérer l’account qui va effectuer la transaction 

const abi = [{"inputs":[{"internalType":"uint256","name":"amountOutMin","type":"uint256"},{"internalType":"address[]","name":"path","type":"address[]"},{"internalType":"address","name":"to","type":"address"},{"internalType":"uint256","name":"deadline","type":"uint256"}],"name":"swapExactETHForTokens","outputs":[{"internalType":"uint256[]","name":"amounts","type":"uint256[]"}],"stateMutability":"payable","type":"function"}]

const contractUniswap = new ethers.Contract('0x7a250d5630B4cF539739dF2C5dAcb4c659F2488D', abi, account)

const Tx = await contractUniswap.swapExactETHForTokens(String(amountOutMin), path, to , deadline , { value : 5, gasPrice: 20e9, gasLimit: 250000 });

console.log(`Transaction hash: ${Tx.hash}`); // afficher le hash de la transaction 
 
const receipt = await Tx.wait(); // récupérer la transaction receipt 
console.log(`Transaction was mined in block ${receipt.blockNumber}`);

}

swap();