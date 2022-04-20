import React from 'react';
import { Button, Spinner } from 'react-bootstrap';
import caution from '../../assets/caution.png';

interface MapPointInfoProps {
  mapPointsError : boolean
  loading        : boolean
  theme          : string | undefined
  data           : Array<any>
  children?      : React.ReactNode
}

const MapPointInfo = ({children, ...rest }:MapPointInfoProps) => {
  const {mapPointsError, loading, theme, data } = rest
  let returnDiv = null
  if (mapPointsError) returnDiv = <><img src={caution} style={{maxHeight:'20px', filter: theme === "dark" ? "invert(1)" : ""}} alt="loading throbber"/>  error loading data</>
  else if (loading) returnDiv =  <><Spinner
      as="span"
      animation="border"
      size="sm"
      role="status"
      aria-hidden="true"
      className="me-2"
    />loading data</>
  else  returnDiv =  <>{data.length} points mapped</>
  return (
    <Button size="sm" variant={theme === 'dark' ? "outline-light" : "light"} disabled style={{minWidth: '200px', minHeight:'42px'}} className="w-100">
      {returnDiv}
    </Button>
  )
};

export default MapPointInfo;
