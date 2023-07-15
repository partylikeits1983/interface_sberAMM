import React from 'react';

const { ethers } = require('ethers');
import alertWarningFeedback from '#/ui/alertWarningFeedback';

import {
  Accordion,
  AccordionItem,
  AccordionButton,
  AccordionPanel,
  AccordionIcon,
  Stack,
  Text,
  Flex,
  Box,
  HStack,
  useBreakpointValue,
} from '@chakra-ui/react';
import Identicon from 'ui/IdenticonGames';
import { CopyIcon } from '@chakra-ui/icons';

import copyIconFeedback from 'ui/copyIconFeedback';

import SidePanel from './sidePanel';

import { LiquidityPosition } from '../types';

interface Props {
  cards: LiquidityPosition[];
}

interface CardAccordionProps {
  card: LiquidityPosition;
  account: string | null;
}

const CardAccordion: React.FC<CardAccordionProps> = ({ card, account }) => {
  function formatDuration(seconds: number): string {
    const hours = Math.floor(seconds / 3600);
    const minutes = Math.floor((seconds % 3600) / 60);

    if (hours > 0) {
      return `${hours}h ${minutes}m`;
    } else {
      return `${minutes}m`;
    }
  }

  function formatAddress(address: string): string {
    if (!/^0x[a-fA-F0-9]{40}$/.test(address)) {
      alertWarningFeedback(`Invalid Ethereum address:}`);
      // alert(`Invalid Ethereum address: ${address}`);
    }
    return `${address.substr(0, 6)}...${address.substr(-8)}`;
  }

  async function handleCopyAddress(address: string) {
    try {
      await navigator.clipboard.writeText(address);
      copyIconFeedback('Address copied to clipboard');
    } catch (error) {
      copyIconFeedback('Failed to copy address');
    }
  }

  function fromScientificNotation(n: string): string {
    if (!n.includes('e')) {
      return n;
    }
    let sign = +n < 0 ? '-' : '',
      coefficients = n.replace('-', '').split('e'),
      e = Number(coefficients.pop()),
      zeros = '',
      decimalPointIndex = coefficients[0].indexOf('.');

    if (decimalPointIndex !== -1) {
      let decimalPart = coefficients[0].split('.')[1];
      coefficients[0] = coefficients[0].substring(0, decimalPointIndex);
      zeros =
        decimalPart.length > e
          ? '.' + decimalPart.substring(0, decimalPart.length - e)
          : '';
      e -= decimalPart.length;
    }

    while (e-- > 0) zeros += '0';

    return sign + coefficients[0] + zeros;
  }

  return (
    <Accordion allowToggle>
      <AccordionItem>
        <h2>
          <AccordionButton>
            <Flex justify="space-between" alignItems="center" w="full">
              <HStack spacing="1.5rem">
                <Identicon account={card.token0} />
                <Text fontSize="md">{`Pool ID: ${card.PID.toString()}`}</Text>
              </HStack>

              <HStack spacing="1.5rem">
                <Text></Text>
                <AccordionIcon />
              </HStack>
            </Flex>
          </AccordionButton>
        </h2>
        <AccordionPanel pb={4}>
          <Flex
            direction={useBreakpointValue({ base: 'column', md: 'row' })}
            alignItems={useBreakpointValue({
              base: 'stretch',
              md: 'flex-start',
            })}
          >
            <Stack
              spacing={2}
              width={useBreakpointValue({ base: '100%', md: '50%' })}
            >
              <Stack spacing={0}>
                <Text fontSize="sm" fontWeight="bold" color="gray.500">
                  Token 0
                </Text>
                <Flex alignItems="center">
                  <Text fontSize="md">{formatAddress(card.token0)}</Text>
                  <CopyIcon
                    ml={2}
                    cursor="pointer"
                    onClick={() => handleCopyAddress(card.token0)}
                  />
                </Flex>
              </Stack>

              <Stack spacing={0}>
                <Text fontSize="sm" fontWeight="bold" color="gray.500">
                  Token 1
                </Text>
                <Flex alignItems="center">
                  <Text fontSize="md">{formatAddress(card.token1)}</Text>
                  <CopyIcon
                    ml={2}
                    cursor="pointer"
                    onClick={() => handleCopyAddress(card.token1)}
                  />
                </Flex>
              </Stack>

              <Stack spacing={0}>
                <Text fontSize="sm" fontWeight="bold" color="gray.500">
                  Token 0
                </Text>
                <Flex alignItems="center">
                  <Text fontSize="md">
                    {ethers.utils.formatEther(card.poolBalance0)}
                  </Text>
                </Flex>
              </Stack>

              <Stack spacing={0}>
                <Text fontSize="sm" fontWeight="bold" color="gray.500">
                  Token 1
                </Text>
                <Flex alignItems="center">
                  <Text fontSize="md">
                    {ethers.utils.formatEther(card.poolBalance1)}
                  </Text>
                </Flex>
              </Stack>

              <Stack spacing={0}>
                <Text fontSize="sm" fontWeight="bold" color="gray.500">
                  User balance token 0
                </Text>
                <Flex alignItems="center">
                  <Text fontSize="md">
                    {ethers.utils.formatEther(card.poolBalance0)}
                  </Text>
                </Flex>
              </Stack>

              <Stack spacing={0}>
                <Text fontSize="sm" fontWeight="bold" color="gray.500">
                  User balance token 1
                </Text>
                <Flex alignItems="center">
                  <Text fontSize="md">
                    {ethers.utils.formatEther(card.poolBalance1)}
                  </Text>
                </Flex>
              </Stack>

              <Stack spacing={0}>
                <Text fontSize="sm" fontWeight="bold" color="gray.500">
                  User fees token 0
                </Text>
                <Flex alignItems="center">
                  <Text fontSize="md">
                    {ethers.utils.formatEther(card.userFees0)}
                  </Text>
                </Flex>
              </Stack>

              <Stack spacing={0}>
                <Text fontSize="sm" fontWeight="bold" color="gray.500">
                  User fees token 1
                </Text>
                <Flex alignItems="center">
                  <Text fontSize="md">
                    {ethers.utils.formatEther(card.userFees1)}
                  </Text>
                </Flex>
              </Stack>

              <Stack spacing={0}>
                <Text fontSize="sm" fontWeight="bold" color="gray.500">
                  Pool Fee Rate
                </Text>
                <Flex alignItems="center">
                  <Text fontSize="md">
                    {ethers.utils.formatEther(card.poolFeeRate)}
                  </Text>
                </Flex>
              </Stack>

              <Stack spacing={0}>
                <Text fontSize="sm" fontWeight="bold" color="gray.500">
                  Is stable pool
                </Text>
                <Flex alignItems="center">
                  <Text fontSize="md">{card.isStable.toString()}</Text>
                </Flex>
              </Stack>
            </Stack>

            <Box
              width={useBreakpointValue({ base: '100%', md: '50%' })}
              marginBottom={useBreakpointValue({ base: 4, md: 0 })}
              order={useBreakpointValue({ base: 2, md: 1 })}
            ></Box>
          </Flex>
        </AccordionPanel>
      </AccordionItem>
    </Accordion>
  );
};

export default CardAccordion;
