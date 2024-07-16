import { View, Image, TextInput, TouchableOpacity, Alert } from "react-native";
import React, { useState } from "react";
import { Send } from "../assets/icons";
import { postMessages } from "../lib/Node/api";

const FormInput = ({ phoneNumber, name, userId, pullMessages }) => {
  const [message, packageMessage] = useState({
    userId: userId,
    content: message,
    sendTime: new Date(),
    phoneNumber: phoneNumber,
    name: name,
    admin: false,
  });

  async function handleMessageSend() {
    //Handle the message sending logic here
    try {
      if (message.content.trim() !== "") {
        const status = await postMessages(message);
        if (status) {
          packageMessage((prevMessage) => ({ ...prevMessage, content: "" }));
          console.log("message saved");
          pullMessages();
        }
      } else {
        Alert.alert("Error", "Please enter a message");
      }
    } catch (error) {
      console.log(error);
    }
  }

  function handleTextInput(text) {
    packageMessage((prevMessage) => ({ ...prevMessage, content: text }));
  }

  return (
    <View className="flex flex-row py-4 px-3  border-t-2 border-[#BDBDC2] items-center justify-center">
      <TextInput
        placeholder="Compose..."
        onChangeText={(text) => handleTextInput(text)}
        value={message.content}
        multiline
        blurOnSubmit
        className="flex border-2 py-1 px-2 border-[#BDBDC2] flex-1 text-[17px] h-[40px] rounded-xl"
      />
      <TouchableOpacity onPress={handleMessageSend}>
        <Image source={Send} className="w-[50px] h-[50px]" />
      </TouchableOpacity>
    </View>
  );
};

export default FormInput;
