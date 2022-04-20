import React from 'react';
import { Card, Row, Col } from 'react-bootstrap';
import Moment from 'react-moment';
import { Link } from 'react-router-dom';
import { cToF } from '../../utils/convert';
import { numberWithCommas } from '../../utils/formatFunctions';

const DataRow = (data: any) => {
  return (
    <Row className="d-flex justify-content-between align-self-center mb-4">
      <Col md={6}>
        <Card.Title className="mb-1">{data.leftTitle}</Card.Title>
        <Card.Subtitle className="text-muted">{data.leftSub}</Card.Subtitle>
      </Col>
      <Col md={6}>
        <Card.Title className="mb-1">{data.rightTitle}</Card.Title>
        <Card.Subtitle className="text-muted">{data.rightSub}</Card.Subtitle>
      </Col>
    </Row>
  );
};

const LeafletPopupData = (props: any) => {
  const dataToRender = [
    {
      leftTitle: props.drive_state.speed || 0,
      leftSub: 'speed',
      rightTitle: props.drive_state.power,
      rightSub: 'power',
    },
    {
      leftTitle: props.charge_state.battery_level + '%',
      leftSub: 'battery',
      rightTitle: props.charge_state.usable_battery_level + '%',
      rightSub: 'useable',
    },
    {
      leftTitle: numberWithCommas(props.vehicle_state.odometer),
      leftSub: 'miles',
      rightTitle: props.charge_state.est_battery_range,
      rightSub: 'range',
    },
    {
      leftTitle: cToF(props.climate_state.inside_temp).toFixed(2) + '\u00b0',
      leftSub: 'inside',
      rightTitle: cToF(props.climate_state.outside_temp).toFixed(2) + '\u00b0',
      rightSub: 'outside',
    },
  ];

  return (
    <>
      <p style={{ fontSize: '1.25rem', marginBottom: '1.115rem' }}>
        <Moment format="MM/DD/YY HH:mm:ss">{props.charge_state.timestamp}</Moment>
      </p>
      {dataToRender.map((data: any, idx) => (
        <DataRow {...data} key={idx} />
      ))}
      {props.charge_session_id && props.home && <Link to={`/charge-sessions/${props.charge_session_id}`}>Charge Session</Link>}
      {props.drive_session_id && props.home && <Link to={`/drive-sessions/${props.drive_session_id}`}>Drive Session</Link>}
    </>
  );
};
export default LeafletPopupData;
