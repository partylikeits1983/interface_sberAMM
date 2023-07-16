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
  Thead,
  Tbody,
  Flex,
  Switch,
  Heading,
  Tooltip,
  Tr,
  Th,
  Td,
} from '@chakra-ui/react';
import { QuestionOutlineIcon } from '@chakra-ui/icons';
import React, { useEffect, useState, FC } from 'react';
import { useRouter } from 'next/navigation';

interface AnalyticsProps {
  useAPI: boolean;
  handleToggle: () => void;
}

interface BigNumber {
  type: string;
  hex: string;
}

interface PoolData {
  PID: Number;
  token0: string;
  token1: string;
  amount0: Number;
  amount1: Number;
  totalShares: Number;
  isStable: boolean;
  fee0: Number;
  fee1: Number;
  feeRate: Number;
}

const Analytics: FC<AnalyticsProps> = ({ useAPI, handleToggle }) => {
  const [totalPools, setTotalPools] = useState('');
  const [poolData, setPoolData] = useState<PoolData[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      if (!useAPI) {
        try {
          const PoolData = await GetPoolData();
          setPoolData(PoolData.data);
          setTotalPools(Number(PoolData.amount).toString());
          setLoading(false);
        } catch (error) {
          console.log(error);
        }
      } else {
        try {
          setLoading(false);
        } catch (error) {
          console.log(error);
        }
      }
    };
    fetchData();
  }, [useAPI]);

  function getFormattedAddress(address: string): string {
    const firstThree = address.slice(0, 5);
    const lastFour = address.slice(-6);

    return `${firstThree}...${lastFour}`;
  }

  return (
    <ChakraProvider>
      <Flex justify="flex-end" pr={4} pt={0} alignItems="center">
        <Switch
          colorScheme="green"
          isChecked={!useAPI}
          onChange={handleToggle}
        />
        <Tooltip
          label="When switched on, gets values from on-chain (slower). Switch off if you don't have Metamask"
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
        <Table variant="simple">
          <Thead>
            <Tr>
              <Th color="white">Pool ID</Th>
              <Th color="white">Token 1</Th>
              <Th color="white">Token 2</Th>
              <Th color="white">Amount Token 1</Th>
              <Th color="white">Amount Token 2</Th>
              <Th color="white">Is Stable</Th>
              <Th color="white">Accrued Fees 1</Th>
              <Th color="white">Accrued Fees 2</Th>
              <Th color="white">Fee Rate</Th>
            </Tr>
          </Thead>

          <Tbody>
            {poolData.map((data, index) => (
              <Tr key={index}>
                <Td color="white">{data.PID.toString()}</Td>
                <Td color="white">{getFormattedAddress(data.token0)}</Td>
                <Td color="white">{getFormattedAddress(data.token1)}</Td>
                <Td color="white">{data.amount0.toFixed(2).toString()}</Td>
                <Td color="white">{data.amount1.toFixed(2).toString()}</Td>
                <Td color="white">{data.isStable ? 'Yes' : 'No'}</Td>
                <Td color="white">{data.fee0.toFixed(2).toString()}</Td>
                <Td color="white">{data.fee1.toFixed(2).toString()}</Td>
                <Td color="white">
                  {(Number(data.feeRate) * 100).toFixed(2) + '%'}
                </Td>
              </Tr>
            ))}
          </Tbody>
        </Table>
      </Box>
    </ChakraProvider>
  );
};

export default Analytics;
