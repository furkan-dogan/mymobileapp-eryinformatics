import React from 'react';
import Back from "../../components/Back";
import {FlatList, SafeAreaView, Text, TouchableOpacity, View} from "react-native";
import Header from "../../components/Header";
import {Feather, FontAwesome} from "@expo/vector-icons";
import {useNavigation} from "@react-navigation/native";

const CustomerInfo = ({route}) => {
    const navigation = useNavigation();

    const {item} = route.params;

    const infos = ["Device List", "Customer Details"];

    const handleArrowClicked = infoItemName => {
        if (infoItemName === infos[0]) {
            navigation.navigate('DeviceList', { customerData: item });
        } else if (infoItemName === infos[1]) {
            navigation.navigate('CustomerDetail', {item});
        }
    };

    return (
        <SafeAreaView className="bg-white flex-1">
            <Back/>
            <Header title='Customer Info'>
                <View>
                    <FlatList
                        data={infos}
                        renderItem={({item: infoItemName}) => (
                            <View
                                className="flex flex-row justify-between items-center mb-4 border-b pb-2 border-gray-300">
                                <View className="flex flex-row items-center space-x-2">
                                    <Feather name="user" size={30} color="black"/>
                                    <Text className="text-lg">{infoItemName}</Text>
                                </View>
                                <View className="flex flex-row space-x-4 items-center">
                                    <TouchableOpacity onPress={() => handleArrowClicked(infoItemName)}>
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
                </View>
            </Header>
        </SafeAreaView>
    );
};

export default CustomerInfo;