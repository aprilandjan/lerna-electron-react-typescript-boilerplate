import { createStore, applyMiddleware, compose, combineReducers } from 'redux';
import thunk, { ThunkAction, ThunkDispatch } from 'redux-thunk';
import { createHashHistory } from 'history';
import { connectRouter, routerMiddleware, routerActions } from 'connected-react-router';
import * as CounterStore from './counter';

/** the root state */
export interface RootStates {
  counter: CounterStore.CounterState;
}

//  FIXME: combine more slices
type RootActions = MappedReturnType<typeof CounterStore.actions>;

//  ThunkAction<R, S, E, A>
//  R: return type
//  S: type of the root state, also the return value of `getState()`
//  E: Extra arguments passed to the thunk action
//  A: the application actions from redux action()
export type ThunkResult<R> = ThunkAction<R, RootStates, null, RootActions>;
// export type ThunkResult<R> = any;

//  connected dispatch
export interface ThunkConnected {
  dispatch: ThunkDispatch<RootStates, null, RootActions>;
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
    ...CounterStore.thunks,
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
  // FIXME: does this require really works?
  // if (module.hot) {
  //   module.hot.accept('./reducers', () => store.replaceReducer(require('./reducers').default));
  // }

  // return store;
};

const store = configureStore();
const { getState, dispatch } = store;

export { history, store, getState, dispatch };
