import { put, call, select } from 'redux-saga/effects';
import * as Eff from 'redux-saga/effects';
import { getVehicles, updateVehicle } from './vehicles.api';
import { actions as vehiclesActions, ActionTypes as vehiclesTypes } from './vehicles.index';
import { actions as uiActions } from '../ui/ui.index';
import { RootState } from '../../redux/reducers';

const takeEvery: any = Eff.takeEvery;
const loadingName = 'Vehicles';

export function* fetchVehicles() {
  try {
    const { error } = yield select(({ vehiclesState }: RootState) => ({
      error: vehiclesState.vehiclesError,
    }));
    if (error) yield put(vehiclesActions.setVehiclesError(false));

    yield put(uiActions.setComponentLoading(loadingName));
    const {
      data: { results },
    } = yield call(getVehicles);
    yield put(vehiclesActions.setVehicles(results));
    if (results?.length === 1) yield put(vehiclesActions.setSelectedVehicles(results[0]._id));
  } catch (error) {
    // handle ui effects
    yield put(vehiclesActions.setVehiclesError(true));
    // console.log("FIRCKIN ERROR", error)

    // // send error report
    // const entireState = yield select();
    // yield put(errorActions.raiseError({error, entireState}));
  } finally {
    yield put(uiActions.removeComponentLoading(loadingName));
  }
}

export function* doUpdateVehicle(action: any) {
  try {
    const { error } = yield select(({ vehiclesState }: RootState) => ({
      error: vehiclesState.vehiclesError,
      vehicles: vehiclesState.vehicles,
    }));

    if (error) yield put(vehiclesActions.setVehiclesError(false));

    yield put(uiActions.setComponentLoading('VehiclesUpdating', action.payload._id));

    const { data } = yield call(updateVehicle, action.payload._id, { ...action.payload.body });
    yield put(vehiclesActions.setVehicle(data));
  } catch (error) {
    // handle ui effects
    yield put(vehiclesActions.setVehiclesError(true));
    // console.log("FIRCKIN ERROR", error)

    // // send error report
    // const entireState = yield select();
    // yield put(errorActions.raiseError({error, entireState}));
  } finally {
    yield put(uiActions.removeComponentLoading('VehiclesUpdating', action.payload._id));
  }
}

// watcher saga
export default function vehiclesSagas() {
  return [takeEvery(vehiclesTypes.REQUEST_VEHICLES, fetchVehicles), takeEvery(vehiclesTypes.UPDATE_VEHICLE, doUpdateVehicle)];
}
