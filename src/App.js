import React, { Component } from 'react';
import { BrowserRouter as Router } from 'react-router-dom';
import { PageContainer } from './pages';

class App extends Component {
  constructor(props) {
    super(props);
  }

  render() {
    return (
      <Router>
        <PageContainer />
      </Router>
    );
  }
}

export default App;
