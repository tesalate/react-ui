import React from 'react';
import Switch from 'react-switch';
import { Row, Col, ToggleButtonGroup, ToggleButton } from 'react-bootstrap';
import { ThemeTypeArr } from '../../../ducks/ui/ui.index';
import { toTitleCase } from '../../../utils/formatFunctions';

interface ApplicationPrefsProps {
  autoTheme: boolean;
  theme: any;
  liveUpdates: boolean;
  handleThemeChange: (val: any) => void;
  handleLiveUpdatesChange: (val: any) => void;
}

const ApplicationPrefs: React.FC<ApplicationPrefsProps> = ({ autoTheme, theme, handleThemeChange, liveUpdates, handleLiveUpdatesChange }) => {
  return (
    <>
      <Row className="mb-5">
        <Col>
          <h4>Application Settings</h4>
          <hr />
          <Row className="d-flex">
            <Col md={1} className="d-flex align-items-center">
              <Switch onChange={handleLiveUpdatesChange} checked={liveUpdates} height={16} width={36} offColor="#BEBEBE" onColor="#198754" />
            </Col>
            <Col md={11}>Live Updates</Col>
          </Row>
        </Col>
      </Row>
      <Row className="mb-5">
        <Col>
          <h4>Theme Preferences</h4>
          <hr />
          <Col className="my-auto align-middle">
            <p>
              <small>Choose how {toTitleCase(process.env.REACT_APP_NAME || '')} looks to you. Select a single theme, or sync with your system and automatically switch between light and dark themes.</small>
            </p>
            <span className="me-2">Theme mode:</span>
            <ToggleButtonGroup name="theme" value={autoTheme ? 'auto' : theme} onChange={handleThemeChange}>
              {[...ThemeTypeArr, 'auto'].map((el: string) => (
                <ToggleButton id={`tbg-btn-${el}`} size={'sm'} value={el} variant={theme === 'dark' ? 'dark' : 'outline-secondary'} key={el}>
                  {el}
                </ToggleButton>
              ))}
            </ToggleButtonGroup>
          </Col>
        </Col>
      </Row>
    </>
  );
};

export default ApplicationPrefs;
