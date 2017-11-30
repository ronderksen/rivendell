import { combineReducers } from 'redux';
import { firebaseStateReducer } from 'react-redux-firebase';
import user from './user';

export default combineReducers({
  firebase: firebaseStateReducer,
  user
});
