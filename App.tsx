import { StatusBar } from 'react-native';

import { useFonts, Roboto_400Regular, Roboto_700Bold } from '@expo-google-fonts/roboto'
import { GluestackUIProvider, Text } from '@gluestack-ui/themed';
import { config } from './config/gluestack-ui.config';
import { Loading } from './src/components/Loading';
import { Routes } from './src/routes';
import { AuthContext, AuthContextProvider } from './src/contexts/AuthContext';

export default function App() {
  const [fontsLoaded] = useFonts({ Roboto_700Bold, Roboto_400Regular })

  return (
    <GluestackUIProvider config={config}>
      <StatusBar barStyle="light-content" backgroundColor="transparent" translucent />
      <AuthContextProvider>
        {fontsLoaded ? <Routes /> : <Loading />}
      </AuthContextProvider>
    </GluestackUIProvider>
  );
}