import React from 'react';
import { Spinner } from 'react-bootstrap';

export const SuspenseComp = () => {
  return (
    <div className="d-flex justify-content-center align-items-center" style={{ height: '90vh', width: '100wh', backgroundColor: 'rgba(0,0,0,0)' }}>
      <Spinner as="span" animation="border" role="status" aria-hidden="true" className="m-2" size="sm" />
      <small>
        <b>{process.env.REACT_APP_NAME}</b>
      </small>
    </div>
  );
};
