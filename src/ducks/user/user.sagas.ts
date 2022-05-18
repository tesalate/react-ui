import { put, call, select } from 'redux-saga/effects';
import * as Eff from 'redux-saga/effects';
import { login, me, teslaLogin, logout, sendVerificationEmail, verifyEmail, register } from './user.api';
import { actions as userActions, ActionTypes as userActionTypes } from './user.index';
import { actions as vehiclesActions /* ActionTypes as vehiclesActionTypes */ } from '../vehicles/vehicles.index';
import { actions as teslaAccountActions /* ActionTypes as teslaAccountActionTypes */ } from '../teslaAccount/teslaAccount.index';
import { actions as uiActions } from '../ui/ui.index';
import { RootState, actions as rootActions } from '../../redux/reducers';
import { isEmpty } from 'lodash';

const takeEvery: any = Eff.takeEvery;
const loadingName = 'User';

export function* registerUser(action: any) {
  try {
    const { error } = yield select(({ userState }: RootState) => ({
      error: userState.userRegisterError,
    }));
    if (error) yield put(userActions.setRegisterUserError({ message: null }));

    yield put(uiActions.setComponentLoading(loadingName));
    yield put(uiActions.setComponentLoading('RegisterUser'));
    const { data } = yield call(register, action.payload);
    console.log('DATA', data);
    yield put(userActions.setLoggedIn(true));
    yield put(userActions.setUser(data));

    window.location.assign('/send-verification-email');
  } catch (error) {
    // handle ui effects
    if (error.response.data.message) {
      console.log('HMMMM', error.response.data.message);
      yield put(userActions.setRegisterUserError({ message: error.response.data.message }));
    }
    console.log('REGISTER USER ERROR', error.message);
  } finally {
    yield put(uiActions.removeComponentLoading(loadingName));
    yield put(uiActions.removeComponentLoading('RegisterUser'));
  }
}

export function* fetchLogin(action: any) {
  try {
    const { error } = yield select(({ userState }: RootState) => ({
      error: userState.userError,
    }));
    if (error) yield put(userActions.setUserError(false));

    yield put(uiActions.setComponentLoading(loadingName));
    yield put(uiActions.setComponentLoading('FetchUser'));
    const { data } = yield call(login, action.payload.username, action.payload.password);
    yield put(userActions.setLoggedIn(true));
    yield put(uiActions.removeComponentLoading(loadingName));
    yield put(userActions.setUser(data));
    yield put(vehiclesActions.setVehicles(data?.vehicles));
    yield put(teslaAccountActions.setTeslaAccount(data?.teslaAccount));
  } catch (error) {
    // handle ui effects
    console.log('FETCHLOGIN ERROR', error.message);
    yield put(userActions.setUserError(true));
  } finally {
    yield put(uiActions.removeComponentLoading(loadingName));
    yield put(uiActions.removeComponentLoading('FetchUser'));
  }
}

export function* fetchTeslaLogin(action: any) {
  try {
    const { error, userId } = yield select(({ userState }: RootState) => ({
      error: userState.userError,
      userId: userState.user?._id,
    }));
    if (error) yield put(userActions.setUserError(false));

    yield put(uiActions.setComponentLoading('TeslaAccount'));
    const { data } = yield call(teslaLogin, { userId, username: action.payload.username, password: action.payload.password, refreshToken: action.payload.refreshToken });
    yield put(userActions.setUser(data));
  } catch (error) {
    // handle ui effects
    yield put(userActions.setUserError(true));
  } finally {
    yield put(uiActions.removeComponentLoading('TeslaAccount'));
    window.location.assign('/settings/tesla-account');
  }
}

export function* refreshTeslaVehicles() {
  try {
    const { error } = yield select(({ userState }: RootState) => ({
      error: userState.userError,
    }));
    if (error) yield put(userActions.setUserError(false));

    yield put(uiActions.setComponentLoading('TeslaVehiclesLoading'));
    yield put(uiActions.removeComponentLoading('TeslaVehiclesLoading'));
  } catch (error) {
    // handle ui effects
    yield put(userActions.setUserError(true));
    yield put(uiActions.removeComponentLoading('TeslaVehiclesLoading'));
  } finally {
  }
}

