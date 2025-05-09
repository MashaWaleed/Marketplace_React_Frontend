import {
  Box,
  Image,
  Text,
  Badge,
  Button,
  VStack,
  HStack,
  useToast,
  useDisclosure,
  Modal,
  ModalOverlay,
  ModalContent,
  ModalHeader,
  ModalBody,
  ModalCloseButton,
  FormControl,
  FormLabel,
  Input,
  Textarea,
  NumberInput,
  NumberInputField,
  NumberInputStepper,
  NumberIncrementStepper,
  NumberDecrementStepper,
} from '@chakra-ui/react';
import { Link as RouterLink } from 'react-router-dom';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { productsAPI, getErrorMessage } from '../services/api';
import { useForm } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import * as yup from 'yup';
import type { Product } from '../types/api';

interface ApiResponse<T> {
  data: T;
}

interface SellingProductCardProps {
  product: Product;
}

interface UpdateProductFormData {
  name: string;
  description: string;
  price: number;
  picture_url: string;
}

const schema = yup.object().shape({
  name: yup.string().required('Name is required'),
  description: yup.string().required('Description is required'),
  price: yup.number().required('Price is required').positive('Price must be positive'),
  picture_url: yup.string().required('Image URL is required'),
});

export default function SellingProductCard({ product }: SellingProductCardProps) {
  const toast = useToast();
  const queryClient = useQueryClient();
  const { isOpen, onOpen, onClose } = useDisclosure();

  const {
    register,
    handleSubmit,
    formState: { errors },
    setValue,
  } = useForm<UpdateProductFormData>({
    resolver: yupResolver(schema),
    defaultValues: {
      name: product.name,
      description: product.description,
      price: Number(product.price),
      picture_url: product.picture_url,
    },
  });

  const updateMutation = useMutation<ApiResponse<Product>, Error, UpdateProductFormData>({
    mutationFn: async (data) => {
      const response = await productsAPI.updateProduct(product.id!, {
        ...product,
        ...data,
      });
      return response;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['selling-products'] });
      toast({
        title: 'Product updated successfully',
        status: 'success',
        duration: 3000,
        isClosable: true,
      });
      onClose();
    },
    onError: (error) => {
      toast({
        title: 'Error updating product',
        description: getErrorMessage(error),
        status: 'error',
        duration: 3000,
        isClosable: true,
      });
    },
  });

  const deleteMutation = useMutation<ApiResponse<{ success: boolean }>, Error, void>({
    mutationFn: async () => {
      const response = await productsAPI.deleteProduct(product.id!);
      return response;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['selling-products'] });
      toast({
        title: 'Product deleted successfully',
        status: 'success',
        duration: 3000,
        isClosable: true,
      });
    },
    onError: (error) => {
      toast({
        title: 'Error deleting product',
        description: getErrorMessage(error),
        status: 'error',
        duration: 3000,
        isClosable: true,
      });
    },
  });

  const onSubmit = (data: UpdateProductFormData) => {
    updateMutation.mutate(data);
  };

  const handleDelete = () => {
    if (window.confirm('Are you sure you want to delete this product?')) {
      deleteMutation.mutate();
    }
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

              <HStack>
                <Button
                  colorScheme="blue"
                  size="sm"
                  onClick={onOpen}
                  isLoading={updateMutation.isPending}
                >
                  Edit
                </Button>
                <Button
                  colorScheme="red"
                  size="sm"
                  onClick={handleDelete}
                  isLoading={deleteMutation.isPending}
                >
                  Delete
                </Button>
              </HStack>
            </HStack>
          </VStack>
        </Box>
      </Box>

      <Modal isOpen={isOpen} onClose={onClose}>
        <ModalOverlay />
        <ModalContent>
          <ModalHeader>Edit Product</ModalHeader>
          <ModalCloseButton />
          <ModalBody pb={6}>
            <form onSubmit={handleSubmit(onSubmit)}>
              <VStack spacing={4}>
                <FormControl isInvalid={!!errors.name}>
                  <FormLabel>Product Name</FormLabel>
                  <Input
                    {...register('name')}
                    placeholder="Enter product name"
                  />
                  {errors.name && (
                    <Text color="red.500" fontSize="sm">{errors.name.message}</Text>
                  )}
                </FormControl>

                <FormControl isInvalid={!!errors.description}>
                  <FormLabel>Description</FormLabel>
                  <Textarea
                    {...register('description')}
                    placeholder="Enter product description"
                  />
                  {errors.description && (
                    <Text color="red.500" fontSize="sm">{errors.description.message}</Text>
                  )}
                </FormControl>

                <FormControl isInvalid={!!errors.price}>
                  <FormLabel>Price</FormLabel>
                  <NumberInput
                    min={0}
                    onChange={(value) => setValue('price', Number(value))}
                  >
                    <NumberInputField
                      {...register('price')}
                      placeholder="Enter price"
                    />
                    <NumberInputStepper>
                      <NumberIncrementStepper />
                      <NumberDecrementStepper />
                    </NumberInputStepper>
                  </NumberInput>
                  {errors.price && (
                    <Text color="red.500" fontSize="sm">{errors.price.message}</Text>
                  )}
                </FormControl>

                <FormControl isInvalid={!!errors.picture_url}>
                  <FormLabel>Image URL</FormLabel>
                  <Input
                    {...register('picture_url')}
                    placeholder="Enter image URL"
                  />
                  {errors.picture_url && (
                    <Text color="red.500" fontSize="sm">{errors.picture_url.message}</Text>
                  )}
                </FormControl>

                <Button
                  type="submit"
                  colorScheme="blue"
                  width="full"
                  isLoading={updateMutation.isPending}
                >
                  Update Product
                </Button>
              </VStack>
            </form>
          </ModalBody>
        </ModalContent>
      </Modal>
    </>
  );
} 