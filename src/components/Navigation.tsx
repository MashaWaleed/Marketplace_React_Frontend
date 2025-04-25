import { Box, Flex, Button, Link as ChakraLink, Spacer, Icon, HStack } from '@chakra-ui/react';
import { Link as RouterLink, useNavigate } from 'react-router-dom';
import { useAuthStore } from '../store/authStore';
import { FaStore, FaWallet, FaUser, FaSignOutAlt, FaSignInAlt, FaUserPlus } from 'react-icons/fa';

export default function Navigation() {
  const navigate = useNavigate();
  const { isAuthenticated, clearAuth } = useAuthStore();

  const handleLogout = () => {
    clearAuth();
    navigate('/login');
  };

  return (
    <Box bg="blue.500" px={4} py={3} boxShadow="md">
      <Flex maxW="container.xl" mx="auto" align="center">
        <ChakraLink 
          as={RouterLink} 
          to="/" 
          color="white" 
          fontWeight="bold"
          fontSize="xl"
          _hover={{ textDecoration: 'none', color: 'blue.100' }}
        >
          <HStack spacing={2}>
            <Icon as={FaStore} />
            <span>Marketplace</span>
          </HStack>
        </ChakraLink>
        
        <Spacer />
        
        {isAuthenticated ? (
          <Flex gap={4} align="center">
            <ChakraLink 
              as={RouterLink} 
              to="/wallet" 
              color="white"
              _hover={{ textDecoration: 'none', color: 'blue.100' }}
            >
              <HStack spacing={1}>
                <Icon as={FaWallet} />
                <span>Wallet</span>
              </HStack>
            </ChakraLink>
            <ChakraLink 
              as={RouterLink} 
              to="/profile" 
              color="white"
              _hover={{ textDecoration: 'none', color: 'blue.100' }}
            >
              <HStack spacing={1}>
                <Icon as={FaUser} />
                <span>Profile</span>
              </HStack>
            </ChakraLink>
            <Button
              variant="ghost"
              color="white"
              onClick={handleLogout}
              size="sm"
              leftIcon={<Icon as={FaSignOutAlt} />}
              _hover={{ bg: 'blue.600' }}
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
              leftIcon={<Icon as={FaSignInAlt} />}
              _hover={{ bg: 'blue.600' }}
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
              leftIcon={<Icon as={FaUserPlus} />}
              _hover={{ bg: 'blue.50' }}
            >
              Sign Up
            </Button>
          </Flex>
        )}
      </Flex>
    </Box>
  );
} 