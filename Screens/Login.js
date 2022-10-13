import { View, Text } from 'react-native';
import React from 'react';

import logo from '../assets/logo.png';
import { Image } from 'react-native';
import { Button, TextInput } from 'react-native-paper';
import {
  onAuthStateChanged,
  signInWithEmailAndPassword,
  signOut,
} from 'firebase/auth';
import { auth, db } from '../utils/firebase';
import { useNavigation } from '@react-navigation/native';
import {doc, getDoc} from 'firebase/firestore';

const Login = () => {
  /**
   * sayfalar arası geçiş için navigation hook kullanıyoruz
   */
  const navigation = useNavigation();
  /***
   * Kullanıcıdan aldığımız değerleri state olarak tutuyoruz
   */
  const [email, setEmail] = React.useState(null);
  const [password, setPassword] = React.useState(null);
  const [error, setError] = React.useState(null);

  /**
   * Kullanıcının girişini kontrol ediyoruz
   */
  const handleSubmit = () => {
    signInWithEmailAndPassword(auth, email, password)
      .then((userCredential) => {
        console.log(userCredential.user);
      })
      .catch((error) => {
        alert('Username or password is wrong');
        setError(error.code);
      });
  };

  const getUser = async ({ id }) => {
    const userRef = doc(db, "users", id);
    const querySnapshot = await getDoc(userRef);
    return querySnapshot.data();
  };

  React.useEffect(() => {
    /**
     * Eğer kullanıcı varsa anasayfaya yönlendiriyoruz
     */
    const unsubscribe = onAuthStateChanged(auth, async (user) => {
      if (user) {
        const savedUser = await getUser({id: user.uid});
        if (!savedUser || savedUser.isActive !== true) {
          alert('You are not authorized to login');
          signOut();
        } else {
          navigation.navigate('Home');
        }
        navigation.navigate('Home');
      }
    });

    return unsubscribe;
  }, []);

  return (
    <View
      style={{
        backgroundColor: 'white',
      }}
    >
      <View>
        <Image
          source={logo}
          style={{
            width: '107%',
            height: 280,
            marginTop: 100,
          }}
        />
      </View>

      <View
        style={{
          display: 'flex',
          flexDirection: 'column',
          marginTop: 50,
        }}
        className="px-2"
      >
        {
          // Eğer hata varsa ekrana yazdırıyoz
          error == 'auth/invalid-email' && (
            <View className=" border-2 border-red-500 rounded p-1 mb-2">
              <Text className="text-red-500 ">Email is wrong or password</Text>
            </View>
          )
        }

        <TextInput
          mode="outlined"
          label="Email"
          onChangeText={(text) => setEmail(text.trim())}
          autoCapitalize={false}
        />
        <TextInput
          mode="outlined"
          label="Password"
          secureTextEntry={true}
          onChangeText={(text) => setPassword(text.trim())}
        />

        <Button
          icon="login"
          mode="outlined"
          style={{
            borderRadius: 2,
            marginTop: 4,
          }}
          className="py-1"
          onPress={handleSubmit}
        >
          Sign In
        </Button>
      </View>
    </View>
  );
};

export default Login;
