'use client';

import { GetWagersDB } from 'ui/wallet-ui/api/db-api';

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
  const [totalGames, setTotalGames] = useState('');
  const [totalWagers, setTotalWagers] = useState('');
  const [wagerAddresses, setWagerAddresses] = useState<string[]>([]); // Specify string[] as the state type
  const [loading, setLoading] = useState(true);

  const router = useRouter();

  useEffect(() => {
    const fetchData = async () => {
      if (!useAPI) {
        try {
          setLoading(false);
        } catch (error) {
          console.log(error);
        }
      } else {
        try {
          // trying to ping the GCP API
          const wagerAddresses = await GetWagersDB();

          setWagerAddresses(wagerAddresses);
          setTotalGames(wagerAddresses.length.toString());
          setTotalWagers(wagerAddresses.length.toString());

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
          {loading ? <Spinner /> : <StatNumber>{totalGames}</StatNumber>}
        </Stat>

        <Stat>
          <StatLabel>Total Liquidity</StatLabel>
          {loading ? <Spinner /> : <StatNumber>{totalWagers}</StatNumber>}
        </Stat>
      </StatGroup>

      <Box overflowX="auto" maxWidth="100%">
        <Table variant="simple" mt={4} size="sm">
          <thead>
            <Tr>
              <Th color="white">#</Th>
              <Th color="white">Wager Addresses</Th>
            </Tr>
          </thead>
          <tbody>
            {wagerAddresses.map((address, index) => (
              <Tr key={index}>
                <Td color="green.400">{index + 1}</Td>
                <Td>
                  <Link
                    color="green.400"
                    onClick={() => router.push(`/game/${address}`)}
                  >
                    {address}
                  </Link>
                </Td>
              </Tr>
            ))}
          </tbody>
        </Table>
      </Box>
    </ChakraProvider>
  );
};

export default Analytics;
