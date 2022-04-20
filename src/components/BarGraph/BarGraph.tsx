import React, { } from 'react';
import { Bar } from 'react-chartjs-2';
import { RootState } from '../../redux/reducers';
import { useSelector } from 'react-redux';

interface BarGraphDataProps {
  data   : Record<any, any>
  style? : Record<any, any>
  type?  : 'drive' | 'charge'
  unit   : string
}


const BarGraph: React.FC<BarGraphDataProps> = ({ data : shapedData, style={}, unit}) => {
  const {
    uiState: { theme },
  } = useSelector(({ uiState }: RootState) => ({
    uiState: {
      theme: uiState.theme,
    },
  }));

  const options = {
    maintainAspectRatio : false,
    interaction: {
        mode: 'index',
        axis: 'y',
        position:"nearest",
      
      intersect: true

    },
    normalized: true,
    spanGaps: true,
      plugins: {
          tooltip: {
              callbacks: {
                  label: function(context:any) {
                      var label = context.dataset.label ?? '';
                      if (label) {
                          label += ' : ';
                      }
                      label += context.parsed.y ? `${context.parsed.y.toFixed(2)} ${unit}` : '(no data)'
                      return label;
                  }
              }
          }
      }

  };

  return (
    <div className={theme === "dark" ? "":""}  style={{ ...style }} >
        <Bar type="bar" data={shapedData} options={options}/>
    </div>
  );
};

export default BarGraph;
