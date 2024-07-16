import "dotenv/config";
import { initializeApp } from "firebase/app";
import { getStorage, ref, uploadBytes, getDownloadURL } from "firebase/storage";

const firebaseConfig = {
  apiKey: process.env.API_KEY,
  authDomain: process.env.AUTH_DOMAIN,
  projectId: process.env.PROJECT_ID,
  storageBucket: process.env.STORAGE_BUCKET,
  messagingSenderId: process.env.MESSAGE_SENDER_ID,
  appId: process.env.APP_ID,
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
export const storage = getStorage(app);

export async function uploadImageAsync(uri) {
  const blob = await fetch(uri)
    .then((response) => {
      if (!response.ok) {
        throw new TypeError("Network request failed");
      }
      return response.blob();
    })
    .catch((error) => {
      console.log(error);
      throw error;
    });

  const fileRef = ref(getStorage(), "images/" + new Date().getTime());
  const result = await uploadBytes(fileRef, blob);

  blob.close();

  return await getDownloadURL(fileRef);
}
