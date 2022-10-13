import { View, Text, SafeAreaView, TouchableOpacity } from 'react-native';
import React from 'react';
import Back from '../../components/Back';
import Header from '../../components/Header';
import { useNavigation, useRoute } from '@react-navigation/native';
import { Button, TextInput } from 'react-native-paper';
import { doc, updateDoc } from 'firebase/firestore';
import { db } from '../../utils/firebase';

const UpdateNote = () => {
  const route = useRoute();
  const navigation = useNavigation();

  const date = new Date(route.params.item.date.seconds * 1000);
  const normalDate = date.toLocaleString('tr-TR', {
    timeZone: 'Europe/Istanbul',
  });

  const [title, setTitle] = React.useState(route.params.item.title);
  const [content, setContent] = React.useState(route.params.item.content);

  const updateNote = async () => {
    const noteRef = doc(db, 'notes', route.params.item.id);
    await updateDoc(noteRef, {
      title,
      content,
      date: new Date(),
    });

    // navigation.navigate('MyNotes');
  };

  return (
    <SafeAreaView className="bg-white flex-1">
      <Back />
      <Header title={route.params.item.title}>
        <View>
          <TextInput label="Date" value={normalDate} disabled mode="outlined" />

          <TextInput
            className="my-2"
            label="Note Title"
            onChangeText={(text) => setTitle(text)}
            value={title}
            mode="outlined"
          />

          <TextInput
            label="Note Content"
            value={content}
            onChangeText={(text) => setContent(text)}
            mode="outlined"
            multiline={true}
            numberOfLines={4}
          />
          <TouchableOpacity onPress={() => updateNote()}>
            <Button mode="outlined" className="rounded py-1 mt-2">
              Submit
            </Button>
          </TouchableOpacity>
        </View>
      </Header>
    </SafeAreaView>
  );
};

export default UpdateNote;
