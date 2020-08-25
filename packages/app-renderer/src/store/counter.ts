import { handleActions, createAction } from 'redux-actions';
import { ThunkResult } from '.';
//=== the action types ===//
export enum COUNTER {
  /** increase */
  INCREASE = 'counter/increase',
  /** decrease */
  DECREASE = 'counter/decrease',
}

//=== the action creators ===//
/** increase by specific value */
export const createIncrease = createAction(COUNTER.INCREASE, (v: number = 1) => v);
/** decrease by specific value */
export const createDecrease = createAction(COUNTER.DECREASE, (v: number = 1) => v);

/** thunk increase */
export function createIncreaseIfOdd(): ThunkResult<void> {
  return (dispatch, getState) => {
    const { counter } = getState();

    if (counter.count % 2 === 0) {
      return;
    }

    dispatch(createIncrease(1));
  };
}

/** thunk increase */
export function createIncreaseAsync(delay: number = 1000): ThunkResult<void> {
  return (dispatch, getState) => {
    dispatch(createIncrease(1));
    setTimeout(() => {
      dispatch(createIncreaseAsync(1000));
    }, delay);
  };
}

//  just a union for type safe definition
export const actions = {
  createIncrease,
  createDecrease,
};

//  FIXME: had to extract thunk into an individual type to avoid type circular references
//  Type 'ThunkResult' is not generic.  TS2315
export const thunks = {
  createIncreaseIfOdd,
  createIncreaseAsync,
};

//=== the state ===//
export interface CounterState {
  count: number;
}
export const initialState: CounterState = {
  count: 0,
};

//=== the reducers ===//
/** reducer function */
export const reducers = handleActions(
  {
    [COUNTER.INCREASE]: (state: CounterState, { payload }: ReturnType<typeof createIncrease>) => {
      return {
        count: state.count + payload,
      };
    },
    [COUNTER.DECREASE]: (state: CounterState, { payload }: ReturnType<typeof createDecrease>) => {
      return {
        count: state.count - payload,
      };
    },
  },
  initialState
);
