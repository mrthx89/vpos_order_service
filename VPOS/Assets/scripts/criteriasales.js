SalesDashboard.criteriaSalesModel = function () {
    var self = this,
        currentYear = SalesDashboard.rangeYear,
        criteriaDict = {
            'Eco Max': { color: SalesDashboard.getColor("", 0), letter: 'A' },
            'Eco Supreme': { color: SalesDashboard.getColor("", 1), letter: 'B' },
            'EnviroCare': { color: SalesDashboard.getColor("", 2), letter: 'C' },
            'EnviroCare Max': { color: SalesDashboard.getColor("", 3), letter: 'D' },
            'SolarMax': { color: SalesDashboard.getColor("", 4), letter: 'E' },
            'SolarOne': { color: SalesDashboard.getColor("", 5), letter: 'F' },

            'Banking': { color: SalesDashboard.getColor("", 0), letter: 'A' },
            'Energy': { color: SalesDashboard.getColor("", 1), letter: 'B' },
            'Health': { color: SalesDashboard.getColor("", 2), letter: 'C' },
            'Insurance': { color: SalesDashboard.getColor("", 3), letter: 'D' },
            'Manufacturing': { color: SalesDashboard.getColor("", 4), letter: 'E' },
            'Telecom': { color: SalesDashboard.getColor("", 5), letter: 'F' }
        };

    self.criteriaPerf = {};

    self.dailySales = [];
    self.monthlyUnits = [];
    self.dailySalesDateName = "";
    self.monthlyUnitsDateName = "";
    self.monthActive = !SalesDashboard.isPhone;

    self.salesRange = [];
    self.salesRangeSelectedRange = undefined;
    self.criteriaSalesByRange = [];
    self.salesByRange = function () {
        return $.map(self.criteriaSalesByRange, function (arg) {
            return arg.Sales;
        });
    }

    self.processCriteriaSalesData = function(data) {
        if (!data || !data.length) {
            return;
        }
        $.each(data, function (_, item) {
            item.Criteria = self.parseCriteriaName(item.Criteria) + '. ' + item.Criteria + ' - $' + (item.Sales / 1000000).toFixed(0) + 'M';
        });
        self.criteriaSalesByRange = data;
        if (!SalesDashboard.isPhone) {
            self.drawPieChart();
            self.drawBarGauge();
        }
    }

    self.getDailySales = function (day) {
        function setSales(data) {
            self.dailySales = data || [];
            self.dailySalesDateName = Globalize.format(day, 'MM/dd/yy');
            if (self.dailySales.length < 3) {
                SalesDashboard.disableToday = true;
                SalesDashboard.getLastDaySales();
                return;
            }
            $(".dailySalesDateName").text(self.dailySalesDateName);
            self.drawDailyChart();
        }

        $('#dailySalesChart').dxChart('showLoadingIndicator');
        SalesDashboard.loadData({ day: Globalize.format(day, 'yyyy-MM-dd') }, setSales, true);
    };

    self.getMonthlySales = function (month) {
        function setUnits(data) {
            self.monthlyUnits = data;
            self.monthlyUnitsDateName = Globalize.format(month, 'MMM yyyy');
            $(".monthlyUnitsDateName").text(self.monthlyUnitsDateName);
            if (self.monthlyUnits.length < 3) {
                SalesDashboard.disableCurrentMonth = true;
                SalesDashboard.getLastMonthSales();
                return;
            }
            self.drawMonthlyChart();
        }
        if (self.monthActive) $('#monthlySalesChart').dxChart('showLoadingIndicator');
        SalesDashboard.loadData({ month: Globalize.format(month, 'yyyy-MM-dd') }, setUnits, true);
    };

    self.parseCriteriaName = function (criteria) {
        return criteriaDict[criteria].letter;
    };

    self.getSeriesStyle = function (criteria) {
        return SalesDashboard.isPhone ? {color: "#fff"} : { color: criteriaDict[criteria].color };
    };

    self.init = function() {
        var range = SalesDashboard.initRangeSelector();
        range.onSelectionChanged.add(function(e) {
            SalesDashboard.loadData({
                startDate: Globalize.format(e.startValue, 'yyyy-MM-dd'),
                endDate: Globalize.format(e.endValue, 'yyyy-MM-dd')
            }, self.processCriteriaSalesData, true);
        });

        SalesDashboard.loadData({
            now: Globalize.format(getDate(), "yyyy-MM-dd HH:mm")
        }, function (criteriaPerf) {
            SalesDashboard.pushToMarkup({
                dTodaySales: { value: criteriaPerf.TodaySales, fixed: 2 },
                dYesterdaySales: { value: criteriaPerf.YesterdaySales, fixed: 2 },
                dLastWeekSales: { value: criteriaPerf.LastWeekSales, fixed: 2, "class": true },
                mThisMonthUnits: { value: criteriaPerf.ThisMonthUnits, prefix: "", postfix: "K Units", divider: 1000, "class": true },
                mLastMonthUnits: { value: criteriaPerf.LastMonthUnits, prefix: "", postfix: "K Units", divider: 1000 },
                mYtdUnits: { value: criteriaPerf.YtdUnits, prefix: "", postfix: "K", divider: 1000 },
                rangeYearName: { value: "(" + SalesDashboard.rangeYear + ")", text: true },
            });
        }, true);

        SalesDashboard.loadData({
            startDate: (Globalize.format(SalesDashboard._currentDay, 'yyyy-01-01')),
            endDate: (Globalize.format(SalesDashboard._currentDay, 'yyyy-12-31'))
        },
        function (data) {
            if (data && data.length) {
                self.salesRangeSelectedRange = undefined;
                self.salesRange = data;
                if(!SalesDashboard.isPhone) range.load(0);
            }
        });

        self.drawDailyChart();
        SalesDashboard.getThisDaySales();

        self.drawMonthlyChart();
        SalesDashboard.getThisMonthSales();

        $(".criteria-name").text(SalesDashboard.showingCategory);
        $(".criteria-name-upper").text(SalesDashboard.showingCategory.toUpperCase());
    };

    self.drawDailyChart = function() {
        var instance = $("#dailySalesChart").data("dxChart");
        if(instance) {
            instance.render();
            instance.option("dataSource", self.dailySales);
        } else {
            $("#dailySalesChart").dxChart({
                theme: SalesDashboard.isPhone ? "CriteriaSalesMobileTheme" : "CriteriaSalesTabletTheme",
                dataSource: self.dailySales,
                equalBarWidth: false,
                onIncidentOccurred: null,
                commonAxisSettings: {
                    placeholderSize: 30,
                    label: {
                        indentFromAxis: 5
                    }
                },
                argumentAxis: {
                    placeholderSize: 25,
                    label: {
                        customizeText: function () { return self.parseCriteriaName(this.value); }
                    }
                },
                valueAxis: {
                    label: {
                        format: 'thousands'
                    }
                },
                commonSeriesSettings: {
                    argumentField: 'Criteria',
                    valueField: 'Sales',
                    type: 'bar'
                },
                seriesTemplate: {
                    nameField: 'Criteria',
                    customizeSeries: function(name) { return self.getSeriesStyle(name) }
                },
                legend: {
                    visible: false
                },
                tooltip: {
                    enabled: true,
                    paddingLeftRight: 10,
                    paddingTopBottom: 4,
                    font: {
                        opacity: 1,
                        size: 18
                    },
                    precision: 2,
                    format: 'millions',
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
                }
            });
        }
    }

    self.drawMonthlyChart = function() {
        var instance = $("#monthlySalesChart").data("dxChart");
        if(instance) {
            instance.render();
            instance.option("dataSource", self.monthlyUnits);
        } else {
            $("#monthlySalesChart").dxChart({
                theme: SalesDashboard.isPhone ? "CriteriaSalesMobileTheme" : "CriteriaSalesTabletTheme",
                palette: SalesDashboard.getCurrentPaletteName(),
                dataSource: self.monthlyUnits,
                equalBarWidth: false,
                onIncidentOccurred: null,
                commonAxisSettings: {
                    placeholderSize: 30,
                    label: {
                        indentFromAxis: 5,
                    }
                },
                argumentAxis: {
                    placeholderSize: 25,
                    label: {
                        customizeText: function () { return self.parseCriteriaName(this.value); }
                    }
                },
                commonSeriesSettings: {
                    argumentField: 'Criteria',
                    valueField: 'Units',
                    type: 'bar',
                    label: {
                        visible: true,
                    }
                },
                seriesTemplate: {
                    nameField: 'Criteria',
                    customizeSeries: function (name) { return self.getSeriesStyle(name) }
                },
                legend: {
                    visible: false
                },
                tooltip: {
                    enabled: false
                }
            });
        }
    }

    self.drawPieChart = function() {
        var instance = $("#pieChart").data("dxPieChart");
        if(instance) {
            instance.render();
            instance.option("dataSource", self.criteriaSalesByRange);
        } else {
            $("#pieChart").dxPieChart({
                palette: SalesDashboard.getCurrentPaletteName(),
                dataSource: self.criteriaSalesByRange,
                onIncidentOccurred: null,
                series: {
                    type: 'doughnut', innerRadius: 0.55, argumentField: 'Criteria', valueField: 'Sales',
                    label: {
                        radialOffset: -10,
                        visible: true,
                        format: 'percent',
                        connector: { visible: true },
                        backgroundColor: 'none',
                        customizeText: function () {
                            return this.percentText;
                        }
                    }
                },
                legend: {
                    margin: { top: 60, left: 2 },
                    paddingTopBottom: 10,
                    paddingLeftRight: 10,
                    columnCount: 1,
                    border: {
                        visible: true,
                        color: '#d2d2d2',
                        opacity: 1
                    },
                    font: {
                        color: '#373737',
                        size: 12,
                        opacity: 1
                    }
                }
            });
        }
    }

    self.drawBarGauge = function () {
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
                backgroundColor: '#f2f2f2',
                text: null,
                values: self.salesByRange()
            });
        }
    }

    self.redrawGraph = function (id) {
        (id == "#day") ? self.drawDailyChart() : self.drawMonthlyChart();
    }
}

SalesDashboard.currentModel = new SalesDashboard.criteriaSalesModel();
SalesDashboard.currentModel.init();
