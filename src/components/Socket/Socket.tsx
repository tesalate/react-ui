/* ========= PACKAGE IMPORTS ========= */
import React, { useEffect, useRef, useMemo } from 'react';
import { w3cwebsocket as W3CWebSocket } from 'websocket';

/* ========= REDUX IMPORTS ========= */
import { useSelector, useDispatch } from 'react-redux';
import { RootState } from '../../redux/reducers';
import { actions as uiActions } from '../../ducks/ui/ui.index';
import { actions as mapPointActions } from '../../ducks/mapPoints/mapPoints.index';
import { actions as chargeSessionActions } from '../../ducks/chargeSessions/chargeSessions.index';
import { actions as driveSessionActions } from '../../ducks/driveSessions/driveSessions.index';
import { actions as completeDataPointActions } from '../../ducks/completeDataPoints/completeDataPoints.index';
import { actions as toastActions } from '../../ducks/toasts/toasts.index';
import { selectors as vehicleSelectors } from '../../ducks/vehicles/vehicles.index';

const Socket: React.FC = () => {
  let client: W3CWebSocket;
  const dispatch = useDispatch();
  const {
    userState: { user, loggedIn },
    vehicles,
  } = useSelector(({ userState, vehiclesState }: RootState) => ({
    userState: {
      user: userState.user,
      loggedIn: userState.loggedIn,
    },
    vehicles: vehiclesState.vehicles,
  }));

  const currentVehicles = useMemo(() => vehicleSelectors.getSelectedVehicles(vehicles), [vehicles]);

  const calledOnce = useRef(false);

  useEffect(() => {
    if (loggedIn && user) {
      if (calledOnce.current) {
        const url = process.env.REACT_APP_API_URL as string;
        const socketUrl = url.substring(url.lastIndexOf('/') + 1);
        client = new W3CWebSocket(`${process.env.NODE_ENV === 'production' ? 'wss' : 'ws'}://${socketUrl}/socket`);
        client.onopen = () => {
          // console.log(`WebSocket Client Connected`, client);
        };
        client.onmessage = (message) => {
          const data = JSON.parse(message.data as string);
          console.log('WHAT', data);
          dispatch(uiActions.setLastRefresh());
          if (data?.action === 'insert' && data.type.includes('sessions')) {
            dispatch(
              toastActions.addToasts({
                _id: data._id,
                startDate: data.startDate,
                type: data.type,
                vid: data.vehicle,
              })
            );
          }
          switch (data.type) {
            case 'charge-sessions':
              dispatch(chargeSessionActions.socketUpdate(data));
              break;
            case 'drive-sessions':
              if (data.action === 'insert') {
              }
              dispatch(driveSessionActions.socketUpdate(data));
              break;
            case 'completevehicledatapoints':
              dispatch(completeDataPointActions.socketUpdate(data));
              dispatch(completeDataPointActions.setCompleteDataPointCount(data.vehicle, data.count));
              dispatch(mapPointActions.socketUpdate(data));
              break;
            default:
              break;
          }
        };
        return;
      }
      calledOnce.current = true;
    }
  }, [currentVehicles, dispatch, user, loggedIn]);

  return null;
};

export default Socket;
