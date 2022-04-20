import { put, call, select } from 'redux-saga/effects';
import * as Eff from 'redux-saga/effects';
import { getAllReminders } from './reminders.api';
import { actions as remindersActions, ActionTypes as remindersActionTypes } from './reminders.index';
import { actions as uiActions } from '../ui/ui.index';
import { RootState } from '../../redux/reducers';
import { isEmpty } from 'lodash';

const takeEvery: any = Eff.takeEvery;
const loadingName = 'Reminders';

export function* fetchReminders(action: any) {
  try {
    const { error, allReminders, isConnected } = yield select(({ remindersState, uiState }: RootState) => ({
      error: remindersState.remindersError,
      allReminders: remindersState.allReminders,
      isConnected: uiState.isConnected,
    }));
    if (error) yield put(remindersActions.setRemindersError(false));

    yield put(uiActions.setComponentLoading(loadingName));
    console.log('WHERE AM I');
    if (isConnected || isEmpty(allReminders[action.payload])) {
      const {
        data: { results },
      } = yield call(getAllReminders, action.payload);
      console.log('WAAAA', results);
      yield put(remindersActions.setReminders(results));
    }
  } catch (error) {
    // handle ui effects
    yield put(remindersActions.setRemindersError(true));
    // console.log("FIRCKIN ERROR", error)

    // // send error report
    // const entireState = yield select();
    // yield put(errorActions.raiseError({error, entireState}));
  } finally {
    yield put(uiActions.removeComponentLoading(loadingName));
  }
}

// watcher saga
export default function remindersSagas() {
  return [takeEvery(remindersActionTypes.REQUEST_REMINDERS, fetchReminders)];
}
