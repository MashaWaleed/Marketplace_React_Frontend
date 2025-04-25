import {
  Container,
  VStack,
  Heading,
  Tabs,
  TabList,
  TabPanels,
  Tab,
  TabPanel,
  Text,
  Button,
  Grid,
  Box,
  SimpleGrid,
  Stat,
  StatLabel,
  StatNumber,
  StatHelpText,
  useColorModeValue,
} from '@chakra-ui/react';
import { useQuery } from '@tanstack/react-query';
import { useNavigate } from 'react-router-dom';
import { productsAPI } from '../services/api';
import Navigation from '../components/Navigation';
import ProductCard from '../components/ProductCard';
import type { Product } from '../types/api';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, PieChart, Pie, Cell } from 'recharts';

interface ApiResponse<T> {
  data: T;
}

interface AnalyticsData {
  total_products: number;
  total_selling_products: number;
  total_purchased_products: number;
}

const AnalyticsPanel = () => {
  const { data: analyticsResponse, isLoading: isAnalyticsLoading } = useQuery<ApiResponse<AnalyticsData>>({
    queryKey: ['analytics'],
    queryFn: async () => {
      const response = await productsAPI.getAnalytics();
      return response;
    }
  });

  const bgColor = useColorModeValue('white', 'gray.800');
  const borderColor = useColorModeValue('gray.200', 'gray.700');

  if (isAnalyticsLoading) {
    return <Text>Loading analytics...</Text>;
  }

  const analytics = analyticsResponse?.data;
  const chartData = [
    { name: 'Total Products', value: analytics?.total_products || 0 },
    { name: 'Selling', value: analytics?.total_selling_products || 0 },
    { name: 'Purchased', value: analytics?.total_purchased_products || 0 },
  ];

  const COLORS = ['#0088FE', '#00C49F', '#FFBB28'];

  return (
    <Box>
      <SimpleGrid columns={{ base: 1, md: 3 }} spacing={6} mb={8}>
        <Stat
          p={4}
          bg={bgColor}
          borderRadius="lg"
          borderWidth="1px"
          borderColor={borderColor}
          shadow="sm"
        >
          <StatLabel fontSize="lg">Total Products</StatLabel>
          <StatNumber fontSize="3xl">{analytics?.total_products || 0}</StatNumber>
          <StatHelpText>All products in the marketplace</StatHelpText>
        </Stat>
        <Stat
          p={4}
          bg={bgColor}
          borderRadius="lg"
          borderWidth="1px"
          borderColor={borderColor}
          shadow="sm"
        >
          <StatLabel fontSize="lg">Selling Products</StatLabel>
          <StatNumber fontSize="3xl">{analytics?.total_selling_products || 0}</StatNumber>
          <StatHelpText>Products you're currently selling</StatHelpText>
        </Stat>
        <Stat
          p={4}
          bg={bgColor}
          borderRadius="lg"
          borderWidth="1px"
          borderColor={borderColor}
          shadow="sm"
        >
          <StatLabel fontSize="lg">Purchased Products</StatLabel>
          <StatNumber fontSize="3xl">{analytics?.total_purchased_products || 0}</StatNumber>
          <StatHelpText>Products you've purchased</StatHelpText>
        </Stat>
      </SimpleGrid>

      <SimpleGrid columns={{ base: 1, md: 2 }} spacing={6}>
        <Box
          p={4}
          bg={bgColor}
          borderRadius="lg"
          borderWidth="1px"
          borderColor={borderColor}
          shadow="sm"
          height="400px"
        >
          <Heading size="md" mb={4}>Product Distribution</Heading>
          <ResponsiveContainer width="100%" height="100%">
            <PieChart>
              <Pie
                data={chartData}
                cx="50%"
                cy="50%"
                labelLine={false}
                label={({ name, percent }) => `${name} (${(percent * 100).toFixed(0)}%)`}
                outerRadius={80}
                fill="#8884d8"
                dataKey="value"
              >
                {chartData.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                ))}
              </Pie>
              <Tooltip />
            </PieChart>
          </ResponsiveContainer>
        </Box>

        <Box
          p={4}
          bg={bgColor}
          borderRadius="lg"
          borderWidth="1px"
          borderColor={borderColor}
          shadow="sm"
          height="400px"
        >
          <Heading size="md" mb={4}>Product Statistics</Heading>
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={chartData}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="name" />
              <YAxis />
              <Tooltip />
              <Bar dataKey="value" fill="#8884d8">
                {chartData.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                ))}
              </Bar>
            </BarChart>
          </ResponsiveContainer>
        </Box>
      </SimpleGrid>
    </Box>
  );
};

export default function Profile() {
  const navigate = useNavigate();
  const { data: sellingData, isLoading: isLoadingSelling } = useQuery<ApiResponse<Product[]>>({
    queryKey: ['selling-products'],
    queryFn: async () => {
      const response = await productsAPI.getSellingProducts();
      return response;
    },
  });

  const { data: purchasedData, isLoading: isLoadingPurchased } = useQuery<ApiResponse<Product[]>>({
    queryKey: ['purchased-products'],
    queryFn: async () => {
      const response = await productsAPI.getPurchasedProducts();
      return response;
    },
  });

  const { data: analyticsData, isLoading: isLoadingAnalytics } = useQuery<ApiResponse<{
    total_products: number;
    total_selling_products: number;
    total_purchased_products: number;
  }>>({
    queryKey: ['analytics'],
    queryFn: async () => {
      const response = await productsAPI.getAnalytics();
      return response;
    },
  });

  // Extract data from the response
  const sellingProducts = sellingData?.data || [];
  const purchasedProducts = purchasedData?.data || [];
  const analytics = analyticsData?.data;

  if (isLoadingSelling || isLoadingPurchased || isLoadingAnalytics) {
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
          <Heading textAlign="center">My Profile</Heading>

          <Tabs isFitted variant="enclosed">
            <TabList mb="1em">
              <Tab>Selling</Tab>
              <Tab>Purchased</Tab>
              <Tab>Analytics</Tab>
            </TabList>

            <TabPanels>
              <TabPanel>
                <VStack spacing={4} align="stretch">
                  <Button 
                    colorScheme="blue" 
                    alignSelf="flex-end"
                    onClick={() => navigate('/add-product')}
                  >
                    Add New Product
                  </Button>

                  {sellingProducts.length === 0 ? (
                    <Text textAlign="center">No products for sale</Text>
                  ) : (
                    <Grid
                      templateColumns={{
                        base: '1fr',
                        md: 'repeat(2, 1fr)',
                        lg: 'repeat(3, 1fr)',
                      }}
                      gap={6}
                    >
                      {sellingProducts.map((product: Product) => (
                        <ProductCard
                          key={product.id}
                          product={product}
                          showBuyButton={false}
                        />
                      ))}
                    </Grid>
                  )}
                </VStack>
              </TabPanel>

              <TabPanel>
                {purchasedProducts.length === 0 ? (
                  <Text textAlign="center">No purchased products</Text>
                ) : (
                  <Grid
                    templateColumns={{
                      base: '1fr',
                      md: 'repeat(2, 1fr)',
                      lg: 'repeat(3, 1fr)',
                    }}
                    gap={6}
                  >
                    {purchasedProducts.map((product: Product) => (
                      <ProductCard
                        key={product.id}
                        product={product}
                        showBuyButton={false}
                      />
                    ))}
                  </Grid>
                )}
              </TabPanel>

              <TabPanel>
                <AnalyticsPanel />
              </TabPanel>
            </TabPanels>
          </Tabs>
        </VStack>
      </Container>
    </>
  );
} 