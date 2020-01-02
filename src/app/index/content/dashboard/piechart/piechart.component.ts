import { Component, OnInit } from '@angular/core';
import { Chart } from 'chart.js';
import { DashboardService } from "../services/dashboard.service";

@Component({
  selector: 'app-piechart',
  templateUrl: './piechart.component.html',
  styleUrls: ['./piechart.component.css']
})
export class PiechartComponent implements OnInit {

  weeklyData: any;
  data: any = [];
  weeklyChart: any;
  completed: any;
  open: any;
  error: any;

  constructor(private dashboard: DashboardService) { }

  ngOnInit() {
    this.dashboard.getWeeklyData().subscribe(res => {
      console.log(res);
      this.weeklyData = res;
      let weeklyStatus = this.weeklyData.status;
      for (var key in weeklyStatus) {
          if(weeklyStatus[key].status == "Completed"){
            this.completed = weeklyStatus[key].value
          }
          if(weeklyStatus[key].status == "Error"){
            this.error = weeklyStatus[key].value
          }
          if(weeklyStatus[key].status == "Open"){
            this.open = weeklyStatus[key].value
          }
          
      }

      this.data.push(this.open);
      this.data.push(this.completed);
      this.data.push(this.error);


      this.weeklyChart = new Chart('weeklyChart', {
        type: 'pie',
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
  }
}
