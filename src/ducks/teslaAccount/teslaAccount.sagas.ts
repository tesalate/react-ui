import { put, call, select } from 'redux-saga/effects';
import * as Eff from 'redux-saga/effects';
import { getTeslaAccount } from './teslaAccount.api';
import { actions as teslaAccountActions, ActionTypes as teslaAccountTypes } from './teslaAccount.index';
import { actions as uiActions } from '../ui/ui.index';
import { RootState } from '../../redux/reducers';

const takeEvery: any = Eff.takeEvery;
const loadingName = 'TeslaAccount';

export function* fetchTeslaAccount() {
  try {
    const { error } = yield select(({ teslaAccountState }: RootState) => ({
      error: teslaAccountState.teslaAccountError,
    }));
    if (error) yield put(teslaAccountActions.setTeslaAccountError(false));

    yield put(uiActions.setComponentLoading(loadingName));
    const {
      data: {
        results: [account],
      },
    } = yield call(getTeslaAccount);
    yield put(teslaAccountActions.setTeslaAccount(account));
  } catch (error) {
    // handle ui effects
    yield put(teslaAccountActions.setTeslaAccountError(true));
    // console.log("FIRCKIN ERROR", error)

    // // send error report
    // const entireState = yield select();
    // yield put(errorActions.raiseError({error, entireState}));
  } finally {
    yield put(uiActions.removeComponentLoading(loadingName));
  }
}

// watcher saga
export default function teslaAccountSagas() {
  return [takeEvery(teslaAccountTypes.REQUEST_TESLA_ACCOUNT, fetchTeslaAccount)];
}
