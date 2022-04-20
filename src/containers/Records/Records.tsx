import React, { useEffect, useMemo } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { actions as recordsActions, selectors as recordSelectors } from '../../ducks/records/records.index';
import { selectors as vehicleSelectors } from '../../ducks/vehicles/vehicles.index';
import { RootState } from '../../redux/reducers';
import CardComp from '../../components/CardComp/CardComp';
import ThemedSkeleton from '../../components/ThemedSkeleton/ThemedSkeleton';
import { Row, Col } from 'react-bootstrap';
import { v4 as uuidv4 } from 'uuid';

const Records: React.FC = () => {
  const dispatch = useDispatch();
  const {
    recordsState: { data, recordTypes },
    vehicles,
  } = useSelector(({ recordsState, vehiclesState }: RootState) => ({
    recordsState: {
      data: recordsState.data,
      recordTypes: recordsState.recordTypes,
      error: recordsState.recordsError,
    },
    vehicles: vehiclesState.vehicles,
  }));

  const currentVehicles = useMemo(() => vehicleSelectors.getSelectedVehicles(vehicles), [vehicles]);

  useEffect(() => {
    dispatch(recordsActions.requestRecordTypes());
  }, [dispatch]);

  useEffect(() => {
    currentVehicles.forEach((vehicle: string) => {
      if (currentVehicles && recordTypes.length >= 1) {
        recordTypes.forEach((record: any) => {
          dispatch(recordsActions.requestRecord(record.systemKey, vehicle));
        });
      }
    });
  }, [dispatch, currentVehicles, recordTypes]);

  return (
    <Row /*className="d-flex justify-content-around"*/>
      {recordSelectors.getRecordsToDisplay(data).map((record: any) => {
        const currentObject: any = {
          title: !record.hasOwnProperty('value') ? (
            <ThemedSkeleton />
          ) : (
            [
              parseInt(record['value']),
              <span key={uuidv4()} style={{ fontSize: '.9rem' }}>
                {' '}
                {record['unit']}
              </span>,
            ]
          ),
          body: !record.hasOwnProperty('displayName') ? <ThemedSkeleton /> : <>{record['displayName']}</>, //<br/>{record.hasOwnProperty('info') && Object.keys(record['info']).map(item => item === 'year' ? `${record['info'][item]}` : `${record['info'][item]}/`)}
          bodyStyle: { fontSize: '.94rem' },
          titleStyle: { fontSize: '1.628rem', marginBottom: '.25rem' },
        };
        return (
          <Col sm={12} md={3} lg={2}>
            <CardComp {...currentObject} key={uuidv4()} />
          </Col>
        );
      })}
    </Row>
  );
};
export default Records;
