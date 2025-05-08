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
  HStack,
  useToast,
} from '@chakra-ui/react';
import { useQuery, useMutation } from '@tanstack/react-query';
import { useNavigate } from 'react-router-dom';
import { productsAPI, authAPI } from '../services/api';
import Navigation from '../components/Navigation';
import ProductCard from '../components/ProductCard';
import type { Product } from '../types/api';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, PieChart, Pie, Cell } from 'recharts';
import React from 'react';
import { useAuthStore } from '../store/authStore';

interface ApiResponse<T> {
  data: T;
}

interface AnalyticsData {
  total_products: number;
  total_selling_products: number;
  total_purchased_products: number;
}

interface PurchaseRecord {
  date_time: string;
  buyer_id: number;
  product_id: number;
  Product: Product;
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

  const analytics = analyticsResponse?.data || {
    total_products: 0,
    total_selling_products: 0,
    total_purchased_products: 0
  };

  const chartData = [
    { name: 'Total Products', value: analytics.total_products },
    { name: 'Selling', value: analytics.total_selling_products },
    { name: 'Purchased', value: analytics.total_purchased_products },
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
          <StatNumber fontSize="3xl">{analytics.total_products}</StatNumber>
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
          <StatNumber fontSize="3xl">{analytics.total_selling_products}</StatNumber>
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
          <StatNumber fontSize="3xl">{analytics.total_purchased_products}</StatNumber>
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

const ExternalTokenPanel = () => {
  const toast = useToast();
  const [externalToken, setExternalToken] = React.useState<string | null>(null);

  const generateTokenMutation = useMutation({
    mutationFn: async () => {
      const response = await authAPI.createExternalToken();
      return response;
    },
    onSuccess: (response) => {
      setExternalToken(response.data.token);
      toast({
        title: 'External token generated successfully',
        status: 'success',
        duration: 3000,
        isClosable: true,
      });
    },
    onError: (error) => {
      toast({
        title: 'Error generating token',
        description: error.message,
        status: 'error',
        duration: 3000,
        isClosable: true,
      });
    },
  });

  const copyToClipboard = () => {
    if (externalToken) {
      navigator.clipboard.writeText(externalToken);
      toast({
        title: 'Token copied to clipboard',
        status: 'success',
        duration: 2000,
        isClosable: true,
      });
    }
  };

  return (
    <VStack spacing={4} align="stretch">
      <HStack spacing={4}>
        <Button
          colorScheme="blue"
          onClick={() => generateTokenMutation.mutate()}
          isLoading={generateTokenMutation.isPending}
        >
          Generate External Token
        </Button>
        <Button
          colorScheme="red"
          isDisabled={true}
        >
          Invalidate All Tokens
        </Button>
      </HStack>

      {externalToken && (
        <Box
          p={4}
          bg={useColorModeValue('white', 'gray.800')}
          borderRadius="lg"
          borderWidth="1px"
          borderColor={useColorModeValue('gray.200', 'gray.700')}
        >
          <Text mb={2} fontWeight="bold">Your External Token:</Text>
          <HStack>
            <Text
              p={2}
              bg={useColorModeValue('gray.100', 'gray.700')}
              borderRadius="md"
              fontFamily="monospace"
              wordBreak="break-all"
            >
              {externalToken}
            </Text>
            <Button
              size="sm"
              onClick={copyToClipboard}
            >
              Copy
            </Button>
          </HStack>
        </Box>
      )}
    </VStack>
  );
};

export default function Profile() {
  const navigate = useNavigate();
  const { user } = useAuthStore();
  const { data: sellingData, isLoading: isLoadingSelling } = useQuery<ApiResponse<Product[]>>({
    queryKey: ['selling-products'],
    queryFn: async () => {
      const response = await productsAPI.getSellingProducts();
      return response;
    },
  });

  const { data: purchasedData, isLoading: isLoadingPurchased } = useQuery<ApiResponse<PurchaseRecord[]>>({
    queryKey: ['purchased-products'],
    queryFn: async () => {
      const response = await productsAPI.getPurchasedProducts();
      return response;
    },
  });

  const { data: analyticsData, isLoading: isLoadingAnalytics } = useQuery<ApiResponse<AnalyticsData>>({
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
          <VStack spacing={2}>
            <Heading textAlign="center">My Profile</Heading>
            {user?.name && (
              <Text fontSize="xl" color="blue.500" fontWeight="medium">
                {user.name}
              </Text>
            )}
          </VStack>

          <Tabs isFitted variant="enclosed">
            <TabList mb="1em">
              <Tab>Selling</Tab>
              <Tab>Purchased</Tab>
              <Tab>Analytics</Tab>
              <Tab>External Token</Tab>
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
                    {purchasedProducts.map((record: PurchaseRecord) => (
                      <ProductCard
                        key={record.Product.id}
                        product={record.Product}
                        showBuyButton={false}
                      />
                    ))}
                  </Grid>
                )}
              </TabPanel>

              <TabPanel>
                <AnalyticsPanel />
              </TabPanel>

              <TabPanel>
                <ExternalTokenPanel />
              </TabPanel>
            </TabPanels>
          </Tabs>
        </VStack>
      </Container>
    </>
  );
} 