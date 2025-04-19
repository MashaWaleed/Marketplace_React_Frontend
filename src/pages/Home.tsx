import React, { useState } from 'react';
import {
  Container,
  Grid,
  Input,
  InputGroup,
  InputLeftElement,
  VStack,
  Heading,
  Text,
  useToast,
} from '@chakra-ui/react';
import { SearchIcon } from '@chakra-ui/icons';
import { useQuery } from '@tanstack/react-query';
import { productsAPI } from '../services/api';
import ProductCard from '../components/ProductCard';
import Navigation from '../components/Navigation';

export default function Home() {
  const [searchQuery, setSearchQuery] = useState('');
  const toast = useToast();

  const { data, isLoading, error } = useQuery({
    queryKey: ['products', searchQuery],
    queryFn: () => productsAPI.getProducts(searchQuery),
  });

  // Extract products from the response data
  const products = data?.data || [];

  if (error) {
    toast({
      title: 'Error loading products',
      description: 'Failed to load products. Please try again later.',
      status: 'error',
      duration: 3000,
    });
  }

  return (
    <>
      <Navigation />
      <Container maxW="container.xl" py={8}>
        <VStack spacing={8} align="stretch">
          <Heading textAlign="center">Welcome to Marketplace</Heading>
          
          <InputGroup>
            <InputLeftElement pointerEvents="none">
              <SearchIcon color="gray.300" />
            </InputLeftElement>
            <Input
              placeholder="Search products..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
          </InputGroup>

          {isLoading ? (
            <Text textAlign="center">Loading products...</Text>
          ) : products.length === 0 ? (
            <Text textAlign="center">No products found</Text>
          ) : (
            <Grid
              templateColumns={{
                base: '1fr',
                md: 'repeat(2, 1fr)',
                lg: 'repeat(3, 1fr)',
              }}
              gap={6}
            >
              {products.map((product) => (
                <ProductCard key={product.id} product={product} />
              ))}
            </Grid>
          )}
        </VStack>
      </Container>
    </>
  );
} 