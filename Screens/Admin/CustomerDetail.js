import { View, Text, SafeAreaView } from 'react-native';
import React from 'react';
import Back from '../../components/Back';
import Header from '../../components/Header';
import { AntDesign } from '@expo/vector-icons';
import { MaterialIcons } from '@expo/vector-icons';
import { Entypo } from '@expo/vector-icons';

const CustomerDetail = ({ route }) => {
  /**
   * gelen parametreyi alıyoruz içerisinde kullanıcın bilgileri var ve ekrana basıyoruz
   */
  const { item } = route.params;

  return (
    <SafeAreaView>
      <Back />

      <Header title={item.full_name}>
        <View>
          <View className="flex flex-row items-center space-x-2 border-b pb-1 border-gray-300 mb-3">
            <AntDesign name="user" size={24} color="black" />
            <Text>{item.full_name}</Text>
          </View>
          <View className="flex flex-row items-center space-x-2 border-b pb-1 border-gray-300 mb-3">
            <AntDesign name="mail" size={24} color="black" />
            <Text>{item.email}</Text>
          </View>
          <View className="flex flex-row items-center space-x-2 border-b pb-1 border-gray-300 mb-3">
            <AntDesign name="phone" size={24} color="black" />
            <Text>{item.phone}</Text>
          </View>

          <View className="flex flex-row items-center space-x-2 border-b pb-1 border-gray-300 mb-3">
            <MaterialIcons name="device-hub" size={24} color="black" />

            <Text>Device Brand: {item.device_brand}</Text>
          </View>

          <View className="flex flex-row items-center space-x-2 border-b pb-1 border-gray-300 mb-3">
            <Entypo name="address" size={24} color="black" />
            <Text>Address: {item.address}</Text>
          </View>
        </View>
      </Header>
    </SafeAreaView>
  );
};

export default CustomerDetail;
