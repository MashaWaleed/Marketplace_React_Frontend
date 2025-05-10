import {
  Box,
  Image,
  Text,
  Badge,
  Button,
  VStack,
  HStack,
  useToast,
  AlertDialog,
  AlertDialogBody,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogContent,
  AlertDialogOverlay,
  useDisclosure,
} from '@chakra-ui/react';
import { Link as RouterLink } from 'react-router-dom';
import { useMutation } from '@tanstack/react-query';
import { productsAPI, getErrorMessage } from '../services/api';
import type { Product } from '../types/api';
import React from 'react';
import { useQueryClient } from '@tanstack/react-query';

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
  const { isOpen, onOpen, onClose } = useDisclosure();
  const cancelRef = React.useRef<HTMLButtonElement>(null);
  const queryClient = useQueryClient();

  const buyMutation = useMutation<ApiResponse<{ success: boolean }>, Error, void>({
    mutationFn: async () => {
      const response = await productsAPI.buyProduct(product.id!);
      return response;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['products'] });
      queryClient.invalidateQueries({ queryKey: ['product'] });
      queryClient.invalidateQueries({ queryKey: ['purchased-products'] });
      queryClient.invalidateQueries({ queryKey: ['selling-products'] });
      queryClient.invalidateQueries({ queryKey: ['analytics'] });
      toast({
        title: 'Purchase successful',
        description: 'You have successfully purchased this product.',
        status: 'success',
        duration: 3000,
        isClosable: true,
      });
      if (onBuySuccess) {
        onBuySuccess();
      }
    },
    onError: (error: any) => {
      toast({
        title: 'Purchase failed',
        description: getErrorMessage(error),
        status: 'error',
        duration: 5000,
        isClosable: true,
      });
    },
  });

  const handleBuy = () => {
    buyMutation.mutate();
    onClose();
  };

  return (
    <>
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
                  onClick={onOpen}
                  isLoading={buyMutation.isPending}
                >
                  Buy Now
                </Button>
              )}
            </HStack>
          </VStack>
        </Box>
      </Box>

      <AlertDialog isOpen={isOpen} leastDestructiveRef={cancelRef} onClose={onClose}>
        <AlertDialogOverlay>
          <AlertDialogContent>
            <AlertDialogHeader fontSize="lg" fontWeight="bold">
              Confirm Purchase
            </AlertDialogHeader>

            <AlertDialogBody>
              Are you sure you want to purchase {product.name} for ${Number(product.price).toFixed(2)}?
            </AlertDialogBody>

            <AlertDialogFooter>
              <Button ref={cancelRef} onClick={onClose}>
                Cancel
              </Button>
              <Button colorScheme="blue" onClick={handleBuy} ml={3} isLoading={buyMutation.isPending}>
                Confirm Purchase
              </Button>
            </AlertDialogFooter>
          </AlertDialogContent>
        </AlertDialogOverlay>
      </AlertDialog>
    </>
  );
} 