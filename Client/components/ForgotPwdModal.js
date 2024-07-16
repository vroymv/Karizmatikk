import {
  View,
  Text,
  ActivityIndicator,
  TextInput,
  TouchableOpacity,
  Image,
  Alert,
  Modal,
} from "react-native";
import React, { useState } from "react";
import { EyeOpen, EyeClose, Close } from "../assets/icons";
import { BlurView } from "expo-blur";
import Animated, {
  useAnimatedStyle,
  useSharedValue,
} from "react-native-reanimated";
import { Gesture, GestureDetector } from "react-native-gesture-handler";
import { updatepwd } from "../lib/Node/api";
import { router } from "expo-router";
import { useGlobalContext } from "../context/GlobalProvider";
import { en, hi } from "../localization/translations";

const ForgotPwdModal = ({ visible, onClose, tel }) => {
  const [userData, setUserData] = useState({
    tel: tel,
    password: "",
  });
  const [hidePassword, setHidePassword] = useState(true);
  const [isVerifyingPwd, setisVerifyingPwd] = useState(false);
  const [pwdConfirmationBox, setPwdConfirmationBox] = useState(false);
  const [confirmedPwd, setConfirmedPwd] = useState(null);
  const [noMatchError, setNoMatchError] = useState("No match");

  const { lang } = useGlobalContext();
  const translations = lang === "en" ? en : hi;

  const translateY = useSharedValue(0);
  const open = useSharedValue(1);

  const drag = Gesture.Pan().onChange((event) => {
    translateY.value -= event.changeY;
    if (translateY.value > 0) {
      translateY.value = 0;
    }
  });
  // .onEnd(() => {
  //   runOnJS(onClose());
  //   console.log("ended");
  // });

  const animatedStyle = useAnimatedStyle(() => {
    return {
      bottom: translateY.value,
    };
  });

  function handlePwdInput(text) {
    setUserData({ ...userData, password: text });
  }

  function handlePwdConfirmation(text) {
    setConfirmedPwd(text);
    if (text !== userData.password) {
      setNoMatchError("No Match!");
    } else {
      setNoMatchError("");
    }
  }

  async function handleSubmit() {
    if (!pwdConfirmationBox) {
      setPwdConfirmationBox(true);
    } else if (confirmedPwd == userData.password) {
      setisVerifyingPwd(true);
      try {
        //Show passoword confirmation box
        const status = await updatepwd(userData.tel, userData.password);
        if (status) {
          onClose();
          router.replace({
            pathname: "/(tabs)",
          });
        } else {
          Alert.alert("Error", "Password update failed");
        }
      } catch (error) {
        console.log(error);
      } finally {
        setisVerifyingPwd(false);
      }
    }
  }

  return (
    <Modal
      animationType="slide"
      transparent={true}
      visible={visible || open}
      onRequestClose={onClose}
    >
      <BlurView intensity={20} className="w-full h-full">
        <GestureDetector gesture={drag}>
          <Animated.View
            style={[animatedStyle, { bottom: 0 }]}
            className="flex items-center flex-col bg-[#b8b6b6] w-full h-[35%] absolute rounded-t-[30px] px-3"
          >
            <TouchableOpacity onPress={onClose} className="flex self-end mt-3">
              <Image source={Close} />
            </TouchableOpacity>
            <View className="flex flex-col mx-auto">
              <Text className="flex items-start w-full  text-secondary borde-2 text-[17px] font-[Poppins]">
                {translations.screens.login.text.password}
              </Text>
              <View className="flex flex-row border-2 w-[80%] border-[#a7a7aa] py-1 px-3 rounded-xl self-start">
                <TextInput
                  maxLength={20}
                  secureTextEntry={hidePassword}
                  onChangeText={(text) => handlePwdInput(text)}
                  className="text-[17px] text-secondary w-[93%] h-full"
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

              {pwdConfirmationBox ? (
                <>
                  <View className="flex flex-row justify-between items-center">
                    <Text className="flex text-secondary borde-2 text-[17px] font-[Poppins]">
                      {translations.screens.login.text.confirmPassword}
                    </Text>
                    <Text className="text-[#EB4335] text-[14px]">
                      {noMatchError}
                    </Text>
                  </View>
                  <View className="flex flex-row border-2 w-[80%] border-[#a7a7aa] py-1 px-3 rounded-3xl self-start">
                    <TextInput
                      maxLength={20}
                      secureTextEntry={hidePassword}
                      onChangeText={(text) => handlePwdConfirmation(text)}
                      className="text-[17px] text-secondary w-[93%] h-full"
                      value={confirmedPwd}
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
                </>
              ) : null}
            </View>

            {isVerifyingPwd ? (
              <View className="w-[80% py-3 rounded-xl mt-16">
                <ActivityIndicator size="large" color="#86EFAC" />
              </View>
            ) : (
              <TouchableOpacity
                onPress={handleSubmit}
                className={`w-[80%] bg-secondary ${
                  pwdConfirmationBox ? "mt-4" : "mt-16"
                } rounded-xl py-3`}
              >
                <Text className="text-center font-bold text-[#D9D9D9] text-[20px]">
                  {translations.screens.login.text.button}
                </Text>
              </TouchableOpacity>
            )}
          </Animated.View>
        </GestureDetector>
      </BlurView>
    </Modal>
  );
};

export default ForgotPwdModal;
