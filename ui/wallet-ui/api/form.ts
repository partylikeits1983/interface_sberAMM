const ethers = require('ethers');
const { parseUnits } = require('ethers/lib/utils');
import { CreateMatchType } from './types';

const AMM_ABI = require('../../../contract-abi/SberAMM.json');

import alertWarningFeedback from '#/ui/alertWarningFeedback';
import alertSuccessFeedback from '#/ui/alertSuccessFeedback';

import detectEthereumProvider from '@metamask/detect-provider';

interface ContractAddress {
  network: string;
  chainID: number;
  owner: string;
  dividendToken: string;
  splitter: string;
  AMM: string;
}

interface PoolData {
  token0: string;
  token1: string;
  amount0: number;
  amount1: number;
  totalShares: number;
  isStable: boolean;
  fee0: number;
  fee1: number;
  feeRate: number;
}

const data: ContractAddress = require('./contractAddresses.json');
const jsonString = JSON.stringify(data); // Convert the object to JSON string
const addresses = JSON.parse(jsonString); // Parse the JSON string

let SberAMMaddress = addresses[0].AMM;
let DividendPayingERC20address = addresses[0].dividendToken;
let SplitterAddress = addresses[0].splitter;

const ERC20ABI = [
  'function transferFrom(address from, address to, uint value)',
  'function transfer(address to, uint value)',
  'function approve(address account, uint amount) returns (bool)',
  'function allowance(address _owner, address _spender) public view returns (uint256 remaining)',
  'function balanceOf(address owner) view returns (uint balance)',
  'event Transfer(address indexed from, address indexed to, address value)',
  'error InsufficientBalance(account owner, uint balance)',
];

const updateContractAddresses = async (): Promise<void> => {
  let { provider } = await setupProvider();

  const network = await provider.getNetwork();
  const chainId = network.chainId;

  const data: ContractAddress[] = require('./contractAddresses.json');
  const addresses: ContractAddress[] = JSON.parse(JSON.stringify(data));

  // Find the matching chain ID in the array of objects
  const matchingChain = addresses.find(
    (address) => address.chainID === chainId,
  );

  if (matchingChain) {
    const { AMM, dividendToken, splitter } = matchingChain;

    // Update the addresses based on the matching chain ID
    SberAMMaddress = AMM;
    DividendPayingERC20address = dividendToken;
    SplitterAddress = splitter;
  }
  // Add more chains if needed.
};

const setupProvider = async () => {
  let provider, signer, accounts, isWalletConnected;
  const detectedProvider = await detectEthereumProvider();

  if (detectedProvider && detectedProvider.isMetaMask) {
    try {
      window.ethereum = detectedProvider;
      provider = new ethers.providers.Web3Provider(window.ethereum);
      signer = provider.getSigner();
      accounts = await provider.listAccounts();
      await provider.send('eth_requestAccounts', []);
      console.log('Web3 provider is set');
      isWalletConnected = true;
    } catch (error) {
      console.error('User rejected the connection request.', error);
      provider = null; // reset provider to null
      signer = null;
      accounts = null;
      isWalletConnected = false;
    }
  }

  // If provider is not set (either window.ethereum is not available or user rejected the connection)
  // then use the custom JSON-RPC provider
  if (!provider) {
    const customRpcUrl = 'https://rpc.ankr.com/polygon_mumbai';
    provider = new ethers.providers.JsonRpcProvider(customRpcUrl);
    signer = provider;
    accounts = undefined;
    isWalletConnected = false;
    console.log('JSON-RPC provider is set - Form.ts');
  }

  return { provider, signer, accounts, isWalletConnected };
};

export const getBalance = async (address: string) => {
  await updateContractAddresses();

  const provider = new ethers.providers.Web3Provider(window.ethereum);
  const signer = provider.getSigner();

  const token = new ethers.Contract(address, ERC20ABI, signer);

  try {
    const value = await token.balanceOf(address);
    const balance = ethers.utils.formatEther(value);

    return {
      value: balance,
      success: true,
      status: '✅ Check out your transaction on Etherscan',
    };
  } catch (error) {
    return {
      success: false,
      // @ts-ignore
      status: '😥 Something went wrong: ' + error.message,
    };
  }
};

export const Approve = async (tokenAddress: string, amount: number) => {
  await updateContractAddresses();

  const provider = new ethers.providers.Web3Provider(window.ethereum);
  const signer = provider.getSigner();
  const accounts = await provider.send('eth_requestAccounts', []);

  const token = new ethers.Contract(tokenAddress, ERC20ABI, signer);

  try {
    // @dev amount.toSting() was a nightmare bug to find...
    const value = await token.approve(SberAMMaddress, amount.toString());
    const allowance = await token.allowance(accounts[0], SberAMMaddress);

    alert('Success! allowance set: ' + allowance);

    return {
      value: value,
      success: true,
      status: '✅ Check out your transaction on Etherscan',
    };
  } catch (error) {
    return {
      success: false,
      // @ts-ignore
      status: '😥 Something went wrong: ' + error.message,
    };
  }
};

export const GetPoolData = async () => {
  await updateContractAddresses();

  const provider = new ethers.providers.Web3Provider(window.ethereum);
  const signer = provider.getSigner();
  // const accounts = await provider.send('eth_requestAccounts', []);

  const SberAMM = new ethers.Contract(SberAMMaddress, AMM_ABI, signer);

  const AllPoolData: PoolData[] = [];

  try {
    const PIDs = await SberAMM.PIDs();

    // const AllPoolData: PoolData[] = [];

    for (let i = 1; i < PIDs; i++) {

      const data = await SberAMM.Pools(i);

      console.log(data);
      const Pool: PoolData = {
        token0: data[0],
        token1: data[1],
        amount0: data[2],
        amount1: data[3],
        totalShares: data[4],
        isStable: data[5],
        fee0: data[6],
        fee1: data[7],
        feeRate: data[8] 
      };

      AllPoolData.push(Pool);
    }
    
    return {
      data: AllPoolData,
      amount: PIDs
    };
  } catch (error) {
    return {
      amount: 0
    };
  }
};


export const DepositLiquidity = async (token0Address: string, token0Amount: number, token1Address: string, token1Amount: number, fee: number, isStable: boolean) => {
  await updateContractAddresses();

  const provider = new ethers.providers.Web3Provider(window.ethereum);
  const signer = provider.getSigner();

  const SberAMM = new ethers.Contract(SberAMMaddress, AMM_ABI, signer);

  const PID = await SberAMM.getPool(token0Address, token1Address, fee);

  console.log(PID);


  try {

    if (PID == 0) {
      // create pair because it doesn't exist
      const newPID = await SberAMM.createPair(token0Address, token1Address, fee, isStable);
      await SberAMM.deposit(newPID, token0Amount, token1Amount);

    } else {

      await SberAMM.deposit(PID, token0Amount, token1Amount);
    }


    return {
      status: true
    };
  } catch (error) {
    return {
      status: false
    };
  }
};

