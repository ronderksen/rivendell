import firebase from 'firebase';
import config from '../private/firebase-config';

export const firebaseApp = firebase.initializeApp(config);
export const db = firebaseApp.database();
export const auth = firebaseApp.auth();
export const googleAuthProvider = new firebase.auth.GoogleAuthProvider();
export const storageKey = 'RIVENDEL_AUTH_KEY';

export const isAuthenticated = () => !!auth.currentUser || !!localStorage.getItem(storageKey);

