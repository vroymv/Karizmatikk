import * as SecureStore from "expo-secure-store";

async function saveToken(token) {
  try {
    await SecureStore.setItemAsync("jwt_token", token);
  } catch (error) {
    console.log(error);
  }
}

async function getToken() {
  try {
    const token = await SecureStore.getItemAsync("jwt_token");
    if (token) {
      return token;
    } else {
      return null;
    }
  } catch (error) {
    console.log(error);
  }
}

async function deleteToken() {
  try {
    await SecureStore.deleteItemAsync("jwt_token");
    console.log("Token deleted");
  } catch (error) {
    console.log(error);
  }
}

async function saveLanguage(lang) {
  try {
    await SecureStore.setItemAsync("karizmatik_lang", lang);
    console.log("language saved");
  } catch (error) {
    console.log(error);
  }
}

async function getLanguage() {
  try {
    const lang = await SecureStore.getItemAsync("karizmatik_lang");
    if (lang) {
      return lang;
    } else {
      return null;
    }
  } catch (error) {
    console.log(error);
  }
}

async function saveTheme(theme) {
  try {
    await SecureStore.setItemAsync("theme", theme);
  } catch (error) {
    console.log(error);
  }
}

async function getTheme() {
  try {
    const theme = await SecureStore.getItemAsync("theme");
    if (theme) {
      return theme;
    } else {
      return null;
    }
  } catch (error) {
    console.log(error);
  }
}

export {
  saveToken,
  getToken,
  deleteToken,
  saveLanguage,
  getLanguage,
  getTheme,
  saveTheme,
};
