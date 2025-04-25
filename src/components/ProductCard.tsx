import {
  Box,
  Image,
  Text,
  Badge,
  Button,
  VStack,
  HStack,
  useToast,
} from '@chakra-ui/react';
import { Link as RouterLink } from 'react-router-dom';
import { useMutation } from '@tanstack/react-query';
import { productsAPI } from '../services/api';
import type { Product } from '../types/api';

interface ApiResponse<T> {
  data: T;
}

interface ProductCardProps {
  product: Product;
  onBuySuccess?: () => void;
  showBuyButton?: boolean;
}

export default function ProductCard({
  product,
  onBuySuccess,
  showBuyButton = true,
}: ProductCardProps) {
  const toast = useToast();

  const buyMutation = useMutation<ApiResponse<{ success: boolean }>, Error, void>({
    mutationFn: async () => {
      const response = await productsAPI.buyProduct(product.id!);
      return response;
    },
    onSuccess: () => {
      toast({
        title: 'Purchase successful',
        status: 'success',
        duration: 3000,
      });
      onBuySuccess?.();
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

  return (
    <Box
      borderWidth="1px"
      borderRadius="lg"
      overflow="hidden"
      _hover={{ shadow: 'lg' }}
      transition="all 0.2s"
    >
      <RouterLink to={`/products/${product.id}`}>
        <Image
          src={product.picture_url}
          alt={product.name}
          height="200px"
          width="100%"
          objectFit="cover"
        />
      </RouterLink>

      <Box p={4}>
        <VStack align="stretch" spacing={2}>
          <RouterLink to={`/products/${product.id}`}>
            <Text fontSize="xl" fontWeight="semibold" _hover={{ color: 'blue.500' }}>
              {product.name}
            </Text>
          </RouterLink>

          <Text color="gray.600" noOfLines={2}>
            {product.description}
          </Text>

          <HStack justify="space-between" align="center">
            <Badge colorScheme="green" fontSize="md" px={2} py={1}>
              ${product.price.toFixed(2)}
            </Badge>

            {showBuyButton && (
              <Button
                colorScheme="blue"
                size="sm"
                onClick={() => buyMutation.mutate()}
                isLoading={buyMutation.isPending}
              >
                {buyMutation.isPending ? 'Processing...' : 'Buy Now'}
              </Button>
            )}
          </HStack>
        </VStack>
      </Box>
    </Box>
  );
} 