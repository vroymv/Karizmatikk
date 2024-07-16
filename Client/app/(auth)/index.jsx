import {
  View,
  Text,
  Image,
  TextInput,
  TouchableOpacity,
  ActivityIndicator,
  TouchableWithoutFeedback,
  Keyboard,
} from "react-native";
import React, { useState } from "react";
import { router } from "expo-router";
import { SafeAreaView } from "react-native-safe-area-context";
import { findUser } from "../../lib/Node/api";
import { Down } from "../../assets/icons";
import LanguageModal from "../../components/LanguageModal";
import { useGlobalContext } from "../../context/GlobalProvider";
import { en, hi } from "../../localization/translations";
import { saveLanguage } from "../../lib/Storage";

const onboarding = () => {
  const [tel, setTel] = useState();
  const [isFetchingUser, setIsFetchingUser] = useState(false);
  const [numberErrorVisibility, setNumberErrorVisibility] = useState(false);
  const [error, setError] = useState();
  const [isModalVisible, setIsModalVisible] = useState(false);

  const { lang, setLang } = useGlobalContext();
  const translations = lang === "en" ? en : hi;

  function handleTelInput(num) {
    const numericRegex = /^[0-9]*$/;

    if (numericRegex.test(num)) {
      setNumberErrorVisibility(false);
      setTel(num);
    } else {
      setError("Please enter only numbers.");
      setNumberErrorVisibility(true);
    }
  }

  function openLanguageModal() {
    setIsModalVisible(true);
  }

  function closeLangModal() {
    setIsModalVisible(false);
  }

  function handleEnglishPicked() {
    setLang("en");
    setIsModalVisible(false);
    saveLanguage("hi");
  }

  function handleHindiPicked() {
    setLang("hi");
    setIsModalVisible(false);
    saveLanguage("hi");
  }

  async function handleSubmit() {
    if (tel?.length == 10) {
      setNumberErrorVisibility(false);
      try {
        setIsFetchingUser(true);
        const user = await findUser(tel, "phoneNumber");
        if (user) {
          router.push({
            pathname: "(auth)/login",
            params: { tel: tel },
          });
          setIsFetchingUser(false);
        } else {
          router.push({
            pathname: "(auth)/onboarding",
            params: { tel: tel },
          });
          setIsFetchingUser(false);
        }
      } catch (error) {
        console.log(error);
      }
    } else {
      setError("Please enter a valid phone number.");
      setNumberErrorVisibility(true);
    }
  }

  return (
    <>
      <SafeAreaView className={`flex bg-[#FFFFFF] flex-1 flex-col`}>
        <View className="flex flex-1 flex-col w-full items-center">
          <View className="w-[90%] h-[80%] mt-6">
            <Image
              className=" w-full h-full object-cover rounded-[42px]"
              source={require("../../assets/images/icon.png")}
            />
          </View>

          <View className="w-[70%]">
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
                {translations.screens.signup.text.introText}
              </Text>
            </View>

            <View className="flex flex-row gap-2 items-center w-[70%]">
              <TouchableOpacity
                onPress={openLanguageModal}
                className="flex flex-row border-[1px] self-start p-1 items-center"
              >
                <Text className="text-[#2E34CB] text-2xl">{lang}</Text>
                <Image
                  source={Down}
                  style={{
                    color: "#2E34CB",
                  }}
                  className="w-3 h-3"
                />
              </TouchableOpacity>
              {numberErrorVisibility && (
                <Text className="text-[#FF4747] text-[14px]">{error}</Text>
              )}
            </View>

            <View className="flex flex-row border-2 w-[60%] border-[#a7a7aa] py-1 px-3 rounded-3xl mt-14 items-center">
              <Text className="text-[#5e5e62] text-[17px] font-[Poppins] mr-2 border-r-2 border-[#5e5e62] px-2">
                +91
              </Text>
              <TextInput
                maxLength={10}
                placeholder="805410XXXX"
                onChangeText={(text) => handleTelInput(text)}
                className="text-[17px] text-secondary"
                value={tel}
                blurOnSubmit
                enterKeyHint="Next"
                returnKeyLabel="Next"
                inputMode="tel"
                onSubmitEditing={handleSubmit}
                autoFocus
              />
            </View>

            {isFetchingUser ? (
              <View className="w-[80% py-3 rounded-xl mt-16">
                <ActivityIndicator size="large" color="#86EFAC" />
              </View>
            ) : (
              <TouchableOpacity
                className="w-[80%] bg-secondary py-3 rounded-xl mt-16"
                onPress={handleSubmit}
              >
                <Text className="text-center font-bold text-[#D9D9D9] text-[20px]">
                  {translations.screens.signup.text.button}
                </Text>
              </TouchableOpacity>
            )}
          </View>
        </TouchableWithoutFeedback>
        <LanguageModal
          visible={isModalVisible}
          onCloseLangModal={closeLangModal}
          onChooseEn={handleEnglishPicked}
          onChooseHi={handleHindiPicked}
        />
      </SafeAreaView>
    </>
  );
};

export default onboarding;
