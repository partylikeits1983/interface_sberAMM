import React, { FC, useEffect, useState } from 'react';

import Link from 'next/link';
import { useRouter } from 'next/navigation';

import {  LiquidityPosition } from '../types';
import { Button, Stack, Box, Spinner } from '@chakra-ui/react';


const {
  ViewLiquidityPositions,
} = require('ui/wallet-ui/api/form');

interface CardSidePanelProps {
  card: LiquidityPosition; // Your Card type here
  isPendingApproval: boolean;
}

const SidePanel: FC<CardSidePanelProps> = ({ card, isPendingApproval }) => {
  // const { matchAddress, player0Address, player1Address, wagerToken } = card;

  const router = useRouter();



  return (
    <div
      style={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}
    >
    </div>
  );
};

export default SidePanel;
