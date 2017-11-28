import { createAction } from 'redux-actions';
import nskeymirror from 'nskeymirror';
import { auth, googleAuthProvider, storageKey } from '../database/firebase-init';

const actions = nskeymirror({
  GET_USER: null,
  START_LOGIN: null,
  IS_LOGGED_IN: null,
  IS_LOGGED_OUT: null,
  LOGIN_ERROR: null,
}, 'user');

export const getUser = createAction(actions.GET_USER);
export const startLogin = createAction(actions.START_LOGIN);
export const userLoggedIn = createAction(actions.IS_LOGGED_IN);
export const userLoginError = createAction(actions.LOGIN_ERROR);
export const userLoggedOut = createAction(actions.IS_LOGGED_OUT);

export function loginWithGoogle() {
  return async dispatch => {
    auth.useDeviceLanguage();

    try {
      const { user } = await auth.signInWithPopup(googleAuthProvider);
      return dispatch(userLoggedIn({ user }));
    } catch (err) {
      return dispatch(userLoginError({ err }));
    }
  }
}

export function logoutUser() {
  return async dispatch => {
    try {
      await auth.signOut();
      window.localStorage.removeItem(storageKey);
      return dispatch(userLoggedOut());
    } catch (err) {
      return dispatch(userLoginError({ err }));
    }
  }
}
