import { View, Text, TouchableOpacity } from 'react-native';
import React from 'react';
import { SafeAreaView } from 'react-native-safe-area-context';
import Back from '../components/Back';
import Header from '../components/Header';
import { Button, TextInput } from 'react-native-paper';
import { auth } from '../utils/firebase';
import { Controller, useForm } from 'react-hook-form';
import { updatePassword } from 'firebase/auth';
import { useNavigation } from '@react-navigation/native';

const ChangePassword = () => {
  const navigation = useNavigation();
  const {
    control,
    handleSubmit,
    formState: { errors },
    reset,
  } = useForm({
    defaultValues: {},
  });

  const onSubmit = (data) => {
    if (data.password == data.re_password) {
      updatePassword(auth.currentUser, data.password)
        .then(() => {
          navigation.goBack();
        })
        .catch((error) => {
          console.log(error);
        });
    } else {
      alert('Passwords do not match');
    }
  };
  return (
    <SafeAreaView>
      <Back />
      <Header title="Profile">
        <View>
          <TextInput
            label="Email"
            mode="outlined"
            disabled
            value={auth.currentUser.email}
          />
        </View>

        <Controller
          control={control}
          rules={{
            required: true,
          }}
          render={({ field: { onChange, onBlur, value } }) => (
            <>
              <TextInput
                value={value}
                onChangeText={onChange}
                label="Password"
                mode="outlined"
              />
              {
                // Eğer hata varsa ekrana yazdırıyoz
                errors.password && errors.password.type == 'required' && (
                  <Text className="text-red-500 my-2">This is required.</Text>
                )
              }
            </>
          )}
          name="password"
        />

        <Controller
          control={control}
          rules={{
            required: true,
          }}
          render={({ field: { onChange, onBlur, value } }) => (
            <>
              <TextInput
                value={value}
                onChangeText={onChange}
                label="Re Password"
                mode="outlined"
              />
              {
                // Eğer hata varsa ekrana yazdırıyoz
                errors.re_password && errors.re_password.type == 'required' && (
                  <Text className="text-red-500 my-2">This is required.</Text>
                )
              }
            </>
          )}
          name="re_password"
        />

        <View>
          <TouchableOpacity onPress={handleSubmit(onSubmit)}>
            <Button mode="outlined" className="rounded-none mt-2 py-1">
              Submit
            </Button>
          </TouchableOpacity>
        </View>
      </Header>
    </SafeAreaView>
  );
};

export default ChangePassword;
