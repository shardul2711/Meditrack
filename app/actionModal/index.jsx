import { View, Text, StyleSheet, Image, Alert, TouchableOpacity } from 'react-native'
import React from 'react'
import { useLocalSearchParams, useRouter } from 'expo-router'
import Colors from '../../Constant/Colors';
import MedicationCardItem from '../../components/MedicationCardItem';
import Ionicons from '@expo/vector-icons/Ionicons';
import moment from 'moment';
import { arrayUnion, doc, updateDoc } from 'firebase/firestore';
import { db } from '../../config/FirebaseConfig';

export default function MedicationActionModal() {
  const medicine = useLocalSearchParams();
  const router = useRouter();

  const UpdateActionStatus = async (status) => {
    try {
      const docRef = doc(db, 'medication', medicine?.docId);
      await updateDoc(docRef, {
        action: arrayUnion({
          status: status,
          time: moment().format('LT'),
          date: medicine?.selectedDate
        })
      });

      console.log(medicine.selectedDate);
      Alert.alert(status, 'Response Saved!', [
        {
          text: 'Ok',
          onPress: () => router.replace('(tabs)')
        }
      ])
    }
    catch (e) {
      console.log(e);
    }
  }


  return (
    <View style={styles.container}>
      <Image source={require('../../assets/images/notification.gif')}
        style={{
          width: 110,
          height: 110
        }}
      />
      <Text style={{ fontSize: 18 }}>{medicine?.selectedDate}</Text>
      <Text style={{ fontSize: 34, fontWeight: 'bold', color: Colors.PRIMARY }}>{medicine?.reminder}</Text>
      <Text style={{ fontSize: 18 }}>It's time to take</Text>

      <MedicationCardItem medicine={medicine}  selectedDate={medicine.selectedDate}/>

      <View style={styles.btnContainer}>
        <TouchableOpacity style={styles.closeBtn}
          onPress={() => UpdateActionStatus('Missed')}
        >
          <Ionicons name="close-outline" size={24} color="red" />
          <Text style={{
            fontSize: 17,
            color: 'red',

          }}>Missed</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.successBtn}
          onPress={() => UpdateActionStatus('Taken')}
        >
          <Ionicons name="checkmark-outline" size={24} color="white" />
          <Text style={{
            fontSize: 17,
            color: 'white',

          }}>Taken</Text>
        </TouchableOpacity>
      </View>
      <TouchableOpacity
        onPress={() => router.back()}
        style={{
          position: 'absolute',
          bottom: 25,
        }}>
        <Ionicons name="close-circle" size={44} color={Colors.GRAY} />
      </TouchableOpacity>
    </View>
  )
}

const styles = StyleSheet.create({
  container: {
    padding: 25,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: 'white',
    height: '100%',
  },
  btnContainer: {
    flexDirection: 'row',
    gap: 10,
    marginTop: 25,
  },
  closeBtn: {
    padding: 10,
    flexDirection: 'row',
    gap: 6,
    borderWidth: 1,
    alignItems: 'center',
    borderColor: 'red',
    borderRadius: 10,
  },
  successBtn: {
    padding: 10,
    flexDirection: 'row',
    gap: 6,
    backgroundColor: Colors.GREEN,
    alignItems: 'center',
    borderRadius: 10,
  }
})
