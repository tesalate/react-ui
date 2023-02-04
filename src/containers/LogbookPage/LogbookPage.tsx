import React, { useEffect, useMemo } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { actions as sessionsActions, SessionType } from '../../ducks/sessions/sessions.index';
import { IVehicle, selectors as vehicleSelectors } from '../../ducks/vehicles/vehicles.index';
import { RootState } from '../../redux/reducers';
import { Link, useParams, useHistory } from 'react-router-dom';
import moment from 'moment';
import Moment from 'react-moment';
import sessionIcons from '../../utils/sessionIcons';
import { Row, Col, Button, Spinner } from 'react-bootstrap';
import caution from '../../assets/caution.png';

const LogbookPage: React.FC = () => {
  const dispatch = useDispatch();
  let history = useHistory();

  let { date }: { date: string } = useParams();
  const _date = useMemo(() => date ?? moment().format('YYYY-MM-DD'), [date]);
  const now = useMemo(() => moment().format('YYYY-MM-DD'), []);
  const start = useMemo(() => `${_date}T00:00:00.000${moment().format('Z')}`, [_date]);
  const end = useMemo(() => `${_date}T23:59:59.999${moment().format('Z')}`, [_date]);
  const dayAfter = useMemo(() => moment(_date).add(1, 'd').format('YYYY-MM-DD'), [_date]);
  const dayBefore = useMemo(() => moment(_date).subtract(1, 'd').format('YYYY-MM-DD'), [_date]);

  const disableDayAfter = useMemo(() => new Date(dayAfter) > new Date(now), [dayAfter, now]);

  useEffect(() => {
    if (!date) history.push(`/logs/${_date}`);
  }, [date, _date, history]);

  const {
    uiState: { pageHasFocus },
    vehicles,
    logbook,
    loading,
    errorState,
    theme,
  } = useSelector(({ sessionsState, uiState, vehiclesState }: RootState) => ({
    loading: uiState.loading?.['Logs']?.length > 0,
    theme: uiState.theme,
    uiState: {
      pageHasFocus: uiState.pageHasFocus,
    },
    logbook: sessionsState.logs,
    vehicles: vehiclesState.vehicles,
    errorState: sessionsState.sessionsError,
  }));

  const currentVehicles = useMemo(() => vehicleSelectors.getSelectedVehicles(vehicles), [vehicles]);

  useEffect(() => {
    if (currentVehicles.length > 0 && pageHasFocus) {
      currentVehicles.forEach((vehicle: any) => {
        dispatch(sessionsActions.requestLogs({ vehicle, startDate: start, endDate: end }));
      });
    }
  }, [dispatch, pageHasFocus, currentVehicles, start, end]);

  return (
    <div style={{ maxWidth: '800px' }} className="mx-auto">
      <Row className="d-flex justify-space-between mx-0 p-0 mb-2">
        <Col className="m-0 p-0">
          {!disableDayAfter && (
            <Button size={'sm'} variant={'link'} as={Link} to={`/logs/${dayAfter}`} style={{ textDecoration: 'none' }}>
              {'<'} {dayAfter}
            </Button>
          )}
        </Col>
        <Col className="mx-auto text-center">
          <small className="align-middle text-muted">
            {loading ? (
              <>
                <Spinner size="sm" as="span" animation="border" role="status" aria-hidden="true" /> Loading {_date} logs
              </>
            ) : (
              _date
            )}
          </small>
        </Col>
        <Col className="m-0 p-0">
          <Button className="float-end" size={'sm'} variant={'link'} as={Link} to={`/logs/${dayBefore}`} style={{ textDecoration: 'none' }}>
            {dayBefore} {'>'}
          </Button>
        </Col>
      </Row>
      <Row>
        {currentVehicles.map((vehicle, idx) => {
          const displayName = vehicles.find((v: IVehicle) => v._id === vehicle.toString())?.display_name;
          const emptyList = logbook?.[vehicle]?.[_date]?.length === 0 || !logbook?.[vehicle]?.[_date];

          if (errorState && emptyList)
            return (
              <Col className="mx-auto text-center" key={vehicle + idx + 'session-error'}>
                <img src={caution} style={{ maxHeight: '40px', filter: theme === 'dark' ? 'invert(1)' : '' }} alt="caution" />
                <br />
                <small className="text-muted">There was an error getting logs for {displayName}</small>
              </Col>
            );
          if (emptyList && !loading)
            return (
              <Col className="mx-auto text-center" key={vehicle + idx + 'no-session'}>
                <small className="text-muted">No sessions have been recorded for {displayName} on this day</small>
              </Col>
            );
          return (
            <Col key={vehicle + idx}>
              {logbook?.[vehicle]?.[_date]?.map((log: { date: string; start: boolean; type: SessionType; _id: string }) => (
                <div key={vehicle + log._id + log.start + log.type}>
                  {sessionIcons.get(log.type)}
                  <Link to={`/${log.type}-sessions/${log._id}`} style={{ textDecoration: 'none' }}>
                    <Moment format={'HH:mm:ss'}>{log.date}</Moment> - {displayName} {log.start ? 'started' : 'ended'} a {log.type} session
                  </Link>
                  <br />
                </div>
              ))}
              {currentVehicles.length > 1 && idx !== currentVehicles.length - 1 && <hr />}
            </Col>
          );
        })}
      </Row>
    </div>
  );
};
export default LogbookPage;
