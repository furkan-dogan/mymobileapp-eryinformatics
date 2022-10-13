import React from 'react';
import {Text, TouchableOpacity, View} from "react-native";
import {AntDesign, FontAwesome5} from "@expo/vector-icons";

const TicketContent = ({
                           name,
                           title,
                           phone,
                           device,
                           ticket_case,
                           id,
                           ticket_date,
                           assignee,
                           writable,
                           deletable,
                           onButtonClicked,
                           source = 'App'
                       }) => {
    let sec = ticket_date.seconds;
    let date = new Date(sec * 1000);
    let normalDate = date.toLocaleString('tr-TR', {
        timeZone: 'UTC',
    });
    return (
        <View className="flex flex-row justify-between items-center border-b border-gray-400 pb-1 mb-3">
            <View>
                <Text>Customer Name: {name}</Text>
                <Text>Title: {title}</Text>
                <Text>Phone: {phone}</Text>
                <Text>Device: {device}</Text>
                <Text>Date: {normalDate}</Text>
                <Text>Source: {source}</Text>
                <Text>Assignee: {assignee}</Text>
            </View>
            <View className="flex flex-row items-center space-x-6">
                {writable && deletable && (
                    <TouchableOpacity onPress={() => onButtonClicked({id, ticket_case})}>
                        {ticket_case ? (
                            <AntDesign name="close" size={24} color="black"/>
                        ) : (
                            <FontAwesome5 name="check" size={24} color="black"/>
                        )}
                    </TouchableOpacity>
                )}
            </View>
        </View>
    );
};

export default TicketContent;