import React from 'react';
import { Col } from 'react-bootstrap';
import { useSelector } from 'react-redux';
import { RootState } from '../../redux/reducers';
import { v4 as uuidv4 } from 'uuid';

export interface IFlatInfoCompProps {
  text      : any;
  label       : any;
  textStyle : Record<any, any>;
  labelStyle  : Record<any, any>;
}

const styles = {
  cardStyle: {
    zIndex : 1,
    // minWidth: "200px",
    // maxWidth: "600px",
  },
};

const FlatInfoComp = (props: IFlatInfoCompProps) => {
  const {
    uiState : { theme },
  } = useSelector(({ uiState }: RootState) => ({
    uiState: {
      theme : uiState.theme,
    },
  }));

  const { text, label, labelStyle, textStyle } = props;

  return (
    <Col lg={12} xs={12} sm={12} md={12} style={styles.cardStyle} key={uuidv4()} className="my-0 p-0">
      <div className={`p-0 ${theme === 'dark' ? 'text-white' : ''}`}>
        <div style={{ ...textStyle }} className="mb-0">{text}</div>
        <div style={{ ...labelStyle }} className="text-muted mb-0">
          {label}
        </div>
      </div>
    </Col>
  );
};

export default FlatInfoComp;
