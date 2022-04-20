import React from 'react';
import { Row, Col, Button, Form, FloatingLabel, FormControl } from 'react-bootstrap';
import { useFormik } from 'formik';
import { toTitleCase } from '../../../utils/formatFunctions';
import { State as UIState } from '../../../ducks/ui/ui.index';

const ChangeForm: React.FC<{ type: string; value: string; theme: string | undefined }> = ({ type, value, theme }) => {
  const formik = useFormik({
    initialValues: {
      [type]: value,
    },
    onSubmit: (values: any) => {
      console.log(values[type]);
    },
  });

  return (
    <Form onSubmit={formik.handleSubmit} style={{ maxWidth: '300px' }}>
      <FloatingLabel controlId={type} label={type} className="mb-2">
        <FormControl size="sm" type="text" placeholder={value} onChange={formik.handleChange} value={formik.values[type]} className={`bg-transparent  ${theme === 'light' ? 'text-dark' : 'text-white'} `} />
      </FloatingLabel>
      <Button type="submit" disabled size={'sm'} variant={theme === 'light' ? 'outline-dark' : 'outline-secondary'} className="mt-2">
        Update {toTitleCase(type)}
      </Button>
    </Form>
  );
};

const Account: React.FC<{ user: any; theme: UIState['theme'] }> = ({ user, theme }) => {
  return (
    <>
      <Row className="mb-5">
        <Col>
          <h4>Change Username</h4>
          <hr />
          <ChangeForm type={'username'} value={user.displayName} theme={theme ?? undefined} />
        </Col>
      </Row>
      <Row className="mb-5">
        <Col>
          <h4>Change Email</h4>
          <hr />
          <ChangeForm type={'email'} value={user.email} theme={theme ?? undefined} />
        </Col>
      </Row>
      <Row className="mb-5">
        <Col>
          <h4 className="text-danger">Danger Zone</h4>
          <hr />
          <p className="text-danger">Deleting your account will delete all data associated with your account. This cannot be undone.</p>
          <Button disabled size={'sm'} variant={'outline-danger'}>
            Delete Account
          </Button>
        </Col>
      </Row>
    </>
  );
};

export default Account;
