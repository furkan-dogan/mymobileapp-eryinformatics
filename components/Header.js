import { View, Text } from 'react-native';
import React from 'react';

const Header = ({ children, title }) => {
  return (
    <View>
      <View className="border-b border-gray-200 mb-2">
        <Text className="text-center text-xl text-gray-900 font-light">
          {title}
        </Text>
      </View>
      <View className="px-4 py-2">{children}</View>
    </View>
  );
};

export default Header;
