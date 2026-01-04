import { Redirect } from 'expo-router';
import { useAuth } from '../src/presentation/context/AuthContext';
import { View, ActivityIndicator } from 'react-native';

export default function Index() {
  const { user, loading } = useAuth();

  if (loading) {
    return (
      <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
        <ActivityIndicator size="large" />
      </View>
    );
  }

  return user ? <Redirect href="/(app)/home" /> : <Redirect href="/(auth)/login" />;
}