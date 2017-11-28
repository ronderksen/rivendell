import React, { Component } from 'react';
import { Route, withRouter } from 'react-router-dom';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import { storageKey, auth, isAuthenticated } from '../database/firebase-init';
import { userLoggedIn } from '../actions/user-actions';
import Nav from './components/Nav';
import { About, Home, Login, Logout, Play } from './index';
import RouteWhenAuthorized from './components/RouteWhenAuthorized';

class PageContainer extends Component {
  componentDidMount() {
    const { setUser } = this.props;
    auth.onAuthStateChanged(user => {
      if (user) {
        window.localStorage.setItem(storageKey, user.uid);
        setUser({ user });
      } else {
        window.localStorage.removeItem(storageKey);
        setUser({ user: null });
      }
    });
  }

  render() {
    return <div>
      <Nav isAuthenticated={isAuthenticated()} />
      <Route exact path="/" component={Home} />
      <RouteWhenAuthorized path="/play" component={Play} />
      <Route path="/about" component={About} />
      <Route path="/login" component={Login} />
      <RouteWhenAuthorized path="/logout" component={Logout} />
    </div>;
  }
}

const dispatchToProps = dispatch => {
  return bindActionCreators({
    setUser: userLoggedIn
  }, dispatch);
};

export default withRouter(connect(null, dispatchToProps)(PageContainer));
