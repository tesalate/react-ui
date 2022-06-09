import { put, call, select } from 'redux-saga/effects';
import * as Eff from 'redux-saga/effects';
import { getAStat } from './stats.api';
import { actions as statsActions, ActionTypes as statsActionTypes } from './stats.index';
import { selectors as vehicleSelectors } from '../vehicles/vehicles.index';
import { actions as uiActions } from '../ui/ui.index';
import { RootState } from '../../redux/reducers';
import { isEmpty, pick } from 'lodash';

const takeEvery: any = Eff.takeEvery;
const loadingName = 'Stats';

export function* fetchStats() {
  try {
    const { statTypes, isConnected, stats, vehicles } = yield select(({ statsState, vehiclesState, uiState }: RootState) => ({
      statTypes: statsState.statTypes,
      stats: statsState.stats,
      vehicles: vehiclesState.vehicles,
      isConnected: uiState.isConnected,
    }));
    const currentVehicles = vehicleSelectors.getSelectedVehicles(vehicles);
    yield put(uiActions.setComponentLoading(loadingName));
    for (const vehicle of currentVehicles) {
      if (isConnected || isEmpty(stats[vehicle])) {
        for (const stat of statTypes) {
          const { data } = yield call(getAStat, vehicle, stat);
          data['vehicle'] = vehicle;
          yield put(statsActions.setStats(pick(data, ['vehicle', 'results', 'systemKey', 'displayName', 'displayOrder', 'unit'])));
        }
      }
    }
  } catch (error) {
    // handle ui effects
    yield put(statsActions.setStatsError(true));
    // console.log("FIRCKIN ERROR", error.message)

    // // send error report
    // const entireState = yield select();
    // yield put(errorActions.raiseError({error, entireState}));
  } finally {
    yield put(uiActions.removeComponentLoading(loadingName));
  }
}

// watcher saga
export default function statsSagas() {
  return [takeEvery(statsActionTypes.REQUEST_STATS, fetchStats)];
}
