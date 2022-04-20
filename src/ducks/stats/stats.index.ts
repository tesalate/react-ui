/* ===== TYPE_DEFINITION =====*/
import { Action } from '../types';


export const StatTypeArr = ["EnergyAddedByMonth", "MilesDrivenByMonth", "NewMapPointsByMonth"] as const;
export type StatTypes = typeof StatTypeArr[number];

export const TimeFrameArr = ["month", "year"] as const;
export type TimeFrameTypes = typeof TimeFrameArr[number];

export interface IStatsObj {
  displayName : string
  systemKey   : string
  data        : [{
    "_id"       : { "month":number, "year":number },
    "value"     : number,
  }]
  vehicleId    : number
  vid          : string
  displayOrder : number
  unit         : string
}

/* ===== INTERFACE_DEFINITION =====*/
export interface State {
  statTypes  : Array<StatTypes>
  stats      : any,
  statsError : boolean,
}

/* ===== STATE_DEFINITION ===== */
export const initialState: State = {
  statTypes  : [...StatTypeArr],
  stats      : {},
  statsError : false,
};


/* ===== TYPES ===== */
export enum ActionTypes {
  REQUEST_STATS       = '[STATS] REQUEST_STATS',
  REQUEST_STATS_TYPES = '[STATS] REQUEST_STATS_TYPES',
  SET_STATS           = '[STATS] SET_STATS',
  SET_STATS_TYPES     = '[STATS] SET_STATS_TYPES',
  SET_STATS_ERROR     = '[STATS] SET_STATS_ERROR',
}


/* ===== ACTION_CREATORS ===== */
export const actions = {
  requestStats      : ()                                                                    : Action => ({ type: ActionTypes.REQUEST_STATS }),
  requestStatsTypes : ()                                                                    : Action => ({ type: ActionTypes.REQUEST_STATS_TYPES }),
  setStats          : (value:{data: {vid:string, data:Array<IStatsObj>, systemKey:string}}) : Action => ({ type: ActionTypes.SET_STATS      , payload : value }),
  setStatsTypes     : (value: Array<Record<any, any>>,)                                     : Action => ({ type: ActionTypes.SET_STATS_TYPES , payload : value }),
  setStatsError     : (value: boolean)                                                      : Action => ({ type: ActionTypes.SET_STATS_ERROR, payload : value }),
};


/* ===== SELECTORS ===== */
export const selectors = {
  getStatsToDisplay: (stats: Array<IStatsObj>, vid:string) => stats.filter((el:IStatsObj) => el.vid === vid).sort((a,b)=> a.displayOrder - b.displayOrder)
};


/* ===== REDUCER ===== */
const reducer = (state: State=initialState, action: Action) => {
  switch (action.type) {
    case ActionTypes.SET_STATS:
      let stats = state.stats[action.payload.vid] || []
      const index = stats.findIndex((el:IStatsObj) => {
        return el.systemKey === action.payload.systemKey && el.vid === action.payload.vid
      })
      
      if (index === -1) {
        stats = [...stats, action.payload]
      } else {
        stats[index] = action.payload
      }

      return { ...state, stats : { ...state.stats, [action.payload.vid]: stats } } 
    case ActionTypes.SET_STATS_TYPES: 
      return { ...state, statsTypes: action.payload };
    case ActionTypes.SET_STATS_ERROR: 
      return { ...state, statsError: action.payload };
    default: { return state; }
  }
}

export default reducer;
