/* ========= PACKAGE IMPORTS ========= */
import React, { useEffect, Suspense, lazy, useMemo } from 'react';
import { Switch, Route } from 'react-router-dom';
import { Container, Spinner, Button } from 'react-bootstrap';
import { usePageVisibility } from 'react-page-visibility';
import platform from 'platform';
import { useLocation } from 'react-router';
import { ErrorBoundary } from 'react-error-boundary';

/* ========= CSS IMPORTS ========= */
import 'bootstrap/dist/css/bootstrap.min.css';
import './App.css';

/* ========= COMPONENT IMPORTS ========= */
import NavBar from '../../components/NavBar/NavBar';
import Socket from '../../components/Socket/Socket';
import Toasts from '../../components/Toasts/Toasts';
import AuthWrapper from '../../components/AuthWrapper/AuthWrapper';
import { useThemeDetector } from '../../utils/customHooks';

/* ========= REDUX IMPORTS ========= */
import { useSelector, useDispatch } from 'react-redux';
import { RootState } from '../../redux/reducers';
import { actions as uiActions } from '../../ducks/ui/ui.index';
import { actions as userActions } from '../../ducks/user/user.index';
import { selectors as vehicleSelectors } from '../../ducks/vehicles/vehicles.index';
import { useWindowSize } from '../../utils/customHooks';
import NetworkDetector from '../../components/NetworkDetector/NetworkDetector';
import SelectVehicleModal from '../../components/SelectVehicleModal/SelectVehicleModal';
import NewUserModal from '../../components/NewUserModal/NewUserModal';
import ErrorModal from '../../components/ErrorModal/ErrorModal';
import { isEmpty } from 'lodash';
import VerifyModal from '../../components/VerifyModal/VerifyModal';
import Footer from '../../components/Footer/Footer';

/* ======== LAZY IMPORTS ========= */
const HomePage = lazy(() => import('../HomePage/HomePage'));
const ProtectedRoute = lazy(() => import('../../components/ProtectedRoute/ProtectedRoute'));
const LoginComp = lazy(() => import('../../components/LoginComp/LoginComp'));
const LogOutComp = lazy(() => import('../../components/LogOutComp/LogOutComp'));
const Records = lazy(() => import('../Records/Records'));
const ChargeSessions = lazy(() => import('../ChargeSessions/ChargeSessions'));
const DriveSessions = lazy(() => import('../DriveSessions/DriveSessions'));
const MapPage = lazy(() => import('../MapPage/MapPage'));
const Stats = lazy(() => import('../StatsPage/StatsPage'));
const Settings = lazy(() => import('../Settings/Settings'));
const VerifyEmail = lazy(() => import('../VerifyEmail/VerifyEmail'));
// const TeslaAdmin     = lazy(() => import('../Settings/TeslaAdmin/TeslaAdmin'))

function ErrorFallback({ error }: { error: { message: string } }) {
  return (
    <div role="alert">
      <p>Something went wrong:</p>
      <pre>{error.message}</pre>
      <Button onClick={() => window.location.reload()}>Try again</Button>
    </div>
  );
}

