import { View, Text, Image, TouchableOpacity } from 'react-native'
import React from 'react'
import ConstantString from '../Constant/ConstantString'
import Colors from '../Constant/Colors'
import { TouchableOpacityBase } from 'react-native'
import { useRouter } from 'expo-router'

export default function EmptyState() {
    const router = useRouter();
    return (
        <View style={{
            marginTop:80,
            display:'flex',
            alignItems:'center'
        }}>
            <Image
                source={require('./../assets/images/medicine.png')}
                style={{
                    width:120,
                    height:120,
                }}
            />

            <Text style={{
                fontSize:31,
                fontWeight: 'bold',
                marginTop: 30
            }}>
                {ConstantString.NoMedication}
            </Text>

            <Text style={{
                fontSize:14,
                color:Colors.DARK_GRAY,
                textAlign:'center',
                marginTop: 16   
            }}>{ConstantString.MedicationSubText}</Text>

            <TouchableOpacity style={{
                backgroundColor:Colors.PRIMARY,
                padding: 13,
                borderRadius:10,
                width:'100%',
                marginTop:26
            }}
            onPress={()=>router.push('/add-new-medication')}
            >
                <Text style={{
                    textAlign:'center',
                    fontSize:14,
                    color: 'white'
                }}>{ConstantString.AddNewMedicationButton}</Text>
            </TouchableOpacity>
        </View>
    )
}