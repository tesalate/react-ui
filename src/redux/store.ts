import { applyMiddleware, createStore, compose } from 'redux';
import createSagaMiddleware from 'redux-saga';
import { persistStore } from "redux-persist";
// import storage from 'redux-persist-indexeddb-storage';
// import defaultStorage from "redux-persist/lib/storage";
import rootSaga from './sagas';
import rootReducer from './reducers';



// middleware
const sagaMiddleware =  createSagaMiddleware();
const middleware     =  applyMiddleware(sagaMiddleware);

// configure redux devtools on prod vs dev environment
let store: any = null;
if (process.env.NODE_ENV === 'production' || process.env.REACT_APP_BUILD_ENVIRONMENT === 'production') {
  store = createStore(rootReducer, middleware);
} else {
  const reduxDevtoolOptions = { trace: true, traceLimit: 25 };
  const composeEnhancers =  window.__REDUX_DEVTOOLS_EXTENSION_COMPOSE__ 
        ? window.__REDUX_DEVTOOLS_EXTENSION_COMPOSE__(reduxDevtoolOptions) as typeof compose
        : compose;

  store = createStore(rootReducer, composeEnhancers(middleware));
  // store.subscribe(() => console.log('state: ', store.getState()));
}

store.runSaga =  sagaMiddleware.run(rootSaga);
export const persistor = persistStore(store)
export default store