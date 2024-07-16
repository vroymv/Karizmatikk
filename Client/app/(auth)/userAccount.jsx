import {
  View,
  Text,
  Image,
  TextInput,
  TouchableOpacity,
  TouchableWithoutFeedback,
  Keyboard,
  ActivityIndicator,
  KeyboardAvoidingView,
  Platform,
  ScrollView,
} from "react-native";
import React, { useState } from "react";
import { router, useLocalSearchParams } from "expo-router";
import { SafeAreaView } from "react-native-safe-area-context";
import { createAccount } from "../../lib/Node/api";
import { useGlobalContext } from "../../context/GlobalProvider";
import { en, hi } from "../../localization/translations";

const onboardingOTP = () => {
  const { pwd, tel } = useLocalSearchParams();
  const [userInfo, setUserInfo] = useState({
    pwd: pwd,
    tel: tel,
    name: "",
    roomNumber: "",
  });
  const [creatingUser, setCreatingUser] = useState(false);
  const [nameErrorVisibility, setNameErrorVisibility] = useState(false);
  const [roomErrorVisibility, setRoomErrorVisibility] = useState(false);
  const [nameError, setNameError] = useState();
  const [roomError, setRoomError] = useState(false);

  const { lang } = useGlobalContext();
  const translations = lang === "en" ? en : hi;

  function handleTextInput(field, text) {
    setNameError("");
    setNameErrorVisibility(false);
    setRoomError("");
    setRoomErrorVisibility(false);
    setUserInfo({ ...userInfo, [field]: text });
  }

  async function handleSubmit() {
    setCreatingUser(true);
    try {
      if (userInfo.name.trim() !== "" && userInfo.roomNumber.trim() !== "") {
        const token = await createAccount(userInfo);
        if (token) {
          console.log("User Created, Token received");
          setCreatingUser(false);
          router.push("/(tabs)");
        }
      } else {
        if (userInfo.name.trim() == "") {
          setNameError(translations.screens.signup3.text.nameError);
          setNameErrorVisibility(true);
        } else if (userInfo.roomNumber.trim() == "") {
          setRoomError(translations.screens.signup3.text.roomError);
          setRoomErrorVisibility(true);
        }
      }
    } catch (error) {
      console.log(error);
    } finally {
      setCreatingUser(false);
    }
  }

  return (
    <>
      <KeyboardAvoidingView
        behavior={Platform.OS === "ios" ? "padding" : "height"}
        className="flex flex-1"
      >
        <SafeAreaView className="flex flex-1">
          <ScrollView className="flex flex-1 w-full  flex-col">
            <View className="flex flex-col flex-1 w-full h-[350px] items-center">
              <View className="w-[90%] h-[80%] mt-6">
                <Image
                  className=" w-full h-full object-cover rounded-[42px]"
                  source={require("../../assets/images/icon.png")}
                />
              </View>

              <View className="w-[80%]">
                <Text className="font-[Inter] text-[16px] font-medium mt-3 ">
                  Put your best foot forward, the{" "}
                  <Text className="text-[#FF4747]">Karizma</Text>tik way.
                </Text>
              </View>
            </View>

            <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
              <View className="flex flex-1 items-center">
                <View className="mt-10">
                  <Text className="font-bold text-[40px]">
                    {translations.screens.signup3.text.introText}
                  </Text>
                </View>

                <View className="flex flex-col w-full gap-2 items-center mt-4">
                  <View className="">
                    <View className="flex flex-row justify-between items-center">
                      <Text className="text-secondary text-[17px] font-[Poppins]">
                        {translations.screens.signup3.text.name}
                      </Text>
                      {nameErrorVisibility && (
                        <Text className="text-[#FF4747] text-[14px]">
                          {nameError}
                        </Text>
                      )}
                    </View>
                    <View className="flex flex-row border-2 w-[60%] border-[#a7a7aa] py-1 px-3 rounded-3xl items-center">
                      <TextInput
                        maxLength={20}
                        onChangeText={(text) => handleTextInput("name", text)}
                        className="text-[17px] text-secondary w-full h-full"
                        value={userInfo.name}
                        blurOnSubmit
                        enterKeyHint="Nex"
                        returnKeyLabel="Nex"
                        inputMode="text"
                        onSubmitEditing={handleSubmit}
                        autoFocus
                      />
                    </View>
                  </View>
                  <View className="">
                    <View className="flex flex-row justify-between items-center">
                      <Text className="text-secondary text-[17px] font-[Poppins]">
                        {translations.screens.signup3.text.room}
                      </Text>
                      {roomErrorVisibility && (
                        <Text className="text-[#FF4747] text-[14px]">
                          {roomError}
                        </Text>
                      )}
                    </View>
                    <View className="flex flex-row border-2 w-[60%] border-[#a7a7aa] py-1 px-3 rounded-3xl items-center">
                      <TextInput
                        maxLength={20}
                        onChangeText={(text) =>
                          handleTextInput("roomNumber", text)
                        }
                        className="text-[17px] text-secondary w-full h-full"
                        value={userInfo.roomNumber}
                        blurOnSubmit
                        enterKeyHint="Done"
                        returnKeyLabel="Done"
                        inputMode="text"
                        onSubmitEditing={handleSubmit}
                        placeholder="BH6 B - 101"
                      />
                    </View>
                  </View>
                </View>

                {creatingUser ? (
                  <View className="w-[80%] py-3 rounded-xl mt-16">
                    <ActivityIndicator size="small" color="#86EFAC" />
                  </View>
                ) : (
                  <TouchableOpacity
                    onPress={handleSubmit}
                    className="w-[80%] bg-secondary py-3 rounded-xl mt-16"
                  >
                    <Text className="text-center font-bold text-[#D9D9D9] text-[20px]">
                      {translations.screens.signup3.text.button}
                    </Text>
                  </TouchableOpacity>
                )}
              </View>
            </TouchableWithoutFeedback>
          </ScrollView>
        </SafeAreaView>
      </KeyboardAvoidingView>
    </>
  );
};

export default onboardingOTP;
