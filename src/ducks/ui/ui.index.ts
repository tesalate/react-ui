/* ===== TYPE_DEFINITION =====*/
type Axis = 'width' | 'height';

export const sessionsViewArr = ['table', 'map'] as const;
export type sessionsView = typeof sessionsViewArr[number];

export const ThemeTypeArr = ['light', 'dark'] as const;
export type ThemeType = typeof ThemeTypeArr[number];
/* ===== INTERFACE_DEFINITION =====*/
export interface State {
  lastRefresh: Date;
  pageHasFocus: boolean;
  uiError: boolean;
  isConnected: boolean | null;
  liveUpdates: boolean;
  isSocketConnected: boolean;
  windowDimensions: Record<Axis, number>;
  operatingSystem: Record<any, any> | undefined;
  browser: string | undefined;
  isMobile: boolean;
  isStandAlone: boolean;
  mobileType: null | string;
  loading: { [key: string]: any[] };
  theme: ThemeType | undefined | null;
  autoTheme: boolean;
  chargePage: {
    view: sessionsView;
    table: {};
  };
  drivePage: {
    table: {};
  };
  map: {
    distanceBetween: number;
  };
}

export interface Action {
  type: ActionTypes;
  payload?: any;
}

/* ===== STATE_DEFINITION ===== */
export const initialState: State = {
  lastRefresh: new Date(),
  pageHasFocus: true,
  isConnected: null,
  liveUpdates: false,
  isSocketConnected: false,
  windowDimensions: {
    width: 0,
    height: 0,
  },
  uiError: false,
  operatingSystem: {},
  browser: '',
  isMobile: false,
  isStandAlone: false,
  mobileType: null,
  loading: {
    UI: [],
    MapPoints: [],
    DriveSessions: [],
    SingleDriveSession: [],
    ChargeSessions: [],
    SingleChargeSessions: [],
    Records: [],
    CompleteDataPoints: [],
    User: [],
    Reminders: [],
    Stats: [],
    TeslaAccount: [],
    FetchUser: [],
    RefreshingAccount: [],
    Vehicles: [],
    SelectingVehicle: [],
    TeslaVehiclesLoading: [],
    SendingVerificationEmail: [],
    VerifyRequest: [],
    RegisterUser: [],
    Logs: [],
  },
  theme: undefined,
  autoTheme: true,
  chargePage: {
    view: 'map',
    table: {},
  },
  drivePage: {
    table: {},
  },
  map: {
    distanceBetween: 12,
  },
};

/* ===== TYPES ===== */
export enum ActionTypes {
  SET_REFRESH_TIME = '[UI] SET_REFRESH_TIME',
  SET_UI_ERROR = '[UI] SET_UI_ERROR',
  SET_UI_FROM_DB_SETTINGS = '[UI] SET_UI_FROM_DB_SETTINGS',
  GET_UI_FROM_DB_SETTINGS = '[UI] GET_UI_FROM_DB_SETTINGS',
  SET_DB_UI_SETTINGS = '[UI] SET_DB_UI_SETTINGS',
  SET_PAGE_FOCUS = '[UI] SET_PAGE_FOCUS',
  SET_CONNECTED = '[UI] SET_CONNECTED',
  SET_LIVE_UPDATES = '[UI] SET_LIVE_UPDATES',
  SET_SOCKET_CONNECTED = '[UI] SET_SOCKET_CONNECTED',
  SET_WINDOW_DIMENSIONS = '[UI] SET_WINDOW_DIMENSIONS',
  SET_OPERATING_SYSTEM = '[UI] SET_OPERATING_SYSTEM',
  SET_BROWSER = '[UI] SET_BROWSER',
  SET_COMPONENT_LOADING = '[UI] SET_COMPONENT_LOADING',
  REMOVE_COMPONENT_LOADING = '[UI] REMOVE_COMPONENT_LOADING',
  SET_THEME = '[UI] SET_THEME',
  SET_AUTO_THEME = '[UI] SET_AUTO_THEME',
  SET_PAGE_VIEW = '[UI] SET_PAGE_VIEW',
  SET_IS_MOBILE = '[UI] SET_IS_MOBILE',
  SET_IS_STANDALONE = '[UI] SET_IS_STANDALONE',
  SET_DISTANCE_BETWEEN = '[UI] SET_DISTANCE_BETWEEN',
}

