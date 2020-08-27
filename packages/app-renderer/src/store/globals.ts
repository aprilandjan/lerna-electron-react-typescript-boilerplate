import { handleActions, createAction } from 'redux-actions';
//=== the action types ===//
export enum GLOBALS {
  /** set user */
  SET_USER = 'globals/setUser',
}

//=== the action creators ===//
/** increase by specific value */
export const createSetUser = createAction(GLOBALS.SET_USER, (user: string) => user);

//  just a union for type safe definition
export const actions = {
  createSetUser,
};

//  FIXME: had to extract thunk into an individual type to avoid type circular references
//  Type 'ThunkResult' is not generic.  TS2315
export const thunks = {};

//=== the state ===//
export interface GlobalsState {
  user: string;
}
export const initialState: GlobalsState = {
  user: '',
};

//=== the reducers ===//
/** reducer function */
export const reducers = handleActions(
  {
    [GLOBALS.SET_USER]: (state: GlobalsState, { payload }: ReturnType<typeof createSetUser>) => {
      return {
        ...state,
        user: payload,
      };
    },
  },
  initialState
);
