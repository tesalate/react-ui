import React, { } from 'react'
import { Row, Col } from 'react-bootstrap';

interface ISessionErrorProps {
  isConnected? : boolean | null
}

const SessionError: React.FC<ISessionErrorProps> = ({ isConnected }) => {
  return (
    <Row className="d-flex justify-content-center text-center">
      <Col sm={12} className="my-auto">
        <h2 className="mb-0 text-muted"><span role="img" aria-label="warning" className="me-2">⚠️</span>Oops!</h2>
        <small className="text-muted">
          {
            isConnected
            ? "There was an error grabbing that session..."
            : "Looks like you are offline, please reconnect and try again"
          }
        </small>
      </Col> 
    </Row>
  );
}

export default SessionError;