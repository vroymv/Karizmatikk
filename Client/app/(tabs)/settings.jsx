import { View, Text, Image, ScrollView, TouchableOpacity } from "react-native";
import React, { useState } from "react";
import {
  Question,
  Heart,
  CustomerService,
  NightMood,
  LightMood,
  LogOut,
  User,
  Translate,
} from "../../assets/icons";
import { SafeAreaView } from "react-native-safe-area-context";
import EditProfileModal from "../../components/EditProfileModal.jsx";
import { useGlobalContext } from "../../context/GlobalProvider";
import { deleteToken, saveTheme } from "../../lib/Storage/index.js";
import { router } from "expo-router";
import ModalView from "../../components/ModalView.jsx";
import AboutModal from "../../components/about.jsx";
import { en, hi } from "../../localization/translations";
import { saveLanguage } from "../../lib/Storage";
import LanguageModal from "../../components/LanguageModal.jsx";
import Colors from "../../lib/Colors.js";
import ThemeModal from "../../components/ThemeModal";
import Appreciation from "../../components/appreciation.jsx";

function RowItem({
  icon,
  label,
  iconStyle,
  seperator,
  containerStyle,
  setModalVisible,
  setAboutModalVisibility,
  openThemeModal,
  openLanguageModal,
  setIsAppreciationModalVisible,
}) {
  const { lang, theme } = useGlobalContext();
  const translations = lang === "en" ? en : hi;
  const AppTheme = theme === "light" ? Colors.light : Colors.dark;

  async function handleClick() {
    if (label === "Dark Mode" || label === "Light Mode") {
      openThemeModal();
    } else if (
      label === `${translations.screens.settings.buttons.customerService}`
    ) {
      setModalVisible(true);
    } else if (label === `${translations.screens.settings.buttons.about}`) {
      setAboutModalVisibility(true);
    } else if (label === "Language") {
      openLanguageModal();
    } else if (
      label === `${translations.screens.settings.buttons.appreciation}`
    ) {
      setIsAppreciationModalVisible(true);
    }
  }

  return (
    <TouchableOpacity
      onPress={handleClick}
      style={{
        backgroundColor: AppTheme.settingPressable,
      }}
      className={`flex flex-row gap-3 rounded-lg justify-center items-center w-[90%] ${
        containerStyle ? containerStyle : "p-3"
      } items-center`}
    >
      <Image
        source={icon}
        className={
          iconStyle ? `${iconStyle}` : "w-[20px] h-[20px] elevation-10"
        }
      />
      <View className="flex flex-1">
        <Text
          style={{
            color: AppTheme.text,
          }}
        >
          {label}
        </Text>
        {seperator && (
          <View
            style={{
              borderColor: AppTheme.dividerLine,
            }}
            className="border-b-2 mt-2 w-full"
          />
        )}
      </View>
    </TouchableOpacity>
  );
}

