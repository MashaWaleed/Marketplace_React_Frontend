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
import { productsAPI, getErrorMessage } from '../services/api';
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
  picture_url: string;
}

const schema = yup.object().shape({
  name: yup.string().required('Name is required'),
  description: yup.string().required('Description is required'),
  price: yup.number().required('Price is required').positive('Price must be positive'),
  picture_url: yup.string().required('Image URL is required'),
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

  const createProductMutation = useMutation({
    mutationFn: async (data: AddProductFormData) => {
      const response = await productsAPI.createProduct(data);
      return response;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['products'] });
      queryClient.invalidateQueries({ queryKey: ['selling-products'] });
      queryClient.invalidateQueries({ queryKey: ['analytics'] });
      toast({
        title: 'Product created',
        description: 'Your product has been created successfully.',
        status: 'success',
        duration: 3000,
        isClosable: true,
      });
      navigate('/profile');
    },
    onError: (error: any) => {
      toast({
        title: 'Creation failed',
        description: getErrorMessage(error),
        status: 'error',
        duration: 5000,
        isClosable: true,
      });
    },
  });

  const onSubmit = (data: AddProductFormData) => {
    createProductMutation.mutate(data);
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
                isLoading={createProductMutation.isPending}
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