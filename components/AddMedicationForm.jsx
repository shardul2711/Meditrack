import { View, Text, StyleSheet, TouchableOpacity, Alert } from 'react-native';
import React, { useState } from 'react';
import Ionicons from '@expo/vector-icons/Ionicons';
import { TextInput } from 'react-native';
import Colors from '../Constant/Colors';
import { FlatList } from 'react-native';
import { TypeList, WhenToTake } from './../Constant/Options';
import { Picker } from '@react-native-picker/picker';
import RNDateTimePicker from '@react-native-community/datetimepicker';
import { FormatDate, FormatDateForText, formatTime, getDatesRange } from '../service/ConvertDateTime';
import { doc, setDoc } from 'firebase/firestore';
import { db } from '../config/FirebaseConfig';
import { getLocalStorage } from './../service/Storage';
import { ActivityIndicator } from 'react-native';
import { useRouter } from 'expo-router';

export default function AddMedicationForm() {
    const [formData, setFormData] = useState({
        name: '',
        type: null,
        dose: '',
        startDate: null,
        endDate: null,
        when: null,
        reminder: null,
    });
    const [showStartDatePicker, setShowStartDatePicker] = useState(false);
    const [showEndDatePicker, setShowEndDatePicker] = useState(false);
    const [showTimePicker, setShowTimePicker] = useState(false);
    const [loading, setLoading] = useState(false);
    const router = useRouter();

    const onHandleInputChange = (field, value) => {
        setFormData((prev) => ({
            ...prev,
            [field]: value,
        }));
    };

    const SaveMedication = async () => {
        const docId = Date.now().toString();
        const user = await getLocalStorage('userDetail'); // Retrieve user details
        if (
            !(formData.name && formData.type && formData.dose && formData.startDate && formData.endDate && formData.reminder)
        ) {
            Alert.alert('Enter all fields');
            return;
        }

        const dates = getDatesRange(formData.startDate, formData.endDate);
        setLoading(true);

        try {
            await setDoc(doc(db, 'medication', docId), {
                action :"",
                ...formData,
                userEmail: user?.email || '', // Include the user's email
                docId: docId,
                dates: dates,
            });
            setLoading(false);
            Alert.alert('Medication added successfully!', '', [
                {
                    text: 'Ok',
                    onPress: () => router.push('(tabs)'),
                },
            ]);
        } catch (e) {
            setLoading(false);
            console.error(e);
            Alert.alert('Error saving medication data. Please try again.');
        }
    };

    return (
        <View style={{ padding: 25 }}>
            <Text style={styles.header}>Add New Medication</Text>

            <View style={styles.inputGroup}>
                <Ionicons style={styles.icon} name="medkit-outline" size={24} color="black" />
                <TextInput
                    style={styles.textInput}
                    placeholder="Medicine Name"
                    value={formData.name}
                    onChangeText={(value) => onHandleInputChange('name', value)}
                />
            </View>

            <FlatList
                data={TypeList}
                horizontal
                style={{ marginTop: 5 }}
                showsHorizontalScrollIndicator={false}
                renderItem={({ item }) => (
                    <TouchableOpacity
                        style={[
                            styles.inputGroup,
                            { marginRight: 10 },
                            { backgroundColor: item.name === formData?.type?.name ? Colors.PRIMARY : 'white' },
                        ]}
                        onPress={() => onHandleInputChange('type', item)}
                    >
                        <Text
                            style={[
                                styles.typeText,
                                { color: item.name === formData?.type?.name ? 'white' : 'black' },
                            ]}
                        >
                            {item?.name}
                        </Text>
                    </TouchableOpacity>
                )}
            />

            <View style={styles.inputGroup}>
                <Ionicons style={styles.icon} name="eyedrop-outline" size={24} color="black" />
                <TextInput
                    style={styles.textInput}
                    placeholder="Dose Ex. 2, 5ml"
                    value={formData.dose}
                    onChangeText={(value) => onHandleInputChange('dose', value)}
                />
            </View>

            <View style={styles.inputGroup}>
                <Ionicons style={styles.icon} name="time-outline" size={24} color="black" />
                <Picker
                    selectedValue={formData.when}
                    onValueChange={(itemValue) => onHandleInputChange('when', itemValue)}
                    style={{ width: '90%' }}
                >
                    {WhenToTake.map((item, index) => (
                        <Picker.Item key={index} label={item} value={item} />
                    ))}
                </Picker>
            </View>

            <View style={styles.dateInputGroup}>
                <TouchableOpacity
                    style={[styles.inputGroup, { flex: 1 }]}
                    onPress={() => setShowStartDatePicker(true)}
                >
                    <Ionicons style={styles.icon} name="calendar-outline" size={24} color="black" />
                    <Text style={styles.text}>
                        {formData.startDate ? FormatDateForText(formData.startDate) : 'Start Date'}
                    </Text>
                </TouchableOpacity>
                {showStartDatePicker && (
                    <RNDateTimePicker
                        minimumDate={new Date()}
                        onChange={(event) => {
                            onHandleInputChange('startDate', FormatDate(event.nativeEvent.timestamp));
                            setShowStartDatePicker(false);
                        }}
                        value={formData.startDate ? new Date(formData.startDate) : new Date()}
                    />
                )}

                <TouchableOpacity
                    style={[styles.inputGroup, { flex: 1 }]}
                    onPress={() => setShowEndDatePicker(true)}
                >
                    <Ionicons style={styles.icon} name="calendar-outline" size={24} color="black" />
                    <Text style={styles.text}>
                        {formData.endDate ? FormatDateForText(formData.endDate) : 'End Date'}
                    </Text>
                </TouchableOpacity>
                {showEndDatePicker && (
                    <RNDateTimePicker
                        minimumDate={new Date()}
                        onChange={(event) => {
                            onHandleInputChange('endDate', FormatDate(event.nativeEvent.timestamp));
                            setShowEndDatePicker(false);
                        }}
                        value={formData.endDate ? new Date(formData.endDate) : new Date()}
                    />
                )}
            </View>

            <View style={styles.dateInputGroup}>
                <TouchableOpacity
                    style={[styles.inputGroup, { flex: 1 }]}
                    onPress={() => setShowTimePicker(true)}
                >
                    <Ionicons style={styles.icon} name="timer-outline" size={24} color="black" />
                    <Text style={styles.text}>
                        {formData.reminder || 'Select Reminder Time'}
                    </Text>
                </TouchableOpacity>
            </View>

            {showTimePicker && (
                <RNDateTimePicker
                    mode="time"
                    onChange={(event) => {
                        onHandleInputChange('reminder', formatTime(event.nativeEvent.timestamp));
                        setShowTimePicker(false);
                    }}
                    value={formData.reminder ? new Date(formData.reminder) : new Date()}
                />
            )}

            <TouchableOpacity
                style={styles.button}
                onPress={() => SaveMedication()}
            >
                {loading ? (
                    <ActivityIndicator size={'large'} color={'white'} />
                ) : (
                    <Text style={styles.buttontext}>Add New Medication</Text>
                )}
            </TouchableOpacity>
        </View>
    );
}

const styles = StyleSheet.create({
    header: {
        fontSize: 25,
        fontWeight: 'bold',
    },
    inputGroup: {
        display: 'flex',
        flexDirection: 'row',
        alignItems: 'center',
        padding: 7,
        borderRadius: 8,
        borderWidth: 1,
        borderColor: Colors.LIGHT_GRAY_BORDER,
        marginTop: 7,
        backgroundColor: 'white',
    },
    textInput: {
        flex: 1,
        marginLeft: 10,
        fontSize: 14,
    },
    icon: {
        color: Colors.PRIMARY,
        borderRightWidth: 1,
        paddingRight: 11,
        borderColor: Colors.GRAY,
    },
    typeText: {
        fontSize: 14,
    },
    text: {
        fontSize: 14,
        padding: 10,
        flex: 1,
        marginLeft: 10,
    },
    dateInputGroup: {
        flexDirection: 'row',
        gap: 10,
    },
    button: {
        padding: 15,
        marginTop: 8,
        backgroundColor: Colors.PRIMARY,
        borderRadius: 15,
        width: '100%',
    },
    buttontext: {
        fontSize: 17,
        color: 'white',
        textAlign: 'center',
    },
});
