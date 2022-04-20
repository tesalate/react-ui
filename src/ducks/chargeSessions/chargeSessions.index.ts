import { pick } from 'lodash';
import { chargeSessionQuery } from './chargeSessions.api';
/* ===== TYPE_DEFINITION =====*/

export interface IChargeSession {
  _id: string;
  dataPoints?: [string];
  startDate: Date | string;
  __v?: number;
  endDate: Date | string;
  vehicleId?: number;
  id_s?: string;
  vid?: string;
  energyAdded?: number;
  maxChargeRate?: number;
  supercharger: { title: string };
  geoJSON: {
    type: string;
    coordinates: [number, number];
  };
}

/* ===== INTERFACE_DEFINITION =====*/
export interface State {
  sessions: Record<string, any>;
  sessionData: Record<string, any>;
  selectedSession: string | null;
  chargeSessionsError: boolean;
  singleChargeSessionsError: Array<string>;
  pageIndex: number;
  pageSize: number;
  totalPages: number;
  sortBy: { id: string; desc: boolean }[];
}

export interface Action {
  type: ActionTypes;
  payload?: any;
}

/* ===== STATE_DEFINITION ===== */
export const initialState: State = {
  sessions: {},
  sessionData: {},
  selectedSession: null,
  chargeSessionsError: false,
  singleChargeSessionsError: [],
  pageIndex: 0,
  pageSize: 14,
  totalPages: 0,
  sortBy: [{ id: 'startDate', desc: true }],
};

/* ===== TYPES ===== */
export enum ActionTypes {
  REQUEST_CHARGE_SESSIONS = '[CHARGE_SESSIONS] REQUEST_CHARGE_SESSIONS',
  REQUEST_CHARGE_SESSION_BY_ID = '[CHARGE_SESSIONS] REQUEST_CHARGE_SESSION_BY_ID',
  SET_CHARGE_SESSIONS = '[CHARGE_SESSIONS] SET_CHARGE_SESSIONS',
  SET_CHARGE_SESSION_BY_ID = '[CHARGE_SESSIONS] SET_CHARGE_SESSION_BY_ID',
  SET_SELECTED_SESSION = '[CHARGE_SESSIONS] SET_SELECTED_SESSION',
  SET_CHARGE_SESSIONS_ERROR = '[CHARGE_SESSIONS] SET_CHARGE_SESSIONS_ERROR',
  SET_SINGLE_CHARGE_SESSIONS_ERROR = '[CHARGE_SESSIONS] SET_SINGLE_CHARGE_SESSIONS_ERROR',
  REMOVE_SINGLE_CHARGE_SESSIONS_ERROR = '[CHARGE_SESSIONS] REMOVE_SINGLE_CHARGE_SESSIONS_ERROR',
  SET_TABLE_OPTION = '[CHARGE_SESSIONS] SET_TABLE_OPTION',
  SET_SORT = '[CHARGE_SESSIONS] SET_SORT',
  SOCKET_UPDATE = '[CHARGE_SESSIONS] SOCKET_UPDATE',
}

/* ===== ACTION_CREATORS ===== */
export const actions = {
  requestChargeSessions: (value: chargeSessionQuery): Action => ({ type: ActionTypes.REQUEST_CHARGE_SESSIONS, payload: value }),
  requestSessionById: (id: string): Action => ({ type: ActionTypes.REQUEST_CHARGE_SESSION_BY_ID, payload: { id } }),
  setChargeSessions: (value: Array<any>): Action => ({ type: ActionTypes.SET_CHARGE_SESSIONS, payload: value }),
  setChargeSessionById: (value: Record<any, any>): Action => ({ type: ActionTypes.SET_CHARGE_SESSION_BY_ID, payload: value }),
  setSelectedSession: (value: string): Action => ({ type: ActionTypes.SET_SELECTED_SESSION, payload: value }),
  setChargeSessionsError: (value: boolean): Action => ({ type: ActionTypes.SET_CHARGE_SESSIONS_ERROR, payload: value }),
  setSingleChargeSessionsError: (value: string): Action => ({ type: ActionTypes.SET_SINGLE_CHARGE_SESSIONS_ERROR, payload: value }),
  removeSingleChargeSessionsError: (value: string): Action => ({ type: ActionTypes.REMOVE_SINGLE_CHARGE_SESSIONS_ERROR, payload: value }),
  setPageOption: (key: string, value: number): Action => ({ type: ActionTypes.SET_TABLE_OPTION, payload: { key, value } }),
  setSort: (value: Array<any>): Action => ({ type: ActionTypes.SET_SORT, payload: value }),
  socketUpdate: (value: Record<any, any>): Action => ({ type: ActionTypes.SOCKET_UPDATE, payload: value }),
};

/* ===== SELECTORS ===== */
export const selectors = {
  selectedChargeSession: (id: string, sessions: Record<any, any>) => sessions[id],
  getChargeSessions: (idsArr: string[], sessions: Record<string, Array<IChargeSession>>) => {
    return idsArr
      .map((id: string) => sessions[id])
      .flat()
      .filter((el) => el);
  },
};

/* ===== REDUCER ===== */
const reducer = (state: State = initialState, action: Action) => {
  switch (action.type) {
    case ActionTypes.SET_CHARGE_SESSIONS:
      return { ...state, sessions: { ...state.sessions, [action.payload?.[0].vehicle]: action.payload } };
    case ActionTypes.SET_SELECTED_SESSION:
      return { ...state, selectedSession: action.payload };
    case ActionTypes.SET_CHARGE_SESSION_BY_ID:
      return { ...state, sessionData: { ...state.sessionData, [action.payload._id]: action.payload } };
    case ActionTypes.SET_CHARGE_SESSIONS_ERROR:
      return { ...state, chargeSessionsError: action.payload };
    case ActionTypes.SET_SINGLE_CHARGE_SESSIONS_ERROR:
      return { ...state, singleChargeSessionsError: [...new Set([...state.singleChargeSessionsError, action.payload])] };
    case ActionTypes.REMOVE_SINGLE_CHARGE_SESSIONS_ERROR:
      return { ...state, singleChargeSessionsError: state.singleChargeSessionsError.filter((el) => el !== action.payload) };
    case ActionTypes.SET_TABLE_OPTION:
      return { ...state, [action.payload.key]: action.payload.value };
    case ActionTypes.SET_SORT:
      const sort: Array<any> = [];
      action.payload.forEach((header: Record<any, any>) => {
        if (header.isSorted) {
          sort.push({ id: header.id, desc: header.isSortedDesc });
        }
      });
      return { ...state, sortBy: sort };
    case ActionTypes.SOCKET_UPDATE: {
      let sess = state.sessions[action.payload.vehicle] ?? [];
      const index = sess.findIndex((e: IChargeSession) => e._id === action.payload._id);
      const updatedSession = pick(action.payload, ['_id', 'startDate', 'endDate', 'maxChargeRate', 'energyAdded', 'supercharger']);

      if (index === -1) {
        sess = [...sess, updatedSession];
      } else {
        sess[index] = updatedSession;
      }
      return {
        ...state,
        sessions: { ...state.sessions, [action.payload.vehicle]: sess.map((s: IChargeSession) => s) },
        sessionData: {
          ...state.sessionData,
          [action.payload._id]: action.payload.aggregateData,
        },
      };
    }
    default: {
      return state;
    }
  }
};

export default reducer;
