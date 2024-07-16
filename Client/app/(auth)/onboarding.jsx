import {
  View,
  Text,
  Image,
  TextInput,
  Keyboard,
  TouchableOpacity,
  TouchableWithoutFeedback,
} from "react-native";
import React, { useState } from "react";
import { router, useLocalSearchParams } from "expo-router";
import { EyeOpen, EyeClose } from "../../assets/icons";
import { useGlobalContext } from "../../context/GlobalProvider";
import { SafeAreaView } from "react-native-safe-area-context";
import { en, hi } from "../../localization/translations";

const onboardingOTP = () => {
  const { tel } = useLocalSearchParams();
  const [userData, setUserData] = useState({
    password: "",
    tel: tel,
  });
  const [hidePassword, setHidePassword] = useState(true);
  const [errorVisibility, setErrorVisibility] = useState(false);
  const [error, setError] = useState();

  const { lang } = useGlobalContext();
  const translations = lang === "en" ? en : hi;

  function handleTelInput(pwd) {
    setError("");
    setErrorVisibility(false);
    setUserData({ ...userData, password: pwd });
  }

  function handleSubmit() {
    if (userData.password.length > 0) {
      router.push({
        pathname: "/userAccount",
        params: {
          pwd: userData.password,
          tel: userData.tel,
        },
      });
    } else {
      setError(translations.screens.signup2.text.passwordError);
      setErrorVisibility(true);
    }
  }

  return (
    <>
      <SafeAreaView className="flex flex-1 flex-col">
        <View className="flex flex-1 flex-col w-full items-center">
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
                {translations.screens.signup2.text.introText}
              </Text>
            </View>

            <View className="mt-6">
              <Text className="text-secondary text-[17px] font-[Poppins] mt-10">
                {translations.screens.signup2.text.password}
              </Text>
              {errorVisibility && (
                <Text className="text-[#FF4747] text-[14px] mt-3">{error}</Text>
              )}
              <View className="flex flex-row border-2 w-[60%] border-[#a7a7aa] py-1 px-3 rounded-3xl items-center">
                <TextInput
                  maxLength={20}
                  secureTextEntry={hidePassword}
                  onChangeText={(text) => handleTelInput(text)}
                  className="text-[17px] text-secondary w-full h-full"
                  value={userData.password}
                  blurOnSubmit
                  enterKeyHint="Next"
                  returnKeyLabel="Next"
                  inputMode="text"
                  onSubmitEditing={handleSubmit}
                  autoFocus
                />
                <TouchableOpacity
                  onPress={() => setHidePassword(!hidePassword)}
                  className="w-[25px] h-[25px]"
                >
                  <Image
                    source={hidePassword ? EyeOpen : EyeClose}
                    className="w-full h-full"
                  />
                </TouchableOpacity>
              </View>
            </View>

            <View className="w-[80%] bg-secondary py-3 rounded-xl mt-16">
              <TouchableOpacity
                onPress={handleSubmit}
                className="flex w-[80%] bg-secondary items-center justify-center py-3 rounded-xl"
              >
                <Text className="font-bold text-[#D9D9D9] text-[20px]">
                  {translations.screens.signup2.text.button}
                </Text>
              </TouchableOpacity>
            </View>
          </View>
        </TouchableWithoutFeedback>
      </SafeAreaView>
    </>
  );
};

export default onboardingOTP;
