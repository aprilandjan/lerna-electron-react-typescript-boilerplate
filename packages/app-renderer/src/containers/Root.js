import { hot } from 'react-hot-loader/root';
import React from 'react';
import { Provider } from 'react-redux';
import { Switch, Route } from 'react-router';
import { ConnectedRouter } from 'connected-react-router';
import routes from '@/constants/routes.json';
import App from './App';
import HomePage from './HomePage';
import CounterPage from './CounterPage';

const Root = ({ store, history }) => (
  <Provider store={store}>
    <ConnectedRouter history={history}>
      <App>
        <Switch>
          <Route path={routes.HOME} component={HomePage} />
          <Route path={routes.COUNTER} component={CounterPage} />
        </Switch>
      </App>
    </ConnectedRouter>
  </Provider>
);

export default hot(Root);
