import React from 'react';
import { Modal, Button, Row, Col } from 'react-bootstrap';
import { Link } from 'react-router-dom';
import { toTitleCase } from '../../utils/formatFunctions';
import { State as UIState } from '../../ducks/ui/ui.index';

interface IModalProps {
  theme: UIState['theme'];
}

const ErrorModal: React.FC<IModalProps> = ({ theme }) => {
  // const [show, setShow] = useState(true);

  return (
    <>
      <Modal
        show={true}
        // onHide          = {() => setShow(false)}
        dialogClassName="standard-modal-dialog"
        className="standard-modal"
        aria-labelledby="example-custom-modal-styling-title "
        style={{ zIndex: 9999999999 }}
        backdrop="static"
        centered
      >
        <Modal.Header className={'bg-danger'}>
          <Modal.Title id="example-custom-modal-styling-title">
            <span role="img" aria-label="warning" className="me-2">
              ⚠️
            </span>
            <strong>Oops!</strong>
          </Modal.Title>
        </Modal.Header>
        <Modal.Body className={`align-items-center justify-content-center bg-danger`}>
          <p>There was a problem getting your profile...</p>
          <hr />
          <p>
            <small>Need to log into a different {toTitleCase((process.env.REACT_APP_NAME as string) ?? 'tesalate')} account?</small>
          </p>
          <Row className="d-flex justify-space-between m-0 p-0">
            <Col className="m-0 p-0">
              <Button size={'sm'} variant={theme === 'light' ? 'outline-dark' : 'outline-light'} as={Link} to={'/logout'}>
                Log Out
              </Button>
            </Col>
          </Row>
        </Modal.Body>
      </Modal>
    </>
  );
};

export default ErrorModal;
