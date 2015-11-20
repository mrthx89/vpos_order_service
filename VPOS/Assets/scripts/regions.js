SalesDashboard.regionsModel = function () {
    var self = this,
        normalizeK = 1,
        maxBaseMarkerSize = 25,
        minMarkerSize = 3,
        maxMarkersCount = 11,
        correctionK = 1.5,
        yearSelector = "#year",
        criteriaDict = {
            'Africa': { color: SalesDashboard.getColor("", 0), letter: 'A' },
            'Asia': { color: SalesDashboard.getColor("", 1), letter: 'B' },
            'Australia': { color: SalesDashboard.getColor("", 2), letter: 'C' },
            'Europe': { color: SalesDashboard.getColor("", 3), letter: 'D' },
            'North America': { color: SalesDashboard.getColor("", 4), letter: 'E' },
            'South America': { color: SalesDashboard.getColor("", 5), letter: 'F' }
        };

    var gridCustomOptions = {
        allowColumnReordering: false,
        columns: [
            {
                dataField: "Country",
                dataType: "string"
            },
            {
                dataField: "City",
                dataType: "string"
            },
           {
               dataField: "Amount",
               dataType: "number",
               filterOperations: ['<', '>', '='],
               selectedFilterOperation: '>',
               filterValue: 2000000,
               sortOrder: 'desc',
               alignment: "right",
               format: "currency"
           },
           {
               dataField: "Dynamics",
               dataType: "object",
               allowFiltering: false,
               allowSorting: false,
               width: 270,
               cellTemplate: function(container, options) {
                   var data = options.data,
                   options = {
                       dataSource: data.Dynamics,
                       argumentField: "SaleDate",
                       valueField: "Sales",
                       type: "line",
                       lineColor: "#DB2E3E",
                       tooltip: {
                           enabled: false
                       },
                       showMinMax: false,
                       showFirstLast: false,
                       size: {
                           height: 20
                       }
                   };
                   container.dxSparkline(options);
               }
           }
        ],
        showRowLines: false
    };

    self.criteriaPerf = {};

    self.dailySales = [];
    self.monthlyUnits = [];
    self.dailySalesDateName = "";
    self.monthlyUnitsDateName = "";
    self.monthActive = !SalesDashboard.isPhone;


    self.getDailySales = function (day) {
        function setSales(data) {
            self.dailySales = data || [];
            self.dailySalesDateName = Globalize.format(day, 'MM/dd/yy');
            if (self.dailySales.length < 2) {
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
            if (self.monthlyUnits.length < 2) {
                SalesDashboard.disableCurrentMonth = true;
                SalesDashboard.getLastMonthSales();
                return;
            }
            $(".monthlyUnitsDateName").text(self.monthlyUnitsDateName);
            self.drawMonthlyChart();
        }
        if (self.monthActive) $('#monthlySalesChart').dxChart('showLoadingIndicator');
        SalesDashboard.loadData({ month: Globalize.format(month, 'yyyy-MM-dd') }, setUnits, true);
    };

    self.parseCriteriaName = function (criteria) {
        return criteriaDict[criteria].letter;
    };

    self.getSeriesStyle = function (criteria) {
        return SalesDashboard.isPhone ? { color: "#fff" } : { color: criteriaDict[criteria].color };
    };


    self.getMarkerSize = function (sales) {
        var markerSize = (maxBaseMarkerSize / 2) * (sales / normalizeK) * self.zoomFactor / correctionK;
        return markerSize > minMarkerSize ? markerSize : minMarkerSize;
    }

    self.getMarkerColor = function (sales) {
        return sales > normalizeK / 2 ? "#b381b6" : "#b2828b";
    }

    self.init = function() {
        var grid,
            range,
            category = "cities",
            getLoadOptions = function(startDate, endDate) {
                return {
                    dynamicsGroupBy: "day",
                    startDate: startDate,
                    endDate: endDate
                };
            };

        range = SalesDashboard.initRangeSelector();
        range.onSelectionChanged.add(function(e) {
            var startDate = Globalize.format(e.startValue, "yyyy-MM-dd"),
                endDate = Globalize.format(e.endValue, "yyyy-MM-dd");
            grid.load(getLoadOptions(startDate, endDate), category);
            $(yearSelector).text(e.endValue.getFullYear());
        });
        range.load(0);

        grid = SalesDashboard.initGrid(gridCustomOptions);
        grid.load(getLoadOptions(
            Globalize.format(SalesDashboard._currentDay, "yyyy-01-01"),
            Globalize.format(SalesDashboard._currentDay, "yyyy-12-31")), category);

        SalesDashboard.loadData({
            now: Globalize.format(getDate(), "yyyy-MM-dd HH:mm")
        }, function (criteriaPerf) {
            SalesDashboard.pushToMarkup({
                dTodaySales: { value: criteriaPerf.TodaySales, fixed: 2 },
                dYesterdaySales: { value: criteriaPerf.YesterdaySales, fixed: 2 },
                dLastWeekSales: { value: criteriaPerf.LastWeekSales, fixed: 2, "class": true },
                mThisMonthUnits: { value: criteriaPerf.ThisMonthUnits, prefix: "", postfix: "K Units", divider: 1000, "class": true },
                mLastMonthUnits: { value: criteriaPerf.LastMonthUnits, prefix: "", postfix: "K Units", divider: 1000 },
                mYtdUnits: { value: criteriaPerf.YtdUnits, prefix: "", postfix: "K", divider: 1000 }
            });
        }, true);

        self.drawDailyChart();
        SalesDashboard.getThisDaySales();

        self.drawMonthlyChart();
        SalesDashboard.getThisMonthSales();

        $(".criteria-name").text(SalesDashboard.showingCategory);
        $(".criteria-name-upper").text(SalesDashboard.showingCategory.toUpperCase());
    };

    self.drawDailyChart = function () {
        var instance = $("#dailySalesChart").data("dxChart");
        if(instance) {
            instance.render();
            instance.option("dataSource", self.dailySales);
        } else {
            $("#dailySalesChart").dxChart({
                onIncidentOccurred: null,
                theme: SalesDashboard.isPhone ? "CriteriaSalesMobileTheme" : "CriteriaSalesTabletTheme",
                dataSource: self.dailySales,
                equalBarWidth: false,
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
                    customizeSeries: function (name) { return self.getSeriesStyle(name) }
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

    self.drawMonthlyChart = function () {
        var instance = $("#monthlySalesChart").data("dxChart");
        if(instance) {
            instance.render();
            instance.option("dataSource", self.monthlyUnits);
        } else {
            $("#monthlySalesChart").dxChart({
                onIncidentOccurred: null,
                theme: SalesDashboard.isPhone ? "CriteriaSalesMobileTheme" : "CriteriaSalesTabletTheme",
                palette: SalesDashboard.getCurrentPaletteName(),
                dataSource: self.monthlyUnits,
                equalBarWidth: false,
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
                        visible: true
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

    self.redrawGraph = function (id) {
        (id == "#day") ? self.drawDailyChart() : self.drawMonthlyChart();
    }
}

SalesDashboard.currentModel = new SalesDashboard.regionsModel();
SalesDashboard.currentModel.init();