export function* fetchMe(action: any) {
  try {
    const { error, user, isConnected } = yield select(({ userState, uiState }: RootState) => ({
      error: userState.userError,
      user: userState.user,
      isConnected: uiState.isConnected,
    }));

    if (error) yield put(userActions.setUserError(false));

    if (action.payload) yield put(uiActions.setComponentLoading('FetchUser'));
    if (isConnected || isEmpty(user)) {
      const { data } = yield call(me, user._id);
      yield put(userActions.setUser(data));
      yield put(userActions.setLoggedIn(!!data));
    }
  } catch (err) {
    // handle ui effects
    if (err.message !== 'No token provided.') yield put(userActions.setUserError(true));
  } finally {
    if (action.payload) yield put(uiActions.removeComponentLoading('FetchUser'));
  }
}

// export function* handleLogOut() {
export function* handleLogOut(action: any) {
  try {
    const { error, user, isConnected } = yield select(({ userState, uiState }: RootState) => ({
      error: userState.userError,
      user: userState.user,
      isConnected: uiState.isConnected,
    }));
    if (error) yield put(userActions.setUserError(false));
    yield put(rootActions.resetState());

    yield put(uiActions.setComponentLoading(loadingName));
    if (user && isConnected) {
      yield call(logout);
    }
  } catch (err) {
    // handle ui effects
    yield put(userActions.setUserError(true));
  } finally {
    yield put(uiActions.removeComponentLoading(loadingName));
    window.location.assign(action.payload ?? '/login');
  }
}

export function* sendRequestVerificationEmail() {
  try {
    const { error } = yield select(({ userState, uiState }: RootState) => ({
      error: userState.userError,
      user: userState.user,
      isConnected: uiState.isConnected,
    }));
    if (error) yield put(userActions.setUserError(false));

    yield put(uiActions.setComponentLoading('SendingVerificationEmail'));
    yield call(sendVerificationEmail);
    yield put(userActions.setSentVerificationEmail(Date.now() + 600000));
  } catch (err) {
    // handle ui effects
    yield put(userActions.setUserError(true));
  } finally {
    yield put(uiActions.removeComponentLoading('SendingVerificationEmail'));
  }
}

export function* fetchVerifyRequest(action: any) {
  try {
    const { error, user } = yield select(({ userState, uiState }: RootState) => ({
      error: userState.userError,
      user: userState.user,
      isConnected: uiState.isConnected,
    }));
    if (error) yield put(userActions.setUserError(false));

    yield put(uiActions.setComponentLoading('VerifyRequest'));
    yield call(verifyEmail, action.payload);
    yield put(userActions.setVerificationSuccess(true));
    if (user) {
      yield put(userActions.setUser({ ...user, isEmailVerified: true }));
    }
  } catch (err) {
    // handle ui effects
    yield put(userActions.setUserError(true));
    yield put(userActions.setVerificationSuccess(false));
  } finally {
    yield put(uiActions.removeComponentLoading('VerifyRequest'));
  }
}

// watcher saga
export default function userSagas() {
  return [
    takeEvery(userActionTypes.LOGIN_USER, fetchLogin),
    takeEvery(userActionTypes.REGISTER_USER, registerUser),
    takeEvery(userActionTypes.LOGIN_TESLA, fetchTeslaLogin),
    takeEvery(userActionTypes.GET_USER_DATA, fetchMe),
    takeEvery(userActionTypes.LOGOUT_USER, handleLogOut),
    takeEvery(userActionTypes.SEND_VERIFICATION_EMAIL, sendRequestVerificationEmail),
    takeEvery(userActionTypes.SEND_VERIFIED_REQUEST, fetchVerifyRequest),
  ];
}
