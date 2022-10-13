import React, {useState} from 'react';
import {DataTable} from "react-native-paper";
import {FontAwesome} from "@expo/vector-icons";
import {TouchableOpacity} from "react-native";

const DeviceRecordRow = ({record, onEditClicked}) => {
    const [showPassword, setShowPassword] = useState(false);
    return (
        <DataTable.Row>
            <DataTable.Cell>{record.ip}</DataTable.Cell>
            <DataTable.Cell>{record.model}</DataTable.Cell>
            <DataTable.Cell>{record.username}</DataTable.Cell>
            <DataTable.Cell>{showPassword ? record.password : '*****'}</DataTable.Cell>
            <DataTable.Cell>
                {
                    showPassword
                        ? (
                            <TouchableOpacity onPress={() => setShowPassword(false)}>
                                <FontAwesome
                                    name="eye-slash"
                                    size={30}
                                    color="black"
                                />
                            </TouchableOpacity>
                        )
                        : (
                            <TouchableOpacity onPress={() => setShowPassword(true)}>
                                <FontAwesome
                                    name="eye"
                                    size={30}
                                    color="black"
                                />
                            </TouchableOpacity>
                        )
                }
                <TouchableOpacity onPress={() => onEditClicked(record)}>
                    <FontAwesome
                        name="pencil"
                        size={30}
                        color="black"
                    />
                </TouchableOpacity>
            </DataTable.Cell>
        </DataTable.Row>
    );
};

export default DeviceRecordRow;