import React from 'react';
import { Route, Redirect } from 'react-router-dom';
import { isAuthenticated } from '../../database/firebase-init';

export default ({component: Component, ...rest}) => {
  console.log('checking', isAuthenticated());
  return (
    <Route {...rest} render={renderProps => (
      isAuthenticated() ? (
        <Component {...renderProps} />
      ) : (
        <Redirect to={{
          pathname: '/login',
          state: { from: renderProps.location }
        }} />
      )
    )} />
  )
}
