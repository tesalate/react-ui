import React, { useEffect, useMemo } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { actions as driveSessionsActions, selectors } from '../../ducks/driveSessions/driveSessions.index';
import { selectors as vehicleSelectors } from '../../ducks/vehicles/vehicles.index';
import { RootState } from '../../redux/reducers';
import { Row, Col } from 'react-bootstrap';
import DriveSessionsTable from './DriveSessionsTable/DriveSessionsTable';
import SelectedDriveSession from './SelectedDriveSession/SelectedDriveSession';
import { useParams } from 'react-router-dom';
import SessionNavigation from '../../components/SessionNavigation/SessionNavigation';
import { SessionRouteParams } from '../types';
import { objArrToSortByString } from '../../utils/convert';
import { SessionType } from '../../ducks/sessions/sessions.index';

const DriveSessions: React.FC = () => {
  const dispatch = useDispatch();
  let { id }: SessionRouteParams = useParams();

  const {
    driveSessionsState: { sessionsObj, pageSizeFromState, pageIndexFromState, sessionData, sortBy, error, singleSessionErrors, totalPages, sortedIds },
    vehicles,
    uiState: { loading, theme, pageHasFocus },
    isConnected,
  } = useSelector(({ driveSessionsState, uiState, vehiclesState }: RootState) => ({
    driveSessionsState: {
      sessionsObj: driveSessionsState.sessions,
      selectedSession: driveSessionsState.selectedSession,
      sessionData: driveSessionsState.sessionData,
      error: driveSessionsState.driveSessionsError,
      pageSizeFromState: driveSessionsState.pageSize,
      pageIndexFromState: driveSessionsState.pageIndex,
      sortBy: driveSessionsState.sortBy,
      singleSessionErrors: driveSessionsState.singleDriveSessionsError,
      totalPages: driveSessionsState.totalPages,
      sortedIds: driveSessionsState.sortedIds,
    },
    uiState: {
      loading: uiState.loading,
      theme: uiState.theme,
      pageHasFocus: uiState.pageHasFocus,
    },
    isConnected: uiState.isConnected,
    vehicles: vehiclesState.vehicles,
  }));
  const currentVehicles = useMemo(() => vehicleSelectors.getSelectedVehicles(vehicles), [vehicles]);

  useEffect(() => {
    if (currentVehicles.length > 0 && pageHasFocus) {
      currentVehicles.forEach((vehicle: any) => {
        dispatch(
          driveSessionsActions.requestDriveSessions({
            vehicle,
            limit: pageSizeFromState.toString(),
            page: (pageIndexFromState + 1).toString(),
            sortBy: objArrToSortByString(sortBy),
          })
        );
      });
    }
  }, [dispatch, pageHasFocus, currentVehicles, pageSizeFromState, pageIndexFromState, sortBy]);

  const selectedSession = useMemo(() => selectors.selectedDriveSession(id, sessionData), [id, sessionData]);

  const sessions = useMemo(() => selectors.getDriveSessions(currentVehicles, sessionsObj), [currentVehicles, sessionsObj]);

  useEffect(() => {
    dispatch(driveSessionsActions.setSelectedSession(id));
  }, [dispatch, id]);

  useEffect(() => {
    // if (!selectedSession && id){
    if (id) {
      dispatch(driveSessionsActions.requestSessionById(id));
    }
  }, [dispatch, id]);

  return (
    <div style={{ touchAction: 'pan-y' }}>
      <SessionNavigation current={id} sessionType={SessionType['drive']} sessionIds={sortedIds} theme={theme === 'light' ? 'outline-dark' : 'outline-light'} />
      {id ? (
        <SelectedDriveSession id={id} data={selectedSession} theme={theme ?? undefined} loading={loading['DriveSessions'].length > 0} error={error} errors={singleSessionErrors} isConnected={isConnected} />
      ) : (
        <Row>
          <Col>
            <DriveSessionsTable
              sessions={sessions}
              loading={loading['DriveSessions'].length > 0}
              pageSizeFromState={pageSizeFromState}
              pageIndexFromState={pageIndexFromState}
              sortBy={sortBy}
              sessionData={sessionData}
              error={error}
              totalPages={totalPages}
            />
          </Col>
        </Row>
      )}
    </div>
  );
};
export default DriveSessions;
