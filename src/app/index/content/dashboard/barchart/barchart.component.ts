import { Component, OnInit } from '@angular/core';
import { Chart } from 'chart.js';
import { DashboardService } from "../services/dashboard.service";

declare var $: any;
@Component({
  selector: 'app-barchart',
  templateUrl: './barchart.component.html',
  styleUrls: ['./barchart.component.css']
})
export class BarchartComponent implements OnInit {

    monthData: any;
    data: any = [];
    monthChart: any;
    constructor(private dashboard: DashboardService) { }
 
    ngOnInit() {    
        this.dashboard.getMonthlyData().subscribe(res => {
            console.log(res);
            this.monthData = res;
            let monthStatus = this.monthData.status;
            for (var key in monthStatus) {
                if (monthStatus[key].status != 'Queued' && monthStatus[key].status != 'Hold' && monthStatus[key].status != 'Success') {
                    this.data.push(monthStatus[key].value);
                }
            }


            this.monthChart = new Chart('monthChart', {
                type: 'bar',
                data: {
                    labels: ["New",  "Open",   "Completed",   "Error", "Acknowledged", "NotAcknowledged", "OffDuty",   "Change"],
                    datasets: [
        
                        {
                            //data: [15, 39, 15, 41, 56, 25, 10, 35, 30, 10, 20, 5],
                            data: this.data,
                            backgroundColor: 'rgba(118, 178, 229, 0.6)',
                            borderColor: '#76b2e5',
                            borderWidth: 1,
                            pointRadius: 3,
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
            });
        });
    }
}
