import { Box, Flex, Button, Link as ChakraLink, Spacer } from '@chakra-ui/react';
import { Link as RouterLink, useNavigate } from 'react-router-dom';
import { useAuthStore } from '../store/authStore';

export default function Navigation() {
  const navigate = useNavigate();
  const { isAuthenticated, user, clearAuth } = useAuthStore();

  const handleLogout = () => {
    clearAuth();
    navigate('/login');
  };

  return (
    <Box bg="blue.500" px={4} py={3}>
      <Flex maxW="container.xl" mx="auto" align="center">
        <ChakraLink as={RouterLink} to="/" color="white" fontWeight="bold">
          Marketplace
        </ChakraLink>
        
        <Spacer />
        
        {isAuthenticated ? (
          <Flex gap={4} align="center">
            <ChakraLink as={RouterLink} to="/wallet" color="white">
              Wallet
            </ChakraLink>
            <ChakraLink as={RouterLink} to="/profile" color="white">
              Profile
            </ChakraLink>
            <Button
              variant="ghost"
              color="white"
              onClick={handleLogout}
              size="sm"
            >
              Logout
            </Button>
          </Flex>
        ) : (
          <Flex gap={4}>
            <Button
              as={RouterLink}
              to="/login"
              variant="ghost"
              color="white"
              size="sm"
            >
              Login
            </Button>
            <Button
              as={RouterLink}
              to="/signup"
              variant="solid"
              bg="white"
              color="blue.500"
              size="sm"
            >
              Sign Up
            </Button>
          </Flex>
        )}
      </Flex>
    </Box>
  );
} 