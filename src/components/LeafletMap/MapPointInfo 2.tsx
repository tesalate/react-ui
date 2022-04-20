import React from 'react';
import { Button } from 'react-bootstrap';
import caution from '../../assets/caution.png';
import throbber from '../../assets/throbber.gif';

interface MapPointInfoProps {
  mapPointsError : boolean
  loading        : boolean
  theme          : 'light' | 'dark' | string
  data           : Array<any>
  children?      : React.ReactNode
}

const MapPointInfo = ({children, ...rest }:MapPointInfoProps) => {
  const {mapPointsError, loading, theme, data } = rest
  let returnDiv = null
  if (mapPointsError) returnDiv = <><img src={caution} style={{maxHeight:'20px', filter: theme === "dark" ? "invert(1)" : ""}} alt="loading throbber"/>  error loading data</>
  else if (loading) returnDiv =  <><img src={throbber} style={{maxHeight:'20px', filter: theme === "dark" ? "" : "invert(1)"}} alt="loading throbber"/>loading data</>
  else  returnDiv =  <>{data.length} points mapped</>
  return (
    <Button size="sm" variant={theme === 'dark' ? "outline-light" : "light"} disabled style={{minWidth: '160px', minHeight:'42px'}}>
      {returnDiv}
    </Button>
  )
};

export default MapPointInfo;
