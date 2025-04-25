import { useParams, useNavigate } from 'react-router-dom';
import {
  Container,
  VStack,
  Heading,
  Text,
  Button,
  Image,
  Box,
  useToast,
  Spinner,
} from '@chakra-ui/react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { productsAPI } from '../services/api';
import Navigation from '../components/Navigation';
import type { Product } from '../types/api';

interface ApiResponse<T> {
  data: T;
}

export default function ProductDetails() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const toast = useToast();
  const queryClient = useQueryClient();

  const { data, isLoading } = useQuery<ApiResponse<Product>>({
    queryKey: ['product', id],
    queryFn: async () => {
      const response = await productsAPI.getProduct(id!);
      return response;
    },
  });

  // Extract product from the response data
  const product = data?.data;

  const buyMutation = useMutation<ApiResponse<{ success: boolean }>, Error, void>({
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
                height="300px"
                width="100%"
              />
              <Heading size="lg">{product.name}</Heading>
              <Text fontSize="xl" color="blue.500" fontWeight="bold">
                ${product.price.toFixed(2)}
              </Text>
              <Text>{product.description}</Text>
              <Button
                colorScheme="blue"
                size="lg"
                onClick={() => buyMutation.mutate()}
                isLoading={buyMutation.isPending}
              >
                {buyMutation.isPending ? 'Processing...' : 'Buy Now'}
              </Button>
            </VStack>
          </Box>
        </VStack>
      </Container>
    </>
  );
} 