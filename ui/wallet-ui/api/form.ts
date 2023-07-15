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
  PID: number;
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

    for (let i = 1; i <= PIDs; i++) {
      const data = await SberAMM.Pools(i);

      const Pool: PoolData = {
        PID: i,
        token0: data[0],
        token1: data[1],
        amount0: Number(ethers.utils.formatEther(data[2])),
        amount1: Number(ethers.utils.formatEther(data[3])),
        totalShares: Number(ethers.utils.formatEther(data[4])),
        isStable: Boolean(data[5]),
        fee0: Number(ethers.utils.formatEther(data[6])),
        fee1: Number(ethers.utils.formatEther(data[7])),
        feeRate: Number(ethers.utils.formatEther(data[8])),
      };

      AllPoolData.push(Pool);
    }

    console.log(AllPoolData)
    return {
      data: AllPoolData,
      amount: PIDs,
    };
  } catch (error) {
    return {
      data: [],
      amount: 0,
    };
  }
};

interface FormInputs {
  token0: string;
  token1: string;
  amount0: number;
  amount1: number;
  fee: number;
  isStable: boolean;
}

export const DepositLiquidity = async (inputs: FormInputs) => {
  await updateContractAddresses();

  const provider = new ethers.providers.Web3Provider(window.ethereum);
  const signer = provider.getSigner();

  const SberAMM = new ethers.Contract(SberAMMaddress, AMM_ABI, signer);

  const addressToken0 = inputs.token0;
  const addressToken1 = inputs.token1;
  const amount0 = ethers.utils.parseUnits(inputs.amount0.toString(), 18);
  const amount1 = ethers.utils.parseUnits(inputs.amount1.toString(), 18);
  const fee = ethers.utils.parseUnits(inputs.fee.toString(), 18);
  const isStable = inputs.isStable;

  const PID = await SberAMM.getPool(
    addressToken0,
    addressToken1,
    fee,
    isStable,
  );

  console.log('PID');
  console.log(PID);
  console.log(SberAMMaddress);

  try {
    if (PID == 0) {
      alert('creating new pair');
      // create pair because it doesn't exist
      const newPID = await SberAMM.createPair(
        addressToken0,
        addressToken1,
        fee,
        isStable,
      );
      await newPID.wait();

      const tx = await SberAMM.deposit(PID, amount0, amount1);
      await tx.wait();
    } else {
      const tx = await SberAMM.deposit(PID, amount0, amount1);
      await tx.wait();
    }

    return {
      status: true,
    };
  } catch (error) {
    return {
      status: false,
    };
  }
};

interface LiquidityPosition {
  PID: number;
  token0: string;
  token1: string;
  poolBalance0: number;
  poolBalance1: number;
  userBalance0: number;
  userBalance1: number;
  userFees0: number;
  userFees1: number;
  poolFeeRate: number;
  isStable: boolean;
}

export const ViewLiquidityPositions = async () => {
  await updateContractAddresses();

  const provider = new ethers.providers.Web3Provider(window.ethereum);
  const signer = provider.getSigner();
  const signerAddress = await signer.getAddress();

  const SberAMM = new ethers.Contract(SberAMMaddress, AMM_ABI, signer);

  const PID = Number(await SberAMM.PIDs());

  console.log('PID', PID);

  try {
    const Positions: LiquidityPosition[] = [];

    for (let i = 1; i <= PID; i++) {
      console.log(signerAddress);
      const PoolShareData = Number(await SberAMM.PoolShares(signerAddress, i));

      console.log('poolsharedata', PoolShareData);

      if (PoolShareData != 0) {
        const PoolData = await SberAMM.Pools(i);
        const UserBalance = await SberAMM.withdrawPreview(i);

        console.log('PoolData', PoolData);
        console.log('userbalance ', UserBalance);

        const UserFeesToken0 = await SberAMM.viewEarnedFees(i, PoolData[0]);
        const UserFeesToken1 = await SberAMM.viewEarnedFees(i, PoolData[1]);

        const Position: LiquidityPosition = {
          PID: i,
          token0: PoolData[0],
          token1: PoolData[1],
          poolBalance0: PoolData[2],
          poolBalance1: PoolData[3],
          userBalance0: UserBalance[0],
          userBalance1: UserBalance[1],
          userFees0: UserFeesToken0,
          userFees1: UserFeesToken1,
          poolFeeRate: PoolData[8],
          isStable: PoolData[5],
        };

        Positions.push(Position);
      }
      console.log('HERE');
      console.log(Positions);
    }

    return {
      Positions,
    };
  } catch (error) {
    return {
      status: false,
    };
  }
};

interface SwapInputs {
  token0: string;
  token1: string;
  amountToken0: number;
  isStable: boolean;
  poolFee: number;
  maxSlippage: number;
}
// token0Address: String, token1Address: String, token0Amount: Number, fee: Number, isStable: Boolean, maxSlippage: Number
export const ExecuteSwap = async (input: SwapInputs) => {
  await updateContractAddresses();

  const provider = new ethers.providers.Web3Provider(window.ethereum);
  const signer = provider.getSigner();

  const SberAMM = new ethers.Contract(SberAMMaddress, AMM_ABI, signer);


  const token0 = input.token0;
  const token1 = input.token1;
  const amountToken0 = input.amountToken0;
  const isStable = input.isStable;
  const fee = input.poolFee;
  const maxSlippage = input.maxSlippage;

  const _fee = ethers.utils.parseEther(fee.toString());

  const _slippage = ethers.utils.parseEther(maxSlippage.toString()); // currently not used

  try {
    let PID = 0;

    if (isStable) {
      PID = Number(await SberAMM.getPool(token0, token1, _fee, isStable));
    } else {
      PID = Number(await SberAMM.getPool(token0, token1, _fee, isStable));
    }

    await SberAMM.swap(PID, token0, amountToken0);

    return {
      status: true,
    };
  } catch (error) {
    return {
      status: false,
    };
  }
};

export const EstimateAmountOut = async (input: SwapInputs) => {
  await updateContractAddresses();

  const provider = new ethers.providers.Web3Provider(window.ethereum);
  const signer = provider.getSigner();

  const SberAMM = new ethers.Contract(SberAMMaddress, AMM_ABI, signer);

  const token0 = input.token0;
  const token1 = input.token1;
  const amountToken0 = input.amountToken0;
  const isStable = input.isStable;
  const fee = input.poolFee;
  const maxSlippage = input.maxSlippage;

  const _fee = ethers.utils.parseEther(fee.toString());

  const _slippage = ethers.utils.parseEther(maxSlippage.toString()); // currently not used

  try {
    let PID = 0;

    if (isStable) {
      PID = Number(await SberAMM.getPool(token0, token1, _fee, isStable));
    } else {
      PID = Number(await SberAMM.getPool(token0, token1, _fee, isStable));
    }

    const amountOut = ethers.utils.formatEther(await SberAMM.estimateAmountOut(PID, token0, amountToken0));

    return {
      estimatedOut: amountOut
    };
  } catch (error) {
    return {
      estimatedOut: 0
    };
  }
};
