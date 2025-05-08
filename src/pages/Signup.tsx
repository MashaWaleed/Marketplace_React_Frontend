import { useState } from 'react';
import { useNavigate, Link as RouterLink } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import * as yup from 'yup';
import {
  Box,
  Button,
  FormControl,
  FormLabel,
  Input,
  VStack,
  Heading,
  Text,
  Link,
  useToast,
  Container,
} from '@chakra-ui/react';
import { useMutation } from '@tanstack/react-query';
import { authAPI, getErrorMessage } from '../services/api';
import { useAuthStore } from '../store/authStore';
import type { SignupCredentials, AuthResponse } from '../types/api';
import Navigation from '../components/Navigation';

interface ApiResponse<T> {
  data: T;
}

const schema = yup.object().shape({
  name: yup.string().required('Name is required'),
  email: yup.string().email('Invalid email').required('Email is required'),
  password: yup.string()
    .required('Password is required')
    .min(8, 'Password must be at least 8 characters'),
});

export default function Signup() {
  const navigate = useNavigate();
  const toast = useToast();
  const setAuth = useAuthStore((state) => state.setAuth);
  const [isLoading, setIsLoading] = useState(false);

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<SignupCredentials>({
    resolver: yupResolver(schema),
  });

  const signupMutation = useMutation<ApiResponse<AuthResponse>, Error, SignupCredentials>({
    mutationFn: async (credentials) => {
      const response = await authAPI.signup(credentials);
      return response;
    },
    onSuccess: (response) => {
      toast({
        title: 'Account created successfully',
        description: 'Please login with your credentials',
        status: 'success',
        duration: 3000,
        isClosable: true,
      });
      navigate('/login');
    },
    onError: (error: Error) => {
      toast({
        title: 'Signup failed',
        description: getErrorMessage(error),
        status: 'error',
        duration: 3000,
        isClosable: true,
      });
    },
  });

  const onSubmit = (data: SignupCredentials) => {
    setIsLoading(true);
    signupMutation.mutate(data, {
      onSettled: () => {
        setIsLoading(false);
      },
    });
  };

  return (
    <>
      <Navigation />
      <Container maxW="container.sm" py={10}>
        <Box
          p={8}
          borderWidth={1}
          borderRadius="lg"
          boxShadow="lg"
        >
          <VStack spacing={4} align="stretch">
            <Heading textAlign="center">Sign Up</Heading>
            <form onSubmit={handleSubmit(onSubmit)}>
              <VStack spacing={4}>
                <FormControl isInvalid={!!errors.name}>
                  <FormLabel>Name</FormLabel>
                  <Input
                    {...register('name')}
                    placeholder="Enter your name"
                  />
                  {errors.name && (
                    <Text color="red.500" fontSize="sm">
                      {errors.name.message}
                    </Text>
                  )}
                </FormControl>

                <FormControl isInvalid={!!errors.email}>
                  <FormLabel>Email</FormLabel>
                  <Input
                    type="email"
                    {...register('email')}
                    placeholder="Enter your email"
                  />
                  {errors.email && (
                    <Text color="red.500" fontSize="sm">
                      {errors.email.message}
                    </Text>
                  )}
                </FormControl>

                <FormControl isInvalid={!!errors.password}>
                  <FormLabel>Password</FormLabel>
                  <Input
                    type="password"
                    {...register('password')}
                    placeholder="Enter your password"
                  />
                  {errors.password && (
                    <Text color="red.500" fontSize="sm">
                      {errors.password.message}
                    </Text>
                  )}
                </FormControl>

                <Button
                  type="submit"
                  colorScheme="blue"
                  width="full"
                  isLoading={isLoading}
                >
                  {isLoading ? 'Creating account...' : 'Sign Up'}
                </Button>
              </VStack>
            </form>

            <Text textAlign="center">
              Already have an account?{' '}
              <Link as={RouterLink} to="/login" color="blue.500">
                Login
              </Link>
            </Text>
          </VStack>
        </Box>
      </Container>
    </>
  );
} 