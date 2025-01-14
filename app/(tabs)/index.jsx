import { View, Text, Button, Alert, FlatList } from "react-native";
import React from "react";
import { signOut } from "firebase/auth";
import { auth } from "../../config/FirebaseConfig";
import { RemoveLocalStorage } from "../../service/Storage";
import { useRouter } from "expo-router";
import Header from "../../components/Header";
import EmptyState from "../../components/EmptyState";
import MedicationList from "../../components/MedicationList";

export default function HomeScreen() {
  // const router = useRouter();

  // const handleLogout = async () => {
  //   try {
  //     // Sign out from Firebase
  //     await signOut(auth);
  //     // Clear local storage
  //     await RemoveLocalStorage();
  //     // Navigate to login screen
  //     router.replace("/loginScreen"); // Adjust the path to match your folder structure
  //   } catch (error) {
  //     Alert.alert("Error", error.message);
  //   }
  // };

  return (
    <FlatList
      data={[]}
      ListHeaderComponent={
        <View style={{
          padding: 25,
          backgroundColor: 'white',
          height: '100%',
        }}>

          {/* <Text>HomeScreen</Text>
        <Button title="Logout" onPress={handleLogout} /> */}
          <Header />

          {/* <EmptyState /> */}

          <MedicationList />
        </View>
      }
    />


  );
}
