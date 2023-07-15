'use client';
import { useState } from 'react';
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
  VStack,
  Tooltip,
} from '@chakra-ui/react';

import { InfoOutlineIcon } from '@chakra-ui/icons';

const { ethers } = require('ethers');
const { CreateWager, Approve } = require('ui/wallet-ui/api/form');

import tokenOptions from './autocomplete-token-options';
import AutocompleteToken from './autocomplete-token';

import AutocompletePlayer from './autocomplete-player';
import pairingOptions from './autocomplete-player-options';

interface SwapInputs {
  token0: string;
  token1: string;
  amountToken0: number;
  maxSlippage: number;
}

export default function SwapForm() {
  const [isLoadingApproval, setIsLoadingApproval] = useState(false);
  const [isLoadingCreateWager, setIsLoadingCreateWager] = useState(false);

  const HandleClickApprove = async () => {
    setIsLoadingApproval(true);
    await Approve(swapInputs.token0, swapInputs.amountToken0);
    setIsLoadingApproval(false);
  };

  const HandleClickImplementSwap = async () => {
    console.log(swapInputs);
    setIsLoadingCreateWager(true);
    // await CreateWager(formInputs);
    setIsLoadingCreateWager(false);
  };

  const [swapInputs, setSwapInputs] = useState<SwapInputs>({
    token0: '',
    token1: '',
    amountToken0: 0,
    maxSlippage: 0,
  });

  const handleInputChange = (
    event: React.ChangeEvent<HTMLInputElement>,
  ): void => {
    const { name, value } = event.target;
    setSwapInputs((prevInputs) => ({
      ...prevInputs,
      [name]: value,
    }));
    console.log(swapInputs);
  };

  const handleSubmit = (event: React.FormEvent<HTMLFormElement>): void => {
    event.preventDefault();
    console.log(swapInputs);
  };

  const handleSliderChange = (value: number) => {
    setSwapInputs((prevInputs) => ({
      ...prevInputs,
      timePerMove: value,
    }));
  };

  const convertSecondsToTime = (seconds: number): string => {
    const days = Math.floor(seconds / 86400);
    seconds %= 86400;
    const hours = Math.floor(seconds / 3600);
    seconds %= 3600;
    const minutes = Math.floor(seconds / 60);

    return `${days} days ${hours} hours ${minutes} minutes`;
  };

  return (
    <ChakraProvider>
      <Box mx="auto">
        <form onSubmit={handleSubmit}>
          <Stack spacing="4">
            <FormControl>
              <FormLabel>Token </FormLabel>
              <AutocompleteToken
                options={tokenOptions}
                onChange={(value: string) =>
                  setSwapInputs((prevInputs) => ({
                    ...prevInputs,
                    wagerToken: value,
                  }))
                }
              />
            </FormControl>

            <FormControl>
              <FormLabel>Token </FormLabel>
              <AutocompleteToken
                options={tokenOptions}
                onChange={(value: string) =>
                  setSwapInputs((prevInputs) => ({
                    ...prevInputs,
                    wagerToken: value,
                  }))
                }
              />
            </FormControl>

            <FormControl>
              <FormLabel>Amount</FormLabel>
              <Input
                type="number"
                name="wagerAmount"
                value={swapInputs.amountToken0}
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
