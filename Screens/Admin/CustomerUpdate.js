import { View, Text, SafeAreaView } from 'react-native';
import React from 'react';
import Back from '../../components/Back';
import Header from '../../components/Header';
import { Button, TextInput } from 'react-native-paper';
import { useForm, Controller } from 'react-hook-form';
import { collection, addDoc, doc, updateDoc } from 'firebase/firestore';
import { app, auth, db } from '../../utils/firebase';
import { createUserWithEmailAndPassword } from 'firebase/auth';

const UpdateCustomer = ({ route }) => {
  const { item } = route.params;

  /**
   * React hook form ile formu kontrol ediyoruz
   */
  const {
    control,
    handleSubmit,
    formState: { errors },
    reset,
  } = useForm({
    defaultValues: {},
  });
  /**
   * güncelleme işlemini yapacak fonksiyon
   */
  const onSubmit = (data) => {
    updateUser(data);
  };

  React.useEffect(() => {
    /**
     * güncelleme ekranına gelen verileri formda göstermek için kullanıyoruz
     */
    reset({
      firstName: item.full_name,
      email: item.email,
      phone: item.phone,
      address: item.address,
      device_brand: item.device_brand,
      ip: item.ip,
      password: item.password,
    });
  }, []);

  const [error, setError] = React.useState({});

  /**
   *  güncelleme işlemini yapacak fonksiyon
   */
  const updateUser = async (data) => {
    const docRef = doc(db, 'users', item.id);
    try {
      await updateDoc(docRef, {
        full_name: data.firstName,
        email: data.email,
        phone: data.phone,
        address: data.address,
        device_brand: data.device_brand,
        ip: data.ip,
      });
      setError({
        message: 'User updated successfully',
        status: true,
      });
    } catch (e) {
      setError({
        message: e.message,
        status: false,
      });
      console.error('Error updating document: ', e);
    }
  };

  return (
    <SafeAreaView className="bg-white flex-1">
      <Back />
      <Header title={'Update ' + item.full_name}>
        {error !== null && (
          <View>
            <Text
              className={`${
                error.status ? 'text-green-500' : 'text-red-500'
              } my-2 text-lg`}
            >
              {error.message}
            </Text>
          </View>
        )}
        <Controller
          control={control}
          rules={{
            required: true,
          }}
          render={({ field: { onChange, onBlur, value } }) => (
            <>
              <TextInput
                mode="outlined"
                label={'Full Name'}
                onChangeText={onChange}
                value={value}
              />
            </>
          )}
          name="firstName"
        />
        {errors.firstName && errors.firstName.type == 'required' && (
          <Text className="text-red-500 my-2">This is required.</Text>
        )}

        <Controller
          control={control}
          rules={{
            required: true,
          }}
          render={({ field: { onChange, onBlur, value } }) => (
            <>
              <TextInput
                mode="outlined"
                label={'Email'}
                onChangeText={onChange}
                value={value}
                autoCapitalize={false}
              />
            </>
          )}
          name="email"
        />
        {errors.email && errors.email.type == 'required' && (
          <Text className="text-red-500 my-2">This is required.</Text>
        )}

        <Controller
          control={control}
          rules={{
            required: true,
          }}
          render={({ field: { onChange, onBlur, value } }) => (
            <>
              <TextInput
                mode="outlined"
                label={'Phone'}
                onChangeText={onChange}
                value={value}
                keyboardType="numeric"
              />
            </>
          )}
          name="phone"
        />
        {errors.phone && errors.phone.type == 'required' && (
          <Text className="text-red-500 my-2">This is required.</Text>
        )}

        <Controller
          control={control}
          rules={{
            required: true,
          }}
          render={({ field: { onChange, onBlur, value } }) => (
            <>
              <TextInput
                mode="outlined"
                label={'Address'}
                onChangeText={onChange}
                value={value}
              />
            </>
          )}
          name="address"
        />
        {errors.address && errors.address.type == 'required' && (
          <Text className="text-red-500 my-2">This is required.</Text>
        )}

        <Controller
          control={control}
          rules={{
            required: true,
          }}
          render={({ field: { onChange, onBlur, value } }) => (
            <>
              <TextInput
                mode="outlined"
                label={'Device Brand'}
                onChangeText={onChange}
                value={value}
              />
            </>
          )}
          name="device_brand"
        />
        {errors.device_brand && errors.device_brand.type == 'required' && (
          <Text className="text-red-500 my-2">This is required.</Text>
        )}

        <Controller
          control={control}
          rules={{
            required: true,
          }}
          render={({ field: { onChange, onBlur, value } }) => (
            <>
              <TextInput
                mode="outlined"
                label={'IP'}
                onChangeText={onChange}
                value={value}
              />
            </>
          )}
          name="ip"
        />
        {errors.ip && errors.ip.type == 'required' && (
          <Text className="text-red-500 my-2">This is required.</Text>
        )}

        <Button
          mode="outlined"
          className="mt-4"
          onPress={handleSubmit(onSubmit)}
          style={{
            borderRadius: 0,
            paddingVertical: 4,
          }}
        >
          Update To {item.full_name}
        </Button>
      </Header>
    </SafeAreaView>
  );
};

export default UpdateCustomer;
