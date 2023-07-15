'use client';
import { useState, useEffect } from 'react';
import {
  Box,
  FormControl,
  FormLabel,
  Input,
  Button,
  Stack,
  HStack,
  Spinner,
  ChakraProvider,
  Slider,
  SliderTrack,
  SliderFilledTrack,
  SliderThumb,
  Tooltip,
  Switch,
} from '@chakra-ui/react';

import { InfoOutlineIcon } from '@chakra-ui/icons';

const { ethers } = require('ethers');
const { EstimateAmountOut, ExectuteSwap, Approve } = require('ui/wallet-ui/api/form');

import tokenOptions from './autocomplete-token-options';
import AutocompleteToken from './autocomplete-token';

interface SwapInputs {
  token0: string;
  token1: string;
  amountToken0: number;
  isStable: boolean;
  poolFee: number;
  maxSlippage: number;
}

export default function SwapForm() {
  const [isLoadingApproval, setIsLoadingApproval] = useState(false);
  const [isLoadingCreateWager, setIsLoadingCreateWager] = useState(false);
  const [estimatedAmountOut, setEstimatedAmountOut] = useState(0);

  const HandleClickApprove = async () => {
    setIsLoadingApproval(true);
    await Approve(swapInputs.token0, swapInputs.amountToken0);
    setIsLoadingApproval(false);
  };

  const HandleClickImplementSwap = async () => {
    console.log(swapInputs);
    setIsLoadingCreateWager(true);
    await ExectuteSwap(swapInputs);
    setIsLoadingCreateWager(false);
  };

  const initialSwapInputs = {
    token0: '',
    token1: '',
    amountToken0: 0,
    isStable: false,
    poolFee: 0,
    maxSlippage: 0,
  };
  
  const [swapInputs, setSwapInputs] = useState<SwapInputs>(initialSwapInputs);
  
  const handleInputChange = (event: React.ChangeEvent<HTMLInputElement>): void => {
    const { name, value } = event.target;
    setSwapInputs((prevInputs) => ({
      ...prevInputs,
      [name]: value,
    }));
  };
  
  const HandleEstimateOut = async () => {
    console.log("All inputs have changed ");
    const estimatedOut = await EstimateAmountOut(swapInputs);
    console.log("EstimatedOut", estimatedOut);
  };
  
  useEffect(() => {
    console.log(swapInputs);
    // The check condition can vary based on your requirements. The following is an example.
    const allChanged = Object.entries(swapInputs).every(([key, value]) => value !== initialSwapInputs[key as keyof SwapInputs]);
  
    if (allChanged) {
      HandleEstimateOut();
    }
  }, [swapInputs]);
  
  
  

  const handleSwitchChange = (
    event: React.ChangeEvent<HTMLInputElement>,
  ): void => {
    setSwapInputs((prevInputs) => {
      const updatedInputs = {
        ...prevInputs,
        isStable: event.target.checked,
      };
      console.log(updatedInputs); // log the new state
      return updatedInputs;
    });
  };

  const handleSubmit = (event: React.FormEvent<HTMLFormElement>): void => {
    event.preventDefault();
    console.log(swapInputs);
  };

  const handleSliderChange = (value: number) => {
    setSwapInputs((prevInputs) => ({
      ...prevInputs,
      maxSlippage: value,
    }));
  };

  return (
    <ChakraProvider>
      <Box mx="auto">
        <form onSubmit={handleSubmit}>
          <Stack spacing="4">
            <FormControl>
              <FormLabel>Sell Token</FormLabel>
              <AutocompleteToken
                options={tokenOptions}
                onChange={(value: string) =>
                  setSwapInputs((prevInputs) => ({
                    ...prevInputs,
                    token0: value,
                  }))
                }
              />
            </FormControl>

            <FormControl>
              <FormLabel>Buy Token</FormLabel>
              <AutocompleteToken
                options={tokenOptions}
                onChange={(value: string) =>
                  setSwapInputs((prevInputs) => ({
                    ...prevInputs,
                    token1: value,
                  }))
                }
              />
            </FormControl>

            <FormControl>
              <FormLabel>Amount</FormLabel>
              <Input
                type="number"
                name="amountToken0"
                value={swapInputs.amountToken0}
                onChange={handleInputChange}
                required
                width="100%"
                min={0}
              />
            </FormControl>

            <FormControl>
              <FormLabel>Fee Percentage</FormLabel>
              <Input
                type="number"
                name="poolFee"
                value={swapInputs.poolFee}
                onChange={handleInputChange}
                required
                width="100%"
                min={0}
              />
            </FormControl>

            <FormControl>
              <FormLabel>
                Max Slippage{' '}
                <Tooltip
                  label="Maximum acceptable slippage"
                  aria-label="Number of games tooltip"
                  placement="right"
                >
                  <Box as={InfoOutlineIcon} ml={0} mb={1.5} />
                </Tooltip>
              </FormLabel>

              <Slider
                min={0}
                max={25}
                step={0.1}
                value={swapInputs.maxSlippage}
                onChange={handleSliderChange}
                defaultValue={swapInputs.maxSlippage}
              >
                <SliderTrack bg="#e2e8f0">
                  <SliderFilledTrack bg="#94febf" />
                </SliderTrack>
                <SliderThumb />
              </Slider>
              <p>{swapInputs.maxSlippage}%</p>
            </FormControl>

            <FormControl display="flex" alignItems="center">
              <FormLabel htmlFor="isStable" mb="0">
                Is Stable Pair
              </FormLabel>
              <Switch
                id="isStable"
                colorScheme="green"
                onChange={handleSwitchChange}
                ml="2"
              />
            </FormControl>

            <HStack spacing="4">
              <Button
                flex="1"
                color="#000000"
                backgroundColor="#94febf"
                variant="solid"
                size="lg"
                loadingText="Submitting Transaction"
                onClick={() => HandleClickApprove()}
                _hover={{
                  color: '#000000',
                  backgroundColor: '#62ffa2',
                }}
              >
                Approve Tokens
                <div
                  style={{
                    display: 'inline-block',
                    width: '24px',
                    textAlign: 'center',
                    marginLeft: '8px',
                  }}
                >
                  {isLoadingApproval ? (
                    <Spinner
                      thickness="2px"
                      speed="0.85s"
                      emptyColor="gray.800"
                      color="gray.400"
                      size="md"
                    />
                  ) : null}
                </div>
              </Button>
              <Button
                flex="1"
                color="#000000"
                backgroundColor="#94febf"
                variant="solid"
                size="lg"
                loadingText="Submitting Transaction"
                onClick={() => HandleClickImplementSwap()}
                _hover={{
                  color: '#000000',
                  backgroundColor: '#62ffa2',
                }}
              >
                Swap Tokens
                <div
                  style={{
                    display: 'inline-block',
                    width: '24px',
                    textAlign: 'center',
                    marginLeft: '8px',
                  }}
                >
                  {isLoadingCreateWager ? (
                    <Spinner
                      thickness="2px"
                      speed="0.85s"
                      emptyColor="gray.800"
                      color="gray.400"
                      size="md"
                    />
                  ) : null}
                </div>
              </Button>
            </HStack>
          </Stack>
        </form>
      </Box>
    </ChakraProvider>
  );
}
