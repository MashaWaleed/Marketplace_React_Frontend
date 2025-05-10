import {
  Box,
  Container,
  Heading,
  SimpleGrid,
  Stat,
  StatLabel,
  StatNumber,
  StatHelpText,
  useColorModeValue,
  VStack,
  Text,
} from '@chakra-ui/react';
import { PieChart, Pie, Cell, ResponsiveContainer, Legend, Tooltip, LineChart, Line, XAxis, YAxis, CartesianGrid } from 'recharts';
import { useQuery } from '@tanstack/react-query';
import { productsAPI, walletAPI } from '../services/api';
import Navigation from '../components/Navigation';
import type { AnalyticsData } from '../types/api';

const COLORS = ['#0088FE', '#00C49F', '#FFBB28'];

export default function Analytics() {
  const bgColor = useColorModeValue('white', 'gray.700');
  const borderColor = useColorModeValue('gray.200', 'gray.600');

  const { data: analyticsData, isLoading: isAnalyticsLoading } = useQuery({
    queryKey: ['analytics'],
    queryFn: async () => {
      const response = await productsAPI.getAnalytics();
      return response.data;
    },
  });

  const { data: transactionsData, isLoading: isTransactionsLoading } = useQuery({
    queryKey: ['transactions'],
    queryFn: async () => {
      const response = await walletAPI.getTransactions();
      return response.data;
    },
  });

  if (isAnalyticsLoading || isTransactionsLoading) {
    return (
      <>
        <Navigation />
        <Container maxW="container.xl" py={8}>
          <Text>Loading analytics...</Text>
        </Container>
      </>
    );
  }

  const analytics = analyticsData || {
    total_products: 0,
    total_selling_products: 0,
    total_sold_products: 0,
    total_purchased_products: 0,
  };

  const transactions = transactionsData || [];

  // Prepare transaction data
  const transactionData = transactions.map(transaction => ({
    date: new Date(transaction.timestamp * 1000).toLocaleDateString(),
    amount: transaction.amount,
  }));

  // Prepare pie chart data
  const chartData = [
    { name: 'Selling', value: analytics.total_selling_products },
    { name: 'Sold', value: analytics.total_sold_products },
    { name: 'Purchased', value: analytics.total_purchased_products },
  ];

  return (
    <>
      <Navigation />
      <Container maxW="container.xl" py={8}>
        <VStack spacing={8} align="stretch">
          <Heading textAlign="center">Analytics Dashboard</Heading>

          <Box p={6} bg={bgColor} borderRadius="lg" boxShadow="md">
            <VStack spacing={6} align="stretch">
              <SimpleGrid columns={{ base: 1, md: 2, lg: 4 }} spacing={6}>
                <Stat
                  px={4}
                  py={3}
                  borderWidth="1px"
                  borderColor={borderColor}
                  borderRadius="lg"
                >
                  <StatLabel>Total Products</StatLabel>
                  <StatNumber>{analytics.total_products}</StatNumber>
                </Stat>

                <Stat
                  px={4}
                  py={3}
                  borderWidth="1px"
                  borderColor={borderColor}
                  borderRadius="lg"
                >
                  <StatLabel>Selling Products</StatLabel>
                  <StatNumber>{analytics.total_selling_products}</StatNumber>
                </Stat>

                <Stat
                  px={4}
                  py={3}
                  borderWidth="1px"
                  borderColor={borderColor}
                  borderRadius="lg"
                >
                  <StatLabel>Sold Products</StatLabel>
                  <StatNumber>{analytics.total_sold_products}</StatNumber>
                </Stat>

                <Stat
                  px={4}
                  py={3}
                  borderWidth="1px"
                  borderColor={borderColor}
                  borderRadius="lg"
                >
                  <StatLabel>Purchased Products</StatLabel>
                  <StatNumber>{analytics.total_purchased_products}</StatNumber>
                </Stat>
              </SimpleGrid>

              <SimpleGrid columns={{ base: 1, md: 2 }} spacing={6}>
                <Box height="400px">
                  <Text fontSize="xl" mb={4}>Product Distribution</Text>
                  <ResponsiveContainer width="100%" height="100%">
                    <PieChart>
                      <Pie
                        data={chartData}
                        cx="50%"
                        cy="50%"
                        labelLine={false}
                        outerRadius={120}
                        fill="#8884d8"
                        dataKey="value"
                        label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
                      >
                        {chartData.map((entry, index) => (
                          <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                        ))}
                      </Pie>
                      <Tooltip />
                      <Legend />
                    </PieChart>
                  </ResponsiveContainer>
                </Box>

                <Box height="400px">
                  <Text fontSize="xl" mb={4}>Transaction Timeline</Text>
                  <ResponsiveContainer width="100%" height="100%">
                    <LineChart data={transactionData}>
                      <CartesianGrid strokeDasharray="3 3" />
                      <XAxis dataKey="date" />
                      <YAxis />
                      <Tooltip />
                      <Legend />
                      <Line 
                        type="monotone" 
                        dataKey="amount" 
                        stroke="#8884d8" 
                        name="Amount"
                      />
                    </LineChart>
                  </ResponsiveContainer>
                </Box>
              </SimpleGrid>
            </VStack>
          </Box>
        </VStack>
      </Container>
    </>
  );
} 