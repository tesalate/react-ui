import { put, call, select } from 'redux-saga/effects';
import * as Eff from 'redux-saga/effects';
import { getDriveData, getDriveDataById } from './driveSessions.api';
import { actions as driveSessionActions, ActionTypes as driveSessionTypes } from './driveSessions.index';
import { actions as uiActions } from '../ui/ui.index';
import { RootState } from '../../redux/reducers';
import { isEmpty } from 'lodash';

const takeEvery: any = Eff.takeEvery;

export function* fetchDriveSessions(action: any) {
  try {
    const { error, isConnected, sessions } = yield select(({ driveSessionsState, uiState }: RootState) => ({
      error: driveSessionsState.driveSessionsError,
      sessions: driveSessionsState.sessions,
      isConnected: uiState.isConnected,
    }));
    if (error) yield put(driveSessionActions.setDriveSessionsError(false));

    yield put(uiActions.setComponentLoading('DriveSessions'));
    if (isConnected || sessions.length === 0) {
      const {
        data: { results, totalPages },
      } = yield call(getDriveData, action.payload);
      yield put(driveSessionActions.setPageOption('totalPages', totalPages));
      yield put(driveSessionActions.setDriveSessions(results));
    }
  } catch (error) {
    // handle ui effects

    yield put(driveSessionActions.setDriveSessionsError(true));
    // console.log("FIRCKIN ERROR", error)

    // // send error report
    // const entireState = yield select();
    // yield put(errorActions.raiseError({error, entireState}));
  } finally {
    yield put(uiActions.removeComponentLoading('DriveSessions'));
  }
}

export function* fetchDriveSessionById(action: any) {
  try {
    const { error, isConnected, sessionData } = yield select(({ driveSessionsState, uiState }: RootState) => ({
      error: driveSessionsState.driveSessionsError,
      sessionData: driveSessionsState.sessionData,
      isConnected: uiState.isConnected,
    }));
    if (error) yield put(driveSessionActions.setDriveSessionsError(false));
    yield put(driveSessionActions.removeSingleDriveSessionsError(action.payload.id));

    yield put(uiActions.setComponentLoading('SingleDriveSession'));
    if (isConnected || isEmpty(sessionData[action.payload.id])) {
      const { data } = yield call(getDriveDataById, { id: action.payload.id });
      yield put(driveSessionActions.setDriveSessionById(data));
    }
  } catch (error) {
    // handle ui effects
    yield put(driveSessionActions.setSingleDriveSessionsError(action.payload.id));
    // console.log("FIRCKIN ERROR", error)

    // // send error report
    // const entireState = yield select();
    // yield put(errorActions.raiseError({error, entireState}));
  } finally {
    yield put(uiActions.removeComponentLoading('SingleDriveSession'));
  }
}

// watcher saga
export default function driveSessionsSagas() {
  return [takeEvery(driveSessionTypes.REQUEST_DRIVE_SESSIONS, fetchDriveSessions), takeEvery(driveSessionTypes.REQUEST_DRIVE_SESSION_BY_ID, fetchDriveSessionById)];
}
