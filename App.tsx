import { QueryClientProvider } from '@tanstack/react-query';
import { StatusBar } from 'expo-status-bar';
import { queryClient } from './src/lib/queryClient';
import { MarketScreen } from './src/screens/MarketScreen';

export default function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <StatusBar style="light" />
      <MarketScreen />
    </QueryClientProvider>
  );
}