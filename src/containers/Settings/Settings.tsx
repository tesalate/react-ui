import React, { useMemo, useEffect, lazy } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { actions as uiActions, State as UIState } from '../../ducks/ui/ui.index';
import { actions as teslaAccountActions } from '../../ducks/teslaAccount/teslaAccount.index';
// import { actions as userActions } from '../../ducks/user/user.index';
import { actions as vehiclesActions } from '../../ducks/vehicles/vehicles.index';
import { RootState } from '../../redux/reducers';
import { Row, Col, ListGroup, Tab } from 'react-bootstrap';
import { useParams, Link, useHistory } from 'react-router-dom';

const ThemePreferences = lazy(() => import('./ThemePreferences/ThemePreferences'));
const TeslaAdmin = lazy(() => import('./TeslaAdmin/TeslaAdmin'));
const Profile = lazy(() => import('./Profile/Profile'));
const Account = lazy(() => import('./Account/Account'));
const AccountSecurity = lazy(() => import('./AccountSecurity/AccountSecurity'));
const Vehicles = lazy(() => import('./Vehicles/Vehicles'));

interface RouteParams {
  tab: string;
}

const Settings: React.FC = () => {
  const dispatch = useDispatch();
  let { tab }: RouteParams = useParams();
  let history = useHistory();

  useEffect(() => {
    if (!tab) history.push('/settings/profile');
  }, [tab, history]);

  const { autoTheme, theme, user, teslaAccount, loading, vehicles } = useSelector(({ uiState, userState, teslaAccountState, vehiclesState }: RootState) => ({
    theme: uiState.theme,
    autoTheme: uiState.autoTheme,
    user: userState.user,
    vehicles: vehiclesState.vehicles,
    teslaAccount: teslaAccountState.account,
    loading: uiState.loading,
  }));

  useEffect(() => {
    dispatch(teslaAccountActions.requestTeslaAccount());
  }, []);

  const themeColor = useMemo(() => (theme === 'dark' ? 'dark' : 'outline-secondary'), [theme]);

  const handleThemeChange = (val: any) => {
    const autoTheme = val === 'auto';
    const dispatchObj: Partial<UIState> = { autoTheme, theme: null };
    dispatch(uiActions.setAutoTheme(autoTheme));
    if (!autoTheme) {
      dispatch(uiActions.setTheme(val));
      dispatchObj['theme'] = val;
    }
    dispatch(uiActions.setDBUiSettings(dispatchObj));
  };

  const handleVehicleChange = (val: string) => {
    dispatch(vehiclesActions.setSelectedVehicles(val));
  };

  const tabs = [
    {
      name: 'profile',
      displayName: 'Profile',
      comp: <Profile user={user} />,
    },
    {
      name: 'account',
      displayName: 'Account',
      comp: <Account user={user} theme={theme} />,
    },
    {
      name: 'account-security',
      displayName: 'Account Security',
      comp: <AccountSecurity />,
    },
    {
      name: 'appearance',
      displayName: 'Appearance',
      comp: <ThemePreferences autoTheme={autoTheme} theme={theme} handleChange={handleThemeChange} />,
    },
    {
      name: 'tesla-account',
      displayName: 'Tesla Account',
      comp: <TeslaAdmin account={teslaAccount} />,
    },
    {
      name: 'vehicles',
      displayName: 'Vehicles',
      comp: <Vehicles vehicles={vehicles} handleClick={handleVehicleChange} loading={loading} theme={theme} />,
    },
  ];

  return (
    <Row className="d-flex justify-content-around mt-3">
      <Col sm={12} md={12} lg={8} xl={6}>
        <Tab.Container id="list-group-tabs-example" activeKey={`#${tab || 'profile'}`}>
          <Row>
            <Col sm={12} md={4} lg={4} xl={4} className="mb-4">
              <ListGroup>
                <ListGroup.Item variant={themeColor} style={{ backgroundColor: 'rgba(0,0,0,.1)', color: 'var(--text-color)' }}>
                  <b>Account Settings</b>
                </ListGroup.Item>
                {tabs.map((el: { name: string; displayName: string; comp: any }) => (
                  <ListGroup.Item
                    key={el.name}
                    variant={themeColor}
                    action
                    as={Link}
                    to={`/settings/${el.name}`}
                    style={{
                      backgroundColor: 'rgba(0,0,0,0)',
                      color: 'var(--text-color)',
                      overflow: 'hidden',
                    }}
                  >
                    <span
                      style={{
                        borderLeft: tab === el.name ? '5px solid var(--app-primary)' : '',
                        position: 'absolute',
                        left: 0,
                        top: 0,
                        overflow: 'hidden',
                      }}
                      className="w-100 h-100 p-0 m-0"
                    />
                    {el.displayName}
                  </ListGroup.Item>
                ))}
              </ListGroup>
            </Col>
            <Col sm={12} md={8} lg={8} xl={8}>
              <Tab.Content>
                {tabs.map((el: { name: string; displayName: string; comp: any }, idx: number) => (
                  <Tab.Pane eventKey={`#${el.name}`} key={idx}>
                    {el.comp}
                  </Tab.Pane>
                ))}
              </Tab.Content>
            </Col>
          </Row>
        </Tab.Container>
      </Col>
    </Row>
  );
};
export default Settings;
