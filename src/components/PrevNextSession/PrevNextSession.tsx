import React from 'react';
import { Button, ButtonGroup } from 'react-bootstrap';
import { useHistory } from 'react-router-dom';

interface IPrevNextSessionProps {
  current: string;
  sessionIds: Array<{ vid: string; _id: string }>;
  sessionType: 'drive' | 'charge';
  theme: string;
}

const PrevNextSession: React.FC<IPrevNextSessionProps> = ({ current, sessionIds, sessionType, theme }) => {
  const history = useHistory();
  if (!current) return null;

  const prev = sessionIds.map((e) => e._id).indexOf(current) - 1;
  const next = sessionIds.map((e) => e._id).indexOf(current) + 1;

  return (
    <span className="float-end">
      <ButtonGroup>
        <Button size="sm" variant={theme} disabled={prev < 0} className="py-0 my-0" onClick={() => history.push(`/${sessionType}-sessions/${sessionIds[prev]._id}`)}>
          Prev.
        </Button>{' '}
        <Button size="sm" variant={theme} disabled={next > sessionIds.length - 1} className="py-0 my-0" onClick={() => history.push(`/${sessionType}-sessions/${sessionIds[next]._id}`)}>
          Next
        </Button>
      </ButtonGroup>
    </span>
  );
};
export default PrevNextSession;
