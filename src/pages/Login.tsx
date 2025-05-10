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
import type { LoginCredentials, AuthResponse } from '../types/api';
import Navigation from '../components/Navigation';

interface ApiResponse<T> {
  data: T;
}

const schema = yup.object().shape({
  email: yup.string().email('Invalid email').required('Email is required'),
  password: yup.string().required('Password is required'),
});

export default function Login() {
  const navigate = useNavigate();
  const toast = useToast();
  const setAuth = useAuthStore((state) => state.setAuth);
  const [isLoading, setIsLoading] = useState(false);

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<LoginCredentials>({
    resolver: yupResolver(schema),
  });

  const loginMutation = useMutation({
    mutationFn: async (data: LoginCredentials) => {
      const response = await authAPI.login(data);
      return response;
    },
    onSuccess: (response) => {
      setAuth(response.data.user, response.data.token);
      toast({
        title: 'Login successful',
        description: 'Welcome back!',
        status: 'success',
        duration: 3000,
        isClosable: true,
      });
      navigate('/');
    },
    onError: (error: any) => {
      const errorMessage = error.response?.data?.message || error.response?.data?.error || error.message;
      toast({
        title: 'Login failed',
        description: errorMessage,
        status: 'error',
        duration: 5000,
        isClosable: true,
      });
    },
  });

  const onSubmit = (data: LoginCredentials) => {
    setIsLoading(true);
    loginMutation.mutate(data, {
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
            <Heading textAlign="center">Login</Heading>
            <form onSubmit={handleSubmit(onSubmit)}>
              <VStack spacing={4}>
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
                  {isLoading ? 'Logging in...' : 'Login'}
                </Button>
              </VStack>
            </form>

            <Text textAlign="center">
              Don't have an account?{' '}
              <Link as={RouterLink} to="/signup" color="blue.500">
                Sign Up
              </Link>
            </Text>
          </VStack>
        </Box>
      </Container>
    </>
  );
} 