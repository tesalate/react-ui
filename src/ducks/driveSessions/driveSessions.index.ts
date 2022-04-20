import { pick } from 'lodash';
import { driveSessionQuery } from './driveSessions.api';
/* ===== TYPE_DEFINITION =====*/

export interface IDriveSession {
  _id: string;
  endLocation: {
    type: string;
    coordinates: [number, number];
  };
  dataPoints: [string];
  maxSpeed: number;
  maxPower: number;
  maxRegen: number;
  distance: number;
  vehicleId: number;
  vid: string;
  startLocation: {
    type: string;
    coordinates: [number, number];
  };
  startDate: Date | string;
  endDate: Date | string;
  __v: number;
  id_s: string;
}

/* ===== INTERFACE_DEFINITION =====*/
export interface State {
  sessions: Record<string, any>;
  sessionData: Record<string, any>;
  selectedSession: string | null;
  singleDriveSessionsError: Array<string>;
  driveSessionsError: boolean;
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
  driveSessionsError: false,
  singleDriveSessionsError: [],
  pageIndex: 0,
  pageSize: 14,
  totalPages: 0,
  sortBy: [{ id: 'startDate', desc: true }],
};

/* ===== TYPES ===== */
export enum ActionTypes {
  REQUEST_DRIVE_SESSIONS = '[DRIVE_SESSIONS] REQUEST_DRIVE_SESSIONS',
  REQUEST_DRIVE_SESSION_BY_ID = '[DRIVE_SESSIONS] REQUEST_DRIVE_SESSION_BY_ID',
  SET_DRIVE_SESSIONS = '[DRIVE_SESSIONS] SET_DRIVE_SESSIONS',
  SET_DRIVE_SESSION_BY_ID = '[DRIVE_SESSIONS] SET_DRIVE_SESSION_BY_ID',
  SET_SELECTED_SESSION = '[DRIVE_SESSIONS] SET_SELECTED_SESSION',
  SET_DRIVE_SESSIONS_ERROR = '[DRIVE_SESSIONS] SET_DRIVE_SESSIONS_ERROR',
  SET_TABLE_OPTION = '[DRIVE_SESSIONS] SET_TABLE_OPTION',
  SET_SORT = '[DRIVE_SESSIONS] SET_SORT',
  SOCKET_UPDATE = '[DRIVE_SESSIONS] SOCKET_UPDATE',
  SET_SINGLE_DRIVE_SESSIONS_ERROR = '[DRIVE_SESSIONS] SET_SINGLE_DRIVE_SESSIONS_ERROR',
  REMOVE_SINGLE_DRIVE_SESSIONS_ERROR = '[DRIVE_SESSIONS] REMOVE_SINGLE_DRIVE_SESSIONS_ERROR',
}

/* ===== ACTION_CREATORS ===== */
export const actions = {
  requestDriveSessions: (value: driveSessionQuery): Action => ({ type: ActionTypes.REQUEST_DRIVE_SESSIONS, payload: value }),
  requestSessionById: (id: string): Action => ({ type: ActionTypes.REQUEST_DRIVE_SESSION_BY_ID, payload: { id } }),
  setDriveSessions: (value: Array<any>): Action => ({ type: ActionTypes.SET_DRIVE_SESSIONS, payload: value }),
  setDriveSessionById: (value: Record<any, any>): Action => ({ type: ActionTypes.SET_DRIVE_SESSION_BY_ID, payload: value }),
  setSelectedSession: (value: string): Action => ({ type: ActionTypes.SET_SELECTED_SESSION, payload: value }),
  setDriveSessionsError: (value: boolean): Action => ({ type: ActionTypes.SET_DRIVE_SESSIONS_ERROR, payload: value }),
  setSingleDriveSessionsError: (value: string): Action => ({ type: ActionTypes.SET_SINGLE_DRIVE_SESSIONS_ERROR, payload: value }),
  removeSingleDriveSessionsError: (value: string): Action => ({ type: ActionTypes.REMOVE_SINGLE_DRIVE_SESSIONS_ERROR, payload: value }),
  setPageOption: (key: string, value: number): Action => ({ type: ActionTypes.SET_TABLE_OPTION, payload: { key, value } }),
  setSort: (value: Array<any>): Action => ({ type: ActionTypes.SET_SORT, payload: value }),
  socketUpdate: (value: Record<any, any>): Action => ({ type: ActionTypes.SOCKET_UPDATE, payload: value }),
};

/* ===== SELECTORS ===== */
export const selectors = {
  selectedDriveSession: (id: string, sessions: Record<any, any>) => sessions[id],
  getDriveSessions: (idsArr: string[], sessions: Record<string, Array<IDriveSession>>) => {
    return idsArr
      .map((id: string) => sessions[id])
      .flat()
      .filter((el) => el);
  },
};

/* ===== REDUCER ===== */
const reducer = (state: State = initialState, action: Action) => {
  switch (action.type) {
    case ActionTypes.SET_DRIVE_SESSIONS:
      return { ...state, sessions: { ...state.sessions, [action.payload?.[0].vehicle]: action.payload } };
    case ActionTypes.SET_SELECTED_SESSION:
      return { ...state, selectedSession: action.payload };
    case ActionTypes.SET_DRIVE_SESSION_BY_ID:
      return { ...state, sessionData: { ...state.sessionData, [action.payload._id]: action.payload } };
    case ActionTypes.SET_DRIVE_SESSIONS_ERROR:
      return { ...state, driveSessionsError: action.payload };
    case ActionTypes.SET_SINGLE_DRIVE_SESSIONS_ERROR:
      return { ...state, singleDriveSessionsError: [...new Set([...state.singleDriveSessionsError, action.payload])] };
    case ActionTypes.REMOVE_SINGLE_DRIVE_SESSIONS_ERROR:
      return { ...state, singleDriveSessionsError: state.singleDriveSessionsError.filter((el) => el !== action.payload) };
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
      const index = sess.findIndex((e: IDriveSession) => e._id === action.payload._id);
      const updatedSession = pick(action.payload, ['_id', 'startDate', 'endDate', 'distance', 'maxRegen', 'maxPower', 'maxSpeed']);

      if (index === -1) {
        sess = [...sess, updatedSession];
      } else {
        sess[index] = updatedSession;
      }
      return {
        ...state,
        sessions: { ...state.sessions, [action.payload.vehicle]: sess.map((s: IDriveSession) => s) },
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
