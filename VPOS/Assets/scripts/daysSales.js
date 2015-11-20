SalesDashboard.daysSalesModel = function () {
    var self = this;

    var gridCustomOptions = {
        allowColumnReordering: true,
        groupPanel: { visible: true },
        columns: [
           {
               dataField: "Product",
               dataType: "string",
               groupIndex: 0
           },
           {
               dataField: "Region",
               dataType: "string",
               selectedFilterOperation: 'startswith'
           },
           {
               dataField: "Sector",
               dataType: "string",
               selectedFilterOperation: 'startswith'
           },
           {
               dataField: "Channel",
               dataType: "string",
               width: 90,
               selectedFilterOperation: 'startswith'
           },
           {
               dataField: "Dynamics",
               dataType: "object",
               width: 175,
               allowFiltering: false,
               allowSorting: false,
               allowGrouping: false,
               cellTemplate: function (container, options) {
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
                               width: 160,
                               height: 20
                           }
                       };
                   container.dxSparkline(options);
               }
           },
           {
               dataField: "Units",
               width: 70,
               filterOperations: ['<', '>', '='],
               selectedFilterOperation: '>',
               alignment: "right",
               dataType: "number"
           },
           {
               dataField: "Amount",
               width: 90,
               dataType: "number",
               filterOperations: ['<', '>', '='],
               selectedFilterOperation: '>',
               filterValue: 10000,
               sortOrder: "desc",
               alignment: "right",
               format: "currency"
           }],
        showRowLines: false,
        onEditorPrepared: function (editor) {
            if (editor.dataField == "Units" || editor.dataField == "Amount") {
                $(editor.editorElement).dxNumberBox("instance").option("showSpinButtons", false);
            }
        }
    }

    self.init = function() {
        var grid,
            range,
            category = "daysSales";

        range = SalesDashboard.initRangeSelector();
        range.onSelectionChanged.add(function(e) {
            grid.load({
                startDate: Globalize.format(e.startValue, "yyyy-MM-dd"),
                endDate: Globalize.format(e.endValue, "yyyy-MM-dd")
            }, category);
        });
        range.load(0);

        grid = SalesDashboard.initGrid(gridCustomOptions);
    }
}

SalesDashboard.currentModel = new SalesDashboard.daysSalesModel();
SalesDashboard.currentModel.init();
