import {View, Text, TouchableOpacity, Switch, ActivityIndicator} from 'react-native';
import React, {useEffect, useState} from 'react';
import {SafeAreaView} from 'react-native';
import Back from '../../components/Back';
import Header from '../../components/Header';
import {auth, db} from '../../utils/firebase';
import {
    collection,
    doc,
    getDocs,
    getDoc,
    query,
    updateDoc
} from 'firebase/firestore';
import {FlatList} from 'react-native';
import {useNavigation, useIsFocused} from '@react-navigation/native';
import {IconButton} from 'react-native-paper';
import TicketContent from "./TicketContent";
import axios from "axios";

const Tickets = () => {
    const navigation = useNavigation();
    const isFocused = useIsFocused();
    const [ticketList, setTicketList] = useState([]);
    const [currentUser, setCurrentUser] = useState(null);
    const [showMyTickets, setShowMyTickets] = useState(false);
    const [userList, setUserList] = useState([]);
    const [isLoading, setLoading] = useState(true);

    /**
     * Kullanıcıyı getir yetkilerine bakmak için
     */
    const getUser = async () => {
        const userRef = doc(db, "users", auth.currentUser.uid);
        const querySnapshot = await getDoc(userRef);
        setCurrentUser(querySnapshot.data());
    };

    const getUserList = async () => {
        const q = query(collection(db, 'users'));
        const querySnapshot = await getDocs(q);
        const users = [];
        querySnapshot.forEach((doc) => {
            if (doc.data().userType === 'user' || doc.data().isAdmin) {
                const data = doc.data();
                users.push({...data, id: doc.id, item: data.full_name});
            }
        });
        setUserList(users);
    };

    /**
     * ticketları listelemek için kullanılan fonksiyon
     */
    const getTickets = async () => {
        const ticketRef = collection(db, 'tickets');
        const q = query(ticketRef);

        const querySnapshot = await getDocs(q);
        let tickets = [];
        querySnapshot.forEach((ticketDoc) => {
            tickets.push({
                id: ticketDoc.id,
                ...ticketDoc.data()
            });
        })
        tickets = await Promise.all(tickets.map(async (ticket) => {
            const userRef = doc(db, "users", ticket.user_id);
            const userResponse = await getDoc(userRef);
            const user = userResponse.data();
            if (!user) {
                return null;
            }
            return {
                ...ticket,
                name: user.full_name,
                phone: user.phone,
                device: user.device_brand,
                id: ticket.id,
            };
        }));
        tickets = tickets.filter(t => !!t)

        setTicketList(tickets);
    };

    const getUserNameById = id => (userList.find(u => u.id === id) || {}).full_name;

    const ticketConfirmation = async (ticketId, active) => {
        const ticketRef = doc(db, 'tickets', ticketId);
        try {
            await updateDoc(ticketRef, {
                ticket_case: !active,
            });
            getTickets();
            console.log('Document successfully updated!');
        } catch (e) {
        }
    };

    const handleButtonClicked = ({id, ticket_case}) => {
        ticketConfirmation(id, ticket_case);
    };

    const getPendingTickets = () => ticketList
        .filter(ticket => showMyTickets ? ticket.assignee === currentUser.id : true)
        .filter(ticket => !ticket.ticket_case);
    const getResolvedTickets = () => ticketList
        .filter(ticket => showMyTickets ? ticket.assignee === currentUser.id : true)
        .filter(ticket => ticket.ticket_case);

    const updateGmailTickets = async () => axios.get('http://localhost:8080/update-gmail-tickets');

    const updateTickets = async () => {
        setLoading(true);
        await updateGmailTickets();
        await getTickets();
        setLoading(false);
    };

    useEffect(() => {
        if (isFocused) {
            /**
             * bu sayfa açıldığında ticketları listelemek için kullanılan fonksiyon
             */
            updateTickets();
            getUser();
            getUserList();
        }
    }, [isFocused]);

    return (
        <SafeAreaView>
            <Back/>
            <View className="flex flex-row justify-between">
                <View className="flex flex-row items-center justify-end  w-32 px-2 border-b border-black">
                    <Text className="text-green-500">Show My Tickets</Text>
                    <Switch
                        onValueChange={setShowMyTickets}
                        value={showMyTickets}
                    />
                </View>
                <TouchableOpacity onPress={() => updateTickets()}>
                    <View className="flex flex-row items-center justify-end  w-32 px-2 border-b border-black">
                        <IconButton
                            disabled={true}
                            icon="refresh"
                            size={30}
                        />
                        <Text className="text-green-500">Refresh</Text>
                    </View>
                </TouchableOpacity>
                <TouchableOpacity onPress={() => navigation.navigate('OpenTicket')}>
                    <View className="flex flex-row items-center justify-end  w-32 px-2 border-b border-black">
                        <IconButton
                            disabled={true}
                            icon="plus"
                            size={30}
                        />
                        <Text className="text-green-500">New Ticket</Text>
                    </View>
                </TouchableOpacity>
            </View>
            {
                isLoading
                    ? <ActivityIndicator size="large" />
                    : (
                        <>
                            <Header title={'Pending Tickets'}>
                                <FlatList
                                    data={getPendingTickets()}
                                    contentInset={{
                                        bottom: 150,
                                    }}
                                    renderItem={({item}) => {
                                        return (
                                            <TouchableOpacity
                                                onPress={() => {
                                                    if (currentUser.read) {
                                                        navigation.navigate('TicketDetail', {item, getTickets});
                                                    }
                                                }}
                                            >
                                                <TicketContent
                                                    {...item} assignee={getUserNameById(item.assignee)}
                                                    deletable={currentUser.delete}
                                                    writable={currentUser.write}
                                                    onButtonClicked={handleButtonClicked}
                                                />
                                            </TouchableOpacity>
                                        );
                                    }}
                                />
                            </Header>
                            <Header title={'Resolved Tickets'}>
                                <FlatList
                                    data={getResolvedTickets()}
                                    contentInset={{
                                        bottom: 150,
                                    }}
                                    renderItem={({item}) => {
                                        return (
                                            <TouchableOpacity
                                                onPress={() => {
                                                    if (currentUser.read) {
                                                        navigation.navigate('TicketDetail', {item, getTickets});
                                                    }
                                                }}
                                            >
                                                <TicketContent
                                                    {...item} assignee={getUserNameById(item.assignee)}
                                                    deletable={currentUser.delete}
                                                    writable={currentUser.write}
                                                    onButtonClicked={handleButtonClicked}
                                                />
                                            </TouchableOpacity>
                                        );
                                    }}
                                />
                            </Header>
                        </>
                    )
            }
        </SafeAreaView>
    )
        ;
};

export default Tickets;
