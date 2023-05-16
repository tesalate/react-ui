/* ===== TYPE_DEFINITION =====*/
export enum SessionType {
  idle = 'idle',
  drive = 'drive',
  sleep = 'sleep',
  charge = 'charge',
  sentry = 'sentry',
  conditioning = 'conditioning',
}

export interface SessionQuery {
  vehicle: string;
  id?: string;
  type: SessionType;
  sortBy: string;
  limit: string;
  page: string;
}

export interface ISession {
  _id: string;
  dataPoints: [string];
  createdAt: Date | string;
  updatedAt: Date | string;
  vehicle: string;
  startLocation: {
    type: string;
    coordinates: [number, number];
  };
  endLocation: {
    type: string;
    coordinates: [number, number];
  };
}

/* ===== INTERFACE_DEFINITION =====*/
export interface State {
  logs: Record<string, any>;
  sessionsError: boolean;
}

export interface Action {
  type: ActionTypes;
  payload?: any;
}

/* ===== STATE_DEFINITION ===== */
export const initialState: State = {
  logs: {},
  sessionsError: false,
};

/* ===== TYPES ===== */
export enum ActionTypes {
  REQUEST_LOGS = '[SESSIONS] REQUEST_LOGS',
  REQUEST_SESSIONS = '[SESSIONS] REQUEST_SESSIONS',
  REQUEST_SESSION_BY_ID = '[SESSIONS] REQUEST_SESSION_BY_ID',
  SET_LOGS = '[SESSIONS] SET_LOGS',
  SET_SESSIONS = '[SESSIONS] SET_SESSIONS',
  SET_SESSION_BY_ID = '[SESSIONS] SET_SESSION_BY_ID',
  SET_SELECTED_SESSION = '[SESSIONS] SET_SELECTED_SESSION',
  SET_SESSIONS_ERROR = '[SESSIONS] SET_SESSIONS_ERROR',
  SET_SINGLE_SESSIONS_ERROR = '[SESSIONS] SET_SINGLE_SESSIONS_ERROR',
  REMOVE_SINGLE_SESSIONS_ERROR = '[SESSIONS] REMOVE_SINGLE_SESSIONS_ERROR',
  SET_TABLE_OPTION = '[SESSIONS] SET_TABLE_OPTION',
  SET_SORT = '[SESSIONS] SET_SORT',
  SOCKET_UPDATE = '[SESSIONS] SOCKET_UPDATE',
}

/* ===== ACTION_CREATORS ===== */
export const actions = {
  requestLogs: (value: Record<any, any>): Action => ({ type: ActionTypes.REQUEST_LOGS, payload: value }),
  requestSessions: (value: SessionQuery): Action => ({ type: ActionTypes.REQUEST_SESSIONS, payload: value }),
  requestSessionById: (id: string): Action => ({ type: ActionTypes.REQUEST_SESSION_BY_ID, payload: { id } }),
  setSessions: (vehicle: string, sessions: Array<any>): Action => ({ type: ActionTypes.SET_SESSIONS, payload: { vehicle, sessions } }),
  setLogs: (vehicle: string, date: string, logs: Array<any>): Action => ({ type: ActionTypes.SET_LOGS, payload: { vehicle, date, logs } }),
  setSessionById: (value: Record<any, any>): Action => ({ type: ActionTypes.SET_SESSION_BY_ID, payload: value }),
  setSelectedSession: (value: string): Action => ({ type: ActionTypes.SET_SELECTED_SESSION, payload: value }),
  setSessionsError: (value: boolean): Action => ({ type: ActionTypes.SET_SESSIONS_ERROR, payload: value }),
  setSingleSessionsError: (value: string): Action => ({ type: ActionTypes.SET_SINGLE_SESSIONS_ERROR, payload: value }),
  removeSingleSessionsError: (value: string): Action => ({ type: ActionTypes.REMOVE_SINGLE_SESSIONS_ERROR, payload: value }),
  setPageOption: (key: string, value: number): Action => ({ type: ActionTypes.SET_TABLE_OPTION, payload: { key, value } }),
  setSort: (value: Array<any>): Action => ({ type: ActionTypes.SET_SORT, payload: value }),
  socketUpdate: (value: Record<any, any>): Action => ({ type: ActionTypes.SOCKET_UPDATE, payload: value }),
};

/* ===== SELECTORS ===== */
export const selectors = {
  selectedSession: (id: string, sessions: Record<any, any>) => sessions[id],
  getSessions: (idsArr: string[], sessions: Record<string, Array<ISession>>) => {
    return idsArr
      .map((id: string) => sessions[id])
      .flat()
      .filter((el) => el);
  },
};

/* ===== REDUCER ===== */
const reducer = (state: State = initialState, action: Action) => {
  switch (action.type) {
    case ActionTypes.SET_LOGS:
      return {
        ...state,
        logs: {
          ...state.logs,
          [action.payload.vehicle]: {
            ...state.logs[action.payload.vehicle],
            [new Date(action.payload.date).toLocaleDateString('en-CA')]: action.payload.logs,
          },
        },
      };
    case ActionTypes.SET_SESSIONS_ERROR:
      return { ...state, sessionsError: action.payload };
    default: {
      return state;
    }
  }
};

export default reducer;
