/* ===== TYPE_DEFINITION =====*/

import { truncateTwoDecimals } from '../../utils/convert';

/* ===== INTERFACE_DEFINITION =====*/
export interface State {
  data: Record<string, any>;
  allData: Record<string, any>;
  mapPointsLoading: boolean;
  mapPointsError: boolean;
}

export type LatLongObject = 'latitude' | 'longitude' | 'heading';

export interface IMapPoint {
  _id: string;
  dataPoints: Array<{ drive_state: Record<LatLongObject, number>; _id: string }>;
  latLongString: string;
  visitCount: number;
  __v: number;
  createdAt: string | Date;
  lastModified: string | Date;
  geoJSON: {
    type: 'Polygon' | 'Point';
    coordinates: Array<Array<Array<Number>>>;
  };
  vehicle: string;
}

export interface Action {
  type: ActionTypes;
  payload?: any;
}

/* ===== STATE_DEFINITION ===== */
export const initialState: State = {
  data: {},
  allData: {},
  mapPointsLoading: false,
  mapPointsError: false,
};

/* ===== TYPES ===== */
export enum ActionTypes {
  REQUEST_MAP_POINTS = '[MAP_POINTS] REQUEST_MAP_POINTS',
  SET_MAP_POINTS = '[MAP_POINTS] SET_MAP_POINTS',
  SET_MAP_POINTS_ERROR = '[MAP_POINTS] SET_MAP_POINTS_ERROR',
  SET_MAP_POINTS_LOADING = '[MAP_POINTS] SET_MAP_POINTS_LOADING',
  SOCKET_UPDATE = '[MAP_POINTS] SOCKET_UPDATE',
}

/* ===== ACTION_CREATORS ===== */
export const actions = {
  requestMapPoints: (filterBool: boolean, vid: string, km?: number): Action => ({ type: ActionTypes.REQUEST_MAP_POINTS, payload: { filterBool, vid, km } }),
  setMapPoints: (data: Array<any>, vehicle: string, filterBool?: boolean): Action => ({ type: ActionTypes.SET_MAP_POINTS, payload: { data, filterBool, vehicle } }),
  setMapPointsLoading: (value: boolean): Action => ({ type: ActionTypes.SET_MAP_POINTS_LOADING, payload: value }),
  setMapPointsError: (value: boolean): Action => ({ type: ActionTypes.SET_MAP_POINTS_ERROR, payload: value }),
  socketUpdate: (value: Record<any, any>): Action => ({ type: ActionTypes.SOCKET_UPDATE, payload: value }),
};

/* ===== SELECTORS ===== */
export const selectors = {
  filterMapPointsByDateRange: (mapPoints: Array<IMapPoint>, keySelector: 'lastModified' | 'createdAt' = 'lastModified', startDate?: number | string | Date | undefined, endDate?: number | string | Date | undefined) =>
    mapPoints.filter((a: IMapPoint) => {
      if (!startDate && !endDate) return true;
      if (!startDate) startDate = new Date('1970-01-01');
      if (!endDate) endDate = new Date();
      const date = new Date(a[keySelector]);
      startDate = new Date(startDate);
      endDate = new Date(endDate);
      return date >= startDate && date <= endDate;
    }),
  getMapData: (idsArr: string[], data: Record<string, Array<IMapPoint>>) => {
    return idsArr
      .map((id: string) => data[id])
      .flat()
      .filter((el) => el);
  },
};

/* ===== REDUCER ===== */
const reducer = (state: State = initialState, action: Action) => {
  switch (action.type) {
    case ActionTypes.SET_MAP_POINTS:
      const key = action.payload.filterBool ? 'data' : 'allData';
      return { ...state, [key]: { ...state[key], [action.payload.vehicle]: action.payload.data } };
    case ActionTypes.SET_MAP_POINTS_ERROR:
      return { ...state, mapPointsError: action.payload };
    case ActionTypes.SET_MAP_POINTS_LOADING:
      return { ...state, mapPointsLoading: action.payload };
    case ActionTypes.SOCKET_UPDATE: {
      console.log({ payload: action.payload });
      const { latitude, longitude, timestamp, heading } = action.payload.drive_state;
      const lat = truncateTwoDecimals(latitude);
      const long = truncateTwoDecimals(longitude);
      const jsonMapPoint = `[${lat}, ${long}]`;
      const highLat = parseFloat(`${lat}999999999999`);
      const highLong = parseFloat(`${long}999999999999`);
      const lowLat = parseFloat(`${lat}`);
      const lowLong = parseFloat(`${long}`);
      if (!state.allData?.[action.payload.vehicle]) state.allData[action.payload.vehicle] = [];
      let sess = state.allData[action.payload.vehicle];
      const index = sess.findIndex((e: IMapPoint) => e.latLongString === jsonMapPoint);
      const updatedMapPoint: IMapPoint = {
        ...state.allData[action.payload.vehicle][index],
        dataPoints: [{ drive_state: { latitude: latitude, longitude: longitude, heading: heading }, _id: state.allData[action.payload.vehicle][index]?._id ?? action.payload._id }],
        latLongString: state.allData[action.payload.vehicle][index]?.latLongString ?? jsonMapPoint,
        lastModified: new Date(timestamp),
        createdAt: state.allData[action.payload.vehicle][index]?.createdAt ?? new Date(timestamp),
        geoJSON: state.allData[action.payload.vehicle][index]?.geoJSON ?? {
          type: 'Polygon',
          coordinates: [
            [
              [lowLong, lowLat],
              [lowLong, highLat],
              [highLong, highLat],
              [highLong, lowLat],
              [lowLong, lowLat],
            ],
          ],
        },
      };
      if (index !== -1) {
        sess.splice(index, 1);
      }
      sess = [updatedMapPoint, ...state.allData?.[action.payload.vehicle]];
      return {
        ...state,
        allData: { ...state.allData, [action.payload.vehicle]: sess.map((s: IMapPoint) => s) },
      };
    }
    default: {
      return state;
    }
  }
};

export default reducer;
