import React, { Component } from 'react';
import { connect } from 'react-redux';
import { Redirect } from 'react-router-dom';
import { bindActionCreators } from 'redux';
import { logoutUser } from '../actions/user-actions';

export class Logout extends Component {
  componentWillMount() {
    this.props.logoutUser();
  }

  render() {
    return <Redirect to="/" />;
  }
}

const dispatchToProps = dispatch => bindActionCreators({
  logoutUser: logoutUser,
}, dispatch);

export default connect(null, dispatchToProps)(Logout);
