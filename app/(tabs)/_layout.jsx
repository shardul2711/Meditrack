import { View, Text } from 'react-native'
import React, { useEffect, useState } from 'react'
import { Tabs, useRouter } from 'expo-router'
import FontAwesome from '@expo/vector-icons/FontAwesome';
import { onAuthStateChanged } from 'firebase/auth';
import { auth } from '../../config/FirebaseConfig';
import { getLocalStorage } from '../../service/Storage';

export default function TabLayout() {

    const router = useRouter();

    useEffect(()=>{
        GetUserDetail();
    },[])
    
    const GetUserDetail=async() =>{
        const userInfo=await getLocalStorage('userDetail');
        if(!userInfo)
        {
            router.replace('/loginScreen')
        }
    }
    

  return (
    <Tabs screenOptions={{
        headerShown:false
      }}>
        <Tabs.Screen name='index'
            options={{
                tabBarLabel:'index', 
                tabBarIcon:({color, size}) => (
                    <FontAwesome name="home" size={size} color={color} />
                )
            }}
        />
        <Tabs.Screen name='History'
            options={{
                tabBarLabel:'History', 
                tabBarIcon:({color, size}) => (
                    <FontAwesome name="history" size={size} color={color} />
                )
            }}
        />
        <Tabs.Screen name='Profile'
            options={{
                tabBarLabel:'Profile', 
                tabBarIcon:({color, size}) => (
                    <FontAwesome name="user" size={size} color={color} />
                )
            }}
        />
    </Tabs>
  )
}