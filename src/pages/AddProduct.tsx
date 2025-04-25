import {
  Container,
  VStack,
  Heading,
  FormControl,
  FormLabel,
  Input,
  Textarea,
  Button,
  NumberInput,
  NumberInputField,
  NumberInputStepper,
  NumberIncrementStepper,
  NumberDecrementStepper,
  useToast,
  Text,
} from '@chakra-ui/react';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { useNavigate } from 'react-router-dom';
import { productsAPI } from '../services/api';
import Navigation from '../components/Navigation';
import { useForm } from 'react-hook-form';
import * as yup from 'yup';
import { yupResolver } from '@hookform/resolvers/yup';
import type { Product } from '../types/api';

interface ApiResponse<T> {
  data: T;
}

interface AddProductFormData {
  name: string;
  description: string;
  price: number;
  image: string;
}

const schema = yup.object().shape({
  name: yup.string().required('Name is required'),
  description: yup.string().required('Description is required'),
  price: yup.number().required('Price is required').positive('Price must be positive'),
  image: yup.string().required('Image URL is required'),
});

export default function AddProduct() {
  const navigate = useNavigate();
  const toast = useToast();
  const queryClient = useQueryClient();

  const {
    register,
    handleSubmit,
    formState: { errors },
    setValue,
  } = useForm<AddProductFormData>({
    resolver: yupResolver(schema),
  });

  const addProductMutation = useMutation<ApiResponse<Product>, Error, AddProductFormData>({
    mutationFn: async (data) => {
      const response = await productsAPI.createProduct({
        name: data.name,
        description: data.description,
        price: data.price,
        picture_url: data.image,
      });
      return response;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['selling-products'] });
      toast({
        title: 'Product added successfully',
        status: 'success',
        duration: 3000,
        isClosable: true,
      });
      navigate('/profile');
    },
    onError: (error) => {
      toast({
        title: 'Error adding product',
        description: error.message,
        status: 'error',
        duration: 3000,
        isClosable: true,
      });
    },
  });

  const onSubmit = (data: AddProductFormData) => {
    addProductMutation.mutate(data);
  };

  return (
    <>
      <Navigation />
      <Container maxW="container.md" py={8}>
        <VStack spacing={8} align="stretch">
          <Heading textAlign="center">Add New Product</Heading>

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

              <FormControl isInvalid={!!errors.image}>
                <FormLabel>Image URL</FormLabel>
                <Input
                  {...register('image')}
                  placeholder="Enter image URL"
                />
                {errors.image && (
                  <Text color="red.500" fontSize="sm">{errors.image.message}</Text>
                )}
              </FormControl>

              <Button
                type="submit"
                colorScheme="blue"
                width="full"
                isLoading={addProductMutation.isPending}
              >
                Add Product
              </Button>
            </VStack>
          </form>
        </VStack>
      </Container>
    </>
  );
} 