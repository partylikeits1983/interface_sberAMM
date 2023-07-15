'use client';

import React, { useState, useEffect } from 'react';
import {
  ChakraProvider,
  Box,
  Heading,
  Text,
  Spinner,
  Flex,
} from '@chakra-ui/react';

const { ViewLiquidityPositions } = require('ui/wallet-ui/api/form');

import { useMetamask } from 'ui/wallet-ui/components/Metamask';

import CardAccordion from './CardAccordion'; // Import the CardAccordion component
import CardFilterControls from './CardFilterControls';

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

interface Props {
  cards: LiquidityPosition[];
}

const CardList = () => {
  const [account, setAccount] = useState<string | null>(null);
  const { connect, accounts } = useMetamask();

  const [isLoading, setIsLoading] = useState(true);
  const [cards, setCards] = useState<LiquidityPosition[]>([]);

  const [sortValue, setSortValue] = useState('');
  const [filterValue, setFilterValue] = useState(false);

  useEffect(() => {
    const handleConnect = async () => {
      if (account === undefined) {
        const isConnected = await connect();
        if (!isConnected) {
          setAccount('');
        }
      }
    };

    handleConnect();
  }, [account, connect]);

  useEffect(() => {
    setAccount(accounts[0]);
  }, [accounts]);

  useEffect(() => {
    async function fetchCards() {
      try {
        setIsLoading(true);
        const data = await ViewLiquidityPositions();

        console.log('Inside CardList');
        console.log(data);
        console.log(typeof data);

        if (data && data.Positions && Array.isArray(data.Positions)) {
          setCards(data.Positions.reverse()); // reverse to show newest first
        } else {
          console.error('ViewLiquidityPositions returned invalid data:', data);
        }
        setIsLoading(false);
      } catch (error) {
        console.error('Error fetching wagers:', error);
      }
    }
    fetchCards();
  }, []);

  const sortedCards = [...cards].sort((a, b) => {
    switch (sortValue) {
      case 'isPending':
        return a.isStable === b.isStable ? 0 : a.isStable ? -1 : 1;
      case 'wagerAmountAsc':
        return a.poolBalance0 - b.poolBalance0;
      case 'wagerAmountDesc':
        return b.poolBalance0 - a.poolBalance0;
      default:
        return 0;
    }
  });

  const filteredAndSortedCards = sortedCards.filter(
    (card) => !filterValue || card.isStable,
  );

  return (
    <ChakraProvider>
      <Box>
        <Heading as="h2" size="lg" mb={4}>
          Liquidity positions
        </Heading>
        <CardFilterControls
          sortValue={sortValue}
          setSortValue={setSortValue}
          filterValue={filterValue}
          setFilterValue={setFilterValue}
        />
        {isLoading ? (
          <Flex justify="center">
            <Spinner size="lg" />
          </Flex>
        ) : filteredAndSortedCards.length ? (
          filteredAndSortedCards.map((card, index) => (
            <CardAccordion key={index} card={card} account={'1'} />
          ))
        ) : (
          <Text fontSize="xl" color="gray.500">
            You haven&apos;t created any liquidity positions yet.
          </Text>
        )}
      </Box>
    </ChakraProvider>
  );
};

export default CardList;
