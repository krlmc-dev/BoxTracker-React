import React from "react";
import { Bar } from "react-chartjs-2";
import { MDBContainer } from "mdbreact";

const monthNames = ["January", "February", "March", "April", "May", "June",
    "July", "August", "September", "October", "November", "December"];
    const date = new Date();
const dateList = ["01","02","03","04","05","06","07","08","09","10","11",
"12","13","14","15","16","17","18","19","20","21","22","23","24","25","26","27","28"]
const barColour = ["rgba(113, 205, 205,0.4)","rgba(113, 205, 205, 1)","rgba(255, 134,159,0.4)","rgba(255, 134, 159, 1)"]
class ChartsPage extends React.Component {
    currentDateList()
    {
        let dates = dateList
        let a = date.getMonth()-1
        if((a==3)||(a==5)||(a==7)||(a==9)||(a==11))
        {
            dates[28]="29"
            dates[29]="30"
        }
        if(a==((a==0)||(a==2)||(a==4)||(a==6)||(a==8)||(a==10)))
        {
            dates[28]="29"
            dates[29]="30"
            dates[30]="31"
        }
        
        return dates
    }
  state = {
    dataBar: {
      labels: this.currentDateList(),
      datasets: [
        {
          label: "Boxes completed in "+monthNames[date.getMonth()-1],
          data: [12, 19, 3, 5, 2, 3, 12, 19, 3, 5, 2, 3, 12, 19, 3, 5, 2, 3, 12, 19, 3, 5, 2, 3, 12, 19, 3, 5, 2, 3],
          backgroundColor: barColour[0],
          borderWidth: 2,
          borderColor: barColour[1],
        },
        {
            label: "Boxes completed in "+monthNames[date.getMonth()-2],
            data: [10, 16, 3, 7, 4, 3, 3, 16, 3, 7, 4, 3, 10, 16, 3, 7, 4, 3, 10, 16, 3, 7, 4, 3, 10, 16, 3, 7, 4, 3, 7],
            backgroundColor: barColour[2],
            borderWidth: 2,
            borderColor: barColour[3],
          }
      ]
    },
    barChartOptions: {
      responsive: true,
      maintainAspectRatio: false,
      scales: {
        xAxes: [
          {
            barPercentage: 1,
            gridLines: {
              display: true,
              color: "rgba(0, 0, 0, 0.1)"
            }
          }
        ],
        yAxes: [
          {
            gridLines: {
              display: true,
              color: "rgba(0, 0, 0, 0.1)"
            },
            ticks: {
              beginAtZero: true
            }
          }
        ]
      }
    }
  }


  render() {
    return (
      <MDBContainer>
        <h3 className="mt-5">{monthNames[date.getMonth()-1]+" "}Box Report</h3>
        <Bar data={this.state.dataBar} options={this.state.barChartOptions} />
      </MDBContainer>
    );
  }
}

export default ChartsPage;