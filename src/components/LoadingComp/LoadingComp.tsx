import React from 'react'
import { Row, Col, Alert, Spinner } from 'react-bootstrap';
import { RootState } from '../../redux/reducers';
import { useSelector } from 'react-redux';

interface ILoadingCompProps {
  heading?: string
  body: string
}

const LoadingComp: React.FC<ILoadingCompProps> = ({heading="Please wait...", body}:ILoadingCompProps) => {
  const { theme } = useSelector(({ uiState }: RootState) =>({
    theme : uiState.theme
  }))

  return (
    <Row style={{height: '100vh', width: '100vw'}} className="g-0">
      <Col className="d-flex justify-content-center align-items-center text-center">
        <div style={{border: 'var(--main-border-style)', borderRadius: '16px'}}>
          <Alert variant={'light'} style={{'minWidth': '300px', filter: theme === "dark" ? "invert(1)" : "", borderRadius: '16px' }} className="mb-0  text-center">
          <Alert.Heading>
            <Spinner
                as          = "span"
                animation   = "border"
                role        = "status"
                aria-hidden = "true"
                className   = "me-3"
              />
              {heading}
            </Alert.Heading>
            <hr />
            <p className="align-middle mt-2 mb-0">{body}</p>
          </Alert>
        </div>
      </Col>
    </Row>
  )
}

export default LoadingComp