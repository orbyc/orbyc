import { ChakraProvider } from '@chakra-ui/react';
import { Outlet } from 'react-router-dom';

export const ErrorsLayout = () => {
  return (
    <ChakraProvider>
      <Outlet />
    </ChakraProvider>
  );
};
