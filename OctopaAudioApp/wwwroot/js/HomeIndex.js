$(document).ready(function () {
    GetData();
    GetSalesData();
    GetMonthlyCollectionChartData();
    GetDailyCollectionChartData();
    GetDueDateAmounts();
});
var TotalAmount = 0;
var TotalSales = 0;
var WeekNo = 0;
var SalesPerDay = 0;
var ReceivableNOOfDays = 0;
function GetData() {
    $.ajax({
        type: "GET",

        url: "Home/GetDashboardData",
        success: function (response) {
            obj = JSON.parse(response);
            document.getElementById("TotalAmountLabel").innerHTML = obj.TotalAmount.toFixed(0).replace(/\B(?=(\d{3})+(?!\d))/g, ",");
            document.getElementById("TotalSalesLabel").innerHTML = obj.TotalSales.toFixed(0).replace(/\B(?=(\d{3})+(?!\d))/g, ",");
            document.getElementById("WeekNumberLabel").innerHTML = obj.WeekNO;            
            document.getElementById("SalesPerDayLabel").innerHTML = obj.SalesPerDay.toFixed(0).replace(/\B(?=(\d{3})+(?!\d))/g, ",");
            document.getElementById("ReceivableNOOfDaysLabel").innerHTML = obj.ReceivableNOOfDays.toFixed(0).replace(/\B(?=(\d{3})+(?!\d))/g, ",");
            $("#DashboardGaugesDIV").show();

            //if (response = null) {
            //    document.getElementById("DashboardGaugesDIV").display = ("hidden")
            //}
        },
        error: function (response) { alert(response) }
    });
}
function GetSalesData() {
    $.ajax({
        type: "GET",
        url: "Home/GetSalesData",
        success: function (response) {
            var sobj = JSON.parse(response);
            sobj.TotalSales = sobj.TotalSales.toFixed(0)
            sobj.Paid = sobj.Paid.toFixed(0)
            sobj.TotalIssues = sobj.TotalIssues.toFixed(0)
            var xValues = ["Total Sales ", "Paid ", "Total Issues "];
            var yValues = [sobj.TotalSales, sobj.Paid, sobj.TotalIssues];
            var barColors = ["#2baab1", "#734ba9", "#e36159",];

            new Chart("myChart", {
                maintainAspectRatio: false,
                type: "bar",
                data: {
                    labels: xValues,
                    datasets: [{

                        backgroundColor: barColors,
                        data: yValues
                    }]
                },
                options: {

                    legend: { display: false },
                    title: {
                        display: true,
                        text: "Sales"
                    },

                    tooltips: {
                        enabled: true,
                        callbacks: {
                            label: function (tooltipItems, data) {
                                return data.datasets[0].data[tooltipItems.index].toLocaleString().replace(/\B(?=(\d{3})+(?!\d))/g, ",");
                            }
                        }
                    },
                    hover: {
                        animationDuration: 1
                    },
                    animation: {
                        duration: 1,
                        onComplete: function () {
                            var chartInstance = this.chart,
                                ctx = chartInstance.ctx;
                            ctx.textAlign = 'center';
                            ctx.fillStyle = "rgba(0, 0, 0, 1)";
                            ctx.textBaseline = 'bottom';
                            this.data.datasets.forEach(function (dataset, i) {
                                var meta = chartInstance.controller.getDatasetMeta(i);
                                meta.data.forEach(function (bar, index) {
                                    var data = dataset.data[index];
                                    ctx.fillText(data.replace(/\B(?=(\d{3})+(?!\d))/g, ","), bar._model.x, bar._model.y -5);
                                });
                            });
                        }
                    },
                    scales: {
                        xAxes: [{

                            barPercentage: 0.6,
                            borderWidth: 0

                        }],
                        yAxes: [{
                            ticks: {
                                beginAtZero: true,
                                callback: function (value, index, values) {
                                    if (parseInt(value) >= 1000) {
                                        return '' + value.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",");
                                    } else {
                                        return '' + value;
                                    }
                                }
                            }
                        }],

                    },
                }
            });
            




        },
        error: function (response) { alert(response) }
    });
}
function GetMonthlyCollectionChartData() {
    var totalCollectedValues = 0; 
    $.ajax({
        type: "GET",
        url: "Home/MonthlyCollectionChartData",
        success: function (response) {
            var JSONRes = JSON.parse(response);
            var xValues = [];
            var yValues = [];
            for (var i = 0; i < JSONRes.length; i++) {
                if (JSONRes[i].Month == 1) {
                    xValues.push("January")
                } else if (JSONRes[i].Month == 2) {
                    xValues.push("February")
                } else if (JSONRes[i].Month == 3) {
                    xValues.push("March")
                } else if (JSONRes[i].Month == 4) {
                    xValues.push("April")
                } else if (JSONRes[i].Month == 5) {
                    xValues.push("May")
                } else if (JSONRes[i].Month == 6) {
                    xValues.push("June")
                } else if (JSONRes[i].Month == 7) {
                    xValues.push("July")
                } else if (JSONRes[i].Month == 8) {
                    xValues.push("August")
                } else if (JSONRes[i].Month == 9) {
                    xValues.push("September")
                } else if (JSONRes[i].Month == 10) {
                    xValues.push("October")
                } else if (JSONRes[i].Month == 11) {
                    xValues.push("November")
                } else if (JSONRes[i].Month == 12) {
                    xValues.push("December")
                }
                totalCollectedValues += parseInt(JSONRes[i].Amount.toFixed(0))
                yValues.push(JSONRes[i].Amount.toFixed(0))
            }
            
            document.getElementById("CollectedValuesLabel").innerHTML = totalCollectedValues.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",");


            new Chart("MonthlyCollectionChart", {
                type: "line",
                data: {
                    labels: xValues,
                    datasets: [{
                        fill: false,
                        lineTension: 0,
                        backgroundColor: "rgb(43, 104, 204)",
                        borderColor: "rgb(149, 183, 240)",
                        data: yValues
                    }]
                },
                options: {
                   
                    tooltips: {
                        callbacks: {
                            label: function (tooltipItems, data) {
                                return data.datasets[0].data[tooltipItems.index].toLocaleString().replace(/\B(?=(\d{3})+(?!\d))/g, ",");
                            }
                        }
                    },
                    legend: { display: false },
                    scales: {
                        yAxes: [{
                            ticks: {
                                beginAtZero: true,
                                callback: function (value, index, values) {
                                    if (parseInt(value) >= 1000) {
                                        return '' + value.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",");
                                    } else {
                                        return '' + value;
                                    }
                                }
                            }
                        }]
                    }
                },
                plugins: [{
                    afterDatasetsDraw: function (chart) {
                        var ctx = chart.ctx;
                        chart.data.datasets.forEach(function (dataset, index) {
                            var datasetMeta = chart.getDatasetMeta(index);
                            if (datasetMeta.hidden) return;
                            datasetMeta.data.forEach(function (point, index) {
                                var value = dataset.data[index],
                                    x = point.getCenterPoint().x,
                                    y = point.getCenterPoint().y,
                                    radius = point._model.radius,
                                    fontSize = 10,
                                    fontFamily = 'Verdana',
                                    fontColor = 'black',
                                    fontStyle = 'normal';
                                ctx.save();
                                ctx.textBaseline = 'middle';
                                ctx.textAlign = 'center';
                                ctx.font = fontStyle + ' ' + fontSize + 'px' + ' ' + fontFamily;
                                ctx.fillStyle = fontColor;
                                ctx.fillText(value.replace(/\B(?=(\d{3})+(?!\d))/g, ","), x, y - radius - fontSize);
                                ctx.restore();
                            });
                        });
                    }
                }]
            });
        },
        error: function (response) { alert(response) }
    });

}
function GetDailyCollectionChartData() {
    $.ajax({
        type: "GET",
        url: "Home/DailyCollectionChartData",
        success: function (response) {
            var JSONRes = JSON.parse(response);
            var xValues = [];
            var yValues = [];
            for (var i = 0; i < JSONRes.length; i++) {
                yValues.push(JSONRes[i].Day)
                xValues.push(JSONRes[i].Amount.toFixed(0))
            }



            new Chart("DailyCollectionChart", {
                type: "horizontalBar",
                data: {
                    labels: yValues,
                    datasets: [{
                        fill: false,
                        lineTension: 0,
                        backgroundColor: "rgb(51, 96, 171)",
                        borderColor: "rgba(0,0,255,0.1)",
                        data: xValues
                    }]
                },
                options: {

                    tooltips: {
                        enabled: true,
                        callbacks: {
                            label: function (tooltipItems, data) {
                                return data.datasets[0].data[tooltipItems.index].toLocaleString().replace(/\B(?=(\d{3})+(?!\d))/g, ",");
                            }
                        }
                    },
                    hover: {
                        animationDuration: 1
                    },
                    animation: {
                        duration: 1,
                        onComplete: function () {
                            var chartInstance = this.chart,
                                ctx = chartInstance.ctx;
                            ctx.textAlign = 'center';
                            ctx.fillStyle = "rgba(0, 0, 0, 1)";
                            ctx.textBaseline = 'bottom';
                            this.data.datasets.forEach(function (dataset, i) {
                                var meta = chartInstance.controller.getDatasetMeta(i);
                                meta.data.forEach(function (bar, index) {
                                    var data = dataset.data[index];
                                    ctx.fillText(data.replace(/\B(?=(\d{3})+(?!\d))/g, ","), bar._model.x + 30, bar._model.y + 6);
                                });
                            });
                        }
                    },
                    legend: { display: false },
                    scales: {
                        xAxes: [{
                            ticks: {
                                beginAtZero: true,
                                callback: function (value, index, values) {
                                    if (parseInt(value) >= 1000) {
                                        return '' + value.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",");
                                    } else {
                                        return '' + value;
                                    }
                                }
                            }
                        }]
                    }
                },

            });
        },
        error: function (response) { alert(response) }
    });


}

    function GetDueDateAmounts() {
    $.ajax({
        type: "GET",
        url: "Home/DueDateAmounts",
        success: function (response) {
            var densityCanvas = document.getElementById("densityChart");
            var JSONR = JSON.parse(response);
            //Chart.defaults.global.defaultFontFamily = "Lato";
            //Chart.defaults.global.defaultFontSize = 18;
            for (var i = 0; i < length; i++) {

            }
             
            var DPEGP = (JSONR.find(x => x.ValueType === 'Down Payment' && x.Currency === 'EGP').Amount.toFixed(0))
            var DPEUR = (JSONR.find(x => x.ValueType === 'Down Payment' && x.Currency === 'EUR').Amount.toFixed(0))
            var DPUSD = (JSONR.find(x => x.ValueType === 'Down Payment' && x.Currency === 'USD').Amount.toFixed(0))

            var IEGP = (JSONR.find(x => x.ValueType === 'Invoiced' && x.Currency === 'EGP').Amount.toFixed(0))
            var IEUR = (JSONR.find(x => x.ValueType === 'Invoiced' && x.Currency === 'EUR').Amount.toFixed(0))
            var IUSD = (JSONR.find(x => x.ValueType === 'Invoiced' && x.Currency === 'USD').Amount.toFixed(0))

            var UCEGP = (JSONR.find(x => x.ValueType === 'Under Collection' && x.Currency === 'EGP').Amount.toFixed(0))
            var UCEUR = (JSONR.find(x => x.ValueType === 'Under Collection' && x.Currency === 'EUR').Amount.toFixed(0))
            var UCUSD = (JSONR.find(x => x.ValueType === 'Under Collection' && x.Currency === 'USD').Amount.toFixed(0))

            var EGPData = {
                label: 'EGP',
                data: [IEGP, DPEGP, UCEGP],
                backgroundColor: 'rgb(51, 96, 171)',
                borderWidth: 0,
                yAxisID: "y-axis-l"
            };

            var USDData = {
                label: 'USD',
                data: [IUSD, DPUSD, UCUSD],
                backgroundColor: '#009E60',
                borderWidth: 0,
                yAxisID: "y-axis-i"
            };
            var EURData = {
                label: 'EUR',
                data: [IEUR, DPEUR, UCEUR],
                backgroundColor: '#FFB347',
                borderWidth: 0,
                yAxisID: "y-axis-e"
            };

            var planetData = {
                labels: ["Invoiced", "Down Payment", "Under Collection"],
                datasets: [EGPData, USDData, EURData]
            };

            var chartOptions = {
                tooltips: {
                    callbacks: {
                        label: function (tooltipItems, data) {
                            console.log(tooltipItems.index, tooltipItems.datasetIndex)
                            console.log(tooltipItems, data)

                            return data.datasets[tooltipItems.datasetIndex].label +": " +data.datasets[tooltipItems.datasetIndex].data[tooltipItems.index].toLocaleString().replace(/\B(?=(\d{3})+(?!\d))/g, ",");
                        }
                        
                    }
                },
                animation: {
                    duration: 1,
                    onComplete: function () {
                        var chartInstance = this.chart,
                            ctx = chartInstance.ctx;
                        ctx.textAlign = 'center';
                        
                        ctx.fillStyle = "rgba(0, 0, 0, 100)";
                        ctx.textBaseline = 'bottom';
                        //this.data.datasets.forEach(function (dataset, i) {
                        //    var meta = chartInstance.controller.getDatasetMeta(i);
                        //    meta.data.forEach(function (bar, index) {
                        //        var data = dataset.data[index];
                        //        ctx.fillText(data.replace(/\B(?=(\d{3})+(?!\d))/g, ","), bar._model.x, bar._model.y);
                                
                        //    });
                        //});
                        Chart.helpers.each(this.data.datasets.forEach(function (dataset, i) {
                            var meta = chartInstance.controller.getDatasetMeta(i);
                            Chart.helpers.each(meta.data.forEach(function (bar, index) {
                                ctx.save();
                                // Translate 0,0 to the point you want the text
                                ctx.translate(bar._model.x, bar._model.y+10);

                                // Rotate context by -90 degrees
                                ctx.rotate(0.2 * Math.PI);
                                var data = dataset.data[index];
                                // Draw text
                                ctx.fillText(data.replace(/\B(?=(\d{3})+(?!\d))/g, ","), 0, 0);
                                ctx.restore();
                            }), this)
                        }), this);
                    }
                },
                scales: { 
                    xAxes: [{
                        barPercentage:0.9,
                        categoryPercentage: 0.6
                    }],



                    yAxes: [{
                        ticks: {
                            beginAtZero: true,
                            callback: function (value, index, values) {
                                if (parseInt(value) >= 1000) {
                                    return '' + value.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",") + "";
                                } else {
                                    return '' + value;
                                }
                            }
                        },
                        id: "y-axis-e"
                    }, {
                        ticks: {
                            beginAtZero: true,
                            callback: function (value, index, values) {
                                if (parseInt(value) >= 1000) {
                                    return '' + value.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",") + "";
                                } else {
                                    return '' + value;
                                }
                            }
                        },
                        id: "y-axis-i"
                        }, {
                            ticks: {
                                beginAtZero: true,
                                callback: function (value, index, values) {
                                    if (parseInt(value) >= 1000) {
                                        return '' + value.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",") + "";
                                    } else {
                                        return '' + value;
                                    }
                                }
                            },
                            id: "y-axis-l"
                        },

                    ]
                }
            };

            var barChart = new Chart(densityCanvas, {
                type: 'bar',
                data: planetData,
                options: chartOptions
            });
        },
        error: function (response) { alert(response) }
    });



}



