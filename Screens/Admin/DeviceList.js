import React, {useEffect, useState} from 'react';
import Back from "../../components/Back";
import Header from "../../components/Header";
import {FlatList, SafeAreaView, Text, TouchableOpacity, View} from "react-native";
import {Feather, FontAwesome} from "@expo/vector-icons";
import {useIsFocused, useNavigation} from "@react-navigation/native";
import {db} from "../../utils/firebase";
import {collection, getDocs, query, where} from "firebase/firestore";

const DeviceList = ({route}) => {
    const isFocused = useIsFocused();
    const navigation = useNavigation();

    const {customerData, newDevice} = route.params;

    const defaultDevices = [
        {name: 'Switch Info', id: 1, records: []},
        {name: 'Server Info', id: 2, records: []}
    ];

    const [devices, setDevices] = useState(defaultDevices);

    const handleArrowClicked = (item) => {
        navigation.navigate('DeviceRecords', {deviceData: item, customerData});
    };

    const handleAddDeviceClicked = () => {
        navigation.navigate('AddDevice', {customerData});
    }

    const fetchDeviceRecords = async () => {
        const q = query(collection(db, "deviceRecords"), where("userID", "==", customerData.id));
        const querySnapshot = await getDocs(q);
        const deviceRecords = {};
        querySnapshot.forEach((doc) => {
            const deviceRecord = doc.data();
            deviceRecords[deviceRecord.deviceID] = deviceRecords[deviceRecord.deviceID]
                ? [...deviceRecords[deviceRecord.deviceID], {...deviceRecord, id: doc.id}]
                : [{...deviceRecord, id: doc.id}]
        });
        return deviceRecords;
    };

    const fetchMyDevices = async () => {
        const q = query(collection(db, "devices"), where("userid", "==", customerData.id));
        const querySnapshot = await getDocs(q);
        const myDevices = [];
        querySnapshot.forEach((doc) => {
            myDevices.unshift({...doc.data(), id: doc.id});
        });

        const records = await fetchDeviceRecords();

        const allDevices = [...defaultDevices, ...myDevices].map(d => ({...d, records: records[d.id] || []}));

        setDevices(allDevices);
    };

    useEffect(() => {
        if (newDevice) {
            setDevices(prevDevices => ([...prevDevices, newDevice]))
        }
    }, [newDevice]);

    useEffect(() => {
        if (isFocused) {
            fetchMyDevices();
        }

    }, [isFocused]);

    return (
        <SafeAreaView className="bg-white flex-1">
            <Back/>
            <Header title='Device List'>
                <View>
                    <FlatList
                        data={devices}
                        renderItem={({item}) => (
                            <View
                                className="flex flex-row justify-between items-center mb-4 border-b pb-2 border-gray-300">
                                <View className="flex flex-row items-center space-x-2">
                                    <Feather name="user" size={30} color="black"/>
                                    <Text className="text-lg">{item.name}</Text>
                                </View>
                                <View className="flex flex-row space-x-4 items-center">
                                    <TouchableOpacity onPress={() => handleArrowClicked(item)}>
                                        <FontAwesome
                                            name="long-arrow-right"
                                            size={30}
                                            color="black"
                                        />
                                    </TouchableOpacity>
                                </View>
                            </View>
                        )}
                    />
                    <TouchableOpacity onPress={handleAddDeviceClicked}>
                        <View
                            className="flex flex-row justify-between items-center mb-4 border-b pb-2 border-gray-300">
                            <View className="flex flex-row space-x-4 items-center">
                                <FontAwesome
                                    name="plus"
                                    size={30}
                                    color="black"
                                />
                            </View>
                            <View className="flex flex-row items-center space-x-2">
                                <Text className="text-lg">Add New Device</Text>
                            </View>
                        </View>
                    </TouchableOpacity>
                </View>
            </Header>
        </SafeAreaView>
    )
        ;
};

export default DeviceList;