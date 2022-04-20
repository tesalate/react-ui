import React, { useEffect } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { actions as userActions } from '../../ducks/user/user.index';
import { RootState } from '../../redux/reducers';
import { Row, Col, Button, Spinner } from 'react-bootstrap';
import { useQuery } from '../../utils/customHooks';
import caution from '../../assets/caution.png';
import { Link } from 'react-router-dom';

const VerifyEmail: React.FC = () => {
  const dispatch = useDispatch();
  const query = useQuery();
  const token = query.get('token');

  const { loading, verificationSuccess, error } = useSelector(({ uiState, userState }: RootState) => ({
    loading: uiState.loading['VerifyRequest'].length > 0,
    verificationSuccess: userState.verificationSuccess,
    error: userState.userError,
  }));

  useEffect(() => {
    if (token) {
      dispatch(userActions.sendVerifyRequest(token));
    }
  }, [token]);

  const returnHomeButton = (
    <Button variant="link" size="sm" as={Link} to={'/'}>
      Return home
    </Button>
  );

  let content;
  // ERROR STATE
  if (!verificationSuccess && error) {
    content = (
      <>
        <img src={caution} style={{ maxHeight: 'clamp(1rem, 5vw, 3rem)' }} alt="caution" />
        <p className="text-muted mb-1">
          There was an error verifying your email. <br /> If the error persists, request a new verification email.
        </p>
        {returnHomeButton}
      </>
    );
  }
  // LOADING STATE
  else if (loading) {
    content = (
      <>
        <Spinner as="span" animation="border" role="status" aria-hidden="true" size="sm" /> Verifying email...
      </>
    );
  }

  // DONE STATE
  else if (verificationSuccess) {
    content = (
      <>
        <h3 className="text-muted mb-1">✔️ Your email has been verified</h3>
        {returnHomeButton}
      </>
    );
  } else {
    content = (
      <>
        Oops, how did you end up here?
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
export default VerifyEmail;
