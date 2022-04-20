import { all } from 'redux-saga/effects';

import uiSagas from '../ducks/ui/ui.sagas';
import mapPointsSagas from '../ducks/mapPoints/mapPoints.sagas';
import driveSessionsSagas from '../ducks/driveSessions/driveSessions.sagas';
import chargeSessionsSagas from '../ducks/chargeSessions/chargeSessions.sagas';
import completeDataPointsSagas from '../ducks/completeDataPoints/completeDataPoints.sagas';
import userSagas from '../ducks/user/user.sagas';
import teslaAccountSagas from '../ducks/teslaAccount/teslaAccount.sagas';
import recordsSagas from '../ducks/records/records.sagas';
import remindersSagas from '../ducks/reminders/reminders.sagas';
import statsSagas from '../ducks/stats/stats.sagas';
import vehiclesSagas from '../ducks/vehicles/vehicles.sagas';

// combine all sagas
export default function* rootSaga() {
  yield all([
    ...uiSagas(),
    ...mapPointsSagas(),
    ...driveSessionsSagas(),
    ...chargeSessionsSagas(),
    ...completeDataPointsSagas(),
    ...userSagas(),
    ...teslaAccountSagas(),
    ...recordsSagas(),
    ...remindersSagas(),
    ...statsSagas(),
    ...vehiclesSagas(),
  ]);
}
