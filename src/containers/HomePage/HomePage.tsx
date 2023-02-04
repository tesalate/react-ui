import React, { useEffect, useMemo, useRef, lazy } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { actions as mapPointsActions, selectors as mapPointSelectors } from '../../ducks/mapPoints/mapPoints.index';
import { selectors as vehicleSelectors } from '../../ducks/vehicles/vehicles.index';
import { actions as completeDataPointsActions } from '../../ducks/completeDataPoints/completeDataPoints.index';
import { IReminder, selectors as remindersSelectors } from '../../ducks/reminders/reminders.index';
import { RootState } from '../../redux/reducers';
import CurrentInfo from './CurrentInfo/CurrentInfo';
import Reminder from './Reminder/Reminder';

const LeafletMap = lazy(() => import('../../components/LeafletMap/LeafletMap'));

const HomePage: React.FC = () => {
  const dispatch = useDispatch();
  const {
    mapPointsState: { dataObj, mapPointsError, distanceBetween },
    uiState: { loading, theme, pageHasFocus },
    completeDataPointsState: { dataPoints, mostRecent, error, count },
    remindersState: { allReminders },
    vehicles,
  } = useSelector(({ mapPointsState, uiState, completeDataPointsState, userState, remindersState, vehiclesState }: RootState) => ({
    mapPointsState: {
      dataObj: mapPointsState.data,
      mapPointsError: mapPointsState.mapPointsError,
      distanceBetween: uiState.map.distanceBetween,
    },
    uiState: {
      loading: uiState.loading['MapPoints'].length > 0,
      theme: uiState.theme,
      pageHasFocus: uiState.pageHasFocus,
    },
    completeDataPointsState: {
      dataPoints: completeDataPointsState.dataPoints,
      mostRecent: completeDataPointsState.mostRecent,
      error: completeDataPointsState.completeDataPointsError,
      count: completeDataPointsState.count,
    },
    userState: {
      user: userState.user,
    },
    remindersState: {
      allReminders: remindersState.allReminders,
      remindersError: remindersState.remindersError,
    },
    vehicles: vehiclesState.vehicles,
  }));

  const distRef = useRef(distanceBetween);

  const currentVehiclesMemo = useMemo(() => vehicleSelectors.getSelectedVehicles(vehicles), [vehicles]);

  useEffect(() => {
    if (pageHasFocus) {
      dispatch(completeDataPointsActions.requestHomePageData());
    }
  }, [dispatch, pageHasFocus, currentVehiclesMemo]);

  useEffect(() => {
    if (distRef.current !== distanceBetween) {
      distRef.current = distanceBetween;
      if (currentVehiclesMemo.length > 0) {
        currentVehiclesMemo.forEach((vehicle: any) => {
          dispatch(mapPointsActions.requestMapPoints(true, vehicle, distanceBetween));
        });
      }
    }
  }, [dispatch, distanceBetween, currentVehiclesMemo]);

  const data = useMemo(() => mapPointSelectors.getMapData(currentVehiclesMemo, dataObj), [currentVehiclesMemo, dataObj]);

  const mapProps = useMemo(
    () => ({
      style: {
        height: '100vh',
        width: '100vw',
        padding: 0,
        margin: 0,
        position: 'fixed',
        left: 0,
        top: 0,
        zIndex: 0,
      },
      data: data,
      loading: loading,
      theme: theme,
      geoJson: false,
      error: mapPointsError,
      zoomSnap: 0.1,
      boundOptions: { padding: [320, 10] },
    }),
    [data, theme, loading, mapPointsError]
  );

  const currentInfoPropsArray = useMemo(
    () =>
      (currentVehiclesMemo as string[]).map((vehicle: string, idx: number) => {
        const curr = vehicles.find((el: { _id: string }) => el._id === vehicle);
        return {
          ...(dataPoints as { [key: string]: {} })[mostRecent[vehicle]],
          status: curr?.state,
          collectData: curr?.collectData,
          count: (count as { [key: string]: number })[vehicle],
          error,
          idx: idx.toString(),
        };
      }),
    [currentVehiclesMemo, count, dataPoints, error, mostRecent, vehicles]
  );

  const remindersToDisplay = useMemo(
    () =>
      remindersSelectors.getRemindersByVID(
        allReminders,
        currentVehiclesMemo,
        (currentVehiclesMemo as string[]).map((vehicle: string) => parseInt((dataPoints as any)[mostRecent[vehicle]]?.vehicle_state.odometer))
      ),
    [currentVehiclesMemo, allReminders, dataPoints, mostRecent]
  );
  return (
    <div style={{ touchAction: 'pinch-zoom' }}>
      {remindersToDisplay.map((reminder: IReminder) => (
        <span key={reminder._id}>
          <Reminder reminder={reminder} vehicleMiles={(dataPoints as any)[mostRecent[reminder.vehicle]]?.vehicle_state?.odometer} />
        </span>
      ))}
      {currentInfoPropsArray.map((data: any, idx: number) => (
        <CurrentInfo data={data} theme={theme} key={idx} />
      ))}
      <LeafletMap {...mapProps} />
    </div>
  );
};
export default HomePage;
