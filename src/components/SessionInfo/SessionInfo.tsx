import React, { } from 'react';
import { convertTitle } from '../../utils/convert';
import ThemedSkeleton from '../ThemedSkeleton/ThemedSkeleton';
import { Col, Row } from 'react-bootstrap';
import FlatInfoComp from '../FlatInfoComp/FlatInfoComp';

interface ISessionInfoProps {
  sessionData   : Record<any, any>
}



const SessionInfo: React.FC<ISessionInfoProps> = ({ sessionData={} }) => {
  return (
    <Row>
    {
      Object.keys(sessionData).map((item: any, idx: number) => {
        const cardData = {
          text: sessionData[item] ? (
            <>
              <span>{convertTitle(sessionData[item])}</span>{sessionData[item].unit}{' '}
            </>
          ) : ( <ThemedSkeleton /> ),
          label       : sessionData[item] ? `${sessionData[item].displayName}` : <ThemedSkeleton />,
          labelStyle  : { fontSize: '.86rem', lineHeight: "20px"},
          textStyle : { lineHeight: "20px", fontSize: "1.01rem"},
        };
        return (
          <Col xs={6} sm={5} md={3} lg={2} xl={1} key={`${item}-col`} className="my-2" style={{ border: (idx !== Object.keys(sessionData).length -1) ? "" : "" }}>
            <FlatInfoComp {...cardData} key={item} />
          </Col>
        );
      })
    }
    </Row>
  );
};

export default SessionInfo;
