import React, { lazy, useMemo, useEffect } from 'react';
import { Route, Redirect, useLocation } from 'react-router-dom';
import { useSelector, useDispatch } from 'react-redux';
import { isEmpty } from 'lodash';
import { RootState } from '../../redux/reducers';
import { actions as userActions } from '../../ducks/user/user.index';
import { selectors as vehicleSelectors } from '../../ducks/vehicles/vehicles.index';
import { actions as uiActions } from '../../ducks/ui/ui.index';

const Toasts = lazy(() => import('../Toasts/Toasts'));
// const Socket = lazy(() => import('../Socket/Socket'));
const SelectVehicleModal = lazy(() => import('../SelectVehicleModal/SelectVehicleModal'));
const VerifyModal = lazy(() => import('../VerifyModal/VerifyModal'));
const ErrorModal = lazy(() => import('../ErrorModal/ErrorModal'));
const NewUserModal = lazy(() => import('../NewUserModal/NewUserModal'));

const ProtectedRoute = ({ children, ...rest }: any) => {
  const dispatch = useDispatch();
  const path = useLocation().pathname;
  const { loggedIn, teslaLinked, vehicles, loading, theme, user, sent } = useSelector(({ userState, uiState, vehiclesState, teslaAccountState }: RootState) => ({
    loggedIn: userState.loggedIn,
    theme: uiState.theme,
    loading: uiState.loading,
    vehicles: vehiclesState.vehicles,
    teslaLinked: teslaAccountState.account?.linked,
    user: userState.user,
    sent: userState.sentVerificationEmail !== null && Date.now() < userState.sentVerificationEmail,
  }));

  useEffect(() => {
    if (loggedIn) {
      dispatch(uiActions.getUiFromDBSettings());
    }
  }, [dispatch, loggedIn]);

  const currentVehicles = useMemo(() => vehicleSelectors.getSelectedVehicles(vehicles), [vehicles]);

  const showVerifyModal = useMemo(() => !user?.isEmailVerified && !['send-verification-email'].some((substring: string) => path.includes(substring)), [user, path]);

  const showErrorModal = useMemo(() => isEmpty(user) || !user, [user]);

  const showTeslaModal = useMemo(
    () => !showVerifyModal && !showErrorModal && currentVehicles.length === 0 && vehicles?.length === 0 && !teslaLinked && !['settings', 'send-verification-email'].some((substring: string) => path.includes(substring)),
    [currentVehicles, vehicles, teslaLinked, path, showErrorModal, showVerifyModal]
  );

  const showSelectVehicleModal = useMemo(
    () => !showVerifyModal && !showErrorModal && currentVehicles?.length === 0 && vehicles?.length > 0 && !!teslaLinked && !['settings', 'send-verification-email'].some((substring: string) => path.includes(substring)),
    [currentVehicles, vehicles, teslaLinked, path, showErrorModal, showVerifyModal]
  );

  return (
    <Route
      {...rest}
      render={({ location }) =>
        loggedIn ? (
          <>
            <Toasts />
            {/* <Socket /> */}
            <div style={{ zIndex: 999999999 }}>
              {showSelectVehicleModal && <SelectVehicleModal theme={theme} />}
              {showVerifyModal && <VerifyModal theme={theme} loading={loading.SendingVerificationEmail.length > 0} requestVerificationEmail={userActions.requestVerificationEmail} sent={sent} />}
              {showErrorModal && <ErrorModal theme={theme} />}
              {showTeslaModal && <NewUserModal theme={theme} user={user} />}
            </div>
            {children}
          </>
        ) : (
          <Redirect
            to={{
              pathname: '/login',
              state: { from: location },
            }}
          />
        )
      }
    />
  );
};

export default ProtectedRoute;
