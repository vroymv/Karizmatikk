import {
  View,
  Text,
  Image,
  TextInput,
  TouchableOpacity,
  ActivityIndicator,
} from "react-native";
import React, { useState } from "react";
import { router, useLocalSearchParams } from "expo-router";
import { EyeOpen, EyeClose } from "../../assets/icons";
import { SafeAreaView } from "react-native-safe-area-context";
import {
  getNumberOfPendingOrders,
  login,
  requestAuth,
} from "../../lib/Node/api";
import { useGlobalContext } from "../../context/GlobalProvider";
import ForgotPwdModal from "../../components/ForgotPwdModal.js";
import { en, hi } from "../../localization/translations";

const onboardingOTP = () => {
  const { tel } = useLocalSearchParams();
  const [userData, setUserData] = useState({
    password: "",
    tel: tel,
  });
  const [error, setError] = useState();
  const [wrongPwdVisibility, setWrongPwdVisibility] = useState(false);
  const [hidePassword, setHidePassword] = useState(true);
  const [isVerifyingPwd, setisVerifyingPwd] = useState(false);
  const {
    lang,
    setIsAuthenticated,
    setUserInfo,
    setnumberOrders,
    setAuthIsLoading,
  } = useGlobalContext();
  const [forgotPwdModalVisibility, setForgotPwdModalVisibility] =
    useState(false);

  const translations = lang === "en" ? en : hi;

  function handleTelInput(pwd) {
    setUserData({ ...userData, password: pwd });
    setWrongPwdVisibility(false);
  }

  async function handleSubmit() {
    setisVerifyingPwd(true);
    try {
      const token = await login(userData);
      if (token.accessToken) {
        setAuthIsLoading(true);
        const user = await requestAuth();

        if (user) {
          setIsAuthenticated(true);
          setAuthIsLoading(false);
          setUserInfo(user);
          const numberOfPendingOrders = await getNumberOfPendingOrders(
            user._id
          );
          setnumberOrders(numberOfPendingOrders);
        } else {
          setIsAuthenticated(false);
          setAuthIsLoading(false);
        }

        setisVerifyingPwd(false);
        router.push({
          pathname: "/(tabs)",
        });
      } else if (!token.status) {
        setError(translations.screens.login.text.incorrectPassword);
        setWrongPwdVisibility(true);
        setisVerifyingPwd(false);
      }
    } catch (error) {
      console.log(error);
    }
  }

  const onClose = () => {
    setForgotPwdModalVisibility(false);
  };

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

        <View className="flex flex-1 items-center">
          <View className="mt-10">
            <Text className="font-bold text-[40px]">
              {translations.screens.login.text.introText}
            </Text>
          </View>

          <View className="mt-6">
            {wrongPwdVisibility && (
              <View className="flex flex-row justify-between mt-3">
                <Text className="text-[#FF4747] text-[12px] ">{error}</Text>
                <TouchableOpacity
                  onPress={() => setForgotPwdModalVisibility(true)}
                >
                  <Text className="text-[#5047ff] text-[12px] ">
                    {translations.screens.login.text.forgotPassword};
                  </Text>
                </TouchableOpacity>
              </View>
            )}
            <Text className="text-secondary text-[17px] font-[Poppins] mt-10">
              {translations.screens.login.text.password}
            </Text>
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
                placeholderTextColor=""
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

          {isVerifyingPwd ? (
            <View className="w-[80% py-3 rounded-xl mt-16">
              <ActivityIndicator size="large" color="#86EFAC" />
            </View>
          ) : (
            <TouchableOpacity
              onPress={handleSubmit}
              className="w-[80%] bg-secondary py-3 rounded-xl mt-16"
            >
              <Text className="text-center font-bold text-[#D9D9D9] text-[20px]">
                {translations.screens.login.text.button}
              </Text>
            </TouchableOpacity>
          )}
        </View>
        <ForgotPwdModal
          tel={userData.tel}
          visible={forgotPwdModalVisibility}
          onClose={onClose}
        />
      </SafeAreaView>
    </>
  );
};

export default onboardingOTP;
