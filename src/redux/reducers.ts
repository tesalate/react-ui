import { combineReducers } from 'redux';

import ui from '../ducks/ui/ui.index';
import mapPoints from '../ducks/mapPoints/mapPoints.index';
import driveSessions from '../ducks/driveSessions/driveSessions.index';
import chargeSessions from '../ducks/chargeSessions/chargeSessions.index';
import completeDataPoints from '../ducks/completeDataPoints/completeDataPoints.index';
import user from '../ducks/user/user.index';
import teslaAccount from '../ducks/teslaAccount/teslaAccount.index';
import records from '../ducks/records/records.index';
import reminders from '../ducks/reminders/reminders.index';
import stats from '../ducks/stats/stats.index';
import vehicles from '../ducks/vehicles/vehicles.index';
import toasts from '../ducks/toasts/toasts.index';
import { Action } from '../ducks/types.d';
import { persistReducer } from 'redux-persist';
import localForage from 'localforage';
import sessionStoragePersist from 'redux-persist/lib/storage/session';

export type RootState = ReturnType<typeof rootReducer>;

export enum ActionTypes {
  RESET_STATE = '[ROOT_STATE] RESET_STATE',
}

localForage.config({
  name: process.env.REACT_APP_NAME + '_db',
  storeName: 'store',
});

const uiPersistConfig = {
  key: 'ui',
  storage: localForage,
  blacklist: ['loading', 'isConnected', 'pageHasFocus', 'windowDimensions', 'isConnected'],
};

const userPersistConfig = {
  key: 'user',
  storage: localForage,
  blacklist: ['loggedIn', 'userError'],
};

const completeDataPointsPersistConfig = {
  key: 'completeDataPoints',
  storage: sessionStoragePersist,
  blacklist: ['completeDataPointsError', 'completeDataPointsLoading'],
};

const rootPersistConfig = {
  key: 'root',
  storage: localForage,
  blacklist: ['userState', 'uiState', 'toastsState', 'completeDataPointsState'],
};

// export all reducers/state-pieces into a single reducer
const rootReducer = persistReducer(
  rootPersistConfig,
  combineReducers({
    uiState: persistReducer(uiPersistConfig, ui),
    mapPointsState: mapPoints,
    driveSessionsState: driveSessions,
    chargeSessionsState: chargeSessions,
    completeDataPointsState: persistReducer(completeDataPointsPersistConfig, completeDataPoints),
    userState: persistReducer(userPersistConfig, user),
    teslaAccountState: teslaAccount,
    recordsState: records,
    remindersState: reminders,
    statsState: stats,
    toastsState: toasts,
    vehiclesState: vehicles,
  })
);

export const actions = {
  resetState: (): Action => ({ type: ActionTypes.RESET_STATE }),
};

export default (state: any, action: Action) => {
  if (action.type === ActionTypes.RESET_STATE) {
    // reset state
    state = {};
    sessionStorage.clear();
    localStorage.removeItem('persist:root');
    localStorage.removeItem('persist:user');
    localForage.removeItem('persist:root');
    localForage.removeItem('persist:user');
  }
  return rootReducer(state, action);
};
