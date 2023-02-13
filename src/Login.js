import { Alert, Button, Pressable, StyleSheet, Text, TextInput, View,Platform, PermissionsAndroid } from 'react-native'
import React, { useEffect, useState } from 'react'
import { Voximplant } from 'react-native-voximplant';
import { useNavigation } from '@react-navigation/native';

const Login = () => {

    const [username,setUsername] = useState('');
    const [password,setPassword] = useState('');

    const voximplant = Voximplant.getInstance();

    const navigation = useNavigation();

    useEffect(() => {
        const connectVoximplant = async () => {
          const status = await voximplant.getClientState();
          if (status === Voximplant.ClientState.DISCONNECTED) {
            await voximplant.connect();
          } else if (status === Voximplant.ClientState.LOGGED_IN) {
            redirectHome();
          }
        };
    
        connectVoximplant();
      }, []);
    
      const signIn = async () => {
        try {
          const fqUsername = `${username}@videocalling.saisumedh.voximplant.com`;
          await voximplant.login(fqUsername, password);
    
          redirectHome();
        } catch (e) {
          console.log(e);
          Alert.alert(e.name, `Error code: ${e.code}`);
        }
      };
    
      const redirectHome = () => {
        navigation.reset({
          index: 0,
          routes: [
            {
              name: 'Contacts',
            },
          ],
        });
    };

    

       
  return (
    <View style={styles.container}>
      <TextInput style={styles.input} placeholder='Enter username' onChangeText={e => setUsername(e)}/>
      <TextInput style={styles.input} placeholder='Enter password' onChangeText={e => setPassword(e)} secureTextEntry/>
      <Pressable style={styles.btn} title='Login' onPress={signIn}>
        <Text style={styles.text}>LOGIN</Text>
      </Pressable>
    </View>
  )
}

export default Login

const styles = StyleSheet.create({
    container:{
        flex:1,
        alignItems: 'center',
        justifyContent: 'center',
        marginHorizontal: 20
    },
    input:{
        width: '100%',
        height: 40,
        marginVertical: 10,
        backgroundColor: 'skyblue',
        borderRadius: 6,
        paddingHorizontal: 10
    },
    btn:{
        width: '80%',
        height: 40,
        backgroundColor: 'black',
        alignItems: 'center',
        justifyContent: 'center',
        borderRadius: 30
    },
    text:{
        color: 'white'
    }
})