import React from 'react';
import * as Yup from 'yup';
import { useFormik } from 'formik';
import { Redirect, useParams } from 'react-router-dom';
import { Form, Row, Col, InputGroup, Button } from 'react-bootstrap';
import { useDispatch, useSelector } from 'react-redux';
import config from '../../config/config';
import { toTitleCase } from '../../utils/formatFunctions';
import { actions as userActions } from '../../ducks/user/user.index';
import { RootState } from '../../redux/reducers';
import { isEmpty } from 'lodash';

const SignUpComp = () => {
  const dispatch = useDispatch();
  const { token: inviteToken }: { token: string } = useParams();

  const { loading, errorMessage, user } = useSelector(({ uiState, userState }: RootState) => ({
    loading: uiState.loading?.RegisterUser?.length > 0,
    errorMessage: userState.userRegisterError.message,
    user: userState.user,
  }));

  const formik = useFormik({
    initialValues: {
      username: '',
      firstName: '',
      lastName: '',
      email: '',
      password: '',
      confirmPassword: '',
      terms: false,
      inviteToken,
    },
    onSubmit: (values) => {
      console.log(values);
      dispatch(userActions.register(values));
    },
    validateOnBlur: true,
    validationSchema: Yup.object().shape({
      username: Yup.string().min(2, 'Too Short!').max(50, 'Too Long!').required('Required'),
      email: Yup.string().email('Invalid email').required('Required'),
      firstName: Yup.string().min(2, 'Too Short!').max(50, 'Too Long!').required('Required'),
      lastName: Yup.string().min(2, 'Too Short!').max(50, 'Too Long!').required('Required'),
      password: Yup.string().min(8, 'Too Short!').required('Required'),
      confirmPassword: Yup.string().oneOf([Yup.ref('password'), null], 'Passwords must match'),
      terms: Yup.boolean().oneOf([true], 'Must agree to terms'),
    }),
  });

  if (user && !isEmpty(user)) {
    return <Redirect to="/" />;
  }

  return (
    <Row className="d-flex justify-content-center align-items-center" style={{ height: '90vh' }}>
      <Col
        style={{
          borderRadius: '.6rem',
          // border: 'var(--main-border-style)',
          padding: '2rem',
          position: 'relative',
          maxWidth: 'clamp(600px, 700px, 900px)',
        }}
      >
        <h1>Sign Up for {toTitleCase(config.appName)}</h1>
        <hr />
        {errorMessage?.toLowerCase().includes('jwt must be provided') || errorMessage?.toLowerCase().includes('invite') ? (
          <>
            Sorry, {toTitleCase(config.appName)} is invite only right now.
            <br />
            If you were invited and received this error, please request a new invite.
          </>
        ) : (
          <Form noValidate onSubmit={formik.handleSubmit}>
            <Row className="mb-4">
              <Form.Group as={Col} md="12" controlId="validationFormikUsername1">
                <InputGroup hasValidation>
                  <Form.Control
                    type="text"
                    placeholder="Username"
                    aria-describedby="inputGroupPrepend"
                    name="username"
                    value={formik.values.username}
                    onChange={formik.handleChange}
                    isInvalid={(formik.touched.username && !!formik.errors.username) || errorMessage?.toLowerCase().includes('username')}
                    disabled={loading}
                  />
                  <Form.Control.Feedback type="invalid">
                    <small>{formik.errors.username}</small>
                  </Form.Control.Feedback>
                </InputGroup>
                {errorMessage?.toLowerCase().includes('username') && (
                  <div style={{ color: 'red', fontSize: '.8rem' }} className="w-100 text-center">
                    Username Already Taken.
                  </div>
                )}
              </Form.Group>
            </Row>
            <Row className="mb-4">
              <Form.Group as={Col} md="6" controlId="validationFormikFirstName">
                <InputGroup hasValidation>
                  <Form.Control
                    type="6"
                    placeholder="First Name"
                    aria-describedby="inputGroupPrepend"
                    name="firstName"
                    value={formik.values.firstName}
                    onChange={formik.handleChange}
                    isInvalid={formik.touched.firstName && !!formik.errors.firstName}
                    disabled={loading}
                  />
                  <Form.Control.Feedback type="invalid">
                    <small>{formik.errors.firstName}</small>
                  </Form.Control.Feedback>
                </InputGroup>
              </Form.Group>
              <Form.Group as={Col} md="6" controlId="validationFormikLastName">
                <InputGroup hasValidation>
                  <Form.Control
                    type="text"
                    placeholder="Last Name"
                    aria-describedby="inputGroupPrepend"
                    name="lastName"
                    value={formik.values.lastName}
                    onChange={formik.handleChange}
                    isInvalid={formik.touched.lastName && !!formik.errors.lastName}
                    disabled={loading}
                  />
                  <Form.Control.Feedback type="invalid">
                    <small>{formik.errors.lastName}</small>
                  </Form.Control.Feedback>
                </InputGroup>
              </Form.Group>
            </Row>
            <Row className="mb-4">
              <Form.Group as={Col} md="12" controlId="validationFormik103" className="position-relative">
                <Form.Control
                  type="text"
                  placeholder="Email"
                  name="email"
                  value={formik.values.email}
                  onChange={formik.handleChange}
                  isInvalid={(formik.touched.email && !!formik.errors.email) || errorMessage?.toLowerCase().includes('email')}
                  disabled={loading}
                />

                <Form.Control.Feedback type="invalid">
                  <small>{formik.errors.email}</small>
                </Form.Control.Feedback>
                {errorMessage?.toLowerCase().includes('email') && (
                  <div style={{ color: 'red', fontSize: '.8rem' }} className="w-100 text-center">
                    Email Already Taken.
                  </div>
                )}
              </Form.Group>
            </Row>
            <Row className="mb-4">
              <Form.Group as={Col} md="6" controlId="validationFormik104" className="position-relative">
                <Form.Control type="password" placeholder="Password" name="password" value={formik.values.password} onChange={formik.handleChange} isInvalid={formik.touched.password && !!formik.errors.password} disabled={loading} />

                <Form.Control.Feedback type="invalid">
                  <small>{formik.errors.password}</small>
                </Form.Control.Feedback>
              </Form.Group>
              <Form.Group as={Col} md="6" controlId="validationFormik105" className="position-relative">
                <Form.Control
                  type="password"
                  placeholder="Confirm Password"
                  name="confirmPassword"
                  value={formik.values.confirmPassword}
                  onChange={formik.handleChange}
                  isInvalid={formik.touched.confirmPassword && !!formik.errors.confirmPassword}
                  disabled={loading}
                />

                <Form.Control.Feedback type="invalid">
                  <small>{formik.errors.confirmPassword}</small>
                </Form.Control.Feedback>
              </Form.Group>
            </Row>
            <Form.Group className="position-relative mb-4">
              <Form.Check
                required
                name="terms"
                label="Agree to terms and conditions"
                onChange={formik.handleChange}
                isInvalid={formik.touched.terms && !!formik.errors.terms}
                feedback={formik.errors.terms}
                id="validationFormik106"
                disabled={loading}
              />
            </Form.Group>
            <Button type="submit" disabled={loading}>
              Create Account
            </Button>
          </Form>
        )}
      </Col>
    </Row>
  );
};
export default SignUpComp;
