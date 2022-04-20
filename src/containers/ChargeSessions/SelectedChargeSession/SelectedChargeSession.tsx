import React, { useMemo } from 'react';
import { Row, Col } from 'react-bootstrap';
import LineGraph from '../../../components/LineGraph/LineGraph';
import SessionInfo from '../../../components/SessionInfo/SessionInfo';
import SessionError from '../../../components/SessionError/SessionError';

interface SelectedSessionData {
  id          : string
  data        : Record<any, any>
  theme       : string | undefined
  errors      : Array<string>
  isConnected : boolean | null
}

const SelectedChargeSession: React.FC<SelectedSessionData> = ({ id, data={}, /*action, loading*/ theme, errors, isConnected }) => {
  const { sessionData=Array(12).fill(false), graphData={}, } = data;

  graphData.labels = useMemo(() => (
    graphData.labels ? graphData.labels.map((label:number) => label - graphData.labels[0]) : []
  ),[graphData]) 

  const themedColor = useMemo(() => theme === 'dark' ?  ['102, 255, 102', null ,'180,180,180'] : [ '0, 180, 0', null ,'106,106,106'],[theme])

  const colors = useMemo( () => [
    // green 
    {backgroundColor : `rgba(${themedColor[0]},.4)`, borderColor : `rgba(${themedColor[0]},.4)`, pointBorderColor : `rgba(${themedColor[0]},.4)`, pointHoverBackgroundColor : `rgba(${themedColor[1]},.4)`, pointHoverBorderColor : "rgba(240,240,240,1)",},
    // gray
    {backgroundColor: `rgba(${themedColor[2]},0)`, borderColor: `rgba(${themedColor[2]},5)`, pointBorderColor: `rgba(${themedColor[2]},1)`, pointHoverBackgroundColor:`rgba(${themedColor[2]},1)`, pointHoverBorderColor:"rgba(240,240,240,1)",},
    // blue
    {backgroundColor: "rgba(102, 194, 255,.4)", borderColor: "rgba(102, 194, 255,1)", pointBorderColor: "rgba(102, 194, 255,1)", pointHoverBackgroundColor:"rgba(102, 194, 255,1)", pointHoverBorderColor:"rgba(220,220,220,1)",},

  ], [themedColor])

  if (errors.includes(id)) return <SessionError isConnected={isConnected} />

  return (
    <>
      <Row className="my-2 mx-0">
        <Col sm={12} style={{border: 'var(--main-border-style)', width: '100%'}} className="rounded py-2">
          <SessionInfo sessionData={sessionData} />
        </Col>
      </Row>
      <Row className="mt-1">
        <Col md={12} lg={12}>
          <LineGraph
            data  = {graphData}
            style = {{
              height       : 'calc(var(--vh, 1vh) * 70)',
              width        : '100%',
              border       : 'var(--main-border-style)',
              borderRadius : '.6rem',
              }}
            type   = "charge"
            colors = {colors}
          />
        </Col>
      </Row>
    </>
  );
};
export default SelectedChargeSession;
