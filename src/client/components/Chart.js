"use strict";
var __extends = (this && this.__extends) || function (d, b) {
    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
    function __() { this.constructor = d; }
    d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
};
var _ = require('lodash');
var React = require('react');
var react_chartjs_1 = require('react-chartjs');
var Chart = (function (_super) {
    __extends(Chart, _super);
    function Chart(props) {
        _super.call(this, props);
        this.defaultData = {
            labels: [0, 5, 10, 15, 20, 25, 30],
            datasets: [{
                    fillColor: 'rgba(151,187,205,0.2)',
                    strokeColor: 'rgba(151,187,205,1)',
                    pointColor: 'rgba(151,187,205,1)',
                    pointStrokeColor: '#fff',
                    pointHighlightFill: '#fff',
                    pointHighlightStroke: 'rgba(151,187,205,1)',
                    data: _.range(0, 7, 0)
                }]
        };
        this.options = {
            title: {
                display: true,
                text: props.code
            }
        };
        this.state = {
            data: this.defaultData
        };
    }
    Chart.prototype.updateData = function (data) {
        this.state.data.datasets[0].data = data;
        return this.state.data;
    };
    Chart.prototype.componentWillMount = function () {
        var _this = this;
        this.subscription = this.props.ticker
            .map(function (tick) { return tick.p; })
            .scan(function (reduction, value) {
            return _(reduction)
                .push(value)
                .takeRight(7)
                .value();
        }, _.range(0, 7, 0))
            .map(function (data) { return _this.updateData(data); })
            .subscribe(function (data) { return _this.setState({ data: data }); });
    };
    Chart.prototype.componentWillUnmount = function () {
        this.subscription.unsubscribe();
    };
    Chart.prototype.render = function () {
        console.log(this.options);
        return (React.createElement("section", null, React.createElement(react_chartjs_1.Line, {data: this.state.data, options: this.options, width: "600", height: "250"})));
    };
    return Chart;
}(React.Component));
exports.Chart = Chart;
//# sourceMappingURL=Chart.js.map