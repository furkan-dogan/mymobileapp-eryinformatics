import { View, Text } from 'react-native';
import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import Login from '../Screens/Login';
import Home from '../Screens/Home';
import AddCustomer from '../Screens/Admin/AddCustomer';
import CustomerList from '../Screens/Admin/CustomerList';
import CustomerDetail from '../Screens/Admin/CustomerDetail';
import UpdateCustomerList from '../Screens/Admin/UpdateCustomerList';
import UpdateCustomer from '../Screens/Admin/CustomerUpdate';
import DeleteCustomer from '../Screens/Admin/DeleteCustomer';
import OpenTicket from '../Screens/Users/OpenTicket';
import Tickets from '../Screens/Admin/Tickets';
import TicketDetail from '../Screens/TicketDetail';
import UserList from '../Screens/Admin/UserList';
import AddUser from '../Screens/Admin/AddUser';
import UpdateUser from '../Screens/Admin/UpdateUser';
import MyNotes from '../Screens/MyNotes';
import UpdateNote from '../Screens/Admin/UpdateNote';
import OnlyCustomerNotes from '../Screens/Admin/OnlyCustomerNotes';
import ChangePassword from '../Screens/ChangePassword';
import CustomerInfo from "../Screens/Admin/CustomerInfo";
import DeviceList from "../Screens/Admin/DeviceList";
import AddDevice from "../Screens/Admin/AddDevice";
import DeviceRecords from "../Screens/Admin/DeviceRecords";
import AddDeviceRecord from "../Screens/Admin/AddDeviceRecord";

const index = () => {
  const Stack = createNativeStackNavigator();
  return (
    <NavigationContainer>
      <Stack.Navigator
        screenOptions={{
          headerShown: false,
        }}
      >
        <Stack.Screen name="Login" component={Login} />
        <Stack.Screen name="Home" component={Home} />
        <Stack.Screen name="AddCustomer" component={AddCustomer} />
        <Stack.Screen name="CustomerList" component={CustomerList} />
        <Stack.Screen name="CustomerInfo" component={CustomerInfo} />
        <Stack.Screen name="DeviceList" component={DeviceList} />
        <Stack.Screen name="AddDevice" component={AddDevice} />
        <Stack.Screen name="DeviceRecords" component={DeviceRecords} />
        <Stack.Screen name="AddDeviceRecord" component={AddDeviceRecord} />
        <Stack.Screen name="CustomerDetail" component={CustomerDetail} />
        <Stack.Screen
          name="UpdateCustomerList"
          component={UpdateCustomerList}
        />
        <Stack.Screen name="UpdateCustomer" component={UpdateCustomer} />
        <Stack.Screen name="DeleteCustomer" component={DeleteCustomer} />
        <Stack.Screen name="OpenTicket" component={OpenTicket} />
        <Stack.Screen name="Tickets" component={Tickets} />
        <Stack.Screen name="UserList" component={UserList} />

        <Stack.Screen
          name="TicketDetail"
          component={TicketDetail}
        ></Stack.Screen>

        <Stack.Screen name="UpdateUser" component={UpdateUser}></Stack.Screen>

        <Stack.Screen name="AddUser" component={AddUser}></Stack.Screen>
        <Stack.Screen name="MyNotes" component={MyNotes}></Stack.Screen>
        <Stack.Screen name="UpdateNote" component={UpdateNote}></Stack.Screen>
        <Stack.Screen
          name="OnlyCustomerNotes"
          component={OnlyCustomerNotes}
        ></Stack.Screen>
        <Stack.Screen
          name="ChangePassword"
          component={ChangePassword}
        ></Stack.Screen>
      </Stack.Navigator>
    </NavigationContainer>
  );
};

export default index;
