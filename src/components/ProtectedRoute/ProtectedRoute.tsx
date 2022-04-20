import React from 'react';
import { Route, Redirect } from 'react-router-dom';
import { useSelector } from 'react-redux';
import { RootState } from '../../redux/reducers';

const ProtectedRoute = ({children, ...rest }:any) => {
  const { loggedIn } = useSelector(({ userState }: RootState) => ({
    loggedIn: userState.loggedIn
  }));

  return (
    <Route
      {...rest}
      render={({ location }) =>
      loggedIn ? (
          children
        ) : (
          <Redirect
            to={{
              pathname: "/login",
              state: { from: location }
            }}
          />
        )
      }
    />
  );
}
 
export default ProtectedRoute;