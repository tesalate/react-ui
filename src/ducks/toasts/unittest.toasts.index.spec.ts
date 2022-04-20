import reducer, { ActionTypes, State, Action, initialState } from './toasts.index';

describe('reducer', () => {
  const testCases: { 
    testName     : string,
    initialState : State,
    type         : Action["type"],
    payload      : Action["payload"],
    assertState  : State
  }[] = [
    {
      testName     :  'handles SET_PAGE_FOCUS false',
      initialState :  initialState,
      type         :  ActionTypes.SET_PAGE_FOCUS,
      payload      :  { payload: false },
      assertState  :  { ...initialState, pageHasFocus: false }
    },
    {
      testName     :  'handles SET_PAGE_FOCUS true',
      initialState :  initialState,
      type         :  ActionTypes.SET_PAGE_FOCUS,
      payload      :  { payload: true },
      assertState  :  { ...initialState, pageHasFocus: true }
    },
    {
      testName     :  'handles SET_CONNECTED true',
      initialState :  initialState,
      type         :  ActionTypes.SET_CONNECTED,
      payload      :  { payload: true },
      assertState  :  { ...initialState, isConnected: true }
    },
    {
      testName     :  'handles SET_CONNECTED false',
      initialState :  initialState,
      type         :  ActionTypes.SET_CONNECTED,
      payload      :  { payload: false },
      assertState  :  { ...initialState, isConnected: false }
    },
    {
      testName     :  'handles SET_WINDOW_DIMENSIONS 1920x1080',
      initialState :  initialState,
      type         :  ActionTypes.SET_WINDOW_DIMENSIONS,
      payload      :  { payload: {'width':1920, 'height': 1080} },
      assertState  :  { ...initialState, windowDimensions: {'width':1920, 'height': 1080} }
    },
    {
      testName     :  'handles SET_OPERATING_SYSTEM MacOS',
      initialState :  initialState,
      type         :  ActionTypes.SET_OPERATING_SYSTEM,
      payload      :  { payload: 'MacOS' },
      assertState  :  { ...initialState, operatingSystem: 'MacOS' }
    },
    {
      testName     :  'handles SET_BROWSER Chrome',
      initialState :  initialState,
      type         :  ActionTypes.SET_BROWSER,
      payload      :  { payload: 'Chrome' },
      assertState  :  { ...initialState, browser: 'Chrome' }
    },
    {
      testName     :  'handles SET_COMPONENT_LOADING true',
      initialState :  initialState,
      type         :  ActionTypes.SET_COMPONENT_LOADING,
      payload      :  { payload: {'StatusTable': true} },
      assertState  :  { ...initialState, loading: { 'StatusTable': true } }
    },
    {
      testName     :  'handles SET_COMPONENT_LOADING and shows it will not overwrite other component loading',
      initialState :  { ...initialState, loading: { 'Subscriptions': false } },
      type         :  ActionTypes.SET_COMPONENT_LOADING,
      payload      :  { payload: {'StatusTable': true} },
      assertState  :  { ...initialState, loading: {'Subscriptions': false, 'StatusTable': true} }
    },
  ];

    testCases.forEach( (test) => {
      it(test.testName, () => {
        const action   =  { type: test.type, ...test.payload };
        const newState =  reducer(test.initialState, action);
        expect(newState).toEqual(test.assertState);
      });
    });
});
 