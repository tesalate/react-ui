import React from 'react';
import { Row, Col, Spinner, Button } from 'react-bootstrap';
import FlatInfoComp from '../../../components/FlatInfoComp/FlatInfoComp';
import Moment from 'react-moment';
import './Vehicles.css';
import carTypeMap from '../../../utils/carTypeMap';
import { IVehicle } from '../../../ducks/vehicles/vehicles.index';
import { objectIdToCreationDate } from '../../../utils/convert';
import { State as UIState } from '../../../ducks/ui/ui.index';

interface VehiclesProps {
  vehicles: IVehicle[];
  handleClick: (val: string) => void;
  loading: { [key: string]: any[] };
  theme: UIState['theme'];
}

const systemNameToLabelMap = {
  _id: 'created',
  option_codes: 'model',
};

const Vehicles: React.FC<VehiclesProps> = ({ vehicles = [], handleClick, loading = {}, theme }) => {
  return (
    <Row className="mb-5">
      <Col>
        <h4>Vehicles</h4>
        <hr />
        <p>
          <small>
            All vehicles, past and present, will appear here.
            <br />
            Click on the vehicle box to change what vehicle data is shown throughout the app
          </small>
        </p>
        {vehicles.length === 0 ? (
          <>
            <hr />
            <p>
              <strong>There are no vehicles in your account.</strong>
            </p>
          </>
        ) : (
          vehicles.map((vehicle: any, idx: number) => {
            const isLoading = loading['SelectingVehicle'].includes(vehicle._id);
            return (
              <Button key={idx} className="m-0 p-0" variant="non" onClick={() => handleClick(vehicle._id)} disabled={loading['SelectingVehicle'].length > 0}>
                <Col style={{ border: 'var(--main-border-style)', position: 'relative', overflow: 'hidden' }} className="rounded py-2 mb-2 px-3 vehicleBox">
                  {isLoading && (
                    <div
                      className="h-100 w-100 d-flex justify-content-center align-items-center m-0 rounded"
                      style={{
                        background: theme === 'dark' ? 'rgba(0,0,0,0.8)' : 'rgba(0,0,0,0.2)',
                        position: 'absolute',
                        zIndex: 99999,
                        top: '0',
                        left: '0',
                        width: '100%',
                        height: '100%',
                      }}
                    >
                      <Spinner as="span" animation="border" role="status" aria-hidden="true" className="m-2" variant="light" />
                    </div>
                  )}
                  <Row className="d-flex justify-content-between">
                    {vehicle.selected && (
                      <span
                        style={{
                          borderLeft: '5px solid var(--app-primary)',
                          position: 'absolute',
                          left: 0,
                          top: 0,
                        }}
                        className="w-100 h-100 p-0 m-0"
                      />
                    )}
                    {['display_name', 'option_codes', 'vin', '_id'].map((key: string, idx: number) => {
                      const cardInfo = {
                        text: key === '_id' ? <Moment format={'MMM MM YYYY'}>{objectIdToCreationDate(vehicle[key])}</Moment> : key === 'option_codes' ? carTypeMap(vehicle?.option_codes) : vehicle[key],
                        label: (systemNameToLabelMap as any)[key] ?? key.split('_').join(' '),
                        textStyle: { lineHeight: '20px', fontSize: '1.01rem' },
                        labelStyle: { fontSize: '.86rem', lineHeight: '20px' },
                      };
                      return (
                        <Col xs="auto" key={`${idx}-col`} className="my-2 text-start">
                          <FlatInfoComp {...cardInfo} key={idx} />
                        </Col>
                      );
                    })}
                  </Row>
                </Col>
              </Button>
            );
          })
        )}
      </Col>
    </Row>
  );
};

export default Vehicles;
