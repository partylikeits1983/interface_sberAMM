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
  Spacer,
  Text,
  RadioGroup,
  Radio,
} from '@chakra-ui/react';

import { InfoOutlineIcon } from '@chakra-ui/icons';

const { ethers } = require('ethers');
const {
  EstimateAmountOut,
  ExecuteSwap,
  Approve,
} = require('ui/wallet-ui/api/form');

import tokenOptions from './autocomplete-token-options';
import AutocompleteToken from './autocomplete-token';

export default function SwapForm() {
  const [isLoadingApproval, setIsLoadingApproval] = useState(false);
  const [isLoadingCreateWager, setIsLoadingCreateWager] = useState(false);
  const [estimatedAmountOut, setEstimatedAmountOut] =
    useState('Pool Not Found');
  const [allInputsHaveChanged, setAllInputsHaveChanged] = useState(false);

  const HandleClickApprove = async () => {
    setIsLoadingApproval(true);
    await Approve(swapInputs.token0, swapInputs.amountToken0);
    setIsLoadingApproval(false);
  };

  const HandleClickImplementSwap = async () => {
    console.log(swapInputs);
    setIsLoadingCreateWager(true);
    console.log('here');
    await ExecuteSwap(swapInputs);
    setIsLoadingCreateWager(false);
  };

  /*   const HandleEstimateAmountOut = async () => {
    setEstimatedAmountOut(await EstimateAmountOut(swapInputs));
  } */

  interface SwapInputs {
    token0: string;
    token1: string;
    amountToken0: number;
    isStable: boolean;
    poolFee: number;
    isCustomFee: boolean;
    maxSlippage: number;
  }

  const initialSwapInputs: SwapInputs = {
    token0: '',
    token1: '',
    amountToken0: 0,
    isStable: false,
    poolFee: 0,
    isCustomFee: false,
    maxSlippage: 0,
  };

  const [swapInputs, setSwapInputs] = useState<SwapInputs>(initialSwapInputs);

  const handleInputChange = (
    event: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>,
  ): void => {
    const { name, value } = event.target;

    // handle all other changes except poolFee and customPoolFee
    if (name !== 'poolFee' && name !== 'customPoolFee') {
      setSwapInputs((prevInputs) => ({
        ...prevInputs,
        [name]: value,
      }));
    }
  };

  const handleRadioChange = (value: string): void => {
    if (value === 'custom') {
      setSwapInputs((prevInputs) => ({
        ...prevInputs,
        isCustomFee: true,
      }));
    } else {
      setSwapInputs((prevInputs) => ({
        ...prevInputs,
        poolFee: parseFloat(value),
        isCustomFee: false,
      }));
    }
  };

  const handleCustomFeeChange = (
    event: React.ChangeEvent<HTMLInputElement>,
  ): void => {
    const { value } = event.target;

    if (swapInputs.isCustomFee) {
      setSwapInputs((prevInputs) => ({
        ...prevInputs,
        poolFee: parseFloat(value),
      }));
    }
  };

  /*   useEffect(() => {
    if (allInputsHaveChanged) {
      // HandleEstimateAmountOut();
    }
  }, [swapInputs]); */

  const HandleEstimateOut = async () => {
    console.log('All inputs have changed ');

    const estimatedOut = await EstimateAmountOut(swapInputs);

    console.log(estimatedOut.estimated);
    setEstimatedAmountOut(estimatedOut.estimated.toFixed(2).toString());
    console.log('EstimatedOut', estimatedOut.estimated);
    console.log('type', typeof estimatedOut.estimated);
  };

  useEffect(() => {
    console.log(swapInputs);
    // The check condition can vary based on your requirements. The following is an example.
    const keysToCheck: Array<keyof SwapInputs> = [
      'token0',
      'token1',
      'amountToken0',
    ]; // Replace with the keys you want to check

    const allChanged = keysToCheck.every(
      (key) => swapInputs[key] !== initialSwapInputs[key],
    );

    if (allChanged) {
      setAllInputsHaveChanged(true);
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
              <FormLabel marginBottom="20px">Fee Percentage</FormLabel>
              <HStack
                position="relative"
                direction="row"
                spacing="10px"
                alignItems="center"
              >
                <RadioGroup
                  name="poolFee"
                  value={
                    swapInputs.isCustomFee
                      ? 'custom'
                      : String(swapInputs.poolFee)
                  }
                  onChange={handleRadioChange}
                  colorScheme="green"
                >
                  <Stack direction="row" spacing="10px">
                    <Radio value="0.01">1%</Radio>
                    <Radio value="0.005">0.5%</Radio>
                    <Radio value="0.0003">0.03%</Radio>
                    <Radio value="custom">Custom</Radio>
                  </Stack>
                </RadioGroup>
                <Box
                  position="absolute"
                  right={0}
                  visibility={swapInputs.isCustomFee ? 'visible' : 'hidden'}
                >
                  <Input
                    type="number"
                    name="customPoolFee"
                    onChange={handleCustomFeeChange}
                    required
                    width="100px"
                    min={0}
                    marginLeft="0px"
                  />
                </Box>
              </HStack>
            </FormControl>

            <FormControl position="relative">
              <FormLabel marginBottom="20px">
                Max Slippage{' '}
                <Box as="span" width="4em" textAlign="right">
                  {swapInputs.maxSlippage}%
                </Box>
                <Tooltip
                  label="Maximum acceptable slippage"
                  aria-label="Number of games tooltip"
                  placement="right"
                >
                  <Box
                    as={InfoOutlineIcon}
                    position="absolute"
                    right={0}
                    top={'30%'}
                    transform={'translateY(-50%)'}
                    ml={0}
                    mb={1.5}
                  />
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
            </FormControl>

            <FormControl display="flex" alignItems="center">
              <FormLabel marginBottom="20px" htmlFor="isStable" mb="0">
                Is Stable Pair
              </FormLabel>
              <Switch
                id="isStable"
                colorScheme="green"
                onChange={handleSwitchChange}
                ml="2"
              />
            </FormControl>
            <FormLabel htmlFor="isStable" mb="0">
              Estimated Amount Out: {estimatedAmountOut}
            </FormLabel>

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
