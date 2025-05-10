import {
  Box,
  Container,
  Heading,
  SimpleGrid,
  Stat,
  StatLabel,
  StatNumber,
  StatHelpText,
  StatArrow,
  useColorModeValue,
  VStack,
  Text,
} from '@chakra-ui/react';
import { PieChart, Pie, Cell, ResponsiveContainer, Legend, Tooltip } from 'recharts';
import { useQuery } from '@tanstack/react-query';
import { productsAPI } from '../services/api';
import Navigation from '../components/Navigation';
import type { AnalyticsData } from '../types/api';

const COLORS = ['#0088FE', '#00C49F', '#FFBB28', '#FF8042'];

export default function Analytics() {
  const bgColor = useColorModeValue('white', 'gray.700');
  const borderColor = useColorModeValue('gray.200', 'gray.600');

  const { data: analyticsData, isLoading } = useQuery({
    queryKey: ['analytics'],
    queryFn: async () => {
      const response = await productsAPI.getAnalytics();
      return response.data;
    },
  });

  if (isLoading) {
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
                  <StatHelpText>
                    <StatArrow type="increase" />
                    All products
                  </StatHelpText>
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
                  <StatHelpText>
                    <StatArrow type="increase" />
                    Currently listed
                  </StatHelpText>
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
                  <StatHelpText>
                    <StatArrow type="increase" />
                    Successfully sold
                  </StatHelpText>
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
                  <StatHelpText>
                    <StatArrow type="increase" />
                    Your purchases
                  </StatHelpText>
                </Stat>
              </SimpleGrid>

              <Box height="400px" mt={4}>
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
            </VStack>
          </Box>
        </VStack>
      </Container>
    </>
  );
} 