export type Item = {
  name: string;
  slug: string;
  description?: string;
};

export const demos: { name: string; items: Item[] }[] = [
  {
    name: 'Menu',
    items: [
      {
        name: 'Analytics',
        slug: 'analytics',
        description: 'Sberbank AMM analytics',
      },
      {
        name: 'Implement Swap',
        slug: 'swap',
        description: 'Swap tokens',
      },
      {
        name: 'Add Lquidity',
        slug: 'deposit',
        description: 'Add Liquidity',
      },
      {
        name: 'Liquidity Positions',
        slug: 'positions',
        description: 'View your open positions',
      },
      {
        name: 'Docs',
        slug: 'docs',
        description: 'Understand how SberAMM works',
      },
    ],
  },
];
