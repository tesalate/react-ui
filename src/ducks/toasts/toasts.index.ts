/* ===== TYPE_DEFINITION =====*/
export interface IToastObj {
  _id       : string
  startDate : Date | string
  type      : string
  vid       : string
}

/* ===== INTERFACE_DEFINITION =====*/
export interface State {
  activeToasts : Array<IToastObj>
}

export interface Action {
  type     : ActionTypes
  payload? : any
}


/* ===== STATE_DEFINITION ===== */
export const initialState: State = {
  activeToasts : [
    // {
    //   _id       : '6157dbafc78f414cb8b4b5b8',
    //   startDate : '2021-10-02T04:10:23.977Z',
    //   type      : 'charge-sessions',
    //   vid       : '5cef2b3fb0171d159c515e4d'
    // }
  ]
};


/* ===== TYPES ===== */
export enum ActionTypes {
  ADD_TOAST    = '[TOASTS] ADD_TOAST',
  REMOVE_TOAST = '[TOASTS] REMOVE_TOAST',
}


/* ===== ACTION_CREATORS ===== */
export const actions = {
  addToasts    : (toast: IToastObj) : Action => ({ type: ActionTypes.ADD_TOAST, payload: toast }),
  removeToasts : (_id: string) : Action => ({ type: ActionTypes.REMOVE_TOAST, payload: _id }),
};


/* ===== SELECTORS ===== */
export const selectors = { };


/* ===== REDUCER ===== */
const reducer = (state: State=initialState, action: Action) => {
  switch (action.type) {
    case ActionTypes.ADD_TOAST:
      return { ...state, activeToasts: [ ...state.activeToasts, action.payload ] };
    case ActionTypes.REMOVE_TOAST:
      return { ...state, activeToasts: state.activeToasts.filter((el:IToastObj) => el._id !== action.payload) };
    default: { return state; }
  }
}

export default reducer;
