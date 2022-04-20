import React, { useEffect, useMemo, lazy } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { actions as chargeSessionsActions, selectors } from '../../ducks/chargeSessions/chargeSessions.index';
import { selectors as vehicleSelectors } from '../../ducks/vehicles/vehicles.index';
import { actions as uiActions } from '../../ducks/ui/ui.index';
import { RootState } from '../../redux/reducers';
import { Row, Col, Button } from 'react-bootstrap';
import { useParams } from 'react-router-dom';
import { SessionRouteParams } from '../types';
import { objArrToSortByString } from '../../utils/convert';

const CircleMap = lazy(() => import('../../components/CircleMap/CircleMap'));
const SessionNavigation = lazy(() => import('../../components/SessionNavigation/SessionNavigation'));
const ChargeSessionsTable = lazy(() => import('./ChargeSessionsTable/ChargeSessionsTableFinal'));
const SelectedChargeSession = lazy(() => import('./SelectedChargeSession/SelectedChargeSession'));

const ChargeSessions: React.FC = () => {
  const dispatch = useDispatch();
  let { id }: SessionRouteParams = useParams();

  const {
    chargeSessionsState: { sessionsObj, pageSizeFromState, pageIndexFromState, sessionData, sortBy, error, singleSessionErrors, totalPages },
    vehicles,
    uiState: {
      loading,
      pageHasFocus,
      theme,
      chargePage: { view },
    },
    isConnected,
  } = useSelector(({ chargeSessionsState, uiState, vehiclesState }: RootState) => ({
    chargeSessionsState: {
      sessionsObj: chargeSessionsState.sessions,
      selectedSession: chargeSessionsState.selectedSession,
      sessionData: chargeSessionsState.sessionData,
      error: chargeSessionsState.chargeSessionsError,
      pageSizeFromState: chargeSessionsState.pageSize,
      pageIndexFromState: chargeSessionsState.pageIndex,
      sortBy: chargeSessionsState.sortBy,
      singleSessionErrors: chargeSessionsState.singleChargeSessionsError,
      totalPages: chargeSessionsState.totalPages,
    },
    uiState: {
      loading: uiState.loading,
      pageHasFocus: uiState.pageHasFocus,
      theme: uiState.theme,
      chargePage: uiState.chargePage,
    },
    isConnected: uiState.isConnected,
    vehicles: vehiclesState.vehicles,
  }));

  const currentVehicles = useMemo(() => vehicleSelectors.getSelectedVehicles(vehicles), [vehicles]);

  useEffect(() => {
    if (currentVehicles.length > 0 && pageHasFocus) {
      currentVehicles.forEach((vehicle: any) => {
        dispatch(
          chargeSessionsActions.requestChargeSessions({
            vehicle,
            limit: pageSizeFromState.toString(),
            page: (pageIndexFromState + 1).toString(),
            sortBy: objArrToSortByString(sortBy),
          })
        );
      });
    }
  }, [dispatch, pageHasFocus, currentVehicles, pageSizeFromState, pageIndexFromState, sortBy, view]);

  const selectedSession = useMemo(() => selectors.selectedChargeSession(id, sessionData), [id, sessionData]);
  const sessions = useMemo(() => selectors.getChargeSessions(currentVehicles, sessionsObj), [currentVehicles, sessionsObj]);

  useEffect(() => {
    dispatch(chargeSessionsActions.setSelectedSession(id));
  }, [dispatch, id]);

  useEffect(() => {
    // if (!selectedSession && id){
    if (id) {
      dispatch(chargeSessionsActions.requestSessionById(id));
    }
  }, [dispatch, id]);

  //replace supercharger name
  useEffect(() => {
    try {
      if (id) {
        if (sessions && selectedSession?.sessionData?.supercharger?.value) {
          const foundSession = sessions.find((el: any) => el._id === id);
          if (foundSession) {
            selectedSession.sessionData.supercharger.value = foundSession.supercharger.title;
            selectedSession.sessionData.supercharger.displayType = '';
          }
        }
      }
    } catch (error) {
      // fail silently
    }
  }, [id, selectedSession, sessions]);

  return (
    <div style={{ touchAction: 'pan-y' }}>
      <SessionNavigation current={id} sessionIds={sessions.map((el: any) => ({ _id: el._id, vid: el.vid }))} sessionType={'charge'} theme={theme === 'light' ? 'outline-dark' : 'outline-light'} />
      {id ? (
        <SelectedChargeSession id={id} data={selectedSession} theme={theme ?? undefined} errors={singleSessionErrors} isConnected={isConnected} />
      ) : (
        <Row className="mb-2">
          <Col>
            {view === 'map' && (
              <>
                {sessions.length > 0 && (
                  <>
                    <CircleMap mapPoints={sessions} loading={loading['ChargeSessions'].length > 0} error={error} theme={theme ?? undefined} />
                    <Button variant={theme === 'light' ? 'outline-dark' : 'outline-light'} size="sm" className="mb-2" onClick={() => dispatch(uiActions.setPageView({ type: 'chargePage', value: 'table' }))}>
                      view table
                    </Button>
                  </>
                )}
              </>
            )}
            {view === 'table' && (
              <>
                <ChargeSessionsTable
                  sessions={sessions}
                  loading={loading['ChargeSessions'].length > 0}
                  pageSizeFromState={pageSizeFromState}
                  pageIndexFromState={pageIndexFromState}
                  sortBy={sortBy}
                  sessionData={sessionData}
                  error={error}
                  totalPages={totalPages}
                />
                <Button variant={theme === 'light' ? 'outline-dark' : 'outline-light'} size="sm" onClick={() => dispatch(uiActions.setPageView({ type: 'chargePage', value: 'map' }))}>
                  view map
                </Button>
              </>
            )}
          </Col>
        </Row>
      )}
    </div>
  );
};
export default ChargeSessions;