/* ===== ACTION_CREATORS ===== */
export const actions = {
  setLastRefresh: (): Action => ({ type: ActionTypes.SET_REFRESH_TIME }),
  setUiError: (bool: boolean): Action => ({ type: ActionTypes.SET_UI_ERROR, payload: bool }),
  setUiFromDBSettings: (value: Partial<State>): Action => ({ type: ActionTypes.SET_UI_FROM_DB_SETTINGS, payload: value }),
  getUiFromDBSettings: (): Action => ({ type: ActionTypes.GET_UI_FROM_DB_SETTINGS }),
  setDBUiSettings: (value: Partial<State>): Action => ({ type: ActionTypes.SET_DB_UI_SETTINGS, payload: value }),
  setPageFocus: (value: boolean): Action => ({ type: ActionTypes.SET_PAGE_FOCUS, payload: value }),
  setIsMobile: (value: string): Action => ({ type: ActionTypes.SET_IS_MOBILE, payload: value }),
  setIsStandAlone: (value: boolean): Action => ({ type: ActionTypes.SET_IS_STANDALONE, payload: value }),
  setIsConnected: (value: boolean): Action => ({ type: ActionTypes.SET_CONNECTED, payload: value }),
  setLiveUpdates: (value: boolean): Action => ({ type: ActionTypes.SET_LIVE_UPDATES, payload: value }),
  setIsSocketConnected: (value: boolean): Action => ({ type: ActionTypes.SET_SOCKET_CONNECTED, payload: value }),
  setWindowDimensions: (value: Record<Axis, number>): Action => ({ type: ActionTypes.SET_WINDOW_DIMENSIONS, payload: value }),
  setOperatingSystem: (value: Record<any, any>): Action => ({ type: ActionTypes.SET_OPERATING_SYSTEM, payload: value }),
  setBrowser: (value: string): Action => ({ type: ActionTypes.SET_BROWSER, payload: value }),
  setComponentLoading: (value: string, param?: any): Action => ({ type: ActionTypes.SET_COMPONENT_LOADING, payload: { value, param } }),
  removeComponentLoading: (value: string, param?: any): Action => ({ type: ActionTypes.REMOVE_COMPONENT_LOADING, payload: { value, param } }),
  setTheme: (value: string): Action => ({ type: ActionTypes.SET_THEME, payload: value }),
  setPageView: (value: Record<any, any>): Action => ({ type: ActionTypes.SET_PAGE_VIEW, payload: value }),
  setAutoTheme: (value: boolean): Action => ({ type: ActionTypes.SET_AUTO_THEME, payload: value }),
  setDistanceBetween: (value: number): Action => ({ type: ActionTypes.SET_DISTANCE_BETWEEN, payload: value }),
};

/* ===== SELECTORS ===== */
export const selectors = {};

/* ===== REDUCER ===== */
const reducer = (state: State = initialState, action: Action) => {
  let vh = window.innerHeight * 0.01;

  switch (action.type) {
    case ActionTypes.SET_REFRESH_TIME:
      return { ...state, lastRefresh: new Date() };
    case ActionTypes.SET_UI_FROM_DB_SETTINGS:
      return { ...state, ...action.payload };
    case ActionTypes.SET_IS_MOBILE:
      const matched = action.payload.match(/Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i);
      return { ...state, isMobile: !!matched, mobileType: matched?.[0] ?? null };
    case ActionTypes.SET_IS_STANDALONE:
      return { ...state, isStandAlone: action.payload };
    case ActionTypes.SET_PAGE_FOCUS:
      return { ...state, pageHasFocus: action.payload };
    case ActionTypes.SET_CONNECTED:
      return { ...state, isConnected: action.payload };
    case ActionTypes.SET_WINDOW_DIMENSIONS:
      document.documentElement.style.setProperty('--vh', `${vh}px`);
      return { ...state, windowDimensions: action.payload };
    case ActionTypes.SET_OPERATING_SYSTEM:
      return { ...state, operatingSystem: action.payload };
    case ActionTypes.SET_BROWSER:
      return { ...state, browser: action.payload };
    case ActionTypes.SET_COMPONENT_LOADING:
      state.loading[action.payload.value].push(action.payload.param ?? true);
      return { ...state };
    case ActionTypes.REMOVE_COMPONENT_LOADING:
      if (action.payload.param) {
        state.loading[action.payload.value] = state.loading[action.payload.value].filter((el: any) => el !== action.payload.param);
      } else {
        state.loading[action.payload.value].pop();
      }
      return { ...state };
    case ActionTypes.SET_THEME:
      const themeDark = action.payload === 'dark';
      // Then we set the value in the --vh custom property to the root of the documentbackground: rgb(208,208,208);
      document.documentElement.style.setProperty('--vh', `${vh}px`);
      document.documentElement.style.setProperty('--main-border-style', themeDark ? '1px solid #4A4A4A' : '1px solid #E8E8E8');
      document.documentElement.style.setProperty('--background-color', themeDark ? 'hsl(0, 0%, 10%)' : state.isStandAlone ? 'linear-gradient(180deg, rgba(210,210,210,1),  rgba(255,255,255,1) 6vh)' : 'white');
      document.documentElement.style.setProperty('--text-color', themeDark ? 'white' : 'hsl(0, 0%, 10%)');
      document.documentElement.style.setProperty('--app-primary', themeDark ? 'rgba(153, 102, 255, 0.6)' : 'rgba(54, 162, 235, 0.6)');
      document.documentElement.style.setProperty('--table-background-color', themeDark ? 'rgba(255, 15, 15, 0.71)' : 'rgba(247, 99, 99, 0.44)');
      return { ...state, theme: action.payload };
    case ActionTypes.SET_PAGE_VIEW:
      return { ...state, [action.payload.type]: { view: action.payload.value } };
    case ActionTypes.SET_AUTO_THEME:
      return { ...state, autoTheme: action.payload };
    case ActionTypes.SET_DISTANCE_BETWEEN:
      return { ...state, map: { distanceBetween: action.payload } };
    case ActionTypes.SET_LIVE_UPDATES:
      return { ...state, liveUpdates: action.payload };
    case ActionTypes.SET_SOCKET_CONNECTED:
      return { ...state, isSocketConnected: action.payload };
    default: {
      return state;
    }
  }
};

export default reducer;
