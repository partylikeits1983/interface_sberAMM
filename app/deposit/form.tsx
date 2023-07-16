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
  Switch,
  SliderTrack,
  SliderFilledTrack,
  SliderThumb,
  VStack,
  Tooltip,
} from '@chakra-ui/react';

import { InfoOutlineIcon } from '@chakra-ui/icons';

const { ethers } = require('ethers');
const { DepositLiquidity, Approve } = require('ui/wallet-ui/api/form');

import tokenOptions from './autocomplete-token-options';
import AutocompleteToken from './autocomplete-token';

import AutocompletePlayer from './autocomplete-player';
import pairingOptions from './autocomplete-player-options';

interface FormInputs {
  token0: string;
  token1: string;
  amount0: number;
  amount1: number;
  fee: number;
  isStable: boolean;
}

export default function ChallengeForm() {
  const [isLoadingApproval, setIsLoadingApproval] = useState(false);
  const [isLoadingDepositLiquidity, setIsLoadingDepositLiquidity] =
    useState(false);

  const HandleClickApprove = async () => {
    setIsLoadingApproval(true);
    await Approve(formInputs.token0, formInputs.token0);
    await Approve(formInputs.token1, formInputs.token1);
    setIsLoadingApproval(false);
  };

  const HandleClickDepositLiquidity = async () => {
    console.log(formInputs);
    setIsLoadingDepositLiquidity(true);
    await DepositLiquidity(formInputs);
    setIsLoadingDepositLiquidity(false);
  };

  const [formInputs, setFormInputs] = useState<FormInputs>({
    token0: '',
    token1: '',
    amount0: 0,
    amount1: 0,
    fee: 0,
    isStable: false,
  });

  const handleInputChange = (
    event: React.ChangeEvent<HTMLInputElement>,
  ): void => {
    const { name, value, type, checked } = event.target;

    const inputValue = type === 'checkbox' ? checked : value;

    console.log(inputValue);

    setFormInputs((prevInputs) => ({
      ...prevInputs,
      [name]: inputValue,
    }));
  };

  useEffect(() => {
    console.log(formInputs);
  }, [formInputs]);

  const handleSubmit = (event: React.FormEvent<HTMLFormElement>): void => {
    event.preventDefault();
    console.log(formInputs);
  };

  return (
    <ChakraProvider>
      <Box mx="auto">
        <form onSubmit={handleSubmit}>
          <Stack spacing="4">
            <FormControl>
              <FormLabel>Token 0</FormLabel>
              <AutocompleteToken
                options={tokenOptions}
                onChange={(value: string) =>
                  setFormInputs((prevInputs) => ({
                    ...prevInputs,
                    token0: value,
                  }))
                }
              />
            </FormControl>

            <FormControl>
              <FormLabel>Token 1</FormLabel>
              <AutocompleteToken
                options={tokenOptions}
                onChange={(value: string) =>
                  setFormInputs((prevInputs) => ({
                    ...prevInputs,
                    token1: value,
                  }))
                }
              />
            </FormControl>

            <FormControl>
              <FormLabel>Amount 0</FormLabel>
              <Input
                type="number"
                name="amount0"
                value={formInputs.amount0}
                onChange={handleInputChange}
                required
                width="100%"
                min={0}
              />
            </FormControl>

            <FormControl>
              <FormLabel>Amount 1</FormLabel>
              <Input
                type="number"
                name="amount1"
                value={formInputs.amount1}
                onChange={handleInputChange}
                required
                width="100%"
                min={0}
              />
            </FormControl>

            <FormControl>
  <FormLabel>Fee ({formInputs.fee}%)</FormLabel>
  <Input
    type="number"
    name="fee"
    value={formInputs.fee}
    onChange={handleInputChange}
    required
    width="100%"
    min={0}
  />
</FormControl>

            <FormControl display="flex" alignItems="center">
              <FormLabel mb="0">Is Stable Pair</FormLabel>
              <Switch
                name="isStable"
                isChecked={formInputs.isStable}
                onChange={handleInputChange}
                colorScheme="green"
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
                onClick={() => HandleClickDepositLiquidity()}
                _hover={{
                  color: '#000000',
                  backgroundColor: '#62ffa2',
                }}
              >
                Add Liquidity
                <div
                  style={{
                    display: 'inline-block',
                    width: '24px',
                    textAlign: 'center',
                    marginLeft: '8px',
                  }}
                >
                  {isLoadingDepositLiquidity ? (
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
