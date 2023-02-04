import React, { useEffect } from 'react';
import { Row, Col, Alert } from 'react-bootstrap';
import { useSelector, useDispatch } from 'react-redux';
import { actions as uiActions } from '../../ducks/ui/ui.index';
import { RootState } from '../../redux/reducers';
import './NetworkDetector.css';

const NetworkDetector: React.FC = () => {
  const dispatch = useDispatch();
  const { isConnected } = useSelector(({ uiState }: RootState) => ({
    isConnected: uiState.isConnected,
    theme: uiState.theme,
  }));

  useEffect(() => {
    const handleDisconnection = () => {
      dispatch(uiActions.setIsConnected(navigator.onLine));
    };
    window.addEventListener('offline', handleDisconnection);
    window.addEventListener('online', handleDisconnection);
    handleDisconnection();
    // return functions are fired off when components unmount
    return () => {
      window.removeEventListener('offline', handleDisconnection);
      window.addEventListener('online', handleDisconnection);
    };
  }, [dispatch]);

  if (isConnected === false) {
    return (
      <Row className="app-content elementToFadeIn mx-0 mt-1 p-0">
        <Col className="mb-0 align-content-center p-0  align-middle text-align-center" sm={12} md={12} lg={12}>
          <Alert variant={'warning'} className="p-1 m-0 d-flex align-items-center justify-content-center" style={{ fontSize: '.95rem' }}>
            <span role="img" aria-label="warning" className="me-2">
              ⚠️
            </span>
            You are currently offline - data shown may not be up-to-date
          </Alert>
        </Col>
      </Row>
    );
  }
  return null;
};

export default NetworkDetector;
