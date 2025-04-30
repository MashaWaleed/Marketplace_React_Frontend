import React, { useState } from 'react';
import {
  Container,
  VStack,
  Heading,
  Text,
  Button,
  Input,
  Table,
  Thead,
  Tbody,
  Tr,
  Th,
  Td,
  useToast,
  Box,
  Badge,
} from '@chakra-ui/react';
import { useQuery, useMutation } from '@tanstack/react-query';
import { walletAPI } from '../services/api';
import Navigation from '../components/Navigation';
import type { Transaction } from '../types/api';

export default function Wallet() {
  const toast = useToast();
  const [amount, setAmount] = useState('');

  const { data: walletData, isLoading: isLoadingWallet } = useQuery({
    queryKey: ['wallet'],
    queryFn: async () => {
      const response = await walletAPI.getWallet();
      return response.data;
    },
  });

  const { data: transactionsData, isLoading: isLoadingTransactions } = useQuery({
    queryKey: ['transactions'],
    queryFn: async () => {
      const response = await walletAPI.getTransactions();
      return response.data;
    },
  });

  const addMoneyMutation = useMutation({
    mutationFn: async (amount: number) => {
      const response = await walletAPI.addMoney(amount);
      return response.data;
    },
    onSuccess: (data) => {
      // Redirect to Paymob payment page
      window.location.href = `https://accept.paymob.com/unifiedcheckout/?publicKey=egy_pk_test_iarm6PIypVfSekwNDDqAbzhOhHczpizr&clientSecret=egy_csk_test_974596e7ef65826fa3014e2eeff3a217&sessionId=${data.session_id}`;
    },
    onError: (error: Error) => {
      toast({
        title: 'Failed to create payment session',
        description: error.message,
        status: 'error',
        duration: 3000,
        isClosable: true,
      });
    },
  });

  const handleAddMoney = () => {
    const amountNum = parseFloat(amount);
    if (isNaN(amountNum) || amountNum <= 0) {
      toast({
        title: 'Invalid amount',
        description: 'Please enter a valid amount greater than 0',
        status: 'error',
        duration: 3000,
        isClosable: true,
      });
      return;
    }
    addMoneyMutation.mutate(amountNum);
  };

  if (isLoadingWallet || isLoadingTransactions) {
    return (
      <>
        <Navigation />
        <Container maxW="container.xl" py={8}>
          <Text>Loading...</Text>
        </Container>
      </>
    );
  }

  return (
    <>
      <Navigation />
      <Container maxW="container.xl" py={8}>
        <VStack spacing={8} align="stretch">
          <Heading textAlign="center">My Wallet</Heading>

          <Box
            p={6}
            bg="white"
            borderRadius="lg"
            boxShadow="md"
          >
            <VStack spacing={4}>
              <Text fontSize="2xl" fontWeight="bold">
                Current Balance: ${walletData?.balance.toFixed(2)}
              </Text>

              <Box width="full">
                <Input
                  type="number"
                  placeholder="Enter amount"
                  value={amount}
                  onChange={(e) => setAmount(e.target.value)}
                  mb={4}
                />
                <Button
                  colorScheme="blue"
                  width="full"
                  onClick={handleAddMoney}
                  isLoading={addMoneyMutation.isPending}
                >
                  Add Money
                </Button>
              </Box>
            </VStack>
          </Box>

          <Box
            p={6}
            bg="white"
            borderRadius="lg"
            boxShadow="md"
          >
            <Heading size="md" mb={4}>Transaction History</Heading>
            <Table variant="simple">
              <Thead>
                <Tr>
                  <Th>Date</Th>
                  <Th>Amount</Th>
                  <Th>Type</Th>
                  <Th>Status</Th>
                </Tr>
              </Thead>
              <Tbody>
                {transactionsData?.map((transaction: Transaction) => (
                  <Tr key={transaction.id}>
                    <Td>{new Date(transaction.date).toLocaleDateString()}</Td>
                    <Td>${transaction.amount.toFixed(2)}</Td>
                    <Td>{transaction.credit > 0 ? 'Credit' : 'Debit'}</Td>
                    <Td>{transaction.done ? 'Completed' : 'Pending'}</Td>
                  </Tr>
                ))}
              </Tbody>
            </Table>
          </Box>
        </VStack>
      </Container>
    </>
  );
} 