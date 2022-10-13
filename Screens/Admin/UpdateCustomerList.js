import {
  View,
  Text,
  SafeAreaView,
  FlatList,
  TouchableOpacity,
} from 'react-native';
import React from 'react';
import Back from '../../components/Back';
import Header from '../../components/Header';
import { collection, query, where, getDocs } from 'firebase/firestore';
import { db } from '../../utils/firebase';
import { Feather } from '@expo/vector-icons';
import { FontAwesome } from '@expo/vector-icons';
import { useNavigation } from '@react-navigation/native';

const UpdateCustomerList = ({ route }) => {
  const navigation = useNavigation();
  const [customers, setCustomers] = React.useState([]);

  /**
   * kullanıcıları listelemek için kullanılan fonksiyon
   */
  const getCustomerList = async () => {
    const q = query(collection(db, 'users'));
    const querySnapshot = await getDocs(q);
    setCustomers([]);
    querySnapshot.forEach((doc) => {
      // doc.data() is never undefined for query doc snapshots

      if (doc.data().isActive) {
        setCustomers((prev) => [...prev, { ...doc.data(), id: doc.id }]);
      }
    });
  };

  React.useEffect(() => {
    navigation.addListener('focus', () => {
      getCustomerList();
    });

    let mounted = true;
    if (mounted) {
      getCustomerList();
    }

    return () => {
      mounted = false;
    };
  }, []);

  return (
    <SafeAreaView>
      <Back />
      <Header title={'Update Customer List' + ' (' + customers.length + ')'}>
        <View>
          <View>
            <FlatList
              data={customers}
              renderItem={({ item }) => (
                <View className="flex flex-row justify-between items-center mb-4 border-b pb-2 border-gray-300">
                  <View className="flex flex-row items-center space-x-2">
                    <Feather name="user" size={30} color="black" />
                    <Text className="text-lg">{item.full_name}</Text>
                  </View>
                  <TouchableOpacity
                    onPress={() =>
                      navigation.navigate('UpdateCustomer', { item })
                    }
                  >
                    <FontAwesome
                      name="long-arrow-right"
                      size={30}
                      color="black"
                    />
                  </TouchableOpacity>
                </View>
              )}
            />
          </View>
        </View>
      </Header>
    </SafeAreaView>
  );
};

export default UpdateCustomerList;
