$(document).ready(function() {
    $(".preloader").fadeOut();


    new Chart(document.getElementById("area-chart"), {
        type: 'line',
        data: {
            labels: ["Jan",
                "Feb",
                "Mar",
                "Apr",
                "May",
                "June",
                "July",
                "Aug",
                "Sep",
                "Oct",
                "Nov",
                "Dec"
            ],
            datasets: [

                {
                    label: 'Completed',
                    data: [15, 39, 15, 41, 56, 25, 10, 35, 30, 10, 20, 5],
                    backgroundColor: 'rgba(102, 216, 208, 0.6)',
                    borderColor: '#66d8d0',
                    borderWidth: 1,
                    pointRadius: 2,
                }, {
                    label: 'Open',
                    data: [5, 9, 10, 81, 26, 35, 40, 35, 10, 60, 10, 15],
                    backgroundColor: "rgba(118, 178, 229, 0.6)",
                    borderColor: '#76b2e5',
                    borderWidth: 1,
                    pointRadius: 2,
                }, {
                    label: 'Error',
                    data: [25, 19, 20, 31, 66, 95, 0, 15, 60, 10, 30, 5],
                    backgroundColor: "rgba(255, 173, 168, 0.6)",
                    borderColor: '#ffada8',
                    borderWidth: 1,
                    pointRadius: 2,
                }
            ]

        },
        options: {
            maintainAspectRatio: false,
            legend: {
                display: true,
                position: 'bottom',
                labels: {
                    usePointStyle: true,
                    padding: 20
                }
            },
            scales: {
                yAxes: [{
                    ticks: {
                        beginAtZero: true
                    }
                }],
            },
        }
    });

    new Chart(document.getElementById("bar-chart"), {
        type: 'bar',
        data: {
            labels: ['1', '2', '3', '4', '5', '6', '7', '8', '9', '10', '11', '12', '13', '14', '15', '16', '17', '18', '19', '20', '21', '22', '23', '24', '25', '26', '27', '28', '29', '30'],
            datasets: [{
                    label: 'Completed',
                    backgroundColor: 'rgba(102, 216, 208, 0.6)',
                    borderColor: '#66d8d0',
                    borderWidth: 1,
                    data: [7, 10, 13, 7, 10, 13, 7, 10, 13, 7, 10, 13, 7, 10, 13, 7, 10, 13, 7, 10, 13, 7, 10, 13, 7, 10, 13]
                },
                {
                    label: 'Open',
                    backgroundColor: 'rgba(118, 178, 229, 0.6)',
                    borderColor: '#76b2e5',
                    borderWidth: 1,
                    data: [7, 10, 13, 7, 10, 13, 7, 10, 13, 7, 10, 13, 7, 10, 13, 7, 10, 13, 7, 10, 13, 7, 10, 13, 7, 10, 13]
                },
                {
                    label: 'Error',
                    backgroundColor: 'rgba(255, 173, 168, 0.6)',
                    borderColor: '#ffada8',
                    borderWidth: 1,
                    data: [7, 10, 13, 7, 10, 13, 7, 10, 13, 7, 10, 13, 7, 10, 13, 7, 10, 13, 7, 10, 13, 7, 10, 13, 7, 10, 13]
                }
            ]
        },
        options: {
            maintainAspectRatio: false,
            legend: {
                display: true,
                position: 'bottom',
                labels: {
                    usePointStyle: true,
                    padding: 20
                }
            },
            scales: {
                yAxes: [{
                    ticks: {
                        beginAtZero: true
                    }
                }],
                xAxes: [{
                    categoryPercentage: 0.6,
                    barPercentage: 0.4,
                }]
            },
        }
    });
    new Chart(document.getElementById("pie-chart"), {
        type: 'pie',
        data: {
            labels: ['Open', 'Completed', 'Error'],
            datasets: [{
                label: 'Pie',
                backgroundColor: [
                    '#66d8d0',
                    '#76b2e5',
                    '#ffada8'
                ],

                borderColor: [
                    '#66d8d0',
                    '#76b2e5',
                    '#ffada8'
                ],
                hoverBorderColor: '#fff',
                data: [5, 10, 8],
                borderWidth: 1,
                fontSize: 10
            }]
        },
        options: {
            maintainAspectRatio: false,
            legend: {
                position: 'bottom',
                labels: {
                    usePointStyle: true,
                    padding: 20
                }
            }
        }
    });

    new Chart(document.getElementById("radar-chart"), {
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
            maintainAspectRatio: false,
            legend: {
                display: true,
                position: 'bottom',
                labels: {
                    usePointStyle: true,
                    padding: 10
                },
                fontSize: 8
            },
            scale: {
                ticks: {
                    beginAtZero: true
                }
            }
        }
    });

    // new Chart(document.getElementById("line-chart"), {
    //     type: 'line',
    //     data: {
    //         labels: ['Mon', 'Tue', 'Wed', 'Thu'],
    //         datasets: [{
    //             label: 'Line',
    //             borderColor: 'rgba(87, 228, 198, 0.8)',
    //             backgroundColor: 'transparent',
    //             data: [3, 12, 3, 12]
    //         }]
    //     },
    //     options: {
    //         maintainAspectRatio: false,
    //         legend: {
    //             display: true,
    //             position: 'bottom',
    //             labels: {
    //                 usePointStyle: true,
    //                 padding: 20
    //             }
    //         },
    //         scales: {
    //             yAxes: [{
    //                 ticks: {
    //                     beginAtZero: true
    //                 }
    //             }],
    //         },
    //     }
    // })

});