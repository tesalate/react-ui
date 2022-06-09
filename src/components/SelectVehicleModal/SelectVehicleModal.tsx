import React, { useState } from 'react';
import { Modal, Form, Button, Col, Row } from 'react-bootstrap';
import { useSelector, useDispatch } from 'react-redux';
import { RootState } from '../../redux/reducers';
import { actions as vehiclesActions } from '../../ducks/vehicles/vehicles.index';
import { Link } from 'react-router-dom';
import { IVehicle } from '../../ducks/vehicles/vehicles.index';
import { State as UIState } from '../../ducks/ui/ui.index';

interface IModalProps {
  _show?: boolean;
  theme: UIState['theme'];
}

const SelectVehicleModal: React.FC<IModalProps> = ({ theme }) => {
  const dispatch = useDispatch();
  const [show, setShow] = useState(true);
  const [selected, setSelected] = useState('');

  const { vehicles } = useSelector(({ vehiclesState }: RootState) => ({
    vehicles: vehiclesState.vehicles,
  }));

  return (
    <>
      <Modal show={show} onHide={() => !!selected && setShow(false)} dialogClassName="modal-dark" aria-labelledby="example-custom-modal-styling-title" style={{ zIndex: 999999999 }} className="standard-modal" backdrop="static" centered>
        <Modal.Header className={theme === 'dark' ? 'bg-dark' : ''}>
          <Modal.Title id="example-custom-modal-styling-title">Select a Vehicle</Modal.Title>
        </Modal.Header>
        <Modal.Body className={theme === 'dark' ? 'bg-dark' : ''}>
          <p>
            <small>
              You currently do not have a vehicle selected.
              <br />
              Select a vehicle to view its stats throughout the dashboard.
            </small>
          </p>
          <Form>
            <Form.Control
              as="select"
              onChange={(e: any) => setSelected(e.target.value)}
              className="mb-2"
              // style={{backgroundColor: 'rgba(0,0,0,0)'}}
            >
              <option value={''}>Select a vehicle...</option>
              {vehicles.map((vehicle: IVehicle) => {
                return (
                  <option value={vehicle._id} key={vehicle._id}>
                    {vehicle.display_name}
                  </option>
                );
              })}
            </Form.Control>
            <Row className="d-flex justify-space-between m-0 p-0">
              <Col className="m-0 p-0">
                <Button size={'sm'} disabled={!selected} variant={'outline-success'} onClick={() => selected && dispatch(vehiclesActions.setSelectedVehicles(selected))}>
                  Submit
                </Button>
              </Col>
              <Col className="m-0 p-0">
                <Button size={'sm'} variant={'link'} as={Link} to={'/settings'} className={'float-end'} style={{ color: 'var(--app-primary)' }}>
                  Go to settings
                </Button>
              </Col>
            </Row>
          </Form>
        </Modal.Body>
      </Modal>
    </>
  );
};

export default SelectVehicleModal;
