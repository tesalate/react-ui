import React, { useMemo, lazy } from 'react';
import { Row, Col, Accordion, useAccordionButton, Button } from 'react-bootstrap';
import Moment from 'react-moment';

// COMPONENTS
import { cToF } from '../../../utils/convert';
import { numberWithCommas } from '../../../utils/formatFunctions';
import { usePreloadImages } from '../../../utils/customHooks';

// IMAGES
import fan from '../../../assets/fan-icon-22.gif';
import charging from '../../../assets/battery.gif';
import lockedImage from '../../../assets/locked.png';
import unlockedImage from '../../../assets/unlocked.png';
import sentry from '../../../assets/sentry.gif';
import caution from '../../../assets/caution.png';
import { IFlatInfoCompProps } from '../../../components/FlatInfoComp/FlatInfoComp';

const FlatInfoComp = lazy(() => import('../../../components/FlatInfoComp/FlatInfoComp'));
const ThemedSkeleton = lazy(() => import('../../../components/ThemedSkeleton/ThemedSkeleton'));

const getBatteryColor = (battery: number, theme: string) => {
  let batteryColor;
  if (battery <= 9) batteryColor = 'red';
  if (battery >= 10 && battery <= 20) batteryColor = theme === 'dark' ? 'yellow' : '#ffb300';
  if (battery >= 21) batteryColor = 'green';
  return batteryColor;
};

const getStatusColor = (status: string) => {
  let statusColor;
  switch (status) {
    case 'online':
      statusColor = 'green';
      break;
    case 'offline':
      statusColor = 'red';
      break;
    case 'asleep':
      statusColor = '#636363';
      break;
    default:
      statusColor = 'black';
      break;
  }
  return statusColor;
};

const climateSymbol = (status: boolean, theme: string) => {
  if (status) {
    return (
      <img
        src={fan}
        style={{ maxHeight: '16px', marginRight: '2%', filter: theme === 'dark' ? '' : 'invert(1)' }}
        alt="fan"
        key={`fan`}
        // className = {theme === "dark" ? "" : "invert"}
      />
    );
  }
  return;
};

const lockSymbol = (status: boolean, theme: string) => {
  if (status) {
    return (
      <img
        src={lockedImage}
        style={{ maxWidth: '20px', marginRight: '4%', filter: theme === 'dark' ? '' : 'invert(1)' }}
        alt="locked"
        key={`locked`}
        // className = {theme === "dark" ? "" : "invert"}
      />
    );
  }
  return (
    <img
      src={unlockedImage}
      style={{ maxWidth: '20px', marginRight: '4%', filter: theme === 'dark' ? '' : 'invert(1)' }}
      alt="unlocked"
      key={`unlocked`}
      // className = {theme === "dark" ? "" : "invert"}
    />
  );
};

const sentrySymbol = (status: boolean) => {
  if (status) {
    return <img src={sentry} style={{ maxWidth: '20px', marginRight: '4%' }} alt="sentry" key={`sentry`} />;
  }
  return 'off';
};

const batterySymbol = (status: string, theme: string) => {
  if (status === 'Charging') {
    return (
      <img
        src={charging}
        style={{ maxWidth: '16px', marginRight: '4%', filter: theme === 'dark' ? '' : 'invert(1)' }}
        alt="battery"
        key={`battery`}
        // className = {theme === "dark" ? "" : "invert"}
      />
    );
  }
  return;
};

