/* ========= PACKAGE IMPORTS ========= */
import React, { useEffect, Suspense, lazy, useMemo } from 'react';
import { Switch, Route } from 'react-router-dom';
import { Container, Spinner, Button, Row, Col } from 'react-bootstrap';
import { usePageVisibility } from 'react-page-visibility';
import platform from 'platform';
import { ErrorBoundary } from 'react-error-boundary';

/* ========= CSS IMPORTS ========= */
import 'bootstrap/dist/css/bootstrap.min.css';
import './App.css';

/* ========= COMPONENT IMPORTS ========= */
import AuthWrapper from '../../components/AuthWrapper/AuthWrapper';
import { useThemeDetector } from '../../utils/customHooks';

/* ========= REDUX IMPORTS ========= */
import { useSelector, useDispatch } from 'react-redux';
import { RootState } from '../../redux/reducers';
import { actions as uiActions } from '../../ducks/ui/ui.index';
import { useWindowSize } from '../../utils/customHooks';
import NetworkDetector from '../../components/NetworkDetector/NetworkDetector';
import Footer from '../../components/Footer/Footer';
import NavBar from '../../components/NavBar/NavBar';
import config from '../../config/config';
import { toTitleCase } from '../../utils/formatFunctions';
import SignUpComp from '../../components/SignUpComp/SignUp';

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
const SendVerificationEmail = lazy(() => import('../SendVerificationEmail/SendVerificationEmail'));

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

  const { uiState } = useSelector(({ uiState }: RootState) => ({
    uiState: {
      loading: uiState.loading,
      pageHasFocus: uiState.pageHasFocus,
      browser: uiState.browser,
      theme: uiState.theme,
      isMobile: uiState.isMobile,
      autoTheme: uiState.autoTheme,
    },
  }));

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
            <NavBar />

            <Suspense
              fallback={
                <Row className="mx-auto text-center" style={{ height: '80vh' }}>
                  <Col className="my-auto">
                    <Spinner as="img" animation="border" role="status" aria-hidden="true" size="sm" className="mx-2" />
                    <br />
                    <b className="mb-2">{toTitleCase(config.appName)}</b>
                  </Col>
                </Row>
              }
            >
              <Switch>
                <Route path="/sign-up/:token?">
                  <SignUpComp />
                </Route>
                <Route exact path="/login">
                  <LoginComp />
                </Route>
                <Route exact path="/logout">
                  <LogOutComp />
                </Route>
                <Route path="/verify-email">
                  <VerifyEmail />
                </Route>
                <Route exact path="/password-reset">
                  <>RESET PASSWORD</>
                </Route>
                <ProtectedRoute exact path="/send-verification-email">
                  <SendVerificationEmail />
                </ProtectedRoute>
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
