import { View, Text, StyleSheet, Image, FlatList, TouchableOpacity } from 'react-native'
import React, { useEffect, useState } from 'react'
import Colors from '../../Constant/Colors';
import { GetDateRangeToDisplay, GetReverseDateRangeToDisplay } from '../../service/ConvertDateTime';
import moment from 'moment';
import { getLocalStorage } from '../../service/Storage';
import { collection, getDocs, query, where } from 'firebase/firestore';
import { db } from '../../config/FirebaseConfig';
import MedicationCardItem from '../../components/MedicationCardItem';
import EmptyState from '../../components/EmptyState';

export default function History() {

  const [selectedDate, setSelectedDate] = useState(moment().format('MM/DD/YYYY'));
  const [dateRange, setDateRange] = useState();
  const [loading, setLoading] = useState(false);
  const [medList, setMedList] = useState([]);

  useEffect(() => {
    GetDateList();
    // console.log("heel" + selectedDate)
    GetMedicationList(selectedDate);
  }, [])

  const GetDateList = () => {
    const dates = GetReverseDateRangeToDisplay();
    // console.warn(dates);
    setDateRange(dates);
  }


  const GetMedicationList=async(selectedDate) => {
    
    setLoading(true);
    const user=await getLocalStorage('userDetail');
    setMedList([]);
    try {
      const q = query(collection(db, 'medication'),
        where('userEmail', '==', user?.email),
        where('dates', 'array-contains', selectedDate));

      const querySnapshot = await getDocs(q);

      console.log("--",selectedDate)
      querySnapshot.forEach((doc) => {
        console.log("docId:" + doc.id + '==>', doc.data())
        setMedList(prev => [...prev, doc.data()])
      })

      setLoading(false);

    }
    catch (e) {
      console.log(e)
      setLoading(false);
    }
  }

  return (
    <FlatList
    data={[]}
    style={{
      height:'100%',
      backgroundColor:'white'
    }}
    ListHeaderComponent={
    <View style={styles?.mainContainer}>
      <Image source={require('../../assets/images/med-history.png')}
        style={styles.imageBanner}
      />

      <Text style={styles.header}>Medication History</Text>

      <FlatList
        data={dateRange}
        horizontal
        style={{ marginTop: 15 }}
        showsHorizontalScrollIndicator={false}
        renderItem={({ item, index }) => (
          <TouchableOpacity
            style={[styles.dateGroup, { backgroundColor: item.formattedDate == selectedDate ? Colors.PRIMARY : Colors.LIGHT_GRAY_BORDER }]}
            onPress={() => {
              setSelectedDate(item.formattedDate);
              GetMedicationList(item.formattedDate)
            }}
          >
            <Text style={[styles.day, { color: item.formattedDate == selectedDate ? 'white' : 'black' }]}>{item.day}</Text>
            <Text style={[styles.date, { color: item.formattedDate == selectedDate ? 'white' : 'black' }]}>{item.date}</Text>
          </TouchableOpacity>
        )}
      />

      {medList?.length > 0 ? <FlatList
        data={medList}
        onRefresh={() => GetMedicationList(selectedDate)}
        refreshing={loading}
        renderItem={({ item, index }) => (
          <TouchableOpacity 
          // onPress={() => router.push({
          //   pathname: "/actionModal",
          //   params: {
          //     ...item,
          //     selectedDate: selectedDate
          //   }
          // })}
          >
            <MedicationCardItem medicine={item} selectedDate={selectedDate} />
          </TouchableOpacity>
        )}
      /> : 
      <Text style={{
        fontSize:25,
        padding:30,
        fontWeight:'bold',
        color:Colors.GRAY,
        textAlign:'center'
      }}>No Medication Found</Text>
      }

    </View>}
    />
  )
}

const styles = StyleSheet.create({
  mainContainer: {
    padding: 25,
    backgroundColor: 'white'
  },
  imageBanner: {
    width: '100%',
    height: 200,
    borderRadius: 15
  },
  header: {
    fontSize: 25,
    fontWeight: 'bold',
    marginTop: 20
  },
  dateGroup: {
    padding: 12,
    backgroundColor: Colors.LIGHT_GRAY_BORDER,
    display: 'flex',
    alignItems: 'center',
    marginRight: 10,
    borderRadius: 10,
  },
  day: {
    fontSize: 16
  },
  date: {
    fontSize: 22,
    fontWeight: 'bold'
  }
})

