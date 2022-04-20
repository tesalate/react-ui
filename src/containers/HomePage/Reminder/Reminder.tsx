import React, { useState } from 'react';
import { Alert, Col } from 'react-bootstrap';
import { IReminder } from '../../../ducks/reminders/reminders.index';
import { isTruthy } from '../../../utils/helper';
import { useMemo } from 'react';

interface RemindersProps {
  reminder        : IReminder
  remindersError? : boolean
  vehicleMiles    : number
}

export default function Reminder(props:RemindersProps){
  const { reminder, vehicleMiles } = props

  const sessionStorageKey = `${reminder._id}-hidden`
  const sessionStorageValue = isTruthy(sessionStorage.getItem(sessionStorageKey) || false)
  const [show, setShow] = useState(!sessionStorageValue);

  
  const dueIn = useMemo(() => (reminder.when - vehicleMiles),[reminder.when, vehicleMiles])
  const overdue = useMemo(() => dueIn <= 0, [dueIn])
  
  if (!show) return null
  return (
    <Col sm={12} md={4} lg={2} xl={2}
    style     = {{
     minWidth : 'clamp(200px, 100%, 260px)'
   }}>
      <Alert key={reminder._id} variant={overdue ? "danger" : "warning"} style={{zIndex:99, borderRadius : '.6rem' }} className="boxShadow p-2 mb-2" dismissible
        onClose={() => {
          setShow(false)
          sessionStorage.setItem(sessionStorageKey, "true")
        }}
      >
      <p className="m-0 p-0 ps-2 pe-4">{`${overdue ?  "Overdue by " : "Due in "} ${(overdue ? dueIn * -1 : dueIn).toFixed(0)} miles: ${reminder.message}`}</p>
      </Alert>
    </Col>
  )
};

