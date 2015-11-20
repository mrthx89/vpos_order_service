function SalesDashboard() {
    var self = this,
        salesRangeSelector,
        tmpDate = getDate(),
        nextYearId = "#nextYear",
        prevYearId = "#prevYear",
        daySwitcher = "Day",
        monthSwitcher = "Month",
        colorDict = {
            "series.point.color": { phone: "#cf5777", tablet: undefined },
            "series.color": { phone: "#fff", tablet: undefined },
        },

        ajaxDate = (new Date()).getTime(),

        mobilePages = ["index", "products", "regions", "channels"];

    var getMobilePage = function (category) {
        var mobile = mobilePages[0];
        $.each(mobilePages, function (_, mobileCategory) {
            if (category == mobileCategory) {
                mobile = mobileCategory;
                return false;
            }
        });
        return mobile;
    }

    self.disableToday = false;
    self.disableCurrentMonth = false;

    self.tabletPalette = "salesDashboardPaletteTablet";
    self.mobilePalette = "salesDashboardPaletteMobile";

    self.baseApiUrl = "http://localhost:50053/api/";
    self.apiCategory = "";
    self.isPhone = undefined;
    self.showingCategory = "";
    self._currentDay = new Date(tmpDate.getFullYear(), tmpDate.getMonth(), tmpDate.getDate(), 0, 0, 0);
    self._currentMonth = new Date(tmpDate.getFullYear(), tmpDate.getMonth(), 1, 0, 0, 0);
    self.rangeYear = getDate().getFullYear();
    self.currentModel = null;

    self.pushToMarkup = function (values) {
        var convertVal = function (value, fixed, prefix, postfix, divider) {
            return prefix + ((value || 0) / divider).toFixed(fixed) + postfix;
        }

        $.each(values, function (id, item) {
            $((item["class"] ? "." : "#") + id)
                .text(item.text
                    ? item.value
                    : convertVal(
                        item.value,
                        item.fixed,
                        item.prefix !== undefined ? item.prefix : '$',
                        item.postfix !== undefined ? item.postfix : 'M',
                        item.divider !== undefined ? item.divider : 1000000)
                    );
        });
    };
    var xhr;
    self.loadPage = function (activeTab) {
        ajaxDate = (new Date()).getTime();
        var url = "";
        self.apiCategory = activeTab ? activeTab.toLowerCase() : "index";
        self.apiCategory = self.isPhone ? getMobilePage(self.apiCategory) : self.apiCategory;
        window.location.hash = self.apiCategory;
        switch (self.apiCategory) {
            case "index":
                url = "SalesDashboard";
                break;
            case "products":
                url = "CriteriaSales";
                break;
            case "sectors":
                url = "CriteriaSales";
                break;
            case "regions":
                url = "Regions";
                break;
            case "channels":
                url = "Channels";
                break;
            case "dayssales":
                url = "DaysSales";
                break;
            case "geography":
                url = "Geography";
                break;
            default:
                url = "SalesDashboard";
        }
        self.showingCategory = activeTab.charAt(0).toUpperCase() + activeTab.slice(1, -1);
        
        self.rangeYear = getDate().getFullYear();
        $('.navigation-item').removeClass('active');
        $('#' + self.apiCategory + '.navigation-item').addClass('active');
       
        if (xhr) {
            xhr.abort();
        }

        xhr = $.ajax({
            dataType: "html",
            url: ["views/", url, ".html"].join(""),
            success: function (data) {
                $("#dashboard-content").empty().html(data);
                self.initializeSwitchers();
            }
        });

        return true;
    };

    self.loadData = function (data, callback, isCategory, category) {
        
        $.ajax({
            url: self.baseApiUrl + (isCategory ? (category || self.apiCategory) : "sales"),
            dataType: "jsonp",
            data: data,
            ajaxDate: ajaxDate,
            success: function (data) {
                if (this.ajaxDate != ajaxDate) return;
                try{
                    callback(data);
                } catch(e){}
            }
        });
   
    };
    
    self.getLastDaySales = function () {
        var tmp = getDate();
        self._currentDay = new Date(tmp.getFullYear(), tmp.getMonth(), tmp.getDate() - 1, 0, 0, 0);
        self.updateSwitcher(daySwitcher);
    };

    self.getPrevDaySales = function () {
        var curDate = self._currentDay;
        self._currentDay = new Date(curDate.setDate(curDate.getDate() - 1));
        self.updateSwitcher(daySwitcher);
    };

    self.getNextDaySales = function () {
        var tmp = getDate(),
            curDate = self._currentDay;
        if (curDate.getFullYear() === tmp.getFullYear()
            && curDate.getMonth() === tmp.getMonth()
            && curDate.getDate() === tmp.getDate()) {
            return;
        }
        self._currentDay = new Date(curDate.setDate(curDate.getDate() + 1));
        self.updateSwitcher(daySwitcher);
    },

    self.getThisDaySales = function () {
        var tmp = getDate();
        self._currentDay = new Date(tmp.getFullYear(), tmp.getMonth(), tmp.getDate(), 0, 0, 0);
        self.updateSwitcher(daySwitcher);
    };

    self.getThisMonthSales = function () {
        var tmp = getDate();
        self._currentMonth = new Date(tmp.getFullYear(), tmp.getMonth(), 1, 0, 0, 0);
        self.updateSwitcher(monthSwitcher);
    };

    self.getLastMonthSales = function () {
        var tmp = getDate();
        self._currentMonth = new Date(tmp.getFullYear(), tmp.getMonth() - 1, 1, 0, 0, 0);
        self.updateSwitcher(monthSwitcher);
    };

    self.getPrevMonthSales = function () {
        var tmp = getDate(),
            curDate = self._currentMonth;
        tmp.setFullYear(tmp.getFullYear() - 2);
        if (curDate.getFullYear() === tmp.getFullYear()
            && curDate.getMonth() === 0) {
            return;
        }
        self._currentMonth = new Date(curDate.setMonth(curDate.getMonth() - 1));
        self.updateSwitcher(monthSwitcher);
    };

    self.getNextMonthSales = function () {
        var tmp = getDate(),
            curDate = self._currentMonth;
        if (curDate.getFullYear() === tmp.getFullYear()
            && curDate.getMonth() === tmp.getMonth()) {
            return;
        }
        self._currentMonth = new Date(curDate.setMonth(curDate.getMonth() + 1));
        self.updateSwitcher(monthSwitcher);
    };

    self.updateSwitcher = function (switcher) {
        var tmp = getDate(),
            isDay = (switcher == daySwitcher),
            current = isDay ? self._currentDay : self._currentMonth,
            todayDate = new Date(tmp.getFullYear(), tmp.getMonth(), isDay ? tmp.getDate() : 1),
            lastDate = new Date(tmp.getFullYear(), isDay ? tmp.getMonth() : tmp.getMonth() - 1, isDay ? tmp.getDate() - 1 : 1),
            valueDate = new Date(current.getFullYear(), current.getMonth(), isDay ? current.getDate() : 1),
            endDate = new Date(tmp.getFullYear() - 2, 0, 1);

        if(self.currentModel)
            isDay ? self.currentModel.getDailySales(current) : self.currentModel.getMonthlySales(current);

        $.each(switcherData, function (id, value) {
            if (id.indexOf(switcher) != -1) {
                $(id).removeClass("active").removeClass("disabled");
                if (valueDate.getTime() == todayDate.getTime()) {
                    if (value.role === "today") $(id).addClass("active");
                    if (value.role === "next") $(id).addClass("disabled");
                } else if (valueDate.getTime() == lastDate.getTime()) {
                    if (value.role === "last") $(id).addClass("active");
                    if (switcher == daySwitcher && self.disableToday && value.role === "next") $(id).addClass("disabled");
                    if (switcher == monthSwitcher && self.disableCurrentMonth && value.role === "next") $(id).addClass("disabled");
                } else if (valueDate.getTime() == endDate.getTime()) {
                    if (value.role === "prev") $(id).addClass("disabled");
                }
                if (switcher == daySwitcher && self.disableToday && value.role === "today") $(id).addClass("disabled");
                if (switcher == monthSwitcher && self.disableCurrentMonth && value.role === "today") $(id).addClass("disabled");
            }
        });
    }

    var switcherData = {
        "#getPrevDaySales": { click: self.getPrevDaySales, role: "prev" },
        "#getNextDaySales": { click: self.getNextDaySales, role: "next" },
        "#getLastDaySales": { click: self.getLastDaySales, role: "last" },
        "#getThisDaySales": { click: self.getThisDaySales, role: "today" },

        "#getPrevMonthSales": { click: self.getPrevMonthSales, role: "prev" },
        "#getNextMonthSales": { click: self.getNextMonthSales, role: "next" },
        "#getLastMonthSales": { click: self.getLastMonthSales, role: "last" },
        "#getThisMonthSales": { click: self.getThisMonthSales, role: "today" },

        "#prevYear": { click: function () { salesRangeSelector.load(-1); } },
        "#nextYear": { click: function () { salesRangeSelector.load(1); } }
    };
    self.initializeSwitchers = function () {
        $.each(switcherData, function (id, value) {
            $(id).click(function () {
                if (!$(this).hasClass("disabled"))
                    value.click();
            });
        });

        $(".phone-switcher div").click(self.changeGraphType);
    };

    self.initRangeSelector = function() {
        var rangeContainer = $("#range-selector");
        var callbacks = $.Callbacks();

        rangeContainer.dxRangeSelector({
            selectedRangeColor: "rgba(0,0,0,0)",
            onIncidentOccurred: null,
            indent: {
                right: 19,
                left: 19
            },
            behavior: {
                snapToTicks: false,
                animationEnabled: false
            },
            scale: {
                marker: { visible: false },
                showMinorTicks: false,
                majorTickInterval: 'month',
                valueType: 'datetime',
                label: {
                    font: {
                        color: '#373737',
                        opacity: 0.75
                    }
                }
            },
            size: {
                height: 90
            },
            sliderMarker: {
                color: '#b0324f',
                format: 'MM/dd'
            },
            chart: {
                series: [{ type: 'area', color: '#b0324f', opacity: 0.8, argumentField: 'SaleDate', valueField: 'Sales' }]
            },
            dataSource: [],
            selectedRange: null,
            onSelectedRangeChanged: function(e) {
                callbacks.fire(e);
            }
        });

        var instance = rangeContainer.data("dxRangeSelector");

        salesRangeSelector = {
            load: function(yearOffset) {
                var newYear = self.rangeYear + yearOffset,
                    newStart = new Date(newYear, 0, 1),
                    newEnd = new Date(newYear, 11, 31);

                if (newYear > getDate().getFullYear()) {
                    return;
                }

                self.loadData({
                    startDate: Globalize.format(newStart, 'yyyy-MM-dd'),
                    endDate: Globalize.format(newEnd, 'yyyy-MM-dd')
                }, function (data) {
                    if (data && data.length) {
                        self.rangeYear = newYear;
                        $("#rangeYearName").text("(" + self.rangeYear + ")");
                        $(nextYearId).removeClass("disabled");
                        $(prevYearId).removeClass("disabled");
                        if (newYear >= getDate().getFullYear()) {
                            $(nextYearId).addClass("disabled");
                        }
                        if (newYear <= getDate().getFullYear() - 2) {
                            $(prevYearId).addClass("disabled");
                        }
                
                        instance.option("dataSource", data);
                        instance.option("selectedRange", {
                            startValue: new Date(data[0].SaleDate),
                            endValue: new Date(data[data.length - 1].SaleDate)
                        });
                    }
                });
            },

            onSelectionChanged: callbacks
        }
        return salesRangeSelector;
    }

    self.initGrid = function(gridCustomOptions) {

        var options = {
            filterRow: {
                visible: true
            },
            scrolling: { mode: 'virtual' },
            sorting : { mode: 'single' },
            allowColumnReordering: false
        };

        $.extend(options, gridCustomOptions);

        var gridContainer = $("#grid");
        gridContainer.dxDataGrid(options);
        var grid = gridContainer.data("dxDataGrid");

        return {
            instance: grid,
            load: function(loadOptions, category) {
                grid.beginCustomLoading();
                SalesDashboard.loadData(loadOptions, function (data) {
                    grid.option("dataSource", data);
                    grid.endCustomLoading();
                }, true, category);
            }
        };
    }

    self.changeGraphType = function (element) {
        if ($(this).hasClass("selected")) return;
        $(this).siblings().removeClass("selected");
        $(this).addClass("selected");
        $($(this).siblings().attr("data-show")).addClass("phone-hide");
        $($(this).attr("data-show")).removeClass("phone-hide");
        self.currentModel.redrawGraph($(this).attr("data-show"));
    }

    self.getColor = function (objectName, paletteIndex) {
        var color = null;
        if (colorDict[objectName])
            color = self.isPhone ? colorDict[objectName].phone : colorDict[objectName].tablet;
        return color ? color : self._getPalette()[parseInt(paletteIndex) || 0];
    }
    
    self.getCurrentPaletteName = function(){
            return self.isPhone ? self.mobilePalette : self.tabletPalette;
    }

    self._getPalette = function () {
        return self.isPhone ?
            DevExpress.viz.core.getPalette(self.mobilePalette) :
            DevExpress.viz.core.getPalette(self.tabletPalette);
        
    }

    self.setScreenSize = function () {
        var old = self.isPhone,
            el = $("<div>").addClass("screen-size").appendTo("body");

        setTimeout(function() { 
            var size = typeof getComputedStyle !== "undefined" ? getComputedStyle(el[0], ":after").content.replace(/['"]/g, "") : "";
            el.remove();
            self.isPhone = (size === "small");
            if (typeof old != "undefined" && old != self.isPhone)
                self.loadPage(self.apiCategory);
        }, 0);
    };

}

$(function () {
    window.SalesDashboard = new SalesDashboard();
    $("a").each(function () {
        if (!this.onclick && this.getAttribute("target") != "_blank") {
            this.onclick = function () {
                return SalesDashboard.loadPage(this.hash.substring(1));
            };
        }
    });
    $(window).bind("resize", SalesDashboard.setScreenSize);
    SalesDashboard.setScreenSize();
    $("#currentDate").text((Globalize.format(getDate(), "MMM d, yyyy")).toUpperCase());
    SalesDashboard.loadPage(window.location.hash.substring(1) || "Index");
});