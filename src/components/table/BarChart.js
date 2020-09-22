import React from "react";
import {Bar} from "react-chartjs-2";

export default function BarChart(props){
    let data;
    data = {
        labels: ['Event1', 'Event2', 'Event3', 'Event4'],
        datasets: [
            {
                label: "ATTENDANCE FOR EACH EVENT(PERSON)",
                data: [1, 1, 3, 2],

                pointBorderColor:'rgba(255,206,86,0.2)'
            }
        ]
    }


    const options={
        title:{
            display:true,
            text:'BAR CHART '
        },

        scales:{
            yAxes:[
                {
                    ticks:{
                        min:0,
                        stepSize:1
                    }
                }
            ]
        }

    }

    return(
        <Bar data={props.data} width={700} height={200} options={options}/>

    )

}