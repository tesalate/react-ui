/* ===== TYPE_DEFINITION =====*/
import { Action } from '../types.d';

export interface IReminder {
  _id: string;
  userId: string;
  type: 'odometer' | 'date';
  message: string;
  when: number;
  vehicleId: number;
  vehicle: string;
  completed: boolean;
  createdAt: Date;
  remindWithin: number;
  id_s: string;
}

/* ===== INTERFACE_DEFINITION =====*/
export interface State {
  allReminders: { [key: string]: IReminder[] };
  remindersError: boolean;
}

/* ===== STATE_DEFINITION ===== */
export const initialState: State = {
  allReminders: {},
  remindersError: false,
};

/* ===== TYPES ===== */
export enum ActionTypes {
  REQUEST_REMINDERS = '[REMINDERS] REQUEST_REMINDERS',
  SET_REMINDERS = '[REMINDERS] SET_REMINDERS',
  SET_REMINDERS_ERROR = '[REMINDERS] SET_REMINDERS_ERROR',
}

/* ===== ACTION_CREATORS ===== */
export const actions = {
  requestReminders: (vehicle: string): Action => ({ type: ActionTypes.REQUEST_REMINDERS, payload: vehicle }),
  setReminders: (value: Array<IReminder>): Action => ({ type: ActionTypes.SET_REMINDERS, payload: value }),
  setRemindersError: (value: boolean): Action => ({ type: ActionTypes.SET_REMINDERS_ERROR, payload: value }),
};

/* ===== SELECTORS ===== */
export const selectors = {
  getRemindersByVID: (reminders: Record<any, any>, vehicles: Array<any>, miles: Array<number>) =>
    vehicles
      .map((vehicle: string, idx: number) => {
        let v = reminders[vehicle] ?? [];
        return v
          .filter((el: IReminder) => {
            return miles[idx] > el.when - el.remindWithin && !el.completed;
          })
          .sort((a: any, b: any) => a.createdAt.getTime() - b.createdAt.getTime());
      })
      .flat(),
};

/* ===== REDUCER ===== */
const reducer = (state: State = initialState, action: Action) => {
  switch (action.type) {
    case ActionTypes.SET_REMINDERS:
      return { ...state, allReminders: { [action.payload?.[0]?.vehicle]: action.payload } };
    case ActionTypes.SET_REMINDERS_ERROR:
      return { ...state, remindersError: action.payload };
    default: {
      return state;
    }
  }
};

export default reducer;
