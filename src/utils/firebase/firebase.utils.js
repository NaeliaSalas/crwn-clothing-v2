import { initializeApp } from "firebase/app";
import {
  getAuth,
  signInWithRedirect,
  signInWithPopup,
  GoogleAuthProvider,
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  signOut,
  onAuthStateChanged,
  
} from "firebase/auth";
import { getFirestore, doc, getDoc, setDoc, collection, writeBatch, query, getDocs } from "firebase/firestore";

const firebaseConfig = {
  apiKey: "AIzaSyBEt_B4LWE9ivOVD8SE6D-t0p4VIVuL7K4",
  authDomain: "crwn-clothing-db-af528.firebaseapp.com",
  projectId: "crwn-clothing-db-af528",
  storageBucket: "crwn-clothing-db-af528.appspot.com",
  messagingSenderId: "921196226072",
  appId: "1:921196226072:web:efe0073a3ef794fd5b456d",
};

// Initialize Firebase
const firebaseApp = initializeApp(firebaseConfig);

const googleProvider = new GoogleAuthProvider();

const provider = new GoogleAuthProvider();
provider.setCustomParameters({
  prompt: "select_account",
});

export const auth = getAuth();
export const signInWithGooglePopup = () =>
  signInWithPopup(auth, googleProvider);
export const signInWithGoogleRedirect = () =>
  signInWithRedirect(auth, googleProvider);

export const db = getFirestore();

export const addCollectionAndDocuments = async (collectionKey, objectsToAdd) => {
  const collectionRef = collection(db,  collectionKey)
  const batch = writeBatch(db);

  objectsToAdd.forEach((object) => {
    const docRef = doc(collectionRef, object.title.toLowerCase())
    batch.set(docRef, object)
  });

  await batch. commit()
  console.log("done")
} 

export const getCategoriesAndDocuments = async() => {
  const collectionRef = collection(db, "categories")
  const q = query(collectionRef)

  const querySnapshot = await getDocs(q)
  const categoryMap = querySnapshot.docs.reduce((acc,docSnapshot) => {
    const {title, items} = docSnapshot.data()
    acc[title.toLowerCase()] = items
    return acc
  }, [])

  return categoryMap;
}

export const createUserDocumentFromAuth = async (
  userAuth,
  additionalInformation = { displayName: "naelia" }
) => {
  if (!userAuth) return;
  const userDocRef = doc(db, "users", userAuth.uid);

  const userSnapShot = await getDoc(userDocRef);

  if (!userSnapShot.exists()) {
    const { displayName, email } = userAuth;
    const createdAt = new Date();

    try {
      await setDoc(userDocRef, {
        displayName,
        email,
        createdAt,
        ...additionalInformation,
      });
    } catch (error) {
      console.log("error creating the user", error.message);
    }
  }

  return userDocRef;
};

export const createAuthUserWithEmailAndPassword = async (email, password) => {
  if (!email || !password) return;

  return await createUserWithEmailAndPassword(auth, email, password);
};
export const signInAuthUserWithEmailAndPassword = async (email, password) => {
  if (!email || !password) return;

  return await signInWithEmailAndPassword(auth, email, password);
};

export const signOutUser = async () => await signOut(auth);

export const onAuthStateChangedListener = (callback) =>
  onAuthStateChanged(auth, callback);

/**
 * {
 * next: callback
 * }
 *
 *
 */
