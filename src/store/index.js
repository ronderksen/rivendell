import { createStore, compose, applyMiddleware } from 'redux';
import thunk from 'redux-thunk';
import { reactReduxFirebase } from 'react-redux-firebase';
import reducers from '../reducers';
import firebaseConfig from '../private/firebase-config';

const initialState = {
  user: {
    user: null,
    error: null,
  }
};

function getDebugStoreEnhancer() {
  if (process.env.NODE_ENV === 'development' &&
    typeof window === 'object' &&
    typeof window.devToolsExtension !== 'undefined'
  ) {
    return window.devToolsExtension();
  }
  return f => f;
}

export default function createStateStore() {
  const reduxFirebaseConfig = { userProfile: 'users' };
  const middleware = [thunk];
  const enhancers = compose(
    reactReduxFirebase(firebaseConfig, reduxFirebaseConfig),
    applyMiddleware(...middleware), 
    getDebugStoreEnhancer(),
  );
  return createStore(reducers, initialState, enhancers);
}
