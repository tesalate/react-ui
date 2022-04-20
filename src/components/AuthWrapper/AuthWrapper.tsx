import React, { useRef, useEffect, useMemo } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { useLocation } from 'react-router-dom';
import { RootState } from '../../redux/reducers';
import { actions as userActions } from '../../ducks/user/user.index';

import LoadingComp from '../LoadingComp/LoadingComp';

interface IAuthProps {
  children: React.ReactChild | React.ReactChildren;
}

const AuthWrapper = ({ children }: IAuthProps) => {
  let location = useLocation();
  const dispatch = useDispatch();
  const { loading, loggedIn, user } = useSelector(({ userState, uiState }: RootState) => ({
    user: userState.user,
    loggedIn: userState.loggedIn,
    loading: uiState.loading['FetchUser'].length > 0,
  }));

  const doNotAuth = useMemo(() => ['/verify-email', '/sign-up'], []);

  const calledOnce = useRef(false);

  useEffect(() => {
    // if (!doNotAuth.includes(location.pathname)) {
    if (calledOnce.current) {
      return;
    }

    const showLoading = (!loggedIn && user) || (loggedIn && !user);
    if (showLoading) {
      dispatch(userActions.getUserData(showLoading as boolean));
    } else if (loggedIn && user) {
      dispatch(userActions.getUserData(false));
    }
    calledOnce.current = true;
    // }
  }, [dispatch, loggedIn, user, doNotAuth]);

  if (doNotAuth.includes(location.pathname)) return <>{children}</>;
  return <>{loading ? <LoadingComp body="logging in" /> : children}</>;
};

export default AuthWrapper;
