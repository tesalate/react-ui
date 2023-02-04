/* ========= PACKAGE IMPORTS ========= */
import React, { Dispatch, useEffect, useLayoutEffect, useRef } from 'react';
import { w3cwebsocket as W3CWebSocket } from 'websocket';

/* ========= REDUX IMPORTS ========= */
import { useDispatch, useSelector } from 'react-redux';
import { actions as uiActions } from '../../ducks/ui/ui.index';
import { actions as chargeSessionActions } from '../../ducks/chargeSessions/chargeSessions.index';
import { actions as driveSessionActions } from '../../ducks/driveSessions/driveSessions.index';
import { actions as completeDataPointActions } from '../../ducks/completeDataPoints/completeDataPoints.index';
import { actions as toastActions } from '../../ducks/toasts/toasts.index';
import { RootState } from '../../redux/reducers';

const socketReconnect = 5000;

const connect = (client: React.MutableRefObject<W3CWebSocket | null>, dispatch: Dispatch<any>) => {
  const url = process.env.REACT_APP_API_URL as string;
  const socketUrl = url.substring(url.lastIndexOf('/') + 1);
  client.current = new W3CWebSocket(`${process.env.NODE_ENV === 'production' ? 'wss' : 'ws'}://${socketUrl}/socket`);

  if (!client.current) return;

  dispatch(uiActions.setIsSocketConnected(true));

  client.current.onclose = function (e) {
    console.log(`Socket is closed. Reconnect will be attempted in ${socketReconnect / 1000} second.`, e.reason);
    setTimeout(function () {
      connect(client, dispatch);
    }, socketReconnect);
  };

  client.current.onerror = function (err) {
    console.error('Socket encountered error: ', err.message, 'Closing socket');
    client?.current?.close();
  };

  client.current.onmessage = (message) => {
    const data = JSON.parse(message.data as string);

    if (data?.action === 'insert' && ['charge', 'drive', 'sleep', 'sentry'].includes(data.type)) {
      dispatch(
        toastActions.addToasts({
          _id: data._id,
          startDate: data.startDate,
          type: data.type,
          vid: data.vehicle,
        })
      );
    }
    switch (data.collection) {
      case 'sessions':
        if (data.type === 'charge') dispatch(chargeSessionActions.socketUpdate(data));
        if (data.type === 'drive') dispatch(driveSessionActions.socketUpdate(data));
        break;
      case 'vehicledata':
        dispatch(uiActions.setLastRefresh());

        dispatch(completeDataPointActions.socketUpdate(data));
        dispatch(completeDataPointActions.setCompleteDataPointCount(data.vehicle, data.count));
        // dispatch(mapPointActions.socketUpdate(data));
        break;
      default:
        break;
    }
  };
};

const Socket: React.FC = () => {
  const dispatch = useDispatch();
  const { loggedIn, liveUpdates } = useSelector(({ userState, uiState }: RootState) => ({
    loggedIn: userState.loggedIn,
    liveUpdates: uiState.liveUpdates,
  }));
  let client = useRef<W3CWebSocket | null>(null);

  useEffect(() => {
    if (!liveUpdates) {
      client?.current?.close();
      client.current = null;
      dispatch(uiActions.setIsSocketConnected(false));
      return;
    }

    connect(client, dispatch);
  }, [dispatch, loggedIn, liveUpdates]);

  useLayoutEffect(() => {
    client?.current?.close();
    client.current = null;
    dispatch(uiActions.setIsSocketConnected(false));
  }, [dispatch, client]);
  return null;
};

export default Socket;
