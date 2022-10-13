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
import {
  collection,
  query,
  where,
  getDocs,
  updateDoc,
  doc,
} from 'firebase/firestore';
import { db, auth } from '../../utils/firebase';
import { Feather } from '@expo/vector-icons';
import { FontAwesome } from '@expo/vector-icons';
import { useNavigation } from '@react-navigation/native';
import { AntDesign } from '@expo/vector-icons';
import { deleteUser } from 'firebase/auth';
import { Entypo } from '@expo/vector-icons';

const DeleteCustomer = () => {
  const navigation = useNavigation();
  const [customers, setCustomers] = React.useState([]);
  const [error, setError] = React.useState('');
  /**
   * kullanıcıları listelemek için kullanılan fonksiyon
   */
  const getCustomerList = async () => {
    const q = query(collection(db, 'users'));
    const querySnapshot = await getDocs(q);
    setCustomers([]);
    querySnapshot.forEach((doc) => {
      // doc.data() is never undefined for query doc snapshots
      // console.log(doc.id, ' => ', doc.data());

      setCustomers((prev) => [...prev, { ...doc.data(), id: doc.id }]);
    });
  };

  /**
   * kullanıcıyı silmek için kullanılan fonksiyon
   */
  const delteCustomerWithId = async (itemId, isActive) => {
    const docRef = doc(db, 'users', itemId);

    try {
      await updateDoc(docRef, {
        isActive: !isActive,
      });
      getCustomerList();
      console.log('Document successfully updated!');
    } catch (e) {
      console.log(e);
    }
  };

  React.useEffect(() => {
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
      <Header title={'Customer List' + ' (' + customers.length + ')'}>
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
                    onPress={() => delteCustomerWithId(item.id, item.isActive)}
                  >
                    {item.isActive ? (
                      <AntDesign name="delete" size={24} color="red" />
                    ) : (
                      <Entypo name="block" size={24} color="red" />
                    )}
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

export default DeleteCustomer;
