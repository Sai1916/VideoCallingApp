import { StyleSheet, View, Text, FlatList, Pressable, Alert } from 'react-native'
import React, { useEffect } from 'react'
import data from "../assets/data/contacts.json"
import { useNavigation } from '@react-navigation/native'
import {Voximplant} from 'react-native-voximplant'

const Contacts = () => {

  const navigation = useNavigation();

  const voximplant = Voximplant.getInstance();


  useEffect(() => {
    voximplant.on(Voximplant.ClientEvents.IncomingCall, incomingCallEvent => {
      navigation.navigate('IncomingCall',{call: incomingCallEvent.call})
    })

    return () => {
      voximplant.off(Voximplant.ClientEvents.IncomingCall);
    }

  },[])


  const callUser = user => {
    navigation.navigate("Calling", {user})
  }

  return (
    <View style={styles.page}>
      <FlatList 
          data={data}
          renderItem={({item}) => 
            <Pressable key={item.user_id} onPress={() => callUser(item)}>
              <Text style={styles.contactName}>{item.user_display_name}</Text>
            </Pressable>
          }
          ItemSeparatorComponent={() => <View style={styles.separator} />}
      />
    </View>
  )
}


const styles = StyleSheet.create({
  page: {
    paddingVertical: 26,
    paddingHorizontal: 15,
    backgroundColor: 'white',
    flex: 1,
  },
  contactName: {
    fontSize: 16,
    marginVertical: 10,
    color: 'black'
  },
  separator: {
    width: '100%',
    height: 1,
    backgroundColor: '#f0f0f0',
  },
  searchInput: {
    backgroundColor: '#f0f0f0',
    padding: 10,
    borderRadius: 5,
  },
});

export default Contacts