import React from 'react';
import { useFormik } from 'formik';
import { FloatingLabel, Row, Col, Form, FormControl, Button, Tabs, Tab } from 'react-bootstrap';
import { useDispatch } from 'react-redux';
import { actions as userActions } from '../../ducks/user/user.index';
import { State as UIState } from '../../ducks/ui/ui.index';

interface ITeslaFormProps {
  email?: string;
  theme: UIState['theme'];
}

export const TeslaLoginForm: React.FC<ITeslaFormProps> = ({ email, theme }) => {
  const dispatch = useDispatch();

  const UsernamePasswordForm: React.FC<{}> = () => {
    const formik = useFormik({
      initialValues: {
        email: email ?? '',
        password: '',
      },
      onSubmit: (values) => {
        const { email, password } = values;
        dispatch(userActions.loginTesla({ username: email, password }));
      },
    });
    return (
      <>
        <Col>
          <p className="text-danger">
            <small>
              Logging in with username/password is currently disabled.
              <br />
              Please obtain a refresh token and login with that.
            </small>
          </p>
          <Form onSubmit={formik.handleSubmit} style={{ maxWidth: '300px' }}>
            <FloatingLabel controlId="email" label="Email address" className="mb-3">
              <FormControl disabled type="email" placeholder="name@example.com" onChange={formik.handleChange} value={formik.values.email} className={`bg-transparent  ${theme === 'light' ? 'text-dark' : 'text-white'} `} />
            </FloatingLabel>
            <FloatingLabel controlId="password" label="Password">
              <FormControl disabled type="password" placeholder="Password" onChange={formik.handleChange} value={formik.values.password} className={`bg-transparent  ${theme === 'light' ? 'text-dark' : 'text-white'} `} />
            </FloatingLabel>
            <Button disabled type="submit" size={'sm'} variant={theme === 'light' ? 'outline-dark' : 'outline-light'} className="my-2">
              Submit
            </Button>
            <br />
          </Form>
        </Col>
        <p className="text-muted">
          <small>Once {process.env.REACT_APP_NAME} obtains the token using your username and password, your credentials are discarded and the token is used to harvest data.</small>
        </p>
      </>
    );
  };

  const RefreshTokenForm: React.FC<{}> = () => {
    const formik = useFormik({
      initialValues: {
        refreshToken: '',
      },
      onSubmit: (values) => {
        const { refreshToken } = values;
        dispatch(userActions.loginTesla({ refreshToken }));
      },
    });
    return (
      <>
        <Col>
          <p>
            <small>Provide your own Tesla API refresh token</small>
          </p>
          <Form onSubmit={formik.handleSubmit}>
            <FloatingLabel controlId="refreshToken" label="Refresh Token" className="mb-3">
              <FormControl type="refreshToken" placeholder="name@example.com" onChange={formik.handleChange} value={formik.values.refreshToken} className={`bg-transparent  ${theme === 'light' ? 'text-dark' : 'text-white'} `} />
            </FloatingLabel>
            <Button type="submit" size={'sm'} variant={theme === 'light' ? 'outline-dark' : 'outline-light'} className="my-2">
              Submit
            </Button>
            <br />
          </Form>
        </Col>
      </>
    );
  };

  return (
    <>
      <Row>
        <Col>
          <Row>
            <Col>
              <p style={{ fontWeight: 'bold' }}>Log in to your Tesla account</p>
            </Col>
          </Row>
          <Row>
            <Tabs defaultActiveKey="refreshToken" id="uncontrolled-tab-example" className="mb-3">
              <Tab eventKey="username-password" title="Username and Password">
                <UsernamePasswordForm />
              </Tab>
              <Tab eventKey="refreshToken" title="Refresh Token">
                <RefreshTokenForm />
              </Tab>
            </Tabs>
          </Row>
        </Col>
      </Row>
    </>
  );
};
