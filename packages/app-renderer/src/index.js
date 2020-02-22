import React from 'react';
import { render } from 'react-dom';
import Root from './containers/Root';
import { configureStore, history } from './store/configureStore';
import './assets/styles/app.global.css';
import vars, { a, b } from './constants/vars';
const reqVars = require('./constants/vars');
const reqVarsDefault = require('./constants/vars').default;
const img = require('@src/assets/img/icon.png');

const store = configureStore();

render(<Root store={store} history={history} />, document.getElementById('root'));

console.log('esVars', vars, a, b);
console.log('reqVars', reqVars);
console.log('img', img);

console.log('should vars, a, b all valid', vars.a === 123, a === 123, b === 456);
console.log('should reqVars valid', reqVars.a === 123);
console.log('should reqVarsDefault valid', reqVarsDefault.a === 123);
