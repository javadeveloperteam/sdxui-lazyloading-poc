import { Component, OnInit } from '@angular/core';
import { Chart } from 'chart.js';
import { DashboardService } from "../services/dashboard.service";
declare var $: any;

@Component({
  selector: 'app-radarchart',
  templateUrl: './radarchart.component.html',
  styleUrls: ['./radarchart.component.css']
})
export class RadarchartComponent implements OnInit {

  dailyData: any;
  data: any = [];
  dailyChart: any;
  completed: any;
  open: any;
  error: any;

  constructor(private dashboard: DashboardService) { }

  ngOnInit() {
    this.dashboard.getDailyData().subscribe(res => {
      console.log(res);
      this.dailyData = res;
      let dailyStatus = this.dailyData.status;
      for (var key in dailyStatus) {
        if(dailyStatus[key].status == "Completed"){
          this.completed = dailyStatus[key].value
        }
        if(dailyStatus[key].status == "Error"){
          this.error = dailyStatus[key].value
        }
        if(dailyStatus[key].status == "Open"){
          this.open = dailyStatus[key].value
        }
        
      }

      this.data.push(this.open);
      this.data.push(this.completed);
      this.data.push(this.error);

      this.dailyChart = new Chart('dailyChart', {
        type: 'doughnut',
        data: {
          labels: ['Open', 'Completed', 'Error'],
          datasets: [{
            label: 'Pie',
            backgroundColor: [
                'rgba(102, 216, 208, 0.6)',
                'rgba(118, 178, 229, 0.6)',
                'rgba(255, 173, 168, 0.6)'
            ],

            borderColor: [
                '#66d8d0',
                '#76b2e5',
                '#ffada8'
            ],
            hoverBorderColor: '#fff',
            data: this.data,
            borderWidth: 1
          }]
        },
        options: {
          responsive: true,
          maintainAspectRatio: false,
          responsiveAnimationDuration:0,
            legend: {
                position: 'bottom',
                labels: {
                    usePointStyle: true,
                    padding: 20
                }
            }
        }
      });
    });
   /*  new Chart($("#radar-chart"), {
      type: 'radar',
      data: {
          labels: ['3h', '6h', '9h', '12h', '15h', '18h', '21h', '24h'],
          datasets: [{
                  label: 'Completed',
                  backgroundColor: 'rgba(102, 216, 208, 0.6)',
                  borderColor: '#66d8d0',
                  borderWidth: 1,
                  data: [13, 15, 18, 32, 9, 23, 25, 17, ]


              },
              {
                  label: 'Open',
                  backgroundColor: 'rgba(118, 178, 229, 0.6)',
                  borderColor: '#76b2e5',
                  borderWidth: 1,
                  data: [15, 15, 28, 12, 22, 20, 31, 24]

              },
              {
                  label: 'Error',
                  backgroundColor: 'rgba(255, 173, 168, 0.6)',
                  borderColor: '#ffada8',
                  borderWidth: 1,
                  data: [21, 23, 14, 12, 17, 13, 18, 12]

              }
          ]
      },
      options: {
        responsive: true,
        maintainAspectRatio: false,
        responsiveAnimationDuration:0,
            legend: {
                display: false,				
                position: 'bottom',
                labels: {
                    usePointStyle: true,
                    padding: 20,
                    boxWidth: 30,
                }
            },
            scales: {
                yAxes: [{
                    ticks: {
                        beginAtZero: true
                    }
                }]
            },
        }
  }); */
  }

}
