import React from 'react'
import { Row, Col, Button, Form, FloatingLabel, FormControl } from 'react-bootstrap';
import { useFormik } from 'formik';

const ChangePasswordForm: React.FC<{theme: 'dark' | 'light'}> = ({ theme }) => {
  const formik = useFormik({
    initialValues: {
      currentPass        : '',
      newPassword        : '',
      newPasswordConfirm : '',
    },
    onSubmit: (values: { currentPass: string; newPassword: string; newPasswordConfirm: string; }) => {
      const { currentPass, newPassword, newPasswordConfirm } = values;
      console.log(currentPass, newPassword, newPasswordConfirm);
    },
  });

  return (
    <Form onSubmit={formik.handleSubmit} style={{ maxWidth: '300px' }}>
      <FloatingLabel
        controlId = "currentPass"
        label     = "Current Password"
        className = "mb-2"
      >
        <FormControl
          size        = "sm"
          type        = "password"
          placeholder = "currentPass"
          onChange    = {formik.handleChange}
          value       = {formik.values.currentPass}
          className   = {`bg-transparent  ${theme === "light" ? "text-dark" : "text-white"} `} />
      </FloatingLabel>
      <FloatingLabel controlId="newPassword" label="New Password" className="mb-2">
        <FormControl
          size        = "sm"
          type        = "password"
          placeholder = "newPassword"
          onChange    = {formik.handleChange}
          value       = {formik.values.newPassword}
          className   = {`bg-transparent  ${theme === "light" ? "text-dark" : "text-white"} `} />
      </FloatingLabel>
      <FloatingLabel controlId="newPasswordConfirm" label="Confirm New Password" className="mb-2">
        <FormControl
          size        = "sm"
          type        = "password"
          placeholder = "newPasswordConfirm"
          onChange    = {formik.handleChange}
          value       = {formik.values.newPasswordConfirm}
          className   = {`bg-transparent  ${theme === "light" ? "text-dark" : "text-white"} `} />
      </FloatingLabel>
      <Button type="submit" disabled size={'sm'} variant={theme === 'light' ? "outline-dark" : "outline-secondary"} className="mt-2">Update Password</Button>
    </Form>
  );
};


const AccountSecurity = (theme: any) => {
  return (
    <>
      <Row className="mb-5">
        <Col>
          <h4>Change Password</h4>
          <hr />
          <ChangePasswordForm theme={theme} />
        </Col>
      </Row>
    </>
  );
}
export default AccountSecurity