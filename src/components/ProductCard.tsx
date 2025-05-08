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
import { productsAPI, getErrorMessage } from '../services/api';
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

  const buyMutation = useMutation({
    mutationFn: async () => {
      const response = await productsAPI.buyProduct(product.id!);
      return response.data;
    },
    onSuccess: () => {
      toast({
        title: 'Purchase successful',
        description: 'The product has been added to your purchased items',
        status: 'success',
        duration: 3000,
        isClosable: true,
      });
      onBuySuccess?.();
    },
    onError: (error: Error) => {
      toast({
        title: 'Purchase failed',
        description: getErrorMessage(error),
        status: 'error',
        duration: 3000,
        isClosable: true,
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
              <Text fontSize="lg" fontWeight="bold">
                ${Number(product.price).toFixed(2)}
              </Text>
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