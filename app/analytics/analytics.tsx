'use client';

import { GetPoolData } from 'ui/wallet-ui/api/form';

import {
  ChakraProvider,
  Stat,
  StatLabel,
  Box,
  StatNumber,
  StatGroup,
  Spinner,
  Table,
  Flex,
  Switch,
  Tooltip,
  Tr,
  Th,
  Td,
  Link,
} from '@chakra-ui/react';

import { QuestionOutlineIcon } from '@chakra-ui/icons';
import React, { useEffect, useState, FC } from 'react';
import NextLink from 'next/link';
import { useRouter } from 'next/navigation';

interface AnalyticsProps {
  useAPI: boolean;
  handleToggle: () => void;
}

const Analytics: FC<AnalyticsProps> = ({ useAPI, handleToggle }) => {
  const [totalPools, setTotalPools] = useState('');
  // const [totalWagers, setTotalWagers] = useState('');


  const [loading, setLoading] = useState(true);

  const router = useRouter();

  useEffect(() => {
    const fetchData = async () => {
      if (!useAPI) {
        try {
          const PoolData = await GetPoolData();

          setTotalPools(PoolData.amount);

          setLoading(false);
        } catch (error) {
          console.log(error);
        }
      } else {
        try {
          // trying to ping the GCP API
          // const wagerAddresses = await GetWagersDB();

          setLoading(false);
        } catch (error) {
          console.log(error);
        }
      }
    };
    fetchData();
  }, [useAPI]);

  return (
    <ChakraProvider>
      <Flex justify="flex-end" pr={4} pt={0} alignItems="center">
        <Switch
          colorScheme="green"
          isChecked={!useAPI}
          onChange={handleToggle}
        />

        <Tooltip
          label="When switched on, gets values from on-chain (slower). Switch off if you don't have metamask"
          hasArrow
        >
          <QuestionOutlineIcon color="white" ml={2} />
        </Tooltip>
      </Flex>

      <StatGroup color="white">
        <Stat>
          <StatLabel>Total Number of Token Pairs</StatLabel>
          {loading ? <Spinner /> : <StatNumber>{totalPools}</StatNumber>}
        </Stat>

      </StatGroup>

      <Box overflowX="auto" maxWidth="100%">
      </Box>
    </ChakraProvider>
  );
};

export default Analytics;
