import React from 'react';
import { Modal, Button, Spinner } from 'react-bootstrap';
import { Link } from 'react-router-dom';
import { toTitleCase } from '../../utils/formatFunctions';
import { useDispatch } from 'react-redux';
import { State as UIState } from '../../ducks/ui/ui.index';

interface IModalProps {
  theme: UIState['theme'];
  loading: boolean;
  requestVerificationEmail: any;
  sent: boolean;
}

const VerifyModal: React.FC<IModalProps> = ({ theme, loading, requestVerificationEmail, sent }) => {
  // const [show, setShow] = useState(true);
  const dispatch = useDispatch();
  const lightTheme = theme === 'light';
  return (
    <Modal
      show={true}
      // onHide          = {() => setShow(false)}
      dialogClassName="standard-modal-dialog modal-lg"
      className="standard-modal"
      aria-labelledby="example-custom-modal-styling-title "
      style={{ zIndex: 9999999999 }}
      backdrop="static"
      centered
    >
      <Modal.Header className={`bg-${lightTheme ? 'warning' : 'dark'} `}>
        <Modal.Title id="example-custom-modal-styling-title">
          <span role="img" aria-label="warning" className="me-2">
            ⚠️
          </span>
          <small>Looks like you haven't verified your email address yet...</small>
        </Modal.Title>
      </Modal.Header>
      <Modal.Body className={`align-items-center justify-content-center bg-${lightTheme ? 'light' : 'secondary'} `}>
        <b className="mb-2">To use {toTitleCase((process.env.REACT_APP_NAME as string) ?? 'tesalate')}, we require a valid and verified email address.</b>
        <br />
        <small className="mb-2">Please check your email for an "Email Verification" message and follow the link in the email body.</small>
        <br />
        <small>If you need us to send another email, please click the button below.</small>
        <br />
      </Modal.Body>
      <Modal.Footer className={`bg-${lightTheme ? 'light' : 'dark'}  justify-content-between py-1`}>
        {/* <Row className="d-flex justify-space-between m-0 p-0"> */}
        {/* <Col className="m-0 p-0"> */}
        <Button size={'sm'} variant={lightTheme ? 'light' : 'dark'} onClick={() => dispatch(requestVerificationEmail())} className="m-1" disabled={loading || sent}>
          {sent ? '✔️ Sent' : loading ? <Spinner as="span" animation="border" role="status" aria-hidden="true" size="sm" /> : 'Resend Email'}
        </Button>
        {/* </Col> */}
        {/* <Col className="m-0 p-0"> */}
        <Button size={'sm'} variant={lightTheme ? 'light' : 'dark'} as={Link} to={'/logout'} className="m-1">
          Log Out
        </Button>
        {/* </Col> */}
        {/* </Row> */}
      </Modal.Footer>
    </Modal>
  );
};

export default VerifyModal;
