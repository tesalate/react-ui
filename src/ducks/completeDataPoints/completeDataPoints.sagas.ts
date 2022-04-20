import { put, call, select } from 'redux-saga/effects';
import * as Eff from 'redux-saga/effects';
import { getCompleteDataPoint, getMostRecentDataPoint } from './completeDataPoints.api';
import { actions as completeDataPointsActions, ActionTypes as completeDataPointsActionTypes } from './completeDataPoints.index';
import { actions as vehicleActions, selectors as vehicleSelectors } from '../vehicles/vehicles.index';
import { actions as uiActions } from '../ui/ui.index';
import { actions as remindersActions } from '../reminders/reminders.index';
import { actions as mapPointsActions } from '../mapPoints/mapPoints.index';
import { RootState } from '../../redux/reducers';
import { getAllReminders } from '../reminders/reminders.api';
import { getMapPoints } from '../mapPoints/mapPoints.api';
import { isEmpty } from 'lodash';
import { getVehicles } from '../vehicles/vehicles.api';

const takeEvery: any = Eff.takeEvery;

const loadingName = 'CompleteDataPoints';

export function* fetchCompleteDataPoints(action: any) {
  try {
    const { error, dataPoints, isConnected } = yield select(({ completeDataPointsState, uiState }: RootState) => ({
      error: completeDataPointsState.completeDataPointsError,
      dataPoints: completeDataPointsState.dataPoints,
      isConnected: uiState.isConnected,
    }));

    if (error) yield put(completeDataPointsActions.setCompleteDataPointsError(false));

    yield put(uiActions.setComponentLoading(loadingName, action.payload.vid));
    if (isConnected || isEmpty(dataPoints)) {
      const { data } = yield call(getCompleteDataPoint, action.payload._id, action.payload.vid);
      yield put(completeDataPointsActions.setCompleteDataPoint(data._id, data));
    }
  } catch (error) {
    // handle ui effects
    yield put(completeDataPointsActions.setCompleteDataPointsError(true));
    // console.log("FIRCKIN ERROR", error)

    // // send error report
    // const entireState = yield select();
    // yield put(errorActions.raiseError({error, entireState}));
  } finally {
    yield put(uiActions.removeComponentLoading(loadingName, action.payload.vid));
  }
}

export function* fetchMostRecentDataPoints(action: any) {
  try {
    const { error, mostRecent, isConnected } = yield select(({ completeDataPointsState, uiState }: RootState) => ({
      error: completeDataPointsState.completeDataPointsError,
      mostRecent: completeDataPointsState.mostRecent,
      isConnected: uiState.isConnected,
    }));

    if (error) yield put(completeDataPointsActions.setCompleteDataPointsError(false));

    yield put(uiActions.setComponentLoading(loadingName));

    if (isConnected || isEmpty(mostRecent[action.payload.vid])) {
      const {
        data: {
          results: [data],
          totalResults,
        },
      } = yield call(getMostRecentDataPoint, action.payload.vid);
      yield put(completeDataPointsActions.setCompleteDataPoint(data._id, data));
      yield put(completeDataPointsActions.setCompleteDataPointCount(action.payload.vid, totalResults));
      yield put(completeDataPointsActions.setMostRecent(action.payload.vid, data._id));
    }
  } catch (error) {
    // handle ui effects
    yield put(completeDataPointsActions.setCompleteDataPointsError(true));
    // console.log("FIRCKIN ERROR", error)

    // // send error report
    // const entireState = yield select();
    // yield put(errorActions.raiseError({error, entireState}));
  } finally {
    yield put(uiActions.removeComponentLoading(loadingName));
  }
}

export function* fetchHomePageData() {
  try {
    const { error, vehicles, km, isConnected, mostRecent } = yield select(({ completeDataPointsState, vehiclesState, uiState }: RootState) => ({
      error: completeDataPointsState.completeDataPointsError,
      mostRecent: completeDataPointsState.mostRecent,
      km: uiState.map.distanceBetween,
      vehicles: vehiclesState.vehicles,
      isConnected: uiState.isConnected,
    }));
    const currentVehicles = vehicleSelectors.getSelectedVehicles(vehicles);
    if (error) yield put(completeDataPointsActions.setCompleteDataPointsError(false));

    yield put(uiActions.setComponentLoading(loadingName));
    yield put(uiActions.setComponentLoading('MapPoints'));
    yield put(uiActions.setComponentLoading('Reminders'));

    for (const vehicle of currentVehicles) {
      if (isConnected || isEmpty(mostRecent[vehicle])) {
        const {
          data: { results: reminders },
        } = yield call(getAllReminders, vehicle);
        yield put(remindersActions.setReminders(reminders));

        const { data: v } = yield call(getVehicles, vehicle);
        yield put(vehicleActions.setVehicleProperty({ ...v }));

        const {
          data: {
            results: [data],
            totalResults,
          },
        } = yield call(getMostRecentDataPoint, vehicle);
        yield put(completeDataPointsActions.setCompleteDataPoint(data._id, data));
        yield put(completeDataPointsActions.setCompleteDataPointCount(vehicle, totalResults));
        yield put(completeDataPointsActions.setMostRecent(vehicle, data._id));

        const {
          data: { results: mapPoints },
        } = yield call(getMapPoints, true, vehicle, km);
        yield put(mapPointsActions.setMapPoints(mapPoints, true));
      }
    }
  } catch (err) {
    yield put(completeDataPointsActions.setCompleteDataPointsError(true));
  } finally {
    yield put(uiActions.removeComponentLoading(loadingName));
    yield put(uiActions.removeComponentLoading('MapPoints'));
    yield put(uiActions.removeComponentLoading('Reminders'));
    yield put(uiActions.removeComponentLoading('Vehicles'));
  }
}

// watcher saga
export default function completeDataPointsSagas() {
  return [
    takeEvery(completeDataPointsActionTypes.REQUEST_DATA_POINT, fetchCompleteDataPoints),
    takeEvery(completeDataPointsActionTypes.REQUEST_MR_DATA_POINT, fetchMostRecentDataPoints),
    takeEvery(completeDataPointsActionTypes.REQUEST_HOMEPAGE_DATA, fetchHomePageData),
  ];
}
