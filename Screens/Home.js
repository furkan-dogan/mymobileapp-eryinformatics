import { View, SafeAreaView, ScrollView, TouchableOpacity } from 'react-native';
import React from 'react';
import { List, Text } from 'react-native-paper';
import { FontAwesome5 } from '@expo/vector-icons';
import { Entypo } from '@expo/vector-icons';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { useNavigation } from '@react-navigation/native';
import { signOut } from 'firebase/auth';
import { auth, db } from '../utils/firebase';
import {doc, getDoc} from 'firebase/firestore';
// https://icons.expo.fyi/
const Home = () => {
  const [isAdmin, setIsAdmin] = React.useState('');
  const user = auth.currentUser;
  const userId = user.uid;

  const [currentUser, setCurrentUser] = React.useState(null);
  /**
   * Kullanıcıyı getir yetkilerine bakmak için
   */
  const getUser = async () => {
    const userRef = doc(db, "users", auth.currentUser.uid);
    const querySnapshot = await getDoc(userRef);
    const user = querySnapshot.data();
    setCurrentUser(user);
    setIsAdmin(user.isAdmin);
  };

  React.useEffect(() => {
    getUser();
  }, []);

  const navigation = useNavigation();
  return (
    <SafeAreaView className="bg-white flex-1">
      <Text className="text-center underline uppercase text-gray-600 text-3xl">
          ERYMobileApp
      </Text>
      <ScrollView>
        {isAdmin ? (
          <>
            <View className="w-100">
              <TouchableOpacity
                onPress={() => navigation.navigate('CustomerList')}
                className="flex flex-row items-center border-b border-gray-200 space-x-2 py-4 px-2"
              >
                <FontAwesome5 name="user-cog" size={30} color="gray" />
                <Text className="text-xl">Customers</Text>
              </TouchableOpacity>
            </View>

            <View className="w-100">
              <TouchableOpacity
                onPress={() => navigation.navigate('UserList')}
                className="flex flex-row items-center border-b border-gray-200 space-x-2 py-4 px-2"
              >
                <FontAwesome5 name="user-cog" size={30} color="gray" />
                <Text className="text-xl">Users</Text>
              </TouchableOpacity>
            </View>

            <View className="w-100">
              <TouchableOpacity
                onPress={() => navigation.navigate('MyNotes')}
                className="flex flex-row items-center border-b border-gray-200 space-x-2 py-4 px-2"
              >
                <FontAwesome5 name="pen" size={30} color="gray" />
                <Text className="text-xl">Notes</Text>
              </TouchableOpacity>
            </View>

            <View className="w-100">
              <TouchableOpacity
                onPress={() => navigation.navigate('Tickets')}
                className="flex flex-row items-center border-b border-gray-200 space-x-2 py-4 px-2"
              >
                <Entypo name="ticket" size={30} color="gray" />
                <Text className="text-xl">Tickets</Text>
              </TouchableOpacity>
            </View>

            <View className="w-100">
              <TouchableOpacity
                onPress={() => navigation.navigate('ChangePassword')}
                className="flex flex-row items-center border-b border-gray-200 space-x-2 py-4 px-2"
              >
                <Entypo name="user" size={30} color="gray" />
                <Text className="text-xl">Profile</Text>
              </TouchableOpacity>
            </View>
          </>
        ) : (
          <>
            <View className="w-100">
              <TouchableOpacity
                onPress={() => navigation.navigate('Tickets')}
                className="flex flex-row items-center border-b border-gray-200 space-x-2 py-4 px-2"
              >
                <Entypo name="ticket" size={30} color="gray" />
                <Text className="text-xl">Tickets</Text>
              </TouchableOpacity>
            </View>

            <View className="w-100">
              <TouchableOpacity
                onPress={() => navigation.navigate('MyNotes')}
                className="flex flex-row items-center border-b border-gray-200 space-x-2 py-4 px-2"
              >
                <FontAwesome5 name="pen" size={30} color="gray" />
                <Text className="text-xl">Notes</Text>
              </TouchableOpacity>
            </View>
          </>
        )}

        <View className="w-100">
          <TouchableOpacity
            onPress={() => {
              signOut(auth)
                .then(() => {
                  navigation.navigate('Login');
                })
                .catch((error) => {
                  console.log(error);
                });
            }}
            className="flex flex-row items-center border-b border-gray-200 space-x-2 py-4 px-2"
          >
            <MaterialCommunityIcons name="logout" size={30} color="gray" />
            <Text className="text-xl">Logout</Text>
          </TouchableOpacity>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
};

export default Home;
