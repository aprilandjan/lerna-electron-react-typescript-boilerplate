import { createStore, applyMiddleware, compose, combineReducers } from 'redux';
import thunk from 'redux-thunk';
import { createHashHistory } from 'history';
import { connectRouter, routerMiddleware, routerActions } from 'connected-react-router';
import * as CounterStore from './counter';

/** the root state */
export interface RootState {
  counter: CounterStore.CounterState;
}

function createRootReducer(history: ReturnType<typeof createHashHistory>) {
  return combineReducers({
    router: connectRouter(history),
    counter: CounterStore.reducers,
  });
}

const history = createHashHistory();
const rootReducer = createRootReducer(history);

const configureStore = (initialState?: any) => {
  // Redux Configuration
  const middleware: any[] = [];
  const enhancers: any[] = [];

  // Thunk Middleware
  middleware.push(thunk);

  // Router Middleware
  const router = routerMiddleware(history);
  middleware.push(router);

  // Redux DevTools Configuration
  const actionCreators = {
    ...CounterStore.actions,
    ...routerActions,
  };
  // If Redux DevTools Extension is installed use it, otherwise use Redux compose
  const composeEnhancers = (window as any).__REDUX_DEVTOOLS_EXTENSION_COMPOSE__
    ? (window as any).__REDUX_DEVTOOLS_EXTENSION_COMPOSE__({
        // Options: http://extension.remotedev.io/docs/API/Arguments.html
        actionCreators,
      })
    : compose;

  // Apply Middleware & Compose Enhancers
  enhancers.push(applyMiddleware(...middleware));

  const enhancer = composeEnhancers(...enhancers);

  // Create Store
  return createStore(rootReducer, initialState, enhancer);

  // TODO: hot replacement for model files
  // if (module.hot) {
  //   module.hot.accept('./reducers', () => store.replaceReducer(require('./reducers').default));
  // }

  // return store;
};

const store = configureStore();
const { getState, dispatch } = store;

export { history, store, getState, dispatch };