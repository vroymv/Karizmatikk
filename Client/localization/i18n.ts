import { en, hi } from "./translations";
import * as SecureStore from "expo-secure-store";

const STORE_LANGUAGE_KEY = "settings.lang";
const language = await SecureStore.getItemAsync(STORE_LANGUAGE_KEY);
await SecureStore.setItemAsync(STORE_LANGUAGE_KEY, language);

var i18n;

i18n.fallbacks = true;
i18n.translations = {
  en,
  hi,
};

export default i18n;
