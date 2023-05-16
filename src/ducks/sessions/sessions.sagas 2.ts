import { put, call, select } from 'redux-saga/effects';
import * as Eff from 'redux-saga/effects';
import { getLogs } from './sessions.api';
import { actions as sessionsActions, ActionTypes as sessionsActionTypes } from './sessions.index';
import { actions as uiActions } from '../ui/ui.index';
import { RootState } from '../../redux/reducers';

const takeEvery: any = Eff.takeEvery;
// const loadingName = 'Sessions';

export function* fetchLogs(action: any) {
  try {
    const { error, isConnected } = yield select(({ sessionsState, uiState }: RootState) => ({
      error: sessionsState.sessionsError,
      isConnected: uiState.isConnected,
    }));
    if (error) yield put(sessionsActions.setSessionsError(false));

    yield put(uiActions.setComponentLoading('Logs'));
    if (isConnected) {
      const {
        data: { results },
      } = yield call(getLogs, action.payload);

      yield put(sessionsActions.setLogs(action.payload.vehicle, action.payload.startDate, results));
    }
  } catch (error) {
    // handle ui effects
    yield put(sessionsActions.setSessionsError(true));
    // console.log("FIRCKIN ERROR", error)

    // // send error report
    // const entireState = yield select();
    // yield put(errorActions.raiseError({error, entireState}));
  } finally {
    yield put(uiActions.removeComponentLoading('Logs'));
  }
}

// watcher saga
export default function sessionsSagas() {
  return [takeEvery(sessionsActionTypes.REQUEST_LOGS, fetchLogs)];
}
