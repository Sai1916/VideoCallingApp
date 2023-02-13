import { View, Text, StyleSheet, FlatList, Pressable, Platform, PermissionsAndroid, Alert } from 'react-native'
import React, { useEffect, useRef, useState } from 'react'
import { SafeAreaView } from 'react-native-safe-area-context'
import Ionicons from 'react-native-vector-icons/Ionicons'
import MaterialIcons from 'react-native-vector-icons/MaterialIcons'
import Feather from 'react-native-vector-icons/Feather'
import { useNavigation, useRoute } from '@react-navigation/native'
import {Voximplant} from 'react-native-voximplant'

const Calling = () => {

    const size = 24;
    const navigation = useNavigation();

    const route = useRoute(); 

    const {user,call: incomingCall,isIncomingCall} = route?.params;

    const voximplant = Voximplant.getInstance();

    let call = useRef(incomingCall);

    let endpoint = useRef();

    const [callStatus,setCallStatus] = useState('Calling...')

    const iconData = [
        {
            name: 'cam',
            icon: <Ionicons name='camera-reverse-outline' size={size} color="white"/>
        },
        {
            name: 'video',
            icon: <Feather name='video-off' size={size} color="white"/>
        },
        {
            name: 'mic',
            icon: <Feather name='mic-off' size={size} color="white"/>
        },
        {
            name: 'call',
            icon: <MaterialIcons name='call-end' size={size} color="white"/>,
            onPress: onHangUpPress
        }
    ]


    const [permissionGranted,setPermissionGranted] = useState(false);

    const [localVideoStreamId,setLocalVideoStreamId] = useState('');

    const [remoteVideoStreamId,setRemoteVideoStreamId] = useState('');

    const permissions = [
        PermissionsAndroid.PERMISSIONS.RECORD_AUDIO,
        PermissionsAndroid.PERMISSIONS.CAMERA
    ]
    
    useEffect(() => {
        const requestPermissions = async () => {
            const granted = await PermissionsAndroid.requestMultiple(permissions);
            const recordAudioGranted = granted[PermissionsAndroid.PERMISSIONS.RECORD_AUDIO] === 'granted';
            const cameraGranted = granted[PermissionsAndroid.PERMISSIONS.CAMERA] === 'granted';
            if (!cameraGranted | !recordAudioGranted) {
                Alert.alert('Permissions not granted');
            } else {
                setPermissionGranted(true);
            }  
        }
        if (Platform.OS = 'android') {requestPermissions()}
        else {setPermissionGranted(true);}
    }, []);


    useEffect(() => {
    
        if(!permissionGranted){
            return;
        }

        const callSettings = {
            video:{
                sendVideo: true,
                receiveVideo: true
            }
        }

    
        const makeCall = async () =>{
            call.current = await voximplant.call(user.user_name,callSettings);
            //console.log(call)
            subscribeToCall();
        }

        const answerCall = () => {
            subscribeToCall();
            endpoint.current = call.current.getEndpoints()[0];
            subscribeToEndpointEvent();
            call.current.answer(callSettings);
        }
 
        const subscribeToCall = () => {
            call.current.on(Voximplant.CallEvents.Failed, CallEvent => {
                showError(CallEvent.reason);
            })
            call.current.on(Voximplant.CallEvents.ProgressToneStart, CallEvent => {
                setCallStatus('Ringing...')
            })
            call.current.on(Voximplant.CallEvents.Connected, CallEvent => {
                setCallStatus('Connected...')
            })
            call.current.on(Voximplant.CallEvents.Disconnected, CallEvent => {
                navigation.navigate('Contacts');
            })
            call.current.on(Voximplant.CallEvents.LocalVideoStreamAdded, callEvent => {
                setLocalVideoStreamId(callEvent.videoStream.id);
            });

            call.current.on(Voximplant.CallEvents.EndpointAdded, callEvent =>{
                endpoint.current = callEvent.endpoint;
                subscribeToEndpointEvent();
            })
               
        };

        const subscribeToEndpointEvent = async () => {
            endpoint.current.on(Voximplant.EndpointEvents.RemoteVideoStreamAdded, endpointEvent => {
                setRemoteVideoStreamId(endpointEvent.videoStream.id);
            })
        }

        const showError = reason => {
            Alert.alert("Call Failed",`Reason: ${reason}`,[{
                text: 'Ok',
                onPress: navigation.navigate('Contacts')
            }])
        }
          
        if(isIncomingCall){
            answerCall();
        }
        else{
            makeCall();
        }

        return () => {
            call.current.off(Voximplant.CallEvents.Failed);
            call.current.off(Voximplant.CallEvents.ProgressToneStart);
            call.current.off(Voximplant.CallEvents.Connected);
            call.current.off(Voximplant.CallEvents.Disconnected);
        }
        

    },[permissionGranted])


    const onHangUpPress = () => {
        call.current.hangup();
    }


  return (
    <View style={styles.main}>
        <Pressable style={styles.backIcon} onPress={() => navigation.pop()}>
            <MaterialIcons name="keyboard-arrow-left" size={28} color="black"/>
        </Pressable>

        <Voximplant.VideoView
            style={styles.remoteVideo}
            videoStreamId={remoteVideoStreamId}
        /> 
        <Voximplant.VideoView
            style={styles.localVideo}
            videoStreamId={localVideoStreamId}
        /> 

      <View style={styles.topContainer}>
        <Text style={{fontSize: 24,fontWeight: 'bold',color: "#000"}}>{user?.user_display_name}</Text>
        <Text style={{fontSize: 16,fontWeight: 'bold',color: "#000"}}>{callStatus}</Text>
      </View>
      <View style={styles.bottomContainer}>
        <FlatList 
            data={iconData}
            renderItem = {({item}) => (
                <Pressable style={[styles.icon,{backgroundColor: item.name == 'call' ? 'red' : '#055453' }]}
                    onPress = {item.name === 'call' ? onHangUpPress : () => {}}
                >
                    {item.icon}
                </Pressable>
            )}
            horizontal
        />
      </View>
    </View>
  )
}

const styles = StyleSheet.create({
    main: {
        flex:1,
        alignItems: 'center',
        backgroundColor: "lightgreen"
    },
    backIcon:{
        position: 'absolute',
        top: 20,
        left: 24,
        zIndex : 10
    },
    localVideo:{
        width: 100,
        height: 150,
        backgroundColor: '#ffff6e',
        borderRadius: 10,
        position: 'absolute',
        right: 10,
        top: 100,
    },
    remoteVideo:{
        //backgroundColor: '#ffff6e',
        borderRadius: 30,
        position: 'absolute',
        right: 0,
        left: 0,
        top: 0,
        bottom:30
    },
    topContainer:{
        flex:1,
        alignItems: 'center',
        marginTop: 36,
    },
    bottomContainer:{
        position: 'absolute',
        bottom:0,
        alignItems: 'center',
        paddingBottom: 50,
        paddingVertical: 40,
        width: '100%',
        backgroundColor: '#031314',
        borderTopRightRadius: 30,
        borderTopLeftRadius: 30
    },
    icon:{
        padding: 10,
        marginHorizontal: 18,
        borderRadius: 50,

    }
})

export default Calling