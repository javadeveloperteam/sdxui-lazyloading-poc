import { Component, OnInit } from '@angular/core';
import { Chart } from 'chart.js';
import { DashboardService } from "../services/dashboard.service";
//declare var $: any;


@Component({
    selector: 'app-linechart',
    templateUrl: './linechart.component.html',
    styleUrls: ['./linechart.component.css']
})
export class LinechartComponent implements OnInit {

    yearData: any;
    data: any = [];
    yearChart: any;

    constructor(private dashboard: DashboardService) { }

    ngOnInit() {

        this.dashboard.getYearlyData().subscribe(res => {

            this.yearData = res;
            let yearStatus = this.yearData.status;
            for (var key in yearStatus) {
                if (yearStatus[key].status != 'Queued' && yearStatus[key].status != 'Hold' && yearStatus[key].status != 'Success') {
                    this.data.push(yearStatus[key].value);
                }
            }

            this.yearChart = new Chart('yearChart', {
                type: 'line',
                data: {
                    labels: ["New", "Open", "Completed", "Error", "Acknowledged", "NotAcknowledged", "OffDuty", "Change"],
                    datasets: [

                        {
                            //data: [15, 39, 15, 41, 56, 25, 10, 35, 30, 10, 20, 5],
                            data: this.data,
                            backgroundColor: 'rgba(102, 216, 208, 0)',
                            borderColor: '#66d8d0',
                            borderWidth: 1,
                            pointRadius: 3,
                        }
                    ]

                },
                options: {
                    responsive: true,
                    maintainAspectRatio: false,
                    responsiveAnimationDuration: 0,
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
