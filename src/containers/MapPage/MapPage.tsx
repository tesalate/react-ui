import React, { useEffect, useMemo, lazy } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { actions as mapPointsActions, selectors as mapPointSelectors } from '../../ducks/mapPoints/mapPoints.index';
import { selectors as vehicleSelectors } from '../../ducks/vehicles/vehicles.index';
import { RootState } from '../../redux/reducers';

const LeafletMap = lazy(() => import('../../components/LeafletMap/LeafletMap'));

const MapPage: React.FC = () => {
  const dispatch = useDispatch();
  const {
    mapPointsState: { dataObj, error },
    uiState: { loading, theme, pageHasFocus },
    vehicles,
  } = useSelector(({ mapPointsState, uiState, completeDataPointsState, vehiclesState }: RootState) => ({
    mapPointsState: {
      dataObj: mapPointsState.allData,
      error: mapPointsState.mapPointsError,
    },
    uiState: {
      loading: uiState.loading['MapPoints'].length > 0,
      theme: uiState.theme,
      pageHasFocus: uiState.pageHasFocus,
    },
    completeDataPointsState: {
      dataPoints: completeDataPointsState.dataPoints,
      mostRecent: completeDataPointsState.mostRecent,
    },
    vehicles: vehiclesState.vehicles,
  }));

  const currentVehicles = useMemo(() => vehicleSelectors.getSelectedVehicles(vehicles), [vehicles]);

  useEffect(() => {
    if (currentVehicles.length > 0 && pageHasFocus) {
      currentVehicles.forEach((vehicle: any) => {
        dispatch(mapPointsActions.requestMapPoints(false, vehicle));
      });
    }
  }, [dispatch, pageHasFocus, currentVehicles]);

  const data = useMemo(() => mapPointSelectors.getMapData(currentVehicles, dataObj), [currentVehicles, dataObj]);

  const mapProps = useMemo(
    () => ({
      style: {
        height: '100vh',
        width: '100vw',
        padding: 0,
        margin: 0,
        position: 'absolute',
        left: 0,
        top: 0,
        zIndex: 0,
      },
      data: data,
      loading: loading,
      theme: theme,
      geoJson: true,
      error: error,
    }),
    [data, theme, loading, error]
  );
  return (
    <div>
      <LeafletMap {...mapProps} />
    </div>
  );
};
export default MapPage;
