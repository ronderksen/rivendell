import React, { Component } from 'react';
import { auth } from 'firebase';
import Login from './Login';

export class LoginContainer extends Component {
  constructor(props) {
    super(props);
    this.googleProvider = new auth.GoogleAuthProvider();
    auth().useDeviceLanguage();
  }

  handleGoogleLogin = async () => {
    try {
      const { user } = await auth().signInWithPopup(this.googleProvider);
      return user;
    } catch (err) {
      return new Error(`Login failed: ${err.message}`);
    }
  };

  render() {
    return <Login onGoogleLogin={this.handleGoogleLogin} />;
  }
}
