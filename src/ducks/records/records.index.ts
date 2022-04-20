/* ===== TYPE_DEFINITION =====*/
import { Action } from '../types.d';


/* ===== INTERFACE_DEFINITION =====*/
export interface State {
  data        : Array<Record<any, any>>,
  recordTypes : Array<Record<any, any>>,
  recordsError: boolean,
}

/* ===== STATE_DEFINITION ===== */
export const initialState: State = {
  data        : [],
  recordTypes : [],
  recordsError: false,
};


/* ===== TYPES ===== */
export enum ActionTypes {
  REQUEST_RECORDS     = '[RECORDS] REQUEST_RECORDS',
  REQUEST_RECORD      = '[RECORDS] REQUEST_RECORD',
  REQUEST_RECORD_TYPES= '[RECORDS] REQUEST_RECORDS_TYPES',
  SET_RECORDS         = '[RECORDS] SET_RECORDS',
  SET_RECORD          = '[RECORDS] SET_RECORD',
  SET_RECORD_TYPES    = '[RECORDS] SET_RECORD_TYPES',
  SET_RECORDS_ERROR   = '[RECORDS] SET_RECORDS_ERROR',
}


/* ===== ACTION_CREATORS ===== */
export const actions = {
  requestRecords    : (vid: number)                    : Action => ({ type: ActionTypes.REQUEST_RECORDS, payload : vid }),
  requestRecord     : (systemKey: string, vid: string) : Action => ({ type: ActionTypes.REQUEST_RECORD , payload : {systemKey, vid}}),
  requestRecordTypes: ()                               : Action => ({ type: ActionTypes.REQUEST_RECORD_TYPES }),
  setRecords        : (value: any)                     : Action => ({ type: ActionTypes.SET_RECORDS      , payload : value }),
  setRecord         : (value: any)                     : Action => ({ type: ActionTypes.SET_RECORD      , payload : value }),
  setRecordTypes    : (value: Array<Record<any, any>>,): Action => ({ type: ActionTypes.SET_RECORD_TYPES , payload : value }),
  setRecordsError   : (value: boolean)                 : Action => ({ type: ActionTypes.SET_RECORDS_ERROR, payload : value }),
};


/* ===== SELECTORS ===== */
export const selectors = {
  getRecordsToDisplay: (records: Array<Record<any,any>>) => records.sort((a,b)=> a.displayOrder - b.displayOrder)
};


/* ===== REDUCER ===== */
const reducer = (state: State=initialState, action: Action) => {
  switch (action.type) {
    case ActionTypes.SET_RECORD:
      if( state.data.length === 0) return { ...state, data: [action.payload] }
      if(state.data.findIndex(el => el.systemKey ===  action.payload.systemKey ) >= 0){
        return { 
          ...state, 
          data: state.data.map((content) => content.systemKey === action.payload.systemKey ? action.payload : content)
       };
      }
      return { ...state, data: [...state.data, action.payload]} 
    case ActionTypes.SET_RECORDS:
      if( state.data.length === 0) return { ...state, data: action.payload }
      if(state.data.findIndex(el => el.systemKey ===  action.payload.systemKey ) < 0){
        return { 
          ...state, 
          data: state.data.map((content) => content.systemKey === action.payload.systemKey ? action.payload : content)
       };
      }
      return { ...state } 
    case ActionTypes.SET_RECORD_TYPES: 
      return { ...state, recordTypes: action.payload };
    case ActionTypes.SET_RECORDS_ERROR: 
      return { ...state, recordsError: action.payload };
    default: { return state; }
  }
}

export default reducer;
