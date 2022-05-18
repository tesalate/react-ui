import { isEqual } from 'lodash';

/* ===== TYPE_DEFINITION =====*/
import { Action } from '../types.d';
import { isTruthy } from '../../utils/helper';

export interface IUser {
  role: 'user' | 'admin';
  isEmailVerified: boolean;
  _id: string;
  username: string;
  email: string;
  displayName: string;
  firstName: string;
  lastName: string;
}

/* ===== INTERFACE_DEFINITION =====*/
export interface State {
  user: IUser | null;
  userError: boolean;
  userRegisterError: { message: string | null };
  loggedIn: boolean;
  settings: {};
  sentVerificationEmail: number | null;
  verificationSuccess: boolean;
}

/* ===== STATE_DEFINITION ===== */
export const initialState: State = {
  user: null,
  userError: false,
  userRegisterError: { message: null },
  loggedIn: isTruthy(sessionStorage.getItem('loggedIn')) || false,
  settings: {},
  sentVerificationEmail: null,
  verificationSuccess: false,
};

/* ===== TYPES ===== */
export enum ActionTypes {
  REGISTER_USER = '[USER] REGISTER_USER',
  SET_USER = '[USER] SET_USER',
  SET_TOKEN = '[USER] SET_TOKEN',
  SET_LOGGED_IN = '[USER] SET_LOGGED_IN',
  GET_USER_DATA = '[USER] GET_USER_DATA',
  LOGIN_USER = '[USER] LOGIN_USER',
  LOGOUT_USER = '[USER] LOGOUT_USER',
  SET_USER_ERROR = '[USER] SET_USER_ERROR',
  SET_REGISTER_USER_ERROR = '[USER] SET_REGISTER_USER_ERROR',
  SOCKET_UPDATE = '[USER] SOCKET_UPDATE',
  LOGIN_TESLA = '[USER] LOGIN_TESLA',
  UPDATE_MINING_STATUS = '[USER] UPDATE_MINING_STATUS',
  REFRESH_TESLA_VEHICLES = '[USER] REFRESH_TESLA_VEHICLES',
  SEND_VERIFICATION_EMAIL = '[USER] SEND_VERIFICATION_EMAIL',
  SET_SENT_VERIFICATION_EMAIL = '[USER] SET_SENT_VERIFICATION_EMAIL',
  SEND_VERIFIED_REQUEST = '[USER] SEND_VERIFIED_REQUEST',
  SET_VERIFICATION_SUCCESS = '[USER] SET_VERIFICATION_SUCCESS',
}

/* ===== ACTION_CREATORS ===== */
export const actions = {
  register: (body: Partial<IUser>): Action => ({ type: ActionTypes.REGISTER_USER, payload: body }),
  logOutUser: (redirect?: string): Action => ({ type: ActionTypes.LOGOUT_USER, payload: redirect }),
  setUser: (user?: IUser): Action => ({ type: ActionTypes.SET_USER, payload: user }),
  setLoggedIn: (bool: boolean): Action => ({ type: ActionTypes.SET_LOGGED_IN, payload: bool }),
  setToken: (token: string): Action => ({ type: ActionTypes.SET_TOKEN, payload: token }),
  socketUpdate: (user?: IUser): Action => ({ type: ActionTypes.SOCKET_UPDATE, payload: user }),
  getUserData: (showLoading: boolean): Action => ({ type: ActionTypes.GET_USER_DATA, payload: showLoading }),
  setUserError: (value: boolean): Action => ({ type: ActionTypes.SET_USER_ERROR, payload: value }),
  setRegisterUserError: (value: { message: string | null }): Action => ({ type: ActionTypes.SET_REGISTER_USER_ERROR, payload: value }),
  loginUser: (username: string, password: string): Action => ({ type: ActionTypes.LOGIN_USER, payload: { username, password } }),
  loginTesla: ({ username, password, refreshToken }: { username?: string; password?: string; refreshToken?: string }): Action => ({ type: ActionTypes.LOGIN_TESLA, payload: { username, password, refreshToken } }),
  updateMiningStatus: (vid: number, active: boolean): Action => ({ type: ActionTypes.UPDATE_MINING_STATUS, payload: { vid, active } }),
  requestVerificationEmail: (): Action => ({ type: ActionTypes.SEND_VERIFICATION_EMAIL }),
  setSentVerificationEmail: (num: number): Action => ({ type: ActionTypes.SET_SENT_VERIFICATION_EMAIL, payload: num }),
  sendVerifyRequest: (token: string): Action => ({ type: ActionTypes.SEND_VERIFIED_REQUEST, payload: token }),
  setVerificationSuccess: (bool: boolean): Action => ({ type: ActionTypes.SET_VERIFICATION_SUCCESS, payload: bool }),
};

/* ===== SELECTORS ===== */
export const selectors = {};

/* ===== REDUCER ===== */
const reducer = (state: State = initialState, action: Action) => {
  switch (action.type) {
    case ActionTypes.SET_TOKEN:
      const token = action.payload;
      return { ...state, token };
    case ActionTypes.SET_USER:
      const { vehicles, teslaAccount, ...rest } = action.payload;
      return { ...state, user: rest };
    case ActionTypes.SET_USER_ERROR:
      return { ...state, userError: action.payload };
    case ActionTypes.SOCKET_UPDATE:
      const _user = action.payload;
      delete _user.type;
      delete _user.action;
      if (isEqual(state.user, _user)) {
        return state;
      }
      return { ...state, user: action.payload };
    case ActionTypes.SET_LOGGED_IN:
      sessionStorage.setItem('loggedIn', 'true');
      return { ...state, loggedIn: action.payload };
    case ActionTypes.SET_SENT_VERIFICATION_EMAIL:
      return { ...state, sentVerificationEmail: action.payload };
    case ActionTypes.SET_VERIFICATION_SUCCESS:
      return { ...state, verificationSuccess: action.payload };
    case ActionTypes.SET_REGISTER_USER_ERROR:
      return { ...state, userRegisterError: action.payload };
    default: {
      return state;
    }
  }
};

export default reducer;
