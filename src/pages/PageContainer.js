import PropTypes from 'prop-types';
import React, { Component } from 'react';
import { connect } from 'react-redux';
import { compose } from 'redux';
import { firebaseConnect, isEmpty, isLoaded, dataToJS, pathToJS, toJS } from 'react-redux-firebase';

class PageContainer extends Component {
  render() {
    const { games, auth } = this.props;

    return (
      <div>
        {isLoaded(auth) && <p>{auth.displayName}</p>}
        <h1>Games</h1>
        <ul>
          {!isLoaded(games) ? <li>Loading...</li> : isEmpty(games) ? <li>No games available</li> : toJS(games).map(game =>
            <li>{game.name}</li>)}
        </ul>
      </div>
    );
  }
}

PageContainer.propTypes = {
  games: PropTypes.object,
  firebase: PropTypes.object,
};

const withFirebaseData = compose(
  firebaseConnect([
    'games',
  ]),
  connect(
    ({ firebase }) => ({
      games: dataToJS(firebase, 'games'),
      authError: pathToJS(firebase, 'authError'),
      auth: pathToJS(firebase, 'auth'),
    })
  ),
);

export default withFirebaseData(PageContainer);
