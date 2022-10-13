import {View, Text, SafeAreaView} from 'react-native';
import React from 'react';
import Back from '../../components/Back';
import Header from '../../components/Header';
import {Button, TextInput} from 'react-native-paper';
import {useForm, Controller} from 'react-hook-form';
import {collection, addDoc} from 'firebase/firestore';
import {auth, db} from '../../utils/firebase';
import {createUserWithEmailAndPassword} from 'firebase/auth';

const AddCustomer = () => {
  /**
   * React hook form ile formu kontrol ediyoruz
   */
  const {
    control,
    handleSubmit,
    formState: { errors },
  } = useForm({
    defaultValues: {},
  });

  /**
   * Kullanıcı kayıt işlemini yapacak fonksiyon
   *
   */
  const onSubmit = (data) => {
    registerUser(data);
  };

  const [error, setError] = React.useState(null);

    /**
     *
     * Kullanıcı kayıt işlemini yapacak fonksiyon
     * burada usertype değeri customer olarak gönderiyoruz
     */
    const registerUser = async (data) => {
        createUserWithEmailAndPassword(auth, data.email, data.password)
            .then((user) => {
                addDoc(collection(db, 'users', user.user.uid), {
                    address: data.address,
                    email: data.email,
                    full_name: data.firstName,
                    ip: data.ip,
                    phone: data.phone,
                    device_brand: data.device_brand,
                    password: data.password,
                    isActive: true,
                    isAdmin: false,
                    userType: 'customer',
                    read: false,
                    write: false,
                    delete: false,
                });
            })
            .catch((err) => {
                setError(err.message);
                console.log(err);
            });
    };

  return (
    <SafeAreaView className="bg-white flex-1">
      <Back />
      <Header title="Add Customer">
        {error !== null && (
          <View>
            <Text className="text-red-500 my-2 text-lg">{error}</Text>
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

        <Controller
          control={control}
          rules={{
            required: true,
          }}
          render={({ field: { onChange, onBlur, value } }) => (
            <>
              <TextInput
                mode="outlined"
                label={'Password'}
                onChangeText={onChange}
                value={value}
                secureTextEntry={true}
              />
            </>
          )}
          name="password"
        />
        {errors.password && errors.password.type == 'required' && (
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
          Register to customer
        </Button>
      </Header>
    </SafeAreaView>
  );
};

export default AddCustomer;