const CurrentInfo = ({ theme, data }: any) => {
  const preload = [fan, charging, lockedImage, unlockedImage, sentry, caution];
  usePreloadImages(preload);

  const {
    charge_state: { charging_state, usable_battery_level, battery_level, timestamp, est_battery_range } = { charging_state: null, usable_battery_level: null, battery_level: null, timestamp: null, est_battery_range: null },
    vehicle_state: { sentry_mode, locked, odometer, car_version } = { sentry_mode: null, locked: null, odometer: null, car_version: null },
    climate_state: { is_climate_on, inside_temp, outside_temp } = { is_climate_on: null, inside_temp: null, outside_temp: null },
    status = null,
    collectData = null,
    display_name = null,
    error = false,
    count = null,
    idx,
  } = data;

  const commonLabelStyle = {
    fontSize: '.78rem',
    marginTop: 0,
    lineHeight: '20px',
  };
  const commonTextStyle = {
    fontSize: '1.6rem',
    marginBottom: 0,
    lineHeight: '20px',
  };

  const infoToDisplay: Array<IFlatInfoCompProps> = useMemo(
    () =>
      error
        ? [
            {
              label: '',
              text: (
                <>
                  <img src={caution} alt="caution" style={{ maxWidth: '20px', filter: theme === 'dark' ? 'invert(1)' : '' }} /> error loading data
                </>
              ),
              labelStyle: {},
              textStyle: {},
            },
          ]
        : [
            {
              text:
                display_name === null ? (
                  <ThemedSkeleton />
                ) : (
                  <Row key={'vehicle-title'} className="d-flex justify-content-between">
                    {' '}
                    <Col xs={6} sm={6} md={6} className="text-start pe-0">
                      {display_name}
                    </Col>{' '}
                    <Col className="text-end ps-0" xs={6} sm={6} md={6} style={{ color: status ? getStatusColor(status) : 'black' }}>
                      {status || 'offline'}
                    </Col>
                  </Row>
                ),
              label: (
                <Row key={'vehicle-body'} className="d-flex justify-content-between align-self-center">
                  {' '}
                  <Col className="text-start pe-0" xs={6} sm={6} md={6}>
                    name
                  </Col>{' '}
                  <Col className="text-end ps-0" xs={6} sm={6} md={6}>
                    status
                  </Col>
                </Row>
              ),
              labelStyle: {
                ...commonLabelStyle,
              },
              textStyle: {
                ...commonTextStyle,
              },
            },
            {
              text:
                charging_state === null ? (
                  <ThemedSkeleton />
                ) : (
                  <Row key={'charge-title'} className="d-flex justify-content-between">
                    {' '}
                    <Col xs={6} sm={6} md={6} className="text-start pe-0">
                      {battery_level + '%'}
                    </Col>{' '}
                    <Col className="text-end ps-0" xs={6} sm={6} md={6}>
                      {usable_battery_level + '%'}
                    </Col>
                  </Row>
                ),
              label: (
                <Row key={'charge-body'} className="d-flex justify-content-between align-self-center">
                  {' '}
                  <Col className="text-start pe-0" xs={6} sm={6} md={6}>
                    battery {batterySymbol(charging_state, theme)}
                  </Col>{' '}
                  <Col className="text-end ps-0" xs={6} sm={6} md={6}>
                    useable
                  </Col>
                </Row>
              ),
              labelStyle: {
                ...commonLabelStyle,
              },
              textStyle: {
                color: usable_battery_level ? getBatteryColor(usable_battery_level, theme) : 'white',
                ...commonTextStyle,
              },
            },
            {
              text:
                odometer === null ? (
                  <ThemedSkeleton />
                ) : (
                  <Row key={'miles-title'} className="d-flex justify-content-between">
                    <Col xs={6} sm={6} md={6} className="text-start pe-0">
                      {numberWithCommas(odometer)}
                    </Col>
                    <Col className="text-end ps-0" xs={6} sm={6} md={6}>
                      {parseInt(est_battery_range)}
                    </Col>
                  </Row>
                ),
              label: (
                <Row key={'charge-body'} className="d-flex justify-content-between align-self-center">
                  {' '}
                  <Col className="text-start pe-0" xs={6} sm={6} md={6}>
                    miles
                  </Col>{' '}
                  <Col className="text-end ps-0" xs={6} sm={6} md={6}>
                    range
                  </Col>
                </Row>
              ),
              labelStyle: {
                ...commonLabelStyle,
              },
              textStyle: {
                ...commonTextStyle,
              },
            },
            {
              text:
                sentry_mode === null ? (
                  <ThemedSkeleton />
                ) : (
                  <Row key={'sentry-title'} className="d-flex justify-content-between">
                    {' '}
                    <Col xs={6} md={6} className="text-start pe-0">
                      {lockSymbol(locked, theme)}
                    </Col>{' '}
                    <Col className="text-end ps-0" xs={6} md={6}>
                      {sentrySymbol(sentry_mode)}
                    </Col>
                  </Row>
                ),
              label: (
                <Row className="d-flex justify-content-between align-self-center">
                  {' '}
                  <Col key={'sentry-body'} xs={6} md={4} className="text-start pe-0">
                    doors
                  </Col>{' '}
                  <Col className="text-end ps-0" xs={6} md={6}>
                    sentry
                  </Col>
                </Row>
              ),
              labelStyle: {
                ...commonLabelStyle,
              },
              textStyle: {
                ...commonTextStyle,
              },
            },
            {
              text:
                is_climate_on === null ? (
                  <ThemedSkeleton />
                ) : (
                  <Row key={'climate-title'} className="d-flex justify-content-between">
                    {' '}
                    <Col xs={6} md={6} className="text-start pe-0">
                      {(cToF(inside_temp).toFixed(0) + '\u00b0').toString()}
                    </Col>{' '}
                    <Col className="text-end ps-0" xs={6} md={6}>
                      {(cToF(outside_temp).toFixed(0) + '\u00b0').toString()}
                    </Col>
                  </Row>
                ),
              label: (
                <Row key={'climate-body'} className="d-flex justify-content-between align-self-center">
                  {' '}
                  <Col xs={6} md={6} className="text-start pe-0">
                    inside {climateSymbol(is_climate_on, theme)}
                  </Col>{' '}
                  <Col className="text-end ps-0" xs={6} md={6}>
                    outside
                  </Col>
                </Row>
              ),
              labelStyle: {
                ...commonLabelStyle,
              },
              textStyle: {
                ...commonTextStyle,
              },
            },
            {
              text:
                count === null ? (
                  <ThemedSkeleton />
                ) : (
                  <Row key={'climate-title'} className="d-flex justify-content-between">
                    {' '}
                    <Col xs={6} md={6} className="text-start pe-0">
                      {numberWithCommas(count)}
                    </Col>{' '}
                    <Col className="text-end ps-0" xs={6} md={6} style={{ color: collectData ? 'green' : 'red' }}>
                      {collectData ? 'on' : 'off'}
                    </Col>
                  </Row>
                ),
              label: (
                <Row key={'climate-body'} className="d-flex justify-content-between align-self-center">
                  {' '}
                  <Col xs={6} md={6} className="text-start pe-0">
                    docs saved
                  </Col>{' '}
                  <Col className="text-end ps-0" xs={6} md={6}>
                    data collections
                  </Col>
                </Row>
              ),
              labelStyle: {
                ...commonLabelStyle,
              },
              textStyle: {
                ...commonTextStyle,
              },
            },
          ],
    [error, battery_level, charging_state, commonLabelStyle, commonTextStyle, display_name, est_battery_range, inside_temp, is_climate_on, locked, odometer, outside_temp, sentry_mode, status, theme, usable_battery_level, count, collectData]
  );

  interface CustomToggleProps {
    children: React.ReactChild | React.ReactChildren;
    eventKey: string;
  }
  const CustomToggle = ({ children, eventKey }: CustomToggleProps) => {
    const decoratedOnClick = useAccordionButton(eventKey);

    return (
      <Button variant={theme} type="Button" className="p-0 m-0" style={{ minWidth: '100%', backgroundColor: 'rgba(255, 255, 255, 0)', border: 'none' }} onClick={decoratedOnClick}>
        {children}
      </Button>
    );
  };
  return (
    <Row className="app-content mx-0 mb-2">
      <Col
        sm={12}
        md={4}
        lg={2}
        xl={2}
        className="p-2"
        style={{
          border: 'var(--main-border-style)',
          borderRadius: '.6rem',
          backgroundColor: theme === 'dark' ? 'rgba(52, 58, 64, .5)' : 'rgba(255, 255, 255, .8)',
          zIndex: 9999,
          minWidth: 'clamp(200px, 100%, 260px)',
        }}
      >
        <Accordion defaultActiveKey={idx} flush>
          <Accordion.Item eventKey={idx} style={{ backgroundColor: 'rgba(255,255,255,0)' }}>
            <CustomToggle eventKey={idx}>{display(infoToDisplay, idx)}</CustomToggle>
          </Accordion.Item>
        </Accordion>
        <Row>
          <Col sm="12" className="text-center text-muted mb-0" style={{ fontSize: '.7rem' }}>
            last saved: {timestamp ? <Moment format="MM/DD/YY HH:mm:ss">{timestamp}</Moment> : ''}{' '}
          </Col>
          <Col sm="12" className="text-center text-muted mb-0" style={{ fontSize: '.7rem' }}>
            software: {car_version?.match(/\d+(\.\d+)+/g) ?? ''}{' '}
          </Col>
        </Row>
      </Col>
    </Row>
  );
};

export default CurrentInfo;

function display(infoToDisplay: IFlatInfoCompProps[], idx: any): React.ReactChild | React.ReactChildren {
  return (
    <div style={{ width: '100%' }}>
      {infoToDisplay.map((el, _idx) => {
        const _body = (
          <Row key={`row-${_idx}`} className="mx-0 px-2 py-2">
            <FlatInfoComp {...el} />
            <hr
              className="mb-2 p-0"
              style={{
                border: 'var(--main-border-style)',
                clear: 'both',
                display: 'block',
                width: '100%',
              }}
            />
          </Row>
        );
        if (_idx === 0) {
          return _body;
        }
        return (
          <Accordion.Collapse eventKey={idx} key={_idx + '1'}>
            {_body}
          </Accordion.Collapse>
        );
      })}
    </div>
  );
}
