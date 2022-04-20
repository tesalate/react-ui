import React from 'react'
import { Spinner } from 'react-bootstrap'
import { useSelector } from 'react-redux';
import { RootState } from '../../redux/reducers';


const SpinnerComp: React.FC<{}> = () => {

  const { theme } = useSelector(({ uiState }: RootState) => ({
    theme : uiState.theme,
  }));
  
  return (
    <div className="h-100 w-100 d-flex justify-content-center align-items-center" style={{
      "background"   : theme === "dark" ? "rgba(0,0,0,0.8)" : "rgba(0,0,0,0.2)",
      "position"     : "absolute",
      "top"          : "50%",
      "right"        : "50%",
      "transform"    : "translateY(-50%) translateX(50%)",
      "zIndex"       : 99999,
      "borderRadius" : '.6rem',
      }}>
        <Spinner
          as          = "span"
          animation   = "border"
          role        = "status"
          aria-hidden = "true"
          className   = "m-2"
          variant     = "light"
        />
      </div>
  )
}

export default SpinnerComp