const App: React.FC = () => {
  const dispatch = useDispatch();
  const isVisible = usePageVisibility();
  const windowDimensions = useWindowSize();
  const isDarkTheme = useThemeDetector();

  const { uiState, vehicles, loggedIn, teslaLinked, user, sent } = useSelector(({ uiState, userState, vehiclesState, teslaAccountState }: RootState) => ({
    uiState: {
      loading: uiState.loading,
      pageHasFocus: uiState.pageHasFocus,
      browser: uiState.browser,
      theme: uiState.theme,
      isMobile: uiState.isMobile,
      autoTheme: uiState.autoTheme,
    },
    loggedIn: userState.loggedIn,
    vehicles: vehiclesState.vehicles,
    teslaLinked: teslaAccountState.account?.linked,
    user: userState.user,
    sent: Date.now() < userState.sentVerificationEmail,
  }));

  const currentVehicles = useMemo(() => vehicleSelectors.getSelectedVehicles(vehicles), [vehicles]);

  const uiThemeAuto = useMemo(() => uiState.autoTheme, [uiState.autoTheme]);

  useEffect(() => {
    const theme = isDarkTheme ? 'dark' : 'light';
    if (uiThemeAuto) {
      dispatch(uiActions.setTheme(theme));
    }
    dispatch(uiActions.setAutoTheme(uiThemeAuto));
  }, [dispatch, isDarkTheme, uiThemeAuto]);

  useEffect(() => {
    dispatch(uiActions.setWindowDimensions(windowDimensions));
    dispatch(uiActions.setIsMobile(navigator.userAgent));
    dispatch(uiActions.setIsStandAlone('standalone' in window.navigator && (window.navigator as any).standalone));
  }, [dispatch, windowDimensions]);

  useEffect(() => {
    dispatch(uiActions.setBrowser(platform.name ?? ''));
    dispatch(uiActions.setOperatingSystem(platform.os ?? {}));
  }, [dispatch]);

  useEffect(() => {
    if (loggedIn) {
      dispatch(uiActions.getUiFromDBSettings());
    }
  }, [dispatch, loggedIn, navigator.userAgent]);

  /**** effect for setting page focus ****/
  useEffect(() => {
    dispatch(uiActions.setPageFocus(isVisible));
  }, [dispatch, isVisible]);

  const containerStyling = {
    position: 'relative' as 'relative',
    minHeight: '96vh',
    width: '100vw',
    maxWidth: '1920px',
  };

  const wrapperStyling = {
    paddingBottom: '2.5rem' /* Footer height */,
  };

  const path = useLocation().pathname;

  const showVerifyModal = useMemo(() => !user?.isEmailVerified && !!loggedIn && !['logout', 'login', 'verify-email'].some((substring: string) => path.includes(substring)), [loggedIn, user, path]);

  const showErrorModal = useMemo(() => (isEmpty(user) || !user) && !!loggedIn && !['logout', 'login', 'verify-email'].some((substring: string) => path.includes(substring)), [loggedIn, user, path]);

  const showTeslaModal = useMemo(
    () => !showVerifyModal && !showErrorModal && currentVehicles.length === 0 && vehicles?.length === 0 && !!loggedIn && !teslaLinked && !['logout', 'settings', 'verify-email'].some((substring: string) => path.includes(substring)),
    [currentVehicles, vehicles, loggedIn, teslaLinked, path, showErrorModal, showVerifyModal]
  );

  const showSelectVehicleModal = useMemo(
    () => !showVerifyModal && !showErrorModal && currentVehicles?.length === 0 && vehicles?.length > 0 && !!loggedIn && !!teslaLinked && !['logout', 'settings', 'verify-email'].some((substring: string) => path.includes(substring)),
    [currentVehicles, vehicles, loggedIn, teslaLinked, path, showErrorModal, showVerifyModal]
  );

  return (
    <AuthWrapper>
      <ErrorBoundary
        FallbackComponent={ErrorFallback}
        onReset={() => {
          // reset the state of your app so the error doesn't happen again
        }}
      >
        <Container fluid style={{ ...containerStyling }} className="px-xs-1 px-sm-2 px-md-3 px-lg-4">
          <div style={{ ...wrapperStyling }}>
            <NetworkDetector />
            <Toasts />
            <Socket />
            {showVerifyModal && <VerifyModal theme={uiState.theme} loading={uiState.loading.SendingVerificationEmail.length > 0} requestVerificationEmail={userActions.requestVerificationEmail} sent={sent} />}
            {showErrorModal && <ErrorModal theme={uiState.theme} />}
            {showTeslaModal && <NewUserModal theme={uiState.theme} user={user} />}
            {showSelectVehicleModal && <SelectVehicleModal theme={uiState.theme} />}
            <NavBar />
            <Suspense
              fallback={
                <div className="d-flex justify-content-center align-items-center" style={{ height: '90vh' }}>
                  <Spinner as="span" animation="border" role="status" aria-hidden="true" />
                </div>
              }
            >
              <Switch>
                <Route exact path="/login">
                  <LoginComp />
                </Route>
                <Route exact path="/logout">
                  <LogOutComp />
                </Route>
                <Route path="/verify-email">
                  <VerifyEmail />
                </Route>
                <ProtectedRoute exact path="/drive-sessions/:id?">
                  <DriveSessions />
                </ProtectedRoute>
                <ProtectedRoute exact path="/charge-sessions/:id?">
                  <ChargeSessions />
                </ProtectedRoute>
                <ProtectedRoute exact path="/records">
                  <Records />
                </ProtectedRoute>
                <ProtectedRoute exact path="/stats">
                  <Stats />
                </ProtectedRoute>
                <ProtectedRoute exact path="/map">
                  <MapPage />
                </ProtectedRoute>
                {/* <ProtectedRoute exact path='/tesla-admin'>
              <TeslaAdmin />
            </ProtectedRoute> */}
                <ProtectedRoute exact path="/settings/:tab?">
                  <Settings />
                </ProtectedRoute>
                <ProtectedRoute exact path="/">
                  <HomePage />
                </ProtectedRoute>
              </Switch>
            </Suspense>
          </div>
          <Footer />
        </Container>
      </ErrorBoundary>
    </AuthWrapper>
  );
};

export default App;
