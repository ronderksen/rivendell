import React, { Component } from 'react';
import { Switch, Route } from 'react-router-dom';
import { HomePage, PlayPage, AboutPage } from '../index';
import Nav from './Nav';

export default class PageContainer extends Component {
  render() {
    return (
      <div>
        <Nav />
        <Switch>
          <Route exact path="/" component={HomePage} />
          <Route path="/play" component={PlayPage} />
          <Route path="/about" component={AboutPage} />
        </Switch>
      </div>
    )
  }
}
