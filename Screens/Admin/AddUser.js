import { View, Text, SafeAreaView } from 'react-native';
import React from 'react';
import Back from '../../components/Back';
import Header from '../../components/Header';
import {Button, Checkbox, TextInput} from 'react-native-paper';
import {useForm, Controller} from 'react-hook-form';
import {collection, addDoc} from 'firebase/firestore';
import {auth, db} from '../../utils/firebase';
import {createUserWithEmailAndPassword} from 'firebase/auth';

const AddUser = () => {
  const {
    control,
    handleSubmit,
    formState: { errors },
  } = useForm({
    defaultValues: {},
  });

  const onSubmit = (data) => {
    registerUser(data);
  };

  /**
   * Kullanıcı kayıt işlemini yapacak fonksiyon
   */
  const [read, setRead] = React.useState(false);
  const [del, setDelete] = React.useState(false);
  const [write, setWrite] = React.useState(false);

  const [error, setError] = React.useState(null);

  const registerUser = async (data) => {
    data.read = read;
    data.write = write;
    data.delete = del;

    /**
     * Kullanıcıyı firebase auth ile kayıt ediyoruz sonrasında firestore'a kayıt ediyoruz
     * firestore'a kayıt ederken kullanıcıya ait verileri de ekliyoruz
     */

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
                    isAdmin: true,
                    userType: 'user',
                    read: data.read,
                    write: data.write,
                    delete: data.delete,
                })
            })
            .catch((err) => {
                setError(err.message);
                console.log(err);
            });
    };

  return (
    <SafeAreaView className="bg-white flex-1">
      <Back />
      <Header title="Add User">
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

        <View className="flex flex-col items-center border mt-2 border-gray-400 p-2 rounded">
          <View>
            <Text className="text-xl mt-2">Select Role</Text>
          </View>
          <View className="flex flex-row items-center space-x-3">
            <View>
              <Checkbox
                status={read ? 'checked' : 'indeterminate'}
                onPress={() => {
                  setRead(!read);
                }}
              />
              <Text>Read</Text>
            </View>
            <View>
              <Checkbox
                status={del ? 'checked' : 'indeterminate'}
                onPress={() => {
                  setDelete(!del);
                }}
              />
              <Text>Delete</Text>
            </View>
            <View>
              <Checkbox
                status={write ? 'checked' : 'indeterminate'}
                onPress={() => {
                  setWrite(!write);
                }}
              />
              <Text>Write</Text>
            </View>
          </View>
        </View>
        <Button
          mode="outlined"
          className="mt-4"
          onPress={handleSubmit(onSubmit)}
          style={{
            borderRadius: 0,
            paddingVertical: 4,
          }}
        >
          Register
        </Button>
      </Header>
    </SafeAreaView>
  );
};

export default AddUser;
