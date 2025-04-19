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
import { Wallet as WalletType, Transaction } from '../types/api';

interface ApiResponse<T> {
  data: T;
}

const Wallet: React.FC = () => {
  const [amount, setAmount] = useState<string>('');
  const toast = useToast();
  const queryClient = useQueryClient();

  const { data: walletData, isLoading: isWalletLoading } = useQuery<WalletType>({
    queryKey: ['wallet'],
    queryFn: async () => {
      const response = await walletAPI.getWallet();
      return response.data;
    },
  });

  const { data: transactionsData, isLoading: isTransactionsLoading } = useQuery<Transaction[]>({
    queryKey: ['transactions'],
    queryFn: async () => {
      const response = await walletAPI.getTransactions();
      return response.data;
    },
  });

  const addMoneyMutation = useMutation<ApiResponse<WalletType>, Error, number>({
    mutationFn: async (amount: number) => {
      const response = await walletAPI.addMoney(amount);
      return response;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['wallet'] });
      queryClient.invalidateQueries({ queryKey: ['transactions'] });
      toast({
        title: 'Success',
        description: 'Money added successfully!',
        status: 'success',
        duration: 3000,
      });
      setAmount('');
    },
    onError: (error) => {
      toast({
        title: 'Error',
        description: 'Failed to add money. Please try again.',
        status: 'error',
        duration: 3000,
      });
      console.error('Add money error:', error);
    },
  });

  const handleAddMoney = (e: React.FormEvent) => {
    e.preventDefault();
    const numAmount = parseFloat(amount);
    if (isNaN(numAmount) || numAmount <= 0) {
      toast({
        title: 'Error',
        description: 'Please enter a valid amount',
        status: 'error',
        duration: 3000,
      });
      return;
    }
    addMoneyMutation.mutate(numAmount);
  };

  if (isWalletLoading || isTransactionsLoading) {
    return (
      <div className="flex justify-center items-center min-h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
      </div>
    );
  }

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
                ${walletData?.balance.toFixed(2) || '0.00'}
              </Text>

              <Box w="100%" maxW="md">
                <form onSubmit={handleAddMoney} className="flex gap-4">
                  <Input
                    type="number"
                    placeholder="Enter amount"
                    value={amount}
                    onChange={(e) => setAmount(e.target.value)}
                    className="flex-1 p-2 border rounded"
                    min="0"
                    step="0.01"
                  />
                  <Button
                    type="submit"
                    colorScheme="blue"
                    width="full"
                    isLoading={addMoneyMutation.isPending}
                  >
                    {addMoneyMutation.isPending ? 'Adding...' : 'Add Money'}
                  </Button>
                </form>
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
                {isTransactionsLoading ? (
                  <Tr>
                    <Td colSpan={4} textAlign="center">
                      Loading transactions...
                    </Td>
                  </Tr>
                ) : transactionsData?.length === 0 ? (
                  <Tr>
                    <Td colSpan={4} textAlign="center">
                      No transactions found
                    </Td>
                  </Tr>
                ) : (
                  transactionsData?.map((transaction) => (
                    <Tr key={transaction.id}>
                      <Td>
                        {new Date(transaction.date).toLocaleDateString()}
                      </Td>
                      <Td>${transaction.amount.toFixed(2)}</Td>
                      <Td>
                        {transaction.credit > 0 ? 'Credit' : 'Debit'}
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
};

export default Wallet; 