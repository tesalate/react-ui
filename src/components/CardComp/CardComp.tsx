import React from 'react';
import { Col, Card } from 'react-bootstrap';
import { useSelector } from 'react-redux';
import { RootState } from '../../redux/reducers';
import { v4 as uuidv4 } from 'uuid';

export interface ICardCompProps {
  title      : any;
  body       : any;
  titleStyle : Record<any, any>;
  bodyStyle  : Record<any, any>;
}

const styles = {
  cardStyle: {
    zIndex : 1,
    // minWidth: "200px",
    // maxWidth: "600px",
  },
};

const CardComp = (props: ICardCompProps) => {
  const {
    uiState : { theme },
  } = useSelector(({ uiState }: RootState) => ({
    uiState: {
      theme : uiState.theme,
    },
  }));

  const { title, body, bodyStyle, titleStyle } = props;

  return (
    <Col lg={12} xs={12} sm={12} md={12} style={styles.cardStyle} key={uuidv4()} className="mb-2 p-0">
      <Card bg={`${theme}`} className={`p-3 ${theme === 'dark' ? 'text-white' : ''} boxShadow`}>
        <Card.Title style={{ ...titleStyle }}>{title}</Card.Title>
        <Card.Subtitle style={{ ...bodyStyle }} className="text-muted">
          {body}
        </Card.Subtitle>
      </Card>
    </Col>
  );
};

export default CardComp;
