import React from 'react';
import { Button, ButtonGroup } from 'react-bootstrap';
import { useHistory } from 'react-router-dom';
import { ISessionNavigationProps } from '../SessionNavigation/SessionNavigation';

const PrevNextSession: React.FC<ISessionNavigationProps> = ({ current, sessionIds, sessionType, theme }) => {
  const history = useHistory();
  if (!current) return null;

  const prev = sessionIds.indexOf(current) - 1;
  const next = sessionIds.indexOf(current) + 1;

  return (
    <span className="float-end">
      <ButtonGroup>
        <Button size="sm" variant={theme} disabled={prev < 0} className="py-0 my-0" onClick={() => history.push(`/${sessionType}-sessions/${sessionIds[prev]}`)}>
          Prev.
        </Button>{' '}
        <Button size="sm" variant={theme} disabled={next > sessionIds.length - 1} className="py-0 my-0" onClick={() => history.push(`/${sessionType}-sessions/${sessionIds[next]}`)}>
          Next
        </Button>
      </ButtonGroup>
    </span>
  );
};
export default PrevNextSession;
