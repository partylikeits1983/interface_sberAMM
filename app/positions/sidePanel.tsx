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
  const HandleWithdrawLiquidity = async () => {
    console.log(card.PID);
    await WithdrawLiquidity(card.PID);
  };

  const HandleWithdrawFees = async () => {
    await WithdrawFees(card.PID);
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
        onClick={HandleWithdrawLiquidity}
        isLoading={isPendingApproval}
        style={{ marginRight: '10px' }} // Add margin to create spacing between buttons
      >
        Withdraw Liquidity
      </Button>
      <Button
        colorScheme="green" // Change colorScheme to "green"
        onClick={HandleWithdrawFees}
        isLoading={isPendingApproval}
      >
        Withdraw Fees
      </Button>
    </div>
  );
};

export default SidePanel;
