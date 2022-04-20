import { put, call, select } from 'redux-saga/effects';
import * as Eff from 'redux-saga/effects';
import { getMapPoints } from './mapPoints.api';
import { actions as mapPointsActions, ActionTypes as mapPointsActionTypes } from './mapPoints.index';
import { actions as uiActions } from '../ui/ui.index';
import { RootState } from '../../redux/reducers';
import { isEmpty } from 'lodash';

const takeEvery: any = Eff.takeEvery;
const loadingName = 'MapPoints';

export function* fetchMapPoints(action: any) {
  try {
    const { error, data, allData, isConnected } = yield select(({ mapPointsState, uiState }: RootState) => ({
      error: mapPointsState.mapPointsError,
      data: mapPointsState.data,
      allData: mapPointsState.allData,
      isConnected: uiState.isConnected,
    }));
    if (error) yield put(mapPointsActions.setMapPointsError(false));

    yield put(uiActions.setComponentLoading(loadingName));
    if (isConnected || (action.payload.filterBool && isEmpty(data[action.payload.vid])) || (!action.payload.filterBool && isEmpty(allData[action.payload.vid]))) {
      const {
        data: { results },
      } = yield call(getMapPoints, action.payload.filterBool, action.payload.vid, action.payload.km);
      yield put(mapPointsActions.setMapPoints(results, action.payload.filterBool));
    }
  } catch (error) {
    console.log('FRIIIIIICK', error.message);
    // handle ui effects
    yield put(mapPointsActions.setMapPointsError(true));
    // console.log("FIRCKIN ERROR", error)

    // // send error report
    // const entireState = yield select();
    // yield put(errorActions.raiseError({error, entireState}));
  } finally {
    yield put(uiActions.removeComponentLoading(loadingName));
  }
}

// watcher saga
export default function mapPointsSagas() {
  return [takeEvery(mapPointsActionTypes.REQUEST_MAP_POINTS, fetchMapPoints)];
}
