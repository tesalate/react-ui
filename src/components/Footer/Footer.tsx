import React from 'react';
import { Row, Col } from 'react-bootstrap';
// import { useLocation, Link } from 'react-router-dom';
// import { useSelector, shallowEqual } from 'react-redux';
// import { RootState } from '../../redux/reducers';
// import { toTitleCase } from '../../utils/formatFunctions';

const Footer = () => {
  return (
    <Row
      className="text-center"
      style={{
        fontSize: '10px',
        position: 'absolute',
        bottom: 0,
        left: 0,
        width: '102vw',
        // height: '2rem',
      }}
    >
      <Col className="my-auto pe-0">
        © {new Date().getFullYear()} Devin Cunningham - All Rights Reserved - App v{process.env.REACT_APP_VERSION}
      </Col>
    </Row>
  );
};
export default Footer;
