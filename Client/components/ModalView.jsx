import {
  Modal,
  View,
  Text,
  TouchableOpacity,
  Image,
  FlatList,
  KeyboardAvoidingView,
  Platform,
  TouchableWithoutFeedback,
  Keyboard,
  RefreshControl,
} from "react-native";
import { Chat, Close, User } from "../assets/icons";
import icon from "../assets/images/icon.png";
import FormInput from "../components/FormInput.jsx";
import { getMessages, markAllRead } from "../lib/Node/api.js";
import React, { useState, useEffect } from "react";
import { useGlobalContext } from "../context/GlobalProvider.js";
import { formatTimestamp } from "../utils/index.js";
import { BlurView } from "expo-blur";
import { en, hi } from "../localization/translations";
import Colors from "../lib/Colors.js";
//
function Messages({ chat, userImage }) {
  const time = formatTimestamp(chat.sendTime);
  return chat.admin ? (
    <>
      <View className="flex w-[60%] my-3 pl-2 items-start self-start">
        <View className="flex flex-row gap-3">
          <View className="w-[40px] h-[40px]">
            <Image
              source={icon}
              className="w-full h-full rounded-full object-contain"
            />
          </View>
          <View className="flex flex-col pt-3">
            <View className="">
              <Text className="font-bold">
                Karizmatik Admin - <Text className="font-light">{time}</Text>
              </Text>
            </View>

            <View className="w-[90%] mt-3">
              <Text className="font-light">{chat.content}</Text>
            </View>
          </View>
        </View>
      </View>
    </>
  ) : (
    <>
      <View className="flex w-[60%] my-3 pr-2 items-end self-end">
        <View className="flex flex-row gap-3">
          <View className="w-[40px] h-[40px]">
            <Image
              source={userImage ? { uri: userImage } : User}
              className="w-full h-full rounded-full object-contain"
            />
          </View>
          <View className="flex flex-col pt-3">
            <View className="">
              <Text className="font-bold">
                {chat.name} - <Text className="font-light">{time}</Text>
              </Text>
            </View>

            <View className="mt-3">
              <Text className="font-light">{chat.content}</Text>
            </View>
          </View>
        </View>
      </View>
    </>
  );
}

function NoMessages() {
  const { lang } = useGlobalContext();
  const translations = lang === "en" ? en : hi;
  return (
    <View className="flex flex-col items-center mt-[20%]">
      <Image source={Chat} className="" />

      <Text className="text-[20px] font-medium mt-2">
        {translations.screens.messages.noMessages.title}
      </Text>
      <Text className="w-[60%] font-extralight mt-3 leading-6">
        {translations.screens.messages.noMessages.body}
      </Text>
    </View>
  );
}

const ModalView = ({ visible, onClose, unread, shouldMarkAllRead }) => {
  const [messages, setMessages] = useState(null);
  const { userInfo, theme } = useGlobalContext();
  const [isLoadingMessages, setIsLoadingMessages] = useState(false);

  const AppTheme = theme === "light" ? Colors.light : Colors.dark;

  async function pullMessages() {
    try {
      const returnedMessages = await getMessages(userInfo._id);
      unread(returnedMessages.unread);
      setMessages(returnedMessages.messages);
    } catch (error) {
      console.log(error);
    }
  }

  useEffect(() => {
    pullMessages();
  }, []);

  useEffect(() => {
    markAllRead(userInfo._id);
  }, [shouldMarkAllRead]);

  const onRefresh = React.useCallback(() => {
    setIsLoadingMessages(true);
    pullMessages();
    setIsLoadingMessages(false);
  }, []);

  return (
    <Modal
      animationType="slide"
      transparent={true}
      visible={visible}
      onRequestClose={onClose}
    >
      <BlurView experimentalBlurMethod intensity={10}>
        <KeyboardAvoidingView
          behavior={Platform.OS === "ios" ? "padding" : "height"}
          className="w-full"
        >
          <View
            // style={{
            //   backgroundColor: AppTheme.theme,
            // }}
            className="flex w-full h-[85%] mt-[35%] p-4 bg-[#FEFEFE] rounded-2xl"
          >
            <View className="flex h-[80vh] flex-col justify-between">
              <View className="h-[85%]">
                <View className="flex flex-row justify-between">
                  <Text className="text-[35px]">Messages</Text>
                  <TouchableOpacity
                    className="w-[30px] h-[30px]"
                    onPress={onClose}
                  >
                    <Image source={Close} className="w-full h-full" />
                  </TouchableOpacity>
                </View>
                <View className="border-b-2 border-[#E1D9D9] w-full" />

                <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
                  <FlatList
                    className=""
                    data={messages}
                    renderItem={({ item }) => (
                      <Messages
                        userImage={userInfo?.profileImage?.imgUrl}
                        chat={item}
                      />
                    )}
                    keyExtractor={(item) => item._id}
                    ListEmptyComponent={() => <NoMessages />}
                    refreshControl={
                      <RefreshControl
                        refreshing={isLoadingMessages}
                        onRefresh={onRefresh}
                      />
                    }
                  />
                </TouchableWithoutFeedback>
              </View>
              <View>
                <FormInput
                  phoneNumber={userInfo.phoneNumber}
                  name={userInfo.username}
                  userId={userInfo._id}
                  pullMessages={pullMessages}
                />
              </View>
            </View>
          </View>
        </KeyboardAvoidingView>
      </BlurView>
    </Modal>
  );
};

export default ModalView;
