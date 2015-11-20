SalesDashboard.channelsModel = function () {
    var self = this,
        currentYear = SalesDashboard.rangeYear;

    self.dailySales = [];

    self.salesDate = getDate();

    self.updateDailyValues = function (value) {
        var fields = ["Retail", "Direct", "Consultants", "VARs", "Resellers"];

        var results = {
            dailyRetail: 0,
            dailyDirect: 0,
            dailyConsultants: 0,
            dailyVARs: 0,
            dailyResellers: 0,
            dailyTotal: 0
        };

        $.each(value, function () {
            var hourResult = this;
            $.each(fields, function () {
                results["daily" + this] = results["daily" + this] + hourResult[this];
            });
        });

        $.each(fields, function () {
            results.dailyTotal += results["daily" + this];
            $("#daily" + this).text('$' + (Math.round(results["daily" + this] / 100000)) / 10 + 'M');
        });

        $("#dailyTotal").text('$' + (Math.round(results.dailyTotal / 100000)) / 10 + 'M');
    }

    self.changeDay = function (offset, disableNext) {
        var salesDate = new Date(self.salesDate),
            tmp = getDate(),
            today = new Date(tmp.getFullYear(), tmp.getMonth(), tmp.getDate());

        salesDate.setDate(salesDate.getDate() + offset);

        if (new Date(salesDate.getFullYear(), salesDate.getMonth(), salesDate.getDate()).getTime() > today.getTime()) {
            return;
        }
        self.salesDate = salesDate;
        self.getDaySales(salesDate);

        $("#nextDay").removeClass("disabled");
        if (new Date(salesDate.getFullYear(), salesDate.getMonth(), salesDate.getDate()).getTime() == today.getTime() || disableNext)
            $("#nextDay").addClass("disabled");
    };

    self.getDaySales = function (salesDate) {

        function parseData(data) {
            $.each(data, function (i, val) {
                val.SaleDate = new Date(val.SaleDate);

                val.Retail = val.SalesByChannel.Retail || 0;
                val.Direct = val.SalesByChannel.Direct || 0;
                val.Consultants = val.SalesByChannel.Consultants || 0;
                val.VARs = val.SalesByChannel.VARs || 0;
                val.Resellers = val.SalesByChannel.Resellers || 0;

                delete val.SalesByChannel;
            });
            self.dailySales = data;
            if (self.dailySales.length < 5) {
                self.changeDay(-1, true);
                return;
            }
            $("#salesDate").text("(" + Globalize.format(self.salesDate, "MMM dd, yyyy") + ")");
            
            self.drawDailyChart();
        }

        SalesDashboard.loadData({ day: Globalize.format(salesDate, 'yyyy-MM-dd') }, parseData, true);
    };

    self.salesRange = [];
    self.salesRangeSelectedRange = null;
    self.criteriaSalesByRange = [];
    self.salesByRange = function () {
        return $.map(self.criteriaSalesByRange, function (arg) {
            return arg.Sales;
        });
    }

    self.processCriteriaSalesData = function (data) {
        if (!data || !data.length) {
            return;
        }
        $.each(data, function (_, item) {
            var delimiter = SalesDashboard.isPhone ? "<br>" : " - ";
            item.Criteria = item.Criteria + delimiter + '$' + (item.Sales / 1000000).toFixed(0) + 'M';
        });
        self.criteriaSalesByRange = data;
        
        self.drawPieChart();
        if (!SalesDashboard.isPhone) {
            self.drawBarGauge();
        }
    }

    self.init = function () {
        $("#rangeYearName").text("(" + SalesDashboard.rangeYear + ")");

        self.drawDailyChart();
        self.changeDay(0);

        var range = SalesDashboard.initRangeSelector();

        if (SalesDashboard.isPhone) {
            SalesDashboard.loadData({
                startDate: Globalize.format(SalesDashboard._currentDay, 'yyyy-01-01'),
                endDate: Globalize.format(SalesDashboard._currentDay, 'yyyy-12-31')
            }, self.processCriteriaSalesData, true);
        } else {
            range.onSelectionChanged.add(function (e) {
                SalesDashboard.loadData({
                    startDate: Globalize.format(e.startValue, 'yyyy-MM-dd'),
                    endDate: Globalize.format(e.endValue, 'yyyy-MM-dd')
                }, self.processCriteriaSalesData, true);
            });
        }
        SalesDashboard.loadData({
            startDate: (Globalize.format(SalesDashboard._currentDay, 'yyyy-01-01')),
            endDate: (Globalize.format(SalesDashboard._currentDay, 'yyyy-12-31'))
        }, function (data) {
            if (data && data.length) {
                self.salesRangeSelectedRange = undefined;
                self.salesRange = data;
                if (!SalesDashboard.isPhone) range.load(0);
            }
        });

        $("#nextDay").click(function () {
            if (!$(this).hasClass("disabled"))
                SalesDashboard.currentModel.changeDay(1)
        });
        $("#prevDay").click(function () {
            if(!$(this).hasClass("disabled"))
                SalesDashboard.currentModel.changeDay(-1)
        });
    };

    self.drawDailyChart = function() {
        self.updateDailyValues(self.dailySales);
        var instance = $("#dailySalesChart").data("dxChart");
        if(instance) {
            instance.render();
            instance.option("dataSource", self.dailySales);
        } else {
            $("#dailySalesChart").dxChart({
                onIncidentOccurred: null,
                theme: SalesDashboard.isPhone ? "SalesDashboardMobileTheme" : "SalesDashboardTabletTheme",
                palette: SalesDashboard.getCurrentPaletteName(),
                dataSource: self.dailySales,

                argumentAxis: {
                    valueMarginsEnabled: false,
                    placeholderSize: 25,
                    argumentType: 'datetime',
                    tickInterval: { minutes: 30 },
                    label: {
                        overlappingBehavior: { mode: 'ignore' },
                        format: 'h:mmtt',
                        customizeText: function () {
                            if (this.value.getHours() % 2 &&
                                this.value.getMinutes() === 0 &&
                                this.value.getHours() !== (new Date(self.dailySales[self.dailySales.length - 1].SaleDate).getHours())) {
                                return this.valueText;
                            }
                            return '';
                        }
                    }
                },
                valueAxis: {
                    grid: {
                        visible: true
                    },
                    label: {
                        format: 'thousands'
                    }
                },
                commonSeriesSettings: {
                    type: 'line',
                    argumentField: 'SaleDate', 
                },
                tooltip: {
                    paddingLeftRight: 10,
                    paddingTopBottom: 4,
                    enabled: true,
                    precision: 2,
                    format: 'thousands',
                    customizeTooltip: function () {
                        return { text: '$' + this.valueText };
                    },
                    shadow: {
                        opacity: 0.15,
                        blur: 0,
                        color: "#000000",
                        offsetX: 3,
                        offsetY: 3
                    }
                },
                series: [
                    {
                        valueField: 'Consultants', name: 'Consultants',
                        point: {
                            color: SalesDashboard.getColor("series.point.color", 0),
                            border: { color: SalesDashboard.getColor("", 0) },
                            hoverStyle: {
                                border: {
                                    color: SalesDashboard.getColor("", 0)
                                }
                            }
                        }
                    },
                    {
                        valueField: 'Direct', name: 'Direct',
                        point: {
                            color: SalesDashboard.getColor("series.point.color", 1),
                            border: { color: SalesDashboard.getColor("", 1) },
                            hoverStyle: {
                                border: {
                                    color: SalesDashboard.getColor("", 1)
                                }
                            }
                        }
                    },
                    {
                        valueField: 'Resellers', name: 'Resellers',
                        point: {
                            color: SalesDashboard.getColor("series.point.color", 2),
                            border: { color: SalesDashboard.getColor("", 2) },
                            hoverStyle: {
                                border: {
                                    color: SalesDashboard.getColor("", 2)
                                }
                            }
                        }
                    },
                    {
                        valueField: 'Retail', name: 'Retail',
                        point: {
                            color: SalesDashboard.getColor("series.point.color", 3),
                            border: { color: SalesDashboard.getColor("", 3) },
                            hoverStyle: {
                                border: {
                                    color: SalesDashboard.getColor("", 3)
                                }
                            }
                        }
                    },
                    {
                        valueField: 'VARs', name: 'VARs',
                        point: {
                            color: SalesDashboard.getColor("series.point.color", 4),
                            border: { color: SalesDashboard.getColor("", 4) },
                            hoverStyle: {
                                border: {
                                    color: SalesDashboard.getColor("", 4)
                                }
                            }
                        }
                    }
                ],
                legend: {
                    visible: false
                }
            });
        }
    }

    self.drawPieChart = function () {
        var instance = $("#pieChart").data("dxPieChart");
        if(instance) {
            instance.render();
            instance.option("dataSource", self.criteriaSalesByRange);
        } else {
            
            $("#pieChart").dxPieChart({
                onIncidentOccurred: null,
                theme: SalesDashboard.isPhone ? "ChannelsMobileTheme" : "ChannelsTabletTheme",
                palette: SalesDashboard.getCurrentPaletteName(),
                dataSource: self.criteriaSalesByRange,
                series: {
                    type: 'doughnut', innerRadius: 0.55, argumentField: 'Criteria', valueField: 'Sales',
                    label: {
                        radialOffset: -10,
                        visible: true,
                        format: 'percent',
                        radialOffset: -10,
                        connector: { visible: true },
                        backgroundColor: 'none',
                        customizeText: function () {
                            return this.percentText;
                        }
                    }
                }
                
            });
        }
    }

    self.drawBarGauge = function() {
        var instance = $("#barGauge").data("dxBarGauge"),
            endValue = Math.max.apply(null, self.salesByRange()) * 1.05;
        if(instance) {
            instance.render();
            if(currentYear !== SalesDashboard.rangeYear) {
                currentYear = SalesDashboard.rangeYear;
                instance.option("endValue", endValue);
            }
            instance.option("values", self.salesByRange());
        } else {
            $("#barGauge").dxBarGauge({
                onIncidentOccurred: null,
                palette: SalesDashboard.getCurrentPaletteName(),
                geometry: {
                    startAngle: 225,
                    endAngle: 225
                },
                label: {
                    visible: false,
                    format: "currency millions"
                },
                barSpacing: 4,
                startValue: 0,
                endValue: endValue,
                text: null,
                backgroundColor: '#f2f2f2',
                values: self.salesByRange()
            });
        }
    }

    self.redrawGraph = function (id) {
        (id == "#day") ? self.drawDailyChart() : self.drawPieChart();
    }
}


SalesDashboard.currentModel = new SalesDashboard.channelsModel();
SalesDashboard.currentModel.init();
