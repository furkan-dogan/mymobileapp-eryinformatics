import { View, Text, SafeAreaView, TouchableOpacity } from 'react-native';
import React from 'react';
import Back from '../../components/Back';
import Header from '../../components/Header';
import { Controller, useForm } from 'react-hook-form';
import { Button, TextInput } from 'react-native-paper';
import * as ImagePicker from 'expo-image-picker';
import { auth, db, storage } from '../../utils/firebase';

import {
  getDownloadURL,
  getStorage,
  ref,
  uploadBytes,
  uploadBytesResumable,
} from 'firebase/storage';
import { addDoc, collection } from 'firebase/firestore';

const OpenTicket = () => {
  const [image, setImage] = React.useState(null);
  const [loading, setLoading] = React.useState(false);
  const [progress, setProgress] = React.useState(0);
  const {
    control,
    handleSubmit,
    formState: { errors },
    reset,
  } = useForm({
    defaultValues: {},
  });

  const onSubmit = (data) => {
    const user = auth.currentUser;
    const uid = user.uid;

    setLoading(true);

    const docRef = addDoc(collection(db, 'tickets'), {
      title: data.title,
      description: data.description,
      user_id: uid,
      ticket_case: false,
      ticket_date: new Date(),
    }).then((data) => {
      console.log('Document written with ID2: ', data.id);
      reset({
        title: '',
        description: '',
      });
      setImage(null);
      if (!image) {
        setLoading(false);
        return;
      }
      if (image) {
        uploadImageWithFirebase(image, data.id);
      }
    });
  };

  const uploadImageWithFirebase = async (image, ticketId) => {
    // get user data

    const user = auth.currentUser;
    const uid = user.uid;

    const img = await fetch(image.uri);
    const blob = await img.blob();
    const name = Date.now() + image.uri.split('/').pop();
    const storageRef = ref(
      getStorage(),
      'tickets/' + uid + '/' + ticketId + '/' + name
    );

    const uploadTask = uploadBytesResumable(storageRef, blob);

    uploadTask.on(
      'state_changed',
      (snapshot) => {
        const progress =
          (snapshot.bytesTransferred / snapshot.totalBytes) * 100;
        setProgress(progress);
        switch (snapshot.state) {
          case 'paused':
            console.log('Upload is paused');
            break;
          case 'running':
            console.log('Upload is running');
            break;
        }
      },
      (error) => {},
      () => {
        setLoading(false);
        getDownloadURL(uploadTask.snapshot.ref).then((downloadURL) => {
          console.log('File available at', downloadURL);
        });
      }
    );
  };

  const pickImage = async () => {
    // No permissions request is necessary for launching the image library
    let result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.All,
      allowsEditing: true,
      aspect: [4, 3],
      quality: 1,
    });

    if (!result.cancelled) {
      setImage(result);
    }
  };
  return (
    <SafeAreaView>
      <Back />
      <Header title="Create Ticket">
        {loading && (
          <View>
            <Text className=" my-2 text-lg">
              Loading {Math.round(progress) + '%'}
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
                label={'Title'}
                onChangeText={onChange}
                value={value}
              />
              {errors.title && errors.title.type == 'required' && (
                <Text style={{ color: 'red' }}>This is required</Text>
              )}
            </>
          )}
          name="title"
        />

        <Controller
          control={control}
          rules={{
            required: true,
          }}
          render={({ field: { onChange, onBlur, value } }) => (
            <>
              <TextInput
                mode="outlined"
                label={'Description'}
                multiline={true}
                onChangeText={onChange}
                value={value}
              />
              {errors.description && errors.description.type === 'required' && (
                <Text className="text-red-500 my-1">This is required.</Text>
              )}
            </>
          )}
          name="description"
        />

        <Button
          mode="outlined"
          onPress={pickImage}
          className="mt-2 rounded text-start"
          contentStyle={{
            color: 'black',
          }}
          textColor="black"
        >
          Upload Image
        </Button>

        <TouchableOpacity
          onPress={handleSubmit(onSubmit)}
          disabled={loading == true ? true : false}
        >
          <Button mode="outlined" className="mt-2 rounded">
            {loading == true ? (
              <Text className="text-black">Loading...</Text>
            ) : (
              <Text className="text-black">Submit</Text>
            )}
          </Button>
        </TouchableOpacity>
      </Header>
    </SafeAreaView>
  );
};

export default OpenTicket;
