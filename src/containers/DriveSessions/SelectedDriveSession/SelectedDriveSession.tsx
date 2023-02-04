import React, { useMemo } from 'react';
import { Row, Col /*Button, ButtonGroup */ } from 'react-bootstrap';
import LineGraph from '../../../components/LineGraph/LineGraph';
import LeafletMap from '../../../components/LeafletMap/LeafletMap';
import SessionInfo from '../../../components/SessionInfo/SessionInfo';
import SessionError from '../../../components/SessionError/SessionError';
import { State as UIState } from '../../../ducks/ui/ui.index';

interface SelectedSessionData {
  id: string;
  data: Record<any, any>;
  theme: UIState['theme'];
  loading: boolean;
  error: boolean;
  errors: Array<string>;
  isConnected: boolean | null;
}

const filterData = (data: Array<any>) => {
  const val = data.length;
  if (val <= 250) {
    return data;
  } else if (val > 250 && val <= 500) {
    return data.filter((_: any, i: number) => {
      return i % 2 === 0;
    });
  } else if (val > 500 && val <= 1000) {
    return data.filter((_: any, i: number) => {
      return i % 4 === 0;
    });
  } else if (val > 1000 && val <= 2000) {
    return data.filter((_: any, i: number) => {
      return i % 8 === 0;
    });
  } else {
    return data.filter((_: any, i: number) => {
      return i % 16 === 0;
    });
  }
};

const SelectedDriveSession: React.FC<SelectedSessionData> = ({ id, data = {}, theme = 'light', loading = true, error, errors, isConnected /*action*/ }) => {
  // const history = useHistory();
  let { sessionData = Array(12).fill(false), graphData = {}, mapData = [] } = data;

  graphData.labels = useMemo(() => (graphData.labels ? graphData.labels.map((label: number) => label - graphData.labels[0]) : []), [graphData]);

  const mapProps = useMemo(
    () => ({
      style: {
        height: '60vh',
        width: '100%',
        padding: 0,
        margin: 0,
        border: 'var(--main-border-style)',
        borderRadius: '.6rem',
        overflow: 'hidden',
      },
      data: filterData(mapData),
      loading: loading,
      theme: theme,
      geoJson: false,
      error: error,
      _id: data._id,
    }),
    [mapData, loading, theme, error, data._id]
  );

  const themedColor = useMemo(() => (theme === 'dark' ? ['102, 255, 102', null, '180,180,180'] : ['0, 180, 0', null, '106,106,106']), [theme]);

  const colors = useMemo(
    () => [
      // blue
      {
        backgroundColor: 'rgba(102, 194, 255,.4)',
        borderColor: 'rgba(102, 194, 255,1)',
        pointBorderColor: 'rgba(102, 194, 255,1)',
        pointHoverBackgroundColor: 'rgba(102, 194, 255,1)',
        pointHoverBorderColor: 'rgba(220,220,220,1)',
      },
      // green
      {
        backgroundColor: `rgba(${themedColor[0]},.4)`,
        borderColor: `rgba(${themedColor[0]},.4)`,
        pointBorderColor: `rgba(${themedColor[0]},.4)`,
        pointHoverBackgroundColor: `rgba(${themedColor[1]},.4)`,
        pointHoverBorderColor: 'rgba(240,240,240,1)',
      },
    ],
    [themedColor]
  );

  if (errors.includes(id)) return <SessionError isConnected={isConnected} />;

  return (
    <>
      <Row className="my-2 mx-0">
        <Col sm={12} style={{ border: 'var(--main-border-style)', width: '100%' }} className="rounded py-2">
          <SessionInfo sessionData={sessionData} />
        </Col>
      </Row>
      <Row className="mt-1">
        <Col sm={12} lg={4} className="pe-sm-0 pe-md-3 pe-lg-0 pb-2">
          <LeafletMap {...mapProps} />
        </Col>
        <Col sm={12} lg={8}>
          <LineGraph
            data={graphData}
            style={{
              height: '60vh',
              width: '100%',
              border: 'var(--main-border-style)',
              overflow: 'hidden',
              borderRadius: '.6rem',
            }}
            colors={colors}
            type="drive"
          />
        </Col>
      </Row>
    </>
  );
};
export default SelectedDriveSession;
