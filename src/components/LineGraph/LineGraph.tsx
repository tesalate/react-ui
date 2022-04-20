import React, { useMemo } from 'react';
import { Line } from 'react-chartjs-2';
import { RootState } from '../../redux/reducers';
import { useSelector } from 'react-redux';
import { msToTime } from '../../utils/convert';

interface LineGraphDataProps {
  data   : Record<any, any>
  style? : Record<any, any>
  type?  : 'drive' | 'charge'
  colors : Array<Record<'backgroundColor'|'borderColor'|'pointBorderColor'|'pointHoverBackgroundColor'|'pointHoverBorderColor', string>>
}



const LineGraph: React.FC<LineGraphDataProps> = ({ data: { labels=[], datasets=[] }, style={}, type, colors }) => {
  const {
    uiState: { theme },
  } = useSelector(({ uiState }: RootState) => ({
    uiState: {
      theme: uiState.theme,
    },
  }));

  const shapedData = useMemo(() => (
    {
      labels  : labels.map((label:number) => {
        let temp = ""
        temp = msToTime(label)
        return temp
      }),
      datasets: datasets.map((item: any, idx:any) => ({
          label : item.label, 

          // THIS IS A MESS...
          fill: item.label === "power" ? {
            target : 'origin',
            above  : type === 'drive' ? 'rgba(102,102,102,0)'       : colors[idx].backgroundColor,
            below  : type === 'drive' ? colors[idx].backgroundColor : 'rgba(102,102,102,0)'
          } : item.label === "charger power" ? false :  true,

          order                     : item.label === "charger power" || item.label === "power" ? -1 : idx,
          lineTension               : .6,
          backgroundColor           : colors[idx].backgroundColor,
          borderColor               : colors[idx].borderColor,
          borderCapStyle            : 'butt',
          pointBorderColor          : colors[idx].pointBorderColor,
          pointBackgroundColor      : theme === "dark" ? "#000" : '#fff',
          pointBorderWidth          : 1,
          pointHoverRadius          : 1,
          pointRadius               : 3,
          pointHoverBackgroundColor : colors[idx].pointHoverBackgroundColor,
          pointHoverBorderColor     : colors[idx].pointHoverBorderColor,
          pointHoverBorderWidth     : 2,
          data                      : item.data,
      })),
    }
  ),[colors, datasets, labels, theme, type])


  const options = {
    // scales: {
    //   yAxes: [
    //     {
    //       id: 0,
    //       // type: "linear",
    //       position: "left",
    //       gridLines: {
    //         color: '#343a40'
    //       }
    //     },
    //     {
    //       id: 1,
    //       // type: "linear",
    //       position: "right",
    //       ticks: {
    //         min: 0
    //       },
    //       gridLines: {
    //         color: '#343a40'
    //       }
    //     },
    //   ],
    // },
    maintainAspectRatio : false,
    interaction: {
        mode: 'index',
        axis: 'y',
        position:"nearest",
      
      intersect: true

    },
    animations: false,
    normalized: true,
    spanGaps: true,

    // pan:{
    //   enabled:true,
    //   mode:'x'
    // },
    // zoom:{
    //     enabled:true,
    //     drag:true,
    //     mode:'x',
    //     onZoom: function({chart}:any) { console.log(`I'm zooming!!!`, chart); },
    // }
  };

  return (
    <div className={theme === "dark" ? "":""}  style={{ ...style }} >
        <Line type="line" data={shapedData} options={options}/>
    </div>
  );
};

export default LineGraph;
