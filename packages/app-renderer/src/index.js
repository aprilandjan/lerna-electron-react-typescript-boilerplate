import React, { Fragment } from 'react';
import { render } from 'react-dom';
import { AppContainer as ReactHotAppContainer } from 'react-hot-loader';
import Root from './containers/Root';
import { configureStore, history } from './store/configureStore';
import './assets/styles/app.global.css';

const store = configureStore();

const AppContainer = process.env.NODE_ENV === 'development' ? ReactHotAppContainer : Fragment;

render(
  <AppContainer>
    <Root store={store} history={history} />
  </AppContainer>,
  document.getElementById('root')
);
