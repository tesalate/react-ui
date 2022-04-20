import React, { useEffect, lazy } from 'react';
import { useLocation } from 'react-router-dom';
import { useDispatch } from 'react-redux';
import { actions as userActions } from '../../ducks/user/user.index';
const LoadingComp = lazy(() => import('../LoadingComp/LoadingComp')) 

const LogOutComp = () => {
  const dispatch = useDispatch();
  const location = useLocation();
  const query    = new URLSearchParams(location.search)
  const redirect = query.get('redirect') ?? "/login"

  useEffect(() => {
    dispatch(userActions.logOutUser(redirect))
  }, [dispatch, redirect]);

  return (
    <LoadingComp body="logging out" />
  );
};

export default LogOutComp;
