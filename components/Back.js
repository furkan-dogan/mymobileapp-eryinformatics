import { View, Text, TouchableOpacity } from 'react-native';
import React from 'react';
import { Ionicons } from '@expo/vector-icons';
import { useNavigation } from '@react-navigation/native';

const Back = () => {
  const navigation = useNavigation();

  return (
    <View>
      <TouchableOpacity
        className="px-2 py-1"
        onPress={() => {
          navigation.goBack();
        }}
      >
        <Ionicons name="chevron-back-circle-outline" size={40} color="black" />
      </TouchableOpacity>
    </View>
  );
};

export default Back;
