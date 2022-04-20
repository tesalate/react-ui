import { Action } from '../types';
/* ===== TYPE_DEFINITION =====*/

export interface ITeslaAccount {
  _id: string;
  user: string;
  vehicles: string[];
  email: string;
  linked: boolean;
}

/* ===== INTERFACE_DEFINITION =====*/
export interface State {
  account: ITeslaAccount;
  teslaAccountError: boolean;
}

/* ===== STATE_DEFINITION ===== */
export const initialState: State = {
  account: {
    _id: '',
    user: '',
    vehicles: [],
    email: '',
    linked: false,
  },
  teslaAccountError: false,
};

/* ===== TYPES ===== */
export enum ActionTypes {
  REQUEST_TESLA_ACCOUNT = '[TESLA_ACCOUNT] REQUEST_TESLA_ACCOUNT',
  SET_TESLA_ACCOUNT = '[TESLA_ACCOUNT] SET_TESLA_ACCOUNT',
  SET_TESLA_ACCOUNT_ERROR = '[TESLA_ACCOUNT] SET_TESLA_ACCOUNT_ERROR',
  REMOVE_TESLA_ACCOUNT_ERROR = '[TESLA_ACCOUNT] REMOVE_TESLA_ACCOUNT_ERROR',
  REFRESH_TESLA_VEHICLES = '[TESLA_ACCOUNT] REFRESH_TESLA_VEHICLES',
  UPDATE_MINING_STATUS = '[TESLA_ACCOUNT] UPDATE_MINING_STATUS',
}

/* ===== ACTION_CREATORS ===== */
export const actions = {
  requestTeslaAccount: (): Action => ({ type: ActionTypes.REQUEST_TESLA_ACCOUNT }),
  setTeslaAccount: (value: Array<any>): Action => ({ type: ActionTypes.SET_TESLA_ACCOUNT, payload: value }),
  setTeslaAccountError: (value: boolean): Action => ({ type: ActionTypes.SET_TESLA_ACCOUNT_ERROR, payload: value }),
  removeTeslaAccountError: (value: string): Action => ({ type: ActionTypes.REMOVE_TESLA_ACCOUNT_ERROR, payload: value }),
  refreshTeslaVehicles: (): Action => ({ type: ActionTypes.REFRESH_TESLA_VEHICLES }),
  updateMiningStatus: (vid: number, active: boolean): Action => ({ type: ActionTypes.UPDATE_MINING_STATUS, payload: { vid, active } }),
};

/* ===== SELECTORS ===== */
export const selectors = {};

/* ===== REDUCER ===== */
const reducer = (state: State = initialState, action: Action) => {
  switch (action.type) {
    case ActionTypes.SET_TESLA_ACCOUNT:
      return { ...state, account: action.payload };
    case ActionTypes.SET_TESLA_ACCOUNT_ERROR:
      return { ...state, teslaAccountError: action.payload };
    default: {
      return state;
    }
  }
};

export default reducer;
