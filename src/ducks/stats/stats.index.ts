/* ===== TYPE_DEFINITION =====*/
import { Action } from '../types';

export const StatTypeArr = ['chargeStats', 'driveStats', 'mapPointStats'] as const;
export type StatTypes = typeof StatTypeArr[number];

export const TimeFrameArr = ['month', 'year'] as const;
export type TimeFrameTypes = typeof TimeFrameArr[number];
export type resultMetric = {
  _id: { day: number; month: number; year: number };
  value: number;
};
export interface IStatsObj {
  displayName: string;
  systemKey: string;
  results: [resultMetric];
  vehicleId: number;
  vehicle: string;
  displayOrder: number;
  unit: string;
}

/* ===== INTERFACE_DEFINITION =====*/
export interface State {
  statTypes: Array<StatTypes>;
  stats: any;
  statsError: boolean;
}

/* ===== STATE_DEFINITION ===== */
export const initialState: State = {
  statTypes: [...StatTypeArr],
  stats: {},
  statsError: false,
};

/* ===== TYPES ===== */
export enum ActionTypes {
  REQUEST_STATS = '[STATS] REQUEST_STATS',
  REQUEST_STATS_TYPES = '[STATS] REQUEST_STATS_TYPES',
  SET_STATS = '[STATS] SET_STATS',
  SET_STATS_TYPES = '[STATS] SET_STATS_TYPES',
  SET_STATS_ERROR = '[STATS] SET_STATS_ERROR',
}

/* ===== ACTION_CREATORS ===== */
export const actions = {
  requestStats: (): Action => ({ type: ActionTypes.REQUEST_STATS }),
  requestStatsTypes: (): Action => ({ type: ActionTypes.REQUEST_STATS_TYPES }),
  setStats: (value: { vehicle: string; results: Array<IStatsObj['results']>; systemKey: string }): Action => ({ type: ActionTypes.SET_STATS, payload: value }),
  setStatsTypes: (value: Array<Record<any, any>>): Action => ({ type: ActionTypes.SET_STATS_TYPES, payload: value }),
  setStatsError: (value: boolean): Action => ({ type: ActionTypes.SET_STATS_ERROR, payload: value }),
};

/* ===== SELECTORS ===== */
export const selectors = {
  getStatsToDisplay: (stats: Array<IStatsObj>, vehicle: string) => stats.filter((el: IStatsObj) => el.vehicle === vehicle).sort((a, b) => a.displayOrder - b.displayOrder),
  getDailyStats: (stats: IStatsObj) => {
    return {
      // labels: stats.results.map((metric: resultMetric) => {
      //   const {
      //     _id: { day, month, year },
      //   } = metric;
      //   return `${day}/${month}/${year}`;
      // }),
      labels: [Array.from({ length: 31 }, (_, i) => i + 1)],
      datasets: [0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11].map((el: number) => {
        return {
          label: new Date(2020, el, 1).toLocaleString('en-us', { month: 'long' }),
          data: stats.results.filter((metric) => metric._id.month === el + 1).map((metric: resultMetric) => metric.value),
          borderWidth: 1,
        };
      }),
    };
  },
  getMonthlyStats: (stats: IStatsObj, backgroundColor: string[], borderColor: string[]) => {
    const data = stats.results.reduce((acc: any, curr: resultMetric) => {
      const {
        _id: { month, year },
        value,
      } = curr;
      acc[year] = { ...acc[year], [month]: acc?.[year]?.[month] ? (acc[year][month] += value) : value };
      return acc;
    }, {});

    return {
      labels: [0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11].map((el: number) => new Date(2020, el, 1).toLocaleString('en-us', { month: 'long' })),
      datasets: Object.keys(data).map((key, idx) => ({
        label: key,
        data: Object.values(data[key]),
        borderWidth: 1,
        backgroundColor: backgroundColor[idx],
        borderColor: borderColor[idx],
      })),
    };
  },
  getYearlyStats: (stats: IStatsObj) => {
    const data = stats.results.reduce((acc: any, curr: resultMetric) => {
      const {
        _id: { year },
        value,
      } = curr;
      acc[year] = acc?.[year] ? (acc[year] += value) : value;
      return acc;
    }, {});

    return {
      labels: Object.keys(data),
      datasets: [
        {
          label: stats['displayName'],
          data: Object.values(data),
          borderWidth: 1,
        },
      ],
    };
  },
};

/* ===== REDUCER ===== */
const reducer = (state: State = initialState, action: Action) => {
  switch (action.type) {
    case ActionTypes.SET_STATS:
      let stats = state.stats[action.payload.vehicle] || [];
      const index = stats.findIndex((el: IStatsObj) => {
        return el.systemKey === action.payload.systemKey && el.vehicle === action.payload.vehicle;
      });

      if (index === -1) {
        stats = [...stats, action.payload];
      } else {
        stats[index] = action.payload;
      }

      return { ...state, stats: { ...state.stats, [action.payload.vehicle]: stats } };
    case ActionTypes.SET_STATS_TYPES:
      return { ...state, statsTypes: action.payload };
    case ActionTypes.SET_STATS_ERROR:
      return { ...state, statsError: action.payload };
    default: {
      return state;
    }
  }
};

export default reducer;
