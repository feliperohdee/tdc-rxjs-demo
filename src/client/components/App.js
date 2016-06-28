"use strict";
var __extends = (this && this.__extends) || function (d, b) {
    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
    function __() { this.constructor = d; }
    d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
};
var _ = require('lodash');
var React = require('react');
var models_1 = require('../models');
var _1 = require('./');
var App = (function (_super) {
    __extends(App, _super);
    function App() {
        _super.call(this);
        this.tickers = {
            nflx: null,
            msft: null,
            adbe: null
        };
        this.tickerModel = new models_1.Ticker();
        this.state = {
            tickers: this.tickers,
            activeTickers: {}
        };
    }
    App.prototype.toggle = function (code) {
        var ticker = _.get(this.tickers, code);
        if (_.isUndefined(ticker)) {
            return;
        }
        this.tickers[code] = this.tickers[code] ? null : this.tickerModel.get(code);
        this.setState({
            tickers: this.tickers,
            activeTickers: _.omitBy(this.tickers, _.isNull)
        });
    };
    App.prototype.render = function () {
        var _this = this;
        var buttons = _.map(this.state.tickers, function (ticker, code) {
            return React.createElement("button", {key: code, onClick: function () { return _this.toggle(code); }}, code.toUpperCase());
        });
        var charts = _.map(this.state.activeTickers, function (ticker, code) {
            return React.createElement(_1.Chart, {key: code, code: code, ticker: ticker});
        });
        return (React.createElement("section", null, buttons, charts));
    };
    return App;
}(React.Component));
exports.App = App;
//# sourceMappingURL=App.js.map