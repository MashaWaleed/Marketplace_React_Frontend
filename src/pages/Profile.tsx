import React from 'react';
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
  useToast,
  Grid,
} from '@chakra-ui/react';
import { useQuery } from '@tanstack/react-query';
import { productsAPI } from '../services/api';
import Navigation from '../components/Navigation';
import ProductCard from '../components/ProductCard';
import type { Product } from '../types/api';

export default function Profile() {
  const toast = useToast();

  const { data: sellingData, isLoading: isLoadingSelling } = useQuery({
    queryKey: ['selling-products'],
    queryFn: async () => {
      const response = await productsAPI.getSellingProducts();
      return response;
    },
  });

  const { data: purchasedData, isLoading: isLoadingPurchased } = useQuery({
    queryKey: ['purchased-products'],
    queryFn: async () => {
      const response = await productsAPI.getPurchasedProducts();
      return response;
    },
  });

  const { data: analyticsData, isLoading: isLoadingAnalytics } = useQuery({
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
                  <Button colorScheme="blue" alignSelf="flex-end">
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
                <VStack spacing={4} align="stretch">
                  <Text fontSize="lg">
                    Total Products: {analytics?.total_products}
                  </Text>
                  <Text fontSize="lg">
                    Products for Sale: {analytics?.total_selling_products}
                  </Text>
                  <Text fontSize="lg">
                    Purchased Products: {analytics?.total_purchased_products}
                  </Text>
                </VStack>
              </TabPanel>
            </TabPanels>
          </Tabs>
        </VStack>
      </Container>
    </>
  );
} 