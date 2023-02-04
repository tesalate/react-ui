import { put, call, select } from 'redux-saga/effects';
import * as Eff from 'redux-saga/effects';
import { getSettings, updateSettings } from './ui.api';
import { actions as uiActions, ActionTypes as uiTypes } from './ui.index';
import { RootState } from '../../redux/reducers';
import { removeEmpty } from '../../utils/formatFunctions';

const takeEvery: any = Eff.takeEvery;
const loadingName = 'UI';

export function* fetchUiSettings() {
  try {
    const { error, isMobile, mobileType } = yield select(({ uiState }: RootState) => ({
      error: uiState.uiError,
      isMobile: uiState.isMobile,
      mobileType: uiState.mobileType,
    }));
    if (error) yield put(uiActions.setUiError(false));

    yield put(uiActions.setComponentLoading(loadingName));
    const { data } = yield call(getSettings, isMobile);
    const newData = removeEmpty(isMobile ? data[mobileType]['ui'] : data['desktop']['ui']);
    if (newData?.theme) {
      yield put(uiActions.setTheme(newData.theme));
    }
    yield put(uiActions.setUiFromDBSettings(newData));
  } catch (error) {
    yield put(uiActions.setUiError(true));
  } finally {
    yield put(uiActions.removeComponentLoading(loadingName));
  }
}

export function* setUiSettings(action: any) {
  try {
    const { error, isMobile, mobileType } = yield select(({ uiState }: RootState) => ({
      error: uiState.uiError,
      isMobile: uiState.isMobile,
      mobileType: uiState.mobileType,
      uiState,
    }));
    if (error) yield put(uiActions.setUiError(false));
    yield put(uiActions.setComponentLoading(loadingName));
    yield call(updateSettings, {
      [isMobile ? mobileType : 'desktop']: {
        ui: action.payload,
      },
    });
  } catch (error) {
    // yield put(uiActions.setUiError(true));
  } finally {
    yield put(uiActions.removeComponentLoading(loadingName));
  }
}

// watcher saga
export default function uiSagas() {
  return [takeEvery(uiTypes.GET_UI_FROM_DB_SETTINGS, fetchUiSettings), takeEvery(uiTypes.SET_DB_UI_SETTINGS, setUiSettings)];
}
