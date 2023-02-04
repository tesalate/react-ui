/* ===== TYPE_DEFINITION =====*/
export interface IDataPoints {
  [key: string]: {} | undefined;
}

/* ===== INTERFACE_DEFINITION =====*/
export interface State {
  dataPoints: IDataPoints;
  completeDataPointsLoading: boolean;
  completeDataPointsError: boolean;
  mostRecent: { [key: string]: string };
  count: { [key: string]: number | undefined };
}

export interface Action {
  type: ActionTypes;
  payload?: any;
}

/* ===== STATE_DEFINITION ===== */
export const initialState: State = {
  dataPoints: {},
  completeDataPointsLoading: true,
  completeDataPointsError: false,
  mostRecent: {},
  count: {},
};

/* ===== TYPES ===== */
export enum ActionTypes {
  REQUEST_DATA_POINT = '[DATA_POINT] REQUEST_DATA_POINT',
  REQUEST_MR_DATA_POINT = '[DATA_POINT] REQUEST_MR_DATA_POINT',
  SET_DATA_POINT = '[DATA_POINT] SET_DATA_POINT',
  SET_MOST_RECENT = '[DATA_POINT] SET_MOST_RECENT',
  SET_DATA_POINTS_ERROR = '[DATA_POINT] SET_DATA_POINTS_ERROR',
  SET_DATA_POINTS_LOADING = '[DATA_POINT] SET_DATA_POINTS_LOADING',
  SOCKET_UPDATE = '[DATA_POINT] SOCKET_UPDATE',
  SET_COUNT = '[DATA_POINT] SET_COUNT',
  REQUEST_HOMEPAGE_DATA = '[DATA_POINT] REQUEST_HOMEPAGE_DATA',
}

/* ===== ACTION_CREATORS ===== */
export const actions = {
  requestCompleteDataPoint: (_id: string, vid: string): Action => ({ type: ActionTypes.REQUEST_DATA_POINT, payload: { _id, vid } }),
  requestHomePageData: (): Action => ({ type: ActionTypes.REQUEST_HOMEPAGE_DATA }),
  requestMostRecentDataPoint: (vid: number): Action => ({ type: ActionTypes.REQUEST_MR_DATA_POINT, payload: { vid } }),
  setCompleteDataPoint: (k: string, v: Record<any, any>): Action => ({ type: ActionTypes.SET_DATA_POINT, payload: { k, v } }),
  setMostRecent: (vid: string, data: any): Action => ({ type: ActionTypes.SET_MOST_RECENT, payload: { vid, data } }),
  setCompleteDataPointsError: (value: boolean): Action => ({ type: ActionTypes.SET_DATA_POINTS_ERROR, payload: value }),
  setCompleteDataPointsLoading: (value: boolean): Action => ({ type: ActionTypes.SET_DATA_POINTS_LOADING, payload: value }),
  socketUpdate: (value: Record<any, any>): Action => ({ type: ActionTypes.SOCKET_UPDATE, payload: value }),
  setCompleteDataPointCount: (vehicle: string, data: any): Action => ({ type: ActionTypes.SET_COUNT, payload: { vehicle, data } }),
};

/* ===== SELECTORS ===== */
export const selectors = {};

/* ===== REDUCER ===== */
const reducer = (state: State = initialState, action: Action) => {
  switch (action.type) {
    case ActionTypes.SET_DATA_POINT:
      return { ...state, dataPoints: { ...state.dataPoints, [action.payload.k]: action.payload.v } };
    case ActionTypes.SET_MOST_RECENT:
      return { ...state, mostRecent: { ...state.mostRecent, [action.payload.vid]: action.payload.data } };
    case ActionTypes.SET_DATA_POINTS_ERROR:
      return { ...state, completeDataPointsError: action.payload };
    case ActionTypes.SET_DATA_POINTS_LOADING:
      return { ...state, completeDataPointsLoading: action.payload };
    case ActionTypes.SOCKET_UPDATE:
      return { ...state, dataPoints: { ...state.dataPoints, [action.payload._id]: action.payload }, mostRecent: { ...state.mostRecent, [action.payload.vehicle]: action.payload._id } };
    case ActionTypes.SET_COUNT:
      return { ...state, count: { ...state.count, [action.payload.vehicle]: action.payload.data } };
    default: {
      return state;
    }
  }
};

export default reducer;
