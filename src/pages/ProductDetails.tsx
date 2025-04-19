import React from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import {
  Container,
  VStack,
  HStack,
  Heading,
  Text,
  Button,
  Image,
  Box,
  Badge,
  useToast,
  Spinner,
} from '@chakra-ui/react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { productsAPI } from '../services/api';
import Navigation from '../components/Navigation';

export default function ProductDetails() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const toast = useToast();
  const queryClient = useQueryClient();

  const { data, isLoading } = useQuery({
    queryKey: ['product', id],
    queryFn: () => productsAPI.getProduct(id!),
  });

  // Extract product from the response data
  const product = data?.data;

  const buyMutation = useMutation({
    mutationFn: async () => {
      const response = await productsAPI.buyProduct(id!);
      return response;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['products'] });
      queryClient.invalidateQueries({ queryKey: ['product', id] });
      toast({
        title: 'Purchase successful',
        status: 'success',
        duration: 3000,
      });
      navigate('/profile');
    },
    onError: (error: any) => {
      toast({
        title: 'Purchase failed',
        description: error.response?.data?.message || 'Something went wrong',
        status: 'error',
        duration: 3000,
      });
    },
  });

  if (isLoading) {
    return (
      <>
        <Navigation />
        <Container maxW="container.xl" py={8}>
          <VStack spacing={4}>
            <Spinner size="xl" />
            <Text>Loading product details...</Text>
          </VStack>
        </Container>
      </>
    );
  }

  if (!product) {
    return (
      <>
        <Navigation />
        <Container maxW="container.xl" py={8}>
          <Text>Product not found</Text>
        </Container>
      </>
    );
  }

  return (
    <>
      <Navigation />
      <Container maxW="container.xl" py={8}>
        <VStack spacing={8} align="stretch">
          <Box
            p={6}
            borderWidth={1}
            borderRadius="lg"
            boxShadow="lg"
          >
            <VStack spacing={6} align="stretch">
              <Image
                src={product.picture_url}
                alt={product.name}
                borderRadius="md"
                objectFit="cover"
                height="400px"
                width="100%"
              />

              <VStack align="stretch" spacing={4}>
                <HStack justify="space-between" align="center">
                  <Heading size="xl">{product.name}</Heading>
                  <Badge colorScheme="green" fontSize="lg" px={3} py={1}>
                    ${product.price.toFixed(2)}
                  </Badge>
                </HStack>

                <Text fontSize="lg" color="gray.600">
                  {product.description}
                </Text>

                <Button
                  colorScheme="blue"
                  size="lg"
                  onClick={() => buyMutation.mutate()}
                  isLoading={buyMutation.isPending}
                >
                  Buy Now
                </Button>
              </VStack>
            </VStack>
          </Box>
        </VStack>
      </Container>
    </>
  );
} 