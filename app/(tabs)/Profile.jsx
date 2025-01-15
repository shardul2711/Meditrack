import { View, Text, Button, Alert } from 'react-native';
import React from 'react';
import { useRouter } from 'expo-router';
import { signOut } from 'firebase/auth'; // Ensure correct Firebase import
import { auth } from '../../config/FirebaseConfig';// Adjust the path to your Firebase config
import { RemoveLocalStorage } from '../../service/Storage';

export default function Profile() {
  const router = useRouter();

  const handleLogout = async () => {
    try {
      // Sign out from Firebase
      await signOut(auth);

      // Clear local storage
      await RemoveLocalStorage();

      // Navigate to login screen
      router.replace('/loginScreen'); // Adjust the path to match your folder structure
    } catch (error) {
      Alert.alert('Error', error.message);
    }
  };

  return (
    <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
      <Text style={{ fontSize: 20, marginBottom: 20 }}>Profile</Text>

      <Text style={{ fontSize: 16, marginBottom: 10 }}>Welcome to the HomeScreen</Text>

      <Button title="Logout" onPress={handleLogout} />

      {/* Display EmptyState component if applicable */}
    </View>
  );
}
