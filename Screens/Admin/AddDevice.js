import {View, Text, SafeAreaView} from 'react-native';
import React from 'react';
import Back from '../../components/Back';
import Header from '../../components/Header';
import {Button, TextInput} from 'react-native-paper';
import {useForm, Controller} from 'react-hook-form';
import {collection, addDoc} from 'firebase/firestore';
import {db} from '../../utils/firebase';
import {useNavigation} from "@react-navigation/native";

const AddDevice = ({route}) => {
    const {customerData} = route.params;

    const navigation = useNavigation();
    /**
     * React hook form ile formu kontrol ediyoruz
     */
    const {
        control,
        handleSubmit,
        formState: {errors},
    } = useForm({
        defaultValues: {},
    });

    const [error, setError] = React.useState(null);

    /**
     *
     * Kullanıcı kayıt işlemini yapacak fonksiyon
     * burada usertype değeri customer olarak gönderiyoruz
     */
    const addDevice = data => {
        const newDevice = {
            name: data.deviceName,
            userid: customerData.id
        };
        addDoc(collection(db, 'devices'), newDevice)
            .then((docRef) => {
                navigation.navigate(
                    'DeviceList',
                    {
                        customerData,
                        newDevice: {
                            ...newDevice,
                            id: docRef.id
                        }
                    }
                )
            })
            .catch((err) => {
                setError(err.message);
                console.log(err);
            });
    };

    const onSubmit = (data) => {
        addDevice(data);
    };

    return (
        <SafeAreaView className="bg-white flex-1">
            <Back/>
            <Header title="Add Device">
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
                    render={({field: {onChange, onBlur, value}}) => (
                        <>
                            <TextInput
                                mode="outlined"
                                label={'Name'}
                                onChangeText={onChange}
                                value={value}
                            />
                        </>
                    )}
                    name="deviceName"
                />
                {errors.deviceName && errors.deviceName.type === 'required' && (
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
                    Save
                </Button>
            </Header>
        </SafeAreaView>
    );
};

export default AddDevice;
