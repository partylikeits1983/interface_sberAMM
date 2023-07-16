import React, { FC, useEffect, useState } from 'react';
import { useRouter } from 'next/router'; // corrected import from 'next/navigation' to 'next/router'
import { LiquidityPosition } from '../types';
import { Button, Stack, Box, Spinner } from '@chakra-ui/react';
const { WithdrawLiquidity, WithdrawFees } = require('ui/wallet-ui/api/form');

interface CardSidePanelProps {
  card: LiquidityPosition; // Your Card type here
  isPendingApproval: boolean;
}

const SidePanel: FC<CardSidePanelProps> = ({ card, isPendingApproval }) => {
  const withdrawLiquidity = () => {
    WithdrawLiquidity(card);
  };

  const withdrawFees = () => {
    WithdrawFees(card);
  };

  return (
<div
  style={{
    display: 'flex',
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
  }}
>
  <Button
    colorScheme="green" // Change colorScheme to "green"
    onClick={withdrawLiquidity}
    isLoading={isPendingApproval}
    style={{ marginRight: '10px' }} // Add margin to create spacing between buttons
  >
    Withdraw Liquidity
  </Button>
  <Button
    colorScheme="green" // Change colorScheme to "green"
    onClick={withdrawFees}
    isLoading={isPendingApproval}
  >
    Withdraw Fees
  </Button>
</div>

  );
};

export default SidePanel;
