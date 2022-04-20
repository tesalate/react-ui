import React from 'react';
import ReactDOM from 'react-dom';
import './index.css';
import App from './containers/App/App';
import * as serviceWorker from './serviceWorker';
import store, { persistor } from './redux/store';
import { Provider } from 'react-redux';
import { BrowserRouter } from 'react-router-dom';
import { PersistGate } from 'redux-persist/integration/react'

// define any global interfaces here
declare global {
  interface Window {
    Cypress: any;
    store  : any;
    __REDUX_DEVTOOLS_EXTENSION_COMPOSE__: any;
  }
}

if (window.Cypress) {
  // Automatically consider Cypress "logged in" because (1) Cypress does not need to access the back-end, and (2) Cypress is not being used to test auth
  // DEVELOPER NOTE: This is not a security risk; all front-end artifacts are manipulable by the user. The security lives on the back-end, in that all API requests must be authenticated.

  /* WE MAY NEED THIS LATER ON WHEN AUTH FLOW IS IMPLEMENTED */
  // store.dispatch({type: '[user] SET_USER', payload: { email: "cypress.test@myTesla.com", isLoggedIn: true }});
  window.store = store;
}


ReactDOM.render(
  <React.StrictMode>
    <Provider store={store}>
      <PersistGate loading={null} persistor={persistor}>
        <BrowserRouter>
          <App />
        </BrowserRouter> 
      </PersistGate>
    </Provider>
  </React.StrictMode>,
  document.getElementById('root')
);

// If you want your app to work offline and load faster, you can change
// unregister() to register() below. Note this comes with some pitfalls.
// Learn more about service workers: https://bit.ly/CRA-PWA
serviceWorker.register({
  onUpdate: (e) => {
    const { waiting: { postMessage = null } = {} as any, update } = e || {};
    if (postMessage) {
      postMessage({ type: 'SKIP_WAITING' });
    }
    update().then(() => {
      window.location.reload();
    });
  },
});
process.send && process.send('ready')
