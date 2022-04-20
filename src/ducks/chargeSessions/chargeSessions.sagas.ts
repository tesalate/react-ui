import { put, call, select } from 'redux-saga/effects';
import * as Eff from 'redux-saga/effects';
import { getChargeData, getPaginatedChargeData, getChargeDataById } from './chargeSessions.api';
import { actions as chargeSessionActions, ActionTypes as chargeSessionTypes } from './chargeSessions.index';
import { actions as uiActions } from '../ui/ui.index';
import { RootState } from '../../redux/reducers';
import { isEmpty } from 'lodash';

const takeEvery: any = Eff.takeEvery;
const loadingName = 'ChargeSessions';

export function* fetchChargeSessions(action: any) {
  try {
    const { error, isConnected, sessions, view } = yield select(({ chargeSessionsState, uiState }: RootState) => ({
      error: chargeSessionsState.chargeSessionsError,
      sessions: chargeSessionsState.sessions,
      isConnected: uiState.isConnected,
      view: uiState.chargePage.view,
    }));
    if (error) yield put(chargeSessionActions.setChargeSessionsError(false));

    yield put(uiActions.setComponentLoading(loadingName));
    if (isConnected || sessions.length === 0) {
      const {
        data: { results, totalPages },
      } = yield call(getChargeData, { ...action.payload, limit: view === 'map' ? 0 : action.payload.limit });
      yield put(chargeSessionActions.setPageOption('totalPages', totalPages));
      yield put(chargeSessionActions.setChargeSessions(results));
    }
  } catch (error) {
    // handle ui effects
    yield put(chargeSessionActions.setChargeSessionsError(true));
    // console.log("FIRCKIN ERROR", error)

    // // send error report
    // const entireState = yield select();
    // yield put(errorActions.raiseError({error, entireState}));
  } finally {
    yield put(uiActions.removeComponentLoading(loadingName));
  }
}

export function* fetchChargeSessionById(action: any) {
  try {
    const { error, isConnected, sessionData } = yield select(({ chargeSessionsState, uiState }: RootState) => ({
      error: chargeSessionsState.chargeSessionsError,
      sessionData: chargeSessionsState.sessionData,
      isConnected: uiState.isConnected,
    }));
    if (error) yield put(chargeSessionActions.setChargeSessionsError(false));
    yield put(chargeSessionActions.removeSingleChargeSessionsError(action.payload.id));

    yield put(uiActions.setComponentLoading('SingleChargeSessions'));
    if (isConnected || isEmpty(sessionData[action.payload.id])) {
      const { data } = yield call(getChargeDataById, { id: action.payload.id });
      yield put(chargeSessionActions.setChargeSessionById(data));
    }
  } catch (error) {
    // handle ui effects
    yield put(chargeSessionActions.setSingleChargeSessionsError(action.payload.id));
    // console.log("FIRCKIN ERROR", error)

    // // send error report
    // const entireState = yield select();
    // yield put(errorActions.raiseError({error, entireState}));
  } finally {
    yield put(uiActions.removeComponentLoading('SingleChargeSessions'));
  }
}

export function* fetchPaginatedChargeSessions(action: any) {
  const { vid, skip, limit } = action.payload;
  try {
    const { error } = yield select(({ chargeSessionsState }: RootState) => ({
      error: chargeSessionsState.chargeSessionsError,
    }));
    if (error) yield put(chargeSessionActions.setChargeSessionsError(false));

    yield put(uiActions.setComponentLoading(loadingName));
    const {
      data: { data },
    } = yield call(getPaginatedChargeData, vid, skip, limit);
    yield put(chargeSessionActions.setChargeSessions(data));
    yield put(uiActions.removeComponentLoading(loadingName));
  } catch (error) {
    // handle ui effects
    yield put(chargeSessionActions.setChargeSessionsError(true));
    yield put(uiActions.removeComponentLoading(loadingName));
    // console.log("FIRCKIN ERROR", error)

    // // send error report
    // const entireState = yield select();
    // yield put(errorActions.raiseError({error, entireState}));
  }
}

// watcher saga
export default function chargeSessionsSagas() {
  return [takeEvery(chargeSessionTypes.REQUEST_CHARGE_SESSIONS, fetchChargeSessions), takeEvery(chargeSessionTypes.REQUEST_CHARGE_SESSION_BY_ID, fetchChargeSessionById)];
}
