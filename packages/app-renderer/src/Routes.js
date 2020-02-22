import React from 'react';
import { Switch, Route } from 'react-router';
import routes from './constants/routes.json';
import App from './containers/App';
import HomePage from './containers/HomePage';
import CounterPage from './containers/CounterPage';
import TestPage from './containers/TestPage';
import contextTest from './utils/test';

console.log(contextTest('a'));
console.log(contextTest.toString());

export default () => (
  <App>
    <TestPage />
    <Switch>
      <Route path={routes.COUNTER} component={CounterPage} />
      <Route path={routes.HOME} component={HomePage} />
    </Switch>
  </App>
);
