import React, {   } from "react";
import { Col, Row } from "react-bootstrap";
import Breadcrumbs from "../Breadcrumbs/Breadcrumbs";
import PrevNextSession from "../PrevNextSession/PrevNextSession";

interface ISessionNavigationProps {
  current     : string
  sessionIds  : Array<{_id:string, vid:string}>
  sessionType : 'drive' | 'charge'
  theme       : string
}

const SessionNavigation: React.FC<ISessionNavigationProps> = ({ current, sessionIds, sessionType, theme }) => {
  return (
    <Row className="mb-2 flex-nowrap" style={{minHeight:"30px"}}>
      <Col xs={8} sm={8} md={8} lg={6} className="d-flex align-items-center" style={{whiteSpace: "nowrap"}}><Breadcrumbs /> </Col>
      <Col xs={4} sm={4} md={4} lg={6}><PrevNextSession current={current} sessionIds={sessionIds} sessionType={sessionType} theme={theme}/></Col>
    </Row>     
  );
};
export default SessionNavigation;