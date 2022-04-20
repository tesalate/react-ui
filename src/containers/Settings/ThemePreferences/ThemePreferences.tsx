import React from 'react';
import { Row, Col, ToggleButtonGroup, ToggleButton } from 'react-bootstrap';
import { ThemeTypeArr } from '../../../ducks/ui/ui.index';
import { toTitleCase } from '../../../utils/formatFunctions';

interface ThemePreferencesProps {
  autoTheme: boolean;
  theme: any;
  handleChange: (val: any) => void;
}

const ThemePreferences: React.FC<ThemePreferencesProps> = ({ autoTheme, theme, handleChange }) => {
  return (
    <>
      <Row className="mb-5">
        <Col>
          <h4>Theme Preferences</h4>
          <hr />
          <Col className="my-auto align-middle">
            <p>
              <small>Choose how {toTitleCase(process.env.REACT_APP_NAME || '')} looks to you. Select a single theme, or sync with your system and automatically switch between light and dark themes.</small>
            </p>
            <span className="me-2">Theme mode:</span>
            <ToggleButtonGroup name="test" value={autoTheme ? 'auto' : theme} onChange={handleChange}>
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

export default ThemePreferences;
