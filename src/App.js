import React, { Component } from 'react';
import { BrowserRouter as Router } from 'react-router-dom';
import { Provider } from 'react-redux';
import PageContainer from './pages/PageContainer';
import createStateStore from './store';

class App extends Component {
  render() {
    const store = createStateStore();
    return (
      <Provider store={store}>
        <Router>
          <PageContainer />
        </Router>
      </Provider>
    );
  }
}

export default App;
