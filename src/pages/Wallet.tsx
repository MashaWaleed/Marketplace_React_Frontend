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
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { walletAPI } from '../services/api';
import Navigation from '../components/Navigation';
import type { Wallet, Transaction } from '../types/api';
import type { AxiosResponse } from 'axios';

export default function Wallet() {
  const [amount, setAmount] = useState('');
  const toast = useToast();
  const queryClient = useQueryClient();

  const { data: walletData, isLoading: isLoadingWallet } = useQuery<AxiosResponse<Wallet>>({
    queryKey: ['wallet'],
    queryFn: async () => {
      const response = await walletAPI.getWallet();
      return response;
    },
  });

  const { data: transactionsData, isLoading: isLoadingTransactions } = useQuery<AxiosResponse<Transaction[]>>({
    queryKey: ['transactions'],
    queryFn: async () => {
      const response = await walletAPI.getTransactions();
      return response;
    },
  });

  const addMoneyMutation = useMutation<AxiosResponse<{ balance: number }>, Error, number>({
    mutationFn: async (amount: number) => {
      const response = await walletAPI.addMoney(amount);
      return response;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['wallet'] });
      queryClient.invalidateQueries({ queryKey: ['transactions'] });
      toast({
        title: 'Money added successfully',
        status: 'success',
        duration: 3000,
      });
      setAmount('');
    },
    onError: (error: Error) => {
      toast({
        title: 'Failed to add money',
        description: error.message || 'Something went wrong',
        status: 'error',
        duration: 3000,
      });
    },
  });

  // Extract data from the response
  const wallet = walletData?.data;
  const transactions = transactionsData?.data || [];

  const handleAddMoney = () => {
    const numAmount = parseFloat(amount);
    if (isNaN(numAmount) || numAmount <= 0) {
      toast({
        title: 'Invalid amount',
        description: 'Please enter a valid amount',
        status: 'error',
        duration: 3000,
      });
      return;
    }
    addMoneyMutation.mutate(numAmount);
  };

  return (
    <>
      <Navigation />
      <Container maxW="container.xl" py={8}>
        <VStack spacing={8} align="stretch">
          <Heading textAlign="center">E-Wallet</Heading>

          <Box
            p={6}
            borderWidth={1}
            borderRadius="lg"
            boxShadow="lg"
          >
            <VStack spacing={4}>
              <Text fontSize="2xl" fontWeight="bold">
                Current Balance
              </Text>
              <Text fontSize="4xl" color="green.500">
                ${isLoadingWallet ? '...' : wallet?.balance.toFixed(2)}
              </Text>

              <Box w="100%" maxW="md">
                <Input
                  type="number"
                  placeholder="Enter amount"
                  value={amount}
                  onChange={(e) => setAmount(e.target.value)}
                  mb={2}
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

          <Box>
            <Heading size="md" mb={4}>
              Transaction History
            </Heading>
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
                {isLoadingTransactions ? (
                  <Tr>
                    <Td colSpan={4} textAlign="center">
                      Loading transactions...
                    </Td>
                  </Tr>
                ) : transactions?.length === 0 ? (
                  <Tr>
                    <Td colSpan={4} textAlign="center">
                      No transactions found
                    </Td>
                  </Tr>
                ) : (
                  transactions?.map((transaction) => (
                    <Tr key={transaction.id}>
                      <Td>
                        {new Date(transaction.date).toLocaleDateString()}
                      </Td>
                      <Td>${transaction.amount.toFixed(2)}</Td>
                      <Td>
                        {transaction.credit ? 'Credit' : 'Debit'}
                      </Td>
                      <Td>
                        <Badge
                          colorScheme={transaction.done ? 'green' : 'yellow'}
                        >
                          {transaction.done ? 'Completed' : 'Pending'}
                        </Badge>
                      </Td>
                    </Tr>
                  ))
                )}
              </Tbody>
            </Table>
          </Box>
        </VStack>
      </Container>
    </>
  );
} 