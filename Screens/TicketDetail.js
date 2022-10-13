import {
  View,
  Text,
  SafeAreaView,
  Image,
  FlatList,
  TouchableOpacity,
} from 'react-native';
import SelectBox from "react-native-multi-selectbox";
import React, {useEffect} from 'react';
import Back from '../components/Back';
import Header from '../components/Header';
import { useRoute } from '@react-navigation/native';
import {
  getDownloadURL,
  getStorage,
  list,
  ref,
} from 'firebase/storage';
import { Button, TextInput } from 'react-native-paper';
import { Controller, useForm } from 'react-hook-form';
import {
    addDoc,
    updateDoc,
    collection,
    getDocs,
    getDoc,
    orderBy,
    query,
    doc,
} from 'firebase/firestore';
import { auth, db } from '../utils/firebase';

const TicketDetail = () => {
  const route = useRoute();
  const { params: {item, getTickets} } = route;

  const {
    control,
    handleSubmit,
    formState: { errors }
  } = useForm({
    defaultValues: {},
  });
  const [ticketImages, setTicketImages] = React.useState([]);
  const [ticketStatus, setTicketStatus] = React.useState(false);
  const [ticketAnswers, setTicketAnswers] = React.useState([]);
  const [currentUser, setCurrentUser] = React.useState(null);
  const [userList, setUserList] = React.useState([]);
  const [assignedUserItem, setAssignedUserItem] = React.useState({});
  const getAssignedUserItem = (id) => userList.find(u => id ? u.id === id : u.id === item.assignee) || {};

  const date = new Date(item.ticket_date.seconds * 1000);
  const normalDate = date.toLocaleString('tr-TR', {
    timeZone: 'UTC',
  });

    const getUserList = async () => {
        const q = query(collection(db, 'users'));
        const querySnapshot = await getDocs(q);
        const users = [];
        querySnapshot.forEach((doc) => {
            if (doc.data().userType === 'user' || doc.data().isAdmin) {
                const data = doc.data();
                users.push({ ...data, id: doc.id, item: data.full_name });
            }
        });
        setUserList(users);
    };

  const getTicketImages = async () => {
    const storage = getStorage();
    const storageRef = ref(storage, `tickets/${item.user_id}/${item.id}`);
    const firstPage = await list(storageRef, {
      maxResults: 10,
    });

    if (firstPage.nextPageToken) {
      const secondPage = await list(storageRef, {
        maxResults: 10,
        pageToken: firstPage.nextPageToken,
      });
    }
    setTicketImages([]);
    firstPage.items.forEach((itemRef) => {
      getDownloadURL(itemRef).then((url) => {
        setTicketImages((prev) => [...prev, url]);
      });
    });
  };

  const getUser = async () => {
    const userRef = doc(db, "users", auth.currentUser.uid);
    const querySnapshot = await getDoc(userRef);
    setCurrentUser(querySnapshot.data());
  };

  const answerTicket = async (data) => {
    let answerDate = new Date();
    answerDate = answerDate.getTime();

    setTicketStatus(false);
    addDoc(collection(db, 'ticketsAnswers'), {
      answer: data.answer,
      ticket_id: item.id,
      user_id: auth.currentUser.uid,
      orderDate: answerDate,
      answer_date: new Date(),
      fullname: currentUser.full_name,
    })
      .then(() => {
        setTicketStatus({
          status: true,
          message: 'Ticket answered successfully.',
        });
      })
      .catch((e) => {
        setTicketStatus({
          message: e.message,
          status: false,
        });
      });

    getTicketAnswers();
  };

  const getTicketAnswers = async () => {
    const userRef = collection(db, 'ticketsAnswers');

    const q = query(userRef, orderBy('orderDate', 'asc'));
    const querySnapshot = await getDocs(q);
    setTicketAnswers([]);

    setTicketAnswers(
      querySnapshot.docs.map((doc) => {
        if (doc.data().ticket_id === item.id) {
          return {
            id: doc.id,
            ...doc.data(),
          };
        }
      })
    );

    setTicketAnswers((prev) => prev.filter((item) => item !== undefined));
  };

  const handleAssigneeChanged = async selectedAssigneeVal => {
      const ticketRef = doc(db, 'tickets', item.id);
      await updateDoc(ticketRef, {
          assignee: selectedAssigneeVal.id
      });
      getTickets();
      setAssignedUserItem(getAssignedUserItem(selectedAssigneeVal.id));
  };

  useEffect(() => {
    let mounted = true;
    if (mounted) {
      getTicketImages();
      getTicketAnswers();
      getUser();
      getUserList();
    }

    return () => {
      mounted = false;
    };
  }, []);

  useEffect(() => {
    if (userList) {
      setAssignedUserItem(getAssignedUserItem());
    }
  }, [userList]);

  return (
    <SafeAreaView className="flex flex-col flex-1  bg-white">
      <Back />
      <Header title={'Customer: ' + item.name}>
        <View className="border border-gray-400 p-3 rounded shadow-md">
          <Text className="mb-1">Ticket ID: {item.id}</Text>
          <Text className="mb-1">Subject: {item.title}</Text>
          <Text className="mb-1">Description: {item.description}</Text>
          <Text className="mb-1">Date: {normalDate} </Text>
          <Text className="mb-1">Device: {item.device}</Text>
          <Text className="mb-1">Phone: {item.phone}</Text>
          <Text className="mb-1">Source: {item.source || 'App'}</Text>
            {userList && (
                <SelectBox
                    label="Assignee"
                    options={userList}
                    value={assignedUserItem}
                    onChange={handleAssigneeChanged}
                    hideInputFilter={false}
                />
            )}
        </View>

        {ticketImages.length > 0 && (
          <View className="h-60 ">
            <Text className="my-2 text-xl">İmages</Text>
            <FlatList
              data={ticketImages}
              renderItem={({ item }) => (
                <View>
                  <View className="border border-gray-300 my-3" />
                  <View key={item}>
                    <Image
                      source={{ uri: item }}
                      style={{
                        width: '100%',
                        height: 300,
                        objectFit: 'contain',
                      }}
                    />
                  </View>
                </View>
              )}
            />
          </View>
        )}

        <View>
          <Text className="mt-2 text-xl">Answer</Text>
          <View className="border-b border-gray-300" />
          <View>
            <Controller
              control={control}
              render={({ field: { onChange, onBlur, value } }) => (
                <>
                  <TextInput
                    label="Answer"
                    multiline={true}
                    numberOfLines={4}
                    value={value}
                    onChangeText={onChange}
                    mode="outlined"
                  />

                  {errors.answer && errors.answer.type == 'required' && (
                    <Text className="text-red-500">This is required.</Text>
                  )}
                </>
              )}
              name="answer"
              rules={{ required: true }}
            />
          </View>
          {ticketStatus && (
            <View>
              <Text
                className={
                  'my-2 ' + ticketStatus.status
                    ? 'text-green-500'
                    : 'text-red-500'
                }
              >
                {ticketStatus.message}
              </Text>
            </View>
          )}

          <View>
            <TouchableOpacity onPress={handleSubmit(answerTicket)}>
              <Button mode="outlined" className="rounded-none my-2">
                Submit
              </Button>
            </TouchableOpacity>
          </View>

          <FlatList
            data={ticketAnswers}
            contentInset={{
              bottom: 250,
            }}
            renderItem={({ item }) => {
              if (item) {
                const date = new Date(item.answer_date.seconds * 1000);
                const normalDate = date.toLocaleString('tr-TR', {
                  timeZone: 'UTC',
                });

                return (
                  <View className="border-b mb-2 pb-2">
                    <Text>Name:{item.fullname}</Text>
                    <Text>Answer: {item.answer}</Text>
                    <Text>Date: {normalDate}</Text>
                  </View>
                );
              }
            }}
          />
        </View>
      </Header>
    </SafeAreaView>
  );
};

export default TicketDetail;
