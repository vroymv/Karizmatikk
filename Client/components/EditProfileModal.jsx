import React from "react";
import {
  Modal,
  View,
  Text,
  TouchableOpacity,
  Image,
  TextInput,
  ActivityIndicator,
} from "react-native";
import {
  Close,
  User,
  Camera,
  Database,
  CloseDark,
  UserDark,
} from "../assets/icons";
import * as ImagePicker from "expo-image-picker";
import { useState } from "react";
import ImageMethodModal from "./ImageMethodModal.jsx";
import { useGlobalContext } from "../context/GlobalProvider.js";
import { updateUserData } from "../lib/Node/api.js";
import { uploadImageAsync } from "../firebaseConfig.js";
import Colors from "../lib/Colors.js";

const EditProfileModal = ({ visible, onClose }) => {
  const { userInfo: user, setUserInfo, theme } = useGlobalContext();

  const AppTheme = theme === "dark" ? Colors.dark : Colors.light;

  //Change default selected image to the one pulled from the server
  const [selectedImage, setSelectedImage] = useState(
    user?.profileImage?.imgUrl
  );
  const [imageMethodModalVisible, setImageMethodModalVisible] = useState(false);
  const [userData, setUserData] = useState({
    id: user._id,
    name: user.username,
    roomNumber: user.roomNumber,
    tel: user.phoneNumber,
    profileImage: selectedImage,
  });
  const [status, requestPermission] = ImagePicker.useCameraPermissions();
  const [numberErrorVisibility, setNumberErrorVisibility] = useState(false);
  const [error, setError] = useState();
  const [disableSave, setDisableSave] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const [isSavingImage, setIsSavingImage] = useState(false);

  function handleTextInput(field, text) {
    const numericRegex = /^[0-9]*$/;
    if (field === "tel" && numericRegex.test(text)) {
      setDisableSave(false);
      setNumberErrorVisibility(false);
      setUserData({ ...userData, tel: text });
    } else if (field == "tel" && !numericRegex.test(text)) {
      setDisableSave(true);
      setError("Please enter only numbers.");
      setNumberErrorVisibility(true);
    } else {
      setUserData({ ...userData, [field]: text });
    }
  }

  async function handleSubmit() {
    setIsSaving(true);
    //Add submit logic here
    if (userData.tel.length == 10) {
      setDisableSave(false);
      try {
        const status = await updateUserData(userData);
        if (status) {
          setIsSaving(false);
          setUserInfo({
            ...user,
            username: userData.name,
            roomNumber: userData.roomNumber,
            phoneNumber: userData.tel,
            profileImage: {
              ...user?.profileImage,
              imgUrl: userData?.profileImage,
            },
          });
          console.log("User data updated");
          onClose();
        } else {
          //Show an error saying day should try later
        }
      } catch (error) {
        console.log(error);
      } finally {
        setIsSaving(false);
      }
    } else {
      setError("Please enter a valid phone number.");
      setDisableSave(true);
      setNumberErrorVisibility(true);
    }
  }

  function selectImageMethod() {
    setImageMethodModalVisible(true);
  }

  function closeSelectImageMethodModal() {
    setImageMethodModalVisible(false);
  }

  async function handleTakePhotoSelection() {
    requestPermission();
    if (status.granted) {
      const result = await ImagePicker.launchCameraAsync({
        allowsEditing: true,
        quality: 1,
        mediaTypes: ImagePicker.MediaTypeOptions.Images,
        cameraType: "front",
      });
      if (!result.canceled) {
        setIsSavingImage(true);
        const a = await uploadImageAsync(result.assets[0].uri);
        setSelectedImage(a);
        userData.profileImage = a;
        setIsSavingImage(false);
      } else {
        alert("You did not take any photo.");
      }
    }

    closeSelectImageMethodModal();
  }

  async function handlePickPhotoSelection() {
    //Setting Up Image Picker
    const pickImageAsync = async () => {
      let result = await ImagePicker.launchImageLibraryAsync({
        allowsEditing: true,
        quality: 1,
        mediaTypes: ImagePicker.MediaTypeOptions.Images,
      });

      if (!result.canceled) {
        setIsSavingImage(true);
        const a = await uploadImageAsync(result.assets[0].uri);
        setSelectedImage(a);
        userData.profileImage = a;
        setIsSavingImage(false);
      } else {
        alert("You did not select any image.");
      }
    };
    pickImageAsync();
  }

  return (
    <Modal
      animationType="slide"
      transparent={true}
      visible={visible}
      onRequestClose={onClose}
    >
      <View
        style={{
          backgroundColor: AppTheme.themeColor,
        }}
        className="flex h-[90%] mt-[25%] justify-center rounded-xl p-4"
      >
        <View className="flex-1 justify-between">
          <View className="">
            <View className="flex flex-row justify-between w-[92%]">
              <Text
                style={{
                  color: AppTheme.text,
                }}
                className="text-[17px] font-semibold w-full text-center"
              >
                EDIT PROFILE
              </Text>
              <TouchableOpacity
                className="w-[30px] h-[30px] rounded-full"
                onPress={onClose}
              >
                <Image
                  source={theme === "dark" ? CloseDark : Close}
                  className="w-full h-full rounded-full"
                />
              </TouchableOpacity>
            </View>
            <View className="border-b-2 border-[#E1D9D9] w-full" />

            <View className="flex flex-col mt-8">
              <TouchableOpacity
                onPress={selectImageMethod}
                className="flex items-center"
              >
                {isSavingImage ? (
                  <View className="flex justify-center items-center w-[120px] h-[120px] rounded-full border-[1px]">
                    <ActivityIndicator size="large" />
                  </View>
                ) : (
                  <Image
                    source={selectedImage ? { uri: selectedImage } : User}
                    // style={{
                    //   tintColor: AppTheme.text,
                    // }}
                    className="w-[120px] h-[120px] rounded-full"
                  />
                )}

                <View
                  style={{
                    backgroundColor: "white",
                    elevation: 10, // For Android
                    shadowColor: "#000", // For iOS
                    shadowOffset: { width: 0, height: 2 },
                    shadowOpacity: 0.25,
                    shadowRadius: 3.84,
                  }}
                  className="flex flex-row items-center justify-center px-2 py-1 rounded-xl gap-1 absolute bottom-[-12%]"
                >
                  <Image source={Camera} className="" />
                  <Text className="text-[12px]">Add</Text>
                </View>
              </TouchableOpacity>

              <View className="flex flex-col gap-2 mt-[20%] px-2">
                <View className="flex flex-col">
                  <Text
                    style={{
                      color: AppTheme.text,
                    }}
                    className="text-[17px]"
                  >
                    Name
                  </Text>
                  <TextInput
                    maxLength={20}
                    placeholder="Your name"
                    style={{
                      backgroundColor: AppTheme.settingPressable,
                    }}
                    className="border-[1px] py-3 pl-5 rounded-xl text-[16px]"
                    onChangeText={(text) => handleTextInput("name", text)}
                    value={userData.name}
                    blurOnSubmit
                    autoFocus
                  />
                </View>

                <View className="flex flex-col ">
                  <Text
                    style={{
                      color: AppTheme.text,
                    }}
                    className="text-[17px]"
                  >
                    Rooom number
                  </Text>
                  <TextInput
                    maxLength={20}
                    placeholder="Your room number"
                    style={{
                      backgroundColor: AppTheme.settingPressable,
                    }}
                    className="border-[1px] py-3 pl-5 rounded-xl text-[16px]"
                    onChangeText={(text) => handleTextInput("roomNumber", text)}
                    value={userData.roomNumber}
                    blurOnSubmit
                  />
                </View>

                <View className="flex flex-col ">
                  <View className="flex flex-row justify-between">
                    <Text
                      style={{
                        color: AppTheme.text,
                      }}
                      className="text-[17px]"
                    >
                      Tel
                    </Text>
                    {numberErrorVisibility && (
                      <Text className="text-[#FF4747] text-[14px] mt-3">
                        {error}
                      </Text>
                    )}
                  </View>
                  <TextInput
                    maxLength={10}
                    placeholder="phone number"
                    style={{
                      backgroundColor: AppTheme.settingPressable,
                    }}
                    className="border-[1px] py-3 pl-5 rounded-xl text-[16px]"
                    onChangeText={(text) => handleTextInput("tel", text)}
                    value={userData.tel}
                    blurOnSubmit
                    enterKeyHint="Save"
                    returnKeyLabel="Save"
                    inputMode="tel"
                  />
                </View>
              </View>
            </View>
          </View>
          <View className="mb-10">
            {isSaving ? (
              <View className="flex flex-row w-full items-center justify-center mt-8">
                <ActivityIndicator size="large" color="#86EFAC" />
              </View>
            ) : (
              <TouchableOpacity
                onPress={handleSubmit}
                style={{
                  backgroundColor: AppTheme.settingPressable,
                }}
                className="flex flex-row gap-1 items-center justify-center px-3 py-2 rounded-xl mt-8"
                disabled={disableSave}
              >
                <Image source={Database} className="" />
                <Text className="text-[24px] font-medium">Save</Text>
              </TouchableOpacity>
            )}
          </View>
        </View>
      </View>
      <ImageMethodModal
        visible={imageMethodModalVisible}
        onCloseImageMethod={closeSelectImageMethodModal}
        onChoosePhoto={handlePickPhotoSelection}
        onTakePhoto={handleTakePhotoSelection}
      />
    </Modal>
  );
};

export default EditProfileModal;
