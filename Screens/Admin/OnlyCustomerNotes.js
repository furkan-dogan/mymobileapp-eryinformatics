import {
  View,
  SafeAreaView,
  Alert,
  FlatList,
  Text,
  TouchableOpacity,
} from 'react-native';
import React from 'react';
import { Button, TextInput } from 'react-native-paper';
import { FontAwesome5 } from '@expo/vector-icons';
import {
  addDoc,
  collection,
  doc,
  getDocs,
  orderBy,
  query,
  setDoc,
  where,
} from 'firebase/firestore';
import { auth, db } from '../../utils/firebase';
import { Controller, useForm } from 'react-hook-form';
import { useNavigation, useRoute } from '@react-navigation/native';
import Back from '../../components/Back';
import Header from '../../components/Header';

const OnlyCustomerNotes = () => {
  const [addNoteContainer, setAddNoteContainer] = React.useState(false);
  const [notes, setNotes] = React.useState([]);

  const navigation = useNavigation();
  const route = useRoute();

  const userDataWithParams = route.params.item;

  const [noteTitle, setNoteTitle] = React.useState('');
  const [noteContent, setNoteContent] = React.useState('');
  const [refresh, setRefresh] = React.useState(false);

  const {
    control,
    handleSubmit,
    formState: { errors },
    reset,
  } = useForm();

  /**
   * üzerine tıklandığında notu silen fonksiyon
   */
  const deleteNote = async (noteId) => {
    await setDoc(doc(db, 'notes', noteId), {
      deleted: true,
    });
    setRefresh(!refresh);
  };
  /**
   * formdan gelen verileri alıyoruz ve yeni bir note ekliyoruz
   */
  const addNote = (data) => {
    setRefresh(false);
    const docRef = addDoc(collection(db, 'notes'), {
      title: data.noteTitle,
      content: data.noteContent,
      date: new Date(),
      user_id: auth.currentUser.uid,
      customer_id: userDataWithParams.user_id,
    }).then((data) => {
      setRefresh(true);
      /**
       * eklendikten sonra formu temizliyoruz
       */
      reset({
        noteTitle: '',
        noteContent: '',
      });
    });
  };
  /**
   * notları listelemek için kullanılan fonksiyon
   */
  const getNotes = async () => {
    const notes = [];
    const notesRef = collection(db, 'notes');
    /**
     * son eklenen notları en üste getirmek için desc kullanıyoruz
     */
    const q = query(
      notesRef,
      where('customer_id', '==', userDataWithParams.user_id),
      orderBy('date', 'desc')
    );

    const querySnapshot = await getDocs(q);

    setNotes([]);
    querySnapshot.forEach((doc) => {
      /**
       * kullanıcı ile ilişkilendirilmemiş notları listeliyoruz
       */
      setNotes((prev) => [...prev, { ...doc.data(), id: doc.id }]);
    });
  };

  /**
   * butun komponentler yüklendikten sonra çalışan fonksiyon
   */
  React.useEffect(() => {
    navigation.addListener('focus', () => {
      getNotes();
    });

    getNotes();
  }, [refresh]);

  return (
    <SafeAreaView className="flex-1 bg-white">
      <Back />
      <Header title={'Notes'}>
        <View>
          <View className="flex flex-row justify-start">
            <Button
              icon="pen"
              mode="contained"
              onPress={() => setAddNoteContainer(!addNoteContainer)}
              className="bg-blue-400"
            >
              Add Note
            </Button>
          </View>
        </View>

        {addNoteContainer && (
          <View className="mt-2">
            <Controller
              control={control}
              rules={{
                required: true,
              }}
              name="noteTitle"
              render={({ field: { onChange, onBlur, value } }) => (
                <View>
                  <TextInput
                    onChangeText={onChange}
                    value={value}
                    mode="outlined"
                    label="Title"
                  />
                  {
                    // eğer errors içinde noteTitle varsa ve errors içindeki noteTitle'nin type'ı required ise
                    errors.noteTitle && errors.noteTitle.type == 'required' && (
                      <Text className="text-red-500 my-2">
                        This is required.
                      </Text>
                    )
                  }
                </View>
              )}
            />
            <Controller
              control={control}
              rules={{
                required: true,
              }}
              render={({ field: { onChange, onBlur, value } }) => (
                <View>
                  <TextInput
                    mode="outlined"
                    onChangeText={onChange}
                    value={value}
                    label="Note"
                    multiline={true}
                    numberOfLines={4}
                    className="my-2"
                  />
                  {errors.noteContent &&
                    errors.noteContent.type == 'required' && (
                      <Text className="text-red-500 mb-2">
                        This is required.
                      </Text>
                    )}
                </View>
              )}
              name="noteContent"
            />

            <View>
              <TouchableOpacity onPress={handleSubmit(addNote)}>
                <Button mode="outlined" className="rounded py-1">
                  Submit
                </Button>
              </TouchableOpacity>
            </View>
          </View>
        )}

        <View className="mt-2 px-2">
          <FlatList
            data={notes}
            keyExtractor={(item) => item.id}
            renderItem={({ item }) => {
              let date = new Date(item.date.seconds * 1000);
              let normalDate = date.toLocaleString('tr-TR', {
                timeZone: 'Europe/Istanbul',
              });

              return (
                <View
                  key={item.id}
                  className="flex flex-row justify-between items-center my-2"
                >
                  <View>
                    <Text>{item.title}</Text>
                    <Text className="text-sm text-gray-400">{normalDate}</Text>
                  </View>
                  <View className="flex flex-row space-x-5">
                    <TouchableOpacity onPress={() => deleteNote(item.id)}>
                      <View>
                        <FontAwesome5 name="trash" size={24} color="black" />
                      </View>
                    </TouchableOpacity>
                    <TouchableOpacity
                      onPress={() =>
                        navigation.navigate('UpdateNote', { item })
                      }
                    >
                      <View>
                        <FontAwesome5
                          name="chevron-right"
                          size={24}
                          color="black"
                        />
                      </View>
                    </TouchableOpacity>
                  </View>
                </View>
              );
            }}
          />
        </View>
      </Header>
    </SafeAreaView>
  );
};

export default OnlyCustomerNotes;
