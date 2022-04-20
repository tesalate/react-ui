import React, { useState } from 'react';
import { useFormik } from 'formik';
import { Row, Col, Form, Button, Spinner } from 'react-bootstrap';
import { useDispatch, useSelector } from 'react-redux';
import { actions as userActions } from '../../ducks/user/user.index';
import { RootState } from '../../redux/reducers';
import { useLocation } from 'react-router';
import { useEffect } from 'react';
import { Redirect } from 'react-router-dom';
import { isTruthy } from '../../utils/helper';
import { toTitleCase } from '../../utils/formatFunctions';

const LoginComp: React.FC = () => {
  const [passwordVisible, setPasswordVisible] = useState(false);
  const {
    uiState: { theme, loading },
    userState: { error },
    loggedIn,
    isConnected,
  } = useSelector(({ uiState, userState }: RootState) => ({
    uiState: {
      theme: uiState.theme,
      loading: uiState.loading['User'].length > 0,
    },
    userState: {
      error: userState.userError,
    },
    user: userState.user,
    loggedIn: userState.loggedIn,
    isConnected: uiState.isConnected,
  }));

  const location = useLocation();
  const query = new URLSearchParams(location.search);
  const urlUserName = query.get('username') ?? undefined;
  const urlPWD = query.get('pwd') ?? undefined;
  const autoSubmit = isTruthy(query.get('submit'));
  const dispatch = useDispatch();

  const formik = useFormik({
    initialValues: {
      username: urlUserName ?? '',
      password: urlPWD ?? '',
    },
    onSubmit: (values) => {
      const { username, password } = values;
      dispatch(userActions.loginUser(username, password));
    },
  });

  const { username, password } = formik.values;

  useEffect(() => {
    if (username && password && autoSubmit) {
      dispatch(userActions.loginUser(username, password));
    }
  }, [username, password, autoSubmit, dispatch]);

  if (loggedIn) return <Redirect to="/" />;

  return (
    <Row className="d-flex justify-content-center align-items-center" style={{ height: '90vh' }}>
      <Col
        style={{
          borderRadius: '.6rem',
          border: 'var(--main-border-style)',
          padding: '2rem',
          position: 'relative',
          maxWidth: 'clamp(200px, 500px, 700px)',
        }}
      >
        {loading && (
          <div
            className="h-100 w-100 d-flex justify-content-center align-items-center"
            style={{
              background: theme === 'dark' ? 'rgba(0,0,0,0.8)' : 'rgba(0,0,0,0.2)',
              position: 'absolute',
              top: '50%',
              right: '50%',
              transform: 'translateY(-50%) translateX(50%)',
              zIndex: 99999,
              borderRadius: '.6rem',
            }}
          >
            <Spinner as="span" animation="border" role="status" aria-hidden="true" className="m-2" variant="light" />
          </div>
        )}
        <h1>Login to {toTitleCase((process.env.REACT_APP_NAME as string) ?? 'tesalate')}</h1>
        <Form onSubmit={formik.handleSubmit}>
          <Form.Floating className="mb-3">
            <Form.Control
              id="username"
              disabled={loading}
              type="username"
              placeholder="Username"
              onChange={formik.handleChange}
              value={formik.values.username}
              className={`bg-transparent  ${theme === 'light' ? 'text-dark' : 'text-white'} `}
            />
            <label htmlFor="username">Username</label>
          </Form.Floating>
          <Form.Floating>
            <Form.Control
              id="password"
              disabled={loading}
              type={passwordVisible ? 'text' : 'password'}
              placeholder="Password"
              onChange={formik.handleChange}
              value={formik.values.password}
              className={`bg-transparent  ${theme === 'light' ? 'text-dark' : 'text-white'} `}
            />
            <label htmlFor="password">Password</label>
            <Button size={'sm'} disabled={loading || !isConnected} type="submit" variant={theme === 'light' ? 'outline-secondary' : 'outline-light'} className="mt-3">
              Submit
            </Button>
            <Button size={'sm'} onClick={() => setPasswordVisible(!passwordVisible)} disabled={loading} variant={theme === 'light' ? 'outline-secondary' : 'outline-light'} className="mt-3 float-end">
              {passwordVisible ? 'Hide my password' : 'Show my password'}
            </Button>
          </Form.Floating>
        </Form>
        {error && (
          <div style={{ color: 'red', fontSize: '.8rem' }} className="w-100 text-center">
            Invalid username or password
          </div>
        )}
        {!isConnected && (
          <div style={{ color: 'red', fontSize: '.8rem' }} className="w-100 text-center">
            You must be connected to the internet to log in
          </div>
        )}
      </Col>
    </Row>
  );
};

export default LoginComp;
