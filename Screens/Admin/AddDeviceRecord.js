import {View, Text, SafeAreaView} from 'react-native';
import React, {useState} from 'react';
import Back from '../../components/Back';
import Header from '../../components/Header';
import {Button, TextInput} from 'react-native-paper';
import {useForm, Controller} from 'react-hook-form';
import {collection, addDoc, updateDoc, doc} from 'firebase/firestore';
import {db} from '../../utils/firebase';
import {useNavigation} from "@react-navigation/native";

const AddDeviceRecord = ({route}) => {
    const {deviceData, customerData, deviceRecord} = route.params;
    const {id: deviceID} = deviceData;
    const {id: customerID} = customerData;

    const navigation = useNavigation();
    const [error, setError] = useState(null);
    const defaultValues = deviceRecord || {};

    const {
        control,
        handleSubmit,
        formState: {errors},
    } = useForm({defaultValues});

    const saveDeviceRecord = async (data) => {
        try {
            const newRecord = {
                model: data.model,
                ip: data.ip,
                username: data.username,
                password: data.password,
                deviceID,
                userID: customerID
            };

            if (deviceRecord) {
                await updateDoc(doc(db, 'deviceRecords', deviceRecord.id), newRecord);
            } else {
                await addDoc(collection(db, 'deviceRecords'), newRecord);
            }

            navigation.navigate(
                'DeviceRecords',
                {
                    deviceData: {
                        ...deviceData,
                        records: [
                            ...deviceData.records,
                            newRecord
                        ]
                    },
                    customerData
                }
            )
        } catch (err) {
            setError(err.message);
            console.log(err);
        }
    };

    return (
        <SafeAreaView className="bg-white flex-1">
            <Back/>
            <Header title="Add Device Record">
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
                    render={({field: {onChange, value}}) => (
                        <>
                            <TextInput
                                mode="outlined"
                                label={'Model'}
                                onChangeText={onChange}
                                value={value}
                                autoCapitalize='none'
                            />
                        </>
                    )}
                    name="model"
                />
                {errors.model && errors.model.type === 'required' && (
                    <Text className="text-red-500 my-2">This is required.</Text>
                )}

                <Controller
                    control={control}
                    rules={{
                        required: true,
                    }}
                    render={({field: {onChange, value}}) => (
                        <TextInput
                            mode="outlined"
                            label={'IP'}
                            onChangeText={onChange}
                            value={value}
                            autoCapitalize='none'
                        />
                    )}
                    name="ip"
                />
                {errors.ip && errors.ip.type === 'required' && (
                    <Text className="text-red-500 my-2">This is required.</Text>
                )}

                <Controller
                    control={control}
                    rules={{
                        required: true,
                    }}
                    render={({field: {onChange, value}}) => (
                        <>
                            <TextInput
                                mode="outlined"
                                label={'Username'}
                                onChangeText={onChange}
                                value={value}
                                autoCapitalize='none'
                            />
                        </>
                    )}
                    name="username"
                />
                {errors.username && errors.username.type === 'required' && (
                    <Text className="text-red-500 my-2">This is required.</Text>
                )}

                <Controller
                    control={control}
                    rules={{
                        required: true,
                    }}
                    render={({field: {onChange, value}}) => (
                        <>
                            <TextInput
                                mode="outlined"
                                label={'Password'}
                                onChangeText={onChange}
                                value={value}
                                autoCapitalize='none'
                            />
                        </>
                    )}
                    name="password"
                />
                {errors.password && errors.password.type === 'required' && (
                    <Text className="text-red-500 my-2">This is required.</Text>
                )}

                <Button
                    mode="outlined"
                    className="mt-4"
                    onPress={handleSubmit(saveDeviceRecord)}
                    style={{
                        borderRadius: 0,
                        paddingVertical: 4,
                    }}
                >
                    Save Device Record
                </Button>
            </Header>
        </SafeAreaView>
    );
};

export default AddDeviceRecord;
