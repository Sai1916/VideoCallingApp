import { ImageBackground, Pressable, StyleSheet, Text, View } from 'react-native'
import React, { useEffect, useState } from 'react'
import bgImage from '../assets/images/ios_bg.png'
import { useNavigation, useRoute } from '@react-navigation/native'
import {Voximplant} from 'react-native-voximplant';

const IncomingCall = () => {

  const route = useRoute();
  const navigation = useNavigation();

  const {call} = route?.params;

  const [caller,setCaller] = useState('');

  useEffect(() => {

    setCaller(call.getEndpoints()[0].displayName);

    call.on(Voximplant.CallEvents.Disconnected,callEvent => {
      navigation.navigate('Contacts');
    })
  },[]);

  const onAccept = () => {
    navigation.navigate('Calling',{
      call,
      isIncomingCall: true
    })
  }

  const onDecline = () => {
    call.decline();
  }

  return (
    <ImageBackground source={bgImage} style={styles.container}>
      <View style={styles.topContainer}>
        <Text style={{fontSize: 24,fontWeight: 'bold',color: 'white'}}>{caller}</Text>
        <Text style={{color: 'white'}}>Incoming Call</Text>
      </View>
      <View style={styles.bottomContainer}>
        <Pressable onPress={onDecline}>
            <Text style={{color: 'white'}}>Decline</Text>
        </Pressable>
        <Pressable onPress={onAccept}>
            <Text style={{color: 'white'}}>Accept</Text>
        </Pressable>
      </View>
    </ImageBackground>
  )
}

export default IncomingCall

const styles = StyleSheet.create({
    container:{
        flex:1,
        
    },
    topContainer:{
        alignItems: 'center',
        marginTop: 100,
        
    },
    bottomContainer:{
        position: 'absolute',
        bottom:0,
        alignItems: 'center',
        justifyContent: 'space-evenly',
        marginBottom: 60,
        width: '100%',
        flexDirection: 'row'
    },
})