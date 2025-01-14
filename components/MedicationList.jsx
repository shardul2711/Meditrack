import { View, Text, StyleSheet, TouchableOpacity } from 'react-native'
import React, { useEffect, useState } from 'react'
import { Image } from 'react-native';
import { GetDateRangeToDisplay } from './../service/ConvertDateTime';
import { FlatList } from 'react-native';
import Colors from '../Constant/Colors';
import moment from 'moment';
import { getLocalStorage } from '../service/Storage';
import { collection, getDocs, query, where } from 'firebase/firestore';
import { db } from '../config/FirebaseConfig';
import MedicationCardItem from './MedicationCardItem';
import EmptyState from './EmptyState';
import { length } from 'react-native-reanimated';
import { useRouter } from 'expo-router';

export default function MedicationList() {

    const [medList, setMedList] = useState();
    const [dateRange, setDateRange] = useState();
    const [selectedDate, setSelectedDate] = useState(moment().format('MM/DD/YYYY'));
    const [loading, setLoading] = useState(false);
    const router = useRouter();
    useEffect(() => {
        GetDateRangeList();
        GetMedicationList(selectedDate);
        console.log(medList);
    }, [])

    const GetDateRangeList = () => {
        const dateRange = GetDateRangeToDisplay();
        setDateRange(dateRange);
    }

    const GetMedicationList = async (selectedDate) => {
        setLoading(true);
        const user = await getLocalStorage('userDetail');
        setMedList([]);
        try {
            const q = query(collection(db, 'medication'),
                where('userEmail', '==', user?.email),
                where('dates', 'array-contains', selectedDate));

            const querySnapshot = await getDocs(q);

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
        <View style={{
            marginTop: 25
        }}>
            <Image source={require('./../assets/images/medication.jpeg')}
                style={{
                    width: '100%',
                    height: 170,
                    borderRadius: 15
                }}
            />

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
                    <TouchableOpacity onPress={() => router.push({
                        pathname:"/actionModal",
                        params:{
                            ...item,
                            selectedDate:selectedDate
                        }
                    })}>
                        <MedicationCardItem medicine={item} selectedDate={selectedDate} />
                    </TouchableOpacity>
                )}
            /> : <EmptyState />}

        </View>
    )
}

const styles = StyleSheet.create({
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