const settings = () => {
  const [editModalVisible, setEditModalVisible] = useState(false);
  const [aboutModalVisibility, setAboutModalVisibility] = useState(false);
  const { userInfo, setIsAuthenticated } = useGlobalContext();
  const [modalVisible, setModalVisible] = useState(false);
  const [unreadCount, setUnreadCount] = useState(0);
  const [shouldMarkAllRead, setShouldMarkAllRead] = useState(false);

  const [isModalVisible, setIsModalVisible] = useState(false);
  const [isThemeModalVisible, setIsThemeModalVisible] = useState(false);

  const [isAppreciationModalVisible, setIsAppreciationModalVisible] =
    useState(false);

  const { lang, setLang, theme, setTheme } = useGlobalContext();
  const translations = lang === "en" ? en : hi;
  const AppTheme = theme === "light" ? Colors.light : Colors.dark;

  function handleRequestToEditProfile() {
    setEditModalVisible(true);
  }

  function handleProfileEditComplete() {
    setEditModalVisible(false);
  }

  const closeModal = () => {
    setModalVisible(false);
  };

  function closeAboutModal() {
    setAboutModalVisibility(false);
  }

  const logOut = async () => {
    try {
      await deleteToken();
      setIsAuthenticated(false);
      router.replace("/(auth)");
    } catch (error) {
      console.error("Logout failed", error);
    }
  };

  function openLanguageModal() {
    setIsModalVisible(true);
  }

  function closeLangModal() {
    setIsModalVisible(false);
  }

  function handleEnglishPicked() {
    setLang("en");
    setIsModalVisible(false);
    saveLanguage("en");
  }

  function handleHindiPicked() {
    setLang("hi");
    setIsModalVisible(false);
    saveLanguage("hi");
  }

  function openThemeModal() {
    setIsThemeModalVisible(true);
  }

  function closeThemeModal() {
    setIsThemeModalVisible(false);
  }

  function handleDarkPicked() {
    setTheme("en");
    setIsThemeModalVisible(false);
    saveTheme("dark");
  }

  function handleLightPicked() {
    setTheme("light");
    setIsThemeModalVisible(false);
    saveTheme("light");
  }

  function closeAppreciationModal() {
    setIsAppreciationModalVisible(false);
  }

  return (
    <ScrollView
      style={{
        backgroundColor: AppTheme.themeColor,
      }}
    >
      <SafeAreaView className="flex flex-1 flex-col px-4 py-4 justify-between items-center">
        <View
          style={{
            backgroundColor: AppTheme.profileCard,
            elevation: 10,
            shadowColor: "#000",
            shadowOffset: { width: 0, height: 2 },
            shadowOpacity: 0.25,
            shadowRadius: 3.84,
          }}
          className="flex fex-col items-center justify-center w-[80%] py-2 rounded-3xl drop-shadow-3xl"
        >
          <Image
            source={
              userInfo?.profileImage?.imgUrl
                ? { uri: userInfo.profileImage?.imgUrl }
                : User
            }
            className="w-[105px] h-[105px] rounded-full"
          />
          <Text
            style={{
              color: AppTheme.text,
            }}
            className="text-[20px] mt-2"
          >
            {userInfo.username}
          </Text>
        </View>

        <TouchableOpacity
          onPress={handleRequestToEditProfile}
          style={{
            backgroundColor: AppTheme.settingPressable,
          }}
          className="w-[90%] px-3 py-4 rounded-xl mt-8"
        >
          <Text
            style={{
              color: AppTheme.text,
            }}
            className="text-center"
          >
            {translations.screens.settings.editProfile}
          </Text>
        </TouchableOpacity>

        <View className="flex flex-col mt-8">
          <View className="flex my-3">
            <Text className="text-[#C4C3C3]">
              {translations.screens.settings.wannaKnow}
            </Text>
          </View>
          <RowItem
            icon={Question}
            label={translations.screens.settings.buttons.about}
            setAboutModalVisibility={setAboutModalVisibility}
            seperator
          />
          <RowItem
            icon={Heart}
            label={translations.screens.settings.buttons.appreciation}
            seperator
            setIsAppreciationModalVisible={setIsAppreciationModalVisible}
          />
          <RowItem
            setModalVisible={setModalVisible}
            icon={CustomerService}
            label={translations.screens.settings.buttons.customerService}
            setUnreadCount={setUnreadCount}
          />
        </View>

        <View className="mt-12">
          <RowItem
            icon={theme === "dark" ? LightMood : NightMood}
            label={theme === "dark" ? "Light Mode" : "Dark Mode"}
            size={"lg"}
            iconStyle={"w-[30px] h-[30px]"}
            containerStyle={"px-3 py-1 justify-center items-center"}
            openThemeModal={openThemeModal}
          />
          <RowItem
            icon={Translate}
            label={"Language"}
            size={"lg"}
            iconStyle={"w-[30px] h-[30px]"}
            containerStyle={"px-3 py-1 justify-center mt-2"}
            openLanguageModal={openLanguageModal}
          />
        </View>

        <View className="mt-16 w-[90%] mx-auto">
          <TouchableOpacity
            onPress={logOut}
            style={{
              backgroundColor: AppTheme.settingPressable,
            }}
            className={`flex flex-row gap-3 rounded-lg justify-start items-center w-full py-2`}
          >
            <Image
              source={LogOut}
              className={"w-[20px] h-[20px] elevation-10"}
            />
            <Text
              style={{
                color: AppTheme.text,
              }}
            >
              Logout
            </Text>
          </TouchableOpacity>
        </View>
      </SafeAreaView>
      <EditProfileModal
        visible={editModalVisible}
        onClose={handleProfileEditComplete}
      />
      <AboutModal visible={aboutModalVisibility} onClose={closeAboutModal} />
      <ModalView
        visible={modalVisible}
        onClose={closeModal}
        unread={setUnreadCount}
        shouldMarkAllRead={shouldMarkAllRead}
      />
      <LanguageModal
        visible={isModalVisible}
        onCloseLangModal={closeLangModal}
        onChooseEn={handleEnglishPicked}
        onChooseHi={handleHindiPicked}
      />
      <ThemeModal
        visible={isThemeModalVisible}
        onCloseThemeModal={closeThemeModal}
        onChooseDark={handleDarkPicked}
        onChooseLight={handleLightPicked}
      />

      <Appreciation
        visible={isAppreciationModalVisible}
        onCloseAppreciationModal={closeAppreciationModal}
      />
    </ScrollView>
  );
};

export default settings;
