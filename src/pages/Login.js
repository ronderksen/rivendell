import React, { Component } from 'react';
import { bindActionCreators } from 'redux';
import { connect } from 'react-redux';
import { loginWithGoogle } from '../actions/user-actions';

export class Login extends Component {
  render() {
    const { user, loginError, onLoginWithGoogle } = this.props;

    return (
      <div>
        {!user && <button onClick={onLoginWithGoogle}>Login with Google</button>}
        {user && user.displayName && <p>Welcome, {user.displayName}</p>}
        {loginError && <p>An error occurred during login: {user.error}</p>}
      </div>
    );
  }
}

function mapStateToProps(state) {
  return {
    user: state.user.user,
    loginError: state.user.error,
  }
}

function dispatchToProps(dispatch) {
  return bindActionCreators({
    onLoginWithGoogle: loginWithGoogle,
  }, dispatch);
}

export default connect(mapStateToProps, dispatchToProps)(Login);
