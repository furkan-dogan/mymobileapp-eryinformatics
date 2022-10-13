import React from 'react';
import {DataTable, IconButton} from 'react-native-paper';

import Back from "../../components/Back";
import Header from "../../components/Header";
import {SafeAreaView, Text, TouchableOpacity, View} from "react-native";
import {useNavigation} from "@react-navigation/native";
import DeviceRecordRow from "../../components/DeviceRecordRow";

const DeviceRecords = ({route}) => {
    const navigation = useNavigation();
    const {deviceData, customerData} = route.params;

    const handleEditClicked = deviceRecord => {
        navigation.navigate('AddDeviceRecord', {deviceData, customerData, deviceRecord})
    }

    return (
        <SafeAreaView className="bg-white flex-1">
            <Back/>
            <TouchableOpacity
                onPress={() => navigation.navigate('AddDeviceRecord', {deviceData, customerData})}
                className="mb-4"
            >
                <View className="flex flex-row justify-end ">
                    <View className="flex flex-row items-center justify-end  w-32 px-2 border-b border-black">
                        <IconButton
                            disabled={true}
                            icon="plus"
                            size={30}
                        />
                        <Text className="text-green-500">Add Device Record</Text>
                    </View>
                </View>
            </TouchableOpacity>
            <Header title='Device Records'/>
            <DataTable>
                <DataTable.Header>
                    <DataTable.Title>IP</DataTable.Title>
                    <DataTable.Title>Model</DataTable.Title>
                    <DataTable.Title>Username</DataTable.Title>
                    <DataTable.Title>Password</DataTable.Title>
                    <DataTable.Title>Actions</DataTable.Title>
                </DataTable.Header>
                {
                    deviceData.records.map(record => (
                        <DeviceRecordRow
                            record={record}
                            onEditClicked={handleEditClicked}
                        />
                    ))
                }
            </DataTable>
        </SafeAreaView>
    );
};

export default DeviceRecords;