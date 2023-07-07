'use client';

import React, { useEffect, useState } from 'react';

import { Stack, Divider, Heading, ChakraProvider } from '@chakra-ui/react';

import Analytics from './analytics';

const PageData: React.FC = () => {
  const [useAPI, setUseAPI] = useState(false);

  return (
    <ChakraProvider>
      <Stack spacing={8}>
        <Analytics useAPI={useAPI} handleToggle={() => setUseAPI(!useAPI)} />
      </Stack>
    </ChakraProvider>
  );
};

export default PageData;
