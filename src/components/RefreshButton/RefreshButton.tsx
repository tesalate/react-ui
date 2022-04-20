import React from 'react'
import { Button } from 'react-bootstrap'
import { useDispatch } from 'react-redux';

interface RefreshButtonProps {
  action  : Record<any, any>
  loading : boolean
}

export const RefreshButton: React.FC<RefreshButtonProps> = ({ action: { requestById, currentVehicles, id }, loading }) => {
  const dispatch = useDispatch();
  return (
    <Button variant={`outline-primary`} disabled={loading} onClick={() => dispatch(requestById(currentVehicles, id)) }>{loading ? <> </> : "Refresh session"}</Button>
  )
}