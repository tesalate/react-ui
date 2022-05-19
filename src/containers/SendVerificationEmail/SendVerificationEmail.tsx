import React, { useEffect } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { actions as userActions } from '../../ducks/user/user.index';
import { RootState } from '../../redux/reducers';
import { Row, Col, Button, Spinner } from 'react-bootstrap';
import { Link } from 'react-router-dom';

const SendVerificationEmail: React.FC = () => {
  const dispatch = useDispatch();

  const { loading, error, isVerified, sent } = useSelector(({ uiState, userState }: RootState) => ({
    loading: uiState.loading['SendingVerificationEmail'].length > 0,
    verificationSuccess: userState.verificationSuccess,
    error: userState.userError,
    isVerified: userState.user?.isEmailVerified,
    sent: userState.sentVerificationEmail !== null && Date.now() < userState.sentVerificationEmail,
  }));

  useEffect(() => {
    if (!isVerified && !sent) {
      dispatch(userActions.requestVerificationEmail());
    }
  }, [dispatch, isVerified, sent]);

  const returnHomeButton = (
    <Button variant="outline-secondary" size="sm" as={Link} to={'/'} className="mt-2">
      Return home
    </Button>
  );

  let content;
  if (isVerified) {
    content = (
      <>
        <span role="img" aria-label="Partying Face">
          🥳
        </span>{' '}
        You are already verified! <br />
        {returnHomeButton}
      </>
    );
  } else if (loading) {
    content = (
      <>
        <Spinner as="span" animation="border" role="status" aria-hidden="true" size="sm" /> Sending Verification email...
      </>
    );
  }

  // DONE STATE
  else if (sent) {
    content = (
      <>
        <h3 className="text-muted mb-1">
          <span role="img" aria-label="checkmark">
            ✔️
          </span>{' '}
          Verification email has been sent. Please check your inbox
        </h3>
      </>
    );
  } else if (error) {
    content = (
      <>
        Oops, something went wrong. Please try again.
        <br /> {returnHomeButton}
      </>
    );
  }

  return (
    <div
      style={{
        position: 'absolute',
        left: '50%',
        top: '50%',
        transform: 'translate(-50%, -50%)',
      }}
      className="text-center w-100"
    >
      <Row className="mb-2">
        <Col>
          <b>{process.env.REACT_APP_NAME?.toUpperCase()}</b>
        </Col>
      </Row>
      <Row className="mb-2">
        <Col>{content}</Col>
      </Row>
    </div>
  );
};
export default SendVerificationEmail;
