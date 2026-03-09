import { StatusBar } from 'expo-status-bar';
import { QueryProvider } from './src/providers/QueryProvider';
import { MarketScreen } from './src/screens/MarketScreen';

export default function App() {
  return (
    <QueryProvider>
      <StatusBar style="light" />
      <MarketScreen />
    </QueryProvider>
  );
}