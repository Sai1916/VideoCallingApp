import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { StyleSheet, Text, View } from 'react-native';
import Calling from './src/Calling';
import Contacts from './src/Contacts';
import IncomingCall from './src/IncomingCall';
import Login from './src/Login';
 
export default function App() {

  const Stack = createNativeStackNavigator();

  return (
    <NavigationContainer> 
      <Stack.Navigator initialRouteName='Login' screenOptions={{headerShown: false}}>
        <Stack.Screen name="Contacts" component={Contacts}/>
        <Stack.Screen name="Calling" component={Calling}/>
        <Stack.Screen name="IncomingCall" component={IncomingCall}/>
        <Stack.Screen name="Login" component={Login}/>
      </Stack.Navigator>
    </NavigationContainer>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
  },
});
