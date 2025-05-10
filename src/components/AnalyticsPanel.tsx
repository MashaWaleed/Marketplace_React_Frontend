import {
  Box,
  SimpleGrid,
  Stat,
  StatLabel,
  StatNumber,
  StatHelpText,
  StatArrow,
  useColorModeValue,
  Heading,
  VStack,
  HStack,
  Text,
} from '@chakra-ui/react';
import { PieChart, Pie, Cell, ResponsiveContainer, Legend, Tooltip } from 'recharts';
import type { AnalyticsData } from '../types/api';

interface AnalyticsPanelProps {
  data: AnalyticsData;
}

const COLORS = ['#0088FE', '#00C49F', '#FFBB28'];

export default function AnalyticsPanel({ data }: AnalyticsPanelProps) {
  const bgColor = useColorModeValue('white', 'gray.700');
  const borderColor = useColorModeValue('gray.200', 'gray.600');

  const chartData = [
    { name: 'Selling', value: data.total_selling_products },
    { name: 'Sold', value: data.total_sold_products },
    { name: 'Purchased', value: data.total_purchased_products },
  ];

  return (
    <Box p={6} bg={bgColor} borderRadius="lg" boxShadow="md">
      <VStack spacing={6} align="stretch">
        <Heading size="md">Analytics Overview</Heading>

        <SimpleGrid columns={{ base: 1, md: 2, lg: 4 }} spacing={6}>
          <Stat
            px={4}
            py={3}
            borderWidth="1px"
            borderColor={borderColor}
            borderRadius="lg"
          >
            <StatLabel>Total Products</StatLabel>
            <StatNumber>{data.total_products}</StatNumber>
            <StatHelpText>
              <StatArrow type="increase" />
              All products
            </StatHelpText>
          </Stat>

          <Stat
            px={4}
            py={3}
            borderWidth="1px"
            borderColor={borderColor}
            borderRadius="lg"
          >
            <StatLabel>Selling Products</StatLabel>
            <StatNumber>{data.total_selling_products}</StatNumber>
            <StatHelpText>
              <StatArrow type="increase" />
              Currently listed
            </StatHelpText>
          </Stat>

          <Stat
            px={4}
            py={3}
            borderWidth="1px"
            borderColor={borderColor}
            borderRadius="lg"
          >
            <StatLabel>Sold Products</StatLabel>
            <StatNumber>{data.total_sold_products}</StatNumber>
            <StatHelpText>
              <StatArrow type="increase" />
              Successfully sold
            </StatHelpText>
          </Stat>

          <Stat
            px={4}
            py={3}
            borderWidth="1px"
            borderColor={borderColor}
            borderRadius="lg"
          >
            <StatLabel>Purchased Products</StatLabel>
            <StatNumber>{data.total_purchased_products}</StatNumber>
            <StatHelpText>
              <StatArrow type="increase" />
              Your purchases
            </StatHelpText>
          </Stat>
        </SimpleGrid>

        <Box height="300px" mt={4}>
          <ResponsiveContainer width="100%" height="100%">
            <PieChart>
              <Pie
                data={chartData}
                cx="50%"
                cy="50%"
                labelLine={false}
                outerRadius={80}
                fill="#8884d8"
                dataKey="value"
                label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
              >
                {chartData.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                ))}
              </Pie>
              <Tooltip />
              <Legend />
            </PieChart>
          </ResponsiveContainer>
        </Box>
      </VStack>
    </Box>
  );
} 