import React, { useEffect, /*useRef,*/ useState, useMemo } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { actions as statsActions, selectors as statsSelectors, IStatsObj, StatTypes, StatTypeArr, TimeFrameTypes, TimeFrameArr } from '../../ducks/stats/stats.index';
import { RootState } from '../../redux/reducers';
import { selectors as vehicleSelectors } from '../../ducks/vehicles/vehicles.index';
import { Row, Col, ButtonGroup, Button, Spinner } from 'react-bootstrap';
import BarGraph from '../../components/BarGraph/BarGraph';
import { titleCase } from '../../utils/convert';

const Stats: React.FC = () => {
  const dispatch = useDispatch();
  const [vehicleStats, setVehicleStats] = useState<Array<IStatsObj>>([]);
  const [selectedStat, setSelectedStat] = useState<StatTypes>((sessionStorage.getItem('selectedStat') as StatTypes) ?? StatTypeArr[0]);
  const [dayMonthOrYear, setDayMonthOrYear] = useState<TimeFrameTypes>((sessionStorage.getItem('monthOrYearStat') as TimeFrameTypes) ?? 'month');

  const {
    statsState: { stats },
    loading,
    theme,
    vehicles,
  } = useSelector(({ statsState, vehiclesState, uiState }: RootState) => ({
    statsState: {
      // data        : statsState.data,
      stats: statsState.stats,
      error: statsState.statsError,
    },
    loading: uiState.loading['Stats'].length > 0,
    theme: uiState.theme,
    vehicles: vehiclesState.vehicles,
  }));

  const currentVehicles = useMemo(() => vehicleSelectors.getSelectedVehicles(vehicles), [vehicles]);

  useEffect(() => {
    dispatch(statsActions.requestStats());
  }, [dispatch]);

  useEffect(() => {
    currentVehicles.forEach((vehicle: string) => {
      if (stats[vehicle]) {
        setVehicleStats(statsSelectors.getStatsToDisplay(stats[vehicle], vehicle));
      }
    });
  }, [dispatch, currentVehicles, stats]);

  const foundStats = useMemo(() => vehicleStats.find((el: IStatsObj) => el.systemKey === selectedStat), [vehicleStats, selectedStat]) as IStatsObj;
  // const monthlyStats = useMemo(() => statsSelectors.getMonthlyStats(foundStats), [foundStats]);

  // move these to a more general location for other files to use
  const backgroundColor = useMemo(() => ['rgba(54, 162, 235, 0.4)', 'rgba(153, 102, 255, 0.4)', 'rgba(75, 192, 192, 0.4)', 'rgba(201, 203, 207, 0.4)', 'rgba(255, 99, 132, 0.4)', 'rgba(255, 159, 64, 0.4)', 'rgba(255, 205, 86, 0.4)'], []);

  // move these to a more general location for other files to use
  const borderColor = useMemo(() => ['rgb(54, 162, 235)', 'rgb(153, 102, 255)', 'rgb(75, 192, 192)', 'rgb(201, 203, 207)', 'rgb(255, 99, 132)', 'rgb(255, 159, 64)', 'rgb(255, 205, 86)'], []);

  const shapedData = useMemo(() => {
    if (foundStats)
      switch (dayMonthOrYear) {
        case 'year':
          return statsSelectors.getYearlyStats(foundStats);
        case 'month':
          return statsSelectors.getMonthlyStats(foundStats, backgroundColor, borderColor);
        default:
          return statsSelectors.getDailyStats(foundStats);
      }
    return {};
  }, [backgroundColor, borderColor, dayMonthOrYear, foundStats]);

  return (
    <Row>
      <Col>
        {loading ? (
          <div className="d-flex justify-content-center align-items-center" style={{ height: '90vh' }}>
            <Spinner as="span" animation="border" role="status" aria-hidden="true" />
          </div>
        ) : (
          <>
            <ButtonGroup aria-label="statTypes" className="d-flex justify-content-center my-2 mx-auto" style={{ minWidth: '300px', maxWidth: '400px' }}>
              {vehicleStats
                .sort((a, b) => a.displayOrder - b.displayOrder)
                .map((el: IStatsObj) => {
                  return (
                    <Button
                      className="p-1"
                      size="sm"
                      active={selectedStat === el.systemKey}
                      key={el.systemKey}
                      id={el.systemKey}
                      variant={theme === 'dark' ? 'dark' : 'outline-secondary'}
                      onClick={() => {
                        setSelectedStat(el.systemKey as StatTypes);
                        sessionStorage.setItem('selectedStat', el.systemKey);
                      }}
                    >
                      {el.displayName}
                    </Button>
                  );
                })}
            </ButtonGroup>
            <ButtonGroup aria-label="timeFrame" className="d-flex justify-content-center mb-2 mx-auto" style={{ minWidth: '100px', maxWidth: '200px' }}>
              {TimeFrameArr.map((el: TimeFrameTypes) => {
                return (
                  <Button
                    active={dayMonthOrYear === el}
                    key={el}
                    id={el}
                    className="p-0"
                    size="sm"
                    variant={theme === 'dark' ? 'dark' : 'outline-secondary'}
                    onClick={() => {
                      setDayMonthOrYear(el as TimeFrameTypes);
                      sessionStorage.setItem('dayMonthOrYearStat', el);
                    }}
                  >
                    {titleCase(`by ${el}`)}{' '}
                  </Button>
                );
              })}
            </ButtonGroup>
            {vehicleStats.length > 0 && (
              <BarGraph
                data={shapedData}
                unit={foundStats?.['unit'] ?? ''}
                style={{
                  height: 'calc(var(--vh, 1vh) * 70)',
                  width: '100%',
                  border: 'var(--main-border-style)',
                  borderRadius: '.6rem',
                }}
              />
            )}
          </>
        )}
      </Col>
    </Row>
  );
};
export default Stats;
