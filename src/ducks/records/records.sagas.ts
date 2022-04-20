import { put, call, select } from "redux-saga/effects";
import * as Eff from 'redux-saga/effects'
import { getAllRecords, getRecordTypes, getRecordBySystemKey } from './records.api';
import { actions as recordsActions, ActionTypes as recordsActionTypes } from './records.index';
import { actions as uiActions } from '../ui/ui.index';
import { RootState } from "../../redux/reducers";

const takeEvery: any = Eff.takeEvery;
const loadingName = 'Records'

export function* fetchRecords(action:any) {
  try {
    const {error} = yield select( ( { recordsState }:RootState) => ({
      error : recordsState.recordsError
    }));
    if (error) yield put(recordsActions.setRecordsError(false));

    yield put(uiActions.setComponentLoading(loadingName));
    const { data: { data } } = yield call(getAllRecords, action.payload);
    yield put(recordsActions.setRecords(data))
    yield put(uiActions.removeComponentLoading(loadingName));
  }
  catch(error) {
    // handle ui effects
    yield put(recordsActions.setRecordsError(true));
    yield put(uiActions.removeComponentLoading(loadingName));
    // console.log("FIRCKIN ERROR", error)

    // // send error report
    // const entireState = yield select();
    // yield put(errorActions.raiseError({error, entireState}));
  }
}

export function* fetchRecord(action:any) {
  try {
    const {error} = yield select( ( { recordsState }:RootState) => ({
      error : recordsState.recordsError
    }));
    if (error) yield put(recordsActions.setRecordsError(false));

    yield put(uiActions.setComponentLoading(loadingName));
    const { data: { data: [data] } } = yield call(getRecordBySystemKey, action.payload.systemKey, action.payload.vid);
    yield put(recordsActions.setRecord(data))
    yield put(uiActions.removeComponentLoading(loadingName));
  }
  catch(error) {
    // handle ui effects
    yield put(recordsActions.setRecordsError(true));
    yield put(uiActions.removeComponentLoading(loadingName));
    // console.log("FIRCKIN ERROR", error)

    // // send error report
    // const entireState = yield select();
    // yield put(errorActions.raiseError({error, entireState}));
  }
}

export function* fetchRecordTypes() {
  try {
    const {error} = yield select( ( { recordsState }:RootState) => ({
      error : recordsState.recordsError
    }));
    if (error) yield put(recordsActions.setRecordsError(false));
    
    yield put(uiActions.setComponentLoading(loadingName));
    const { data: { data } } = yield call(getRecordTypes);
    yield put(recordsActions.setRecordTypes(data))
    yield put(recordsActions.setRecords(data))
    yield put(uiActions.removeComponentLoading(loadingName));
  }
  catch(error) {
    // handle ui effects
    yield put(recordsActions.setRecordsError(true));
    yield put(uiActions.removeComponentLoading(loadingName));
    // console.log("FIRCKIN ERROR", error)

    // // send error report
    // const entireState = yield select();
    // yield put(errorActions.raiseError({error, entireState}));
  }
}


// watcher saga
export default function recordsSagas() {
    return [
      takeEvery(recordsActionTypes.REQUEST_RECORDS, fetchRecords),
      takeEvery(recordsActionTypes.REQUEST_RECORD, fetchRecord),
      takeEvery(recordsActionTypes.REQUEST_RECORD_TYPES, fetchRecordTypes),
    ]
}
