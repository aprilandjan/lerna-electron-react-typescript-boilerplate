import { handleActions, createAction } from 'redux-actions';

//=== the action types ===//
export enum COUNTER {
  /** 增加 */
  INCREASE = 'counter/increase',
  /** 减少 */
  DECREASE = 'counter/decrease',
}

//=== the action creators ===//
/** increase by specific value */
export const createIncrease = createAction(COUNTER.INCREASE, (v: number = 1) => v);
/** decrease by specific value */
export const createDecrease = createAction(COUNTER.DECREASE, (v: number = 1) => v);

export const actions = {
  /** increase by specific value */
  createIncrease: createAction(COUNTER.INCREASE, (v: number = 1) => v),
  /** decrease by specific value */
  createDecrease: createAction(COUNTER.DECREASE, (v: number = 1) => v),
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
    [COUNTER.INCREASE]: (
      state: CounterState,
      { payload }: ReturnType<typeof actions.createIncrease>
    ) => {
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
