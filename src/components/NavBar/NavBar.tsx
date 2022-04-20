import React, { useMemo } from 'react';
import { Navbar, Nav, NavDropdown, Container } from 'react-bootstrap';
import { useLocation, Link } from 'react-router-dom';
import { useSelector, shallowEqual } from 'react-redux';
import { RootState } from '../../redux/reducers';
import { toTitleCase } from '../../utils/formatFunctions';

const style = {
  overall: {
    marginBottom: '.5rem',
    marginTop: '1rem',
    marginRight: '0',
    marginLeft: '0',
    borderRadius: '.5rem',
  },
};

const NavBar = () => {
  let location = useLocation();

  const {
    uiState: { theme, isStandAlone },
    userState: { user },
  } = useSelector(
    ({ uiState, userState }: RootState) => ({
      uiState: {
        theme: uiState.theme,
        isMobile: uiState.isMobile,
        mobileType: uiState.mobileType,
        isStandAlone: uiState.isStandAlone,
      },
      userState: {
        user: userState.user,
      },
    }),
    shallowEqual
  );

  const doNotShowNav = useMemo(() => ['/login', '/logout', '/verify-email', '/sign-up'], []);

  if (doNotShowNav.includes(location.pathname)) return null;

  return (
    <Navbar bg={`${theme}`} variant={theme ?? undefined} expand="md" className={`app-content ${isStandAlone ? 'mt-1' : ''}`} style={{ ...style.overall, border: theme === 'light' ? '1px solid #E8E8E8' : '' }} collapseOnSelect>
      <Container style={{ maxWidth: '100%' }}>
        <Navbar.Brand as={Link} to="/">
          {toTitleCase((process.env.REACT_APP_NAME as string) ?? 'tesalate')}
        </Navbar.Brand>
        <Navbar.Toggle aria-controls="basic-navbar-nav" />
        <Navbar.Collapse id="basic-navbar-nav">
          <Nav className="me-auto" activeKey={location.pathname.split('/')[1]}>
            <Nav.Link as={Link} eventKey="" to="/">
              Home
            </Nav.Link>
            <Nav.Link as={Link} eventKey="drive-sessions" to="/drive-sessions">
              Drive Sessions
            </Nav.Link>
            <Nav.Link as={Link} eventKey="charge-sessions" to="/charge-sessions">
              Charge Sessions
            </Nav.Link>
            {/* <Nav.Link as={Link} eventKey="records" to="/records">Records</Nav.Link> */}
            <Nav.Link as={Link} eventKey="map" to="/map">
              Map
            </Nav.Link>
            <Nav.Link as={Link} eventKey="stats" to="/stats">
              Stats
            </Nav.Link>
          </Nav>
          <Nav>
            <NavDropdown title={user?.displayName ?? ''} id="nav-dropdown" className="ps-sm-0" menuVariant={`${theme}`} align="end">
              {/* <NavDropdown.Item eventKey="4.1"  bg={`${theme}`} variant={theme === "dark" ? "dark":"light"}>Profile</NavDropdown.Item> */}
              {/* <NavDropdown.Item as={Link} to="/tesla-admin" eventKey="tesla-admin">Tesla Account</NavDropdown.Item> */}
              {/* <NavDropdown.Divider /> */}
              <NavDropdown.Item as={Link} to="/settings" eventKey="settings">
                Settings
              </NavDropdown.Item>
              <NavDropdown.Divider />
              <NavDropdown.Item as={Link} eventKey="logout" to={'/logout'}>
                Log Out
              </NavDropdown.Item>
            </NavDropdown>
          </Nav>
        </Navbar.Collapse>
      </Container>
    </Navbar>
  );
};

// Dark Mode: <Switch
// onChange = {() => toggleTheme(theme === "dark" ? "light" : "dark")}
// checked  = {theme === "dark"}
// height   = {16}
// width    = {40}
// offColor = '#000'
// className = "ms-1"
// />

export default NavBar;
