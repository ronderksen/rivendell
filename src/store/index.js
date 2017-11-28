import { createStore, compose, applyMiddleware } from 'redux';
import thunk from 'redux-thunk';
import reducers from '../reducers';

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
  const middleware = [thunk];
  const enhancers = compose(applyMiddleware(...middleware), getDebugStoreEnhancer());
  return createStore(reducers, initialState, enhancers);
}
